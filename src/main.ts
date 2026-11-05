// Juego de torreta: lanzamiento de esferas en 3D, FixedFunction (FF) version.
import './style.css';
import { mat3, mat4 } from 'gl-matrix';
import { ATTRIB, createFixedFunction, LIGHTING } from './vendor/ff/ff';
import {
  BAR_COUNT,
  BAR_FIRST_Y,
  BAR_GAP,
  BAR_SIZE,
  BODY_SIZE,
  BULLET_RADIUS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CLEAR_COLOR,
  COLOR,
  COLORS,
  CUBE_INDICES,
  CUBE_VERTICES,
  DOME_RADIUS,
  ELEVATION_INITIAL_DEG,
  ELEVATION_MAX_DEG,
  ELEVATION_MIN_DEG,
  ELEVATION_SPEED_DEG,
  GROUND_INDICES,
  GROUND_VERTICES,
  GROUND_Y,
  NORMAL_OFFSET_BYTES,
  PIVOT_HEIGHT,
  PREVIEW_RADIUS,
  PREVIEW_POINTS_COUNT,
  SIM_STEP,
  STRIDE_BYTES,
  TARGET_POSITIONS,
  TARGET_RADIUS,
  TUBE_LENGTH,
  TUBE_RADIUS,
  TURRET_SPEED,
  TURRET_X_LIMIT,
  TURRET_Z,
} from './constants';
import { createSphereData } from './spheres';
import { createCylinderData } from './cylinders';
import { createFlight, flightPosition, hitsTarget, touchesGround, getTrajectoryPoints } from './physics';
import type { Flight, Vec3 } from './physics';
 
// Crear una interfaz para representar un objeto de la escena
interface SceneObject {
  vao: WebGLVertexArrayObject;
  indexCount: number;
  modelMatrix: mat4;
  color: readonly [number, number, number, number];
  visible: boolean; // false: render lo salta (objetivo ya alcanzado)
  unlit: boolean; // true: se dibuja sin iluminación, con color plano (barras del indicador)
}
 
// Las piezas de la torreta. Sus matrices (y el color de las barras) se recalculan en cada frame a partir del estado.
interface TurretParts {
  body: SceneObject;   // cuerpo (cubo aplastado)
  dome: SceneObject;   // torreta (cúpula esférica)
  tube: SceneObject;   // cañón (cilindro)
  bullet: SceneObject; // proyectil: en reposo en la punta del tubo, o en vuelo
  bars: SceneObject[]; // indicador de fuerza, de abajo hacia arriba
}
 
interface Scene {
  turret: TurretParts;
  targets: SceneObject[];
  previewDots: SceneObject[];
}
 
type FF = ReturnType<typeof createFixedFunction>;
 
const MAX_DT = 0.1; // seconds
const DEG_TO_RAD = Math.PI / 180;
 
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
 
// Step 1. Get the WebGL2 context.
function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2');
  if (!gl) throw new Error('WebGL2 is not available.');
  return gl;
}
 
// Step 2. Shaders and program: FF creates and owns them.
// Step 3. Vertex specification: copy the vertex and index data to the GPU.
function createVertexBuffer(gl: WebGL2RenderingContext, data: Float32Array): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}
 
function createIndexBuffer(gl: WebGL2RenderingContext, data: Uint16Array): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}
 
// Step 4. Describe how the vertex data is laid out, using FF's attribute slots.
// No ATTRIB.COLOR: lit colors come from the material.
function createVAO(gl: WebGL2RenderingContext, vertices: WebGLBuffer, indices: WebGLBuffer): WebGLVertexArrayObject {
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
  gl.enableVertexAttribArray(ATTRIB.POSITION);
  gl.vertexAttribPointer(ATTRIB.POSITION, 3, gl.FLOAT, false, STRIDE_BYTES, 0);
  gl.enableVertexAttribArray(ATTRIB.NORMAL);
  gl.vertexAttribPointer(ATTRIB.NORMAL, 3, gl.FLOAT, false, STRIDE_BYTES, NORMAL_OFFSET_BYTES);
  // The VAO remembers the ELEMENT_ARRAY_BUFFER bound while it is bound.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.bindVertexArray(null);
  return vao;
}
 
// Step 5. Pipeline state: canvas size, viewport, clear color, depth test, face culling.
function setupState(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): void {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(...CLEAR_COLOR);
  gl.enable(gl.DEPTH_TEST); // nearer faces must hide farther ones
  gl.enable(gl.CULL_FACE); // skip back faces; front faces are counter-clockwise (the default)
}
 
