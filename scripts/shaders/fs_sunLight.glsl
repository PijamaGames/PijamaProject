precision highp float;

varying vec2 fTexCoords;

//UNIFORMS
uniform sampler2D depthTex;
uniform sampler2D sunDepthTex;
uniform float verticalShadowStrength;
uniform float temperature;

/*float Project(vec2 p){
  const vec2 va = vec2(0.0,0.0);
  const vec2 vb = vec2(1.0,0.0);

  vec2 va_vb = vb-va;
  vec2 va_p = p-va;
  float dist = length(va_vb);
  va_vb = normalize(va_vb);
  float d = dot(va_p, va_vb);
  d = clamp(d, 0.0, dist);
  return d;
}*/

void main()
{
  vec4 depthSample = texture2D(depthTex, fTexCoords);
  vec4 sunDepthSample = texture2D(sunDepthTex, fTexCoords);

  const float maxDepth = sqrt(2.0);

  float depth = length(depthSample.xy)/maxDepth;
  //float expectedSunDepth = length(vec2(depthSample.x,depthSample.y))/maxDepth;
  float sunDepth = length(vec2(sunDepthSample.x, sunDepthSample.y))/maxDepth;

  //if(depth < 1.0-sunDepth) discard;
  float depthVertical = float(depthSample.z >= 0.9);
  bool depthInFront = (depthSample.x < sunDepthSample.x && depthSample.z >= 0.9);
  //bool bothVertical = (depthSample.z >= 0.9 && sunDepthSample.z >=0.9 && depthSample.x < sunDepthSample.x);

  float cond = float(sunDepth < depth-0.01*depthVertical && !depthInFront)/* && (depthSample.z < 1.0)*/;
  //cond = float(1.0-depthSample.x < sunDepthSample.x);

  float occlusion = clamp(cond + depthSample.z*verticalShadowStrength,0.0,1.0);
  //float occlusion = float(depthSample.z != sunDepthSample.z);
  occlusion = 1.0-occlusion;
  float diff = (abs(depthSample.y-sunDepthSample.y)*(1.0-depthVertical));
  gl_FragColor = vec4(occlusion,diff,temperature,1.0);

  //gl_FragColor = vec4(sunDepth,sunDepth,sunDepth,1.0);
  //gl_FragColor = vec4(depth,depth,depth,1.0);
  //diff*=5.0;
  //gl_FragColor = vec4(diff,diff,diff,1.0);

  //float aux = depth*0.5+sunDepth*0.5;
  //aux = depthSample.x*sunDepthSample.x;
  //aux = max(depth, sunDepth);
  //gl_FragColor = vec4(aux,aux,aux,1.0);
  //gl_FragColor = vec4(expectedSunDepth,expectedSunDepth,expectedSunDepth,1.0);
}
