import {mat4} from 'gl-matrix'

import {
  createMyBuffer,
  createProgram,
  setProgramAttributeToMyBuffer,
} from "./invent-utils";

export function main() {
  console.log('Starting main...');

  const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = canvas.getContext('webgl')!;

  if (!gl) {
    throw new Error('WebGL is not supported');
  }

  const vertexData = [

    // Front
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, -.5, 0.5,

    // Left
    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    // Back
    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,

    // Right
    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Bottom
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,
  ];

  function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
  }

  const colorData = [];
  for (let face = 0; face < 6; face++) {
    let faceColor = randomColor();
    for (let vertex = 0; vertex < 6; vertex++) {
      colorData.push(...faceColor);
    }
  }

  const positionBuffer = createMyBuffer(gl, vertexData);
  const colorBuffer = createMyBuffer(gl, colorData);

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
  gl.enable(gl.DEPTH_TEST);

  setProgramAttributeToMyBuffer(gl, program, 'position', positionBuffer);
  setProgramAttributeToMyBuffer(gl, program, 'color', colorBuffer);

  const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix')
  };

  const modelMatrix = mat4.create();
  mat4.translate(modelMatrix, modelMatrix, [-1.5, 0, -2]);
  // mat4.scale(modelMatrix, modelMatrix, [1, 1, 1]);

  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,
    75 * Math.PI / 180, //vertical field of view (angle, radians)
    canvas.width / canvas.height, // apsect ratio W/H
    1e-4, // near cull distance
    1e4 // far cull distance
  );

  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [-3, -0 , 1]);
  mat4.invert(viewMatrix, viewMatrix);

  const mvMatrix = mat4.create();
  const finalMatrix = mat4.create();

  function animate() {
    requestAnimationFrame(animate);

    mat4.rotateZ(modelMatrix, modelMatrix, Math.PI/2 / 100);
    mat4.rotateX(modelMatrix, modelMatrix, Math.PI / 2 / 70);
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    mat4.multiply(finalMatrix, projectionMatrix, mvMatrix);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, positionBuffer.length);
  }

  animate();

  console.log('Starting main finished.');
}

main();