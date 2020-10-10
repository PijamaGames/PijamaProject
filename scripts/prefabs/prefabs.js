function PF_Tree(position = new Vec2(), height = 0.0){
  return new Gameobj('secondObj', null, manager.scene, [
    new ColliderGroup(),
    new Renderer(['opaque'], new Vec2(0, 130), true)
  ], new Transform(position, height, new Vec2(2,2), new Vec2(0.5,0.5)))
}
