class VirtualInput{
  constructor(name = "unknownInput", img='btn_placeHolder', position = new Vec2(), anchor = new Vec2(0.5,0.5), scale = new Vec2(0.3,0.3), ratio = 0.25){
    Object.assign(this,{name,img,position,anchor,scale,ratio});

    this.originalRatio = ratio;

    this.originalPosition = this.position.Copy();

    this.down = false;
    this.pressed = false;
    this.up = false;
    this.tint = new Float32Array([1.0,1.0,1.0,1.0]);

    this.touches = new Set();
    this.touchesCount = 0;

    this.texture = resources.textures.get(img);

    this.active = true;

    manager.graphics.programs.get('virtualInput').renderers.add(this);

    this.onButtonDown = [];
    this.onButtonPressed = [];
    this.onButtonUp = [];

    this.action = 0;
    this.maxActions = 0;

    this.dir = new Vec2();
  }

  AddAction(down = function(){}, pressed = function(){}, up = function(){}){
    this.onButtonDown.push(down);
    this.onButtonPressed.push(pressed);
    this.onButtonUp.push(up);
    this.maxActions+=1;
  }

  SetTint(r=1.0,g=1.0,b=1.0){
    this.tint[0]=r;
    this.tint[1]=g;
    this.tint[2]=b;
  }

  SetAlpha(alpha = 1.0){
    this.tint[3]=alpha;
  }

  /*GetCenter(original = false){
    return Vec2.Add(this.anchor, original ? this.originalPosition : this.position);
  }*/

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

    if(this.isJoystick){
      this.UpdateJoystick();
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

    let anchor = this.anchor.Copy();
    anchor.x*=(window.innerWidth/unit);
    anchor.y*=(window.innerHeight/unit);

    let center = Vec2.Add(anchor, this.isJoystick ? this.originalPosition : this.position);

    this.dir = Vec2.Sub(canvasCoords, center);
    let condition = this.dir.mod < this.ratio;

    return condition;
  }

  AddTouch(touch){
    if(this.touchesCount > 0 && this.isJoystick) return;
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

      this.SetTint(0.8,0.8,0.8);
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
        if(this.maxActions > 0)
          this.onButtonUp[this.action]();
        this.SetTint(1.0,1.0,1.0);
      }
    }

  }

  NextAction(){

    if(this.maxActions > 0){
      this.action = (this.action+1)%this.maxActions;
    }
    Log(this.action);
  }

}