// Step 6. Scene: lighting, one directional light, camera.
function setupScene(ff: FF): void {
  ff.enable(LIGHTING);
  ff.setGlobalAmbient([0.2, 0.2, 0.2, 1]); // the FF default, set explicitly to make it visible
 
  // The light TRAVELS in direction (-1, -1, -0.5): down, left, slightly away from the camera.
  // FF's position (w = 0) points TOWARD the light, so the sign flips: (1, 1, 0.5, 0).
  // Passing the travel direction instead lights the faces that point away from the light.
  ff.setLight(0, { position: [1, 1, 0.5, 0], diffuse: [1, 1, 1, 1] });
  ff.enableLight(0);
 
  // Cámara única, fija: detrás y por encima de la torreta. Mira a y = 0.5 para que
  // el borde inferior de la torreta quede dentro del encuadre en todo su recorrido lateral.
  const view = mat4.lookAt(mat4.create(), [0, 2, 5.75], [0, 0.5, 0], [0, 1, 0]);
  ff.setViewMatrix(view);
  // Aspect = width / height of the drawing buffer (4:3). A wrong aspect stretches the picture.
  const projection = mat4.perspective(mat4.create(), Math.PI / 4, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 100);
  ff.setProjectionMatrix(projection);
}
 
// ---------------------------------------------------------------------------
// Game loop. Every frame does three separate phases:
//   1. processInput: read what the user did.
//   2. update(dt): advance the simulation by the elapsed time dt (state and model matrices).
//   3. render: draw the current state.
// Keep the phases apart: render never changes the state, and update never calls WebGL.
// ---------------------------------------------------------------------------
 
// Game state: everything the simulation needs, nothing about WebGL.
type PowerLevel = 1 | 2 | 3;
const state = {
  turretX: 0, // posición lateral de la torreta
  elevationDeg: ELEVATION_INITIAL_DEG, // elevación del tubo, en grados desde la horizontal
  powerLevel: 1 as PowerLevel, // nivel de fuerza elegido (1 a 3)
  flight: null as Flight | null, // disparo en el aire; null = la bala reposa en la punta del tubo (disparo disponible)
  targetsAlive: TARGET_POSITIONS.map(() => true), // un valor por objetivo; false = ya fue alcanzado
};
 
function resetGame(): void {
  state.turretX = 0;
  state.elevationDeg = ELEVATION_INITIAL_DEG;
  state.powerLevel = 1;
  state.flight = null; // la bala vuelve a la punta del cañón
  state.targetsAlive = TARGET_POSITIONS.map(() => true); // los tres objetivos reaparecen
}
 
