class VirtualInput{
  constructor(name = "unknownInput", img='btn_placeHolder', position = new Vec2(), anchor = new Vec2(0.5,0.5), scale = new Vec2(0.3,0.3), ratio = 0.25){
    Object.assign(this,{name,img,position,anchor,scale,ratio});

    this.down = false;
    this.pressed = false;
    this.up = false;
    this.tint = new Float32Array([1.0,1.0,1.0,0.5]);

    this.touches = new Set();
    this.touchesCount = 0;

    this.texture = resources.textures.get(img);

    manager.graphics.programs.get('virtualInput').renderers.set(this.name, this);

    this.onButtonDown = [];
    this.onButtonPressed = [];
    this.onButtonUp = [];

    this.action = 0;
    this.maxActions = 0;
  }

  AddAction(down = function(){}, pressed = function(){}, up = function(){}){
    this.onButtonDown.push(down);
    this.onButtonPressed.push(pressed);
    this.onButtonUp.push(up);
    this.maxActions++;
  }

  SetTint(r=1.0,g=1.0,b=1.0){
    this.tint[0]=r;
    this.tint[1]=g;
    this.tint[2]=b;
  }

  SetAlpha(alpha = 1.0){
    this.tint[3]=alpha;
  }

  /*GetScale(){
    return scale.x > scale.y ? scale.x : scale.y;
  }*/

  GetCenter(){
    return Vec2.Add(this.anchor, this.position);
  }

  Update(){
    if(this.pressed){
      for(let t of this.touches){
        let touch = input.ongoingTouches.get(t);
        if(!this.ScreenCoordInsideInput(touch.clientX, touch.clientY)){
          this.RemoveTouch(touch);
        }
      }
      if(this.maxActions > 0)
        this.onButtonPressed[this.action]();
    }

  }

  LateUpdate(){
    this.down = false;
    this.up = false;
  }

  ScreenCoordInsideInput(screenCoordX, screenCoordY){
    let unit = Math.min(window.innerWidth, window.innerHeight);


    let canvasCoords = new Vec2(
      screenCoordX/unit,
      (window.innerHeight-screenCoordY)/unit
    );

    let center = this.GetCenter();
    center.x*=(window.innerWidth/unit);
    center.y*=(window.innerHeight/unit);

    Log(center.toString('center:'));
    Log(canvasCoords.toString('canvasCoords'));
    return Vec2.Sub(center, canvasCoords).mod < this.ratio;
  }

  AddTouch(touch){
    if(!this.touches.has(touch.identifier)){
      this.touchesCount++;
    }
    this.touches.add(touch.identifier);
    if(this.touches.size == 1){
      //down
      this.down = true;
      this.pressed = true;
      this.up = false;
      if(this.maxActions > 0){
        this.onButtonDown[this.action]();
        Log("down");
      }

      this.SetTint(0.0,0.0,1.0);
    }
  }

  RemoveTouch(touch){
    if(this.touches.has(touch.identifier)){
      this.touchesCount--;
      this.touches.delete(touch.identifier);

      if(this.touches.size == 0){
        //up
        this.down = false;
        this.pressed = false;
        this.up = true;
        if(this.maxActions > 0){
          this.onButtonUp[this.action]();
          this.action = (this.action+1)%this.maxActions;
        }

        this.SetTint(1.0,1.0,1.0);
      }
    }

  }
}
