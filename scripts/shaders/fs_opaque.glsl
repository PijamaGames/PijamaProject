precision mediump float;

varying vec2 fTexCoords;

//CONST UNIFORMS
uniform sampler2D colorTex;
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
  /*const float maxDepth = sqrt(2.0);
  float size = clamp((fTexCoords.y * scale.y + height) * tileSizeDIVres.y, 0.0,1.0);
  float finalHeight = size*vertical;
  float finalFloorPos = floorPos+size*2.0*(1.0-vertical);
  float depth = length(vec2(finalFloorPos, finalHeight))/maxDepth;*/

  //Depth
  const float maxDepth = sqrt(2.0);
  float width = fTexCoords.y * scale.y;
  float xPos = floorPos + width * (1.0-vertical)/*-cam*/;
  xPos = (xPos*tileSizeDIVres.y)+0.5/** (1.0-vertical)*/;
  float yPos = 1.0-(height + width*vertical)*tileSizeDIVres.y;
  float depth = length(vec2(xPos, yPos))/maxDepth;

  //Tex coords
  vec2 finalTexCoords = vec2(
    //tile + desplazamiento correspondiente
    tile.x/tileMapResDIVtileSize.x + (fTexCoords.x/tileMapResDIVtileSize.x)*scale.x,
    1.0 - (tile.y/tileMapResDIVtileSize.y + (fTexCoords.y/tileMapResDIVtileSize.y)*scale.y)
  );

  vec4 texColor = texture2D(colorTex, finalTexCoords);
  if(texColor.w < 0.3) discard;
  gl_FragColor = texColor;
  //gl_FragColor = vec4(xPos, xPos, xPos, 1.0);
  //gl_FragColor = vec4(yPos, yPos, yPos, 1.0);
  //gl_FragColor = vec4(depth, depth, depth, 1.0);
  //gl_FragColor = vec4(texColor.xyz*depth, 1.0);
}
