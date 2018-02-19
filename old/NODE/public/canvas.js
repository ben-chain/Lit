function initCanvas(){
    
    drawingCtx = newLayerCtx();
    drawingCanvas = drawingCtx.canvas;
    startIm = new Image();
    startIm.onload = function(){
        drawingCtx.drawImage(startIm,0,0);
    };
    startIm.src = "images/480/blank480.png";
    
    //$picker = document.getElementById("colorPicker")
    //,   picker  = tinycolorpicker($picker);

    
    document.body.addEventListener("touchmove", function(event) {
                                   event.preventDefault();
                                   event.stopPropagation();
                                   }, false);
    
    canvasGrabber = document.getElementById("canvasGrabber");
    canvasWrapper = document.getElementById("canvasWrapper");
    drawingCanvas.width = numLights;
    drawingCanvas.height = trackLength;
    
    canvasCursor = {x: 0, y: 0};
    lastY = 0;
    
    canvasGrabber.addEventListener('touchmove', function(e) {
                            var evt = e || event;
                            var delta = lastY - evt.touches[0].clientY;
                            lastY = evt.touches[0].clientY;
                            frame += delta*heightScaleFactor;
                            //console.log(evt);
                            }, false);
    canvasGrabber.addEventListener('touchstart', function(e) {
                            var evt = e || event;
                            lastY = evt.touches[0].clientY;
                            }, false);
    
    
    drawingCtx.lineWidth = 2;
    drawingCtx.lineJoin = 'round';
    drawingCtx.lineCap = 'round';
    var styleWidthString = (viewCanvas.style.width).substring(0, viewCanvas.style.width.length-2);
    var styleHeightString = (viewCanvas.style.height).substring(0, viewCanvas.style.height.length-2);
    var styleWidth = parseInt(styleWidthString);
    var styleHeight = parseInt(styleHeightString);
    widthScaleFactor = viewCanvas.width/styleWidth;
    heightScaleFactor = viewCanvas.height/styleHeight;
    
    console.log("widthScaleFactor:%f heightScaleFactor:%f ", widthScaleFactor, heightScaleFactor);
    viewCanvas.addEventListener('touchstart', function(e) {
                            updateCursorFromEvent(e);
//                            drawingCtx.strokeStyle = picker.colorHex;
                            drawingCtx.strokeStyle = '#6600cc';
                            drawingCtx.beginPath();
                            drawingCtx.moveTo(canvasCursor.x, canvasCursor.y);
                            
                            viewCanvas.addEventListener('touchmove', onPaint, false);
                            }, false);
    
    viewCanvas.addEventListener('touchmove', function(e) {
                            updateCursorFromEvent(e);
                            }, false);
    
    viewCanvas.addEventListener('touchend', function() {
                            viewCanvas.removeEventListener('touchmove', onPaint, false);
                            }, false);
    
    var onPaint = function() {
        console.log("paint called");
        drawingCtx.lineTo(canvasCursor.x, canvasCursor.y);
        drawingCtx.stroke();
    };
    
}

function updateCursorFromEvent(e) {
    var x = e.pageX - viewCanvas.getBoundingClientRect().left; //- canvasWrapper.offsetLeft;
    var y = e.pageY - viewCanvas.getBoundingClientRect().top; //- canvasWrapper.offsetTop;
    //console.log("x: %f, y: %f",x,y);
    canvasCursor.x = x * widthScaleFactor;
    canvasCursor.y = y * heightScaleFactor + frame;
}

function getCanvasPxHeight(){
    return frame;
}

function scrollToCanvasPxHeight(heightInPx){
    frame = heightInPx;
}



