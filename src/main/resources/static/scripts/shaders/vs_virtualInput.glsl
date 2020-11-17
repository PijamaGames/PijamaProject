precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

varying vec2 fTexCoords;

uniform vec2 canvasRes;
uniform vec2 scale;
uniform vec2 position;
uniform vec2 anchor;

void main()
{
  fTexCoords = texCoords;

  float unit = min(canvasRes.x, canvasRes.y);


  vec2 pos = vertPosition*0.5;
  pos = (anchor-0.5)*canvasRes+(pos*scale+position)*unit;
  pos /= canvasRes;
  pos *= 2.0;


  gl_Position = vec4(pos, 0.0, 1.0);
}
