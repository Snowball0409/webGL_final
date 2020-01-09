precision mediump float;

attribute vec2 vPosition;
attribute vec2 vTexCoord;
varying vec2 fTexCoord;
varying vec2 fPosition;

void main()
{
    fTexCoord = vTexCoord;
    fPosition = vPosition;
    gl_Position = vec4(vPosition, 0, 1);
}