var canvas = document.getElementById('game_surface');
var gl;
class Graphics{
  constructor(){
    this.InitContext();

  }

  InitContext(){
    gl = canvas.getContext('webgl');
    if (!gl) {
      Log('WebGL not supported, falling back to experimental WebGL');
      gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) alert('Your browser does not support WebGL');

    //canvas.width = window.innerWidth* window.devicePixelRatio;
    //canvas.height = window.innerHeight* window.devicePixelRatio;
    gl.viewport(0,0,canvas.width,canvas.height);

    gl.clearColor(0.3, 0.7, 1.0, 1.0); //Blue by default
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    //gl.frontFace(gl.CCW);
    //gl.cullFace(gl.BACK);
    Log('Graphic context initiated');
  }
}
