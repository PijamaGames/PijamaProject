var dialogSystem;
class DialogSystem extends Component {
  constructor(xml){
    super();
    this.type = "dialogSystem";
    var rawDialogs = parseXml(xml).root;
    this.dialogs = this.FormatDialogs(rawDialogs);
    this.initDialog = false;
    //this.dialogId = "";
    this.currentDialog = null
    this.currentText = null;
    this.currentDialogLength = 0;
    this.currentDialogCount = 0;
    this.onNextText = function(){};
    this.endDialogEvents = new Map();
    this.onStartDialog = function(){};
    this.onEndDialog = function(){};
  }

  SetOnAnyDialogStart(func){
    this.onStartDialog = func;
    return this;
  }

  SetOnAnyDialogEnd(func){
    this.onEndDialog = func;
    return this;
  }

  SetOnNextText(func){
    this.onNextText = func;
    return this;
  }

  SetOnDialogEnd(dialog, func){
    this.endDialogEvents.set(dialog, func);
    return this;
  }

  Update(){
    /*if(input.GetKeyDown("KeyC")){
      this.InitDialog("interludio_1");
    }*/
    this.fsm.Update();
  }

  InitDialog(id){
    //this.dialogId = id;
    Log(this.dialogs);
    let dialog = this.dialogs.get(id);
    if(!dialog || dialog == null){
      Log("dialog " + id + "does not exist in this xml");
      return;
    }
    Log("init dialog");
    this.onStartDialog();
    this.initDialog = true;
    this.currentDialog = dialog;
    this.currentDialogLength = this.currentDialog.texts.length;
    Log("numTexts: " + this.currentDialogLength);

    /*this.gameobj.scene.paused = true;
    this.textBox.SetActive(true);*/
  }

  CreateFSM(){
    var that = this;
    let disabledNode = new Node("disabled").SetStartFunc(()=>{
      Log("dialog system disabled");
      that.gameobj.scene.paused = false;
      that.textBox.SetActive(false);
      that.textName.SetActive(false);
      that.initDialog = false;
    }).SetEdges([
      new Edge("enabled").AddCondition(()=>that.initDialog && that.currentDialogLength > 0)
    ]);

    let enabledNode = new Node("enabled").SetStartFunc(()=>{
      Log("dialog system enabled");
      that.gameobj.scene.paused = true;
      that.textBox.textBox.SetText("");
      that.textName.textBox.SetText("");
      that.textBox.SetActive(true);
      that.textName.SetActive(true);
      that.currentDialogCount = 0;
    }).SetEdges([
      new Edge("nextText"),
    ]);

    let nextTextNode = new Node("nextText").SetStartFunc(()=>{
      Log("dialog system next text");
      that.clickTrigger = false;
      that.currentText = that.currentDialog.texts[that.currentDialogCount];
      that.textBox.textBox.SetText("");
      //that.textBox.textBox.SetText(manager.english ? that.currentText.message.en : that.currentText.message.es);
      that.textName.textBox.SetText(manager.english ? that.currentText.name.en : that.currentText.name.es);
      that.currentDialogCount++;
      that.onNextText(this);

      that.count = 0;
      that.speed = 0.03;
      that.time = 0.0;


    }).SetUpdateFunc(()=>{
      that.maxCount = manager.english ? that.currentText.message.en.length : that.currentText.message.es.length;
      if(that.count < that.maxCount){
        let msg = manager.english ? that.currentText.message.en : that.currentText.message.es;
        if(input.GetKeyDown("Space", true) || input.clicked){
          input.clicked = false;
          that.count = that.maxCount;
          that.textBox.textBox.SetText(msg);
        } else {
          that.time += manager.delta;
          if(that.time >= that.speed){
            that.time = 0.0;
            that.textBox.textBox.SetText(that.textBox.textBox.text+msg[that.count]);
            that.count+=1;
          }
        }
      }



    }).SetEdges([
      new Edge("nextText").AddCondition(()=>{
        return that.currentDialogCount < that.currentDialogLength &&
        (input.GetKeyDown("Space") || input.clicked) && that.count >= that.maxCount;
      }),
      new Edge("disabled").AddCondition(()=>{
        return that.currentDialogCount >= that.currentDialogLength &&
        (input.GetKeyDown("Space") || input.clicked) && that.count >= that.maxCount;
      }).SetFunc(()=>{
        that.clickTrigger = false;
        Log("end dialog");
        this.onEndDialog();
        Log(dialogSystem.currentDialog);
        if(dialogSystem.endDialogEvents.has(dialogSystem.currentDialog.id)){
          Log("dialog end event");
          dialogSystem.endDialogEvents.get(dialogSystem.currentDialog.id)();
        }
      }),
    ]);

    this.fsm = new FSM([enabledNode, disabledNode, nextTextNode]).Start("disabled");
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.dialogSystem = this;

    this.textBox = prefabFactory.CreateObj("SingleTextBox", new Vec2(0,0.2));
    this.textBox.SetParent(this.gameobj);
    this.textBox.SetActive(false);

    this.textName = prefabFactory.CreateObj("SingleNameText", new Vec2(-0.3,0.4));
    this.textName.SetParent(this.gameobj);
    this.textName.SetActive(false);

    this.CreateFSM();
    dialogSystem = this;
  }

