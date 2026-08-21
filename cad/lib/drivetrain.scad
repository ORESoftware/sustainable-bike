include <primitives.scad>

function pitch_radius(teeth, pitch) = teeth * pitch / (2 * PI);

module sprocket(teeth, pitch, width, side_guide = true) {
  r = pitch_radius(teeth, pitch);
  tooth_depth = min(4.2, pitch * 0.34);
  axis_y_cylinder(width, r - tooth_depth * 0.45);
  for (angle = [0 : 360 / teeth : 359]) {
    rotate([0, angle, 0])
      translate([r, 0, 0])
        cube([tooth_depth * 1.15, width, pitch * 0.42], center = true);
  }
  if (side_guide) {
    for (side = [-1, 1]) {
      translate([0, side * (width / 2 + 0.8), 0])
        difference() {
          axis_y_cylinder(1.2, r + 3);
          axis_y_cylinder(2.0, r - 5);
        }
    }
  }
}

module belt_loop_2d(rear_point, front_point, rear_radius, front_radius, belt_thickness) {
  difference() {
    hull() {
      translate(rear_point) circle(r = rear_radius + belt_thickness / 2);
      translate(front_point) circle(r = front_radius + belt_thickness / 2);
    }
    hull() {
      translate(rear_point) circle(r = max(rear_radius - belt_thickness / 2, 0.1));
      translate(front_point) circle(r = max(front_radius - belt_thickness / 2, 0.1));
    }
  }
}

module belt_drive(rear_point_xz, front_point_xz, rear_teeth, front_teeth, pitch, width) {
  rear_r = pitch_radius(rear_teeth, pitch);
  front_r = pitch_radius(front_teeth, pitch);
  belt_thickness = 4.2;

  color([0.12, 0.12, 0.13])
    rotate([90, 0, 0])
      linear_extrude(height = width, center = true, convexity = 10)
        belt_loop_2d(rear_point_xz, front_point_xz, rear_r, front_r, belt_thickness);

  color([0.22, 0.24, 0.25]) {
    translate([rear_point_xz[0], 0, rear_point_xz[1]])
      sprocket(rear_teeth, pitch, width + 1);
    translate([front_point_xz[0], 0, front_point_xz[1]])
      sprocket(front_teeth, pitch, width + 1);
  }
}

module planetary_gear_symbolic(radius, width, planet_count = 3) {
  color([0.70, 0.58, 0.22]) axis_y_cylinder(width, radius * 0.22);
  color([0.55, 0.58, 0.60])
    for (angle = [0 : 360 / planet_count : 359]) {
      rotate([0, angle, 0])
        translate([radius * 0.48, 0, 0])
          axis_y_cylinder(width * 0.75, radius * 0.18);
    }
  color([0.31, 0.34, 0.36])
    difference() {
      axis_y_cylinder(width, radius);
      axis_y_cylinder(width + 2, radius * 0.78);
    }
}

module rear_hub_motor_cutaway(radius, width) {
  color([0.15, 0.18, 0.21, 0.60])
    difference() {
      axis_y_cylinder(width, radius);
      translate([0, -width * 0.20, 0]) cube([radius * 2.3, width, radius * 2.3], center = true);
    }

  color([0.72, 0.32, 0.12])
    for (angle = [0 : 30 : 359]) {
      rotate([0, angle, 0])
        translate([radius * 0.72, 0, 0])
          axis_y_cylinder(width * 0.62, 3.2);
    }

  planetary_gear_symbolic(radius * 0.58, width * 0.40, 3);
  color([0.48, 0.51, 0.53]) axis_y_cylinder(width + 18, 10);
}

module belt_guard(rear_point_xz, front_point_xz, rear_radius, front_radius, width = 18) {
  color([0.22, 0.25, 0.26, 0.75])
    translate([0, 0, 0])
      rotate([90, 0, 0])
        linear_extrude(height = width, center = true)
          difference() {
            hull() {
              translate(rear_point_xz) circle(r = rear_radius + 12);
              translate(front_point_xz) circle(r = front_radius + 12);
            }
            hull() {
              translate(rear_point_xz) circle(r = rear_radius + 6);
              translate(front_point_xz) circle(r = front_radius + 6);
            }
          }
}
