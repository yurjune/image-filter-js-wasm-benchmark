use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn invert_wasm(pixels: &mut [u8]) {
    for chunk in pixels.chunks_exact_mut(4) {
        chunk[0] = 255 - chunk[0];
        chunk[1] = 255 - chunk[1];
        chunk[2] = 255 - chunk[2];
    }
}
