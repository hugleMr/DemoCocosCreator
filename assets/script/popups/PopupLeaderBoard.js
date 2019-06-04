var Common = require("Common");

cc.Class({
    extends: require("Popup"),

    properties: {
        content : cc.Node,
        itemLeaderBoard : cc.Prefab,
        tab_world : cc.Sprite,
        tab_friend : cc.Sprite,
        frame_tabs : [cc.SpriteFrame]
    },

    init: function () {
        this.tabFriend();
    },

    tabFriend: function(){
        //this.tab_friend.spriteFrame = this.frame_tabs[1];
        //this.tab_world.spriteFrame = this.frame_tabs[0];
        this.getRank(Common.LEADERBOARD_TYPE.FRIEND);
    },

    tabWord: function(){
        //this.tab_friend.spriteFrame = this.frame_tabs[0];
        //this.tab_world.spriteFrame = this.frame_tabs[1];
        this.getRank(Common.LEADERBOARD_TYPE.WORLD);
    },

    getRank : function(type){
        var self = this;
        self.content.removeAllChildren();
        this.showLoading();
        Common.getAllUserRank(10,type,function(response){
            var listPlayers = response.result;
            console.log("listPlayers",listPlayers);
            var count = listPlayers.length > 10 ? 10 : listPlayers.length;
            var contentHeight = 0;
            for(var i = 0; i < count; i++){
                var item = cc.instantiate(self.itemLeaderBoard);
                item.getComponent("ItemLeaderBoard").init(listPlayers[i].name,listPlayers[i].photo,
                    listPlayers[i].score,listPlayers[i].rank,function () {
                        
                    });
                var height = item.getComponent("ItemLeaderBoard").node.height;

                item.setPositionY(-height*1.1*(i + 0.07));
                contentHeight += item.getComponent("ItemLeaderBoard").node.height*1.1;
                self.content.addChild(item);
            }

            self.hideLoading();

            self.content.height = contentHeight;
        });
    }

});
