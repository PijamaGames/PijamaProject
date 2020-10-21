class FlyController extends Component{
  constructor(_movSpeed = 2.0, _rotSpeed = 1.0){
    super();
    this.movSpeed = _movSpeed;
    this.rotSpeed = _rotSpeed;
  }

  Update(){
    var input = gameController.input;
    var delta = gameController.delta;
    var movSpeed = this.movSpeed * delta;
    var movX = 0.0;
    var movY = 0.0;
    if(input.GetKeyPressed('KeyW')){
      movY += movSpeed;
    }
    if(input.GetKeyPressed('KeyS')){
      movY -= movSpeed;
    }
    if(input.GetKeyPressed('KeyA')){
      movX += movSpeed;;
    }
    if(input.GetKeyPressed('KeyD')){
      movX -= movSpeed;
    }

    var transform = this.gameObject.transform;
    transform.pz += movY;
    transform.px += movX;

    /*var forward = transform.forward;
    glMatrix.vec3.scale(forward, forward, movY);
    glMatrix.vec3.add(transform.position, transform.position, forward);

    var right = transform.right;
    glMatrix.vec3.scale(right, right, movX);
    glMatrix.vec3.add(transform.position, transform.position, right);*/

    var rotSpeed = this.rotSpeed*delta;
    transform.ry += input.mouseX*rotSpeed;
    transform.rx += input.mouseY*rotSpeed;

    /*var globalPos = new Float32Array(3);
    glMatrix.mat4.getTranslation(globalPos, this.gameObject.components.get('Camera').viewMat);
    console.log(globalPos);*/
  }

}
