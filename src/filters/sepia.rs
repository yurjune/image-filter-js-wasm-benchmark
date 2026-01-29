use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn sepia_wasm(pixels: &mut [u8]) {
    for chunk in pixels.chunks_exact_mut(4) {
        let r = chunk[0] as u32;
        let g = chunk[1] as u32;
        let b = chunk[2] as u32;
        chunk[0] = ((r * 402 + g * 787 + b * 194) >> 10).min(255) as u8;
        chunk[1] = ((r * 357 + g * 702 + b * 172) >> 10).min(255) as u8;
        chunk[2] = ((r * 278 + g * 547 + b * 134) >> 10).min(255) as u8;
    }
}
