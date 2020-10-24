precision mediump float;

varying vec2 fTexCoords;

uniform sampler2D colorTex;
uniform sampler2D maskTex;
uniform sampler2D parallaxTex;

void main(){
  vec4 color = texture2D(colorTex, fTexCoords);
  vec4 mask = texture2D(maskTex, fTexCoords);
  vec4 parallax = texture2D(parallaxTex, fTexCoords);

  vec4 finalColor = vec4(mix(color.xyz, parallax.xyz, mask.x), 1.0);

  gl_FragColor = finalColor;
}
