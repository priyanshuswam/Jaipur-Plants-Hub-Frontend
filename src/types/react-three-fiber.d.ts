/**
 * React Three Fiber v8 + React 19 JSX Type Bridge
 *
 * Problem: R3F v8 augments the legacy global `JSX.IntrinsicElements` namespace,
 * but React 19 + @types/react@19 moved JSX to `React.JSX.IntrinsicElements`.
 * TypeScript's `next build` type-checker uses React.JSX, so mesh, points, etc.
 * are not found.
 *
 * Fix: Import ThreeElements from R3F and merge them into React.JSX.IntrinsicElements
 * so Next.js 15 + React 19 can resolve all Three.js JSX intrinsic elements.
 */

import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
