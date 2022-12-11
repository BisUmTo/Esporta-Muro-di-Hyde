let esporta = document.querySelectorAll(".esporta");

esporta.forEach(element => {
  element.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    let formato = element.getAttribute("formato");
    let funzione = formato=="CSV"?exportCSV:
                   formato=="PNG"?exportPNG:
                   formato=="NBT"?exportNBT:
                   ()=>{};

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: funzione
    });
  })
});

// ESPORT CSV
function exportCSV() {
  var tiles = collectTiles();
  let csvContent = "data:text/csv;charset=utf-8," 
    + encodeURIComponent(tiles.map(e => e.map(x => COLORS[x]).join(",")).join("\n"));
  download(`murodihyde-${Date.now()}.csv`, csvContent);
}

// ESPORT PNG
function exportPNG() {
  var pixels = collectPixels();
  let canvas = document.createElement('canvas');
  canvas.height = pixels.length;
  canvas.width = pixels[0].length;
  let ctx = canvas.getContext('2d');
  let imageData = ctx.createImageData(canvas.width, canvas.height);
  let data = imageData.data;
  for (let i = 0; i < pixels.length; i++) {
    for (let j = 0; j < pixels[i].length; j++) {
      let pixel = pixels[i][j];
      let index = (j + i * imageData.width) * 4;
      data[index + 0] = pixel[0];
      data[index + 1] = pixel[1];
      data[index + 2] = pixel[2];
      data[index + 3] = pixel[3];
    }
  }
  ctx.putImageData(imageData, 0, 0);
  let png = canvas.toDataURL("image/png");
  download(`murodihyde-${Date.now()}.png`, png);
}

// EXPORT NBT
function exportNBT() {
  var tiles = collectTiles();
  var blocks = [];
  for (var i=0; i<tiles.length; i++){
    for (var j=0; j<tiles[i].length; j++){
      blocks.push({
        pos: [j,tiles.length-i-1,0],
        state: tiles[i][j]
      })
    }
  }
  var structure = new nbt.Writer().compound({
    DataVersion: {type: 'int', value: 3218},
    size: {type: 'list', value: {type: 'int', value: [tiles[0].length, tiles.length, 1]}},
    palette: {type: 'list', value: {type: 'compound', value: COLORS.map(color => { return {
      Name: {type: 'string', value: color?`minecraft:${color}_concrete`:`minecraft:air`} 
    }})}},
    blocks: {type: 'list', value: {type: 'compound', value: blocks.map(block => { return {
      pos: {type: 'list', value: {type: 'int', value: block.pos}},
      state: {type: 'int', value: block.state}
    }})}},
    entities: {type: 'list', value: {type: 'compound', value: []}}
  }).getData(); 
  console.log(structure)
  var data = URL.createObjectURL(new Blob([
    pako.gzip(
      new Uint8ClampedArray([10,0,0,...new Uint8ClampedArray(structure)])
    )
  ]));
  download(`murodihyde-${Date.now()}.nbt`, data);
}