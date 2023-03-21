// TODO: linear / even perspective
// TODO: hide non visible edges based on face visibility detection, not like this how it works now

// --  globals  --------------------------------------------------------------

let horizontalLine;
let verticalLine;
let leftLine;
let rightLine;
let topLine;
let bottomLine;
let gridSize;
let grid;
let objectsSeed;
let objectsCount;
let objects;

let horizontalY;
let verticalX;
let leftX;
let rightX;
let topY;
let bottomY;

// ---------------------------------------------------------------------------

function updateGridSize() {
	grid = new Array(gridSize);
	for (let x = 0; x < gridSize; x++) {
		grid[x] = new Array(gridSize);
		for (let y = 0; y < gridSize; y++) {
			grid[x][y] = new Array(gridSize);
			for (let z = 0; z < gridSize; z++) {
				grid[x][y][z] = {
					x: 0,
					y: 0
				};
			}
		}
	}
}

function updateGrid() {
	horizontalY = height * horizontalLine / 100;
	verticalX = width * verticalLine / 100;
	leftX = width * leftLine / 100;
	rightX = width * (100 + rightLine) / 100;
	topY = height * topLine / 100;
	bottomY = height * (100 + bottomLine) / 100;
	
	const leftTopDeltaX = (verticalX - leftX) / (gridSize - 1);
	const leftTopDeltaY = (horizontalY - topY) / (gridSize - 1);
	const rightBottomDeltaX = (verticalX - rightX) / (gridSize - 1);
	const rightBottomDeltaY = (horizontalY - bottomY) / (gridSize - 1);

	for (let z = 0; z < gridSize; z++) {
		const leftTopX = leftX + leftTopDeltaX * z;
		const leftTopY = topY + leftTopDeltaY * z;
		const rightBottomX = rightX + rightBottomDeltaX * z;
		const rightBottomY = bottomY + rightBottomDeltaY * z;

		const deltaX = (rightBottomX - leftTopX) / (gridSize - 1);
		const deltaY = (rightBottomY - leftTopY) / (gridSize - 1);

		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				let g = grid[x][y][z];
				g.x = leftTopX + deltaX * x;
				g.y = leftTopY + deltaY * y;
			}
		}
	}
}

function updateObjects() {
	randomSeed(objectsSeed);

	objects = new Array();

	while (objects.length < objectsCount) {
		let sx = 1 + Math.floor(random(gridSize / 4));
		let sy = 1 + Math.floor(random(gridSize / 4));
		let sz = 1 + Math.floor(random(gridSize / 4));
		// let sx = 1 + objects.length;
		// let sy = 1 + objects.length;
		// let sz = 1 + objects.length;
		// let sx = 1;
		// let sy = 1;
		// let sz = 1;

		let px = Math.floor(random(gridSize - sx));
		let py = Math.floor(random(gridSize - sy));
		let pz = Math.floor(random(gridSize - sz));

		objects.push({
			vertices: [
				{ x: px,      y: py,      z: pz     , d: 'f' },
				{ x: px + sx, y: py,      z: pz     , d: 'f' },
				{ x: px + sx, y: py,      z: pz + sz, d: 'b' },
				{ x: px,      y: py,      z: pz + sz, d: 'b' },
				{ x: px,      y: py + sy, z: pz     , d: 'f' },
				{ x: px + sx, y: py + sy, z: pz     , d: 'f' },
				{ x: px + sx, y: py + sy, z: pz + sz, d: 'b' },
				{ x: px,      y: py + sy, z: pz + sz, d: 'b' }
			],

			edges: [
				{ s: 0, e: 1, d: 'f' },
				{ s: 1, e: 2, d: 'mtr' },
				{ s: 2, e: 3, d: 'bt' },
				{ s: 3, e: 0, d: 'mtl' },

				{ s: 4, e: 5, d: 'f' },
				{ s: 5, e: 6, d: 'mbr' },
				{ s: 6, e: 7, d: 'bb' },
				{ s: 7, e: 4, d: 'mbl' },

				{ s: 0, e: 4, d: 'f' },
				{ s: 1, e: 5, d: 'f' },
				{ s: 2, e: 6, d: 'br' },
				{ s: 3, e: 7, d: 'bl' },
			],

			faces: [

			]
		});
	}
}

// -- event handlers  --------------------------------------------------------

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('workspace');

	smooth();

	updateObjects();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
 
function mouseMoved() {
}

function mousePressed() {
}
  
function keyPressed() {
}

