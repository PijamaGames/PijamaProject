class SpriteRenderer extends Renderer{
  constructor(spriteSheetName, programs = [], tile = new Vec2(), numTiles = new Vec2(1,1), vertical = true, numDirs = 4, dirIndex = null, fps = 12.0){
    super(programs, tile, numTiles, vertical);
    this.spriteSheet = resources.textures.get(spriteSheetName);
    this.maxFrames = new Vec2(this.spriteSheet.width/this.numTiles.x / tileSize, this.spriteSheet.height/this.numTiles.y / tileSize);
    this.interval = 1.0/fps;
    this.time = 0.0;

    //Default directions
    if(!dirIndex){
      dirIndex = [];
      for(var i = 0; i < numDirs; i++)
        dirIndex.push(i);
    }
    this.dirIndex = dirIndex;
    this.numDirs = numDirs;
  }

  Update(){
    this.time += manager.delta;
    if(this.time > this.interval){
      this.time -= this.interval * Math.trunc(this.time/this.interval);
      this.tile.x = (this.tile.x+this.numTiles.x) % this.maxFrames.x;
    }
    this.CheckDirection();
  }

  CheckDirection(){
    let x = input.GetKeyPressed('KeyA') * -1.0 + input.GetKeyPressed('KeyD');
    let y = input.GetKeyPressed('KeyS') * -1.0 + input.GetKeyPressed('KeyW');
    let v = new Vec2(x,y);
    v.Norm();

    //let rb = this.gameobj.rigidbody;
    /*if(rb){*/
      if(v.mod > 0.0){
        let quadrant = v.GetQuadrant(this.numDirs, 0.5);
        this.tile.y = this.dirIndex[quadrant]*this.numTiles.y;
      }
    /*}*/
  }
}
