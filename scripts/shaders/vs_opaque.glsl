precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

//uniform vec2 scale;
//uniform vec2 anchor;
//uniform vec2 res;
//uniform int tileSize;
//uniform vec2 tile;

varying vec2 fTexCoords;

void main()
{
  //vec2 pos = (vertPosition+vec2(0.5,0.5)-anchor)*scale*tileSize/res;
  const vec2 res = vec2(640,480);
  const float tileSize = 32.0;

  vec2 anchor = vec2(0.5, 0.5);
  vec2 scale = vec2(1,15);
  vec2 camPosition = vec2(10,10);

  vec2 pos = vec2(
    ((vertPosition.x-anchor.x*2.0+1.0)/res.x)*scale.x,
    ((vertPosition.y-anchor.y*2.0+1.0)/res.y)*scale.y
  ) *tileSize;
  vec2 cam = vec2(
    camPosition.x/res.x,
    camPosition.y/res.y
  ) * tileSize;
  fTexCoords = texCoords;
  gl_Position = vec4(pos-cam,0.0,1.0);
}
