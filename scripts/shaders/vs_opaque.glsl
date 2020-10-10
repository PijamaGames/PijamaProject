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
uniform vec2 vertDisplacement;
uniform float height;

uniform float vertical;

uniform vec2 camTransformed;
uniform vec2 camPosition;

uniform vec2 res;
uniform float tileSize;
//varying float depth;

void main()
{
  fTexCoords = texCoords;

  vec2 pos = vec2(
    ((vertPosition.x + vertDisplacement.x)/res.x)*scale.x,
    ((vertPosition.y+ vertDisplacement.y)/res.y)*scale.y
  ) *tileSize;

  //Depth
  const float maxDepth = sqrt(2.0);
  float vPos = (position.y-scale.y/2.0-anchor.y-camPosition.y);
  float floorPos = (vPos/res.y*tileSize);
  float finalHeight = ((texCoords.y * scale.y + height)/res.y)*tileSize;
  float depth = length(vec2(floorPos, 1.0-clamp(finalHeight, 0.0,1.0)*vertical))/maxDepth;

  gl_Position = vec4(pos-camTransformed,depth,1.0);
}
