console.log("Main loaded")

let paintColor = "#000000";
let dim = 5;
let canvasSize = 600;

main();

function main() {
 
  let colorPicker = document.querySelector("#color");
  //colorPicker.addEventListener("change", watchColorPicker, false)
  colorPicker.addEventListener("input", watchColorPicker, false);
  initSketch(dim, canvasSize);
  addPixelEvents(paintColor);
}

function watchColorPicker(e) {
  paintColor = e.target.value;
}

function updateCanvas(color, canvasSize) {
 // pixelList.forEach(pixel => {
  	
 // });
  
}

function addPixelEvents(color) {
  let draw = false

  let pixelList = document.querySelectorAll('.pixel')
  //console.log(pixelList)

  
  pixelList.forEach(pixel => {
    pixel.addEventListener("mouseover", (e) => {
      if(!draw) return;
      pixel.style.backgroundColor = paintColor;
      pixelList[parseInt(pixel.id)] = paintColor;
      console.log(parseInt(pixel.id));
    });
    pixel.addEventListener("mousedown", (e) => {
      pixel.style.backgroundColor = paintColor;
      pixelList[parseInt(pixel.id)] = paintColor;
      console.log(parseInt(pixel.id));
    });
  });

  window.addEventListener("mousedown", function(){
    draw = true
  });
  window.addEventListener("mouseup", function(){
    draw = false
  });

}


//Should accept grid of colors
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

function updateCanvas(pixelArray, dim, canvasSize) {
  //clear grid
  //const grid = document.querySelector(".grid-container");
  //grid.innerHTML = "";
  
  pixelArray.forEach((row) => {
    row.forEach((pixel) => {
      let newPixel = document.createElement('div');
      newPixel.className = "pixel";
      newPixel.style.backgroundColor = pixel;
      newPixel.style.flexBasis = `${canvasSize/dim}px`;
      grid.appendChild(newPixel);
    });
  });	
}

function makePixelData(initialValue, dim) {
  let pixelData  = new Array(dim*dim);
  for(let i=0; i<dim*dim; i++) {
    pixelData[i] = initialValue;
  }
  return pixelData;
}

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

function shadeColor(color, percent) {
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
