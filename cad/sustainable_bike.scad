include <generated/config.scad>
include <lib/primitives.scad>
include <lib/wheel.scad>
include <lib/drivetrain.scad>
include <lib/frame.scad>
include <lib/components.scad>

// Defaults remain directly overrideable with OpenSCAD -D assignments.
// Avoid aliasing command-line variables: OpenSCAD 2021 evaluates those aliases
// before -D values are visible, which can silently route every build to assembly.
PART = DEFAULT_PART;
RENDER_SCALE = CONFIG_MODEL_SCALE;
FACET_COUNT = CONFIG_FACET_COUNT;
SHOW_LABELS = true;
$fn = FACET_COUNT;

wheel_radius = WHEEL_OUTSIDE_DIAMETER / 2;
rear_center = [REAR_CENTER_X, 0, wheel_radius];
front_center = [REAR_CENTER_X + WHEELBASE, 0, wheel_radius];
bb = [REAR_CENTER_X + CHAINSTAY, 0, BB_HEIGHT];
seat_top = [SEAT_TOP_X, 0, SEAT_TOP_Z];
head_bottom = [HEAD_BOTTOM_X, 0, HEAD_BOTTOM_Z];
head_top = [HEAD_TOP_X, 0, HEAD_TOP_Z];
drive_y = SINGLE_SIDE_OFFSET + BELT_WIDTH / 2 + 4;
rear_point_xz = [rear_center[0], rear_center[2]];
front_point_xz = [bb[0], bb[2]];
rear_pitch_radius = pitch_radius(REAR_TEETH, BELT_PITCH);
front_pitch_radius = pitch_radius(FRONT_TEETH, BELT_PITCH);

assert(CONFIG_STATUS == "research-scale-model-only",
  "This model must not be treated as a ride-ready certified bicycle.");
assert(FRONT_TEETH > REAR_TEETH, "front sprocket must be larger than rear sprocket");
assert(len(INTERNAL_GEAR_RATIOS) >= 2, "automatic internal hub requires at least two ratios");
assert(ASSIST_CUTOFF_MPH <= 30, "assist cutoff exceeds the research envelope");

module rear_wheel_assembly() {
  translate(rear_center)
    integrated_wheel(
      WHEEL_OUTSIDE_DIAMETER,
      TIRE_WIDTH,
      RIM_SECTION_RADIUS,
      REAR_HUB_RADIUS,
      HUB_WIDTH,
      SPOKE_COUNT,
      SPOKE_WIDTH,
      TIRE_MODE,
      true
    );
  translate([rear_center[0], SINGLE_SIDE_OFFSET - 18, rear_center[2]])
    color([0.54, 0.56, 0.58]) brake_rotor(REAR_ROTOR_DIAMETER);
}

module front_wheel_assembly() {
  translate(front_center)
    integrated_wheel(
      WHEEL_OUTSIDE_DIAMETER,
      TIRE_WIDTH,
      RIM_SECTION_RADIUS,
      FRONT_HUB_RADIUS,
      HUB_WIDTH,
      SPOKE_COUNT,
      SPOKE_WIDTH,
      TIRE_MODE,
      false
    );
  translate([front_center[0], SINGLE_SIDE_OFFSET - 18, front_center[2]])
    color([0.54, 0.56, 0.58]) brake_rotor(FRONT_ROTOR_DIAMETER);
}

module frame_assembly() {
  frame_shell(
    rear_center,
    bb,
    seat_top,
    head_bottom,
    head_top,
    SINGLE_SIDE_OFFSET,
    FRAME_OUTER_RADIUS,
    FRAME_WALL,
    REAR_HUB_RADIUS
  );
  battery_cartridge(bb, head_bottom);
}

module fork_assembly() {
  front_monoblade(
    front_center,
    head_bottom,
    head_top,
    SINGLE_SIDE_OFFSET,
    FRAME_OUTER_RADIUS,
    FRAME_WALL,
    FRONT_HUB_RADIUS
  );
}

module drivetrain_assembly(show_guard = true) {
  translate([0, drive_y, 0])
    belt_drive(
      rear_point_xz,
      front_point_xz,
      REAR_TEETH,
      FRONT_TEETH,
      BELT_PITCH,
      BELT_WIDTH
    );
  if (show_guard) {
    translate([0, drive_y + 9, 0])
      belt_guard(rear_point_xz, front_point_xz, rear_pitch_radius, front_pitch_radius, 3.2);
  }
  crankset(bb, SINGLE_SIDE_OFFSET, front_pitch_radius);
}

module complete_assembly() {
  frame_assembly();
  fork_assembly();
  rear_wheel_assembly();
  front_wheel_assembly();
  drivetrain_assembly(true);
  seat_and_post(seat_top);
  handlebar_and_stem(head_top);
  side_stand_mount(bb);

  if (SHOW_LABELS) {
    translate([WHEELBASE * 0.50, -78, wheel_radius + 8])
      rotate([90, 0, 0])
        label_plate("CAPTIVE / BELT / AUTO-HUB", 245, 28, 3);
  }
}

module frame_coupon() {
  difference() {
    shell_capsule_between([0, 0, 0], [180, 0, 0], 28, 6);
    for (x = [35, 90, 145]) translate([x, 0, 0]) axis_y_cylinder(80, 3.2);
  }
}

module tire_coupon() {
  difference() {
    cube([120, 42, 24], center = true);
    for (x = [-45 : 15 : 45])
      translate([x, 0, 0]) rotate([0, 18, 0]) cube([7, 60, 34], center = true);
  }
}

scale([RENDER_SCALE, RENDER_SCALE, RENDER_SCALE]) {
  if (PART == "assembly") complete_assembly();
  else if (PART == "frame") frame_assembly();
  else if (PART == "front_fork") fork_assembly();
  else if (PART == "front_wheel") front_wheel_assembly();
  else if (PART == "rear_wheel") rear_wheel_assembly();
  else if (PART == "drivetrain") drivetrain_assembly(false);
  else if (PART == "rear_hub_cutaway")
    translate(rear_center) rear_hub_motor_cutaway(REAR_HUB_RADIUS, HUB_WIDTH);
  else if (PART == "frame_coupon") frame_coupon();
  else if (PART == "tire_coupon") tire_coupon();
  else assert(false, str("unknown PART: ", PART));
}
