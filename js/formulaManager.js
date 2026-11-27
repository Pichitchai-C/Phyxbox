// แสดงสมการด้วย KaTeX (โหลดจาก CDN ใน index.html)
export function tex(el, s) {
  try { katex.render(s, el, { throwOnError: false }); } catch { el.textContent = s; }
}

// สร้างสมการตามสิ่งที่ผู้ใช้เปิดใช้ในห้องแล็บ: พื้นราบ -> พื้นเอียง -> มีแรงเสียดทาน
export function buildEquation(p) {
  const slope = p.theta > 0.001, friction = p.mu > 0;
  let lhs = 'F';
  if (slope) lhs += ' - mg\\sin\\theta';
  if (friction) lhs += slope ? ' - \\mu mg\\cos\\theta' : ' - \\mu mg';
  const eq = `${lhs} = ma`;
  const fin = slope && friction
    ? 'a = \\frac{F - mg(\\sin\\theta + \\mu\\cos\\theta)}{m}'
    : `a = \\frac{${lhs}}{m}`;
  return { eq, fin };
}
