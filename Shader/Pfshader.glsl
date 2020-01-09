precision mediump float;

varying vec2 fTexCoord;

uniform sampler2D texture;
uniform vec4 uColor;

void main()
{
	gl_FragColor = texture2D(texture, fTexCoord) * uColor;
}