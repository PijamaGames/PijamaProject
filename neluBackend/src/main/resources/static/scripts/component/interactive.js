class Interactive extends Component {
  constructor(radius = 3.0, displacement = new Vec2(1,1)){
    super();
    this.type = "interactive";
    this.radius = radius;
    this.canInteract = false;
    this.avaible = true;
    this.interactFunc = function(){};
    this.displacement = displacement;
  }

  IsInteracting(){
    return this.canInteract && (this.textBox.renderer.pressed || (input.GetKeyDown("KeyE")&&input.isDesktop));
  }

  Update(){
    //Log("AVAIBLE "+this.avaible);
    if(user && user.isClient) return;
    if(!this.avaible) return;
    let player = this.player;
    if(player && player != null){
      let dist = Vec2.Distance(player.transform.GetWorldCenter(), this.gameobj.transform.GetWorldCenter());
      if(dist <= this.radius){
        this.canInteract = true;
        this.textBox.transform.SetWorldPosition(input.WorldToCanvas(Vec2.Add(this.gameobj.transform.GetWorldCenter(), this.displacement)));
        if(this.IsInteracting()){
          this.canInteract = false;
          this.avaible = false;
          this.textBox.renderer.pressed = false;
          this.textBox.renderer.up = false;
          this.textBox.renderer.down = false;
          Log("Interacting with: " + this.gameobj.key);
          this.interactFunc(this.gameobj);
        }
      } else if (dist > this.radius){
        this.canInteract = false;
      }
      if(this.canInteract != this.textBox.active){
        this.textBox.SetActive(this.canInteract);
      }
    }
  }

  get player(){
    return manager.scene.players.values().next().value;
  }

  SetOnInteract(func){
    this.interactFunc = func;
    return this;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.interactive = this;

    this.textBox = prefabFactory.CreateObj("InteractBox");
    this.textBox.SetActive(false);
  }
}
