// Emboss kernel (3x3)
const KERNEL = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
const OFFSET = 128;

export function embossJS(pixels, width, height) {
  // 임시 버퍼 (RGBA 채널)
  const buf = new Uint8Array(pixels);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      // 3x3 커널 적용
      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          const offsetY = y + ky - 1;
          const offsetX = x + kx - 1;

          // 경계 처리 (clamp)
          const sampleY = Math.max(0, Math.min(height - 1, offsetY));
          const sampleX = Math.max(0, Math.min(width - 1, offsetX));

          const srcIdx = (sampleY * width + sampleX) * 4;
          const kernelIdx = ky * 3 + kx;
          const weight = KERNEL[kernelIdx];

          rSum += buf[srcIdx] * weight;
          gSum += buf[srcIdx + 1] * weight;
          bSum += buf[srcIdx + 2] * weight;
        }
      }

      const dstIdx = (y * width + x) * 4;
      pixels[dstIdx] = Math.max(0, Math.min(255, rSum + OFFSET));
      pixels[dstIdx + 1] = Math.max(0, Math.min(255, gSum + OFFSET));
      pixels[dstIdx + 2] = Math.max(0, Math.min(255, bSum + OFFSET));
      // Alpha channel remains unchanged
    }
  }
}
