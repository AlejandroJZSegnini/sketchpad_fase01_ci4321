// Genera un cilindro cerrado 
// Todos los triángulos quedan en sentido antihorario visto desde afuera. 
export function createCylinderData(segments: number) {
  const vertices: number[] = [];
  const indices: number[] = [];
  const ring = segments + 1; // vértices por anillo 
 
  // Pared lateral
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
 
  // Tapas: un vértice central y un anillo propio, con la normal de la tapa 
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