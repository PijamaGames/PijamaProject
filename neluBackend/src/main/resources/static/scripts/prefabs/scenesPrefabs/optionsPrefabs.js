prefabFactory.AddPrototype("MoreGraphics", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(11,10), new Vec2(2,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      let config = manager.graphics.currentConfig+1;
      if(config > manager.graphics.maxConfig){
        config = manager.graphics.maxConfig;
      }
      manager.graphics.SetSettingsByNumber(config);
      ChangeQualityText(config);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "+","+", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("LessGraphics", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(11,10), new Vec2(2,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      let config= manager.graphics.currentConfig-1;
      if(config < 0){
        config=0;
      }
      manager.graphics.SetSettingsByNumber(config);
      ChangeQualityText(config);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "-","-", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("GraphicsText", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,4), new Vec2(8,2)),
    new TextBox("QualityTextOptions", "Calidad: máxima", "Quality: maximum", new Vec2(0.5,0.1), true),
  ]
});
prefabFactory.AddPrototype("MenuFromOptions", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene(manager.lastScene);

    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox("ReturnButtonOptions", "Volver","Return", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("MoreVolume", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(11,10), new Vec2(2,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      let vol=manager.maxVolume+0.2;
      vol=parseFloat(vol.toFixed(1));
      if(vol > 1.0){
        vol = 1.0;
      }
      manager.SetVolume(vol);
      ChangeVolumeText();
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "+","+", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("LessVolume", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(11,10), new Vec2(2,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      let vol=manager.maxVolume-0.2;
      vol=parseFloat(vol.toFixed(1));
      if(vol < 0){
        vol=0;
      }
      manager.SetVolume(vol);
      ChangeVolumeText();
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "-","-", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("VolumeText", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,4), new Vec2(8,2)),
    new TextBox("VolumeTextOptions", "Volumen: "+(manager.maxVolume*100)+"%","Volume: "+(manager.maxVolume*100)+"%", new Vec2(0.3,0.07), true),
  ]
});

prefabFactory.AddPrototype("LanguageText", new Vec2(4,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{

      manager.SetEnglish(!manager.english);
      if(manager.easy) ChangeLanguage("Dificulty","Easy","Fácil");
      else ChangeLanguage("Dificulty","Hard","Difícil");
      ChangeQualityText(manager.graphics.currentConfig);
      ChangeVolumeText();

    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox("Language", "Inglés","Spanish", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("DificultyText", new Vec2(4,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      ChangeDificulty();
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox("Dificulty", "Fácil","Easy", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("OptionsTitle", new Vec2(14,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,21), new Vec2(14,2)),
    new TextBox("TitleTextOptions", "Configuración","Options", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

function ChangeDificulty(){
  let text=document.getElementById("Dificulty");
  manager.easy=!manager.easy;
  if(manager.easy) text.innerHTML=manager.english? "Easy": "Fácil";
  else text.innerHTML=manager.english? "Hard": "Difícil";
}
function ChangeLanguage(id,textEn,textSp){
  let text=document.getElementById(id);
  text.innerHTML=manager.english? textEn: textSp;
}
function ChangeVolumeText(){
  var text=document.getElementById("VolumeTextOptions");
  if(manager.english) text.innerHTML="Volume: "+(manager.maxVolume*100)+"%";
  else text.innerHTML="Volumen: "+(manager.maxVolume*100)+"%";
}
function ChangeQualityText(config){
  switch(config){
    case 0: QualityMessage("minimum","mínima");
    break;
    case 1: QualityMessage("low","baja");
    break;
    case 2: QualityMessage("medium","media");
    break;
    case 3: QualityMessage("high","alta");
    break;
    case 4: QualityMessage("maximum","máxima");
    break;
  }
}
function QualityMessage(msgEn,msgSp){
  var text=document.getElementById("QualityTextOptions");
  if(manager.english) text.innerHTML="Quality: "+msgEn;
  else text.innerHTML="Calidad: "+msgSp;
}
