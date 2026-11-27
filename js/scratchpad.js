// กระดานทดเลข: canvas โปร่งใสซ้อนทับหน้าจอ 3 มิติ
export function initScratchpad(cv) {
  const ctx = cv.getContext('2d');
  let color = '#111111', erasing = false, drawing = false;
  const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
  addEventListener('resize', fit);
  fit();

  cv.addEventListener('pointerdown', (e) => {
    drawing = true;
    cv.setPointerCapture(e.pointerId);
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  });
  cv.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.strokeStyle = color;
    ctx.lineWidth = erasing ? 26 : 3;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  });
  const stop = () => { drawing = false; };
  cv.addEventListener('pointerup', stop);
  cv.addEventListener('pointercancel', stop);

  return {
    toggle: () => cv.classList.toggle('on'),
    color: (c) => { color = c; erasing = false; },
    eraser: () => { erasing = true; },
    clear: () => ctx.clearRect(0, 0, cv.width, cv.height),
  };
}
