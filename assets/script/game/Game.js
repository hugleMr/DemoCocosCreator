
var Common = require("Common");
var AudioManager = require("AudioManager");

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        /// xxxxxxxxx
    },

    start () {

    },

    update (dt) {
        
    },

    showPopupLeaderBoard () {
    	Common.showPopup("PopupLeaderBoard",function (popup) {
            popup.init();
            popup.appear(function(){
                
            });
        });

        AudioManager.instance.playButton();
        //////
        /////
    }
});
