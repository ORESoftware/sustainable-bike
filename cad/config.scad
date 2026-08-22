// Sustainable Bike v0.1 — shared parametric configuration
// Units: millimetres unless noted.

$fn = 72;

// Research-scale preview. Set MODEL_SCALE=1 only after engineering review.
MODEL_SCALE = 0.16;

// Bicycle geometry
WHEEL_DIAMETER = 660;
TIRE_SECTION = 50;
WHEELBASE = 1080;
CHAINSTAY = 445;
BOTTOM_BRACKET_DROP = 65;
SEAT_TUBE_LENGTH = 500;
SEAT_TUBE_ANGLE = 73;
HEAD_TUBE_ANGLE = 70;
HEAD_TUBE_LENGTH = 160;
FRAME_TUBE_OD = 42;
FRAME_TUBE_WALL = 5;

// Captive single-sided wheel architecture
FRONT_AXLE_DIAMETER = 24;
REAR_AXLE_DIAMETER = 32;
CAPTIVE_SHOULDER_DIAMETER = 46;
MONOBLADE_WIDTH = 58;
MONOBLADE_THICKNESS = 28;
TAMPER_COVER_DIAMETER = 62;

// Tire options: "solid" or "airless"
TIRE_MODE = "solid";
SOLID_TIRE_RADIAL_THICKNESS = 24;
AIRLESS_CELL = 16;

// Dry aramid/Kevlar-class synchronous belt drivetrain
FRONT_RING_TEETH = 60;
REAR_SPROCKET_TEETH = 22;
BELT_PITCH = 11;
BELT_WIDTH = 12;
BELT_TOOTH_HEIGHT = 3;
BELT_CENTER_DISTANCE = 438;

// Automatic internal rear hub ratios; no external shifter/derailleur
INTERNAL_RATIOS = [1.00, 1.36];
SHIFT_UP_RPM = 78;
SHIFT_DOWN_RPM = 58;

// Rear hub motor reference envelope
MOTOR_RATED_WATTS = 250;
MOTOR_PEAK_WATTS = 500;
SYSTEM_VOLTAGE = 48;
TARGET_ASSIST_MPH = 25;
HUB_DIAMETER = 168;
HUB_WIDTH = 92;

// Structural visualization only; not a certified production specification
BATTERY_LENGTH = 360;
BATTERY_WIDTH = 78;
BATTERY_HEIGHT = 92;
