prefabFactory.AddPrototype("GalleryText", new Vec2(4.0,2), new Vec2(0.5,1.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.3),
    new TextBox(null, "Galería","Gallery", new Vec2(0.3,0.07), true),
  ]
});
prefabFactory.AddPrototype("GoToGallery", new Vec2(5.5,2), new Vec2(1.0,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
      mapEditor.hoverCount++;
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
      mapEditor.hoverCount--;
    }).SetUpFunc((obj)=>{
      manager.LoadScene("gallery", true);
      obj.gameobj.SetScene(manager.scene);
      //obj.gameobj.SetActive(false);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Ver galería","Show gallery", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("CopyBytecode", new Vec2(6.5,2), new Vec2(0.0,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
      mapEditor.hoverCount++;
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
      mapEditor.hoverCount--;
    }).SetUpFunc((obj)=>{

      mapEditor.bytecodeText.select();
      mapEditor.bytecodeText.setSelectionRange(0, 99999);
      document.execCommand("copy");
      Log("bytecode copied");


      //obj.gameobj.SetActive(false);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Copiar escena","Copy scene", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("GameFromGallery", new Vec2(5.5,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(50,0), new Vec2(1,1), 0.7).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.1);
    }).SetHoverOutFunc((obj)=>{
      obj.gameobj.transform.scale.Scale(1.0/1.1);
    }).SetUpFunc((obj)=>{
      manager.LoadScene(mapEditor.currentScene);
    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox(null, "Volver","Return", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});
