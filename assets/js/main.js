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

// Tab switcher for van wrap views
const vanTabs = document.querySelectorAll('.van-tab');
const vanViews = document.querySelectorAll('.van-view');
vanTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    vanTabs.forEach(t => t.classList.remove('active'));
    vanViews.forEach(v => v.classList.remove('active'));
    tab.classList.add('active');
    const target = document.querySelector(`.van-view[data-view="${tab.dataset.tab}"]`);
    if (target) target.classList.add('active');
  });
});
