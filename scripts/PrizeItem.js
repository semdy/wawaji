var PrizeItem = (function(){

  var PrizeItem = EC.Sprite.extend({
    initialize: function (data) {
      PrizeItem.superclass.initialize.call(this);
      this.cacheAsBitmap = true;
      this.data = data;

      var awardItemBg = Utils.createBitmapByName(this.data.key + '_png');
      awardItemBg.width *= 0.5;
      awardItemBg.height *= 0.5;
      awardItemBg.x = 15;
      awardItemBg.y = 23;
      this.addChild(awardItemBg);

      var title = new EC.TextField();
      title.text = this.data.title +  "x" + this.data.amount;
      title.textColor = "#333333";
      title.size = 28;
      title.x = 165;
      title.y = 53;
      this.addChild(title);

      var line = new EC.Shape();
      line.fill("#dddddd");
      line.drawRect(0, 0, 466, 2);
      line.y = 120;
      this.addChild(line);
    }
  });

  return PrizeItem;

})();