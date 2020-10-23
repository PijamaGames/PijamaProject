

prefabFactory.AddPrototype("Tree1", new Vec2(3, 3), new Vec2(0.0, 0.0), true, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-1.2), 0.4, false)]),
    new SpriteRenderer('tree1', new Vec2(0, 0),new Vec2(3,3), true, 1, [0], 7, true),
    new ShadowCaster(new Vec2(0,-1.25), 0.7),
  ]
});
