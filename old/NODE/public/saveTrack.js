function initSave(){
	button = document.getElementById('saveButton');
	button.addEventListener('click', function (e) {
    saveLink();
	});
}

function saveLink(){
	flattenStack();
	var dataURL = masterCanvas.toDataURL('image/png');
    button.href = dataURL;
	console.log("button:");
	console.log(button);
	var imageElement = document.getElementById("savedIm");  
	imageElement.src = dataURL;  
}