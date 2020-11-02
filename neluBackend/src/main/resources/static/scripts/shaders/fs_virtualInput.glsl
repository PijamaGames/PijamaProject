precision mediump float;

varying vec2 fTexCoords;

uniform sampler2D colorTex;
uniform vec4 tint;

void main()
{
  vec2 tCoords = vec2(fTexCoords.x, 1.0-fTexCoords.y);
  gl_FragColor = texture2D(colorTex, tCoords)*tint;
}
