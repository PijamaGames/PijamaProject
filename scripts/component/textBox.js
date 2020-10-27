class TextBox extends Component {
  constructor(charSpace, lineSpace, tint = new Float32Array([0,0,0]), str = "Hola Mundo!") {
    super();
    Object.assign(this, {
      charSpace,
      lineSpace,
      str,
      tint
    });
    this.displayedChars = [];
    this.type = "textBox";
  }

  SetGameobj(gameobj) {
    this.gameobj = gameobj;
    this.gameobj.textBox = this;

    this.FillPool();
    this.SetText(this.str);
    //this.SetText("H");
    //this.SetText('!"#$%&`()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[ ]^_`abcdefghijklmnopqrstuvwxyz{|}~Çüéâäà0çêëèïîìÄAÉ00ôòûùýÖÜÁÍÓÚ0áíóúñÑªº¿0¬00¡0000 ');
    //this.SetText('¡Hola mundo! Hoy es un gran día para crunchear, bueno en verdad me quiero matar :D 1234567890');
    /*this.SetText(`Lorem ipsum dolor sit amet, eu pro noster petentium conceptam, vel ea audiam noluisse. Cu sea facer utroque nusquam, suas vivendo praesent duo id. In summo disputationi pro. Pri tollit ignota propriae ea, graece prompta perfecto an eum.

Ut solum euismod admodum vel. Ne prompta complectitur quo, ne veri bonorum disputando mel, nec ei nisl quodsi delicatissimi. In perpetua vituperata pro, id per veri tamquam noluisse. At tation invenire nec. At recusabo democritum quo, an saepe tation persecuti vix.

Pro volumus detraxit ne, sed habemus eleifend urbanitas id, iuvaret voluptua accommodare vix ei. Ius nihil putant ea, ei augue commodo sanctus sed. At liber tamquam cotidieque usu. Diceret bonorum nam ne, cum id laudem omnium abhorreant. Esse imperdiet gloriatur ei his, eu quo aperiam offendit.

Et his nusquam vituperata, vix quodsi patrioque ex, sea ad hinc veniam nusquam. Duo oporteat democritum moderatius no. Ut vel agam delenit scribentur, vis et viderer facilisi. Epicurei incorrupte id usu. At quo velit verear antiopam.

Commodo delenit nonumes est an, adhuc patrioque temporibus qui et, viris tritani consetetur id vim. Et discere iudicabit mel, id his nibh inani maiestatis. Cu mei denique voluptua, ut probatus constituam sed, cum vidisse ponderum ex. Liber nihil discere ad nam, duo alterum atomorum ad. Ea quod exerci deterruisset nam. Copiosae accusata pri an.`);*/
    //this.SetText(":(");
  }

  FillPool() {
    this.pool = [];
    let size = this.GetMaxCharacters();
    Log("SIZE: " + size);
    //return;
    let obj;
    for (var i = 0; i < size; i++) {
      obj = prefabFactory.CreateObj('uiTextChar');
      obj.renderer.SetTint(this.tint[0], this.tint[1], this.tint[2]);
      obj.SetParent(this.gameobj);
      obj.SetActive(false);
      this.gameobj.AddChild(obj);
      this.pool.push(obj);
    }
  }

  PoolPop() {
    let obj = this.pool.pop();
    /*if (obj) {
      obj.SetActive(true);
    }*/
    return obj;
    //this.displayedChars.push(obj);
  }

  PoolAdd(obj) {
    if (obj) {
      obj.SetActive(false);
      this.pool.push(obj);
    }
  }

  SetText(str) {
    this.str = str;
    let maxChars = this.GetMaxCharacters();
    if (str.length > maxChars) {
      str = str.slice(0, maxChars);
    }

    this.PrepareDisplayedChars(str);

    let words = str.split(" ");
    let numWords = words.length;

    let initPos = this.gameobj.transform.GetWorldPosPerfect().Copy();
    initPos.Add(new Vec2(-this.gameobj.transform.scale.x*0.5, this.gameobj.transform.scale.y*0.5).Scale(tileSize / manager.graphics.res.y));
    initPos.Sub(this.gameobj.transform.GetWorldPosPerfect());
    initPos.x += 0.03;
    initPos.y -= 0.05;
    //initPos.x *= 1.0/(tileSize*manager.graphics.res.y);
    //initPos.y *= 1.0/(tileSize*manager.graphics.res.y);

    let maxX = this.GetMaxCharsPerLine();
    let maxY = this.GetMaxLines();

    Log("maxX:" + maxX);
    Log("maxY:" + maxY);

    let y = 0;
    let x = 0;
    let i = 0;

    let wordChars;
    let word;
    let charPos = initPos.Copy();
    let lastCharObj = 0;

    let anchor = this.gameobj.transform.anchor;
    let displayedChar;
    while (y < maxY && i < numWords && lastCharObj < maxChars) {
      word = words[i];
      wordChars = word.length;
      if (x + wordChars + 1 < maxX && word != "\n") { //If word fits in current line, write it
        for (var j = 0; j < wordChars; j++) {
          displayedChar = this.displayedChars[lastCharObj];
          displayedChar.transform.SetLocalPosition(charPos);
          displayedChar.transform.anchor.Set(anchor.x, anchor.y);
          displayedChar.SetActive(true);
          displayedChar.renderer.SetTileFromASCII(word[j]);
          //this.displayedChars[lastCharObj].SetActive(true);
          charPos.x += this.charSpace;
          lastCharObj++;
        }
        if (i < numWords - 1) { //Add space behind word
          displayedChar = this.displayedChars[lastCharObj];
          displayedChar.transform.SetLocalPosition(charPos);
          displayedChar.transform.anchor.Set(anchor.x, anchor.y);
          displayedChar.renderer.SetTileFromASCII(' ');
          displayedChar.SetActive(true);
          //this.displayedChars[lastCharObj].SetActive(true);
          charPos.x += this.charSpace;
          lastCharObj++;
        }
        x += wordChars + 1;
        i++;
      } else { //If word does not fit in current line, go to next line
        if (word === "\n") {
          i++;
        }
        x = 0;
        y++;
        charPos.x = initPos.x;
        charPos.y = charPos.y - this.lineSpace;
      }
    }

    return i == numWords;
  }

  PrepareDisplayedChars(str) {
    let numChars = str.length;
    let lastNumChars = this.displayedChars.length;
    Log("diff: "+(numChars - lastNumChars));
    if (numChars > lastNumChars) {
      for (var i = 0; i < numChars - lastNumChars; i++) {
        this.displayedChars.push(this.PoolPop());
      }
    } else if (numChars < lastNumChars) {
      for (var i = 0; i < lastNumChars - numChars; i++) {
        this.PoolAdd(this.displayedChars.pop());
      }
    }
  }

  GetMaxCharacters() {
    return this.GetMaxCharsPerLine() * this.GetMaxLines();
  }

  GetMaxCharsPerLine() {
    let boxWidth = this.gameobj.transform.scale.x*0.5;
    boxWidth = boxWidth / (manager.graphics.res.y / tileSize);
    return Math.floor(boxWidth /* *(tileSize / manager.graphics.res.x)*/ / (this.charSpace * 0.5)) - 1;
  }

  GetMaxLines() {
    let boxHeight = this.gameobj.transform.scale.y*0.5;
    boxHeight /= (manager.graphics.res.y / tileSize);
    return Math.floor(boxHeight /**(tileSize / manager.graphics.res.y)*/ / (this.lineSpace * 0.5));
  }
}
