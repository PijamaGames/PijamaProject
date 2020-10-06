class Camera extends Component {
  get type(){
    return 'Camera';
  }

  constructor(_near, _far, _fov) {
    super();
    this.projMat = new Float32Array(16);
    this.near = _near;
    this.fov = _fov;
    this.far = _far;
    this.fogColorX = 0.6;
    this.fogColorY = 0.8;
    this.fogColorZ = 1.0;
    this.fogEdges = [0.3,0.95];
    this.blurSize = 0.04;
    this.focus = 0.5;
    this.dofEdge0 = 0.1;
    this.dofEdge1 = 0.25;
    this.viewMat = glMatrix.mat4.create();
    glMatrix.mat4.identity(this.viewMat);
    this.UpdateProjection();
  }

  Update(){
    this.UpdateProjection();
    this.UpdateView();
  }

  UpdateView(){
    if (this.gameObject.transform) {
      //return this.gameObject.transform.modelMat;

      var qRot = new Float32Array(4);
      let transform = this.gameObject.transform;
      glMatrix.quat.fromEuler(qRot, transform.rx, transform.ry, transform.rz);
      //glMatrix.mat4.fromRotationTranslationScale(localModelMat, qRot, this.position, this.scale);
      var translation = glMatrix.mat4.create();
      glMatrix.mat4.fromTranslation(translation, transform.position);
      var rotation = glMatrix.mat4.create();
      glMatrix.mat4.fromQuat(rotation, qRot);
      var scale = glMatrix.mat4.create();
      glMatrix.mat4.fromScaling(scale, transform.scale);

      let aux = glMatrix.mat4.create();
      glMatrix.mat4.multiply(aux, rotation, translation);
      glMatrix.mat4.multiply(this.viewMat,aux,scale);
    } else {
      glMatrix.mat4.identity(this.viewMat);
    }
  }


  UpdateProjection(){
    glMatrix.mat4.perspective(this.projMat, glMatrix.glMatrix.toRadian(this.fov), canvas.width / canvas.height, this.near, this.far);
  }

  LookAt(target, up = [0,1,0]){
    let transform = this.gameObject.transform;
    glMatrix.mat4.lookAt(transform.modelMat, transform.position, target, up);
  }
}
