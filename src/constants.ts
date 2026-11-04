// Scene constants: geometry, colors and canvas settings. main.ts holds the WebGL code and the game loop.

/** Background color sky blue #87ceeb as floats in [0, 1]. */
export const CLEAR_COLOR: readonly [number, number, number, number] = [0x87 / 255, 0xce / 255, 0xeb / 255, 1];

/** Drawing buffer size in pixels, 4:3. CSS scales the canvas to fit the window; the buffer stays fixed. */
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

// ---------------------------------------------------------------------------
// Ground
// ---------------------------------------------------------------------------

/** Altura (y) del suelo. GROUND_VERTICES y la base de la torreta usan este mismo valor. */
export const GROUND_Y = -1.0;

/** Interleaved ground vertex data: x, y, z, nx, ny, nz per vertex. Mide 40 x 40: el nivel 3 de fuerza aterriza hasta cerca de z = -15. */
export const GROUND_VERTICES = new Float32Array([
  // x,     y,        z,     nx, ny, nz
  -20.0, GROUND_Y, -20.0,    0.0, 1.0, 0.0, // Vértice 0: Izquierda-Fondo
   20.0, GROUND_Y, -20.0,    0.0, 1.0, 0.0, // Vértice 1: Derecha-Fondo
   20.0, GROUND_Y,  20.0,    0.0, 1.0, 0.0, // Vértice 2: Derecha-Frente
  -20.0, GROUND_Y,  20.0,    0.0, 1.0, 0.0  // Vértice 3: Izquierda-Frente
]);

export const GROUND_INDICES = new Uint16Array([
  2, 1, 0,  // Primer triángulo invertido
  3, 2, 0   // Segundo triángulo invertido
]);

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

/** Material colors, RGBA. Se indexan con COLOR (más abajo), no con números sueltos. */
export const COLORS: readonly (readonly [number, number, number, number])[] = [
  [0.55, 0.37, 0.22, 1.0], // ground color (marrón)
  [0.19, 0.19, 0.21, 1.0], // turret color (gris oscuro)
  [1.0, 0.4, 0.1, 1.0],    // orange color (objetivos)
  [0.08, 0.35, 0.18, 1.0], // dark green = off
  [0.40, 0.85, 0.45, 1.0], // light green = on
  [0, 0, 0, 1],            // black (proyectil)
  [0.85, 0.85, 0.85, 1.0], // preview trajectory color (gris claro)
];

/** Nombres de los índices de COLORS, para escribir COLORS[COLOR.TURRET] en vez de COLORS[1]. */
export const COLOR = {
  GROUND: 0,
  TURRET: 1,
  TARGET: 2,
  BAR_OFF: 3,
  BAR_ON: 4,
  BULLET: 5,
  PREVIEW: 6
} as const;

// ---------------------------------------------------------------------------
// Turret: medidas en unidades de mundo. La torreta se arma en el origen local (centro de la base,
// sobre el suelo) y main.ts la traslada a (turretX, GROUND_Y, TURRET_Z).
// ---------------------------------------------------------------------------

/** Posición fija de la torreta en z. Solo se mueve en x. */
export const TURRET_Z = 1.0;
/** La torreta se mueve en x dentro de [-TURRET_X_LIMIT, TURRET_X_LIMIT]. Con la cámara actual todo ese recorrido es visible. */
export const TURRET_X_LIMIT = 2.0;
/** Velocidad lateral en unidades por segundo. */
export const TURRET_SPEED = 2.0;

/** Cuerpo de la torreta (cubo escalado): ancho, alto, profundo. */
export const BODY_SIZE: readonly [number, number, number] = [1.0, 0.4, 0.8];
/** Altura del pivote del cañón sobre el suelo: un poco por encima de la tapa del cuerpo. */
export const PIVOT_HEIGHT = BODY_SIZE[1] + 0.05;
/** Cúpula de la torreta (esfera centrada en el pivote). */
export const DOME_RADIUS = 0.3;
/** Tubo del cañón (cilindro que sale del pivote). */
export const TUBE_RADIUS = 0.08;
export const TUBE_LENGTH = 1.1;
/** Proyectil. En reposo se apoya en la boca del tubo. */
export const BULLET_RADIUS = 0.12;

/**
 * Indicador de fuerza: 3 barras apiladas (paralelepípedos delgados) sobre la cara del cuerpo que mira a la cámara (+Z).
 * BAR_SIZE: ancho, alto, grosor. BAR_GAP: separación entre barras. La barra inferior es la número 0.
 */
export const BAR_COUNT = 3;
export const BAR_SIZE: readonly [number, number, number] = [0.5, 0.075, 0.03];
export const BAR_GAP = 0.03;
/** Altura (sobre la base de la torreta) del centro de la barra inferior: el grupo de barras queda centrado en la cara. */
export const BAR_FIRST_Y = (BODY_SIZE[1] - (BAR_COUNT * BAR_SIZE[1] + (BAR_COUNT - 1) * BAR_GAP)) / 2 + BAR_SIZE[1] / 2;

/** Elevación del tubo, en grados medidos desde la horizontal. */
export const ELEVATION_MIN_DEG = 5;
export const ELEVATION_MAX_DEG = 90;
export const ELEVATION_INITIAL_DEG = 45;
/** Velocidad de cambio de elevación, grados por segundo. */
export const ELEVATION_SPEED_DEG = 45;

// ---------------------------------------------------------------------------
// Physics (unidades de mundo y segundos)
// ---------------------------------------------------------------------------

/** Gravedad. Es deliberadamente baja para que el vuelo dure lo suficiente como para verse (0.5 a 1.1 s). */
export const GRAVITY = 5.0;
/** Rapidez de salida de la bala para los niveles de fuerza 1, 2 y 3. */
export const LAUNCH_SPEEDS: readonly [number, number, number] = [5.0, 6.8, 8.9];
/** Número de esferas que formarán la línea punteada */
export const PREVIEW_POINTS_COUNT = 30;
/** Radio pequeño para cada punto de la trayectoria */
export const PREVIEW_RADIUS = 0.03;
/** Paso fijo de la simulación del proyectil. 1/120 s con rapidez máxima 8.9 mueve la bala menos de 0.08 por paso (el objetivo mide 1.2 de diámetro), así que no lo atraviesa. */
export const SIM_STEP = 1 / 120;

// ---------------------------------------------------------------------------
// Targets
// ---------------------------------------------------------------------------

/** Con la bala de radio 0.12, el acierto se da a menos de 0.72 entre centros. */
export const TARGET_RADIUS = 0.6;
/**
 * Cerca/bajo, medio y lejos/alto, con x distinta para que haya que mover la torreta (su rango es +-2.0).
 * Calibrados con LAUNCH_SPEEDS y GRAVITY:
 *   nivel 1 solo alcanza el izquierdo; nivel 2 alcanza izquierdo y central; nivel 3 alcanza los tres,
 *   y es el único que llega al derecho.
 */
export const TARGET_POSITIONS: readonly (readonly [number, number, number])[] = [
  [-2.0, 0.3, -3.0], // izquierdo: cerca y bajo
  [0.0, 2.4, -5.5],  // central: distancia y altura alta
  [2.0, 0.9, -11.0],  // derecho: lejos y bajo, solo nivel 3 lo alcanza
];

// ---------------------------------------------------------------------------
// Cube mesh
// ---------------------------------------------------------------------------

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