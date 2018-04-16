var Bread = (function () {

  var Bread = EC.Sprite.extend({
    initialize: function (name) {
      Bread.superclass.initialize.call(this);

      this.name = name;
      this.faceEven = false;

      //添加长方形刚体的显示对象
      var display = Utils.createBitmapByName(this.name);
      display.width *= 0.6;
      display.height *= 0.6;

      this.faceName = this.getFaceName();
      this.face = Utils.createBitmapByName(this.faceName);
      this.face.width = display.width * 0.6;
      this.face.height = display.height * 0.6;
      this.face.x = (display.width - this.face.width) / 2;
      this.face.y = (display.height - this.face.height) / 2;
      this.face.anchorX = 0.5;
      this.face.anchorY = 0.5;

      this.addChild(display);
      this.addChild(this.face);

      this.timer = new EC.Timer(500);
      this.timer.on("timer", function () {
        if (this.faceEven) {
          this.face.$texture = RES.getRes("smile2_png").texture;
        } else {
          this.face.$texture = RES.getRes("smile1_png").texture;
        }
        this.faceEven = !this.faceEven;
      }, this);
    },
    getFaceName: function () {
      var faceNum = 1 + Math.floor(Math.random() * (10 - 1));
      return "face0" + faceNum + "_png";
    },
    smile: function () {
      this.face.$texture = RES.getRes("smile1_png").texture;
      this.face.rotation = -this.rotation;
      this.timer.start();
    },
    cry: function () {
      this.stopSmile();
      this.face.rotation = this.rotation;
      this.face.$texture = RES.getRes(this.faceName).texture;
    },
    stopSmile: function () {
      this.timer.stop();
    }
  });

  return Bread;

})();