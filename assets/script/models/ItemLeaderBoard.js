
cc.Class({
    extends: cc.Component,

    properties: {
        avatar : cc.Sprite,
        user_name : cc.Label,
        user_score : cc.Label,
        user_rank : cc.Label,
        icon_rank : cc.Sprite,
        frame_rank : [cc.SpriteFrame]
    },

    init: function (name,url_photo,score,rank) {
        this.user_name.string = name.split(" ")[0];
        this.user_score.string = score;
        if(rank > 3){
            this.user_rank.string = rank;
        }else{
            this.icon_rank.spriteFrame = this.frame_rank[rank - 1];
        }

        if(url_photo != null){
            var self = this;
            cc.loader.load({url: url_photo, type: 'png'}, function (err, texture) {
                if (err == null) {
                    self.avatar.spriteFrame = new cc.SpriteFrame(texture);
                }
            });
        }
    }
});
