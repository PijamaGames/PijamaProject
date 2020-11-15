class Renderer extends Component{
  static hoverSet = new Set();

  constructor(tile = new Vec2(), numTiles = new Vec2(1,1), vertical = true, alpha = 1.0, programs = null){
    super();
    this.type = "renderer";
    if(programs == null){
      programs = ['color', 'depth', 'sunDepth', 'mask'];
    }
    this.programs = [];
    for(var program of programs){
      this.programs.push(manager.graphics.programs.get(program));
    }
    this.name = null;
    this.tile = tile;
    this.numTiles = numTiles;
    this.vertical = vertical;
    this.tint = new Float32Array([1,1,1,alpha]);
    this.realTint=new Float32Array(this.tint);
    this.button = false;
  }

  SetScene(scene){
    if(this.button){
      this.gameobj.scene.buttons.delete(this);
      scene.buttons.add(this);
    }
  }

  SetTile(tile){
    this.tile=tile.Copy();
  }

  OnSetActive(active){
    if(!active){
      Renderer.hoverSet.delete(this);
      if(this.button){
        this.pressed = false;
        this.down = false;
        this.up = false;
      }
    }
  }

  UpdateButtonInput(){
    if(!this.active)return;
    if(this.isButton && this.pressed){
      if(this.pressedFunc != null)
        this.pressedFunc(this);
      if(!this.ignoreTouchMove){
        for(var touch of this.touches){
          if(!this.CheckTouchInside(touch)){
            this.RemoveTouch(touch,true);
          }
        }
      }
    }
    if(input.isDesktop){
      //Log("checkMouse");
      this.CheckMouse();
    }
  }

  CheckMouse(){
    if(!this.active)return;
    if(!this.hover){
      if(this.CheckInputInside(input.mousePosition)){
        Renderer.hoverSet.add(this);
        this.hover = true;
        if(this.hoverInFunc != null){
          this.hoverInFunc(this);
        }
      }
    }
    if(this.hover){
      if(!this.CheckInputInside(input.mousePosition)){
        Renderer.hoverSet.delete(this);
        this.hover = false;
        if(this.hoverOutFunc != null){
          this.hoverOutFunc(this);
        }
      } else {
        if(input.mouseLeftDown){
          if(this.downFunc != null)
            this.downFunc(this);
          this.MultiplyTint(0.8);
          this.pressed = true;
        } else if(input.mouseLeftUp){
          this.pressed = false;
          this.SetTint(this.realTint[0],this.realTint[1],this.realTint[2]);
          if(this.upFunc!=null){
            this.upFunc(this);
          }
        }
      }
    }
  }

  MultiplyTint(dark){
    this.tint[0]*=dark;
    this.tint[1]*=dark;
    this.tint[2]*=dark;
  }

  SetDownFunc(downFunc){
    this.downFunc = downFunc;
    return this;
  }

  SetPressedFunc(pressedFunc){
    this.pressedFunc = pressedFunc;
    return this;
  }

  SetUpFunc(upFunc){
    this.upFunc = upFunc;
    return this;
  }

  SetHoverInFunc(hoverInFunc){
    this.hoverInFunc = hoverInFunc;
    return this;
  }

  SetHoverOutFunc(hoverOutFunc){
    this.hoverOutFunc = hoverOutFunc;
    return this;
  }

  GiveFunctionality(ignoreTouchMove = false){
    this.button = true;
    //this.down = false;
    this.pressed = false;
    this.hover = false;
    //this.up = false;
    Object.assign(this, {ignoreTouchMove});
    this.downFunc = null;
    this.upFunc = null;
    this.pressedFunc = null;
    this.hoverInFunc = null;
    this.hoverOutFunc = null;

    this.touches = new Map();
    this.touchesCount = 0;
    var that = this;
    if(!input.isDesktop){
      this.startListener = input.touchStartEvent.AddListener(this, ()=>that.AddTouch(input.lastTouch));
      this.endListener = input.touchEndEvent.AddListener(this, ()=>that.RemoveTouch(input.lastTouch));
    }
    return this;
  }

  CheckInputInside(position){
    position = input.ScreenToCanvas(position);
    position = input.CanvasToWorld(position);

    return this.gameobj.transform.IsInsideBoundaries(position);
  }

  RemoveFunctionality(){
    if(this.isButton){
      this.gameobj.scene.buttons.delete(this);
      this.isButton=false;
      this.delete(downFunc);
      this.delete(pressedFunc);
      this.delete(upFunc);
      this.startListener.Remove();
      this.endListener.Remove();
    }
  }

  AddTouch(touch){
    if(!this.active)return;
    if(!this.CheckInputInside(new Vec2(touch.clientX, touch.clientY))){
      return;
    }
    if(!this.touches.has(touch.identifier)){
      this.touchesCount++;
      this.touches.set(touch.identifier, touch);
      //Log(this.touchesCount);
      if(this.touchesCount == 1){
        if(this.downFunc != null)
          this.downFunc(this);
        this.pressed = true;
      }
    }
  }

  RemoveTouch(touch, outOfBoundaries = false){
    if(!this.active)return;
    if(this.touches.has(touch.identifier)){
      this.touches.delete(touch.identifier);
      this.touchesCount--;
      if(this.touchesCount == 0){
        if(!outOfBoundaries && this.upFunc != null){
          this.upFunc(this);
        }
        this.pressed=false;
      }
    }
  }

  SetTint(r=1.0,g=1.0,b=1.0,a=1.0){
    this.tint[0] = r;
    this.tint[1] = g;
    this.tint[2] = b;
    this.tint[3] = a;
  }

  SetAlpha(a){
    this.tint[3] = a;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.renderer = this;

    this.name = this.gameobj.key;
    for(var program of this.programs){
      if(program)
        program.renderers.add(this);
    }

    if(this.button){
      this.gameobj.scene.buttons.add(this);
    }
  }

  Destroy(){
    if(this.button && !input.isDesktop){
      this.startListener.Remove();
      this.endListener.Remove();
    }
    for(var program of this.programs){
      program.renderers.delete(this);
    }
    if(this.button){
      this.gameobj.scene.buttons.delete(this);
    }
    Renderer.hoverSet.delete(this);
  }
}
