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
function drawSky(ctx, t, isDark) {
  const sky = ctx.createRadialGradient(VP.x, VP.y * 0.4, 0, VP.x, VP.y * 1.2, H * 1.3);
  
  if (isDark) {
    // Dark night-city palette: very dark blue → indigo → deep purple
    sky.addColorStop(0.0,  "#0a1f3f"); // very dark blue center
    sky.addColorStop(0.15, "#1a2a5f"); // dark blue-purple
    sky.addColorStop(0.35, "#2a3a7f"); // indigo
    sky.addColorStop(0.55, "#1a2a5f"); // back to dark blue-purple
    sky.addColorStop(0.75, "#0f1a3a"); // very dark indigo
    sky.addColorStop(0.92, "#050f20"); // near black
    sky.addColorStop(1.0,  "#020508"); // pure black
  } else {
    // Bright landing page: cyan → magenta → purple
    sky.addColorStop(0.0,  "#00f0ff"); // bright cyan at center
    sky.addColorStop(0.15, "#d863ff"); // bright magenta
    sky.addColorStop(0.35, "#9040e8"); // deep purple
    sky.addColorStop(0.55, "#5020b8"); // richer purple
    sky.addColorStop(0.75, "#2a1a6a"); // deep purple-indigo
    sky.addColorStop(0.92, "#0f0f3a"); // dark indigo
    sky.addColorStop(1.0,  "#050520"); // very dark indigo
  }
  
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Atmospheric haze
  ctx.save();
  const hazeAlpha = isDark ? 0.06 : 0.15;
  ctx.globalAlpha = hazeAlpha;
  const haze = ctx.createRadialGradient(VP.x, VP.y, W * 0.1, VP.x, VP.y, W * 0.8);
  
  if (isDark) {
    haze.addColorStop(0.0, "rgba(100,150,200,0.3)");
    haze.addColorStop(0.3, "rgba(80,100,150,0.15)");
  } else {
    haze.addColorStop(0.0, "rgba(0,240,255,0.6)");
    haze.addColorStop(0.3, "rgba(216,99,255,0.3)");
  }
  
  haze.addColorStop(1, "transparent");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // Stars
  const sr = mkRand(42);
  const starCount = isDark ? 100 : 80;
  for (let i = 0; i < starCount; i++) {
    const sx = sr() * W;
    const sy = sr() * H * 0.6;
    const size = sr() * 1.3;
    const twinkle = 0.2 + 0.5 * Math.abs(Math.sin(t * 0.7 + i * 0.73));
    const isCyan = sr() > 0.5;
    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, size * 0.35, 0, Math.PI * 2);
    
    if (isDark) {
      // Dim, cool-toned stars for night
      ctx.fillStyle = isCyan
        ? `rgba(100,180,255,${twinkle * 0.4})`
        : `rgba(150,120,200,${twinkle * 0.35})`;
    } else {
      // Bright stars for landing page
      ctx.fillStyle = isCyan
        ? `rgba(0,240,255,${twinkle * 0.7})`
        : `rgba(216,99,255,${twinkle * 0.6})`;
    }
    
    if (size > 1.2) { 
      ctx.shadowColor = isCyan ? (isDark ? "#6490d0" : "#00f0ff") : (isDark ? "#9060b0" : "#d863ff");
      ctx.shadowBlur = isDark ? 2 : 4; 
    }
    ctx.fill();
    ctx.restore();

    // Glow for brighter stars
    if (size > 1.5) {
      ctx.save();
      ctx.globalAlpha = twinkle * (isDark ? 0.2 : 0.5);
      ctx.strokeStyle = isCyan ? (isDark ? "#6490d0" : "#00f0ff") : (isDark ? "#9060b0" : "#d863ff");
      ctx.lineWidth = isDark ? 0.3 : 0.8;
      ctx.beginPath();
      ctx.moveTo(sx, sy - size * 2.5); ctx.lineTo(sx, sy + size * 2.5);
      ctx.moveTo(sx - size * 2.5, sy); ctx.lineTo(sx + size * 2.5, sy);
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

  // Keep a stable canonical building box so vertical stacking math matches drawn height.
  const baseW = maxW;
  const baseH = maxH;
  const style = Math.floor(r() * 4);
  const cx = baseW / 2;

  // Segments are coherent rectangular masses that form the silhouette.
  const segments = [];
  let y = 0;
  const pushSegment = (wFrac, hFrac) => {
    const h = baseH * hFrac;
    const w = baseW * wFrac;
    const x = cx - w / 2;
    segments.push({ x, y, w, h });
    y += h;
  };

  if (style === 0) {
    pushSegment(1.00, 0.56);
    pushSegment(0.78, 0.26);
    pushSegment(0.60, 0.18);
  } else if (style === 1) {
    pushSegment(0.92, 0.44);
    pushSegment(0.92, 0.24);
    pushSegment(0.70, 0.20);
    pushSegment(0.52, 0.12);
  } else if (style === 2) {
    pushSegment(1.00, 0.34);
    pushSegment(0.84, 0.26);
    pushSegment(0.68, 0.22);
    pushSegment(0.54, 0.18);
  } else {
    pushSegment(0.88, 0.62);
    pushSegment(0.72, 0.22);
    pushSegment(0.44, 0.16);
  }

  // Build windows per segment only, guaranteeing windows always belong to body mass.
  const windows = [];
  const wr = mkRand(seed + 1);
  segments.forEach((seg, segIdx) => {
    if (seg.w < 18 || seg.h < 20) return;
    const padX = Math.max(2.5, seg.w * 0.08);
    const padY = Math.max(3, seg.h * 0.08);
    const usableW = seg.w - padX * 2;
    const usableH = seg.h - padY * 2;
    if (usableW < 10 || usableH < 10) return;
    const cols = Math.max(1, Math.floor(usableW / 13));
    const rows = Math.max(1, Math.floor(usableH / 16));
    const cellW = usableW / cols;
    const cellH = usableH / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ww = Math.max(1, cellW - 3);
        const wh = Math.max(1, cellH - 4);
        windows.push({
          x: seg.x + padX + col * cellW + (cellW - ww) * 0.5,
          y: seg.y + padY + row * cellH + (cellH - wh) * 0.5,
          w: ww,
          h: wh,
          segIdx,
          lit: wr() > 0.38,
          warm: wr() > 0.52,
          flick: wr() > 0.95,
        });
      }
    }
  });

  // Keep architectural accents attached to actual building mass.
  const topSeg = segments[segments.length - 1];
  const spireBaseX = topSeg.x + topSeg.w * 0.5;
  const spireBaseY = topSeg.y + topSeg.h;
  const spire = r() > 0.52 ? 28 + r() * 78 : 0;
  const hasLedge = r() > 0.8;
  const ledgeSeg = segments[Math.max(0, segments.length - 2)];
  const ledgeY = ledgeSeg.y + ledgeSeg.h * (0.45 + r() * 0.25);
  const ledgeW = ledgeSeg.w * (0.62 + r() * 0.18);

  const data = {
    baseW,
    baseH,
    segments,
    windows,
    spire,
    spireBaseX,
    spireBaseY,
    hasLedge,
    ledgeY,
    ledgeW,
  };
  BLDG_CACHE.set(key, data);
  return data;
}

