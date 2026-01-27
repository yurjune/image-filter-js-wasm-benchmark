use wasm_bindgen::prelude::wasm_bindgen;

#[inline(always)]
fn rgb_to_sepia(r: u8, g: u8, b: u8) -> (u8, u8, u8) {
    let r = r as u32;
    let g = g as u32;
    let b = b as u32;
    let output_r = ((r * 402 + g * 787 + b * 194) >> 10).min(255);
    let output_g = ((r * 357 + g * 702 + b * 172) >> 10).min(255);
    let output_b = ((r * 278 + g * 547 + b * 134) >> 10).min(255);
    (output_r as u8, output_g as u8, output_b as u8)
}

#[inline(always)]
fn blend(from: u8, to: u8, intensity: u32) -> u8 {
    let from = (from as u32) * (1024 - intensity);
    let to = (to as u32) * intensity;
    ((from + to) >> 10) as u8
}

#[wasm_bindgen]
pub fn sepia_wasm(pixels: &mut [u8], intensity: u8) {
    let intensity_fixed = intensity.min(100) as u32 * 1024 / 100;

    for chunk in pixels.chunks_exact_mut(4) {
        let (sepia_r, sepia_g, sepia_b) = rgb_to_sepia(chunk[0], chunk[1], chunk[2]);
        chunk[0] = blend(chunk[0], sepia_r, intensity_fixed);
        chunk[1] = blend(chunk[1], sepia_g, intensity_fixed);
        chunk[2] = blend(chunk[2], sepia_b, intensity_fixed);
    }
}
