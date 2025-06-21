(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [281],
  {
    5024: function () {},
    9996: function (e, t, n) {
      Promise.resolve().then(n.bind(n, 4425));
    },
    4425: function (e, t, n) {
      "use strict";
      n.r(t),
        n.d(t, {
          default: function () {
            return w;
          },
        });
      var o = n(7437),
        a = n(2265),
        l = n(4105),
        i = n(4508),
        r = n(7648),
        s = n(9326),
        c = n(6362),
        p = n(7184),
        d = n(5807),
        x = n.n(d),
        m = n(5515),
        u = n.n(m),
        h = n(3057);
      let f = (e) => {
        let { className: t } = e,
          {
            isAuthenticated: n,
            login: d,
            loginPhantom: m,
            error: f,
          } = (0, c.a)(),
          [w, b] = (0, a.useState)(!1),
          [g, y] = (0, a.useState)(""),
          [v, j] = (0, a.useState)(""),
          N = (0, p.l)(),
          k = async () => {
            let e = window.location.origin,
              t = "https://phantom.app/ul/v1/connect?app_url="
                .concat(encodeURIComponent(e), "&dapp_encryption_public_key=")
                .concat(
                  encodeURIComponent(h.Z.encode(N.publicKey)),
                  "&redirect_link="
                )
                .concat(encodeURIComponent(e + "signin.html"), "&cluster=")
                .concat(encodeURIComponent("mainnet-beta"));
            window.location.href = t;
          };
        (0, a.useEffect)(() => {
          !(async function () {
            let e = new URLSearchParams(window.location.search);
            console.log(e);
            let t = e.get("phantom_encryption_public_key"),
              n = e.get("nonce"),
              o = e.get("data");
            if ((console.log(t), console.log(n), console.log(o), t && n && o))
              try {
                let e = x().box.before(h.Z.decode(t), N.secretKey),
                  a = (0, p.o)(o, n, e);
                await m(a.public_key);
              } catch (e) {
                console.error("Ошибка при расшифровке данных Phantom:", e),
                  u().fire({
                    title: "Phantom error",
                    text: "Wallet not connected",
                    icon: "error",
                    color: "#ffffff",
                    background: "#222326",
                    iconColor: "#ff4c4c",
                    customClass: {
                      popup:
                        "rounded-[18px] p-[1px] shadow-main bg-[#2e2e3e] pb-6",
                      htmlContainer: "rounded-[17px] p-5 text-white",
                      title: "text-xl font-bold text-white",
                      confirmButton:
                        "bg-gradient-to-br from-[#FF00FF] to-[#930093] p-px shadow-magenta-btn text-white px-6 py-2 rounded-xl hover:bg-pink/90 active:scale-[97%] opacity-90 transition-opacity hover:opacity-100",
                    },
                    confirmButtonText: "OK",
                    buttonsStyling: !1,
                  });
              }
          })();
        }, []);
        let C = async () => {
            if (/Mobi|Android/i.test(window.navigator.userAgent)) {
              try {
                await k();
              } catch (e) {
                console.error("Ошибка мобильного подключения:", e),
                  u()
                    .fire({
                      icon: "warning",
                      title: "Phantom Wallet not found",
                      text: "Could not find a compatible wallet. Install Phantom Wallet to continue.",
                      confirmButtonText: "\uD83D\uDD17 Download Phantom",
                      iconColor: "#00ff94",
                      color: "#ffffff",
                      background: "#222326",
                      customClass: {
                        popup:
                          "rounded-[18px] p-[1px] shadow-main bg-[#2e2e3e] pb-6",
                        htmlContainer: "rounded-[17px] p-5 text-white",
                        title: "text-xl font-bold text-white",
                        confirmButton:
                          "bg-gradient-to-br from-[#FF00FF] to-[#930093] p-px shadow-magenta-btn text-white px-6 py-2 rounded-xl hover:bg-pink/90 active:scale-[97%] opacity-90 transition-opacity hover:opacity-100",
                      },
                      buttonsStyling: !1,
                    })
                    .then((e) => {
                      e.isConfirmed &&
                        window.open("https://phantom.app/", "_blank");
                    });
              }
              return;
            }
            if (window.solana && window.solana.isPhantom)
              try {
                var e;
                await window.solana.connect();
                let t =
                  null === (e = window.solana.publicKey) || void 0 === e
                    ? void 0
                    : e.toString();
                t
                  ? (console.log("Десктопный кошелёк подключён:", t),
                    await m(t))
                  : console.error("Не удалось получить публичный ключ");
              } catch (e) {
                console.error("Ошибка подключения Phantom:", e);
              }
            else
              u()
                .fire({
                  icon: "warning",
                  title: "Phantom Wallet not found",
                  text: "Could not find a compatible wallet. Install Phantom Wallet to continue.",
                  confirmButtonText: "\uD83D\uDD17 Download Phantom",
                  iconColor: "#00ff94",
                  color: "#ffffff",
                  background: "#222326",
                  customClass: {
                    popup:
                      "rounded-[18px] p-[1px] shadow-main bg-[#2e2e3e] pb-6",
                    htmlContainer: "rounded-[17px] p-5 text-white",
                    title: "text-xl font-bold text-white",
                    confirmButton:
                      "bg-gradient-to-br from-[#FF00FF] to-[#930093] p-px shadow-magenta-btn text-white px-6 py-2 rounded-xl hover:bg-pink/90 active:scale-[97%] opacity-90 transition-opacity hover:opacity-100",
                  },
                  buttonsStyling: !1,
                })
                .then((e) => {
                  e.isConfirmed &&
                    window.open("https://phantom.app/", "_blank");
                });
          },
          S = async () => {
            g && v && (await d(g, v));
          };
        return (
          (0, a.useEffect)(() => {
            n && (window.location.href = "/");
          }, [n]),
          (0, o.jsxs)("div", {
            className: (0, i.cn)(t, "mt-6"),
            children: [
              (0, o.jsxs)("div", {
                className: "py-8",
                children: [
                  (0, o.jsx)("span", {
                    className: "text-sm text-secondary",
                    children: "Login",
                  }),
                  (0, o.jsx)(l.kk, {
                    variant: "inside",
                    classNameWrapper: "mt-2.5 mb-3 h-[50px]",
                    classNameChild:
                      "py-[3px] px-4 pr-1 flex justify-between items-center",
                    children: (0, o.jsx)("input", {
                      type: "text",
                      placeholder: "Enter login",
                      className: "w-full",
                      value: g,
                      onChange: (e) => y(e.target.value),
                    }),
                  }),
                  (0, o.jsx)("span", {
                    className: "text-sm text-secondary",
                    children: "Password",
                  }),
                  (0, o.jsx)(l.kk, {
                    variant: "inside",
                    classNameWrapper: "mt-2.5 mb-2 h-[50px]",
                    classNameChild:
                      "py-[3px] px-4 pr-1 flex justify-between items-center",
                    children: (0, o.jsx)("input", {
                      type: "password",
                      placeholder: "Enter password",
                      className: "w-full",
                      value: v,
                      onChange: (e) => j(e.target.value),
                    }),
                  }),
                  (0, o.jsx)("div", {
                    className: "text-pink-500",
                    children: f,
                  }),
                  (0, o.jsx)(l.op, {
                    variant: "red",
                    classNameWrapper:
                      "w-full h-[50px] mt-9 active:!scale-[99%]",
                    classNameChild: "text-[22px] text-white",
                    onClick: S,
                    children: "Login",
                  }),
                  (0, o.jsxs)("div", {
                    className: "flex flex-row w-full justify-between",
                    children: [
                      (0, o.jsx)(l.XZ, {
                        label: "Remember me",
                        variant: "second",
                        checked: w,
                        onChange: () => b(!w),
                        className: "mt-5",
                        classNameLabel: "!ml-[14px] text-sm text-pink-hot",
                      }),
                      (0, o.jsx)(r.default, {
                        className: "mt-5 text-sm text-pink-hot",
                        href: "#",
                        children: "Forgot password?",
                      }),
                    ],
                  }),
                ],
              }),
              (0, o.jsxs)("div", {
                className: "flex items-center justify-center w-full",
                children: [
                  (0, o.jsx)("div", {
                    className: "flex-1 border-t border-gray-300",
                  }),
                  (0, o.jsx)("span", {
                    className: "mx-4 text-white font-semibold",
                    children: "Or",
                  }),
                  (0, o.jsx)("div", {
                    className: "flex-1 border-t border-gray-300",
                  }),
                ],
              }),
              (0, o.jsx)("div", {
                className: "flex justify-center mt-4",
                children: (0, o.jsx)(r.default, {
                  className: "text-sm text-pink-hot",
                  href: "signup.html",
                  children: "Create an account",
                }),
              }),
              (0, o.jsx)("div", {
                className: "pt-3",
                children: (0, o.jsx)("button", {
                  className:
                    "p-px shadow-main w-full h-[50px] mt-9 relative cursor-pointer rounded-[10px] opacity-90 transition-opacity hover:opacity-100 active:scale-[97%]",
                  onClick: C,
                  children: (0, o.jsx)("div", {
                    className: "inline",
                    children: (0, o.jsxs)("span", {
                      className:
                        "bg-purple-500 text-[22px] text-white flex h-full w-full items-center justify-center gap-2 rounded-[9px] py-2",
                      children: [(0, o.jsx)(s.SolanaPhantom, {}), " Solana"],
                    }),
                  }),
                }),
              }),
            ],
          })
        );
      };
      var w = () =>
        (0, o.jsxs)(l.kk, {
          classNameWrapper: "w-full sm:w-[606px] mx-auto mt-8 px-4",
          classNameChild: "!p-8",
          children: [
            (0, o.jsx)("h2", {
              className: "text-center text-3xl sm:text-4xl font-semibold",
              children: "Sign In",
            }),
            (0, o.jsx)(a.Suspense, {
              fallback: (0, o.jsx)("div", { children: "Loading..." }),
              children: (0, o.jsx)(f, {}),
            }),
          ],
        });
    },
    7184: function (e, t, n) {
      "use strict";
      n.d(t, {
        l: function () {
          return i;
        },
        o: function () {
          return r;
        },
      });
      var o = n(5807),
        a = n.n(o),
        l = n(3057);
      function i() {
        {
          let e = localStorage.getItem("phantomDappSecret");
          if (e) {
            let t = l.Z.decode(e);
            return a().box.keyPair.fromSecretKey(t);
          }
          let t = a().box.keyPair();
          return (
            localStorage.setItem("phantomDappSecret", l.Z.encode(t.secretKey)),
            t
          );
        }
      }
      function r(e, t, n) {
        let o = a().secretbox.open(l.Z.decode(e), l.Z.decode(t), n);
        if (!o) throw Error("Failed to decrypt payload");
        return JSON.parse(new TextDecoder().decode(o));
      }
    },
  },
  function (e) {
    e.O(0, [762, 461, 972, 40, 641, 105, 971, 117, 744], function () {
      return e((e.s = 9996));
    }),
      (_N_E = e.O());
  },
]);
