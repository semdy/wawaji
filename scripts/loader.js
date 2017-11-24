;(function(window){

  function loadAssets() {
    return new Promise(function(resolve, reject) {
      RES.baseUrl = 'resource/assets/';
      var resConfig = RES.loadJson("resource/res.json");

      resConfig.on("success", function (resData) {

        var loader = RES.loadGroup("preload", resData);
        var appSpin = RES.el('#app_spin');

        loader.on("progress", function (loaded, total) {
          appSpin.innerHTML = "loading: " + Math.floor(loaded / total * 100) + "%";
        });

        loader.on("complete", function () {
          appSpin.style.display = 'none';
          resolve();
        });

      });
    })
  }

  window.loadAssets = loadAssets;
})(window);