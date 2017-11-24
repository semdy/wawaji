var Noticer = (function(){

  var Noticer = EC.Sprite.extend({
    initialize: function (x, y) {
      Noticer.superclass.initialize.apply(this, arguments);

      this.x = x || 0;
      this.y = y || 0;
      this.noticeText = new EC.TextField();
      this.noticeText.text = "恭喜xxx获得xxxx一个！";
      this.noticeText.size = 35;
      this.noticeText.width = 580;
      this.noticeText.textAlign = 'center';
      this.noticeText.textColor = '#fff';

      this.addChild(this.noticeText);
    }
  });

  return Noticer;

})();