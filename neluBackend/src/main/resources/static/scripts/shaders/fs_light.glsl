precision mediump float;


uniform sampler2D depthTex;
uniform sampler2D lightTex;

uniform vec2 tileSizeDIVres;
uniform vec2 res;

uniform float ratio;
uniform float temperature;
uniform float strength;
uniform vec2 center;
uniform vec2 cam;
uniform float height;
uniform float edge0;
uniform float edge1;

#define MAX_CASTERS 10
uniform float casters[4*MAX_CASTERS];

//uniform float colorsPerChannel;

varying vec2 fTexCoords;

vec2 ProcessCasters(vec3 lightPos, vec3 fragmentPos, float vertical){

  vec3 casterPos;
  float casterRatio;

  float intensity = 1.0;
  float minDiff = 1.0;

  vec3 lightToFragment = fragmentPos-lightPos;
  vec3 lightToFragmentNorm = normalize(lightToFragment);
  float lightToFragmentDist = length(lightToFragment);
  vec3 lightToCaster;
  vec3 lightToCasterNorm;
  float lightToCasterDist;

  float casterToFragmentDist;

  float dotValue;

  float casterDotValue;
  vec3 crossProd;
  float diff;

  const float shadowDiffusion = 5.0;

  for(int i = 0; i < MAX_CASTERS; i++){
    casterPos = vec3(casters[i*4]*2.0, casters[i*4+2], casters[i*4+1]*2.0);
    casterRatio = casters[i*4+3];

    lightToCaster = casterPos-lightPos;
    lightToCasterNorm = normalize(lightToCaster);
    lightToCasterDist = length(lightToCaster);
    dotValue = dot(lightToFragmentNorm, lightToCasterNorm);

    casterToFragmentDist = length(fragmentPos-casterPos);



    crossProd = cross(-lightToCaster, vec3(0,1,0));
    crossProd = normalize(crossProd)*casterRatio;
    casterDotValue = dot(lightToCasterNorm, normalize((casterPos+crossProd)-lightPos));

    //casterDotValue = (hypotenuse*lightToCasterDist*cosAlpha)/(lightToCasterDist*lightToFragmentDist);

    float diff = length(casterToFragmentDist)/shadowDiffusion;

    minDiff = min(minDiff, diff);

    float behind = float(dotValue > casterDotValue && (lightToCasterDist < lightToFragmentDist || casterToFragmentDist <= casterRatio));
    intensity = intensity * (1.0-behind);
  }

  intensity = intensity *(1.0-vertical) + 1.0*vertical;

  const float minIntensity = 0.3;
  return vec2(intensity*(1.0-minIntensity)+minIntensity, minDiff);
}

void main()
{
  vec4 depthSample = texture2D(depthTex, fTexCoords);

  vec3 lightPos = vec3(center.x*2.0, height, center.y*2.0);
  vec3 fragmentPos = (vec3(fTexCoords.x, depthSample.y-0.5, depthSample.x)*2.0-1.0)/vec3(tileSizeDIVres.x, tileSizeDIVres.y, tileSizeDIVres.y);
  fragmentPos.x+=cam.x*2.0;
  fragmentPos.z+=cam.y*2.0;

  float dist = distance(lightPos, fragmentPos);
  vec4 lightInfo = texture2D(lightTex, fTexCoords);

  float intensity = clamp(dist/ratio, 0.0,1.0);
  intensity = smoothstep(edge0,edge1,intensity);
  intensity = 1.0 - intensity;
  intensity *= strength;

  vec2 intensityDiff = ProcessCasters(lightPos, fragmentPos, depthSample.z);
  intensity *= intensityDiff.x;

  vec3 finalLight = vec3(
    lightInfo.x+intensity,
    min(lightInfo.y, intensityDiff.y),
    mix(lightInfo.z, temperature*intensity, intensity)
  );

  gl_FragColor = vec4(finalLight, 1.0);
}
