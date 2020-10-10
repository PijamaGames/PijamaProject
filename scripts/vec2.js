class Vec2 {
  constructor(x = 0.0, y = 0.0){
    this.v = new Float32Array([x, y]); //Vector value
  }

  Add(v2){
    this.x += v2.x;
    this.y += v2.y;
  }
  static Add(v1,v2){
    return new Vec2(v1.x+v2.x,v1.y+v2.y);
  }

  Sub(v2){
    this.x -= v2.x;
    this.y -= v2.y;
  }
  static Sub(v1,v2){
    return new Vec2(v1.x-v2.x,v1.y-v2.y);
  }

  Div(v2){
    this.x /= v2.x;
    this.y /= v2.y;
  }
  static Div(v1,v2){
    return new Vec2(v1.x/v2.x,v1.y/v2.y);
  }

  Norm(){
    let mod = this.mod;
    if(mod == 0.0) return;
    this.x /= mod;
    this.y /= mod;
  }

  static Norm(v){
    let mod = v.mod;
    if(mod == 0.0) return;
    return new Vec2(v.x/mod,v.y/mod);
  }

  Mul(v2){
    this.x *= v2.x;
    this.y *= v2.y;
  }
  static Mul(v1,v2){
    return new Vec2(v1.x*v2.x,v1.y*v2.y);
  }

  Scale(s){
    this.x *=s;
    this.y *=s;
  }
  static Scale(v,s){
    return new Vec2(v.x*s, v.y*s);
  }

  static Dot(v1,v2){
    return v1.x*v2.x+v1.y*v2.y;
  }

  static Mod(v){
    return Math.sqrt(v.x*v.x+v.y*v.y);
  }
  get mod(){
    return Vec2.Mod(this);
  }

  RotAround(rad, pos = new Vec2()){
    let sinR = Math.sin(rad);
    let cosR = Math.cos(rad);

    this.Sub(pos);
    let x = this.x;
    this.x = this.x*cosR - this.y*sinR;
    this.y = x*sinR+this.y*cosR;
    this.Add(pos);
  }

  static RotAround(v,rad, pos = new Vec2()){
    let v2 = new Vec2(v.x,v.y);
    v2.RotAround(rad, pos);
    return v2;
  }

  get x(){
    return this.v[0];
  }
  get y(){
    return this.v[1];
  }
  set x(_x){
    this.v[0] = _x;
  }
  set y(_y){
    this.v[1] = _y;
  }
}
