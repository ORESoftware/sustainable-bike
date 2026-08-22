include <primitives.scad>

module wheel_local_spoke(angle_deg, inner_r, outer_r, width, depth) {
  rotate([0, 0, angle_deg])
    hull() {
      translate([inner_r, 0, 0]) cylinder(h = depth, r = width / 2, center = true);
      translate([outer_r, 0, 0]) cylinder(h = depth, r = width / 2, center = true);
    }
}

module tire_local(outside_radius, tire_width, mode = "solid", slot_count = 32) {
  major_r = outside_radius - tire_width / 2;
  if (mode == "airless_lattice") {
    difference() {
      torus(major_r, tire_width / 2);
      for (angle = [0 : 360 / slot_count : 359]) {
        rotate([0, 0, angle])
          translate([major_r, 0, 0])
            rotate([0, 0, 25])
              cube([tire_width * 0.85, tire_width * 0.28, tire_width * 2.4], center = true);
      }
    }
  } else {
    torus(major_r, tire_width / 2);
  }
}

module integrated_wheel(
  outside_diameter,
  tire_width,
  rim_section_radius,
  hub_radius,
  hub_width,
  spoke_count,
  spoke_width,
  tire_mode = "solid",
  motor_hub = false
) {
  outside_radius = outside_diameter / 2;
  rim_major_r = outside_radius - tire_width - rim_section_radius * 0.35;
  spoke_outer_r = rim_major_r - rim_section_radius * 0.6;
  spoke_inner_r = hub_radius * 0.85;
  structural_depth = max(18, tire_width * 0.48);

  rotate([90, 0, 0]) {
    color([0.10, 0.10, 0.11]) tire_local(outside_radius, tire_width, tire_mode);
    color([0.38, 0.43, 0.45]) torus(rim_major_r, rim_section_radius);

    color([0.45, 0.50, 0.52])
      for (angle = [0 : 360 / spoke_count : 359]) {
        wheel_local_spoke(angle, spoke_inner_r, spoke_outer_r, spoke_width, structural_depth);
      }

    color(motor_hub ? [0.16, 0.19, 0.22] : [0.34, 0.37, 0.39])
      cylinder(h = hub_width, r = hub_radius, center = true);

    if (motor_hub) {
      color([0.06, 0.07, 0.08])
        difference() {
          cylinder(h = hub_width + 3, r = hub_radius * 0.78, center = true);
          cylinder(h = hub_width + 5, r = hub_radius * 0.60, center = true);
        }
    }
  }
}

module brake_rotor(diameter, thickness = 2.0) {
  difference() {
    axis_y_cylinder(thickness, diameter / 2);
    axis_y_cylinder(thickness + 2, diameter / 2 - 11);
    for (angle = [0 : 30 : 359]) {
      rotate([0, angle, 0])
        translate([diameter * 0.38, 0, 0])
          axis_y_cylinder(thickness + 3, 3.5);
    }
  }
}
