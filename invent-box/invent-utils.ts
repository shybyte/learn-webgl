export function createProgram(gl: WebGLRenderingContext, vertexShaderSrc: string, fragmentShaderSrc: string): WebGLProgram {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vertexShader, vertexShaderSrc);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragmentShader, fragmentShaderSrc);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  return program;
}

interface MyBuffer {
  length: number;
  webglBuffer: WebGLBuffer;
}

export function createBuffer(gl: WebGLRenderingContext, data: number[]): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}

export function createMyBuffer(gl: WebGLRenderingContext, data: number[]): MyBuffer {
  return {
    length: data.length / 3,
    webglBuffer: createBuffer(gl, data),
  };
}

export function setProgramAttributeToMyBuffer(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  attributeName: string,
  myBuffer: MyBuffer
) {
  const location = gl.getAttribLocation(program, attributeName);
  gl.enableVertexAttribArray(location);
  gl.bindBuffer(gl.ARRAY_BUFFER, myBuffer.webglBuffer);
  gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
}