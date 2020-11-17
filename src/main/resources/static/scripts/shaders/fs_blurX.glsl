precision mediump float;

varying vec2 fTexCoords;
uniform sampler2D colorTex;
uniform sampler2D depthTex;
uniform float invAspect;
uniform float blurSize;
uniform float extraBlur;
uniform float blurEdge0;
uniform float blurEdge1;
uniform vec4 channels;

void main()
{
  vec4 colorSample = texture2D(colorTex, fTexCoords);
  //float diff = colorSample.y;
  float diff = abs(colorSample.x*channels.x+colorSample.y*channels.y+colorSample.z*channels.z+colorSample.w*channels.w);
  diff = smoothstep(blurEdge0, blurEdge1, diff);
  //diff = 0.0;

  vec4 depthSample = texture2D(depthTex, fTexCoords);
  float depth = depthSample.y;

  const int samples = 16;
  vec4 color = colorSample;
  float fSamples = float(samples);

  float influence = 0.0;
  vec4 lastColor = color;
  for(int index = 0; index < samples; index++){
    vec2 uv = fTexCoords + vec2((float(index)/(fSamples-1.0)-0.5) * (blurSize*diff*invAspect+extraBlur), 0);
    vec4 otherDepth = texture2D(depthTex, uv);
    influence = float(otherDepth.y == depth && depthSample.z == otherDepth.z);
    lastColor = texture2D(colorTex, uv)*influence + colorSample*(1.0-influence);
    color += (lastColor);
  }

  color = color / /*(totalInfluence)*/(fSamples+1.0);
  gl_FragColor = vec4(color.xyz,1.0);
  //gl_FragColor = vec4(color.x,color.x,color.x,1.0);
  //gl_FragColor = testColor;
}
