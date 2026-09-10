type Star = { x: number; y: number; radius: number; depth: number };

class ConstellationSky extends HTMLElement {
  private dispose?: () => void;

  connectedCallback() {
    this.dispose?.();
    const canvas = this.querySelector('canvas');
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0;
    let accent = '', light = false;
    let stars: Star[] = [];
    let edges: [number, number][] = [];
    const target = { x: 0, y: 0, active: false };
    const cursor = { x: 0, y: 0, alpha: 0 };

    const requestDraw = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const resetPointer = () => {
      target.x = width / 2; target.y = height / 2; target.active = false;
      requestDraw();
    };
    const theme = () => {
      accent = getComputedStyle(this).getPropertyValue('--accent').trim() || '#c5a840';
      light = document.documentElement.classList.contains('light-mode');
      requestDraw();
    };
    const resize = () => {
      const bounds = this.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      // Stable positions prevent the sky jumping randomly when a window is resized.
      let seed = 520;
      const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
      const count = Math.min(72, Math.max(28, Math.round(width * height / 16000)));
      stars = Array.from({ length: count }, () => ({ x: random() * width, y: random() * height, radius: .8 + random() * 1.3, depth: .4 + random() * .6 }));
      const reach = Math.min(190, Math.max(105, width * .19));
      edges = [];
      stars.forEach((star, i) => {
        stars.map((other, j) => ({ j, distance: Math.hypot(star.x - other.x, star.y - other.y) }))
          .filter(other => other.j > i && other.distance < reach)
          .sort((a, b) => a.distance - b.distance).slice(0, 2)
          .forEach(other => edges.push([i, other.j]));
      });
      cursor.x = width / 2; cursor.y = height / 2; cursor.alpha = 0;
      resetPointer();
    };
    function draw() {
      frame = 0;
      if (!width || !height || document.hidden) return;
      const active = target.active && !reducedMotion.matches;
      const tx = active ? target.x : width / 2;
      const ty = active ? target.y : height / 2;
      cursor.x += (tx - cursor.x) * .13;
      cursor.y += (ty - cursor.y) * .13;
      cursor.alpha += ((active ? 1 : 0) - cursor.alpha) * .13;
      context!.clearRect(0, 0, width, height);
      context!.fillStyle = accent; context!.strokeStyle = accent;
      const positions = stars.map(star => {
        const distance = Math.hypot(star.x - cursor.x, star.y - cursor.y);
        const attraction = Math.max(0, 1 - distance / 220) * .08 * cursor.alpha;
        return {
          x: star.x + (cursor.x / width - .5) * 24 * star.depth + (cursor.x - star.x) * attraction,
          y: star.y + (cursor.y / height - .5) * 24 * star.depth + (cursor.y - star.y) * attraction,
        };
      });
      context!.lineWidth = .65;
      context!.globalAlpha = light ? .22 : .24;
      context!.beginPath();
      edges.forEach(([a, b]) => { context!.moveTo(positions[a].x, positions[a].y); context!.lineTo(positions[b].x, positions[b].y); });
      context!.stroke();
      positions.forEach((point, i) => {
        context!.globalAlpha = .35 + stars[i].depth * .3;
        context!.beginPath(); context!.arc(point.x, point.y, stars[i].radius, 0, Math.PI * 2); context!.fill();
      });
      if (cursor.alpha > .01) {
        const nearest = positions.map(point => ({ ...point, distance: Math.hypot(point.x - cursor.x, point.y - cursor.y) }))
          .filter(point => point.distance < 220).sort((a, b) => a.distance - b.distance).slice(0, 5);
        nearest.forEach(point => {
          context!.globalAlpha = (1 - point.distance / 220) * .6 * cursor.alpha;
          context!.beginPath(); context!.moveTo(cursor.x, cursor.y); context!.lineTo(point.x, point.y); context!.stroke();
        });
        context!.globalAlpha = .65 * cursor.alpha;
        context!.shadowColor = accent; context!.shadowBlur = 12;
        context!.beginPath(); context!.arc(cursor.x, cursor.y, 2.5, 0, Math.PI * 2); context!.fill();
        context!.shadowBlur = 0;
      }
      context!.globalAlpha = 1;
      // Stop rendering once the pointer settles; no perpetual background render loop.
      if (Math.abs(tx - cursor.x) + Math.abs(ty - cursor.y) > .1 || Math.abs((active ? 1 : 0) - cursor.alpha) > .005) requestDraw();
    }
    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || reducedMotion.matches) return;
      const bounds = this.getBoundingClientRect();
      const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
      if (x < 0 || x > width || y < 0 || y > height) { resetPointer(); return; }
      target.x = x; target.y = y; target.active = true; requestDraw();
    }, { ...options, passive: true });
    document.documentElement.addEventListener('pointerleave', resetPointer, options);
    window.addEventListener('blur', resetPointer, options);
    document.addEventListener('journal:theme', theme, options);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else resetPointer();
    }, options);
    reducedMotion.addEventListener('change', () => {
      cursor.x = width / 2; cursor.y = height / 2; cursor.alpha = 0;
      resetPointer();
    }, options);
    const observer = new ResizeObserver(resize);
    observer.observe(this);
    theme(); resize();
    this.dispose = () => { controller.abort(); observer.disconnect(); cancelAnimationFrame(frame); frame = 0; };
  }

  disconnectedCallback() { this.dispose?.(); this.dispose = undefined; }
}
if (!customElements.get('constellation-sky')) customElements.define('constellation-sky', ConstellationSky);
