precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

varying vec2 fTexCoords;
varying vec2 depth;


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

uniform float shadowLength;

void main() {
  fTexCoords = texCoords;
  const float defaultShadowDis = 0.24;
  float shadowDis = defaultShadowDis + shadowLength*0.07;
  shadowDis = clamp(shadowDis, -defaultShadowDis, shadowDis);
  //shadowDis = clamp(shadowDis, -defaultShadowDis, shadowDis);

  vec2 vpos = vertPosition*0.5;
  vpos.y = (-vpos.y)*vertical + vpos.y*(1.0-vertical);
  vpos*=scale;
  vpos+=center-cam;
  vpos.y+=((-scale.y)*vertical);
  vpos.y-=(texCoords.y*shadowLength*vertical);
  vpos.y-=((1.0-texCoords.y)*shadowLength*(1.0-vertical));

  float floorPos = center.y-scale.y*0.5-cam.y+shadowDis;

  vec2 finalVpos = (vpos+vec2(0.0,-height+shadowDis*vertical)) * tileSizeDIVres*2.0;
  vpos*=tileSizeDIVres*2.0;
  floorPos*=tileSizeDIVres.y*2.0;

  //DEPTH X
  float depthX =
  (vpos.y)*(1.0-vertical) +
  (floorPos)*vertical;

  depthX=depthX*0.5+0.5;

  //DEPTH Y
  float h = height;
  float depthY =
  (h)*(1.0-vertical) +
  ((h+texCoords.y*(scale.y+shadowLength)))*vertical;
  depthY*=tileSizeDIVres.y;
  depthY=1.0-depthY;
  depthY = clamp(depthY, 0.0, 1.0);
  depth = vec2(depthX, depthY);
  //depth = length(vec2(depthX, /*depthY*/0.0))/*/sqrt(2.0)*/;
  //depth = sqrt(depthX*depthX);
  //depth = depthX;

  //float finalDepth = length(vec2(/*shadowDis*/depthX, 1.0-depthY))/sqrt(2.0);
  depthY*=0.99;
  gl_Position = vec4(finalVpos,(0.99-depthY)*(vertical)+(depthY)*(1.0-vertical),1.0);
  //gl_Position = vec4(finalVpos, (0.99-0.99*depthX)*(1.0-vertical)+(0.99*(depthX-1.0))*vertical, 1.0);
}
