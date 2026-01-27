function rgbToSepia(r, g, b) {
  const outputR = Math.min((r * 402 + g * 787 + b * 194) >> 10, 255);
  const outputG = Math.min((r * 357 + g * 702 + b * 172) >> 10, 255);
  const outputB = Math.min((r * 278 + g * 547 + b * 134) >> 10, 255);
  return [outputR, outputG, outputB];
}

export function sepiaJS(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    const [sepiaR, sepiaG, sepiaB] = rgbToSepia(
      pixels[i],
      pixels[i + 1],
      pixels[i + 2],
    );
    pixels[i] = sepiaR;
    pixels[i + 1] = sepiaG;
    pixels[i + 2] = sepiaB;
  }
}
