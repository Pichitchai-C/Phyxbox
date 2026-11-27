import { createLab } from './lab3d.js';
import { Physics } from './physicsEngine.js';
import { tex, buildEquation } from './formulaManager.js';
import { initScratchpad } from './scratchpad.js';
import { LESSON } from './data/curriculum.js';
import { CHALLENGES } from './data/challenges.js';

const $ = (id) => document.getElementById(id);
const lab = createLab($('viewport'));
const phys = new Physics();
const pad = initScratchpad($('pad'));
const ch = CHALLENGES[0];
let running = false, exam = false, hintLv = 0, lastEq = '';

// --- เนื้อหาบทเรียน ---
tex($('base'), LESSON.base);
tex($('shortcut'), LESSON.shortcut);
$('theory').textContent = LESSON.theory;
$('cond').textContent = LESSON.condition;

// --- อ่านค่าจากแถบเลื่อนและอัปเดตสูตร ---
function readControls() {
  const p = { m: +$('m').value, theta: +$('th').value * Math.PI / 180, F: +$('F').value, mu: +$('mu').value };
  $('mV').textContent = p.m; $('thV').textContent = $('th').value; $('FV').textContent = p.F; $('muV').textContent = p.mu;
  phys.p = p;
  const { eq, fin } = buildEquation(p);
  if (eq !== lastEq) { lastEq = eq; tex($('evolve'), eq); tex($('final'), fin); }
}
['m', 'th', 'F', 'mu'].forEach((id) => $(id).addEventListener('input', readControls));

function reset() { phys.reset(); running = false; $('run').textContent = '▶ เริ่ม'; }
$('run').onclick = () => { running = !running; $('run').textContent = running ? '⏸ หยุด' : '▶ เริ่ม'; };
$('reset').onclick = reset;

// --- Hint 3 ระดับ ---
function resetHints() { hintLv = 0; $('hint').textContent = ''; $('hintBtn').textContent = '💡 Hint'; }
$('hintBtn').onclick = () => {
  hintLv = Math.min(hintLv + 1, LESSON.hints.length);
  $('hint').textContent = LESSON.hints.slice(0, hintLv).join('\n');
  $('hintBtn').textContent = `💡 Hint (${hintLv}/${LESSON.hints.length})`;
};

// --- โหมดทดลอง / โหมดท้าทายข้อสอบ ---
$('mode').onchange = () => {
  exam = $('mode').value === 'exam';
  $('exam').classList.toggle('hidden', !exam);
  resetHints();
  if (exam) {
    const q = ch.params;
    $('m').value = q.m; $('th').value = q.theta; $('F').value = q.F; $('mu').value = q.mu;
    $('q').textContent = ch.text; $('res').textContent = ''; $('ans').value = '';
  }
  reset();
  readControls();
};
$('chk').onclick = () => {
  const ok = Math.abs(parseFloat($('ans').value) - ch.answer) <= ch.answer * ch.tol;
  $('res').textContent = ok ? `✅ ถูกต้อง\n${ch.solution}` : '❌ ยังไม่ถูก ลองกด ▶ ดูในห้องแล็บ หรือเปิด Hint';
};

// --- กระดานทด ---
$('padT').onclick = () => pad.toggle();
document.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => pad.color(b.dataset.c)));
$('era').onclick = () => pad.eraser();
$('clr').onclick = () => pad.clear();

// --- กราฟ v-t ด้านล่าง ---
function drawGraph() {
  const c = $('graph'), g = c.getContext('2d');
  const w = (c.width = c.clientWidth), h = (c.height = c.clientHeight), H = phys.hist;
  g.fillStyle = '#14233a'; g.font = '12px Sarabun'; g.fillText('กราฟ v–t (m/s)', 10, 16);
  g.strokeStyle = '#c9d4e0'; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  if (H.length < 2) return;
  const t0 = H[0][0], span = Math.max(5, H[H.length - 1][0] - t0);
  const vmax = Math.max(1, ...H.map((p) => Math.abs(p[1])));
  g.strokeStyle = '#0b6bcb'; g.lineWidth = 2; g.beginPath();
  H.forEach(([t, v], i) => {
    const x = ((t - t0) / span) * (w - 20) + 10, y = h / 2 - (v / vmax) * (h / 2 - 22);
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  });
  g.stroke();
  g.fillText(`±${vmax.toFixed(1)}`, w - 50, 16);
}

// --- ลูปหลัก ---
let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (running) phys.step(dt);
  const { a, f } = phys.accel();
  lab.update(phys, f);
  $('aR').textContent = exam ? '???' : a.toFixed(2); // โหมดข้อสอบซ่อนคำตอบ
  $('vR').textContent = phys.v.toFixed(2); $('sR').textContent = phys.s.toFixed(2); $('tR').textContent = phys.t.toFixed(1);
  drawGraph();
  requestAnimationFrame(loop);
}
readControls();
requestAnimationFrame(loop);
