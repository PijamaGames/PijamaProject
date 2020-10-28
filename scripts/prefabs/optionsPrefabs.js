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
    new TextBox(0.025, 0.07, [0.1,0.1,0.3], "+"),
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
    new TextBox(0.025, 0.07, [0.1,0.1,0.3], "-"),
  ]
});
prefabFactory.AddPrototype("ReturnToMenu", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("mainMenu");
    }),
    new TextBox(0.025, 0.07, [0.1,0.1,0.3], "Menú"),
  ]
});
