class Rigidbody extends Component{

  constructor(drag = 0.4, testMove = true){
    super();
    this.testMove = testMove;
    this.drag = drag;
    this.originalDrag = this.drag;
    this.type="rigidbody";
    //this.frictionCoefficient=-0.5;
    //this.movementForce=0.0;
    //this.totalForce=0.0;
    //this.frictionForce=this.frictionCoefficient*this.mass*9.8;
    this.force = new Vec2();
    this.velocity = new Vec2();

    manager.scene.rigidbodies.add(this);
  }

  AddForce(dir){
    this.force.Add(dir);
  }

  Update(){
    if(this.testMove){
      let x = input.GetKeyPressed('KeyA') * -1.0 + input.GetKeyPressed('KeyD');
      let y = input.GetKeyPressed('KeyS') * -1.0 + input.GetKeyPressed('KeyW');
      let v = new Vec2(x,y);
      v.Norm();
      v.Scale(2.0);
      this.force.Add(v);
    }

    //v.Scale(this.speed*manager.delta);
  }

  PrepareVelocity(){
    this.velocity.Scale(this.drag);
    this.velocity.Add(this.force);
    this.force.Set(0.0,0.0);

    //this.gameobj.transform.position.Add(Vec2.Scale(this.velocity, manager.delta));
  }

  UpdatePhysics(){
    let pct = physics.stepPCT;
    this.velocity.Add(this.force);
    this.force.Set(0,0);

    this.gameobj.transform.position.Add(Vec2.Scale(this.velocity, manager.delta*pct));
  }

  /*CheckCollision(){
    let dir;
    let penetration;
    for(var colliderGroup of this.gameobj.scene.colliderGroups){
      for(var otherCollider of colliderGroup){
        for(var collider of this.gameobj.colliderGroup){
          //this.collision=collider.OnColisionEnter(otherCollider);
          [dir, penetration]=collider.OnColisionEnter(otherCollider);
          //if(this.collision) this.ResolveCollision();
          this.ResolveCollision(dir,penetration);
        }
      }
    }
  }

  ResolveCollision(dir,penetration){

  }*/

  /*GameobjForces(){
    //this.movementForce=this.mass*this.a;
    //this.totalForce=this.movementForce+this.frictionForce;
  }*/

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.rigidbody = this;
  }

  Destroy(){
    this.gameobj.scene.rigidbodies.delete(this);
  }
}
