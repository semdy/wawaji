var MainScene = (function(){

  var MainScene = EC.Sprite.extend({
    initialize: function () {
      MainScene.superclass.initialize.apply(this, arguments);

      this.on("addToStage", function () {
        this.addElements();
        this.createButton();
        this.initEvents();
      }, this)
    },
    addElements: function () {
      this.addChild(Utils.createBitmap('bg_png'));
      this.addChild(Utils.createBitmap('main_title_png', 225, 156));
      this.addChild(Utils.createBitmap('button_signin_png', 23, 133));
      this.addChild(Utils.createBitmap('button_gift_png', 648, 126));

      this.noticer = new Noticer(90, 276);
      this.addChild(this.noticer);

      this.timer = new Timer(586, 1196);
      this.addChild(this.timer);

      this.breadScene = new BreadScene(50, 366);
      var mask = new EC.Masker();
      mask.drawRect(-50, 0, this.stage.width, 765);
      this.breadScene.mask = mask;
      this.addChild(this.breadScene);
    },
    createButton: function () {
      this.startButton = new EC.Button({
        normal: {
          texture: 'button_go_png'
        },
        active: {
          texture: 'button_go_0_png'
        }
      });
      this.startButton.x = 213;
      this.startButton.y = 1162;
      this.addChild(this.startButton);
    },
    initEvents: function () {
      this.startButton.on("touch", function(e) {
        this.broadcast("startGame");
      }, this);
      this.startButton.on("touchstart", function(e) {
        e.stopPropagation();
      }, this);
    }
  });

  return MainScene;

})();