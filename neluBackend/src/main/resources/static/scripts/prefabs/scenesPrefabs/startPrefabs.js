prefabFactory.AddPrototype("MenuFromStart", new Vec2(4,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      var nombreUsuario= document.getElementById("userName").value;
      Log(nombreUsuario);
      nombreUsuario=nombreUsuario.trim();
      if(nombreUsuario!=""){
        SendWebSocketMsg({
          event:backendEvents.LOGIN,
          name:nombreUsuario,
        });
      }

    }),
    new TextBox(null, "Entrar","Entry", new Vec2(0.3,0.07), true),
  ]
});

prefabFactory.AddPrototype("GameTitle", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextBox("gameTitle", "Nelu: Lotus Guardian","Nelu: Lotus Guardian", new Vec2(1,0.07), true),
  ]
});

prefabFactory.AddPrototype("introduceName", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextBox("introduceNameText", "Introduce tu nombre","Introduce your name", new Vec2(0.4,0.07), true),
  ]
});

prefabFactory.AddPrototype("nameInputField", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new InputField("userName","","", new Vec2(0.4,0.1)),
    new CustomBehaviour().SetOnCreate(()=>{
      var inputField=document.getElementById("userName");
      if (user) inputField.value=user.name;
    }),
  ]
});

prefabFactory.AddPrototype("wrongName", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextBox("wrongName", "Usuario no disponible","User in use", new Vec2(0.4,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=>{
      obj.textBox.element.hidden = true;
      input.HideVirtualInputs(true);
    })
  ]
});