  FormatDialogs(rawDialogs){
    /*if(!Array.isArray(rawDialogs)){
      rawDialogs = [rawDialogs];
    }*/
    Log("DIALOGS");
    rawDialogs = rawDialogs.dialog;
    Log(rawDialogs);
    this.dialogs = new Map();
    for(var d of rawDialogs){
      let texts = [];
      //if(!d.dialog.text) continue;
      if(!Array.isArray(d.text)){
        d.text = [d.text];
      }
      for(var t of d.text){
        texts.push({
          //focus: t.focus.value,
          name : {
            es:t.name.es.value,
            en:t.name.en.value
          },
          message : {
            es: t.message.es.value,
            en: t.message.en.value
          }
        })
      }
      this.dialogs.set(d.id.value, {
        id:d.id.value,
        texts: texts,
      });
    }
    Log(this.dialogs);
    return this.dialogs;
  }
}

//Ref: https://stackoverflow.com/questions/4200913/xml-to-javascript-object
function parseXml(xml, arrayTags)
{
    var dom = null;
    if (window.DOMParser)
    {
        dom = (new DOMParser()).parseFromString(xml, "text/xml");
    }
    else if (window.ActiveXObject)
    {
        dom = new ActiveXObject('Microsoft.XMLDOM');
        dom.async = false;
        if (!dom.loadXML(xml))
        {
            throw dom.parseError.reason + " " + dom.parseError.srcText;
        }
    }
    else
    {
        throw "cannot parse xml string!";
    }

    function isArray(o)
    {
        return Object.prototype.toString.apply(o) === '[object Array]';
    }

    function parseNode(xmlNode, result)
    {
        if (xmlNode.nodeName == "#text") {
            var v = xmlNode.nodeValue;
            if (v.trim()) {
               //result['#text'] = v;
               result.value = v;
            }
            return;
        }

        var jsonNode = {};
        var existing = result[xmlNode.nodeName];
        if(existing)
        {
            if(!isArray(existing))
            {
                result[xmlNode.nodeName] = [existing, jsonNode];
            }
            else
            {
                result[xmlNode.nodeName].push(jsonNode);
            }
        }
        else
        {
            if(arrayTags && arrayTags.indexOf(xmlNode.nodeName) != -1)
            {
                result[xmlNode.nodeName] = [jsonNode];
            }
            else
            {
                result[xmlNode.nodeName] = jsonNode;
            }
        }

        if(xmlNode.attributes)
        {
            var length = xmlNode.attributes.length;
            for(var i = 0; i < length; i++)
            {
                var attribute = xmlNode.attributes[i];
                jsonNode[attribute.nodeName] = attribute.nodeValue;
            }
        }

        var length = xmlNode.childNodes.length;
        for(var i = 0; i < length; i++)
        {
            parseNode(xmlNode.childNodes[i], jsonNode);
        }
    }

    var result = {};
    for (let i = 0; i < dom.childNodes.length; i++)
    {
        parseNode(dom.childNodes[i], result);
    }

    return result;
}
