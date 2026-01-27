function rgbToLuma(r, g, b) {
  const rVal = r * 306; // 0.299 * 1024
  const gVal = g * 601; // 0.587 * 1024
  const bVal = b * 117; // 0.114 * 1024
  return (rVal + gVal + bVal) >> 10;
}

export function grayscaleJS(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    const luma = rgbToLuma(pixels[i], pixels[i + 1], pixels[i + 2]);
    pixels[i] = luma;
    pixels[i + 1] = luma;
    pixels[i + 2] = luma;
  }
}
