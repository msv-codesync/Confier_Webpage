import React, { useEffect, useRef } from 'react';

export default function TopDownPond() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const isMobile = width < 768;
    const scaleFactor = isMobile ? 0.6 : 1;
    const mouse = { x: -1000, y: -1000, radius: isMobile ? 150 : 300 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleTouch = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };
    
    const handleReset = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleReset);
    window.addEventListener('mouseout', handleReset);
    
    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
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
        
        // Assign pattern type (7-8 variants)
        this.patternType = Math.floor(Math.random() * 8);
      }

      // Define colors based on pattern type - subtle variations
      getColors() {
        const patterns = [
          // All variants use same tan/brown base with subtle shifts
          { main: '#d4a574', dark: '#c9956f', light: '#d9b089', leg: 'rgba(212, 165, 116, 0.4)' },
          { main: '#d0a070', dark: '#c89568', light: '#d9b089', leg: 'rgba(208, 160, 112, 0.4)' },
          { main: '#d8aa7c', dark: '#cb9d6f', light: '#e0b89a', leg: 'rgba(216, 170, 124, 0.4)' },
          { main: '#cc9d68', dark: '#bf8f5f', light: '#dab088', leg: 'rgba(204, 157, 104, 0.4)' },
          { main: '#d5a178', dark: '#c89a6f', light: '#dfb394', leg: 'rgba(213, 161, 120, 0.4)' },
          { main: '#d2a075', dark: '#c59867', light: '#dcb192', leg: 'rgba(210, 160, 117, 0.4)' },
          { main: '#cfa070', dark: '#c39862', light: '#d9b089', leg: 'rgba(207, 160, 112, 0.4)' },
          { main: '#d6a57a', dark: '#c99d70', light: '#dfb59a', leg: 'rgba(214, 165, 122, 0.4)' }
        ];
        return patterns[this.patternType];
      }

      update() {
        this.swimCycle += 0.08 * (this.baseSpeed * this.currentSpeedMultiplier);

        if (Math.random() < 0.015) {
          this.targetAngle += (Math.random() - 0.5) * 1.2;
        }

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetSpeedMultiplier = 1;

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const fleeAngle = Math.atan2(dy, dx) + Math.PI;
          
          this.targetAngle = fleeAngle;
          targetSpeedMultiplier = 1 + (force * 15);
          this.swimCycle += 0.3 * force;
        }

        this.currentSpeedMultiplier += (targetSpeedMultiplier - this.currentSpeedMultiplier) * 0.04;

        const diff = this.targetAngle - this.angle;
        this.angle += Math.atan2(Math.sin(diff), Math.cos(diff)) * 0.06;

        this.speedX = Math.cos(this.angle) * this.baseSpeed * this.currentSpeedMultiplier;
        this.speedY = Math.sin(this.angle) * this.baseSpeed * this.currentSpeedMultiplier;

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

        // Vector 2: Front Walking Legs
        ctx.beginPath();
        for(let j=0; j<3; j++) {
            let offset = sz * 0.1 * j;
            ctx.moveTo(sz * 0.3 - offset, -sz * 0.15);
            ctx.lineTo(sz * 0.4 - offset, -sz * 0.4);
            ctx.lineTo(sz * 0.3 - offset, -sz * 0.5);
            ctx.moveTo(sz * 0.3 - offset, sz * 0.15);
            ctx.lineTo(sz * 0.4 - offset, sz * 0.4);
            ctx.lineTo(sz * 0.3 - offset, sz * 0.5);
        }
        ctx.strokeStyle = leg;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Vector 3: Carapace
        ctx.beginPath();
        ctx.moveTo(sz * 0.5, 0);
        ctx.lineTo(sz * 0.3, -sz * 0.2);
        ctx.lineTo(0, -sz * 0.22);
        ctx.lineTo(0, sz * 0.22);
        ctx.lineTo(sz * 0.3, sz * 0.2);
        ctx.closePath();
        
        // Create softer, matte gradient based on pattern type
        let bodyGrad = ctx.createLinearGradient(0, -sz * 0.2, 0, sz * 0.2);
        if (this.patternType % 3 === 0) {
          // Striped pattern - softer, less metallic
          bodyGrad.addColorStop(0, dark);
          bodyGrad.addColorStop(0.35, main);
          bodyGrad.addColorStop(0.5, main);
          bodyGrad.addColorStop(0.65, main);
          bodyGrad.addColorStop(1, dark);
        } else if (this.patternType % 3 === 1) {
          // Mottled pattern - softer
          bodyGrad.addColorStop(0, main);
          bodyGrad.addColorStop(0.4, dark);
          bodyGrad.addColorStop(0.6, main);
          bodyGrad.addColorStop(1, main);
        } else {
          // Matte gradient (no strong shine)
          bodyGrad.addColorStop(0, dark);
          bodyGrad.addColorStop(0.5, main);
          bodyGrad.addColorStop(1, dark);
        }
        
        ctx.fillStyle = bodyGrad;
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
          
          // Draw segment with matte pattern-specific coloring
          let segGrad = ctx.createLinearGradient(0, -segHeight, 0, segHeight);
          if (this.patternType % 3 === 0) {
            // Alternating stripes - matte
            if (i % 2 === 0) {
              segGrad.addColorStop(0, dark);
              segGrad.addColorStop(0.5, dark);
              segGrad.addColorStop(1, dark);
            } else {
              segGrad.addColorStop(0, main);
              segGrad.addColorStop(0.5, main);
              segGrad.addColorStop(1, main);
            }
          } else {
            segGrad.addColorStop(0, dark);
            segGrad.addColorStop(0.5, main);
            segGrad.addColorStop(1, dark);
          }
          
          ctx.ellipse(0, 0, segWidth, segHeight, 0, 0, Math.PI * 2);
          ctx.fillStyle = segGrad;
          ctx.fill();
          ctx.strokeStyle = dark;
          ctx.lineWidth = 0.8;
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
        ctx.beginPath();
        ctx.moveTo(-sz * 0.1, 0);
        ctx.lineTo(-sz * 0.4, 0);
        
        ctx.moveTo(-sz * 0.1, -sz * 0.05);
        ctx.quadraticCurveTo(-sz * 0.4, -sz * 0.3, -sz * 0.5, -sz * 0.2);
        ctx.lineTo(-sz * 0.1, 0);
        
        ctx.moveTo(-sz * 0.1, sz * 0.05);
        ctx.quadraticCurveTo(-sz * 0.4, sz * 0.3, -sz * 0.5, sz * 0.2);
        ctx.lineTo(-sz * 0.1, 0);
        
        ctx.fillStyle = main;
        ctx.fill();
        ctx.strokeStyle = dark;
        ctx.stroke();

        ctx.restore();
        ctx.restore();
      }
    }

    const shrimpCount = isMobile ? 20 : 38;
    const shrimpFlock = [];
    for (let i = 0; i < shrimpCount; i++) { 
      shrimpFlock.push(new Shrimp());
    }

    // Particle system for realistic pond effects
    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.05 + 0.02
      });
    }

    let rafId;
    let time = 0;
    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Unified pond water color with subtle depth
      const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
      waterGrad.addColorStop(0, '#1a6d7e');      // Water surface
      waterGrad.addColorStop(0.6, '#156a78');    // Mid-water  
      waterGrad.addColorStop(1, '#0d4a56');      // Deeper water
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle sand texture at bottom (reduced opacity for unity)
      ctx.fillStyle = 'rgba(180, 160, 130, 0.12)';
      ctx.fillRect(0, height * 0.82, width, height * 0.18);

      // Subtle animated ripple effect for realism
      ctx.strokeStyle = `rgba(100, 160, 180, ${0.06 + Math.sin(time * 0.008) * 0.03})`;
      ctx.lineWidth = 0.8;
      for (let wave = 0; wave < 2; wave++) {
        ctx.beginPath();
        for (let x = 0; x < width + 50; x += 40) {
          const y = height * 0.35 + Math.sin((x + time * 0.5) * 0.008 + wave * 1.5) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Subtle depth overlay (smooth transition, not separated)
      ctx.fillStyle = `rgba(5, 25, 40, ${0.04 + Math.sin(time * 0.01) * 0.015})`;
      ctx.fillRect(0, height * 0.75, width, height * 0.25);

      // Floating particles (algae/debris)
      particles.forEach(p => {
        p.y -= p.speed * Math.cos(time * 0.005 + p.x * 0.01);
        if (p.y < -20) p.y = height + 20;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 165, 155, ${p.opacity})`;
        ctx.fill();
      });

      // Update and draw shrimp
      shrimpFlock.forEach(shrimp => {
        shrimp.update();
        shrimp.draw();
      });

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleReset);
      window.removeEventListener('mouseout', handleReset);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
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
