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

/*
Is getting called whenever the server sends any message / response.
Sets the global variable "response".

I think this is the spot for a callback ... idk?
*/
ws.onmessage = () => {
	response = JSON.parse(event.data);
	//console.log(JSON.parse(event.data));
}

/*
example usage:
wsRequest({type: "initCell", data: {name: "jesus"}});

It returns the response of the server.
*/
function wsRequest(msg) {
	ws.send(JSON.stringify(msg));
	checkFlag();
	let data = response;
	response = null;
	return data;
}

// check if flag == true;
function checkFlag() {
	var flag = response != null;
	if (!flag) {
		(function(foo) {
    		setTimeout(function() { 
  				checkFlag(foo);
    		}, 10);
		})(flag);
	} else {
		return
	}
}