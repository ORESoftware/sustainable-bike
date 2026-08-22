include <primitives.scad>

module seat_and_post(seat_top) {
  color([0.25, 0.27, 0.28])
    translate([seat_top[0] - 6, 0, seat_top[2] + 82])
      capsule_between([0, 0, -75], [0, 0, 0], 9, 11);
  color([0.08, 0.09, 0.10])
    translate([seat_top[0] - 20, 0, seat_top[2] + 100])
      rounded_box([150, 48, 24], radius = 8, center = true);
}

module handlebar_and_stem(head_top) {
  stem_end = [head_top[0] + 35, 0, head_top[2] + 85];
  color([0.30, 0.32, 0.33]) {
    capsule_between(head_top, stem_end, 10);
    translate(stem_end) axis_y_cylinder(520, 11);
  }
  color([0.08, 0.09, 0.10]) {
    translate([stem_end[0], -250, stem_end[2]]) axis_y_cylinder(95, 15);
    translate([stem_end[0], 250, stem_end[2]]) axis_y_cylinder(95, 15);
  }
}

module crankset(bb, side_offset, front_pitch_radius) {
  color([0.42, 0.44, 0.45])
    translate(bb)
      axis_y_cylinder(side_offset * 2 + 42, 14);

  for (side = [-1, 1]) {
    crank_angle = side > 0 ? 18 : 198;
    crank_start = [bb[0], side * (side_offset + 16), bb[2]];
    crank_end = [
      bb[0] + 165 * cos(crank_angle),
      side * (side_offset + 16),
      bb[2] + 165 * sin(crank_angle)
    ];

    color([0.30, 0.32, 0.33])
      capsule_between(crank_start, crank_end, 8, 10);
    color([0.12, 0.13, 0.14])
      translate(crank_end)
        rounded_box([80, 26, 13], radius = 4, center = true);
  }
}

module battery_cartridge(bb, head_bottom) {
  p1 = lerp3(bb, head_bottom, 0.25);
  p2 = lerp3(bb, head_bottom, 0.72);
  color([0.08, 0.24, 0.20, 0.85])
    capsule_between([p1[0], 0, p1[2] + 10], [p2[0], 0, p2[2] + 10], 23, 25);
}

module side_stand_mount(bb) {
  color([0.28, 0.30, 0.31])
    capsule_between([bb[0] - 40, -28, bb[2] - 12], [bb[0] - 125, -90, 40], 8, 12);
}
