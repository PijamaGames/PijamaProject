var textureNames = [
  'tilesTex',
  'tileMap'
];

var modelURLs = [
  ['testModel','resources/testModel.obj'],
  ['plane', 'resources/plane.obj'],
  ['juan','resources/juan.obj'],
  ['stage','resources/testStage.obj']
];

var shaderURLs = [ //name, url
  ['vs_opaque', 'scripts/shaders/vs_opaque.glsl'],
  ['fs_opaque', 'scripts/shaders/fs_opaque.glsl']
];

var resources;
class Resources{
  constructor(){
    this.textures = new Map();
    this.models = new Map();
    this.shaders = new Map();
  }

  Load(OnLoadFunc = null){
    var that = this;

    //LOAD SHADERS
    this.LoadShaders(0, this,function(){
      //Once shaders are loaded
      Log("Shaders loaded");

      //LOAD TEXTURES
      for(var name of textureNames){
        that.LoadTexture(name);
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
      Log("Textures loaded");

      //Once textures are loaded
      //LOAD MODELS
      //that.LoadModels(0,that,OnLoadFunc);
      Log("All resources loaded");
      OnLoadFunc();
    });
  }

  LoadShaders(/*name, url, */id, that, endCallback){
    if(id===shaderURLs.length){
      endCallback();
    }
    else{
      let name = shaderURLs[id][0];
      let url = shaderURLs[id][1];
      Log("reading shader " + name);
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", url, false);
      rawFile.onreadystatechange=function(){
        if(rawFile.readyState===4){
          if(rawFile.status===200 || rawFile.status==0){
            var allText=rawFile.responseText;
            //alert(allText);
            Log("loaded shader " + name);
            that.shaders.set(name,allText);
          }
        }
        that.LoadShaders(id+1, that, endCallback);
      }
      rawFile.send(null);
    }
  }

  LoadTexture(texId){
    var texRef = document.getElementById(texId);
    if(!texRef) return;

    var tex = gl.createTexture();
    tex.width = texRef.width;
    tex.height = texRef.height;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texImage2D(
      gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,
      gl.UNSIGNED_BYTE,
      texRef
    );
    this.textures.set(texId,tex);
  }
}
