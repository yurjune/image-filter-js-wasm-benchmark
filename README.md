# image-filter-js-wasm-benchmark

이미지 필터로 비교하는 Javascript vs WebAssembly 성능 비교 벤치마크

WebAssembly는 Rust로 작성되었고, wasm-bindgen으로 JavaScript와 바인딩됩니다.

wasm-pack으로 웹에서 직접 사용 가능한 WASM 모듈로 빌드합니다.

## Demo

[See Demo](https://yurjune.github.io/image-filter-js-wasm-benchmark/)

## Build

```bash
# WASM 빌드
wasm-pack build --target web --release
```

## Filters

- [x] Grayscale
- [x] Sepia
- [x] Contrast
- [x] Embossing 
- [x] Gaussian Blur
- [x] Sharpen
