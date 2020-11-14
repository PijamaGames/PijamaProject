prefabFactory.AddPrototype("CutScene1", new Vec2(20,15), new Vec2(0.5,0.5), false, ()=>{
  return [
      new DialogSystem(dialogLevel1XML).SetOnNextText((obj)=>{
        obj.gameobj.audioSource.PlayAll();
      }).SetOnDialogEnd("t_movimiento", ()=>{
        //lighting.BeginTransition(2);
        manager.LoadScene("singleGame");
      }),
      new AudioSource(["dialogSound"]),
      new VideoRenderer("cutScene1", new Vec2(20,15), 12,false, 16),
      new CustomBehaviour().SetOnCreate(()=>{
        dialogSystem.InitDialog("t_movimiento");
        lighting.SetCurrentLight(1);
        dialogSystem.textBox.transform.SetWorldPosition(new Vec2(0,0.7));
        dialogSystem.textName.transform.SetWorldPosition(new Vec2(-0.3, 0.9));
        dialogSystem.textBox.renderer.SetAlpha(0.0);
        dialogSystem.textName.renderer.SetAlpha(0.0);
        dialogSystem.textBox.textBox.element.style.color = "#000000";
        dialogSystem.textName.textBox.element.style.color ="#000000";
      }),
  ];
});

prefabFactory.AddPrototype("DialogSystem", new Vec2(), new Vec2(), false, ()=>{
  return [
      new DialogSystem(dialogLevel1XML).SetOnNextText((obj)=>{
        obj.gameobj.audioSource.PlayAll();
      }).SetOnDialogEnd("t_movimiento", ()=>{
        //lighting.BeginTransition(2);
      }),
      new AudioSource(["dialogSound"]),
  ];
});

prefabFactory.AddPrototype("PauseFromSingleGame", new Vec2(1.5,1.5), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(11.5,12), new Vec2(1.5,1.5)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene("pause",true);
      manager.SetInMenu(true);
      manager.lastGame="singleGame";
      input.HideVirtualInputs(true);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
      manager.singleGameMusic.PauseAll();
    }),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("SingleLifeText", new Vec2(3,1.5), new Vec2(0.0,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(8.5,12), new Vec2(3,1.5)),
    new TextBox("LifeText", "XHP","XHP", new Vec2(0.3,0.07), true,false),
  ]
});

prefabFactory.AddPrototype("SingleTextBox", new Vec2(14,5), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,16), new Vec2(14,5)),
    new TextBox(null, "","", new Vec2(0.8,0.25), false),
  ]
});
prefabFactory.AddPrototype("SingleNameText", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)),
    new TextBox(null, "","", new Vec2(0.3,0.07), true),
  ]
});
