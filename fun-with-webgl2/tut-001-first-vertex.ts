export function main() {
  console.log('Starting main...');

  const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = canvas.getContext('webgl2')!;

  if (!gl) {
    throw new Error('WebGL is not supported');
  }

  console.log('Starting main finished.');
}

main();