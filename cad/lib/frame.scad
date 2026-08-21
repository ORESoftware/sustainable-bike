include <primitives.scad>

module capture_collar(center, side_offset, hub_radius, axle_radius = 11, collar_width = 28) {
  support = [center[0], side_offset, center[2]];
  color([0.34, 0.37, 0.39])
    translate(support)
      difference() {
        axis_y_cylinder(collar_width, hub_radius * 0.48);
        axis_y_cylinder(collar_width + 2, axle_radius + 1.0);
      }

  // The axle is a qualified metal/composite insert, never a basic FDM print.
  color([0.62, 0.64, 0.66])
    translate([center[0], side_offset / 2, center[2]])
      axis_y_cylinder(abs(side_offset) + 28, axle_radius);

  // Locked cover hides the retention fastener from ordinary access.
  color([0.15, 0.17, 0.18])
    translate([center[0], side_offset + 17, center[2]])
      axis_y_cylinder(8, hub_radius * 0.36);
}

module frame_shell(
  rear_center,
  bb,
  seat_top,
  head_bottom,
  head_top,
  side_offset,
  outer_radius,
  wall,
  rear_hub_radius
) {
  rear_support = [rear_center[0] + 18, side_offset, rear_center[2]];
  rear_upper_start = lerp3(bb, seat_top, 0.56);
  head_mid = lerp3(head_bottom, head_top, 0.52);

  color([0.20, 0.49, 0.43])
    union() {
      shell_capsule_between(bb, seat_top, outer_radius, wall);
      shell_capsule_between(bb, head_bottom, outer_radius * 1.10, wall);
      shell_capsule_between(seat_top, head_top, outer_radius * 0.92, wall);
      shell_capsule_between(head_bottom, head_top, outer_radius * 0.86, wall);

      // Captive rear monoblade: two frame legs merge into one outboard hub support.
      shell_capsule_between(bb, rear_support, outer_radius * 0.76, wall * 0.82);
      shell_capsule_between(rear_upper_start, rear_support, outer_radius * 0.70, wall * 0.80);
      capsule_between(head_mid, [head_mid[0], 0, head_mid[2]], outer_radius * 0.65);
    }

  capture_collar(rear_center, side_offset, rear_hub_radius);
}

module front_monoblade(
  front_center,
  head_bottom,
  head_top,
  side_offset,
  outer_radius,
  wall,
  front_hub_radius
) {
  crown = [head_bottom[0] + 12, side_offset * 0.42, head_bottom[2] - 5];
  bend = [front_center[0] - 105, side_offset, front_center[2] + 155];
  axle_support = [front_center[0], side_offset, front_center[2]];

  color([0.17, 0.42, 0.38])
    union() {
      shell_capsule_between(head_bottom, head_top, outer_radius * 0.70, wall * 0.78);
      capsule_between(head_bottom, crown, outer_radius * 0.80);
      shell_capsule_between(crown, bend, outer_radius * 0.78, wall * 0.80);
      shell_capsule_between(bend, axle_support, outer_radius * 0.72, wall * 0.78);
    }

  capture_collar(front_center, side_offset, front_hub_radius);
}
