precision mediump float;

varying vec2 fTexCoords;

uniform float threshold;
uniform sampler2D colorTex;

void main(){
  vec4 color = texture2D(colorTex, fTexCoords);
  gl_FragColor = vec4(pow(color.x, threshold), pow(color.y, threshold), pow(color.z, threshold), 1.0);
}
