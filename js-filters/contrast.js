function applyContrast(value, factor) {
  const shifted = (value - 128) * factor;
  return Math.max(0, Math.min(255, (shifted >> 10) + 128));
}

export function contrastJS(pixels, contrast) {
  const clampedContrast = Math.max(-100, Math.min(100, contrast));
  const factor =
    ((259 * (clampedContrast + 255) * 1024) / (255 * (259 - clampedContrast))) |
    0;

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = applyContrast(pixels[i], factor);
    pixels[i + 1] = applyContrast(pixels[i + 1], factor);
    pixels[i + 2] = applyContrast(pixels[i + 2], factor);
  }
}
