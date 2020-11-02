precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

varying vec2 fTexCoords;

//CONST UNIFORMS
uniform vec2 tileSizeDIVres;

//OBJ UNIFORMS
uniform vec2 scale;
//uniform vec2 center;
uniform vec2 position;
uniform vec2 anchor;
uniform float vertical;
uniform float anchorXScale;
uniform float aspectRatio;


void main() {
  fTexCoords = texCoords;

  vec2 vpos = vertPosition*0.5;
  vpos*=scale;
  float anchorScale = clamp(anchorXScale, 0.0, 1.0);
  //float anchorScale = anchorXScale;

  vec2 realAnchor = anchor - 0.5;
  realAnchor.x*=anchorScale;


  vec2 finalVpos = vpos * tileSizeDIVres*2.0;
  finalVpos += realAnchor*2.0;
  finalVpos += position/vec2(aspectRatio*0.5, 0.5);

  //DEPTH Y
  gl_Position = vec4(finalVpos,0.0, 1.0);
}
