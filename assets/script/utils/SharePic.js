
var SharePic = {
    generate: function (playerName, score, playerPhoto,callback) { //playerName,score,playerPhoto,callback
        this.imgList = {};
        this.name = playerName.split(" ")[0];
        this.score = score;
        this.loaderList = 0;
        this.callback = callback;
        this.imgLoader(playerPhoto, "avatar");
        this.imgLoader("./res/raw-assets/resources/share_pic.jpg", "bg")
    },

    imgLoader: function (texture, e) {
        var self = this, image = new Image;
        image.crossOrigin = "anonymous";
        image.src = texture;
        this.loaderList += 1;
        image.onload = function () {
            self.imgList[e] = image;
            self.loadCallback();
        }
    },
    loadCallback: function () {
        this.loaderList -= 1;
        if(this.loaderList === 0){
            this.callback(this.makePic());
        }
    },
    makePic: function () {
        var canvas = document.createElement("canvas");
        canvas.width = 500, canvas.height = 320;
        var e = canvas.getContext("2d");

        e.drawImage(this.imgList.bg, 0, 0, 500, 320);
        e.save();
        e.arc(250, 188, 43, 0, 2 * Math.PI);
        e.clip();
        e.drawImage(this.imgList.avatar, 250 - 43, 188 - 43, 86, 86);
        e.restore();
        e.fillStyle = "white", e.textAlign = "center", e.font = "bold 32px HelveticaNeue";
        e.fillText(this.name, 250, 280);
        e.font = "bold 48px HelveticaNeue";
        e.fillText(this.score, 250, 120);

        return canvas.toDataURL();
    },
};

module.exports = SharePic;
