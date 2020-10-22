var PF_Floor1Count = -1;

function PF_Floor1(position = new Vec2(), height = 0.0, scale = new Vec2(1,1)){
  PF_Floor1Count+=1;
  return new Gameobj('Floor1', PF_GrassCount, null, manager.scene, [
    new Renderer(['color','sunDepth','depth'], new Vec2(0,132), new Vec2(1,1), false)
  ], new Transform(position, height, scale, new Vec2(0,1)), true);
}
prefabMapper.set('Floor1', PF_Floor1);

var PF_Floor2Count = -1;

function PF_Floor2(position = new Vec2(), height = 0.0, scale = new Vec2(1,1)){
  PF_Floor2Count+=1;
  return new Gameobj('Floor2', PF_GrassCount, null, manager.scene, [
    new Renderer(['color','sunDepth','depth'], new Vec2(1,132), new Vec2(1,1), false)
  ], new Transform(position, height, scale, new Vec2(0,1)), true);
}
prefabMapper.set('Floor2', PF_Floor2);

var PF_Floor3Count = -1;

function PF_Floor3(position = new Vec2(), height = 0.0, scale = new Vec2(1,1)){
  PF_Floor3Count+=1;
  return new Gameobj('Floor3', PF_GrassCount, null, manager.scene, [
    new Renderer(['color','sunDepth','depth'], new Vec2(2,132), new Vec2(1,1), false)
  ], new Transform(position, height, scale, new Vec2(0,1)), true);
}
prefabMapper.set('Floor3', PF_Floor3);

var PF_Floor4Count = -1;

function PF_Floor4(position = new Vec2(), height = 0.0, scale = new Vec2(1,1)){
  PF_Floor4Count+=1;
  return new Gameobj('Floor4', PF_GrassCount, null, manager.scene, [
    new Renderer(['color','sunDepth','depth'], new Vec2(3,132), new Vec2(1,1), false)
  ], new Transform(position, height, scale, new Vec2(0,1)), true);
}
prefabMapper.set('Floor4', PF_Floor4);

var PF_Floor5Count = -1;

function PF_Floor5(position = new Vec2(), height = 0.0, scale = new Vec2(1,1)){
  PF_Floor5Count+=1;
  return new Gameobj('Floor5', PF_GrassCount, null, manager.scene, [
    new Renderer(['color','sunDepth','depth'], new Vec2(4,132), new Vec2(1,1), false)
  ], new Transform(position, height, scale, new Vec2(0,1)), true);
}
prefabMapper.set('Floor5', PF_Floor5);

var PF_Floor6Count = -1;

function PF_Floor6(position = new Vec2(), height = 0.0, scale = new Vec2(1,1)){
  PF_Floor6Count+=1;
  return new Gameobj('Floor6', PF_GrassCount, null, manager.scene, [
    new Renderer(['color','sunDepth','depth'], new Vec2(5,132), new Vec2(1,1), false)
  ], new Transform(position, height, scale, new Vec2(0,1)), true);
}
prefabMapper.set('Floor6', PF_Floor6);

var PF_Floor7Count = -1;

function PF_Floor7(position = new Vec2(), height = 0.0, scale = new Vec2(1,1)){
  PF_Floor7Count+=1;
  return new Gameobj('Floor7', PF_GrassCount, null, manager.scene, [
    new Renderer(['color','sunDepth','depth'], new Vec2(6,132), new Vec2(1,1), false)
  ], new Transform(position, height, scale, new Vec2(0,1)), true);
}
prefabMapper.set('Floor7', PF_Floor7);

var PF_Floor8Count = -1;

function PF_Floor8(position = new Vec2(), height = 0.0, scale = new Vec2(1,1)){
  PF_Floor8Count+=1;
  return new Gameobj('Floor8', PF_GrassCount, null, manager.scene, [
    new Renderer(['color','sunDepth','depth'], new Vec2(7,132), new Vec2(1,1), false)
  ], new Transform(position, height, scale, new Vec2(0,1)), true);
}
prefabMapper.set('Floor8', PF_Floor8);