function pathBuilding(ctx, segments, sx, sy) {
  ctx.beginPath();
  segments.forEach(seg => {
    ctx.rect(sx(seg.x), sy(seg.y + seg.h), seg.w * (sx(1) - sx(0)), seg.h * (sy(0) - sy(1)));
  });
}

// ── Draw one building ─────────────────────────────────────────────────────────
function drawBuilding(ctx, bx, by, scaleX, scaleY, seed, side, t, layerAlpha, tint) {
  const prof = getBuildingProfile(seed, 160, 400);
  const {
    baseW,
    baseH,
    segments,
    windows,
    spire,
    spireBaseX,
    spireBaseY,
    hasLedge,
    ledgeY,
    ledgeW,
  } = prof;
  const fw = baseW * scaleX;
  const fh = baseH * scaleY;
  if (fw < 2 || fh < 2) return;

  // Map pts to screen
  const sx = (px) => bx + px * scaleX;
  const sy = (py) => by - py * scaleY; // y grows upward

  // Body fill — match reference: dark desaturated blue-purple solids
  ctx.save();
  ctx.globalAlpha = layerAlpha;

  // Silhouette body is drawn first as one coherent mass.
  if (segments.length > 0) {
    pathBuilding(ctx, segments, sx, sy);
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

  // Windows are clipped to body mass, preventing orphan/floating windows.
  if (segments.length > 0) {
    ctx.save();
    pathBuilding(ctx, segments, sx, sy);
    ctx.clip();

    windows.forEach(w => {
      const wx = sx(w.x), wy = sy(w.y + w.h);
      const ww = Math.max(1, w.w * scaleX), wh = Math.max(1, w.h * scaleY);
      if (!w.lit) return;
      if (w.flick && Math.sin(t * 9.1 + seed * 0.4 + w.x) > 0.3) return;
      ctx.shadowBlur = 0;
      if (w.warm) {
        ctx.fillStyle = `rgba(255,200,100,0.65)`;
      } else {
        ctx.fillStyle = Math.sin(seed + w.x) > 0
          ? `rgba(216,99,255,0.65)`
          : `rgba(0,240,255,0.6)`;
      }
      ctx.fillRect(wx, wy, ww, wh);
      if (scaleX > 0.7) {
        ctx.save();
        ctx.shadowColor = w.warm ? "#ffc860" : (Math.sin(seed + w.x) > 0 ? "#d863ff" : "#00f0ff");
        ctx.shadowBlur = 5 * scaleX;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(wx, wy, ww, wh);
        ctx.restore();
      }
    });

    ctx.restore();
  }

  // Attached ledge only on sufficiently large/near buildings.
  if (hasLedge && scaleX > 0.45 && layerAlpha > 0.55) {
    ctx.shadowBlur = 0;
    const lx = sx((baseW - ledgeW) * 0.5);
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

  // Spire anchored to the top segment.
  if (spire > 0 && scaleX > 0.25) {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = tint.edge;
    ctx.lineWidth = 1.2 * scaleX;
    ctx.shadowColor = tint.edge; ctx.shadowBlur = 8;
    const spireTopY = sy(spireBaseY + spire);
    ctx.beginPath();
    ctx.moveTo(sx(spireBaseX), sy(spireBaseY));
    ctx.lineTo(sx(spireBaseX), spireTopY);
    ctx.stroke();
    // Tip
    ctx.beginPath();
    ctx.arc(sx(spireBaseX), spireTopY, 2 * scaleX, 0, Math.PI * 2);
    ctx.fillStyle = tint.edge;
    ctx.shadowBlur = 12;
    ctx.fill();
  }

  ctx.restore();
}

// ── City layer — left or right side buildings ────────────────────────────────
const LAYER_DEFS = [
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

// Tints per depth — sunset synthwave palette (muted, atmospheric)
function getTint(depth, side, isDark) {
  if (isDark) {
    const t0 = { // far
      dark:  "rgba(15,25,45,0.8)",
      mid:   "rgba(25,35,60,0.7)",
      light: "rgba(35,50,80,0.6)",
      edge:  "rgba(80,120,160,0.25)",
    };
    const t1 = { // near
      dark:  "rgba(5,10,20,0.9)",
      mid:   "rgba(10,15,30,0.85)",
      light: "rgba(15,25,45,0.75)",
      edge:  side === "L" ? "rgba(100,150,200,0.3)" : "rgba(80,120,160,0.3)",
    };
    const f = depth;
    return {
      dark:  lerpColor(t0.dark,  t1.dark,  f),
      mid:   lerpColor(t0.mid,   t1.mid,   f),
      light: lerpColor(t0.light, t1.light, f),
      edge:  f > 0.5 ? t1.edge : t0.edge,
    };
  } else {
    const t0 = { // far
      dark:  "rgba(20,30,60,0.8)",
      mid:   "rgba(30,40,80,0.7)",
      light: "rgba(40,50,100,0.6)",
      edge:  "rgba(128,200,216,0.4)",
    };
    const t1 = { // near
      dark:  "rgba(10,10,30,0.9)",
      mid:   "rgba(15,15,40,0.85)",
      light: "rgba(25,25,55,0.75)",
      edge:  side === "L" ? "rgba(255,100,200,0.5)" : "rgba(128,200,255,0.5)",
    };
    const f = depth;
    return {
      dark:  lerpColor(t0.dark,  t1.dark,  f),
      mid:   lerpColor(t0.mid,   t1.mid,   f),
      light: lerpColor(t0.light, t1.light, f),
      edge:  f > 0.5 ? t1.edge : t0.edge,
    };
  }
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
    hFrac: 0.68 + r() * 0.32,
  }));
  LAYER_BLDG_COUNTS.set(key, arr);
  return arr;
}

