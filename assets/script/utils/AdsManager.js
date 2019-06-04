var Common = require("Common");
var AdsManager = cc.Class({
    extends: cc.Component,

    properties: {
        interstitialID: "",
        rewardVideoID: ""
    },

    statics: {
        instance: null
    },

    onLoad () {
        AdsManager.instance = this;
        this.preloadedInterstitial = null;
        this.preloadedRewardedVideo = null;
    },

    loadInterstitialAd: function() {
        if(!Common.enable){
            return;
        }

        var self = this;
        var supportedAPIs = FBInstant.getSupportedAPIs();
        if (supportedAPIs.includes('getInterstitialAdAsync')) {

            FBInstant.getInterstitialAdAsync(
                self.interstitialID
            ).then(function (interstitial) {
                self.preloadedInterstitial = interstitial;
                return self.preloadedInterstitial.loadAsync();
            }).then(function () {
                console.log('Interstitial success to preload');
            }).catch(function (err) {
                console.log('Interstitial failed to preload: ', err.message);
                self.preloadedInterstitial = null;
            });
        }else{
            console.log("Interstitial is not support");
        }
    },

    loadRewardedVideo: function() {
        if(!Common.enable){
            return;
        }
        var self = this;
        var supportedAPIs = FBInstant.getSupportedAPIs();
        if (supportedAPIs.includes('getRewardedVideoAsync')){
            FBInstant.getRewardedVideoAsync(
                self.rewardVideoID
            ).then(function(rewarded) {
                self.preloadedRewardedVideo = rewarded;
                return self.preloadedRewardedVideo.loadAsync();
            }).then(function() {
                console.log("preloadedRewardedVideo preloaded");
            }).catch(function(err){
                console.log('preloadedRewardedVideo failed to preload: ', err.message);
                self.preloadedRewardedVideo = null;
            });
        }else{
            console.log("RewardedVideo is not support");
        }
    },

    showInterstitialAd: function (callback) {
        if(Common.isNative){
            this.showAdmobInterstitial();
            return;
        }

        if(!Common.enable){
            return;
        }

        var self = this;
        var supportedAPIs = FBInstant.getSupportedAPIs();
        if (supportedAPIs.includes('getInterstitialAdAsync')) {
            if(self.preloadedInterstitial != null){
                self.preloadedInterstitial.showAsync()
                    .then(function() {
                        typeof callback === 'function' && callback();
                        self.loadInterstitialAd();
                    }).catch(function(e) {
                      typeof callback === 'function' && callback();
                    console.error(e.message);
                    self.preloadedInterstitial = null;
                });
            }else{
              typeof callback === 'function' && callback();
              self.loadInterstitialAd();
            }
        }
    },

    showRewardedVideo: function (callback) {
        if(Common.isNative){
            this.showAdmobRewarded();
            return;
        }

        if(!Common.enable){
            return;
        }

        var self = this;
        var supportedAPIs = FBInstant.getSupportedAPIs();
        if (supportedAPIs.includes('getRewardedVideoAsync')){
            if(self.preloadedRewardedVideo != null){
                self.preloadedRewardedVideo.showAsync()
                    .then(function() {
                        typeof callback === 'function' && callback();
                        self.loadRewardedVideo();
                    }).catch(function(e) {
                      console.error(e.message);
                      self.preloadedRewardedVideo = null;
                    });
            }else{
                self.loadRewardedVideo();
            }
        }
    },

    initAdmob: function(callback){
        if(!Common.isNative){
            return;
        }
        var self = this;
        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function(name) {
                if(name == "gameover"){
                }else if(name == "rewarded"){
                }
                self.showInfo('adViewDidReceiveAd name=' + name);
            },
            adViewDidFailToReceiveAdWithError: function(name, msg) {
                self.showInfo('adViewDidFailToReceiveAdWithError name = ' + name + ' msg=' + msg);
                if(name == "gameover"){
                    self.cacheAdmobInterstitial();
                }else if(name == "rewarded"){
                    self.cacheAdmobRewarded();
                }
            },
            adViewWillPresentScreen: function(name) {
                self.showInfo('adViewWillPresentScreen name=' + name);
            },
            adViewDidDismissScreen: function(name) {
                self.showInfo('adViewDidDismissScreen name=' + name);
                if(name == "gameover"){
                    if(callback){
                        self.callback(1);
                    }
                    self.cacheInterstitial();
                }else if(name == "rewarded"){
                    if(callback){
                        self.callback(2);
                    }
                    self.cacheRewarded();
                }
            },
            adViewWillDismissScreen: function(name) {
                self.showInfo('adViewWillDismissScreen=' + name);
            },
            adViewWillLeaveApplication: function(name) {
                self.showInfo('adViewWillLeaveApplication=' + name);
            }
        });
        sdkbox.PluginAdMob.init();
        this.cacheAdmobRewarded();
        this.cacheAdmobInterstitial();
    },

    cacheAdmobInterstitial: function() {
        if(!Common.isNative){
            return;
        }
        sdkbox.PluginAdMob.cache('gameover');
    },

    cacheAdmobRewarded: function() {
        if(!Common.isNative){
            return;
        }
        sdkbox.PluginAdMob.cache('rewarded');
    },

    showAdmobInterstitial: function() {
        if(!Common.isNative){
            return;
        }
        console.log("show admob interstitial");
        sdkbox.PluginAdMob.show('gameover');
    },

    showAdmobRewarded: function() {
        if(!Common.isNative){
            return;
        }
        console.log("show admob reward");
        sdkbox.PluginAdMob.show('rewarded');
    },

    showInfo: function (message) {
        console.log(message);
    }

});
