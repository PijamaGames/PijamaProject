prefabFactory.AddPrototype("MenuTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox(null, "Menú","Menu", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("SingleGameFromMenu", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,2), new Vec2(8,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
        obj.gameobj.renderer.MultiplyTint(0.8);
      }).SetHoverOutFunc((obj)=>{
        let tint=obj.gameobj.renderer.realTint;
        obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene('singleGame');
      input.HideVirtualInputs(false);
    }),
    new TextBox(null, "Aventura","Adventure", new Vec2(0.3,0.1), false),
  ]
});

prefabFactory.AddPrototype("OptionsFromMenu", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,4), new Vec2(8,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene('optionMenu');
      manager.lastScene="mainMenu";
    }),
    new TextBox(null, "Configuración","Options", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("MultiGameFromMenu", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,0), new Vec2(8,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene('lobby');
    }),
    new TextBox(null, "Arena","Lobby", new Vec2(0.3,0.1), false),
  ]
});
