console.log("Main loaded")

//Init variables - better to set dynamically but ok
let paintColor = "#000000";
let lastColor = "#000000";
let dim = 36;
let canvasSize = 400;
let shadeUp = false;
let shadeDown = false;
let erase = false;
let canvasData = [];
let loadData = [];
const gridContainer = document.querySelector('.grid-container');
const eraseBtn = document.querySelector(".eraseBtn");
const clearBtn = document.querySelector(".clearBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const loadFileBtn = document.querySelector(".loadFileBtn")
const fileBtn = document.querySelector("#inputFile");
const gridSize = document.querySelector("#grid");
const lightenBtn = document.querySelector(".lightenBtn");
const darkenBtn = document.querySelector(".darkenBtn");
const gridValue = document.querySelector(".gridValue");

//Erase button listener that keeps last color while erasing back to white
eraseBtn.addEventListener("click", function() {
  erase = !erase;
  if(erase) {
  	eraseBtn.innerText = "ERASE ON";
  	paintColor = "#FFFFFF";
  } else {
    eraseBtn.innerText = "ERASE OFF";
  	paintColor = lastColor;
  }
});

//Clears the entire canvas
clearBtn.addEventListener("click", function() {
  shadeUp = false;
  shadeDown = false;
  lightenBtn.innerText = "Lighten Off";
  darkenBtn.innerText = "Darken Off";
  clearPixels(gridContainer);
  initSketch(gridSize.value, canvasSize)
  addPixelEvents(paintColor);
});

//Event listener for downloading current canvas image file
downloadBtn.addEventListener("click", function() {
  downloadData(canvasData, "pixie-sketch_image.px")
});

//Typical styled button sends click to invisible file input
loadFileBtn.addEventListener("click", function() {
  fileBtn.click()
});

//Event listener for loading pixel art file
fileBtn.addEventListener("input", function() {
  let fr = new FileReader();
  fr.onload = function(){
    loadData = JSON.parse(fr.result);
    clearPixels(gridContainer);
    initSketch(Math.sqrt(loadData.length), canvasSize);
    addPixelEvents(paintColor);
    updateCanvas(loadData);
  }
  fr.readAsText(this.files[0]);
});

//Event listener for grid size change
gridSize.addEventListener("change", (e) => {
  console.log(e.target.value)
  clearPixels(gridContainer);
  initSketch(e.target.value, canvasSize)
  addPixelEvents(paintColor);
  gridValue.innerText = `${e.target.value}x${e.target.value}`;
});

//Event Listener for lightening pixels
lightenBtn.addEventListener("click", function() {
  shadeUp = !shadeUp;
  shadeDown = false;
  darkenBtn.innerText = "DARKEN OFF";
  if(shadeUp) {
    lightenBtn.innerText = "LIGHTEN ON";
  } else {
  	lightenBtn.innerText = "LIGHTEN OFF";
  }
  console.log(shadeUp);
});

//Event listener for darkening pixels
darkenBtn.addEventListener("click", function() {
  shadeDown = !shadeDown;
  shadeUp = false;
  lightenBtn.innerText = "LIGHTEN OFF";
  if(shadeDown){
  	darkenBtn.innerText = "DARKEN ON";
  } else {
  	darkenBtn.innerText = "DARKEN OFF";
  }
  console.log(shadeDown);
});

//Main function to load drawing
function main() {
  let colorPicker = document.querySelector("#color");
  colorPicker.addEventListener("input", watchColorPicker, false);
  initSketch(dim, canvasSize);
  addPixelEvents(paintColor);
}

//Updates paint variable whenever the color picker is changed
function watchColorPicker(e) {
  paintColor = e.target.value;
  lastColor = paintColor;
  console.log(paintColor);
}

//Removes all pixels from canvas area
function clearPixels(parent) {
  while(parent.firstChild) {
  	parent.removeChild(parent.firstChild)
  }	
}

//Paints the canvas from array of colors
function updateCanvas(canvasData) {
  let pixels = document.querySelectorAll(".pixel")
  for(let i=0; i<canvasData.length; i++) {
    pixels[i].style.backgroundColor = canvasData[i] 
  }	
}

//Lets you download image data as a color list
function downloadData(obj, filename){
  let blob = new Blob([JSON.stringify(obj, null, 2)], {type: "application/json;charset=utf-8"});
  let url = URL.createObjectURL(blob);
  let elem = document.createElement("a");
  elem.href = url;
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

//Adds mouse down and mouse over events to the canvas pixels
function addPixelEvents(color) {
  let draw = false
  let pixelList = document.querySelectorAll('.pixel')
  pixelList.forEach(pixel => {
    pixel.addEventListener("mouseover", (e) => {
      if(!draw) return;
      let currentColor = RGBToHex(pixel.style.backgroundColor);
      if(shadeUp){
        console.log(currentColor);
      	pixel.style.backgroundColor = shadeColorHex(currentColor, 23);
      } else if (shadeDown) {
      	pixel.style.backgroundColor = shadeColorHex(currentColor, -16);
      } else {
        pixel.style.backgroundColor = paintColor;
        canvasData[parseInt(pixel.id)] = paintColor; 	
      }
    });
    pixel.addEventListener("mousedown", (e) => {
      console.log(pixel);
      let currentColor = RGBToHex(pixel.style.backgroundColor);
      if(shadeUp){
        console.log(currentColor);
      	pixel.style.backgroundColor = shadeColorHex(currentColor, 23);
      } else if (shadeDown) {
      	pixel.style.backgroundColor = shadeColorHex(currentColor, -16);
      } else {
        pixel.style.backgroundColor = paintColor;
        canvasData[parseInt(pixel.id)] = paintColor; 	
      }
    });
  });
  window.addEventListener("mousedown", function(){
    draw = true
  });
  window.addEventListener("mouseup", function(){
    draw = false
  });
}

//Function to initialize canvas
function initSketch(dim, canvasSize) {
  const grid = document.querySelector(".grid-container");
  grid.style.width = `${canvasSize}px`;
  grid.style.height = `${canvasSize}px`;
  
  let pixelData = makePixelData("#FFFFFF", dim);

  for(let i=0;i<pixelData.length;i++){
    let newPixel = document.createElement('div');
    newPixel.className = "pixel";
    newPixel.id = i;
    newPixel.style.backgroundColor = pixelData[i];
    newPixel.style.flexBasis = `${canvasSize/dim}px`;
    grid.appendChild(newPixel);  	
  }
}

//Function to make a list of pixels
function makePixelData(initialValue, dim) {
  let pixelData  = new Array(dim*dim);
  for(let i=0; i<dim*dim; i++) {
    pixelData[i] = initialValue;
  }
  canvasData = pixelData;
  return pixelData;
}

//Function to shade hex colors by percentage
function shadeColorHex(color, percent) {

  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  //Any zero values to get bumped up (otherwise they get stuck at 0)
  R = (R<=0)?25:R;
  G = (G<=0)?25:G;
  B = (B<=0)?25:B;
  
  console.log(R, G, B)
  
  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  //Keep any white values from going out of range
  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;

  let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}

//function to convert rgb string to hex
function RGBToHex(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

main();
