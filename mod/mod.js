var ws = new WebSocket("ws://localhost:361");

var data = null;

ws.onmessage = function() {
	data = JSON.parse(event.data).data;
}

function wsCommand(type, paramData) {
	ws.send(JSON.stringify({type: type, data: paramData}));

	console.log(data);
	data = null;
}