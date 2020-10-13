class Camera extends Component{
  constructor(){
    super();
    this.type="camera";
    this.colorFilter = new Float32Array([1,1,1,1]);
    this.brightness = 1.1;
    this.contrast = 1.2;
  }

  Update(){
    const step =2.0;
    let fStep = step * manager.delta;
    if(input.GetKeyPressed('KeyT')){
      this.contrast+=fStep;
    } else if(input.GetKeyPressed('KeyG')){
      this.contrast-= fStep;
    }

    if(input.GetKeyPressed('KeyY')){
      this.brightness+=fStep;
    } else if(input.GetKeyPressed('KeyH')){
      console.log('h');
      this.brightness-= fStep;
    }

    if(this.brightness>1.2)this.brightness = 1.2;
    if(this.brightness < 0.0) this.brightness =0.0;
  }

  SetColorFilter(r=1.0,g=1.0,b=1.0){
    this.colorFilter[0] = r;
    this.colorFilter[1] = g;
    this.colorFilter[2] = b;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.camera = this;
  }
}
