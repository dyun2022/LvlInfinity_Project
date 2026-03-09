import { useEffect, useRef } from "react";

const W = 1200, H = 700;
const VP = { x: W / 2, y: H * 0.48 }; // vanishing point center
const SPEED = 0.70; // faster building rise

function mkRand(seed) {
  let s = (seed | 0) + 1;
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

// ── Sky & atmosphere ──────────────────────────────────────────────────────────
function drawSky(ctx, t) {
  // Warm magenta/peach/teal gradient like reference
  const sky = ctx.createRadialGradient(VP.x, VP.y, 0, VP.x, VP.y * 0.5, H * 1.1);
  sky.addColorStop(0.0,  "#ffe8d0"); // warm white core
  sky.addColorStop(0.08, "#ffb8d0"); // peach pink
  sky.addColorStop(0.22, "#f060a0"); // hot magenta
  sky.addColorStop(0.42, "#c040a0"); // deep magenta
  sky.addColorStop(0.62, "#703080"); // purple
  sky.addColorStop(0.80, "#204060"); // dark teal-blue
  sky.addColorStop(1.0,  "#0a1825"); // near black
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Nebula/cloud wisps in upper sky — like the teal cloud mass in reference
  ctx.save();
  ctx.globalAlpha = 0.18;
  const cloud = ctx.createRadialGradient(W*0.35, H*0.08, 0, W*0.35, H*0.08, W*0.32);
  cloud.addColorStop(0, "rgba(80,220,200,0.7)");
  cloud.addColorStop(0.5, "rgba(40,140,160,0.3)");
  cloud.addColorStop(1, "transparent");
  ctx.fillStyle = cloud;
  ctx.fillRect(0, 0, W, H);
  const cloud2 = ctx.createRadialGradient(W*0.72, H*0.05, 0, W*0.72, H*0.05, W*0.22);
  cloud2.addColorStop(0, "rgba(60,200,180,0.5)");
  cloud2.addColorStop(1, "transparent");
  ctx.fillStyle = cloud2;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // Stars — teal/white sparkles like reference
  const sr = mkRand(42);
  for (let i = 0; i < 200; i++) {
    const sx = sr() * W;
    const sy = sr() * H * 0.72;
    const size = sr() * 2.2;
    const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.4 + i * 0.83));
    const isTeal = sr() > 0.55;
    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = isTeal
      ? `rgba(80,255,220,${twinkle * 0.85})`
      : `rgba(255,255,255,${twinkle * 0.75})`;
    if (size > 1.4) { ctx.shadowColor = isTeal ? "#40ffcc" : "#ffffff"; ctx.shadowBlur = 6; }
    ctx.fill();
    ctx.restore();

    // Diamond sparkle shape for brighter stars
    if (size > 1.7) {
      ctx.save();
      ctx.globalAlpha = twinkle * 0.6;
      ctx.strokeStyle = isTeal ? "#40ffcc" : "#ffffff";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy - size * 3); ctx.lineTo(sx, sy + size * 3);
      ctx.moveTo(sx - size * 3, sy); ctx.lineTo(sx + size * 3, sy);
      ctx.stroke();
      ctx.restore();
    }
  }
}

