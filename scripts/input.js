class Key{
  constructor(_key){
    this.key = _key;
    this.down = false;
    this.firstFrameDown = false;
    this.pressed = false;
    this.up = false;
    this.firstFrameUp = false;
  }
}

class Input{
  constructor(){
    canvas.onclick = function() {
      canvas.requestPointerLock();
      //canvas.exitPointerLock()
    }


    this.mouseX = 0.0;
    this.mouseY = 0.0;
    this.mouseGravity = 0.05;
    this.mouseLeftDown = false;
    //this.mouseRightDown = false;
    this.mouseLeftUp = false;
    //this.mouseRightUp = false;
    this.mouseLeft = false;
    //this.mouseRight = false;
    this.mouseLeftDownFirstFrame = false;
    //this.mouseRightDownFirstFrame = false;
    this.mouseLeftUpFirstFrame = false;
    //this.mouseRightUpFristFrame = false;

    var that = this;

    //canvas.addEventListener('onmousedown', (e) => {
    canvas.onmousedown = function(e){
      if(e.button == 0 && !that.mouseLeft){ //Left click
        that.mouseLeftDown=true;
        that.mouseLeft=true;
        that.mouseLeftUp=false;
        that.mouseLeftDownFirstFrame=true;
        that.mouseLeftUpFirstFrame=false;
      }
      /*if(e.button == 1 && !that.mouseRight){ // Right click
        that.mouseRightDown = true;
        that.mouseRight = true;
        that.mouseRightUp = false;
        that.mouseRightDownFirstFrame=true;
        that.mouseRightUpFirstFrame=false;
      }*/
    };

    canvas.onmouseup = function(e){
      if(e.button == 0 && that.mouseLeft){ //Left click
        that.mouseLeftDown=false;
        that.mouseLeft=false;
        that.mouseLeftUp=true;
        that.mouseLeftDownFirstFrame=false;
        that.mouseLeftUpFirstFrame=true;
      }
      /*if(e.button == 1 && that.mouseRight){ // Right click
        that.mouseRightDown = false;
        that.mouseRight = false;
        that.mouseRightUp = true;
        that.mouseRightDownFirstFrame=false;
        that.mouseRightUpFirstFrame=true;
      }*/
    };

    document.onmousemove = function(e){
      that.mouseX = e.movementX;
      that.mouseY = e.movementY;
    };


    this.keys = new Map();
    document.addEventListener('keydown', (e) => {
      for(var [key, value] of that.keys){
        if(e.code == key && !value.pressed){
          //console.log('down');
          value.down = true;
          value.firstFrameDown = true;
          value.pressed = true;
          value.up = false;
          value.firstFrameUp = false;
        }
      }
    });
    document.addEventListener('keyup', (e) => {
      for(var [key, value] of that.keys){
        if(e.code == key){
          //console.log("up");
          value.down = false;
          value.firstFrameUp = true;
          value.pressed = false;
          value.up = true;
          value.firstFrameDown=false;
        }
      }
    });
  }

  Update(){
    //MOUSE
    if(this.mouseLeftDown && this.mouseLeftDownFirstFrame){
      this.mouseLeftDownFirstFrame = false;
    }
    else if(this.mouseLeftDown){
      this.mouseLeftDown = false;
    }

    if(this.mouseLeftUp && this.mouseLeftUpFirstFrame){
      this.mouseLeftUpFirstFrame = false;
    }
    else if(this.mouseLeftUp){
      this.mouseLeftUp = false;
    }

    let lerp = gameController.delta/ this.mouseGravity;
    this.mouseX = this.mouseX *lerp;
    this.mouseY = this.mouseY *lerp;

    /*if(this.mouseRightDown && this.mouseRightDownFirstFrame){
      this.mouseRightDownFirstFrame = false;
    }
    else if(this.mouseRightDown){
      this.mouseRightDown = false;
    }

    if(this.mouseRightUp && this.mouseRightUpFirstFrame){
      this.mouseRightUpFirstFrame = false;
    }
    else if(this.mouseRightUp){
      this.mouseRightUp = false;
    }*/

    //KEYS
    for(var [key, value] of this.keys){
      if(value.down && value.firstFrameDown){
        value.firstFrameDown = false;
      }
      else if (value.down){
        value.down = false;
      }

      if(value.up && value.firstFrameUp){
        value.firstFrameUp = false;
      }
      else if (value.up){
        value.up = false;
      }
    }
    //var key = this.keys.get('KeyA');
    //console.log("A down: " + key.down + " | up: " + key.up + " | pressed: " + key.pressed);
    //console.log("left mouse down: " + this.mouseLeftDown + " | up: " + this.mouseLeftUp + " | pressed: " + this.mouseLeft);
    //console.log("mouse move: ("+this.mouseX+" "+this.mouseY+")");
  }

  AddKey(key){
    this.keys.set(key, new Key(key));
  }

  GetKeyDown(key){
    let val = this.keys.get(key);
    if(!val) return false;
    return val.down;
  }
  GetKeyUp(key){
    let val=this.keys.get(key);
    if (!val) return false;
    return val.up;
  }
  GetKeyPressed(key){
    let val = this.keys.get(key);
    if(!val) return false;
    return val.pressed;
  }
}