// Input. Dos conjuntos de teclas, indexados por KeyboardEvent.code:
//   keysDown:    teclas que están presionadas ahora (para movimiento continuo con las flechas).
//   keysPressed: teclas que se acaban de presionar en este frame (una vez por pulsación: Espacio, R, 1/2/3, F).
const keysDown = new Set<string>();
const keysPressed = new Set<string>();
// Teclas cuyo comportamiento por defecto (scroll de la página) hay que bloquear.
const PREVENT_DEFAULT_KEYS = new Set(['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);
 
function setupInput(): void {
  window.addEventListener('keydown', (e) => {
    if (PREVENT_DEFAULT_KEYS.has(e.code)) e.preventDefault();
    if (e.repeat) return; // holding a key counts as one press
    keysDown.add(e.code);
    keysPressed.add(e.code);
  });
  window.addEventListener('keyup', (e) => {
    keysDown.delete(e.code);
  });
  // Si la ventana pierde el foco con una tecla presionada, el keyup nunca llega: limpiar para que no quede "pegada".
  window.addEventListener('blur', () => {
    keysDown.clear();
  });
}
 
// Lo que el jugador quiere hacer en este frame, ya interpretado. update() lee esto, no el teclado.
interface Input {
  move: number; // -1 izquierda, 0 quieto, +1 derecha
  tilt: number; // -1 baja el tubo, 0 quieto, +1 lo sube
  fire: boolean; // Espacio
  reset: boolean; // R
  selectPower: PowerLevel | null; // 1, 2 o 3 si se presionó alguna de esas teclas
  cyclePower: boolean; // F
}
const input: Input = { move: 0, tilt: 0, fire: false, reset: false, selectPower: null, cyclePower: false };
 
// Loop phase 1. Traduce el estado de las teclas a un Input y limpia los flancos del frame.
function processInput(): void {
  input.move = (keysDown.has('ArrowRight') ? 1 : 0) - (keysDown.has('ArrowLeft') ? 1 : 0);
  input.tilt = (keysDown.has('ArrowUp') ? 1 : 0) - (keysDown.has('ArrowDown') ? 1 : 0);
  input.fire = keysPressed.has('Space');
  input.reset = keysPressed.has('KeyR');
  input.cyclePower = keysPressed.has('KeyF');
  // El código de la tecla "1" es Digit1 (fila superior) o Numpad1 (teclado numérico). "Key1" no existe.
  if (keysPressed.has('Digit1') || keysPressed.has('Numpad1')) input.selectPower = 1;
  else if (keysPressed.has('Digit2') || keysPressed.has('Numpad2')) input.selectPower = 2;
  else if (keysPressed.has('Digit3') || keysPressed.has('Numpad3')) input.selectPower = 3;
  else input.selectPower = null;
  keysPressed.clear(); // cada pulsación cuenta una sola vez
}
 
// Loop phase 2, parte A: aplicar lo que pidió el jugador. Va por tiempo de frame (dt): el movimiento
// es velocidad * dt, así que dura igual a cualquier tasa de fotogramas.
function applyInput(dt: number): void {
  if (input.reset) {
    resetGame();
    return;
  }
  if (input.selectPower !== null) state.powerLevel = input.selectPower;
  if (input.cyclePower) state.powerLevel = ((state.powerLevel % 3) + 1) as PowerLevel; // 1 -> 2 -> 3 -> 1
 
  // Disparo: solo si no hay otra bala en el aire. Se atiende antes de mover la torreta para que la bala
  // salga exactamente de donde el jugador la veía reposar.
  if (input.fire && state.flight === null) {
    state.flight = createFlight(state.turretX, state.elevationDeg, state.powerLevel);
  }
 
  state.turretX = clamp(state.turretX + input.move * TURRET_SPEED * dt, -TURRET_X_LIMIT, TURRET_X_LIMIT);
  state.elevationDeg = clamp(
    state.elevationDeg + input.tilt * ELEVATION_SPEED_DEG * dt,
    ELEVATION_MIN_DEG,
    ELEVATION_MAX_DEG,
  );
}
 
// Loop phase 2, parte B: simulación del proyectil con paso de tiempo FIJO.
// La bala siempre avanza en múltiplos de SIM_STEP, sin importar cuánto dure cada frame. A 30 FPS se
// ejecutan ~4 pasos por frame y a 144 FPS, ~0.8: la secuencia de instantes y de colisiones es la misma,
// por eso un disparo dura lo mismo y cae en el mismo lugar. El resto del dt queda en el acumulador.
let accumulator = 0;
const ballPosition: Vec3 = [0, 0, 0];
 
function stepProjectile(): void {
  const flight = state.flight;
  if (flight === null) return;
 
  flight.time += SIM_STEP;
  flightPosition(flight, ballPosition);
 
  // Acierto: el objetivo desaparece y el disparo vuelve a estar disponible.
  for (let i = 0; i < state.targetsAlive.length; i++) {
    if (state.targetsAlive[i] && hitsTarget(ballPosition, i)) {
      state.targetsAlive[i] = false;
      state.flight = null;
      return;
    }
  }
  // Suelo: el disparo vuelve a estar disponible.
  if (touchesGround(ballPosition)) state.flight = null;
}
 
// Loop phase 2, parte C: matrices de modelo (y colores dinámicos) calculadas desde el estado.
//
// Jerarquía de la torreta (padre -> hijos):
//   base  (traslación a turretX, sobre el suelo)
//   |- body   (cuerpo)
//   |- bars   (indicador de fuerza, pegado a la cara frontal del cuerpo)
//   `- pivot  (base + altura del pivote + rotación de elevación)
//       |- dome    (cúpula)
//       |- tube    (cañón)
//       `- bullet  (proyectil, solo cuando está en reposo)
// Como dome, tube y bullet cuelgan del mismo pivot, al cambiar la elevación se mueven como una sola pieza,
// y la bala en reposo acompaña al cañón sin cálculos extra. En vuelo, la bala usa su posición en el mundo.
//
// gl-matrix postmultiplica: translate y luego scale da M = T * S, es decir, escala primero y traslada después.
const base = mat4.create();
const pivot = mat4.create();
 
function updateSceneTransforms(scene: Scene): void {
  const parts = scene.turret;
  mat4.fromTranslation(base, [state.turretX, GROUND_Y, TURRET_Z]);
 
  // Cuerpo: apoyado en el suelo (su centro está a medio alto sobre la base).
  mat4.translate(parts.body.modelMatrix, base, [0, BODY_SIZE[1] / 2, 0]);
  mat4.scale(parts.body.modelMatrix, parts.body.modelMatrix, BODY_SIZE);
 
  // Indicador de fuerza: el nivel n enciende las n barras inferiores (la barra 0 siempre queda encendida).
  parts.bars.forEach((bar, i) => {
    const y = BAR_FIRST_Y + i * (BAR_SIZE[1] + BAR_GAP);
    const z = BODY_SIZE[2] / 2 + BAR_SIZE[2] / 2; // apoyada sobre la cara +Z, la que mira a la cámara
    mat4.translate(bar.modelMatrix, base, [0, y, z]);
    mat4.scale(bar.modelMatrix, bar.modelMatrix, BAR_SIZE);
    bar.color = COLORS[i < state.powerLevel ? COLOR.BAR_ON : COLOR.BAR_OFF];
  });
 
  // Pivote del cañón. rotateX(+e) lleva el eje -Z del cilindro a (0, sin e, -cos e): e = 0 horizontal, e = 90° vertical.
  mat4.translate(pivot, base, [0, PIVOT_HEIGHT, 0]);
  mat4.rotateX(pivot, pivot, state.elevationDeg * DEG_TO_RAD);
 
  mat4.scale(parts.dome.modelMatrix, pivot, [DOME_RADIUS, DOME_RADIUS, DOME_RADIUS]);
  mat4.scale(parts.tube.modelMatrix, pivot, [TUBE_RADIUS, TUBE_RADIUS, TUBE_LENGTH]);
 
  if (state.flight !== null) {
    // En vuelo: la bala ya no depende de la torreta.
    flightPosition(state.flight, ballPosition);
    mat4.fromTranslation(parts.bullet.modelMatrix, ballPosition);
  } else {
    // En reposo: justo después de la boca del tubo (su centro a un radio de la punta).
    mat4.translate(parts.bullet.modelMatrix, pivot, [0, 0, -(TUBE_LENGTH + BULLET_RADIUS)]);
  }
  mat4.scale(parts.bullet.modelMatrix, parts.bullet.modelMatrix, [BULLET_RADIUS, BULLET_RADIUS, BULLET_RADIUS]);
 
// --- TRAYECTORIA (PREVIEW DOTS) ---
  if (scene.previewDots) {
    if (state.flight === null) {
      const points = getTrajectoryPoints(state.turretX, state.elevationDeg, state.powerLevel, scene.previewDots.length);
      scene.previewDots.forEach((dot, i) => {
        if (i < points.length) {
          dot.visible = true;
          mat4.fromTranslation(dot.modelMatrix, points[i]);
          mat4.scale(dot.modelMatrix, dot.modelMatrix, [PREVIEW_RADIUS, PREVIEW_RADIUS, PREVIEW_RADIUS]);
        } else {
          dot.visible = false;
        }
      });
    } else {
      scene.previewDots.forEach((dot) => {
        dot.visible = false;
      });
    }
  }

  // Un objetivo alcanzado deja de dibujarse (render lo salta).
  scene.targets.forEach((target, i) => {
    target.visible = state.targetsAlive[i];
  });
}
 
// Loop phase 2.
function update(dt: number, scene: Scene): void {
  applyInput(dt);
  accumulator += dt;
  while (accumulator >= SIM_STEP) {
    accumulator -= SIM_STEP;
    stepProjectile();
  }
  updateSceneTransforms(scene);
}
 
// Loop phase 3. Draw the current state. render reads the state and never changes it.
// setMaterial runs every frame, so FF re-uploads the material each frame. That costs a few
// uniforms and keeps render simple. Exercise: set the material only when the color changes.
const normalMatrix = mat3.create();
 
function render(gl: WebGL2RenderingContext, ff: FF, objects: SceneObject[]): void {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
  ff.enable(LIGHTING);
  let lit = true; // para cambiar el interruptor de FF solo cuando el objeto lo requiere
 
  for (const object of objects) {
    if (!object.visible) continue;
    const color = object.color;
    if (object.unlit) {
      // Sin iluminación, FF usa el color genérico del vértice (ff.setColor): color plano, siempre igual de visible.
      if (lit) {
        ff.disable(LIGHTING);
        lit = false;
      }
      ff.setColor(color);
    } else {
      if (!lit) {
        ff.enable(LIGHTING);
        lit = true;
      }
      ff.setMaterial({ ambient: color, diffuse: color }); // specular stays at the FF default (0)
    }
    ff.setModelMatrix(object.modelMatrix);
    // FF needs the normal matrix for lit normals: setModelMatrix does not update it.
    ff.setNormalMatrix(mat3.normalFromMat4(normalMatrix, object.modelMatrix));
    gl.bindVertexArray(object.vao);
    ff.drawElements(gl.TRIANGLES, object.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}
 
function createObject(
  vao: WebGLVertexArrayObject,
  indexCount: number,
  colorIndex: number,
  unlit = false,
): SceneObject {
  return { vao, indexCount, modelMatrix: mat4.create(), color: COLORS[colorIndex], visible: true, unlit };
}
 
function run(canvas: HTMLCanvasElement): void {
  const gl = getContext(canvas);
  const ff = createFixedFunction(gl, { debug: true });
  // 1. Crear buffers para el suelo
  const groundVertices = createVertexBuffer(gl, GROUND_VERTICES);
  const groundIndices = createIndexBuffer(gl, GROUND_INDICES);
  const groundVAO = createVAO(gl, groundVertices, groundIndices);
  // 2. Crear buffers para el cubo (cuerpo de la torreta y barras del indicador)
  const cubeVertices = createVertexBuffer(gl, CUBE_VERTICES);
  const cubeIndices = createIndexBuffer(gl, CUBE_INDICES);
  const cubeVAO = createVAO(gl, cubeVertices, cubeIndices);
  // 3. Crear geometría de esfera de radio 1: el tamaño real se da con scale en cada objeto
  const sphereData = createSphereData(1, 24, 24);
  const sphereVertices = createVertexBuffer(gl, sphereData.vertices);
  const sphereIndices = createIndexBuffer(gl, sphereData.indices);
  const sphereVAO = createVAO(gl, sphereVertices, sphereIndices);
  // 4. Crear geometría de cilindro (tubo del cañón), radio 1 y largo 1: se da tamaño con scale
  const cylinderData = createCylinderData(24);
  const cylinderVertices = createVertexBuffer(gl, cylinderData.vertices);
  const cylinderIndices = createIndexBuffer(gl, cylinderData.indices);
  const cylinderVAO = createVAO(gl, cylinderVertices, cylinderIndices);
  setupState(gl, canvas);
  setupScene(ff);
  setupInput();
 
  const sphereCount = sphereData.indices.length;
 
  // Suelo: queda con la matriz identidad (sus vértices ya están en coordenadas de mundo).
  const ground = createObject(groundVAO, GROUND_INDICES.length, COLOR.GROUND);
 
  // Torreta: sus matrices las calcula update() cada frame.
  const turret: TurretParts = {
    body: createObject(cubeVAO, CUBE_INDICES.length, COLOR.TURRET),
    dome: createObject(sphereVAO, sphereCount, COLOR.TURRET),
    tube: createObject(cylinderVAO, cylinderData.indices.length, COLOR.TURRET),
    bullet: createObject(sphereVAO, sphereCount, COLOR.BULLET),
    // Tres barras sin iluminación; update() decide cuáles se ven encendidas (verde claro) o apagadas (verde oscuro).
    bars: Array.from({ length: BAR_COUNT }, () => createObject(cubeVAO, CUBE_INDICES.length, COLOR.BAR_OFF, true)),
  };

   // Crear una serie de esferas pequeñas para la trayectoria
  const previewDots = Array.from({ length: PREVIEW_POINTS_COUNT }, () => 
  createObject(sphereVAO, sphereCount, COLOR.PREVIEW, false)
  );

  // Objetivos: fijos, así que su matriz se calcula una sola vez (update() solo cambia su visibilidad).
  const targets = TARGET_POSITIONS.map((position) => {
    const target = createObject(sphereVAO, sphereCount, COLOR.TARGET);
    mat4.translate(target.modelMatrix, target.modelMatrix, position);
    mat4.scale(target.modelMatrix, target.modelMatrix, [TARGET_RADIUS, TARGET_RADIUS, TARGET_RADIUS]);
    return target;
  });
 
  const scene: Scene = { turret, targets, previewDots };
  const sceneObjects: SceneObject[] = [
    ground,
    turret.body,
    turret.dome,
    turret.tube,
    turret.bullet,
    ...turret.bars,
    ...targets,
    ...previewDots,
  ];
 
  let last: number | null = null; // set by the first frame, so dt starts at 0
  function frame(now: number): void {
    if (last === null) last = now;
    // rAF pauses in hidden tabs. On return, (now - last) would be huge, so cap dt.
    const dt = Math.min((now - last) / 1000, MAX_DT);
    last = now;
    processInput();
    update(dt, scene);
    render(gl, ff, sceneObjects); // Renderizamos todos los objetos de la escena
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
 
// Page scaffolding: create the canvas and start the game.
const canvas = document.createElement('canvas');
document.getElementById('stage')!.append(canvas);
run(canvas);