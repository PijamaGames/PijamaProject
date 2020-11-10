class Key {
  constructor(key) {

    Object.assign(this, {
      key
    });

    this.down = false;
    this.firstFrameDown = false;
    this.pressed = false;
    this.up = false;
    this.firstFrameUp = false;
    this.isDesktop = false;
  }
}

var input;
class Input {
  constructor() {
    /*canvas.onclick = function() {
      canvas.requestPointerLock();
      //canvas.exitPointerLock()
    }*/
    this.mousePosition = new Vec2();
    /*this.mouseWorldPosition = new Vec2();
    this.mouseGridPosition = new Vec2();*/
    this.mouseMovement = new Vec2();
    this.mouseGravity = 0.05;
    this.mouseLeftDown = false;
    this.mouseLeftUp = false;
    this.mouseLeft = false;
    this.keys = new Map();
    this.virtualInputs = new Map();
    this.ongoingTouches = new Map();
    this.lastTouch = null;
    this.touchStartEvent = new EventDispatcher();
    this.touchEndEvent = new EventDispatcher();
    this.clickEvent = new EventDispatcher();
    //this.clickPosition = new Vec2();
    var that = this;
  }

  get clickPosition(){
    if(this.isDesktop){
      return this.mouseWorldPosition;
    } else {
      return this.CanvasToWorld(this.ScreenToCanvas(new Vec2(this.lastTouch.clientX, this.lastTouch.clientY)));
    }
  }

  get mouseWorldPosition(){
    return this.CanvasToWorld(this.ScreenToCanvas(this.mousePosition));
  }

  get mouseGridPosition(){
    let wp = this.mouseWorldPosition;
    return new Vec2(Math.round(wp.x),Math.round(wp.y));
  }

  GetLeftAxis(){
    let axis;

    if(this.isDesktop){
      axis = new Vec2();
      axis.x -= this.GetKeyPressed('KeyA') || this.GetKeyPressed('ArrowLeft') ? 1.0 : 0.0;
      axis.x += this.GetKeyPressed('KeyD') || this.GetKeyPressed('ArrowRight') ? 1.0 : 0.0;

      axis.y -= this.GetKeyPressed('KeyS') || this.GetKeyPressed('ArrowDown') ? 1.0 : 0.0;
      axis.y += this.GetKeyPressed('KeyW') || this.GetKeyPressed('ArrowUp') ? 1.0 : 0.0;
      axis.Norm();
    } else {
      let virtualDir = this.GetVirtualJoystick('leftJoystick');
      //Log(virtualDir.mod);
      let joystickDown = this.GetVirtualButtonPressed('leftJoystick')
      axis = joystickDown ? Vec2.Norm(virtualDir) : new Vec2();
    }
    return axis;
  }

  GetRightAxis(player){
    let axis;

    if(this.isDesktop){
      axis = Vec2.Sub(input.mouseWorldPosition, player.transform.GetWorldPos()).Norm();
    } else {
      let virtualDir = this.GetVirtualJoystick('rightJoystick');
      let joystickDown = this.GetVirtualButtonPressed('rightJoystick')
      axis = joystickDown ? Vec2.Norm(virtualDir) : new Vec2();
    }
    return axis;
  }

  GetDashDown(){
    if(this.isDesktop){
      return this.GetKeyDown("ShiftLeft");
    } else {
      return this.GetVirtualButtonPressed('dashBtn');
    }
  }

  GetAttackCACDown(){
    if(this.isDesktop){
      return this.GetKeyDown("Space");
    } else {
      return this.GetVirtualButtonPressed('cacBtn');
    }
  }

  GetAttackADDown(){
    if(this.isDesktop){
      return this.mouseLeftDown;
    } else {
      return false;
    }
  }

  GetChangeSkillDown(){
    if(this.isDesktop){
      return this.GetKeyDown("KeyQ");
    } else {
      return false;
    }
  }

