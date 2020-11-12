class Vec2 {
  constructor(x = 0.0, y = 0.0){
    this.v = new Float32Array([x, y]); //Vector value
  }

  Copy(){
    return new Vec2(this.x, this.y);
  }

  Opposite(){
    return new Vec2(-this.x, -this.y);
  }

  Round(){
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  static Round(v){
    return v.Copy().Round();
  }

  Floor(){
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  static Floor(v){
    return v.Copy().Floor();
  }

  Ceil(){
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  static Ceil(v){
    return v.Copy().Ceil();
  }

  Equals(v2){
    return this.x === v2.x && this.y === v2.y;
  }

  Set(x, y){
    this.x = x;
    this.y = y;
    return this;
  }

  Add(v2){
    this.x += v2.x;
    this.y += v2.y;
    return this;
  }

  AddScalar(s){
    this.x+=s;
    this.y+=s;
    return this;
  }
  static Add(v1,v2){
    return new Vec2(v1.x+v2.x,v1.y+v2.y);
  }
  static AddScalar(v,s){
    return v.Copy().AddScalar(s);
  }

  Sub(v2){
    this.x -= v2.x;
    this.y -= v2.y;
    return this;
  }
  static Sub(v1,v2){
    return new Vec2(v1.x-v2.x, v1.y-v2.y);
  }

  Div(v2){
    this.x /= v2.x;
    this.y /= v2.y;
    return this;
  }
  DivScalar(s){
    this.x/=s;
    this.y/=s;
    return this;
  }
  static Div(v1,v2){
    return new Vec2(v1.x/v2.x,v1.y/v2.y);
  }
  static DivScalar(v,s){
    return new Vec2(v.x/s, v.y/s);
  }

  Norm(){
    let mod = this.mod;
    if(mod == 0.0){
      this.Set(0,0);
    } else {
      this.x /= mod;
      this.y /= mod;
    }
    return this;
  }

  static Norm(v){
    let mod = v.mod;
    if(mod == 0.0) return new Vec2();
    return new Vec2(v.x/mod,v.y/mod);
  }

  Mul(v2){
    this.x *= v2.x;
    this.y *= v2.y;
    return this;
  }
  static Mul(v1,v2){
    return new Vec2(v1.x*v2.x,v1.y*v2.y);
  }

  Scale(s){
    this.x *=s;
    this.y *=s;
    return this;
  }
  static Scale(v,s){
    return new Vec2(v.x*s, v.y*s);
  }

  Pow(p){
    this.x = Math.pow(this.x, p);
    this.y = Math.pow(this.y, p);
    return this;
  }

  static Pow(v, p){
    return new Vec2(v.x, v.y).Pow(p);
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
  static Distance(v1,v2){
    return Vec2.Sub(v2,v1).mod;
  }

  RotAround(rad, pos = new Vec2()){
    let sinR = Math.sin(rad);
    let cosR = Math.cos(rad);

    this.Sub(pos);
    let x = this.x;
    this.x = this.x*cosR - this.y*sinR;
    this.y = x*sinR+this.y*cosR;
    this.Add(pos);
    return this;
  }

  static RotAround(v,rad, pos = new Vec2()){
    let v2 = new Vec2(v.x,v.y);
    v2.RotAround(rad, pos);
    return v2;
  }

  static Angle(v1,v2 = new Vec2(1,0)){
    let mod1 = v1.mod;
    let mod2 = v2.mod;
    if(mod1 === 0.0 || mod2 === 0.0) return 0.0;
    let cos = Vec2.Dot(v1,v2) / (mod1 * mod2);
    let angle = Math.acos(cos);
    return angle;
  }

  Angle(v2 = new Vec2(1,0)){
    return Vec2.Angle(this, v2);
  }

  GetQuadrant(numQuadrants = 4.0, displacement = 0.5){
    displacement = (1.0/numQuadrants)*displacement;
    let angle = this.Angle();
    let lap = 2.0*Math.PI;
    if(this.y < 0.0) angle = lap - angle;
    angle = angle/lap;
    angle += displacement;
    if(angle < 0.0){
      angle+=Math.trunc(-angle);
    }
    return Math.trunc(angle * numQuadrants)%numQuadrants;
  }

  toString(name = ''){
    return name+'('+this.x+','+this.y+')';
  }

  /*
  * Returns the projection of a point
  * on a rect defined by two points
  */
  static ProjectOnRect(p, va, vb, isSegment = false){
    let va_vb = Vec2.Sub(vb,va);
    let va_p = Vec2.Sub(p, va);
    let dist = va_vb.mod;
    va_vb.Norm();
    let d = Vec2.Dot(va_p, va_vb);

    if(isSegment){
      if(d < 0.0) d = 0.0;
      if(d > dist) d = dist;
    }

    va_vb.Scale(d);
    let projPoint=Vec2.Add(va, va_vb);
    return new Vec2(projPoint.x, projPoint.y);
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
