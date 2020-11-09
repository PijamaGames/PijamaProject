prefabFactory.AddPrototype("MenuFromStart", new Vec2(5,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
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
    new TextBox(null, "Introduce tu nombre","Introduce youre name", new Vec2(0.4,0.1), true),
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
    })
  ]
});
