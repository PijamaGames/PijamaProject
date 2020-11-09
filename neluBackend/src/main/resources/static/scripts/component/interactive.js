class Interactive extends Component {
  constructor(radius){
    super();
    this.radius = radius;
    this.canInteract = false;

  }

  Update(){
    let player = this.player;
    if(player && player != null){
      let dist = Vec2.Distance(player.transform.GetWorldCenter(), this.gameobj.transform.GetWorldCenter());
      if(dist <= this.radius){
        this.canInteract = true;
        this.textBox.transform.SetWorldPosition(input.WorldToCanvas(this.gameobj.transform.GetWorldCenter()));
      } else if (dist > this.radius){
        this.canInteract = false;
      }
      if(this.canInteract != this.textBox.active){
        this.textBox.SetActive(this.canInteract);
      }
    }
  }

  get player(){
    return this.gameobj.scene.players.values().next().value;
  }

  SetOnInteract(){
    return this;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.interactive = this;

    this.textBox = prefabFactory.CreateObj("InteractBox");
  }
}
