function rgbToLuma(r, g, b) {
  const rVal = r * 306; // 0.299 * 1024
  const gVal = g * 601; // 0.587 * 1024
  const bVal = b * 117; // 0.114 * 1024
  return (rVal + gVal + bVal) >> 10;
}

function blend(from, to, saturation) {
  const fromVal = from * saturation;
  const toVal = to * (1024 - saturation);
  return (fromVal + toVal) >> 10;
}

export function grayscaleJS(pixels, intensity) {
  const satFixed = 1024 - (((Math.min(intensity, 100) * 1024) / 100) | 0);

  for (let i = 0; i < pixels.length; i += 4) {
    const luma = rgbToLuma(pixels[i], pixels[i + 1], pixels[i + 2]);
    pixels[i] = blend(pixels[i], luma, satFixed);
    pixels[i + 1] = blend(pixels[i + 1], luma, satFixed);
    pixels[i + 2] = blend(pixels[i + 2], luma, satFixed);
  }
}
