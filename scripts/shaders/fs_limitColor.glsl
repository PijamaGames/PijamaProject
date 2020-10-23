precision mediump float;

varying vec2 fTexCoords;

uniform sampler2D colorTex;
uniform sampler2D lastColorTex;
uniform float colorsPerChannel;
uniform float motionBlur;

void main()
{
  vec4 originalColor = texture2D(colorTex, fTexCoords);
  vec4 lastColor = texture2D(lastColorTex, fTexCoords);

  vec3 finalColor = (originalColor*(1.0-motionBlur)+lastColor*motionBlur).xyz;

  float realColorsPerChannel = colorsPerChannel-1.0;

  vec3 limitedColor = vec3(
    floor(finalColor.x*realColorsPerChannel+0.5)/colorsPerChannel,
    floor(finalColor.y*realColorsPerChannel+0.5)/colorsPerChannel,
    floor(finalColor.z*realColorsPerChannel+0.5)/colorsPerChannel
  );



  gl_FragColor = vec4(limitedColor, originalColor.w);
}
