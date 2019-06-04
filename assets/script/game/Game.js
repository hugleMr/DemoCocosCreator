
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
        //asdlfj;ládkf
        //;jkl;klj
        //l;kalkjdsf;
    },

    update (dt) {
        // ;alsdjf;kl
        //;jklasdf;jkl
        //l;jkasdfl;ji
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
