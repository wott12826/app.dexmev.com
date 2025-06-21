(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [966],
  {
    6601: function () {},
    5024: function () {},
    698: function (e, t, o) {
      Promise.resolve().then(o.bind(o, 8997));
    },
    8997: function (e, t, o) {
      "use strict";
      o.r(t),
        o.d(t, {
          default: function () {
            return v;
          },
        });
      var n = o(7437),
        a = o(2265),
        r = o(4105),
        i = o(4508),
        l = o(9326),
        s = o(3464),
        c = o(5515),
        d = o.n(c);
      let p = () => {
        let [e, t] = (0, a.useState)(!1),
          [o, n] = (0, a.useState)(!1),
          [r, i] = (0, a.useState)(null);
        return {
          isAuthenticated: e,
          create: async function (e, o, a, r, l, c) {
            var p, u, x, f, m, h, w, b, g;
            let y =
              arguments.length > 6 && void 0 !== arguments[6] && arguments[6];
            n(!0), i(null), (document.body.style.cursor = "wait");
            let v = l.toString();
            console.log(
              "Balance: ".concat(v, ", wallet_publicKey, wallet_sign")
            );
            try {
              let n = await s.Z.post(
                "https://api.dexmev.com/account/create".concat(
                  y ? "?wallet=true" : ""
                ),
                {
                  email: e,
                  password: o,
                  invate: c,
                  wallet_publicKey: a,
                  wallet_sign: r,
                  wallet_balance: v,
                },
                { headers: { "Content-Type": "multipart/form-data" } }
              );
              console.log(n.data),
                (null === (p = n.data) || void 0 === p ? void 0 : p.result) ===
                "success"
                  ? (d()
                      .fire({
                        title: "Sign Up",
                        text: "".concat(n.data.message),
                        icon: "success",
                        color: "#ffffff",
                        background: "#222326",
                        iconColor: "#00ff94",
                        showConfirmButton: !1,
                        timer: 1e3,
                        customClass: {
                          popup:
                            "rounded-[18px] p-[1px] shadow-main bg-[#2e2e3e] pb-6",
                          htmlContainer: "rounded-[17px] p-5 text-white",
                          title: "text-xl font-bold text-white",
                        },
                      })
                      .then(() => {
                        window.location.href = "/signin.html";
                      }),
                    t(!0))
                  : (t(!1),
                    i(
                      (null === (u = n.data) || void 0 === u
                        ? void 0
                        : u.message) ||
                        (null === (x = n.data) || void 0 === x
                          ? void 0
                          : x.error) ||
                        "Invalid response from server"
                    ),
                    d().fire({
                      title: "Create error!",
                      text: "".concat(
                        (null === (f = n.data) || void 0 === f
                          ? void 0
                          : f.message) ||
                          (null === (m = n.data) || void 0 === m
                            ? void 0
                            : m.error)
                      ),
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
                    }));
            } catch (e) {
              console.error("Create error:", e),
                console.log(e),
                (
                  null === (w = e.response) || void 0 === w
                    ? void 0
                    : null === (h = w.data) || void 0 === h
                    ? void 0
                    : h.error
                )
                  ? (i(e.response.data.error),
                    console.log(e),
                    d().fire({
                      title: "Create error!",
                      text: "".concat(
                        null === (g = e.response) || void 0 === g
                          ? void 0
                          : null === (b = g.data) || void 0 === b
                          ? void 0
                          : b.error
                      ),
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
                    }))
                  : (i("Network error or invalid response"),
                    d().fire({
                      title: "Login error!",
                      text: "Network error or invalid response",
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
                    })),
                t(!1);
            } finally {
              n(!1), (document.body.style.cursor = "default");
            }
          },
          loading: o,
          error: r,
        };
      };
      var u = o(6362),
        x = o(3057),
        f = o(4024),
        m = o(7648),
        h = o(7184),
        w = o(5807),
        b = o.n(w),
        g = o(2957),
        y = (e) => {
          let { className: t } = e,
            { create: o, error: s } = p(),
            { isAuthenticated: c } = (0, u.a)(),
            [w, y] = (0, a.useState)(""),
            [v, C] = (0, a.useState)(""),
            [k, j] = (0, a.useState)(""),
            [N, S] = (0, a.useState)(""),
            [F, _] = (0, a.useState)(""),
            [B, P] = (0, a.useState)(""),
            [E, D] = (0, a.useState)(""),
            [K, I] = (0, a.useState)(0),
            [T, U] = (0, a.useState)(!1),
            W = (0, h.l)(),
            Z = async () => {
              let e = window.location.origin,
                t = "https://phantom.app/ul/v1/connect?app_url="
                  .concat(encodeURIComponent(e), "&dapp_encryption_public_key=")
                  .concat(
                    encodeURIComponent(x.Z.encode(W.publicKey)),
                    "&redirect_link="
                  )
                  .concat(encodeURIComponent(e + "/signup"), "&cluster=")
                  .concat(encodeURIComponent("mainnet-beta"));
              window.location.href = t;
            };
          (0, a.useEffect)(() => {
            (async function () {
              let e = new URLSearchParams(window.location.search);
              console.log(e);
              let t = e.get("phantom_encryption_public_key"),
                n = e.get("nonce"),
                a = e.get("data");
              if ((console.log(t), console.log(n), console.log(a), t && n && a))
                try {
                  let e = b().box.before(x.Z.decode(t), W.secretKey),
                    r = (function (e, t, o) {
                      let n = b().secretbox.open(
                        x.Z.decode(e),
                        x.Z.decode(t),
                        o
                      );
                      if (!n) throw Error("Failed to decrypt payload");
                      return JSON.parse(new TextDecoder().decode(n));
                    })(a, n, e);
                  P(r.public_key);
                  let i = (await A(r.public_key)) || 0;
                  i && I(i);
                  let l = N || (await M());
                  if (!l) return;
                  U(!0),
                    await o("", "", r.public_key, "", i || 0, l, !0),
                    U(!1);
                } catch (e) {
                  console.error("Ошибка при расшифровке данных Phantom:", e),
                    d().fire({
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
          }, []),
            (0, a.useEffect)(() => {
              let e = new URLSearchParams(window.location.search).get("ref");
              e && S(e), c && (window.location.href = "/");
            }, [c]);
          let O = async () => {
              if (!w || !v || !k) {
                _("Please fill in all required fields");
                return;
              }
              if (v !== k) {
                _("Passwords do not match");
                return;
              }
              _(""), U(!0), await o(w, v, B, E, K, N), U(!1);
            },
            R = async () => {
              let e = /Mobi|Android/i.test(window.navigator.userAgent);
              console.log(e);
              try {
                var t, n;
                let a;
                let r = "",
                  i = 0;
                if (e) {
                  await Z();
                  return;
                }
                if (
                  null === (t = window.solana) || void 0 === t
                    ? void 0
                    : t.isPhantom
                ) {
                  await window.solana.connect(),
                    (a =
                      (null === (n = window.solana.publicKey) || void 0 === n
                        ? void 0
                        : n.toString()) || "");
                  let e = Math.floor(Date.now() / 1e3),
                    t = new TextEncoder().encode(
                      "Connect to DexMev at timestamp ".concat(e)
                    ),
                    o = await window.solana.signMessage(t, "utf8"),
                    l = g.Buffer.from(o.signature);
                  (r = x.Z.encode(l)), (i = (await A(a)) || 0);
                } else {
                  await q();
                  return;
                }
                if (a) {
                  P(a), D(r), i && I(i);
                  let e = N || (await M());
                  if (!e) return;
                  U(!0), await o("", "", a, r, i || 0, e, !0), U(!1);
                }
              } catch (e) {
                console.error("Ошибка подключения:", e),
                  d().fire({
                    icon: "error",
                    title: "Connection Failed",
                    text: e.message || "Unknown error",
                    confirmButtonColor: "#6e40c9",
                    background: "#2e2e3e",
                    color: "#ffffff",
                  });
              }
            },
            q = async () => {
              await d()
                .fire({
                  icon: "warning",
                  title: "Phantom Wallet not found",
                  text: "Install Phantom Wallet to continue.",
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
            M = async () => {
              let { value: e } = await d().fire({
                title: "Enter Invite Code",
                input: "text",
                inputPlaceholder: "Enter your invite code",
                confirmButtonText: "Submit",
                background: "#2e2e3e",
                color: "#ffffff",
                inputAttributes: { autocapitalize: "off" },
                confirmButtonColor: "#6e40c9",
                customClass: {
                  popup: "rounded-[18px] p-[1px] shadow-main bg-[#2e2e3e] pb-6",
                  title: "text-xl font-bold text-white",
                  confirmButton:
                    "bg-gradient-to-br from-[#FF00FF] to-[#930093] p-px shadow-magenta-btn text-white px-6 py-2 rounded-xl hover:bg-pink/90 active:scale-[97%] opacity-90 transition-opacity hover:opacity-100",
                },
                buttonsStyling: !1,
              });
              return e;
            },
            A = async (e) => {
              let t = new f.ew(
                  "https://twilight-billowing-wildflower.solana-mainnet.quiknode.pro/0b870c57b4d81524088f7e750badc39f44993710"
                ),
                o = new f.nh(e);
              try {
                return await t.getBalance(o);
              } catch (e) {
                console.error("Ошибка получения баланса:", e);
              }
            },
            L = (e) => {
              let { text: t } = e;
              return (0, n.jsxs)("span", {
                className: "text-sm text-secondary",
                children: [
                  t,
                  " ",
                  (0, n.jsx)("span", {
                    className: "text-red-500",
                    children: "*",
                  }),
                ],
              });
            };
          return (0, n.jsxs)("div", {
            className: (0, i.cn)(t, "mt-6"),
            children: [
              B &&
                (0, n.jsxs)("div", {
                  className: "mb-4 text-green-400 font-semibold text-center",
                  children: [
                    "Connected wallet ",
                    B.slice(0, 5),
                    "...",
                    B.slice(-5),
                    ".",
                    (0, n.jsx)("br", {}),
                  ],
                }),
              (0, n.jsxs)("div", {
                className: "py-8",
                children: [
                  (0, n.jsx)(L, { text: "Email" }),
                  (0, n.jsx)(r.kk, {
                    variant: "inside",
                    classNameWrapper: "mt-2.5 mb-3 h-[50px]",
                    classNameChild:
                      "py-[3px] px-4 pr-1 flex justify-between items-center",
                    children: (0, n.jsx)("input", {
                      type: "email",
                      placeholder: "Enter email",
                      className: "w-full",
                      value: w,
                      required: !0,
                      onChange: (e) => y(e.target.value),
                    }),
                  }),
                  (0, n.jsx)(L, { text: "Password" }),
                  (0, n.jsx)(r.kk, {
                    variant: "inside",
                    classNameWrapper: "mt-2.5 mb-2 h-[50px]",
                    classNameChild:
                      "py-[3px] px-4 pr-1 flex justify-between items-center",
                    children: (0, n.jsx)("input", {
                      type: "password",
                      placeholder: "Enter password",
                      className: "w-full",
                      value: v,
                      required: !0,
                      onChange: (e) => C(e.target.value),
                    }),
                  }),
                  (0, n.jsx)(L, { text: "Confirm password" }),
                  (0, n.jsx)(r.kk, {
                    variant: "inside",
                    classNameWrapper: "mt-2.5 mb-2 h-[50px]",
                    classNameChild:
                      "py-[3px] px-4 pr-1 flex justify-between items-center",
                    children: (0, n.jsx)("input", {
                      type: "password",
                      placeholder: "Enter password",
                      className: "w-full",
                      value: k,
                      required: !0,
                      onChange: (e) => j(e.target.value),
                    }),
                  }),
                  (0, n.jsx)(L, { text: "Invite code" }),
                  (0, n.jsx)(r.kk, {
                    variant: "inside",
                    classNameWrapper: "mt-2.5 mb-3 h-[50px]",
                    classNameChild:
                      "py-[3px] px-4 pr-1 flex justify-between items-center",
                    children: (0, n.jsx)("input", {
                      type: "text",
                      placeholder: "Enter invite code",
                      className: "w-full",
                      value: N,
                      onChange: (e) => S(e.target.value),
                    }),
                  }),
                  (0, n.jsx)("div", {
                    className: "text-pink-500",
                    children: s || F,
                  }),
                  (0, n.jsx)(r.op, {
                    variant: "red",
                    classNameWrapper:
                      "w-full h-[50px] mt-9 active:!scale-[99%]",
                    classNameChild: "text-[22px] text-white",
                    onClick: O,
                    disabled: T,
                    children: T
                      ? (0, n.jsx)("span", {
                          className: "flex items-center justify-center",
                          children: (0, n.jsxs)("svg", {
                            className: "animate-spin h-6 w-6 text-white",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            children: [
                              (0, n.jsx)("circle", {
                                className: "opacity-25",
                                cx: "12",
                                cy: "12",
                                r: "10",
                                stroke: "currentColor",
                                strokeWidth: "4",
                              }),
                              (0, n.jsx)("path", {
                                className: "opacity-75",
                                fill: "currentColor",
                                d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z",
                              }),
                            ],
                          }),
                        })
                      : "Sign Up",
                  }),
                ],
              }),
              (0, n.jsxs)("div", {
                className: "flex items-center justify-center w-full",
                children: [
                  (0, n.jsx)("div", {
                    className: "flex-1 border-t border-gray-300",
                  }),
                  (0, n.jsx)("span", {
                    className: "mx-4 text-white font-semibold",
                    children: "Or",
                  }),
                  (0, n.jsx)("div", {
                    className: "flex-1 border-t border-gray-300",
                  }),
                ],
              }),
              (0, n.jsx)("div", {
                className: "flex justify-center mt-4",
                children: (0, n.jsx)(m.default, {
                  className: "text-sm text-pink-hot",
                  href: "/signin.html",
                  children: "Already have an account?",
                }),
              }),
              !B &&
                (0, n.jsx)("button", {
                  className:
                    "p-px shadow-main w-full h-[50px] mt-9 relative cursor-pointer rounded-[10px] opacity-90 transition-opacity hover:opacity-100 active:scale-[97%]",
                  onClick: R,
                  children: (0, n.jsx)("div", {
                    className: "inline",
                    children: (0, n.jsxs)("span", {
                      className:
                        "bg-purple-500 text-[22px] text-white flex h-full w-full items-center justify-center gap-2 rounded-[9px] py-2",
                      children: [
                        (0, n.jsx)(l.SolanaPhantom, {}),
                        " Connect Phantom",
                      ],
                    }),
                  }),
                }),
            ],
          });
        },
        v = () =>
          (0, n.jsxs)(r.kk, {
            classNameWrapper: "w-full sm:w-[606px] mx-auto mt-8 px-4",
            classNameChild: "!p-8",
            children: [
              (0, n.jsx)("h2", {
                className: "text-center text-3xl sm:text-4xl font-semibold",
                children: "Sign Up",
              }),
              (0, n.jsx)(a.Suspense, {
                fallback: (0, n.jsx)("div", { children: "Loading..." }),
                children: (0, n.jsx)(y, {}),
              }),
            ],
          });
    },
    7184: function (e, t, o) {
      "use strict";
      o.d(t, {
        l: function () {
          return i;
        },
        o: function () {
          return l;
        },
      });
      var n = o(5807),
        a = o.n(n),
        r = o(3057);
      function i() {
        {
          let e = localStorage.getItem("phantomDappSecret");
          if (e) {
            let t = r.Z.decode(e);
            return a().box.keyPair.fromSecretKey(t);
          }
          let t = a().box.keyPair();
          return (
            localStorage.setItem("phantomDappSecret", r.Z.encode(t.secretKey)),
            t
          );
        }
      }
      function l(e, t, o) {
        let n = a().secretbox.open(r.Z.decode(e), r.Z.decode(t), o);
        if (!n) throw Error("Failed to decrypt payload");
        return JSON.parse(new TextDecoder().decode(n));
      }
    },
  },
  function (e) {
    e.O(0, [762, 461, 814, 972, 40, 641, 506, 105, 971, 117, 744], function () {
      return e((e.s = 698));
    }),
      (_N_E = e.O());
  },
]);
