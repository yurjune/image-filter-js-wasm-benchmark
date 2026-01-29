// Sharpen kernel (5x5 Laplacian): center weight = 25, neighbors = -1
// Total sum = 25 + (-1 * 24) = 1 (normalized)
const KERNEL = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 25, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1,
];
const KERNEL_SIZE = 5;

export function sharpenJS(pixels, width, height) {
  const buf = new Uint8Array(pixels);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let ky = 0; ky < KERNEL_SIZE; ky++) {
        for (let kx = 0; kx < KERNEL_SIZE; kx++) {
          const offsetY = y + ky - 2;
          const offsetX = x + kx - 2;

          const sampleY = Math.max(0, Math.min(height - 1, offsetY));
          const sampleX = Math.max(0, Math.min(width - 1, offsetX));

          const srcIdx = (sampleY * width + sampleX) * 4;
          const kernelIdx = ky * KERNEL_SIZE + kx;
          const weight = KERNEL[kernelIdx];

          rSum += buf[srcIdx] * weight;
          gSum += buf[srcIdx + 1] * weight;
          bSum += buf[srcIdx + 2] * weight;
        }
      }

      const dstIdx = (y * width + x) * 4;
      pixels[dstIdx] = Math.max(0, Math.min(255, rSum));
      pixels[dstIdx + 1] = Math.max(0, Math.min(255, gSum));
      pixels[dstIdx + 2] = Math.max(0, Math.min(255, bSum));
      // Alpha channel remains unchanged
    }
  }
}
