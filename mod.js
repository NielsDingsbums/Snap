// mod.js  

var ws = new WebSocket("ws://localhost:361/");
var alreadyready = false;


// game vars
var state;

var currentPlayer = undefined;


var gameover = false;

var velo = [];
var speed = 0.001;


var world;
window.onload = function () {
    world = new WorldMorph(document.getElementById('world'));
    world.worldCanvas.focus();
    new IDE_Morph().openIn(world);
    loop();
};

var stage;

function loop() {
    requestAnimationFrame(loop);
    //console.log("test")
    let ready;
    if (!alreadyready) {
        ready = world.children[0].projectName == "project" && name != undefined && ws.readyState == 1 && currentPlayer != undefined;
        if (ready) {
            stage = world.children[0].stage;
            wsRequest({type: "ready"}, () => {
                console.log("ready")
            })
            alreadyready = true;
        }
    }

    world.doOneCycle();
}

window.onbeforeunload = () => {
    ws.onclose = function () {}; // disable onclose handler first
    ws.close();

}

ws.onmessage = () => {
    let type = JSON.parse(event.data).type;
    //console.log(type);
    if (type === "state") {
        state = JSON.parse(event.data).data;
        updateEverything();
        console.log(state);
    } else if (type == "" || type == "changePos") {
        // do nothing
    } else {
        callbacks[JSON.parse(event.data).type](event)
        // delete itttttt
        delete callbacks[JSON.parse(event.data).type]
    }
}

var callbacks = {}

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
    var foodClones = stage.children.filter((item) => {
        return item instanceof SpriteMorph && item.name === "food"
    })[0].instances;
    var cellClones = stage.children.filter((item) => {
        return item instanceof SpriteMorph && item.name === "cell"
    })[0].instances;
    var currentPlayerMorph = stage.children.filter((item) => {
        return item instanceof SpriteMorph && item.name === "currentPlayer"
    })[0];

    if (foodClones.length === state.food.length) {
        foodClone.forEach((morph) => {
            // position
            let pos = toRel(currentPlayer.pos, item.pos);
            clone.gotoXY(pos[0], pos[1]);

            clone.wearCostume(1);

            // set size (scale)
            clone.setScale(30);
            clone.show();
        })
    } else {
        foodClones.forEach((item) => {
            item.removeClone();
        })

        state.food.forEach((item) => {
            let morph = stage.children.filter((foo) => {return foo.name == "food"})[0];
            let clone = morph.createClone();

            // position
            let pos = toRel(currentPlayer.pos, item.pos);
            clone.gotoXY(pos[0], pos[1]);

            clone.setScale(30);

            // set uid
            clone.variables.vars.id.value = item.id;
            clone.show()
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

            clone.show()

        }, this.state.cells);
    } else {
        cellClones.forEach((item) => {
            item.removeClone();
        })

        state.cells.forEach((item) => {
            let morph = stage.children.filter((foo) => {return foo.name == "cell"})[0];
            let clone = morph.createClone();

            // position
            let pos = toRel(currentPlayer.pos, item.pos);
            clone.gotoXY(pos[0], pos[1]);

            // set size (scale)
            clone.setScale(item.size);

            // set uid
            clone.variables.vars.id.value = item.id;
            clone.show()
        })
    }

    currentPlayerMorph.setScale()
}


function listify(jsonObject) {
    if (jsonObject instanceof Array) {
        return new List(jsonObject.map(function (eachElement) {
            return listify(eachElement)
        }));
    } else if (jsonObject instanceof Object) {
        return new List(Object.keys(jsonObject).map(function (eachKey) {
            return new List([listify(jsonObject[eachKey])])
        }))
    } else {
        return jsonObject
    }
}

function toRel(center, point) {
    var x = point[0] - center[0];
    var y = point[1] - center[1];
    return [x, y];
}

/*
to get the same coords you gave toRel() you have to use the same center and the output of toRel
*/

function toAbs(center, point) {
    var x = point[0] + center[0];
    var y = point[1] + center[1];
    return [x, y]
}

