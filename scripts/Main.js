;(function (window, EC) {

  var MainScene = EC.Sprite.extend({
    initialize: function () {
      MainScene.superclass.initialize.apply(this, arguments);
      this.on("addToStage", this.onAddToStage, this);
    },

    onAddToStage: function () {
      this._openid = Utils.getQueryString('openid');
      this.wxShare();
      this.loadResource().then(function() {
        this._sourceReady = true;
        if (this._authReady) {
          this.runGame();
        }
      }.bind(this));

      auth.launch();
      auth.ready(function() {
        this.AuthReady();
      }.bind(this));

      auth.error(function() {
        Utils.showQrcode();
      }.bind(this));
    },

    AuthReady: function () {
      service.asset.drop();
      service.asset.remain().then(function (res) {
        this.remainAmount = this._getGameAmount(res.remain);
        this._authReady = true;
        if (this._sourceReady) {
          this.runGame();
        }
      }.bind(this));
    },

    _getGameAmount: function (remain) {
      var ret = remain.filter(function (item) {
        return item.config === 'GameTicket#24001';
      });
      if (ret.length)
        return ret[0].amount;
      return 0;
    },

    _genNoticeData: function (logs) {
      return logs.map(function (log) {
        return log.params.nick + "\u83B7\u5F97" + log.params.title + " x " + log.amount;
      });
    },

    runGame: function() {
      this.removeChild(this.loadingView);
      this.createGameScene();
      service.game.log().then(function (gameLogs) {
        this.noticer.startChange(this._genNoticeData(gameLogs.income));
      }.bind(this));

    },

    loadResource: function () {
      var self = this;
      return new Promise(function(resolve, reject) {
        RES.baseUrl = 'resource/';
        var resConfig = RES.loadJson("resource/default.res.json");

        resConfig.on("success", function (resData) {

          var loadingLoader = RES.loadGroup("loading", resData);
          loadingLoader.on("complete", function () {
            self.loadingView = new LoadingUI();
            self.addChild(self.loadingView);

            var loader = RES.loadGroup("preload", resData);
            loader.on("progress", function (loaded, total) {
              self.loadingView.setProgress(loaded, total);
            });

            loader.on("complete", function () {
              resolve();
            });

          });
        });
      });
    },

    getOpenid: function () {
      return this._openid || storage.local.get('_openid');
    },

    wxShare: function () {
      if (!Utils.isMiniGame()) {
        weixinApiService.authorize();
        weixinApiService.exec('onMenuShareTimeline', {
          title: '原麦山丘抓面包抽奖啦！',
          link: URLObj.shareUrl + "/share.html?redirectUri=" + encodeURIComponent(URLObj.weixinAuthUser),
          imgUrl: URLObj.Config.urls.shareIcon,
          success: function (res) {
          },
          cancel: function () {
          },
          fail: function (res) {
            console.info('fail' + JSON.stringify(res));
          }
        });
        weixinApiService.exec('onMenuShareAppMessage', {
          title: '原麦山丘抓面包抽奖啦！',
          desc: '快来试试手气，赢取麦点优惠券！',
          link: URLObj.shareUrl + "/share.html?redirectUri=" + encodeURIComponent(URLObj.weixinAuthUser),
          imgUrl: URLObj.Config.urls.shareIcon,
          success: function () {
          },
          cancel: function () {
          }
        });
      }
    },

    showAward: function (data) {
      this.setChildIndex(this.awardDlg, 100);
      this.awardDlg.setData(data);
      this.awardDlg.show();
    },

    showFail: function () {
      this.setChildIndex(this.failDlg, 100);
      this.failDlg.visible = true;
    },

    hideFail: function () {
      this.failDlg.visible = false;
    },

    showPoint: function () {
      this.setChildIndex(this.pointDlg, 100);
      this.pointDlg.visible = true;
    },

    hidePoint: function () {
      this.pointDlg.visible = false;
    },

    showRule: function () {
      var ruleDlg = new RuleDlg();
      this.addChild(ruleDlg);
    },

    showPrizes: function () {
      if (this.prizeDlg) {
        this.prizeDlg.visible = true;
      }
      else {
        this.giftBtn.touchEnabled = false;
        service.game.config().then(function (res) {
          this.giftBtn.touchEnabled = true;
          this.prizeDlg = new PrizeDlg();
          this.addChild(this.prizeDlg);
          this.prizeDlg.setData(this._genPrizeData(res.income));
        }.bind(this));
      }
    },

    createGameScene: function () {
      this.addElements();
      this.createButton();
      this.initEvents();
    },

    addElements: function () {
      this.addChild(Utils.createBitmapByName('bg_jpg', 0, 0, this.stage.width, this.stage.height));
      this.addChild(Utils.createBitmapByName('main_title_png', 225, 156));

      this.ruleBtn = Utils.createBitmapByName('rule_btn_png', 0, 113);
      this.addChild(this.ruleBtn);
      this.ruleBtn.touchEnabled = true;
      this.ruleBtn.on("touch", function () {
        this.showRule();
      }, this);

      this.giftBtn = Utils.createBitmapByName('gift_btn_png', 648, 106);
      this.addChild(this.giftBtn);
      this.giftBtn.touchEnabled = true;
      this.giftBtn.on("touch", function () {
        this.showPrizes();
      }, this);

      this.noticer = new Noticer(90, 282);
      this.addChild(this.noticer);

      this.timer = new Timer(582, 1216);
      this.timer.setCount(this.remainAmount);
      this.addChild(this.timer);

      this.game = new Game(50, 368);
      var mask = new EC.Masker();
      mask.drawRect(-50, 0, this.stage.width, 765);
      this.game.mask = mask;
      this.addChild(this.game);

      this.addChild(Utils.createBitmapByName('top_roof_png', 0, 196));

      this.awardDlg = new AwardDlg();
      this.awardDlg.visible = false;
      this.addChild(this.awardDlg);

      this.failDlg = new FailDlg();
      this.failDlg.visible = false;
      this.addChild(this.failDlg);

      this.pointDlg = new PointDlg();
      this.pointDlg.visible = false;
      this.addChild(this.pointDlg);
    },
    _genPrizeData: function (data) {
      var ret = [];
      Object.keys(data).forEach(function (name) {
        ret.push({
          key: name,
          amount: data[name][0].amount,
          title: data[name][0].params.title
        });
      });
      return ret;
    },
    createButton: function () {
      this.startButton = new EC.Button({
        normal: {
          texture: 'button_go_png'
        },
        active: {
          texture: 'button_go_0_png'
        }
      });
      this.startButton.x = 213;
      this.startButton.y = 1162;
      this.addChild(this.startButton);
    },
    initEvents: function () {
      this.startButton.on("touch", function (e) {
        if (this.remainAmount > 0) {
          this.broadcast("startGame");
        } else {
          this.showPoint();
        }
      }, this);

      this.game.on("reachup", function () {
        this.remainAmount = Math.max(0, --this.remainAmount);
        this.timer.setCount(this.remainAmount);
      }, this);

      this.awardDlg.on('close', function (e) {
        this.awardDlg.hide();
        this.game.reStart();
      }, this);

      this.failDlg.on('close', function (e) {
        this.hideFail();
        this.startButton.touchEnabled = true;
        this.game.reStart();
      }, this);

      this.pointDlg.on('close', function (e) {
        //用积分兑换游戏券
        this.pointDlg.button.touchEnabled = false;
        service.asset.exchange().then(function (res) {
          this.pointDlg.button.touchEnabled = true;
          this.remainAmount = this._getGameAmount(res.income);
          if (this.remainAmount > 0) {
            this.hidePoint();
            this.timer.setCount(this.remainAmount);
            this.startButton.touchEnabled = true;
            this.game.reStart();
          } else {
            Utils.toast("您当前积分不足，请去商城购物或者通过其它方式获取更多积分");
          }
        }.bind(this));
      }, this);

      document.addEventListener(EC.EVENTS.START, function (e) {
        e.preventDefault();
      }, false);
    }
  });

  function Main() {
    var canvas = document.getElementById('app');
    var stage = new EC.Stage(canvas, {
      scaleMode: 'noBorder',
      width: 750,
      height: 1334,
      showFps: true
    });

    stage.showFps({
      right: 0,
      left: "auto",
      top: 0
    });

    stage.addChild(new MainScene());

    return {
      stage: stage
    }
  }

  window.Main = Main();

})(window, window.EC);