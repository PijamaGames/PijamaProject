class SpriteRenderer extends Renderer{
  constructor(spriteSheetName, programs = [], tile = new Vec2(), vertical = true, numDirs = 4, dirIndex = null){
    super(programs, tile, vertical);
    this.spriteSheet = resources.textures.get(spriteSheetName);
    this.maxFrames = new Vec2(this.spriteSheet.width / tileSize, this.spriteSheet.height / tileSize);
    this.interval = 1.0/12.0;
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
      this.tile.x = (this.tile.x+1) % this.maxFrames.x;
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
        this.tile.y = this.dirIndex[quadrant];
      }
    /*}*/
  }
}
