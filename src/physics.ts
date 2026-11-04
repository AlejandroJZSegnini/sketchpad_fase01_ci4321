// Física del proyectil: lanzamiento, trayectoria y colisiones. No usa WebGL ni gl-matrix.
//
// La trayectoria se calcula con la fórmula exacta (no se acumula velocidad frame a frame):
//   posición(t) = origen + velocidad * t + 1/2 * gravedad * t^2
// y main.ts la avanza con pasos de tiempo fijos (SIM_STEP). Así un mismo disparo recorre
// exactamente los mismos instantes t = k * SIM_STEP a 30, 60 o 144 FPS, y cae en el mismo lugar.
import {
  BULLET_RADIUS,
  GRAVITY,
  GROUND_Y,
  LAUNCH_SPEEDS,
  PIVOT_HEIGHT,
  TARGET_POSITIONS,
  TARGET_RADIUS,
  TUBE_LENGTH,
  TURRET_Z,
} from './constants';
 
export type Vec3 = [number, number, number];
 
/** Un disparo en el aire. time = segundos transcurridos desde que salió del cañón. */
export interface Flight {
  origin: Vec3;
  velocity: Vec3;
  time: number;
}
 
const DEG_TO_RAD = Math.PI / 180;
 
/**
 * Centro de la bala cuando reposa en la boca del tubo. Es el mismo punto que obtiene main.ts al
 * colgar la bala del pivote (pivote + rotateX(elevación) * (0, 0, -(largo + radio))).
 */
export function restPosition(turretX: number, elevationDeg: number): Vec3 {
  const e = elevationDeg * DEG_TO_RAD;
  const reach = TUBE_LENGTH + BULLET_RADIUS;
  return [turretX, GROUND_Y + PIVOT_HEIGHT + reach * Math.sin(e), TURRET_Z - reach * Math.cos(e)];
}
 
/** Crea el disparo: sale de la boca del tubo con la dirección del tubo y la rapidez del nivel de fuerza (1 a 3). */
export function createFlight(turretX: number, elevationDeg: number, powerLevel: 1 | 2 | 3): Flight {
  const e = elevationDeg * DEG_TO_RAD;
  const speed = LAUNCH_SPEEDS[powerLevel - 1];
  // Dirección del tubo: (0, sin e, -cos e). El cañón no gira sobre sí mismo, así que x no cambia.
  return {
    origin: restPosition(turretX, elevationDeg),
    velocity: [0, speed * Math.sin(e), -speed * Math.cos(e)],
    time: 0,
  };
}
 
/** Escribe en out la posición del centro de la bala en el instante flight.time. */
export function flightPosition(flight: Flight, out: Vec3): void {
  const t = flight.time;
  out[0] = flight.origin[0] + flight.velocity[0] * t;
  out[1] = flight.origin[1] + flight.velocity[1] * t - 0.5 * GRAVITY * t * t;
  out[2] = flight.origin[2] + flight.velocity[2] * t;
}
 
/** Hay acierto cuando la distancia entre centros es menor que la suma de los radios. */
export function hitsTarget(position: Vec3, targetIndex: number): boolean {
  const target = TARGET_POSITIONS[targetIndex];
  const dx = position[0] - target[0];
  const dy = position[1] - target[1];
  const dz = position[2] - target[2];
  const reach = TARGET_RADIUS + BULLET_RADIUS;
  return dx * dx + dy * dy + dz * dz < reach * reach;
}
 
/** La bala toca el suelo cuando su centro baja a un radio de altura sobre él. */
export function touchesGround(position: Vec3): boolean {
  return position[1] <= GROUND_Y + BULLET_RADIUS;
}