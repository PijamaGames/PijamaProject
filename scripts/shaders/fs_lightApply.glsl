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
  vec4 light = texture2D(lightTex, fTexCoords);
  light = mix(light, ambientLight*shadowStrength, 1.0-light.x);
  vec4 color = texture2D(colorTex, fTexCoords);
  gl_FragColor = color*light;
}
