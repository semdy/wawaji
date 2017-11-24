;(function(window, EC, undefined){

  var stage;

  function startApp () {
    var canvas = document.getElementById('app');
    stage = new EC.Stage(canvas, {
      scaleMode: 'showAll',
      width: 750,
      height: 1334,
      showFps: true
    });

    stage.showFps({
      right: 0,
      left: "auto",
      top: 0
    });

    createScene();
  }

  function createScene () {
    stage.addChild(new MainScene());
    stage.on("enterframe", function(){
      TWEEN.update();
    });
  }

  loadAssets().then(startApp);

})(window, window.EC);