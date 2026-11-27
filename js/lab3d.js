import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { G } from './physicsEngine.js';

const L = 8, K = 0.04; // ความยาวพื้นเอียง (m) และสเกลลูกศรแรง (หน่วยฉาก / N)

export function createLab(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeef2f6);
  const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  cam.position.set(0, 5, 14);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  const controls = new OrbitControls(cam, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.update();

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(5, 10, 6);
  scene.add(sun);
  scene.add(new THREE.GridHelper(30, 30, 0x9fb0c3, 0xd0d9e3));

  // พื้นเอียง: กลุ่มวัตถุที่หมุนรอบปลายล่าง (x = -L/2)
  const ramp = new THREE.Group();
  ramp.position.set(-L / 2, 0, 0);
  scene.add(ramp);
  const board = new THREE.Mesh(new THREE.BoxGeometry(L, 0.2, 3), new THREE.MeshStandardMaterial({ color: 0xc9a66b }));
  board.position.set(L / 2, -0.1, 0);
  ramp.add(board);
  const tickMat = new THREE.MeshBasicMaterial({ color: 0x5b4a2e });
  for (let i = 0; i <= L; i++) { // ไม้บรรทัดทุก 1 เมตร
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 3), tickMat);
    tick.position.set(i, 0.006, 0);
    ramp.add(tick);
  }

  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x2b78d6 }));
  ramp.add(box);

  const arrow = (color) => new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, color, 0.3, 0.2);
  const aF = arrow(0xe53935), aN = arrow(0x2e9e4f), aFr = arrow(0xf57c00), aW = arrow(0x8e24aa);
  aF.position.set(0.5, 0.2, 0);   // แรงดึง F (แดง)
  aN.position.set(0, 0.5, 0);     // แรงปฏิกิริยา N (เขียว)
  aN.setDirection(new THREE.Vector3(0, 1, 0));
  aFr.position.set(0, -0.5, 0);   // แรงเสียดทาน f (ส้ม)
  aW.setDirection(new THREE.Vector3(0, -1, 0)); // น้ำหนัก mg (ม่วง) อยู่ในพิกัดโลก
  box.add(aF, aN, aFr);
  scene.add(aW);

  const setLen = (a, len) => { a.visible = len > 0.3; if (a.visible) a.setLength(len, 0.3, 0.2); };
  const wp = new THREE.Vector3();

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  return {
    update(ph, f) {
      const { m, theta, F } = ph.p;
      ramp.rotation.z = theta;
      box.position.set(ph.s, 0.5, 0);
      ramp.updateMatrixWorld(true);
      setLen(aF, F * K);
      setLen(aN, m * G * Math.cos(theta) * K);
      if (f !== 0) aFr.setDirection(new THREE.Vector3(Math.sign(f), 0, 0));
      setLen(aFr, Math.abs(f) * K);
      box.getWorldPosition(wp);
      aW.position.copy(wp);
      setLen(aW, m * G * K);
      renderer.render(scene, cam);
    },
  };
}
