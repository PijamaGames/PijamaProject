precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

varying vec2 fTexCoords;


//CONST UNIFORMS
uniform vec2 tileSizeDIVres;

//UNIFORMS
uniform vec2 camTransformed;
uniform vec2 camPosition;

//OBJ UNIFORMS
uniform vec2 scale;
uniform vec2 vertDisplacement;
uniform float height;
uniform float vertical;
uniform vec2 scaleMULtileSizeDIVres;
uniform float floorPos;

void main()
{
  fTexCoords = texCoords;

  vec2 pos = vec2(
    (vertPosition.x + vertDisplacement.x) * scaleMULtileSizeDIVres.x,
    (vertPosition.y+ vertDisplacement.y) * scaleMULtileSizeDIVres.y
  );

  //Depth
  const float maxDepth = sqrt(2.0);
  float width = texCoords.y * scale.y;
  float xPos = floorPos + width * (1.0-vertical)/*-cam*/;
  xPos = (xPos*tileSizeDIVres.y)+0.5;
  float yPos = (height + width*vertical)*tileSizeDIVres.y;
  float depth = length(vec2(xPos, 1.0-yPos))/maxDepth;
  /*float finalHeight = (texCoords.y * scale.y + height) * tileSizeDIVres.y;
  float depth = length(vec2(floorPos, 1.0-clamp(finalHeight, 0.0,1.0)*vertical))/maxDepth;*/



  gl_Position = vec4(pos-camTransformed,depth,1.0);
}
