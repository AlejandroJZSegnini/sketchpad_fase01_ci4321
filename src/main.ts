// Rotating cube, FixedFunction (FF) version.
import './style.css';
import { mat3, mat4 } from 'gl-matrix';
import { ATTRIB, createFixedFunction, LIGHTING } from './vendor/ff/ff';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CLEAR_COLOR,
  COLORS,
  CUBE_INDICES,
  CUBE_VERTICES,
  GROUND_INDICES,
  GROUND_VERTICES,
  NORMAL_OFFSET_BYTES,
  STRIDE_BYTES,
} from './constants';
import { 
  createSphereData
} from './spheres';

// Crear una interfaz para representar un objeto de la escena
interface SceneObject {
  vao: WebGLVertexArrayObject;
  indexCount: number;
  modelMatrix: mat4;
  color: readonly [number, number, number, number];
}

type FF = ReturnType<typeof createFixedFunction>;

const MAX_DT = 0.1; // seconds

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
  gl.enable(gl.DEPTH_TEST); // new vs. the triangle: nearer faces must hide farther ones
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

  const view = mat4.lookAt(mat4.create(), [0, 2, 5.75], [0, 1, 0], [0, 1, 0]);
  ff.setViewMatrix(view);
  // Aspect = width / height of the drawing buffer (4:3). A wrong aspect stretches the cube.
  const projection = mat4.perspective(mat4.create(), Math.PI / 4, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 100);
  ff.setProjectionMatrix(projection);
}

// ---------------------------------------------------------------------------
// Game loop. Every frame does three separate phases:
//   1. processInput: read what the user did.
//   2. update(dt): advance the simulation by the elapsed time dt.
//   3. render: draw the current state.
// Keep the phases apart: render never changes the state, and update never calls WebGL.
// ---------------------------------------------------------------------------

// Game state: everything the simulation needs, nothing about WebGL.
const state = { angle: 0, colorIndex: 0, rotating: true };

// Input: the keydown listener only records presses. processInput handles them later, once per frame.
let spacePressed = false;
let rPressed = false;
let onePressed = false;
let twoPressed = false;
let threePressed = false;
let fPressed = false;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;
function setupInput(): void {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') e.preventDefault(); // stops the page from scrolling
    if (e.repeat) return; // holding a key counts as one press
    if (e.code === 'Space') spacePressed = true;
    if (e.code === 'KeyR') rPressed = true;
    if (e.code === 'Key1') onePressed = true;
    if (e.code === 'Key2') twoPressed = true;
    if (e.code === 'Key3') threePressed = true;
    if (e.code === 'KeyF') fPressed = true;
    if (e.code === 'ArrowLeft') leftPressed = true;
    if (e.code === 'ArrowRight') rightPressed = true;
    if (e.code === 'ArrowUp') upPressed = true;
    if (e.code === 'ArrowDown') downPressed = true;
  });
  // Research: key-state polling with edge detection. Store which keys are down, and compare with
  // the last frame: pressed = down now && !down last frame. When does it fit better than events?
}

// Loop phase 1. Space selects the next color. R toggles the rotation.
// Each flag is cleared after use, so each press counts once.
//
function processInput(): void {
  if (spacePressed) state.colorIndex = (state.colorIndex + 1) % COLORS.length;
  if (rPressed) state.rotating = !state.rotating;
  spacePressed = false;
  rPressed = false;
  onePressed = false;
  twoPressed = false;
  threePressed = false;
  fPressed = false;
  leftPressed = false;
  rightPressed = false;
  upPressed = false;
  downPressed = false;
}

// Loop phase 2. 
function update(dt: number): void {
  // paused: the angle keeps its value
}

// Loop phase 3. Draw the current state. render reads the state and never changes it.
// setMaterial runs every frame, so FF re-uploads the material each frame. That costs a few
// uniforms and keeps render simple. Exercise: set the material only when colorIndex changes.
const cubeModel = mat4.create();
const normalMatrix = mat3.create();
const scale: [number, number, number] = [0.9, 0.5, 1.1]; // volver el cubo chato
const initialCubePosition: [number, number, number] = [0, -0.5, 1]; // pegar el cubo al suelo

const cannonBallModel = mat4.create();
const cannonBallPosition: [number, number, number] = [0, 0.5, 1]; // posición inicial de la bala

const turretDomeModel = mat4.create();
const turretDomePosition: [number, number, number] = [0, 0.5, 1]; // posición inicial de la cúpula de la torreta

const target1Model = mat4.create();
const target1Position: [number, number, number] = [-3.0, 1.0, -4.0]; // posición del blanco izquierdo

const target2Model = mat4.create();
const target2Position: [number, number, number] = [0.0, 2.0, -6.0]; // posición del blanco central

