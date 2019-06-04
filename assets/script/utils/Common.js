var Common = {
    enable: false,
    isNative : false,

    LEADERBOARD_TYPE : {
        WORLD : 0,
        FRIEND : 1
    },

    enableWatch : false,
    timeToReward : 0,
    list_stt : ["xxx1", "xxx2"],

    //========== IG common

    LEADER_BOARD : "PicToWord_Leaderboard", 
    LEADER_BOARD_CONTEXT : "PicToWord_Leaderboard_context.",

    getEntryPointData : function(){
        if(!this.enable){
            return;
        }
        return FBInstant.getEntryPointData();
    },

    setData: function (hint,level) {
        if(!this.enable){
            return;
        }

        FBInstant.player.setDataAsync({
            hint  : hint,
            level  : level
        }).then(FBInstant.player.flushDataAsync)
          .then(function() {
              console.log('Data updated to FB!');
          });
    },

    getData: function (callback) {
        if(!this.enable){
            return;
        }

        FBInstant.player.getDataAsync(['hint','level'])
              .then(function(data){
                  var hint = 150;
                  if (typeof data['hint'] !== 'undefined') {
                      hint  = data['hint'];
                      if(hint <= 0){
                          hint = 0;
                      }
                  }
                  var level = 1;
                  if (typeof data['level'] !== 'undefined') {
                    level  = data['level'];
                      if(level < 1){
                        level = 1;
                      }
                  }

                  typeof callback === 'function' && callback({
                      hint: hint,
                      level  : level
                  });
              });
    },

    attackFriend: function(callback) {
        if(!this.enable){
            return;
        }

        var self = this;
        FBInstant.context.chooseAsync().then(function() {
            self.updateContext();
            typeof callback === 'function' && callback({
                contextId : FBInstant.context.getID()
            });
        });
    },

    getAllUserRank: function(maxFetch,type,callback){
        if(!this.enable){
            return;
        }

        FBInstant.getLeaderboardAsync(this.LEADER_BOARD)
              .then(function(leaderboard) {
                  if(type == 0){
                    return leaderboard.getEntriesAsync(maxFetch,0);
                  }else if(type == 1){
                    return leaderboard.getConnectedPlayerEntriesAsync(maxFetch,0);
                  }
              })
              .then(function(entries) {
                  console.log(' entries : ', entries);

                  var list = entries.map(function(entry) {
                      return {
                          rank: entry.getRank(),
                          score: entry.getScore(),
                          photo: entry.getPlayer().getPhoto(),
                          name: entry.getPlayer().getName(),
                          id: entry.getPlayer().getID()
                      }
                  });

                  typeof callback === 'function' && callback({
                      result: list
                  });
              }).catch(function(err){
              console.log('getAllUserRank failed to : ', err.message);
          });
    },

    getPlatform: function () {
        if(!this.enable){
            return;
        }
        return FBInstant.getPlatform(); //("IOS" | "ANDROID" | "WEB" | "MOBILE_WEB")
    },

    checkSupport:function(){
        if(!this.enable){
            return false;
        }
        if (FBInstant.getSupportedAPIs().includes('getInterstitialAdAsync')) {
            return true;
        }
        return false;
    },

    getName : function () {
        if(!this.enable){
            return;
        }
        return FBInstant.player.getName().split(" ")[0];
    },

    getPhoto : function () {
        if(!this.enable){
            return;
        }
        return FBInstant.player.getPhoto();
    },

    getID: function(){
        if(!this.enable){
            return;
        }
        return FBInstant.player.getID();
    },

    updateScore : function (score,callback) {
        if(!this.enable){
            return;
        }

        var self = this;

        FBInstant.getLeaderboardAsync(this.LEADER_BOARD)
              .then(function(leaderboard) {
                  return leaderboard.setScoreAsync(score);
              })
              .then(function(entry) {
                  var score_value = entry ? entry.getScore() : 0;
                  typeof callback === 'function' && callback({
                      score: score_value,
                      rank: entry.getRank()
                  });
              }).catch(function(err){
              console.log(' upload score error : ', err.message);
          });

          var context = FBInstant.context.getID();
          if(context != null ){
              FBInstant.getLeaderboardAsync(this.LEADER_BOARD_CONTEXT + context)
                  .then(function(leaderboard) {
                      return leaderboard.setScoreAsync(score);
                  })
                  .then(function(entry) {
                      console.log("entry : ",entry.getScore());
                      self.updateContext();
                  }).catch(function(err){
                  console.log(' upload context score error : ', err.message);
              });
          }
    },

    updateContext: function() {
        FBInstant.updateAsync({
            action: 'LEADERBOARD',
            name: LEADER_BOARD_CONTEXT + FBInstant.context.getID()
        }).then(() => console.log('Update Posted'))
        .catch(error => console.error(error));
    },

    getUserInfo: function (callback) {
        if(!this.enable){
            return;
        }

        FBInstant.getLeaderboardAsync(this.LEADER_BOARD)
              .then(function(leaderboard) {
                  return leaderboard.getPlayerEntryAsync();
              })
              .then(function(entry) {
                  typeof callback === 'function' && callback({
                      rank: entry.getRank(),
                      score: entry.getScore(),
                      name: FBInstant.player.getName(),
                      photo: FBInstant.player.getPhoto()
                  });
              });
    },

    getConnectedPlayers : function (maxFetched,callback) {
        if(!this.enable){
            return;
        }

        var connectedPlayers = FBInstant.player.getConnectedPlayersAsync(maxFetched,0)
              .then(function(players) {
                  var list = players.map(function(player) {
                      return {
                          id: player.getID(),
                          name: player.getName(),
                          photo: player.getPhoto()
                      }
                  });

                  console.log("players : ",list);
                  typeof callback === 'function' && callback({
                      result: list
                  });
              });
    },

    shareFriends: function (imgBase64,text) {
        if(!this.enable){
            return;
        }

        var self = this;

        FBInstant.shareAsync({
            intent: "REQUEST",
            image: imgBase64,
            text: text || "",
            data: {level: self.level}
        }).then(function () {
            console.log("share successfully!");
        }).catch(function (err) {
            console.log("share fail : ",err.message);
        });
    },

    share: function (score,text) {
        if(!this.enable){
            return;
        }

        var self = this;

        require("SharePic").generate(this.getName(), score, this.getPhoto(),function (imgBase64) {
            self.shareFriends(imgBase64,text);
        });
    },

    askOnFacebookTimeLine : function (game) {
        if(!this.enable){
            return;
        }

        var self = this;
        self.askPic(true,game,function(base64){
            var random = Math.floor(Math.random()*(self.list_stt.length - 1));
            self.shareFriends(base64,self.list_stt[random]);
        });
    },

    askFriend: function (contextId,game) {
        if(!this.enable){
            return;
        }

        var self = this;
        var current_contextID = FBInstant.context.getID();
        if(current_contextID != null){
            self.updateContextToAsk(game);
        }
        FBInstant.context
            .createAsync(contextId)
            .then(function() {
                console.log("context true : ",FBInstant.context.getID());

                self.updateContextToAsk(game);
            }).catch(function(err){
                console.log("context false : ",FBInstant.context.getID());

                console.log('switchAsync failed to : ', err.message);
            });
    },

    sharePassedFriend: function (contextId,level) {
        if(!this.enable){
            return;
        }

        var self = this;

        var current_contextID = FBInstant.context.getID();
        if(current_contextID != null){
            require("SharePic").generate(self.getName(), level, self.getPhoto(),function (imgBase64) {
                self.updateContextToShare(imgBase64,level);
            });
        }
        
        FBInstant.context
            .createAsync(contextId)
            .then(function() {
                console.log("context : ",FBInstant.context.getID());

                require("SharePic").generate(self.getName(), level, self.getPhoto(),function (imgBase64) {
                    self.updateContextToShare(imgBase64,level);
                });
                
            }).catch(function(err){
            console.log('switchAsync failed to : ', err.message);
        });
    },

    inviteFriendToAsk: function (game) {
        if(!this.enable){
            return;
        }

        /*
        {
                filters: ['NEW_CONTEXT_ONLY'],
                minSize: 3,
            }
         */

        var self = this;
        var current_contextID = FBInstant.context.getID();
        if(current_contextID != null){
            self.updateContextToAsk(game);
        }

        FBInstant.context
            .chooseAsync()
            .then(function() {
                console.log("context : ",FBInstant.context.getID());
                self.updateContextToAsk(game);
            }).catch(function(err){
                console.log('chooseAsync failed to : ', err.message);
            });
    },

    inviteFriendToPlay: function(callback){
        if(!this.enable){
            return;
        }

        var self = this;
        
        FBInstant.context
            .chooseAsync()
            .then(function() {
                self.updateContext();
                console.log('chooseAsync contextID : ', FBInstant.context.getID());
            }).catch(function(err){
                if(callback){
                    console.log('chooseAsync failed to : ', err.message);
                    callback();
                }
            });
    },

    updateContextToShare : function (imgBase64,level) {
        var self = this;
        var context = FBInstant.context.getID();
          if(context != null ){
                FBInstant.updateAsync({
                    action: 'CUSTOM',
                    cta: 'Beat It!',
                    image: imgBase64,
                    text: "Hey! " + self.getName() + " just passed you with solved " + level + " questions!",
                    template: 'play_turn',
                    data: {},
                    strategy: 'IMMEDIATE',
                    notification: 'NO_PUSH',
                }).then(function() {
                    console.log('Message was sent successfully');
                });
          }
    },
    
    updateContextToAsk : function (game) {
        var self = this;
        var numberLetter = game.trimText.length;
        var level = self.level;
        if(game.isHelp){
            level = game.currentlevel;
        }

        var random = Math.floor(Math.random()*(self.list_stt.length - 1));

        console.log("context updateContextToAsk : ",FBInstant.context.getID());
        self.askPic(true,game,function(base64){
            FBInstant.updateAsync({
                action: 'CUSTOM',
                cta: 'Solve Level ' + level + '!',
                image: base64,
                text: self.list_stt[random],
                template: 'play_turn',
                data: {level: level},
                strategy: 'IMMEDIATE',
                notification: 'NO_PUSH',
            }).then(function() {
                console.log('Message was sent successfully');
            });
        });
    },

    shareResultToFriend: function(game,callback){
        this.updateContextToSolved(game,callback);
    },

    updateContextToSolved : function (game,callback) {
        var self = this;
        var numberLetter = game.trimText.length;
        var isShared = false;
        var level = self.entryLevel;

        console.log("context updateContextToSolve : ",FBInstant.context.getID());
        self.askPic(false,game,function(base64){
            FBInstant.updateAsync({
                action: 'CUSTOM',
                cta: 'Try it now!',
                image: base64,
                text: "Hey! " + self.getName() + " just solved level " + level + ".",
                template: 'play_turn',
                data: {},
                strategy: 'IMMEDIATE',
                notification: 'NO_PUSH',
            }).then(function() {
                console.log('Message was sent successfully');
                if(!isShared){
                    callback();
                    isShared = true;
                }
            }).catch(function(err){
                if(!isShared){
                    callback();
                    isShared = true;
                }
            });
        });
    },

    //========== Game common

    showPopup: function (name_popup, cb) {
        var scene = cc.director.getScene();
        if(cc.isValid(scene) && !cc.isValid(scene.getChildByName(name_popup))){
            cc.loader.loadRes("prefabs/" + name_popup,function(error, prefab) {
                if(!error){
                    var popupSet = cc.instantiate(prefab);
                    if(cc.isValid(popupSet) && cc.isValid(scene)){
                        popupSet.x = cc.winSize.width / 2;
                        popupSet.y = cc.winSize.height / 2;
                        if(cb) {
                            var compSet = popupSet.getComponent(name_popup);
                            compSet.setNamePopup(name_popup);
                            cb(compSet);
                            scene.addChild(popupSet,1);
                        }
                    }
                }else{
                    console.log("error",error);
                    console.log("Lỗi load popup,thêm popup vào resources.");
                }
            });
        }
    },

    showLoading: function (text){
        var scene = cc.director.getScene();
        if(cc.isValid(scene) && cc.isValid(scene.getChildByName('Canvas').getChildByName("Loading"))){
            console.log("SHOW LOADING");
            var loading = scene.getChildByName('Canvas').getChildByName("Loading");
            loading.active = true;
            loading.opacity = 255;
            if(text){
                loading.getChildByName("label").getComponent(cc.Label).string = text;
            }else{
                loading.getChildByName("label").getComponent(cc.Label).string = "Loading ...";
            }
        }
    },

    hideLoading: function () {
        var scene = cc.director.getScene();
        if(cc.isValid(scene) && cc.isValid(scene.getChildByName('Canvas').getChildByName("Loading"))){
            console.log("HIDE LOADING");
            var loading = scene.getChildByName('Canvas').getChildByName("Loading");
            if(loading.active){
                loading.opacity = 0;
                loading.active = false;
            }
        }
    },

    closePopup: function (name_popup) {
        var scene = cc.director.getScene();
        if(cc.isValid(scene) && cc.isValid(scene.getChildByName(name_popup))){
            scene.getChildByName(name_popup).destroy();
        }
    },

    formatTime: function (duration) {
        var min = Math.floor(duration/60);
        var sec = Math.floor(duration - min*60);

        if(min < 10) min = "0" + min;
        if(sec < 10) sec = "0" + sec;

        return min + ":" + sec;
    },

    testWhite: function(x) {
        var white = new RegExp(/^\s$/);
        return white.test(x.charAt(0));
    },

    isWhiteSpace: function(text) {
        for(var i = 0; i < text.length; i++){
            if(this.testWhite(text.charAt(i))){
                return true;
            }
        }

        return false;
    },

    askPic: function(isAsk,game,callback) {
        var self = this;
        var target = game.initShare(isAsk);

        var width =  538;
        var height = 308;
        var renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target.setPosition(cc.v2(width / 2, height / 2));
        target._sgNode.visit();
        renderTexture.end();

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            var texture = renderTexture.getSprite().getTexture();
            var image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        }
        else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            var buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            var texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            var data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            var rowBytes = width * 4;
            for (var row = 0; row < height; row++) {
                var srow = height - 1 - row;
                var data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                var imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }

        target.destroy();

        ctx.fillStyle = "white", ctx.textAlign = "center", ctx.font = "bold 44px HelveticaNeue";
        ctx.shadowBlur = 2;
        ctx.shadowColor="black";
        ctx.shadowOffsetY = 2;
        if(game.isHelp){
            ctx.fillText(self.entryLevel, 90, 235);
        }else{
            ctx.fillText(self.level, 90, 235);
        }
        
        var image = new Image;
        image.crossOrigin = "anonymous";
        image.src = self.getPhoto();
        image.onload = function () {
            ctx.save();
            ctx.arc(90, 113, 49, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(image, 90 - 49,113 - 49, 98, 98);
            ctx.restore();

            callback(canvas.toDataURL('image/png'));
        }
    }
};

Array.prototype.shuffle = function() {
    var input = this;

    for (var i = input.length-1; i >=0; i--) {

        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

module.exports = Common;