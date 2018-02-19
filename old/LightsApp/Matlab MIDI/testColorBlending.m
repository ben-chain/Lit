function testColorBlending

numPixels = 100;
combArray = zeros(numPixels,numPixels,3);

trackPixels(:,2) = linspace(1,0,numPixels);
trackPixels(:,3) = linspace(0,1,numPixels);
trackPixels(:,1) = 0;

notePixels(:,2) = linspace(1,1,numPixels);
notePixels(:,3) = linspace(0,1,numPixels);
notePixels(:,1) = 0.5;

for i = 1:numPixels
    for j = 1:numPixels
        combArray(i+1,j+1,:) = ...
            combineNotePixels(trackPixels(i,:),notePixels(j,:));
    end
end
combArray(1,2:end,:) = notePixels;
combArray(2:end,1,:) = trackPixels;

figure(12312);
imagesc(hsv2rgb(combArray));


function pixelOut = combineNotePixels(trackPixel, notePixel) %in HSV!

pixelOut = zeros(size(notePixel));
totV = trackPixel(3) + notePixel(3);
if totV ~= 0
    pixelOut(1) = ...
        (trackPixel(1)*trackPixel(3) + notePixel(1)*notePixel(3))/totV;
    pixelOut(2) = ...
        (trackPixel(2)*trackPixel(3) + notePixel(2)*notePixel(3))/(totV);
    if totV > 1;
        pixelOut(3) = 1;
    else
        pixelOut(3) = totV;
    end
end