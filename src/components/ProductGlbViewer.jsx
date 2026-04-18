import React from 'react';
import '@google/model-viewer';
import { resolveModelSrc } from '../utils/resolveModelSrc.js';

/**
 * GLB with drag-to-orbit via Google's model-viewer web component.
 * Initial camera-orbit is offset 90° on theta vs model-viewer default (0deg 75deg 105%)
 * so packaged meshes that sit “left profile” by default read as front-facing before interaction.
 */
export default function ProductGlbViewer({ src, alt, style, className, cameraOrbit }) {
  return React.createElement('model-viewer', {
    src: resolveModelSrc(src),
    alt: alt || 'Product 3D model',
    'camera-controls': true,
    'camera-orbit': cameraOrbit || '90deg 75deg 105%',
    'shadow-intensity': '0.45',
    exposure: '1',
    'interaction-prompt': 'auto',
    'touch-action': 'none',
    className,
    style: {
      width: '100%',
      height: '100%',
      display: 'block',
      background: 'transparent',
      ...style
    }
  });
}
