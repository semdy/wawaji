var Noticer = (function(){

  var Noticer = EC.Sprite.extend({
    initialize: function (x, y) {
      Noticer.superclass.initialize.apply(this, arguments);

      this.on("addToStage", this.onAddToStage, this);
    },
    onAddToStage: function() {
      this.noticeText = new EC.TextField();
      this.noticeText.text = '';
      this.noticeText.size = 32;
      this.noticeText.width = 580;
      this.noticeText.textAlign = 'center';
      this.noticeText.textColor = "#fff";
      this.addChild(this.noticeText);
    },
    startChange: function(result) {
      var textfield = this.noticeText;
      var count = -1;
      var change = function () {
        count++;
        if (count >= result.length) {
          count = 0;
        }
        var textFlow = result[count];

        textfield.text = textFlow;
        var tw = EC.Tween.get(textfield);
        tw.to({ alpha: 1 }, 200);
        tw.wait(2000);
        tw.to({ alpha: 0 }, 200);
        tw.call(change, this);
      };

      change();
    }
  });

  return Noticer;

})();