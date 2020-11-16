
prefabFactory.AddPrototype("MenuFromCredits", new Vec2(4,2), new Vec2(0.5,0.0), false, ()=>{
  return [
    new ImageRenderer(new Vec2(7,10), new Vec2(4,2)).GiveFunctionality().SetHoverInFunc((obj)=>{
      obj.gameobj.renderer.MultiplyTint(0.8);
    }).SetHoverOutFunc((obj)=>{
      let tint=obj.gameobj.renderer.realTint;
      obj.gameobj.renderer.SetTint(tint[0],tint[1],tint[2]);
    }).SetUpFunc(()=>{
      manager.LoadScene("mainMenu");

    }).SetDownFunc((obj)=>{
      obj.gameobj.audioSource.PlayAll();
    }),
    new TextBox("ReturnButtoncredits", "Menú","Menu", new Vec2(0.3,0.07), true),
    new AudioSource(["UISound1"]),
  ]
});

prefabFactory.AddPrototype("CreditsTitle", new Vec2(14,2), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,21), new Vec2(14,2)),
    new TextBox("TitleTextCredits", "Créditos","Credits", new Vec2(0.3,0.07), true),
  ]
});

prefabFactory.AddPrototype("CreditsTextBox", new Vec2(14,9), new Vec2(0.5,0.5), false, ()=>{
  return [
    new ImageRenderer(new Vec2(0,23), new Vec2(14,9)),
    new ScrollButton("creditsText", "","", new Vec2(0.85,0.55), true),
    new CustomBehaviour().SetOnCreate((obj)=>{
      GetCreditsText();
    }),
  ]
});

function GetCreditsText(){
  var credits = document.getElementById("creditsText");
  let text="";
  text+=manager.english? "<strong>The development team</strong><br><br>": "<strong>Desarrolladores</strong><br><br>";
  text+=manager.english?"Project Leader<br>":"Director de Proyecto<br>";
  text+="PEDRO CASAS MARTÍNEZ<br><br>";
  text+=manager.english?"Programmers<br>":"Programadores<br>";
  text+="PEDRO CASAS MARTÍNEZ<br>";
  text+="ALEJANDRA CASADO CEBALLOS<br><br>";
  text+=manager.english?"Graphics<br>":"Gráficos<br>";
  text+="PEDRO CASAS MARTÍNEZ<br>";
  text+=manager.english?"Audio Director<br>":"Director de Sonido<br>";
  text+="JUAN MANUEL CARRETERO ÁVILA<br><br>";
  text+=manager.english?"Concept Artist<br>":"Artista 2D<br>";
  text+="ADRIÁN VAQUERO PORTILLO<br><br>";
  text+=manager.english?"Screenwriter<br>":"Guionista<br>";
  text+="MARTÍN ARIZA GARCÍA<br><br>";
  text+=manager.english?"Game Designer<br>":"Diseñador de Juego<br>";
  text+="JUAN MANUEL CARRETERO ÁVILA<br>";
  text+=manager.english?"Level Designers<br>":"Diseñadores de Nivel<br>";
  text+="ADRIÁN VAQUERO PORTILLO<br>";
  text+="MARTÍN ARIZA GARCÍA<br><br>";
  text+=manager.english?"Modeling and Animation<br>":"Modelador y Animador<br>";
  text+="IVÁN SANANDRÉS GUTIÉRREZ<br><br>";
  text+=manager.english?"Comunnity Managers<br>":"Redes Sociales<br>";
  text+="JUAN MANUEL CARRETERO ÁVILA<br>";
  text+="IVÁN SANANDRÉS GUTIÉRREZ<br><br>";
  text+=manager.english? "Song Writer<br>": "Compositor<br>";
  text+="NA AGNANT<br>";
  text+="<br><br>";
  text+=manager.english? "Special Thanks<br>": "Agradecimientos<br>";
  text+="NA AGNANT<br>";
  text+="PIPOYA<br>";
  text+="KAUZZ<br>";
  text+="DELSIN53<br>";
  text+="ANSIMUZ<br>";
  text+="SANCTUMPIXEL<br>";
  text+="KEVIN MACLEOD<br>";
  text+="IWIGIA<br>";
  text+="WWF(UK)<br>";
  text+="RAINFOREST FOUNDATION US<br>";
  text+="UPKLYAK<br>";
  text+="ALEKSANDER SHEVCHUK<br>";
  text+="DECODIGO<br>";
  text+="CCCC<br>";
  text+="WIRESTOCK<br>";
  text+="0MELAPICS<br>";
  text+="MICHAEL<br>";

  //FALTAN LOS CREDITOS DE LAS COSAS DE IVAN DE MODELOS Y TEXTURAS

  credits.innerHTML=text;
}
