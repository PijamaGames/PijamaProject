precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

//uniform vec2 scale;
//uniform vec2 anchor;
//uniform vec2 res;
//uniform int tileSize;
//uniform vec2 tile;

varying vec2 fTexCoords;

uniform vec2 anchor;
uniform vec2 scale;
uniform vec2 position;
uniform float height;

uniform vec2 camPosition;
//varying float depth;

void main()
{
  fTexCoords = texCoords;

  //vec2 pos = (vertPosition+vec2(0.5,0.5)-anchor)*scale*tileSize/res;
  const vec2 res = vec2(640,480);
  const float tileSize = 32.0;

  /*vec2 anchor = vec2(0.5, 0.5);
  vec2 scale = vec2(2,2);
  vec2 camPosition = vec2(0,0);
  vec2 position = vec2(0,0);
  float height = 0.0;*/


  vec2 pos = vec2(
    ((vertPosition.x+position.x/scale.x*2.0-anchor.x*2.0+1.0)/res.x)*scale.x,
    ((vertPosition.y+(position.y+height)/scale.y*2.0-anchor.y*2.0+1.0)/res.y)*scale.y
  ) *tileSize;
  vec2 cam = vec2(
    camPosition.x*2.0/res.x,
    camPosition.y*2.0/res.y
  ) * tileSize;

  //Depth
  /*const float maxDepth = sqrt(2.0);
  float vPos = (position.y-anchor.y-camPosition.y);
  float floorPos = (vPos/res.y*tileSize)+0.5;
  float finalHeight = ((texCoords.y * scale.y + height)/res.y)*tileSize;
  float depth = 1.0-length(vec2(floorPos, 1.0-clamp(finalHeight, 0.0,1.0)))/maxDepth;*/

  gl_Position = vec4(pos-cam,0.0,1.0);
}
