export default class Vector3 {
  constructor(x, y, z, optionals) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.length = Math.sqrt(x * x + y * y);
    this.length2 = x * x + y + y;
    this.oldX = optionals.oldX || 0;
    this.oldY = optionals.oldY || 0;
    this.oldZ = optionals.oldZ || 0;
    this.pinned = optionals.pinned || false;
  }

  static add(a, b) {
    return new Vector2(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  static subtract(a, b) {
    return new Vector2(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  static multiply(a, b) {
    return new Vector2(a.x * b.x, a.y * b.y, a.z * b.z);
  }

  static divide(a, b) {
    return new Vector2(a.x / b.x, a.y / b.y, a.z / b.z);
  }

  static equals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  }

  static scale(coefficient) {
    return new Vector3(
      this.x * coefficient,
      this.y * coefficient,
      this.z * coefficient
    );
  }

  static distance(a, b) {
    return Math.sqrt(this.distance2(a, b));
  }

  static distance2(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;

    return x * x + y * y;
  }

  Add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  Subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  Multiply(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;
  }

  Divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;
  }

  Scale(coefficient) {
    this.x *= coefficient;
    this.y *= coefficient;
    this.z *= coefficient;

    return this;
  }

  Distance(v) {
    return Math.sqrt(this.Distance2(v));
  }

  Distance2(v) {
    const x = v.x - this.x;
    const y = v.y - this.y;
    const z = v.z - this.z;

    return x * x + y * y;
  }

  Normal() {
    return new Vector2(this.x / this.length, this.y / this.length);
  }

  DotProduct(v) {
    return this.x * v.x + this.y * v.y;
  }

  Angle(v) {
    return Math.atan2(this.x * v.y - this.y * v.x, this.x * v.x + this.y * v.y);
  }

  Angle2(left, right) {
    return left.subtract(this).angle(right.subtract(this));
  }

  String() {
    return "C" + this.x + " , " + this.y + ")";
  }
}
