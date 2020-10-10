precision mediump float;

varying vec2 fTexCoords;
//varying float depth;
//varying float depth;
uniform sampler2D tileMap;
uniform vec2 tileMapRes;
//uniform sampler2D depthSampler;
//uniform vec2 screenSize;
//uniform vec3 fogColor;
//uniform vec2 fogEdges;
uniform vec2 anchor;
uniform vec2 scale;
uniform vec2 camPosition;
uniform vec2 position;
uniform vec2 height;

uniform vec2 tile;

void main()
{

  const vec2 res = vec2(640,480);
  const float tileSize = 32.0;

  vec2 anchor = vec2(0.5, 0.5);
  vec2 scale = vec2(2,2);
  vec2 camPosition = vec2(0,0);
  vec2 position = vec2(0,0);
  float height = 0.0;

  //Depth
  const float maxDepth = sqrt(2.0);
  float vPos = (position.y-anchor.y-camPosition.y);
  float floorPos = (vPos/res.y*tileSize)+0.5;
  float finalHeight = ((fTexCoords.y * scale.y + height)/res.y)*tileSize;
  float depth = 1.0-length(vec2(floorPos, 1.0-clamp(finalHeight, 0.0,1.0)))/maxDepth;

  //Tex coords
  float relationX = tileMapRes.x / tileSize;
  float relationY = tileMapRes.y / tileSize;
  vec2 finalTexCoords = vec2(
    tile.x/(tileMapRes.x/tileSize) + (fTexCoords.x/(tileMapRes.x/tileSize))*scale.x,
    1.0 - (tile.y/(tileMapRes.y/tileSize) + (fTexCoords.y/(tileMapRes.y/tileSize))*scale.y)
  );

  vec4 texColor = texture2D(tileMap, finalTexCoords);
  if(texColor.w < 0.3) discard;
  gl_FragColor = /*vec4(depth, depth, depth,1.0)*/ texColor;
  //gl_FragColor = vec4(depth, depth, depth, 1.0);
  //gl_FragDepth = depth;
  //float coordx = gl_FragCoord.x / screenSize.x;
  //float coordy = gl_FragCoord.y / screenSize.y;
  //gl_FragColor = vec4(coordx, coordy,0.0,1.0);
  //vec4 depthChannel = texture2D(depthSampler, vec2(coordx, coordy));
  //float depth = depthChannel.x;
  //float fogAmount = smoothstep(fogEdges.x, fogEdges.y, depth);
  //vec4 colorChannel = texture2D(colorSampler, fTexCoords);
  //gl_FragColor = mix(colorChannel, vec4(fogColor, 1.0), fogAmount);
  //gl_FragColor = colorChannel;
}
