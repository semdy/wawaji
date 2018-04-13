var service;
(function (service) {
  var common = (function () {
    function common() {
    }
    common.doRequest = function (url, data, sucFun, errFun) {
      RES.request.post("" + URLObj.siloHost + url + ".json", Object.assign({ auth: user.getAuthToken() }, data), { processData: false }).then(function (res) {
        if (res.protocError === 0) {
          sucFun(res);
        }
        else {
          if (res.protocError > 700 && res.protocError < 800) {
            auth.refreshUserAuth(function () {
              common.doRequest(url, data, sucFun, errFun);
            });
          }
          else {
            var errMsg = res.errorHint || "\u672A\u77E5\u9519\u8BEF(" + res.protocError + ")";
            errFun(errMsg);
            Utils.toast(errMsg);
          }
        }
      }).catch(function (e) {
        var errMsg = '缃戠粶璇锋眰閿欒';
        errFun(errMsg);
        Utils.toast(errMsg);
      });
    };
    common.request = function (url, data) {
      return new Promise(function (resolve, reject) {
        common.doRequest(url, data, resolve, reject);
      });
    };
    return common;
  }());
  service.common = common;

  var asset = (function () {
    function asset() {
    }
    asset.drop = function () {
      return common.request('/asset/drop/2205', { dropKey: "drop-free-game-ticket" });
    };
    asset.remain = function () {
      return common.request('/asset/remain/2211', { dropKey: "drop-free-game-ticket" });
    };
    asset.exchange = function () {
      return common.request('/asset/exchange/2213', { exchange: "point-to-game-ticket" });
    };
    return asset;
  }());
  service.asset = asset;

  var user = (function () {
    function user() {
    }
    user.getAuthToken = function () {
      return storage.local.get('_authToken');
    };
    return user;
  }());
  service.user = user;

  var game = (function () {
    function game() {
    }
    game.result = function (bundleId) {
      return common.request('/game/result/2215', {
        game: "51021",
        params: {
          option: bundleId
        }
      });
    };
    game.config = function () {
      return common.request('/game/config/2219', {
        game: "51021"
      });
    };
    game.log = function () {
      return common.request('/game/config/2217', {
        game: "51021"
      });
    };
    return game;
  }());
  service.game = game;
})(service || (service = {}));