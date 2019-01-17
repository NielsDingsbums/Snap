// mod.js  

var ws = new WebSocket("ws://localhost:361/");

var world;
window.onload = function () {
	world = new WorldMorph(document.getElementById('world'));
	world.worldCanvas.focus();
	new IDE_Morph().openIn(world);
	loop();
	var stage = world.children[0].children.filter((item) => {return item instanceof StageMorph;})
};
function loop() {
    requestAnimationFrame(loop);
    //console.log("test")
	ready = world.children[0].projectName == "project";
	if (ready) {
		wsRequest({type: "ready"})
	}
    world.doOneCycle();
}


var state;

ws.onmessage = () => {
	let type = JSON.parse(event.data).type;
	if (type == "state") {
		state = JSON.parse(event.data).data;
	} else if (type == "") {
		// do nothing
	} else {
		callbacks[JSON.parse(event.data).type](event)
		// delete itttttt
		delete callbacks[JSON.parse(event.data).type]
	}
}

var callbacks = {
}

/*
example usage:
wsRequest("initCell",{type: "initCell", data: {name: "jesus"}},(data) => {
	console.log(data); 
});

It returns the response of the server.
*/

function wsRequest(msg, cb) {
	ws.send(JSON.stringify(msg));
	callbacks[msg.type] = cb;
}





function updateEverything() {
	let foodClones = stage.children.filter((item) => {return item instanceof SpriteMorph && item.name === "food"}).instances
	let cellClones = stage.children.filter((item) => {return item instanceof SpriteMorph && item.name === "cell"}).instances
	let currentPlayerMorph = stage.children.filter((item) => {return item instanceof SpriteMorph && item.name === "currentPlayer"})

	if (foodClones.length === state.food.length) {
		foodClone.forEach((morph) => {	
			// position
			let pos = toRel(currentPlayer.pos, item.pos);
			clone.gotoXY(pos[0], pos[1]);

			// set size (scale)
			clone.setScale(10);
		})
	} else {
		foodClones.forEach((item) => {
			item.removeClone();
		})
		
		state.food.forEach((item) => {
			let clone = this.createClone();
			
			// position
			let pos = toRel(currentPlayer.pos, item.pos);
			clone.gotoXY(pos[0], pos[1]);

			clone.setScale(10);

			// set uid
			clone.variables.vars.id.value = item.id;
		})
	}
	
	if (cellClones.length == state.cells.length) {
		cellClones.forEach((item, index) => {
			let cell = this[index];

			// position
			let pos = toRel(currentPlayer.pos, cell.pos);
			clone.gotoXY(pos[0], pos[1]);

			// set size (scale)
			clone.setScale(cell.size);

			// set uid
			clone.variables.vars.id.value = cell.id;

		}, this.state.cells);
	} else {
		cellClones.forEach((item) => {
			item.removeClone();
		})
		
		state.cells.forEach((item) => {
			let clone = this.createClone();
			
			// position
			let pos = toRel(currentPlayer.pos, item.pos);
			clone.gotoXY(pos[0], pos[1]);

			// set size (scale)
			clone.setScal(item.size);

			// set uid
			clone.variables.vars.id.value = item.id;
		})
	}
}


function listify(jsonObject) {
  if (jsonObject instanceof Array) {
    return new List(jsonObject.map(function(eachElement) { return listify(eachElement)}));
  } else if (jsonObject instanceof Object) {
    return new List(Object.keys(jsonObject).map(function(eachKey) { return new List([listify(jsonObject[eachKey])])} ))
  } else {
    return jsonObject
  }
}

function toRel(center, point) {
	var x = point[0] - center[0];
	var y = point[1] - center[1];
	return [x,y];
}

/*
to get the same coords you gave toRel() you have to use the same center and the output of toRel
*/

function toAbs(center, point) {
	var x = point[0] + center[0];
	var y = point[1] + center[1];
	return [x,y]	
}

// game vars

var gameover = false;
var velo =[] ;
