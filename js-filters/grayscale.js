export function grayscaleJS(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] * 306; // 0.299 * 1024
    const g = pixels[i + 1] * 601; // 0.587 * 1024
    const b = pixels[i + 2] * 117; // 0.114 * 1024
    const luma = (r + g + b) >> 10;
    pixels[i] = luma;
    pixels[i + 1] = luma;
    pixels[i + 2] = luma;
  }
}
