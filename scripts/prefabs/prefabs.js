var PF_TreeCount = 0;
function PF_Tree(position = new Vec2(), height = 0.0){
  return new Gameobj('tree'+PF_TreeCount++, null, manager.scene, [
    new ColliderGroup(),
    new Renderer(['opaque'], new Vec2(20, 9/*130*/), true)
  ], new Transform(position, height, new Vec2(4,7), new Vec2(0.5,0.5)))
}

PF_BoxCount = 0;
function PF_Box(position = new Vec2(), height = 0.0){
  return new Gameobj('box'+PF_BoxCount++, null, manager.scene, [
    new Renderer(['opaque'], new Vec2(), true),
    new DebugController(3.0)
  ], new Transform(position, height, new Vec2(2,2), new Vec2(0.5, 0.5)))
}
