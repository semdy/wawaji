var AwardItem = (function(){

  var AwardItem = EC.Sprite.extend({
    initialize: function (data) {
      AwardItem.superclass.initialize.call(this);
      this.cacheAsBitmap = true;
      this.data = data;

      var awardItemBg = Utils.createBitmapByName('award_item_bg_png');
      this.addChild(awardItemBg);
      var title = new EC.TextField();
      title.text = (this.data.params || {}).title + " x " + this.data.amount;
      title.textColor = "#762a1d";
      title.size = 28;
      title.bold = true;
      title.x = 190;
      title.y = 75;
      this.addChild(title);
    }
  });

  return AwardItem;

})();