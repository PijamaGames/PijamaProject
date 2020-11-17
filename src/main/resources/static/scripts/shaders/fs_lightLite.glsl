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

//uniform float colorsPerChannel;

varying vec2 fTexCoords;

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

  vec3 finalLight = vec3(
    lightInfo.x+intensity,
    min(lightInfo.y, intensity),
    mix(lightInfo.z, temperature*intensity, intensity)
  );

  gl_FragColor = vec4(finalLight, 1.0);
}
