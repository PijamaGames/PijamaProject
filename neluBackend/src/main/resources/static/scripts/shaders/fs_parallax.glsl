precision mediump float;

varying vec2 fTexCoords;

uniform sampler2D colorTex;
uniform vec2 cam;
uniform vec2 res;
uniform vec2 tileSizeDIVres;

uniform float height;
uniform vec2 position;
uniform vec2 texSize;
uniform vec2 scale;

uniform float sunTemperature;
uniform float sunShadowStrength;
uniform float sunStrength;
uniform vec4 ambientLight;

void main(){

  const float MAX_HEIGHT = 10.0;

  float aspectTex = texSize.y / texSize.x;

  float aspect = res.y / res.x;


  vec2 coords = fTexCoords;

  coords += (cam*tileSizeDIVres*vec2(1.0,-1.0))*((MAX_HEIGHT-abs(height))/MAX_HEIGHT);

  coords.y = fTexCoords.y;
  coords.x = (coords.x / aspect) * aspectTex + (aspect-1.0)*0.5;


  coords /= scale;
  coords += position;

  //coords -= cam*tileSizeDIVres*0.5 * ((MAX_HEIGHT-abs(height))/MAX_HEIGHT);

  //TEXTURE REPEAT
  float overX = float(coords.x > 1.0);
  float underX = float(coords.x < 0.0);
  coords.x = coords.x + floor((abs(coords.x)+1.0))*underX - floor(coords.x) * overX;
  float overY = float(coords.y > 1.0);
  float underY = float(coords.y < 0.0);
  coords.y = coords.y + floor((abs(coords.y)+1.0))*underY - floor(coords.y) * overY;
  //coords.x = coords.x/aspectTex/* - (aspect-1.0)*0.5*/;


  //LIT COLOR
  const vec4 hotColor = vec4(1.0,0.5,0.0,1.0);
  const vec4 coldColor = vec4(0.0,0.5,1.0,1.0);


  vec4 lightColor = mix(coldColor, hotColor, sunTemperature);
  lightColor = vec4(normalize(lightColor.xyz)*sqrt(3.0),1.0);
  vec4 light = sunStrength*lightColor + ambientLight*(1.0-sunStrength)*sunShadowStrength;
  light.w = 1.0;

  vec4 color = texture2D(colorTex, coords);
  const float mixStrength = 0.1;
  gl_FragColor = mix(color*light, lightColor, mixStrength);
}
