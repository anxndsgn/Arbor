import type { LayoutConfig } from '@/types/editor';
import { DEFAULT_LAYOUT_CONFIG } from '@/types/editor';

/**
 * Calculate the center point between two nodes for edge routing
 */
export function getEdgeMidpoint(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): { x: number; y: number } {
  return {
    x: (sourceX + targetX) / 2,
    y: (sourceY + targetY) / 2,
  };
}

/**
 * Calculate control points for a smooth bezier curve
 * Used for horizontal tree layout (left-to-right)
 */
export function getBezierControlPoints(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG
): {
  controlPoint1: { x: number; y: number };
  controlPoint2: { x: number; y: number };
} {
  const horizontalOffset = config.horizontalGap / 2;

  return {
    controlPoint1: {
      x: sourceX + horizontalOffset,
      y: sourceY,
    },
    controlPoint2: {
      x: targetX - horizontalOffset,
      y: targetY,
    },
  };
}

/**
 * Check if a point is within the bounds of a node
 */
export function isPointInNode(
  pointX: number,
  pointY: number,
  nodeX: number,
  nodeY: number,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG
): boolean {
  return (
    pointX >= nodeX &&
    pointX <= nodeX + config.nodeWidth &&
    pointY >= nodeY &&
    pointY <= nodeY + config.nodeHeight
  );
}

/**
 * Calculate viewport bounds to fit all nodes
 */
export function getViewportBounds(
  positions: Map<string, { x: number; y: number }>,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG
): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const { x, y } of positions.values()) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + config.nodeWidth);
    maxY = Math.max(maxY, y + config.nodeHeight);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
