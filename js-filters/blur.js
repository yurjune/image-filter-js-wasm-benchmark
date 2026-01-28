// 가우시안 커널 (41x41, 반경 20, 시그마 ≈ 6.67)
const KERNEL_41 = [
  1, 2, 3, 5, 8, 12, 18, 26, 37, 51, 69, 92, 119, 152, 190, 234, 283, 336, 393,
  451, 508, 451, 393, 336, 283, 234, 190, 152, 119, 92, 69, 51, 37, 26, 18, 12,
  8, 5, 3, 2, 1,
];

export function gaussianBlurJS(pixels, width, height) {
  // 임시 버퍼 (RGB 채널만, 알파는 제외)
  const buf = new Uint8Array(width * height * 3);

  // 1단계: 수평 블러 (pixels -> buf)
  horizontalBlur(pixels, buf, width, height, KERNEL_41);

  // 2단계: 수직 블러 (buf -> pixels)
  verticalBlur(buf, pixels, width, height, KERNEL_41);
}

function horizontalBlur(src, dst, width, height, kernel) {
  const kernelSum = kernel.reduce((a, b) => a + b, 0);
  const kernelRadius = Math.floor(kernel.length / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let i = 0; i < kernel.length; i++) {
        const weight = kernel[i];
        const offset = i - kernelRadius;
        const sampleX = Math.max(0, Math.min(width - 1, x + offset));
        const srcIdx = (y * width + sampleX) * 4;

        rSum += src[srcIdx] * weight;
        gSum += src[srcIdx + 1] * weight;
        bSum += src[srcIdx + 2] * weight;
      }

      const dstIdx = (y * width + x) * 3;
      dst[dstIdx] = Math.floor(rSum / kernelSum);
      dst[dstIdx + 1] = Math.floor(gSum / kernelSum);
      dst[dstIdx + 2] = Math.floor(bSum / kernelSum);
    }
  }
}

function verticalBlur(src, dst, width, height, kernel) {
  const kernelSum = kernel.reduce((a, b) => a + b, 0);
  const kernelRadius = Math.floor(kernel.length / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let i = 0; i < kernel.length; i++) {
        const weight = kernel[i];
        const offset = i - kernelRadius;
        const sampleY = Math.max(0, Math.min(height - 1, y + offset));
        const srcIdx = (sampleY * width + x) * 3;

        rSum += src[srcIdx] * weight;
        gSum += src[srcIdx + 1] * weight;
        bSum += src[srcIdx + 2] * weight;
      }

      const dstIdx = (y * width + x) * 4;
      dst[dstIdx] = Math.floor(rSum / kernelSum);
      dst[dstIdx + 1] = Math.floor(gSum / kernelSum);
      dst[dstIdx + 2] = Math.floor(bSum / kernelSum);
    }
  }
}
