precision highp float;

varying vec2 fTexCoords;

//UNIFORMS
uniform sampler2D depth;
uniform sampler2D sunDepth;

void main()
{
  vec4 depthF = texture2D(depth, fTexCoords);
  vec4 sunDepthF = texture2D(sunDepth, fTexCoords);
  //float d = max(depthF.x, sunDepthF.x);
  float occlusion = 1.0-float(sunDepthF.x > depthF.x+0.005);
  gl_FragColor = vec4(occlusion,occlusion,occlusion,1.0);
  //gl_FragColor = sunDepthF;
  //gl_FragColor = depthF;
  //float d = depthF.x * (1.0-sunDepthF.x);
  //gl_FragColor = vec4(d,d,d,1.0);
  //gl_FragColor = depthF * (sunDepthF);
}
