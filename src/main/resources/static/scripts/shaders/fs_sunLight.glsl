precision highp float;

varying vec2 fTexCoords;

//UNIFORMS
uniform sampler2D depthTex;
uniform sampler2D sunDepthTex;
uniform float verticalShadowStrength;
uniform float temperature;
uniform float strength;
uniform vec2 tileSizeDIVres;
uniform vec2 cam;
uniform sampler2D noiseTex;
uniform vec2 cloudDisplacement;
uniform float cloudMinIntensity;
uniform float cloudSize;

float rand(float v){
  return fract(v);
}

float rand(vec2 st) {
  //return rand(sin(dot(st.xy*0.05, vec2(12.9898,78.233))) * 43758.5453123);
  float downX = float(st.x<0.0);
  float overX = float(st.x>1.0);
  float fixX = floor(abs(st.x-1.0*overX)+1.0);
  st.x = st.x + fixX * downX -fixX * overX;

  float downY = float(st.y<0.0);
  float overY = float(st.y>1.0);
  float fixY = floor(abs(st.y-1.0*overY)+1.0);
  st.y = st.y + fixY * downY -fixY * overY;

  return texture2D(noiseTex, st).x;
}

float Perlin(vec2 fragCoord){
  vec2 floorFragCoord = vec2(floor(fragCoord.x), floor(fragCoord.y));
  vec2 c1 = floorFragCoord;
  vec2 c2 = floorFragCoord+vec2(1,0);
  vec2 c3 = floorFragCoord+vec2(0,1);
  vec2 c4 = floorFragCoord+vec2(1,1);


  float r1 = rand(c1*tileSizeDIVres);
  float r2 = rand(c2*tileSizeDIVres);
  float r3 = rand(c3*tileSizeDIVres);
  float r4 = rand(c4*tileSizeDIVres);

  //return mix(r1,r2,smoothstep(0.0,1.0,fract(fragCoord.x)));

  vec2 pct = vec2(fract(fragCoord.x), fract(fragCoord.y));
  //pct = vec2(fract(fragCoord.x), fract(fragCoord.y));

  float r12 = mix(r1,r2,pct.x);
  float r34 = mix(r3,r4,pct.x);

  float value = mix(r12,r34,pct.y);

  return value;
}

float CloudsIntensity(vec2 fragCoord, vec2 displacement){
  fragCoord*= cloudSize;
  fragCoord+= displacement;

  float value = Perlin(fragCoord)*0.4 + Perlin(fragCoord+vec2(100.5,50.5))*0.2 + Perlin(fragCoord+vec2(-253.4561,546.465))*0.1 + Perlin(fragCoord*0.5)*0.3;
  value = 1.0-clamp(pow(value, 1.5),0.0,1.0);
  value += Perlin(fragCoord+vec2(-50,-30))*0.5;


  value = cloudMinIntensity + value*(1.0-cloudMinIntensity);

  return value;
}

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
  bool depthInFront = (depthSample.x <= sunDepthSample.x && depthSample.z >= 0.9);
  //bool bothVertical = (depthSample.z >= 0.9 && sunDepthSample.z >=0.9 && depthSample.x < sunDepthSample.x);

  float cond = float(sunDepthSample.y < depthSample.y-0.01*depthVertical && !depthInFront)/* && (depthSample.z < 1.0)*/;
  //cond = float(1.0-depthSample.x < sunDepthSample.x);

  float occlusion = clamp(cond + depthSample.z*verticalShadowStrength,0.0,1.0);
  //float occlusion = float(depthSample.z != sunDepthSample.z);
  occlusion = 1.0-occlusion;

  /*float highEnough = float(depthSample.y < 0.01);
  occlusion = 1.0 * highEnough + occlusion * (1.0-highEnough);*/

  if(depthSample.y < 0.9){
    occlusion = 1.0;
  }

  float diff = (abs(depthSample.y-sunDepthSample.y)*(1.0-depthVertical));

  float intensity = occlusion*strength;


  vec3 fragmentPos = (vec3(fTexCoords.x, depthSample.y-0.5, depthSample.x)*2.0-1.0)/
    vec3(tileSizeDIVres.x, tileSizeDIVres.y, tileSizeDIVres.y);
  fragmentPos.x+=cam.x*2.0;
  fragmentPos.z+=cam.y*2.0;

  float cloudIntensity = CloudsIntensity(vec2(fragmentPos.x, fragmentPos.z-fragmentPos.y*2.0), -cloudDisplacement);

  intensity *= cloudIntensity;

  gl_FragColor = vec4(intensity,abs(diff),temperature,1.0);


  //gl_FragColor = vec4(fragmentPos.xz, 0.0,1.0);

  /*float aux = float(depth > sunDepth+0.001);
  gl_FragColor = vec4(aux,aux,aux,1.0);*/
  /*float val = sunDepthSample.x*0.5+sunDepthSample.y*0.25;
  gl_FragColor = vec4(val,val,val,1.0);*/



  //gl_FragColor = vec4(depth,depth,depth,1.0);
  //diff*=5.0;
  //gl_FragColor = vec4(diff,diff,diff,1.0);

  //float aux = depth*0.5+sunDepth*0.5;
  //aux = depthSample.x*sunDepthSample.x;
  //aux = max(depth, sunDepth);
  //gl_FragColor = vec4(aux,aux,aux,1.0);
  //gl_FragColor = vec4(expectedSunDepth,expectedSunDepth,expectedSunDepth,1.0);
}
