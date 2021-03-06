// mod.js  

var ws = new WebSocket("ws://localhost:361/");

var response = null;

/*
var exampleRequest = {type: "initCell", data: {name: "jesus"}};
var exampleResponse = {type: "initCell", data: {id: 0, name: "jesus", pos: [100, 342], alive: true, kills: 0};

The server responds with a message of the type / scheme seen in "exampleResponse".
The type of this message is always the same as in the request.
Data in the request *is not* proprietary.
Data in the response on the other hand *is* proprietary (unless the request is invalid).
*/

ws.onmessage = () => {
	callbacks[JSON.parse(event.data).type](event)
	// delete itttttt (lit)
	delete callbacks[JSON.parse(event.data).type]

}
var callbacks = {
	// exampleStructure after wsRequest({type: "initCell", data: {name: "jesus"}}, (data) => {console.log(data)}) was called
	
	/*
		initCell: (data) => {
			console.log(data);
		}
	*/
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

var cells = [];
var food = [];
var currentPlayer = {};
