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
    new TextBox(null, "+", new Vec2(0.3,0.1), true),
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
    new TextBox(null, "-", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("GraphicsText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "Calidad", new Vec2(0.3,0.1), true),
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
    new TextBox(null, "Volver", new Vec2(0.3,0.1), true),
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
    new TextBox(null, "+", new Vec2(0.3,0.1), true),
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
    new TextBox(null, "-", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("VolumeText", new Vec2(7,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "Volumen", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("Sound", new Vec2(2,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new AudioSource(["sound","sound2"], "sound")
  ]
});

prefabFactory.AddPrototype("Spanish", new Vec2(5,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.language=0;

    }),
    new TextBox(null, "Español", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("English", new Vec2(5,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.language=1;

    }),
    new TextBox(null, "Inglés", new Vec2(0.3,0.1), true),
  ]
});
prefabFactory.AddPrototype("OptionsTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Configuración", new Vec2(0.3,0.1), true),
  ]
});