
var AudioManager = cc.Class({
    extends: cc.Component,

    properties: {
        buttonSound: {
            type: cc.AudioClip,
            default: null,
        }
    },

    statics: {
        instance: null
    },

    playButton (){
        this.play(this.buttonSound);
    },

    play (audioClip){
        if (!audioClip || !this.enableSound){
            return;
        }
        return cc.audioEngine.play(audioClip, false,1);
    },

    onLoad () {
        AudioManager.instance = this;
        this.enableSound = true;
    }
});