// ── Building silhouette data ──────────────────────────────────────────────────
const BLDG_CACHE = new Map();
function getBuildingProfile(seed, maxW, maxH) {
  const key = `${seed}`;
  if (BLDG_CACHE.has(key)) return BLDG_CACHE.get(key);
  const r = mkRand(seed);

  // Style: chunky retro-future blocks with setbacks (like reference)
  const style = Math.floor(r() * 4); // 0=empire state tapered, 1=blocky slab, 2=stepped pyramid, 3=cylinder top
  const baseW = maxW * (0.5 + r() * 0.5);
  const baseH = maxH * (0.4 + r() * 0.6);

  // Generate silhouette as polygon points (relative, bottom-left origin)
  const pts = [];
  if (style === 0) {
    // Empire-state style — narrow taper with setbacks
    const steps = 3 + Math.floor(r() * 4);
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const w = baseW * (1 - frac * 0.72);
      const h = baseH * frac;
      if (i === 0) { pts.push([0, 0], [baseW, 0]); }
      pts.push([baseW / 2 + w / 2, h], [baseW / 2 - w / 2, h]);
    }
  } else if (style === 1) {
    // Chunky slab — one or two offsets
    const mid = 0.45 + r() * 0.3;
    const w2 = baseW * (0.55 + r() * 0.35);
    pts.push(
      [0, 0], [baseW, 0],
      [baseW, baseH * mid], [baseW / 2 + w2 / 2, baseH * mid],
      [baseW / 2 + w2 / 2, baseH], [baseW / 2 - w2 / 2, baseH],
      [baseW / 2 - w2 / 2, baseH * mid], [0, baseH * mid]
    );
  } else if (style === 2) {
    // Stepped pyramid
    const steps = 2 + Math.floor(r() * 3);
    pts.push([0, 0], [baseW, 0]);
    for (let i = 1; i <= steps; i++) {
      const frac = i / steps;
      const inset = (baseW / steps) * 0.4 * i;
      pts.push([baseW - inset, baseH * frac * 0.85]);
      pts.push([inset, baseH * frac * 0.85]);
    }
    pts.push([baseW / 2, baseH]);
  } else {
    // Tall slab with cylindrical/dome top
    pts.push(
      [0, 0], [baseW, 0],
      [baseW, baseH * 0.8], [baseW / 2 + baseW * 0.3, baseH * 0.8],
      [baseW / 2, baseH], [baseW / 2 - baseW * 0.3, baseH * 0.8],
      [0, baseH * 0.8]
    );
  }

  // Window rows
  const windows = [];
  const wcols = Math.max(2, Math.floor(baseW / 14));
  const wrows = Math.max(3, Math.floor(baseH / 18));
  const wr = mkRand(seed + 1);
  for (let row = 0; row < wrows; row++) {
    for (let col = 0; col < wcols; col++) {
      windows.push({
        x: (col / wcols) * baseW + 3,
        y: (row / wrows) * baseH + 4,
        w: baseW / wcols - 5,
        h: baseH / wrows - 6,
        lit: wr() > 0.35,
        warm: wr() > 0.5,
        flick: wr() > 0.93,
      });
    }
  }

  // Antenna / spire
  const spire = r() > 0.45 ? 30 + r() * 100 : 0;
  const hasLedge = r() > 0.5; // floating ledge/platform
  const ledgeY = baseH * (0.3 + r() * 0.5);
  const ledgeW = baseW * (1.1 + r() * 0.4);

  const data = { pts, baseW, baseH, style, windows, spire, hasLedge, ledgeY, ledgeW };
  BLDG_CACHE.set(key, data);
  return data;
}

