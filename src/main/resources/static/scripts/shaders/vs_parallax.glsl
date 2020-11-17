precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

varying vec2 fTexCoords;

//uniform vec2 texSize;


void main(){
  fTexCoords = vec2(texCoords.x, 1.0-texCoords.y);
  gl_Position = vec4(vertPosition, 0.0, 1.0);
}
