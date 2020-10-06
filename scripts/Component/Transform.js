class Transform extends Component {
  get type() {
    return "Transform";
  }

  constructor() {
    super();
    this.position = new Float32Array(3);
    this.rotation = new Float32Array(3);
    this.scale = new Float32Array([1, 1, 1]);
    this.modelMat = glMatrix.mat4.identity(new Float32Array(16));
    this.iModelMat = glMatrix.mat4.identity(new Float32Array(16));
    this.changed = true;
  }

  GetLocalModelMat(){
    var qRot = new Float32Array(4);
    glMatrix.quat.fromEuler(qRot, this.rx, this.ry, this.rz);
    var localModelMat = glMatrix.mat4.create();
    glMatrix.mat4.fromRotationTranslationScale(localModelMat, qRot, this.position, this.scale);
    glMatrix.mat4.invert(this.iModelMat, this.modelMat);
    return localModelMat;
  }

  /*get right(){
    var v = new Float32Array([1,0,0]);
    glMatrix.vec3.transformMat4(v, v, this.modelMat);
    return v;
  }

  get forward(){
    var v = new Float32Array([0,0,1]);
    glMatrix.vec3.transformMat4(v, v, this.modelMat);
    return v;
  }

  get up(){
    var v = new Float32Array([0,1,0]);
    glMatrix.vec3.transformMat4(v, v, this.modelMat);
    return v;
  }*/

  /*Destroy(){

  }*/

  SetPosition(x, y, z){
    this.position[0] = x;
    this.position[1] = y;
    this.position[2] = z;
    this.changed = true;
  }

  SetRotation(x, y, z){
    this.rotation[0]=x;
    this.rotation[1]=y;
    this.rotation[2]=z;
    this.changed=true;
  }

  SetScale(x, y, z){
    this.scale[0] = x;
    this.scale[1] = y;
    this.scale[2] = z;
    this.changed = true;
  }

  set px(_px) {
    this.position[0]=_px;
    this.changed=true;
  }
  set py(_py) {
    this.position[1]=_py;
    this.changed=true;
  }
  set pz(_pz) {
    this.position[2]=_pz;
    this.changed=true;
  }

  set rx(_rx) {
    this.rotation[0]=_rx;
    this.changed=true;
  }
  set ry(_ry) {
    this.rotation[1]=_ry;
    this.changed=true;
  }
  set rz(_rz) {
    this.rotation[2]=_rz;
    this.changed = true;
  }

  set sx(_sx) {
    this.scale[0]=_sx;
    this.changed = true;
  }
  set sy(_sy) {
    this.scale[1]=_sy;
    this.changed = true;
  }
  set sz(_sz) {
    this.scale[2]=_sz;
    this.changed = true;
  }

  get px() {
    return this.position[0];
  }
  get py() {
    return this.position[1];
  }
  get pz() {
    return this.position[2];
  }

  get rx() {
    return this.rotation[0];
  }
  get ry() {
    return this.rotation[1];
  }
  get rz() {
    return this.rotation[2];
  }

  get sx() {
    return this.scale[0];
  }
  get sy() {
    return this.scale[1];
  }
  get sz() {
    return this.scale[2];
  }
}
