prefabFactory.AddPrototype("MoreGraphics", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      let config = manager.graphics.currentConfig+1;
      if(config > manager.graphics.maxConfig){
        config = manager.graphics.maxConfig;
      }
      manager.graphics.SetSettingsByNumber(config);
    }),
    new TextBox(null, "+","+", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("LessGraphics", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      let config= manager.graphics.currentConfig-1;
      if(config < 0){
        config=0;
      }
      manager.graphics.SetSettingsByNumber(config);
    }),
    new TextBox(null, "-","-", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("GraphicsText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox("QualityTextOptions", "Calidad", "Quality", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("MenuFromOptions", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene(manager.lastScene);
    }),
    new TextBox("ReturnButtonOptions", "Volver","Return", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("MoreVolume", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.musicVolume+=0.2;
      if(manager.musicVolume > 1.0){
        manager.musicVolume = 1.0;
      }
    }),
    new TextBox(null, "+","+", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("LessVolume", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.musicVolume-=0.2;
      if(manager.musicVolume < 0){
        manager.musicVolume=0;
      }
    }),
    new TextBox(null, "-","-", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("VolumeText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox("VolumeTextOptions", "Volumen","Volume", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("Sound", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new AudioSource(["sound","sound2"], "sound")
  ]
});

prefabFactory.AddPrototype("LanguageText", new Vec2(5,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.SetEnglish(!manager.english);
      if(manager.easy) ChangeLanguage("Dificulty","Easy","Fácil");
      else ChangeLanguage("Dificulty","Hard","Difícil");
    }),
    new TextBox("Language", "Español","Spanish", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("DificultyText", new Vec2(5,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
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