// ── Draw one building ─────────────────────────────────────────────────────────
function drawBuilding(ctx, bx, by, scaleX, scaleY, seed, side, t, layerAlpha, tint) {
  const prof = getBuildingProfile(seed, 160, 400);
  const { pts, baseW, baseH, windows, spire, hasLedge, ledgeY, ledgeW } = prof;
  const fw = baseW * scaleX;
  const fh = baseH * scaleY;
  if (fw < 2 || fh < 2) return;

  // Map pts to screen
  const sx = (px) => bx + px * scaleX;
  const sy = (py) => by - py * scaleY; // y grows upward

  // Body fill — match reference: dark desaturated blue-purple solids
  ctx.save();
  ctx.globalAlpha = layerAlpha;

  // Silhouette path
  if (pts.length > 2) {
    ctx.beginPath();
    ctx.moveTo(sx(pts[0][0]), sy(pts[0][1]));
    for (let i = 1; i < pts.length; i++) ctx.lineTo(sx(pts[i][0]), sy(pts[i][1]));
    ctx.closePath();
    const bodyG = ctx.createLinearGradient(sx(0), sy(baseH), sx(0), sy(0));
    bodyG.addColorStop(0, tint.dark);
    bodyG.addColorStop(0.5, tint.mid);
    bodyG.addColorStop(1, tint.light);
    ctx.fillStyle = bodyG;
    ctx.fill();

    // Subtle edge highlight — teal/magenta glow
    ctx.strokeStyle = tint.edge;
    ctx.lineWidth = 0.8 * scaleX;
    ctx.shadowColor = tint.edge;
    ctx.shadowBlur = 4;
    ctx.stroke();
  }

  // Windows
  windows.forEach(w => {
    const wx = sx(w.x), wy = sy(w.y + w.h);
    const ww = w.w * scaleX, wh = w.h * scaleY;
    if (ww < 1 || wh < 1) return;
    if (!w.lit) return;
    if (w.flick && Math.sin(t * 9.1 + seed * 0.4 + w.x) > 0.3) return;
    ctx.shadowBlur = 0;
    if (w.warm) {
      ctx.fillStyle = `rgba(255,180,120,0.65)`;
    } else {
      // teal/magenta windows like reference
      ctx.fillStyle = Math.sin(seed + w.x) > 0
        ? `rgba(255,80,140,0.6)`
        : `rgba(80,220,200,0.55)`;
    }
    ctx.fillRect(wx, wy, ww, wh);
    // Glow
    if (scaleX > 0.5) {
      ctx.save();
      ctx.shadowColor = w.warm ? "#ffaa60" : (Math.sin(seed + w.x) > 0 ? "#ff4080" : "#40ddbb");
      ctx.shadowBlur = 5 * scaleX;
      ctx.fillRect(wx, wy, ww, wh);
      ctx.restore();
    }
  });

  // Floating ledge/platform (horizontal slab sticking out — very reference-like)
  if (hasLedge && scaleX > 0.3) {
    ctx.shadowBlur = 0;
    const lx = sx(-ledgeW * 0.05);
    const ly = sy(ledgeY);
    const lw = ledgeW * scaleX;
    const lh = 6 * scaleY;
    ctx.fillStyle = tint.dark;
    ctx.fillRect(lx, ly - lh, lw, lh);
    ctx.strokeStyle = tint.edge;
    ctx.lineWidth = 0.8;
    ctx.shadowColor = tint.edge; ctx.shadowBlur = 6;
    ctx.strokeRect(lx, ly - lh, lw, lh);
    // Red light on underside (like reference ships/ledges)
    if (scaleX > 0.5) {
      ctx.beginPath();
      ctx.arc(lx + lw * 0.35, ly - lh / 2, 2.5 * scaleX, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,60,60,${0.7 + 0.3 * Math.sin(t * 2.1 + seed)})`;
      ctx.shadowColor = "#ff2020"; ctx.shadowBlur = 10;
      ctx.fill();
    }
  }

  // Spire
  if (spire > 0 && scaleX > 0.25) {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = tint.edge;
    ctx.lineWidth = 1.2 * scaleX;
    ctx.shadowColor = tint.edge; ctx.shadowBlur = 8;
    const spireTopY = sy(baseH + spire);
    ctx.beginPath();
    ctx.moveTo(sx(baseW / 2), sy(baseH));
    ctx.lineTo(sx(baseW / 2), spireTopY);
    ctx.stroke();
    // Tip
    ctx.beginPath();
    ctx.arc(sx(baseW / 2), spireTopY, 2 * scaleX, 0, Math.PI * 2);
    ctx.fillStyle = tint.edge;
    ctx.shadowBlur = 12;
    ctx.fill();
  }

  ctx.restore();
}

// ── City layer — left or right side buildings ────────────────────────────────
const LAYER_DEFS = [
  // { side, depth (0=far,1=near), xFrac(edge position as frac of W), widthFrac, heightFrac, seed, numBuildings }
  { side: "L", depth: 0.08, x: 0,    wf: 0.08, hf: 0.35, seed: 10 },
  { side: "R", depth: 0.08, x: 0.92, wf: 0.08, hf: 0.35, seed: 11 },
  { side: "L", depth: 0.18, x: 0,    wf: 0.13, hf: 0.48, seed: 20 },
  { side: "R", depth: 0.18, x: 0.87, wf: 0.13, hf: 0.48, seed: 21 },
  { side: "L", depth: 0.30, x: 0,    wf: 0.18, hf: 0.60, seed: 30 },
  { side: "R", depth: 0.30, x: 0.82, wf: 0.18, hf: 0.60, seed: 31 },
  { side: "L", depth: 0.46, x: 0,    wf: 0.22, hf: 0.74, seed: 40 },
  { side: "R", depth: 0.46, x: 0.78, wf: 0.22, hf: 0.74, seed: 41 },
  { side: "L", depth: 0.64, x: 0,    wf: 0.27, hf: 0.88, seed: 50 },
  { side: "R", depth: 0.64, x: 0.73, wf: 0.27, hf: 0.88, seed: 51 },
  { side: "L", depth: 0.82, x: 0,    wf: 0.32, hf: 1.0,  seed: 60 },
  { side: "R", depth: 0.82, x: 0.68, wf: 0.32, hf: 1.0,  seed: 61 },
];

// Tints per depth — matches reference palette
function getTint(depth, side) {
  // Far: teal-blue tones. Near: deep purple/navy
  const t0 = { // far
    dark:  "rgba(30,50,70,0.85)",
    mid:   "rgba(50,75,100,0.7)",
    light: "rgba(80,110,140,0.6)",
    edge:  "rgba(80,220,200,0.5)",
  };
  const t1 = { // near
    dark:  "rgba(20,18,40,0.95)",
    mid:   "rgba(35,28,60,0.88)",
    light: "rgba(55,45,85,0.75)",
    edge:  side === "L" ? "rgba(255,80,140,0.45)" : "rgba(80,200,220,0.45)",
  };
  const f = depth;
  return {
    dark:  lerpColor(t0.dark,  t1.dark,  f),
    mid:   lerpColor(t0.mid,   t1.mid,   f),
    light: lerpColor(t0.light, t1.light, f),
    edge:  f > 0.5 ? t1.edge : t0.edge,
  };
}
function lerpColor(a, b, t) { return t > 0.5 ? b : a; } // simple

// How many buildings fit per layer
const LAYER_BLDG_COUNTS = new Map();
function getLayerBuildings(layerSeed, count, wf) {
  const key = `${layerSeed}_${count}`;
  if (LAYER_BLDG_COUNTS.has(key)) return LAYER_BLDG_COUNTS.get(key);
  const r = mkRand(layerSeed * 31337);
  const arr = Array.from({ length: count }, (_, i) => ({
    seed: layerSeed * 100 + i,
    hFrac: 0.5 + r() * 0.5,
  }));
  LAYER_BLDG_COUNTS.set(key, arr);
  return arr;
}

function drawCityLayers(ctx, t) {
  // Sort back to front
  const sorted = [...LAYER_DEFS].sort((a, b) => a.depth - b.depth);

  sorted.forEach(layer => {
    const { side, depth, x: xFrac, wf, hf, seed } = layer;
    const layerW = W * wf;
    const maxH = H * hf;
    const groundY = VP.y + (H - VP.y) * (0.05 + depth * 0.15); // where ground meets buildings
    const tint = getTint(depth, side);
    const alpha = 0.35 + depth * 0.65;

    // Scroll speed proportional to depth
    const scrollRate = SPEED * 150 * (0.06 + depth * 0.94);
    const scrollY = (t * scrollRate);

    const count = 8;
    const bldgs = getLayerBuildings(seed, count, wf);
    const totalH = bldgs.reduce((s, b) => s + b.hFrac * maxH, 0);
    const loopY = scrollY % totalH;

    // Clip to side strip
    ctx.save();
    const clipX = side === "L" ? 0 : W * xFrac;
    ctx.beginPath();
    ctx.rect(clipX, 0, layerW, H);
    ctx.clip();

    // Draw buildings stacked vertically (scrolling down = flying forward)
    let yOff = -loopY;
    let bi = 0;
    while (yOff < H + 50) {
      const b = bldgs[((bi % count) + count) % count];
      const bh = b.hFrac * maxH;
      const bx = side === "L" ? 0 : W * xFrac;
      // Building bottom is at groundY + yOff, top goes up
      const baseY = groundY + yOff + bh;
      const scaleX = layerW / 160;
      const scaleY = (bh / 400);
      drawBuilding(ctx, bx, baseY, scaleX, scaleY, b.seed, side, t, alpha, tint);
      yOff += bh;
      bi++;
    }
    ctx.restore();
  });
}

// ── Road / corridor ──────────────────────────────────────────────────────────
function drawRoad(ctx, t) {
  const roadTop = VP.y + (H - VP.y) * 0.02;

  // Dark road base
  const rg = ctx.createLinearGradient(0, roadTop, 0, H);
  rg.addColorStop(0, "#0a0818");
  rg.addColorStop(0.4, "#120a20");
  rg.addColorStop(1, "#060408");
  ctx.fillStyle = rg;
  ctx.fillRect(0, roadTop, W, H - roadTop);

  // Strong central light bloom from VP — THE key feature of the reference
  const bloom = ctx.createRadialGradient(VP.x, VP.y, 0, VP.x, VP.y + (H - VP.y) * 0.5, W * 0.55);
  bloom.addColorStop(0.0, "rgba(255,200,160,0.55)");
  bloom.addColorStop(0.08, "rgba(255,140,180,0.35)");
  bloom.addColorStop(0.22, "rgba(200,80,160,0.18)");
  bloom.addColorStop(0.5, "rgba(120,40,120,0.07)");
  bloom.addColorStop(1, "transparent");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, roadTop, W, H - roadTop);

  // Wet reflections
  const wr = mkRand(77);
  for (let i = 0; i < 8; i++) {
    const px = VP.x + (wr() - 0.5) * W * 0.7;
    const py = roadTop + wr() * (H - roadTop) * 0.8;
    const prx = 20 + wr() * 60, pry = prx * 0.2;
    const hue = wr() > 0.5 ? 340 : 185;
    const pG = ctx.createRadialGradient(px, py, 0, px, py, prx);
    pG.addColorStop(0, `hsla(${hue},90%,70%,0.2)`);
    pG.addColorStop(1, "transparent");
    ctx.fillStyle = pG;
    ctx.beginPath(); ctx.ellipse(px, py, prx, pry, 0, 0, Math.PI * 2); ctx.fill();
  }
}

// ── Floating vehicles (like reference) ───────────────────────────────────────
const VEHICLES = Array.from({ length: 18 }, (_, i) => {
  const r = mkRand(i * 9999 + 7);
  return {
    seed: i,
    laneX: 0.35 + r() * 0.3,   // 0-1 across width
    laneY: 0.2 + r() * 0.55,   // 0-1 depth along road (perspective)
    speed: 1 + r() * 1.2,    // relative forward speed
    size: 0.4 + r() * 0.6,     // size multiplier
    phase: r(),                  // phase offset
    col: r() > 0.5 ? "#ff2060" : "#202030", // red or dark
  };
});

function drawVehicles(ctx, t) {
  // Sort back to front
  const sorted = [...VEHICLES].sort((a, b) => a.laneY - b.laneY);

  sorted.forEach(v => {
    const prog = ((v.phase + t * v.speed * SPEED * 0.8) % 1);

    // Perspective: smaller near VP, larger near bottom
    const pct = Math.pow(prog, 1.4);
    const screenX = VP.x + (v.laneX - 0.5) * W * 0.55 * pct;
    const screenY = VP.y + (H - VP.y) * pct * 0.92;
    const sz = 4 + pct * 28 * v.size;

    if (sz < 2) return;

    const alpha = pct < 0.1 ? pct / 0.1 : pct > 0.88 ? (1 - pct) / 0.12 : 1;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Vehicle body — chunky box like reference
    const bw = sz * 2.2, bh = sz * 1.0;
    ctx.fillStyle = v.col;
    ctx.shadowColor = v.col === "#ff2060" ? "#ff0040" : "#303050";
    ctx.shadowBlur = 8 * pct;
    ctx.fillRect(screenX - bw / 2, screenY - bh, bw, bh);

    // Underside glow (anti-grav)
    const uG = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, bw * 0.7);
    uG.addColorStop(0, `rgba(255,100,200,${0.4 * pct})`);
    uG.addColorStop(1, "transparent");
    ctx.fillStyle = uG;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY, bw * 0.6, bh * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red nav lights
    ctx.shadowColor = "#ff2020"; ctx.shadowBlur = 10;
    ctx.fillStyle = `rgba(255,40,40,${0.8 + 0.2 * Math.sin(t * 3 + v.seed)})`;
    ctx.beginPath(); ctx.arc(screenX - bw * 0.4, screenY - bh * 0.5, sz * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(screenX + bw * 0.4, screenY - bh * 0.5, sz * 0.12, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  });
}

// ── Floating particles / data bits (the little square sparkles in reference) ─
const PARTICLES = Array.from({ length: 120 }, (_, i) => {
  const r = mkRand(i * 1337);
  return {
    x: r() * W,
    y: r() * H,
    size: 1 + r() * 4,
    speed: 0.15 + r() * 0.5,
    hue: r() > 0.6 ? 170 : (r() > 0.3 ? 340 : 60),
    phase: r(),
    square: r() > 0.55, // square vs dot
    drift: (r() - 0.5) * 0.4,
  };
});

function drawParticles(ctx, t) {
  PARTICLES.forEach(p => {
    const py = ((p.y + t * p.speed * 18) % (H * 1.1)) - H * 0.05;
    const px = p.x + Math.sin(t * 0.4 + p.phase * Math.PI * 2) * 15 * p.drift;
    const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.8 + p.phase * 6.28));

    ctx.save();
    ctx.globalAlpha = twinkle * 0.7;
    ctx.shadowColor = `hsl(${p.hue},100%,75%)`;
    ctx.shadowBlur = 6;
    ctx.fillStyle = `hsl(${p.hue},100%,80%)`;
    if (p.square) {
      ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
    } else {
      ctx.beginPath(); ctx.arc(px, py, p.size * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  });
}

// ── Warp beams — kept from previous, tuned for this scene ────────────────────
function drawWarpBeams(ctx, t) {
  const rand = mkRand(9981);
  const N = 38;
  for (let i = 0; i < N; i++) {
    const angle = rand() * Math.PI * 2;
    const spd = 1 + rand() * 1.0;
    // Hues: mostly magenta/pink/teal to match sky
    const hue = rand() > 0.5
      ? 300 + rand() * 60   // magenta-pink
      : 160 + rand() * 40;  // teal
    const phase = rand();
    const len = 60 + rand() * 300;
    const thick = 0.3 + rand() * 2.2;
    const prog = ((t * spd * 0.3 + phase) % 1);
    const dist = prog * Math.max(W, H) * 0.92;
    const x1 = VP.x + Math.cos(angle) * dist * 0.025;
    const y1 = VP.y + Math.sin(angle) * dist * 0.025;
    const x2 = VP.x + Math.cos(angle) * (dist + len);
    const y2 = VP.y + Math.sin(angle) * (dist + len);
    const alpha = prog < 0.1 ? prog / 0.1 : prog > 0.72 ? (1 - prog) / 0.28 : 1;

    ctx.save();
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, `hsla(${hue},100%,75%,0)`);
    grad.addColorStop(0.15, `hsla(${hue},100%,78%,${alpha * 0.85})`);
    grad.addColorStop(0.8, `hsla(${hue},100%,75%,${alpha * 0.5})`);
    grad.addColorStop(1, `hsla(${hue},100%,75%,0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = thick;
    ctx.shadowColor = `hsl(${hue},100%,70%)`;
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  }

  // Intense central bloom at VP
  const bloom = ctx.createRadialGradient(VP.x, VP.y, 0, VP.x, VP.y, 180);
  bloom.addColorStop(0, `rgba(255,220,200,${0.22 + 0.06 * Math.sin(t * 1.1)})`);
  bloom.addColorStop(0.2, `rgba(255,120,180,0.12)`);
  bloom.addColorStop(0.6, `rgba(180,60,160,0.05)`);
  bloom.addColorStop(1, "transparent");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, W, H);
}

// ── Post FX ───────────────────────────────────────────────────────────────────
function drawPostFX(ctx, t) {
  // Subtle scanlines
  for (let i = 0; i < H; i += 3) {
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    ctx.fillRect(0, i, W, 1);
  }
  // Vignette — slightly teal-tinted edges like reference
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.12, W / 2, H / 2, H * 0.8);
  vg.addColorStop(0, "transparent");
  vg.addColorStop(0.7, "rgba(0,20,30,0.3)");
  vg.addColorStop(1, "rgba(0,10,20,0.85)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

// ── Main render ───────────────────────────────────────────────────────────────
function draw(ctx, t) {
  ctx.clearRect(0, 0, W, H);
  drawSky(ctx, t);
  drawCityLayers(ctx, t);
  drawRoad(ctx, t);
  drawWarpBeams(ctx, t);
  drawParticles(ctx, t);
  drawPostFX(ctx, t);
}

export default function CyberpunkWarp() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const t0Ref = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const loop = (ts) => {
      if (!t0Ref.current) t0Ref.current = ts;
      draw(ctx, (ts - t0Ref.current) / 1000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      background: "#060410",
      overflow: "hidden",
    }}>
      <canvas
        ref={canvasRef}
        width={W} height={H}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}