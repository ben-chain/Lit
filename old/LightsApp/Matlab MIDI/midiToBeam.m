function beamOut = midiToBeam(filename)
args = [];

filename = 'killer.mid';
midiVar = loadMidi(filename, args);
% midiVar = load('hotelMidiVar');
% midiVar = midiVar.midiVar;

args.meanPitchSmooth = 3500;
args.stdPitchSmooth = 100;
args.numNotesToMaxMin = 40;

args.chordTimeThresh = 0.03;
args.fullNoteSpectCutoff = 7;
args.riffTimeCutoff = 0.4;
args.numLights = 150;
args.frameRate = 20;
args.trackInstrumentTypes = midiVar.trackInstrumentTypes;
args.totDuration = midiVar.songDuration;
args.totFrames = ceil(args.frameRate * args.totDuration);
args.removeSectOverlap = true;


args.debug = false;

trackInds = pickTracks(midiVar.tracks, args);
args.numUsedTracks = length(trackInds);
for i = 1:args.numUsedTracks
    args.trackNum = i;
    track = midiVar.tracks{trackInds(i)};
    [noteTracks{i}, slideTracks{i}] = trackToBeam(track, args);
    
    if args.removeSectOverlap
        nonOverlapStart = (args.trackNum - 1)/(args.numUsedTracks);
        nonOverlap = round(args.numLights*nonOverlapStart): ...
            round(args.numLights*(nonOverlapStart + 1/args.numUsedTracks));
        overlap = ~ismember(1:args.numLights,nonOverlap);
        noteTracks{i}(:,overlap,:) = 0;% * noteTracks{i}(:,overlap,:);
    end
end
beamOut = combineSlideAndNoteBeams(noteTracks, slideTracks, args);


function trackInds = pickTracks(tracks, args)
trackInds = 1:length(tracks);
for i = length(tracks):-1:1;
    if min(size(tracks{i})) == 0
        trackInds(i) = [];
    end
end
disp(['MIDI instrument types for each track:'...
    num2str(args.trackInstrumentTypes(trackInds))]);
useInds = input('Which of the above would you like? \n');
trackInds = trackInds(useInds);

function track = midiNotesToBeamNotes(track, args)
noteSteps = quantifyMidiNotes(track, args);
[track.stepDir] = disperse(noteSteps.stepDir);
[track.isInChord] = disperse(noteSteps.isInChord);

[relSize, relPos] = trackToNotes(track, args);
[track.relSize] = disperse(relSize);
[track.relPos] = disperse(relPos');

function noteSteps = quantifyMidiNotes(track, args)
[pitches, startTimes, ~] = dealTrack(track);
if args.debug
    %     figure(round(685465 )); % + startTimes(length(startTimes))/2));
    %     plot(startTimes, pitches,'.-');
    %     title('track notes vs time');
end

args.diffTimeThresh = 1e-6;
numNotes = length(startTimes);
stepDir = zeros(numNotes,1);
isInChord = zeros(numNotes,1);
for i = 2:numNotes
    if pitches(i) > pitches(i-1)
        stepDir(i) = 1;
    elseif pitches(i) < pitches(i-1)
        stepDir(i) = -1;
    else
        stepDir(i) = 0;
    end
end

for i = 1:numNotes   
    for relCompareTo = [-1, 1]
        compareTo = (i + relCompareTo);
        if (compareTo <= length(startTimes)) && (compareTo >=1)
            if abs(startTimes(compareTo) -...
                    startTimes(i)) < args.chordTimeThresh
                isInChord(i) = relCompareTo;
                stepDir(i) = 0;
                break;                
            end
        end
    end
    
end

noteSteps.stepDir = stepDir;
noteSteps.isInChord = isInChord;

function [relSize, relPos] = trackToNotes(track, args)
[pitches, startTimes, endTimes, stepDir, isInChord, relSize, relPos] = ...
    dealTrack(track);

runningMeanPitch = smooth(pitches, args.meanPitchSmooth);

maxRadius = floor(args.numNotesToMaxMin/2);
for i = 1:length(track)
    notesToMaxMin = i + (-maxRadius:maxRadius);
    notesToMaxMin = notesToMaxMin(find(notesToMaxMin > 0 & notesToMaxMin <= length(track)));
    runningMax(i) = max(pitches(notesToMaxMin));
    runningMin(i) = min(pitches(notesToMaxMin));
