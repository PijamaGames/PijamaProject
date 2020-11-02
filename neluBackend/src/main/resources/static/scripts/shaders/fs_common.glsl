precision mediump float;

varying vec2 fTexCoords;

//UNIFORMS
uniform sampler2D colorTex;

void main()
{
  gl_FragColor = texture2D(colorTex, fTexCoords);
}
