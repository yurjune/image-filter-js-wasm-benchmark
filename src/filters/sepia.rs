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

#[wasm_bindgen]
pub fn sepia_wasm(pixels: &mut [u8]) {
    for chunk in pixels.chunks_exact_mut(4) {
        let (sepia_r, sepia_g, sepia_b) = rgb_to_sepia(chunk[0], chunk[1], chunk[2]);
        chunk[0] = sepia_r;
        chunk[1] = sepia_g;
        chunk[2] = sepia_b;
    }
}
