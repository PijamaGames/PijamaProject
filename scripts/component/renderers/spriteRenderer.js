class SpriteRenderer extends Renderer{
  constructor(spriteSheetName, programs = [], tile = new Vec2(), vertical = true, name = null){
    super(programs, tile, vertical, name);
    this.spriteSheet = resources.textures.get(spriteSheetName);
    this.maxFrames = new Vec2(this.spriteSheet.width / tileSize, this.spriteSheet.height / tileSize);
    this.interval = 1.0/12.0;
    this.time = 0.0;
  }

  Update(){
    this.time += manager.delta;
    if(this.time > this.interval){
      this.time -= this.interval * Math.trunc(this.time/this.interval);
      this.tile.x = (this.tile.x+1) % this.maxFrames.x;
    }
  }
}
