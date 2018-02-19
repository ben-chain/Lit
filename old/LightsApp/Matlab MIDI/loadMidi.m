function midiVarOut = loadMidi(filename, args)
[~,midi] = evalc('readmidi(filename);');
[~, info] = evalc('midiInfo(midi);');
numTracks = max(info(:,1));
metadata = [];
songDuration = 0;
for i = 1:numTracks
    
    if midi.track(i).messages(1).midimeta == 0
        names{i} = char(midi.track(i).messages(1).data);
    else
        names{i} = '?';
    end
    
    noteIndsInTrack = find(info(:,1) == i);
    curTrack = info(noteIndsInTrack,:);
    if length(curTrack) == 0
        metadata{length(metadata)+1} = midi.track(i).messages;
    else
        pitches = curTrack(:,3);
        startTimes = curTrack(:,5);
        endTimes = curTrack(:,6);
        instNums = curTrack(:,9);
        [~, sortedInd] = sort(startTimes);
        if sortedInd' ~= 1:length(sortedInd)
            error('Notes were out of order.  Weird.');
        end
        
        cellzeros = num2cell(zeros(size(startTimes)));
        track = struct(...
            'pitch', num2cell(pitches),...
            'startTime', num2cell(startTimes),...
            'endTime', num2cell(endTimes),...
            'duration', num2cell(endTimes - startTimes),...
            'instNum', num2cell(instNums),...
            'stepDir', cellzeros,...
            'isInChord', cellzeros,...
            'relSize', cellzeros,...
            'relPos', cellzeros...
            );
        tracks{i} = track;
        songDuration = max([songDuration; endTimes]);
    end
end

tracksToDelete = [];
for trackNum = 1:numTracks
    if length(tracks{trackNum}) == 0
        tracksToDelete(length(tracksToDelete)+1) = trackNum;
    end
end
tracks(:,tracksToDelete) = [];
numTracks = length(tracks);

instrumentSepTracks = {};

for trackNum = 1:numTracks %sometimes we get multiple instruments in a track!
    track = tracks{trackNum};
    instsOnTrack = unique([track.instNum]);
    for instrument = instsOnTrack;
        instrumentTypes(length(instrumentSepTracks)+1) = instrument;
        instrumentIndsInTrack = find([track.instNum] == instrument);
        instrumentSepTracks{length(instrumentSepTracks)+1} = track(instrumentIndsInTrack);
        
    end
    
end

midiVarOut.tracks = instrumentSepTracks;
midiVarOut.trackInstrumentTypes = instrumentTypes;
midiVarOut.metadata = metadata;
midiVarOut.songDuration = songDuration;