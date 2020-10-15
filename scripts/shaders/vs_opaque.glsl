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

varying vec2 depth;

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
  float depthY =
  (height)*(1.0-vertical) +
  ((height+texCoords.y*scale.y)*tileSizeDIVres.y)*vertical;
  depthY=1.0-depthY;
  //depthY=depthY*0.5+0.5;
  depth = vec2(depthX, depthY);
  //depth = length(vec2(depthX, /*depthY*/0.0))/*/sqrt(2.0)*/;
  //depth = sqrt(depthX*depthX);
  //depth = depthX;
  gl_Position = vec4(finalVpos,0.99*depthX,1.0);
}

/*********void other()
{
  fTexCoords = texCoords;

  vec2 pos = vec2(
    (vertPosition.x + vertDisplacement.x) * scaleMULtileSizeDIVres.x,
    (vertPosition.y + vertDisplacement.y) * scaleMULtileSizeDIVres.y
    //(-vertPosition.y + vertDisplacement.y-scale.y*vertical) * scaleMULtileSizeDIVres.y
  );

  //Depth
  //const float maxDepth = sqrt(2.0);
  float width = texCoords.y * scale.y;
  float xPos = floorPos + (width/*+height*//***) * (1.0-vertical);
  /**********xPos = (xPos*tileSizeDIVres.y)+0.5;
  //float yPos = (height + width*vertical)*tileSizeDIVres.y;
  //depth = 0.99*length(vec2(xPos,0.0 1.0-yPos))/maxDepth;
  depth = xPos;

  gl_Position = vec4(pos-camTransformed,depth,1.0);
}*/