  GetFreeCamera(){
    if(this.isDesktop){
      return this.GetLeftAxis().mod > 0.1;
    } else {
      return false;
    }
  }

  GetBlockCamera(){
    if(this.isDesktop){
      return this.GetKeyDown("Space");
    } else {
      return false;
    }
  }



  AddListeners(){
    var that = this;
    if(this.isDesktop){
      //canvas.addEventListener('onmousedown', (e) => {
      canvas.onmousedown = function(e) {
        if (e.button == 0 && !that.mouseLeft) { //Left click
          that.mouseLeftDown = true;
          that.mouseLeft = true;
          that.mouseLeftUp = false;
          that.clickEvent.Dispatch();
        }
      };

      canvas.onmouseup = function(e) {
        if (e.button == 0 && that.mouseLeft) { //Left click
          that.mouseLeftDown = false;
          that.mouseLeft = false;
          that.mouseLeftUp = true;
        }
      };

      canvas.onmousemove = function(e) {
        that.mousePosition.Set(e.offsetX, e.offsetY);
        that.mouseMovement.Set(e.movementX, e.movementY);
      };

      document.addEventListener('keydown', (e) => {
        for (var [key, value] of that.keys) {
          if (e.code == key && !value.pressed) {
            value.down = true;
            value.pressed = true;
            value.up = false;
          }
        }
      });
      document.addEventListener('keyup', (e) => {
        for (var [key, value] of that.keys) {
          if (e.code == key) {
            value.down = false;
            value.pressed = false;
            value.up = true;
          }
        }
      });
    } else {

      canvas.addEventListener('touchstart', (e) => {
        let touches = e.changedTouches;
        //Log(touches);
        for(let t of touches){
          input.ongoingTouches.set(t.identifier, t);
          this.lastTouch = t;
          this.touchStartEvent.Dispatch();
          this.clickEvent.Dispatch();
          for(let [key,vi] of input.virtualInputs){
            if(vi.ScreenCoordInsideInput(t.clientX, t.clientY)){
              vi.AddTouch(t);
            }
          }
        }
      }, false);
      canvas.addEventListener('touchend', (e) => {
        let touches = e.changedTouches;
        for(let t of touches){
          input.ongoingTouches.delete(t.identifier);
          this.lastTouch = t;
          this.touchEndEvent.Dispatch();
          for(let [key,vi] of input.virtualInputs){
            vi.RemoveTouch(t);
          }
        }
      }, false);
      canvas.addEventListener('touchleave', (e) => {
        let touches = e.changedTouches;
        for(let t of touches){
          input.ongoingTouches.delete(t.identifier);
          this.lastTouch = t;
          this.touchEndEvent.Dispatch();
          for(let [key,vi] of input.virtualInputs){
            vi.RemoveTouch(t);
          }
        }
      }, false);
      canvas.addEventListener('touchcancel', (e) => {
        let touches = e.changedTouches;
        for(let t of touches){
          input.ongoingTouches.delete(t.identifier);
          this.lastTouch = t;
          this.touchEndEvent.Dispatch();
          for(let [key,vi] of input.virtualInputs){
            vi.RemoveTouch(t);
          }
        }
      }, false);
      canvas.addEventListener('touchmove', (e) => {
        let touches = e.changedTouches;
        for(let t of touches){
          input.ongoingTouches.set(t.identifier, t);
        }
      }, false);
    }
  }

  Update() {
    if(this.isDesktop){
      //MOUSE
      /*if (this.mouseLeftDown && this.mouseLeftDownFirstFrame) {
        this.mouseLeftDownFirstFrame = false;
      } else if (this.mouseLeftDown) {
        this.mouseLeftDown = false;
      }

      if (this.mouseLeftUp && this.mouseLeftUpFirstFrame) {
        this.mouseLeftUpFirstFrame = false;
      } else if (this.mouseLeftUp) {
        this.mouseLeftUp = false;
      }*/

      let lerp = manager.delta / this.mouseGravity;
      this.mouseMovement.Scale(lerp);

      //KEYS
      /*for (var [key, value] of this.keys) {
        if (value.down && value.firstFrameDown) {
          value.firstFrameDown = false;
        } else if (value.down) {
          value.down = false;
        }

        if (value.up && value.firstFrameUp) {
          value.firstFrameUp = false;
        } else if (value.up) {
          value.up = false;
        }
      }*/
    } else {
      for(let [key, vi] of this.virtualInputs){
        vi.Update();
      }
    }
  }

