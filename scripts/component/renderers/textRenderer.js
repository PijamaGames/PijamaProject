class TextRenderer extends Renderer{
  constructor(char, alpha = 1.0, tint = new Float32Array([0,0,0])){
    super(new Vec2(), new Vec2(1,1), false, alpha, ['UI']);
    this.isText = true;
    this.SetTileFromASCII(char);
    this.SetTint(tint[0], tint[1], tint[2]);
  }

  SetTileFromASCII(char){
    const minChar = 33;
    const maxChar = 176;
    const tilesPerRow = 12;
    const tilesPerColumn = 12;

    let code = maxChar;
    if(CharToAscii.has(char)){
      code = CharToAscii.get(char);
    }

    this.tile.x = code % tilesPerRow;
    this.tile.y =tilesPerColumn- (Math.floor(code/tilesPerRow)+1);
    //Log(this.tile.toString(char+": "));
  }
}

var CharToAscii = new Map();
var chorizo = '!"#$%&`()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[ ]^_`abcdefghijklmnopqrstuvwxyz{|}~Çüéâäà0çêëèïîìÄAÉ00ôòûùýÖÜÁÍÓÚ0áíóúñÑªº¿0¬00¡0000 ';
let i = 0;
let firstZero = true;
for(var c of chorizo){
  if(c === '0'){
    if(firstZero){
      firstZero = false;
      CharToAscii.set(c, i);
    }
  } else {
    CharToAscii.set(c, i);
  }

  i++;
}
