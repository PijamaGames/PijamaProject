class PF_Tree {
  static count = 0;
  constructor() {}
  static Create() {
    return new Gameobj('secondObj', null, manager.scene, [
      new ColliderGroup(),
      new Renderer(['opaque'], new Vec2(0, 130))
    ])
  }
}
