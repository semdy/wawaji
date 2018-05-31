var PrizeDlg = (function(){

  var PrizeDlg = EC.Sprite.extend({
    initialize: function (x, y) {
      PrizeDlg.superclass.initialize.apply(this, arguments);
      this.cacheAsBitmap = true;

      this.on("addToStage", this.onAddToStage, this);
    },
    onAddToStage: function() {
      var alphaMask = new EC.Shape();
      alphaMask.fill("#000000", .8);
      alphaMask.drawRect(0, 0, this.stage.width, this.stage.height);
      alphaMask.touchEnabled = true;
      this.addChild(alphaMask);

      var awardSpr = new EC.Sprite();
      awardSpr.cacheAsBitmap = true;
      awardSpr.x = 70;
      awardSpr.y = 406;

      var awardBg = Utils.createBitmapByName('price_bg_png');
      awardSpr.addChild(awardBg);

      this.closeBtn = Utils.createBitmapByName('circle-close_png');
      this.closeBtn.x = 273;
      this.closeBtn.y = 590;
      awardSpr.addChild(this.closeBtn);
      this.closeBtn.touchEnabled = true;
      this.closeBtn.on("touch", function () {
        this.visible = false;
      }, this);
      awardSpr.addChild(awardBg);

      this.scrollView = new EC.ScrollView();
      this.scrollView.y = 154;
      this.scrollView.x = 90;
      this.scrollView.width = 466;
      this.scrollView.height = 300;
      awardSpr.addChild(this.scrollView);

      this.addChild(awardSpr);
    },
    setData: function(data) {
      this.dataList = data;
      this.setScrollViewContent();
    },
    setScrollViewContent: function() {
      var spr = new EC.Sprite();
      this.dataList.forEach(function(item, i) {
        var prizeItem = new PrizeItem(item);
        prizeItem.y = 110 * i;
        spr.addChild(prizeItem);
      });
      this.scrollView.setContent(spr);
    }
  });

  return PrizeDlg;

})();