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
      return Math.floor(l1.height) - Math.floor(l2.height);
    });

    //Add layer to parallax program
    manager.graphics.programs.get('parallax').renderers.add(layer);
  }
}
