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
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Entrar","Enter", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("FullScreenText", new Vec2(14,2), new Vec2(0.5,1.0), false, ()=>{
  return [
    //new ImageRenderer(new Vec2(0,21), new Vec2(14,2)),
    new TextBox("introduceNameText", "Juega en pantalla completa para una mejor experiencia","Play in fullscreen mode for a better experience", new Vec2(0.6,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=>{

      if(input.isDesktop){
        obj.Destroy();
      }
    })
  ]
});

prefabFactory.AddPrototype("PubliPortfolio", new Vec2(15,3.5), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,0), new Vec2(15,3.5)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();

      /*TEST*/
      var win = window.open("https://pijamagames.github.io/", '_blank');
      if(win && win!=null){
        win.focus();
      }
    }).SetTexture("ad1"),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("GameTitle", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextBox("gameTitle", "Nelu: Lotus Guardian","Nelu: Lotus Guardian", new Vec2(1,0.07), true),
  ]
});

prefabFactory.AddPrototype("introduceName", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextBox("introduceNameText", "Introduce tu nombre","Enter your name", new Vec2(0.4,0.07), true),
  ]
});

prefabFactory.AddPrototype("nameInputField", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new InputField("userName","","", new Vec2(0.4,0.1)),
    new CustomBehaviour().SetOnCreate(()=>{
      var inputField=document.getElementById("userName");
      if (user) inputField.value=user.name;
      else {
        let savedUser = localStorage.getItem("userName");
        if(savedUser && savedUser != null){
          inputField.value = savedUser;
        }
      }

    }),
  ]
});

/*prefabFactory.AddPrototype("MenuMusic", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new AudioSource(["menuSound"]),
  ]
});*/

prefabFactory.AddPrototype("wrongName", new Vec2(), new Vec2(0.5,0.5), false, ()=>{
  return [
    new TextBox("wrongName", "Usuario no disponible","User in use", new Vec2(0.4,0.07), true),
    new CustomBehaviour().SetOnCreate((obj)=>{
      obj.textBox.element.hidden = true;
      input.HideVirtualInputs(true);
    })
  ]
});
