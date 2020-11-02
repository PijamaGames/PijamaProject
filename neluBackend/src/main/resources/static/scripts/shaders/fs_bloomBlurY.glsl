precision mediump float;

varying vec2 fTexCoords;
uniform sampler2D colorTex;

uniform float blurSize;

void main()
{
  vec4 colorSample = texture2D(colorTex, fTexCoords);

  const int samples = 16;
  vec4 color = colorSample;
  float fSamples = float(samples);

  for(int index = 0; index < samples; index++){
    vec2 uv = fTexCoords + vec2(0,(float(index)/(fSamples-1.0)-0.5) * blurSize);
    color += texture2D(colorTex, uv);
  }

  color = color / /*(totalInfluence)*/(fSamples+1.0);
  gl_FragColor = vec4(color.xyz,1.0);
}
