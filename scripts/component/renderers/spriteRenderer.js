class SpriteRenderer extends Renderer{
  constructor(spriteSheetName, tile = new Vec2(), numTiles = new Vec2(1,1), vertical = true, numDirs = 4, dirIndex = null, fps = 12.0, loopBack = false, alpha = 1.0, programs = null){
    if(programs == null){
      programs = ['spriteColor','spriteSunDepth','spriteDepth'];
    }
    super(tile, numTiles, vertical, alpha, programs);
    this.spriteSheet = resources.textures.get(spriteSheetName);
    this.maxFrames = new Vec2(Math.round(this.spriteSheet.width/this.numTiles.x / tileSize), Math.round(this.spriteSheet.height/this.numTiles.y / tileSize));
    this.interval = 1.0/fps;
    this.time = 0.0;

    this.loopBack = loopBack;
    this.way = 1;

    //Default directions
    if(!dirIndex){
      dirIndex = [];
      for(var i = 0; i < numDirs; i++)
        dirIndex.push(i);
    }
    this.dirIndex = dirIndex;
    this.numDirs = numDirs;

    //This line makes every sprite spawn looking down
    this.tile.y = this.dirIndex[Math.trunc(0.75*numDirs)]*numTiles.y;
  }

  SetTextureByName(name){
    this.spriteSheet = resources.textures.get(name);
  }

  SetTexture(tex){
    this.spriteSheet = tex;
  }

  Update(){
    this.time += manager.delta;
    if(this.time > this.interval){
      this.time -= this.interval * Math.trunc(this.time/this.interval);
      this.tile.x = (this.tile.x+this.numTiles.x*this.way);
      if(this.tile.x/this.numTiles.x >= this.maxFrames.x || this.tile.x < 0){
        if(this.loopBack){
          if(this.way === 1){
            this.tile.x = this.tile.x-this.numTiles.x*2;
          } else {
            this.tile.x = this.numTiles.x*2;
          }
          this.way *= -1;
        } else {
          this.tile.x = 0;
          this.way = 1;
        }
      }
      if(this.tile.x < 0){
        this.tile.x = 0;
        this.way = 1;
      }
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
