frame = 0;
stackUpdateFramerate = 30;
numLights = 480;
trackLength = 8940;
console.log("included");

function setupStack(){
    viewCanvas = document.getElementById("viewCanvas");
    viewHeight = viewCanvas.height;
    viewCanvas.width = numLights;
    viewCanvas.style.width  = '750px';
    viewCanvas.style.height = '2500px';
    viewCtx = viewCanvas.getContext("2d");

    masterCanvas = document.createElement('canvas');
    masterCanvas.width = numLights;
    masterCanvas.height = trackLength;
    masterCtx = masterCanvas.getContext("2d");
    console.log("masterctx made");
    ctxStack = [];
    //stackUpdateInterval = window.setInterval(flattenStack, 1000/stackUpdateFramerate);
    viewUpdateInterval = window.setInterval(updateView, 1000/stackUpdateFramerate);
}

function flattenStack(){
    masterCtx.clearRect(0,0,numLights,trackLength);
    for(var i = 0; i<ctxStack.length; ++i){
        if (!ctxStack[i].hidden){
            masterCtx.drawImage(ctxStack[i].canvas,0,0);
        }
    }
}

function updateView(){
    //viewCtx.drawImage(masterCanvas, 0,frame,numLights,viewHeight,0,0,numLights,viewHeight);
                    //(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    viewCtx.clearRect(0,0,numLights,trackLength);
    for(var i = 0; i<ctxStack.length; ++i){
        if (!ctxStack[i].hidden){
            //masterCtx.drawImage(ctxStack[i].canvas,0,0);
            viewCtx.drawImage(ctxStack[i].canvas, 0,frame,numLights,viewHeight,0,0,numLights,viewHeight);
        }
    }
}

function newLayerCtx(){
    var theCanvas = document.createElement('canvas');
    theCanvas.width = numLights;
    theCanvas.height = trackLength;
    var theContext = theCanvas.getContext("2d");
    theContext.hidden = false;
    ctxStack.push(theContext);
    return theContext;
}

function saveTrack(){
    console.log(padCtx.canvas.toDataURL());
}
