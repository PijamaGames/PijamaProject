prefabFactory.AddPrototype("MenuFromStart", new Vec2(4,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      var nombreUsuario= document.getElementById("userName").value;
      nombreUsuario=nombreUsuario.trim();
      if(nombreUsuario!=""){
        SendWebSocketMsg({
          event:backendEvents.LOGIN,
          name:nombreUsuario,
        });
      }

    }),
    new TextBox(null, "Entrar","Entry", new Vec2(0.3,0.1), true),
  ]
});

prefabFactory.AddPrototype("introduceName", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextBox("introduceNameText", "Introduce tu nombre","Introduce youre name", new Vec2(0.4,0.1), true),
  ]
});

prefabFactory.AddPrototype("nameInputField", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new InputField("userName","","", new Vec2(0.4,0.1)),
  ]
});

prefabFactory.AddPrototype("wrongName", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextBox("wrongName", "Usuario no disponible","User in use", new Vec2(0.4,0.1), true),
    new CustomBehaviour().SetOnCreate((obj)=>{
      obj.textBox.element.hidden = true;
      input.HideVirtualInputs(true);
    })
  ]
});
