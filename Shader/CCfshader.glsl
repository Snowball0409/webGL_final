precision mediump float;

varying vec2 fPosition;
uniform float radius;
uniform vec4 uColor;

void main()
{
    float x = fPosition.x;
    float y = fPosition.y;
    if(x*x + y*y > radius*radius)
        gl_FragColor = uColor;
    else
        gl_FragColor = vec4(0);
}