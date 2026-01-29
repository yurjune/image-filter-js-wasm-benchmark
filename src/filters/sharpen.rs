use wasm_bindgen::prelude::wasm_bindgen;

// Sharpen kernel (3x3 Laplacian): center weight = 9, neighbors = -1
// Total sum = 9 + (-1 * 8) = 1 (normalized)
const KERNEL: [i32; 9] = [-1, -1, -1, -1, 9, -1, -1, -1, -1];

#[wasm_bindgen]
pub fn sharpen_wasm(pixels: &mut [u8], width: u32, height: u32) {
    let width = width as usize;
    let height = height as usize;

    let mut buf = vec![0u8; width * height * 4];
    buf.copy_from_slice(pixels);

    for y in 0..height {
        for x in 0..width {
            let mut r_sum = 0i32;
            let mut g_sum = 0i32;
            let mut b_sum = 0i32;

            for ky in 0..3 {
                for kx in 0..3 {
                    let offset_y = y as isize + ky as isize - 1;
                    let offset_x = x as isize + kx as isize - 1;

                    let sample_y = offset_y.clamp(0, height as isize - 1) as usize;
                    let sample_x = offset_x.clamp(0, width as isize - 1) as usize;

                    let src_idx = (sample_y * width + sample_x) * 4;
                    let kernel_idx = ky * 3 + kx;
                    let weight = KERNEL[kernel_idx];

                    r_sum += buf[src_idx] as i32 * weight;
                    g_sum += buf[src_idx + 1] as i32 * weight;
                    b_sum += buf[src_idx + 2] as i32 * weight;
                }
            }

            let dst_idx = (y * width + x) * 4;
            pixels[dst_idx] = r_sum.clamp(0, 255) as u8;
            pixels[dst_idx + 1] = g_sum.clamp(0, 255) as u8;
            pixels[dst_idx + 2] = b_sum.clamp(0, 255) as u8;
            // Alpha channel remains unchanged
        }
    }
}
