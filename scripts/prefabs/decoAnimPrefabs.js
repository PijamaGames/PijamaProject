var PF_Tree1Count = -1;

function PF_Tree1(position = new Vec2(), height = 0.0) {
  PF_Tree1Count += 1;
  return new Gameobj('Tree1', PF_Tree1Count, null, manager.scene, [
    new ColliderGroup([new CircleCollider(new Vec2(0,-1.2), 0.4, false)]),
    new SpriteRenderer('tree1', ['spriteColor','spriteSunDepth','spriteDepth'], new Vec2(0, 0),new Vec2(3,3), true, 1, [0], 7, true),
    //new DebugController(3.0)
    new ShadowCaster(new Vec2(0,-1.25), 0.7),
  ], new Transform(position, height, new Vec2(3, 3), new Vec2(0.0, 0.0)), false);
}
prefabMapper.set('Tree1', PF_Tree1);
