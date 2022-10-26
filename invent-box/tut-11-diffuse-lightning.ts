import {mat4} from 'gl-matrix'

import {
  createMyBuffer,
  createProgram,
  loadAndBindTexture,
  loadTexture,
  repeat,
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
    0.5, 0.5, 0.5, // top right
    0.5, -.5, 0.5, // bottom right
    -.5, 0.5, 0.5, // top left
    -.5, 0.5, 0.5, // top left
    0.5, -.5, 0.5, // bottom right
    -.5, -.5, 0.5, // bottom left

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

    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, -0.5,
    0.5, -.5, 0.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Underside
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,
  ];

  const positionBuffer = createMyBuffer(gl, vertexData);

  const uvData = repeat(6, [
    1, 1, // top right
    1, 0, // bottom right
    0, 1, // top left

    0, 1, // top left
    1, 0, // bottom right
    0, 0  // bottom left
  ]);

  const uvBuffer = createMyBuffer(gl, uvData, 2);

  const brick = loadTexture(gl, `textures/invent-box-logo-512px.jpg`);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, brick);

  const TEXTURE_ID = 0;
  loadAndBindTexture(gl, `textures/invent-box-logo-512px.jpg`, TEXTURE_ID);

  // language=glsl
  const program = createProgram(gl, `
      precision mediump float;

      attribute vec3 position;
      attribute vec2 uv;

      varying vec2 vUV;

      uniform mat4 matrix;

      void main() {
        vUV = uv;
        gl_Position = matrix * vec4(position, 1);
      }`
    ,
    `
      precision mediump float;

      varying vec2 vUV;
      uniform sampler2D textureID;

      void main() {
        gl_FragColor = texture2D(textureID, vUV);
      }`
  );

  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);

  setProgramAttributeToMyBuffer(gl, program, 'position', positionBuffer);
  setProgramAttributeToMyBuffer(gl, program, 'uv', uvBuffer);

  const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix'),
    textureID: gl.getUniformLocation(program, 'textureID'),
  };

  gl.uniform1i(uniformLocations.textureID, TEXTURE_ID);

  const modelMatrix = mat4.create();
  mat4.translate(modelMatrix, modelMatrix, [0, 0, -1]);
  // mat4.scale(modelMatrix, modelMatrix, [1, 1, 1]);

  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,
    75 * Math.PI / 180, //vertical field of view (angle, radians)
    canvas.width / canvas.height, // apsect ratio W/H
    1e-4, // near cull distance
    1e4 // far cull distance
  );

  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [0, -0, 1]);
  mat4.invert(viewMatrix, viewMatrix);

  const mvMatrix = mat4.create();
  const finalMatrix = mat4.create();

  function animate() {
    requestAnimationFrame(animate);

    mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 2 / 100);
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