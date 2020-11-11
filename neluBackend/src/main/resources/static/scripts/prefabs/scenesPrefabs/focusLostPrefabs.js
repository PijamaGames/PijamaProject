prefabFactory.AddPrototype("FocusLostTitle", new Vec2(17,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7),
    new TextBox("FocusLostTitle", "Has perdido la conexión","Conexion lost", new Vec2(0.7,0.07), true),
  ]
});

prefabFactory.AddPrototype("StartFromFocusLost", new Vec2(8,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,0), new Vec2(8,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      InitWebSocket();
      manager.LoadScene("start");
    }),
    new TextBox(null, "Reconectar","Reconnect", new Vec2(0.3,0.07), true),
  ]
});
