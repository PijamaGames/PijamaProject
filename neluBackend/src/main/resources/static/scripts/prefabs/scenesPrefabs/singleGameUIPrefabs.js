prefabFactory.AddPrototype("DialogSystem", new Vec2(), new Vec2(), false, ()=>{
  return [
      new DialogSystem(dialogLevel1XML),
  ];
});

prefabFactory.AddPrototype("PauseFromSingleGame", new Vec2(3,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      manager.LoadScene("pause",true);
      manager.lastGame="singleGame";
      input.HideVirtualInputs(true);
    }),
    new TextBox(null, "Pausa","Pause", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("SingleLifeText", new Vec2(3,1), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox("LifeText", "XHP","XHP", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("SingleTextBox", new Vec2(14,5), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "","", new Vec2(0.8,0.3), false),
  ]
});
prefabFactory.AddPrototype("SingleNameText", new Vec2(4,1), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(null, "","", new Vec2(0.3,0.08), true),
  ]
});
