precision mediump float;

//varying vec2 fTexCoords;

//CONST UNIFORMS
//uniform sampler2D colorTex;

//UNIFORMS

//OBJ UNIFORMS
//uniform float radius;
uniform vec4 tint;
uniform float circular;
//uniform vec2 center;

varying vec2 fvertexPosition;

void main()
{
  //vec4 texColor = tint;
  float alpha = float(circular!=1.0 || length(fvertexPosition) <= 1.0);
  vec4 finalTint = vec4(tint.xyz, tint.w * alpha);
  gl_FragColor = finalTint;
  //gl_FragColor = vec4(xPos, xPos, xPos, 1.0);
  //gl_FragColor = vec4(yPos, yPos, yPos, 1.0);
  //gl_FragColor = vec4(1.0-depth, 1.0-depth, 1.0-depth, 1.0);
  //gl_FragColor = vec4(1.0-fdepth, 1.0-fdepth, 1.0-fdepth, 1.0);
  //gl_FragColor = vec4(texColor.xyz*depth, 1.0);
}
