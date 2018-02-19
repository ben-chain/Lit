function initGamepad(){
    console.log("updateGamepad called");
	pxgamepad = new PxGamepad;
    pxgamepad.start();
	setInterval(function() {
    pxgamepad.update();
	},5);

	
	pxgamepad.on('a', function() {
		buttonPressed(0);
	});
	pxgamepad.on('b', function() {
		buttonPressed(1);
	});
	pxgamepad.on('y', function() {
		buttonPressed(2);
	});
	pxgamepad.on('x', function() {
		buttonPressed(3);
	});
	pxgamepad.on('leftTop', function() {
		buttonPressed(4);
	});
	
	pxgamepad.on('dpadUp', function() {
		strum();
	});
	pxgamepad.on('dpadDown', function() {
		strum();
	});
	
	gamepadCtx = newLayerCtx();
	
	buttonImages = [];
	for (i = 0; i < 5; i++) {
		buttonImages[i] = document.createElement('img');
		buttonImages[i].src = '/images/gamepad/' + i + '.png';
	}

}

/*
function strum(){
	if (pxgamepad.buttons.a){
		buttonPressed(0);
	}
	if (pxgamepad.buttons.b){
		buttonPressed(1);
	}
	if (pxgamepad.buttons.y){
		buttonPressed(2);
	}
	if (pxgamepad.buttons.x){
		buttonPressed(3);
	}
	if (pxgamepad.buttons.leftTop){
		buttonPressed(4);
	}
} */
	
/*
function strum(){
	
setTimeout(function(){ 

	if (pxgamepad.buttons.a){
		buttonPressed(0);
	}
	if (pxgamepad.buttons.b){
		buttonPressed(1);
	}
	if (pxgamepad.buttons.y){
		buttonPressed(2);
	}
	if (pxgamepad.buttons.x){
		buttonPressed(3);
	}
	if (pxgamepad.buttons.leftTop){
		buttonPressed(4);
	}
}, 10);
} */

function buttonPressed(buttonIndex){
    gamepadCtx.drawImage(buttonImages[buttonIndex],0,frame);
	console.log('triggered button press of ' + buttonIndex);
}

	//PRE-LIBRARY METHOD IN initGamepad():
	/*gamepadList = navigator.getGamepads();
	for (padId in gamepadList) {
		pad = gamepadList[padId];
		console.log(pad);
		if (pad.id == 'Xbox 360 Controller (XInput STANDARD GUITAR_ALTERNATE)') {
			theGamepad = pad;
			console.log('guitar found at index: ' + padId);
				//console.log(d);
			
		}
	}
	*/