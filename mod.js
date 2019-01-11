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
	// event.data;
	callbacks[JSON.parse(event.data).type](event)
	//console.log(JSON.parse(event.data));
}
var callbacks = {

}

/*
example usage:
wsRequest("initCell",{type: "initCell", data: {name: "jesus"}},(data) => {
	return 
});

It returns the response of the server.
*/
function wsRequest(msg,cb) {
	ws.send(JSON.stringify(msg));
	callbacks[msg.type] = cb;
}