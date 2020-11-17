precision mediump float;

uniform sampler2D colorTex;
uniform sampler2D bloomTex;
uniform float bloomStrength;

varying vec2 fTexCoords;

void main(){
  vec3 color = texture2D(colorTex, fTexCoords).xyz;
  vec3 bloom = texture2D(bloomTex, fTexCoords).xyz;
  gl_FragColor = vec4(color+bloom*bloomStrength/**float(gl_FragCoord.x > 320.0)*/,1.0);
}
