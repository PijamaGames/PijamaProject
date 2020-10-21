precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoords;

varying vec2 fTexCoords;

uniform vec2 gameRes;
uniform vec2 canvasRes;

void main()
{
  fTexCoords = texCoords;


  float diffX = canvasRes.x-gameRes.x;
  float xStart = diffX*0.5;
  xStart = floor(xStart);
  float xPos = ((vertPosition.x+1.0)*0.5)*gameRes.x+xStart;
  xPos = xPos/canvasRes.x*2.0-1.0;

  float diffY = canvasRes.y-gameRes.y;
  float yStart = diffY;
  yStart = floor(yStart);
  float yPos = ((vertPosition.y+1.0)*0.5)*gameRes.y+yStart;
  yPos = yPos/canvasRes.y*2.0-1.0;

  /*float yPos = vertPosition.y * (gameRes.y/canvasRes.y);
  yPos+=((canvasRes.y-gameRes.y)*0.5)/canvasRes.y*2.0;*/

  /*float xPos = vertPosition.x * (gameRes.x/canvasRes.x);
  float yPos = vertPosition.y * (gameRes.y/canvasRes.y);
  yPos+=((canvasRes.y-gameRes.y)*0.5)/canvasRes.y*2.0;

  xPos = xPos*0.5+0.5;
  xPos = floor(xPos*canvasRes.x+0.5)/canvasRes.x;
  xPos = xPos*2.0-1.0;*/

  /*yPos = yPos*0.5+0.5;
  yPos = floor(yPos*canvasRes.y+0.5)/canvasRes.y;
  yPos = yPos*2.0-1.0;*/

  gl_Position = vec4(xPos, yPos, 0.0, 1.0);
}
