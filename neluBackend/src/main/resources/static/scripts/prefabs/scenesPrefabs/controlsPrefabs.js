
prefabFactory.AddPrototype("MenuFromControls", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene(manager.lastScene);

    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox("ReturnButtonControls", "Volver","Return", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("ControlsTitle", new Vec2(14,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,21), new Vec2(14,2)),
    new TextBox("TitleTextControls", "Controles","Controls", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});
prefabFactory.AddPrototype("ControlsTextBox", new Vec2(14,9), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,0), new Vec2(14,9)).SetTexture("controls"),
    new CustomBehaviour().SetOnCreate((obj)=>{
      ChangeControlImage(obj.renderer);
    }),
  ]
});

function ChangeControlImage(rend){
  if(manager.english && input.isDesktop) rend.SetTile(new Vec2(14,0));
  else if(manager.english && !input.isDesktop) rend.SetTile(new Vec2(14,9));
  else if(!manager.english && input.isDesktop) rend.SetTile(new Vec2(0,0));
  else if(!manager.english && !input.isDesktop) rend.SetTile(new Vec2(0,9));
}
