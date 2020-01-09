var eff = new Ring({
    amount: 32
});
var gl, canvas;
var playlist = [{
    title: ' ',
    artist: ' ',
    album: ' ',
}];

window.onload = function () {

    canvas = document.getElementById( "gl-canvas" );
    vertexScript = document.getElementById("no-transform-vertex-shader");
    vertexScript.text = getSourceSynch("Shader/NTvshader.glsl");
    fragmentScript = document.getElementById("pure-tex-fragment-shader");
    fragmentScript.text = getSourceSynch("Shader/Pfshader.glsl");
    fragmentScript = document.getElementById("dark-tex-fragment-shader");
    fragmentScript.text = getSourceSynch("Shader/DTfshader.glsl");
    fragmentScript = document.getElementById("bg-vertex-shader");
    fragmentScript.text = getSourceSynch("Shader/BGvshader.glsl");
    fragmentScript = document.getElementById("bloom-fragment-shader");
    fragmentScript.text = getSourceSynch("Shader/BMfshader.glsl");
    fragmentScript = document.getElementById("circle-fragment-shader");
    fragmentScript.text = getSourceSynch("Shader/CCfshader.glsl");
    
    eff.colors = new Array(3);

    //set white color
    this.eff.colors[0] = 255;
    this.eff.colors[1] = 255;
    this.eff.colors[2] = 255;

    console.log('GL ready');

    var audio = new Audio();
    audio.id = 'myAudio';
    document.getElementsByTagName("div")["container"].appendChild(audio);
    audio.controls = true;
    audio.autoplay = true;

    for (let i = 0; i < 3; i++) eff.colors[i] /= 255;
    eff.colors.push(1.0);

    canvas = document.getElementById('gl-canvas');
    canvas.width = 650;
    this.canvas.height = 650;
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        console.log('webgl is not avaliable.');
        return;
    }

    // get music file
    var inputer = document.getElementById("musicFile");

    eff.initEffect();

    inputer.oninput = function readfile(e){
        var target = $('#musicFile').get(0);
        var file = target.files[0];
        
        document.getElementById("droplabel").innerHTML = "Last Input : " + file.name;
        
        var reader = new FileReader();
        reader.onload = function(evt) {
            $('#myAudio').attr('src', evt.target.result);
            $('#playlist').append('<li class="playlist_li">' + 'mo' + ' - ' + file.name + '</li>');
            playlist.push({
                title: file.name,
                mp3: evt.target.result
            });
            $('.tag').html('<strong class="title">' + file.name + '</strong>');
            $('.info').html('<li class="artist">' + file.artist + '</li><li class="album">' + file.album + '</li>')
            
            $('#playlist li').each(function(i) {
                var _i = i;
                $(this).on('click', function() {
                    switchTrack(_i);
                });
            });
            eff.initEffect();
            eff.context.resume();
        };
        reader.readAsDataURL(file);
    };
    //document.getElementById("ChangeColor").onclick = function(){eff.changetest = !eff.changetest;};
};

var switchTrack = function(i) {
    if (i < 0) {
        track = currentTrack = playlist.length - 1;
    } else if (i >= playlist.length) {
        track = currentTrack = 0;
    } else {
        track = i;
    }
    loadMusic(track+1);
}
var loadMusic = function(i) {
    var item = playlist[i];
    var newaudio = $("#myAudio").attr('src', item.mp3);
    $('.tag').html('<strong class="title">' + item.title + '</strong><li class="artist">' + item.artist + '</li><li class="album">' + item.album + '</li>');
    $('#playlist li').removeClass('playing').eq(i).addClass('playing');
    audio = newaudio[0];
}
