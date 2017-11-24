var Game = (function(){

  var Game = EC.Sprite.extend({
    initialize: function (x, y) {
      Game.superclass.initialize.apply(this, arguments);
      this.x = x || 0;
      this.y = y || 0;

      this.debug = false;
      this.mouseConstraint = null;

      this.on("addToStage", this._onAddToStage, this);
    },
    _onAddToStage: function () {
      this.createWorldSystem();
      this.addElements();
      this.initEvents();
    },
    createWorldSystem: function () {
      //创建world
      this.world = new p2.World({
        gravity: [0, 50]
      });

      //this.world.sleepMode = p2.World.BODY_SLEEPING;
      //this.world.defaultContactMaterial.friction = 1e5;
      this.world.setGlobalStiffness( 1000 );
      //this.world.islandSplit = true;

      // Enable dynamic friction. A bit more expensive than without, but gives more accurate friction
      //this.world.solver.frictionIterations = 10000;
    },
    addElements: function () {

      this.createGround(688, 20, -20, 750, '地面');
      this.createGround(20, 750, -20, 0, '左墙面');
      this.createGround(20, 750, 648, 0, '右墙面');

      var vec1 = [[24, 0],[35, 8],[15, 44],[19, 73],[47, 100],[38, 110],[4, 77],[0, 42]];
      var vec2 = [[14, 7],[24, 0],[47, 42],[47, 76],[7, 112],[0, 100],[32, 73],[33, 45]];

     setTimeout(function(){
        this.constraintBody = this.createGround(50, 50, 120, 350, 'hit_body');
       this.leftPaw = this.createPolygon(vec1, 113, 258, '左臂');
       this.rightPaw = this.createPolygon(vec2, 207, 258, '右臂');
     }.bind(this), 2000);

      this._boxStack = [
        this.createBox('bread01_png', Utils.range(0, 600)),
        this.createBox('bread02_png', Utils.range(0, 600)),
        this.createBox('bread03_png', Utils.range(0, 600)),
        this.createBox('bread04_png', Utils.range(0, 600)),
        this.createBox('bread05_png', Utils.range(0, 600)),
        this.createBox('bread06_png', Utils.range(0, 600))
      ];

      this.hooker = new Hooker();
      this.addChild(this.hooker);

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
    createPolygon: function (vecs, x, y, displayName) {
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
    createBox: function(resId, posX, mass){
      //添加长方形刚体的显示对象
      var display = Utils.createBitmap(resId);
      display.width = display.width*0.5;
      display.height = display.height*0.5;
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
          mass: mass || 0.1,
          position: Utils.getP2Pos((posX || 0) + display.width / 2, display.height / 2),
          angularVelocity: 1,
          type: p2.Body.DYNAMIC
        }
      );

      boxBody.displayName = display.name;
      boxBody.addShape(boxShape);
      this.world.addBody(boxBody);
      //同步display对象和p2对象
      boxBody.displays = [this.debug ? shape : display];
      this.addChild(this.debug ? shape : display);

      return boxBody
    },
    updateDisplay: function () {
      var len = this.world.bodies.length;
      var crBody = this.constraintBody;
      var hooker = this.hooker;
      var leftLeg = this.hooker.leftLeg;
      var rightLeg = this.hooker.rightLeg;
      var paws = this.hooker.paws;
      if(crBody) {
        crBody.position[0] = Utils.extentP2(hooker.x + 87);
        crBody.position[1] = Utils.extentP2(paws.y + 275);
        this.leftPaw.position[0] = Utils.extentP2(hooker.x + leftLeg.vx + leftLeg.vy + 35);
        this.leftPaw.position[1] = Utils.extentP2(paws.y + leftLeg.vy + 320);
        this.rightPaw.position[0] = Utils.extentP2(hooker.x + rightLeg.vx + 135);
        this.rightPaw.position[1] = Utils.extentP2(paws.y + rightLeg.vy + 320);
        this.leftPaw.angle = leftLeg.rotation/180*Math.PI;
        this.rightPaw.angle = rightLeg.rotation/180*Math.PI;
      }

      for(var i=0; i<len; i++){
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
      this.mouseConstraint = new p2.RevoluteConstraint(this.constraintBody, body, {
        worldPivot: [0, 0]
      });
      this.world.addConstraint(this.mouseConstraint);
    },
    removeConstraint: function (){
      this.world.removeConstraint(this.mouseConstraint);
      this.mouseConstraint = null;
    },
    initEvents: function () {
      var isHit = false;
      var crBody = null;

      this.on('enterframe', function() {
        this.world.step(1/60);
        this.updateDisplay();
      }, this);

      this.on("startGame", function(e){
        this.hooker.goDown();
      }, this);

      this.world.on('impact', function(e){
        crBody = this.constraintBody;
        if(crBody) {
          if (!isHit && (e.bodyA === crBody || e.bodyB === crBody)) {
            isHit = true;
            console.log(2)
            this.hooker.stop();
            this.createConstraint(e.bodyA === crBody ? e.bodyB : e.bodyA);
          }
        }
      }, this);

      this.hooker.on('reachup', function(){
        isHit = false;
        console.log(this.mouseConstraint)
        this.removeConstraint();
      }, this)
    }
  });

  return Game;

})();