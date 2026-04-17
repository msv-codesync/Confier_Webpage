import React, { useEffect, useRef } from 'react';

export default function TopDownPond() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const isMobile = width < 768;
    let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;

    let waterGrad;
    let surfaceGlow;
    let midVeil;
    let lowerDepth;
    let grainLayer = null;
    let grainIdleHandle = null;
    let grainBuildGeneration = 0;

    const rebuildGradientCaches = () => {
      waterGrad = ctx.createLinearGradient(0, 0, 0, height);
      waterGrad.addColorStop(0, '#4fa8b8');
      waterGrad.addColorStop(0.32, '#2c8a9f');
      waterGrad.addColorStop(0.68, '#0f6d82');
      waterGrad.addColorStop(1, '#0a4f61');

      surfaceGlow = ctx.createLinearGradient(0, 0, 0, height * 0.45);
      surfaceGlow.addColorStop(0, 'rgba(180, 235, 240, 0.14)');
      surfaceGlow.addColorStop(1, 'rgba(180, 235, 240, 0)');

      midVeil = ctx.createLinearGradient(0, height * 0.2, 0, height * 0.9);
      midVeil.addColorStop(0, 'rgba(255, 255, 255, 0)');
      midVeil.addColorStop(0.45, 'rgba(18, 84, 101, 0.05)');
      midVeil.addColorStop(1, 'rgba(6, 43, 56, 0.12)');

      lowerDepth = ctx.createLinearGradient(0, height * 0.7, 0, height);
      lowerDepth.addColorStop(0, 'rgba(0, 0, 0, 0)');
      lowerDepth.addColorStop(1, 'rgba(6, 43, 56, 0.16)');
    };

    const buildGrainLayer = () => {
      const mobile = width < 768;
      const grainCanvas = document.createElement('canvas');
      grainCanvas.width = Math.max(1, Math.floor(width));
      grainCanvas.height = Math.max(1, Math.floor(height));
      const gctx = grainCanvas.getContext('2d');
      const grainCount = mobile
        ? 64
        : Math.min(170, Math.max(85, Math.floor((width * height) / 10000)));
      for (let i = 0; i < grainCount; i += 1) {
        gctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03 + 0.01})`;
        gctx.fillRect(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 0.85 + 0.2,
          Math.random() * 0.85 + 0.2
        );
      }
      grainLayer = grainCanvas;
    };

    const cancelScheduledGrain = () => {
      if (grainIdleHandle == null) return;
      if (typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(grainIdleHandle);
      } else {
        clearTimeout(grainIdleHandle);
      }
      grainIdleHandle = null;
    };

    const scheduleGrainRebuild = () => {
      cancelScheduledGrain();
      const gen = ++grainBuildGeneration;
      const run = () => {
        grainIdleHandle = null;
        if (gen !== grainBuildGeneration) return;
        buildGrainLayer();
      };
      if (typeof requestIdleCallback !== 'undefined') {
        grainIdleHandle = requestIdleCallback(run, { timeout: 450 });
      } else {
        grainIdleHandle = setTimeout(run, 40);
      }
    };

    rebuildGradientCaches();
    scheduleGrainRebuild();
    const scaleFactor = isMobile ? 0.6 : 1;
    const mouse = {
      x: -1000,
      y: -1000,
      radius: isMobile ? 220 : 360,
      safeDistance: isMobile ? 90 : 120,
      active: false,
      lastSeen: 0
    };

    // Helpers for softer blending (avoid harsh “metallic/tiger” contrast)
    const hexToRgba = (hex, alpha) => {
      const cleaned = String(hex).replace('#', '');
      const full = cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned;
      const num = parseInt(full, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      mouse.lastSeen = performance.now();
    };

    const handleTouch = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
        mouse.lastSeen = performance.now();
      }
    };

    const handleReset = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleReset);
    window.addEventListener('mouseout', handleReset);
    
    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const mobile = width < 768;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      rebuildGradientCaches();
      scheduleGrainRebuild();
    };
    window.addEventListener('resize', handleResize);

    class Shrimp {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = (Math.random() * 25 + 40) * scaleFactor;
        this.baseSpeed = Math.random() * 0.3 + 0.2;
        this.currentSpeedMultiplier = 1;
        this.speedX = (Math.random() - 0.5) * this.baseSpeed;
        this.speedY = (Math.random() - 0.5) * this.baseSpeed;
        this.angle = Math.atan2(this.speedY, this.speedX);
        
        this.swimCycle = Math.random() * Math.PI * 2;
        this.targetAngle = this.angle;
        this.calmDrift = 0;
        this.escapeEase = 0;
        
        // Assign pattern type (7-8 variants)
        this.patternType = Math.floor(Math.random() * 8);
      }

      // Define colors based on pattern type - subtle variations
      getColors() {
        const patterns = [
          // All variants use same tan/brown base with subtle shifts
          { main: '#e3c08f', dark: '#a66a45', light: '#f1d7b1', leg: 'rgba(166, 106, 69, 0.38)' },
          { main: '#e0bb88', dark: '#9e6241', light: '#f0d0a2', leg: 'rgba(158, 98, 65, 0.38)' },
          { main: '#e7c792', dark: '#b0724a', light: '#f4e0b8', leg: 'rgba(176, 114, 74, 0.38)' },
          { main: '#dcb57f', dark: '#8f563a', light: '#eed0a8', leg: 'rgba(143, 86, 58, 0.38)' },
          { main: '#e4c08d', dark: '#a56945', light: '#f2d8af', leg: 'rgba(165, 105, 69, 0.38)' },
          { main: '#dfb985', dark: '#9a5f3e', light: '#f0d5b0', leg: 'rgba(154, 95, 62, 0.38)' },
          { main: '#e9c590', dark: '#b0734b', light: '#f6e1b8', leg: 'rgba(176, 115, 75, 0.38)' },
          { main: '#dfba8a', dark: '#9b623f', light: '#f1d4a9', leg: 'rgba(155, 98, 63, 0.38)' }
        ];
        return patterns[this.patternType];
      }

      update() {
        this.swimCycle += 0.08 * (this.baseSpeed * this.currentSpeedMultiplier);

        if (Math.random() < 0.012) {
          this.targetAngle += (Math.random() - 0.5) * 1.0;
        }

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetSpeedMultiplier = 1;

        let fleeVx = 0;
        let fleeVy = 0;
        let homeVx = 0;
        let homeVy = 0;

        if (mouse.active && distance < mouse.radius) {
          const raw = (mouse.radius - distance) / mouse.radius;
          // Slightly super-linear: lively mid-range reaction, still smooth at edge (no jolt).
          const force = Math.pow(raw, 1.22);
          const fleeAngle = Math.atan2(dy, dx) + Math.PI;

          // Steer heading toward escape: quick enough to feel alert, capped per frame for smooth arcs.
          const fleeDiff = Math.atan2(
            Math.sin(fleeAngle - this.targetAngle),
            Math.cos(fleeAngle - this.targetAngle)
          );
          const turnBlend = 0.1 + force * 0.22;
          this.targetAngle += fleeDiff * Math.min(turnBlend, 0.28);

          // Extra urgency only when almost under the cursor (keeps “no touch” without a hard shove).
          const inner =
            distance < mouse.safeDistance
              ? Math.max(0, 1 - distance / Math.max(mouse.safeDistance, 1))
              : 0;

          targetSpeedMultiplier = 1 + force * 10.5 + inner * 2.2;
          this.swimCycle += 0.26 * force + 0.12 * inner;
          this.calmDrift = 0;
          this.escapeEase = Math.min(1, this.escapeEase + 0.085);

          // Radial acceleration away from pointer — primary “dart” without position snaps.
          const nx = dx / (distance || 1);
          const ny = dy / (distance || 1);
          const biasStrength = this.baseSpeed * (1.75 + force * 6.2 + inner * 4.5);
          fleeVx = -nx * biasStrength;
          fleeVy = -ny * biasStrength;
        } else {
          // Return to calm quickly so the pond feels “full” again after pointer leaves.
          this.calmDrift = Math.min(1, this.calmDrift + 0.038);
          targetSpeedMultiplier = 1 + (0.22 * (1 - this.calmDrift));
          this.escapeEase = Math.max(0, this.escapeEase - 0.058);

          // Gentle pull toward pond centre — refills visual density without snapping.
          const cx = width * 0.5;
          const cy = height * 0.5;
          const hx = cx - this.x;
          const hy = cy - this.y;
          const distH = Math.hypot(hx, hy);
          if (distH > 40) {
            const urgency = (1 - this.calmDrift * 0.75) * (0.02 + (1 - this.escapeEase) * 0.042);
            homeVx = (hx / distH) * this.baseSpeed * urgency * 6.2;
            homeVy = (hy / distH) * this.baseSpeed * urgency * 6.2;
          }
        }

        // Ease speed toward target: responsive flee, soft landing when threat ends.
        this.currentSpeedMultiplier +=
          (targetSpeedMultiplier - this.currentSpeedMultiplier) * (0.058 + this.escapeEase * 0.072);

        const diff = this.targetAngle - this.angle;
        this.angle += Math.atan2(Math.sin(diff), Math.cos(diff)) * (0.072 + this.escapeEase * 0.068);

        const targetVx =
          Math.cos(this.angle) * this.baseSpeed * this.currentSpeedMultiplier + fleeVx + homeVx;
        const targetVy =
          Math.sin(this.angle) * this.baseSpeed * this.currentSpeedMultiplier + fleeVy + homeVy;

        // Inertia: quicker catch-up when fleeing, still smooth (no velocity step-change).
        const inertia = 0.118 + this.escapeEase * 0.092;
        this.speedX += (targetVx - this.speedX) * inertia;
        this.speedY += (targetVy - this.speedY) * inertia;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -150) this.x = width + 150;
        if (this.x > width + 150) this.x = -150;
        if (this.y < -150) this.y = height + 150;
        if (this.y > height + 150) this.y = -150;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const sz = this.size;
        const tailBeat = Math.sin(this.swimCycle) * 0.3;
        const colors = this.getColors();
        const { main, dark, light, leg } = colors;

        // Vector 1: Double Pair of Sweeping Antennae
        ctx.beginPath();
        ctx.moveTo(sz * 0.4, -sz * 0.1);
        ctx.quadraticCurveTo(sz * 1.0, -sz * 0.5, sz * 1.2, -sz * 0.2);
        ctx.moveTo(sz * 0.4, sz * 0.1);
        ctx.quadraticCurveTo(sz * 1.0, sz * 0.5, sz * 1.2, sz * 0.2);
        ctx.moveTo(sz * 0.4, -sz * 0.05);
        ctx.bezierCurveTo(sz * 0.8, -sz * 0.8, 0, -sz * 1.2, -sz * 1.5, -sz * 0.9);
        ctx.moveTo(sz * 0.4, sz * 0.05);
        ctx.bezierCurveTo(sz * 0.8, sz * 0.8, 0, sz * 1.2, -sz * 1.5, sz * 0.9);
        ctx.strokeStyle = `rgba(212, 165, 116, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Vector 2: Front walking legs and swimmer legs
        ctx.beginPath();
        for(let j=0; j<3; j++) {
            let offset = sz * 0.11 * j;
            ctx.moveTo(sz * 0.28 - offset, -sz * 0.12);
            ctx.quadraticCurveTo(sz * 0.38 - offset, -sz * 0.24, sz * 0.3 - offset, -sz * 0.44);
            ctx.moveTo(sz * 0.28 - offset, sz * 0.12);
            ctx.quadraticCurveTo(sz * 0.38 - offset, sz * 0.24, sz * 0.3 - offset, sz * 0.44);
        }
        ctx.strokeStyle = leg;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Vector 3: Carapace
        ctx.beginPath();
        ctx.moveTo(sz * 0.5, 0);
        ctx.quadraticCurveTo(sz * 0.34, -sz * 0.24, sz * 0.06, -sz * 0.22);
        ctx.quadraticCurveTo(-sz * 0.05, -sz * 0.18, 0, 0);
        ctx.quadraticCurveTo(-sz * 0.05, sz * 0.18, sz * 0.06, sz * 0.22);
        ctx.quadraticCurveTo(sz * 0.34, sz * 0.24, sz * 0.5, 0);
        ctx.closePath();
        
        const carapaceKey = `${this.patternType}_${Math.round(sz * 40)}`;
        if (this._carapaceGradKey !== carapaceKey) {
          this._carapaceGradKey = carapaceKey;
          const bodyGrad = ctx.createLinearGradient(0, -sz * 0.2, 0, sz * 0.2);
          if (this.patternType % 3 === 0) {
            bodyGrad.addColorStop(0, dark);
            bodyGrad.addColorStop(0.35, main);
            bodyGrad.addColorStop(0.5, main);
            bodyGrad.addColorStop(0.65, main);
            bodyGrad.addColorStop(1, dark);
          } else if (this.patternType % 3 === 1) {
            bodyGrad.addColorStop(0, main);
            bodyGrad.addColorStop(0.4, dark);
            bodyGrad.addColorStop(0.6, main);
            bodyGrad.addColorStop(1, main);
          } else {
            bodyGrad.addColorStop(0, dark);
            bodyGrad.addColorStop(0.5, main);
            bodyGrad.addColorStop(1, dark);
          }
          this._carapaceGrad = bodyGrad;
        }

        ctx.fillStyle = this._carapaceGrad;
        ctx.strokeStyle = dark;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // White speckles on carapace
        ctx.beginPath();
        ctx.arc(sz * 0.2, -sz * 0.1, sz * 0.02, 0, Math.PI * 2);
        ctx.arc(sz * 0.1, -sz * 0.12, sz * 0.03, 0, Math.PI * 2);
        ctx.arc(sz * 0.15, sz * 0.08, sz * 0.025, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        // Vector 4: Eyes
        ctx.beginPath();
        ctx.arc(sz * 0.4, -sz * 0.15, sz * 0.06, 0, Math.PI * 2);
        ctx.arc(sz * 0.4, sz * 0.15, sz * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = '#1a1410';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sz * 0.42, -sz * 0.17, sz * 0.015, 0, Math.PI * 2);
        ctx.arc(sz * 0.42, sz * 0.13, sz * 0.015, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Vector 5: Segmented Abdomen with pattern variations
        ctx.save();
        ctx.translate(0, 0);
        
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          let segWidth = sz * 0.2;
          let segHeight = sz * 0.2 - (i * sz * 0.025);
          
          ctx.translate(-sz * 0.15, 0);
          ctx.rotate(tailBeat * 0.2);
          
          // Draw segment: base + soft blended bands (NOT hard zebra/tiger flips)
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(0, 0, segWidth, segHeight, 0, 0, Math.PI * 2);
          ctx.clip();

          // Base body fill
          ctx.fillStyle = main;
          ctx.fillRect(-segWidth, -segHeight, segWidth * 2, segHeight * 2);

          // Soft “skin” lighting: highlight + shadow (matte, not metallic)
          ctx.fillStyle = hexToRgba(light, 0.16);
          ctx.beginPath();
          ctx.ellipse(-segWidth * 0.22, -segHeight * 0.18, segWidth * 0.55, segHeight * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = hexToRgba(dark, 0.10);
          ctx.beginPath();
          ctx.ellipse(segWidth * 0.18, segHeight * 0.22, segWidth * 0.45, segHeight * 0.38, 0, 0, Math.PI * 2);
          ctx.fill();

          const patternMode = this.patternType % 4;

          if (patternMode === 0) {
            // Subtle softened bands
            const bandCount = 2 + ((this.patternType + i) % 3); // 2..4
            ctx.filter = 'blur(0.7px)';
            for (let b = 0; b < bandCount; b++) {
              const t = (b + 1) / (bandCount + 1);
              const y = (-segHeight * 0.78) + t * (segHeight * 1.56);
              const bandH = segHeight * (0.12 + 0.03 * ((b + i) % 2));
              const a = 0.16 + 0.05 * ((b + this.patternType) % 2);
              ctx.fillStyle = hexToRgba(dark, a);
              ctx.fillRect(-segWidth * 1.05, y, segWidth * 2.1, bandH);
            }
            ctx.filter = 'none';
          } else if (patternMode === 1) {
            // Mottled (blotchy) variation, still subtle
            const blobCount = 5 + (this.patternType % 3);
            for (let b = 0; b < blobCount; b++) {
              const sx = (Math.sin((this.patternType + 1) * (b + 2)) * 0.5 + 0.5) * segWidth * 1.4 - segWidth * 0.7;
              const sy = (Math.cos((this.patternType + 3) * (b + 2)) * 0.5 + 0.5) * segHeight * 1.1 - segHeight * 0.55;
              const rr = segHeight * (0.05 + ((b + i) % 3) * 0.01);
              const a = 0.12 + 0.05 * ((b + i) % 2);
              ctx.fillStyle = hexToRgba(dark, a);
              ctx.beginPath();
              ctx.arc(sx, sy, rr, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            // Mixed gentle banding: only 1-2 faint bands
            const bandCount = 1 + (i % 2);
            ctx.filter = 'blur(0.65px)';
            for (let b = 0; b < bandCount; b++) {
              const t = 0.35 + 0.3 * b + 0.08 * Math.sin((this.patternType + i) * 1.7);
              const y = (-segHeight * 0.78) + t * (segHeight * 1.56);
              const bandH = segHeight * 0.13;
              ctx.fillStyle = hexToRgba(dark, 0.15);
              ctx.fillRect(-segWidth * 1.05, y, segWidth * 2.1, bandH);
            }
            ctx.filter = 'none';
          }

          // Texture speckles (soft, not bright/metallic)
          ctx.fillStyle = hexToRgba(light, 0.22);
          const spotR = sz * 0.014;
          ctx.beginPath();
          ctx.arc(0, segHeight * 0.08, spotR, 0, Math.PI * 2);
          ctx.fill();
          // Darker spot contrast
          ctx.fillStyle = hexToRgba(dark, 0.16);
          ctx.beginPath();
          ctx.arc(-segWidth * 0.12, segHeight * 0.04, spotR * 0.9, 0, Math.PI * 2);
          ctx.fill();

          if (i % 2 === 0) {
            ctx.fillStyle = hexToRgba(light, 0.18);
            ctx.beginPath();
            ctx.arc(sz * 0.035, -segHeight * 0.08, spotR * 0.85, 0, Math.PI * 2);
            ctx.arc(-sz * 0.03, segHeight * 0.18, spotR * 0.7, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();

          // Extremely subtle outline (reduces “robot/tiger armor” look)
          ctx.beginPath();
          ctx.ellipse(0, 0, segWidth, segHeight, 0, 0, Math.PI * 2);
          ctx.strokeStyle = hexToRgba(dark, 0.14);
          ctx.lineWidth = 0.45;
          ctx.stroke();

          // Swimmerets
          if(i < 4) {
             ctx.beginPath();
             ctx.moveTo(0, -segHeight * 0.8);
             ctx.lineTo(-sz * 0.1, -segHeight * 1.4);
             ctx.moveTo(0, segHeight * 0.8);
             ctx.lineTo(-sz * 0.1, segHeight * 1.4);
             ctx.strokeStyle = leg;
             ctx.lineWidth = 1.5;
             ctx.stroke();
          }

          // White dots per segment
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(0, segHeight * 0.5, sz * 0.02, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fill();
          }
        }

        // Vector 6: Tail Fan
        // Tail fan with a more shrimp-like spread
        ctx.beginPath();
        ctx.moveTo(-sz * 0.14, 0);
        ctx.quadraticCurveTo(-sz * 0.3, -sz * 0.06, -sz * 0.45, 0);
        ctx.quadraticCurveTo(-sz * 0.3, sz * 0.06, -sz * 0.14, 0);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(light, 0.42);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-sz * 0.14, -sz * 0.02);
        ctx.quadraticCurveTo(-sz * 0.26, -sz * 0.22, -sz * 0.53, -sz * 0.18);
        ctx.quadraticCurveTo(-sz * 0.38, -sz * 0.01, -sz * 0.14, 0);
        ctx.closePath();
        ctx.fillStyle = main;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-sz * 0.14, sz * 0.02);
        ctx.quadraticCurveTo(-sz * 0.26, sz * 0.22, -sz * 0.53, sz * 0.18);
        ctx.quadraticCurveTo(-sz * 0.38, sz * 0.01, -sz * 0.14, 0);
        ctx.closePath();
        ctx.fillStyle = main;
        ctx.fill();

        ctx.strokeStyle = hexToRgba(dark, 0.45);
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.14, 0);
        ctx.lineTo(-sz * 0.47, 0);
        ctx.moveTo(-sz * 0.18, -sz * 0.015);
        ctx.quadraticCurveTo(-sz * 0.3, -sz * 0.1, -sz * 0.48, -sz * 0.14);
        ctx.moveTo(-sz * 0.18, sz * 0.015);
        ctx.quadraticCurveTo(-sz * 0.3, sz * 0.1, -sz * 0.48, sz * 0.14);
        ctx.stroke();

        ctx.restore();
        ctx.restore();
      }
    }

    const shrimpCount = isMobile ? 16 : 28;
    const shrimpFlock = [];
    const minSpacing = isMobile ? 48 : 66;
    for (let i = 0; i < shrimpCount; i++) {
      const shrimp = new Shrimp();
      let attempts = 0;
      while (
        attempts < 60 &&
        shrimpFlock.some((other) => {
          const sx = other.x - shrimp.x;
          const sy = other.y - shrimp.y;
          return Math.sqrt(sx * sx + sy * sy) < minSpacing;
        })
      ) {
        shrimp.x = Math.random() * width;
        shrimp.y = Math.random() * height;
        attempts += 1;
      }
      shrimpFlock.push(shrimp);
    }

    const particleCount = isMobile ? 28 : 48;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.05 + 0.02
      });
    }

    let rafId = null;
    let time = 0;
    let heroVisible = true;

    const drawFrame = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = surfaceGlow;
      ctx.fillRect(0, 0, width, height * 0.45);

      ctx.fillStyle = midVeil;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = lowerDepth;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);

      if (grainLayer) {
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.translate(0, Math.sin(time * 0.008) * 0.75);
        ctx.drawImage(grainLayer, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // Soft water layer lines for realistic pond feel
      ctx.strokeStyle = `rgba(165, 230, 235, ${0.018 + Math.sin(time * 0.008) * 0.006})`;
      ctx.lineWidth = 0.5;
      for (let layer = 0; layer < 2; layer++) {
        const baseY = height * (0.3 + layer * 0.18);
        ctx.beginPath();
        for (let x = 0; x < width + 50; x += 60) {
          const y = baseY + Math.sin((x + time * (0.55 + layer * 0.08)) * 0.008 + layer) * (2.5 + layer);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Floating particles (algae/debris)
      particles.forEach(p => {
        p.y -= p.speed * Math.cos(time * 0.005 + p.x * 0.01);
        if (p.y < -20) p.y = height + 20;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 195, 188, ${p.opacity * 0.55})`;
        ctx.fill();
      });

      // Update and draw shrimp
      shrimpFlock.forEach(shrimp => {
        shrimp.update();
        shrimp.draw();
      });
    };

    const loop = () => {
      rafId = null;
      if (!heroVisible) return;
      drawFrame();
      rafId = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const startLoop = () => {
      if (heroVisible && rafId == null) rafId = requestAnimationFrame(loop);
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              heroVisible = entry?.isIntersecting ?? true;
              if (heroVisible) startLoop();
              else stopLoop();
            },
            // threshold 0.02 often kept the hero “invisible” to the observer at first paint → frozen pond
            { threshold: 0, rootMargin: '80px 0px 120px 0px' }
          )
        : null;

    let bootRafInner = null;
    let bootRafOuter = requestAnimationFrame(() => {
      bootRafOuter = null;
      bootRafInner = requestAnimationFrame(() => {
        bootRafInner = null;
        io?.observe(canvas);
        startLoop();
      });
    });

    return () => {
      if (bootRafOuter != null) cancelAnimationFrame(bootRafOuter);
      if (bootRafInner != null) cancelAnimationFrame(bootRafInner);
      cancelScheduledGrain();
      io?.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleReset);
      window.removeEventListener('mouseout', handleReset);
      window.removeEventListener('resize', handleResize);
      stopLoop();
    };

  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', inset: 0, width: '100%', height: '100%', 
        pointerEvents: 'none', zIndex: 0 
      }} 
    />
  );
}
