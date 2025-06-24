"use strict";
(function () {
  function t(e, t, s) {
    var i = new XMLHttpRequest();
    return (
      (s = s || !1),
      "withCredentials" in i
        ? i.open(e, t, s)
        : "undefined" == typeof XDomainRequest
        ? (i = null)
        : ((i = new XDomainRequest()), i.open(e, t)),
      i
    );
  }
  function s(e, t) {
    var s;
    return (
      (t = t || 50),
      (function () {
        var i = this,
          l = arguments;
        clearTimeout(s),
          (s = setTimeout(function () {
            e.apply(i, l);
          }, t));
      })()
    );
  }
  window.scrollTo(0, 0),
    "scrollRestoration" in history && (history.scrollRestoration = "manual");
  var l,
    r,
    o,
    a,
    n,
    d,
    c,
    u,
    h = function () {
      return "ontouchstart" in window || navigator.maxTouchPoints;
    },
    m = function () {
      return Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
    },
    g = function () {
      return Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
    },
    p = function () {
      return document.scrollingElement
        ? document.scrollingElement
        : document.documentElement;
    },
    f = function () {
      return p().scrollTop || window.pageYOffset;
    },
    v = function () {
      return document.body.classList.contains("is-ie");
    },
    y = function () {
      return (
        -1 !== navigator.userAgent.indexOf("Safari") &&
        -1 == navigator.userAgent.indexOf("Chrome")
      );
    },
    L = function () {
      var e = function () {
        var e = document.documentElement,
          t = document.querySelector(".header"),
          s = window.innerHeight,
          i = m(),
          l = 0.01 * document.body.clientWidth,
          r = 0.01 * window.innerHeight;
        e.style.setProperty("--vw", l + "px"),
          e.style.setProperty("--vh", r + "px"),
          t && e.style.setProperty("--headerHeight", t.offsetHeight + "px"),
          (document.body.style.height = window.innerHeight + "px");
      };
      return setTimeout(e, 20), window.addEventListener("resize", e), e;
    };
  class ImagePreloader {
    constructor(e) {
      (this.wrapper = e || document),
        (this.images = []),
        this.findImages(),
        this.checkVisibility(),
        this.registerEvents();
    }
    findImages(e) {
      e = e || this.wrapper;
      let t = [].slice.call(e.querySelectorAll("img.lazy"));
      t.forEach((e) => {
        -1 !== this.images.indexOf(e) ||
          (this.images.push(e), this.prepareImage(e));
      });
    }
    prepareImage(e) {
      e.nextElementSibling &&
        "NOSCRIPT" === e.nextElementSibling.tagName &&
        e.parentElement.removeChild(e.nextElementSibling);
      var t = e.parentElement.scrollWidth,
        s = e.getAttribute("width"),
        i = e.getAttribute("height"),
        l = (i * t) / s;
      e.style.height = l + "px";
    }
    checkVisibility() {
      0 == this.images.length ||
        s(
          function () {
            var e = m(),
              t = g();
            this.images = this.images.filter(
              function (s) {
                var i = s.getBoundingClientRect();
                return (
                  !(
                    0 <= i.top + i.height &&
                    i.top < t &&
                    0 <= i.left + i.width &&
                    i.left < e
                  ) || (this.loadImage(s), !1)
                );
              }.bind(this)
            );
          }.bind(this)
        );
    }
    loadImage(e) {
      e &&
        e.classList.contains("lazy") &&
        ((e.src = e.dataset.src),
        (e.srcset = e.dataset.srcset),
        e.classList.add("loaded"),
        (e.style.height = ""),
        setTimeout(function () {
          e.classList.remove("lazy", "loaded"),
            e.removeAttribute("data-src"),
            e.removeAttribute("data-srcset");
        }, 1e3));
    }
    loadImagesNow(e) {
      e = e || document;
      var t = e.querySelectorAll("img.lazy");
      [].forEach.call(
        t,
        function (e) {
          this.loadImage(e);
        }.bind(this)
      );
    }
    registerEvents() {
      window.addEventListener(
        "scroll",
        function () {
          this.checkVisibility();
        }.bind(this),
        { passive: !1 }
      ),
        window.addEventListener(
          "resize",
          function () {
            this.checkVisibility();
          }.bind(this),
          !1
        );
    }
  }
  class VideoPreloader {
    constructor(e) {
      (this.wrapper = e || document),
        (this.videos = []),
        (this.threshold = 20),
        this.findVideos(),
        this.checkVisibility(),
        this.registerEvents();
    }
    findVideos(e) {
      e = e || this.wrapper;
      let t = [].slice.call(e.querySelectorAll("video.lazy"));
      t.forEach((e) => {
        -1 !== this.videos.indexOf(e) ||
          (this.videos.push(e), this.prepareVideo(e));
      });
    }
    prepareVideo(e) {
      var t = e.parentElement.scrollWidth,
        s = e.getAttribute("width"),
        i = e.getAttribute("height"),
        l = (i * t) / s;
      e.style.height = l + "px";
    }
    isVisible(e) {
      let t = m(),
        s = g(),
        i = e.getBoundingClientRect(),
        l = getComputedStyle(e).display,
        r =
          0 < i.top + i.height &&
          i.top < s &&
          0 < i.left + i.width &&
          i.left < t;
      return (
        !!("contents" === l || r) &&
        "none" != e.style.display &&
        "0" != e.style.opacity &&
        "none" != l
      );
    }
    checkVisibility() {
      0 == this.videos.length ||
        s(
          function () {
            this.videos = this.videos.filter(
              function (e) {
                return !this.isVisible(e) || (this.loadVideo(e), !1);
              }.bind(this)
            );
          }.bind(this)
        );
    }
    loadVideo(e) {
      if (e && !0 !== e.loading && e.classList.contains("lazy")) {
        (e.loading = !0), e.classList.add("is-loading");
        var t = JSON.parse(e.dataset.sources),
          s = e.parentElement.getBoundingClientRect().width,
          i = {},
          l = "";
        for (var r in (t.forEach(function (e) {
          i.hasOwnProperty(e.mime) || (i[e.mime] = []), i[e.mime].push(e);
        }),
        i))
          if (i.hasOwnProperty(r)) {
            var o,
              a = i[r];
            2 <= a.length &&
              (a = a.filter(function (e, t, i) {
                return e.width >= s;
              })),
              (o = 0 < a.length ? a[a.length - 1] : i[r][0]),
              (l += '<source src="' + o.file + '" type="' + r + '">');
          }
        this.threshold > m() && e.setAttribute("preload", "metadata"),
          e.addEventListener("loadedmetadata", function () {
            e.classList.remove("is-loading");
          }),
          (e.innerHTML = l),
          e.classList.remove("lazy"),
          e.removeAttribute("data-sources"),
          (e.style.height = "");
      }
    }
    loadVideosNow(e) {
      e = e || document;
      var t = e.querySelectorAll("video.lazy");
      [].forEach.call(
        t,
        function (e) {
          this.loadVideo(e);
        }.bind(this)
      );
    }
    registerEvents() {
      window.addEventListener(
        "scroll",
        function () {
          this.checkVisibility();
        }.bind(this),
        { passive: !1 }
      ),
        window.addEventListener(
          "resize",
          function () {
            this.checkVisibility();
          }.bind(this),
          !1
        );
    }
  }
  var b = function () {
      var e = document.querySelector(".module-frontsplashscreen"),
        t = document.querySelector("body");
      if (!e) return;
      let s,
        i = e.dataset.delay ? parseInt(e.dataset.delay) : 3e3,
        l = 940;
      if (sessionStorage.getItem("has-seen-splashscreen"))
        return (
          e.classList.add("hide-now"),
          t.classList.remove("has-splashscreen"),
          void t.classList.add("remove-splashscreen-now")
        );
      var r = function () {
        let i = m() < l ? 2800 : 3300;
        e.classList.add("hide"),
          t.classList.remove("has-splashscreen"),
          U(),
          clearTimeout(s),
          sessionStorage.setItem("has-seen-splashscreen", !0),
          setTimeout(() => e.classList.add("has-played"), i);
      };
      N(), e.addEventListener("click", r), 0 < i && (s = setTimeout(r, i));
    },
    E = function () {
      var e = document.querySelectorAll(".slider");
      e &&
        [].forEach.call(e, function (e) {
          var t = new Slider(e);
        });
    };
  class Slider {
    constructor(e) {
      (this.slider = e), this.build();
    }
    build() {
      this.slider &&
        ((this.slideContainer = this.slider.querySelector(".slider-inner")),
        this.slideContainer &&
          ((this.navContainer = this.slider.querySelector(".slider-nav")),
          (this.slides = [].slice.call(
            this.slideContainer.querySelectorAll(".slide")
          )),
          (this.counter = this.slider.querySelector(".slider-counter span")),
          (this.total = this.slides.length),
          (this.duration = parseInt(this.slider.dataset.duration)),
          (this.current = 0),
          (this.transition = this.slideContainer.style.transition),
          (this.isSliding = !1),
          (this.autoThreshold = 800),
          this.cloneSlides(),
          r.loadImagesNow(this.slider),
          this.registerEvents(),
          this.resize(),
          this.autostart()));
    }
    cloneSlides() {
      this.slides.forEach(
        function (e, t) {
          var s = e.cloneNode(!0),
            i = e.cloneNode(!0);
          s.classList.add("clone"),
            i.classList.add("clone"),
            this.slideContainer.appendChild(s),
            this.slideContainer.insertBefore(
              i,
              this.slideContainer.children[t]
            );
        }.bind(this)
      ),
        (this.slides = [].slice.call(
          this.slideContainer.querySelectorAll(".slide")
        ));
    }
    registerEvents() {
      var e = this.swipeDetected.bind(this);
      (this.swiper = new SwipeDetect(this.slider, e, {
        stagger: 200,
        vertical: !1,
      })),
        this.navContainer &&
          (this.navContainer
            .querySelector(".nav-prev")
            .addEventListener("click", this.prevSlide.bind(this)),
          this.navContainer
            .querySelector(".nav-next")
            .addEventListener("click", this.nextSlide.bind(this))),
        l.addResizeThrottleCallback(this.resize.bind(this)),
        document.addEventListener("keydown", this.keydown.bind(this));
    }
    resize() {
      var e = this.slides.find((e) => !e.classList.contains("clone"));
      (this.gapWidth = parseFloat(getComputedStyle(e).marginLeft)),
        this.slideTo(0, !0);
    }
    slideTo(e, t) {
      if (((e = parseInt(e)), t || (!this.isSliding && e !== this.current))) {
        this.isSliding = !0;
        var s = this.wrapAroundIndex(e),
          i = this.total + e,
          l = this.total + s,
          o =
            0.5 *
            (this.slider.clientWidth -
              this.slides[i].getBoundingClientRect().width),
          a = o - this.slides[i].offsetLeft,
          n = o - this.slides[l].offsetLeft;
        (this.currentSlide = this.slides[l]),
          this.slides.forEach((e) =>
            e.classList.toggle("active", e.dataset.index == s)
          ),
          (this.slideContainer.style.left = a + "px"),
          r.checkVisibility(),
          this.counter && (this.counter.innerText = s + 1),
          e === s
            ? ((this.current = e), (this.isSliding = !1))
            : setTimeout(
                function () {
                  this.slider.classList.add("no-transition"),
                    (this.slideContainer.style.left = n + "px"),
                    r.checkVisibility(),
                    setTimeout(
                      function () {
                        (this.current = s),
                          (this.isSliding = !1),
                          this.slider.classList.remove("no-transition");
                      }.bind(this),
                      20
                    );
                }.bind(this),
                300
              );
      }
    }
    wrapAroundIndex(e) {
      return 0 > e ? this.total + e : e >= this.total ? this.total - e : e;
    }
    prevSlide() {
      this.slideTo(this.current - 1);
    }
    nextSlide() {
      this.slideTo(this.current + 1);
    }
    autostart() {
      this.autoThreshold <= m() ||
        0 == this.duration ||
        setTimeout(
          function () {
            this.nextSlide(), this.autostart();
          }.bind(this),
          this.duration
        );
    }
    swipeDetected(t) {
      if (0 != t.directionX) {
        for (var e = (180 * t.direction2D) / Math.PI + 90; 0 >= e; ) e += 360;
        for (; 360 <= e; ) e -= 360;
        var s = 225 <= e && 315 >= e,
          i = 45 <= e && 135 >= e;
        s && this.prevSlide(),
          i && this.nextSlide(),
          (i || s) && t.event.preventDefault();
      }
    }
    keydown(t) {
      var e = t.keyCode;
      37 == e && this.prevSlide(), 39 == e && this.nextSlide();
    }
  }
  var S = function (e) {
    e = e || document;
    var t = [].slice.call(
        e.querySelectorAll(".post-card-film:not(.is-registered)")
      ),
      s = 0,
      i = m() >= 0;
    t &&
      t.forEach(function (e) {
        var t = e.querySelector(".post-card-thumb"),
          s = e.querySelector("video"),
          i = e.querySelector(".video-preview-img video + img"),
          l = [].slice.call(
            e.querySelectorAll(
              ".post-card-thumb, .post-card-director, .post-card-title, .search-result-thumb, .search-result-info"
            )
          ),
          r = !1,
          o = null,
          a = null;
        if ((e.classList.add("is-registered"), !s)) return;
        let n = function () {
            r ||
              s.isPlaying ||
              !s.seekable.length ||
              (s.play(), (r = !0), e.classList.add("is-playing"));
          },
          d = function () {
            r &&
              (s.pause(),
              (r = !1),
              (s.currentTime = 0),
              e.classList.remove("is-playing"));
          };
        l.forEach((e) => {
          e.addEventListener("mouseenter", n),
            e.addEventListener("mouseleave", d);
        });
      });
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
  var C = function (e) {
      return;
      e = e || document;
      var t = e.querySelectorAll(".video-container, .vimeo-container");
      if (t) {
        var s = function () {
          [].forEach.call(t, function (e) {
            var t = e.querySelector(
              "iframe:not(.video-embed-player), embed:not(.video-embed-player)"
            );
            if (t) {
              var s = e.parentNode,
                i = [].slice.call(s.querySelectorAll(".fade-after-video-load")),
                l = t.getAttribute("width"),
                r = t.getAttribute("height");
              if (isNaN(l) || isNaN(r)) {
                for (; e.firstChild; ) s.insertBefore(e.firstChild, e);
                return (
                  s.removeChild(e),
                  void i.forEach((e) => e.classList.add("show"))
                );
              }
              var o = l / r,
                a = s.offsetWidth,
                n = s.offsetHeight,
                d = a / n;
              e.classList.remove("full-width", "full-height"),
                (e.style.paddingBottom = ""),
                (e.style.paddingLeft = ""),
                o >= d
                  ? (e.classList.add("full-width"),
                    (e.style.paddingBottom = 100 / o + "%"))
                  : (e.classList.add("full-height"),
                    (e.style.paddingLeft = o * n + "px"),
                    (e.style.paddingBottom = n + "px")),
                i.forEach((e) => e.classList.add("show"));
            }
          });
        };
        s(), l.addResizeThrottleCallback(s);
      }
    },
    q = function () {
      var t = document.querySelector(".module-directorarchive");
      if (t) {
        t.classList.add("show");
        var s = document.body,
          i = t.querySelector(".module-directorarchive-representations"),
          r = [].slice.call(
            i.querySelectorAll(".module-directorarchive-columns")
          ),
          a = [].slice.call(t.querySelectorAll(".post-card-director")),
          n = [].slice.call(
            t.querySelectorAll(".directorarchive-representation")
          ),
          d = n.map((e) => e.dataset.representation),
          c = 800,
          u = 128;
        if (a) {
          var h = function () {
              800 <= m() ||
                i.classList.toggle(
                  "off-centred",
                  i.getBoundingClientRect().height + 128 >= g()
                );
            },
            p = function (t) {
              let e = t.target.classList.contains(
                "directorarchive-representation"
              )
                ? t.target
                : t.target.closest(".directorarchive-representation");
              f(e.dataset.representation);
            },
            f = function (e) {
              let t =
                !!(1 < arguments.length && void 0 !== arguments[1]) &&
                arguments[1];
              r.forEach((t) =>
                t.classList.toggle("active", t.dataset.representation == e)
              ),
                n.forEach((t) =>
                  t.classList.toggle("active", t.dataset.representation == e)
                ),
                a.forEach((e) => v(e)),
                t || history.pushState(null, null, "#" + e);
            },
            v = function (e) {
              if (!(800 > m())) {
                var t = e.querySelector("a.name-link");
                (t.style.minWidth = ""),
                  (t.style.minWidth = t.scrollWidth + 15 + "px");
              }
            };
          if (
            (a.forEach(function (r, a) {
              var i = r.querySelector("video"),
                n = r.querySelector("a.name-link"),
                d = !1,
                c = function (l) {
                  800 > m() ||
                    (o.loadVideosNow(r),
                    r.classList.add("show-teaser"),
                    t.classList.add("is-hovering"),
                    s.classList.add("dark"),
                    h(),
                    i &&
                      i
                        .play()
                        .then(function () {
                          d = !0;
                        })
                        .catch(function () {}));
                },
                u = function (i) {
                  800 > m() ||
                    (r.classList.remove("show-teaser"),
                    t.classList.remove("is-hovering"),
                    s.classList.remove("dark"),
                    h());
                },
                h = function () {
                  i && d && (i.pause(), (i.currentTime = 0), (d = !1));
                },
                g = function () {
                  v(r);
                };
              g(),
                n.addEventListener("mouseenter", c),
                n.addEventListener("mouseleave", u),
                l.addResizeThrottleCallback(g);
            }),
            h(),
            l.addResizeThrottleCallback(h),
            n.forEach((e) => e.addEventListener("click", p)),
            window.location.hash)
          ) {
            let e = window.location.hash.replace("#", "");
            !1 !== d.indexOf(e) && f(e, !0);
          }
        }
      }
    },
    w = function () {
      var e = document.querySelector(".contact-about"),
        t = document.querySelector(".module-contactteaser"),
        s = document.querySelector(".contact-workshop"),
        i = document.querySelector(".module-contactworkshop"),
        r = 6e3,
        o = 400,
        a = 200,
        n = 0,
        d = null;
      if (t || i) {
        var c = function (e, t) {
          var s = [].slice.call(t.querySelectorAll(".teaser-panel"));
          s = s.map(function (e) {
            return { panel: e, delay: 400 };
          });
          var i = function () {
              var e = function (e) {
                return e.replace(/(<([^>]+)>)/gi, "");
              };
              s.forEach(function (t, s) {
                var i = t.panel.querySelector(".teaser-panel-content"),
                  l = e(i.innerHTML).trim(),
                  r = -Infinity,
                  o = [];
                (i.innerHTML = l
                  .split(" ")
                  .map((e) => "<span>" + e + "</span>")
                  .join(" ")),
                  (o = [].slice.call(i.querySelectorAll("span"))),
                  setTimeout(function () {
                    o.forEach(function (e, t) {
                      if (e.offsetTop <= r) return (r = e.offsetTop);
                      if (((r = e.offsetTop), 0 != t)) {
                        var s = document.createElement("br");
                        i.insertBefore(s, e);
                      }
                    });
                    var s = i.innerHTML.split("<br>").map(function (t, s) {
                      return (
                        '<span style="transition-delay: ' +
                        200 * s +
                        'ms">' +
                        e(t).trim() +
                        "</span>"
                      );
                    });
                    (i.innerHTML = s.join(" ")),
                      (t.delay += 200 * (s.length - 1));
                  }, 50);
              });
            },
            r = function () {
              t.classList.add("hide");
            },
            o = function () {
              clearTimeout(d),
                t.classList.remove("hide"),
                s.forEach(function (e, t) {
                  e.panel.classList.remove("start-transition"),
                    e.panel.classList.toggle("active", 0 == t);
                }),
                (n = 0),
                (d = setTimeout(a, 6000));
            },
            a = function () {
              clearTimeout(d),
                s[n].panel.classList.add("start-transition"),
                setTimeout(function () {
                  return (
                    s[n].panel.classList.remove("active"),
                    n == s.length - 1
                      ? r()
                      : void ((n += 1),
                        setTimeout(function () {
                          s[n].panel.classList.add("active"),
                            (d = setTimeout(a, 6000));
                        }, 400))
                  );
                }, s[n].delay);
            };
          s.forEach(function (e, s) {
            t.addEventListener("click", a);
          }),
            e.addEventListener("click", o),
            l.addResizeThrottleCallback(i),
            i();
        };
        t && e && c(e, t), i && s && c(s, i);
      }
    },
    T = function (e) {
      var t = document.body,
        s = document.querySelector(".header"),
        i = s.getBoundingClientRect(),
        l = [].slice.call(
          document.querySelectorAll(
            "body .light:not(.ignore-color), body .dark:not(.ignore-color)"
          )
        ),
        r = t.classList.contains("dark-page"),
        o = function (e) {
          t.classList.toggle("dark", e), t.classList.toggle("light", !e);
        };
      return "undefined" == typeof e
        ? void (l.forEach(function (e) {
            var t = e.getBoundingClientRect();
            null === e.offsetParent ||
              (t.top + t.height >= i.top &&
                t.left + t.width >= i.left &&
                t.bottom - t.height <= i.bottom &&
                t.right - t.width <= i.right &&
                (r = e.classList.contains("dark")));
          }),
          o(r))
        : void o(e);
    },
    k = function () {
      var e = document.querySelector(
        ".module-filmshowcase, .module-frontshowcase"
      );
      if (e) {
        var t = [].slice.call(e.querySelectorAll(".post-card")),
          s = e.querySelector(".showcase-nav-prev"),
          i = e.querySelector(".showcase-nav-next"),
          l = e.querySelector(".showcase-title"),
          r = e.querySelector(".showcase-counter span"),
          a = e.querySelector(".showcase-progress"),
          n = e.classList.contains("module-frontshowcase"),
          d = e.dataset.maxLength || 0,
          c = null,
          u = null,
          h = null,
          m = 0,
          p = 0,
          f = function (s, a) {
            (a = a || !1),
              (s != p || a) &&
                (s >= t.length && (s = 0),
                0 > s && (s = t.length - 1),
                c && clearTimeout(c),
                t[p].classList.remove("show", "show-teaser"),
                t[s].classList.add("show", "show-teaser"),
                o.loadVideosNow(t[s]),
                e.classList.add("is-switching"),
                cancelAnimationFrame(u),
                t.forEach((e, t) => {
                  let i = e.querySelector("video");
                  i &&
                    (t !== s && !1 == a
                      ? (i.pause(), (i.currentTime = 0))
                      : t == s &&
                        C(i) &&
                        ((m = Math.max(
                          d,
                          i.duration || i.dataset.duration || 0
                        )),
                        (h = Date.now()),
                        (u = requestAnimationFrame(b)),
                        i.play()));
                }),
                (l.innerHTML = t[s].querySelector(".post-card-info").innerHTML),
                (p = s),
                (r.innerText = p + 1),
                0 < d && (c = setTimeout(() => f(p + 1), d)),
                e.classList.remove("is-switching"));
          },
          v = function () {
            f(p - 1);
          },
          y = function () {
            f(p + 1);
          },
          L = function (t) {
            let e = t.keyCode;
            switch (e) {
              case 33:
              case 37:
              case 38:
              case 65:
              case 87:
                v();
                break;
              case 34:
              case 39:
              case 40:
              case 68:
              case 83:
                y();
                break;
              default:
            }
          },
          b = function () {
            u = requestAnimationFrame(b);
            let e = Date.now(),
              t = (e - h) / (1e3 * m);
            a.style.transform = "scaleX(" + t + ")";
          },
          E = function (t) {
            var e =
              t.target.dataset && t.target.dataset.index
                ? t.target.dataset.index
                : 0;
            f(e);
          },
          S = function () {
            t.forEach((e) => {
              let t = e.querySelector("video");
              t && (window.scrollY > 0.95 * g() ? t.pause() : C(t) && t.play());
            });
          },
          C = function (e) {
            let t =
              0 < e.currentTime &&
              !e.paused &&
              !e.ended &&
              e.readyState > e.HAVE_CURRENT_DATA;
            return !t;
          },
          q = function (s) {
            let e = t[p].querySelector("video");
            e && (document.hidden ? e.pause() : C(e) && e.play());
          },
          w = function (t) {
            C(t.target) &&
              (t.target.play(),
              t.target.removeEventListener("canplaythrough", w));
          },
          T = function () {
            t.forEach((e, t) => {
              let s = e.querySelector("video");
              s &&
                ((s.loop = !1),
                s.addEventListener("ended", () => {
                  t !== p || f(t + 1, !1);
                }),
                0 == t && s.addEventListener("canplaythrough", w));
            }),
              s.addEventListener("click", v),
              i.addEventListener("click", y),
              document.addEventListener("scroll", S),
              document.addEventListener("visibilitychange", q),
              window.addEventListener("keydown", L);
          },
          k = function () {
            T(), f(0, !0);
          };
        k();
      }
    },
    x = function () {
      var e = document.querySelector(".module-backgroundmedia");
      if (e) {
        var t = e.querySelector("video");
        t &&
          t.addEventListener("canplay", function () {
            e.classList.add("hide-teaser");
          });
      }
    };
  class DirectorTitleSnapper {
    constructor() {
      this.checkOnTitle(),
        (this.isFilm = document.querySelector(".main.single-film")),
        (this.threshold = 80),
        (this.marginTop = 0),
        (this.basePad = 8),
        (this.titleHeight = 40),
        (this.active = !!this.title),
        (this.scrollListener = null),
        (this.resizeListener = null),
        (this.vpThreshold = 800),
        this.resize();
    }
    resize() {
      let e =
        0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : null;
      if ((this.checkOnTitle(), !!this.active)) {
        if (!this.title) return this.removeEventListeners();
        "unfix" == e && this.title.classList.remove("fixed"),
          this.removeEventListeners(),
          m() < this.vpThreshold ||
            (this.addEventListeners(),
            this.updateTitleHeight(),
            this.updateMargin(),
            this.updateThreshold(),
            null == e && this.checkPosition());
      }
    }
    checkOnTitle() {
      this.title = document.querySelector(
        ".single-director .module-directortitle, .single-film .module-directortitle"
      );
    }
    updateTitleHeight() {
      if (this.active) {
        var e = this.title.querySelector("h1");
        e && (this.titleHeight = e.scrollHeight);
      }
    }
    updateMargin() {
      if (!this.title) return this.removeEventListeners();
      if (this.active) {
        var e,
          t = this.title.cloneNode(!0);
        t.classList.remove("fixed"),
          this.title.parentElement.insertBefore(t, this.title),
          (e = getComputedStyle(t)),
          (this.marginTop =
            parseFloat(e.marginTop) +
            0.5 * (parseFloat(e.height) - this.titleHeight)),
          t.parentElement.removeChild(t);
      }
    }
    updateThreshold() {
      if (this.active) {
        var e = this.title.cloneNode(!0);
        e.classList.add("fixed"),
          this.title.parentElement.insertBefore(e, this.title),
          (this.threshold = e.getBoundingClientRect().top),
          e.parentElement.removeChild(e);
      }
    }
    checkPosition() {
      if (this.active && !(m() < this.vpThreshold)) {
        var e = f();
        this.title.classList.toggle(
          "fixed",
          this.marginTop - e + this.basePad <= this.threshold
        ),
          this.title.classList.toggle(
            "send-back",
            e >
              document.body.scrollHeight -
                g() -
                this.threshold -
                2 * this.titleHeight
          );
      }
    }
    removeEventListeners() {
      l.removeScrollThrottleCallback(this.scrollListener),
        l.removeResizeThrottleCallback(this.resizeListener),
        (this.scrollListener = null),
        (this.resizeListener = null),
        (this.active = !1);
    }
    addEventListeners() {
      (this.scrollListener = l.addScrollThrottleCallback(
        this.checkPosition.bind(this),
        20
      )),
        (this.resizeListener = l.addResizeThrottleCallback(
          this.resize.bind(this),
          20
        )),
        (this.active = !0);
    }
  }
  var M = function () {
      var e,
        t,
        s = [].slice.call(document.querySelectorAll(".remove-above")),
        r = 0.00347222222 * m();
      if (s) {
        var o = function () {
            if (s)
              for (var t = f(), l = 0; l < s.length; l++) {
                for (
                  var o = s[l],
                    n = [],
                    d = o,
                    h = o.dataset.defaultUrl,
                    m = o.dataset.defaultTitle,
                    g = o.dataset.mainClasses,
                    p = o.dataset.bodyClasses;
                  (d = d.previousSibling);

                )
                  3 == d.nodeType ||
                    (d.classList && d.classList.contains("do-no-remove")) ||
                    n.push(d);
                if (0 == n.length) return void (s = s.filter((e) => e !== o));
                if (
                  o.getBoundingClientRect().top > r &&
                  !o.classList.contains("fixed")
                )
                  return;
                for (var v = 0; v < n.length; v++) {
                  var d = n[v],
                    L = d.getBoundingClientRect(),
                    b = "fixed" == getComputedStyle(d).position;
                  if (!(0 < L.bottom) || b) {
                    y() && a(0),
                      h &&
                        0 < h.length &&
                        (c.update(location.href), c.update(h, m));
                    for (var E = v; E < n.length; E++)
                      (t -= n[E].getBoundingClientRect().height),
                        n[E].parentElement.removeChild(n[E]);
                    (document.title = m),
                      (o.classList.contains("module-directortitle") ||
                        o.classList.contains("module-archiveswitch") ||
                        o.classList.contains("module-postarchive")) &&
                        (t = 0),
                      (n = n.slice(0, E - 1)),
                      s.splice(l, 1);
                    break;
                  }
                }
                g && (document.querySelector(".main").className = g),
                  p && (document.querySelector("body").className = p),
                  y()
                    ? setTimeout(function () {
                        a(t),
                          N(),
                          u.resize("unfix"),
                          setTimeout(function () {
                            U(), a(t);
                          }, 50);
                      }, 50)
                    : (a(t), u.resize("unfix")),
                  X();
              }
          },
          a = function (e) {
            window.scrollTo(0, e),
              p().scrollTop
                ? (p().scrollTop = e)
                : window.pageYOffset && (window.pageYOffset = e);
          },
          n = function () {
            (e = l.addScrollThrottleCallback(o)),
              (t = l.addResizeThrottleCallback(o));
          },
          d = function () {
            l.removeScrollThrottleCallback(e),
              l.removeResizeThrottleCallback(t);
          };
        a(0), o(), n();
      }
    },
    A = function () {
      var e = document.querySelector(".module-filmembedplayer"),
        t = 800;
      if (e) {
        var s = function () {
            var e = document.querySelector(".module-filmembedplayer");
            if (e && !(800 > m())) {
              var t = f();
              (e.style.opacity = Math.min(
                1,
                Math.max(0, 1 - (1.25 * t) / g())
              )),
                e.classList.toggle("hide", t >= g());
            }
          },
          i = function () {
            e.classList.toggle("dark", 800 >= m()), T(800 >= m()), s();
          };
        i(), l.addScrollDebounceCallback(s), l.addResizeThrottleCallback(i);
      }
    },
    P = function () {
      var e = document.querySelector(".module-contactlogodisclaimer");
      if (!e) return;
      let t = null;
      var s = function (t) {
          let e = t.keyCode;
          switch (e) {
            case 32:
            case 33:
            case 35:
            case 39:
            case 40:
            case 83:
              r(!0);
              break;
            case 33:
            case 38:
            case 87:
              r();
              break;
            default:
          }
        },
        i = function (t) {
          0 < t.directionY && r(!0), 0 > t.directionY && r(!1);
        },
        l = function (t) {
          let e = t.wheelDeltaY || t.deltaY || 0;
          0 > e && r(!0), 0 < e && r(!1);
        },
        r = function () {
          let t =
            !!(0 < arguments.length && arguments[0] !== void 0) && arguments[0];
          e.classList.toggle("show-footer", t);
        };
      document.addEventListener("keydown", s),
        document.addEventListener("wheel", l),
        (t = new SwipeDetect(document, i, { stagger: 200, horizontal: !1 }));
    },
    z = function () {
      var e = document.querySelector(".contact-disclaimer");
      if (e) {
        var t = [].slice.call(
          e.querySelectorAll(".footer-menu li .footer-menu-title")
        );
        t.forEach(function (s) {
          s.addEventListener("click", function () {
            var i = !1;
            t.forEach(function (e) {
              var t =
                e == s && !e.parentNode.classList.contains("show-content");
              (i = i || t), e.parentNode.classList.toggle("show-content", t);
            }),
              e.classList.toggle("has-visible-content", i);
          });
        });
      }
    },
    H = function () {
      var e = document.querySelector(".contact-newsletter");
      if (e) {
        var t = e.querySelector("h3"),
          s = e.querySelector("input");
        t.addEventListener("click", function () {
          e.classList.toggle("show-form"), s.focus();
        });
      }
    },
    R = function () {
      var e = document.querySelector(".scroll-up, .scroll-down"),
        t = document.querySelector(".header"),
        s = document.querySelector(".footer-full, .footer-menu");
      if (!e) return;
      let i = 0.2;
      var l = function () {
          let t = f(),
            l = t <= i * g(),
            r = !1;
          if (s) {
            let t = e.closest(".module"),
              i = t ? parseFloat(getComputedStyle(t)["margin-bottom"]) : 0,
              l = s.getBoundingClientRect();
            r = g() >= l.top - i;
          }
          e.classList.toggle("move-to-bottom", l),
            e.classList.toggle("move-to-top", r);
        },
        r = function (s) {
          var e = s.target.classList.contains("scroll-up") ? 0 : g();
          v() || y()
            ? scrollTo(0, e)
            : scrollTo({ top: e, left: 0, behavior: "smooth" }),
            setTimeout(function () {
              t.classList.remove("hide");
            }, 500);
        };
      e.addEventListener("click", r),
        document.addEventListener("scroll", l),
        document.addEventListener("resize", l),
        l();
    },
    I = function () {
      var s = [].slice.call(
          document.querySelectorAll(".module-archiveswitch a")
        ),
        i = document.querySelector(".module-filmarchive");
      if (s && i) {
        var l = s.filter((e) => e.classList.contains("active-category"));
        l = 1 == l.length ? l[0].dataset.type : localisedbb.defaultCategory;
        var a = function (a) {
          var e =
            a.target.dataset && a.target.dataset.type
              ? a.target.dataset.type
              : localisedbb.defaultCategory;
          if ((a.preventDefault(), e != l)) {
            var n = t("POST", localisedbb.ajaxurl, !0),
              d = "action=getFilmList&category=" + e;
            n.setRequestHeader(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
              (n.onreadystatechange = function () {
                if (4 === this.readyState && 200 === this.status) {
                  var t = [].slice.call(i.querySelectorAll("video"));
                  t.forEach(function (e) {
                    e.pause(), (e.src = ""), e.load();
                  }),
                    (i.innerHTML = this.responseText),
                    r.loadImagesNow(i),
                    o.loadVideosNow(i),
                    c.update(a.target.href),
                    s.forEach((t) =>
                      t.classList.toggle("active-category", t.dataset.type == e)
                    ),
                    (l = e),
                    i.classList.remove("loading"),
                    S(i);
                }
              }),
              i.classList.add("loading"),
              n.send(encodeURI(d));
          }
        };
        s.forEach(function (e) {
          e.addEventListener("click", a);
        });
      }
    },
    V = function () {
      var e = !1,
        t = function (t) {
          (e = t), s();
        },
        s = function () {
          if (e) {
            var t = document.querySelector(".main.archive-films"),
              s = document.querySelector(".main.archive-directors"),
              i = document.querySelector(".main.blog");
            if (t || s || i) {
              var l = "";
              (l = t ? "film" : l),
                (l = s ? "director" : l),
                (document.cookie =
                  "localreferrer=" + l + ";samesite=strict;path=/");
            }
          }
        };
      d.registerCookieFunction(t);
    },
    D = function () {
      var e = [].slice.call(document.querySelectorAll(".collapsible"));
      if (e) {
        var t = function (t) {
            var s = t.querySelector(".collapsible-body"),
              i =
                "" === s.style.maxHeight || 0 == parseInt(s.style.maxHeight)
                  ? s.scrollHeight
                  : 0;
            t.classList.contains("start-open")
              ? (t.classList.remove("start-open"), (s.style.maxHeight = "0px"))
              : (s.style.maxHeight = i + "px"),
              e.forEach(function (e) {
                e.classList.toggle("content-shown", e == t && 0 !== i),
                  e !== t &&
                    (e.querySelector(".collapsible-body").style.maxHeight = 0);
              });
          },
          s = function () {
            e.forEach(function (e) {
              var t = e.querySelector(".collapsible-body");
              t.style.maxHeight = "";
            });
          };
        e.forEach(function (e) {
          var s = e.querySelector(".collapsible-header");
          s.addEventListener("click", function () {
            t(e);
          }),
            e.classList.contains("start-open") && t(e);
        });
      }
    };
  class URLUpdater {
    constructor() {
      window.addEventListener("popstate", this.onNavigate.bind(this));
    }
    update(e) {
      let t =
          1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : null,
        s = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : {};
      if (null == e) return;
      t = t || document.title;
      let i = { pageTitle: t, url: e };
      (i = Object.assign(i, s)), window.history.pushState(i, "", e);
    }
    onNavigate(t) {
      t.state &&
        t.state.url &&
        t.state.pageTitle &&
        ((location.href = t.state.url), (document.title = t.state.pageTitle));
    }
  }
  var B = function () {
      var e = document.querySelector(".header"),
        t = e.querySelector(".header-menu");
      if (t) {
        var s = t.querySelector(".menu"),
          i = t.querySelector(".header-menu-toggle"),
          r = 940,
          o = function () {
            940 <= m() && e.classList.remove("show-menu");
          },
          a = function () {
            e.classList.toggle("show-menu");
          },
          n = function () {
            e.classList.remove("show-menu");
          };
        s.addEventListener("click", n),
          i.addEventListener("click", a),
          l.addResizeThrottleCallback(o),
          o();
      }
    },
    F = function (t) {
      (t = t || window.event),
        t.preventDefault && t.preventDefault(),
        (t.returnValue = !1);
    },
    O = function (t) {
      var e = { 38: 1, 40: 1 };
      if (e[t.keyCode]) return F(t), !1;
    },
    N = function () {
      var e = !!W() && { passive: !1 },
        t = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
      window.addEventListener("DOMMouseScroll", F, !1),
        window.addEventListener(t, F, e),
        window.addEventListener("touchmove", F, e),
        window.addEventListener("keydown", O, !1);
    },
    U = function () {
      var e = !!W() && { passive: !1 },
        t = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
      window.removeEventListener("DOMMouseScroll", F, !1),
        window.removeEventListener(t, F, e),
        window.removeEventListener("touchmove", F, e),
        window.removeEventListener("keydown", O, !1);
    },
    W = function () {
      var e = !1;
      try {
        window.addEventListener(
          "test",
          null,
          Object.defineProperty({}, "passive", {
            get: function () {
              e = !0;
            },
          })
        );
      } catch (t) {}
      return e;
    },
    Y = function () {
      var s = document.querySelector(".module-rsvp form");
      if (s) {
        var i = [].slice.call(
            s.querySelectorAll('input[type="text"], input[type="email"]')
          ),
          l = [].slice.call(s.querySelectorAll('input[type="radio"]')),
          r = function () {
            var e = null;
            return l.forEach((t) => (e = t.checked ? t.value : e)), e;
          },
          o = function () {
            var e = r();
            switch (
              (s.classList.remove(
                "notcoming",
                "coming",
                "coming1",
                "answer-sent"
              ),
              s.classList.add(e),
              i.forEach((e) => (e.required = "")),
              e)
            ) {
              case "notcoming":
                s.querySelector(".form-field-name input").required = "required";
                break;
              case "coming":
                [].slice
                  .call(s.querySelectorAll(".info-self input"))
                  .forEach((e) => (e.required = "required"));
                break;
              case "coming1":
                i.forEach((e) => (e.required = "required"));
                break;
              default:
            }
          },
          a = function (o) {
            o.preventDefault();
            var e = r(),
              a = s.dataset.id,
              n = "action=postRSVPAnswer&answer=" + e + "&id=" + a,
              d = t("POST", localisedbb.ajaxurl, !0);
            i.forEach(function (e) {
              e.required && (n += "&" + e.dataset.title + "=" + e.value);
            }),
              d.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
              ),
              (d.onreadystatechange = function () {
                ((4 == this.readyState && 200 == this.status) ||
                  1 == this.responseText) &&
                  (s.classList.remove("notcoming", "coming", "coming1"),
                  s.classList.add("answer-sent"),
                  l.forEach((e) => (e.checked = !1)),
                  s.reset());
              }),
              d.send(encodeURI(n));
          };
        l.forEach((e) => e.addEventListener("input", o)),
          s.addEventListener("submit", a);
      }
    },
    j = function () {
      var e = document.querySelector(".module-rsvp form");
      if (e) {
        var t = e.querySelectorAll(".form-field input"),
          s = e.querySelectorAll("fieldset[required]"),
          i = e.querySelector(".form-message"),
          l = e.querySelector('input[type="submit"]');
        [].forEach.call(t, function (t) {
          var s = t.nextElementSibling;
          t.addEventListener("change", function () {
            o(t);
          }),
            t.addEventListener("invalid", function (s) {
              var e = s.target.validity,
                i = t.parentElement,
                l = t.getAttribute("data-title"),
                r = "";
              e.valid ||
                (i.classList.add("invalid"),
                e.valueMissing
                  ? (r = localisedrsvp["empty" + l])
                  : e.typeMismatch && (r = localisedrsvp["wrong" + l]),
                a(r, s));
            }),
            s.addEventListener("click", function () {
              t.focus();
            });
        });
        var r = function (t) {
            0 === s.length ||
              [].forEach.call(s, function (e) {
                var s = e.querySelector("input:checked");
                s ||
                  a(localisedrsvp["empty" + e.getAttribute("data-title")], t);
              });
          },
          o = function (e) {
            var t = e.parentElement;
            n(t),
              "" === e.value
                ? t.classList.remove("notempty")
                : t.classList.add("notempty");
          },
          a = function (t, s) {
            (i.innerHTML =
              -1 === i.innerHTML.indexOf(t)
                ? i.innerHTML + "<br>" + t
                : i.innerHTML),
              i.classList.add("show"),
              i.classList.remove("success"),
              l.blur(),
              s.preventDefault();
          },
          n = function (e) {
            (e = e || !1),
              (i.innerText = ""),
              i.classList.remove("show", "invalid", "success"),
              e && e.classList.remove("invalid");
          };
        [].forEach.call(t, function (e) {
          o(e);
        }),
          e.addEventListener("submit", r);
      }
    },
    G = function () {
      let e = document.querySelector(".module-postarchive");
      if (e) {
        let t = new PostArchive(e);
      }
    };
  class PostArchive {
    constructor(e) {
      (this.elem = e),
        (this.inner = e.querySelector(".post-archive-inner")),
        (this.posts = [].slice.call(this.inner.querySelectorAll(".post-card"))),
        (this.loadMoreSection = e.querySelector(".post-archive-loadmore")),
        (this.masonryThreshold = 700),
        (this.postTileTitleThreshold = 700),
        (this.masonryRowGap = 12),
        (this.masonryColGap = 12),
        (this.postsPerLoad = this.inner.dataset.posts),
        (this.imageLoadUpdateDelay = 250),
        (this.loadMoreOnScroll = !0),
        (this.debug = !1),
        (this.masonryColumns = [
          { amount: 1, minWidth: 0, postsPerLoad: 10 },
          { amount: 2, minWidth: 700, postsPerLoad: 10 },
          { amount: 4, minWidth: 1400, postsPerLoad: 20 },
          { amount: 8, minWidth: 2400, postsPerLoad: 30 },
        ]),
        (this.masonryColumnsCount = null),
        (this.currentFilter = null),
        (this.visiblePostsCount = null),
        (this.isLoadingMore = !1),
        (this.hasFinishedLoading = !1),
        this.init();
    }
    init() {
      this.registerFilters(),
        this.registerColumnSettings(),
        this.registerEvents(),
        this.compressMasonry(),
        r.checkVisibility(),
        o.checkVisibility();
    }
    registerEvents() {
      window.addEventListener("resize", this.resize.bind(this)),
        this.posts.forEach((e) =>
          e.addEventListener("mousemove", this.updatePostTileTitle.bind(this))
        ),
        this.loadMoreSection.addEventListener(
          "click",
          this.loadMorePosts.bind(this)
        ),
        this.observeLoadMoreOnScroll();
    }
    resize() {
      this.masonryUpdate(),
        this.compressMasonry(),
        this.filtersList &&
          this.filtersVisible &&
          (this.filtersList.style.maxHeight =
            this.filtersList.scrollHeight + "px");
    }
    observeLoadMoreOnScroll() {
      if (this.loadMoreOnScroll) {
        let e = { rootMargin: "-100px 0px -100px 0px", threshold: 0.1 };
        (this.loadMoreObserver = new IntersectionObserver(
          this.scrolledToEnd.bind(this),
          e
        )),
          this.loadMoreObserver.observe(this.loadMoreSection);
      }
    }
    scrolledToEnd(e) {
      this.loadMoreOnScroll &&
        ((e = e || [this.loadMoreSection]),
        this.debug && console.log(0, e),
        e.forEach((e) => {
          if (!("isIntersecting" in e)) {
            let t = e.getBoundingClientRect();
            if (
              (this.debug &&
                console.log(2, "Auto reload.", t.top < -t.height, t.top > g()),
              t.top < -t.height || t.top > g())
            )
              return;
          } else if (
            (this.debug &&
              console.log(
                1,
                "Proper entry. Is intersecting?",
                e.isIntersecting
              ),
            !e.isIntersecting)
          )
            return;
          this.hasFinishedLoading || this.loadMorePosts();
        }));
    }
    registerFilters() {
      let e = this.elem.querySelector(".post-archive-filters");
      e &&
        ((this.filtersContainer = e),
        (this.filtersToggle = e.querySelector(".post-archive-filter-toggle")),
        (this.filterCurrent = e.querySelector(".post-archive-filter-current")),
        (this.filtersList = e.querySelector(".post-archive-filters-list")),
        (this.filterElems = [].slice.call(
          e.querySelectorAll(".post-archive-filter")
        )),
        (this.filtersVisible = !1),
        this.filtersToggle.addEventListener(
          "click",
          this.toggleFilters.bind(this)
        ),
        this.filterCurrent.addEventListener(
          "click",
          this.clearFilter.bind(this)
        ),
        this.filterElems.forEach((e) =>
          e.addEventListener("click", this.applyFilter.bind(this))
        ));
    }
    toggleFilters() {
      (this.filtersVisible = !this.filtersVisible),
        this.filtersContainer.classList.toggle(
          "show-filters",
          this.filtersVisible
        ),
        (this.filtersToggle.innerText = this.filtersVisible
          ? this.filtersToggle.dataset.close
          : this.filtersToggle.dataset.open),
        (this.filtersList.style.maxHeight =
          (this.filtersVisible ? this.filtersList.scrollHeight : 0) + "px");
    }
    applyFilter(t) {
      let e = t.target.classList.contains("post-archive-filter")
          ? t.target
          : t.target.closest(".post-archive-filter"),
        s = e.dataset.director;
      (this.currentFilter = s), this.toggleFilters(), this.filterListNow();
    }
    clearFilter() {
      (this.currentFilter = null), this.filterListNow();
    }
    filterListNow() {
      if (null !== this.currentFilter) {
        let e = this.filterElems.find(
          (e) => e.dataset.director == this.currentFilter
        ).innerText;
        this.filterCurrent.innerText = e;
      } else this.filterCurrent.innerText = "";
      this.elem.classList.toggle("is-filtering", null !== this.currentFilter),
        (this.filterCurrent.style.maxHeight =
          (null === this.currentFilter ? 0 : this.filterCurrent.scrollHeight) +
          "px"),
        (this.posts = this.posts.map(
          (e) => (
            (e.visible =
              null === this.currentFilter ||
              -1 < e.directors.indexOf(this.currentFilter)),
            e.element.classList.toggle("hide", !e.visible),
            e
          )
        )),
        (this.visiblePostsCount = this.posts.filter((e) => e.visible).length),
        this.continueLoading(),
        this.masonryUpdate();
    }
    registerColumnSettings() {
      let e = [].slice.call(
        this.elem.querySelectorAll(".post-archive-settings-cols")
      );
      0 == e.length ||
        ((this.columnsSettings = e),
        this.columnsSettings.forEach((e) =>
          e.addEventListener("click", this.columnsSettingsClick.bind(this))
        ));
    }
    columnsSettingsClick(t) {
      let e = t.target.classList.contains("post-archive-settings-cols")
        ? t.target
        : t.target.closest(".post-archive-settings-cols");
      e.classList.contains("active") ||
        this.changeColumnsSetting(e.dataset.cols);
    }
    changeColumnsSetting(e) {
      (this.masonryColumnsCount = e),
        this.columnsSettings.forEach((t) =>
          t.classList.toggle("active", t.dataset.cols == e)
        ),
        this.inner.style.setProperty("--cols", this.masonryColumnsCount),
        (this.postsPerLoad = this.masonryColumns.find(
          (t) => t.amount == e
        ).postsPerLoad),
        this.masonryUpdate();
    }
    masonryMeasure() {
      (this.posts = this.posts.map((e) => {
        let t = e instanceof HTMLElement ? e : e.element,
          s = t.querySelector("img, video"),
          i = t.dataset.directors ? t.dataset.directors.split(",") : [],
          l = s ? parseFloat(s.getAttribute("width")) : 0,
          r = s ? parseFloat(s.getAttribute("height")) : 0;
        return (
          t.classList.remove("new-post"),
          {
            aspectRatio: s && 0 !== l ? r / l : 0.5625,
            directors: i,
            element: t,
            left: 0,
            top: 0,
            visible: !t.classList.contains("hide"),
          }
        );
      })),
        (this.visiblePostsCount = this.posts.filter((e) => e.visible).length),
        this.continueLoading();
    }
    masonryUpdate() {
      this.masonryMeasure(),
        m() >= this.masonryThreshold
          ? this.masonryLayBricks()
          : this.masonryTearDown();
    }
    masonryLayBricks() {
      let e = Math.floor(
          (this.elem.getBoundingClientRect().width - this.masonryColGap) /
            this.masonryColumnsCount
        ),
        t = 0;
      this.posts = this.posts.map((s, l) => {
        if (!s.visible) return t++, s;
        let i = this.getLastElementPosition(l - t, e);
        return (
          (s.element.style.left = i.left + "px"),
          (s.element.style.top = i.top + "px"),
          (s.left = i.left),
          (s.top = i.top),
          s
        );
      });
      let s = this.getLastElementPosition(null, e, !0);
      (this.inner.style.height = s + "px"),
        setTimeout(() => {
          r.checkVisibility(), o.checkVisibility();
        }, this.imageLoadUpdateDelay);
    }
    masonryTearDown() {
      this.posts.forEach((e) => {
        (e.element.style.left = ""), (e.element.style.top = "");
      }),
        (this.inner.style.height = ""),
        setTimeout(() => {
          r.checkVisibility(), o.checkVisibility();
        }, this.imageLoadUpdateDelay);
    }
    getLastElementPosition(e, t) {
      let s =
        !!(2 < arguments.length && void 0 !== arguments[2]) && arguments[2];
      if (s)
        return this.posts.reduce((e, s) => {
          if (!s.visible) return e;
          let i = s.top + s.aspectRatio * t;
          return e > i ? e : i;
        }, 0);
      let i = this.posts
          .filter((e) => e.visible)
          .slice(0, e)
          .reverse(),
        l = 0,
        r = Array(this.masonryColumnsCount).fill(null),
        o = null,
        a = null;
      for (; l < this.masonryColumnsCount; ) {
        if (i.length !== l) {
          l++;
          continue;
        }
        return { left: l * (t + this.masonryColGap), top: 0 };
      }
      return (
        i.forEach((e) => {
          let s = e.top + e.aspectRatio * t;
          for (let l = 0; l < this.masonryColumnsCount; l++) {
            let i = l % this.masonryColumnsCount,
              o = i * (t + this.masonryColGap);
            e.left === o && null == r[i] && (r[i] = s);
          }
        }),
        (r = r
          .map((e, t) => ({ column: t, bottom: e }))
          .sort((e, t) => e.bottom - t.bottom)),
        {
          left: r[0].column * (t + this.masonryColGap),
          top: r[0].bottom + this.masonryRowGap,
        }
      );
    }
    compressMasonry() {
      let e = m(),
        t = e > this.masonryColumns.find((e) => 2 == e.amount).minWidth ? 2 : 1;
      null !== this.masonryColumnsCount &&
        this.masonryColumns.reverse().forEach((s) => {
          s.minWidth > e || (t = Math.max(s.amount, t));
        });
      (null !== this.masonryColumnsCount &&
        t > this.masonryColumnsCount &&
        (2 != t || 1 != this.masonryColumnsCount)) ||
        this.changeColumnsSetting(t);
    }
    loadMorePosts() {
      if (
        (this.debug &&
          console.log(
            3,
            "Load more posts? Finished loading: " +
              this.hasFinishedLoading +
              " - Is loading: " +
              this.isLoadingMore
          ),
        !(this.hasFinishedLoading || this.isLoadingMore))
      ) {
        this.debug && console.log(4, "Load more posts.");
        var e = this,
          s = t("POST", localisedbb.ajaxurl, !0),
          i =
            "action=loadMorePosts&count=" +
            this.postsPerLoad +
            "&offset=" +
            this.visiblePostsCount +
            "&director=" +
            this.currentFilter;
        (this.isLoadingMore = !0),
          s.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
          (s.onreadystatechange = function () {
            if (
              (e.debug &&
                console.log(
                  6,
                  "Intermediary response?",
                  this.readyState,
                  this.status
                ),
              4 !== this.readyState)
            )
              return;
            if (((e.isLoadingMore = !1), 200 !== this.status)) return !1;
            let t = JSON.parse(this.responseText);
            e.debug && console.log(7, "Response received.", t);
            let s = null;
            return (
              t.posts.forEach((t, i) => {
                let l = document.createElement("div"),
                  r = document.createElement("div");
                e.inner.appendChild(r),
                  (r.innerHTML = t),
                  (l.className = r.querySelector("div").className),
                  l.classList.add("new-post"),
                  (l.dataset.director =
                    r.querySelector("div").dataset.director),
                  (l.innerHTML = r.querySelector("div").innerHTML),
                  e.inner.removeChild(r),
                  e.inner.appendChild(l),
                  l.addEventListener(
                    "mousemove",
                    e.updatePostTileTitle.bind(e)
                  ),
                  0 == i && (s = l),
                  setTimeout(() => l.classList.remove("new-post"), 1e3);
              }),
              (e.posts = [].slice.call(e.inner.querySelectorAll(".post-card"))),
              r.findImages(e.inner),
              o.findVideos(e.inner),
              e.masonryUpdate(),
              s && s.scrollIntoView(!0),
              e.scrolledToEnd.bind(e),
              t.finished ? (e.finishLoading(), !0) : t.finished
            );
          }),
          this.elem.classList.remove("finished"),
          this.debug && console.log(5, "Load more posts with this data: " + i),
          s.send(encodeURI(i));
      }
    }
    finishLoading() {
      (this.hasFinishedLoading = !0),
        this.elem.classList.add("finished"),
        this.loadMoreObserver &&
          this.loadMoreObserver.unobserve(this.loadMoreSection);
    }
    continueLoading() {
      this.elem.classList.remove("finished"),
        this.loadMoreObserver &&
          this.loadMoreObserver.observe(this.loadMoreSection),
        this.visiblePostsCount < this.postsPerLoad &&
          !this.hasFinishedLoading &&
          this.loadMorePosts();
    }
    updatePostTileTitle(t) {
      if (!(m() < this.postTileTitleThreshold || h())) {
        let e = t.target.classList.contains("post-card")
            ? t.target
            : t.target.closest(".post-card"),
          s = e.querySelector(".post-card-details"),
          i = t.offsetY,
          l = t.offsetX;
        (s.style.top = i + "px"), (s.style.left = l + "px");
      }
    }
  }
  var X = function () {
      return;
      var e = document.querySelector(".module-postarchive:first-child");
      if (!e) return;
      let t = 15,
        s = 500,
        i = window.scrollY,
        l = null;
      var r = function (r) {
        let o = Date.now();
        if (!(null !== l && o - l < s)) {
          let s = window.scrollY,
            r = e.getBoundingClientRect(),
            a = Math.sign(s - i),
            n = s - t,
            d = e.offsetTop,
            c = r.bottom - g() - t,
            u = e.offsetTop + r.height - g() - t;
          0 < a && 0 > c && (window.scrollTo(0, d), (l = o)), (i = s);
        }
      };
      window.addEventListener("scroll", r);
    },
    K = function () {
      let e = [].slice.call(
        document.querySelectorAll(".slide-in, .slide-in-full, .slide-in-right")
      );
      if (0 == e.length) return;
      let t = function (e) {
          e.forEach((e) => {
            e.isIntersecting &&
              (e.target.classList.add("has-slided-in"),
              i.unobserve(e.target),
              r.checkVisibility(),
              o.checkVisibility());
          });
        },
        s = { threshold: 0 },
        i = new IntersectionObserver(t, s);
      e.forEach((e) => i.observe(e));
    },
    _ = function () {
      let e = new SearchForm();
    };
  class SearchForm {
    constructor() {
      (this.toggles = [].slice.call(
        document.querySelectorAll(".search-toggle")
      )),
        (this.modal = document.querySelector(".search-modal"));
      0 != this.toggles.length &&
        this.modal &&
        ((this.isVisible = this.modal.classList.contains("show")),
        (this.isSearchPage = this.modal.classList.contains("is-search-page")),
        (this.currentURL = window.location.href),
        (this.homeURL = localisedbb.homeurl),
        (this.searchBaseURL = localisedbb.searchbaseurl),
        this.init());
    }
    init() {
      this.registerUI(), this.registerEvents();
    }
    registerUI() {
      (this.closeBtn = this.modal.querySelector(".search-modal-close")),
        (this.modalInner = this.modal.querySelector(".search-modal-inner")),
        (this.form = this.modalInner.querySelector(".search-form")),
        (this.clearBtn = this.form.querySelector(".search-clear")),
        (this.searchInput = this.form.querySelector(".search-input")),
        (this.submitBtn = this.form.querySelector(".search-submit")),
        (this.resultsContainer = this.modalInner.querySelector(
          ".search-results-container"
        ));
    }
    registerEvents() {
      this.toggles.forEach((e) =>
        e.addEventListener("click", this.toggleModal.bind(this))
      ),
        this.form.addEventListener("submit", this.submitForm.bind(this)),
        this.closeBtn.addEventListener("click", this.closeModal.bind(this)),
        this.clearBtn.addEventListener("click", this.clearForm.bind(this)),
        this.searchInput.addEventListener("input", this.updateForm.bind(this)),
        this.modalInner.addEventListener(
          "scroll",
          (() => {
            r.checkVisibility(), o.checkVisibility();
          }).bind(this),
          { passive: !1 }
        ),
        this.resultsContainer.addEventListener(
          "scroll",
          (() => {
            r.checkVisibility(), o.checkVisibility();
          }).bind(this),
          { passive: !1 }
        );
    }
    toggleModal() {
      return (
        (this.isVisible = !this.isVisible),
        this.modal.classList.toggle("show", this.isVisible),
        this.isVisible
          ? (this.searchInput.focus(), void a.disableKeyControl())
          : void ((this.resultsContainer.innerHTML = ""),
            this.clearForm(),
            a.enableKeyControl(),
            window.scrollTo({ top: 0, left: 0, behavior: "instant" }))
      );
    }
    closeModal() {
      this.isSearchPage
        ? (window.location.href = this.homeURL)
        : this.toggleModal();
    }
    updateForm() {
      this.form.classList.toggle(
        "has-search-term",
        0 < this.searchInput.value.length
      );
    }
    submitForm(s) {
      s && s.preventDefault();
      var e = this,
        i = t("POST", localisedbb.ajaxurl, !0),
        l = "action=getSearchResults&searchterm=" + this.searchInput.value,
        a = this.searchBaseURL + encodeURI(this.searchInput.value) + "/";
      i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
        (i.onreadystatechange = function () {
          if (4 !== this.readyState || 200 !== this.status) return !1;
          let t = this.responseText;
          0 == t.length ||
            ((t = JSON.parse(t)),
            (e.resultsContainer.innerHTML = t.results),
            e.resultsContainer.scrollTo({
              left: 0,
              top: 0,
              behavior: "instant",
            }),
            e.modalInner.scrollTo({ left: 0, top: 0, behavior: "instant" }),
            0 < t.amountFound
              ? (e.modalInner.classList.add("has-search-results"),
                e.modalInner.classList.remove("has-no-search-results"),
                r.findImages(e.resultsContainer),
                o.findVideos(e.resultsContainer),
                r.checkVisibility(),
                o.checkVisibility(),
                S(e.resultsContainer))
              : (e.modalInner.classList.remove("has-search-results"),
                e.modalInner.classList.add("has-no-search-results")));
        }),
        i.send(encodeURI(l)),
        c.update(a, null, { searchCloseURL: this.currentURL });
    }
    clearForm() {
      this.form.reset(),
        this.form.classList.remove("has-search-term"),
        this.modalInner.classList.remove("has-search-results"),
        (this.resultsContainer.innerHTML = "");
    }
  }
  var J = function () {
      let e = document.querySelector(".module-aboutcontent.has-background");
      if (!e) return;
      let t = document.querySelector(".wrapper"),
        s = document.querySelector(".header"),
        i = e.querySelector(".about-bg"),
        l = function () {
          let e = i.getBoundingClientRect().height,
            l = s.getBoundingClientRect(),
            r = t.getBoundingClientRect().height,
            o = f(),
            a = o / (r - g()),
            n = a * (g() - e),
            d = 0 >= r - g() - o - l.bottom;
          (i.style.transform = e <= g() ? "" : "translateY(" + n + "px)"),
            s.classList.toggle("hide", d);
        };
      window.addEventListener("resize", l),
        window.addEventListener("scroll", l),
        l();
    },
    Q = function () {
      var e =
        "**********\n\nThis website was designed by Nicolas Bernklau.\nwww.nicolasbernklau.de\n\nIt was built by Matthias Planitzer.\nwww.matthias-planitzer.de\n\n**********";
      console.log(
        "%c**********\n\nThis website was designed by Nicolas Bernklau.\nwww.nicolasbernklau.de\n\nIt was built by Matthias Planitzer.\nwww.matthias-planitzer.de\n\n**********",
        'color: #00F; font-family: Helvetica Neue", Helvetica, sans-serif; font-size: 14px;'
      );
    };
  class SwipeDetect {
    constructor(e, t, s) {
      var i = {
        minDistance: 50,
        addMouseEvents: !0,
        addDragDropEvents: !0,
        horizontal: !0,
        vertical: !0,
        stagger: 100,
      };
      (this.elem = e),
        (this.callback = t),
        (this.args = Object.assign(i, s)),
        (this.active = !1),
        (this.eventType = null),
        (this.lastPos = { x: null, y: null }),
        (this.lastEmit = Date.now()),
        this.registerEvents();
    }
    destruct() {
      this.elem.removeEventListener("touchstart", this.fn.startTouch),
        this.elem.removeEventListener("touchmove", this.fn.move),
        this.elem.removeEventListener("touchend", this.fn.end),
        this.args.addMouseEvents &&
          (this.elem.removeEventListener("mousedown", this.fn.startMouse),
          this.elem.removeEventListener("mousemove", this.fn.move),
          this.elem.removeEventListener("mouseleave", this.fn.end),
          document.removeEventListener("mouseup", this.fn.end)),
        this.args.addDragDropEvents &&
          (this.elem.removeEventListener("dragstart", this.fn.startDragDrop),
          this.elem.removeEventListener("dragleave", this.fn.end),
          this.elem.removeEventListener("dragexit", this.fn.end),
          this.elem.removeEventListener("drop", this.fn.end));
    }
    registerEvents() {
      (this.fn = {
        startDragDrop: this.startDragDrop.bind(this),
        startMouse: this.startMouse.bind(this),
        startTouch: this.startTouch.bind(this),
        move: this.move.bind(this),
        end: this.end.bind(this),
      }),
        this.elem.addEventListener("touchstart", this.fn.startTouch),
        this.elem.addEventListener("touchmove", this.fn.move),
        this.elem.addEventListener("touchend", this.fn.end),
        this.args.addMouseEvents &&
          (this.elem.addEventListener("mousedown", this.fn.startMouse),
          this.elem.addEventListener("mousemove", this.fn.move),
          this.elem.addEventListener("mouseleave", this.fn.end),
          document.addEventListener("mouseup", this.fn.end)),
        this.args.addDragDropEvents &&
          (this.elem.addEventListener("dragstart", this.fn.startDragDrop),
          this.elem.addEventListener("dragleave", this.fn.end),
          this.elem.addEventListener("dragexit", this.fn.end),
          this.elem.addEventListener("drop", this.fn.end));
    }
    startTouch(e) {
      (this.active = !0),
        (this.eventType = "touch"),
        (this.lastPos = this.getPosition(e));
    }
    startMouse(e) {
      (this.active = !0),
        (this.eventType = "mouse"),
        (this.lastPos = this.getPosition(e));
    }
    startDragDrop(e) {
      (this.active = !0),
        (this.eventType = "dragdrop"),
        (this.lastPos = this.getPosition(e));
    }
    move(e) {
      if (this.active) {
        var t = Date.now(),
          s = t - this.lastEmit;
        if (!(s < this.args.stagger)) {
          var i = this.getPosition(e),
            l = this.distance(this.lastPos, i),
            r = {
              distance2D: Math.sqrt(l.x * l.x + l.y * l.y),
              direction2D: Math.atan2(l.y, l.x),
              type: this.eventType,
              event: e,
            };
          this.args.horizontal &&
            ((r.distanceX = l.x),
            (r.directionX = Math.sign(l.x / this.args.minDistance))),
            this.args.vertical &&
              ((r.distanceY = l.y),
              (r.directionY = Math.sign(l.y / this.args.minDistance))),
            ((0 !== r.directionX && this.args.horizontal) ||
              (0 !== r.directionY && this.args.vertical)) &&
              ((this.lastPos = i), (this.lastEmit = t), this.callback(r));
        }
      }
    }
    end(e) {
      this.active = !1;
    }
    getPosition(e) {
      var t = "touch" == this.eventType ? e.touches[0] : e;
      return { x: t.clientX, y: t.clientY };
    }
    distance(e, t) {
      return { x: e.x - t.x, y: e.y - t.y };
    }
  }
  class EventManager {
    constructor() {
      (this.scrollCallbacks = { throttle: [], debounce: [] }),
        (this.resizeCallbacks = { throttle: [], debounce: [] }),
        window.addEventListener("scroll", this.scroll.bind(this), {
          passive: !1,
        }),
        window.addEventListener("resize", this.resize.bind(this));
    }
    getUniqueID() {
      var e = function () {
        return Math.floor(65536 * (1 + Math.random()))
          .toString(16)
          .substring(1);
      };
      return (
        e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
      );
    }
    addScrollThrottleCallback(e) {
      let t =
        1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 50;
      var s = this.getUniqueID();
      return (
        this.scrollCallbacks.throttle.push({ id: s, func: e, delay: t }), s
      );
    }
    addScrollDebounceCallback(e) {
      let t =
        1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 50;
      var s = this.getUniqueID();
      return (
        this.scrollCallbacks.debounce.push({ id: s, func: e, delay: t }), s
      );
    }
    addResizeThrottleCallback(e) {
      let t =
        1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 50;
      var s = this.getUniqueID();
      return (
        this.resizeCallbacks.throttle.push({ id: s, func: e, delay: t }), s
      );
    }
    addResizeDebounceCallback(e) {
      let t =
        1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 50;
      var s = this.getUniqueID();
      return (
        this.resizeCallbacks.debounce.push({ id: s, func: e, delay: t }), s
      );
    }
    removeScrollThrottleCallback(e) {
      this.scrollCallbacks.throttle = this.scrollCallbacks.throttle.filter(
        function (t) {
          return t.id != e;
        }
      );
    }
    removeScrollDebounceCallback(e) {
      this.scrollCallbacks.debounce = this.scrollCallbacks.debounce.filter(
        function (t) {
          return t.id != e;
        }
      );
    }
    removeResizeThrottleCallback(e) {
      this.resizeCallbacks.throttle = this.resizeCallbacks.throttle.filter(
        function (t) {
          return t.id != e;
        }
      );
    }
    removeResizeDebounceCallback(e) {
      this.resizeCallbacks.debounce = this.scroresizebacks.debounce.filter(
        function (t) {
          return t.id != e;
        }
      );
    }
    scroll(t) {
      this.scrollCallbacks.throttle.forEach(
        function (e) {
          this.throttle(e, t)();
        }.bind(this)
      ),
        this.scrollCallbacks.debounce.forEach(
          function (e) {
            this.debounce(e, t)();
          }.bind(this)
        );
    }
    resize(t) {
      this.resizeCallbacks.throttle.forEach(
        function (e) {
          this.throttle(e, t)();
        }.bind(this)
      ),
        this.resizeCallbacks.debounce.forEach(
          function (e) {
            this.debounce(e, t)();
          }.bind(this)
        );
    }
    throttle(t, s) {
      var e, i;
      return function () {
        t.func();
        var l = this;
        i
          ? (clearTimeout(e),
            (e = setTimeout(function () {
              Date.now() - i >= t.delay &&
                (t.func.apply(l, s), (i = Date.now()));
            }, t.delay - (Date.now() - i))))
          : (t.func.apply(l, s), (i = Date.now()));
      };
    }
    debounce(t, s) {
      var e;
      return function () {
        var i = this;
        clearTimeout(e),
          (e = setTimeout(function () {
            t.func.apply(i, s);
          }, t.delay));
      };
    }
  }
  (function () {
    (l = new EventManager()),
      (r = new ImagePreloader()),
      (o = new VideoPreloader()),
      (a = new ConstructVimeoPlayers()),
      (n = L()),
      (d = new CookieConsent({
        elemNoticeBar: document.querySelector(".cookie-bar"),
      })),
      (c = new URLUpdater()),
      (u = new DirectorTitleSnapper()),
      b(),
      B(),
      T(),
      A(),
      S(),
      q(),
      w(),
      k(),
      E(),
      x(),
      M(),
      z(),
      H(),
      R(),
      I(),
      V(),
      D(),
      Y(),
      j(),
      P(),
      G(),
      K(),
      _(),
      J(),
      Q(),
      l.addScrollThrottleCallback(T);
  })();
})();
var gaProperty = "UA-68086514-1",
  disableStr = "ga-disable-UA-68086514-1";
-1 < document.cookie.indexOf(disableStr + "=true") && (window[disableStr] = !0);
function gaOptout() {
  (document.cookie =
    disableStr + "=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/"),
    (window[disableStr] = !0);
}
