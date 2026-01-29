export function sepiaJS(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    pixels[i] = Math.min((r * 402 + g * 787 + b * 194) >> 10, 255);
    pixels[i + 1] = Math.min((r * 357 + g * 702 + b * 172) >> 10, 255);
    pixels[i + 2] = Math.min((r * 278 + g * 547 + b * 134) >> 10, 255);
  }
}
