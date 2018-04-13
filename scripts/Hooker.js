var Hooker = (function(){
  var Hooker = EC.Sprite.extend({
    initialize: function (x, y) {
      Hooker.superclass.initialize.apply(this, arguments);

      this.x = x || 0;
      this.y = y || 0;
      this._canMove = true;

      this.on("addToStage", this._onAddToStage, this);
    },
    _onAddToStage: function () {

      this.paws = new EC.Sprite();
      this.leftLeg = Utils.createBitmapByName('left_leg_png', 13, 254);
      this.rightLeg = Utils.createBitmapByName('right_leg_png', 113, 254);
      this.leftLeg.anchorX = 0.5;
      this.rightLeg.anchorX = 0.5;
      this.leftLeg.vx = 0;
      this.leftLeg.vy = 0;
      this.rightLeg.vx = 0;
      this.rightLeg.vy = 0;
      this.paws.addChild(this.leftLeg);
      this.paws.addChild(this.rightLeg);
      this.paws.addChild(Utils.createBitmapByName('machine_02_png', 23, -400));
      this.addChild(this.paws);

      this.initEvents();
    },
    goDown: function() {
      this.dispatch('godown');
      EC.Tween.get(this.paws).to({y: 380}, 3000).call(function(){
        this.dispatch('reachdown');
        //setTimeout(this.goUp.bind(this), 800);
      }, this);
      this.openLegs();
    },
    goUp: function () {
      this.dispatch('close');
      this.closeLegs(function(){
        this.dispatch('goup');
        EC.Tween.get(this.paws).to({y: 0}, 3000).call(function(){
          setTimeout(function(){
            this.dispatch('reachup');
          }.bind(this), 300);
        }, this);
      });

    },
    stop: function(){
      EC.Tween.removeTweens(this.paws);
    },
    openLegs: function () {
      EC.Tween.get(this.leftLeg).to({vx: -30, rotation: 30}, 1200);
      EC.Tween.get(this.rightLeg).to({vx: 30, vy: -25, rotation: -27}, 1200);
    },
    closeLegs: function (callback) {
      EC.Tween.get(this.leftLeg).to({vx: 0, rotation: 0}, 1200);
      EC.Tween.get(this.rightLeg).to({vx: 0, vy: 0, rotation: 0}, 1200).call(callback, this);
    },
    disable: function () {
      this._canMove = false;
    },
    enable: function () {
      this._canMove = true;
    },
    isEnabled: function () {
      return this._canMove;
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

          if (this.x > 482) {
            isLeft = false;
            this.x = 482
          }

          if (this.x <= 0) {
            isLeft = true;
            this.x = 0;
          }
        }
      });

      this.on("startGame", function(e){
        this.disable();
      }, this);

      this.on("reStartGame", function(e){
        this.enable();
      }, this);

     /* this.stage.touchEnabled = true;
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
      }, this);*/
    }
  });

  return Hooker;

})();