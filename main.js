const sizeX = 50;
const sizeY = 50;
const tileSize = 20;
let containers = [];
let arrayGrid = [];

$(document).ready(function() {
  createGrid(sizeX, sizeY);
  learnNeighbor();
  setInterval(function() {
    generation()
  }, 1500);
});

function createGrid(sizeX, sizeY) {
  let i = 0
  for (let indexX = 0; indexX < sizeX; indexX++) {
    for (let indexY = 0; indexY < sizeY; indexY++) {
      const container = {};
      container.div = $(document.createElement("div"));
      container.div.addClass("cell");
      container.div.attr('index', i)
      container.state = Math.round(Math.random());
      $('#main').append(container.div);
      containers.push(container);
      i++;
    }
  }
  updateClasses();
}

function learnNeighbor() {
    tileWidth = containers[0].div.width()
    tileHeight = containers[0].div.height()
  _.each(containers, function(container) {
    const neighbors = []
    neighbors.push($(document.elementFromPoint(container.div.offset().left - tileWidth, container.div.offset().top - tileHeight)));
    neighbors.push($(document.elementFromPoint(container.div.offset().left - tileWidth, container.div.offset().top)));
    neighbors.push($(document.elementFromPoint(container.div.offset().left - tileWidth, container.div.offset().top + tileHeight)));
    neighbors.push($(document.elementFromPoint(container.div.offset().left, container.div.offset().top - tileHeight)));
    neighbors.push($(document.elementFromPoint(container.div.offset().left, container.div.offset().top + tileHeight)));
    neighbors.push($(document.elementFromPoint(container.div.offset().left + tileWidth, container.div.offset().top - tileHeight)));
    neighbors.push($(document.elementFromPoint(container.div.offset().left + tileWidth, container.div.offset().top)));
    neighbors.push($(document.elementFromPoint(container.div.offset().left + tileWidth, container.div.offset().top + tileHeight)));
    const ids = [];
    _.each(neighbors, function(cell) {
      if (cell.attr('index')) {
        ids.push(cell.attr('index'))
      }
    })
    container.neighbors = ids
  });
}

function generation() {
  _.each(containers, function(container) {
    if (countNeighbors(container) === 3 && (container.state === 0 || container.state === 3)) {
      // Any dead cell with three live neighbours becomes a live cell.
      container.state = 1
    } else if ((countNeighbors(container) > 3 || countNeighbors(container)) < 2 && (container.state === 1 || container.state === 2)) {
      // Any live cell with two or three live neighbours survives.
      container.state = 3
    } else if (container.state === 1 || container.state === 2) {
      // All other live cells die in the next generation.
      container.state = 2
    } else {
      // All other dead cells stay dead.
      container.state = 0
    }
  });
  updateClasses();
}

function countNeighbors(container) {
  let count = 0
  _.each(container.neighbors, function(cellId) {
    if (containers[cellId].div.hasClass('new') || containers[cellId].div.hasClass('alive')) {
      count++
    }
  })
  return count
}

function updateClasses() {
  _.each(containers, function(container) {
    container.div.removeClass()
    container.div.addClass("cell")
    switch (container.state) {
      case 0:
        container.div.addClass('dead')
        break;
      case 1:
        container.div.addClass('new')
        break;
      case 2:
        container.div.addClass('alive')
        break;
      case 3:
        container.div.addClass('dying')
        break; 
    }
  });
}