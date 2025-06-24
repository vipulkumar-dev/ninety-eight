m = function () {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
};

class ConstructVimeoPlayers {
  constructor() {
    (this.containers = [].slice.call(
      document.querySelectorAll(".vimeo-container")
    )),
      (this.isSingleFilm = !!document.querySelector(".main.single-film")),
      (this.threshold = 800),
      (this.players = []);
    0 == this.containers.length || "undefined" == typeof Vimeo || this.init();
  }
  init() {
    this.containers.forEach((e) => {
      var t = m() < this.threshold,
        s = new VimeoPlayer({
          autoplay: t,
          container: e,
          hideControlsDelay: t ? 0 : 2e3,
          onInitialise: this.hasInitialised.bind(this),
          onLoad: this.hasLoaded.bind(this),
        });
      if (
        (s.on("fullscreenChange", function (e) {
          window.scrollTo(0, 0);
        }),
        this.isSingleFilm)
      ) {
        let e = function () {
          f() >= g() && s.pause();
        };
        l.addScrollThrottleCallback(e);
      }
      this.players.push(s);
    });
  }
  hasInitialised(e, t) {
    var s = null;
    e.getDimensions()
      .then(function (e) {
        s = e;
        var i = function () {
          var e = t.parentNode,
            i = s.width / s.height,
            l = e.offsetWidth / e.offsetHeight;
          t.classList.toggle("full-width", i >= l),
            t.classList.toggle("full-height", i < l),
            (t.style.width = i < l ? (100 * i) / l + "%" : "100%"),
            C(e);
        };
        i(), l.addResizeThrottleCallback(i);
      })
      .catch(function () {});
  }
  hasLoaded(e, t) {
    var s = [].slice.call(
      t.parentNode.parentNode.querySelectorAll(".fade-after-video-load")
    );
    setTimeout(function () {
      s.forEach((e) => e.classList.add("show"));
    }, 200);
  }
  disableKeyControl() {
    this.players.forEach((e) => (e.disableKeyControl = !0));
  }
  enableKeyControl() {
    this.players.forEach((e) => (e.disableKeyControl = !1));
  }
}

new ConstructVimeoPlayers();
