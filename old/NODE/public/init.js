function init(){
    setupStack();
    initBackground();
    initPad();
    initCanvas();
    initLights();
	initSave();
}

function initBackground(){
    backgroundCtx = newLayerCtx();
    backgroundImg = document.getElementById("track");
    backgroundCtx.drawImage(backgroundImg,0,0);
}
