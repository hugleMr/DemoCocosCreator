
var Common = require("Common");
var AudioManager = require("AudioManager");

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        //123454
        //2233234
        //123asdoljio
    },

    start () {
        //=============
        //sekjdghksljhfgksg
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
