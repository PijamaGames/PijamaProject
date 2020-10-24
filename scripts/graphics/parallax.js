class Parallax{
  constructor(){
    this.layers = [];
  }

  AddLayer(_position, _height, _scale, _texture){
    let layer = {
      position:_position,
      height:_height,
      scale:_scale,
      texture:resources.textures.get(_texture),
      active:true,
    };

    this.layers.push(layer);

    //Sort layers by height in order to paint them properly
    this.layers.sort((l1,l2)=>{
      if(l1.height < l2.height){
        return -1;
      } else if(l1.height > l2.height){
        return 1;
      }
      return 0;
    });

    //Add layer to parallax program
    manager.graphics.programs.get('parallax').renderers.set(_height, layer);
  }
}
