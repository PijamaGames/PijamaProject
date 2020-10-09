class ColliderGroup extends Component{
  constructor(){
    super();
    this.colliders=[];
    this.type="colliderGroup";
  }

  AddColliders(_colliders){
    var len=_colliders.length;
    for (var c of _colliders)
      this.colliders.push(c);

  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.colliderGroup = this;
  }
}
