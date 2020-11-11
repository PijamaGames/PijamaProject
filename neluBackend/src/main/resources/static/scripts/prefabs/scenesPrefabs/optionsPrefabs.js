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
    }),
    new TextBox(null, "+","+", new Vec2(0.3,0.1), true),
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
    }),
    new TextBox(null, "-","-", new Vec2(0.3,0.1), true),
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

    }),
    new TextBox("ReturnButtonOptions", "Volver","Return", new Vec2(0.3,0.1), true),
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
      manager.musicVolume+=0.2;
      manager.musicVolume=parseFloat(manager.musicVolume.toFixed(1));
      if(manager.musicVolume > 1.0){
        manager.musicVolume = 1.0;
      }
      ChangeVolumeText();
    }),
    new TextBox(null, "+","+", new Vec2(0.3,0.1), true),
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
      manager.musicVolume-=0.2;
      manager.musicVolume=parseFloat(manager.musicVolume.toFixed(1));
      if(manager.musicVolume < 0){
        manager.musicVolume=0;
      }
      ChangeVolumeText();
    }),
    new TextBox(null, "-","-", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("VolumeText", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,4), new Vec2(8,2)),
    new TextBox("VolumeTextOptions", "Volumen: "+manager.musicVolume,"Volume: "+ manager.musicVolume, new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("Sound", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new AudioSource(["sound","sound2"], "sound")
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

    }),
    new TextBox("Language", "Español","Spanish", new Vec2(0.3,0.1), true),
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
    }),
    new TextBox("Dificulty", "Fácil","Easy", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("OptionsTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox("TitleTextOptions", "Configuración","Options", new Vec2(0.3,0.1), true),
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
  if(manager.english) text.innerHTML="Volume: "+manager.musicVolume;
  else text.innerHTML="Volumen: "+manager.musicVolume;
}
function ChangeQualityText(config){
  switch(config){
    case 0: QualityMessage("minimum","mínima");
    break;
    case 1: QualityMessage("low","baja");
    break;
    case 2: QualityMessage("medium","mediana");
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
