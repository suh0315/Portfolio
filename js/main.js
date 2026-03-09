/* =============================================
   PORTFOLIO — Web Designer
   script.js
   ============================================= */

/* ── Custom cursor ── */
const cur = document.getElementById('cur');

document.addEventListener('mousemove', e => {
  cur.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
});

document.querySelectorAll('a, button, .tool-item, .project-item, .about-keyword-list li').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