const target3Model = mat4.create();
const target3Position: [number, number, number] = [3.0, 1.0, -4.0]; // posición del blanco derecho


function render(gl: WebGL2RenderingContext, ff: FF, objects: SceneObject[]): void {
  mat4.identity(cubeModel);
  mat4.scale(cubeModel, cubeModel, scale);
  mat4.translate(cubeModel, cubeModel, initialCubePosition);
  mat4.identity(cannonBallModel);
  mat4.translate(cannonBallModel, cannonBallModel, cannonBallPosition); // Posición de la bala
  mat4.identity(turretDomeModel);
  mat4.translate(turretDomeModel, turretDomeModel, turretDomePosition); // Posición de la cúpula de la torreta
  mat4.identity(target1Model);
  mat4.translate(target1Model, target1Model, target1Position); // Blanco izquierdo
  mat4.identity(target2Model);
  mat4.translate(target2Model, target2Model, target2Position);  // Blanco central
  mat4.identity(target3Model);
  mat4.translate(target3Model, target3Model, target3Position);  // Blanco derecho
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (const object of objects) {
    const color = object.color;
    ff.setMaterial({ ambient: color, diffuse: color }); // specular stays at the FF default (0)
    ff.setModelMatrix(object.modelMatrix);
    // FF needs the normal matrix for lit normals: setModelMatrix does not update it.
    ff.setNormalMatrix(mat3.normalFromMat4(normalMatrix, object.modelMatrix));
    gl.bindVertexArray(object.vao);
    ff.drawElements(gl.TRIANGLES, object.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}

function run(canvas: HTMLCanvasElement): void {
  const gl = getContext(canvas);
  const ff = createFixedFunction(gl, { debug: true });
  // 1. Crear buffers para el suelo
  const groundVertices = createVertexBuffer(gl, GROUND_VERTICES);
  const groundIndices = createIndexBuffer(gl, GROUND_INDICES);
  const groundVAO = createVAO(gl, groundVertices, groundIndices);
  // 2. Crear buffers para el cubo
  const cubeVertices = createVertexBuffer(gl, CUBE_VERTICES);
  const cubeIndices = createIndexBuffer(gl, CUBE_INDICES);
  const cubeVAO = createVAO(gl, cubeVertices, cubeIndices);
  // 3. Crear geometría de esfera
  const sphereData = createSphereData(0.5, 16, 16);
  const sphereVertices = createVertexBuffer(gl, sphereData.vertices);
  const sphereIndices = createIndexBuffer(gl, sphereData.indices);
  const sphereVAO = createVAO(gl, sphereVertices, sphereIndices);
  setupState(gl, canvas);
  setupScene(ff);
  setupInput();

  const sceneObjects: SceneObject[] = [
  // 1. Suelo
  {
    vao: groundVAO,
    indexCount: GROUND_INDICES.length,
    modelMatrix: mat4.create(),
    color: COLORS[0]
  },
  // 2. Torreta (Cubo principal)
  {
    vao: cubeVAO,
    indexCount: CUBE_INDICES.length,
    modelMatrix: cubeModel,
    color: COLORS[1]
  },
  // 3. Cúpula de la torreta (esfera)
  {
    vao: sphereVAO,
    indexCount: sphereData.indices.length,
    modelMatrix: turretDomeModel,
    color: COLORS[1]
  },
  // 4. Bala de cañón (esfera)
  {
    vao: sphereVAO,
    indexCount: sphereData.indices.length,
    modelMatrix: cannonBallModel,
    color: COLORS[5]
  },
  // 5. Blanco izquierdo (esfera)
  {
    vao: sphereVAO,
    indexCount: sphereData.indices.length,
    modelMatrix: target1Model,
    color: COLORS[2]
  },
  // 6. Blanco central (esfera)
  {
    vao: sphereVAO,
    indexCount: sphereData.indices.length,
    modelMatrix: target2Model,
    color: COLORS[2]
  },
  // 7. Blanco derecho (esfera)
  {
    vao: sphereVAO,
    indexCount: sphereData.indices.length,
    modelMatrix: target3Model,
    color: COLORS[2]
  }
];

  state.colorIndex = 2;
  let last: number | null = null; // set by the first frame, so dt starts at 0
  function frame(now: number): void {
    if (last === null) last = now;
    // rAF pauses in hidden tabs. On return, (now - last) would be huge, so cap dt.
    const dt = Math.min((now - last) / 1000, MAX_DT);
    last = now;
    processInput();
    update(dt);
    render(gl, ff, sceneObjects); // Renderizamos todos los objetos de la escena
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// Page scaffolding: create the canvas and start the cube.
const canvas = document.createElement('canvas');
document.getElementById('stage')!.append(canvas);
run(canvas);
