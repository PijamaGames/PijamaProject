precision mediump float;

varying vec2 fTexCoords;
//varying float depth;
uniform sampler2D colorSampler;
uniform sampler2D depthSampler;
uniform vec2 screenSize;
uniform vec3 fogColor;
uniform vec2 fogEdges;

void main()
{
  float coordx = gl_FragCoord.x / screenSize.x;
  float coordy = gl_FragCoord.y / screenSize.y;
  //gl_FragColor = vec4(coordx, coordy,0.0,1.0);
  vec4 depthChannel = texture2D(depthSampler, vec2(coordx, coordy));
  float depth = depthChannel.x;
  float fogAmount = smoothstep(fogEdges.x, fogEdges.y, depth);
  vec4 colorChannel = texture2D(colorSampler, fTexCoords);
  gl_FragColor = mix(colorChannel, vec4(fogColor, 1.0), fogAmount);
  //gl_FragColor = colorChannel;
}
