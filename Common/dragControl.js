(function($) {
    // Settings
    var repeat = localStorage.repeat || 0,
        shuffle = localStorage.shuffle || 'false',
        continous = true,
        autoplay = false,
        playlist = [{
            title: ' ',
            artist: ' ',
            album: ' ',
        }];
    for (var i = 0; i < playlist.length; i++) {
        var item = playlist[i];
        if(playlist[i].title != ' ')$('#playlist').append('<li>' + item.artist + ' - ' + item.title + '</li>');
    }
    // Load playlist
    var time = new Date(),
        currentTrack = shuffle === 'true' ? time.getTime() % playlist.length : 0,
        trigger = false,
        audio, timeout, isPlaying, playCounts;
    var play = function() {
        audio.play();
        $('.playback').addClass('playing');
        timeout = setInterval(updateProgress, 500);
        isPlaying = true;
    }
    var pause = function() {
        audio.pause();
        $('.playback').removeClass('playing');
        clearInterval(updateProgress);
        isPlaying = false;
    }
    // Update progress
    var setProgress = function(value) {
        var currentSec = parseInt(value % 60) < 10 ? '0' + parseInt(value % 60) : parseInt(value % 60),
            ratio = value / audio.duration * 100;
        $('.timer').html(parseInt(value / 60) + ':' + currentSec);
        $('.progress .pace').css('width', ratio + '%');
        $('.progress .slider a').css('left', ratio + '%');
    }
    var updateProgress = function() {
        setProgress(audio.currentTime);
    }
    // Progress slider
    $('.progress .slider').slider({
        step: 0.1,
        slide: function(event, ui) {
            $(this).addClass('enable');
            setProgress(audio.duration * ui.value / 100);
            clearInterval(timeout);
        },
        stop: function(event, ui) {
            audio.currentTime = audio.duration * ui.value / 100;
            $(this).removeClass('enable');
            timeout = setInterval(updateProgress, 500);
        }
    });
    // Volume slider
    var setVolume = function(value) {
        audio.volume = localStorage.volume = value;
        $('.volume .pace').css('width', value * 100 + '%');
        $('.volume .slider a').css('left', value * 100 + '%');
    }
    var volume = localStorage.volume || 0.5;
    $('.volume .slider').slider({
        max: 1,
        min: 0,
        step: 0.01,
        value: volume,
        slide: function(event, ui) {
            setVolume(ui.value);
            $(this).addClass('enable');
            $('.mute').removeClass('enable');
        },
        stop: function() {
            $(this).removeClass('enable');
        }
    }).children('.pace').css('width', volume * 100 + '%');
    $('.mute').click(function() {
        if ($(this).hasClass('enable')) {
            setVolume($(this).data('volume'));
            $(this).removeClass('enable');
        } else {
            $(this).data('volume', audio.volume).addClass('enable');
            setVolume(0);
        }
    });
    // Switch track
    var switchTrack = function(i) {
        if (i < 0) {
            track = currentTrack = playlist.length - 1;
        } else if (i >= playlist.length) {
            track = currentTrack = 0;
        } else {
            track = i;
        }
        $('audio').remove();
        loadMusic(track);
        if (isPlaying == true) play();
    }
    // Shuffle
    var shufflePlay = function() {
        var time = new Date(),
            lastTrack = currentTrack;
        currentTrack = time.getTime() % playlist.length;
        if (lastTrack == currentTrack)++currentTrack;
        switchTrack(currentTrack);
    }
    // Fire when track ended
    var ended = function() {
        pause();
        audio.currentTime = 0;
        playCounts++;
        if (continous == true) isPlaying = true;
        if (repeat == 1) {
            play();
        } else {
            if (shuffle === 'true') {
                shufflePlay();
            } else {
                if (repeat == 2) {
                    switchTrack(++currentTrack);
                } else {
                    if (currentTrack < playlist.length) switchTrack(++currentTrack);
                }
            }
        }
    }
    var beforeLoad = function() {
        var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
        $('.progress .loaded').css('width', (100 / (this.duration || 1) * endVal) + '%');
    }
    // Fire when track loaded completely
    var afterLoad = function() {
        if (autoplay == true) play();
    }
    // Load track
    var loadMusic = function(i) {
        var item = playlist[i],
            newaudio = $('<audio>').html('<source src="' + item.mp3 + '"><source src="' + item.ogg + '">').appendTo('#player');
        $('.tag').html('<strong class="title">' + item.title + '</strong><li class="artist">' + item.artist + '</li><li class="album">' + item.album + '</li>');
        $('#playlist li').removeClass('playing').eq(i).addClass('playing');
        audio = newaudio[0];
        audio.volume = $('.mute').hasClass('enable') ? 0 : volume;
        audio.addEventListener('progress', beforeLoad, false);
        audio.addEventListener('durationchange', beforeLoad, false);
        audio.addEventListener('canplay', afterLoad, false);
        audio.addEventListener('ended', ended, false);
    }
    loadMusic(currentTrack);
    $('.playback').on('click', function() {
        if ($(this).hasClass('playing')) {
            pause();
        } else {
            play();
        }
    });
    $('.rewind').on('click', function() {
        if (shuffle === 'true') {
            shufflePlay();
        } else {
            switchTrack(--currentTrack);
        }
    });
    $('.fastforward').on('click', function() {
        if (shuffle === 'true') {
            shufflePlay();
        } else {
            switchTrack(++currentTrack);
        }
    });
    $('#playlist li').each(function(i) {
        var _i = i;
        $(this).on('click', function() {
            switchTrack(_i);
        });
    });
    if (shuffle === 'true') $('.shuffle').addClass('enable');
    if (repeat == 1) {
        $('.repeat').addClass('once');
    } else if (repeat == 2) {
        $('.repeat').addClass('all');
    }
    $('.repeat').on('click', function() {
        if ($(this).hasClass('once')) {
            repeat = localStorage.repeat = 2;
            $(this).removeClass('once').addClass('all');
        } else if ($(this).hasClass('all')) {
            repeat = localStorage.repeat = 0;
            $(this).removeClass('all');
        } else {
            repeat = localStorage.repeat = 1;
            $(this).addClass('once');
        }
    });
    $('.shuffle').on('click', function() {
        if ($(this).hasClass('enable')) {
            shuffle = localStorage.shuffle = 'false';
            $(this).removeClass('enable');
        } else {
            shuffle = localStorage.shuffle = 'true';
            $(this).addClass('enable');
        }
    });
    var dropbox = document.getElementById("dropbox")
    // init event handlers
    dropbox.addEventListener("dragenter", dragEnter, false);
    dropbox.addEventListener("dragexit", dragExit, false);
    dropbox.addEventListener("dragover", dragOver, false);
    dropbox.addEventListener("drop", drop, false);
    // init the widgets
    $("#progressbar").progressbar();
    function dragEnter(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }
    function dragExit(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }
    function dragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }
    function drop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        var count = files.length;
        // Only call the handler if 1 or more files was dropped.
        if (count > 0)
            handleFiles(files);
    }
    function handleFiles(files) {
        var mp3Files = $.map(files, function(f, i) {
            return f.type.indexOf("audio/mp3") == 0 ? f : null;
        });
        $.each(mp3Files, function(i, file) {
            document.getElementById("droplabel").innerHTML = "Processing " + file.name;
            
            var reader = new FileReader();
            reader.onload = function(evt) {
                $('#playlist').append('<li>' + 'mo' + ' - ' + file.name + '</li>');
                playlist.push({
                    title: file.name,
                    mp3: evt.target.result
                });
                
                $('#playlist li').each(function(i) {
                    var _i = i;
                    $(this).on('click', function() {
                        switchTrack(_i);
                    });
                });
            }
            // init the reader event handlers
            reader.onprogress = handleReaderProgress;
            reader.onloadend = handleReaderLoadEnd;
            reader.readAsDataURL(file);
        });
    }
    function handleReaderProgress(evt) {
        if (evt.lengthComputable) {
            var loaded = (evt.loaded / evt.total);
            $("#progressbar").progressbar({
                value: loaded * 100
            });
        }
    }
    function handleReaderLoadEnd(evt) {
        $("#progressbar").progressbar({
            value: 100
        });
    }
})(jQuery);