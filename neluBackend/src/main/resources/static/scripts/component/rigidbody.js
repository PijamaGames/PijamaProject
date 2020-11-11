class Rigidbody extends Component{

  constructor(drag = 0.4){
    super();
    this.drag = drag*0.32;
    this.originalDrag = this.drag;
    this.type="rigidbody";
    this.force = new Vec2();
    this.velocity = new Vec2();

    manager.scene.rigidbodies.add(this);
  }

  OnSetActive(active){
    if(active){
      manager.scene.rigidbodies.add(this);
    } else {
      this.gameobj.scene.rigidbodies.delete(this);
    }
  }

  SetScene(scene){
    this.gameobj.scene.rigidbodies.delete(this);
    scene.rigidbodies.add(this);
  }

  AddForce(dir){
    this.force.Add(dir);
  }

  Update(){

  }

  PrepareVelocity(){

    this.force.Add(Vec2.Scale(this.velocity, -this.drag));

    this.velocity.Add(this.force);
    this.force.Set(0.0,0.0);

  }

  UpdatePhysics(){
    let pct = physics.stepPCT;
    this.velocity.Add(this.force);
    this.force.Set(0,0);

    let newPos = this.gameobj.transform.GetWorldPos().Copy().Add(Vec2.Scale(this.velocity, manager.delta*pct));
    this.gameobj.transform.SetWorldPosition(newPos);
  }


  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.rigidbody = this;
  }

  Destroy(){
    this.gameobj.scene.rigidbodies.delete(this);
  }
}
