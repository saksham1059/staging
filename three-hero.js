// Three.js Portal Hero Animation
const canvas = document.getElementById('three-hero');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
let width = window.innerWidth;
let height = document.querySelector('.hero-section').offsetHeight;
renderer.setSize(width, height, false);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(0, 0, 16);

// Lighting
const ambient = new THREE.AmbientLight(0x99bbff, 1.2);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 0.7);
dir.position.set(5, 10, 10);
scene.add(dir);

// Portals (Torus)
function makePortal(y, color) {
  const geo = new THREE.TorusGeometry(2.2, 0.25, 32, 100);
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1, metalness: 0.7, roughness: 0.2 });
  const portal = new THREE.Mesh(geo, mat);
  portal.position.set(0, y, 0);
  scene.add(portal);
  return portal;
}
const portalBlue = makePortal(4.5, 0x2196f3);   // Blue portal (top)
const portalOrange = makePortal(-4.5, 0xff9800); // Orange portal (bottom)

// Portal positions
const portalY = [4.5, -4.5]; // [blue, orange]
const portalColors = [0x2196f3, 0xff9800];

// Cat (sphere head, cones for ears, cylinder body/tail)
const cat = new THREE.Group();
// Head
const headGeo = new THREE.SphereGeometry(1, 32, 32);
const headMat = new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.4 });
const head = new THREE.Mesh(headGeo, headMat);
head.position.y = 0.7;
cat.add(head);
// Ears
const earGeo = new THREE.ConeGeometry(0.35, 0.7, 16);
const earMat = new THREE.MeshStandardMaterial({ color: 0x8d5524 });
const earL = new THREE.Mesh(earGeo, earMat);
earL.position.set(-0.5, 1.6, 0);
earL.rotation.z = Math.PI * 0.1;
cat.add(earL);
const earR = new THREE.Mesh(earGeo, earMat);
earR.position.set(0.5, 1.6, 0);
earR.rotation.z = -Math.PI * 0.1;
cat.add(earR);
// Body
const bodyGeo = new THREE.CylinderGeometry(0.6, 0.7, 1.6, 24);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.5 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = -0.7;
cat.add(body);
// Tail
const tailGeo = new THREE.CylinderGeometry(0.13, 0.13, 1.2, 12);
const tailMat = new THREE.MeshStandardMaterial({ color: 0x8d5524 });
const tail = new THREE.Mesh(tailGeo, tailMat);
tail.position.set(0.7, -1.1, 0);
tail.rotation.z = Math.PI / 4;
cat.add(tail);
scene.add(cat);

// Cat physics
let catY = portalY[1]; // Start at orange portal
let catV = 0.08; // Initial velocity
let catA = 0.012; // Acceleration (gravity)
let catDir = 1; // 1 = up, -1 = down
let speedBoost = 1.08; // Speed multiplier per portal
let maxSpeed = 0.5;

function animate() {
  // Physics
  catV += catA * catDir;
  catV = Math.max(Math.min(catV, maxSpeed), -maxSpeed);
  catY += catV;

  // Teleport logic
  if (catDir === 1 && catY >= portalY[0]) { // Going up, hit blue
    catY = portalY[1]; // Teleport to orange
    catV *= speedBoost;
    catDir = -1;
    cat.scale.x = -1;
  } else if (catDir === -1 && catY <= portalY[1]) { // Going down, hit orange
    catY = portalY[0]; // Teleport to blue
    catV *= speedBoost;
    catDir = 1;
    cat.scale.x = 1;
  }

  // Clamp speed
  catV = Math.max(Math.min(catV, maxSpeed), -maxSpeed);

  // Animate cat
  cat.position.set(0, catY, 0);
  cat.rotation.z = Math.sin(catY) * 0.2;

  // Portals pulse
  portalBlue.scale.setScalar(1 + 0.08 * Math.sin(Date.now() * 0.003));
  portalOrange.scale.setScalar(1 + 0.08 * Math.cos(Date.now() * 0.003));

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = document.querySelector('.hero-section').offsetHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}); 