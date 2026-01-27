mod filters;
pub use filters::grayscale::grayscale_wasm;
pub use filters::sepia::sepia_wasm;
pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;
