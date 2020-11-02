precision mediump float;

attribute vec2 vertPosition;

//UNIFORMS
uniform vec2 camTransformed;

//OBJ UNIFORMS
uniform vec2 vertDisplacement;
uniform vec2 scaleMULtileSizeDIVres;

varying vec2 fvertexPosition;

void main()
{
  fvertexPosition = vertPosition;
  vec2 pos = vec2(
    (vertPosition.x + vertDisplacement.x) * scaleMULtileSizeDIVres.x,
    (vertPosition.y + vertDisplacement.y) * scaleMULtileSizeDIVres.y
  );

  gl_Position = vec4(pos-camTransformed,0.0,1.0);
}
