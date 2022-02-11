console.log("Main loaded")

//Init variables - should be set dynamically
let paintColor = "#000000";
let dim = 32;
let canvasSize = 600;
let shadeUp = false;
let shadeDown = false;
let canvasData = [];
let loadData = [];
const gridContainer = document.querySelector('.grid-container');
const clearBtn = document.querySelector('.clearBtn');
const downloadBtn = document.querySelector("#downloadBtn");
const fileBtn = document.querySelector("#inputFile");
const gridSize = document.querySelector("#grid");
const lightenBtn = document.querySelector(".lightenBtn");
const darkenBtn = document.querySelector(".darkenBtn");

clearBtn.addEventListener("click", function() {
  clearPixels(gridContainer);
  initSketch(gridSize.value, canvasSize)
  addPixelEvents(paintColor);
});

//Event listener for downloading current canvas image file
downloadBtn.addEventListener("click", function() {
  downloadData(canvasData, "pixel_data.txt")
});

//Event listener for loading pixel art file
fileBtn.addEventListener("input", function() {
  let fr = new FileReader();
  fr.onload = function(){
    loadData = JSON.parse(fr.result);
    clearPixels(gridContainer);
    initSketch(Math.sqrt(loadData.length), canvasSize);
    addPixelEvents(paintColor);
    console.log(loadData);
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
});

lightenBtn.addEventListener("click", function() {
  shadeUp = !shadeUp;
  console.log(shadeUp)
});

darkenBtn.addEventListener("click", function() {
  shadeDown = !shadeDown;
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
      	pixel.style.backgroundColor = shadeColorHex(currentColor, 20);
      } else if (shadeDown) {
      	pixel.style.backgroundColor = shadeColorHex(currentColor, -20);
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
      	pixel.style.backgroundColor = shadeColorHex(currentColor, 20);
      } else if (shadeDown) {
      	pixel.style.backgroundColor = shadeColorHex(currentColor, -20);
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

//Should accept grid of colors probably
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

//function to make a list of pixels
function makePixelData(initialValue, dim) {
  let pixelData  = new Array(dim*dim);
  for(let i=0; i<dim*dim; i++) {
    pixelData[i] = initialValue;
  }
  canvasData = pixelData;
  return pixelData;
}

//not needed - simpler to use single dim array instead of 2d array
function makeGrid(initialValue, dim) {
  let gridData = [];
  for(let i=0; i<dim; i++) {
    let row = new Array(dim);
    for(let j=0; j<dim; j++) {
      row[j] = initialValue;
    }
    gridData.push(row)
  }
  return gridData;
}

//Function to shade hex colors by percentage
function shadeColorRGB(color, percent) {
  let rgb = color.match(/\d+/g);
  let R = rgb[0];
  let G = rgb[1];
  let B = rgb[2];
  console.log(R)

  //var R = parseInt(color.substring(1,3),16);
  //var G = parseInt(color.substring(3,5),16);
  //var B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;
  
  var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;

  return `rgb(${R},${G},${B})`
}

//Function to shade hex colors by percentage
function shadeColorHex(color, percent) {
  console.log(color, "from hex fuction")

  if(color === "#000000") {
  	color = "#111111";
  }

  var R = parseInt(color.substring(1,3),16);
  var G = parseInt(color.substring(3,5),16);
  var B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;

  var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}

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
