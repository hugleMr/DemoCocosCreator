cc.Class({
    extends: cc.Component,

    properties: {
        darkSprite: cc.Sprite,
    },

    onLoad: function () {
        function onTouchDown (event) {
            return true;
        }

        this.node.on('touchstart', onTouchDown, this.darkSprite);
    },
});
