var Timer = (function(){

  var Timer = EC.Sprite.extend({
    initialize: function (x, y) {
      Timer.superclass.initialize.apply(this, arguments);

      this.x = x || 0;
      this.y = y || 0;

      this.count = 0;
      this._countText = new EC.TextField();
      this._countText.textColor = "#ffffff";
      this._countText.text = '剩余:' + this.count + '次';
      this._countText.size = 26;
      this.addChild(this._countText);
    },
    setCount: function(count) {
      this.count = count;
      this._countText.text = '剩余:' + this.count + '次';
    }
  });

  return Timer;

})();