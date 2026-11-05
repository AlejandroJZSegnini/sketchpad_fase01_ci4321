// Genera los datos de una esfera con posiciones y normales: x, y, z, nx, ny, nz.
// Los triángulos quedan en sentido antihorario visto desde afuera
// Se usa con radius = 1 y se dimensiona con scale en la matriz de modelo.
export function createSphereData(radius: number, rings: number, sectors: number) {
  const vertices: number[] = [];
  const indices: number[] = [];
 
  for (let r = 0; r <= rings; r++) {
    const v = r / rings;
    const theta = v * Math.PI; // De 0 a PI (latitud)
 
    for (let s = 0; s <= sectors; s++) {
      const u = s / sectors;
      const phi = u * 2 * Math.PI; // De 0 a 2*PI (longitud)
 
      // Coordenadas cartesianas (Posición x, y, z)
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.cos(theta);
      const z = radius * Math.sin(theta) * Math.sin(phi);
 
      // Normales (apuntan hacia afuera desde el centro)
      const nx = Math.sin(theta) * Math.cos(phi);
      const ny = Math.cos(theta);
      const nz = Math.sin(theta) * Math.sin(phi);
 
      vertices.push(x, y, z, nx, ny, nz);
    }
  }
 
  // Generar índices para los triángulos que forman la malla
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < sectors; s++) {
      const first = r * (sectors + 1) + s;
      const second = first + sectors + 1;
 
      // Antihorario visto desde afuera 
      indices.push(first, first + 1, second);
      indices.push(second, first + 1, second + 1);
    }
  }
 
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices)
  };
}