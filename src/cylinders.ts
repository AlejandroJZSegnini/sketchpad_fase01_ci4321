// Genera un cilindro cerrado (pared lateral y dos tapas) con posiciones y normales interleaveadas:
// x, y, z, nx, ny, nz.
//
// Medidas unitarias: radio 1, eje a lo largo de -Z. La base está en z = 0 y la boca en z = -1.
// Se dimensiona con scale [radio, radio, largo] en la matriz de modelo. Eje en -Z para que
// rotateX(elevación) lo incline hacia arriba sin más ajustes.
//
// Todos los triángulos quedan en sentido antihorario visto desde afuera (requisito de CULL_FACE).
export function createCylinderData(segments: number) {
  const vertices: number[] = [];
  const indices: number[] = [];
  const ring = segments + 1; // vértices por anillo (el último repite al primero para cerrar la costura)
 
  // Pared lateral: anillo en z = 0 y anillo en z = -1, con la normal radial (nx, ny, 0).
  for (const z of [0, -1]) {
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * 2 * Math.PI;
      const x = Math.cos(a);
      const y = Math.sin(a);
      vertices.push(x, y, z, x, y, 0);
    }
  }
  for (let i = 0; i < segments; i++) {
    indices.push(i, ring + i, ring + i + 1);
    indices.push(i, ring + i + 1, i + 1);
  }
 
  // Tapas: un vértice central y un anillo propio, con la normal de la tapa (no la radial).
  // nz = +1 mira hacia +Z (la base); nz = -1 mira hacia -Z (la boca).
  const addCap = (z: number, nz: number): void => {
    const center = vertices.length / 6;
    vertices.push(0, 0, z, 0, 0, nz);
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * 2 * Math.PI;
      vertices.push(Math.cos(a), Math.sin(a), z, 0, 0, nz);
    }
    for (let i = 0; i < segments; i++) {
      const r0 = center + 1 + i;
      const r1 = r0 + 1;
      if (nz > 0) indices.push(center, r0, r1);
      else indices.push(center, r1, r0);
    }
  };
  addCap(0, 1);
  addCap(-1, -1);
 
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
  };
}