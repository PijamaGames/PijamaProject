class ColliderGroup extends Component{
  constructor(colliders = []){
    super();
    this.colliders=colliders;
    this.type="colliderGroup";

  }

  Destroy(){
    let index = this.gameobj.scene.colliderGroups.indexOf(this);
    this.gameobj.scene.colliderGroups.splice(index,1);
  }

  SetGameobj(gameobj){
    if(!(gameobj.transform.height > 0.0)){
      for (var c of this.colliders){
        c.colliderGroup = this;
      }

      this.gameobj = gameobj;
      this.gameobj.scene.colliderGroups.push(this);
      this.gameobj.colliderGroup = this;

      if(DEBUG){
        let program = manager.graphics.programs.get('collider');
        for(var i = 0; i < this.colliders.length; i++){
          program.renderers.set(this.gameobj.key+'_col'+i, this.colliders[i]);
        }
      }
    }
  }
}