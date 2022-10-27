import {createMyBuffer, createProgram, setProgramAttributeToMyBuffer} from "./fun-utils";

export function main() {
  console.log('Starting main...');

  const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = canvas.getContext('webgl2')!;

  if (!gl) {
    throw new Error('WebGL is not supported');
  }

  // language=glsl
  const shaderProg = createProgram(gl, `#version 300 es
  in vec3 a_position;
  uniform float uPointSize;

  void main(void){
    gl_PointSize = uPointSize;
    gl_Position = vec4(a_position, 1.0);
  }
  `, `#version 300 es
  precision mediump float;
  out vec4 finalColor;

  void main(void) {
    finalColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  `);
  gl.useProgram(shaderProg);

  const vertexBuffer = createMyBuffer(gl, [
    0, 0, 0,
    0, 0.5, 0,
  ]);

  setProgramAttributeToMyBuffer(gl, shaderProg, 'a_position', vertexBuffer);

  const uPointSizeLoc = gl.getUniformLocation(shaderProg, "uPointSize");
  gl.uniform1f(uPointSizeLoc, 50.0);		//Store data to the shader's uniform variable uPointSize

  gl.drawArrays(gl.POINTS, 0, vertexBuffer.length);

  console.log('Starting main finished.');
}

main();