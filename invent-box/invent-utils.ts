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
  size: number;
  webglBuffer: WebGLBuffer;
}

export function createBuffer(gl: WebGLRenderingContext, data: number[]): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}

export function createMyBuffer(gl: WebGLRenderingContext, data: number[], size = 3): MyBuffer {
  return {
    size: size,
    length: data.length / size,
    webglBuffer: createBuffer(gl, data),
  };
}

export function setProgramAttributeToMyBuffer(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  attributeName: string,
  myBuffer: MyBuffer,
) {
  const location = gl.getAttribLocation(program, attributeName);
  gl.enableVertexAttribArray(location);
  gl.bindBuffer(gl.ARRAY_BUFFER, myBuffer.webglBuffer);
  gl.vertexAttribPointer(location, myBuffer.size, gl.FLOAT, false, 0, 0);
}

export function loadTexture(
  gl: WebGLRenderingContext,
  url: string
) {
  const texture = gl.createTexture();
  const image = new Image();

  image.onload = _e => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  };

  image.src = url;
  return texture;
}

export function loadAndBindTexture(
  gl: WebGLRenderingContext,
  url: string,
  textureID: number
) {
  const brick = loadTexture(gl, url);
  gl.activeTexture(gl.TEXTURE0 + textureID);
  gl.bindTexture(gl.TEXTURE_2D, brick);
}

// Construct an Array by repeating `pattern` n times
export function repeat<T>(n: number, pattern: T | T[]): T[] {
  return [...Array(n)].reduce(sum => sum.concat(pattern), []);
}