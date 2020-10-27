

prefabFactory.AddPrototype("Tree1", new Vec2(3, 3), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0,-1.2), 0.4, false)]),
    new SpriteRenderer('tree1', new Vec2(0, 0),new Vec2(3,3), true, 1, [0], 7, true),
    new ShadowCaster(new Vec2(0,-1.25), 0.7),
  ]
});

prefabFactory.AddPrototype("Tree2", new Vec2(6,6), new Vec2(0.0, 0.0), false, ()=>{
  return [
    new ColliderGroup([new CircleCollider(new Vec2(0.1,-2.6), 0.4, false)]),
    new SpriteRenderer('tree2', new Vec2(0, 0),new Vec2(6,6), true, 1, [0], 8, true),
    new ShadowCaster(new Vec2(0,-2.6), 0.8),
  ]
});
