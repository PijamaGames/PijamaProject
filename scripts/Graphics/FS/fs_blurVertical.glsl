precision mediump float;

varying vec2 fTexCoords;
uniform sampler2D colorSampler;
uniform sampler2D depthSampler;
uniform float blurSize;
uniform float focus;
uniform float dofEdge0;
uniform float dofEdge1;

void main()
{
  float depth = texture2D(depthSampler, fTexCoords).x;
  float distanceToFocus = abs(focus-depth);
  distanceToFocus = smoothstep(dofEdge0, dofEdge1, distanceToFocus);

  const int samples = 8;
  vec4 color = vec4(0.0,0.0,0.0,1.0);
  float fSamples = float(samples);
  for(int index = 0; index < samples; index++){
    vec2 uv = fTexCoords + vec2(0,(float(index)/(fSamples-1.0)-0.5) * blurSize*distanceToFocus);
    color += texture2D(colorSampler, uv);
  }

  color = color / fSamples;
  gl_FragColor = color;
}
