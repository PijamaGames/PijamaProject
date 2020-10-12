var PF_TreeCount = -1;
var prefabMapper = new Map();

function PF_Tree(position = new Vec2(), height = 0.0) {
  PF_TreeCount += 1;
  return new Gameobj('Tree', PF_TreeCount, null, manager.scene, [
    //new ColliderGroup([new BoxCollider(new Vec2(0.75,0), 0.5, 0.5)]),
    new ColliderGroup([new CircleCollider(new Vec2(1.0,0.2), 0.2)]),
    new Renderer(['opaque'], new Vec2(0, 130), true),
    //new DebugController(5.0)
  ], new Transform(position, height, new Vec2(2, 2), new Vec2(0.0,0.0)), false)
}
prefabMapper.set('Tree', PF_Tree);

var PF_BoxCount = -1;

function PF_Box(position = new Vec2(), height = 0.0) {
  PF_BoxCount += 1;
  return new Gameobj('Box', PF_BoxCount, null, manager.scene, [
    new Rigidbody(0.9, false),
    new Renderer(['opaque'], new Vec2(), true),
    new ColliderGroup([new BoxCollider(new Vec2(1.0,0.3), 2.0, 2.0)]),
    //new DebugController(3.0)
  ], new Transform(position, height, new Vec2(2, 2), new Vec2()), false)
}
prefabMapper.set('Box', PF_Box);

var PF_NeluCount = -1;

function PF_Nelu(position = new Vec2(), height = 0.0) {
  PF_NeluCount += 1;
  return new Gameobj('Nelu', PF_NeluCount, null, manager.scene, [
    new ColliderGroup([new CircleCollider(new Vec2(0,-0.3), 0.2)]),
    new SpriteRenderer('spriteSheet', ['spriteSheet'], new Vec2(0, 2), true, 4, [0,3,1,2]),
    new Rigidbody(),
    //new DebugController(3.0)
  ], new Transform(position, height, new Vec2(1, 1), new Vec2(0.5, 0.5)), false)
}
prefabMapper.set('Nelu', PF_Nelu);
