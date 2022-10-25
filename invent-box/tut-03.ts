export function main() {
  console.log('Starting main...');
  const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
  const gl = canvas.getContext('webgl')

  if (!gl) {
    throw new Error('WebGL is not supported');
  }

  const vertexData = [
    0, 1, 0, // middle top
    1, -1, 0, // right bottom
    -1, -1, 0 // left bottom
  ];

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  // language=glsl
  gl.shaderSource(vertexShader, `
    attribute vec3 position;
    void main() {
      gl_Position = vec4(position, 1);
    }
  `);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  // language=glsl
  gl.shaderSource(fragmentShader, `
    void main() {
      gl_FragColor = vec4(1, 0, 0, 1);
    }
  `);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  console.log('Starting main finished.');
}

main();