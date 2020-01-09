precision mediump float;

varying vec2 fTexCoord;

uniform sampler2D texture;

const vec4 mask = vec4(-0.6, -0.55, -0.55, 1);

void main()
{
    gl_FragColor = (texture2D(texture, fTexCoord) + mask) / 2.0;
}