class AudioSource extends Component{
  constructor(names=[], distanceSound=false, soundOnAwake=null){
    super();
    this.type="AudioSource";
    this.sounds= new Map();
    this.ids=new Map();
    for (name of names){
      var soundurl=new Howl({ src:[resources.sounds.get(name)]});
      this.sounds.set(name, soundurl);
    }

    if(soundOnAwake!=null)
      this.Play(soundOnAwake);
    this.maxDistance=15;
    this.minDistance=0;
    this.volume;
    this.lastVol=0;
    this.distanceSound=distanceSound;
    this.soundOnAwake=soundOnAwake;
    this.first=true;
  }

  Destroy(){
  }

  Update(){
    if(this.distanceSound){
      if(this.soundOnAwake!=null && this.first){
        this.Play(this.soundOnAwake);
        this.first=false;
      }

      let player = manager.scene.players.values().next().value;
      if(player){
        this.maxVol=manager.maxVolume;
        this.distance=Vec2.Distance(this.gameobj.transform.GetWorldCenter(),player.transform.GetWorldCenter());
        let normDist=this.distance/this.maxDistance;
        this.volume=((-Math.pow(normDist,3))+1)*this.maxVol;
        this.volume=this.volume<0?0:this.volume;
        //Log(this.volume);
        this.ChangeVolAll(this.volume);

        this.lastVol=this.volume;
      }
    }

  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.audioSource = this;

  }

  Play(name){
    let id=this.sounds.get(name).play();
    this.ids.set(name,id);
  }

  PlayAll(){
    let id;
    for (var [key,value] of this.sounds){
      id=this.sounds.get(key).play();
      this.ids.set(name,id);
    }
  }

  Pause(name){
    this.sounds.get(name).pause();
  }

  PauseAll(){
    for (var [key,value] of this.sounds){

      this.sounds.get(key).pause();
    }
  }

  Stop(name){
    this.sounds.get(name).stop();
  }

  StopAll(){
    for (var [key,value] of this.sounds){
      this.sounds.get(key).stop();
    }
  }

  ChangeVol(name,num){
    Log("cambiado")
    let id=this.ids.get(name);
    this.sounds.get(name).volume(num);
  }

  ChangeVolAll(num){
    let id;
    for (var [key,value] of this.sounds){
      id=this.ids.get(key);
      this.sounds.get(key).volume(num,id);
    }
  }

  Mute(name,bool){
    this.sounds.get(name).mute(bool);
  }

  MuteAll(bool){
    for (var [key,value] of this.sounds){
      this.sounds.get(key).mute(bool);
    }
  }

  Loop(name,bool){
    this.sounds.get(name).loop(bool);
  }
  LoopAll(bool){
    for (var [key,value] of this.sounds){
      this.sounds.get(key).loop(bool);
    }
  }

  Rate(name,num){
    this.sounds.get(name).rate(num);
  }
  RateAll(num){
    for (var [key,value] of this.sounds){
      this.sounds.get(key).rate(num);
    }
  }
  Fade(name,volIni,volFin,duration){
    this.sounds.get(name).fade(volIni,volFin,duration);
  }
  FadeAll(volIni,volFin,duration){
    for (var [key,value] of this.sounds){
      this.sounds.get(key).fade(volIni,volFin,duration);
    }
  }
  Playing(name){
    return this.sounds.get(name).playing();
  }
}
