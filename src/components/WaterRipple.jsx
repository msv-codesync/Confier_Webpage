import React, { useEffect, useRef } from 'react';

/** Imperative ripples: no React state on click → main thread stays free under abuse. */
const RIPPLE_MS = 760;
const MIN_GAP_COARSE = 220;
const MIN_GAP_FINE = 140;
const MAX_RIPPLES_COARSE = 2;
const MAX_RIPPLES_FINE = 3;

export default function WaterRipple() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === 'undefined') return undefined;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return undefined;
    }

    const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
    const minGap = coarse ? MIN_GAP_COARSE : MIN_GAP_FINE;
    const maxRipples = coarse ? MAX_RIPPLES_COARSE : MAX_RIPPLES_FINE;
    let lastSpawn = 0;

    const prune = () => {
      const nodes = root.querySelectorAll('.wr-dot');
      while (nodes.length > maxRipples) {
        nodes[0]?.remove();
      }
    };

    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const now = performance.now();
      if (now - lastSpawn < minGap) return;
      lastSpawn = now;

      prune();

      const dot = document.createElement('div');
      dot.className = 'wr-dot';
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      root.appendChild(dot);
      window.setTimeout(() => {
        dot.remove();
      }, RIPPLE_MS + 40);
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      while (root.firstChild) root.firstChild.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={rootRef}
        className="water-ripple-root"
        aria-hidden="true"
      />
      <style>{`
        .water-ripple-root {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99999;
          contain: strict;
          isolation: isolate;
        }
        .water-ripple-root .wr-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          margin: -3px 0 0 -3px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.42);
          background: rgba(255, 255, 255, 0.1);
          animation: wr-expand ${RIPPLE_MS}ms cubic-bezier(0.22, 0.9, 0.28, 1) forwards;
          will-change: transform, opacity;
        }
        @keyframes wr-expand {
          0% { transform: scale(0.4); opacity: 0.82; }
          100% { transform: scale(32); opacity: 0; }
        }
      `}</style>
    </>
  );
}
