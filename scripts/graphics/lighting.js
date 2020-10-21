var lighting;
class Lighting{
  constructor(){
    lighting = this;
    this.ambientLight = new Float32Array([0.2, 0.2, 0.6, 1.0]);

    //Sun
    this.sunTemperature = 0.5;
    this.sunStrength = 1.0;
    this.lightBlurChannels = new Float32Array([0.2,3.0,0.0,0.0]);

    //Shadows
    this.shadowBlur = 0.2;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.shadowStrength = 2.5;
    this.shadowLength = -0.3;
    this.minShadowLength = -0.5;
    this.verticalShadowStrength = 0.12;

    //Point lights
    this.lightSources = new Set();
    this.currentLightSource = null;
    this.SetNight();
    //this.SetMorning();
  }

  SetDefaultSun(){
    this.shadowBlur = 0.2;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.shadowStrength = 2.5;
    this.shadowLength = /*-0.5*//*3.0*/-0.3;
    this.minShadowLength = -5.0;
    this.verticalShadowStrength = 0.12;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.SetAmbientLight(0.2, 0.2, 0.6);
    this.SetLightBlurChannels(0.2,3.0);
  }

  SetMorning(){
    this.sunTemperature = 0.48;
    this.shadowBlur = 0.5;
    this.shadowStrength = 2.8;
    this.shadowLength = 1.2;
    this.sunStrength = 0.8;
    this.shadowBlurE0 = 0.1;
    this.shadowBlurE1 = 1.0;
    this.SetAmbientLight(0.2,0.2,0.4);
    this.SetLightBlurChannels(0.25,3.0);
    Log("Morning lighting")
  }

  SetNoon(){
    this.sunTemperature = 0.55;
    this.shadowBlur = 0.1;
    this.shadowStrength = 2.5;
    this.shadowLength = -0.9;
    this.sunStrength = 0.9;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.SetAmbientLight(0.22,0.22,0.22);
    this.SetLightBlurChannels(0.2,3.0);
    Log("Noon lighting");
  }

  SetAfterNoon(){
    this.sunTemperature = 0.7;
    this.shadowBlur = 0.07;
    this.shadowStrength = 2.35;
    this.shadowLength = 2.0;
    this.sunStrength = 0.96;
    this.shadowBlurE0 = 0.075;
    this.shadowBlurE1 = 0.85;
    this.SetAmbientLight(0.225,0.2,0.3);
    this.SetLightBlurChannels(0.2,3.0);
    Log("Afternoon lighting");
  }

  SetNight(){
    this.sunTemperature = 0.0;
    this.shadowBlur = 0.4/*0.0*/;
    this.shadowStrength = 1.0;
    this.shadowLength = 0.0;
    this.sunStrength = 0.3;
    this.shadowBlurE0 = 0.0;
    this.shadowBlurE1 = 0.85;
    this.SetAmbientLight(0.3,0.3,0.4);
    this.SetLightBlurChannels(0.3,3.0);
    Log("Night lighting");
  }

  SetAmbientLight(r=0.5,g=0.5,b=0.5){
    this.ambientLight[0] = r;
    this.ambientLight[1] = g;
    this.ambientLight[2] = b;
  }

  SetLightBlurChannels(r=0,g=0,b=0){
    this.lightBlurChannels[0] = r;
    this.lightBlurChannels[1] = g;
    this.lightBlurChannels[2] = b;
  }

  SetSunTemperature(temp) {
    if(temp < 0.0) temp = 0.0;
    else if (temp > 1.0) temp = 1.0;
    this.sunTemperature = temp;
  }

  SetShadowLength(shadowLength) {
    this.shadowLength = shadowLength;
    if (this.shadowLength < this.minShadowLength) this.shadowLength = this.minShadowLength;
  }
}
