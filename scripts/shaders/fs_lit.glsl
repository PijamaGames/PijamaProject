precision mediump float;

varying vec2 fTexCoords;

//UNIFORMS
uniform sampler2D lightTex;
uniform sampler2D colorTex;
uniform vec4 ambientLight;
uniform float shadowStrength;

void main()
{
  //const vec4 ambientLight = vec4(0.8,0.8,1.0,1.0);
  //const float shadowStrength = 0.9;
  vec4 lightInfo = texture2D(lightTex, fTexCoords);
  const vec4 hotColor = vec4(1.0,0.5,0.0,1.0);
  const vec4 coldColor = vec4(0.0,0.5,1.0,1.0);

  //const float targetIntensity = 3.0;

  vec4 lightColor = mix(coldColor, hotColor, lightInfo.z);
  lightColor = vec4(normalize(lightColor.xyz)*sqrt(3.0),1.0);

  /*float intensity = lightColor.x+lightColor.y+lightColor.z;
  lightColor = vec4((lightColor.xyz/intensity) * targetIntensity, 1.0);
  lightColor = vec4(lightInfo.x * lightColor.xyz, 1.0);*/

  const float lightColorInfluence = 0.45;
  lightColor = mix(vec4(1.0,1.0,1.0,1.0), lightColor, lightColorInfluence);
  vec4 light = lightInfo.x*lightColor + ambientLight*(1.0-lightInfo.x)*shadowStrength;
  light.w = 1.0;
  //vec4 light = vec4(lightInfo.x, lightInfo.x, lightInfo.x, 1.0) + vec4(ambientLight.xyz,1.0) * (1.0-lightInfo.x)*shadowStrength;

  vec4 color = texture2D(colorTex, fTexCoords);
  const float mixStrength = 0.1;
  gl_FragColor = mix(color*light, lightColor, mixStrength);
  //gl_FragColor = mix(color*light,lightColor,0.2);
}
