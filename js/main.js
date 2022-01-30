console.log("Main loaded")

main();

function main() {
  initSketch(60, 650);

  pixelList = document.querySelectorAll('.pixel')
  console.log(pixelList)
  
  pixelList.forEach(pixel => {
    pixel.addEventListener("mousedown", (e) => {
      pixel.style.backgroundColor = "black"
    });
    //this is triggering too many events
    pixel.addEventListener("mousemove", (e) => {
      if(e.buttons === 1) {
        console.log(e, pixel)
        pixel.style.backgroundColor = "black"
      }

    });
  })
}


function initSketch(dim, canvasSize) {
  const grid = document.querySelector(".grid-container");
  grid.style.width = `${canvasSize}px`;
  grid.style.height = `${canvasSize}px`;
  let gridData = makeGrid(0, dim);
  console.log(gridData)

  gridData.forEach((row) => {
    row.forEach((pixel) => {
      let newPixel = document.createElement('div');
      newPixel.className = "pixel";
      newPixel.style.flexBasis = `${canvasSize/dim}px`;
      grid.appendChild(newPixel);
    });
  });
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