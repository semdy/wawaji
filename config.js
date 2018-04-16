var URLObj = (function () {
  var URLObj = {
    urlHost: "@@urlHost",
    siloHost: "@@siloHost",
    shareUrl: "@@shareUrl",
    weixinapiURL: "@@weixinapiURL",
    weixinAuthUser : "@@weixinAuthUser",
    Config: {
      urls: {
        userinfo: '/usercenter/user/info',
        buyrecord: '/user/buy/record/get',
        shareReward: '/user/reward/share/151',
        authToken: '/silo/user/auth/create',
        shareIcon: 'http://www.zaofans.com/OrderUI-wheat/activity/activitys/wawaji/resource/assets/shareIcon.png'
      },
      uname: 'zaofans',
      useCache: true
    }
  };
  var isLocal = false;
  var hostname = location.hostname;
  var uname = Utils.getQueryString('uname') || 'zaofans';
  if (hostname === 'localhost' || /^192\.168\.\d+\.\d+/.test(hostname)) {
    hostname = "www.zaofans.com"; //"192.168.45.104:8080";
    isLocal = true;
  }
  var APPID_MAP = {
    zaofans: "wxbbc70552f97b9141",
    wuhan: "wx904143829f0b0d1b",
    nanjing: "wx9746bb172d736a0c",
    dalian: "wx610b5c9cf75bdf07",
    qingdao: "wx74e5adac0bacd7c2",
    chongqing: "wx6d4e8be6afe3fac0",
    haerbin: "wx5645dcf6a81003e2",
    shenyang: "wxeccc20719c5cfc7e",
    tianjin: "wxbb9dc835c34e9918",
    gertz: "wxc97360c6205ff452",
    joyseed: "wxc61ea7696e402f22",
    default: "wxbbc70552f97b9141"
  };
  for (var i in URLObj) {
    if (typeof URLObj[i] === 'string') {
      URLObj[i] = URLObj[i].replace(/\{hostname\}/g, hostname).replace("{uname}", uname).replace("{appid}", isLocal ? APPID_MAP.default : APPID_MAP[uname]);
    }
  }
  URLObj.Config.uname = uname;
  for (var i_1 in URLObj.Config.urls) {
    if (URLObj.Config.urls[i_1].indexOf("http") !== 0) {
      URLObj.Config.urls[i_1] = URLObj.urlHost + URLObj.Config.urls[i_1];
    }
  }
  //localStorage.setItem("wx_uname", uname);
  //localStorage.setItem(uname + ":_openid", 'oO--NtwPrwXr0t02BvublP9wIu9Y');
  return URLObj;
})();