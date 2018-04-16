var Utils = (function () {
  var Utils = {};
  Utils.factor = 50;
  Utils.createBitmapByName = function (name, x, y, w, h) {
    var result = new EC.BitMap();
    result.texture = RES.getRes(name);
    result.x = x || 0;
    result.y = y || 0;
    if (w !== undefined) {
      result.width = w;
    }
    if (h !== undefined) {
      result.height = h;
    }
    return result;
  };
  Utils.extentP2 = function (value) {
    return value / Utils.factor;
  };
  Utils.extentEC = function (value) {
    return value * Utils.factor;
  };
  Utils.getP2Pos = function (x, y) {
    return [x / Utils.factor, y / Utils.factor];
  };
  Utils.getECPos = function (x, y) {
    return [x * Utils.factor, y * Utils.factor];
  };
  Utils.range = function (min, max, needInt) {
    if (needInt === void 0) { needInt = false; }
    var randomNum = min + Math.random() * (max - min);
    var val;
    if (needInt) {
      val = Math.floor(randomNum);
    }
    else {
      val = randomNum;
    }
    return val;
  };
  Utils.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null)
      return decodeURIComponent(r[2]);
    return null;
  };
  Utils.toast = function (msg) {
    if (wx.showToast) {
      wx.showToast({ title: msg });
    }
    else {
      alert(msg);
    }
  };
  Utils.isWeiXin = function () {
    var ua = window.navigator.userAgent;
    if (/MicroMessenger/.test(ua)) {
      return true;
    }
    else {
      return false;
    }
  };
  Utils.isMiniGame = function () {
    var ua = window.navigator.userAgent;
    if (/MicroMessenger\/[\d.\d]+ MiniGame/.test(ua)) {
      return true;
    }
    else {
      return false;
    }
  };
  Utils.showQrcode = function () {
    var qrDialog = document.createElement("div");
    qrDialog.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.8);z-index:20000;';
    qrDialog.innerHTML = '<div style="position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);"><img src="resource/assets/qrcode.png"/></div>';
    document.body.appendChild(qrDialog);
  };
  return Utils;
}());