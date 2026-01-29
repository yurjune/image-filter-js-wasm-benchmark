const BOX_RADIUS = 11;

export function gaussianBlurJS(pixels, width, height) {
  const buf = new Uint8Array(width * height * 3);

  // 3회 반복
  for (let i = 0; i < 3; i++) {
    // pixels(RGBA) -> buf(RGB)
    boxBlurH(pixels, buf, width, height, BOX_RADIUS, true);
    // buf(RGB) -> pixels(RGBA)
    boxBlurV(buf, pixels, width, height, BOX_RADIUS, true);
  }
}

function boxBlurH(src, dst, width, height, radius, srcRGBA) {
  const srcStride = srcRGBA ? 4 : 3;

  for (let y = 0; y < height; y++) {
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let count = 0;

    // 초기 윈도우
    for (let x = 0; x <= Math.min(radius, width - 1); x++) {
      const idx = (y * width + x) * srcStride;
      rSum += src[idx];
      gSum += src[idx + 1];
      bSum += src[idx + 2];
      count += 1;
    }

    for (let x = 0; x < width; x++) {
      // 왼쪽 픽셀 제거
      if (x > radius) {
        const leftX = x - radius - 1;
        const idx = (y * width + leftX) * srcStride;
        rSum -= src[idx];
        gSum -= src[idx + 1];
        bSum -= src[idx + 2];
        count -= 1;
      }

      // 오른쪽 픽셀 추가
      if (x + radius < width) {
        const rightX = x + radius;
        const idx = (y * width + rightX) * srcStride;
        rSum += src[idx];
        gSum += src[idx + 1];
        bSum += src[idx + 2];
        count += 1;
      }

      const dstIdx = (y * width + x) * 3;
      dst[dstIdx] = (rSum / count) | 0;
      dst[dstIdx + 1] = (gSum / count) | 0;
      dst[dstIdx + 2] = (bSum / count) | 0;
    }
  }
}

function boxBlurV(src, dst, width, height, radius, dstRGBA) {
  const dstStride = dstRGBA ? 4 : 3;

  for (let x = 0; x < width; x++) {
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let count = 0;

    // 초기 윈도우
    for (let y = 0; y <= Math.min(radius, height - 1); y++) {
      const idx = (y * width + x) * 3;
      rSum += src[idx];
      gSum += src[idx + 1];
      bSum += src[idx + 2];
      count += 1;
    }

    for (let y = 0; y < height; y++) {
      // 위쪽 픽셀 제거
      if (y > radius) {
        const topY = y - radius - 1;
        const idx = (topY * width + x) * 3;
        rSum -= src[idx];
        gSum -= src[idx + 1];
        bSum -= src[idx + 2];
        count -= 1;
      }

      // 아래쪽 픽셀 추가
      if (y + radius < height) {
        const bottomY = y + radius;
        const idx = (bottomY * width + x) * 3;
        rSum += src[idx];
        gSum += src[idx + 1];
        bSum += src[idx + 2];
        count += 1;
      }

      const dstIdx = (y * width + x) * dstStride;
      dst[dstIdx] = (rSum / count) | 0;
      dst[dstIdx + 1] = (gSum / count) | 0;
      dst[dstIdx + 2] = (bSum / count) | 0;
    }
  }
}
