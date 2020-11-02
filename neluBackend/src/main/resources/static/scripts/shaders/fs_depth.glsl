precision mediump float;

varying vec2 fTexCoords;
varying vec2 depth;

//CONST UNIFORMS
uniform sampler2D colorTex;
uniform vec2 tileSizeDIVres;
uniform vec2 tileMapResDIVtileSize;

//UNIFORMS

//OBJ UNIFORMS
uniform vec2 scale;
uniform vec2 numTiles;
uniform float height;
uniform float vertical;
uniform vec2 tile;
//uniform float floorPos;
uniform vec4 tint;

//varying float depth;



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
  if(texColor.w < 0.9) discard;
  //gl_FragColor = texColor;

  //float d = length(depth)/sqrt(2.0);
  if(height < 0.0) discard;
  gl_FragColor = vec4(depth.xy,vertical,1.0);
  //gl_FragColor = vec4(depth.x, depth.x, depth.x,1.0);
  //gl_FragColor = vec4(finalTexCoords,0.0, 1.0);
  //gl_FragColor = vec4(fTexCoords,0.0, 1.0);
  //gl_FragColor = vec4(yPos, yPos, yPos, 1.0);
  //gl_FragColor = vec4(1.0-depth, 1.0-depth, 1.0-depth, 1.0);
  //gl_FragColor = vec4(fTexCoords.y * scale.y, fTexCoords.y * scale.y, fTexCoords.y * scale.y, 1.0);
  //gl_FragColor = vec4(1.0-fdepth, 1.0-fdepth, 1.0-fdepth, 1.0);
  //gl_FragColor = vec4(texColor.xyz*depth, 1.0);
}
