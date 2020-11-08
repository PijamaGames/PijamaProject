prefabFactory.AddPrototype("Master", new Vec2(1, 1), new Vec2(0.5, 0.5), false, ()=>{
  return [
    new MasterController(),
  ]
});
