var Timer = (function(){

  var Timer = EC.Sprite.extend({
    initialize: function (x, y) {
      Timer.superclass.initialize.apply(this, arguments);

      this.x = x || 0;
      this.y = y || 0;

      this.count = 0;
      this._countText = new EC.TextField();
      this._countText.textColor = '#fff';
      this._countText.text = '免费：' + this.count + '次';
      this._countText.size = 26;
      this.addChild(this._countText);

      this._timer = new EC.TextField();
      this._timer.textColor = '#fff';
      this._timer.text = '00: 00: 00';
      this._timer.y = 35;
      this._timer.size = 28;
      this.addChild(this._timer);
    }
  });

  return Timer;

})();