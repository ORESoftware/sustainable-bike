// Geometric primitives shared by the bicycle model.

function vec_sub(a, b) = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
function vec_add(a, b) = [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
function vec_scale(a, s) = [a[0] * s, a[1] * s, a[2] * s];
function lerp3(a, b, t) = vec_add(a, vec_scale(vec_sub(b, a), t));

module capsule_between(p1, p2, r1, r2 = -1) {
  rr2 = r2 < 0 ? r1 : r2;
  hull() {
    translate(p1) sphere(r = r1);
    translate(p2) sphere(r = rr2);
  }
}

module shell_capsule_between(p1, p2, outer_r, wall, end_clearance = 0.5) {
  inner_r = max(outer_r - wall, 0.5);
  direction = vec_sub(p2, p1);
  length = norm(direction);
  unit = length > 0 ? vec_scale(direction, 1 / length) : [0, 0, 1];
  difference() {
    capsule_between(p1, p2, outer_r);
    capsule_between(
      vec_sub(p1, vec_scale(unit, end_clearance)),
      vec_add(p2, vec_scale(unit, end_clearance)),
      inner_r
    );
  }
}

module axis_y_cylinder(h, r, center = true) {
  rotate([90, 0, 0]) cylinder(h = h, r = r, center = center);
}

module axis_x_cylinder(h, r, center = true) {
  rotate([0, 90, 0]) cylinder(h = h, r = r, center = center);
}

module torus(major_r, minor_r) {
  rotate_extrude(convexity = 10)
    translate([major_r, 0, 0])
      circle(r = minor_r);
}

module rounded_box(size = [10, 10, 10], radius = 2, center = true) {
  core = [
    max(size[0] - 2 * radius, 0.1),
    max(size[1] - 2 * radius, 0.1),
    max(size[2] - 2 * radius, 0.1)
  ];
  minkowski() {
    cube(core, center = center);
    sphere(r = radius);
  }
}

module label_plate(text_value, width = 120, height = 24, depth = 3) {
  difference() {
    rounded_box([width, depth, height], radius = 3, center = true);
    translate([0, -depth / 2 - 0.2, 0])
      rotate([90, 0, 0])
        linear_extrude(height = 1.2)
          text(text_value, size = 8, halign = "center", valign = "center");
  }
}
