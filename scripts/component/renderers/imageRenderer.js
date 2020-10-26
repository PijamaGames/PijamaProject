class ImageRenderer extends Renderer{
  constructor(tile = new Vec2(), numTiles = new Vec2(1,1), alpha = 1.0){
    super(tile, numTiles, false, alpha, ['UI']);
    //Object.assign(this,{});
  }
}
