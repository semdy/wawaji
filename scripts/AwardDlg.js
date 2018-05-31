var AwardDlg = (function(){

  var AwardDlg = EC.Sprite.extend({
    initialize: function (awardData) {
      AwardDlg.superclass.initialize.apply(this, arguments);
      this.cacheAsBitmap = true;

      this.dataList = awardData || [];
      this.on("addToStage", this.onAddToStage, this);
    },
    onAddToStage: function() {
      var alphaMask = new EC.Shape();
      alphaMask.fill("#000000", .8);
      alphaMask.drawRect(0, 0, this.stage.width, this.stage.height);
      this.addChild(alphaMask);

      var awardSpr = new EC.Sprite();
      awardSpr.cacheAsBitmap = true;
      var awardBg = Utils.createBitmapByName('award_bg_png');
      awardSpr.addChild(awardBg);

      this.hint = new EC.TextField();
      this.hint.text = '你可在个人中心-卡包中查看';
      this.hint.textColor = "#333333";
      this.hint.size = 26;
      this.hint.x = 164;
      this.hint.y = 622;
      awardSpr.addChild(this.hint);

      this.button = new EC.Shape();
      this.button.fill("#000000", 0);
      this.button.drawRect(0, 0, 208, 68);
      this.button.y = 704;
      this.button.x = 228;
      this.button.touchEnabled = true;
      awardSpr.addChild(this.button);
      this.button.on("touch", function () {
        this.dispatch('close');
      }, this);

      this.scrollView = new EC.ScrollView();
      this.scrollView.y = 425;
      this.scrollView.x = 95;
      this.scrollView.width = 474;
      this.scrollView.height = 260;
      awardSpr.addChild(this.scrollView);

      awardSpr.x = 40;
      awardSpr.y = 150;
      awardSpr.anchorX = 0.5;
      awardSpr.anchorY = 0.5;
      awardSpr.scaleX = 0.5;
      awardSpr.scaleY = 0.5;
      this.addChild(awardSpr);

      this.awardSpr = awardSpr;
    },
    setData: function(awardData) {
      this.dataList = awardData;
      this.setScrollViewContent();
    },
    show: function() {
      this.visible = true;
      EC.Tween.get(this.awardSpr).to({scaleX: 1, scaleY: 1}, 500, EC.Easing.Back.Out);
    },
    hide: function() {
      this.awardSpr.scaleX = 0.5;
      this.awardSpr.scaleY = 0.5;
      this.visible = false;
    },
    setScrollViewContent: function() {
      this.scrollView.clearContent();
      this.scrollView.y = this.dataList.length === 1 ? 425 : 375;
      this.hint.y = this.dataList.length === 1 ? 622 : 657;

      var spr = new EC.Sprite();
      this.dataList.forEach(function(item, i){
        var awardItem = new AwardItem(item);
        awardItem.y = (175 + 6) * i;
        spr.addChild(awardItem);
      });
      this.scrollView.setContent(spr);
    }
  });

  return AwardDlg;

})();