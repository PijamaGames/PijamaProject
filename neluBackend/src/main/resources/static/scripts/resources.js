
var shaderURLs = [ //name, url
  ['vs_UI', 'scripts/shaders/vs_UI.glsl'],
  ['vs_color', 'scripts/shaders/vs_color.glsl'],
  ['fs_color', 'scripts/shaders/fs_color.glsl'],
  ['vs_collider', 'scripts/shaders/vs_collider.glsl'],
  ['fs_collider', 'scripts/shaders/fs_collider.glsl'],
  ['vs_common', 'scripts/shaders/vs_common.glsl'],
  ['fs_colorFilter', 'scripts/shaders/fs_colorFilter.glsl'],
  ['vs_sunDepth', 'scripts/shaders/vs_sunDepth.glsl'],
  ['fs_depth', 'scripts/shaders/fs_depth.glsl'],
  ['fs_sunLight', 'scripts/shaders/fs_sunLight.glsl'],
  ['fs_lit', 'scripts/shaders/fs_lit.glsl'],
  ['fs_common', 'scripts/shaders/fs_common.glsl'],
  ['vs_depth', 'scripts/shaders/vs_depth.glsl'],
  ['fs_blurX', 'scripts/shaders/fs_blurX.glsl'],
  ['fs_blurY', 'scripts/shaders/fs_blurY.glsl'],
  ['fs_light', 'scripts/shaders/fs_light.glsl'],
  ['fs_lightLite', 'scripts/shaders/fs_lightLite.glsl'],
  ['fs_limitColor', 'scripts/shaders/fs_limitColor.glsl'],
  ['vs_surface', 'scripts/shaders/vs_surface.glsl'],
  ['vs_virtualInput', 'scripts/shaders/vs_virtualInput.glsl'],
  ['fs_virtualInput', 'scripts/shaders/fs_virtualInput.glsl'],
  ['fs_fog', 'scripts/shaders/fs_fog.glsl'],
  ['fs_bloomExtract', 'scripts/shaders/fs_bloomExtract.glsl'],
  ['fs_bloomBlurX', 'scripts/shaders/fs_bloomBlurX.glsl'],
  ['fs_bloomBlurY', 'scripts/shaders/fs_bloomBlurY.glsl'],
  ['fs_applyBloom', 'scripts/shaders/fs_applyBloom.glsl'],
  ['vs_parallax', 'scripts/shaders/vs_parallax.glsl'],
  ['fs_parallax', 'scripts/shaders/fs_parallax.glsl'],
  ['fs_mask', 'scripts/shaders/fs_mask.glsl'],
  ['fs_applyParallax', 'scripts/shaders/fs_applyParallax.glsl'],
  ['fs_UI', 'scripts/shaders/fs_UI.glsl'],
];

var soundsURLs=[
  ["beesSound",'resources/sound/Abejas.mp3'],
  ["hummingbirdSound",'resources/sound/Colibri_volar.mp3'],
  ["comboSound",'resources/sound/Combo_Nelu.mp3'],
  ["healSound",'resources/sound/Curar.mp3'],
  ["dashSound",'resources/sound/Dash.mp3'],
  ["dialogSoundX",'resources/sound/Dialogo.mp3'],
  ["hitsSoundX",'resources/sound/Efecto_golpes.mp3'],
  ["fireSound",'resources/sound/Fuego.mp3'],
  ["throwMissileSound",'resources/sound/Lanzar_Proyectil.mp3'],
  ["monkeyDamageSound",'resources/sound/Monkey_damage.mp3'],
  ["screamingMonkeySound",'resources/sound/Mono_chillando.mp3'],
  ["moveObjectSoundX",'resources/sound/Mover_Objeto.mp3'],
  ["riverSound",'resources/sound/Rio_corriente.mp3'],
  ["breakObjectSound1",'resources/sound/Romper_Objeto_1.mp3'],
  ["breakObjectSound2X",'resources/sound/Romper_Objeto_2.mp3'],
  ["breakObjectSound3",'resources/sound/Romper_Objeto_3.mp3'],
  ["poweupFireSound",'resources/sound/Song_Powerup_Fuego.mp3'],
  ["UISound1X",'resources/sound/UI_1.mp3'],
  ["UISound2X",'resources/sound/UI_2.mp3'],
  ["kinematicSoundX",'resources/sound/musica_cinematica.mp3'],
  ["monkeyHouseSound",'resources/sound/musica_Fortaleza_Monos.mp3'],
  ["menuSoundX",'resources/sound/musica_menu.mp3'],
  ["levelSoundX",'resources/sound/musica_Nivel1.mp3'],
  ["fightSoundX",'resources/sound/musica_Pelea.mp3'],
];

var resources;
class Resources{
  constructor(){
    this.textures = new Map();
    this.shaders = new Map();
    this.sounds = new Map();
  }

  Load(OnLoadFunc = null){
    var that = this;

    //LOAD SHADERS
    this.LoadShaders(0, this,function(){
      //Once shaders are loaded
      Log("Shaders loaded");

      //LOAD TEXTURES
      let allTextures = document.getElementsByClassName('tex');

      for(let t of allTextures){
        that.LoadTexture(t.id);
      }

      gl.bindTexture(gl.TEXTURE_2D, null);
      Log("Textures loaded");

      //LOAD SOUNDS
      for(var sound of soundsURLs){
        that.sounds.set(sound[0],sound[1]);
      }

      //Once textures are loaded
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
