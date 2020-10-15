class AudioSource extends Component{
  constructor(names=[]){
    super();
    this.sounds= new Map();
    for (name of names){
      var soundurl=new Howl({ src:[resources.sounds.get(name)]});
      this.sounds.set(name, soundurl);
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.audioSource = this;
  }

  Play(name){
    this.sounds.get(name).play();
  }

  PlayAll(){
    for (var [key,value] of this.sounds){

      this.sounds.get(key).play();
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
    this.sounds.get(name).volume(num);
  }

  ChangeVolAll(num){
    for (var [key,value] of this.sounds){
      this.sounds.get(key).volume(num);
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
