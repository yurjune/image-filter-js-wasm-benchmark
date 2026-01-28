import init, {
  grayscale_wasm,
  sepia_wasm,
  invert_wasm,
  contrast_wasm,
} from "./pkg/image_filter_js_wasm_benchmark.js";
import { grayscaleJS } from "./js-filters/grayscale.js";
import { sepiaJS } from "./js-filters/sepia.js";
import { invertJS } from "./js-filters/invert.js";
import { contrastJS } from "./js-filters/contrast.js";

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

function resetAllActiveState() {
  grayscaleBtn.classList.remove("active");
  sepiaBtn.classList.remove("active");
  invertBtn.classList.remove("active");
  contrastBtn.classList.remove("active");
}

// Filter selection
const grayscaleBtn = document.getElementById("grayscale-btn");
const sepiaBtn = document.getElementById("sepia-btn");
const invertBtn = document.getElementById("invert-btn");
const contrastBtn = document.getElementById("contrast-btn");

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
invertBtn.onclick = () => {
  resetAllActiveState();
  currentFilter = "invert";
  invertBtn.classList.add("active");
  resetCanvasAndBenchmark();
};
contrastBtn.onclick = () => {
  resetAllActiveState();
  currentFilter = "contrast";
  contrastBtn.classList.add("active");
  resetCanvasAndBenchmark();
};

document.getElementById("reset-btn").onclick = () => {
  resetCanvasAndBenchmark();
};

document.getElementById("start-btn").onclick = async () => {
  await init();

  const jsData = new Uint8ClampedArray(originalImageData.data);
  const wasmData = new Uint8ClampedArray(originalImageData.data);

  // JS test
  const jsStart = performance.now();
  if (currentFilter === "grayscale") {
    grayscaleJS(jsData);
  } else if (currentFilter === "sepia") {
    sepiaJS(jsData);
  } else if (currentFilter === "invert") {
    invertJS(jsData);
  } else {
    contrastJS(jsData, 100);
  }
  const jsTime = performance.now() - jsStart;

  // WASM test
  const wasmStart = performance.now();
  if (currentFilter === "grayscale") {
    grayscale_wasm(wasmData);
  } else if (currentFilter === "sepia") {
    sepia_wasm(wasmData);
  } else if (currentFilter === "invert") {
    invert_wasm(wasmData);
  } else {
    contrast_wasm(wasmData, 100);
  }
  const wasmTime = performance.now() - wasmStart;

  // Display results
  const jsTimeEl = document.getElementById("js-time");
  const wasmTimeEl = document.getElementById("wasm-time");

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
};
