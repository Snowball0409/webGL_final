precision mediump float;

varying vec2 fTexCoord;

uniform sampler2D texture;
uniform int horizontal;
uniform float x_unit;
uniform float y_unit;

uniform int bloom_size;
uniform float weight[9];

void main()
{
    vec4 final_color = texture2D(texture, fTexCoord) * weight[0];
    float fi;
    for(int i=1 ; i<9 ; i++)
    {
        fi = float(i);
        final_color += texture2D(texture, vec2(fTexCoord.x + fi * x_unit, fTexCoord.y + fi * y_unit)) * weight[i];
        final_color += texture2D(texture, vec2(fTexCoord.x - fi * x_unit, fTexCoord.y - fi * y_unit)) * weight[i];
    }

    gl_FragColor = final_color;
}