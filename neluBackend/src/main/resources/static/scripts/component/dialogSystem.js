class DialogSystem extends Component {
  constructor(xml){
    super();
    Log("HEREEEEEEEEE");
    this.type = "dialogSystem";
    var rawDialogs = parseXml(xml).root;
    this.dialogs = this.FormatDialogs(rawDialogs);
    this.initDialog = false;
    //this.dialogId = "";
    this.currentDialog = null
    this.currentText = null;
    this.currentDialogLength = 0;
    this.currentDialogCount = 0;
  }

  Update(){
    if(input.GetKeyDown("KeyC")){
      this.InitDialog("testDialog");
    }
    this.fsm.Update();
  }

  InitDialog(id){
    //this.dialogId = id;
    let dialog = this.dialogs.get(id);
    if(!dialog || dialog == null){
      Log("dialog " + id + "does not exist in this xml");
      return;
    }
    Log("init dialog");
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
      that.textBox.SetActive(true);
      that.textName.SetActive(true);
      that.currentDialogCount = 0;
    }).SetEdges([
      new Edge("nextText"),
    ]);

    let nextTextNode = new Node("nextText").SetStartFunc(()=>{
      Log("dialog system next text");
      that.currentText = that.currentDialog.texts[that.currentDialogCount];
      that.textBox.textBox.SetText(that.currentText.message.es);
      that.textName.textBox.SetText(that.currentText.name.es);
      that.currentDialogCount++;
    }).SetEdges([
      new Edge("nextText").AddCondition(()=>{
        return that.currentDialogCount < that.currentDialogLength &&
        (input.GetKeyDown("Space", true) || input.mouseLeftDown)
      }),
      new Edge("disabled").AddCondition(()=>{
        return that.currentDialogCount >= that.currentDialogLength &&
        (input.GetKeyDown("Space", true) || input.mouseLeftDown)
      })
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

  }

  FormatDialogs(rawDialogs){
    if(!Array.isArray(rawDialogs)){
      rawDialogs = [rawDialogs];
    }
    Log(rawDialogs);
    this.dialogs = new Map();
    for(var d of rawDialogs){
      let texts = [];
      for(var t of d.dialog.text){
        texts.push({
          focus: t.focus.value,
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
      this.dialogs.set(d.dialog.id.value, {
        texts: texts,
      })
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
