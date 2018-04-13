var LoadingUI = (function(){

  var LoadingUI = EC.Sprite.extend({
    initialize: function (x, y) {
      LoadingUI.superclass.initialize.apply(this, arguments);
      this.on("addToStage", this.createView, this);
    },
    createView: function () {
      var bg = Utils.createBitmapByName('loading_pbg_jpg');
      this.addChild(bg);

      var dec = Utils.createBitmapByName('loading_dec_png', 310, 0);
      this.addChild(dec);

      var loadingSpr = new EC.Sprite();
      loadingSpr.x = 134;
      loadingSpr.y = 645;
      var barBg = Utils.createBitmapByName('loading_bg_png');
      loadingSpr.addChild(barBg);

      this.bar = new EC.Sprite();
      this.bar.addChild(Utils.createBitmapByName('loading_bar_png', 9, 7));
      this.barMask = new EC.Masker();
      this.barMask.drawRect(-this.bar.width, 0, this.bar.width, this.bar.height);
      this.bar.mask = this.barMask;
      loadingSpr.addChild(this.bar);

      var loadingText = Utils.createBitmapByName('loading_png', 170, 14);
      loadingSpr.addChild(loadingText);

      this.textField = new EC.TextField();
      loadingSpr.addChild(this.textField);
      this.textField.textColor = "#ffffff";
      this.textField.strokeColor = "#22712a";
      this.textField.stroke = true;
      this.textField.size = 21;
      this.textField.x = 290;
      this.textField.y = 14;
      this.textField.textAlign = "center";
      this.addChild(loadingSpr);
    },
    setProgress: function (current, total) {
      this.textField.text = Math.floor(current / total * 100) + "%";
      this.barMask.x = -this.barMask.width * (1 - current / total);
    }
  });

  return LoadingUI;

})();