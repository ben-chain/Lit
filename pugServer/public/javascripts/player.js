heightPerSecond = 30;

unixTimeSongStarted = 0;
timePausedAt = 0;
isBroadcasting = false;
isPlaying = false;

function renderUpdate(){
	var Layers = document.getElementById('minipaint').contentWindow.Layers;
	var tempCanvas = document.createElement("canvas");
	renderedCtx = tempCanvas.getContext("2d");
	dim = Layers.get_dimensions();
	tempCanvas.width = dim.width;
	tempCanvas.height = dim.height;
	Layers.convert_layers_to_canvas(renderedCtx);
	//console.log(tempCanvas);
	/*tempCanvas.toBlob(function(blob) {
		//image data here
		alert('Data length: ' + blob.size);
		console.log(blob);
	});*/

	//console.log('height: %i', height);
	//console.log('dim.width: %i', dim.width);
	
}

function getFrame(){
	height = getHeight() + 1;	
	var theArray = renderedCtx.getImageData(1, height, dim.width, 1).data;
    return theArray;
}

slightDelay = 100;
spotifyPlayed = function(api){
	setTimeout(function(){
		api.getMyCurrentPlayingTrack().then(function(trackData){
			console.log(trackData);
			unixTimeSongStarted = trackData.timestamp - trackData.progress_ms;
		});
		isPlaying = true;
	},slightDelay);
}

spotifyPaused = function(api){
	setTimeout(function(){		
		api.getMyCurrentPlayingTrack().then(function(trackData){
			console.log(trackData);
			timePausedAt = trackData.progress_ms;
			isPlaying = false;		
		});
	},slightDelay);	
}

var wsUri = "ws://" + 'localhost:8080';  //'10.0.0.161' + "/d/ws/issue"; //before; location.host
var websocket;

function openWebsocket(){
	websocket = new WebSocket(wsUri);//'ws://localhost:8080');//wsUri);
	websocket.binaryType = 'arraybuffer';
	websocket.onopen = function(evt) { console.log(evt) };
	websocket.onclose = function(evt) { 
		console.log(evt);
		console.log('websocket closed, attempting to reopen');
		websocket = openWebsocket();
		console.log(websocket);
	};
	websocket.onmessage = function(evt) { };//console.log(evt) };
	websocket.onerror = function(evt) { 
		console.log('websocket error');
		console.log(evt) 
	};
	return websocket;
}

startBroadcasting = function(){
	var fps = document.getElementById('broadcastFPS').value;
	
	websocket = new Object();
	openWebsocket();
	
	var isFile = document.getElementById('isFilePlayback').checked;
	if (isFile) {
		playbackType = "file";
		theAudio = document.getElementById('theAudio');
		document.getElementById('audioSource').src = './audio/' + document.getElementById('audioFilename').value;
		theAudio.load();
	} else {
		playbackType = "spotify";
	}
	
	renderUpdate();
    broadcastInterval = setInterval(function(){
		var theFrame = getFrame();
		broadcastRGBAFrame(theFrame);
		//console.log('workqueue.length: %i', workqueue.length);
	}, 1000/fps);
	isBroadcasting = true;	
}

stopBroadcasting = function(){
	clearInterval(broadcastInterval);
	isBroadcasting = false;	
}

function getCurrentTime(){
	switch (playbackType){
		case "spotify":
			if (isPlaying){
				var time = Date.now() - unixTimeSongStarted;
			} else {
				var time = timePausedAt;
			}
			return time;
		case "file":
			return theAudio.currentTime*1000;
	}
}

getHeight = function(){
	var time = getCurrentTime();
	//console.log('time: %i', time);		
	return heightPerSecond * time / 1000;
}



var qDat = new Uint8Array(3); //set up "send" command structure for controller js
var byte = 0;
qDat[byte++] = "C".charCodeAt();
qDat[byte++] = "T".charCodeAt();
qDat[byte++] = " ".charCodeAt();

broadcastRGBAFrame = function(theFrame) {
    
    width = theFrame.length*3/4;
    var b = new Uint8Array(width);
    for (i = 0; i < width/3; i++){ //remove alpha components and rearrange to GBR
        var frameInd = i*4;
        var bInd = i*3;
        b[bInd+1] = theFrame[frameInd];
        b[bInd] = theFrame[frameInd + 1];
        b[bInd+2] = theFrame[frameInd + 2];
    }
	//console.log('b.length: %i', b.length);
	var c = new Uint8Array(qDat.length + b.length);
    c.set(qDat);
    c.set(b, qDat.length);
	
	/*if (workqueue.length < 3){
		//workqueue = [workqueue[workqueue.length-1]];
		QueueOperation( c );		
	} else {
		console.log('skipped packet, queue too long');
	}*/
	websocket.send(c);
    console.log('websocket bufferedAmount: %i', websocket.bufferedAmount);
}










function my_update(){
	var target = document.getElementById('testImage');
	
	var Layers = document.getElementById('minipaint').contentWindow.Layers;
	var tempCanvas = document.createElement("canvas");
	var tempCtx = tempCanvas.getContext("2d");
	var dim = Layers.get_dimensions();
	tempCanvas.width = dim.width;
	tempCanvas.height = dim.height;
	Layers.convert_layers_to_canvas(tempCtx);
	
	target.width = dim.width;
	target.height = dim.height;
	target.src = tempCanvas.toDataURL();
}

function open_image(image){
	if(typeof image == 'string'){
		image = document.getElementById(image);
	}
	var Layers = document.getElementById('myFrame').contentWindow.Layers;
	var name = image.src.replace(/^.*[\\\/]/, '');
	var new_layer = {
		name: name,
		type: 'image',
		data: image,
		width: image.naturalWidth || image.width,
		height: image.naturalHeight || image.height,
		width_original: image.naturalWidth || image.width,
		height_original: image.naturalHeight || image.height,
	};
	Layers.insert(new_layer);
}