  LateUpdate(){
    for(let [key, vi] of this.virtualInputs){
      vi.LateUpdate();
    }

    for(let [key, value] of this.keys){
      value.up = false;
      value.down = false;
    }

    this.mouseLeftDown = false;
    this.mouseLeftUp = false;
  }

  AddKey(key) {
    let k = this.keys.set(key, new Key(key));
    return k;
  }

  AddVirtualInput(vInput){
    this.virtualInputs.set(vInput.name, vInput);
    return vInput;
  }

  CheckHasKey(key){
    if(!this.keys.has(key)){
      this.AddKey(key);
    }
  }

  GetKeyDown(key, consume = false) {
    this.CheckHasKey(key);
    let val = this.keys.get(key);
    if (!val) return false;
    if(consume && val.down){
      let v = val.down;
      val.down = false;
      return v;
    }
    return val.down;
  }
  GetKeyDownF(key) {
    return this.GetKeyDown(key) ? 1.0 : 0.0;
  }
  GetKeyUp(key, consume = false) {
    this.CheckHasKey(key);
    let val = this.keys.get(key);
    if (!val) return false;
    if(consume && val.up){
      let v = val.up;
      val.up = false;
      return v;
    }
    return val.up;

  }
  getKeyUpF(key) {
    return this.GetKeyUp(key) ? 1.0 : 0.0;
  }
  GetKeyPressed(key) {
    this.CheckHasKey(key);
    let val = this.keys.get(key);
    if (!val) return false;
    return val.pressed;
  }
  GetKeyPressedF(key) {
    return this.GetKeyPressed(key) ? 1.0 : 0.0;
  }

  GetVirtualButtonDown(name){
    return this.virtualInputs.get(name).down;
  }
  GetVirtualButtonPressed(name){
    return this.virtualInputs.get(name).pressed;
  }
  GetVirtualButtonUp(name){
    return this.virtualInputs.get(name).up;
  }
  GetVirtualJoystick(name){
    return this.virtualInputs.get(name).GetDirection();
  }

  CanvasToWorld(position){
    if(!manager.scene.camera) return;
    let pos = position.Copy();
    let camPos = manager.scene.camera.transform.GetWorldPos();
    pos.x = (pos.x - manager.graphics.res.x / 2.0) / tileSize + camPos.x;
    pos.y = (pos.y - manager.graphics.res.y / 2.0) / -tileSize + camPos.y;

    return pos;
  }

  WorldToCanvas(position){
    if(!manager.scene.camera) return;
    let pos = position.Copy();
    let camPos = manager.scene.camera.transform.GetWorldPos();
    pos.Sub(camPos);
    pos.x = (pos.x / (manager.graphics.res.x *0.5 / tileSize)) *0.5;
    pos.y = (pos.y / (manager.graphics.res.y *0.5 / tileSize)) *0.5;

    //pos.x = (pos.x-camPos.x)/manager.graphics.res.x / 2.0/tileSize;
    //pos.y = (pos.y-camPos.y)/-manager.graphics.res.y / 2.0/tileSize;
    Log(pos.toString("WORLD TO CANVAS: "));
    return pos;
  }

  ScreenToCanvas(position){
    let pos = position.Copy();
    pos.x = pos.x * canvas.width / window.innerWidth;
    pos.y = pos.y * canvas.height / window.innerHeight;

    let scaleX = manager.graphics.res.x / canvas.width;
    pos.x = (pos.x - (canvas.width-manager.graphics.res.x)*0.5);

    return pos;
  }
}
