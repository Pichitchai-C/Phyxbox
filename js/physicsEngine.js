export const G = 10, S_MIN = 0.5, S_MAX = 7.5, S_START = 3; // g (m/s²) และขอบเขตการเลื่อนบนพื้นเอียง (m)

// ฟิสิกส์ของกล่องบนพื้นเอียง: คิดเฉพาะแกนที่ขนานกับพื้นเอียง (+ = ขึ้นเนิน)
export class Physics {
  constructor() { this.p = { m: 2, theta: 0, F: 6, mu: 0 }; this.reset(); }

  reset() { this.s = S_START; this.v = 0; this.t = 0; this.hist = []; }

  // ความเร่ง a และแรงเสียดทาน f ณ สถานะปัจจุบัน
  accel() {
    const { m, theta, F, mu } = this.p;
    const push = F - m * G * Math.sin(theta);   // แรงลัพธ์ก่อนหักแรงเสียดทาน
    const fmax = mu * m * G * Math.cos(theta);  // แรงเสียดทานสูงสุด μN
    if (this.v === 0 && Math.abs(push) <= fmax) return { a: 0, f: -push }; // นิ่ง: เสียดทานสถิตหักล้างพอดี
    const dir = this.v !== 0 ? Math.sign(this.v) : Math.sign(push);        // เสียดทานจลน์ต้านทิศการเคลื่อนที่
    const f = -dir * fmax;
    return { a: (push + f) / m, f };
  }

  step(dt) {
    const n = 5, h = dt / n;
    for (let i = 0; i < n; i++) {
      let v = this.v + this.accel().a * h;
      if (this.v !== 0 && v * this.v <= 0) v = 0; // เสียดทานทำให้หยุดนิ่ง
      this.v = v;
      this.s += v * h;
      if (this.s < S_MIN || this.s > S_MAX) {      // ชนปลายพื้นเอียง
        this.s = Math.min(S_MAX, Math.max(S_MIN, this.s));
        this.v = 0;
      }
    }
    this.t += dt;
    this.hist.push([this.t, this.v]);
    if (this.hist.length > 900) this.hist.shift();
  }
}
