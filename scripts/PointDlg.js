var PointDlg = (function(){

  var PointDlg = EC.Sprite.extend({
    initialize: function (x, y) {
      PointDlg.superclass.initialize.apply(this, arguments);

      this.on("addToStage", this.onAddToStage, this);
    },
    onAddToStage() {
      var alphaMask = new EC.Shape();
      alphaMask.fill("#000000", .8);
      alphaMask.drawRect(0, 0, this.stage.width, this.stage.height);
      this.addChild(alphaMask);

      var awardSpr = new EC.Sprite();
      awardSpr.x = 70;
      awardSpr.y = 406;

      var awardBg = Utils.createBitmapByName('point_bg_png');
      awardSpr.addChild(awardBg);

      this.button = new EC.Shape();
      this.button.fill("#000000", 0);
      this.button.drawRect(0, 0, 207, 68);
      this.button.y = 430;
      this.button.x = 204;
      this.button.touchEnabled = true;
      awardSpr.addChild(this.button);
      this.button.on("touch", function () {
        this.dispatch('close');
      }, this);


      this.closeBtn = Utils.createBitmapByName('circle-close_png');
      this.closeBtn.x = 273;
      this.closeBtn.y = 590;
      awardSpr.addChild(this.closeBtn);
      this.closeBtn.touchEnabled = true;
      this.closeBtn.on("touch", function () {
        //this.dispatch('close');
        this.visible = false;
      }, this);
      awardSpr.addChild(awardBg);

      this.addChild(awardSpr);
    }
  });

  return PointDlg;

})();