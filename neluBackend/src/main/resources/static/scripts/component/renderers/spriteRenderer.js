class SpriteRenderer extends Renderer{
  constructor(spriteSheetName, tile = new Vec2(), numTiles = new Vec2(1,1), vertical = true, numDirs = 4, dirIndex = null, fps = 12.0, loopBack = false, alpha = 1.0, programs = null){
    if(programs == null){
      programs = ['spriteColor','spriteSunDepth','spriteDepth', 'spriteMask'];
    }
    super(tile, numTiles, vertical, alpha, programs);
    this.spriteSheet = null;
    this.interval = null;
    this.time = 0.0;
    this.loopBack = loopBack;
    this.way = 1;
    this.dir = new Vec2(0,-1);

    //Default directions
    if(!dirIndex){
      dirIndex = [];
      for(var i = 0; i < numDirs; i++)
        dirIndex.push(i);
    }
    this.dirIndex = dirIndex;
    this.numDirs = numDirs;

    this.animations = new Map();
    this.anim = 'default';
    this.AddAnimation('default', spriteSheetName, fps);
    this.SetAnimation('default');
    this.endAnimEvent = new EventDispatcher();
    this.paused = false;
    this.loop = true;
    //this.animationEndEvent = new Event('onAnimationEnd');

    //This line makes every sprite spawn looking down
    this.tile.y = this.dirIndex[Math.trunc(0.75*numDirs)]*numTiles.y;
  }

  AddAnimation(name,textureName, speed, loopAnim = true){
    this.animations.set(name, {
      texture:resources.textures.get(textureName),
      fps:speed,
      loop:loopAnim
    });
  }

  SetAnimation(anim){
    this.anim = anim;
    this.paused = false;
    let a = this.animations.get(anim);
    this.SetTexture(a.texture);
    this.interval = 1.0/a.fps;
    this.loop = a.loop;
    this.maxFrames = new Vec2(Math.round(this.spriteSheet.width/this.numTiles.x / tileSize), Math.round(this.spriteSheet.height/this.numTiles.y / tileSize));
  }

  SetTextureByName(name){
    this.tile.x = 0;
    this.spriteSheet = resources.textures.get(name);
  }

  SetTexture(tex){
    this.tile.x = 0;
    this.spriteSheet = tex;
  }

  Update(){
    if(this.paused) return;
    this.time += manager.delta;

    //if must change frame
    if(this.time > this.interval){
      this.time -= this.interval * Math.trunc(this.time/this.interval);
      this.tile.x = (this.tile.x+this.numTiles.x*this.way);

      //if last frame
      if(this.tile.x/this.numTiles.x >= this.maxFrames.x || this.tile.x < 0){
        this.endAnimEvent.Dispatch();
        if(!this.loop){
          this.paused = true;
          this.tile.x = (this.tile.x-this.numTiles.x*this.way);
        } else {
          //if loopback, invert animation
          if(this.loopBack){
            if(this.way === 1){
              this.tile.x = this.tile.x-this.numTiles.x*2;
            } else {
              this.tile.x = this.numTiles.x*2;
            }
            this.way *= -1;

          //if not loopback, restart animation
          } else {
            this.tile.x = 0;
            this.way = 1;
          }
        }
      }

      if(this.tile.x < 0){
        this.tile.x = 0;
        this.way = 1;
      }
    }
    //this.CheckDirection();
  }

  SetDirection(v){
    v = Vec2.Norm(v);
    if(v.mod > 0.0){
      this.dir = v;
      let quadrant = v.GetQuadrant(this.numDirs, 0.5);
      this.tile.y = this.dirIndex[quadrant]*this.numTiles.y;
    }
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
