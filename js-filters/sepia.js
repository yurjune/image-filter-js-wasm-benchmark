function rgbToSepia(r, g, b) {
  const outputR = Math.min((r * 402 + g * 787 + b * 194) >> 10, 255);
  const outputG = Math.min((r * 357 + g * 702 + b * 172) >> 10, 255);
  const outputB = Math.min((r * 278 + g * 547 + b * 134) >> 10, 255);
  return [outputR, outputG, outputB];
}

function blend(from, to, intensity) {
  const fromVal = from * (1024 - intensity);
  const toVal = to * intensity;
  return (fromVal + toVal) >> 10;
}

export function sepiaJS(pixels, intensity) {
  const intensityFixed = ((Math.min(intensity, 100) * 1024) / 100) | 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const [sepiaR, sepiaG, sepiaB] = rgbToSepia(
      pixels[i],
      pixels[i + 1],
      pixels[i + 2],
    );
    pixels[i] = blend(pixels[i], sepiaR, intensityFixed);
    pixels[i + 1] = blend(pixels[i + 1], sepiaG, intensityFixed);
    pixels[i + 2] = blend(pixels[i + 2], sepiaB, intensityFixed);
  }
}
