
prefabFactory.AddPrototype("Entrar", new Vec2(5,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc(()=>{
      var nombreUsuario= document.getElementById("myText").value;
      manager.LoadScene("mainMenu");
      document.getElementById("myText").hidden=true;
      Log(nombreUsuario);

    }),
    new TextBox(0.025, 0.07, [0.1,0.1,0.3], "Entrar"),
  ]
});
