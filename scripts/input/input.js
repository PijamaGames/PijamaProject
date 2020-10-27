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
    this.mouseWorldPosition = new Vec2();
    this.mouseGridPosition = new Vec2();
    this.mouseMovement = new Vec2();
    this.mouseGravity = 0.05;
    this.mouseLeftDown = false;
    this.mouseLeftUp = false;
    this.mouseLeft = false;
    this.mouseLeftDownFirstFrame = false;
    this.mouseLeftUpFirstFrame = false;
    this.keys = new Map();
    this.virtualInputs = new Map();
    this.ongoingTouches = new Map();
    this.lastTouch = null;
    this.touchStartEvent = new EventDispatcher();
    this.touchEndEvent = new EventDispatcher();
    var that = this;

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
          that.mouseLeftDownFirstFrame = true;
          that.mouseLeftUpFirstFrame = false;
        }
      };

      canvas.onmouseup = function(e) {
        if (e.button == 0 && that.mouseLeft) { //Left click
          that.mouseLeftDown = false;
          that.mouseLeft = false;
          that.mouseLeftUp = true;
          that.mouseLeftDownFirstFrame = false;
          that.mouseLeftUpFirstFrame = true;
        }
      };

      canvas.onmousemove = function(e) {
        that.mousePosition.Set(e.offsetX, e.offsetY);
        that.mouseMovement.Set(e.movementX, e.movementY);
        that.mouseWorldPosition.Set(
          (that.mousePosition.x - canvas.width / 2.0) / tileSize + manager.scene.camera.transform.position.x,
          (that.mousePosition.y - canvas.height / 2.0) / -tileSize + manager.scene.camera.transform.position.y
        );
        that.mouseGridPosition.Set(
          Math.round(that.mouseWorldPosition.x),
          Math.round(that.mouseWorldPosition.y)
        )
      };

      document.addEventListener('keydown', (e) => {
        for (var [key, value] of that.keys) {
          if (e.code == key && !value.pressed) {
            value.down = true;
            value.firstFrameDown = true;
            value.pressed = true;
            value.up = false;
            value.firstFrameUp = false;
          }
        }
      });
      document.addEventListener('keyup', (e) => {
        for (var [key, value] of that.keys) {
          if (e.code == key) {
            value.down = false;
            value.firstFrameUp = true;
            value.pressed = false;
            value.up = true;
            value.firstFrameDown = false;
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
      if (this.mouseLeftDown && this.mouseLeftDownFirstFrame) {
        this.mouseLeftDownFirstFrame = false;
      } else if (this.mouseLeftDown) {
        this.mouseLeftDown = false;
      }

      if (this.mouseLeftUp && this.mouseLeftUpFirstFrame) {
        this.mouseLeftUpFirstFrame = false;
      } else if (this.mouseLeftUp) {
        this.mouseLeftUp = false;
      }

      let lerp = manager.delta / this.mouseGravity;
      this.mouseMovement.Scale(lerp);

      //KEYS
      for (var [key, value] of this.keys) {
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
      }
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
  }

  AddKey(key) {
    let k = this.keys.set(key, new Key(key));
    return k;
  }

  AddVirtualInput(vInput){
    this.virtualInputs.set(vInput.name, vInput);
    return vInput;
  }

  GetKeyDown(key) {
    let val = this.keys.get(key);
    if (!val) return false;
    return val.down;
  }
  GetKeyDownF(key) {
    return this.GetKeyDown(key) ? 1.0 : 0.0;
  }
  GetKeyUp(key) {
    let val = this.keys.get(key);
    if (!val) return false;
    return val.up;
  }
  getKeyUpF(key) {
    return this.GetKeyUp(key) ? 1.0 : 0.0;
  }
  GetKeyPressed(key) {
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
    let pos = position.Copy();
    let camPos = manager.scene.camera.transform.GetWorldPos();
    pos.x = (pos.x - manager.graphics.res.x / 2.0) / tileSize + camPos.x;
    pos.y = (pos.y - manager.graphics.res.y / 2.0) / -tileSize + camPos.y;

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
