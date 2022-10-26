import {mat4, ReadonlyVec3, vec3} from 'gl-matrix'

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

  const r = () => Math.random() - 0.5; // -.5 < x < 0.5
  function spherePointCloud(pointCount: number) {
    let points = [];
    for (let i = 0; i < pointCount; i++) {
      const inputPoint: ReadonlyVec3 = [r(), r(), r()];
      const outputPoint = vec3.normalize(vec3.create(), inputPoint);
      points.push(...outputPoint);
    }
    return points;
  }

  const vertexData = spherePointCloud(1e3);
  const positionBuffer = createMyBuffer(gl, vertexData);

  // language=glsl
  const program = createProgram(gl, `
      precision mediump float;

      attribute vec3 position;
      varying vec3 vColor;

      uniform mat4 matrix;

      void main() {
        vColor = vec3(position.xy, 1);
        gl_Position = matrix * vec4(position, 1);
        gl_PointSize = 100.0 * gl_Position.x * position.y + 10.0;
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

  const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix')
  };

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
  mat4.translate(viewMatrix, viewMatrix, [0, 0, 1]);
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
    gl.drawArrays(gl.POINTS, 0, positionBuffer.length);
  }

  animate();

  console.log('Starting main finished.');
}

main();