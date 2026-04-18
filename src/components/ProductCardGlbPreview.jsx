import React, { useRef, useState, useEffect, useCallback, startTransition, lazy, Suspense } from 'react';
import { Scan } from 'lucide-react';

const ProductGlbViewer = lazy(() => import('./ProductGlbViewer.jsx'));

/**
 * Mounts the real GLB only while the card is (near) visible so we do not exhaust WebGL contexts.
 * pointer-events: none so the card still receives clicks to open the detail modal.
 * `live={false}` on narrow viewports skips WebGL on cards (modal still has full 3D).
 */
export default function ProductCardGlbPreview({ src, alt, isMobile, t, live = true }) {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(false);
  const hideTimer = useRef(null);

  const clearHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      startTransition(() => setActive(true));
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        clearHide();
        setActive(true);
      } else {
        clearHide();
        hideTimer.current = window.setTimeout(() => setActive(false), 1200);
      }
    }, { rootMargin: '60px 0px 80px 0px', threshold: 0.12 });
    io.observe(node);
    return () => {
      clearHide();
      io.disconnect();
    };
  }, [clearHide, live]);

  if (!live) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'none' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            height: '100%',
            padding: '0.5rem',
            textAlign: 'center',
            background: 'linear-gradient(165deg, rgba(255,255,255,0.06) 0%, transparent 55%)'
          }}
        >
          <Scan size={isMobile ? 32 : 44} strokeWidth={1.1} color="rgba(255,255,255,0.78)" />
          <span
            style={{
              fontSize: isMobile ? '0.62rem' : '0.72rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.82)',
              maxWidth: '12rem',
              lineHeight: 1.35
            }}
          >
            {t('prod.card3dTeaser')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {active ? (
        <Suspense
          fallback={
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.5rem',
                textAlign: 'center'
              }}
            >
              <Scan size={isMobile ? 30 : 40} strokeWidth={1.1} color="rgba(255,255,255,0.55)" />
              <span
                style={{
                  fontSize: isMobile ? '0.6rem' : '0.68rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.5)',
                  maxWidth: '11rem',
                  lineHeight: 1.3
                }}
              >
                {t('prod.card3dLoading')}
              </span>
            </div>
          }
        >
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <ProductGlbViewer
              src={src}
              alt={alt}
              cameraOrbit="90deg 75deg 105%"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Suspense>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            height: '100%',
            padding: '0.5rem',
            pointerEvents: 'none',
            textAlign: 'center'
          }}
        >
          <Scan size={isMobile ? 30 : 40} strokeWidth={1.1} color="rgba(255,255,255,0.55)" />
          <span
            style={{
              fontSize: isMobile ? '0.6rem' : '0.68rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '11rem',
              lineHeight: 1.3
            }}
          >
            {t('prod.card3dLoading')}
          </span>
        </div>
      )}
    </div>
  );
}
