var Game = (function(){

  var Game = EC.Sprite.extend({
    initialize: function (x, y) {
      Game.superclass.initialize.apply(this, arguments);
      this.debug = false;
      this.leftPaw = null;
      this.rightPaw = null;
      this.constraintBody = null;
      this.mouseConstraint = null;
      this.target = null;
      this.isCollision = false;
      this.award = [];
      this._boxStack = [];

      this.on("addToStage", this.onAddToStage, this);
    },
    onAddToStage: function () {
      this.createWorldSystem();
      this.addElements();
      this.initEvents();
    },
    createWorldSystem: function () {
      //创建world
      this.world = new p2.World({
        gravity: [0, 35]
      });

      //this.world.sleepMode = p2.World.BODY_SLEEPING;
      this.world.defaultContactMaterial.friction = 0.5;
      this.world.setGlobalStiffness( 1000 );

      //this.world.solver.frictionIterations = 10000;
    },
    addElements: function () {

      this.createGround(688, 20, -20, 750, '地面');
      this.createGround(20, 950, -20, -200, '左墙面');
      this.createGround(20, 950, 648, -200, '右墙面');

      this.hooker = new Hooker();
      this.addChild(this.hooker);

      this.reStart();

    },
    reStart: function () {
      this.isCollision = false;
      this.target = null;
      this.award = [];

      this.removeConstraint();

      var self = this;
      var breadArgs = [
        { resId: "bread01_png", bundleId: 'bread01' }, { resId: "bread02_png", bundleId: 'bread02' },
        { resId: "bread03_png", bundleId: 'bread03' }, { resId: "bread04_png", bundleId: 'bread04' },
        { resId: "bread05_png", bundleId: 'bread05' }, { resId: "bread06_png", bundleId: 'bread06' },
        { resId: "bread07_png", bundleId: 'bread07' }, { resId: "bread08_png", bundleId: 'bread08' },
        { resId: "bread09_png", bundleId: 'bread09' }, { resId: "bread10_png", bundleId: 'bread10' }
      ];

      this.clearBodies();

      breadArgs.forEach(function (arg, i) {
        setTimeout(function(){
          self._boxStack.push(self.createBread(arg, Utils.range(100, 500)));
        }, i * 100);
      });

      //待所有面包都掉落了再移动抓子
      setTimeout(() => {
        this.hooker.dispatch('reStartGame');
      }, 2000);
    },
    createConstraintBody: function () {
      var vec1 = [[24, 0],[35, 8],[15, 44],[19, 73],[47, 100],[38, 110],[4, 77],[0, 42]];
      var vec2 = [[14, 7],[24, 0],[47, 42],[47, 76],[7, 112],[0, 100],[32, 73],[33, 45]];
      if(!this.constraintBody) {
        this.constraintBody = this.createGround(50, 10, 120, 350, 'hit_body');
      }
      this.leftPaw = this.createPaw(vec1, 113, 258, '左臂');
      this.rightPaw = this.createPaw(vec2, 207, 258, '右臂');
    },
    createGround: function (w, h, x, y, displayName) {
      var p2body = new p2.Body(
        { mass: 1
          , position: Utils.getP2Pos(x + w / 2, y + h / 2)
          , type: p2.Body.STATIC
        }
      );
      p2body.displayName = displayName;
      this.world.addBody( p2body );

      var p2box = new p2.Box(
        {
          width: Utils.extentP2( w ),
          height: Utils.extentP2( h )
        }
      );
      p2body.addShape( p2box );

      if(this.debug) {
        var shape = new EC.Shape();
        shape.fill('#00000');
        shape.drawRect(0, 0, w, h);
        shape.anchorX = shape.anchorY = .5;
        p2body.displays = [shape];

        this.addChild(shape);
      } else {
        p2body.displays = [];
      }

      return p2body;
    },
    createPaw: function (vecs, x, y, displayName) {
      var convex = new EC.Shape();
      convex.fill('#00000');
      convex.x = x;
      convex.y = y;
      convex.moveTo(vecs[0][0], vecs[0][1]);
      convex.lineTo(vecs.slice(1));
      convex.close();
      convex.anchorX = convex.anchorY = .5;

      var concaveBody = new p2.Body({
        mass: 0,
        position: Utils.getP2Pos(x + convex.width/2, y + convex.height/2),
        type: p2.Body.STATIC
      });

      var p2vecs = vecs.map(function(item){
        return Utils.getP2Pos(item[0], item[1]);
      });

      concaveBody.displayName = displayName;
      concaveBody.fromPolygon(p2vecs);
      this.world.addBody(concaveBody);

      if(this.debug) {
        concaveBody.displays = [convex];
        this.addChild(convex);
      } else {
        concaveBody.displays = [];
      }

      return concaveBody;
    },
    createBread: function(arg, startX, mass){
      if (startX === undefined) { startX = 0; }
      if (mass === undefined) { mass = 2; }

      //添加长方形刚体的显示对象
      var display = new Bread(arg.resId);

      //面包开始掉落的初始位置
      var startY = -display.height;
      display.anchorX = 0.5;
      display.anchorY = 0.5;

      var shape = new EC.Shape();
      shape.anchorX = 0.5;
      shape.anchorY = 0.5;
      shape.fill('green');
      shape.drawRect(0, 0, display.width, display.height);

      //添加长方形刚体
      var boxShape = new p2.Box(
        {
          width: Utils.extentP2(display.width),
          height: Utils.extentP2(display.height)
        }
      );

      var boxBody = new p2.Body(
        {
          mass: mass,
          position: Utils.getP2Pos(startX + display.width / 2, startY),
          angularVelocity: 1,
          type: p2.Body.DYNAMIC
        }
      );

      boxBody.displayName = arg.resId;
      boxBody.bundleId = arg.bundleId;
      boxBody.addShape(boxShape);
      this.world.addBody(boxBody);
      //同步display对象和p2对象
      boxBody.displays = [this.debug ? shape : display];
      this.addChild(this.debug ? shape : display);

      return boxBody
    },
    removePaws: function () {
      if(this.leftPaw) {
        this.world.removeBody(this.leftPaw);
      }
      if(this.rightPaw) {
        this.world.removeBody(this.rightPaw);
      }
      this.leftPaw = null;
      this.rightPaw = null;
    },
    clearBodies: function () {
      this.removePaws();

      if(this.constraintBody) {
        this.world.removeBody(this.constraintBody);
        this.constraintBody = null;
      }

      this._boxStack.forEach(function(body){
        this.world.removeBody(body);
      }.bind(this));

      this._boxStack = [];
    },
    updateDisplay: function () {
      var len = this.world.bodies.length;
      var crBody = this.constraintBody;
      var hooker = this.hooker;
      var leftLeg = this.hooker.leftLeg;
      var rightLeg = this.hooker.rightLeg;
      var paws = this.hooker.paws;
      var leftPaw = this.leftPaw;
      var rightPaw = this.rightPaw;

      if(crBody ) {
        crBody.position[0] = Utils.extentP2(hooker.x + 87);
        crBody.position[1] = Utils.extentP2(paws.y + 295);
        if(leftPaw && rightPaw) {
          leftPaw.position[0] = Utils.extentP2(hooker.x + leftLeg.vx + leftLeg.vy + 35);
          leftPaw.position[1] = Utils.extentP2(paws.y + leftLeg.vy + 320);
          rightPaw.position[0] = Utils.extentP2(hooker.x + rightLeg.vx + 135);
          rightPaw.position[1] = Utils.extentP2(paws.y + rightLeg.vy + 320);
          leftPaw.angle = leftLeg.rotation / 180 * Math.PI;
          rightPaw.angle = rightLeg.rotation / 180 * Math.PI;
        }
      }

      for(var i = 0; i < len; i++) {
        var boxBody = this.world.bodies[i];
        var display = boxBody.displays[0];
        if (display) {
          display.x = -display.width/2 + Utils.extentEC(boxBody.position[0]);
          display.y = -display.height/2 + Utils.extentEC(boxBody.position[1]);
          display.rotation = boxBody.angle * 180 / Math.PI;
          //碰撞检测处于睡眠状态时加半透明标志一下
          if(this.debug) {
            if (boxBody.sleepState === p2.Body.SLEEPING) {
              display.alpha = 0.5;
            }
            else {
              display.alpha = 1;
            }
          }
        }
      }
    },
    createConstraint: function (body){
      var crBody = this.constraintBody;
      this.mouseConstraint = new p2.RevoluteConstraint(crBody, body, {
        worldPivot: [crBody.position[0], crBody.position[1]]
      });
      this.world.addConstraint(this.mouseConstraint);
    },
    removeConstraint: function (){
      this.world.removeConstraint(this.mouseConstraint);
      this.mouseConstraint = null;
    },
    release: function() {
      this.removeConstraint();
      this.removePaws();
      if (this.target) {
        this.target.displays[0].cry();
      }
    },
    showResult: function (target) {
      if (target) {
        target.displays[0].stopSmile();
        console.log(target.displayName, target.bundleId);
      } else {
        console.log('未抓到任何面包');
      }
      if (this.award.length > 0) {
        this.parent.showAward(this.award);
      } else {
        this.parent.showFail();
      }
    },
    getGameResult: function(target) {
      service.game.result(target ? target.bundleId : "").then(function (res) {
        this.award = res.income || [];
        this.hooker.goUp();
        //如果有抓中
        if (target) {
          //给抓中的面包一个笑脸
          target.displays[0].smile();
          //如果没有中奖，则给个概率是在底部释放还是抓子升起一半时释放
          if (this.award.length === 0) {
            if (Math.random() > .2) {
              setTimeout(() => {
                this.release();
              }, 2500);
            } else {
              this.release();
            }
          }
        }
      }.bind(this));
    },
    initEvents: function () {
      var crBody = null;

      this.on('enterframe', function() {
        this.world.step(1/60);
        this.updateDisplay();
      }, this);

      this.on("startGame", function(e){
        if (this.hooker.isEnabled()) {
          this.hooker.goDown();
          this.hooker.dispatch('startGame');
        }
      }, this);

      this.world.on('impact', function(e){
        crBody = this.constraintBody;
        if(crBody) {
          if (!this.isCollision && (e.bodyA === crBody || e.bodyB === crBody)) {
            this.isCollision = true;
            this.target = e.bodyA === crBody ? e.bodyB : e.bodyA;
            this.hooker.stop();
            this.createConstraint(this.target);
            this.dispatch('catch');
            console.log('hit -> ' + this.target.displayName);
          }
        }
      }, this);

      this.world.on('removeBody', function(e){
        var displays = e.body.displays;
         for(var i = 0; i<displays.length; i++){
           this.removeChild(displays[i]);
         }
      }, this);

      this.on('catch', function () {
        this.getGameResult(this.target);
      }, this);

      this.hooker.on('godown', function () {
        //钩子下降时创建爪子刚体
        this.createConstraintBody();
      }, this);

      //钩子下降到最底部
      this.hooker.on('reachdown', function () {
        this.getGameResult(null);
      }, this);

      this.hooker.on('goup', function(){
        //移除爪子刚体，防止其它面包被托起
        this.removePaws();
        //创建爪子，稳固已抓到的面包
        setTimeout(this.createConstraintBody.bind(this), 1000);
      }, this);

      this.hooker.on('reachup', function(){
        this.removePaws();
        this.showResult(this.target);
        this.dispatch('reachup');
      }, this);
    }
  });

  return Game;

})();