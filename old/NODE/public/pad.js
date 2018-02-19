function updatePad(){
    console.log("updatePad called");
    var padDiv = document.getElementById("padDiv");
    var children = padDiv.childNodes;
    for (var i = 0; i < children.length; i++) {
        var theChild = children[i];
        theChild.addEventListener('mousedown', function() { padImTouched(this); }, false);
    }
}

function padImTouched(touchedIm){
    padCtx.drawImage(touchedIm,0,frame);
}

function initPad() {
    padCtx = newLayerCtx();
    updatePad();
}
