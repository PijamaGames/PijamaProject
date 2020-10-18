precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

varying vec2 fTexCoords;
//varying float depth;


//CONST UNIFORMS
uniform vec2 tileSizeDIVres;

//UNIFORMS
//uniform vec2 camTransformed;
//uniform vec2 camPosition;
uniform vec2 cam;

//OBJ UNIFORMS
//uniform vec2 vertDisplacement;
//uniform vec2 scaleMULtileSizeDIVres;
//uniform float floorPos;

uniform vec2 scale;
uniform vec2 center;
uniform float height;
uniform float vertical;

//varying vec2 depth;

void main() {
  fTexCoords = texCoords;

  vec2 vpos = vertPosition*0.5;
  vpos*=scale;
  vpos+=center-cam;

  float floorPos = center.y-scale.y*0.5-cam.y;

  vec2 finalVpos = (vpos+vec2(0.0,height)) * tileSizeDIVres*2.0;
  vpos*=tileSizeDIVres*2.0;
  floorPos*=tileSizeDIVres.y*2.0;

  //DEPTH X
  float depthX =
  (vpos.y)*(1.0-vertical) +
  (floorPos)*vertical;

  depthX=depthX*0.5+0.5;

  //DEPTH Y
  /*float depthY =
  (height)*(1.0-vertical) +
  ((height+texCoords.y*scale.y)*tileSizeDIVres.y)*vertical;
  depthY=1.0-depthY;*/

  //depth = vec2(depthX, depthY);
  gl_Position = vec4(finalVpos,0.99*depthX,1.0);
}
