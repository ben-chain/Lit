isCompassDrawing = false;
noteActivated = false;
oldHeading = 0;
paintPos = 0;
function handleOrientation(eventData) {
    var uprightCutoff = 10;
    var uprightNoteThresh = 10;
    var heading = eventData.alpha;
    var uprightAngle = eventData.beta;
    delta = (heading - oldHeading);
    if ((Math.abs(delta) > 100) && ((90 - Math.abs(uprightAngle)) > uprightCutoff)) {
        delta = delta - Math.sign(delta)*360;
    }
    oldHeading = heading;
    paintPos += delta*5;
    currentHeading = heading;
//    if (isCompassDrawing){
//        paintWithCompass(paintPos);
//        if (uprightAngle < uprightNoteThresh) {
//            if (!noteActivated) {
//                noteActivated = true;
//                var noteNum = Math.floor((paintPos+numLights/2)/30);
//                placeNote(noteNum);
//            }
//        } else {
//            noteActivated = false;
//        }
//
//    }
}
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation, false);
}

function compassDrawOn(){
    configSlider();
    configNotes();
    
    isCompassDrawing = true;
    paintPos = 0;
    compassPaintInterval = window.setInterval(paintWithCompass, 500/playBackFrameRate);
}

function compassDrawOff(){
    isCompassDrawing = false;
    clearInterval(compassPaintInterval);
}

function paintWithCompass() {
    var position = paintPos;
    var sliderRow = Math.round(sliderHeightOffset + position);
    //console.log("%f,%f,%f,%f,%f,%f,%f,%f,%f",slider,1,sliderRow,sliderWidth,1,1,frame,150,1)
    sliderCtx.clearRect(0,frame+1,numLights,1)
    sliderCtx.drawImage(slider,0,sliderRow,sliderWidth,1,0,frame,numLights,1);
    //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
}

function configNotes(){
    notes = [];
    notesCtx = newLayerCtx();
    var numNotes = 5;
    for (i = 0; i < numNotes; i++) {
        notes[i] = new Image();
        var iStr = i.toString();
        notes[i].src = "images/noteim" + iStr + ".png";
    }
    noteTriggered = false;

}

function configSlider(){
    sliderCtx = newLayerCtx();
    slider = new Image();
    slider.onload = function(){
        sliderHeightOffset = Math.round(slider.naturalHeight/2);
        sliderWidth = slider.naturalWidth;
    };
    slider.src = "images/480/rainbowslider.png";
}

function placeNote(noteNum){
    if ((!noteTriggered) && (isCompassDrawing)){
        console.log("notenum: %i",noteNum);
        var notePos = Math.round(numLights/2 + paintPos - notes[noteNum].width/2);
        var theImage = notes[noteNum];
        notesCtx.drawImage(theImage,notePos,frame);
        noteTriggered = true;
        setTimeout(function(){ noteTriggered = false; }, 300);
    }
}

function startDrops(){
    timeDropper.addEventListener("touchstart", dropTime, false);
}

function dropTime(e){
    console.log("time dropped");
    e.preventDefault();
    e.target.click();
}
