function PF_Tree(){
  return new Gameobj('secondObj', null, manager.scene, [
    new ColliderGroup(),
    new Renderer(['opaque'], new Vec2(0, 130))
  ])
}