function drawCityLayers(ctx, t, isDark) {
  // Sort back to front
  const sorted = [...LAYER_DEFS].sort((a, b) => a.depth - b.depth);

  sorted.forEach(layer => {
    const { side, depth, x: xFrac, wf, hf, seed } = layer;
    const layerW = W * wf;
    const maxH = H * hf;
    const groundY = VP.y + (H - VP.y) * (0.05 + depth * 0.15);
    const tint = getTint(depth, side, isDark);
    const alpha = 0.52 + depth * 0.46;

    const scrollRate = SPEED * 150 * (0.06 + depth * 0.94);
    const scrollY = (t * scrollRate);

    const count = 6;
    const bldgs = getLayerBuildings(seed, count, wf);
    const totalH = bldgs.reduce((s, b) => s + b.hFrac * maxH, 0);
    const loopY = scrollY % totalH;

    // Clip to side strip
    ctx.save();
    const clipX = side === "L" ? 0 : W * xFrac;
    ctx.beginPath();
    ctx.rect(clipX, 0, layerW, H);
    ctx.clip();

    // Draw buildings stacked vertically
    let yOff = -loopY;
    let bi = 0;
    while (yOff < H + 50) {
      const b = bldgs[((bi % count) + count) % count];
      const bh = b.hFrac * maxH;
      const bx = side === "L" ? 0 : W * xFrac;
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
function drawRoad(ctx, t, isDark) {
  const roadTop = VP.y + (H - VP.y) * 0.02;

  // Very dark road base — deep blacks and navy
  const rg = ctx.createLinearGradient(0, roadTop, 0, H);
  if (isDark) {
    rg.addColorStop(0, "#050308");
    rg.addColorStop(0.4, "#080510");
    rg.addColorStop(1, "#020105");
  } else {
    rg.addColorStop(0, "#0a0612");
    rg.addColorStop(0.4, "#0d0818");
    rg.addColorStop(1, "#04020a");
  }
  ctx.fillStyle = rg;
  ctx.fillRect(0, roadTop, W, H - roadTop);

  // Bloom effect
  const bloom = ctx.createRadialGradient(VP.x, VP.y * 0.8, 0, VP.x, VP.y + (H - VP.y) * 0.4, W * 0.6);
  if (isDark) {
    bloom.addColorStop(0.0, "rgba(80,120,180,0.08)");
    bloom.addColorStop(0.15, "rgba(60,90,150,0.04)");
    bloom.addColorStop(0.4, "rgba(50,70,120,0.02)");
  } else {
    bloom.addColorStop(0.0, "rgba(0,240,255,0.15)");
    bloom.addColorStop(0.15, "rgba(216,99,255,0.1)");
    bloom.addColorStop(0.4, "rgba(120,80,180,0.04)");
  }
  bloom.addColorStop(1, "transparent");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, roadTop, W, H - roadTop);

  // Perspective grid on ground
  ctx.save();
  ctx.strokeStyle = isDark ? "rgba(80,120,160,0.06)" : "rgba(128,200,216,0.12)";
  ctx.lineWidth = isDark ? 0.5 : 0.8;
  
  // Horizontal grid lines
  for (let i = 0; i < 12; i++) {
    const frac = i / 11;
    const y = VP.y + (H - VP.y) * frac;
    const xSpread = W * 0.4 * frac;
    ctx.beginPath();
    ctx.moveTo(VP.x - xSpread, y);
    ctx.lineTo(VP.x + xSpread, y);
    ctx.stroke();
  }
  
  // Vertical grid lines
  for (let i = 0; i < 8; i++) {
    const frac = (i - 3.5) / 7;
    ctx.beginPath();
    ctx.moveTo(VP.x + frac * W * 0.4, VP.y);
    ctx.lineTo(VP.x + frac * W * 0.9, H);
    ctx.stroke();
  }
  ctx.restore();

  // Wet reflections
  const wr = mkRand(77);
  for (let i = 0; i < 3; i++) {
    const px = VP.x + (wr() - 0.5) * W * 0.6;
    const py = roadTop + wr() * (H - roadTop) * 0.7;
    const prx = 12 + wr() * 30, pry = prx * 0.15;
    const isCyan = wr() > 0.6;
    const pG = ctx.createRadialGradient(px, py, 0, px, py, prx);
    if (isDark) {
      const hue = isCyan ? 200 : 250;
      pG.addColorStop(0, `hsla(${hue},60%,40%,0.06)`);
    } else {
      const hue = isCyan ? 180 : 295;
      pG.addColorStop(0, `hsla(${hue},100%,50%,0.12)`);
    }
    pG.addColorStop(1, "transparent");
    ctx.fillStyle = pG;
    ctx.beginPath(); ctx.ellipse(px, py, prx, pry, 0, 0, Math.PI * 2); ctx.fill();
  }
}

// ── Floating particles ─
const PARTICLES = Array.from({ length: 120 }, (_, i) => {
  const r = mkRand(i * 1337);
  return {
    x: r() * W,
    y: r() * H,
    size: 1 + r() * 4,
    speed: 0.15 + r() * 0.5,
    hue: r() > 0.6 ? 170 : (r() > 0.3 ? 340 : 60),
    phase: r(),
    square: r() > 0.55,
    drift: (r() - 0.5) * 0.4,
  };
});

function drawParticles(ctx, t, isDark) {
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

// ── Warp beams ────────────────────────────────────────
function drawWarpBeams(ctx, t, isDark) {
  const rand = mkRand(9981);
  const N = 38;
  for (let i = 0; i < N; i++) {
    const angle = rand() * Math.PI * 2;
    const spd = 1 + rand() * 1.0;
    const hue = rand() > 0.5
      ? 300 + rand() * 60
      : 160 + rand() * 40;
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

  const bloom = ctx.createRadialGradient(VP.x, VP.y, 0, VP.x, VP.y, 180);
  bloom.addColorStop(0, `rgba(255,220,200,${0.22 + 0.06 * Math.sin(t * 1.1)})`);
  bloom.addColorStop(0.2, `rgba(255,120,180,0.12)`);
  bloom.addColorStop(0.6, `rgba(180,60,160,0.05)`);
  bloom.addColorStop(1, "transparent");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, W, H);
}

// ── Post FX ───────────────────────────────────────────────────────────────────
function drawPostFX(ctx, t, isDark) {
  // Subtle scanlines
  for (let i = 0; i < H; i += 3) {
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    ctx.fillRect(0, i, W, 1);
  }
  // Vignette
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.12, W / 2, H / 2, H * 0.8);
  vg.addColorStop(0, "transparent");
  vg.addColorStop(0.7, "rgba(0,20,30,0.3)");
  vg.addColorStop(1, "rgba(0,10,20,0.85)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

function draw(ctx, t, isDark) {
  ctx.clearRect(0, 0, W, H);
  drawSky(ctx, t, isDark);
  drawCityLayers(ctx, t, isDark);
  drawRoad(ctx, t, isDark);
  drawWarpBeams(ctx, t, isDark);
  drawParticles(ctx, t, isDark);
  drawPostFX(ctx, t, isDark);
}

export default function CyberpunkWarp({ isDark = false }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const t0Ref = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const loop = (ts) => {
      if (!t0Ref.current) t0Ref.current = ts;
      draw(ctx, (ts - t0Ref.current) / 1000, isDark);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDark]);

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      background: isDark ? "#020408" : "#060410",
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
