prefix = 'longfade';

midiInputRange = [48, 72]; %72
borderPad = 0;
numLights = 175;
includeBlackKeys = false;

suffixes = {'Start', 'Note', 'End'};

for i = 1:length(suffixes)
    imagePrefix = [prefix, suffixes{i}]; %'shockwaveStart';
    imageFileName = [prefix, suffixes{i}, '.png'];

    notesList = midiInputRange(1):midiInputRange(2);
    if ~includeBlackKeys
        blackKeyList = [ 49 , 51 , 54 , 56 , 58 , 61 , 63 , 66 , 68 , 70];
        notesList(ismember(notesList,blackKeyList)) = [];
    end
    numNotes =  length(notesList);
    [noteIm, ~, alpha] = imread(imageFileName);
    noteIm(:,:,4) = alpha;
    noteWidth = size(noteIm,2);
    blankIm = zeros(size(noteIm,1),numLights,4);

    tranStep = (numLights - 2*borderPad)/(numNotes - 1);
    for i = 1:numNotes
        centerShift = borderPad + tranStep * (i-1);
        tranDist = centerShift - 0.5*noteWidth;
        tranDist = round(tranDist);
        noteToExport = imtranslate(noteIm,[tranDist, 0],'OutputView','full');
        if tranDist < noteWidth*.5
            noteToExport(:,1:round(noteWidth*.5 - centerShift),:,:) = [];
        end
        noteToExport(:,numLights:end,:,:) = []; %crop if needed
        noteToExport(end,numLights,end,end) = 0; %make uniform size
        noteToExport(:,:,:,:) = noteToExport(:,numLights:-1:1,:,:); %mirror for directionality

        noteToExport = applyAsMask(noteToExport);

        imwrite(noteToExport(:,:,1:3),...
            ['notes/', imagePrefix, int2str(notesList(i)),'.png'],...
            'Alpha',noteToExport(:,:,4))
    end

end
function out = applyAsMask(note)
    mask = imread('maskIm.png');
    mask = imresize(mask, [size(note,1), size(note,2)]);
    out(:,:,1) = note(:,:,1)/255 .*mask(:,:,1);
    out(:,:,2) = note(:,:,1)/255.*mask(:,:,2);
    out(:,:,3) = note(:,:,1)/255.*mask(:,:,3);
    out(:,:,4) = note(:,:,4);
end