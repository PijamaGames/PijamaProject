precision mediump float;

varying vec2 fTexCoords;

uniform sampler2D colorTex;
uniform vec4 colorFilter;
uniform float brightness;
uniform float contrast;

void main()
{
  vec4 originalColor = texture2D(colorTex, fTexCoords);
  vec3 color = (originalColor.xyz-0.5)*contrast+0.5;
  gl_FragColor = vec4(color*brightness*colorFilter.xyz, 1.0);
  //gl_FragColor = originalColor;
}
