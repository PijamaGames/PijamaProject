precision mediump float;

varying vec2 fTexCoords;
//varying float depth;
//varying float depth;
uniform sampler2D colorTex;
//uniform sampler2D depthSampler;
//uniform vec2 screenSize;
//uniform vec3 fogColor;
//uniform vec2 fogEdges;
uniform vec2 anchor;
uniform vec2 scale;
uniform vec2 camPosition;
uniform vec2 position;
uniform vec2 height;

void main()
{

  const vec2 res = vec2(640,480);
  const float tileSize = 32.0;

  vec2 anchor = vec2(0.5, 0.0);
  vec2 scale = vec2(1,15);
  vec2 camPosition = vec2(0,0);
  vec2 position = vec2(0,-7.5);
  float height = 7.0;

  //Depth
  const float maxDepth = sqrt(2.0);
  float vPos = (position.y-anchor.y-camPosition.y);
  float floorPos = (vPos/res.y*tileSize)+0.5;
  float finalHeight = ((fTexCoords.y * scale.y + height)/res.y)*tileSize;
  float depth = 1.0-length(vec2(floorPos, 1.0-clamp(finalHeight, 0.0,1.0)))/maxDepth;

  gl_FragColor = /*vec4(depth, depth, depth,1.0)*/ texture2D(colorTex, fTexCoords);
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
