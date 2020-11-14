class VideoRenderer extends SpriteRenderer{
  constructor(spriteSheetName, numTiles = new Vec2(1,1), fps = 12.0, loopBack = false, maxFps = 16){
    let name = spriteSheetName;
    super(name+"_0", new Vec2(), numTiles, false, 1, [0], fps, loopBack, 1.0, ['spriteColor','spriteDepth', 'spriteMask']);
    
  }
}
