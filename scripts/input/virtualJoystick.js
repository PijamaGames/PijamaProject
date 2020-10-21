class VirtualJoystickContainer{
  constructor(vi){
    this.vi = vi;
    this.scale = Vec2.Scale(vi.scale,0.5);
    this.tint = vi.tint;
    this.anchor=vi.anchor;
  }

  get position(){
    return Vec2.Add(this.vi.position,this.vi.stickPosition);
  }

  get active(){
    return this.vi.active;
  }
  get texture(){
    return this.vi.stickTexture;
  }
}

class VirtualJoystick extends VirtualInput {
  constructor(name, img, position, anchor, scale, ratio, renderRatio, img2) {
    super(name, img, position, anchor, scale, ratio);
    Object.assign(this, {
      renderRatio
    });

    this.isJoystick = true;

    this.stickPosition = new Vec2();
    this.gravity = 9.8;
    this.target = new Vec2();
    this.stickTexture = resources.textures.get(img2);

    let container = new VirtualJoystickContainer(this);
    manager.graphics.programs.get('virtualInput').renderers.set(this.name+"_stick", container);

    var that = this;
    this.AddAction(()=>{
      let v = that.dir.Copy();
      let maxDist = that.ratio-that.renderRatio;
      if(v.mod > maxDist){
        v.Norm().Scale(maxDist);
      }
      that.position = Vec2.Add(that.originalPosition, v);
    }, function(){},
    ()=>{
      //that.dir.Set(0,0);
      that.target.Set(0,0);
      //that.position.Set(0,0);
    });
  }

  UpdateJoystick(){
    if(this.pressed){
      let v =  Vec2.Sub(this.dir, this.position);
      if(v.mod > this.renderRatio){
        v.Norm().Scale(this.renderRatio);
      }
      this.target = v;
    }

    let step = manager.delta * this.gravity;
    this.stickPosition.Set(
      this.stickPosition.x * step + this.target.x * (1.0-step),
      this.stickPosition.y * step + this.target.y * (1.0-step)
    );

  }
}
