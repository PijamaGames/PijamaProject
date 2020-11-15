class Rigidbody extends Component{

  constructor(drag = 0.4, levelObject){
    super();
    this.drag = drag*0.32;
    this.originalDrag = this.drag;
    this.type="rigidbody";
    this.force = new Vec2();
    this.velocity = new Vec2();
    manager.scene.rigidbodies.add(this);

    this.overDist = false;
    this.levelObject=levelObject;
  }

  /*Update(){
    this.CheckMaxDist();
  }*/

  CheckMaxDist(){
    if(!this.gameobj.colliderGroup) return;
    let maxDist = physics.rigidbodyMaxDist;
    let dist = Vec2.Distance(this.gameobj.scene.camera.transform.GetWorldPos(), this.gameobj.transform.GetWorldCenter());
    if((dist >= maxDist && !this.overDist) || !this.gameobj.active){
      this.overDist = true;
      this.RemoveColliderGroupWithRb();
    } else if(dist < maxDist && this.overDist){
      this.overDist = false;
      this.AddColliderGroupWithRb(this.gameobj.scene);
    }
  }

  OnSetActive(active){
    if(active){
      manager.scene.rigidbodies.add(this);
      this.CheckMaxDist();
      //this.AddColliderGroupWithRb(this.gameobj.scene);
    } else {
      this.gameobj.scene.rigidbodies.delete(this);
      this.CheckMaxDist();
      //this.RemoveColliderGroupWithRb();
    }
  }

  RemoveColliderGroupWithRb(){
    if(this.gameobj.colliderGroup){
      let index = this.gameobj.scene.colliderGroupsWithRb.indexOf(this.gameobj.colliderGroup);
      if(index >= 0){
        this.gameobj.scene.colliderGroupsWithRb.splice(index,1);
      }
      if(DEBUG_PHYSICS){
        let program = manager.graphics.programs.get('collider');
        for(var i = 0; i < this.gameobj.colliderGroup.colliders.length; i++){
          program.renderers.delete(this.gameobj.colliderGroup.colliders[i]);
        }
      }
    }
  }

  AddColliderGroupWithRb(scene){
    if(this.gameobj.colliderGroup){
      let index = scene.colliderGroupsWithRb.indexOf(this);
      if(index < 0){
        scene.colliderGroupsWithRb.push(this.gameobj.colliderGroup);
      }
      if(DEBUG_PHYSICS){
        let program = manager.graphics.programs.get('collider');
        for(var i = 0; i < this.gameobj.colliderGroup.colliders.length; i++){
          program.renderers.add(this.gameobj.colliderGroup.colliders[i]);
        }
      }
    }
  }

  SetScene(scene){
    this.gameobj.scene.rigidbodies.delete(this);
    scene.rigidbodies.add(this);
    this.RemoveColliderGroupWithRb();
    this.AddColliderGroupWithRb(scene);
  }

  AddForce(dir){
    this.force.Add(dir);
  }

  PrepareVelocity(){

    this.force.Add(Vec2.Scale(this.velocity, -this.drag));

    this.velocity.Add(this.force);
    this.force.Set(0.0,0.0);

  }

  UpdatePhysics(){
    let pct = physics.stepPCT;
    this.velocity.Add(this.force);
    let audio=this.gameobj.audioSource;
    if(this.levelObject && !audio.Playing("moveObjectSound") && (this.force.x!=0 || this.force.y!=0))
      this.gameobj.audioSource.Play("moveObjectSound");

    this.force.Set(0,0);

    let newPos = this.gameobj.transform.GetWorldPos().Copy().Add(Vec2.Scale(this.velocity, manager.delta*pct));
    this.gameobj.transform.SetWorldPosition(newPos);
  }


  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.rigidbody = this;
  }

  OnCreate(){
    this.AddColliderGroupWithRb(this.gameobj.scene);
  }

  Destroy(){
    this.gameobj.scene.rigidbodies.delete(this);
    this.RemoveColliderGroupWithRb();
  }
}
