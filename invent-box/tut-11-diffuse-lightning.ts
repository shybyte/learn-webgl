import {mat4} from 'gl-matrix'

import {
  createMyBuffer,
  createProgram, loadTexture, repeat,
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

  const positionBuffer = createMyBuffer(gl, vertexData);

  const uvData = repeat(6, [
    1, 1, // top right
    1, 0, // bottom right
    0, 1, // top left

    0, 1, // top left
    1, 0, // bottom right
    0, 0  // bottom left
  ]);
  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);


  const brick = loadTexture(gl, `textures/default_brick.png`);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, brick);

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

  const uvLocation = gl.getAttribLocation(program, `uv`);
  gl.enableVertexAttribArray(uvLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

  const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix'),
    textureID: gl.getUniformLocation(program, 'textureID'),
  };

  gl.uniform1i(uniformLocations.textureID, 0);

  const modelMatrix = mat4.create();
  mat4.translate(modelMatrix, modelMatrix, [0, 0, -2]);
  // mat4.scale(modelMatrix, modelMatrix, [1, 1, 1]);

  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,
    75 * Math.PI / 180, //vertical field of view (angle, radians)
    canvas.width / canvas.height, // apsect ratio W/H
    1e-4, // near cull distance
    1e4 // far cull distance
  );

  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [0, -0 , 1]);
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