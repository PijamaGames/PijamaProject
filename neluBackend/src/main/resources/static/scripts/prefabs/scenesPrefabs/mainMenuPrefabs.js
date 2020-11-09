prefabFactory.AddPrototype("MenuTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Menú","Menu", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("SingleGameFromMenu", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene('singleGame');
    }),
    new TextBox(null, "Aventura","Adventure", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("OptionsFromMenu", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene('optionMenu');
      manager.lastScene="mainMenu";
    }),
    new TextBox(null, "Configuración","Options", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("MultiGameFromMenu", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene('lobby');
    }),
    new TextBox(null, "Arena","Lobby", new Vec2(0.3,0.1), true),
  ]
});
