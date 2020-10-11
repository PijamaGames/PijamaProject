class Rigidbody extends Component{
  constructor(mass,a){
    super();
    Object.assign(this,{mass,a});
    this.type="rigidbody";
    this.frictionCoefficient=-0.5;
    this.substeps=5;
    this.collision=false;
    //necesito coger el delta del manager
    this.delta=60;
    this.movementForce=0.0;
    this.totalForce=0.0;

    this.frictionForce=this.frictionCoefficient*this.mass*9.8;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.rigidbody = this;
  }

  Update(){
    for (var i; i<substeps;i++){
      this.GameobjForces();
      this.CheckCollision();
    }
  }

  CheckCollision(){
    let dir;
    let penetration;
    for(var colliderGroup in this.gameobj.scene.colliderGroups){
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
    
    this.collision=false;
  }

  GameobjForces(){
    this.movementForce=this.mass*this.a;
    this.totalForce=this.movementForce+this.frictionForce;
  }
}
