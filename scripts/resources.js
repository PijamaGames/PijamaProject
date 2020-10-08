var textureNames = [
  'boxTex',
  'juanTex',
  'grassTex'
];

var modelURLs = [
  ['testModel','resources/testModel.obj'],
  ['plane', 'resources/plane.obj'],
  ['juan','resources/juan.obj'],
  ['stage','resources/testStage.obj']
];

var shaderURLs = [ //name, url
  ['vs_default', 'scripts/Graphics/VS/vs_default.glsl'],
  ['fs_opaque', 'scripts/Graphics/FS/fs_opaque.glsl'],
  ['vs_postProcess', 'scripts/Graphics/VS/vs_postProcess.glsl'],
  ['fs_blurHorizontal', 'scripts/Graphics/FS/fs_blurHorizontal.glsl'],
  ['fs_blurVertical', 'scripts/Graphics/FS/fs_blurVertical.glsl'],
  ['vs_depth', 'scripts/Graphics/VS/vs_depth.glsl'],
  ['fs_depth', 'scripts/Graphics/FS/fs_depth.glsl']
];

class Resources{
  constructor(){
    this.textures = new Map();
    this.models = new Map();
    this.shaders = new Map();
  }

  Load(OnLoadFunc = null){
    let gl = Graphics.gl;
    var that = this;
    //LOAD SHADERS
    this.LoadShaders(0, this,function(){
      //Once shaders are loaded

      //LOAD TEXTURES
      for(var name of textureNames){
        that.LoadTexture(name, gl);
      }
      gl.bindTexture(gl.TEXTURE_2D, null);

      //Once textures are loaded
      //LOAD MODELS
      that.LoadModels(0,that,OnLoadFunc);
    });
  }

  LoadModels(id, that, endCallback){
    if(id===modelURLs.length){
      endCallback();
    }
    else{
      let name = modelURLs[id][0];
      let url = modelURLs[id][1];

      /*var reader=new FileReader();
      reader.onload=function (evt){
        alert(evt.target.result);
        that.models[name]=evt.target.result;
        that.LoadModels(id+1, that, endCallback);
      }
      reader.readAsText(url);*/
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", url, false);
      rawFile.onreadystatechange=function(){
        if(rawFile.readyState===4){
          if(rawFile.status===200 || rawFile.status==0){
            var allText=rawFile.responseText;
            //alert(allText);
            that.models.set(name, new Model(name, allText));
          }
        }
        that.LoadModels(id+1, that, endCallback);
      }
      rawFile.send(null);
    }
  }

  LoadShaders(/*name, url, */id, that, endCallback){
    if(id===shaderURLs.length){
      endCallback();
    }
    else{
      let name = shaderURLs[id][0];
      let url = shaderURLs[id][1];
      console.log("reading shader " + name);
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", url, false);
      rawFile.onreadystatechange=function(){
        if(rawFile.readyState===4){
          if(rawFile.status===200 || rawFile.status==0){
            var allText=rawFile.responseText;
            //alert(allText);
            console.log("loaded shader " + name);
            that.shaders.set(name,allText);
          }
        }
        that.LoadShaders(id+1, that, endCallback);
      }
      rawFile.send(null);
    }
  }

  LoadTexture(texId, gl){
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texImage2D(
      gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,
      gl.UNSIGNED_BYTE,
      document.getElementById(texId)
    );
    this.textures.set(texId,tex);
  }
}
