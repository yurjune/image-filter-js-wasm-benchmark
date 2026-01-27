use wasm_bindgen::prelude::wasm_bindgen;

#[inline(always)]
fn rgb_to_luma(r: u8, g: u8, b: u8) -> u8 {
    let r = (r as u32) * 306; // 0.299 * 1024
    let g = (g as u32) * 601; // 0.587 * 1024
    let b = (b as u32) * 117; // 0.114 * 1024
    ((r + g + b) >> 10) as u8
}

#[inline(always)]
fn blend(from: u8, to: u8, saturation: u32) -> u8 {
    let from = (from as u32) * saturation;
    let to = (to as u32) * (1024 - saturation);
    ((from + to) >> 10) as u8
}

#[wasm_bindgen]
pub fn grayscale_wasm(pixels: &mut [u8], intensity: u8) {
    let sat_fixed = 1024 - (intensity.min(100) as u32 * 1024 / 100);

    for chunk in pixels.chunks_exact_mut(4) {
        let luma = rgb_to_luma(chunk[0], chunk[1], chunk[2]);
        chunk[0] = blend(chunk[0], luma, sat_fixed);
        chunk[1] = blend(chunk[1], luma, sat_fixed);
        chunk[2] = blend(chunk[2], luma, sat_fixed);
    }
}
