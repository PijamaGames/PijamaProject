prefabFactory.AddPrototype("uiImageTest", new Vec2(2, 2), new Vec2(1.0,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(2.0, 0.8), new Vec2(2,2)),
  ]
});

prefabFactory.AddPrototype("uiTextChar", new Vec2(1, 1), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextRenderer('O', 1.0),
  ]
});

prefabFactory.AddPrototype("uiTextBox", new Vec2(14,5), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.5),
    new TextBox(0.025, 0.07, [0.1,0.1,0.3]),
  ]
});
