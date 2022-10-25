import {createMyBuffer, createProgram, setProgramAttributeToMyBuffer} from "./invent-utils";

export function main() {
  console.log('Starting main...');
  const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
  const gl = canvas.getContext('webgl');

  if (!gl) {
    throw new Error('WebGL is not supported');
  }

  const buffer = createMyBuffer(gl, [
    0, 1, 0, // middle top
    1, -1, 0, // right bottom
    -1, -1, 0 // left bottom
  ]);

  const buffer2 = createMyBuffer(gl, [
    -.75, 1, 0, // middle top
    -0.5, 0.5, 0, // right bottom
    -1, 0.5, 0, // left bottom
    // seconds
    0.75, 1, 0, // middle top
    0.5, 0, 0, // right bottom
    1, 0, 0 // left bottom
  ]);

  // language=glsl
  const program = createProgram(gl, `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1);
      }`
    ,
    `
      void main() {
        gl_FragColor = vec4(1, 0.5, 0, 1);
      }`
  );

  gl.useProgram(program);

  setProgramAttributeToMyBuffer(gl, program, 'position', buffer);
  gl.drawArrays(gl.TRIANGLES, 0, buffer.length);

  setProgramAttributeToMyBuffer(gl, program, 'position', buffer2);
  gl.drawArrays(gl.TRIANGLES, 0, buffer2.length);

  console.log('Starting main finished.');
}

main();