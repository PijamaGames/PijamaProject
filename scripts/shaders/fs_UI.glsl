precision mediump float;

varying vec2 fTexCoords;

//CONST UNIFORMS
uniform sampler2D colorTex;
uniform vec2 tileSizeDIVres;
uniform vec2 tileMapResDIVtileSize;

//UNIFORMS

//OBJ UNIFORMS
uniform vec2 scale;
uniform vec2 numTiles;
//uniform float height;
//uniform float vertical;
uniform vec2 tile;
//uniform float floorPos;
uniform vec4 tint;
uniform float isText;

void main()
{
  vec2 repeatedTexCoords = vec2(
    mod(fTexCoords.x*scale.x, numTiles.x) / numTiles.x,
    mod(fTexCoords.y*scale.y, numTiles.y) / numTiles.y
    //mod(((fTexCoords.x*scale.x)/numTiles.x),1.0),
    //mod(((fTexCoords.y*scale.y)/numTiles.y),1.0)
  );

  vec2 finalTexCoords = vec2(
    //tile + desplazamiento correspondiente
    tile.x/tileMapResDIVtileSize.x + (repeatedTexCoords.x/tileMapResDIVtileSize.x)*numTiles.x,
    1.0 - (tile.y/tileMapResDIVtileSize.y + (repeatedTexCoords.y/tileMapResDIVtileSize.y)*numTiles.y)
  );

  vec4 texColor = texture2D(colorTex, finalTexCoords) * tint;

  if(isText == 1.0 && texColor.w < 0.9) discard;
  texColor = texColor *(1.0-isText) + tint * isText;
  gl_FragColor = texColor;

}
