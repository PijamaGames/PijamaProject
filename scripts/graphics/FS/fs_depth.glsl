precision mediump float;

varying vec2 fTexCoords;
varying float depth;
uniform sampler2D sampler;

void main()
{
  gl_FragColor = texture2D(sampler, fTexCoords);
  //vec4 texColor = texture2D(sampler, fTexCoords);
  //gl_FragColor= vec4(texColor.xyz, 1.0);
  //float depth = gl_FragCoord.w/* / gl_FragCoord.w*/;
  gl_FragColor = vec4(depth, depth, depth, 1.0);
}
