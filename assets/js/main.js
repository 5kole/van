// Smooth active nav highlighting on scroll
const sections = document.querySelectorAll('[data-section]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${e.target.dataset.section}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => observer.observe(s));

// Preview frame scaling — fit iframes inside their containers
function scaleFrames() {
  document.querySelectorAll('.preview-frame').forEach(iframe => {
    const container = iframe.parentElement;
    const containerW = container.clientWidth;
    const nativeW = 1280;
    const scale = containerW / nativeW;
    iframe.style.width = nativeW + 'px';
    iframe.style.height = (380 / scale) + 'px';
    iframe.style.transform = `scale(${scale})`;
    iframe.style.transformOrigin = 'top left';
    container.style.height = '380px';
  });
}

window.addEventListener('load', scaleFrames);
window.addEventListener('resize', scaleFrames);

// ===== 3D van model: drag to rotate, snap views, auto-rotate =====
const van = document.querySelector('.van3d');
const viewport = document.querySelector('.van3d-viewport');
const vanTabs = document.querySelectorAll('.van-tab');

if (van && viewport) {
  let rx = -14, ry = 25;
  let target = null;        // tween target for ry when snapping to a view
  let auto = true;          // auto-rotate on load
  let dragging = false;
  let px = 0, py = 0;
  let scale = 1;

  function fitScale() {
    scale = Math.min(1, viewport.clientWidth / 780);
  }
  fitScale();
  window.addEventListener('resize', fitScale);

  function setActiveTab(tab) {
    vanTabs.forEach(t => t.classList.remove('active'));
    if (tab) tab.classList.add('active');
  }

  function frame() {
    if (!dragging) {
      if (target !== null) {
        const d = target - ry;
        ry += d * 0.09;
        if (Math.abs(d) < 0.15) { ry = target; target = null; }
      } else if (auto) {
        ry += 0.25;
      }
    }
    van.style.transform = `scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  viewport.addEventListener('pointerdown', e => {
    dragging = true;
    auto = false;
    target = null;
    px = e.clientX;
    py = e.clientY;
    viewport.setPointerCapture(e.pointerId);
    setActiveTab(null);
  });
  viewport.addEventListener('pointermove', e => {
    if (!dragging) return;
    ry += (e.clientX - px) * 0.4;
    rx = Math.max(-42, Math.min(8, rx - (e.clientY - py) * 0.25));
    px = e.clientX;
    py = e.clientY;
  });
  const endDrag = () => { dragging = false; };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  vanTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setActiveTab(tab);
      if (tab.dataset.view === 'auto') {
        auto = true;
        target = null;
        return;
      }
      auto = false;
      const tgt = parseFloat(tab.dataset.view);
      // rotate along the shortest path
      ry = ((ry % 360) + 360) % 360;
      let d = tgt - ry;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      target = ry + d;
      rx = -14;
    });
  });
}
