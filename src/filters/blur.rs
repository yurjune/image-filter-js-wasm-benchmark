use wasm_bindgen::prelude::wasm_bindgen;

const BOX_RADIUS: usize = 11;

#[wasm_bindgen]
pub fn gaussian_blur_wasm(pixels: &mut [u8], width: u32, height: u32) {
    let width = width as usize;
    let height = height as usize;

    let mut buf = vec![0u8; width * height * 3];

    for _ in 0..3 {
        // pixels(RGBA) -> buf(RGB)
        box_blur_h(pixels, &mut buf, width, height, BOX_RADIUS, true);
        // buf(RGB) -> pixels(RGBA)
        box_blur_v(&buf, pixels, width, height, BOX_RADIUS, true);
    }
}

#[inline(always)]
fn box_blur_h(
    src: &[u8],
    dst: &mut [u8],
    width: usize,
    height: usize,
    radius: usize,
    src_rgba: bool,
) {
    let src_stride = if src_rgba { 4 } else { 3 };

    for y in 0..height {
        let mut r_sum = 0u32;
        let mut g_sum = 0u32;
        let mut b_sum = 0u32;
        let mut count = 0u32;

        // 초기 윈도우
        for x in 0..=radius.min(width - 1) {
            let idx = (y * width + x) * src_stride;
            r_sum += src[idx] as u32;
            g_sum += src[idx + 1] as u32;
            b_sum += src[idx + 2] as u32;
            count += 1;
        }

        for x in 0..width {
            // 왼쪽 픽셀 제거
            if x > radius {
                let left_x = x - radius - 1;
                let idx = (y * width + left_x) * src_stride;
                r_sum -= src[idx] as u32;
                g_sum -= src[idx + 1] as u32;
                b_sum -= src[idx + 2] as u32;
                count -= 1;
            }

            // 오른쪽 픽셀 추가
            if x + radius < width {
                let right_x = x + radius;
                let idx = (y * width + right_x) * src_stride;
                r_sum += src[idx] as u32;
                g_sum += src[idx + 1] as u32;
                b_sum += src[idx + 2] as u32;
                count += 1;
            }

            let dst_idx = (y * width + x) * 3;
            dst[dst_idx] = (r_sum / count) as u8;
            dst[dst_idx + 1] = (g_sum / count) as u8;
            dst[dst_idx + 2] = (b_sum / count) as u8;
        }
    }
}

#[inline(always)]
fn box_blur_v(
    src: &[u8],
    dst: &mut [u8],
    width: usize,
    height: usize,
    radius: usize,
    dst_rgba: bool,
) {
    let dst_stride = if dst_rgba { 4 } else { 3 };

    for x in 0..width {
        let mut r_sum = 0u32;
        let mut g_sum = 0u32;
        let mut b_sum = 0u32;
        let mut count = 0u32;

        // 초기 윈도우
        for y in 0..=radius.min(height - 1) {
            let idx = (y * width + x) * 3;
            r_sum += src[idx] as u32;
            g_sum += src[idx + 1] as u32;
            b_sum += src[idx + 2] as u32;
            count += 1;
        }

        for y in 0..height {
            // 위쪽 픽셀 제거
            if y > radius {
                let top_y = y - radius - 1;
                let idx = (top_y * width + x) * 3;
                r_sum -= src[idx] as u32;
                g_sum -= src[idx + 1] as u32;
                b_sum -= src[idx + 2] as u32;
                count -= 1;
            }

            // 아래쪽 픽셀 추가
            if y + radius < height {
                let bottom_y = y + radius;
                let idx = (bottom_y * width + x) * 3;
                r_sum += src[idx] as u32;
                g_sum += src[idx + 1] as u32;
                b_sum += src[idx + 2] as u32;
                count += 1;
            }

            let dst_idx = (y * width + x) * dst_stride;
            dst[dst_idx] = (r_sum / count) as u8;
            dst[dst_idx + 1] = (g_sum / count) as u8;
            dst[dst_idx + 2] = (b_sum / count) as u8;
        }
    }
}
