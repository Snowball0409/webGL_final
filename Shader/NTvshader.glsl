precision mediump float;

attribute vec2 vPosition;
attribute vec2 vTexCoord;

varying vec4 fPosition;
varying vec2 fTexCoord;

uniform mat4 modelingMatrix;
uniform mat4 viewingMatrix;
uniform mat4 projectionMatrix;
uniform float x_scalor;

void main()
{
    vec4 vertex = vec4(vPosition, 0, 1);
    fPosition = modelingMatrix * vertex;
    fTexCoord = vTexCoord;
    
    vertex = modelingMatrix * vertex;
    vertex.x *= x_scalor;
    gl_Position = vertex;
}