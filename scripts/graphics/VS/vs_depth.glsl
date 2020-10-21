precision mediump float;

attribute vec3 vertPosition;
attribute vec2 texCoords;
varying vec2 fTexCoords;
varying float depth;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform float far;

void main()
{
 fTexCoords = texCoords;
 vec4 viewSpace = mView * mWorld * vec4(vertPosition ,1.0);
 depth = -viewSpace.z/far;
 gl_Position = mProj * viewSpace;
}
