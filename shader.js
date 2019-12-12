precision mediump float;

attribute vec4 vPosition;
attribute vec4 vColor;
attribute vec4 vNormal;
attribute vec2 vTexCoord;

varying vec4 fPosition;
varying vec4 fColor;
varying vec4 fNormal;
varying vec2 fTexCoord;

uniform mat4 modelingMatrix;
uniform mat4 viewingMatrix;
uniform mat4 projectionMatrix;
uniform float volume;

void main()
{
	vec4 vertex = vPosition;
    vec4 N = normalize( modelingMatrix * vNormal );	// Normal vector

	fPosition = modelingMatrix * vPosition;
    fColor = vColor;
	fNormal = N;
	fTexCoord = vTexCoord;

	// Scale the vertex with the audio volume
	vertex.z *= 1.0 + volume;
	
    gl_Position = projectionMatrix * viewingMatrix * modelingMatrix * vertex;
}