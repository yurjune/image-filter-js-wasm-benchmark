use wasm_bindgen::prelude::wasm_bindgen;

// 가우시안 커널 (41x41, 반경 20, 시그마 ≈ 6.67)
const KERNEL_41: [u32; 41] = [
    1, 2, 3, 5, 8, 12, 18, 26, 37, 51, 69, 92, 119, 152, 190, 234, 283, 336, 393, 451, 508, 451,
    393, 336, 283, 234, 190, 152, 119, 92, 69, 51, 37, 26, 18, 12, 8, 5, 3, 2, 1,
];

#[wasm_bindgen]
pub fn gaussian_blur_wasm(pixels: &mut [u8], width: u32, height: u32) {
    let width = width as usize;
    let height = height as usize;

    // 임시 버퍼 (RGB 채널만, 알파는 제외)
    let mut buf = vec![0u8; width * height * 3];

    // 1단계: 수평 블러 (pixels -> buf)
    horizontal_blur(pixels, &mut buf, width, height, &KERNEL_41);

    // 2단계: 수직 블러 (buf -> pixels)
    vertical_blur(&buf, pixels, width, height, &KERNEL_41);
}

#[inline(always)]
fn horizontal_blur(src: &[u8], dst: &mut [u8], width: usize, height: usize, kernel: &[u32]) {
    let kernel_sum = kernel.iter().sum::<u32>();
    let kernel_radius = kernel.len() / 2;

    for y in 0..height {
        for x in 0..width {
            let mut r_sum = 0u32;
            let mut g_sum = 0u32;
            let mut b_sum = 0u32;

            for (i, &weight) in kernel.iter().enumerate() {
                let offset = i as isize - kernel_radius as isize;
                let sample_x = (x as isize + offset).clamp(0, width as isize - 1) as usize;
                let src_idx = (y * width + sample_x) * 4;

                r_sum += src[src_idx] as u32 * weight;
                g_sum += src[src_idx + 1] as u32 * weight;
                b_sum += src[src_idx + 2] as u32 * weight;
            }

            let dst_idx = (y * width + x) * 3;
            dst[dst_idx] = (r_sum / kernel_sum) as u8;
            dst[dst_idx + 1] = (g_sum / kernel_sum) as u8;
            dst[dst_idx + 2] = (b_sum / kernel_sum) as u8;
        }
    }
}

#[inline(always)]
fn vertical_blur(src: &[u8], dst: &mut [u8], width: usize, height: usize, kernel: &[u32]) {
    let kernel_sum = kernel.iter().sum::<u32>();
    let kernel_radius = kernel.len() / 2;

    for y in 0..height {
        for x in 0..width {
            let mut r_sum = 0u32;
            let mut g_sum = 0u32;
            let mut b_sum = 0u32;

            for (i, &weight) in kernel.iter().enumerate() {
                let offset = i as isize - kernel_radius as isize;
                let sample_y = (y as isize + offset).clamp(0, height as isize - 1) as usize;
                let src_idx = (sample_y * width + x) * 3;

                r_sum += src[src_idx] as u32 * weight;
                g_sum += src[src_idx + 1] as u32 * weight;
                b_sum += src[src_idx + 2] as u32 * weight;
            }

            let dst_idx = (y * width + x) * 4;
            dst[dst_idx] = (r_sum / kernel_sum) as u8;
            dst[dst_idx + 1] = (g_sum / kernel_sum) as u8;
            dst[dst_idx + 2] = (b_sum / kernel_sum) as u8;
        }
    }
}
