use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn grayscale_wasm(pixels: &mut [u8]) {
    for chunk in pixels.chunks_exact_mut(4) {
        let r = (chunk[0] as u32) * 306; // 0.299 * 1024
        let g = (chunk[1] as u32) * 601; // 0.587 * 1024
        let b = (chunk[2] as u32) * 117; // 0.114 * 1024
        let luma = ((r + g + b) >> 10) as u8;
        chunk[0] = luma;
        chunk[1] = luma;
        chunk[2] = luma;
    }
}
