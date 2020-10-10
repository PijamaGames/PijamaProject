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
    //let v1x = parseFloat(v1.x);
    //let v1y = parseFloat(v1.y);
    //let v2x = parseFloat(v2.x);
    //let v2y = parseFloat(v2.y);
    //return new Vec2(v1x-v1y, v2x - v2y);
    return new Vec2(v1.x-v2.x, v1.y-v2.y);
    /*let x = v1.x-v2.x;
    Log(x);
    let y = v1.y-v2.y;
    Log(x);
    let v = new Vec2(x,y);
    Log(new Vec2(x,y));
    return new Vec2(x,y);*/
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

  toString(name = ''){
    return name+'('+this.x+','+this.y+')';
  }

  /*
  * Returns the projection of a point
  * on a rect defined by two points
  */
  static ProjectOnRect(p, va, vb){
    //Log(p);
    //Log(va.toString('va'));
    //Log(vb.toString('vb'));
    let va_vb = Vec2.Sub(vb,va);
    //Log(va_vb.toString('va_vb'));
    let va_p = Vec2.Sub(p, va);
    //Log(va_p.toString('va_p'));
    va_vb.Norm();
    let d = Vec2.Dot(va_p, va_vb);
    va_vb.Scale(d);
    return Vec2.Add(va, va_vb);
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
