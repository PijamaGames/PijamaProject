precision mediump float;

varying vec2 fTexCoords;

//CONST UNIFORMS
uniform sampler2D tileMap;
uniform vec2 tileSizeDIVres;
uniform vec2 tileMapResDIVtileSize;

//UNIFORMS

//OBJ UNIFORMS
uniform vec2 scale;
uniform float height;
uniform float vertical;
uniform vec2 tile;
uniform float floorPos;

void main()
{
  //Depth
  const float maxDepth = sqrt(2.0);
  float finalHeight = (fTexCoords.y * scale.y + height) * tileSizeDIVres.y;
  float depth = length(vec2(floorPos, 1.0-clamp(finalHeight, 0.0,1.0)*vertical))/maxDepth;

  //Tex coords
  vec2 finalTexCoords = vec2(
    //tile + desplazamiento correspondiente
    tile.x/tileMapResDIVtileSize.x + (fTexCoords.x/tileMapResDIVtileSize.x)*scale.x,
    1.0 - (tile.y/tileMapResDIVtileSize.y + (fTexCoords.y/tileMapResDIVtileSize.y)*scale.y)
  );

  vec4 texColor = texture2D(tileMap, finalTexCoords);
  if(texColor.w < 0.3) discard;
  gl_FragColor = texColor;
  gl_FragColor = vec4(depth, depth, depth, 1.0);
}
