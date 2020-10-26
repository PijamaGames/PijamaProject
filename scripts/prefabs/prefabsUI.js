prefabFactory.AddPrototype("uiImageTest", new Vec2(2, 2), new Vec2(1.0,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(2.0, 0.8), new Vec2(2,2)),
  ]
});

prefabFactory.AddPrototype("uiTextTest", new Vec2(1, 1), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextRenderer('A'),
  ]
});