end
runningMax = smooth(runningMax,args.numNotesToMaxMin);
runningMin = smooth(runningMin,args.numNotesToMaxMin);

relPos = (pitches' - runningMin)./(runningMax - runningMin);
relSize = 0.2*ones(size(relPos));
relPos(find(relPos > 1)) = 1;
relPos(find(relPos < 0)) = 0;

for i = find(relPos(1:end-2) == 0)' %end-2 so we don't check last ones
    if relPos(i+1) == 0
        if relPos(i+2) ~= 0
            relPos(i+1) = relPos(i+2)/2;
        end
    end
end

if args.numUsedTracks > 1
    relPos = relPos/args.numUsedTracks;
    relPos = relPos + (args.trackNum - 1)/(args.numUsedTracks);
end

if args.debug
        figure(654654);clf;hold on;
        plot(startTimes,pitches,'.-','MarkerSize',12);
        plot(startTimes,runningMeanPitch,'.-','MarkerSize',12);

        plot(startTimes,relSize,'.-','MarkerSize',12);
        plot(startTimes,relPos*10,'.-','MarkerSize',12);
        plot(startTimes,runningMax,'.-','MarkerSize',12);
        plot(startTimes,runningMin,'.-','MarkerSize',12);
        legend({'pitches','running avg pitch',...
            'relSize','relPos*10',...
            'runing max smoothed','running min smoothed'});
        title 'variables vs. time';
end



function [noteTrack, slideTrack] = trackToBeam(track, args)
track = midiNotesToBeamNotes(track,args);

noteTrack = zeros(args.totFrames,args.numLights,3);
slideTrack = zeros(args.totFrames,args.numLights,3);
%figure(5644654);
for i = 1:length(track)-1
    note = track(i);
    nextNote = track(i+1);
%     numFramesInNote = ceil(note.duration * args.frameRate);
    numFramesInNote = 20;
    
    [noteImage, noteStartInPixels] = ...
        noteToFullWidthAndHeightBeam(note, numFramesInNote, 'note', args);
    
    startTimeInPixels = round(note.startTime * args.frameRate) ...
        - noteStartInPixels + 1;
    timePixels = (1:size(noteImage, 1)) + startTimeInPixels;
    timePixels(timePixels > size(noteTrack,1)) = [];
    noteTrack(timePixels,:,:) =...
        addStatNoteToTrackSect(noteImage, noteTrack(timePixels,:,:), note, args);
        
    numFramesToNextNote = floor(...
        (nextNote.startTime - note.startTime) * args.frameRate);
    numFramesToNextNote(find(numFramesToNextNote < 1)) = 1;
    [slideImage, noteStartInPixels] = ...
        noteToFullWidthAndHeightBeam(note, numFramesToNextNote, 'slide', args);
    
    if ~nextNote.isInChord
        startTimeInPixels = round(note.startTime * args.frameRate) ...
            - noteStartInPixels + 1;
        timePixels = (1:size(slideImage, 1)) + startTimeInPixels;
        timePixels(timePixels > size(slideTrack,1)) = [];
        slideTrack(timePixels,:,:) =...
            addSlideNoteToTrackSect(slideImage, slideTrack(timePixels,:,:),...
            note, nextNote, args);
    elseif nextNote.isInChord == 1 %next is the first in a chord!
        nextChordInds = i + (1:find([track(i+2:end).isInChord] ~=-1 , 1));
        for j = nextChordInds
            nextNote = track(j);
            startTimeInPixels = round(note.startTime * args.frameRate) ...
                - noteStartInPixels + 1;
            timePixels = (1:size(slideImage, 1)) + startTimeInPixels;
            timePixels(timePixels > size(slideTrack,1)) = [];
            slideTrack(timePixels,:,:) =...
                addSlideNoteToTrackSect(slideImage, slideTrack(timePixels,:,:),...
                note, nextNote, args);
        end
    end
    
    if args.debug
        figure(6546534);
        imagesc(hsv2rgb(slideTrack(1:200,:,:)));
        title('slideTrack');
        figure(23483);
        imagesc(hsv2rgb(noteTrack(1:200,:,:)));
        title('noteTrack');
    end
end


function trackImage = addStatNoteToTrackSect(noteBeam, trackImage, note, args)
absPosOffset = round(args.numLights *(1 - note.relPos));
for i = 1:size(trackImage,1)
    for j = 1:size(trackImage,2)
        trackImage(i,j,:) = ...
            combineNotePixels(trackImage(i,j,:),noteBeam(i,j+absPosOffset,:));
    end
end

function trackImage = ...
    addSlideNoteToTrackSect(slideImage, trackImage, note, nextNote, args)

moveDuration = nextNote.startTime - note.startTime;
moveDuration = round(moveDuration * args.frameRate);
relNoteDist = nextNote.relPos - note.relPos;
for i = 1:size(trackImage,1)
    for j = 1:size(trackImage,2)
        relPosOffset =...
            getMovePos(i, moveDuration, args);
        absPosOffset = ...
            args.numLights * ...
            (1 - (relNoteDist*relPosOffset + note.relPos));
        trackImage(i,j,:) = ...
            combineNotePixels(trackImage(i,j,:),...
            slideImage(i,j + round(absPosOffset),:));
    end
end

function relPosOffset = getMovePos(curHeight, nextNoteHeight, args);
if curHeight <= nextNoteHeight
    relPosOffset = curHeight / nextNoteHeight;
else
    relPosOffset = 1;
end


function [beamImage, noteStartPixel] = ... %This returns a time-scaled, 2*N+1 WIDE image to shift and plop down
    noteToFullWidthAndHeightBeam(note, numFrames, type, args)

[noteImage, startPixel, endPixel] = getNoteImage(type, args);
startTimeRatio = (startPixel-1)/(size(noteImage,1)-1);
endTimeRatio = (endPixel-1)/(size(noteImage,1)-1);
timeScaleFactor = 1/(endTimeRatio - startTimeRatio);
desiredHeight = ceil(numFrames * timeScaleFactor);
desiredWidth = args.numLights*2+1;
beamImage = imresize(noteImage, [desiredHeight, desiredWidth], 'bilinear');
noteStartPixel = round(size(noteImage,1) * startTimeRatio);
beamImage = rgb2hsv(beamImage);
beamImage(:,:,1) = beamImage(:,:,1) + rand;
beamImage(:,:,1) = mod(beamImage(:,:,1),1);


function [noteImage, startPixel, endPixel] = getNoteImage(type, args)
if isequal(type, 'note')
    noteImage = imread('noteIm.png');
    startPixel = 1;
    endPixel = size(noteImage,1);
elseif isequal(type, 'slide');
    noteImage = imread('slideIm.png');
    startPixel = 1;
    endPixel = size(noteImage,1);
end


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


function beamOut = combineTrackBeams(trackBeams, args)
beamOut = zeros(size(trackBeams{1}));
for i = 1:length(trackBeams)
    track = trackBeams{i};
    for j = 1:min([size(beamOut,1),size(track,1)])
        for k = 1:min([size(beamOut,1),size(track,1)])
            beamOut(j,k,:) = ...
                combineNotePixels(beamOut(j,k,:),track(j,k,:));
        end
    end
end

beamOut = hsv2rgb(beamOut);


function beamOut = combineSlideAndNoteBeams(noteTracks, slideTracks, args)
for i = 1:length(noteTracks)
    ind = 2*(i-1)+1;
    theTracks{ind} = noteTracks{i};
    theTracks{ind+1} = slideTracks{i};
end

beamOut = zeros(size(theTracks{1}));
for i = 1:length(theTracks)
    track = theTracks{i};
    for j = 1:min([size(beamOut,1),size(track,1)])
        for k = 1:min([size(beamOut,2),size(track,2)])
            beamOut(j,k,:) = ...
                combineNotePixels(beamOut(j,k,:),track(j,k,:));
        end
    end
end
beamOut = hsv2rgb(beamOut);

function [pitches, startTimes, endTimes, stepDir,...
    isInChord, relSize, relPos] = dealTrack(track)

pitches = [track.pitch];
startTimes = [track.startTime];
endTimes = [track.endTime];
stepDir  = [track.stepDir];
isInChord =  [track.isInChord];
relSize = [track.relSize];
relPos = [track.relPos];

