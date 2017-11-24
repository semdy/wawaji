var Utils = (function () {

  var factor = 50;

  var createBitmap = function (res_key, x, y) {
    var bitmap = new EC.BitMap();
    bitmap.x = x || 0;
    bitmap.y = y || 0;
    bitmap.setTexture(RES.getRes(res_key));
    return bitmap;
  };

  var extentP2 = function (value) {
    return value/factor;
  };

  var extentEC = function (value) {
    return value*factor;
  };

  var getP2Pos = function (x, y) {
    return [x/factor, y/factor];
  };

  var getECPos = function (x, y) {
    return [x*factor, y*factor];
  };

  var range = function(min, max, needInt){
    var randomNum = min + Math.random()*(max - min);
    if(needInt) {
      return Math.floor(randomNum);
    } else {
      return randomNum;
    }
  };

  return {
    createBitmap: createBitmap,
    extentP2: extentP2,
    getP2Pos: getP2Pos,
    getECPos: getECPos,
    extentEC: extentEC,
    range: range
  }
})();