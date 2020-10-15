precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

varying vec2 fTexCoords;


//CONST UNIFORMS
uniform vec2 tileSizeDIVres;

//UNIFORMS
uniform vec2 camTransformed;
uniform vec2 camPosition;

uniform float stretch;

//OBJ UNIFORMS
uniform vec2 scale;
uniform vec2 vertDisplacement;
uniform float height;
uniform float vertical;
uniform vec2 scaleMULtileSizeDIVres;
uniform float floorPos;
uniform float anchory;

varying float depth;

void main()
{
  fTexCoords = texCoords;

  //const float shadowDis = 0.5;

  //const float shadowDis = 0.3;

  //const float stretch = -1.0;
  float shadowDis = 0.3+abs(stretch*0.1);

  vec2 pos = vec2(
    (vertPosition.x + vertDisplacement.x) * scaleMULtileSizeDIVres.x,
    (vertPosition.y+
      ((-2.0*vertPosition.y+shadowDis) -(scale.y+anchory*2.0))
      *vertical
      +vertDisplacement.y
      -height*2.0
      //-height*1.0*(1.0-vertical)
      -texCoords.y*stretch*vertical //stretch para verticales
      +(1.0-texCoords.y)*-stretch*(1.0-vertical)*height //stretch para horizontales
      ) * scaleMULtileSizeDIVres.y
  );
  /*vec2 pos = vec2(
    (vertPosition.x + vertDisplacement.x) * scaleMULtileSizeDIVres.x,
    ((vertPosition.y + (-2.0*vertPosition.y+shadowDis)+ vertDisplacement.y
    ) * scaleMULtileSizeDIVres.y
  );*/

  //Depth
  //const float maxDepth = sqrt(2.0);
  float width = texCoords.y * scale.y;
  float xPos = floorPos + (width + height) * (1.0-vertical) + (shadowDis*vertical);
  xPos = (xPos*tileSizeDIVres.y)+0.5;
  //float yPos = (height + width*vertical)*tileSizeDIVres.y;
  //depth = 0.99*length(vec2(xPos,0.0 1.0-yPos))/maxDepth;
  depth = xPos;

  gl_Position = vec4(pos-camTransformed,1.0-depth,1.0);
}
