var Hooker = (function(){
  var Hooker = EC.Sprite.extend({
    initialize: function (x, y) {
      Hooker.superclass.initialize.apply(this, arguments);

      this.x = x || 0;
      this.y = y || 0;
      this._isPushDown = false;
      this._canMove = false;

      this.on("addToStage", this._onAddToStage, this);
    },
    _onAddToStage: function () {

      this.paws = new EC.Sprite();

      this.leftLeg = Utils.createBitmap('left_leg_png', 13, 254);
      this.rightLeg = Utils.createBitmap('right_leg_png', 113, 254);
      this.leftLeg.anchorX = 0.5;
      this.rightLeg.anchorX = 0.5;
      this.leftLeg.vx = 0;
      this.leftLeg.vy = 0;
      this.rightLeg.vx = 0;
      this.rightLeg.vy = 0;
/*      this.leftLeg.alpha = 0;
      this.rightLeg.alpha = 0;*/
      this.paws.addChild(this.leftLeg);
      this.paws.addChild(this.rightLeg);
      this.paws.addChild(Utils.createBitmap('machine_02_png', 23, -400));
      this.addChild(this.paws);
      this.addChild(Utils.createBitmap('machine_top_png'));

      this.initEvents();
    },
    goDown: function() {
      this._isPushDown = true;
      new TWEEN.Tween(this.paws).to({y: 380}, 3000).start().onComplete(function(){
       /* new TWEEN.Tween(this.leftLeg).to({rotation: 120}, 800).start();
        new TWEEN.Tween(this.rightLeg).to({rotation: 30}, 800).start();*/
        setTimeout(this.goUp.bind(this), 800);
      }.bind(this));
      this.openLegs();
    },
    goUp: function () {
      this.closeLegs(function(){
        new TWEEN.Tween(this.paws).to({y: 0}, 3000).start().onComplete(function(){
          //this._isPushDown = false;
        }.bind(this));
      });

    },
    openLegs: function () {
      new TWEEN.Tween(this.leftLeg).to({vx: -30, rotation: 30}, 1200).start();
      new TWEEN.Tween(this.rightLeg).to({vx: 30, vy: -25, rotation: -27}, 1200).start();
    },
    closeLegs: function (callback) {
      new TWEEN.Tween(this.leftLeg).to({vx: 0, rotation: 0}, 1200).start();
      new TWEEN.Tween(this.rightLeg).to({vx: 0, vy: 0, rotation: 0}, 1200).start().onComplete(callback.bind(this));
    },
    initEvents: function(){
      var isLeft = true;
      this.on('enterframe', function() {
        if(this._canMove) {
          if (isLeft) {
            this.x += 2;
          }

          if (!isLeft) {
            this.x -= 2;
          }

          if (this.x > 490) {
            //isLeft = false;
            this.x = 490
          }

          if (this.x <= 0) {
            //isLeft = true;
            this.x = 0;
          }
        }
      });

      this.stage.touchEnabled = true;
      this.stage.on("touchstart", function(e){
        this._canMove = true;
        if(e.stageX > this.stage.width/2) {
          isLeft = true;
        } else {
          isLeft = false;
        }
      }, this);

      this.stage.on("touchend", function(e){
        this._canMove = false;
      }, this);
    }
  });

  return Hooker;

})();