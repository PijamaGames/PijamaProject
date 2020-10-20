precision mediump float;

varying vec2 fTexCoords;

uniform sampler2D colorTex;
uniform float colorsPerChannel;

void main()
{
  vec4 originalColor = texture2D(colorTex, fTexCoords);
  float realColorsPerChannel = colorsPerChannel-1.0;

  vec3 limitedColor = vec3(
    floor(originalColor.x*realColorsPerChannel+0.5)/realColorsPerChannel,
    floor(originalColor.y*realColorsPerChannel+0.5)/realColorsPerChannel,
    floor(originalColor.z*realColorsPerChannel+0.5)/realColorsPerChannel
  );

  gl_FragColor = vec4(limitedColor, originalColor.w);
}
