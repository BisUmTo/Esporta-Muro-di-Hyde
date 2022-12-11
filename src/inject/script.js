var COLORS = ["", "white", "yellow", "orange", "red", "blue", "green"];

function parseColor(color) {
    switch (color) {
        case "rgb(231, 76, 60)":
            return 4
        case "rgb(230, 126, 34)":
            return 3
        case "rgb(41, 128, 185)":
            return 5
        case "rgb(46, 204, 113)":
            return 6
        case "rgb(236, 240, 241)":
            return 1
        case "rgb(241, 196, 15)":
            return 2
        case "":
            return 0
    }
}

function collectTiles() {
    var tiles = [];
    var col = document.getElementsByClassName("grid-col");
    for (var i = 0; i < col.length; i++) {
        var array = [];
        var row = col[i].getElementsByClassName("c");
        for (var j = 0; j < row.length; j++) {
            var color = parseColor(row[j].style.backgroundColor)
            array.push(color);
        }
        tiles.push(array);
    }
    return tiles;
}


function collectPixels() {
    var tiles = [];
    var col = document.getElementsByClassName("grid-col");
    for (var i = 0; i < col.length; i++) {
        var array = [];
        var row = col[i].getElementsByClassName("c");
        for (var j = 0; j < row.length; j++) {
            var color = row[j].style.backgroundColor
            if(color != ""){
                color = color.replace(/rgb\((.*)\)/g,'$1').split(', ').map(x => parseInt(x))
                color.push(255)
            } else {
                color = [0,0,0,0]
            }
            array.push(color);
        }
        tiles.push(array);
    }
    return tiles;
}

function download(filename, data) {
    var element = document.createElement('a');
    element.setAttribute('href', data);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}