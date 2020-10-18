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
  vec4 light = vec4(lightInfo.x, lightInfo.x, lightInfo.x, 1.0) + vec4(ambientLight.xyz,1.0) * (1.0-lightInfo.x)*shadowStrength;
  //vec4 light = mix(vec4(lightInfo.x,lightInfo.x, lightInfo.x,1.0),vec4((ambientLight*shadowStrength).xyz,1.0),1.0-lightInfo.x);
  vec4 color = texture2D(colorTex, fTexCoords);
  gl_FragColor = color*light;
}
