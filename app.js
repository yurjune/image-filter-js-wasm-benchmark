import init, {
  grayscale_wasm,
  sepia_wasm,
  contrast_wasm,
  gaussian_blur_wasm,
  sharpen_wasm,
  emboss_wasm,
} from "./pkg/image_filter_js_wasm_benchmark.js";
import { grayscaleJS } from "./js-filters/grayscale.js";
import { sepiaJS } from "./js-filters/sepia.js";
import { contrastJS } from "./js-filters/contrast.js";
import { gaussianBlurJS } from "./js-filters/blur.js";
import { sharpenJS } from "./js-filters/sharpen.js";
import { embossJS } from "./js-filters/emboss.js";

// Initialize WASM when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  await init();

  const mockData = new Uint8ClampedArray(500000);
  grayscale_wasm(mockData);
  sepia_wasm(mockData);
  contrast_wasm(mockData, 100);

  emboss_wasm(new Uint8ClampedArray(10000), 50, 50);
  sharpen_wasm(new Uint8ClampedArray(10000), 50, 50);
  gaussian_blur_wasm(new Uint8ClampedArray(40000), 100, 100);

  console.log("warmed up");
});

let currentFilter = "grayscale";
let originalImageData = null;

const canvasJS = document.getElementById("canvas-js");
const canvasWASM = document.getElementById("canvas-wasm");
const ctxJS = canvasJS.getContext("2d");
const ctxWASM = canvasWASM.getContext("2d");

// Load image
const img = new Image();
img.src = "./assets/image.jpg";
img.onload = () => {
  canvasJS.width = canvasWASM.width = img.width;
  canvasJS.height = canvasWASM.height = img.height;
  ctxJS.drawImage(img, 0, 0);
  ctxWASM.drawImage(img, 0, 0);
  originalImageData = ctxJS.getImageData(0, 0, img.width, img.height);
};

function resetCanvasAndBenchmark() {
  if (originalImageData) {
    ctxJS.putImageData(originalImageData, 0, 0);
    ctxWASM.putImageData(originalImageData, 0, 0);
    const jsTimeEl = document.getElementById("js-time");
    const wasmTimeEl = document.getElementById("wasm-time");
    jsTimeEl.textContent = "";
    wasmTimeEl.textContent = "";
    jsTimeEl.className = "";
    wasmTimeEl.className = "";
  }
}

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const jsTimeEl = document.getElementById("js-time");
const wasmTimeEl = document.getElementById("wasm-time");

// Filter selection
const grayscaleBtn = document.getElementById("grayscale-btn");
const sepiaBtn = document.getElementById("sepia-btn");
const contrastBtn = document.getElementById("contrast-btn");
const embossBtn = document.getElementById("emboss-btn");
const sharpenBtn = document.getElementById("sharpen-btn");
const blurBtn = document.getElementById("blur-btn");

function resetAllActiveState() {
  grayscaleBtn.classList.remove("active");
  sepiaBtn.classList.remove("active");
  contrastBtn.classList.remove("active");
  embossBtn.classList.remove("active");
  sharpenBtn.classList.remove("active");
  blurBtn.classList.remove("active");
}

grayscaleBtn.onclick = () => {
  resetAllActiveState();
  currentFilter = "grayscale";
  grayscaleBtn.classList.add("active");
  resetCanvasAndBenchmark();
};
sepiaBtn.onclick = () => {
  resetAllActiveState();
  currentFilter = "sepia";
  sepiaBtn.classList.add("active");
  resetCanvasAndBenchmark();
};
contrastBtn.onclick = () => {
  resetAllActiveState();
  currentFilter = "contrast";
  contrastBtn.classList.add("active");
  resetCanvasAndBenchmark();
};
embossBtn.onclick = () => {
  resetAllActiveState();
  currentFilter = "emboss";
  embossBtn.classList.add("active");
  resetCanvasAndBenchmark();
};
sharpenBtn.onclick = () => {
  resetAllActiveState();
  currentFilter = "sharpen";
  sharpenBtn.classList.add("active");
  resetCanvasAndBenchmark();
};
blurBtn.onclick = () => {
  resetAllActiveState();
  currentFilter = "blur";
  blurBtn.classList.add("active");
  resetCanvasAndBenchmark();
};

document.getElementById("reset-btn").onclick = () => {
  resetCanvasAndBenchmark();
};

document.getElementById("start-btn").onclick = async () => {
  startBtn.disabled = true;
  resetBtn.disabled = true;
  jsTimeEl.className = "";
  wasmTimeEl.className = "";
  jsTimeEl.textContent = "Running...";
  wasmTimeEl.textContent = "Running...";

  // avoid ui update blocking
  await new Promise((resolve) => setTimeout(resolve, 0));

  const jsData = new Uint8ClampedArray(originalImageData.data);
  const wasmData = new Uint8ClampedArray(originalImageData.data);

  // JS test
  const jsStart = performance.now();
  if (currentFilter === "grayscale") {
    grayscaleJS(jsData);
  } else if (currentFilter === "sepia") {
    sepiaJS(jsData);
  } else if (currentFilter === "contrast") {
    contrastJS(jsData, 100);
  } else if (currentFilter === "emboss") {
    embossJS(jsData, canvasJS.width, canvasJS.height);
  } else if (currentFilter === "sharpen") {
    sharpenJS(jsData, canvasJS.width, canvasJS.height);
  } else if (currentFilter === "blur") {
    gaussianBlurJS(jsData, canvasJS.width, canvasJS.height);
  }
  const jsTime = performance.now() - jsStart;

  // WASM test
  const wasmStart = performance.now();
  if (currentFilter === "grayscale") {
    grayscale_wasm(wasmData);
  } else if (currentFilter === "sepia") {
    sepia_wasm(wasmData);
  } else if (currentFilter === "contrast") {
    contrast_wasm(wasmData, 100);
  } else if (currentFilter === "emboss") {
    emboss_wasm(wasmData, canvasWASM.width, canvasWASM.height);
  } else if (currentFilter === "sharpen") {
    sharpen_wasm(wasmData, canvasWASM.width, canvasWASM.height);
  } else if (currentFilter === "blur") {
    gaussian_blur_wasm(wasmData, canvasWASM.width, canvasWASM.height);
  }
  const wasmTime = performance.now() - wasmStart;

  // Display results
  jsTimeEl.textContent = jsTime.toFixed(2) + "ms";
  wasmTimeEl.textContent = wasmTime.toFixed(2) + "ms";

  jsTimeEl.className = "";
  wasmTimeEl.className = "";

  if (jsTime < wasmTime) {
    jsTimeEl.classList.add("time-fast");
    wasmTimeEl.classList.add("time-slow");
  } else if (wasmTime < jsTime) {
    wasmTimeEl.classList.add("time-fast");
    jsTimeEl.classList.add("time-slow");
  }

  // Draw results
  const jsImageData = new ImageData(jsData, canvasJS.width, canvasJS.height);
  const wasmImageData = new ImageData(
    wasmData,
    canvasWASM.width,
    canvasWASM.height,
  );

  ctxJS.putImageData(jsImageData, 0, 0);
  ctxWASM.putImageData(wasmImageData, 0, 0);

  // prevent reserved click event fire
  setTimeout(() => {
    startBtn.disabled = false;
    resetBtn.disabled = false;
  }, 0);
};
