class ImageRenderer extends Renderer{
  constructor(tile = new Vec2(), numTiles = new Vec2(1,1), alpha = 1.0){
    super(tile, numTiles, false, alpha, ['UI']);
    this.isUI = true;
    //Object.assign(this,{});
  }

  SetTexture(tex){
    this.texture = resources.textures.get(tex);
    return this;
  }

  CheckInputInside(position){
    position = input.ScreenToCanvas(position);
    //position = input.CanvasToWorld(position);

    position.x = position.x/manager.graphics.res.x;
    position.y = position.y/manager.graphics.res.y;
    position.y = 1.0 - position.y;

    let aspectRatio =manager.graphics.res.x/ manager.graphics.res.y;

    let pos = this.gameobj.transform.GetWorldPos().Copy();
    pos.x /= aspectRatio;

    let center = pos.Copy().Add(this.gameobj.transform.anchor);

    let scale = this.gameobj.transform.scale.Copy();
    scale.x *= tileSize/manager.graphics.res.x;
    scale.y *= tileSize/manager.graphics.res.y;

    let left = center.x - scale.x*0.5;
    let right = center.x + scale.x*0.5;
    let top = center.y + scale.y*0.5;
    let bottom = center.y - scale.y*0.5;

    return position.x < right && position.x > left && position.y < top && position.y > bottom;
  }
}
