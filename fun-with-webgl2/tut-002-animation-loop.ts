import {createMyBuffer, createProgram, renderLoop, setProgramAttributeToMyBuffer} from "./fun-utils";

export function main() {
  console.log('Starting main...');

  const infoDisplayElement = document.querySelector<HTMLDivElement>('#infoDisplay')!;

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
  uniform float uAngle;

  void main(void){
    gl_PointSize = uPointSize;
    gl_Position = vec4(
      cos(uAngle) * 0.1 + a_position.x,
      sin(uAngle) * 0.1 + a_position.y,
      a_position.z,
      1.0
    );
  }
  `, `#version 300 es
  precision mediump float;
  out vec4 finalColor;

  void main(void) {
    finalColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  `);
  gl.useProgram(shaderProg);

  const vertexData = [];
  for (let i = 0; i < 1_000; i++) {
    vertexData.push(Math.random() - 0.5);
    vertexData.push(Math.random() - 0.5);
    vertexData.push(0);
  }
  const vertexBuffer = createMyBuffer(gl, vertexData);

  setProgramAttributeToMyBuffer(gl, shaderProg, 'a_position', vertexBuffer);

  const uPointSizeLoc = gl.getUniformLocation(shaderProg, "uPointSize");
  const uAngle = gl.getUniformLocation(shaderProg, "uAngle");

  let gAngle = 0;
  const gAngleStep = (Math.PI / 180.0) * 90

  renderLoop((deltaTime, fps, frameCount) => {
    if (frameCount % 10 === 5) {
      infoDisplayElement.innerText = 'FPS: ' + fps;
    }

    gAngle += gAngleStep * deltaTime;								//Update the angle at the rate of AngleStep Per Second

    gl.uniform1f(uPointSizeLoc, 5.0 * Math.sin(performance.now() / 200) + 10);		//Store data to the shader's uniform variable uPointSize
    gl.uniform1f(uAngle, gAngle);							//Pass new angle value to the shader.
    gl.drawArrays(gl.POINTS, 0, vertexBuffer.length);
  })

  console.log('Starting main finished.');
}

main();