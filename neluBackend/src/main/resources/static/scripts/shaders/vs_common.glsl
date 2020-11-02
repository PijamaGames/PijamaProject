precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

varying vec2 fTexCoords;

void main()
{
  fTexCoords = texCoords;
  gl_Position = vec4(vertPosition,0.0,1.0);
}
