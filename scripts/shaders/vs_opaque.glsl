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

varying float depth;

void main()
{
  fTexCoords = texCoords;

  vec2 pos = vec2(
    (vertPosition.x + vertDisplacement.x) * scaleMULtileSizeDIVres.x,
    (vertPosition.y + vertDisplacement.y) * scaleMULtileSizeDIVres.y
  );

  //Depth
  const float maxDepth = sqrt(2.0);
  float width = texCoords.y * scale.y;
  float xPos = floorPos + width * (1.0-vertical);
  xPos = (xPos*tileSizeDIVres.y)+0.5;
  float yPos = (height + width*vertical)*tileSizeDIVres.y;
  /*float */depth = length(vec2(xPos, 1.0-yPos))/maxDepth;

  gl_Position = vec4(pos-camTransformed,depth,1.0);
}
