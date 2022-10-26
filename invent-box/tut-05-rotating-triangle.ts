import {mat4} from 'gl-matrix'

import {
  createMyBuffer,
  createProgram,
  setProgramAttributeToMyBuffer,
} from "./invent-utils";

export function main() {
  console.log('Starting main...');

  const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
  const gl = canvas.getContext('webgl')!;

  if (!gl) {
    throw new Error('WebGL is not supported');
  }

  const positionBuffer = createMyBuffer(gl, [
    0, 1, 0, // middle top
    1, -1, 0, // right bottom
    -1, -1, 0 // left bottom
  ]);

  const colorBuffer = createMyBuffer(gl, [
    1, 0, 0, // middle top - red
    0, 1, 0, // right bottom - green
    0, 0, 1, // left bottom - blue
  ]);


  // language=glsl
  const program = createProgram(gl, `
      precision mediump float;
      
      attribute vec3 position;
      attribute vec3 color;
      varying vec3 vColor;
      
      uniform mat4 matrix;
      
      void main() {
        vColor = color;
        gl_Position = matrix * vec4(position, 1);
      }`
    ,
    `
      precision mediump float;

      varying vec3 vColor;
      
      void main() {
        gl_FragColor = vec4(vColor, 1);
      }`
  );

  gl.useProgram(program);

  setProgramAttributeToMyBuffer(gl, program, 'position', positionBuffer);
  setProgramAttributeToMyBuffer(gl, program, 'color', colorBuffer);

  const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix')
  };

  const matrix = mat4.create();
  mat4.translate(matrix, matrix, [0.1, 0.1, 0]);
  mat4.scale(matrix, matrix, [0.5, 0.5, 0]);

  function animate() {
    requestAnimationFrame(animate);

    mat4.rotateZ(matrix, matrix, 0.01);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, positionBuffer.length);
  }

  animate();

  console.log('Starting main finished.');
}

main();