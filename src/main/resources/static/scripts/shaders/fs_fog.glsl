precision mediump float;

uniform sampler2D depthTex;
uniform sampler2D colorTex;

uniform vec4 fogColor;
uniform vec2 fogEdges;
uniform vec2 fogClamp;
uniform float lightInfluence;

varying vec2 fTexCoords;

void main(){
  float height = texture2D(depthTex, fTexCoords).y;
  height = smoothstep(fogEdges.x, fogEdges.y, height);
  float range = fogClamp.y - fogClamp.x;
  height = height*range + fogClamp.x;
  height = clamp(height, 0.0, 1.0);
  vec4 color = texture2D(colorTex, fTexCoords);
  gl_FragColor = mix(color, fogColor, height);
  //gl_FragColor = vec4(height, height, height, 1.0);
}
