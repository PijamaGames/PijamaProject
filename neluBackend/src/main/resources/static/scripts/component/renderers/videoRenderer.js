class VideoRenderer extends SpriteRenderer{
  constructor(spriteSheetName, numTiles = new Vec2(1,1), fps = 12.0, loopBack = false, maxFps = 16){
    let name = spriteSheetName;
    super(name+"_0", new Vec2(), numTiles, false, 1, [0], fps, loopBack, 1.0, ['spriteColor','spriteDepth', 'spriteMask']);
    this.interval = 1.0/this.fps;
    this.videoName = name;
    this.time = 0.0;
    this.frame = 0;
  }

  Update(){
    Log("updating cutscene");
    this.time += manager.delta;
    if(this.time > this.interval){
      this.time -= this.interval*(Math.floor(this.time/this.interval));
      this.frame++;
      if(this.frame >= this.maxFrames){
        this.frame = 0;
      }
      Log(this.frame);
      this.texture = resources.textures.get(this.videoName+"_"+this.frame);
    }
  }
}
