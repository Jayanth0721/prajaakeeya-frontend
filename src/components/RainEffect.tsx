import React, { useEffect, useRef } from 'react';

interface RainDrop {
  x: number;
  y: number;
  vy: number;
  vx: number;
  length: number;
  opacity: number;
  layer: number; // 0: background, 1: midground, 2: foreground
  weight: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  layer: number;
}

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
}

interface Bolt {
  segments: Segment[];
}

const RainEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Config parameters
    const maxDrops = 180;
    const drops: RainDrop[] = [];
    const ripples: Ripple[] = [];
    
    let lastLightningTime = Date.now() - 10000; // First flash in 10 seconds
    let nextLightningDelay = 15000 + Math.random() * 20000; // 15 to 35 seconds
    let lightningStartTime = 0;
    let activeBolts: Bolt[] = [];

    // Helper to generate branching lightning bolts
    const generateLightningBolts = (w: number, h: number): Bolt[] => {
      const bolts: Bolt[] = [];
      const numBolts = Math.random() > 0.6 ? 2 : 1;

      const generateBranch = (
        segments: Segment[],
        sx: number,
        sy: number,
        ex: number,
        ey: number,
        depth: number,
        currentWidth: number,
        branchesLeft: number
      ) => {
        let x = sx;
        let y = sy;

        for (let i = 0; i < depth; i++) {
          const progress = i / depth;
          const targetX = sx + (ex - sx) * progress;
          const targetY = sy + (ey - sy) * progress;

          // Add a jitter factor
          const jitterX = (Math.random() - 0.5) * (35 * (depth / 20));
          const jitterY = (Math.random() - 0.5) * 8;

          const nextX = targetX + jitterX;
          const nextY = targetY + jitterY;

          segments.push({
            x1: x,
            y1: y,
            x2: nextX,
            y2: nextY,
            width: currentWidth,
          });

          x = nextX;
          y = nextY;

          // Procedural branching off
          if (branchesLeft > 0 && Math.random() < 0.15 && i < depth - 2) {
            const branchEndX = x + (Math.random() - 0.5) * 150;
            const branchEndY = y + (Math.random() * 0.35 + 0.15) * (h - y);
            generateBranch(
              segments,
              x,
              y,
              branchEndX,
              branchEndY,
              Math.max(5, Math.floor(depth * 0.6)),
              currentWidth * 0.55,
              branchesLeft - 1
            );
          }
        }
      };

      for (let b = 0; b < numBolts; b++) {
        const startX = Math.random() * w;
        const endX = startX + (Math.random() - 0.5) * (w * 0.4);
        const endY = h * (0.5 + Math.random() * 0.4); // reach 50% to 90% down the screen
        const segments: Segment[] = [];
        generateBranch(segments, startX, 0, endX, endY, 20, 3.5, 2);
        bolts.push({ segments });
      }

      return bolts;
    };

    // Initialize drops in 3 layers for parallax
    for (let i = 0; i < maxDrops; i++) {
      // Distribute layers: 60% background, 30% midground, 10% foreground
      const rand = Math.random();
      let layer = 0;
      let vy = 6 + Math.random() * 4; // slow background speed
      let length = 8 + Math.random() * 6;
      let opacity = 0.15 + Math.random() * 0.15;
      let weight = 0.8;

      if (rand > 0.6 && rand <= 0.9) {
        layer = 1;
        vy = 12 + Math.random() * 6;
        length = 18 + Math.random() * 10;
        opacity = 0.35 + Math.random() * 0.25;
        weight = 1.4;
      } else if (rand > 0.9) {
        layer = 2;
        vy = 18 + Math.random() * 8;
        length = 28 + Math.random() * 12;
        opacity = 0.65 + Math.random() * 0.25;
        weight = 2.2;
      }

      drops.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        vy,
        vx: 0, // dynamic wind overrides this
        length,
        opacity,
        layer,
        weight,
      });
    }

    const draw = () => {
      const now = Date.now();
      
      // Dynamic wind shift using sine waves
      const windMultiplier = Math.sin(now * 0.0004) * 2.0 + Math.cos(now * 0.0001) * 0.8 - 0.8;

      // Handle lightning trigger
      if (now - lastLightningTime > nextLightningDelay) {
        lastLightningTime = now;
        lightningStartTime = now;
        nextLightningDelay = 20000 + Math.random() * 25000; // next flash in 20-45 seconds
        activeBolts = generateLightningBolts(width, height);
      }

      ctx.clearRect(0, 0, width, height);

      // Render lightning if active
      if (lightningStartTime > 0) {
        const elapsed = now - lightningStartTime;
        if (elapsed < 900) {
          let alpha = 0;
          if (elapsed < 120) {
            alpha = (elapsed / 120) * 0.65;
          } else if (elapsed < 240) {
            alpha = 0.65 - ((elapsed - 120) / 120) * 0.50;
          } else if (elapsed < 380) {
            alpha = 0.15 + ((elapsed - 240) / 140) * 0.75;
          } else {
            alpha = 0.90 * (1 - (elapsed - 380) / 520);
          }

          if (alpha > 0.01) {
            // Screen flash glow
            ctx.fillStyle = `rgba(240, 245, 255, ${alpha * 0.22})`;
            ctx.fillRect(0, 0, width, height);

            // Draw branching lightning bolts
            if (activeBolts.length > 0) {
              ctx.shadowColor = 'rgba(230, 242, 255, 0.95)';
              ctx.shadowBlur = 18;
              activeBolts.forEach((bolt) => {
                bolt.segments.forEach((seg) => {
                  ctx.beginPath();
                  ctx.moveTo(seg.x1, seg.y1);
                  ctx.lineTo(seg.x2, seg.y2);
                  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
                  ctx.lineWidth = seg.width;
                  ctx.lineCap = 'round';
                  ctx.stroke();
                });
              });
              ctx.shadowBlur = 0; // reset glow
            }
          }
        } else {
          activeBolts = [];
        }
      }

      // Update and draw splashes / ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.opacity -= 0.02;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        // Render ripple as a 3D-perspective squashed ellipse
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.28, 0, 0, Math.PI * 2);
        
        // Color depends on layer for depth
        const baseColor = r.layer === 0 ? '110, 135, 175' : r.layer === 1 ? '140, 175, 215' : '174, 202, 232';
        ctx.strokeStyle = `rgba(${baseColor}, ${r.opacity})`;
        ctx.lineWidth = r.layer === 0 ? 0.6 : r.layer === 1 ? 1.0 : 1.4;
        ctx.stroke();
      }

      // Update and draw rain drops
      for (let i = 0; i < maxDrops; i++) {
        const drop = drops[i];

        // Apply parallax speed modifiers to the wind force
        const layerWindSpeed = windMultiplier * (0.4 + drop.layer * 0.5);
        drop.vx = layerWindSpeed;

        // Draw drop path
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.vx * 0.6, drop.y + drop.length);

        const dropColor = drop.layer === 0 
          ? `rgba(90, 120, 160, ${drop.opacity * 0.6})`
          : drop.layer === 1
            ? `rgba(130, 160, 200, ${drop.opacity})`
            : `rgba(180, 210, 245, ${drop.opacity})`;

        ctx.strokeStyle = dropColor;
        ctx.lineWidth = drop.weight;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Update positions
        drop.y += drop.vy;
        drop.x += drop.vx;

        // Reset if went off screen boundaries
        if (drop.y > height - 10) {
          // Chance to trigger a landing ripple at the bottom of the viewport
          if (Math.random() < 0.6) {
            const rippleY = height - 2 - Math.random() * 20; // slightly randomized ground plane
            const baseMaxRadius = drop.layer === 0 ? 4 : drop.layer === 1 ? 8 : 14;
            ripples.push({
              x: drop.x,
              y: rippleY,
              radius: 1,
              maxRadius: baseMaxRadius + Math.random() * 4,
              opacity: drop.opacity * 0.7,
              speed: 0.2 + Math.random() * 0.25,
              layer: drop.layer,
            });
          }

          // Reset drop back to top
          drop.x = Math.random() * width;
          drop.y = -drop.length - Math.random() * 50;
        } else if (drop.x < -40) {
          drop.x = width + 20;
          drop.y = Math.random() * height - 30;
        } else if (drop.x > width + 40) {
          drop.x = -20;
          drop.y = Math.random() * height - 30;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default RainEffect;