function draw() {
	updateGlobals();

	clear();

	if (showGridLines.checked) {
		stroke(0, 0, 0, 64);
		strokeWeight(1);
 		for (let z = 0; z < gridSize; z++) {
			for (let x = 0; x < gridSize; x++) {
				const g1 = grid[x][0][z];
				const g2 = grid[x][gridSize - 1][z];
				line(g1.x, g1.y, g2.x, g2.y);
			}
			for (let y = 0; y < gridSize; y++) {
				const g1 = grid[0][y][z];
				const g2 = grid[gridSize - 1][y][z];
				const g = grid[0][y][z];
				line(g1.x, g1.y, g2.x, g2.y);
			}
		}

		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				const g = grid[x][y][0];
				line(g.x, g.y, verticalX, horizontalY);
			}
		}
	}

	if (showGridPoints.checked) {
		stroke(0, 0, 0, 64);
		strokeWeight(1);
		noFill();
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				for (let z = 0; z < gridSize; z++) {
					const g = grid[x][y][z];
					ellipse(g.x, g.y, 2, 2);
				}
			}
		}
	}

	if (showObjectLines.checked) {
		stroke(0, 0, 0, 64);
		strokeWeight(1);
		for (let object of objects) {
			for (let vertex of object.vertices) {
				if (vertex.d != 'f')
					continue;
				let g = grid[vertex.x][vertex.y][vertex.z];
				line(g.x, g.y, verticalX, horizontalY);
			}
		}
	}

	for (let object of objects) {
		if (showObjectPoints.checked) {
			stroke(0, 0, 0);
			strokeWeight(2);
			for (let vertex of object.vertices) {
				let g = grid[vertex.x][vertex.y][vertex.z];
				ellipse(g.x, g.y, 5, 5)
			}
		}
		for (let edge of object.edges) {
			let hidden = true;

			const vs = object.vertices[edge.s];
			const gs = grid[vs.x][vs.y][vs.z];
			const ve = object.vertices[edge.e];
			const ge = grid[ve.x][ve.y][ve.z];

			switch (edge.d) {
				case 'n': // none
					break;
				case 'bt': // back top
					hidden = gs.y < horizontalY; 
					break;
				case 'bb': // back bottom
					hidden = gs.y > horizontalY; 
					break;
				case 'bl': // back left
					hidden = gs.x < verticalX;
					break;
				case 'br': // back right
					hidden = gs.x > verticalX;
					break;
				case 'f': // front
					hidden = false;
					break;
				case 'mtl': // top left
					hidden = gs.x < verticalX && gs.y < horizontalY;
					break;
				case 'mtr': // top right
					hidden = gs.x > verticalX && gs.y < horizontalY;
					break;
				case 'mbl': // bottom left
					hidden = gs.x < verticalX && gs.y > horizontalY;
					break;
				case 'mbr':
					hidden = gs.x > verticalX && gs.y > horizontalY;
					break;
			}

			if (hidden) {
				stroke(0, 0, 0, 64);
				strokeWeight(1);
			} else {
				stroke(0, 0, 0);
				strokeWeight(2);
			}

			if (!hidden || showHiddenEdges.checked)
				line(gs.x, gs.y, ge.x, ge.y);
		}
	}

	if (showControlLines.checked) {
		stroke(120);
		strokeWeight(1);
		line(verticalX, topY, verticalX, bottomY);
		line(leftX, horizontalY, rightX, horizontalY);
		line(leftX, topY, verticalX, horizontalY);
		line(leftX, bottomY, verticalX, horizontalY);
		line(rightX, topY, verticalX, horizontalY);
		line(rightX, bottomY, verticalX, horizontalY);
	}

	if (showControlPoints.checked) {
		stroke(120);
		strokeWeight(1);
		fill(255);
		ellipse(verticalX, horizontalY, 20, 20);

		fill(0);
		rectMode(CENTER);
		textAlign(CENTER, CENTER);
		text('1', verticalX, horizontalY);
	}
	
	updateDisplays();
}

// --  gui sync  -------------------------------------------------------------

function updateGlobals() {
	let updateGS = false;
	let updateG = false;
	let updateO = false;

	let t = gridSizeInput.value * 1.0;
	if (t != gridSize) {
		gridSize = t;
		updateGS = true;;
		updateG = true;
		updateO = true;
	}

	t = horizontalLineInput.value * 1.0
	if (t != horizontalLine) {
		horizontalLine = t;
		updateG = true;
	}
	t = verticalLineInput.value * 1.0;
	if (t != verticalLine) {
		verticalLine = t;
		updateG = true;		
	}
	t = leftLineInput.value * 1.0;
	if (t != leftLine) {
		leftLine = t;
		updateG = true;		
	}
	t = rightLineInput.value * 1.0;
	if (t != rightLine) {
		rightLine = t;
		updateG = true;		
	}
	t = topLineInput.value * 1.0;
	if (t != topLine) {
		topLine = t;
		updateG = true;		
	}
	t = bottomLineInput.value * 1.0;
	if (t != bottomLine) {
		bottomLine = t;
		updateG = true;		
	}

	t = objectsSeedInput.value * 1.0;
	if (t != objectsSeed) {
		objectsSeed = t;
		updateO = true;
	}

	t = objectsCountInput.value * 1.0;
	if (t != objectsCount) {
		objectsCount = t;
		updateO = true;
	}

	if (updateGS)
		updateGridSize();
	if (updateG)
		updateGrid();
	if (updateO)
		updateObjects();
}

function updateDisplays() {
	simulationFPSDisplay.innerHTML = frameRate().toFixed(2);
	horizontalLineOutput.innerHTML = horizontalLine.toFixed(2);
	verticalLineOutput.innerHTML = verticalLine.toFixed(2);
	leftLineOutput.innerHTML = leftLine.toFixed(2);
	rightLineOutput.innerHTML = rightLine.toFixed(2);
	topLineOutput.innerHTML = topLine.toFixed(2);
	bottomLineOutput.innerHTML = bottomLine.toFixed(2);
	gridSizeOutput.innerHTML = gridSize.toFixed(0);
	objectsSeedOutput.innerHTML = objectsSeed.toFixed(0);
	objectsCountOutput.innerHTML = objectsCount.toFixed(0);
}

// ---------------------------------------------------------------------------

function intersectLines(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
	const d = 
		((p4x - p3x) * (p1y - p3y) - 
		(p4y - p3y) * (p1x - p3x)) /
		((p4y - p3y) * (p2x - p1x) - 
		(p4x - p3x) * (p2y - p1y));
   
	return {
   		x : p1x + d * (p2x - p1x),
		y : p1y + d * (p2y - p1y)
	};
}
