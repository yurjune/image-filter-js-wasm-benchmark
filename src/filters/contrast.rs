use wasm_bindgen::prelude::wasm_bindgen;

const CONTRAST: i32 = 100;

#[inline(always)]
fn apply_contrast(value: u8, factor: i32) -> u8 {
    let shifted = (value as i32 - 128) * factor;
    ((shifted >> 10) + 128).clamp(0, 255) as u8
}

#[wasm_bindgen]
pub fn contrast_wasm(pixels: &mut [u8]) {
    let factor = (259 * (CONTRAST + 255) * 1024) / (255 * (259 - CONTRAST));

    for chunk in pixels.chunks_exact_mut(4) {
        chunk[0] = apply_contrast(chunk[0], factor);
        chunk[1] = apply_contrast(chunk[1], factor);
        chunk[2] = apply_contrast(chunk[2], factor);
    }
}
