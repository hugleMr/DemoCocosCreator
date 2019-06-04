var Common = require("Common");
var AudioManager = require("AudioManager");

cc.Class({
    extends: cc.Component,

    properties: {
        bg_dark: cc.Sprite,
        background: cc.Sprite,
        loading : cc.Node,
        btn_close: cc.Button
    },

    // use this for initialization
    onLoad: function () {
        function onTouchDown (event) {
            return true;
        }

        this.node.on('touchstart', onTouchDown, this.bg_dark);
    },

    disappear:function () {
        var name = this.name;
        AudioManager.instance.playButton();

        var self = this;
        var callDisappear = cc.callFunc(function(){
            if(self.callbackClose != null){
                self.callbackClose();
            }
            Common.closePopup(name);
        },this);

        this.bg_dark.node.runAction(cc.fadeOut(0.05));
        var move = cc.scaleTo(0.1,0.1).easing(cc.easeBackIn());
        var fade = cc.fadeOut(0.1);
        var action = cc.spawn(move,fade);
        this.background.node.runAction(cc.sequence(action,callDisappear));
    },

    showLoading : function(){
        this.deltaTime = 0;
        this.startLoading = false;
        this.loading.opacity = 0;
        this.loading.rotation = 0;
    },

    hideLoading : function(){
        this.deltaTime = 0;
        this.startLoading = true;
        this.loading.stopAllActions();
        this.loading.opacity = 0;
        this.loading.rotation = 0;
    },

    update : function(dt){
        if(!this.startLoading){
            this.deltaTime += dt;
            if(this.deltaTime > 0.25) {
                this.startLoading = true;
                this.loading.opacity = 255;
                var action = cc.repeatForever(cc.rotateBy(1,360));
                this.loading.runAction(action);
            }
        }
    },

    setNamePopup: function (name) {
        this.name = name;
    },

    appear:function (callbackClose) {
        this.callbackClose = callbackClose;

        var background = this.background;
        var self = this;

        function onTouchDown (touch,event) {

            var locationInNode = background.node.convertToNodeSpace(touch.getLocation());

            var rect = background.spriteFrame.getRect();

            if (!cc.rectContainsPoint(rect,locationInNode)){
                self.disappear();
                return true;
            }
            return false;
        }

        this.node.on('touchstart', onTouchDown, background);

        this.bg_dark.node.runAction(cc.fadeTo(0.15,220));

        this.background.node.setScale(0.2);

        var action = cc.scaleTo(0.4,1).easing(cc.easeBackOut());
        this.background.node.runAction(cc.sequence(action,cc.callFunc(function(){
            //this.background.node.runAction(cc.sequence(cc.scaleTo(0.1,0.9),action.clone()));
        },this)));
    }
});