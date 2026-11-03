// Scene constants: geometry, colors and canvas settings. main.ts holds the WebGL code and the game loop.

/** Background color #1b1e2b as linear floats in [0, 1]. */
export const CLEAR_COLOR: readonly [number, number, number, number] = [0x87 / 255, 0xce / 255, 0xeb / 255, 1];

/** Drawing buffer size in pixels, 4:3. CSS scales the canvas to fit the window; the buffer stays fixed. */
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

/** Interleaved ground vertex data: x, y, z, nx, ny, nz per vertex. */
export const GROUND_VERTICES = new Float32Array([
  // x,     y,     z,     nx, ny, nz
  -10.0, -1.0, -10.0,    0.0, 1.0, 0.0, // Vértice 0: Izquierda-Fondo
   10.0, -1.0, -10.0,    0.0, 1.0, 0.0, // Vértice 1: Derecha-Fondo
   10.0, -1.0,  10.0,    0.0, 1.0, 0.0, // Vértice 2: Derecha-Frente
  -10.0, -1.0,  10.0,    0.0, 1.0, 0.0  // Vértice 3: Izquierda-Frente
]);

export const GROUND_INDICES = new Uint16Array([
  2, 1, 0,  // Primer triángulo invertido
  3, 2, 0   // Segundo triángulo invertido
]);

/** Cube colors, RGBA. Space cycles through them in this order. */
export const COLORS: readonly (readonly [number, number, number, number])[] = [
  [0.55, 0.37, 0.22, 1.0], // ground color
  [0.01, 0.01, 0.02, 0.1], // turret color (dark blue)
  [1.0, 0.4, 0.1, 1.0], // orange color
  [0.08, 0.35, 0.18, 1.0], // dark green = off
  [0.40, 0.85, 0.45, 1.0], // light green = on
  [0, 0, 0, 1], // black
];

// 24 vertices (4 per face), not 8 corners. A corner is shared by 3 faces, but a vertex holds
// only one normal. Each face needs its own normal for flat lighting, so each face gets its own 4 vertices.
/** Interleaved vertex data: x, y, z, nx, ny, nz per vertex. Half-size 0.5, counter-clockwise seen from outside. */
export const CUBE_VERTICES = new Float32Array([
  //   x      y      z    nx  ny  nz
  // +Z face (front)
  -0.5, -0.5,  0.5,   0,  0,  1, // bottom left
   0.5, -0.5,  0.5,   0,  0,  1, // bottom right
   0.5,  0.5,  0.5,   0,  0,  1, // top right
  -0.5,  0.5,  0.5,   0,  0,  1, // top left
  // -Z face (back)
   0.5, -0.5, -0.5,   0,  0, -1,
  -0.5, -0.5, -0.5,   0,  0, -1,
  -0.5,  0.5, -0.5,   0,  0, -1,
   0.5,  0.5, -0.5,   0,  0, -1,
  // +X face (right)
   0.5, -0.5,  0.5,   1,  0,  0,
   0.5, -0.5, -0.5,   1,  0,  0,
   0.5,  0.5, -0.5,   1,  0,  0,
   0.5,  0.5,  0.5,   1,  0,  0,
  // -X face (left)
  -0.5, -0.5, -0.5,  -1,  0,  0,
  -0.5, -0.5,  0.5,  -1,  0,  0,
  -0.5,  0.5,  0.5,  -1,  0,  0,
  -0.5,  0.5, -0.5,  -1,  0,  0,
  // +Y face (top)
  -0.5,  0.5,  0.5,   0,  1,  0,
   0.5,  0.5,  0.5,   0,  1,  0,
   0.5,  0.5, -0.5,   0,  1,  0,
  -0.5,  0.5, -0.5,   0,  1,  0,
  // -Y face (bottom)
  -0.5, -0.5, -0.5,   0, -1,  0,
   0.5, -0.5, -0.5,   0, -1,  0,
   0.5, -0.5,  0.5,   0, -1,  0,
  -0.5, -0.5,  0.5,   0, -1,  0,
]);

/** Two triangles per face, 36 indices. Each face: (0, 1, 2) and (0, 2, 3), both counter-clockwise. */
export const CUBE_INDICES = new Uint16Array([
   0,  1,  2,   0,  2,  3, // +Z
   4,  5,  6,   4,  6,  7, // -Z
   8,  9, 10,   8, 10, 11, // +X
  12, 13, 14,  12, 14, 15, // -X
  16, 17, 18,  16, 18, 19, // +Y
  20, 21, 22,  20, 22, 23, // -Y
]);

export const STRIDE_BYTES = 6 * 4; // 4 bytes per float (Float32)
export const NORMAL_OFFSET_BYTES = 3 * 4;
