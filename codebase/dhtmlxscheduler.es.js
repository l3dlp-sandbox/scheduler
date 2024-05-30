const I = typeof window < "u" ? window : global;
function de(e) {
  function h(o) {
    var t = document.createElement("div");
    return (o || "").split(" ").forEach(function(n) {
      t.classList.add(n);
    }), t;
  }
  var a = { rows_container: function() {
    return h("dhx_cal_navbar_rows_container");
  }, row: function() {
    return h("dhx_cal_navbar_row");
  }, view: function(o) {
    var t = h("dhx_cal_tab");
    return t.setAttribute("name", o.view + "_tab"), t.setAttribute("data-tab", o.view), e.config.fix_tab_position && (o.$firstTab ? t.classList.add("dhx_cal_tab_first") : o.$lastTab ? t.classList.add("dhx_cal_tab_last") : o.view !== "week" && t.classList.add("dhx_cal_tab_standalone"), o.$segmentedTab && t.classList.add("dhx_cal_tab_segmented")), t;
  }, date: function() {
    return h("dhx_cal_date");
  }, button: function(o) {
    return h("dhx_cal_nav_button dhx_cal_nav_button_custom dhx_cal_tab");
  }, builtInButton: function(o) {
    return h("dhx_cal_" + o.view + "_button dhx_cal_nav_button");
  }, spacer: function() {
    return h("dhx_cal_line_spacer");
  }, minicalendarButton: function(o) {
    var t = h("dhx_minical_icon");
    return o.click || t.$_eventAttached || e.event(t, "click", function() {
      e.isCalendarVisible() ? e.destroyCalendar() : e.renderCalendar({ position: this, date: e.getState().date, navigation: !0, handler: function(n, s) {
        e.setCurrentView(n), e.destroyCalendar();
      } });
    }), t;
  }, html_element: function(o) {
    return h("dhx_cal_nav_content");
  } };
  function r(o) {
    var t = function(c) {
      var u;
      if (c.view)
        switch (c.view) {
          case "today":
          case "next":
          case "prev":
            u = a.builtInButton;
            break;
          case "date":
            u = a.date;
            break;
          case "spacer":
            u = a.spacer;
            break;
          case "button":
            u = a.button;
            break;
          case "minicalendar":
            u = a.minicalendarButton;
            break;
          default:
            u = a.view;
        }
      else
        c.rows ? u = a.rows_container : c.cols && (u = a.row);
      return u;
    }(o);
    if (t) {
      var n = t(o);
      if (o.css && n.classList.add(o.css), o.width && ((s = o.width) === 1 * s && (s += "px"), n.style.width = s), o.height && ((s = o.height) === 1 * s && (s += "px"), n.style.height = s), o.click && e.event(n, "click", o.click), o.html && (n.innerHTML = o.html), o.align) {
        var s = "";
        o.align == "right" ? s = "flex-end" : o.align == "left" && (s = "flex-start"), n.style.justifyContent = s;
      }
      return n;
    }
  }
  function d(o) {
    return typeof o == "string" && (o = { view: o }), o.view || o.rows || o.cols || (o.view = "button"), o;
  }
  function i(o) {
    var t, n = document.createDocumentFragment();
    t = Array.isArray(o) ? o : [o];
    for (var s = 0; s < t.length; s++) {
      var c, u = d(t[s]);
      u.view === "day" && t[s + 1] && ((c = d(t[s + 1])).view !== "week" && c.view !== "month" || (u.$firstTab = !0, u.$segmentedTab = !0)), u.view === "week" && t[s - 1] && ((c = d(t[s + 1])).view !== "week" && c.view !== "month" || (u.$segmentedTab = !0)), u.view === "month" && t[s - 1] && ((c = d(t[s - 1])).view !== "week" && c.view !== "day" || (u.$lastTab = !0, u.$segmentedTab = !0));
      var v = r(u);
      n.appendChild(v), (u.cols || u.rows) && v.appendChild(i(u.cols || u.rows));
    }
    return n;
  }
  e._init_nav_bar = function(o) {
    var t = this.$container.querySelector(".dhx_cal_navline");
    return t || ((t = document.createElement("div")).className = "dhx_cal_navline dhx_cal_navline_flex", e._update_nav_bar(o, t), t);
  };
  var _ = null;
  e._update_nav_bar = function(o, t) {
    if (o) {
      var n = !1, s = o.height || e.xy.nav_height;
      _ !== null && _ === s || (n = !0), n && (e.xy.nav_height = s), t.innerHTML = "", t.appendChild(i(o)), e.unset_actions(), e._els = [], e.get_elements(), e.set_actions(), t.style.display = s === 0 ? "none" : "", _ = s;
    }
  };
}
function _e(e) {
  function h(i) {
    for (var _ = document.body; i && i != _; )
      i = i.parentNode;
    return _ == i;
  }
  function a(i) {
    return { w: i.innerWidth || document.documentElement.clientWidth, h: i.innerHeight || document.documentElement.clientHeight };
  }
  function r(i, _) {
    var o, t = a(_);
    i.event(_, "resize", function() {
      clearTimeout(o), o = setTimeout(function() {
        if (h(i.$container) && !i.$destroyed) {
          var n, s, c = a(_);
          s = c, ((n = t).w != s.w || n.h != s.h) && (t = c, d(i));
        }
      }, 150);
    });
  }
  function d(i) {
    !i.$destroyed && i.$root && h(i.$root) && i.callEvent("onSchedulerResize", []) && (i.updateView(), i.callEvent("onAfterSchedulerResize", []));
  }
  (function(i) {
    var _ = i.$container;
    window.getComputedStyle(_).getPropertyValue("position") == "static" && (_.style.position = "relative");
    var o = document.createElement("iframe");
    o.className = "scheduler_container_resize_watcher", o.tabIndex = -1, i.config.wai_aria_attributes && (o.setAttribute("role", "none"), o.setAttribute("aria-hidden", !0)), window.Sfdc || window.$A || window.Aura ? function(t) {
      var n = t.$root.offsetHeight, s = t.$root.offsetWidth;
      (function c() {
        t.$destroyed || (t.$root && (t.$root.offsetHeight == n && t.$root.offsetWidth == s || d(t), n = t.$root.offsetHeight, s = t.$root.offsetWidth), setTimeout(c, 200));
      })();
    }(i) : (_.appendChild(o), o.contentWindow ? r(i, o.contentWindow) : (_.removeChild(o), r(i, window)));
  })(e);
}
class le {
  constructor() {
    this._silent_mode = !1, this.listeners = {};
  }
  _silentStart() {
    this._silent_mode = !0;
  }
  _silentEnd() {
    this._silent_mode = !1;
  }
}
const ce = function(e) {
  let h = {}, a = 0;
  const r = function() {
    let d = !0;
    for (const i in h) {
      const _ = h[i].apply(e, arguments);
      d = d && _;
    }
    return d;
  };
  return r.addEvent = function(d, i) {
    if (typeof d == "function") {
      let _;
      if (i && i.id ? _ = i.id : (_ = a, a++), i && i.once) {
        const o = d;
        d = function() {
          o(), r.removeEvent(_);
        };
      }
      return h[_] = d, _;
    }
    return !1;
  }, r.removeEvent = function(d) {
    delete h[d];
  }, r.clear = function() {
    h = {};
  }, r;
};
function Q(e) {
  const h = new le();
  e.attachEvent = function(a, r, d) {
    a = "ev_" + a.toLowerCase(), h.listeners[a] || (h.listeners[a] = ce(this)), d && d.thisObject && (r = r.bind(d.thisObject));
    let i = a + ":" + h.listeners[a].addEvent(r, d);
    return d && d.id && (i = d.id), i;
  }, e.attachAll = function(a) {
    this.attachEvent("listen_all", a);
  }, e.callEvent = function(a, r) {
    if (h._silent_mode)
      return !0;
    const d = "ev_" + a.toLowerCase(), i = h.listeners;
    return i.ev_listen_all && i.ev_listen_all.apply(this, [a].concat(r)), !i[d] || i[d].apply(this, r);
  }, e.checkEvent = function(a) {
    return !!h.listeners["ev_" + a.toLowerCase()];
  }, e.detachEvent = function(a) {
    if (a) {
      let r = h.listeners;
      for (const i in r)
        r[i].removeEvent(a);
      const d = a.split(":");
      if (r = h.listeners, d.length === 2) {
        const i = d[0], _ = d[1];
        r[i] && r[i].removeEvent(_);
      }
    }
  }, e.detachAllEvents = function() {
    for (const a in h.listeners)
      h.listeners[a].clear();
  };
}
const ee = { event: function(e, h, a) {
  e.addEventListener ? e.addEventListener(h, a, !1) : e.attachEvent && e.attachEvent("on" + h, a);
}, eventRemove: function(e, h, a) {
  e.removeEventListener ? e.removeEventListener(h, a, !1) : e.detachEvent && e.detachEvent("on" + h, a);
} };
function he(e) {
  var h = function() {
    var a = function(r, d) {
      r = r || ee.event, d = d || ee.eventRemove;
      var i = [], _ = { attach: function(o, t, n, s) {
        i.push({ element: o, event: t, callback: n, capture: s }), r(o, t, n, s);
      }, detach: function(o, t, n, s) {
        d(o, t, n, s);
        for (var c = 0; c < i.length; c++) {
          var u = i[c];
          u.element === o && u.event === t && u.callback === n && u.capture === s && (i.splice(c, 1), c--);
        }
      }, detachAll: function() {
        for (var o = i.slice(), t = 0; t < o.length; t++) {
          var n = o[t];
          _.detach(n.element, n.event, n.callback, n.capture), _.detach(n.element, n.event, n.callback, void 0), _.detach(n.element, n.event, n.callback, !1), _.detach(n.element, n.event, n.callback, !0);
        }
        i.splice(0, i.length);
      }, extend: function() {
        return a(this.event, this.eventRemove);
      } };
      return _;
    };
    return a();
  }();
  e.event = h.attach, e.eventRemove = h.detach, e._eventRemoveAll = h.detachAll, e._createDomEventScope = h.extend, e._trim = function(a) {
    return (String.prototype.trim || function() {
      return this.replace(/^\s+|\s+$/g, "");
    }).apply(a);
  }, e._isDate = function(a) {
    return !(!a || typeof a != "object") && !!(a.getFullYear && a.getMonth && a.getDate);
  }, e._isObject = function(a) {
    return a && typeof a == "object";
  };
}
var ue = Date.now();
function Y(e) {
  return !(!e || typeof e != "object") && !!(e.getFullYear && e.getMonth && e.getDate);
}
const V = { uid: function() {
  return ue++;
}, mixin: function(e, h, a) {
  for (var r in h)
    (e[r] === void 0 || a) && (e[r] = h[r]);
  return e;
}, copy: function e(h) {
  var a, r, d;
  if (h && typeof h == "object")
    switch (!0) {
      case Y(h):
        r = new Date(h);
        break;
      case (d = h, Array.isArray ? Array.isArray(d) : d && d.length !== void 0 && d.pop && d.push):
        for (r = new Array(h.length), a = 0; a < h.length; a++)
          r[a] = e(h[a]);
        break;
      case function(i) {
        return i && typeof i == "object" && Function.prototype.toString.call(i.constructor) === "function String() { [native code] }";
      }(h):
        r = new String(h);
        break;
      case function(i) {
        return i && typeof i == "object" && Function.prototype.toString.call(i.constructor) === "function Number() { [native code] }";
      }(h):
        r = new Number(h);
        break;
      case function(i) {
        return i && typeof i == "object" && Function.prototype.toString.call(i.constructor) === "function Boolean() { [native code] }";
      }(h):
        r = new Boolean(h);
        break;
      default:
        for (a in r = {}, h) {
          const i = typeof h[a];
          i === "string" || i === "number" || i === "boolean" ? r[a] = h[a] : Y(h[a]) ? r[a] = new Date(h[a]) : Object.prototype.hasOwnProperty.apply(h, [a]) && (r[a] = e(h[a]));
        }
    }
  return r || h;
}, defined: function(e) {
  return e !== void 0;
}, isDate: Y, delay: function(e, h) {
  var a, r = function() {
    r.$cancelTimeout(), r.$pending = !0;
    var d = Array.prototype.slice.call(arguments);
    a = setTimeout(function() {
      e.apply(this, d), r.$pending = !1;
    }, h);
  };
  return r.$pending = !1, r.$cancelTimeout = function() {
    clearTimeout(a), r.$pending = !1;
  }, r.$execute = function() {
    var d = Array.prototype.slice.call(arguments);
    e.apply(this, d), r.$cancelTimeout();
  }, r;
} };
function ne(e) {
  if (!e)
    return "";
  var h = e.className || "";
  return h.baseVal && (h = h.baseVal), h.indexOf || (h = ""), h || "";
}
function ie(e, h, a) {
  a === void 0 && (a = !0);
  for (var r = e.target || e.srcElement, d = ""; r; ) {
    if (d = ne(r)) {
      var i = d.indexOf(h);
      if (i >= 0) {
        if (!a)
          return r;
        var _ = i === 0 || !(d.charAt(i - 1) || "").trim(), o = i + h.length >= d.length || !d.charAt(i + h.length).trim();
        if (_ && o)
          return r;
      }
    }
    r = r.parentNode;
  }
  return null;
}
function fe(e) {
  var h = !1, a = !1;
  if (window.getComputedStyle) {
    var r = window.getComputedStyle(e, null);
    h = r.display, a = r.visibility;
  } else
    e.currentStyle && (h = e.currentStyle.display, a = e.currentStyle.visibility);
  var d = !1, i = ie({ target: e }, "dhx_form_repeat", !1);
  return i && (d = i.style.height == "0px"), d = d || !e.offsetHeight, h != "none" && a != "hidden" && !d;
}
function ve(e) {
  return !isNaN(e.getAttribute("tabindex")) && 1 * e.getAttribute("tabindex") >= 0;
}
function ge(e) {
  return !{ a: !0, area: !0 }[e.nodeName.loLowerCase()] || !!e.getAttribute("href");
}
function me(e) {
  return !{ input: !0, select: !0, textarea: !0, button: !0, object: !0 }[e.nodeName.toLowerCase()] || !e.hasAttribute("disabled");
}
function re() {
  return document.head.createShadowRoot || document.head.attachShadow;
}
function te(e) {
  if (!e || !re())
    return document.body;
  for (; e.parentNode && (e = e.parentNode); )
    if (e instanceof ShadowRoot)
      return e.host;
  return document.body;
}
const q = { getAbsoluteLeft: function(e) {
  return this.getOffset(e).left;
}, getAbsoluteTop: function(e) {
  return this.getOffset(e).top;
}, getOffsetSum: function(e) {
  for (var h = 0, a = 0; e; )
    h += parseInt(e.offsetTop), a += parseInt(e.offsetLeft), e = e.offsetParent;
  return { top: h, left: a };
}, getOffsetRect: function(e) {
  var h = e.getBoundingClientRect(), a = 0, r = 0;
  if (/Mobi/.test(navigator.userAgent)) {
    var d = document.createElement("div");
    d.style.position = "absolute", d.style.left = "0px", d.style.top = "0px", d.style.width = "1px", d.style.height = "1px", document.body.appendChild(d);
    var i = d.getBoundingClientRect();
    a = h.top - i.top, r = h.left - i.left, d.parentNode.removeChild(d);
  } else {
    var _ = document.body, o = document.documentElement, t = window.pageYOffset || o.scrollTop || _.scrollTop, n = window.pageXOffset || o.scrollLeft || _.scrollLeft, s = o.clientTop || _.clientTop || 0, c = o.clientLeft || _.clientLeft || 0;
    a = h.top + t - s, r = h.left + n - c;
  }
  return { top: Math.round(a), left: Math.round(r) };
}, getOffset: function(e) {
  return e.getBoundingClientRect ? this.getOffsetRect(e) : this.getOffsetSum(e);
}, closest: function(e, h) {
  return e && h ? K(e, h) : null;
}, insertAfter: function(e, h) {
  h.nextSibling ? h.parentNode.insertBefore(e, h.nextSibling) : h.parentNode.appendChild(e);
}, remove: function(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}, isChildOf: function(e, h) {
  return h.contains(e);
}, getFocusableNodes: function(e) {
  for (var h = e.querySelectorAll(["a[href]", "area[href]", "input", "select", "textarea", "button", "iframe", "object", "embed", "[tabindex]", "[contenteditable]"].join(", ")), a = Array.prototype.slice.call(h, 0), r = 0; r < a.length; r++)
    a[r].$position = r;
  for (a.sort(function(i, _) {
    return i.tabIndex === 0 && _.tabIndex !== 0 ? 1 : i.tabIndex !== 0 && _.tabIndex === 0 ? -1 : i.tabIndex === _.tabIndex ? i.$position - _.$position : i.tabIndex < _.tabIndex ? -1 : 1;
  }), r = 0; r < a.length; r++) {
    var d = a[r];
    (ve(d) || me(d) || ge(d)) && fe(d) || (a.splice(r, 1), r--);
  }
  return a;
}, getClassName: ne, locateCss: ie, getRootNode: te, hasShadowParent: function(e) {
  return !!te(e);
}, isShadowDomSupported: re, getActiveElement: function() {
  var e = document.activeElement;
  return e.shadowRoot && (e = e.shadowRoot.activeElement), e === document.body && document.getSelection && (e = document.getSelection().focusNode || document.body), e;
}, getRelativeEventPosition: function(e, h) {
  var a = document.documentElement, r = function(d) {
    var i = 0, _ = 0, o = 0, t = 0;
    if (d.getBoundingClientRect) {
      var n = d.getBoundingClientRect(), s = document.body, c = document.documentElement || document.body.parentNode || document.body, u = window.pageYOffset || c.scrollTop || s.scrollTop, v = window.pageXOffset || c.scrollLeft || s.scrollLeft, m = c.clientTop || s.clientTop || 0, l = c.clientLeft || s.clientLeft || 0;
      i = n.top + u - m, _ = n.left + v - l, o = document.body.offsetWidth - n.right, t = document.body.offsetHeight - n.bottom;
    } else {
      for (; d; )
        i += parseInt(d.offsetTop, 10), _ += parseInt(d.offsetLeft, 10), d = d.offsetParent;
      o = document.body.offsetWidth - d.offsetWidth - _, t = document.body.offsetHeight - d.offsetHeight - i;
    }
    return { y: Math.round(i), x: Math.round(_), width: d.offsetWidth, height: d.offsetHeight, right: Math.round(o), bottom: Math.round(t) };
  }(h);
  return { x: e.clientX + a.scrollLeft - a.clientLeft - r.x + h.scrollLeft, y: e.clientY + a.scrollTop - a.clientTop - r.y + h.scrollTop };
}, getTargetNode: function(e) {
  var h;
  return e.tagName ? h = e : (h = (e = e || window.event).target || e.srcElement).shadowRoot && e.composedPath && (h = e.composedPath()[0]), h;
}, getNodePosition: function(e) {
  var h = 0, a = 0, r = 0, d = 0;
  if (e.getBoundingClientRect) {
    var i = e.getBoundingClientRect(), _ = document.body, o = document.documentElement || document.body.parentNode || document.body, t = window.pageYOffset || o.scrollTop || _.scrollTop, n = window.pageXOffset || o.scrollLeft || _.scrollLeft, s = o.clientTop || _.clientTop || 0, c = o.clientLeft || _.clientLeft || 0;
    h = i.top + t - s, a = i.left + n - c, r = document.body.offsetWidth - i.right, d = document.body.offsetHeight - i.bottom;
  } else {
    for (; e; )
      h += parseInt(e.offsetTop, 10), a += parseInt(e.offsetLeft, 10), e = e.offsetParent;
    r = document.body.offsetWidth - e.offsetWidth - a, d = document.body.offsetHeight - e.offsetHeight - h;
  }
  return { y: Math.round(h), x: Math.round(a), width: e.offsetWidth, height: e.offsetHeight, right: Math.round(r), bottom: Math.round(d) };
} };
var K;
if (Element.prototype.closest)
  K = function(e, h) {
    return e.closest(h);
  };
else {
  var pe = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  K = function(e, h) {
    var a = e;
    do {
      if (pe.call(a, h))
        return a;
      a = a.parentElement || a.parentNode;
    } while (a !== null && a.nodeType === 1);
    return null;
  };
}
var B = typeof window < "u";
const ye = { isIE: B && (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0), isOpera: B && navigator.userAgent.indexOf("Opera") >= 0, isChrome: B && navigator.userAgent.indexOf("Chrome") >= 0, isKHTML: B && (navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0), isFF: B && navigator.userAgent.indexOf("Firefox") >= 0, isIPad: B && navigator.userAgent.search(/iPad/gi) >= 0, isEdge: B && navigator.userAgent.indexOf("Edge") != -1, isNode: !B || typeof navigator > "u" };
function W(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
  var h = "";
  for (var a in e) {
    var r = "";
    e.hasOwnProperty(a) && (r = a + "=" + (r = typeof e[a] == "string" ? encodeURIComponent(e[a]) : typeof e[a] == "number" ? e[a] : encodeURIComponent(JSON.stringify(e[a]))), h.length && (r = "&" + r), h += r);
  }
  return h;
}
function be(e) {
  var h = function(i, _) {
    for (var o = "var temp=date.match(/[a-zA-Z]+|[0-9]+/g);", t = i.match(/%[a-zA-Z]/g), n = 0; n < t.length; n++)
      switch (t[n]) {
        case "%j":
        case "%d":
          o += "set[2]=temp[" + n + "]||1;";
          break;
        case "%n":
        case "%m":
          o += "set[1]=(temp[" + n + "]||1)-1;";
          break;
        case "%y":
          o += "set[0]=temp[" + n + "]*1+(temp[" + n + "]>50?1900:2000);";
          break;
        case "%g":
        case "%G":
        case "%h":
        case "%H":
          o += "set[3]=temp[" + n + "]||0;";
          break;
        case "%i":
          o += "set[4]=temp[" + n + "]||0;";
          break;
        case "%Y":
          o += "set[0]=temp[" + n + "]||0;";
          break;
        case "%a":
        case "%A":
          o += "set[3]=set[3]%12+((temp[" + n + "]||'').toLowerCase()=='am'?0:12);";
          break;
        case "%s":
          o += "set[5]=temp[" + n + "]||0;";
          break;
        case "%M":
          o += "set[1]=this.locale.date.month_short_hash[temp[" + n + "]]||0;";
          break;
        case "%F":
          o += "set[1]=this.locale.date.month_full_hash[temp[" + n + "]]||0;";
      }
    var s = "set[0],set[1],set[2],set[3],set[4],set[5]";
    return _ && (s = " Date.UTC(" + s + ")"), new Function("date", "var set=[0,0,1,0,0,0]; " + o + " return new Date(" + s + ");");
  }, a = function(i, _) {
    const o = i.match(/%[a-zA-Z]/g);
    return function(t) {
      for (var n = [0, 0, 1, 0, 0, 0], s = t.match(/[a-zA-Z]+|[0-9]+/g), c = 0; c < o.length; c++)
        switch (o[c]) {
          case "%j":
          case "%d":
            n[2] = s[c] || 1;
            break;
          case "%n":
          case "%m":
            n[1] = (s[c] || 1) - 1;
            break;
          case "%y":
            n[0] = 1 * s[c] + (s[c] > 50 ? 1900 : 2e3);
            break;
          case "%g":
          case "%G":
          case "%h":
          case "%H":
            n[3] = s[c] || 0;
            break;
          case "%i":
            n[4] = s[c] || 0;
            break;
          case "%Y":
            n[0] = s[c] || 0;
            break;
          case "%a":
          case "%A":
            n[3] = n[3] % 12 + ((s[c] || "").toLowerCase() == "am" ? 0 : 12);
            break;
          case "%s":
            n[5] = s[c] || 0;
            break;
          case "%M":
            n[1] = e.locale.date.month_short_hash[s[c]] || 0;
            break;
          case "%F":
            n[1] = e.locale.date.month_full_hash[s[c]] || 0;
        }
      return _ ? new Date(Date.UTC(n[0], n[1], n[2], n[3], n[4], n[5])) : new Date(n[0], n[1], n[2], n[3], n[4], n[5]);
    };
  };
  let r;
  function d() {
    var i = !1;
    return e.config.csp === "auto" ? (r === void 0 && (r = function() {
      try {
        new Function("cspEnabled = false;"), r = !1;
      } catch {
        r = !0;
      }
      return r;
    }()), i = r) : i = e.config.csp, i;
  }
  e.date = { init: function() {
    for (var i = e.locale.date.month_short, _ = e.locale.date.month_short_hash = {}, o = 0; o < i.length; o++)
      _[i[o]] = o;
    for (i = e.locale.date.month_full, _ = e.locale.date.month_full_hash = {}, o = 0; o < i.length; o++)
      _[i[o]] = o;
  }, date_part: function(i) {
    var _ = new Date(i);
    return i.setHours(0), i.setMinutes(0), i.setSeconds(0), i.setMilliseconds(0), i.getHours() && (i.getDate() < _.getDate() || i.getMonth() < _.getMonth() || i.getFullYear() < _.getFullYear()) && i.setTime(i.getTime() + 36e5 * (24 - i.getHours())), i;
  }, time_part: function(i) {
    return (i.valueOf() / 1e3 - 60 * i.getTimezoneOffset()) % 86400;
  }, week_start: function(i) {
    var _ = i.getDay();
    return e.config.start_on_monday && (_ === 0 ? _ = 6 : _--), this.date_part(this.add(i, -1 * _, "day"));
  }, month_start: function(i) {
    return i.setDate(1), this.date_part(i);
  }, year_start: function(i) {
    return i.setMonth(0), this.month_start(i);
  }, day_start: function(i) {
    return this.date_part(i);
  }, _add_days: function(i, _) {
    var o = new Date(i.valueOf());
    if (o.setDate(o.getDate() + _), _ == Math.round(_) && _ > 0) {
      var t = (+o - +i) % 864e5;
      if (t && i.getTimezoneOffset() == o.getTimezoneOffset()) {
        var n = t / 36e5;
        o.setTime(o.getTime() + 60 * (24 - n) * 60 * 1e3);
      }
    }
    return _ >= 0 && !i.getHours() && o.getHours() && (o.getDate() < i.getDate() || o.getMonth() < i.getMonth() || o.getFullYear() < i.getFullYear()) && o.setTime(o.getTime() + 36e5 * (24 - o.getHours())), o;
  }, add: function(i, _, o) {
    var t = new Date(i.valueOf());
    switch (o) {
      case "day":
        t = e.date._add_days(t, _);
        break;
      case "week":
        t = e.date._add_days(t, 7 * _);
        break;
      case "month":
        t.setMonth(t.getMonth() + _);
        break;
      case "year":
        t.setYear(t.getFullYear() + _);
        break;
      case "hour":
        t.setTime(t.getTime() + 60 * _ * 60 * 1e3);
        break;
      case "minute":
        t.setTime(t.getTime() + 60 * _ * 1e3);
        break;
      default:
        return e.date["add_" + o](i, _, o);
    }
    return t;
  }, to_fixed: function(i) {
    return i < 10 ? "0" + i : i;
  }, copy: function(i) {
    return new Date(i.valueOf());
  }, date_to_str: function(i, _) {
    return d() ? function(o, t) {
      return function(n) {
        return o.replace(/%[a-zA-Z]/g, function(s) {
          switch (s) {
            case "%d":
              return t ? e.date.to_fixed(n.getUTCDate()) : e.date.to_fixed(n.getDate());
            case "%m":
              return t ? e.date.to_fixed(n.getUTCMonth() + 1) : e.date.to_fixed(n.getMonth() + 1);
            case "%j":
              return t ? n.getUTCDate() : n.getDate();
            case "%n":
              return t ? n.getUTCMonth() + 1 : n.getMonth() + 1;
            case "%y":
              return t ? e.date.to_fixed(n.getUTCFullYear() % 100) : e.date.to_fixed(n.getFullYear() % 100);
            case "%Y":
              return t ? n.getUTCFullYear() : n.getFullYear();
            case "%D":
              return t ? e.locale.date.day_short[n.getUTCDay()] : e.locale.date.day_short[n.getDay()];
            case "%l":
              return t ? e.locale.date.day_full[n.getUTCDay()] : e.locale.date.day_full[n.getDay()];
            case "%M":
              return t ? e.locale.date.month_short[n.getUTCMonth()] : e.locale.date.month_short[n.getMonth()];
            case "%F":
              return t ? e.locale.date.month_full[n.getUTCMonth()] : e.locale.date.month_full[n.getMonth()];
            case "%h":
              return t ? e.date.to_fixed((n.getUTCHours() + 11) % 12 + 1) : e.date.to_fixed((n.getHours() + 11) % 12 + 1);
            case "%g":
              return t ? (n.getUTCHours() + 11) % 12 + 1 : (n.getHours() + 11) % 12 + 1;
            case "%G":
              return t ? n.getUTCHours() : n.getHours();
            case "%H":
              return t ? e.date.to_fixed(n.getUTCHours()) : e.date.to_fixed(n.getHours());
            case "%i":
              return t ? e.date.to_fixed(n.getUTCMinutes()) : e.date.to_fixed(n.getMinutes());
            case "%a":
              return t ? n.getUTCHours() > 11 ? "pm" : "am" : n.getHours() > 11 ? "pm" : "am";
            case "%A":
              return t ? n.getUTCHours() > 11 ? "PM" : "AM" : n.getHours() > 11 ? "PM" : "AM";
            case "%s":
              return t ? e.date.to_fixed(n.getUTCSeconds()) : e.date.to_fixed(n.getSeconds());
            case "%W":
              return t ? e.date.to_fixed(e.date.getUTCISOWeek(n)) : e.date.to_fixed(e.date.getISOWeek(n));
            default:
              return s;
          }
        });
      };
    }(i, _) : (i = i.replace(/%[a-zA-Z]/g, function(o) {
      switch (o) {
        case "%d":
          return '"+this.date.to_fixed(date.getDate())+"';
        case "%m":
          return '"+this.date.to_fixed((date.getMonth()+1))+"';
        case "%j":
          return '"+date.getDate()+"';
        case "%n":
          return '"+(date.getMonth()+1)+"';
        case "%y":
          return '"+this.date.to_fixed(date.getFullYear()%100)+"';
        case "%Y":
          return '"+date.getFullYear()+"';
        case "%D":
          return '"+this.locale.date.day_short[date.getDay()]+"';
        case "%l":
          return '"+this.locale.date.day_full[date.getDay()]+"';
        case "%M":
          return '"+this.locale.date.month_short[date.getMonth()]+"';
        case "%F":
          return '"+this.locale.date.month_full[date.getMonth()]+"';
        case "%h":
          return '"+this.date.to_fixed((date.getHours()+11)%12+1)+"';
        case "%g":
          return '"+((date.getHours()+11)%12+1)+"';
        case "%G":
          return '"+date.getHours()+"';
        case "%H":
          return '"+this.date.to_fixed(date.getHours())+"';
        case "%i":
          return '"+this.date.to_fixed(date.getMinutes())+"';
        case "%a":
          return '"+(date.getHours()>11?"pm":"am")+"';
        case "%A":
          return '"+(date.getHours()>11?"PM":"AM")+"';
        case "%s":
          return '"+this.date.to_fixed(date.getSeconds())+"';
        case "%W":
          return '"+this.date.to_fixed(this.date.getISOWeek(date))+"';
        default:
          return o;
      }
    }), _ && (i = i.replace(/date\.get/g, "date.getUTC")), new Function("date", 'return "' + i + '";').bind(e));
  }, str_to_date: function(i, _, o) {
    var t = d() ? a : h, n = t(i, _), s = /^[0-9]{4}(\-|\/)[0-9]{2}(\-|\/)[0-9]{2} ?(([0-9]{1,2}:[0-9]{1,2})(:[0-9]{1,2})?)?$/, c = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4} ?(([0-9]{1,2}:[0-9]{2})(:[0-9]{1,2})?)?$/, u = /^[0-9]{2}\-[0-9]{2}\-[0-9]{4} ?(([0-9]{1,2}:[0-9]{1,2})(:[0-9]{1,2})?)?$/, v = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/, m = t("%Y-%m-%d %H:%i:%s", _), l = t("%m/%d/%Y %H:%i:%s", _), f = t("%d-%m-%Y %H:%i:%s", _);
    return function(g) {
      if (!o && !e.config.parse_exact_format) {
        if (g && g.getISOWeek)
          return new Date(g);
        if (typeof g == "number")
          return new Date(g);
        if (p = g, s.test(String(p)))
          return m(g);
        if (function(y) {
          return c.test(String(y));
        }(g))
          return l(g);
        if (function(y) {
          return u.test(String(y));
        }(g))
          return f(g);
        if (function(y) {
          return v.test(y);
        }(g))
          return new Date(g);
      }
      var p;
      return n.call(e, g);
    };
  }, getISOWeek: function(i) {
    if (!i)
      return !1;
    var _ = (i = this.date_part(new Date(i))).getDay();
    _ === 0 && (_ = 7);
    var o = new Date(i.valueOf());
    o.setDate(i.getDate() + (4 - _));
    var t = o.getFullYear(), n = Math.round((o.getTime() - new Date(t, 0, 1).getTime()) / 864e5);
    return 1 + Math.floor(n / 7);
  }, getUTCISOWeek: function(i) {
    return this.getISOWeek(this.convert_to_utc(i));
  }, convert_to_utc: function(i) {
    return new Date(i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate(), i.getUTCHours(), i.getUTCMinutes(), i.getUTCSeconds());
  } };
}
function oe(e) {
  return (function() {
    var h = {};
    for (var a in this._events) {
      var r = this._events[a];
      r.id.toString().indexOf("#") == -1 && (h[r.id] = r);
    }
    return h;
  }).bind(e);
}
function xe(e) {
  e._loaded = {}, e._load = function(a, r) {
    if (a = a || this._load_url) {
      var d;
      if (a += (a.indexOf("?") == -1 ? "?" : "&") + "timeshift=" + (/* @__PURE__ */ new Date()).getTimezoneOffset(), this.config.prevent_cache && (a += "&uid=" + this.uid()), r = r || this._date, this._load_mode) {
        var i = this.templates.load_format;
        for (r = this.date[this._load_mode + "_start"](new Date(r.valueOf())); r > this._min_date; )
          r = this.date.add(r, -1, this._load_mode);
        d = r;
        for (var _ = !0; d < this._max_date; )
          d = this.date.add(d, 1, this._load_mode), this._loaded[i(r)] && _ ? r = this.date.add(r, 1, this._load_mode) : _ = !1;
        var o = d;
        do
          d = o, o = this.date.add(d, -1, this._load_mode);
        while (o > r && this._loaded[i(o)]);
        if (d <= r)
          return !1;
        for (e.ajax.get(a + "&from=" + i(r) + "&to=" + i(d), t); r < d; )
          this._loaded[i(r)] = !0, r = this.date.add(r, 1, this._load_mode);
      } else
        e.ajax.get(a, t);
      return this.callEvent("onXLS", []), this.callEvent("onLoadStart", []), !0;
    }
    function t(n) {
      e.on_load(n), e.callEvent("onLoadEnd", []);
    }
  }, e._parsers = {}, function(a) {
    a._parsers.xml = { canParse: function(r, d) {
      if (d.responseXML && d.responseXML.firstChild)
        return !0;
      try {
        var i = a.ajax.parse(d.responseText), _ = a.ajax.xmltop("data", i);
        if (_ && _.tagName === "data")
          return !0;
      } catch {
      }
      return !1;
    }, parse: function(r) {
      var d;
      if (r.xmlDoc.responseXML || (r.xmlDoc.responseXML = a.ajax.parse(r.xmlDoc.responseText)), (d = a.ajax.xmltop("data", r.xmlDoc)).tagName != "data")
        return null;
      var i = d.getAttribute("dhx_security");
      i && (window.dhtmlx && (window.dhtmlx.security_key = i), a.security_key = i);
      for (var _ = a.ajax.xpath("//coll_options", r.xmlDoc), o = 0; o < _.length; o++) {
        var t = _[o].getAttribute("for"), n = a.serverList[t];
        n || (a.serverList[t] = n = []), n.splice(0, n.length);
        for (var s = a.ajax.xpath(".//item", _[o]), c = 0; c < s.length; c++) {
          for (var u = s[c].attributes, v = { key: s[c].getAttribute("value"), label: s[c].getAttribute("label") }, m = 0; m < u.length; m++) {
            var l = u[m];
            l.nodeName != "value" && l.nodeName != "label" && (v[l.nodeName] = l.nodeValue);
          }
          n.push(v);
        }
      }
      _.length && a.callEvent("onOptionsLoad", []);
      var f = a.ajax.xpath("//userdata", r.xmlDoc);
      for (o = 0; o < f.length; o++) {
        var g = a._xmlNodeToJSON(f[o]);
        a._userdata[g.name] = g.text;
      }
      var p = [];
      for (d = a.ajax.xpath("//event", r.xmlDoc), o = 0; o < d.length; o++) {
        var y = p[o] = a._xmlNodeToJSON(d[o]);
        a._init_event(y);
      }
      return p;
    } };
  }(e), function(a) {
    a.json = a._parsers.json = { canParse: function(r) {
      if (r && typeof r == "object")
        return !0;
      if (typeof r == "string")
        try {
          var d = JSON.parse(r);
          return Object.prototype.toString.call(d) === "[object Object]" || Object.prototype.toString.call(d) === "[object Array]";
        } catch {
          return !1;
        }
      return !1;
    }, parse: function(r) {
      var d = [];
      typeof r == "string" && (r = JSON.parse(r)), Object.prototype.toString.call(r) === "[object Array]" ? d = r : r && (r.events ? d = r.events : r.data && (d = r.data)), d = d || [], r.dhx_security && (window.dhtmlx && (window.dhtmlx.security_key = r.dhx_security), a.security_key = r.dhx_security);
      var i = r && r.collections ? r.collections : {}, _ = !1;
      for (var o in i)
        if (i.hasOwnProperty(o)) {
          _ = !0;
          var t = i[o], n = a.serverList[o];
          n || (a.serverList[o] = n = []), n.splice(0, n.length);
          for (var s = 0; s < t.length; s++) {
            var c = t[s], u = { key: c.value, label: c.label };
            for (var v in c)
              if (c.hasOwnProperty(v)) {
                if (v == "value" || v == "label")
                  continue;
                u[v] = c[v];
              }
            n.push(u);
          }
        }
      _ && a.callEvent("onOptionsLoad", []);
      for (var m = [], l = 0; l < d.length; l++) {
        var f = d[l];
        a._init_event(f), m.push(f);
      }
      return m;
    } };
  }(e), function(a) {
    a.ical = a._parsers.ical = { canParse: function(r) {
      return typeof r == "string" && new RegExp("^BEGIN:VCALENDAR").test(r);
    }, parse: function(r) {
      var d = r.match(RegExp(this.c_start + "[^\f]*" + this.c_end, ""));
      if (d.length) {
        d[0] = d[0].replace(/[\r\n]+ /g, ""), d[0] = d[0].replace(/[\r\n]+(?=[a-z \t])/g, " "), d[0] = d[0].replace(/;[^:\r\n]*:/g, ":");
        for (var i, _ = [], o = RegExp("(?:" + this.e_start + ")([^\f]*?)(?:" + this.e_end + ")", "g"); (i = o.exec(d)) !== null; ) {
          for (var t, n = {}, s = /[^\r\n]+[\r\n]+/g; (t = s.exec(i[1])) !== null; )
            this.parse_param(t.toString(), n);
          n.uid && !n.id && (n.id = n.uid), _.push(n);
        }
        return _;
      }
    }, parse_param: function(r, d) {
      var i = r.indexOf(":");
      if (i != -1) {
        var _ = r.substr(0, i).toLowerCase(), o = r.substr(i + 1).replace(/\\,/g, ",").replace(/[\r\n]+$/, "");
        _ == "summary" ? _ = "text" : _ == "dtstart" ? (_ = "start_date", o = this.parse_date(o, 0, 0)) : _ == "dtend" && (_ = "end_date", o = this.parse_date(o, 0, 0)), d[_] = o;
      }
    }, parse_date: function(r, d, i) {
      var _ = r.split("T"), o = !1;
      _[1] && (d = _[1].substr(0, 2), i = _[1].substr(2, 2), o = _[1][6] == "Z");
      var t = _[0].substr(0, 4), n = parseInt(_[0].substr(4, 2), 10) - 1, s = _[0].substr(6, 2);
      return a.config.server_utc || o ? new Date(Date.UTC(t, n, s, d, i)) : new Date(t, n, s, d, i);
    }, c_start: "BEGIN:VCALENDAR", e_start: "BEGIN:VEVENT", e_end: "END:VEVENT", c_end: "END:VCALENDAR" };
  }(e), e.on_load = function(a) {
    var r;
    this.callEvent("onBeforeParse", []);
    var d = !1, i = !1;
    for (var _ in this._parsers) {
      var o = this._parsers[_];
      if (o.canParse(a.xmlDoc.responseText, a.xmlDoc)) {
        try {
          var t = a.xmlDoc.responseText;
          _ === "xml" && (t = a), (r = o.parse(t)) || (d = !0);
        } catch {
          d = !0;
        }
        i = !0;
        break;
      }
    }
    if (!i)
      if (this._process && this[this._process])
        try {
          r = this[this._process].parse(a.xmlDoc.responseText);
        } catch {
          d = !0;
        }
      else
        d = !0;
    (d || a.xmlDoc.status && a.xmlDoc.status >= 400) && (this.callEvent("onLoadError", [a.xmlDoc]), r = []), this._process_loading(r), this.callEvent("onXLE", []), this.callEvent("onParse", []);
  }, e._process_loading = function(a) {
    this._loading = !0, this._not_render = !0;
    for (var r = 0; r < a.length; r++)
      this.callEvent("onEventLoading", [a[r]]) && this.addEvent(a[r]);
    this._not_render = !1, this._render_wait && this.render_view_data(), this._loading = !1, this._after_call && this._after_call(), this._after_call = null;
  }, e._init_event = function(a) {
    a.text = a.text || a._tagvalue || "", a.start_date = e._init_date(a.start_date), a.end_date = e._init_date(a.end_date);
  }, e._init_date = function(a) {
    return a ? typeof a == "string" ? e._helpers.parseDate(a) : new Date(a) : null;
  };
  const h = oe(e);
  e.serialize = function() {
    const a = [], r = h();
    for (var d in r) {
      const o = {};
      var i = r[d];
      for (var _ in i) {
        if (_.charAt(0) == "$" || _.charAt(0) == "_")
          continue;
        let t;
        const n = i[_];
        t = e.utils.isDate(n) ? e.defined(e.templates.xml_format) ? e.templates.xml_format(n) : e.templates.format_date(n) : n, o[_] = t;
      }
      a.push(o);
    }
    return a;
  }, e.parse = function(a, r) {
    this._process = r, this.on_load({ xmlDoc: { responseText: a } });
  }, e.load = function(a, r) {
    typeof r == "string" && (this._process = r, r = arguments[2]), this._load_url = a, this._after_call = r, this._load(a, this._date);
  }, e.setLoadMode = function(a) {
    a == "all" && (a = ""), this._load_mode = a;
  }, e.serverList = function(a, r) {
    return r ? (this.serverList[a] = r.slice(0), this.serverList[a]) : (this.serverList[a] = this.serverList[a] || [], this.serverList[a]);
  }, e._userdata = {}, e._xmlNodeToJSON = function(a) {
    for (var r = {}, d = 0; d < a.attributes.length; d++)
      r[a.attributes[d].name] = a.attributes[d].value;
    for (d = 0; d < a.childNodes.length; d++) {
      var i = a.childNodes[d];
      i.nodeType == 1 && (r[i.tagName] = i.firstChild ? i.firstChild.nodeValue : "");
    }
    return r.text || (r.text = a.firstChild ? a.firstChild.nodeValue : ""), r;
  }, e.attachEvent("onXLS", function() {
    var a;
    this.config.show_loading === !0 && ((a = this.config.show_loading = document.createElement("div")).className = "dhx_loading", a.style.left = Math.round((this._x - 128) / 2) + "px", a.style.top = Math.round((this._y - 15) / 2) + "px", this._obj.appendChild(a));
  }), e.attachEvent("onXLE", function() {
    var a = this.config.show_loading;
    a && typeof a == "object" && (a.parentNode && a.parentNode.removeChild(a), this.config.show_loading = !0);
  });
}
function we(e) {
  e._init_touch_events = function() {
    if ((this.config.touch && (navigator.userAgent.indexOf("Mobile") != -1 || navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("Android") != -1 || navigator.userAgent.indexOf("Touch") != -1) && !window.MSStream || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && (this.xy.scroll_width = 0, this._mobile = !0), this.config.touch) {
      var h = !0;
      try {
        document.createEvent("TouchEvent");
      } catch {
        h = !1;
      }
      h ? this._touch_events(["touchmove", "touchstart", "touchend"], function(a) {
        return a.touches && a.touches.length > 1 ? null : a.touches[0] ? { target: a.target, pageX: a.touches[0].pageX, pageY: a.touches[0].pageY, clientX: a.touches[0].clientX, clientY: a.touches[0].clientY } : a;
      }, function() {
        return !1;
      }) : window.PointerEvent || window.navigator.pointerEnabled ? this._touch_events(["pointermove", "pointerdown", "pointerup"], function(a) {
        return a.pointerType == "mouse" ? null : a;
      }, function(a) {
        return !a || a.pointerType == "mouse";
      }) : window.navigator.msPointerEnabled && this._touch_events(["MSPointerMove", "MSPointerDown", "MSPointerUp"], function(a) {
        return a.pointerType == a.MSPOINTER_TYPE_MOUSE ? null : a;
      }, function(a) {
        return !a || a.pointerType == a.MSPOINTER_TYPE_MOUSE;
      });
    }
  }, e._touch_events = function(h, a, r) {
    var d, i, _, o, t, n, s = 0;
    function c(v, m, l) {
      e.event(v, m, function(f) {
        return !!e._is_lightbox_open() || (r(f) ? void 0 : l(f));
      }, { passive: !1 });
    }
    function u(v) {
      r(v) || (e._hide_global_tip(), o && (e._on_mouse_up(a(v)), e._temp_touch_block = !1), e._drag_id = null, e._drag_mode = null, e._drag_pos = null, e._pointerDragId = null, clearTimeout(_), o = n = !1, t = !0);
    }
    c(document.body, h[0], function(v) {
      if (!r(v)) {
        var m = a(v);
        if (m) {
          if (o)
            return function(l) {
              if (!r(l)) {
                var f = e.getState().drag_mode, g = !!e.matrix && e.matrix[e._mode], p = e.render_view_data;
                f == "create" && g && (e.render_view_data = function() {
                  for (var y = e.getState().drag_id, w = e.getEvent(y), b = g.y_property, k = e.getEvents(w.start_date, w.end_date), E = 0; E < k.length; E++)
                    k[E][b] != w[b] && (k.splice(E, 1), E--);
                  w._sorder = k.length - 1, w._count = k.length, this.render_data([w], e.getState().mode);
                }), e._on_mouse_move(l), f == "create" && g && (e.render_view_data = p), l.preventDefault && l.preventDefault(), l.cancelBubble = !0;
              }
            }(m), v.preventDefault && v.preventDefault(), v.cancelBubble = !0, e._update_global_tip(), !1;
          i = a(v), n && (i ? (d.target != i.target || Math.abs(d.pageX - i.pageX) > 5 || Math.abs(d.pageY - i.pageY) > 5) && (t = !0, clearTimeout(_)) : t = !0);
        }
      }
    }), c(this._els.dhx_cal_data[0], "touchcancel", u), c(this._els.dhx_cal_data[0], "contextmenu", function(v) {
      if (!r(v))
        return n ? (v && v.preventDefault && v.preventDefault(), v.cancelBubble = !0, !1) : void 0;
    }), c(this._obj, h[1], function(v) {
      var m;
      if (document && document.body && document.body.classList.add("dhx_cal_touch_active"), !r(v))
        if (e._pointerDragId = v.pointerId, o = t = !1, n = !0, m = i = a(v)) {
          var l = /* @__PURE__ */ new Date();
          if (!t && !o && l - s < 250)
            return e._click.dhx_cal_data(m), window.setTimeout(function() {
              e.$destroyed || e._on_dbl_click(m);
            }, 50), v.preventDefault && v.preventDefault(), v.cancelBubble = !0, e._block_next_stop = !0, !1;
          if (s = l, !t && !o && e.config.touch_drag) {
            var f = e._locate_event(document.activeElement), g = e._locate_event(m.target), p = d ? e._locate_event(d.target) : null;
            if (f && g && f == g && f != p)
              return v.preventDefault && v.preventDefault(), v.cancelBubble = !0, e._ignore_next_click = !1, e._click.dhx_cal_data(m), d = m, !1;
            _ = setTimeout(function() {
              if (!e.$destroyed) {
                o = !0;
                var y = d.target, w = e._getClassName(y);
                y && w.indexOf("dhx_body") != -1 && (y = y.previousSibling), e._on_mouse_down(d, y), e._drag_mode && e._drag_mode != "create" && e.for_rendered(e._drag_id, function(b, k) {
                  b.style.display = "none", e._rendered.splice(k, 1);
                }), e.config.touch_tip && e._show_global_tip(), e.updateEvent(e._drag_id);
              }
            }, e.config.touch_drag), d = m;
          }
        } else
          t = !0;
    }), c(this._els.dhx_cal_data[0], h[2], function(v) {
      if (document && document.body && document.body.classList.remove("dhx_cal_touch_active"), !r(v))
        return e.config.touch_swipe_dates && !o && function(m, l, f, g) {
          if (!m || !l)
            return !1;
          for (var p = m.target; p && p != e._obj; )
            p = p.parentNode;
          if (p != e._obj || e.matrix && e.matrix[e.getState().mode] && e.matrix[e.getState().mode].scrollable)
            return !1;
          var y = Math.abs(m.pageY - l.pageY), w = Math.abs(m.pageX - l.pageX);
          return y < g && w > f && (!y || w / y > 3) && (m.pageX > l.pageX ? e._click.dhx_cal_next_button() : e._click.dhx_cal_prev_button(), !0);
        }(d, i, 200, 100) && (e._block_next_stop = !0), o && (e._ignore_next_click = !0, setTimeout(function() {
          e._ignore_next_click = !1;
        }, 100)), u(v), e._block_next_stop ? (e._block_next_stop = !1, v.preventDefault && v.preventDefault(), v.cancelBubble = !0, !1) : void 0;
    }), e.event(document.body, h[2], u);
  }, e._show_global_tip = function() {
    e._hide_global_tip();
    var h = e._global_tip = document.createElement("div");
    h.className = "dhx_global_tip", e._update_global_tip(1), document.body.appendChild(h);
  }, e._update_global_tip = function(h) {
    var a = e._global_tip;
    if (a) {
      var r = "";
      if (e._drag_id && !h) {
        var d = e.getEvent(e._drag_id);
        d && (r = "<div>" + (d._timed ? e.templates.event_header(d.start_date, d.end_date, d) : e.templates.day_date(d.start_date, d.end_date, d)) + "</div>");
      }
      e._drag_mode == "create" || e._drag_mode == "new-size" ? a.innerHTML = (e.locale.labels.drag_to_create || "Drag to create") + r : a.innerHTML = (e.locale.labels.drag_to_move || "Drag to move") + r;
    }
  }, e._hide_global_tip = function() {
    var h = e._global_tip;
    h && h.parentNode && (h.parentNode.removeChild(h), e._global_tip = 0);
  };
}
function ke(e) {
  var h, a;
  function r() {
    if (e._is_material_skin())
      return !0;
    if (a !== void 0)
      return a;
    var o = document.createElement("div");
    o.style.position = "absolute", o.style.left = "-9999px", o.style.top = "-9999px", o.innerHTML = "<div class='dhx_cal_container'><div class='dhx_cal_data'><div class='dhx_cal_event'><div class='dhx_body'></div></div><div>", document.body.appendChild(o);
    var t = window.getComputedStyle(o.querySelector(".dhx_body")).getPropertyValue("box-sizing");
    document.body.removeChild(o), (a = t === "border-box") || setTimeout(function() {
      a = void 0;
    }, 1e3);
  }
  function d() {
    if (!e._is_material_skin() && !e._border_box_events()) {
      var o = a;
      a = void 0, h = void 0, o !== r() && e.$container && e.getState().mode && e.setCurrentView();
    }
  }
  function i(o) {
    var t = o.getMinutes();
    return t = t < 10 ? "0" + t : t, "<span class='dhx_scale_h'>" + o.getHours() + "</span><span class='dhx_scale_m'>&nbsp;" + t + "</span>";
  }
  e._addThemeClass = function() {
    document.documentElement.setAttribute("data-scheduler-theme", e.skin);
  }, e._skin_settings = { fix_tab_position: [1, 0], use_select_menu_space: [1, 0], wide_form: [1, 0], hour_size_px: [44, 42], displayed_event_color: ["#ff4a4a", "ffc5ab"], displayed_event_text_color: ["#ffef80", "7e2727"] }, e._skin_xy = { lightbox_additional_height: [90, 50], nav_height: [59, 22], bar_height: [24, 20] }, e._is_material_skin = function() {
    return e.skin ? (e.skin + "").indexOf("material") > -1 : function() {
      if (h === void 0) {
        var o = document.createElement("div");
        o.style.position = "absolute", o.style.left = "-9999px", o.style.top = "-9999px", o.innerHTML = "<div class='dhx_cal_container'><div class='dhx_cal_scale_placeholder'></div><div>", document.body.appendChild(o);
        var t = window.getComputedStyle(o.querySelector(".dhx_cal_scale_placeholder")).getPropertyValue("position");
        h = t === "absolute", setTimeout(function() {
          h = null, o && o.parentNode && o.parentNode.removeChild(o);
        }, 500);
      }
      return h;
    }();
  }, e._build_skin_info = function() {
    (function() {
      const v = e.$container;
      clearInterval(_), v && (_ = setInterval(() => {
        const m = getComputedStyle(v).getPropertyValue("--dhx-scheduler-theme");
        m && m !== e.skin && e.setSkin(m);
      }, 100));
    })();
    const o = getComputedStyle(this.$container), t = o.getPropertyValue("--dhx-scheduler-theme");
    let n, s = !!t, c = {}, u = !1;
    if (s) {
      n = t;
      for (let v in e.xy)
        c[v] = o.getPropertyValue(`--dhx-scheduler-xy-${v}`);
      c.hour_size_px = o.getPropertyValue("--dhx-scheduler-config-hour_size_px"), c.wide_form = o.getPropertyValue("--dhx-scheduler-config-form_wide");
    } else
      n = function() {
        for (var v = document.getElementsByTagName("link"), m = 0; m < v.length; m++) {
          var l = v[m].href.match("dhtmlxscheduler_([a-z]+).css");
          if (l)
            return l[1];
        }
      }(), u = e._is_material_skin();
    if (e._theme_info = { theme: n, cssVarTheme: s, oldMaterialTheme: u, values: c }, e._theme_info.cssVarTheme) {
      const v = this._theme_info.values;
      for (let m in e.xy)
        isNaN(parseInt(v[m])) || (e.xy[m] = parseInt(v[m]));
    }
  }, e.event(window, "DOMContentLoaded", d), e.event(window, "load", d), e._border_box_events = function() {
    return r();
  }, e._configure = function(o, t, n) {
    for (var s in t)
      o[s] === void 0 && (o[s] = t[s][n]);
  }, e.setSkin = function(o) {
    this.skin = o, e._addThemeClass(), e.$container && (this._skin_init(), this.render());
  };
  let _ = null;
  e.attachEvent("onDestroy", function() {
    clearInterval(_);
  }), e._skin_init = function() {
    this._build_skin_info(), this.skin || (this.skin = this._theme_info.theme), e._addThemeClass(), e.skin === "flat" ? e.templates.hour_scale = i : e.templates.hour_scale === i && (e.templates.hour_scale = e.date.date_to_str(e.config.hour_date)), e.attachEvent("onTemplatesReady", function() {
      var o = e.date.date_to_str("%d");
      e.templates._old_month_day || (e.templates._old_month_day = e.templates.month_day);
      var t = e.templates._old_month_day;
      e.templates.month_day = function(n) {
        if (this._mode == "month") {
          var s = o(n);
          return n.getDate() == 1 && (s = e.locale.date.month_full[n.getMonth()] + " " + s), +n == +e.date.date_part(this._currentDate()) && (s = e.locale.labels.dhx_cal_today_button + " " + s), s;
        }
        return t.call(this, n);
      }, e.config.fix_tab_position && (e._els.dhx_cal_navline[0].querySelectorAll("[data-tab]").forEach((n) => {
        switch (n.getAttribute("data-tab") || n.getAttribute("name")) {
          case "day":
          case "day_tab":
            n.classList.add("dhx_cal_tab_first"), n.classList.add("dhx_cal_tab_segmented");
            break;
          case "week":
          case "week_tab":
            n.classList.add("dhx_cal_tab_segmented");
            break;
          case "month":
          case "month_tab":
            n.classList.add("dhx_cal_tab_last"), n.classList.add("dhx_cal_tab_segmented");
            break;
          default:
            n.classList.add("dhx_cal_tab_standalone");
        }
      }), function(n) {
        if (e.config.header)
          return;
        const s = Array.from(n.querySelectorAll(".dhx_cal_tab")), c = ["day", "week", "month"].map((v) => s.find((m) => m.getAttribute("data-tab") === v)).filter((v) => v !== void 0);
        let u = s.length > 0 ? s[0] : null;
        c.reverse().forEach((v) => {
          n.insertBefore(v, u), u = v;
        });
      }(e._els.dhx_cal_navline[0]));
    }, { once: !0 });
  };
}
function Ee(e, h) {
  this.$scheduler = e, this.$dp = h, this._dataProcessorHandlers = [], this.attach = function() {
    var a = this.$dp, r = this.$scheduler;
    this._dataProcessorHandlers.push(r.attachEvent("onEventAdded", function(d) {
      !this._loading && this._validId(d) && a.setUpdated(d, !0, "inserted");
    })), this._dataProcessorHandlers.push(r.attachEvent("onConfirmedBeforeEventDelete", function(d) {
      if (this._validId(d)) {
        var i = a.getState(d);
        return i == "inserted" || this._new_event ? (a.setUpdated(d, !1), !0) : i != "deleted" && (i == "true_deleted" || (a.setUpdated(d, !0, "deleted"), !1));
      }
    })), this._dataProcessorHandlers.push(r.attachEvent("onEventChanged", function(d) {
      !this._loading && this._validId(d) && a.setUpdated(d, !0, "updated");
    })), this._dataProcessorHandlers.push(r.attachEvent("onClearAll", function() {
      a._in_progress = {}, a._invalid = {}, a.updatedRows = [], a._waitMode = 0;
    })), a.attachEvent("insertCallback", r._update_callback), a.attachEvent("updateCallback", r._update_callback), a.attachEvent("deleteCallback", function(d, i) {
      r.getEvent(i) ? (r.setUserData(i, this.action_param, "true_deleted"), r.deleteEvent(i)) : r._add_rec_marker && r._update_callback(d, i);
    });
  }, this.detach = function() {
    for (var a in this._dataProcessorHandlers) {
      var r = this._dataProcessorHandlers[a];
      this.$scheduler.detachEvent(r);
    }
    this._dataProcessorHandlers = [];
  };
}
function G(e) {
  return this.serverProcessor = e, this.action_param = "!nativeeditor_status", this.object = null, this.updatedRows = [], this.autoUpdate = !0, this.updateMode = "cell", this._tMode = "GET", this._headers = null, this._payload = null, this.post_delim = "_", this._waitMode = 0, this._in_progress = {}, this._invalid = {}, this.messages = [], this.styles = { updated: "font-weight:bold;", inserted: "font-weight:bold;", deleted: "text-decoration : line-through;", invalid: "background-color:FFE0E0;", invalid_cell: "border-bottom:2px solid red;", error: "color:red;", clear: "font-weight:normal;text-decoration:none;" }, this.enableUTFencoding(!0), Q(this), this;
}
function De(e) {
  var h = "data-dhxbox", a = null;
  function r(g, p) {
    var y = g.callback;
    m.hide(g.box), a = g.box = null, y && y(p);
  }
  function d(g) {
    if (a) {
      var p = g.which || g.keyCode, y = !1;
      if (l.keyboard) {
        if (p == 13 || p == 32) {
          var w = g.target || g.srcElement;
          q.getClassName(w).indexOf("scheduler_popup_button") > -1 && w.click ? w.click() : (r(a, !0), y = !0);
        }
        p == 27 && (r(a, !1), y = !0);
      }
      return y ? (g.preventDefault && g.preventDefault(), !(g.cancelBubble = !0)) : void 0;
    }
  }
  function i(g) {
    i.cover || (i.cover = document.createElement("div"), e.event(i.cover, "keydown", d), i.cover.className = "dhx_modal_cover", document.body.appendChild(i.cover)), i.cover.style.display = g ? "inline-block" : "none";
  }
  function _(g, p, y) {
    var w = e._waiAria.messageButtonAttrString(g), b = (p || "").toLowerCase().replace(/ /g, "_");
    return `<div ${w} class='scheduler_popup_button dhtmlx_popup_button ${`scheduler_${b}_button dhtmlx_${b}_button`}' data-result='${y}' result='${y}' ><div>${g}</div></div>`;
  }
  function o() {
    for (var g = [].slice.apply(arguments, [0]), p = 0; p < g.length; p++)
      if (g[p])
        return g[p];
  }
  function t(g, p, y) {
    var w = g.tagName ? g : function(E, D, x) {
      var S = document.createElement("div"), N = V.uid();
      e._waiAria.messageModalAttr(S, N), S.className = " scheduler_modal_box dhtmlx_modal_box scheduler-" + E.type + " dhtmlx-" + E.type, S.setAttribute(h, 1);
      var M = "";
      if (E.width && (S.style.width = E.width), E.height && (S.style.height = E.height), E.title && (M += '<div class="scheduler_popup_title dhtmlx_popup_title">' + E.title + "</div>"), M += '<div class="scheduler_popup_text dhtmlx_popup_text" id="' + N + '"><span>' + (E.content ? "" : E.text) + '</span></div><div  class="scheduler_popup_controls dhtmlx_popup_controls">', D && (M += _(o(E.ok, e.locale.labels.message_ok, "OK"), "ok", !0)), x && (M += _(o(E.cancel, e.locale.labels.message_cancel, "Cancel"), "cancel", !1)), E.buttons)
        for (var A = 0; A < E.buttons.length; A++) {
          var C = E.buttons[A];
          M += typeof C == "object" ? _(C.label, C.css || "scheduler_" + C.label.toLowerCase() + "_button dhtmlx_" + C.label.toLowerCase() + "_button", C.value || A) : _(C, C, A);
        }
      if (M += "</div>", S.innerHTML = M, E.content) {
        var T = E.content;
        typeof T == "string" && (T = document.getElementById(T)), T.style.display == "none" && (T.style.display = ""), S.childNodes[E.title ? 1 : 0].appendChild(T);
      }
      return e.event(S, "click", function(O) {
        var L = O.target || O.srcElement;
        if (L.className || (L = L.parentNode), q.closest(L, ".scheduler_popup_button")) {
          var H = L.getAttribute("data-result");
          r(E, H = H == "true" || H != "false" && H);
        }
      }), E.box = S, (D || x) && (a = E), S;
    }(g, p, y);
    g.hidden || i(!0), document.body.appendChild(w);
    var b = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - w.offsetWidth) / 2)), k = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - w.offsetHeight) / 2));
    return g.position == "top" ? w.style.top = "-3px" : w.style.top = k + "px", w.style.left = b + "px", e.event(w, "keydown", d), m.focus(w), g.hidden && m.hide(w), e.callEvent("onMessagePopup", [w]), w;
  }
  function n(g) {
    return t(g, !0, !1);
  }
  function s(g) {
    return t(g, !0, !0);
  }
  function c(g) {
    return t(g);
  }
  function u(g, p, y) {
    return typeof g != "object" && (typeof p == "function" && (y = p, p = ""), g = { text: g, type: p, callback: y }), g;
  }
  function v(g, p, y, w) {
    return typeof g != "object" && (g = { text: g, type: p, expire: y, id: w }), g.id = g.id || V.uid(), g.expire = g.expire || l.expire, g;
  }
  e.event(document, "keydown", d, !0);
  var m = function() {
    var g = u.apply(this, arguments);
    return g.type = g.type || "alert", c(g);
  };
  m.hide = function(g) {
    for (; g && g.getAttribute && !g.getAttribute(h); )
      g = g.parentNode;
    g && (g.parentNode.removeChild(g), i(!1), e.callEvent("onAfterMessagePopup", [g]));
  }, m.focus = function(g) {
    setTimeout(function() {
      var p = q.getFocusableNodes(g);
      p.length && p[0].focus && p[0].focus();
    }, 1);
  };
  var l = function(g, p, y, w) {
    switch ((g = v.apply(this, arguments)).type = g.type || "info", g.type.split("-")[0]) {
      case "alert":
        return n(g);
      case "confirm":
        return s(g);
      case "modalbox":
        return c(g);
      default:
        return function(b) {
          l.area || (l.area = document.createElement("div"), l.area.className = "scheduler_message_area dhtmlx_message_area", l.area.style[l.position] = "5px", document.body.appendChild(l.area)), l.hide(b.id);
          var k = document.createElement("div");
          return k.innerHTML = "<div>" + b.text + "</div>", k.className = "scheduler-info dhtmlx-info scheduler-" + b.type + " dhtmlx-" + b.type, e.event(k, "click", function() {
            l.hide(b.id), b = null;
          }), e._waiAria.messageInfoAttr(k), l.position == "bottom" && l.area.firstChild ? l.area.insertBefore(k, l.area.firstChild) : l.area.appendChild(k), b.expire > 0 && (l.timers[b.id] = window.setTimeout(function() {
            l && l.hide(b.id);
          }, b.expire)), l.pull[b.id] = k, k = null, b.id;
        }(g);
    }
  };
  l.seed = (/* @__PURE__ */ new Date()).valueOf(), l.uid = V.uid, l.expire = 4e3, l.keyboard = !0, l.position = "top", l.pull = {}, l.timers = {}, l.hideAll = function() {
    for (var g in l.pull)
      l.hide(g);
  }, l.hide = function(g) {
    var p = l.pull[g];
    p && p.parentNode && (window.setTimeout(function() {
      p.parentNode.removeChild(p), p = null;
    }, 2e3), p.className += " hidden", l.timers[g] && window.clearTimeout(l.timers[g]), delete l.pull[g]);
  };
  var f = [];
  return e.attachEvent("onMessagePopup", function(g) {
    f.push(g);
  }), e.attachEvent("onAfterMessagePopup", function(g) {
    for (var p = 0; p < f.length; p++)
      f[p] === g && (f.splice(p, 1), p--);
  }), e.attachEvent("onDestroy", function() {
    i.cover && i.cover.parentNode && i.cover.parentNode.removeChild(i.cover);
    for (var g = 0; g < f.length; g++)
      f[g].parentNode && f[g].parentNode.removeChild(f[g]);
    f = null, l.area && l.area.parentNode && l.area.parentNode.removeChild(l.area), l = null;
  }), { alert: function() {
    var g = u.apply(this, arguments);
    return g.type = g.type || "confirm", n(g);
  }, confirm: function() {
    var g = u.apply(this, arguments);
    return g.type = g.type || "alert", s(g);
  }, message: l, modalbox: m };
}
G.prototype = { setTransactionMode: function(e, h) {
  typeof e == "object" ? (this._tMode = e.mode || this._tMode, e.headers !== void 0 && (this._headers = e.headers), e.payload !== void 0 && (this._payload = e.payload), this._tSend = !!h) : (this._tMode = e, this._tSend = h), this._tMode == "REST" && (this._tSend = !1, this._endnm = !0), this._tMode === "JSON" || this._tMode === "REST-JSON" ? (this._tSend = !1, this._endnm = !0, this._serializeAsJson = !0, this._headers = this._headers || {}, this._headers["Content-Type"] = "application/json") : this._headers && !this._headers["Content-Type"] && (this._headers["Content-Type"] = "application/x-www-form-urlencoded"), this._tMode === "CUSTOM" && (this._tSend = !1, this._endnm = !0, this._router = e.router);
}, escape: function(e) {
  return this._utf ? encodeURIComponent(e) : escape(e);
}, enableUTFencoding: function(e) {
  this._utf = !!e;
}, setDataColumns: function(e) {
  this._columns = typeof e == "string" ? e.split(",") : e;
}, getSyncState: function() {
  return !this.updatedRows.length;
}, enableDataNames: function(e) {
  this._endnm = !!e;
}, enablePartialDataSend: function(e) {
  this._changed = !!e;
}, setUpdateMode: function(e, h) {
  this.autoUpdate = e == "cell", this.updateMode = e, this.dnd = h;
}, ignore: function(e, h) {
  this._silent_mode = !0, e.call(h || window), this._silent_mode = !1;
}, setUpdated: function(e, h, a) {
  if (!this._silent_mode) {
    var r = this.findRow(e);
    a = a || "updated";
    var d = this.$scheduler.getUserData(e, this.action_param);
    d && a == "updated" && (a = d), h ? (this.set_invalid(e, !1), this.updatedRows[r] = e, this.$scheduler.setUserData(e, this.action_param, a), this._in_progress[e] && (this._in_progress[e] = "wait")) : this.is_invalid(e) || (this.updatedRows.splice(r, 1), this.$scheduler.setUserData(e, this.action_param, "")), this.markRow(e, h, a), h && this.autoUpdate && this.sendData(e);
  }
}, markRow: function(e, h, a) {
  var r = "", d = this.is_invalid(e);
  if (d && (r = this.styles[d], h = !0), this.callEvent("onRowMark", [e, h, a, d]) && (r = this.styles[h ? a : "clear"] + r, this.$scheduler[this._methods[0]](e, r), d && d.details)) {
    r += this.styles[d + "_cell"];
    for (var i = 0; i < d.details.length; i++)
      d.details[i] && this.$scheduler[this._methods[1]](e, i, r);
  }
}, getActionByState: function(e) {
  return e === "inserted" ? "create" : e === "updated" ? "update" : e === "deleted" ? "delete" : "update";
}, getState: function(e) {
  return this.$scheduler.getUserData(e, this.action_param);
}, is_invalid: function(e) {
  return this._invalid[e];
}, set_invalid: function(e, h, a) {
  a && (h = { value: h, details: a, toString: function() {
    return this.value.toString();
  } }), this._invalid[e] = h;
}, checkBeforeUpdate: function(e) {
  return !0;
}, sendData: function(e) {
  return this.$scheduler.editStop && this.$scheduler.editStop(), e === void 0 || this._tSend ? this.sendAllData() : !this._in_progress[e] && (this.messages = [], !(!this.checkBeforeUpdate(e) && this.callEvent("onValidationError", [e, this.messages])) && void this._beforeSendData(this._getRowData(e), e));
}, _beforeSendData: function(e, h) {
  if (!this.callEvent("onBeforeUpdate", [h, this.getState(h), e]))
    return !1;
  this._sendData(e, h);
}, serialize: function(e, h) {
  if (this._serializeAsJson)
    return this._serializeAsJSON(e);
  if (typeof e == "string")
    return e;
  if (h !== void 0)
    return this.serialize_one(e, "");
  var a = [], r = [];
  for (var d in e)
    e.hasOwnProperty(d) && (a.push(this.serialize_one(e[d], d + this.post_delim)), r.push(d));
  return a.push("ids=" + this.escape(r.join(","))), this.$scheduler.security_key && a.push("dhx_security=" + this.$scheduler.security_key), a.join("&");
}, serialize_one: function(e, h) {
  if (typeof e == "string")
    return e;
  var a = [], r = "";
  for (var d in e)
    if (e.hasOwnProperty(d)) {
      if ((d == "id" || d == this.action_param) && this._tMode == "REST")
        continue;
      r = typeof e[d] == "string" || typeof e[d] == "number" ? e[d] : JSON.stringify(e[d]), a.push(this.escape((h || "") + d) + "=" + this.escape(r));
    }
  return a.join("&");
}, _applyPayload: function(e) {
  var h = this.$scheduler.ajax;
  if (this._payload)
    for (var a in this._payload)
      e = e + h.urlSeparator(e) + this.escape(a) + "=" + this.escape(this._payload[a]);
  return e;
}, _sendData: function(e, h) {
  if (e) {
    if (!this.callEvent("onBeforeDataSending", h ? [h, this.getState(h), e] : [null, null, e]))
      return !1;
    h && (this._in_progress[h] = (/* @__PURE__ */ new Date()).valueOf());
    var a = this, r = this.$scheduler.ajax;
    if (this._tMode !== "CUSTOM") {
      var d, i = { callback: function(m) {
        var l = [];
        if (h)
          l.push(h);
        else if (e)
          for (var f in e)
            l.push(f);
        return a.afterUpdate(a, m, l);
      }, headers: a._headers }, _ = this.serverProcessor + (this._user ? r.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + this.$scheduler.getUserData(0, "version")].join("&") : ""), o = this._applyPayload(_);
      switch (this._tMode) {
        case "GET":
          d = this._cleanupArgumentsBeforeSend(e), i.url = o + r.urlSeparator(o) + this.serialize(d, h), i.method = "GET";
          break;
        case "POST":
          d = this._cleanupArgumentsBeforeSend(e), i.url = o, i.method = "POST", i.data = this.serialize(d, h);
          break;
        case "JSON":
          d = {};
          var t = this._cleanupItemBeforeSend(e);
          for (var n in t)
            n !== this.action_param && n !== "id" && n !== "gr_id" && (d[n] = t[n]);
          i.url = o, i.method = "POST", i.data = JSON.stringify({ id: h, action: e[this.action_param], data: d });
          break;
        case "REST":
        case "REST-JSON":
          switch (o = _.replace(/(&|\?)editing=true/, ""), d = "", this.getState(h)) {
            case "inserted":
              i.method = "POST", i.data = this.serialize(e, h);
              break;
            case "deleted":
              i.method = "DELETE", o = o + (o.slice(-1) === "/" ? "" : "/") + h;
              break;
            default:
              i.method = "PUT", i.data = this.serialize(e, h), o = o + (o.slice(-1) === "/" ? "" : "/") + h;
          }
          i.url = this._applyPayload(o);
      }
      return this._waitMode++, r.query(i);
    }
    {
      var s = this.getState(h), c = this.getActionByState(s), u = function(l) {
        var f = s;
        if (l && l.responseText && l.setRequestHeader) {
          l.status !== 200 && (f = "error");
          try {
            l = JSON.parse(l.responseText);
          } catch {
          }
        }
        f = f || "updated";
        var g = h, p = h;
        l && (f = l.action || f, g = l.sid || g, p = l.id || l.tid || p), a.afterUpdateCallback(g, p, f, l);
      };
      const m = "event";
      var v;
      if (this._router instanceof Function)
        v = this._router(m, c, e, h);
      else
        switch (s) {
          case "inserted":
            v = this._router[m].create(e);
            break;
          case "deleted":
            v = this._router[m].delete(h);
            break;
          default:
            v = this._router[m].update(e, h);
        }
      if (v) {
        if (!v.then && v.id === void 0 && v.tid === void 0 && v.action === void 0)
          throw new Error("Incorrect router return value. A Promise or a response object is expected");
        v.then ? v.then(u).catch(function(l) {
          l && l.action ? u(l) : u({ action: "error", value: l });
        }) : u(v);
      } else
        u(null);
    }
  }
}, sendAllData: function() {
  if (this.updatedRows.length && this.updateMode !== "off") {
    this.messages = [];
    var e = !0;
    if (this._forEachUpdatedRow(function(h) {
      e = e && this.checkBeforeUpdate(h);
    }), !e && !this.callEvent("onValidationError", ["", this.messages]))
      return !1;
    this._tSend ? this._sendData(this._getAllData()) : this._forEachUpdatedRow(function(h) {
      if (!this._in_progress[h]) {
        if (this.is_invalid(h))
          return;
        this._beforeSendData(this._getRowData(h), h);
      }
    });
  }
}, _getAllData: function(e) {
  var h = {}, a = !1;
  return this._forEachUpdatedRow(function(r) {
    if (!this._in_progress[r] && !this.is_invalid(r)) {
      var d = this._getRowData(r);
      this.callEvent("onBeforeUpdate", [r, this.getState(r), d]) && (h[r] = d, a = !0, this._in_progress[r] = (/* @__PURE__ */ new Date()).valueOf());
    }
  }), a ? h : null;
}, findRow: function(e) {
  var h = 0;
  for (h = 0; h < this.updatedRows.length && e != this.updatedRows[h]; h++)
    ;
  return h;
}, defineAction: function(e, h) {
  this._uActions || (this._uActions = {}), this._uActions[e] = h;
}, afterUpdateCallback: function(e, h, a, r) {
  if (this.$scheduler) {
    var d = e, i = a !== "error" && a !== "invalid";
    if (i || this.set_invalid(e, a), this._uActions && this._uActions[a] && !this._uActions[a](r))
      return delete this._in_progress[d];
    this._in_progress[d] !== "wait" && this.setUpdated(e, !1);
    var _ = e;
    switch (a) {
      case "inserted":
      case "insert":
        h != e && (this.setUpdated(e, !1), this.$scheduler[this._methods[2]](e, h), e = h);
        break;
      case "delete":
      case "deleted":
        return this.$scheduler.setUserData(e, this.action_param, "true_deleted"), this.$scheduler[this._methods[3]](e, h), delete this._in_progress[d], this.callEvent("onAfterUpdate", [e, a, h, r]);
    }
    this._in_progress[d] !== "wait" ? (i && this.$scheduler.setUserData(e, this.action_param, ""), delete this._in_progress[d]) : (delete this._in_progress[d], this.setUpdated(h, !0, this.$scheduler.getUserData(e, this.action_param))), this.callEvent("onAfterUpdate", [_, a, h, r]);
  }
}, _errorResponse: function(e, h) {
  return this.$scheduler && this.$scheduler.callEvent && this.$scheduler.callEvent("onSaveError", [h, e.xmlDoc]), this.cleanUpdate(h);
}, _setDefaultTransactionMode: function() {
  this.serverProcessor && (this.setTransactionMode("POST", !0), this.serverProcessor += (this.serverProcessor.indexOf("?") !== -1 ? "&" : "?") + "editing=true", this._serverProcessor = this.serverProcessor);
}, afterUpdate: function(e, h, a) {
  var r = this.$scheduler.ajax;
  if (h.xmlDoc.status === 200) {
    var d;
    try {
      d = JSON.parse(h.xmlDoc.responseText);
    } catch {
      h.xmlDoc.responseText.length || (d = {});
    }
    if (d) {
      var i = d.action || this.getState(a) || "updated", _ = d.sid || a[0], o = d.tid || a[0];
      return e.afterUpdateCallback(_, o, i, d), void e.finalizeUpdate();
    }
    var t = r.xmltop("data", h.xmlDoc);
    if (!t)
      return this._errorResponse(h, a);
    var n = r.xpath("//data/action", t);
    if (!n.length)
      return this._errorResponse(h, a);
    for (var s = 0; s < n.length; s++) {
      var c = n[s];
      i = c.getAttribute("type"), _ = c.getAttribute("sid"), o = c.getAttribute("tid"), e.afterUpdateCallback(_, o, i, c);
    }
    e.finalizeUpdate();
  } else
    this._errorResponse(h, a);
}, cleanUpdate: function(e) {
  if (e)
    for (var h = 0; h < e.length; h++)
      delete this._in_progress[e[h]];
}, finalizeUpdate: function() {
  this._waitMode && this._waitMode--, this.callEvent("onAfterUpdateFinish", []), this.updatedRows.length || this.callEvent("onFullSync", []);
}, init: function(e) {
  if (!this._initialized) {
    this.$scheduler = e, this.$scheduler._dp_init && this.$scheduler._dp_init(this), this._setDefaultTransactionMode(), this._methods = this._methods || ["_set_event_text_style", "", "_dp_change_event_id", "_dp_hook_delete"], function(a, r) {
      a._validId = function(d) {
        return !this._is_virtual_event || !this._is_virtual_event(d);
      }, a.setUserData = function(d, i, _) {
        if (d) {
          var o = this.getEvent(d);
          o && (o[i] = _);
        } else
          this._userdata[i] = _;
      }, a.getUserData = function(d, i) {
        if (d) {
          var _ = this.getEvent(d);
          return _ ? _[i] : null;
        }
        return this._userdata[i];
      }, a._set_event_text_style = function(d, i) {
        if (a.getEvent(d)) {
          this.for_rendered(d, function(o) {
            o.style.cssText += ";" + i;
          });
          var _ = this.getEvent(d);
          _._text_style = i, this.event_updated(_);
        }
      }, a._update_callback = function(d, i) {
        var _ = a._xmlNodeToJSON(d.firstChild);
        _.rec_type == "none" && (_.rec_pattern = "none"), _.text = _.text || _._tagvalue, _.start_date = a._helpers.parseDate(_.start_date), _.end_date = a._helpers.parseDate(_.end_date), a.addEvent(_), a._add_rec_marker && a.setCurrentView();
      }, a._dp_change_event_id = function(d, i) {
        a.getEvent(d) && a.changeEventId(d, i);
      }, a._dp_hook_delete = function(d, i) {
        if (a.getEvent(d))
          return i && d != i && (this.getUserData(d, r.action_param) == "true_deleted" && this.setUserData(d, r.action_param, "updated"), this.changeEventId(d, i)), this.deleteEvent(i, !0);
      }, a.setDp = function() {
        this._dp = r;
      }, a.setDp();
    }(this.$scheduler, this);
    var h = new Ee(this.$scheduler, this);
    h.attach(), this.attachEvent("onDestroy", function() {
      delete this._getRowData, delete this.$scheduler._dp, delete this.$scheduler._dataprocessor, delete this.$scheduler._set_event_text_style, delete this.$scheduler._dp_change_event_id, delete this.$scheduler._dp_hook_delete, delete this.$scheduler, h.detach();
    }), this.$scheduler.callEvent("onDataProcessorReady", [this]), this._initialized = !0, e._dataprocessor = this;
  }
}, setOnAfterUpdate: function(e) {
  this.attachEvent("onAfterUpdate", e);
}, setOnBeforeUpdateHandler: function(e) {
  this.attachEvent("onBeforeDataSending", e);
}, setAutoUpdate: function(e, h) {
  e = e || 2e3, this._user = h || (/* @__PURE__ */ new Date()).valueOf(), this._need_update = !1, this._update_busy = !1, this.attachEvent("onAfterUpdate", function(d, i, _, o) {
    this.afterAutoUpdate(d, i, _, o);
  }), this.attachEvent("onFullSync", function() {
    this.fullSync();
  });
  var a = this;
  let r = I.setInterval(function() {
    a.loadUpdate();
  }, e);
  this.attachEvent("onDestroy", function() {
    clearInterval(r);
  });
}, afterAutoUpdate: function(e, h, a, r) {
  return h != "collision" || (this._need_update = !0, !1);
}, fullSync: function() {
  return this._need_update && (this._need_update = !1, this.loadUpdate()), !0;
}, getUpdates: function(e, h) {
  var a = this.$scheduler.ajax;
  if (this._update_busy)
    return !1;
  this._update_busy = !0, a.get(e, h);
}, _getXmlNodeValue: function(e) {
  return e.firstChild ? e.firstChild.nodeValue : "";
}, loadUpdate: function() {
  var e = this, h = this.$scheduler.ajax, a = this.$scheduler.getUserData(0, "version"), r = this.serverProcessor + h.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + a].join("&");
  r = r.replace("editing=true&", ""), this.getUpdates(r, function(d) {
    var i = h.xpath("//userdata", d);
    e.$scheduler.setUserData(0, "version", e._getXmlNodeValue(i[0]));
    var _ = h.xpath("//update", d);
    if (_.length) {
      e._silent_mode = !0;
      for (var o = 0; o < _.length; o++) {
        var t = _[o].getAttribute("status"), n = _[o].getAttribute("id"), s = _[o].getAttribute("parent");
        switch (t) {
          case "inserted":
            this.callEvent("insertCallback", [_[o], n, s]);
            break;
          case "updated":
            this.callEvent("updateCallback", [_[o], n, s]);
            break;
          case "deleted":
            this.callEvent("deleteCallback", [_[o], n, s]);
        }
      }
      e._silent_mode = !1;
    }
    e._update_busy = !1, e = null;
  });
}, destructor: function() {
  this.callEvent("onDestroy", []), this.detachAllEvents(), this.updatedRows = [], this._in_progress = {}, this._invalid = {}, this._headers = null, this._payload = null, delete this._initialized;
}, url: function(e) {
  this.serverProcessor = this._serverProcessor = e;
}, _serializeAsJSON: function(e) {
  if (typeof e == "string")
    return e;
  var h = this.$scheduler.utils.copy(e);
  return this._tMode === "REST-JSON" && (delete h.id, delete h[this.action_param]), JSON.stringify(h);
}, _cleanupArgumentsBeforeSend: function(e) {
  var h;
  if (e[this.action_param] === void 0)
    for (var a in h = {}, e)
      h[a] = this._cleanupArgumentsBeforeSend(e[a]);
  else
    h = this._cleanupItemBeforeSend(e);
  return h;
}, _cleanupItemBeforeSend: function(e) {
  var h = null;
  return e && (e[this.action_param] === "deleted" ? ((h = {}).id = e.id, h[this.action_param] = e[this.action_param]) : h = e), h;
}, _forEachUpdatedRow: function(e) {
  for (var h = this.updatedRows.slice(), a = 0; a < h.length; a++) {
    var r = h[a];
    this.$scheduler.getUserData(r, this.action_param) && e.call(this, r);
  }
}, _prepareDataItem: function(e) {
  var h = {}, a = this.$scheduler, r = a.utils.copy(e);
  for (var d in r)
    d.indexOf("_") !== 0 && r[d] && (r[d].getUTCFullYear ? h[d] = a._helpers.formatDate(r[d]) : typeof r[d] == "object" ? h[d] = this._prepareDataItem(r[d]) : r[d] === null ? h[d] = "" : h[d] = r[d]);
  return h[this.action_param] = a.getUserData(e.id, this.action_param), h;
}, _getRowData: function(e) {
  var h = this.$scheduler.getEvent(e);
  return h || (h = { id: e }), this._prepareDataItem(h);
} };
const Se = { date: { month_full: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"], month_short: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_full: ["الأحد", "الأثنين", "ألثلاثاء", "الأربعاء", "ألحميس", "ألجمعة", "السبت"], day_short: ["احد", "اثنين", "ثلاثاء", "اربعاء", "خميس", "جمعة", "سبت"] }, labels: { dhx_cal_today_button: "اليوم", day_tab: "يوم", week_tab: "أسبوع", month_tab: "شهر", new_event: "حدث جديد", icon_save: "اخزن", icon_cancel: "الغاء", icon_details: "تفاصيل", icon_edit: "تحرير", icon_delete: "حذف", confirm_closing: "التغييرات سوف تضيع, هل انت متأكد؟", confirm_deleting: "الحدث سيتم حذفها نهائيا ، هل أنت متأكد؟", section_description: "الوصف", section_time: "الفترة الزمنية", full_day: "طوال اليوم", confirm_recurring: "هل تريد تحرير مجموعة كاملة من الأحداث المتكررة؟", section_recurring: "تكرار الحدث", button_recurring: "تعطيل", button_recurring_open: "تمكين", button_edit_series: "تحرير سلسلة", button_edit_occurrence: "تعديل نسخة", grid_tab: "جدول", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute" } }, Ne = { date: { month_full: ["Студзень", "Люты", "Сакавік", "Красавік", "Maй", "Чэрвень", "Ліпень", "Жнівень", "Верасень", "Кастрычнік", "Лістапад", "Снежань"], month_short: ["Студз", "Лют", "Сак", "Крас", "Maй", "Чэр", "Ліп", "Жнів", "Вер", "Каст", "Ліст", "Снеж"], day_full: ["Нядзеля", "Панядзелак", "Аўторак", "Серада", "Чацвер", "Пятніца", "Субота"], day_short: ["Нд", "Пн", "Аўт", "Ср", "Чцв", "Пт", "Сб"] }, labels: { dhx_cal_today_button: "Сёння", day_tab: "Дзень", week_tab: "Тыдзень", month_tab: "Месяц", new_event: "Новая падзея", icon_save: "Захаваць", icon_cancel: "Адмяніць", icon_details: "Дэталі", icon_edit: "Змяніць", icon_delete: "Выдаліць", confirm_closing: "", confirm_deleting: "Падзея будзе выдалена незваротна, працягнуць?", section_description: "Апісанне", section_time: "Перыяд часу", full_day: "Увесь дзень", confirm_recurring: "Вы хочаце змяніць усю серыю паўтаральных падзей?", section_recurring: "Паўтарэнне", button_recurring: "Адключана", button_recurring_open: "Уключана", button_edit_series: "Рэдагаваць серыю", button_edit_occurrence: "Рэдагаваць асобнік", agenda_tab: "Спіс", date: "Дата", description: "Апісанне", year_tab: "Год", week_agenda_tab: "Спіс", grid_tab: "Спic", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Дзень", repeat_radio_week: "Тыдзень", repeat_radio_month: "Месяц", repeat_radio_year: "Год", repeat_radio_day_type: "Кожны", repeat_text_day_count: "дзень", repeat_radio_day_type2: "Кожны працоўны дзень", repeat_week: " Паўтараць кожны", repeat_text_week_count: "тыдзень", repeat_radio_month_type: "Паўтараць", repeat_radio_month_start: "", repeat_text_month_day: " чысла кожнага", repeat_text_month_count: "месяцу", repeat_text_month_count2_before: "кожны ", repeat_text_month_count2_after: "месяц", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "дзень", select_year_month: "", repeat_radio_end: "Без даты заканчэння", repeat_text_occurences_count: "паўтораў", repeat_radio_end2: "", repeat_radio_end3: "Да ", month_for_recurring: ["Студзеня", "Лютага", "Сакавіка", "Красавіка", "Мая", "Чэрвеня", "Ліпeня", "Жніўня", "Верасня", "Кастрычніка", "Лістапада", "Снежня"], day_for_recurring: ["Нядзелю", "Панядзелак", "Аўторак", "Сераду", "Чацвер", "Пятніцу", "Суботу"] } }, Me = { date: { month_full: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], month_short: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"], day_full: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"], day_short: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"] }, labels: { dhx_cal_today_button: "Hui", day_tab: "Dia", week_tab: "Setmana", month_tab: "Mes", new_event: "Nou esdeveniment", icon_save: "Guardar", icon_cancel: "Cancel·lar", icon_details: "Detalls", icon_edit: "Editar", icon_delete: "Esborrar", confirm_closing: "", confirm_deleting: "L'esdeveniment s'esborrarà definitivament, continuar ?", section_description: "Descripció", section_time: "Periode de temps", full_day: "Tot el dia", confirm_recurring: "¿Desitja modificar el conjunt d'esdeveniments repetits?", section_recurring: "Repeteixca l'esdeveniment", button_recurring: "Impedit", button_recurring_open: "Permés", button_edit_series: "Edit sèrie", button_edit_occurrence: "Edita Instància", agenda_tab: "Agenda", date: "Data", description: "Descripció", year_tab: "Any", week_agenda_tab: "Agenda", grid_tab: "Taula", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute" } }, Ae = { date: { month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], day_short: ["日", "一", "二", "三", "四", "五", "六"] }, labels: { dhx_cal_today_button: "今天", day_tab: "日", week_tab: "周", month_tab: "月", new_event: "新建日程", icon_save: "保存", icon_cancel: "关闭", icon_details: "详细", icon_edit: "编辑", icon_delete: "删除", confirm_closing: "请确认是否撤销修改!", confirm_deleting: "是否删除日程?", section_description: "描述", section_time: "时间范围", full_day: "整天", confirm_recurring: "请确认是否将日程设为重复模式?", section_recurring: "重复周期", button_recurring: "禁用", button_recurring_open: "启用", button_edit_series: "编辑系列", button_edit_occurrence: "编辑实例", agenda_tab: "议程", date: "日期", description: "说明", year_tab: "今年", week_agenda_tab: "议程", grid_tab: "电网", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "按天", repeat_radio_week: "按周", repeat_radio_month: "按月", repeat_radio_year: "按年", repeat_radio_day_type: "每", repeat_text_day_count: "天", repeat_radio_day_type2: "每个工作日", repeat_week: " 重复 每", repeat_text_week_count: "星期的:", repeat_radio_month_type: "重复", repeat_radio_month_start: "在", repeat_text_month_day: "日 每", repeat_text_month_count: "月", repeat_text_month_count2_before: "每", repeat_text_month_count2_after: "月", repeat_year_label: "在", select_year_day2: "的", repeat_text_year_day: "日", select_year_month: "月", repeat_radio_end: "无结束日期", repeat_text_occurences_count: "次结束", repeat_radio_end2: "重复", repeat_radio_end3: "结束于", month_for_recurring: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], day_for_recurring: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"] } }, Ce = { date: { month_full: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], month_short: ["Led", "Ún", "Bře", "Dub", "Kvě", "Čer", "Čec", "Srp", "Září", "Říj", "List", "Pro"], day_full: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"], day_short: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"] }, labels: { dhx_cal_today_button: "Dnes", day_tab: "Den", week_tab: "Týden", month_tab: "Měsíc", new_event: "Nová událost", icon_save: "Uložit", icon_cancel: "Zpět", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Smazat", confirm_closing: "", confirm_deleting: "Událost bude trvale smazána, opravdu?", section_description: "Poznámky", section_time: "Doba platnosti", confirm_recurring: "Přejete si upravit celou řadu opakovaných událostí?", section_recurring: "Opakování události", button_recurring: "Vypnuto", button_recurring_open: "Zapnuto", button_edit_series: "Edit series", button_edit_occurrence: "Upravit instance", agenda_tab: "Program", date: "Datum", description: "Poznámka", year_tab: "Rok", full_day: "Full day", week_agenda_tab: "Program", grid_tab: "Mřížka", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Denně", repeat_radio_week: "Týdně", repeat_radio_month: "Měsíčně", repeat_radio_year: "Ročně", repeat_radio_day_type: "každý", repeat_text_day_count: "Den", repeat_radio_day_type2: "pracovní dny", repeat_week: "Opakuje každých", repeat_text_week_count: "Týdnů na:", repeat_radio_month_type: "u každého", repeat_radio_month_start: "na", repeat_text_month_day: "Den každého", repeat_text_month_count: "Měsíc", repeat_text_month_count2_before: "každý", repeat_text_month_count2_after: "Měsíc", repeat_year_label: "na", select_year_day2: "v", repeat_text_year_day: "Den v", select_year_month: "", repeat_radio_end: "bez data ukončení", repeat_text_occurences_count: "Události", repeat_radio_end2: "po", repeat_radio_end3: "Konec", month_for_recurring: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], day_for_recurring: ["Neděle ", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"] } }, Te = { date: { month_full: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Uge", month_tab: "Måned", new_event: "Ny begivenhed", icon_save: "Gem", icon_cancel: "Fortryd", icon_details: "Detaljer", icon_edit: "Tilret", icon_delete: "Slet", confirm_closing: "Dine rettelser vil gå tabt.. Er dy sikker?", confirm_deleting: "Bigivenheden vil blive slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", confirm_recurring: "Vil du tilrette hele serien af gentagne begivenheder?", section_recurring: "Gentag begivenhed", button_recurring: "Frakoblet", button_recurring_open: "Tilkoblet", button_edit_series: "Rediger serien", button_edit_occurrence: "Rediger en kopi", agenda_tab: "Dagsorden", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Dagsorden", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ugenlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "På hver arbejdsdag", repeat_week: " Gentager sig hver", repeat_text_week_count: "uge på følgende dage:", repeat_radio_month_type: "Hver den", repeat_radio_month_start: "Den", repeat_text_month_day: " i hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "Den", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "", repeat_radio_end: "Ingen slutdato", repeat_text_occurences_count: "gentagelse", repeat_radio_end2: "Efter", repeat_radio_end3: "Slut", month_for_recurring: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], day_for_recurring: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, Oe = { date: { month_full: [" Januar", " Februar", " März ", " April", " Mai", " Juni", " Juli", " August", " September ", " Oktober", " November ", " Dezember"], month_short: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], day_full: ["Sonntag", "Montag", "Dienstag", " Mittwoch", " Donnerstag", "Freitag", "Samstag"], day_short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"] }, labels: { dhx_cal_today_button: "Heute", day_tab: "Tag", week_tab: "Woche", month_tab: "Monat", new_event: "neuer Eintrag", icon_save: "Speichern", icon_cancel: "Abbrechen", icon_details: "Details", icon_edit: "Ändern", icon_delete: "Löschen", confirm_closing: "", confirm_deleting: "Der Eintrag wird gelöscht", section_description: "Beschreibung", section_time: "Zeitspanne", full_day: "Ganzer Tag", confirm_recurring: "Wollen Sie alle Einträge bearbeiten oder nur diesen einzelnen Eintrag?", section_recurring: "Wiederholung", button_recurring: "Aus", button_recurring_open: "An", button_edit_series: "Bearbeiten Sie die Serie", button_edit_occurrence: "Bearbeiten Sie eine Kopie", agenda_tab: "Agenda", date: "Datum", description: "Beschreibung", year_tab: "Jahre", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Täglich", repeat_radio_week: "Wöchentlich", repeat_radio_month: "Monatlich", repeat_radio_year: "Jährlich", repeat_radio_day_type: "jeden", repeat_text_day_count: "Tag", repeat_radio_day_type2: "an jedem Arbeitstag", repeat_week: " Wiederholt sich jede", repeat_text_week_count: "Woche am:", repeat_radio_month_type: "an jedem", repeat_radio_month_start: "am", repeat_text_month_day: "Tag eines jeden", repeat_text_month_count: "Monats", repeat_text_month_count2_before: "jeden", repeat_text_month_count2_after: "Monats", repeat_year_label: "am", select_year_day2: "im", repeat_text_year_day: "Tag im", select_year_month: "", repeat_radio_end: "kein Enddatum", repeat_text_occurences_count: "Ereignissen", repeat_radio_end3: "Schluß", repeat_radio_end2: "nach", month_for_recurring: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], day_for_recurring: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"] } }, $e = { date: { month_full: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], month_short: ["ΙΑΝ", "ΦΕΒ", "ΜΑΡ", "ΑΠΡ", "ΜΑΙ", "ΙΟΥΝ", "ΙΟΥΛ", "ΑΥΓ", "ΣΕΠ", "ΟΚΤ", "ΝΟΕ", "ΔΕΚ"], day_full: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"], day_short: ["ΚΥ", "ΔΕ", "ΤΡ", "ΤΕ", "ΠΕ", "ΠΑ", "ΣΑ"] }, labels: { dhx_cal_today_button: "Σήμερα", day_tab: "Ημέρα", week_tab: "Εβδομάδα", month_tab: "Μήνας", new_event: "Νέο έργο", icon_save: "Αποθήκευση", icon_cancel: "Άκυρο", icon_details: "Λεπτομέρειες", icon_edit: "Επεξεργασία", icon_delete: "Διαγραφή", confirm_closing: "", confirm_deleting: "Το έργο θα διαγραφεί οριστικά. Θέλετε να συνεχίσετε;", section_description: "Περιγραφή", section_time: "Χρονική περίοδος", full_day: "Πλήρης Ημέρα", confirm_recurring: "Θέλετε να επεξεργασθείτε ολόκληρη την ομάδα των επαναλαμβανόμενων έργων;", section_recurring: "Επαναλαμβανόμενο έργο", button_recurring: "Ανενεργό", button_recurring_open: "Ενεργό", button_edit_series: "Επεξεργαστείτε τη σειρά", button_edit_occurrence: "Επεξεργασία ένα αντίγραφο", agenda_tab: "Ημερήσια Διάταξη", date: "Ημερομηνία", description: "Περιγραφή", year_tab: "Έτος", week_agenda_tab: "Ημερήσια Διάταξη", grid_tab: "Πλέγμα", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Ημερησίως", repeat_radio_week: "Εβδομαδιαίως", repeat_radio_month: "Μηνιαίως", repeat_radio_year: "Ετησίως", repeat_radio_day_type: "Κάθε", repeat_text_day_count: "ημέρα", repeat_radio_day_type2: "Κάθε εργάσιμη", repeat_week: " Επανάληψη κάθε", repeat_text_week_count: "εβδομάδα τις επόμενες ημέρες:", repeat_radio_month_type: "Επανάληψη", repeat_radio_month_start: "Την", repeat_text_month_day: "ημέρα κάθε", repeat_text_month_count: "μήνα", repeat_text_month_count2_before: "κάθε", repeat_text_month_count2_after: "μήνα", repeat_year_label: "Την", select_year_day2: "του", repeat_text_year_day: "ημέρα", select_year_month: "μήνα", repeat_radio_end: "Χωρίς ημερομηνία λήξεως", repeat_text_occurences_count: "επαναλήψεις", repeat_radio_end3: "Λήγει την", repeat_radio_end2: "Μετά από", month_for_recurring: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], day_for_recurring: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"] } }, He = { date: { month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, labels: { dhx_cal_today_button: "Today", day_tab: "Day", week_tab: "Week", month_tab: "Month", new_event: "New event", icon_save: "Save", icon_cancel: "Cancel", icon_details: "Details", icon_edit: "Edit", icon_delete: "Delete", confirm_closing: "", confirm_deleting: "Event will be deleted permanently, are you sure?", section_description: "Description", section_time: "Time period", full_day: "Full day", confirm_recurring: "Do you want to edit the whole set of repeated events?", section_recurring: "Repeat event", button_recurring: "Disabled", button_recurring_open: "Enabled", button_edit_series: "Edit series", button_edit_occurrence: "Edit occurrence", agenda_tab: "Agenda", date: "Date", description: "Description", year_tab: "Year", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daily", repeat_radio_week: "Weekly", repeat_radio_month: "Monthly", repeat_radio_year: "Yearly", repeat_radio_day_type: "Every", repeat_text_day_count: "day", repeat_radio_day_type2: "Every workday", repeat_week: " Repeat every", repeat_text_week_count: "week next days:", repeat_radio_month_type: "Repeat", repeat_radio_month_start: "On", repeat_text_month_day: "day every", repeat_text_month_count: "month", repeat_text_month_count2_before: "every", repeat_text_month_count2_after: "month", repeat_year_label: "On", select_year_day2: "of", repeat_text_year_day: "day", select_year_month: "month", repeat_radio_end: "No end date", repeat_text_occurences_count: "occurrences", repeat_radio_end2: "After", repeat_radio_end3: "End by", month_for_recurring: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], day_for_recurring: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] } }, Le = { date: { month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] }, labels: { dhx_cal_today_button: "Hoy", day_tab: "Día", week_tab: "Semana", month_tab: "Mes", new_event: "Nuevo evento", icon_save: "Guardar", icon_cancel: "Cancelar", icon_details: "Detalles", icon_edit: "Editar", icon_delete: "Eliminar", confirm_closing: "", confirm_deleting: "El evento se borrará definitivamente, ¿continuar?", section_description: "Descripción", section_time: "Período", full_day: "Todo el día", confirm_recurring: "¿Desea modificar el conjunto de eventos repetidos?", section_recurring: "Repita el evento", button_recurring: "Impedido", button_recurring_open: "Permitido", button_edit_series: "Editar la serie", button_edit_occurrence: "Editar este evento", agenda_tab: "Día", date: "Fecha", description: "Descripción", year_tab: "Año", week_agenda_tab: "Día", grid_tab: "Reja", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diariamente", repeat_radio_week: "Semanalmente", repeat_radio_month: "Mensualmente", repeat_radio_year: "Anualmente", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia", repeat_radio_day_type2: "Cada jornada de trabajo", repeat_week: " Repetir cada", repeat_text_week_count: "semana:", repeat_radio_month_type: "Repita", repeat_radio_month_start: "El", repeat_text_month_day: "dia cada ", repeat_text_month_count: "mes", repeat_text_month_count2_before: "cada", repeat_text_month_count2_after: "mes", repeat_year_label: "El", select_year_day2: "del", repeat_text_year_day: "dia", select_year_month: "mes", repeat_radio_end: "Sin fecha de finalización", repeat_text_occurences_count: "ocurrencias", repeat_radio_end3: "Fin", repeat_radio_end2: "Después de", month_for_recurring: ["Enero", "Febrero", "Маrzo", "Аbril", "Mayo", "Junio", "Julio", "Аgosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"], day_for_recurring: ["Domingo", "Lunes", "Martes", "Miércoles", "Jeuves", "Viernes", "Sabado"] } }, ze = { date: { month_full: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], month_short: ["Tam", "Hel", "Maa", "Huh", "Tou", "Kes", "Hei", "Elo", "Syy", "Lok", "Mar", "Jou"], day_full: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"], day_short: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"] }, labels: { dhx_cal_today_button: "Tänään", day_tab: "Päivä", week_tab: "Viikko", month_tab: "Kuukausi", new_event: "Uusi tapahtuma", icon_save: "Tallenna", icon_cancel: "Peru", icon_details: "Tiedot", icon_edit: "Muokkaa", icon_delete: "Poista", confirm_closing: "", confirm_deleting: "Haluatko varmasti poistaa tapahtuman?", section_description: "Kuvaus", section_time: "Aikajakso", full_day: "Koko päivä", confirm_recurring: "Haluatko varmasti muokata toistuvan tapahtuman kaikkia jaksoja?", section_recurring: "Toista tapahtuma", button_recurring: "Ei k&auml;yt&ouml;ss&auml;", button_recurring_open: "K&auml;yt&ouml;ss&auml;", button_edit_series: "Muokkaa sarja", button_edit_occurrence: "Muokkaa kopio", agenda_tab: "Esityslista", date: "Päivämäärä", description: "Kuvaus", year_tab: "Vuoden", week_agenda_tab: "Esityslista", grid_tab: "Ritilä", drag_to_create: "Luo uusi vetämällä", drag_to_move: "Siirrä vetämällä", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "P&auml;ivitt&auml;in", repeat_radio_week: "Viikoittain", repeat_radio_month: "Kuukausittain", repeat_radio_year: "Vuosittain", repeat_radio_day_type: "Joka", repeat_text_day_count: "p&auml;iv&auml;", repeat_radio_day_type2: "Joka arkip&auml;iv&auml;", repeat_week: "Toista joka", repeat_text_week_count: "viikko n&auml;in&auml; p&auml;ivin&auml;:", repeat_radio_month_type: "Toista", repeat_radio_month_start: "", repeat_text_month_day: "p&auml;iv&auml;n&auml; joka", repeat_text_month_count: "kuukausi", repeat_text_month_count2_before: "joka", repeat_text_month_count2_after: "kuukausi", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "p&auml;iv&auml;", select_year_month: "kuukausi", repeat_radio_end: "Ei loppumisaikaa", repeat_text_occurences_count: "Toiston j&auml;lkeen", repeat_radio_end3: "Loppuu", repeat_radio_end2: "", month_for_recurring: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], day_for_recurring: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"] } }, je = { date: { month_full: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], month_short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"], day_full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"], day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] }, labels: { dhx_cal_today_button: "Aujourd'hui", day_tab: "Jour", week_tab: "Semaine", month_tab: "Mois", new_event: "Nouvel événement", icon_save: "Enregistrer", icon_cancel: "Annuler", icon_details: "Détails", icon_edit: "Modifier", icon_delete: "Effacer", confirm_closing: "", confirm_deleting: "L'événement sera effacé sans appel, êtes-vous sûr ?", section_description: "Description", section_time: "Période", full_day: "Journée complète", confirm_recurring: "Voulez-vous éditer toute une série d'évènements répétés?", section_recurring: "Périodicité", button_recurring: "Désactivé", button_recurring_open: "Activé", button_edit_series: "Modifier la série", button_edit_occurrence: "Modifier une copie", agenda_tab: "Jour", date: "Date", description: "Description", year_tab: "Année", week_agenda_tab: "Jour", grid_tab: "Grille", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Quotidienne", repeat_radio_week: "Hebdomadaire", repeat_radio_month: "Mensuelle", repeat_radio_year: "Annuelle", repeat_radio_day_type: "Chaque", repeat_text_day_count: "jour", repeat_radio_day_type2: "Chaque journée de travail", repeat_week: " Répéter toutes les", repeat_text_week_count: "semaine:", repeat_radio_month_type: "Répéter", repeat_radio_month_start: "Le", repeat_text_month_day: "jour chaque", repeat_text_month_count: "mois", repeat_text_month_count2_before: "chaque", repeat_text_month_count2_after: "mois", repeat_year_label: "Le", select_year_day2: "du", repeat_text_year_day: "jour", select_year_month: "mois", repeat_radio_end: "Pas de date d&quot;achèvement", repeat_text_occurences_count: "occurrences", repeat_radio_end3: "Fin", repeat_radio_end2: "Après", month_for_recurring: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], day_for_recurring: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] } }, Pe = { date: { month_full: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], month_short: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"], day_full: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"], day_short: ["א", "ב", "ג", "ד", "ה", "ו", "ש"] }, labels: { dhx_cal_today_button: "היום", day_tab: "יום", week_tab: "שבוע", month_tab: "חודש", new_event: "ארוע חדש", icon_save: "שמור", icon_cancel: "בטל", icon_details: "פרטים", icon_edit: "ערוך", icon_delete: "מחק", confirm_closing: "", confirm_deleting: "ארוע ימחק סופית.להמשיך?", section_description: "תיאור", section_time: "תקופה", confirm_recurring: "האם ברצונך לשנות כל סדרת ארועים מתמשכים?", section_recurring: "להעתיק ארוע", button_recurring: "לא פעיל", button_recurring_open: "פעיל", full_day: "יום שלם", button_edit_series: "ערוך את הסדרה", button_edit_occurrence: "עריכת עותק", agenda_tab: "סדר יום", date: "תאריך", description: "תיאור", year_tab: "לשנה", week_agenda_tab: "סדר יום", grid_tab: "סורג", drag_to_create: "Drag to create", drag_to_move: "גרור כדי להזיז", message_ok: "OK", message_cancel: "בטל", next: "הבא", prev: "הקודם", year: "שנה", month: "חודש", day: "יום", hour: "שעה", minute: "דקה", repeat_radio_day: "יומי", repeat_radio_week: "שבועי", repeat_radio_month: "חודשי", repeat_radio_year: "שנתי", repeat_radio_day_type: "חזור כל", repeat_text_day_count: "ימים", repeat_radio_day_type2: "חזור כל יום עבודה", repeat_week: " חזור כל", repeat_text_week_count: "שבוע לפי ימים:", repeat_radio_month_type: "חזור כל", repeat_radio_month_start: "כל", repeat_text_month_day: "ימים כל", repeat_text_month_count: "חודשים", repeat_text_month_count2_before: "חזור כל", repeat_text_month_count2_after: "חודש", repeat_year_label: "כל", select_year_day2: "בחודש", repeat_text_year_day: "ימים", select_year_month: "חודש", repeat_radio_end: "לעולם לא מסתיים", repeat_text_occurences_count: "אירועים", repeat_radio_end3: "מסתיים ב", repeat_radio_end2: "אחרי", month_for_recurring: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], day_for_recurring: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"] } }, Ve = { date: { month_full: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], month_short: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Vasárnap", "Hétfõ", "Kedd", "Szerda", "Csütörtök", "Péntek", "szombat"], day_short: ["Va", "Hé", "Ke", "Sze", "Csü", "Pé", "Szo"] }, labels: { dhx_cal_today_button: "Ma", day_tab: "Nap", week_tab: "Hét", month_tab: "Hónap", new_event: "Új esemény", icon_save: "Mentés", icon_cancel: "Mégse", icon_details: "Részletek", icon_edit: "Szerkesztés", icon_delete: "Törlés", confirm_closing: "", confirm_deleting: "Az esemény törölve lesz, biztosan folytatja?", section_description: "Leírás", section_time: "Idõszak", full_day: "Egesz napos", confirm_recurring: "Biztosan szerkeszteni akarod az összes ismétlõdõ esemény beállítását?", section_recurring: "Esemény ismétlése", button_recurring: "Tiltás", button_recurring_open: "Engedélyezés", button_edit_series: "Edit series", button_edit_occurrence: "Szerkesztés bíróság", agenda_tab: "Napirend", date: "Dátum", description: "Leírás", year_tab: "Év", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute" } }, Ie = { date: { month_full: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"], day_full: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], day_short: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] }, labels: { dhx_cal_today_button: "Hari Ini", day_tab: "Hari", week_tab: "Minggu", month_tab: "Bulan", new_event: "Acara Baru", icon_save: "Simpan", icon_cancel: "Batal", icon_details: "Detail", icon_edit: "Edit", icon_delete: "Hapus", confirm_closing: "", confirm_deleting: "Acara akan dihapus", section_description: "Keterangan", section_time: "Periode", full_day: "Hari penuh", confirm_recurring: "Apakah acara ini akan berulang?", section_recurring: "Acara Rutin", button_recurring: "Tidak Difungsikan", button_recurring_open: "Difungsikan", button_edit_series: "Mengedit seri", button_edit_occurrence: "Mengedit salinan", agenda_tab: "Agenda", date: "Tanggal", description: "Keterangan", year_tab: "Tahun", week_agenda_tab: "Agenda", grid_tab: "Tabel", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute" } }, Be = { date: { month_full: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], month_short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"], day_full: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"], day_short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"] }, labels: { dhx_cal_today_button: "Oggi", day_tab: "Giorno", week_tab: "Settimana", month_tab: "Mese", new_event: "Nuovo evento", icon_save: "Salva", icon_cancel: "Chiudi", icon_details: "Dettagli", icon_edit: "Modifica", icon_delete: "Elimina", confirm_closing: "", confirm_deleting: "L'evento sarà eliminato, siete sicuri?", section_description: "Descrizione", section_time: "Periodo di tempo", full_day: "Intera giornata", confirm_recurring: "Vuoi modificare l'intera serie di eventi?", section_recurring: "Ripetere l'evento", button_recurring: "Disattivato", button_recurring_open: "Attivato", button_edit_series: "Modificare la serie", button_edit_occurrence: "Modificare una copia", agenda_tab: "Agenda", date: "Data", description: "Descrizione", year_tab: "Anno", week_agenda_tab: "Agenda", grid_tab: "Griglia", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Quotidiano", repeat_radio_week: "Settimanale", repeat_radio_month: "Mensile", repeat_radio_year: "Annuale", repeat_radio_day_type: "Ogni", repeat_text_day_count: "giorno", repeat_radio_day_type2: "Ogni giornata lavorativa", repeat_week: " Ripetere ogni", repeat_text_week_count: "settimana:", repeat_radio_month_type: "Ripetere", repeat_radio_month_start: "Il", repeat_text_month_day: "giorno ogni", repeat_text_month_count: "mese", repeat_text_month_count2_before: "ogni", repeat_text_month_count2_after: "mese", repeat_year_label: "Il", select_year_day2: "del", repeat_text_year_day: "giorno", select_year_month: "mese", repeat_radio_end: "Senza data finale", repeat_text_occurences_count: "occorenze", repeat_radio_end3: "Fine", repeat_radio_end2: "Dopo", month_for_recurring: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Jiugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], day_for_recurring: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Jovedì", "Venerdì", "Sabato"] } }, Re = { date: { month_full: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], day_short: ["日", "月", "火", "水", "木", "金", "土"] }, labels: { dhx_cal_today_button: "今日", day_tab: "日", week_tab: "週", month_tab: "月", new_event: "新イベント", icon_save: "保存", icon_cancel: "キャンセル", icon_details: "詳細", icon_edit: "編集", icon_delete: "削除", confirm_closing: "", confirm_deleting: "イベント完全に削除されます、宜しいですか？", section_description: "デスクリプション", section_time: "期間", confirm_recurring: "繰り返されているイベントを全て編集しますか？", section_recurring: "イベントを繰り返す", button_recurring: "無効", button_recurring_open: "有効", full_day: "終日", button_edit_series: "シリーズを編集します", button_edit_occurrence: "コピーを編集", agenda_tab: "議題は", date: "日付", description: "説明", year_tab: "今年", week_agenda_tab: "議題は", grid_tab: "グリッド", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute" } };
class qe {
  constructor(h) {
    this._locales = {};
    for (const a in h)
      this._locales[a] = h[a];
  }
  addLocale(h, a) {
    this._locales[h] = a;
  }
  getLocale(h) {
    return this._locales[h];
  }
}
const Fe = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Mon", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "I dag", day_tab: "Dag", week_tab: "Uke", month_tab: "Måned", new_event: "Ny hendelse", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Rediger", icon_delete: "Slett", confirm_closing: "", confirm_deleting: "Hendelsen vil bli slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", confirm_recurring: "Vil du forandre hele dette settet av repeterende hendelser?", section_recurring: "Repeter hendelsen", button_recurring: "Av", button_recurring_open: "På", button_edit_series: "Rediger serien", button_edit_occurrence: "Redigere en kopi", agenda_tab: "Agenda", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ukentlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "Alle hverdager", repeat_week: " Gjentas hver", repeat_text_week_count: "uke på:", repeat_radio_month_type: "På hver", repeat_radio_month_start: "På", repeat_text_month_day: "dag hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "på", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "", repeat_radio_end: "Ingen sluttdato", repeat_text_occurences_count: "forekomst", repeat_radio_end3: "Stop den", repeat_radio_end2: "Etter", month_for_recurring: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Sondag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, Je = { date: { month_full: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"], day_short: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"] }, labels: { dhx_cal_today_button: "Vandaag", day_tab: "Dag", week_tab: "Week", month_tab: "Maand", new_event: "Nieuw item", icon_save: "Opslaan", icon_cancel: "Annuleren", icon_details: "Details", icon_edit: "Bewerken", icon_delete: "Verwijderen", confirm_closing: "", confirm_deleting: "Item zal permanent worden verwijderd, doorgaan?", section_description: "Beschrijving", section_time: "Tijd periode", full_day: "Hele dag", confirm_recurring: "Wilt u alle terugkerende items bijwerken?", section_recurring: "Item herhalen", button_recurring: "Uit", button_recurring_open: "Aan", button_edit_series: "Bewerk de serie", button_edit_occurrence: "Bewerk een kopie", agenda_tab: "Agenda", date: "Datum", description: "Omschrijving", year_tab: "Jaar", week_agenda_tab: "Agenda", grid_tab: "Tabel", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dagelijks", repeat_radio_week: "Wekelijks", repeat_radio_month: "Maandelijks", repeat_radio_year: "Jaarlijks", repeat_radio_day_type: "Elke", repeat_text_day_count: "dag(en)", repeat_radio_day_type2: "Elke werkdag", repeat_week: " Herhaal elke", repeat_text_week_count: "week op de volgende dagen:", repeat_radio_month_type: "Herhaal", repeat_radio_month_start: "Op", repeat_text_month_day: "dag iedere", repeat_text_month_count: "maanden", repeat_text_month_count2_before: "iedere", repeat_text_month_count2_after: "maanden", repeat_year_label: "Op", select_year_day2: "van", repeat_text_year_day: "dag", select_year_month: "maand", repeat_radio_end: "Geen eind datum", repeat_text_occurences_count: "keren", repeat_radio_end3: "Eindigd per", repeat_radio_end2: "Na", month_for_recurring: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], day_for_recurring: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"] } }, Ue = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Uke", month_tab: "Måned", new_event: "Ny", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Endre", icon_delete: "Slett", confirm_closing: "Endringer blir ikke lagret, er du sikker?", confirm_deleting: "Oppføringen vil bli slettet, er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", full_day: "Full dag", confirm_recurring: "Vil du endre hele settet med repeterende oppføringer?", section_recurring: "Repeterende oppføring", button_recurring: "Ikke aktiv", button_recurring_open: "Aktiv", button_edit_series: "Rediger serien", button_edit_occurrence: "Redigere en kopi", agenda_tab: "Agenda", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute" } }, Ye = { date: { month_full: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"], month_short: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"], day_full: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"], day_short: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"] }, labels: { dhx_cal_today_button: "Dziś", day_tab: "Dzień", week_tab: "Tydzień", month_tab: "Miesiąc", new_event: "Nowe zdarzenie", icon_save: "Zapisz", icon_cancel: "Anuluj", icon_details: "Szczegóły", icon_edit: "Edytuj", icon_delete: "Usuń", confirm_closing: "", confirm_deleting: "Zdarzenie zostanie usunięte na zawsze, kontynuować?", section_description: "Opis", section_time: "Okres czasu", full_day: "Cały dzień", confirm_recurring: "Czy chcesz edytować cały zbiór powtarzających się zdarzeń?", section_recurring: "Powtórz zdarzenie", button_recurring: "Nieaktywne", button_recurring_open: "Aktywne", button_edit_series: "Edytuj serię", button_edit_occurrence: "Edytuj kopię", agenda_tab: "Agenda", date: "Data", description: "Opis", year_tab: "Rok", week_agenda_tab: "Agenda", grid_tab: "Tabela", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Codziennie", repeat_radio_week: "Co tydzie", repeat_radio_month: "Co miesic", repeat_radio_year: "Co rok", repeat_radio_day_type: "Kadego", repeat_text_day_count: "dnia", repeat_radio_day_type2: "Kadego dnia roboczego", repeat_week: " Powtarzaj kadego", repeat_text_week_count: "tygodnia w dni:", repeat_radio_month_type: "Powtrz", repeat_radio_month_start: "W", repeat_text_month_day: "dnia kadego", repeat_text_month_count: "miesica", repeat_text_month_count2_before: "kadego", repeat_text_month_count2_after: "miesica", repeat_year_label: "W", select_year_day2: "miesica", repeat_text_year_day: "dnia miesica", select_year_month: "", repeat_radio_end: "Bez daty kocowej", repeat_text_occurences_count: "wystpieniu/ach", repeat_radio_end3: "Zakocz w", repeat_radio_end2: "Po", month_for_recurring: ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Wrzenia", "Padziernka", "Listopada", "Grudnia"], day_for_recurring: ["Niedziela", "Poniedziaek", "Wtorek", "roda", "Czwartek", "Pitek", "Sobota"] } }, We = { date: { month_full: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], month_short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], day_full: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"], day_short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] }, labels: { dhx_cal_today_button: "Hoje", day_tab: "Dia", week_tab: "Semana", month_tab: "Mês", new_event: "Novo evento", icon_save: "Salvar", icon_cancel: "Cancelar", icon_details: "Detalhes", icon_edit: "Editar", icon_delete: "Deletar", confirm_closing: "", confirm_deleting: "Tem certeza que deseja excluir?", section_description: "Descrição", section_time: "Período de tempo", full_day: "Dia inteiro", confirm_recurring: "Deseja editar todos esses eventos repetidos?", section_recurring: "Repetir evento", button_recurring: "Desabilitar", button_recurring_open: "Habilitar", button_edit_series: "Editar a série", button_edit_occurrence: "Editar uma cópia", agenda_tab: "Dia", date: "Data", description: "Descrição", year_tab: "Ano", week_agenda_tab: "Dia", grid_tab: "Grade", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diário", repeat_radio_week: "Semanal", repeat_radio_month: "Mensal", repeat_radio_year: "Anual", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia(s)", repeat_radio_day_type2: "Cada trabalho diário", repeat_week: " Repita cada", repeat_text_week_count: "semana:", repeat_radio_month_type: "Repetir", repeat_radio_month_start: "Em", repeat_text_month_day: "todo dia", repeat_text_month_count: "mês", repeat_text_month_count2_before: "todo", repeat_text_month_count2_after: "mês", repeat_year_label: "Em", select_year_day2: "of", repeat_text_year_day: "dia", select_year_month: "mês", repeat_radio_end: "Sem data final", repeat_text_occurences_count: "ocorrências", repeat_radio_end3: "Fim", repeat_radio_end2: "Depois", month_for_recurring: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], day_for_recurring: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] } }, Ke = { date: { month_full: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "November", "December"], month_short: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"], day_short: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"] }, labels: { dhx_cal_today_button: "Astazi", day_tab: "Zi", week_tab: "Saptamana", month_tab: "Luna", new_event: "Eveniment nou", icon_save: "Salveaza", icon_cancel: "Anuleaza", icon_details: "Detalii", icon_edit: "Editeaza", icon_delete: "Sterge", confirm_closing: "Schimbarile nu vor fi salvate, esti sigur?", confirm_deleting: "Evenimentul va fi sters permanent, esti sigur?", section_description: "Descriere", section_time: "Interval", full_day: "Toata ziua", confirm_recurring: "Vrei sa editezi toata seria de evenimente repetate?", section_recurring: "Repetare", button_recurring: "Dezactivata", button_recurring_open: "Activata", button_edit_series: "Editeaza serie", button_edit_occurrence: "Editeaza doar intrare", agenda_tab: "Agenda", date: "Data", description: "Descriere", year_tab: "An", week_agenda_tab: "Agenda", grid_tab: "Lista", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Zilnic", repeat_radio_week: "Saptamanal", repeat_radio_month: "Lunar", repeat_radio_year: "Anual", repeat_radio_day_type: "La fiecare", repeat_text_day_count: "zi(le)", repeat_radio_day_type2: "Fiecare zi lucratoare", repeat_week: " Repeta la fiecare", repeat_text_week_count: "saptamana in urmatoarele zile:", repeat_radio_month_type: "Repeta in", repeat_radio_month_start: "In a", repeat_text_month_day: "zi la fiecare", repeat_text_month_count: "luni", repeat_text_month_count2_before: "la fiecare", repeat_text_month_count2_after: "luni", repeat_year_label: "In", select_year_day2: "a lunii", repeat_text_year_day: "zi a lunii", select_year_month: "", repeat_radio_end: "Fara data de sfarsit", repeat_text_occurences_count: "evenimente", repeat_radio_end3: "La data", repeat_radio_end2: "Dupa", month_for_recurring: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"], day_for_recurring: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"] } }, Ge = { date: { month_full: ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"], month_short: ["Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек"], day_full: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"], day_short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] }, labels: { dhx_cal_today_button: "Сегодня", day_tab: "День", week_tab: "Неделя", month_tab: "Месяц", new_event: "Новое событие", icon_save: "Сохранить", icon_cancel: "Отменить", icon_details: "Детали", icon_edit: "Изменить", icon_delete: "Удалить", confirm_closing: "", confirm_deleting: "Событие будет удалено безвозвратно, продолжить?", section_description: "Описание", section_time: "Период времени", full_day: "Весь день", confirm_recurring: "Вы хотите изменить всю серию повторяющихся событий?", section_recurring: "Повторение", button_recurring: "Отключено", button_recurring_open: "Включено", button_edit_series: "Редактировать серию", button_edit_occurrence: "Редактировать экземпляр", agenda_tab: "Список", date: "Дата", description: "Описание", year_tab: "Год", week_agenda_tab: "Список", grid_tab: "Таблица", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "День", repeat_radio_week: "Неделя", repeat_radio_month: "Месяц", repeat_radio_year: "Год", repeat_radio_day_type: "Каждый", repeat_text_day_count: "день", repeat_radio_day_type2: "Каждый рабочий день", repeat_week: " Повторять каждую", repeat_text_week_count: "неделю , в:", repeat_radio_month_type: "Повторять", repeat_radio_month_start: "", repeat_text_month_day: " числа каждый ", repeat_text_month_count: "месяц", repeat_text_month_count2_before: "каждый ", repeat_text_month_count2_after: "месяц", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "день", select_year_month: "", repeat_radio_end: "Без даты окончания", repeat_text_occurences_count: "повторений", repeat_radio_end3: "До ", repeat_radio_end2: "", month_for_recurring: ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"], day_for_recurring: ["Воскресенье", "Понедельник", "Вторник", "Среду", "Четверг", "Пятницу", "Субботу"] } }, Xe = { date: { month_full: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"], day_short: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"] }, labels: { dhx_cal_today_button: "Danes", day_tab: "Dan", week_tab: "Teden", month_tab: "Mesec", new_event: "Nov dogodek", icon_save: "Shrani", icon_cancel: "Prekliči", icon_details: "Podrobnosti", icon_edit: "Uredi", icon_delete: "Izbriši", confirm_closing: "", confirm_deleting: "Dogodek bo izbrisan. Želite nadaljevati?", section_description: "Opis", section_time: "Časovni okvir", full_day: "Ves dan", confirm_recurring: "Želite urediti celoten set ponavljajočih dogodkov?", section_recurring: "Ponovi dogodek", button_recurring: "Onemogočeno", button_recurring_open: "Omogočeno", button_edit_series: "Edit series", button_edit_occurrence: "Edit occurrence", agenda_tab: "Zadeva", date: "Datum", description: "Opis", year_tab: "Leto", week_agenda_tab: "Zadeva", grid_tab: "Miza", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute" } }, Ze = { date: { month_full: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sept", "Okt", "Nov", "Dec"], day_full: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"], day_short: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"] }, labels: { dhx_cal_today_button: "Dnes", day_tab: "Deň", week_tab: "Týždeň", month_tab: "Mesiac", new_event: "Nová udalosť", icon_save: "Uložiť", icon_cancel: "Späť", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Zmazať", confirm_closing: "Vaše zmeny nebudú uložené. Skutočne?", confirm_deleting: "Udalosť bude natrvalo vymazaná. Skutočne?", section_description: "Poznámky", section_time: "Doba platnosti", confirm_recurring: "Prajete si upraviť celú radu opakovaných udalostí?", section_recurring: "Opakovanie udalosti", button_recurring: "Vypnuté", button_recurring_open: "Zapnuté", button_edit_series: "Upraviť opakovania", button_edit_occurrence: "Upraviť inštancie", agenda_tab: "Program", date: "Dátum", description: "Poznámka", year_tab: "Rok", full_day: "Celý deň", week_agenda_tab: "Program", grid_tab: "Mriežka", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Denne", repeat_radio_week: "Týždenne", repeat_radio_month: "Mesaène", repeat_radio_year: "Roène", repeat_radio_day_type: "Každý", repeat_text_day_count: "deò", repeat_radio_day_type2: "Každý prac. deò", repeat_week: "Opakova každý", repeat_text_week_count: "týždeò v dòoch:", repeat_radio_month_type: "Opakova", repeat_radio_month_start: "On", repeat_text_month_day: "deò každý", repeat_text_month_count: "mesiac", repeat_text_month_count2_before: "každý", repeat_text_month_count2_after: "mesiac", repeat_year_label: "On", select_year_day2: "poèas", repeat_text_year_day: "deò", select_year_month: "mesiac", repeat_radio_end: "Bez dátumu ukonèenia", repeat_text_occurences_count: "udalostiach", repeat_radio_end3: "Ukonèi", repeat_radio_end2: "Po", month_for_recurring: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], day_for_recurring: ["Nede¾a", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"] } }, Qe = { date: { month_full: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"], day_short: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Vecka", month_tab: "Månad", new_event: "Ny händelse", icon_save: "Spara", icon_cancel: "Ångra", icon_details: "Detaljer", icon_edit: "Ändra", icon_delete: "Ta bort", confirm_closing: "", confirm_deleting: "Är du säker på att du vill ta bort händelsen permanent?", section_description: "Beskrivning", section_time: "Tid", full_day: "Hela dagen", confirm_recurring: "Vill du redigera hela serien med repeterande händelser?", section_recurring: "Upprepa händelse", button_recurring: "Inaktiverat", button_recurring_open: "Aktiverat", button_edit_series: "Redigera serien", button_edit_occurrence: "Redigera en kopia", agenda_tab: "Dagordning", date: "Datum", description: "Beskrivning", year_tab: "År", week_agenda_tab: "Dagordning", grid_tab: "Galler", drag_to_create: "Dra för att skapa ny", drag_to_move: "Dra för att flytta", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dagligen", repeat_radio_week: "Veckovis", repeat_radio_month: "Månadsvis", repeat_radio_year: "Årligen", repeat_radio_day_type: "Var", repeat_text_day_count: "dag", repeat_radio_day_type2: "Varje arbetsdag", repeat_week: " Upprepa var", repeat_text_week_count: "vecka dessa dagar:", repeat_radio_month_type: "Upprepa", repeat_radio_month_start: "Den", repeat_text_month_day: "dagen var", repeat_text_month_count: "månad", repeat_text_month_count2_before: "var", repeat_text_month_count2_after: "månad", repeat_year_label: "Den", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "månad", repeat_radio_end: "Inget slutdatum", repeat_text_occurences_count: "upprepningar", repeat_radio_end3: "Sluta efter", repeat_radio_end2: "Efter", month_for_recurring: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], day_for_recurring: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"] } }, et = { date: { month_full: ["Ocak", "Þubat", "Mart", "Nisan", "Mayýs", "Haziran", "Temmuz", "Aðustos", "Eylül", "Ekim", "Kasým", "Aralýk"], month_short: ["Oca", "Þub", "Mar", "Nis", "May", "Haz", "Tem", "Aðu", "Eyl", "Eki", "Kas", "Ara"], day_full: ["Pazar", "Pazartes,", "Salý", "Çarþamba", "Perþembe", "Cuma", "Cumartesi"], day_short: ["Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"] }, labels: { dhx_cal_today_button: "Bugün", day_tab: "Gün", week_tab: "Hafta", month_tab: "Ay", new_event: "Uygun", icon_save: "Kaydet", icon_cancel: "Ýptal", icon_details: "Detaylar", icon_edit: "Düzenle", icon_delete: "Sil", confirm_closing: "", confirm_deleting: "Etkinlik silinecek, devam?", section_description: "Açýklama", section_time: "Zaman aralýðý", full_day: "Tam gün", confirm_recurring: "Tüm tekrar eden etkinlikler silinecek, devam?", section_recurring: "Etkinliði tekrarla", button_recurring: "Pasif", button_recurring_open: "Aktif", button_edit_series: "Dizi düzenleme", button_edit_occurrence: "Bir kopyasını düzenleyin", agenda_tab: "Ajanda", date: "Tarih", description: "Açýklama", year_tab: "Yýl", week_agenda_tab: "Ajanda", grid_tab: "Izgara", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute" } }, tt = { date: { month_full: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"], month_short: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], day_full: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"], day_short: ["Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"] }, labels: { dhx_cal_today_button: "Сьогодні", day_tab: "День", week_tab: "Тиждень", month_tab: "Місяць", new_event: "Нова подія", icon_save: "Зберегти", icon_cancel: "Відміна", icon_details: "Деталі", icon_edit: "Редагувати", icon_delete: "Вилучити", confirm_closing: "", confirm_deleting: "Подія вилучиться назавжди. Ви впевнені?", section_description: "Опис", section_time: "Часовий проміжок", full_day: "Весь день", confirm_recurring: "Хочете редагувати весь перелік повторюваних подій?", section_recurring: "Повторювана подія", button_recurring: "Відключено", button_recurring_open: "Включено", button_edit_series: "Редагувати серію", button_edit_occurrence: "Редагувати примірник", agenda_tab: "Перелік", date: "Дата", description: "Опис", year_tab: "Рік", week_agenda_tab: "Перелік", grid_tab: "Таблиця", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "День", repeat_radio_week: "Тиждень", repeat_radio_month: "Місяць", repeat_radio_year: "Рік", repeat_radio_day_type: "Кожний", repeat_text_day_count: "день", repeat_radio_day_type2: "Кожний робочий день", repeat_week: " Повторювати кожен", repeat_text_week_count: "тиждень , по:", repeat_radio_month_type: "Повторювати", repeat_radio_month_start: "", repeat_text_month_day: " числа кожний ", repeat_text_month_count: "місяць", repeat_text_month_count2_before: "кожен ", repeat_text_month_count2_after: "місяць", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "день", select_year_month: "", repeat_radio_end: "Без дати закінчення", repeat_text_occurences_count: "повторень", repeat_radio_end3: "До ", repeat_radio_end2: "", month_for_recurring: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"], day_for_recurring: ["Неділям", "Понеділкам", "Вівторкам", "Середам", "Четвергам", "П'ятницям", "Суботам"] } };
class at {
  constructor(h, a, r = {}) {
    this.state = { date: /* @__PURE__ */ new Date(), modes: ["days", "months", "years"], currentRange: [], eventDates: [], currentModeIndex: 0, ...r }, this.container = null, this.element = null, this.onStateChangeHandlers = [], this.scheduler = h, this._domEvents = h._createDomEventScope(), this.state = this.getState(), Q(this), a && (this.container = a, this.render(this.container)), this.onStateChange((d, i) => {
      this.callEvent("onStateChange", [i, d]);
    });
  }
  getState() {
    return { ...this.state, mode: this.state.modes[this.state.currentModeIndex] };
  }
  setState(h) {
    const a = { ...this.state };
    h.mode && (h.currentModeIndex = this.state.modes.indexOf(h.mode)), this.state = { ...this.state, ...h }, this._notifyStateChange(a, this.state), this.container && this.render(this.container);
  }
  onStateChange(h) {
    return this.onStateChangeHandlers.push(h), () => {
      const a = this.onStateChangeHandlers.indexOf(h);
      a !== -1 && this.onStateChangeHandlers.splice(a, 1);
    };
  }
  _notifyStateChange(h, a) {
    this.onStateChangeHandlers.forEach((r) => r(h, a));
  }
  _adjustDate(h) {
    const { mode: a, date: r } = this.getState(), d = new Date(r);
    a === "days" ? d.setMonth(r.getMonth() + h) : a === "months" ? d.setFullYear(r.getFullYear() + h) : d.setFullYear(r.getFullYear() + 10 * h), this.setState({ date: d });
  }
  _toggleMode() {
    const h = (this.state.currentModeIndex + 1) % this.state.modes.length;
    this.setState({ currentModeIndex: h });
  }
  _renderCalendarHeader(h) {
    const { mode: a, date: r } = this.getState(), d = document.createElement("div");
    d.classList.add("dhx_cal_datepicker_header");
    const i = document.createElement("button");
    i.classList.add("dhx_cal_datepicker_arrow", "scheduler_icon", "arrow_left"), d.appendChild(i);
    const _ = document.createElement("div");
    if (_.classList.add("dhx_cal_datepicker_title"), a === "days")
      _.innerText = r.toLocaleString("default", { month: "long" }) + " " + r.getFullYear();
    else if (a === "months")
      _.innerText = r.getFullYear();
    else {
      const t = 10 * Math.floor(r.getFullYear() / 10);
      _.innerText = `${t} - ${t + 9}`;
    }
    this._domEvents.attach(_, "click", this._toggleMode.bind(this)), d.appendChild(_);
    const o = document.createElement("button");
    o.classList.add("dhx_cal_datepicker_arrow", "scheduler_icon", "arrow_right"), d.appendChild(o), h.appendChild(d), this._domEvents.attach(i, "click", this._adjustDate.bind(this, -1)), this._domEvents.attach(o, "click", this._adjustDate.bind(this, 1));
  }
  render(h) {
    this._domEvents.detachAll(), this.container = h || this.container, this.container.innerHTML = "", this.element || (this.element = document.createElement("div"), this.element.classList.add("dhx_cal_datepicker")), this.element.innerHTML = "", this.container.appendChild(this.element), this._renderCalendarHeader(this.element);
    const a = document.createElement("div");
    a.classList.add("dhx_cal_datepicker_data"), this.element.appendChild(a);
    const { mode: r } = this.getState();
    r === "days" ? this._renderDayGrid(a) : r === "months" ? this._renderMonthGrid(a) : this._renderYearGrid(a);
  }
  _renderDayGridHeader(h) {
    const { date: a } = this.getState(), r = this.scheduler;
    let d = r.date.week_start(new Date(a));
    const i = r.date.add(r.date.week_start(new Date(a)), 1, "week");
    h.classList.add("dhx_cal_datepicker_days");
    const _ = r.date.date_to_str("%D");
    for (; d.valueOf() < i.valueOf(); ) {
      const o = _(d), t = document.createElement("div");
      t.setAttribute("data-day", d.getDay()), t.classList.add("dhx_cal_datepicker_dayname"), t.innerText = o, h.appendChild(t), d = r.date.add(d, 1, "day");
    }
  }
  _weeksBetween(h, a) {
    const r = this.scheduler;
    let d = 0, i = new Date(h);
    for (; i.valueOf() < a.valueOf(); )
      d += 1, i = r.date.week_start(r.date.add(i, 1, "week"));
    return d;
  }
  _renderDayGrid(h) {
    const { date: a, currentRange: r, eventDates: d, minWeeks: i } = this.getState();
    let _ = r[0], o = r[1];
    const t = d.reduce((y, w) => (y[this.scheduler.date.day_start(new Date(w)).valueOf()] = !0, y), {}), n = document.createElement("div");
    this._renderDayGridHeader(n), h.appendChild(n);
    const s = this.scheduler, c = s.date.week_start(s.date.month_start(new Date(a))), u = s.date.month_start(new Date(a)), v = s.date.add(s.date.month_start(new Date(a)), 1, "month");
    let m = s.date.add(s.date.month_start(new Date(a)), 1, "month");
    const l = s.date.date_part(s._currentDate());
    m.getDay() !== 0 && (m = s.date.add(s.date.week_start(m), 1, "week"));
    let f = this._weeksBetween(c, m);
    i && f < i && (m = s.date.add(m, i - f, "week"));
    let g = c;
    const p = document.createElement("div");
    for (p.classList.add("dhx_cal_datepicker_days"), this._domEvents.attach(p, "click", (y) => {
      const w = y.target.closest("[data-cell-date]"), b = new Date(w.getAttribute("data-cell-date"));
      this.callEvent("onDateClick", [b, y]);
    }); g.valueOf() < m.valueOf(); ) {
      const y = document.createElement("div");
      y.setAttribute("data-cell-date", s.templates.format_date(g)), y.setAttribute("data-day", g.getDay()), y.innerHTML = g.getDate(), g.valueOf() < u.valueOf() ? y.classList.add("dhx_before") : g.valueOf() >= v.valueOf() && y.classList.add("dhx_after"), g.getDay() !== 0 && g.getDay() !== 6 || y.classList.add("dhx_cal_datepicker_weekend"), g.valueOf() == l.valueOf() && y.classList.add("dhx_now"), _ && o && g.valueOf() >= _.valueOf() && g.valueOf() < o.valueOf() && y.classList.add("dhx_cal_datepicker_current"), t[g.valueOf()] && y.classList.add("dhx_cal_datepicker_event"), y.classList.add("dhx_cal_datepicker_date"), p.appendChild(y), g = s.date.add(g, 1, "day");
    }
    h.appendChild(p);
  }
  _renderMonthGrid(h) {
    const { date: a } = this.getState(), r = document.createElement("div");
    r.classList.add("dhx_cal_datepicker_months");
    const d = [];
    for (let t = 0; t < 12; t++)
      d.push(new Date(a.getFullYear(), t, 1));
    const i = this.scheduler.date.date_to_str("%M");
    d.forEach((t) => {
      const n = document.createElement("div");
      n.classList.add("dhx_cal_datepicker_month"), a.getMonth() === t.getMonth() && n.classList.add("dhx_cal_datepicker_current"), n.setAttribute("data-month", t.getMonth()), n.innerHTML = i(t), this._domEvents.attach(n, "click", () => {
        const s = new Date(t);
        this.setState({ date: s, mode: "days" });
      }), r.appendChild(n);
    }), h.appendChild(r);
    const _ = document.createElement("div");
    _.classList.add("dhx_cal_datepicker_done");
    const o = document.createElement("button");
    o.innerText = "Done", o.classList.add("dhx_cal_datepicker_done_btn"), this._domEvents.attach(o, "click", () => {
      this.setState({ mode: "days" });
    }), _.appendChild(o), h.appendChild(_);
  }
  _renderYearGrid(h) {
    const { date: a } = this.getState(), r = 10 * Math.floor(a.getFullYear() / 10), d = document.createElement("div");
    d.classList.add("dhx_cal_datepicker_years");
    for (let o = r - 1; o <= r + 10; o++) {
      const t = document.createElement("div");
      t.innerText = o, t.classList.add("dhx_cal_datepicker_year"), t.setAttribute("data-year", o), a.getFullYear() === o && t.classList.add("dhx_cal_datepicker_current"), this._domEvents.attach(t, "click", () => {
        this.setState({ date: new Date(o, a.getMonth(), 1), mode: "months" });
      }), d.appendChild(t);
    }
    h.appendChild(d);
    const i = document.createElement("div");
    i.classList.add("dhx_cal_datepicker_done");
    const _ = document.createElement("button");
    _.innerText = "Done", _.classList.add("dhx_cal_datepicker_done_btn"), this._domEvents.attach(_, "click", () => {
      this.setState({ mode: "months" });
    }), i.appendChild(_), h.appendChild(i);
  }
  destructor() {
    this.onStateChangeHandlers = [], this.element && (this.element.innerHTML = "", this.element.remove()), this._domEvents.detachAll(), this.callEvent("onDestroy", []), this.detachAllEvents(), this.scheduler = null;
  }
}
function nt(e) {
  const h = { version: "7.0.5" };
  (function(t) {
    var n = { agenda: "https://docs.dhtmlx.com/scheduler/agenda_view.html", grid: "https://docs.dhtmlx.com/scheduler/grid_view.html", map: "https://docs.dhtmlx.com/scheduler/map_view.html", unit: "https://docs.dhtmlx.com/scheduler/units_view.html", timeline: "https://docs.dhtmlx.com/scheduler/timeline_view.html", week_agenda: "https://docs.dhtmlx.com/scheduler/weekagenda_view.html", year: "https://docs.dhtmlx.com/scheduler/year_view.html", anythingElse: "https://docs.dhtmlx.com/scheduler/views.html" }, s = { agenda: "ext/dhtmlxscheduler_agenda_view.js", grid: "ext/dhtmlxscheduler_grid_view.js", map: "ext/dhtmlxscheduler_map_view.js", unit: "ext/dhtmlxscheduler_units.js", timeline: "ext/dhtmlxscheduler_timeline.js, ext/dhtmlxscheduler_treetimeline.js, ext/dhtmlxscheduler_daytimeline.js", week_agenda: "ext/dhtmlxscheduler_week_agenda.js", year: "ext/dhtmlxscheduler_year_view.js", limit: "ext/dhtmlxscheduler_limit.js" };
    t._commonErrorMessages = { unknownView: function(c) {
      var u = s[c] ? "You're probably missing " + s[c] + "." : "";
      return "`" + c + "` view is not defined. \nPlease check parameters you pass to `scheduler.init` or `scheduler.setCurrentView` in your code and ensure you've imported appropriate extensions. \nRelated docs: " + (n[c] || n.anythingElse) + `
` + (u ? u + `
` : "");
    }, collapsedContainer: function(c) {
      return `Scheduler container height is set to *100%* but the rendered height is zero and the scheduler is not visible. 
Make sure that the container has some initial height or use different units. For example:
<div id='scheduler_here' class='dhx_cal_container' style='width:100%; height:600px;'> 
`;
    } }, t.createTimelineView = function() {
      throw new Error("scheduler.createTimelineView is not implemented. Be sure to add the required extension: " + s.timeline + `
Related docs: ` + n.timeline);
    }, t.createUnitsView = function() {
      throw new Error("scheduler.createUnitsView is not implemented. Be sure to add the required extension: " + s.unit + `
Related docs: ` + n.unit);
    }, t.createGridView = function() {
      throw new Error("scheduler.createGridView is not implemented. Be sure to add the required extension: " + s.grid + `
Related docs: ` + n.grid);
    }, t.addMarkedTimespan = function() {
      throw new Error(`scheduler.addMarkedTimespan is not implemented. Be sure to add the required extension: ext/dhtmlxscheduler_limit.js
Related docs: https://docs.dhtmlx.com/scheduler/limits.html`);
    }, t.renderCalendar = function() {
      throw new Error(`scheduler.renderCalendar is not implemented. Be sure to add the required extension: ext/dhtmlxscheduler_minical.js
https://docs.dhtmlx.com/scheduler/minicalendar.html`);
    }, t.exportToPNG = function() {
      throw new Error(["scheduler.exportToPNG is not implemented.", "This feature requires an additional module, be sure to check the related doc here https://docs.dhtmlx.com/scheduler/png.html", "Licensing info: https://dhtmlx.com/docs/products/dhtmlxScheduler/export.shtml"].join(`
`));
    }, t.exportToPDF = function() {
      throw new Error(["scheduler.exportToPDF is not implemented.", "This feature requires an additional module, be sure to check the related doc here https://docs.dhtmlx.com/scheduler/pdf.html", "Licensing info: https://dhtmlx.com/docs/products/dhtmlxScheduler/export.shtml"].join(`
`));
    };
  })(h), he(h), function(t) {
    Q(t), de(t), t._detachDomEvent = function(l, f, g) {
      l.removeEventListener ? l.removeEventListener(f, g, !1) : l.detachEvent && l.detachEvent("on" + f, g);
    }, t._init_once = function() {
      _e(t), t._init_once = function() {
      };
    };
    const n = { render: function(l) {
      return t._init_nav_bar(l);
    } }, s = { render: function(l) {
      const f = document.createElement("div");
      return f.className = "dhx_cal_header", f;
    } }, c = { render: function(l) {
      const f = document.createElement("div");
      return f.className = "dhx_cal_data", f;
    } };
    function u(l) {
      return !!(l.querySelector(".dhx_cal_header") && l.querySelector(".dhx_cal_data") && l.querySelector(".dhx_cal_navline"));
    }
    t.init = function(l, f, g) {
      if (!this.$destroyed) {
        if (f = f || t._currentDate(), g = g || "week", this._obj && this.unset_actions(), this._obj = typeof l == "string" ? document.getElementById(l) : l, this.$container = this._obj, this.$root = this._obj, !this.$container.offsetHeight && this.$container.offsetWidth && this.$container.style.height === "100%" && window.console.error(t._commonErrorMessages.collapsedContainer(), this.$container), this.config.wai_aria_attributes && this.config.wai_aria_application_role && this.$container.setAttribute("role", "application"), this.config.header || u(this.$container) || (this.config.header = function(p) {
          const y = ["day", "week", "month"];
          if (p.matrix)
            for (const w in p.matrix)
              y.push(w);
          if (p._props)
            for (const w in p._props)
              y.push(w);
          if (p._grid && p._grid.names)
            for (const w in p._grid.names)
              y.push(w);
          return ["map", "agenda", "week_agenda", "year"].forEach(function(w) {
            p[w + "_view"] && y.push(w);
          }), y.concat(["date"]).concat(["prev", "today", "next"]);
        }(this), window.console.log(["Required DOM elements are missing from the scheduler container and **scheduler.config.header** is not specified.", "Using a default header configuration: ", "scheduler.config.header = " + JSON.stringify(this.config.header, null, 2), "Check this article for the details: https://docs.dhtmlx.com/scheduler/initialization.html"].join(`
`))), this.config.header)
          this.$container.innerHTML = "", this.$container.classList.add("dhx_cal_container"), this.config.header.height && (this.xy.nav_height = this.config.header.height), this.$container.appendChild(n.render(this.config.header)), this.$container.appendChild(s.render()), this.$container.appendChild(c.render());
        else if (!u(this.$container))
          throw new Error(["Required DOM elements are missing from the scheduler container.", "Be sure to either specify them manually in the markup: https://docs.dhtmlx.com/scheduler/initialization.html#initializingschedulerviamarkup", "Or to use **scheduler.config.header** setting so they could be created automatically: https://docs.dhtmlx.com/scheduler/initialization.html#initializingschedulerviaheaderconfig"].join(`
`));
        this.config.rtl && (this.$container.className += " dhx_cal_container_rtl"), this._skin_init && t._skin_init(), t.date.init(), this._scroll = !0, this._els = [], this.get_elements(), this.init_templates(), this.set_actions(), this._init_once(), this._init_touch_events(), this.set_sizes(), t.callEvent("onSchedulerReady", []), t.$initialized = !0, this.setCurrentView(f, g);
      }
    }, t.xy = { min_event_height: 20, bar_height: 24, scale_width: 50, scroll_width: 18, scale_height: 20, month_scale_height: 20, menu_width: 25, margin_top: 0, margin_left: 0, editor_width: 140, month_head_height: 22, event_header_height: 14 }, t.keys = { edit_save: 13, edit_cancel: 27 }, t.bind = function(l, f) {
      return l.bind ? l.bind(f) : function() {
        return l.apply(f, arguments);
      };
    }, t.set_sizes = function() {
      var l = this._x = this._obj.clientWidth - this.xy.margin_left, f = this._table_view ? 0 : this.xy.scale_width + this.xy.scroll_width, g = this.$container.querySelector(".dhx_cal_scale_placeholder");
      t._is_material_skin() ? (g || ((g = document.createElement("div")).className = "dhx_cal_scale_placeholder", this.$container.insertBefore(g, this._els.dhx_cal_header[0])), g.style.display = "block", this.set_xy(g, l, this.xy.scale_height + 1, 0, this._els.dhx_cal_header[0].offsetTop)) : g && g.parentNode.removeChild(g), this._lightbox && (t.$container.offsetWidth < 1200 || this._setLbPosition(document.querySelector(".dhx_cal_light"))), this._data_width = l - f, this._els.dhx_cal_navline[0].style.width = l + "px";
      const p = this._els.dhx_cal_header[0];
      this.set_xy(p, this._data_width, this.xy.scale_height), p.style.left = "", p.style.right = "", this._table_view ? this.config.rtl ? p.style.right = "-1px" : p.style.left = "-1px" : this.config.rtl ? p.style.right = `${this.xy.scale_width}px` : p.style.left = `${this.xy.scale_width}px`;
    }, t.set_xy = function(l, f, g, p, y) {
      function w(k) {
        let E = k;
        return isNaN(Number(E)) || (E = Math.max(0, E) + "px"), E;
      }
      var b = "left";
      f !== void 0 && (l.style.width = w(f)), g !== void 0 && (l.style.height = w(g)), arguments.length > 3 && (p !== void 0 && (this.config.rtl && (b = "right"), l.style[b] = p + "px"), y !== void 0 && (l.style.top = y + "px"));
    }, t.get_elements = function() {
      const l = this._obj.getElementsByTagName("DIV");
      for (let f = 0; f < l.length; f++) {
        let g = t._getClassName(l[f]);
        const p = l[f].getAttribute("data-tab") || l[f].getAttribute("name") || "";
        g && (g = g.split(" ")[0]), this._els[g] || (this._els[g] = []), this._els[g].push(l[f]);
        let y = t.locale.labels[p + "_tab"] || t.locale.labels[p || g];
        typeof y != "string" && p && !l[f].innerHTML && (y = p.split("_")[0]), y && (this._waiAria.labelAttr(l[f], y), l[f].innerHTML = y);
      }
    };
    const v = t._createDomEventScope();
    function m(l, f) {
      const g = new Date(l), p = (new Date(f).getTime() - g.getTime()) / 864e5;
      return Math.abs(p);
    }
    t.unset_actions = function() {
      v.detachAll();
    }, t.set_actions = function() {
      for (const l in this._els)
        if (this._click[l])
          for (let f = 0; f < this._els[l].length; f++) {
            const g = this._els[l][f], p = this._click[l].bind(g);
            v.attach(g, "click", p);
          }
      v.attach(this._obj, "selectstart", function(l) {
        return l.preventDefault(), !1;
      }), v.attach(this._obj, "mousemove", function(l) {
        t._temp_touch_block || t._on_mouse_move(l);
      }), v.attach(this._obj, "mousedown", function(l) {
        t._ignore_next_click || t._on_mouse_down(l);
      }), v.attach(this._obj, "mouseup", function(l) {
        t._ignore_next_click || t._on_mouse_up(l);
      }), v.attach(this._obj, "dblclick", function(l) {
        t._on_dbl_click(l);
      }), v.attach(this._obj, "contextmenu", function(l) {
        return t.checkEvent("onContextMenu") && l.preventDefault(), t.callEvent("onContextMenu", [t._locate_event(l.target), l]);
      });
    }, t.select = function(l) {
      this._select_id != l && (t._close_not_saved(), this.editStop(!1), this._select_id && this.unselect(), this._select_id = l, this.updateEvent(l), this.callEvent("onEventSelected", [l]));
    }, t.unselect = function(l) {
      if (l && l != this._select_id)
        return;
      const f = this._select_id;
      this._select_id = null, f && this.getEvent(f) && this.updateEvent(f), this.callEvent("onEventUnselected", [f]);
    }, t.getState = function() {
      return { mode: this._mode, date: new Date(this._date), min_date: new Date(this._min_date), max_date: new Date(this._max_date), editor_id: this._edit_id, lightbox_id: this._lightbox_id, new_event: this._new_event, select_id: this._select_id, expanded: this.expanded, drag_id: this._drag_id, drag_mode: this._drag_mode };
    }, t._click = { dhx_cal_data: function(l) {
      if (t._ignore_next_click)
        return l.preventDefault && l.preventDefault(), l.cancelBubble = !0, t._ignore_next_click = !1, !1;
      const f = t._locate_event(l.target);
      if (f) {
        if (!t.callEvent("onClick", [f, l]) || t.config.readonly)
          return;
      } else
        t.callEvent("onEmptyClick", [t.getActionData(l).date, l]);
      if (f && t.config.select) {
        t.select(f);
        const g = l.target.closest(".dhx_menu_icon"), p = t._getClassName(g);
        p.indexOf("_icon") != -1 && t._click.buttons[p.split(" ")[1].replace("icon_", "")](f);
      } else
        t._close_not_saved(), t.getState().select_id && (/* @__PURE__ */ new Date()).valueOf() - (t._new_event || 0) > 500 && t.unselect();
    }, dhx_cal_prev_button: function() {
      t._click.dhx_cal_next_button(0, -1);
    }, dhx_cal_next_button: function(l, f) {
      let g = 1;
      t.config.rtl && (f = -f, g = -g), t.setCurrentView(t.date.add(t.date[t._mode + "_start"](new Date(t._date)), f || g, t._mode));
    }, dhx_cal_today_button: function() {
      t.callEvent("onBeforeTodayDisplayed", []) && t.setCurrentView(t._currentDate());
    }, dhx_cal_tab: function() {
      const l = this.getAttribute("data-tab"), f = this.getAttribute("name"), g = l || f.substring(0, f.search("_tab"));
      t.setCurrentView(t._date, g);
    }, buttons: { delete: function(l) {
      const f = t.locale.labels.confirm_deleting;
      t._dhtmlx_confirm({ message: f, title: t.locale.labels.title_confirm_deleting, callback: function() {
        t.deleteEvent(l);
      }, config: { ok: t.locale.labels.icon_delete } });
    }, edit: function(l) {
      t.edit(l);
    }, save: function(l) {
      t.editStop(!0);
    }, details: function(l) {
      t.showLightbox(l);
    }, form: function(l) {
      t.showLightbox(l);
    }, cancel: function(l) {
      t.editStop(!1);
    } } }, t._dhtmlx_confirm = function({ message: l, title: f, callback: g, config: p }) {
      if (!l)
        return g();
      p = p || {};
      const y = { ...p, text: l };
      f && (y.title = f), g && (y.callback = function(w) {
        w && g();
      }), t.confirm(y);
    }, t.addEventNow = function(l, f, g) {
      let p = {};
      t._isObject(l) && !t._isDate(l) && (p = l, l = null);
      const y = 6e4 * (this.config.event_duration || this.config.time_step);
      l || (l = p.start_date || Math.round(t._currentDate().valueOf() / y) * y);
      let w = new Date(l);
      if (!f) {
        let E = this.config.first_hour;
        E > w.getHours() && (w.setHours(E), l = w.valueOf()), f = l.valueOf() + y;
      }
      let b = new Date(f);
      w.valueOf() == b.valueOf() && b.setTime(b.valueOf() + y), p.start_date = p.start_date || w, p.end_date = p.end_date || b, p.text = p.text || this.locale.labels.new_event, p.id = this._drag_id = p.id || this.uid(), this._drag_mode = "new-size", this._loading = !0;
      const k = this.addEvent(p);
      return this.callEvent("onEventCreated", [this._drag_id, g]), this._loading = !1, this._drag_event = {}, this._on_mouse_up(g), k;
    }, t._on_dbl_click = function(l, f) {
      if (f = f || l.target, this.config.readonly)
        return;
      const g = t._getClassName(f).split(" ")[0];
      switch (g) {
        case "dhx_scale_holder":
        case "dhx_scale_holder_now":
        case "dhx_month_body":
        case "dhx_wa_day_data":
          if (!t.config.dblclick_create)
            break;
          this.addEventNow(this.getActionData(l).date, null, l);
          break;
        case "dhx_cal_event":
        case "dhx_wa_ev_body":
        case "dhx_agenda_line":
        case "dhx_cal_agenda_event_line":
        case "dhx_grid_event":
        case "dhx_cal_event_line":
        case "dhx_cal_event_clear": {
          const p = this._locate_event(f);
          if (!this.callEvent("onDblClick", [p, l]))
            return;
          this.config.details_on_dblclick || this._table_view || !this.getEvent(p)._timed || !this.config.select ? this.showLightbox(p) : this.edit(p);
          break;
        }
        case "dhx_time_block":
        case "dhx_cal_container":
          return;
        default: {
          const p = this["dblclick_" + g];
          if (p)
            p.call(this, l);
          else if (f.parentNode && f != this)
            return t._on_dbl_click(l, f.parentNode);
          break;
        }
      }
    }, t._get_column_index = function(l) {
      let f = 0;
      if (this._cols) {
        let g = 0, p = 0;
        for (; g + this._cols[p] < l && p < this._cols.length; )
          g += this._cols[p], p++;
        if (f = p + (this._cols[p] ? (l - g) / this._cols[p] : 0), this._ignores && f >= this._cols.length)
          for (; f >= 1 && this._ignores[Math.floor(f)]; )
            f--;
      }
      return f;
    }, t._week_indexes_from_pos = function(l) {
      if (this._cols) {
        const f = this._get_column_index(l.x);
        return l.x = Math.min(this._cols.length - 1, Math.max(0, Math.ceil(f) - 1)), l.y = Math.max(0, Math.ceil(60 * l.y / (this.config.time_step * this.config.hour_size_px)) - 1) + this.config.first_hour * (60 / this.config.time_step), l;
      }
      return l;
    }, t._mouse_coords = function(l) {
      let f;
      const g = document.body, p = document.documentElement;
      f = this.$env.isIE || !l.pageX && !l.pageY ? { x: l.clientX + (g.scrollLeft || p.scrollLeft || 0) - g.clientLeft, y: l.clientY + (g.scrollTop || p.scrollTop || 0) - g.clientTop } : { x: l.pageX, y: l.pageY }, this.config.rtl && this._colsS ? (f.x = this.$container.querySelector(".dhx_cal_data").offsetWidth - f.x, f.x += this.$domHelpers.getAbsoluteLeft(this._obj), this._mode !== "month" && (f.x -= this.xy.scale_width)) : f.x -= this.$domHelpers.getAbsoluteLeft(this._obj) + (this._table_view ? 0 : this.xy.scale_width);
      const y = this.$container.querySelector(".dhx_cal_data");
      f.y -= this.$domHelpers.getAbsoluteTop(y) - this._els.dhx_cal_data[0].scrollTop, f.ev = l;
      const w = this["mouse_" + this._mode];
      if (w)
        f = w.call(this, f);
      else if (this._table_view) {
        const b = this._get_column_index(f.x);
        if (!this._cols || !this._colsS)
          return f;
        let k = 0;
        for (k = 1; k < this._colsS.heights.length && !(this._colsS.heights[k] > f.y); k++)
          ;
        f.y = Math.ceil(24 * (Math.max(0, b) + 7 * Math.max(0, k - 1)) * 60 / this.config.time_step), (t._drag_mode || this._mode == "month") && (f.y = 24 * (Math.max(0, Math.ceil(b) - 1) + 7 * Math.max(0, k - 1)) * 60 / this.config.time_step), this._drag_mode == "move" && t._ignores_detected && t.config.preserve_length && (f._ignores = !0, this._drag_event._event_length || (this._drag_event._event_length = this._get_real_event_length(this._drag_event.start_date, this._drag_event.end_date, { x_step: 1, x_unit: "day" }))), f.x = 0;
      } else
        f = this._week_indexes_from_pos(f);
      return f.timestamp = +/* @__PURE__ */ new Date(), f;
    }, t._close_not_saved = function() {
      if ((/* @__PURE__ */ new Date()).valueOf() - (t._new_event || 0) > 500 && t._edit_id) {
        const l = t.locale.labels.confirm_closing;
        t._dhtmlx_confirm({ message: l, title: t.locale.labels.title_confirm_closing, callback: function() {
          t.editStop(t.config.positive_closing);
        } }), l && (this._drag_id = this._drag_pos = this._drag_mode = null);
      }
    }, t._correct_shift = function(l, f) {
      return l - 6e4 * (new Date(t._min_date).getTimezoneOffset() - new Date(l).getTimezoneOffset()) * (f ? -1 : 1);
    }, t._is_pos_changed = function(l, f) {
      function g(p, y, w) {
        return Math.abs(p - y) > w;
      }
      return !l || !this._drag_pos || !!(this._drag_pos.has_moved || !this._drag_pos.timestamp || f.timestamp - this._drag_pos.timestamp > 100 || g(l.ev.clientX, f.ev.clientX, 5) || g(l.ev.clientY, f.ev.clientY, 5));
    }, t._correct_drag_start_date = function(l) {
      let f;
      t.matrix && (f = t.matrix[t._mode]), f = f || { x_step: 1, x_unit: "day" }, l = new Date(l);
      let g = 1;
      return (f._start_correction || f._end_correction) && (g = 60 * (f.last_hour || 0) - (60 * l.getHours() + l.getMinutes()) || 1), 1 * l + (t._get_fictional_event_length(l, g, f) - g);
    }, t._correct_drag_end_date = function(l, f) {
      let g;
      t.matrix && (g = t.matrix[t._mode]), g = g || { x_step: 1, x_unit: "day" };
      const p = 1 * l + t._get_fictional_event_length(l, f, g);
      return new Date(1 * p - (t._get_fictional_event_length(p, -1, g, -1) + 1));
    }, t._on_mouse_move = function(l) {
      if (this._drag_mode) {
        var f = this._mouse_coords(l);
        if (this._is_pos_changed(this._drag_pos, f)) {
          var g, p;
          if (this._edit_id != this._drag_id && this._close_not_saved(), !this._drag_mode)
            return;
          var y = null;
          if (this._drag_pos && !this._drag_pos.has_moved && ((y = this._drag_pos).has_moved = !0), this._drag_pos = f, this._drag_pos.has_moved = !0, this._drag_mode == "create") {
            if (y && (f = y), this._close_not_saved(), this.unselect(this._select_id), this._loading = !0, g = this._get_date_from_pos(f).valueOf(), !this._drag_start)
              return this.callEvent("onBeforeEventCreated", [l, this._drag_id]) ? (this._loading = !1, void (this._drag_start = g)) : void (this._loading = !1);
            p = g, this._drag_start;
            var w = new Date(this._drag_start), b = new Date(p);
            this._mode != "day" && this._mode != "week" || w.getHours() != b.getHours() || w.getMinutes() != b.getMinutes() || (b = new Date(this._drag_start + 1e3)), this._drag_id = this.uid(), this.addEvent(w, b, this.locale.labels.new_event, this._drag_id, f.fields), this.callEvent("onEventCreated", [this._drag_id, l]), this._loading = !1, this._drag_mode = "new-size";
          }
          var k, E = this.config.time_step, D = this.getEvent(this._drag_id);
          if (t.matrix && (k = t.matrix[t._mode]), k = k || { x_step: 1, x_unit: "day" }, this._drag_mode == "move")
            g = this._min_date.valueOf() + 6e4 * (f.y * this.config.time_step + 24 * f.x * 60), !f.custom && this._table_view && (g += 1e3 * this.date.time_part(D.start_date)), !this._table_view && this._dragEventBody && this._drag_event._move_event_shift === void 0 && (this._drag_event._move_event_shift = g - D.start_date), this._drag_event._move_event_shift && (g -= this._drag_event._move_event_shift), g = this._correct_shift(g), f._ignores && this.config.preserve_length && this._table_view && k ? (g = t._correct_drag_start_date(g), p = t._correct_drag_end_date(g, this._drag_event._event_length)) : p = D.end_date.valueOf() - (D.start_date.valueOf() - g);
          else {
            if (g = D.start_date.valueOf(), p = D.end_date.valueOf(), this._table_view) {
              var x = this._min_date.valueOf() + f.y * this.config.time_step * 6e4 + (f.custom ? 0 : 864e5);
              if (this._mode == "month")
                if (x = this._correct_shift(x, !1), this._drag_from_start) {
                  var S = 864e5;
                  x <= t.date.date_part(new Date(p + S - 1)).valueOf() && (g = x - S);
                } else
                  p = x;
              else
                this.config.preserve_length ? f.resize_from_start ? g = t._correct_drag_start_date(x) : p = t._correct_drag_end_date(x, 0) : f.resize_from_start ? g = x : p = x;
            } else {
              var N = this.date.date_part(new Date(D.end_date.valueOf() - 1)).valueOf(), M = new Date(N), A = this.config.first_hour, C = 60 / E * (this.config.last_hour - A);
              this.config.time_step = 1;
              var T = this._mouse_coords(l);
              this.config.time_step = E;
              var O = f.y * E * 6e4, L = Math.min(f.y + 1, C) * E * 6e4, H = 6e4 * T.y;
              p = Math.abs(O - H) > Math.abs(L - H) ? N + L : N + O, p += 6e4 * (new Date(p).getTimezoneOffset() - M.getTimezoneOffset()), this._els.dhx_cal_data[0].style.cursor = "s-resize", this._mode != "week" && this._mode != "day" || (p = this._correct_shift(p));
            }
            if (this._drag_mode == "new-size")
              if (p <= this._drag_start) {
                var P = f.shift || (this._table_view && !f.custom ? 864e5 : 0);
                g = p - (f.shift ? 0 : P), p = this._drag_start + (P || 6e4 * E);
              } else
                g = this._drag_start;
            else
              p <= g && (p = g + 6e4 * E);
          }
          var z = new Date(p - 1), $ = new Date(g);
          if (this._drag_mode == "move" && t.config.limit_drag_out && (+$ < +t._min_date || +p > +t._max_date)) {
            if (+D.start_date < +t._min_date || +D.end_date > +t._max_date)
              $ = new Date(D.start_date), p = new Date(D.end_date);
            else {
              var j = p - $;
              +$ < +t._min_date ? ($ = new Date(t._min_date), f._ignores && this.config.preserve_length && this._table_view ? ($ = new Date(t._correct_drag_start_date($)), k._start_correction && ($ = new Date($.valueOf() + k._start_correction)), p = new Date(1 * $ + this._get_fictional_event_length($, this._drag_event._event_length, k))) : p = new Date(+$ + j)) : (p = new Date(t._max_date), f._ignores && this.config.preserve_length && this._table_view ? (k._end_correction && (p = new Date(p.valueOf() - k._end_correction)), p = new Date(1 * p - this._get_fictional_event_length(p, 0, k, !0)), $ = new Date(1 * p - this._get_fictional_event_length(p, this._drag_event._event_length, k, !0)), this._ignores_detected && ($ = t.date.add($, k.x_step, k.x_unit), p = new Date(1 * p - this._get_fictional_event_length(p, 0, k, !0)), p = t.date.add(p, k.x_step, k.x_unit))) : $ = new Date(+p - j));
            }
            z = new Date(p - 1);
          }
          if (!this._table_view && this._dragEventBody && !t.config.all_timed && (!t._get_section_view() && f.x != this._get_event_sday({ start_date: new Date(g), end_date: new Date(g) }) || new Date(g).getHours() < this.config.first_hour) && (j = p - $, this._drag_mode == "move" && (S = this._min_date.valueOf() + 24 * f.x * 60 * 6e4, ($ = new Date(S)).setHours(this.config.first_hour), p = new Date($.valueOf() + j), z = new Date(p - 1))), this._table_view || t.config.all_timed || !(!t.getView() && f.x != this._get_event_sday({ start_date: new Date(p), end_date: new Date(p) }) || new Date(p).getHours() >= this.config.last_hour) || (j = p - $, S = this._min_date.valueOf() + 24 * f.x * 60 * 6e4, (p = t.date.date_part(new Date(S))).setHours(this.config.last_hour), z = new Date(p - 1), this._drag_mode == "move" && ($ = new Date(+p - j))), this._table_view || z.getDate() == $.getDate() && z.getHours() < this.config.last_hour || t._allow_dnd)
            if (D.start_date = $, D.end_date = new Date(p), this.config.update_render) {
              var F = t._els.dhx_cal_data[0].scrollTop;
              this.update_view(), t._els.dhx_cal_data[0].scrollTop = F;
            } else
              this.updateEvent(this._drag_id);
          this._table_view && this.for_rendered(this._drag_id, function(J) {
            J.className += " dhx_in_move dhx_cal_event_drag";
          }), this.callEvent("onEventDrag", [this._drag_id, this._drag_mode, l]);
        }
      } else if (t.checkEvent("onMouseMove")) {
        var U = this._locate_event(l.target || l.srcElement);
        this.callEvent("onMouseMove", [U, l]);
      }
    }, t._on_mouse_down = function(l, f) {
      if (l.button != 2 && !this.config.readonly && !this._drag_mode) {
        f = f || l.target || l.srcElement;
        var g = t._getClassName(f).split(" ")[0];
        switch (this.config.drag_event_body && g == "dhx_body" && f.parentNode && f.parentNode.className.indexOf("dhx_cal_select_menu") === -1 && (g = "dhx_event_move", this._dragEventBody = !0), g) {
          case "dhx_cal_event_line":
          case "dhx_cal_event_clear":
            this._table_view && (this._drag_mode = "move");
            break;
          case "dhx_event_move":
          case "dhx_wa_ev_body":
            this._drag_mode = "move";
            break;
          case "dhx_event_resize":
            this._drag_mode = "resize", t._getClassName(f).indexOf("dhx_event_resize_end") < 0 ? t._drag_from_start = !0 : t._drag_from_start = !1;
            break;
          case "dhx_scale_holder":
          case "dhx_scale_holder_now":
          case "dhx_month_body":
          case "dhx_matrix_cell":
          case "dhx_marked_timespan":
            this._drag_mode = "create";
            break;
          case "":
            if (f.parentNode)
              return t._on_mouse_down(l, f.parentNode);
            break;
          default:
            if ((!t.checkEvent("onMouseDown") || t.callEvent("onMouseDown", [g, l])) && f.parentNode && f != this && g != "dhx_body")
              return t._on_mouse_down(l, f.parentNode);
            this._drag_mode = null, this._drag_id = null;
        }
        if (this._drag_mode) {
          var p = this._locate_event(f);
          if (this.config["drag_" + this._drag_mode] && this.callEvent("onBeforeDrag", [p, this._drag_mode, l])) {
            if (this._drag_id = p, (this._edit_id != this._drag_id || this._edit_id && this._drag_mode == "create") && this._close_not_saved(), !this._drag_mode)
              return;
            this._drag_event = t._lame_clone(this.getEvent(this._drag_id) || {}), this._drag_pos = this._mouse_coords(l);
          } else
            this._drag_mode = this._drag_id = 0;
        }
        this._drag_start = null;
      }
    }, t._get_private_properties = function(l) {
      var f = {};
      for (var g in l)
        g.indexOf("_") === 0 && (f[g] = !0);
      return f;
    }, t._clear_temporary_properties = function(l, f) {
      var g = this._get_private_properties(l), p = this._get_private_properties(f);
      for (var y in p)
        g[y] || delete f[y];
    }, t._on_mouse_up = function(l) {
      if (!l || l.button != 2 || !this._mobile) {
        if (this._drag_mode && this._drag_id) {
          this._els.dhx_cal_data[0].style.cursor = "default";
          var f = this._drag_id, g = this._drag_mode, p = !this._drag_pos || this._drag_pos.has_moved;
          delete this._drag_event._move_event_shift;
          var y = this.getEvent(this._drag_id);
          if (p && (this._drag_event._dhx_changed || !this._drag_event.start_date || y.start_date.valueOf() != this._drag_event.start_date.valueOf() || y.end_date.valueOf() != this._drag_event.end_date.valueOf())) {
            var w = this._drag_mode == "new-size";
            if (this.callEvent("onBeforeEventChanged", [y, l, w, this._drag_event]))
              if (this._drag_id = this._drag_mode = null, w && this.config.edit_on_create) {
                if (this.unselect(), this._new_event = /* @__PURE__ */ new Date(), this._table_view || this.config.details_on_create || !this.config.select || !this.isOneDayEvent(this.getEvent(f)))
                  return t.callEvent("onDragEnd", [f, g, l]), this.showLightbox(f);
                this._drag_pos = !0, this._select_id = this._edit_id = f;
              } else
                this._new_event || this.callEvent(w ? "onEventAdded" : "onEventChanged", [f, this.getEvent(f)]);
            else
              w ? this.deleteEvent(y.id, !0) : (this._drag_event._dhx_changed = !1, this._clear_temporary_properties(y, this._drag_event), t._lame_copy(y, this._drag_event), this.updateEvent(y.id));
          }
          this._drag_pos && (this._drag_pos.has_moved || this._drag_pos === !0) && (this._drag_id = this._drag_mode = null, this.render_view_data()), t.callEvent("onDragEnd", [f, g, l]);
        }
        this._drag_id = null, this._drag_mode = null, this._drag_pos = null, this._drag_event = null, this._drag_from_start = null;
      }
    }, t._trigger_dyn_loading = function() {
      return !(!this._load_mode || !this._load() || (this._render_wait = !0, 0));
    }, t.update_view = function() {
      this._reset_ignores(), this._update_nav_bar(this.config.header, this.$container.querySelector(".dhx_cal_navline"));
      var l = this[this._mode + "_view"];
      if (l ? l.call(this, !0) : this._reset_scale(), this._trigger_dyn_loading())
        return !0;
      this.render_view_data();
    }, t.isViewExists = function(l) {
      return !!(t[l + "_view"] || t.date[l + "_start"] && t.templates[l + "_date"] && t.templates[l + "_scale_date"]);
    }, t._set_aria_buttons_attrs = function() {
      for (var l = ["dhx_cal_next_button", "dhx_cal_prev_button", "dhx_cal_tab", "dhx_cal_today_button"], f = 0; f < l.length; f++)
        for (var g = this._els[l[f]], p = 0; g && p < g.length; p++) {
          var y = g[p].getAttribute("data-tab") || g[p].getAttribute("name"), w = this.locale.labels[l[f]];
          y && (w = this.locale.labels[y + "_tab"] || this.locale.labels[y] || w), l[f] == "dhx_cal_next_button" ? w = this.locale.labels.next : l[f] == "dhx_cal_prev_button" && (w = this.locale.labels.prev), this._waiAria.headerButtonsAttributes(g[p], w || "");
        }
    }, t.updateView = function(l, f) {
      if (!this.$container)
        throw new Error(`The scheduler is not initialized. 
 **scheduler.updateView** or **scheduler.setCurrentView** can be called only after **scheduler.init**`);
      l = l || this._date, f = f || this._mode;
      var g = "dhx_cal_data";
      this.locale.labels.icon_form || (this.locale.labels.icon_form = this.locale.labels.icon_edit);
      var p = this._obj, y = "dhx_scheduler_" + this._mode, w = "dhx_scheduler_" + f;
      this._mode && p.className.indexOf(y) != -1 ? p.className = p.className.replace(y, w) : p.className += " " + w;
      var b, k = "dhx_multi_day", E = !(this._mode != f || !this.config.preserve_scroll) && this._els[g][0].scrollTop;
      this._els[k] && this._els[k][0] && (b = this._els[k][0].scrollTop), this[this._mode + "_view"] && f && this._mode != f && this[this._mode + "_view"](!1), this._close_not_saved(), this._els[k] && (this._els[k][0].parentNode.removeChild(this._els[k][0]), this._els[k] = null), this._mode = f, this._date = l, this._table_view = this._mode == "month", this._dy_shift = 0, this.update_view(), this._set_aria_buttons_attrs();
      var D = this._els.dhx_cal_tab;
      if (D)
        for (var x = 0; x < D.length; x++) {
          var S = D[x];
          S.getAttribute("data-tab") == this._mode || S.getAttribute("name") == this._mode + "_tab" ? (S.classList.add("active"), this._waiAria.headerToggleState(S, !0)) : (S.classList.remove("active"), this._waiAria.headerToggleState(S, !1));
        }
      typeof E == "number" && (this._els[g][0].scrollTop = E), typeof b == "number" && this._els[k] && this._els[k][0] && (this._els[k][0].scrollTop = b);
    }, t.setCurrentView = function(l, f) {
      this.callEvent("onBeforeViewChange", [this._mode, this._date, f || this._mode, l || this._date]) && (this.updateView(l, f), this.callEvent("onViewChange", [this._mode, this._date]));
    }, t.render = function(l, f) {
      t.setCurrentView(l, f);
    }, t._render_x_header = function(l, f, g, p, y) {
      y = y || 0;
      var w = document.createElement("div");
      w.className = "dhx_scale_bar", this.templates[this._mode + "_scalex_class"] && (w.className += " " + this.templates[this._mode + "_scalex_class"](g));
      var b = this._cols[l];
      this._mode == "month" && l === 0 && this.config.left_border && (w.className += " dhx_scale_bar_border", f += 1), this.set_xy(w, b, this.xy.scale_height - 1, f, y);
      var k = this.templates[this._mode + "_scale_date"](g, this._mode);
      w.innerHTML = k, this._waiAria.dayHeaderAttr(w, k), p.appendChild(w);
    }, t._get_columns_num = function(l, f) {
      var g = 7;
      if (!t._table_view) {
        var p = t.date["get_" + t._mode + "_end"];
        p && (f = p(l)), g = Math.round((f.valueOf() - l.valueOf()) / 864e5);
      }
      return g;
    }, t._get_timeunit_start = function() {
      return this.date[this._mode + "_start"](new Date(this._date.valueOf()));
    }, t._get_view_end = function() {
      var l = this._get_timeunit_start(), f = t.date.add(l, 1, this._mode);
      if (!t._table_view) {
        var g = t.date["get_" + t._mode + "_end"];
        g && (f = g(l));
      }
      return f;
    }, t._calc_scale_sizes = function(l, f, g) {
      var p = this.config.rtl, y = l, w = this._get_columns_num(f, g);
      this._process_ignores(f, w, "day", 1);
      for (var b = w - this._ignores_detected, k = 0; k < w; k++)
        this._ignores[k] ? (this._cols[k] = 0, b++) : this._cols[k] = Math.floor(y / (b - k)), y -= this._cols[k], this._colsS[k] = (this._cols[k - 1] || 0) + (this._colsS[k - 1] || (this._table_view ? 0 : p ? this.xy.scroll_width : this.xy.scale_width));
      this._colsS.col_length = w, this._colsS[w] = this._cols[w - 1] + this._colsS[w - 1] || 0;
    }, t._set_scale_col_size = function(l, f, g) {
      var p = this.config;
      this.set_xy(l, f, p.hour_size_px * (p.last_hour - p.first_hour), g + this.xy.scale_width + 1, 0);
    }, t._render_scales = function(l, f) {
      var g = new Date(t._min_date), p = new Date(t._max_date), y = this.date.date_part(t._currentDate()), w = parseInt(l.style.width, 10) - 1, b = new Date(this._min_date), k = this._get_columns_num(g, p);
      this._calc_scale_sizes(w, g, p);
      var E = 0;
      l.innerHTML = "";
      for (var D = 0; D < k; D++) {
        if (this._ignores[D] || this._render_x_header(D, E, b, l), !this._table_view) {
          var x = document.createElement("div"), S = "dhx_scale_holder";
          b.valueOf() == y.valueOf() && (S += " dhx_scale_holder_now"), x.setAttribute("data-column-index", D), this._ignores_detected && this._ignores[D] && (S += " dhx_scale_ignore");
          for (let N = 1 * this.config.first_hour; N < this.config.last_hour; N++) {
            const M = document.createElement("div");
            M.className = "dhx_scale_time_slot dhx_scale_time_slot_hour_start", M.style.height = this.config.hour_size_px / 2 + "px";
            let A = new Date(b.getFullYear(), b.getMonth(), b.getDate(), N, 0);
            M.setAttribute("data-slot-date", this.templates.format_date(A));
            let C = this.templates.time_slot_text(A);
            C && (M.innerHTML = C);
            let T = this.templates.time_slot_class(A);
            T && M.classList.add(T), x.appendChild(M);
            const O = document.createElement("div");
            O.className = "dhx_scale_time_slot", A = new Date(b.getFullYear(), b.getMonth(), b.getDate(), N, 30), O.setAttribute("data-slot-date", this.templates.format_date(A)), O.style.height = this.config.hour_size_px / 2 + "px", C = this.templates.time_slot_text(A), C && (O.innerHTML = C), T = this.templates.time_slot_class(A), T && O.classList.add(T), x.appendChild(O);
          }
          x.className = S + " " + this.templates.week_date_class(b, y), this._waiAria.dayColumnAttr(x, b), this._set_scale_col_size(x, this._cols[D], E), f.appendChild(x), this.callEvent("onScaleAdd", [x, b]);
        }
        E += this._cols[D], b = this.date.add(b, 1, "day"), b = this.date.day_start(b);
      }
    }, t._getNavDateElement = function() {
      return this.$container.querySelector(".dhx_cal_date");
    }, t._reset_scale = function() {
      if (this.templates[this._mode + "_date"]) {
        var l = this._els.dhx_cal_header[0], f = this._els.dhx_cal_data[0], g = this.config;
        l.innerHTML = "", f.innerHTML = "";
        var p, y, w = (g.readonly || !g.drag_resize ? " dhx_resize_denied" : "") + (g.readonly || !g.drag_move ? " dhx_move_denied" : "");
        f.className = "dhx_cal_data" + w, this._scales = {}, this._cols = [], this._colsS = { height: 0 }, this._dy_shift = 0, this.set_sizes();
        var b = this._get_timeunit_start(), k = t._get_view_end();
        p = y = this._table_view ? t.date.week_start(b) : b, this._min_date = p;
        var E = this.templates[this._mode + "_date"](b, k, this._mode), D = this._getNavDateElement();
        if (D && (D.innerHTML = E, this._waiAria.navBarDateAttr(D, E)), this._max_date = k, t._render_scales(l, f), this._table_view)
          this._reset_month_scale(f, b, y);
        else if (this._reset_hours_scale(f, b, y), g.multi_day) {
          var x = "dhx_multi_day";
          this._els[x] && (this._els[x][0].parentNode.removeChild(this._els[x][0]), this._els[x] = null);
          var S = document.createElement("div");
          S.className = x, S.style.visibility = "hidden", S.style.display = "none";
          var N = this._colsS[this._colsS.col_length], M = g.rtl ? this.xy.scale_width : this.xy.scroll_width, A = Math.max(N + M, 0);
          this.set_xy(S, A, 0, 0), f.parentNode.insertBefore(S, f);
          var C = S.cloneNode(!0);
          C.className = x + "_icon", C.style.visibility = "hidden", C.style.display = "none", this.set_xy(C, this.xy.scale_width + 1, 0, 0), S.appendChild(C), this._els[x] = [S, C], t.event(this._els[x][0], "click", this._click.dhx_cal_data);
        }
      }
    }, t._reset_hours_scale = function(l, f, g) {
      var p = document.createElement("div");
      p.className = "dhx_scale_holder";
      for (var y = new Date(1980, 1, 1, this.config.first_hour, 0, 0), w = 1 * this.config.first_hour; w < this.config.last_hour; w++) {
        var b = document.createElement("div");
        b.className = "dhx_scale_hour", b.style.height = this.config.hour_size_px + "px";
        var k = this.xy.scale_width;
        this.config.left_border && (b.className += " dhx_scale_hour_border"), b.style.width = k + "px";
        var E = t.templates.hour_scale(y);
        b.innerHTML = E, this._waiAria.hourScaleAttr(b, E), p.appendChild(b), y = this.date.add(y, 1, "hour");
      }
      l.appendChild(p), this.config.scroll_hour && (l.scrollTop = this.config.hour_size_px * (this.config.scroll_hour - this.config.first_hour));
    }, t._currentDate = function() {
      return t.config.now_date ? new Date(t.config.now_date) : /* @__PURE__ */ new Date();
    }, t._reset_ignores = function() {
      this._ignores = {}, this._ignores_detected = 0;
    }, t._process_ignores = function(l, f, g, p, y) {
      this._reset_ignores();
      var w = t["ignore_" + this._mode];
      if (w)
        for (var b = new Date(l), k = 0; k < f; k++)
          w(b) && (this._ignores_detected += 1, this._ignores[k] = !0, y && f++), b = t.date.add(b, p, g), t.date[g + "_start"] && (b = t.date[g + "_start"](b));
    }, t._render_month_scale = function(l, f, g, p) {
      var y = t.date.add(f, 1, "month"), w = new Date(g), b = t._currentDate();
      this.date.date_part(b), this.date.date_part(g), p = p || Math.ceil(Math.round((y.valueOf() - g.valueOf()) / 864e5) / 7);
      for (var k = [], E = 0; E <= 7; E++) {
        var D = this._cols[E] || 0;
        isNaN(Number(D)) || (D += "px"), k[E] = D;
      }
      function x($) {
        var j = t._colsS.height;
        return t._colsS.heights[$ + 1] !== void 0 && (j = t._colsS.heights[$ + 1] - (t._colsS.heights[$] || 0)), j;
      }
      var S = 0;
      const N = document.createElement("div");
      for (N.classList.add("dhx_cal_month_table"), E = 0; E < p; E++) {
        var M = document.createElement("div");
        M.classList.add("dhx_cal_month_row"), M.style.height = x(E) + "px", N.appendChild(M);
        for (var A = 0; A < 7; A++) {
          var C = document.createElement("div");
          M.appendChild(C);
          var T = "dhx_cal_month_cell";
          g < f ? T += " dhx_before" : g >= y ? T += " dhx_after" : g.valueOf() == b.valueOf() && (T += " dhx_now"), this._ignores_detected && this._ignores[A] && (T += " dhx_scale_ignore"), C.className = T + " " + this.templates.month_date_class(g, b), C.setAttribute("data-cell-date", t.templates.format_date(g));
          var O = "dhx_month_body", L = "dhx_month_head";
          if (A === 0 && this.config.left_border && (O += " dhx_month_body_border", L += " dhx_month_head_border"), this._ignores_detected && this._ignores[A])
            C.appendChild(document.createElement("div")), C.appendChild(document.createElement("div"));
          else {
            C.style.width = k[A], this._waiAria.monthCellAttr(C, g);
            var H = document.createElement("div");
            H.style.height = t.xy.month_head_height + "px", H.className = L, H.innerHTML = this.templates.month_day(g), C.appendChild(H);
            var P = document.createElement("div");
            P.className = O, C.appendChild(P);
          }
          var z = g.getDate();
          (g = this.date.add(g, 1, "day")).getDate() - z > 1 && (g = new Date(g.getFullYear(), g.getMonth(), z + 1, 12, 0));
        }
        t._colsS.heights[E] = S, S += x(E);
      }
      return this._min_date = w, this._max_date = g, l.innerHTML = "", l.appendChild(N), this._scales = {}, l.querySelectorAll("[data-cell-date]").forEach(($) => {
        const j = t.templates.parse_date($.getAttribute("data-cell-date")), F = $.querySelector(".dhx_month_body");
        this._scales[+j] = F, this.callEvent("onScaleAdd", [this._scales[+j], j]);
      }), this._max_date;
    }, t._reset_month_scale = function(l, f, g, p) {
      var y = t.date.add(f, 1, "month"), w = t._currentDate();
      this.date.date_part(w), this.date.date_part(g), p = p || Math.ceil(Math.round((y.valueOf() - g.valueOf()) / 864e5) / 7);
      var b = Math.floor(l.clientHeight / p) - this.xy.month_head_height;
      return this._colsS.height = b + this.xy.month_head_height, this._colsS.heights = [], t._render_month_scale(l, f, g, p);
    }, t.getView = function(l) {
      return l || (l = t.getState().mode), t.matrix && t.matrix[l] ? t.matrix[l] : t._props && t._props[l] ? t._props[l] : null;
    }, t.getLabel = function(l, f) {
      for (var g = this.config.lightbox.sections, p = 0; p < g.length; p++)
        if (g[p].map_to == l) {
          for (var y = g[p].options, w = 0; w < y.length; w++)
            if (y[w].key == f)
              return y[w].label;
        }
      return "";
    }, t.updateCollection = function(l, f) {
      var g = t.serverList(l);
      return !!g && (g.splice(0, g.length), g.push.apply(g, f || []), t.callEvent("onOptionsLoad", []), t.resetLightbox(), t.hideCover(), !0);
    }, t._lame_clone = function(l, f) {
      var g, p, y;
      for (f = f || [], g = 0; g < f.length; g += 2)
        if (l === f[g])
          return f[g + 1];
      if (l && typeof l == "object") {
        for (y = Object.create(l), p = [Array, Date, Number, String, Boolean], g = 0; g < p.length; g++)
          l instanceof p[g] && (y = g ? new p[g](l) : new p[g]());
        for (g in f.push(l, y), l)
          Object.prototype.hasOwnProperty.apply(l, [g]) && (y[g] = t._lame_clone(l[g], f));
      }
      return y || l;
    }, t._lame_copy = function(l, f) {
      for (var g in f)
        f.hasOwnProperty(g) && (l[g] = f[g]);
      return l;
    }, t._get_date_from_pos = function(l) {
      var f = this._min_date.valueOf() + 6e4 * (l.y * this.config.time_step + 24 * (this._table_view ? 0 : l.x) * 60);
      return new Date(this._correct_shift(f));
    }, t.getActionData = function(l) {
      var f = this._mouse_coords(l);
      return { date: this._get_date_from_pos(f), section: f.section };
    }, t._focus = function(l, f) {
      if (l && l.focus)
        if (this._mobile)
          window.setTimeout(function() {
            l.focus();
          }, 10);
        else
          try {
            f && l.select && l.offsetWidth && l.select(), l.focus();
          } catch {
          }
    }, t._get_real_event_length = function(l, f, g) {
      var p, y = f - l, w = this["ignore_" + this._mode], b = 0;
      g.render ? (b = this._get_date_index(g, l), p = this._get_date_index(g, f), l.valueOf() < t.getState().min_date.valueOf() && (b = -m(l, t.getState().min_date)), f.valueOf() > t.getState().max_date.valueOf() && (p += m(f, t.getState().max_date))) : p = Math.round(y / 60 / 60 / 1e3 / 24);
      for (var k = !0; b < p; ) {
        var E = t.date.add(f, -g.x_step, g.x_unit);
        if (w && w(f) && (!k || k && w(E)))
          y -= f - E;
        else {
          let D = 0;
          const x = new Date(Math.max(E.valueOf(), l.valueOf())), S = f, N = new Date(x.getFullYear(), x.getMonth(), x.getDate(), g.first_hour), M = new Date(x.getFullYear(), x.getMonth(), x.getDate(), g.last_hour || 24), A = new Date(f.getFullYear(), f.getMonth(), f.getDate(), g.first_hour), C = new Date(f.getFullYear(), f.getMonth(), f.getDate(), g.last_hour || 24);
          S.valueOf() > C.valueOf() && (D += S - C), S.valueOf() > A.valueOf() ? D += g._start_correction : D += 60 * S.getHours() * 60 * 1e3 + 60 * S.getMinutes() * 1e3, x.valueOf() < M.valueOf() && (D += g._end_correction), x.valueOf() < N.valueOf() && (D += N.valueOf() - x.valueOf()), y -= D, k = !1;
        }
        f = E, p--;
      }
      return y;
    }, t._get_fictional_event_length = function(l, f, g, p) {
      var y = new Date(l), w = p ? -1 : 1;
      if (g._start_correction || g._end_correction) {
        var b;
        b = p ? 60 * y.getHours() + y.getMinutes() - 60 * (g.first_hour || 0) : 60 * (g.last_hour || 0) - (60 * y.getHours() + y.getMinutes());
        var k = 60 * (g.last_hour - g.first_hour), E = Math.ceil((f / 6e4 - b) / k);
        E < 0 && (E = 0), f += E * (1440 - k) * 60 * 1e3;
      }
      var D, x = new Date(1 * l + f * w), S = this["ignore_" + this._mode], N = 0;
      for (g.render ? (N = this._get_date_index(g, y), D = this._get_date_index(g, x)) : D = Math.round(f / 60 / 60 / 1e3 / 24); N * w <= D * w; ) {
        var M = t.date.add(y, g.x_step * w, g.x_unit);
        S && S(y) && (f += (M - y) * w, D += w), y = M, N += w;
      }
      return f;
    }, t._get_section_view = function() {
      return this.getView();
    }, t._get_section_property = function() {
      return this.matrix && this.matrix[this._mode] ? this.matrix[this._mode].y_property : this._props && this._props[this._mode] ? this._props[this._mode].map_to : null;
    }, t._is_initialized = function() {
      var l = this.getState();
      return this._obj && l.date && l.mode;
    }, t._is_lightbox_open = function() {
      var l = this.getState();
      return l.lightbox_id !== null && l.lightbox_id !== void 0;
    };
  }(h), function(t) {
    (function() {
      var n = new RegExp(`<(?:.|
)*?>`, "gm"), s = new RegExp(" +", "gm");
      function c(l) {
        return (l + "").replace(n, " ").replace(s, " ");
      }
      var u = new RegExp("'", "gm");
      function v(l) {
        return (l + "").replace(u, "&#39;");
      }
      for (var m in t._waiAria = { getAttributeString: function(l) {
        var f = [" "];
        for (var g in l)
          if (typeof l[g] != "function" && typeof l[g] != "object") {
            var p = v(c(l[g]));
            f.push(g + "='" + p + "'");
          }
        return f.push(" "), f.join(" ");
      }, setAttributes: function(l, f) {
        for (var g in f)
          l.setAttribute(g, c(f[g]));
        return l;
      }, labelAttr: function(l, f) {
        return this.setAttributes(l, { "aria-label": f });
      }, label: function(l) {
        return t._waiAria.getAttributeString({ "aria-label": l });
      }, hourScaleAttr: function(l, f) {
        this.labelAttr(l, f);
      }, monthCellAttr: function(l, f) {
        this.labelAttr(l, t.templates.day_date(f));
      }, navBarDateAttr: function(l, f) {
        this.labelAttr(l, f);
      }, dayHeaderAttr: function(l, f) {
        this.labelAttr(l, f);
      }, dayColumnAttr: function(l, f) {
        this.dayHeaderAttr(l, t.templates.day_date(f));
      }, headerButtonsAttributes: function(l, f) {
        return this.setAttributes(l, { role: "button", "aria-label": f });
      }, headerToggleState: function(l, f) {
        return this.setAttributes(l, { "aria-pressed": f ? "true" : "false" });
      }, getHeaderCellAttr: function(l) {
        return t._waiAria.getAttributeString({ "aria-label": l });
      }, eventAttr: function(l, f) {
        this._eventCommonAttr(l, f);
      }, _eventCommonAttr: function(l, f) {
        f.setAttribute("aria-label", c(t.templates.event_text(l.start_date, l.end_date, l))), t.config.readonly && f.setAttribute("aria-readonly", !0), l.$dataprocessor_class && f.setAttribute("aria-busy", !0), f.setAttribute("aria-selected", t.getState().select_id == l.id ? "true" : "false");
      }, setEventBarAttr: function(l, f) {
        this._eventCommonAttr(l, f);
      }, _getAttributes: function(l, f) {
        var g = { setAttribute: function(p, y) {
          this[p] = y;
        } };
        return l.apply(this, [f, g]), g;
      }, eventBarAttrString: function(l) {
        return this.getAttributeString(this._getAttributes(this.setEventBarAttr, l));
      }, agendaHeadAttrString: function() {
        return this.getAttributeString({ role: "row" });
      }, agendaHeadDateString: function(l) {
        return this.getAttributeString({ role: "columnheader", "aria-label": l });
      }, agendaHeadDescriptionString: function(l) {
        return this.agendaHeadDateString(l);
      }, agendaDataAttrString: function() {
        return this.getAttributeString({ role: "grid" });
      }, agendaEventAttrString: function(l) {
        var f = this._getAttributes(this._eventCommonAttr, l);
        return f.role = "row", this.getAttributeString(f);
      }, agendaDetailsBtnString: function() {
        return this.getAttributeString({ role: "button", "aria-label": t.locale.labels.icon_details });
      }, gridAttrString: function() {
        return this.getAttributeString({ role: "grid" });
      }, gridRowAttrString: function(l) {
        return this.agendaEventAttrString(l);
      }, gridCellAttrString: function(l, f, g) {
        return this.getAttributeString({ role: "gridcell", "aria-label": [f.label === void 0 ? f.id : f.label, ": ", g] });
      }, mapAttrString: function() {
        return this.gridAttrString();
      }, mapRowAttrString: function(l) {
        return this.gridRowAttrString(l);
      }, mapDetailsBtnString: function() {
        return this.agendaDetailsBtnString();
      }, minicalHeader: function(l, f) {
        this.setAttributes(l, { id: f + "", "aria-live": "assertice", "aria-atomic": "true" });
      }, minicalGrid: function(l, f) {
        this.setAttributes(l, { "aria-labelledby": f + "", role: "grid" });
      }, minicalRow: function(l) {
        this.setAttributes(l, { role: "row" });
      }, minicalDayCell: function(l, f) {
        var g = f.valueOf() < t._max_date.valueOf() && f.valueOf() >= t._min_date.valueOf();
        this.setAttributes(l, { role: "gridcell", "aria-label": t.templates.day_date(f), "aria-selected": g ? "true" : "false" });
      }, minicalHeadCell: function(l) {
        this.setAttributes(l, { role: "columnheader" });
      }, weekAgendaDayCell: function(l, f) {
        var g = l.querySelector(".dhx_wa_scale_bar"), p = l.querySelector(".dhx_wa_day_data"), y = t.uid() + "";
        this.setAttributes(g, { id: y }), this.setAttributes(p, { "aria-labelledby": y });
      }, weekAgendaEvent: function(l, f) {
        this.eventAttr(f, l);
      }, lightboxHiddenAttr: function(l) {
        l.setAttribute("aria-hidden", "true");
      }, lightboxVisibleAttr: function(l) {
        l.setAttribute("aria-hidden", "false");
      }, lightboxSectionButtonAttrString: function(l) {
        return this.getAttributeString({ role: "button", "aria-label": l, tabindex: "0" });
      }, yearHeader: function(l, f) {
        this.setAttributes(l, { id: f + "" });
      }, yearGrid: function(l, f) {
        this.minicalGrid(l, f);
      }, yearHeadCell: function(l) {
        return this.minicalHeadCell(l);
      }, yearRow: function(l) {
        return this.minicalRow(l);
      }, yearDayCell: function(l) {
        this.setAttributes(l, { role: "gridcell" });
      }, lightboxAttr: function(l) {
        l.setAttribute("role", "dialog"), l.setAttribute("aria-hidden", "true"), l.firstChild.setAttribute("role", "heading");
      }, lightboxButtonAttrString: function(l) {
        return this.getAttributeString({ role: "button", "aria-label": t.locale.labels[l], tabindex: "0" });
      }, eventMenuAttrString: function(l) {
        return this.getAttributeString({ role: "button", "aria-label": t.locale.labels[l] });
      }, lightboxHeader: function(l, f) {
        l.setAttribute("aria-label", f);
      }, lightboxSelectAttrString: function(l) {
        var f = "";
        switch (l) {
          case "%Y":
            f = t.locale.labels.year;
            break;
          case "%m":
            f = t.locale.labels.month;
            break;
          case "%d":
            f = t.locale.labels.day;
            break;
          case "%H:%i":
            f = t.locale.labels.hour + " " + t.locale.labels.minute;
        }
        return t._waiAria.getAttributeString({ "aria-label": f });
      }, messageButtonAttrString: function(l) {
        return "tabindex='0' role='button' aria-label='" + l + "'";
      }, messageInfoAttr: function(l) {
        l.setAttribute("role", "alert");
      }, messageModalAttr: function(l, f) {
        l.setAttribute("role", "dialog"), f && l.setAttribute("aria-labelledby", f);
      }, quickInfoAttr: function(l) {
        l.setAttribute("role", "dialog");
      }, quickInfoHeaderAttrString: function() {
        return " role='heading' ";
      }, quickInfoHeader: function(l, f) {
        l.setAttribute("aria-label", f);
      }, quickInfoButtonAttrString: function(l) {
        return t._waiAria.getAttributeString({ role: "button", "aria-label": l, tabindex: "0" });
      }, tooltipAttr: function(l) {
        l.setAttribute("role", "tooltip");
      }, tooltipVisibleAttr: function(l) {
        l.setAttribute("aria-hidden", "false");
      }, tooltipHiddenAttr: function(l) {
        l.setAttribute("aria-hidden", "true");
      } }, t._waiAria)
        t._waiAria[m] = function(l) {
          return function() {
            return t.config.wai_aria_attributes ? l.apply(this, arguments) : " ";
          };
        }(t._waiAria[m]);
    })();
  }(h), h.utils = V, h.$domHelpers = q, h.utils.dom = q, h.uid = V.uid, h.mixin = V.mixin, h.defined = V.defined, h.assert = function(t) {
    return function(n, s) {
      n || t.config.show_errors && t.callEvent("onError", [s]) !== !1 && (t.message ? t.message({ type: "error", text: s, expire: -1 }) : console.log(s));
    };
  }(h), h.copy = V.copy, h._createDatePicker = function(t, n) {
    return new at(h, t, n);
  }, h._getFocusableNodes = q.getFocusableNodes, h._getClassName = q.getClassName, h._locate_css = q.locateCss;
  const a = De(h);
  var r, d, i;
  h.utils.mixin(h, a), h.env = h.$env = ye, h.Promise = window.Promise, function(t) {
    t.destructor = function() {
      for (var n in t.callEvent("onDestroy", []), this.clearAll(), this.$container && (this.$container.innerHTML = ""), this._eventRemoveAll && this._eventRemoveAll(), this.resetLightbox && this.resetLightbox(), this._dp && this._dp.destructor && this._dp.destructor(), this.detachAllEvents(), this)
        n.indexOf("$") === 0 && delete this[n];
      t.$destroyed = !0;
    };
  }(h), function(t) {
    function n(s, c) {
      var u = { method: s };
      if (c.length === 0)
        throw new Error("Arguments list of query is wrong.");
      if (c.length === 1)
        return typeof c[0] == "string" ? (u.url = c[0], u.async = !0) : (u.url = c[0].url, u.async = c[0].async || !0, u.callback = c[0].callback, u.headers = c[0].headers), c[0].data ? typeof c[0].data != "string" ? u.data = W(c[0].data) : u.data = c[0].data : u.data = "", u;
      switch (u.url = c[0], s) {
        case "GET":
        case "DELETE":
          u.callback = c[1], u.headers = c[2];
          break;
        case "POST":
        case "PUT":
          c[1] ? typeof c[1] != "string" ? u.data = W(c[1]) : u.data = c[1] : u.data = "", u.callback = c[2], u.headers = c[3];
      }
      return u;
    }
    t.Promise = window.Promise, t.ajax = { cache: !0, method: "get", serializeRequestParams: W, parse: function(s) {
      return typeof s != "string" ? s : (s = s.replace(/^[\s]+/, ""), typeof DOMParser > "u" || t.$env.isIE ? window.ActiveXObject !== void 0 && ((c = new window.ActiveXObject("Microsoft.XMLDOM")).async = "false", c.loadXML(s)) : c = new DOMParser().parseFromString(s, "text/xml"), c);
      var c;
    }, xmltop: function(s, c, u) {
      if (c.status === void 0 || c.status < 400) {
        var v = c.responseXML ? c.responseXML || c : this.parse(c.responseText || c);
        if (v && v.documentElement !== null && !v.getElementsByTagName("parsererror").length)
          return v.getElementsByTagName(s)[0];
      }
      return u !== -1 && t.callEvent("onLoadXMLError", ["Incorrect XML", arguments[1], u]), document.createElement("DIV");
    }, xpath: function(s, c) {
      if (c.nodeName || (c = c.responseXML || c), t.$env.isIE)
        return c.selectNodes(s) || [];
      for (var u, v = [], m = (c.ownerDocument || c).evaluate(s, c, null, XPathResult.ANY_TYPE, null); u = m.iterateNext(); )
        v.push(u);
      return v;
    }, query: function(s) {
      return this._call(s.method || "GET", s.url, s.data || "", s.async || !0, s.callback, s.headers);
    }, get: function(s, c, u) {
      var v = n("GET", arguments);
      return this.query(v);
    }, getSync: function(s, c) {
      var u = n("GET", arguments);
      return u.async = !1, this.query(u);
    }, put: function(s, c, u, v) {
      var m = n("PUT", arguments);
      return this.query(m);
    }, del: function(s, c, u) {
      var v = n("DELETE", arguments);
      return this.query(v);
    }, post: function(s, c, u, v) {
      arguments.length == 1 ? c = "" : arguments.length == 2 && typeof c == "function" && (u = c, c = "");
      var m = n("POST", arguments);
      return this.query(m);
    }, postSync: function(s, c, u) {
      c = c === null ? "" : String(c);
      var v = n("POST", arguments);
      return v.async = !1, this.query(v);
    }, _call: function(s, c, u, v, m, l) {
      return new t.Promise((function(f, g) {
        var p = typeof XMLHttpRequest === void 0 || t.$env.isIE ? new window.ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest(), y = navigator.userAgent.match(/AppleWebKit/) !== null && navigator.userAgent.match(/Qt/) !== null && navigator.userAgent.match(/Safari/) !== null;
        if (v && p.addEventListener("readystatechange", function() {
          if (p.readyState == 4 || y && p.readyState == 3) {
            if ((p.status != 200 || p.responseText === "") && !t.callEvent("onAjaxError", [p]))
              return;
            setTimeout(function() {
              typeof m == "function" && m.apply(window, [{ xmlDoc: p, filePath: c }]), f(p), typeof m == "function" && (m = null, p = null);
            }, 0);
          }
        }), s != "GET" || this.cache || (c += (c.indexOf("?") >= 0 ? "&" : "?") + "dhxr" + (/* @__PURE__ */ new Date()).getTime() + "=1"), p.open(s, c, v), l)
          for (var w in l)
            p.setRequestHeader(w, l[w]);
        else
          s.toUpperCase() == "POST" || s == "PUT" || s == "DELETE" ? p.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") : s == "GET" && (u = null);
        if (p.setRequestHeader("X-Requested-With", "XMLHttpRequest"), p.send(u), !v)
          return { xmlDoc: p, filePath: c };
      }).bind(this));
    }, urlSeparator: function(s) {
      return s.indexOf("?") != -1 ? "&" : "?";
    } }, t.$ajax = t.ajax;
  }(h), be(h), function(t) {
    t.config = { default_date: "%j %M %Y", month_date: "%F %Y", load_date: "%Y-%m-%d", week_date: "%l", day_date: "%D %j", hour_date: "%H:%i", month_day: "%d", date_format: "%Y-%m-%d %H:%i", api_date: "%d-%m-%Y %H:%i", parse_exact_format: !1, preserve_length: !0, time_step: 5, displayed_event_color: "#ff4a4a", displayed_event_text_color: "#ffef80", wide_form: 0, day_column_padding: 8, use_select_menu_space: !0, fix_tab_position: !0, start_on_monday: !0, first_hour: 0, last_hour: 24, readonly: !1, drag_resize: !0, drag_move: !0, drag_create: !0, drag_event_body: !0, dblclick_create: !0, details_on_dblclick: !0, edit_on_create: !0, details_on_create: !0, header: null, hour_size_px: 44, resize_month_events: !1, resize_month_timed: !1, responsive_lightbox: !1, separate_short_events: !0, rtl: !1, cascade_event_display: !1, cascade_event_count: 4, cascade_event_margin: 30, multi_day: !0, multi_day_height_limit: 200, drag_lightbox: !0, preserve_scroll: !0, select: !0, server_utc: !1, touch: !0, touch_tip: !0, touch_drag: 500, touch_swipe_dates: !1, quick_info_detached: !0, positive_closing: !1, drag_highlight: !0, limit_drag_out: !1, icons_edit: ["icon_save", "icon_cancel"], icons_select: ["icon_details", "icon_edit", "icon_delete"], buttons_left: ["dhx_save_btn", "dhx_cancel_btn"], buttons_right: ["dhx_delete_btn"], lightbox: { sections: [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "time", height: 72, type: "time", map_to: "auto" }] }, highlight_displayed_event: !0, left_border: !1, ajax_error: "alert", delay_render: 0, timeline_swap_resize: !0, wai_aria_attributes: !0, wai_aria_application_role: !0, csp: "auto", event_attribute: "data-event-id", show_errors: !0 }, t.config.buttons_left.$initial = t.config.buttons_left.join(), t.config.buttons_right.$initial = t.config.buttons_right.join(), t._helpers = { parseDate: function(n) {
      return (t.templates.xml_date || t.templates.parse_date)(n);
    }, formatDate: function(n) {
      return (t.templates.xml_format || t.templates.format_date)(n);
    } }, t.templates = {}, t.init_templates = function() {
      var n = t.date.date_to_str, s = t.config;
      (function(c, u) {
        for (var v in u)
          c[v] || (c[v] = u[v]);
      })(t.templates, { day_date: n(s.default_date), month_date: n(s.month_date), week_date: function(c, u) {
        return s.rtl ? t.templates.day_date(t.date.add(u, -1, "day")) + " &ndash; " + t.templates.day_date(c) : t.templates.day_date(c) + " &ndash; " + t.templates.day_date(t.date.add(u, -1, "day"));
      }, day_scale_date: n(s.default_date), time_slot_text: function(c) {
        return "";
      }, time_slot_class: function(c) {
        return "";
      }, month_scale_date: n(s.week_date), week_scale_date: n(s.day_date), hour_scale: n(s.hour_date), time_picker: n(s.hour_date), event_date: n(s.hour_date), month_day: n(s.month_day), load_format: n(s.load_date), format_date: n(s.date_format, s.server_utc), parse_date: t.date.str_to_date(s.date_format, s.server_utc), api_date: t.date.str_to_date(s.api_date, !1, !1), event_header: function(c, u, v) {
        return v._mode === "small" || v._mode === "smallest" ? t.templates.event_date(c) : t.templates.event_date(c) + " - " + t.templates.event_date(u);
      }, event_text: function(c, u, v) {
        return v.text;
      }, event_class: function(c, u, v) {
        return "";
      }, month_date_class: function(c) {
        return "";
      }, week_date_class: function(c) {
        return "";
      }, event_bar_date: function(c, u, v) {
        return t.templates.event_date(c);
      }, event_bar_text: function(c, u, v) {
        return v.text;
      }, month_events_link: function(c, u) {
        return "<a>View more(" + u + " events)</a>";
      }, drag_marker_class: function(c, u, v) {
        return "";
      }, drag_marker_content: function(c, u, v) {
        return "";
      }, tooltip_date_format: t.date.date_to_str("%Y-%m-%d %H:%i"), tooltip_text: function(c, u, v) {
        return "<b>Event:</b> " + v.text + "<br/><b>Start date:</b> " + t.templates.tooltip_date_format(c) + "<br/><b>End date:</b> " + t.templates.tooltip_date_format(u);
      }, calendar_month: n("%F %Y"), calendar_scale_date: n("%D"), calendar_date: n("%d"), calendar_time: n("%d-%m-%Y") }), this.callEvent("onTemplatesReady", []);
    };
  }(h), function(t) {
    t._events = {}, t.clearAll = function() {
      this._events = {}, this._loaded = {}, this._edit_id = null, this._select_id = null, this._drag_id = null, this._drag_mode = null, this._drag_pos = null, this._new_event = null, this.clear_view(), this.callEvent("onClearAll", []);
    }, t.addEvent = function(n, s, c, u, v) {
      if (!arguments.length)
        return this.addEventNow();
      var m = n;
      arguments.length != 1 && ((m = v || {}).start_date = n, m.end_date = s, m.text = c, m.id = u), m.id = m.id || t.uid(), m.text = m.text || "", typeof m.start_date == "string" && (m.start_date = this.templates.api_date(m.start_date)), typeof m.end_date == "string" && (m.end_date = this.templates.api_date(m.end_date));
      var l = 6e4 * (this.config.event_duration || this.config.time_step);
      m.start_date.valueOf() == m.end_date.valueOf() && m.end_date.setTime(m.end_date.valueOf() + l), m.start_date.setMilliseconds(0), m.end_date.setMilliseconds(0), m._timed = this.isOneDayEvent(m);
      var f = !this._events[m.id];
      return this._events[m.id] = m, this.event_updated(m), this._loading || this.callEvent(f ? "onEventAdded" : "onEventChanged", [m.id, m]), m.id;
    }, t.deleteEvent = function(n, s) {
      var c = this._events[n];
      (s || this.callEvent("onBeforeEventDelete", [n, c]) && this.callEvent("onConfirmedBeforeEventDelete", [n, c])) && (c && (t.getState().select_id == n && t.unselect(), delete this._events[n], this.event_updated(c), this._drag_id == c.id && (this._drag_id = null, this._drag_mode = null, this._drag_pos = null)), this.callEvent("onEventDeleted", [n, c]));
    }, t.getEvent = function(n) {
      return this._events[n];
    }, t.setEvent = function(n, s) {
      s.id || (s.id = n), this._events[n] = s;
    }, t.for_rendered = function(n, s) {
      for (var c = this._rendered.length - 1; c >= 0; c--)
        this._rendered[c].getAttribute(this.config.event_attribute) == n && s(this._rendered[c], c);
    }, t.changeEventId = function(n, s) {
      if (n != s) {
        var c = this._events[n];
        c && (c.id = s, this._events[s] = c, delete this._events[n]), this.for_rendered(n, function(u) {
          u.setAttribute("event_id", s), u.setAttribute(t.config.event_attribute, s);
        }), this._select_id == n && (this._select_id = s), this._edit_id == n && (this._edit_id = s), this.callEvent("onEventIdChange", [n, s]);
      }
    }, function() {
      for (var n = ["text", "Text", "start_date", "StartDate", "end_date", "EndDate"], s = function(v) {
        return function(m) {
          return t.getEvent(m)[v];
        };
      }, c = function(v) {
        return function(m, l) {
          var f = t.getEvent(m);
          f[v] = l, f._changed = !0, f._timed = this.isOneDayEvent(f), t.event_updated(f, !0);
        };
      }, u = 0; u < n.length; u += 2)
        t["getEvent" + n[u + 1]] = s(n[u]), t["setEvent" + n[u + 1]] = c(n[u]);
    }(), t.event_updated = function(n, s) {
      this.is_visible_events(n) ? this.render_view_data() : this.clear_event(n.id);
    }, t.is_visible_events = function(n) {
      if (!this._min_date || !this._max_date)
        return !1;
      if (n.start_date.valueOf() < this._max_date.valueOf() && this._min_date.valueOf() < n.end_date.valueOf()) {
        var s = n.start_date.getHours(), c = n.end_date.getHours() + n.end_date.getMinutes() / 60, u = this.config.last_hour, v = this.config.first_hour;
        return !(!this._table_view && (c > u || c <= v) && (s >= u || s < v) && !((n.end_date.valueOf() - n.start_date.valueOf()) / 36e5 > 24 - (this.config.last_hour - this.config.first_hour) || s < u && c > v));
      }
      return !1;
    }, t.isOneDayEvent = function(n) {
      var s = new Date(n.end_date.valueOf() - 1);
      return n.start_date.getFullYear() === s.getFullYear() && n.start_date.getMonth() === s.getMonth() && n.start_date.getDate() === s.getDate() && n.end_date.valueOf() - n.start_date.valueOf() < 864e5;
    }, t.get_visible_events = function(n) {
      var s = [];
      for (var c in this._events)
        this.is_visible_events(this._events[c]) && (n && !this._events[c]._timed || this.filter_event(c, this._events[c]) && s.push(this._events[c]));
      return s;
    }, t.filter_event = function(n, s) {
      var c = this["filter_" + this._mode];
      return !c || c(n, s);
    }, t._is_main_area_event = function(n) {
      return !!n._timed;
    }, t.render_view_data = function(n, s) {
      var c = !1;
      if (!n) {
        if (c = !0, this._not_render)
          return void (this._render_wait = !0);
        this._render_wait = !1, this.clear_view(), n = this.get_visible_events(!(this._table_view || this.config.multi_day));
      }
      for (var u = 0, v = n.length; u < v; u++)
        this._recalculate_timed(n[u]);
      if (this.config.multi_day && !this._table_view) {
        var m = [], l = [];
        for (u = 0; u < n.length; u++)
          this._is_main_area_event(n[u]) ? m.push(n[u]) : l.push(n[u]);
        if (!this._els.dhx_multi_day) {
          var f = t._commonErrorMessages.unknownView(this._mode);
          throw new Error(f);
        }
        this._rendered_location = this._els.dhx_multi_day[0], this._table_view = !0, this.render_data(l, s), this._table_view = !1, this._rendered_location = this._els.dhx_cal_data[0], this._table_view = !1, this.render_data(m, s);
      } else {
        var g = document.createDocumentFragment(), p = this._els.dhx_cal_data[0];
        this._rendered_location = g, this.render_data(n, s), p.appendChild(g), this._rendered_location = p;
      }
      c && this.callEvent("onDataRender", []);
    }, t._view_month_day = function(n) {
      var s = t.getActionData(n).date;
      t.callEvent("onViewMoreClick", [s]) && t.setCurrentView(s, "day");
    }, t._render_month_link = function(n) {
      for (var s = this._rendered_location, c = this._lame_clone(n), u = n._sday; u < n._eday; u++) {
        c._sday = u, c._eday = u + 1;
        var v = t.date, m = t._min_date;
        m = v.add(m, c._sweek, "week"), m = v.add(m, c._sday, "day");
        var l = t.getEvents(m, v.add(m, 1, "day")).length, f = this._get_event_bar_pos(c), g = f.x2 - f.x, p = document.createElement("div");
        t.event(p, "click", function(y) {
          t._view_month_day(y);
        }), p.className = "dhx_month_link", p.style.top = f.y + "px", p.style.left = f.x + "px", p.style.width = g + "px", p.innerHTML = t.templates.month_events_link(m, l), this._rendered.push(p), s.appendChild(p);
      }
    }, t._recalculate_timed = function(n) {
      var s;
      n && (s = typeof n != "object" ? this._events[n] : n) && (s._timed = t.isOneDayEvent(s));
    }, t.attachEvent("onEventChanged", t._recalculate_timed), t.attachEvent("onEventAdded", t._recalculate_timed), t.render_data = function(n, s) {
      n = this._pre_render_events(n, s);
      for (var c = {}, u = 0; u < n.length; u++)
        if (this._table_view)
          if (t._mode != "month")
            this.render_event_bar(n[u]);
          else {
            var v = t.config.max_month_events;
            v !== 1 * v || n[u]._sorder < v ? this.render_event_bar(n[u]) : v !== void 0 && n[u]._sorder == v && t._render_month_link(n[u]);
          }
        else {
          var m = n[u], l = t.locate_holder(m._sday);
          if (!l)
            continue;
          c[m._sday] || (c[m._sday] = { real: l, buffer: document.createDocumentFragment(), width: l.clientWidth });
          var f = c[m._sday];
          this.render_event(m, f.buffer, f.width);
        }
      for (var u in c)
        (f = c[u]).real && f.buffer && f.real.appendChild(f.buffer);
    }, t._get_first_visible_cell = function(n) {
      for (var s = 0; s < n.length; s++)
        if ((n[s].className || "").indexOf("dhx_scale_ignore") == -1)
          return n[s];
      return n[0];
    }, t._pre_render_events = function(n, s) {
      var c = this.xy.bar_height, u = this._colsS.heights, v = this._colsS.heights = [0, 0, 0, 0, 0, 0, 0], m = this._els.dhx_cal_data[0];
      if (n = this._table_view ? this._pre_render_events_table(n, s) : this._pre_render_events_line(n, s), this._table_view)
        if (s)
          this._colsS.heights = u;
        else {
          var l = m.querySelectorAll(".dhx_cal_month_row");
          if (l.length) {
            for (var f = 0; f < l.length; f++) {
              v[f]++;
              var g = l[f].querySelectorAll(".dhx_cal_month_cell"), p = this._colsS.height - this.xy.month_head_height;
              if (v[f] * c > p) {
                var y = p;
                1 * this.config.max_month_events !== this.config.max_month_events || v[f] <= this.config.max_month_events ? y = v[f] * c : (this.config.max_month_events + 1) * c > p && (y = (this.config.max_month_events + 1) * c), l[f].style.height = y + this.xy.month_head_height + "px";
              }
              v[f] = (v[f - 1] || 0) + t._get_first_visible_cell(g).offsetHeight;
            }
            v.unshift(0);
            const M = this.$container.querySelector(".dhx_cal_data");
            if (M.offsetHeight < M.scrollHeight && !t._colsS.scroll_fix && t.xy.scroll_width) {
              var w = t._colsS, b = w[w.col_length], k = w.heights.slice();
              b -= t.xy.scroll_width || 0, this._calc_scale_sizes(b, this._min_date, this._max_date), t._colsS.heights = k, this.set_xy(this._els.dhx_cal_header[0], b), t._render_scales(this._els.dhx_cal_header[0]), t._render_month_scale(this._els.dhx_cal_data[0], this._get_timeunit_start(), this._min_date), w.scroll_fix = !0;
            }
          } else if (n.length || this._els.dhx_multi_day[0].style.visibility != "visible" || (v[0] = -1), n.length || v[0] == -1) {
            var E = (v[0] + 1) * c + 4, D = E, x = E + "px";
            this.config.multi_day_height_limit && (x = (D = Math.min(E, this.config.multi_day_height_limit)) + "px");
            var S = this._els.dhx_multi_day[0];
            S.style.height = x, S.style.visibility = v[0] == -1 ? "hidden" : "visible", S.style.display = v[0] == -1 ? "none" : "";
            var N = this._els.dhx_multi_day[1];
            N.style.height = x, N.style.visibility = v[0] == -1 ? "hidden" : "visible", N.style.display = v[0] == -1 ? "none" : "", N.className = v[0] ? "dhx_multi_day_icon" : "dhx_multi_day_icon_small", this._dy_shift = (v[0] + 1) * c, this.config.multi_day_height_limit && (this._dy_shift = Math.min(this.config.multi_day_height_limit, this._dy_shift)), v[0] = 0, D != E && (S.style.overflowY = "auto", N.style.position = "fixed", N.style.top = "", N.style.left = "");
          }
        }
      return n;
    }, t._get_event_sday = function(n) {
      var s = this.date.day_start(new Date(n.start_date));
      return Math.round((s.valueOf() - this._min_date.valueOf()) / 864e5);
    }, t._get_event_mapped_end_date = function(n) {
      var s = n.end_date;
      if (this.config.separate_short_events) {
        var c = (n.end_date - n.start_date) / 6e4;
        c < this._min_mapped_duration && (s = this.date.add(s, this._min_mapped_duration - c, "minute"));
      }
      return s;
    }, t._pre_render_events_line = function(n, s) {
      n.sort(function(N, M) {
        return N.start_date.valueOf() == M.start_date.valueOf() ? N.id > M.id ? 1 : -1 : N.start_date > M.start_date ? 1 : -1;
      });
      var c = [], u = [];
      this._min_mapped_duration = Math.floor(60 * this.xy.min_event_height / this.config.hour_size_px);
      for (var v = 0; v < n.length; v++) {
        var m = n[v], l = m.start_date, f = m.end_date, g = l.getHours(), p = f.getHours();
        if (m._sday = this._get_event_sday(m), this._ignores[m._sday])
          n.splice(v, 1), v--;
        else {
          if (c[m._sday] || (c[m._sday] = []), !s) {
            m._inner = !1;
            for (var y = c[m._sday]; y.length; ) {
              var w = y[y.length - 1];
              if (!(this._get_event_mapped_end_date(w).valueOf() <= m.start_date.valueOf()))
                break;
              y.splice(y.length - 1, 1);
            }
            for (var b = y.length, k = !1, E = 0; E < y.length; E++)
              if (w = y[E], this._get_event_mapped_end_date(w).valueOf() <= m.start_date.valueOf()) {
                k = !0, m._sorder = w._sorder, b = E, m._inner = !0;
                break;
              }
            if (y.length && (y[y.length - 1]._inner = !0), !k)
              if (y.length)
                if (y.length <= y[y.length - 1]._sorder) {
                  if (y[y.length - 1]._sorder)
                    for (E = 0; E < y.length; E++) {
                      for (var D = !1, x = 0; x < y.length; x++)
                        if (y[x]._sorder == E) {
                          D = !0;
                          break;
                        }
                      if (!D) {
                        m._sorder = E;
                        break;
                      }
                    }
                  else
                    m._sorder = 0;
                  m._inner = !0;
                } else {
                  var S = y[0]._sorder;
                  for (E = 1; E < y.length; E++)
                    y[E]._sorder > S && (S = y[E]._sorder);
                  m._sorder = S + 1, m._inner = !1;
                }
              else
                m._sorder = 0;
            y.splice(b, b == y.length ? 0 : 1, m), y.length > (y.max_count || 0) ? (y.max_count = y.length, m._count = y.length) : m._count = m._count ? m._count : 1;
          }
          (g < this.config.first_hour || p >= this.config.last_hour) && (u.push(m), n[v] = m = this._copy_event(m), g < this.config.first_hour && (m.start_date.setHours(this.config.first_hour), m.start_date.setMinutes(0)), p >= this.config.last_hour && (m.end_date.setMinutes(0), m.end_date.setHours(this.config.last_hour)), m.start_date > m.end_date || g == this.config.last_hour) && (n.splice(v, 1), v--);
        }
      }
      if (!s) {
        for (v = 0; v < n.length; v++)
          n[v]._count = c[n[v]._sday].max_count;
        for (v = 0; v < u.length; v++)
          u[v]._count = c[u[v]._sday].max_count;
      }
      return n;
    }, t._time_order = function(n) {
      n.sort(function(s, c) {
        return s.start_date.valueOf() == c.start_date.valueOf() ? s._timed && !c._timed ? 1 : !s._timed && c._timed ? -1 : s.id > c.id ? 1 : -1 : s.start_date > c.start_date ? 1 : -1;
      });
    }, t._is_any_multiday_cell_visible = function(n, s, c) {
      var u = this._cols.length, v = !1, m = n, l = !0, f = new Date(s);
      for (t.date.day_start(new Date(s)).valueOf() != s.valueOf() && (f = t.date.day_start(f), f = t.date.add(f, 1, "day")); m < f; ) {
        l = !1;
        var g = this.locate_holder_day(m, !1, c) % u;
        if (!this._ignores[g]) {
          v = !0;
          break;
        }
        m = t.date.add(m, 1, "day");
      }
      return l || v;
    }, t._pre_render_events_table = function(n, s) {
      this._time_order(n);
      for (var c, u = [], v = [[], [], [], [], [], [], []], m = this._colsS.heights, l = this._cols.length, f = {}, g = 0; g < n.length; g++) {
        var p = n[g], y = p.id;
        f[y] || (f[y] = { first_chunk: !0, last_chunk: !0 });
        var w = f[y], b = c || p.start_date, k = p.end_date;
        b < this._min_date && (w.first_chunk = !1, b = this._min_date), k > this._max_date && (w.last_chunk = !1, k = this._max_date);
        var E = this.locate_holder_day(b, !1, p);
        if (p._sday = E % l, !this._ignores[p._sday] || !p._timed) {
          var D = this.locate_holder_day(k, !0, p) || l;
          if (p._eday = D % l || l, p._length = D - E, p._sweek = Math.floor((this._correct_shift(b.valueOf(), 1) - this._min_date.valueOf()) / (864e5 * l)), t._is_any_multiday_cell_visible(b, k, p)) {
            var x, S = v[p._sweek];
            for (x = 0; x < S.length && !(S[x]._eday <= p._sday); x++)
              ;
            if (p._sorder && s || (p._sorder = x), p._sday + p._length <= l)
              c = null, u.push(p), S[x] = p, m[p._sweek] = S.length - 1, p._first_chunk = w.first_chunk, p._last_chunk = w.last_chunk;
            else {
              var N = this._copy_event(p);
              N.id = p.id, N._length = l - p._sday, N._eday = l, N._sday = p._sday, N._sweek = p._sweek, N._sorder = p._sorder, N.end_date = this.date.add(b, N._length, "day"), N._first_chunk = w.first_chunk, w.first_chunk && (w.first_chunk = !1), u.push(N), S[x] = N, c = N.end_date, m[p._sweek] = S.length - 1, g--;
            }
          } else
            c = null;
        }
      }
      return u;
    }, t._copy_dummy = function() {
      var n = new Date(this.start_date), s = new Date(this.end_date);
      this.start_date = n, this.end_date = s;
    }, t._copy_event = function(n) {
      return this._copy_dummy.prototype = n, new this._copy_dummy();
    }, t._rendered = [], t.clear_view = function() {
      for (var n = 0; n < this._rendered.length; n++) {
        var s = this._rendered[n];
        s.parentNode && s.parentNode.removeChild(s);
      }
      this._rendered = [];
    }, t.updateEvent = function(n) {
      var s = this.getEvent(n);
      this.clear_event(n), s && this.is_visible_events(s) && this.filter_event(n, s) && (this._table_view || this.config.multi_day || s._timed) && (this.config.update_render ? this.render_view_data() : this.getState().mode != "month" || this.getState().drag_id || this.isOneDayEvent(s) ? this.render_view_data([s], !0) : this.render_view_data());
    }, t.clear_event = function(n) {
      this.for_rendered(n, function(s, c) {
        s.parentNode && s.parentNode.removeChild(s), t._rendered.splice(c, 1);
      });
    }, t._y_from_date = function(n) {
      var s = 60 * n.getHours() + n.getMinutes();
      return Math.round((60 * s * 1e3 - 60 * this.config.first_hour * 60 * 1e3) * this.config.hour_size_px / 36e5) % (24 * this.config.hour_size_px);
    }, t._calc_event_y = function(n, s) {
      s = s || 0;
      var c = 60 * n.start_date.getHours() + n.start_date.getMinutes(), u = 60 * n.end_date.getHours() + n.end_date.getMinutes() || 60 * t.config.last_hour;
      return { top: this._y_from_date(n.start_date), height: Math.max(s, (u - c) * this.config.hour_size_px / 60) };
    }, t.render_event = function(n, s, c) {
      var u = t.xy.menu_width, v = this.config.use_select_menu_space ? 0 : u;
      if (!(n._sday < 0)) {
        var m = t.locate_holder(n._sday);
        if (m) {
          s = s || m;
          var l = this._calc_event_y(n, t.xy.min_event_height), f = l.top, g = l.height, p = n._count || 1, y = n._sorder || 0;
          c = c || m.clientWidth, this.config.day_column_padding && (c -= this.config.day_column_padding);
          var w = Math.floor((c - v) / p), b = y * w + 1;
          if (n._inner || (w *= p - y), this.config.cascade_event_display) {
            var k = this.config.cascade_event_count, E = this.config.cascade_event_margin;
            b = y % k * E;
            var D = n._inner ? (p - y - 1) % k * E / 2 : 0;
            w = Math.floor(c - v - b - D);
          }
          n._mode = g < 30 ? "smallest" : g < 42 ? "small" : null;
          var x = this._render_v_bar(n, v + b, f, w, g, n._text_style, t.templates.event_header(n.start_date, n.end_date, n), t.templates.event_text(n.start_date, n.end_date, n));
          if (n._mode === "smallest" ? x.classList.add("dhx_cal_event--xsmall") : n._mode === "small" && x.classList.add("dhx_cal_event--small"), this._waiAria.eventAttr(n, x), this._rendered.push(x), s.appendChild(x), b = b + parseInt(this.config.rtl ? m.style.right : m.style.left, 10) + v, this._edit_id == n.id) {
            x.style.zIndex = 1, w = Math.max(w, t.xy.editor_width), (x = document.createElement("div")).setAttribute("event_id", n.id), x.setAttribute(this.config.event_attribute, n.id), this._waiAria.eventAttr(n, x), x.className = "dhx_cal_event dhx_cal_editor", this.config.rtl && b++, this.set_xy(x, w, g, b, f), n.color && x.style.setProperty("--dhx-scheduler-event-background", n.color);
            var S = t.templates.event_class(n.start_date, n.end_date, n);
            S && (x.className += " " + S);
            var N = document.createElement("div");
            N.style.cssText += "overflow:hidden;height:100%", x.appendChild(N), this._els.dhx_cal_data[0].appendChild(x), this._rendered.push(x), N.innerHTML = "<textarea class='dhx_cal_editor'>" + n.text + "</textarea>", this._editor = N.querySelector("textarea"), t.event(this._editor, "keydown", function(L) {
              if (L.shiftKey)
                return !0;
              var H = L.keyCode;
              H == t.keys.edit_save && t.editStop(!0), H == t.keys.edit_cancel && t.editStop(!1), H != t.keys.edit_save && H != t.keys.edit_cancel || L.preventDefault && L.preventDefault();
            }), t.event(this._editor, "selectstart", function(L) {
              return L.cancelBubble = !0, !0;
            }), t._focus(this._editor, !0), this._els.dhx_cal_data[0].scrollLeft = 0;
          }
          if (this.xy.menu_width !== 0 && this._select_id == n.id) {
            this.config.cascade_event_display && this._drag_mode && (x.style.zIndex = 1);
            for (var M, A = this.config["icons_" + (this._edit_id == n.id ? "edit" : "select")], C = "", T = 0; T < A.length; T++) {
              const L = A[T];
              M = this._waiAria.eventMenuAttrString(L), C += `<div class='dhx_menu_icon ${L}' title='${this.locale.labels[L]}' ${M}></div>`;
            }
            var O = this._render_v_bar(n, b - u - 1, f, u, null, "", "<div class='dhx_menu_head'></div>", C, !0);
            n.color && O.style.setProperty("--dhx-scheduler-event-background", n.color), n.textColor && O.style.setProperty("--dhx-scheduler-event-color", n.textColor), this._els.dhx_cal_data[0].appendChild(O), this._rendered.push(O);
          }
          this.config.drag_highlight && this._drag_id == n.id && this.highlightEventPosition(n);
        }
      }
    }, t._render_v_bar = function(n, s, c, u, v, m, l, f, g) {
      var p = document.createElement("div"), y = n.id, w = g ? "dhx_cal_event dhx_cal_select_menu" : "dhx_cal_event", b = t.getState();
      b.drag_id == n.id && (w += " dhx_cal_event_drag"), b.select_id == n.id && (w += " dhx_cal_event_selected");
      var k = t.templates.event_class(n.start_date, n.end_date, n);
      k && (w = w + " " + k), this.config.cascade_event_display && (w += " dhx_cal_event_cascade");
      var E = u - 1, D = '<div event_id="' + y + '" ' + this.config.event_attribute + '="' + y + '" class="' + w + '" style="position:absolute; top:' + c + "px; " + (this.config.rtl ? "right:" : "left:") + s + "px; width:" + E + "px; height:" + v + "px;" + (m || "") + '"></div>';
      p.innerHTML = D;
      var x = p.cloneNode(!0).firstChild;
      if (!g && t.renderEvent(x, n, u, v, l, f))
        return n.color && x.style.setProperty("--dhx-scheduler-event-background", n.color), n.textColor && x.style.setProperty("--dhx-scheduler-event-color", n.textColor), x;
      x = p.firstChild, n.color && x.style.setProperty("--dhx-scheduler-event-background", n.color), n.textColor && x.style.setProperty("--dhx-scheduler-event-color", n.textColor);
      var S = '<div class="dhx_event_move dhx_header" >&nbsp;</div>';
      S += '<div class="dhx_event_move dhx_title">' + l + "</div>", S += '<div class="dhx_body">' + f + "</div>";
      var N = "dhx_event_resize dhx_footer";
      return (g || n._drag_resize === !1) && (N = "dhx_resize_denied " + N), S += '<div class="' + N + '" style=" width:' + (g ? " margin-top:-1px;" : "") + '" ></div>', x.innerHTML = S, x;
    }, t.renderEvent = function() {
      return !1;
    }, t.locate_holder = function(n) {
      return this._mode == "day" ? this._els.dhx_cal_data[0].firstChild : this._els.dhx_cal_data[0].childNodes[n];
    }, t.locate_holder_day = function(n, s) {
      var c = Math.floor((this._correct_shift(n, 1) - this._min_date) / 864e5);
      return s && this.date.time_part(n) && c++, c;
    }, t._get_dnd_order = function(n, s, c) {
      if (!this._drag_event)
        return n;
      this._drag_event._orig_sorder ? n = this._drag_event._orig_sorder : this._drag_event._orig_sorder = n;
      for (var u = s * n; u + s > c; )
        n--, u -= s;
      return Math.max(n, 0);
    }, t._get_event_bar_pos = function(n) {
      var s = this.config.rtl, c = this._colsS, u = c[n._sday], v = c[n._eday];
      s && (u = c[c.col_length] - c[n._eday] + c[0], v = c[c.col_length] - c[n._sday] + c[0]), v == u && (v = c[n._eday + 1]);
      var m = this.xy.bar_height, l = n._sorder;
      if (n.id == this._drag_id) {
        var f = c.heights[n._sweek + 1] - c.heights[n._sweek] - this.xy.month_head_height;
        l = t._get_dnd_order(l, m, f);
      }
      var g = l * m;
      return { x: u, x2: v, y: c.heights[n._sweek] + (c.height ? this.xy.month_scale_height + 2 : 2) + g };
    }, t.render_event_bar = function(n) {
      var s = this._rendered_location, c = this._get_event_bar_pos(n), u = c.y, v = c.x, m = c.x2, l = "";
      if (m) {
        var f = t.config.resize_month_events && this._mode == "month" && (!n._timed || t.config.resize_month_timed), g = document.createElement("div"), p = n.hasOwnProperty("_first_chunk") && n._first_chunk, y = n.hasOwnProperty("_last_chunk") && n._last_chunk, w = f && (n._timed || p), b = f && (n._timed || y), k = !0, E = "dhx_cal_event_clear";
        n._timed && !f || (k = !1, E = "dhx_cal_event_line"), p && (E += " dhx_cal_event_line_start"), y && (E += " dhx_cal_event_line_end"), w && (l += "<div class='dhx_event_resize dhx_event_resize_start'></div>"), b && (l += "<div class='dhx_event_resize dhx_event_resize_end'></div>");
        var D = t.templates.event_class(n.start_date, n.end_date, n);
        D && (E += " " + D);
        var x = n.color ? "--dhx-scheduler-event-background:" + n.color + ";" : "", S = n.textColor ? "--dhx-scheduler-event-color:" + n.textColor + ";" : "", N = ["position:absolute", "top:" + u + "px", "left:" + v + "px", "width:" + (m - v - (k ? 1 : 0)) + "px", "height:" + (this.xy.bar_height - 2) + "px", S, x, n._text_style || ""].join(";"), M = "<div event_id='" + n.id + "' " + this.config.event_attribute + "='" + n.id + "' class='" + E + "' style='" + N + "'" + this._waiAria.eventBarAttrString(n) + ">";
        f && (M += l), t.getState().mode == "month" && (n = t.getEvent(n.id)), n._timed && (M += `<span class='dhx_cal_event_clear_date'>${t.templates.event_bar_date(n.start_date, n.end_date, n)}</span>`), M += "<div class='dhx_cal_event_line_content'>", M += t.templates.event_bar_text(n.start_date, n.end_date, n) + "</div>", M += "</div>", M += "</div>", g.innerHTML = M, this._rendered.push(g.firstChild), s.appendChild(g.firstChild);
      }
    }, t._locate_event = function(n) {
      for (var s = null; n && !s && n.getAttribute; )
        s = n.getAttribute(this.config.event_attribute), n = n.parentNode;
      return s;
    }, t.edit = function(n) {
      this._edit_id != n && (this.editStop(!1, n), this._edit_id = n, this.updateEvent(n));
    }, t.editStop = function(n, s) {
      if (!s || this._edit_id != s) {
        var c = this.getEvent(this._edit_id);
        c && (n && (c.text = this._editor.value), this._edit_id = null, this._editor = null, this.updateEvent(c.id), this._edit_stop_event(c, n));
      }
    }, t._edit_stop_event = function(n, s) {
      this._new_event ? (s ? this.callEvent("onEventAdded", [n.id, n]) : n && this.deleteEvent(n.id, !0), this._new_event = null) : s && this.callEvent("onEventChanged", [n.id, n]);
    }, t.getEvents = function(n, s) {
      var c = [];
      for (var u in this._events) {
        var v = this._events[u];
        v && (!n && !s || v.start_date < s && v.end_date > n) && c.push(v);
      }
      return c;
    }, t.getRenderedEvent = function(n) {
      if (n) {
        for (var s = t._rendered, c = 0; c < s.length; c++) {
          var u = s[c];
          if (u.getAttribute(t.config.event_attribute) == n)
            return u;
        }
        return null;
      }
    }, t.showEvent = function(n, s) {
      n && typeof n == "object" && (s = n.mode, y = n.section, n = n.section);
      var c = typeof n == "number" || typeof n == "string" ? t.getEvent(n) : n;
      if (s = s || t._mode, c && (!this.checkEvent("onBeforeEventDisplay") || this.callEvent("onBeforeEventDisplay", [c, s]))) {
        var u = t.config.scroll_hour;
        t.config.scroll_hour = c.start_date.getHours();
        var v = t.config.preserve_scroll;
        t.config.preserve_scroll = !1;
        var m = c.color, l = c.textColor;
        if (t.config.highlight_displayed_event && (c.color = t.config.displayed_event_color, c.textColor = t.config.displayed_event_text_color), t.setCurrentView(new Date(c.start_date), s), t.config.scroll_hour = u, t.config.preserve_scroll = v, t.matrix && t.matrix[s]) {
          var f = t.getView(), g = f.y_property, p = t.getEvent(c.id);
          if (p) {
            if (!y) {
              var y = p[g];
              Array.isArray(y) ? y = y[0] : typeof y == "string" && t.config.section_delimiter && y.indexOf(t.config.section_delimiter) > -1 && (y = y.split(t.config.section_delimiter)[0]);
            }
            var w = f.getSectionTop(y), b = f.posFromDate(p.start_date), k = t.$container.querySelector(".dhx_timeline_data_wrapper");
            if (b -= (k.offsetWidth - f.dx) / 2, w = w - k.offsetHeight / 2 + f.dy / 2, f._smartRenderingEnabled())
              var E = f.attachEvent("onScroll", function() {
                D(), f.detachEvent(E);
              });
            f.scrollTo({ left: b, top: w }), f._smartRenderingEnabled() || D();
          }
        } else
          D();
        t.callEvent("onAfterEventDisplay", [c, s]);
      }
      function D() {
        c.color = m, c.textColor = l;
      }
    };
  }(h), function(t) {
    t._append_drag_marker = function(n) {
      if (!n.parentNode) {
        var s = t._els.dhx_cal_data[0].lastChild, c = t._getClassName(s);
        c.indexOf("dhx_scale_holder") < 0 && s.previousSibling && (s = s.previousSibling), c = t._getClassName(s), s && c.indexOf("dhx_scale_holder") === 0 && s.appendChild(n);
      }
    }, t._update_marker_position = function(n, s) {
      var c = t._calc_event_y(s, 0);
      n.style.top = c.top + "px", n.style.height = c.height + "px";
    }, t.highlightEventPosition = function(n) {
      var s = document.createElement("div");
      s.setAttribute("event_id", n.id), s.setAttribute(this.config.event_attribute, n.id), this._rendered.push(s), this._update_marker_position(s, n);
      var c = this.templates.drag_marker_class(n.start_date, n.end_date, n), u = this.templates.drag_marker_content(n.start_date, n.end_date, n);
      s.className = "dhx_drag_marker", c && (s.className += " " + c), u && (s.innerHTML = u), this._append_drag_marker(s);
    };
  }(h), xe(h), function(t) {
    function n() {
      const s = t.config.csp === !0, c = !!window.Sfdc || !!window.$A || window.Aura || "$shadowResolver$" in document.body;
      return s || c ? t.$root : document.body;
    }
    t._lightbox_controls = {}, t.formSection = function(s) {
      for (var c = this.config.lightbox.sections, u = 0; u < c.length && c[u].name != s; u++)
        ;
      if (u === c.length)
        return null;
      var v = c[u];
      t._lightbox || t.getLightbox();
      var m = t._lightbox.querySelector(`#${v.id}`), l = m.nextSibling, f = { section: v, header: m, node: l, getValue: function(p) {
        return t.form_blocks[v.type].get_value(l, p || {}, v);
      }, setValue: function(p, y) {
        return t.form_blocks[v.type].set_value(l, p, y || {}, v);
      } }, g = t._lightbox_controls["get_" + v.type + "_control"];
      return g ? g(f) : f;
    }, t._lightbox_controls.get_template_control = function(s) {
      return s.control = s.node, s;
    }, t._lightbox_controls.get_select_control = function(s) {
      return s.control = s.node.getElementsByTagName("select")[0], s;
    }, t._lightbox_controls.get_textarea_control = function(s) {
      return s.control = s.node.getElementsByTagName("textarea")[0], s;
    }, t._lightbox_controls.get_time_control = function(s) {
      return s.control = s.node.getElementsByTagName("select"), s;
    }, t._lightbox_controls.defaults = { template: { height: 30 }, textarea: { height: 200 }, select: { height: 23 }, time: { height: 20 } }, t.form_blocks = { template: { render: function(s) {
      return "<div class='dhx_cal_ltext dhx_cal_template' ></div>";
    }, set_value: function(s, c, u, v) {
      s.innerHTML = c || "";
    }, get_value: function(s, c, u) {
      return s.innerHTML || "";
    }, focus: function(s) {
    } }, textarea: { render: function(s) {
      return `<div class='dhx_cal_ltext'><textarea ${s.placeholder ? `placeholder='${s.placeholder}'` : ""}></textarea></div>`;
    }, set_value: function(s, c, u) {
      t.form_blocks.textarea._get_input(s).value = c || "";
    }, get_value: function(s, c) {
      return t.form_blocks.textarea._get_input(s).value;
    }, focus: function(s) {
      var c = t.form_blocks.textarea._get_input(s);
      t._focus(c, !0);
    }, _get_input: function(s) {
      return s.getElementsByTagName("textarea")[0];
    } }, select: { render: function(s) {
      for (var c = "<div class='dhx_cal_ltext dhx_cal_select'><select style='width:100%;'>", u = 0; u < s.options.length; u++)
        c += "<option value='" + s.options[u].key + "'>" + s.options[u].label + "</option>";
      return c + "</select></div>";
    }, set_value: function(s, c, u, v) {
      var m = s.firstChild;
      !m._dhx_onchange && v.onchange && (t.event(m, "change", v.onchange), m._dhx_onchange = !0), c === void 0 && (c = (m.options[0] || {}).value), m.value = c || "";
    }, get_value: function(s, c) {
      return s.firstChild.value;
    }, focus: function(s) {
      var c = s.firstChild;
      t._focus(c, !0);
    } }, time: { render: function(s) {
      s.time_format || (s.time_format = ["%H:%i", "%d", "%m", "%Y"]), s._time_format_order = {};
      var c = s.time_format, u = t.config, v = t.date.date_part(t._currentDate()), m = 1440, l = 0;
      t.config.limit_time_select && (m = 60 * u.last_hour + 1, l = 60 * u.first_hour, v.setHours(u.first_hour));
      for (var f = "", g = 0; g < c.length; g++) {
        var p = c[g];
        g > 0 && (f += " ");
        var y = "", w = "";
        switch (p) {
          case "%Y":
            var b, k, E;
            y = "dhx_lightbox_year_select", s._time_format_order[3] = g, s.year_range && (isNaN(s.year_range) ? s.year_range.push && (k = s.year_range[0], E = s.year_range[1]) : b = s.year_range), b = b || 10;
            var D = D || Math.floor(b / 2);
            k = k || v.getFullYear() - D, E = E || k + b;
            for (var x = k; x < E; x++)
              w += "<option value='" + x + "'>" + x + "</option>";
            break;
          case "%m":
            for (y = "dhx_lightbox_month_select", s._time_format_order[2] = g, x = 0; x < 12; x++)
              w += "<option value='" + x + "'>" + this.locale.date.month_full[x] + "</option>";
            break;
          case "%d":
            for (y = "dhx_lightbox_day_select", s._time_format_order[1] = g, x = 1; x < 32; x++)
              w += "<option value='" + x + "'>" + x + "</option>";
            break;
          case "%H:%i":
            y = "dhx_lightbox_time_select", s._time_format_order[0] = g, x = l;
            var S = v.getDate();
            for (s._time_values = []; x < m; )
              w += "<option value='" + x + "'>" + this.templates.time_picker(v) + "</option>", s._time_values.push(x), v.setTime(v.valueOf() + 60 * this.config.time_step * 1e3), x = 24 * (v.getDate() != S ? 1 : 0) * 60 + 60 * v.getHours() + v.getMinutes();
        }
        if (w) {
          var N = t._waiAria.lightboxSelectAttrString(p);
          f += "<select class='" + y + "' " + (s.readonly ? "disabled='disabled'" : "") + N + ">" + w + "</select> ";
        }
      }
      return "<div class='dhx_section_time'>" + f + "<span style='font-weight:normal; font-size:10pt;' class='dhx_section_time_spacer'> &nbsp;&ndash;&nbsp; </span>" + f + "</div>";
    }, set_value: function(s, c, u, v) {
      var m, l, f = t.config, g = s.getElementsByTagName("select"), p = v._time_format_order;
      if (f.full_day) {
        if (!s._full_day) {
          var y = "<label class='dhx_fullday'><input type='checkbox' name='full_day' value='true'> " + t.locale.labels.full_day + "&nbsp;</label></input>";
          t.config.wide_form || (y = s.previousSibling.innerHTML + y), s.previousSibling.innerHTML = y, s._full_day = !0;
        }
        var w = s.previousSibling.getElementsByTagName("input")[0];
        w.checked = t.date.time_part(u.start_date) === 0 && t.date.time_part(u.end_date) === 0, g[p[0]].disabled = w.checked, g[p[0] + g.length / 2].disabled = w.checked, w.$_eventAttached || (w.$_eventAttached = !0, t.event(w, "click", function() {
          if (w.checked) {
            var D = {};
            t.form_blocks.time.get_value(s, D, v), m = t.date.date_part(D.start_date), (+(l = t.date.date_part(D.end_date)) == +m || +l >= +m && (u.end_date.getHours() !== 0 || u.end_date.getMinutes() !== 0)) && (l = t.date.add(l, 1, "day"));
          } else
            m = null, l = null;
          g[p[0]].disabled = w.checked, g[p[0] + g.length / 2].disabled = w.checked, E(g, 0, m || u.start_date), E(g, 4, l || u.end_date);
        }));
      }
      if (f.auto_end_date && f.event_duration)
        for (var b = function() {
          f.auto_end_date && f.event_duration && (m = new Date(g[p[3]].value, g[p[2]].value, g[p[1]].value, 0, g[p[0]].value), l = new Date(m.getTime() + 60 * t.config.event_duration * 1e3), E(g, 4, l));
        }, k = 0; k < 4; k++)
          g[k].$_eventAttached || (g[k].$_eventAttached = !0, t.event(g[k], "change", b));
      function E(D, x, S) {
        for (var N = v._time_values, M = 60 * S.getHours() + S.getMinutes(), A = M, C = !1, T = 0; T < N.length; T++) {
          var O = N[T];
          if (O === M) {
            C = !0;
            break;
          }
          O < M && (A = O);
        }
        D[x + p[0]].value = C ? M : A, C || A || (D[x + p[0]].selectedIndex = -1), D[x + p[1]].value = S.getDate(), D[x + p[2]].value = S.getMonth(), D[x + p[3]].value = S.getFullYear();
      }
      E(g, 0, u.start_date), E(g, 4, u.end_date);
    }, get_value: function(s, c, u) {
      var v = s.getElementsByTagName("select"), m = u._time_format_order;
      if (c.start_date = new Date(v[m[3]].value, v[m[2]].value, v[m[1]].value, 0, v[m[0]].value), c.end_date = new Date(v[m[3] + 4].value, v[m[2] + 4].value, v[m[1] + 4].value, 0, v[m[0] + 4].value), !v[m[3]].value || !v[m[3] + 4].value) {
        var l = t.getEvent(t._lightbox_id);
        l && (c.start_date = l.start_date, c.end_date = l.end_date);
      }
      return c.end_date <= c.start_date && (c.end_date = t.date.add(c.start_date, t.config.time_step, "minute")), { start_date: new Date(c.start_date), end_date: new Date(c.end_date) };
    }, focus: function(s) {
      t._focus(s.getElementsByTagName("select")[0]);
    } } }, t._setLbPosition = function(s) {
      s && (s.style.top = Math.max(n().offsetHeight / 2 - s.offsetHeight / 2, 0) + "px", s.style.left = Math.max(n().offsetWidth / 2 - s.offsetWidth / 2, 0) + "px");
    }, t.showCover = function(s) {
      s && (s.style.display = "block", this._setLbPosition(s)), t.config.responsive_lightbox && (document.documentElement.classList.add("dhx_cal_overflow_container"), n().classList.add("dhx_cal_overflow_container")), this.show_cover(), this._cover.style.display = "";
    }, t.showLightbox = function(s) {
      if (s)
        if (this.callEvent("onBeforeLightbox", [s])) {
          this.showCover(c);
          var c = this.getLightbox();
          this._setLbPosition(c), this._fill_lightbox(s, c), this._waiAria.lightboxVisibleAttr(c), this.callEvent("onLightbox", [s]);
        } else
          this._new_event && (this._new_event = null);
    }, t._fill_lightbox = function(s, c) {
      var u = this.getEvent(s), v = c.getElementsByTagName("span"), m = [];
      if (t.templates.lightbox_header) {
        m.push("");
        var l = t.templates.lightbox_header(u.start_date, u.end_date, u);
        m.push(l), v[1].innerHTML = "", v[2].innerHTML = l;
      } else {
        var f = this.templates.event_header(u.start_date, u.end_date, u), g = (this.templates.event_bar_text(u.start_date, u.end_date, u) || "").substr(0, 70);
        m.push(f), m.push(g), v[1].innerHTML = f, v[2].innerHTML = g;
      }
      this._waiAria.lightboxHeader(c, m.join(" "));
      for (var p = this.config.lightbox.sections, y = 0; y < p.length; y++) {
        var w = p[y], b = t._get_lightbox_section_node(w), k = this.form_blocks[w.type], E = u[w.map_to] !== void 0 ? u[w.map_to] : w.default_value;
        k.set_value.call(this, b, E, u, w), p[y].focus && k.focus.call(this, b);
      }
      t._lightbox_id = s;
    }, t._get_lightbox_section_node = function(s) {
      return t._lightbox.querySelector(`#${s.id}`).nextSibling;
    }, t._lightbox_out = function(s) {
      for (var c = this.config.lightbox.sections, u = 0; u < c.length; u++) {
        var v = t._lightbox.querySelector(`#${c[u].id}`);
        v = v && v.nextSibling;
        var m = this.form_blocks[c[u].type].get_value.call(this, v, s, c[u]);
        c[u].map_to != "auto" && (s[c[u].map_to] = m);
      }
      return s;
    }, t._empty_lightbox = function(s) {
      var c = t._lightbox_id, u = this.getEvent(c);
      this._lame_copy(u, s), this.setEvent(u.id, u), this._edit_stop_event(u, !0), this.render_view_data();
    }, t.hide_lightbox = function(s) {
      t.endLightbox(!1, this.getLightbox());
    }, t.hideCover = function(s) {
      s && (s.style.display = "none"), this.hide_cover(), t.config.responsive_lightbox && (document.documentElement.classList.remove("dhx_cal_overflow_container"), n().classList.remove("dhx_cal_overflow_container"));
    }, t.hide_cover = function() {
      this._cover && this._cover.parentNode.removeChild(this._cover), this._cover = null;
    }, t.show_cover = function() {
      this._cover || (this._cover = document.createElement("div"), this._cover.className = "dhx_cal_cover", this._cover.style.display = "none", t.event(this._cover, "mousemove", t._move_while_dnd), t.event(this._cover, "mouseup", t._finish_dnd), n().appendChild(this._cover));
    }, t.save_lightbox = function() {
      var s = this._lightbox_out({}, this._lame_copy(this.getEvent(this._lightbox_id)));
      this.checkEvent("onEventSave") && !this.callEvent("onEventSave", [this._lightbox_id, s, this._new_event]) || (this._empty_lightbox(s), this.hide_lightbox());
    }, t.startLightbox = function(s, c) {
      this._lightbox_id = s, this._custom_lightbox = !0, this._temp_lightbox = this._lightbox, this._lightbox = c, this.showCover(c);
    }, t.endLightbox = function(s, c) {
      c = c || t.getLightbox();
      var u = t.getEvent(this._lightbox_id);
      u && this._edit_stop_event(u, s), s && t.render_view_data(), this.hideCover(c), this._custom_lightbox && (this._lightbox = this._temp_lightbox, this._custom_lightbox = !1), this._temp_lightbox = this._lightbox_id = null, this._waiAria.lightboxHiddenAttr(c), this.resetLightbox(), this.callEvent("onAfterLightbox", []);
    }, t.resetLightbox = function() {
      t._lightbox && !t._custom_lightbox && t._lightbox.parentNode.removeChild(t._lightbox), t._lightbox = null;
    }, t.cancel_lightbox = function() {
      this._lightbox_id && this.callEvent("onEventCancel", [this._lightbox_id, !!this._new_event]), this.hide_lightbox();
    }, t.hideLightbox = t.cancel_lightbox, t._init_lightbox_events = function() {
      if (this.getLightbox().$_eventAttached)
        return;
      const s = this.getLightbox();
      s.$_eventAttached = !0, t.event(s, "click", function(c) {
        c.target.closest(".dhx_cal_ltitle_close_btn") && t.cancel_lightbox();
        const u = t.$domHelpers.closest(c.target, ".dhx_btn_set");
        if (!u) {
          const l = t.$domHelpers.closest(c.target, ".dhx_custom_button[data-section-index]");
          if (l) {
            const f = Number(l.getAttribute("data-section-index"));
            t.form_blocks[t.config.lightbox.sections[f].type].button_click(t.$domHelpers.closest(l, ".dhx_cal_lsection"), l, c);
          }
          return;
        }
        const v = u ? u.getAttribute("data-action") : null;
        switch (v) {
          case "dhx_save_btn":
          case "save":
            if (t.config.readonly_active)
              return;
            t.save_lightbox();
            break;
          case "dhx_delete_btn":
          case "delete":
            if (t.config.readonly_active)
              return;
            var m = t.locale.labels.confirm_deleting;
            t._dhtmlx_confirm({ message: m, title: t.locale.labels.title_confirm_deleting, callback: function() {
              t.deleteEvent(t._lightbox_id), t._new_event = null, t.hide_lightbox();
            }, config: { ok: t.locale.labels.icon_delete } });
            break;
          case "dhx_cancel_btn":
          case "cancel":
            t.cancel_lightbox();
            break;
          default:
            t.callEvent("onLightboxButton", [v, u, c]);
        }
      }), t.event(s, "keydown", function(c) {
        var u = c || window.event, v = c.target || c.srcElement, m = v.querySelector("[dhx_button]");
        switch (m || (m = v.parentNode.querySelector(".dhx_custom_button, .dhx_readonly")), (c || u).keyCode) {
          case 32:
            if ((c || u).shiftKey)
              return;
            m && m.click && m.click();
            break;
          case t.keys.edit_save:
            if ((c || u).shiftKey)
              return;
            if (m && m.click)
              m.click();
            else {
              if (t.config.readonly_active)
                return;
              t.save_lightbox();
            }
            break;
          case t.keys.edit_cancel:
            t.cancel_lightbox();
        }
      });
    }, t.setLightboxSize = function() {
    }, t._init_dnd_events = function() {
      t.event(n(), "mousemove", t._move_while_dnd), t.event(n(), "mouseup", t._finish_dnd), t._init_dnd_events = function() {
      };
    }, t._move_while_dnd = function(s) {
      if (t._dnd_start_lb) {
        document.dhx_unselectable || (n().classList.add("dhx_unselectable"), document.dhx_unselectable = !0);
        var c = t.getLightbox(), u = [s.pageX, s.pageY];
        c.style.top = t._lb_start[1] + u[1] - t._dnd_start_lb[1] + "px", c.style.left = t._lb_start[0] + u[0] - t._dnd_start_lb[0] + "px";
      }
    }, t._ready_to_dnd = function(s) {
      var c = t.getLightbox();
      t._lb_start = [c.offsetLeft, c.offsetTop], t._dnd_start_lb = [s.pageX, s.pageY];
    }, t._finish_dnd = function() {
      t._lb_start && (t._lb_start = t._dnd_start_lb = !1, n().classList.remove("dhx_unselectable"), document.dhx_unselectable = !1);
    }, t.getLightbox = function() {
      if (!this._lightbox) {
        var s = document.createElement("div");
        s.className = "dhx_cal_light", t.config.wide_form && (s.className += " dhx_cal_light_wide"), t.form_blocks.recurring && (s.className += " dhx_cal_light_rec"), t.config.rtl && (s.className += " dhx_cal_light_rtl"), t.config.responsive_lightbox && (s.className += " dhx_cal_light_responsive"), s.style.visibility = "hidden";
        var c = this._lightbox_template, u = this.config.buttons_left;
        c += "<div class='dhx_cal_lcontrols'>";
        for (var v = 0; v < u.length; v++)
          c += "<div " + this._waiAria.lightboxButtonAttrString(u[v]) + " data-action='" + u[v] + "' class='dhx_btn_set dhx_" + (t.config.rtl ? "right" : "left") + "_btn_set " + u[v] + "_set'><div class='dhx_btn_inner " + u[v] + "'></div><div>" + t.locale.labels[u[v]] + "</div></div>";
        u = this.config.buttons_right;
        var m = t.config.rtl;
        for (v = 0; v < u.length; v++)
          c += "<div class='dhx_cal_lcontrols_push_right'></div>", c += "<div " + this._waiAria.lightboxButtonAttrString(u[v]) + " data-action='" + u[v] + "' class='dhx_btn_set dhx_" + (m ? "left" : "right") + "_btn_set " + u[v] + "_set'><div class='dhx_btn_inner " + u[v] + "'></div><div>" + t.locale.labels[u[v]] + "</div></div>";
        c += "</div>", c += "</div>", s.innerHTML = c, t.config.drag_lightbox && (t.event(s.firstChild, "mousedown", t._ready_to_dnd), t.event(s.firstChild, "selectstart", function(b) {
          return b.preventDefault(), !1;
        }), s.firstChild.style.cursor = "move", t._init_dnd_events()), this._waiAria.lightboxAttr(s), this.show_cover(), this._cover.insertBefore(s, this._cover.firstChild), this._lightbox = s;
        var l = this.config.lightbox.sections;
        for (c = "", v = 0; v < l.length; v++) {
          var f = this.form_blocks[l[v].type];
          if (f) {
            l[v].id = "area_" + this.uid();
            var g = "";
            l[v].button && (g = "<div " + t._waiAria.lightboxSectionButtonAttrString(this.locale.labels["button_" + l[v].button]) + " class='dhx_custom_button' data-section-index='" + v + "' index='" + v + "'><div class='dhx_custom_button_" + l[v].button + "'></div><div>" + this.locale.labels["button_" + l[v].button] + "</div></div>"), this.config.wide_form && (c += "<div class='dhx_wrap_section'>");
            var p = this.locale.labels["section_" + l[v].name];
            typeof p != "string" && (p = l[v].name), c += "<div id='" + l[v].id + "' class='dhx_cal_lsection'>" + g + "<label>" + p + "</label></div>" + f.render.call(this, l[v]), c += "</div>";
          }
        }
        var y = s.getElementsByTagName("div");
        for (v = 0; v < y.length; v++) {
          var w = y[v];
          if (t._getClassName(w) == "dhx_cal_larea") {
            w.innerHTML = c;
            break;
          }
        }
        t._bindLightboxLabels(l), this.setLightboxSize(), this._init_lightbox_events(this), s.style.visibility = "visible";
      }
      return this._lightbox;
    }, t._bindLightboxLabels = function(s) {
      for (var c = 0; c < s.length; c++) {
        var u = s[c];
        if (u.id && t._lightbox.querySelector(`#${u.id}`)) {
          for (var v = t._lightbox.querySelector(`#${u.id}`).querySelector("label"), m = t._get_lightbox_section_node(u); m && !m.querySelector; )
            m = m.nextSibling;
          var l = !0;
          if (m) {
            var f = m.querySelector("input, select, textarea");
            f && (u.inputId = f.id || "input_" + t.uid(), f.id || (f.id = u.inputId), v.setAttribute("for", u.inputId), l = !1);
          }
          l && t.form_blocks[u.type].focus && t.event(v, "click", function(g) {
            return function() {
              var p = t.form_blocks[g.type], y = t._get_lightbox_section_node(g);
              p && p.focus && p.focus.call(t, y);
            };
          }(u));
        }
      }
    }, t.attachEvent("onEventIdChange", function(s, c) {
      this._lightbox_id == s && (this._lightbox_id = c);
    }), t._lightbox_template = `<div class='dhx_cal_ltitle'><div class="dhx_cal_ltitle_descr"><span class='dhx_mark'>&nbsp;</span><span class='dhx_time'></span><span class='dhx_title'></span>
</div>
<div class="dhx_cal_ltitle_controls">
<a class="dhx_cal_ltitle_close_btn scheduler_icon close"></a>
</div></div><div class='dhx_cal_larea'></div>`;
  }(h), we(h), function(t) {
    t.getRootView = function() {
      return { view: { render: function() {
        return { tag: "div", type: 1, attrs: { style: "width:100%;height:100%;" }, hooks: { didInsert: function() {
          t.setCurrentView();
        } }, body: [{ el: this.el, type: 1 }] };
      }, init: function() {
        var n = document.createElement("DIV");
        n.id = "scheduler_" + t.uid(), n.style.width = "100%", n.style.height = "100%", n.classList.add("dhx_cal_container"), n.cmp = "grid", n.innerHTML = '<div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" data-tab="day"></div><div class="dhx_cal_tab" data-tab="week"></div><div class="dhx_cal_tab" data-tab="month"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>', t.init(n), this.el = n;
      } }, type: 4 };
    };
  }(h), ke(h), window.jQuery && (r = window.jQuery, d = 0, i = [], r.fn.dhx_scheduler = function(t) {
    if (typeof t != "string") {
      var n = [];
      return this.each(function() {
        if (this && this.getAttribute)
          if (this.getAttribute("dhxscheduler"))
            n.push(window[this.getAttribute("dhxscheduler")]);
          else {
            var s = "scheduler";
            d && (s = "scheduler" + (d + 1), window[s] = Scheduler.getSchedulerInstance());
            var c = window[s];
            for (var u in this.setAttribute("dhxscheduler", s), t)
              u != "data" && (c.config[u] = t[u]);
            this.getElementsByTagName("div").length || (this.innerHTML = '<div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" name="day_tab" data-tab="day" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" data-tab="week" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" data-tab="month" style="right:76px;"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>', this.className += " dhx_cal_container"), c.init(this, c.config.date, c.config.mode), t.data && c.parse(t.data), n.push(c), d++;
          }
      }), n.length === 1 ? n[0] : n;
    }
    if (i[t])
      return i[t].apply(this, []);
    r.error("Method " + t + " does not exist on jQuery.dhx_scheduler");
  }), function(t) {
    (function() {
      var n = t.setCurrentView, s = t.updateView, c = null, u = null, v = function(f, g) {
        var p = this;
        I.clearTimeout(u), I.clearTimeout(c);
        var y = p._date, w = p._mode;
        l(this, f, g), u = setTimeout(function() {
          t.$destroyed || (p.callEvent("onBeforeViewChange", [w, y, g || p._mode, f || p._date]) ? (s.call(p, f, g), p.callEvent("onViewChange", [p._mode, p._date]), I.clearTimeout(c), u = 0) : l(p, y, w));
        }, t.config.delay_render);
      }, m = function(f, g) {
        var p = this, y = arguments;
        l(this, f, g), I.clearTimeout(c), c = setTimeout(function() {
          t.$destroyed || u || s.apply(p, y);
        }, t.config.delay_render);
      };
      function l(f, g, p) {
        g && (f._date = g), p && (f._mode = p);
      }
      t.attachEvent("onSchedulerReady", function() {
        t.config.delay_render ? (t.setCurrentView = v, t.updateView = m) : (t.setCurrentView = n, t.updateView = s);
      });
    })();
  }(h), function(t) {
    t.createDataProcessor = function(n) {
      var s, c;
      n instanceof Function ? s = n : n.hasOwnProperty("router") ? s = n.router : n.hasOwnProperty("event") && (s = n), c = s ? "CUSTOM" : n.mode || "REST-JSON";
      var u = new G(n.url);
      return u.init(t), u.setTransactionMode({ mode: c, router: s }, n.batchUpdate), u;
    }, t.DataProcessor = G;
  }(h), function(t) {
    t.attachEvent("onSchedulerReady", function() {
      typeof dhtmlxError < "u" && window.dhtmlxError.catchError("LoadXML", function(n, s, c) {
        var u = c[0].responseText;
        switch (t.config.ajax_error) {
          case "alert":
            I.alert(u);
            break;
          case "console":
            I.console.log(u);
        }
      });
    });
  }(h);
  const _ = new qe({ en: He, ar: Se, be: Ne, ca: Me, cn: Ae, cs: Ce, da: Te, de: Oe, el: $e, es: Le, fi: ze, fr: je, he: Pe, hu: Ve, id: Ie, it: Be, jp: Re, nb: Fe, nl: Je, no: Ue, pl: Ye, pt: We, ro: Ke, ru: Ge, si: Xe, sk: Ze, sv: Qe, tr: et, ua: tt });
  h.i18n = { addLocale: _.addLocale, setLocale: function(t) {
    if (typeof t == "string") {
      var n = _.getLocale(t);
      n || (n = _.getLocale("en")), h.locale = n;
    } else if (t)
      if (h.locale)
        for (var s in t)
          t[s] && typeof t[s] == "object" ? (h.locale[s] || (h.locale[s] = {}), h.mixin(h.locale[s], t[s], !0)) : h.locale[s] = t[s];
      else
        h.locale = t;
    var c = h.locale.labels;
    c.dhx_save_btn = c.icon_save, c.dhx_cancel_btn = c.icon_cancel, c.dhx_delete_btn = c.icon_delete, h.$container && h.get_elements();
  }, getLocale: _.getLocale }, h.i18n.setLocale("en"), h.ext = {};
  const o = {};
  return h.plugins = function(t) {
    (function(s, c, u) {
      const v = [];
      for (const m in s)
        if (s[m]) {
          const l = m.toLowerCase();
          c[l] && c[l].forEach(function(f) {
            const g = f.toLowerCase();
            s[g] || v.push(g);
          }), v.push(l);
        }
      return v.sort(function(m, l) {
        const f = u[m] || 0, g = u[l] || 0;
        return f > g ? 1 : f < g ? -1 : 0;
      }), v;
    })(t, { treetimeline: ["timeline"], daytimeline: ["timeline"], outerdrag: ["legacy"] }, { legacy: 1, limit: 1, timeline: 2, daytimeline: 3, treetimeline: 3, outerdrag: 6 }).forEach(function(s) {
      if (!o[s]) {
        const c = e.getExtension(s);
        if (!c)
          throw new Error("unknown plugin " + s);
        c(h), o[s] = !0;
      }
    });
  }, h;
}
class it {
  constructor(h) {
    this._extensions = {};
    for (const a in h)
      this._extensions[a] = h[a];
  }
  addExtension(h, a) {
    this._extensions[h] = a;
  }
  getExtension(h) {
    return this._extensions[h];
  }
}
typeof dhtmlx < "u" && dhtmlx.attaches && (dhtmlx.attaches.attachScheduler = function(e, h, a, r) {
  a = a || '<div class="dhx_cal_tab" name="day_tab" data-tab="day" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" data-tab="week" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" data-tab="month" style="right:76px;"></div>';
  var d = document.createElement("DIV");
  return d.id = "dhxSchedObj_" + this._genStr(12), d.innerHTML = '<div id="' + d.id + '" class="dhx_cal_container" style="width:100%; height:100%;"><div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div>' + a + '</div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div></div>', document.body.appendChild(d.firstChild), this.attachObject(d.id, !1, !0), this.vs[this.av].sched = r, this.vs[this.av].schedId = d.id, r.setSizes = r.updateView, r.destructor = function() {
  }, r.init(d.id, e, h), this.vs[this._viewRestore()].sched;
});
const R = (e, h) => {
  h(!1, `The ${e} extension is not included in this version of dhtmlxScheduler.<br>
		You may need a <a href="https://docs.dhtmlx.com/scheduler/editions_comparison.html" target="_blank">Professional version of the component</a>.<br>
		Contact us at <a href="https://dhtmlx.com/docs/contact.shtml" target="_blank">https://dhtmlx.com/docs/contact.shtml</a> if you have any questions.`);
};
function rt(e) {
  (function() {
    var h = [];
    function a() {
      return !!h.length;
    }
    function r(o) {
      setTimeout(function() {
        if (e.$destroyed)
          return !0;
        a() || function(t, n) {
          for (; t && t != n; )
            t = t.parentNode;
          return t == n;
        }(document.activeElement, e.$container) || e.focus();
      }, 1);
    }
    function d(o) {
      var t = (o = o || window.event).currentTarget;
      t == h[h.length - 1] && e.$keyboardNavigation.trapFocus(t, o);
    }
    if (e.attachEvent("onLightbox", function() {
      var o;
      o = e.getLightbox(), e.eventRemove(o, "keydown", d), e.event(o, "keydown", d), h.push(o);
    }), e.attachEvent("onAfterLightbox", function() {
      var o = h.pop();
      o && e.eventRemove(o, "keydown", d), r();
    }), e.attachEvent("onAfterQuickInfo", function() {
      r();
    }), !e._keyNavMessagePopup) {
      e._keyNavMessagePopup = !0;
      var i = null, _ = null;
      const o = [];
      e.attachEvent("onMessagePopup", function(t) {
        for (i = document.activeElement, _ = i; _ && e._getClassName(_).indexOf("dhx_cal_data") < 0; )
          _ = _.parentNode;
        _ && (_ = _.parentNode), e.eventRemove(t, "keydown", d), e.event(t, "keydown", d), o.push(t);
      }), e.attachEvent("onAfterMessagePopup", function() {
        var t = o.pop();
        t && e.eventRemove(t, "keydown", d), setTimeout(function() {
          if (e.$destroyed)
            return !0;
          for (var n = document.activeElement; n && e._getClassName(n).indexOf("dhx_cal_light") < 0; )
            n = n.parentNode;
          n || (i && i.parentNode ? i.focus() : _ && _.parentNode && _.focus(), i = null, _ = null);
        }, 1);
      });
    }
    e.$keyboardNavigation.isModal = a;
  })();
}
function ot(e) {
  e._temp_key_scope = function() {
    e.config.key_nav = !0, e.$keyboardNavigation._pasteDate = null, e.$keyboardNavigation._pasteSection = null;
    var h = null, a = {};
    function r(_) {
      _ = _ || window.event, a.x = _.clientX, a.y = _.clientY;
    }
    function d() {
      for (var _, o, t = document.elementFromPoint(a.x, a.y); t && t != e._obj; )
        t = t.parentNode;
      return _ = t == e._obj, o = e.$keyboardNavigation.dispatcher.isEnabled(), _ || o;
    }
    function i(_) {
      return e._lame_copy({}, _);
    }
    document.body ? e.event(document.body, "mousemove", r) : e.event(window, "load", function() {
      e.event(document.body, "mousemove", r);
    }), e.attachEvent("onMouseMove", function(_, o) {
      var t = e.getState();
      if (t.mode && t.min_date) {
        var n = e.getActionData(o);
        e.$keyboardNavigation._pasteDate = n.date, e.$keyboardNavigation._pasteSection = n.section;
      }
    }), e._make_pasted_event = function(_) {
      var o = e.$keyboardNavigation._pasteDate, t = e.$keyboardNavigation._pasteSection, n = _.end_date - _.start_date, s = i(_);
      if (function(u) {
        delete u.rec_type, delete u.rec_pattern, delete u.event_pid, delete u.event_length;
      }(s), s.start_date = new Date(o), s.end_date = new Date(s.start_date.valueOf() + n), t) {
        var c = e._get_section_property();
        e.config.multisection ? s[c] = _[c] : s[c] = t;
      }
      return s;
    }, e._do_paste = function(_, o, t) {
      e.callEvent("onBeforeEventPasted", [_, o, t]) !== !1 && (e.addEvent(o), e.callEvent("onEventPasted", [_, o, t]));
    }, e._is_key_nav_active = function() {
      return !(!this._is_initialized() || this._is_lightbox_open() || !this.config.key_nav);
    }, e.event(document, "keydown", function(_) {
      (_.ctrlKey || _.metaKey) && _.keyCode == 86 && e._buffer_event && !e.$keyboardNavigation.dispatcher.isEnabled() && (e.$keyboardNavigation.dispatcher.isActive = d());
    }), e._key_nav_copy_paste = function(_) {
      if (!e._is_key_nav_active())
        return !0;
      if (_.keyCode == 37 || _.keyCode == 39) {
        _.cancelBubble = !0;
        var o = e.date.add(e._date, _.keyCode == 37 ? -1 : 1, e._mode);
        return e.setCurrentView(o), !0;
      }
      var t, n = (t = e.$keyboardNavigation.dispatcher.getActiveNode()) && t.eventId ? t.eventId : e._select_id;
      if ((_.ctrlKey || _.metaKey) && _.keyCode == 67)
        return n && (e._buffer_event = i(e.getEvent(n)), h = !0, e.callEvent("onEventCopied", [e.getEvent(n)])), !0;
      if ((_.ctrlKey || _.metaKey) && _.keyCode == 88 && n) {
        h = !1;
        var s = e._buffer_event = i(e.getEvent(n));
        e.updateEvent(s.id), e.callEvent("onEventCut", [s]);
      }
      if ((_.ctrlKey || _.metaKey) && _.keyCode == 86 && d()) {
        if (s = (s = e._buffer_event ? e.getEvent(e._buffer_event.id) : e._buffer_event) || e._buffer_event) {
          var c = e._make_pasted_event(s);
          h ? (c.id = e.uid(), e._do_paste(h, c, s)) : e.callEvent("onBeforeEventChanged", [c, _, !1, s]) && (e._do_paste(h, c, s), h = !0);
        }
        return !0;
      }
    };
  }, e._temp_key_scope();
}
function st(e) {
  e.$keyboardNavigation.attachSchedulerHandlers = function() {
    var h, a = e.$keyboardNavigation.dispatcher, r = function(t) {
      if (e.config.key_nav)
        return a.keyDownHandler(t);
    }, d = function() {
      a.keepScrollPosition(function() {
        a.focusGlobalNode();
      });
    };
    e.attachEvent("onDataRender", function() {
      e.config.key_nav && a.isEnabled() && !e.getState().editor_id && (clearTimeout(h), h = setTimeout(function() {
        if (e.$destroyed)
          return !0;
        a.isEnabled() || a.enable(), i();
      }));
    });
    var i = function() {
      if (a.isEnabled()) {
        var t = a.getActiveNode();
        t && (t.isValid() || (t = t.fallback()), !t || t instanceof e.$keyboardNavigation.MinicalButton || t instanceof e.$keyboardNavigation.MinicalCell || a.keepScrollPosition(function() {
          t.focus(!0);
        }));
      }
    };
    function _(t) {
      if (!e.config.key_nav)
        return !0;
      const n = e.getView();
      let s = !1;
      if (e.getState().mode === "month")
        s = e.$keyboardNavigation.isChildOf(t.target || t.srcElement, e.$container.querySelector(".dhx_cal_month_table"));
      else if (n && n.layout === "timeline")
        s = e.$keyboardNavigation.isChildOf(t.target || t.srcElement, e.$container.querySelector(".dhx_timeline_data_col"));
      else {
        const v = e.$container.querySelectorAll(".dhx_scale_holder");
        s = Array.from(v).some((m) => m === t.target.parentNode);
      }
      var c, u = e.getActionData(t);
      e._locate_event(t.target || t.srcElement) ? c = new e.$keyboardNavigation.Event(e._locate_event(t.target || t.srcElement)) : s && (c = new e.$keyboardNavigation.TimeSlot(), u.date && s && (c = c.nextSlot(new e.$keyboardNavigation.TimeSlot(u.date, null, u.section)))), c && (a.isEnabled() ? u.date && s && a.delay(function() {
        a.setActiveNode(c);
      }) : a.activeNode = c);
    }
    e.attachEvent("onSchedulerReady", function() {
      var t = e.$container;
      e.eventRemove(document, "keydown", r), e.eventRemove(t, "mousedown", _), e.eventRemove(t, "focus", d), e.config.key_nav ? (e.event(document, "keydown", r), e.event(t, "mousedown", _), e.event(t, "focus", d), t.setAttribute("tabindex", "0")) : t.removeAttribute("tabindex");
    });
    var o = e.updateEvent;
    e.updateEvent = function(t) {
      var n = o.apply(this, arguments);
      if (e.config.key_nav && a.isEnabled() && e.getState().select_id == t) {
        var s = new e.$keyboardNavigation.Event(t);
        e.getState().lightbox_id || function(c) {
          if (e.config.key_nav && a.isEnabled()) {
            var u = c, v = new e.$keyboardNavigation.Event(u.eventId);
            if (!v.isValid()) {
              var m = v.start || u.start, l = v.end || u.end, f = v.section || u.section;
              (v = new e.$keyboardNavigation.TimeSlot(m, l, f)).isValid() || (v = new e.$keyboardNavigation.TimeSlot());
            }
            a.setActiveNode(v);
            var g = a.getActiveNode();
            g && g.getNode && document.activeElement != g.getNode() && a.focusNode(a.getActiveNode());
          }
        }(s);
      }
      return n;
    }, e.attachEvent("onEventDeleted", function(t) {
      return e.config.key_nav && a.isEnabled() && a.getActiveNode().eventId == t && a.setActiveNode(new e.$keyboardNavigation.TimeSlot()), !0;
    }), e.attachEvent("onClearAll", function() {
      if (!e.config.key_nav)
        return !0;
      a.isEnabled() && a.getActiveNode() instanceof e.$keyboardNavigation.Event && a.setActiveNode(new e.$keyboardNavigation.TimeSlot());
    });
  };
}
class dt {
  constructor(h) {
    this._scheduler = h;
  }
  getNode() {
    const h = this._scheduler;
    return this._tooltipNode || (this._tooltipNode = document.createElement("div"), this._tooltipNode.className = "dhtmlXTooltip scheduler_tooltip tooltip", h._waiAria.tooltipAttr(this._tooltipNode)), h.config.rtl ? this._tooltipNode.classList.add("dhtmlXTooltip_rtl") : this._tooltipNode.classList.remove("dhtmlXTooltip_rtl"), this._tooltipNode;
  }
  setViewport(h) {
    return this._root = h, this;
  }
  show(h, a) {
    const r = this._scheduler, d = r.$domHelpers, i = document.body, _ = this.getNode();
    if (d.isChildOf(_, i) || (this.hide(), i.appendChild(_)), this._isLikeMouseEvent(h)) {
      const o = this._calculateTooltipPosition(h);
      a = o.top, h = o.left;
    }
    return _.style.top = a + "px", _.style.left = h + "px", r._waiAria.tooltipVisibleAttr(_), this;
  }
  hide() {
    const h = this._scheduler, a = this.getNode();
    return a && a.parentNode && a.parentNode.removeChild(a), h._waiAria.tooltipHiddenAttr(a), this;
  }
  setContent(h) {
    return this.getNode().innerHTML = h, this;
  }
  _isLikeMouseEvent(h) {
    return !(!h || typeof h != "object") && "clientX" in h && "clientY" in h;
  }
  _getViewPort() {
    return this._root || document.body;
  }
  _calculateTooltipPosition(h) {
    const a = this._scheduler, r = a.$domHelpers, d = this._getViewPortSize(), i = this.getNode(), _ = { top: 0, left: 0, width: i.offsetWidth, height: i.offsetHeight, bottom: 0, right: 0 }, o = a.config.tooltip_offset_x, t = a.config.tooltip_offset_y, n = document.body, s = r.getRelativeEventPosition(h, n), c = r.getNodePosition(n);
    s.y += c.y, _.top = s.y, _.left = s.x, _.top += t, _.left += o, _.bottom = _.top + _.height, _.right = _.left + _.width;
    const u = window.scrollY + n.scrollTop;
    return _.top < d.top - u ? (_.top = d.top, _.bottom = _.top + _.height) : _.bottom > d.bottom && (_.bottom = d.bottom, _.top = _.bottom - _.height), _.left < d.left ? (_.left = d.left, _.right = d.left + _.width) : _.right > d.right && (_.right = d.right, _.left = _.right - _.width), s.x >= _.left && s.x <= _.right && (_.left = s.x - _.width - o, _.right = _.left + _.width), s.y >= _.top && s.y <= _.bottom && (_.top = s.y - _.height - t, _.bottom = _.top + _.height), _;
  }
  _getViewPortSize() {
    const h = this._scheduler, a = h.$domHelpers, r = this._getViewPort();
    let d, i = r, _ = window.scrollY + document.body.scrollTop, o = window.scrollX + document.body.scrollLeft;
    return r === h.$event_data ? (i = h.$event, _ = 0, o = 0, d = a.getNodePosition(h.$event)) : d = a.getNodePosition(i), { left: d.x + o, top: d.y + _, width: d.width, height: d.height, bottom: d.y + d.height + _, right: d.x + d.width + o };
  }
}
class _t {
  constructor(h) {
    this._listeners = {}, this.tooltip = new dt(h), this._scheduler = h, this._domEvents = h._createDomEventScope(), this._initDelayedFunctions();
  }
  destructor() {
    this.tooltip.hide(), this._domEvents.detachAll();
  }
  hideTooltip() {
    this.delayHide();
  }
  attach(h) {
    let a = document.body;
    const r = this._scheduler, d = r.$domHelpers;
    h.global || (a = r.$root);
    let i = null;
    const _ = (o) => {
      const t = d.getTargetNode(o), n = d.closest(t, h.selector);
      if (d.isChildOf(t, this.tooltip.getNode()))
        return;
      const s = () => {
        i = n, h.onmouseenter(o, n);
      };
      i ? n && n === i ? h.onmousemove(o, n) : (h.onmouseleave(o, i), i = null, n && n !== i && s()) : n && s();
    };
    this.detach(h.selector), this._domEvents.attach(a, "mousemove", _), this._listeners[h.selector] = { node: a, handler: _ };
  }
  detach(h) {
    const a = this._listeners[h];
    a && this._domEvents.detach(a.node, "mousemove", a.handler);
  }
  tooltipFor(h) {
    const a = (r) => {
      let d = r;
      return document.createEventObject && !document.createEvent && (d = document.createEventObject(r)), d;
    };
    this._initDelayedFunctions(), this.attach({ selector: h.selector, global: h.global, onmouseenter: (r, d) => {
      const i = h.html(r, d);
      i && this.delayShow(a(r), i);
    }, onmousemove: (r, d) => {
      const i = h.html(r, d);
      i ? this.delayShow(a(r), i) : (this.delayShow.$cancelTimeout(), this.delayHide());
    }, onmouseleave: () => {
      this.delayShow.$cancelTimeout(), this.delayHide();
    } });
  }
  _initDelayedFunctions() {
    const h = this._scheduler;
    this.delayShow && this.delayShow.$cancelTimeout(), this.delayHide && this.delayHide.$cancelTimeout(), this.tooltip.hide(), this.delayShow = V.delay((a, r) => {
      h.callEvent("onBeforeTooltip", [a]) === !1 ? this.tooltip.hide() : (this.tooltip.setContent(r), this.tooltip.show(a));
    }, h.config.tooltip_timeout || 1), this.delayHide = V.delay(() => {
      this.delayShow.$cancelTimeout(), this.tooltip.hide();
    }, h.config.tooltip_hide_timeout || 1);
  }
}
const lt = { active_links: function(e) {
  e.config.active_link_view = "day", e._active_link_click = function(h) {
    var a = h.target.getAttribute("data-link-date"), r = e.date.str_to_date(e.config.api_date, !1, !0);
    if (a)
      return e.setCurrentView(r(a), e.config.active_link_view), h && h.preventDefault && h.preventDefault(), !1;
  }, e.attachEvent("onTemplatesReady", function() {
    var h = function(r, d) {
      d = d || r + "_scale_date", e.templates["_active_links_old_" + d] || (e.templates["_active_links_old_" + d] = e.templates[d]);
      var i = e.templates["_active_links_old_" + d], _ = e.date.date_to_str(e.config.api_date);
      e.templates[d] = function(o) {
        return "<a data-link-date='" + _(o) + "' href='#'>" + i(o) + "</a>";
      };
    };
    if (h("week"), h("", "month_day"), this.matrix)
      for (var a in this.matrix)
        h(a);
    this._detachDomEvent(this._obj, "click", e._active_link_click), e.event(this._obj, "click", e._active_link_click);
  });
}, agenda_legacy: function(e) {
  e.date.add_agenda_legacy = function(h) {
    return e.date.add(h, 1, "year");
  }, e.templates.agenda_legacy_time = function(h, a, r) {
    return r._timed ? this.day_date(r.start_date, r.end_date, r) + " " + this.event_date(h) : e.templates.day_date(h) + " &ndash; " + e.templates.day_date(a);
  }, e.templates.agenda_legacy_text = function(h, a, r) {
    return r.text;
  }, e.templates.agenda_legacy_date = function() {
    return "";
  }, e.date.agenda_legacy_start = function() {
    return e.date.date_part(e._currentDate());
  }, e.attachEvent("onTemplatesReady", function() {
    var h = e.dblclick_dhx_cal_data;
    e.dblclick_dhx_cal_data = function() {
      if (this._mode == "agenda_legacy")
        !this.config.readonly && this.config.dblclick_create && this.addEventNow();
      else if (h)
        return h.apply(this, arguments);
    };
    var a = e.render_data;
    e.render_data = function(i) {
      if (this._mode != "agenda_legacy")
        return a.apply(this, arguments);
      d();
    };
    var r = e.render_view_data;
    function d() {
      var i = e.get_visible_events();
      i.sort(function(g, p) {
        return g.start_date > p.start_date ? 1 : -1;
      });
      for (var _, o = "<div class='dhx_agenda_area' " + e._waiAria.agendaDataAttrString() + ">", t = 0; t < i.length; t++) {
        var n = i[t], s = n.color ? "--dhx-scheduler-event-background:" + n.color + ";" : "", c = n.textColor ? "--dhx-scheduler-event-color:" + n.textColor + ";" : "", u = e.templates.event_class(n.start_date, n.end_date, n);
        _ = e._waiAria.agendaEventAttrString(n);
        var v = e._waiAria.agendaDetailsBtnString();
        o += "<div " + _ + " class='dhx_agenda_line" + (u ? " " + u : "") + "' event_id='" + n.id + "' " + e.config.event_attribute + "='" + n.id + "' style='" + c + s + (n._text_style || "") + "'><div class='dhx_agenda_event_time'>" + (e.config.rtl ? e.templates.agenda_time(n.end_date, n.start_date, n) : e.templates.agenda_time(n.start_date, n.end_date, n)) + "</div>", o += `<div ${v} class='dhx_event_icon icon_details'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15.4444 16.4H4.55556V7.6H15.4444V16.4ZM13.1111 2V3.6H6.88889V2H5.33333V3.6H4.55556C3.69222 3.6 3 4.312 3 5.2V16.4C3 16.8243 3.16389 17.2313 3.45561 17.5314C3.74733 17.8314 4.143 18 4.55556 18H15.4444C15.857 18 16.2527 17.8314 16.5444 17.5314C16.8361 17.2313 17 16.8243 17 16.4V5.2C17 4.312 16.3 3.6 15.4444 3.6H14.6667V2H13.1111ZM13.8889 10.8H10V14.8H13.8889V10.8Z" fill="#A1A4A6"/>
			</svg></div>`, o += "<span>" + e.templates.agenda_text(n.start_date, n.end_date, n) + "</span></div>";
      }
      o += "<div class='dhx_v_border'></div></div>", e._els.dhx_cal_data[0].innerHTML = o, e._els.dhx_cal_data[0].childNodes[0].scrollTop = e._agendaScrollTop || 0;
      var m = e._els.dhx_cal_data[0].childNodes[0];
      m.childNodes[m.childNodes.length - 1].style.height = m.offsetHeight < e._els.dhx_cal_data[0].offsetHeight ? "100%" : m.offsetHeight + "px";
      var l = e._els.dhx_cal_data[0].firstChild.childNodes, f = e._getNavDateElement();
      for (f && (f.innerHTML = e.templates.agenda_date(e._min_date, e._max_date, e._mode)), e._rendered = [], t = 0; t < l.length - 1; t++)
        e._rendered[t] = l[t];
    }
    e.render_view_data = function() {
      return this._mode == "agenda_legacy" && (e._agendaScrollTop = e._els.dhx_cal_data[0].childNodes[0].scrollTop, e._els.dhx_cal_data[0].childNodes[0].scrollTop = 0), r.apply(this, arguments);
    }, e.agenda_legacy_view = function(i) {
      e._min_date = e.config.agenda_start || e.date.agenda_legacy_start(e._date), e._max_date = e.config.agenda_end || e.date.add_agenda_legacy(e._min_date, 1), function(_) {
        if (_) {
          var o = e.locale.labels, t = e._waiAria.agendaHeadAttrString(), n = e._waiAria.agendaHeadDateString(o.date), s = e._waiAria.agendaHeadDescriptionString(o.description);
          e._els.dhx_cal_header[0].innerHTML = "<div " + t + " class='dhx_agenda_line dhx_agenda_line_header'><div " + n + ">" + o.date + "</div><span class = 'description_header' style='padding-left:25px' " + s + ">" + o.description + "</span></div>", e._table_view = !0, e.set_sizes();
        }
      }(i), i ? (e._cols = null, e._colsS = null, e._table_view = !0, d()) : e._table_view = !1;
    };
  });
}, agenda_view: function(e) {
  e.date.add_agenda = function(d, i) {
    return e.date.add(d, 1 * i, "month");
  }, e.templates.agenda_time = function(d, i, _) {
    return _._timed ? `${this.event_date(d)} - ${this.event_date(i)}` : e.locale.labels.full_day;
  }, e.templates.agenda_text = function(d, i, _) {
    return _.text;
  };
  const h = e.date.date_to_str("%F %j"), a = e.date.date_to_str("%l");
  e.templates.agenda_day = function(d) {
    return `<div class="dhx_agenda_day_date">${h(d)}</div>
		<div class="dhx_agenda_day_dow">${a(d)}</div>`;
  }, e.templates.agenda_date = function(d, i) {
    return e.templates.month_date(e.getState().date);
  }, e.date.agenda_start = function(d) {
    return e.date.month_start(new Date(d));
  };
  let r = 0;
  e.attachEvent("onTemplatesReady", function() {
    var d = e.dblclick_dhx_cal_data;
    e.dblclick_dhx_cal_data = function() {
      if (this._mode == "agenda")
        !this.config.readonly && this.config.dblclick_create && this.addEventNow();
      else if (d)
        return d.apply(this, arguments);
    };
    var i = e.render_data;
    e.render_data = function(n) {
      if (this._mode != "agenda")
        return i.apply(this, arguments);
      o();
    };
    var _ = e.render_view_data;
    function o() {
      const n = e.get_visible_events();
      n.sort(function(f, g) {
        return f.start_date > g.start_date ? 1 : -1;
      });
      const s = {};
      let c = e.getState().min_date;
      const u = e.getState().max_date;
      for (; c.valueOf() < u.valueOf(); )
        s[c.valueOf()] = [], c = e.date.add(c, 1, "day");
      let v = !1;
      if (n.forEach((f) => {
        let g = e.date.day_start(new Date(f.start_date));
        for (; g.valueOf() < f.end_date.valueOf(); )
          s[g.valueOf()] && (s[g.valueOf()].push(f), v = !0), g = e.date.day_start(e.date.add(g, 1, "day"));
      }), v) {
        let f = "";
        for (let g in s)
          f += t(new Date(1 * g), s[g]);
        e._els.dhx_cal_data[0].innerHTML = f;
      } else
        e._els.dhx_cal_data[0].innerHTML = `<div class="dhx_cal_agenda_no_events">${e.locale.labels.agenda_tab}</div>`;
      e._els.dhx_cal_data[0].scrollTop = r;
      let m = e._els.dhx_cal_data[0].querySelectorAll(".dhx_cal_agenda_event_line");
      e._rendered = [];
      for (var l = 0; l < m.length - 1; l++)
        e._rendered[l] = m[l];
    }
    function t(n, s) {
      if (!s.length)
        return "";
      let c = `
<div class="dhx_cal_agenda_day">
	<div class="dhx_cal_agenda_day_header">${e.templates.agenda_day(n)}</div>
	<div class="dhx_cal_agenda_day_events">
`;
      return s.forEach((u) => {
        c += function(v, m) {
          const l = e.templates.agenda_time(m.start_date, m.end_date, m), f = e.getState().select_id, g = e.templates.event_class(m.start_date, m.end_date, m), p = e.templates.agenda_text(m.start_date, m.end_date, m);
          let y = "";
          return (m.color || m.textColor) && (y = ` style="${m.color ? "--dhx-scheduler-event-background:" + m.color + ";" : ""}${m.textColor ? "--dhx-scheduler-event-color:" + m.textColor + ";" : ""}" `), `<div class="dhx_cal_agenda_event_line ${g || ""} ${m.id == f ? "dhx_cal_agenda_event_line_selected" : ""}" ${y} ${e.config.event_attribute}="${m.id}">
	<div class="dhx_cal_agenda_event_line_marker"></div>
	<div class="dhx_cal_agenda_event_line_time">${l}</div>
	<div class="dhx_cal_agenda_event_line_text">${p}</div>
</div>`;
        }(0, u);
      }), c += "</div></div>", c;
    }
    e.render_view_data = function() {
      return this._mode == "agenda" && (r = e._els.dhx_cal_data[0].scrollTop, e._els.dhx_cal_data[0].scrollTop = 0), _.apply(this, arguments);
    }, e.agenda_view = function(n) {
      n ? (e._min_date = e.config.agenda_start || e.date.agenda_start(e._date), e._max_date = e.config.agenda_end || e.date.add_agenda(e._min_date, 1), e._cols = null, e._colsS = null, e._table_view = !0, e._getNavDateElement().innerHTML = e.templates.agenda_date(e._date), o()) : e._table_view = !1;
    };
  });
}, all_timed: function(e) {
  e.config.all_timed = "short", e.config.all_timed_month = !1;
  var h = function(o) {
    return !((o.end_date - o.start_date) / 36e5 >= 24) || e._drag_mode == "resize" && e._drag_id == o.id;
  };
  e._safe_copy = function(o) {
    var t = null, n = e._copy_event(o);
    return o.event_pid && (t = e.getEvent(o.event_pid)), t && t.isPrototypeOf(o) && (delete n.event_length, delete n.event_pid, delete n.rec_pattern, delete n.rec_type), n;
  };
  var a = e._pre_render_events_line, r = e._pre_render_events_table, d = function(o, t) {
    return this._table_view ? r.call(this, o, t) : a.call(this, o, t);
  };
  e._pre_render_events_line = e._pre_render_events_table = function(o, t) {
    if (!this.config.all_timed || this._table_view && this._mode != "month" || this._mode == "month" && !this.config.all_timed_month)
      return d.call(this, o, t);
    for (var n = 0; n < o.length; n++) {
      var s = o[n];
      if (!s._timed)
        if (this.config.all_timed != "short" || h(s)) {
          var c = this._safe_copy(s);
          s._virtual ? c._first_chunk = !1 : c._first_chunk = !0, c._drag_resize = !1, c._virtual = !0, c.start_date = new Date(c.start_date), l(s) ? (c.end_date = f(c.start_date), this.config.last_hour != 24 && (c.end_date = g(c.start_date, this.config.last_hour))) : c.end_date = new Date(s.end_date);
          var u = !1;
          c.start_date < this._max_date && c.end_date > this._min_date && c.start_date < c.end_date && (o[n] = c, u = !0);
          var v = this._safe_copy(s);
          if (v._virtual = !0, v.end_date = new Date(v.end_date), v.start_date < this._min_date ? v.start_date = g(this._min_date, this.config.first_hour) : v.start_date = g(f(s.start_date), this.config.first_hour), v.start_date < this._max_date && v.start_date < v.end_date) {
            if (!u) {
              o[n--] = v;
              continue;
            }
            o.splice(n + 1, 0, v), v._last_chunk = !1;
          } else
            c._last_chunk = !0, c._drag_resize = !0;
        } else
          this._mode != "month" && o.splice(n--, 1);
    }
    var m = this._drag_mode != "move" && t;
    return d.call(this, o, m);
    function l(p) {
      var y = f(p.start_date);
      return +p.end_date > +y;
    }
    function f(p) {
      var y = e.date.add(p, 1, "day");
      return y = e.date.date_part(y);
    }
    function g(p, y) {
      var w = e.date.date_part(new Date(p));
      return w.setHours(y), w;
    }
  };
  var i = e.get_visible_events;
  e.get_visible_events = function(o) {
    return this.config.all_timed && this.config.multi_day ? i.call(this, !1) : i.call(this, o);
  }, e.attachEvent("onBeforeViewChange", function(o, t, n, s) {
    return e._allow_dnd = n == "day" || n == "week" || e.getView(n), !0;
  }), e._is_main_area_event = function(o) {
    return !!(o._timed || this.config.all_timed === !0 || this.config.all_timed == "short" && h(o));
  };
  var _ = e.updateEvent;
  e.updateEvent = function(o) {
    var t, n, s = e.getEvent(o);
    s && (t = e.config.all_timed && !(e.isOneDayEvent(e._events[o]) || e.getState().drag_id)) && (n = e.config.update_render, e.config.update_render = !0), _.apply(e, arguments), s && t && (e.config.update_render = n);
  };
}, collision: function(e) {
  var h, a;
  function r(d) {
    e._get_section_view() && d && (h = e.getEvent(d)[e._get_section_property()]);
  }
  e.config.collision_limit = 1, e.attachEvent("onBeforeDrag", function(d) {
    return r(d), !0;
  }), e.attachEvent("onBeforeLightbox", function(d) {
    var i = e.getEvent(d);
    return a = [i.start_date, i.end_date], r(d), !0;
  }), e.attachEvent("onEventChanged", function(d) {
    if (!d || !e.getEvent(d))
      return !0;
    var i = e.getEvent(d);
    if (!e.checkCollision(i)) {
      if (!a)
        return !1;
      i.start_date = a[0], i.end_date = a[1], i._timed = this.isOneDayEvent(i);
    }
    return !0;
  }), e.attachEvent("onBeforeEventChanged", function(d, i, _) {
    return e.checkCollision(d);
  }), e.attachEvent("onEventAdded", function(d, i) {
    e.checkCollision(i) || e.deleteEvent(d);
  }), e.attachEvent("onEventSave", function(d, i, _) {
    if ((i = e._lame_clone(i)).id = d, !i.start_date || !i.end_date) {
      var o = e.getEvent(d);
      i.start_date = new Date(o.start_date), i.end_date = new Date(o.end_date);
    }
    return i.rec_type && e._roll_back_dates(i), e.checkCollision(i);
  }), e._check_sections_collision = function(d, i) {
    var _ = e._get_section_property();
    return d[_] == i[_] && d.id != i.id;
  }, e.checkCollision = function(d) {
    var i = [], _ = e.config.collision_limit;
    if (d.rec_type)
      for (var o = e.getRecDates(d), t = 0; t < o.length; t++)
        for (var n = e.getEvents(o[t].start_date, o[t].end_date), s = 0; s < n.length; s++)
          (n[s].event_pid || n[s].id) != d.id && i.push(n[s]);
    else {
      i = e.getEvents(d.start_date, d.end_date);
      for (var c = 0; c < i.length; c++) {
        var u = i[c];
        if (u.id == d.id || u.event_length && [u.event_pid, u.event_length].join("#") == d.id) {
          i.splice(c, 1);
          break;
        }
      }
    }
    var v = e._get_section_view(), m = e._get_section_property(), l = !0;
    if (v) {
      var f = 0;
      for (c = 0; c < i.length; c++)
        i[c].id != d.id && this._check_sections_collision(i[c], d) && f++;
      f >= _ && (l = !1);
    } else
      i.length >= _ && (l = !1);
    if (!l) {
      var g = !e.callEvent("onEventCollision", [d, i]);
      return g || (d[m] = h || d[m]), g;
    }
    return l;
  };
}, container_autoresize: function(e) {
  e.config.container_autoresize = !0, e.config.month_day_min_height = 90, e.config.min_grid_size = 25, e.config.min_map_size = 400;
  var h = e._pre_render_events, a = !0, r = 0, d = 0;
  e._pre_render_events = function(s, c) {
    if (!e.config.container_autoresize || !a)
      return h.apply(this, arguments);
    var u = this.xy.bar_height, v = this._colsS.heights, m = this._colsS.heights = [0, 0, 0, 0, 0, 0, 0], l = this._els.dhx_cal_data[0];
    if (s = this._table_view ? this._pre_render_events_table(s, c) : this._pre_render_events_line(s, c), this._table_view)
      if (c)
        this._colsS.heights = v;
      else {
        var f = l.firstChild;
        const E = f.querySelectorAll(".dhx_cal_month_row");
        if (E) {
          for (var g = 0; g < E.length; g++) {
            if (m[g]++, m[g] * u > this._colsS.height - this.xy.month_head_height) {
              var p = E[g].querySelectorAll(".dhx_cal_month_cell"), y = this._colsS.height - this.xy.month_head_height;
              1 * this.config.max_month_events !== this.config.max_month_events || m[g] <= this.config.max_month_events ? y = m[g] * u : (this.config.max_month_events + 1) * u > this._colsS.height - this.xy.month_head_height && (y = (this.config.max_month_events + 1) * u), E[g].style.height = y + this.xy.month_head_height + "px";
              for (var w = 0; w < p.length; w++)
                p[w].childNodes[1].style.height = y + "px";
              m[g] = (m[g - 1] || 0) + p[0].offsetHeight;
            }
            m[g] = (m[g - 1] || 0) + E[g].querySelectorAll(".dhx_cal_month_cell")[0].offsetHeight;
          }
          m.unshift(0), f.parentNode.offsetHeight < f.parentNode.scrollHeight && f._h_fix;
        } else if (s.length || this._els.dhx_multi_day[0].style.visibility != "visible" || (m[0] = -1), s.length || m[0] == -1) {
          var b = (m[0] + 1) * u + 1;
          d != b + 1 && (this._obj.style.height = r - d + b - 1 + "px"), b += "px";
          const D = this._els.dhx_cal_navline[0].offsetHeight, x = this._els.dhx_cal_header[0].offsetHeight;
          l.style.height = this._obj.offsetHeight - D - x - (this.xy.margin_top || 0) + "px";
          var k = this._els.dhx_multi_day[0];
          k.style.height = b, k.style.visibility = m[0] == -1 ? "hidden" : "visible", (k = this._els.dhx_multi_day[1]).style.height = b, k.style.visibility = m[0] == -1 ? "hidden" : "visible", k.style.visibility == "hidden" ? k.style.display = "none" : k.style.display = "", k.className = m[0] ? "dhx_multi_day_icon" : "dhx_multi_day_icon_small", this._dy_shift = (m[0] + 1) * u, m[0] = 0;
        }
      }
    return s;
  };
  var i = ["dhx_cal_navline", "dhx_cal_header", "dhx_multi_day", "dhx_cal_data"], _ = function(s) {
    r = 0;
    for (var c = 0; c < i.length; c++) {
      var u = i[c], v = e._els[u] ? e._els[u][0] : null, m = 0;
      switch (u) {
        case "dhx_cal_navline":
        case "dhx_cal_header":
          m = v.offsetHeight;
          break;
        case "dhx_multi_day":
          m = v ? v.offsetHeight - 1 : 0, d = m;
          break;
        case "dhx_cal_data":
          var l = e.getState().mode;
          if (v.childNodes[1] && l != "month") {
            let M = 0;
            for (let A = 0; A < v.childNodes.length; A++)
              v.childNodes[A].offsetHeight > M && (M = v.childNodes[A].offsetHeight);
            m = M;
          } else
            m = Math.max(v.offsetHeight - 1, v.scrollHeight);
          if (l == "month")
            e.config.month_day_min_height && !s && (m = v.querySelectorAll(".dhx_cal_month_row").length * e.config.month_day_min_height), s && (v.style.height = m + "px");
          else if (l == "year")
            m = 190 * e.config.year_y;
          else if (l == "agenda") {
            if (m = 0, v.childNodes && v.childNodes.length)
              for (var f = 0; f < v.childNodes.length; f++)
                m += v.childNodes[f].offsetHeight;
            m + 2 < e.config.min_grid_size ? m = e.config.min_grid_size : m += 2;
          } else if (l == "week_agenda") {
            for (var g, p, y = e.xy.week_agenda_scale_height + e.config.min_grid_size, w = 0; w < v.childNodes.length; w++)
              for (p = v.childNodes[w], f = 0; f < p.childNodes.length; f++) {
                for (var b = 0, k = p.childNodes[f].childNodes[1], E = 0; E < k.childNodes.length; E++)
                  b += k.childNodes[E].offsetHeight;
                g = b + e.xy.week_agenda_scale_height, (g = w != 1 || f != 2 && f != 3 ? g : 2 * g) > y && (y = g);
              }
            m = 3 * y;
          } else if (l == "map") {
            m = 0;
            var D = v.querySelectorAll(".dhx_map_line");
            for (f = 0; f < D.length; f++)
              m += D[f].offsetHeight;
            m + 2 < e.config.min_map_size ? m = e.config.min_map_size : m += 2;
          } else if (e._gridView)
            if (m = 0, v.childNodes[1].childNodes[0].childNodes && v.childNodes[1].childNodes[0].childNodes.length) {
              for (D = v.childNodes[1].childNodes[0].childNodes[0].childNodes, f = 0; f < D.length; f++)
                m += D[f].offsetHeight;
              (m += 2) < e.config.min_grid_size && (m = e.config.min_grid_size);
            } else
              m = e.config.min_grid_size;
          if (e.matrix && e.matrix[l]) {
            if (s)
              m += 0, v.style.height = m + "px";
            else {
              m = 0;
              for (var x = e.matrix[l], S = x.y_unit, N = 0; N < S.length; N++)
                m += x.getSectionHeight(S[N].key);
              e.$container.clientWidth != e.$container.scrollWidth && (m += n());
            }
            m -= 1;
          }
          (l == "day" || l == "week" || e._props && e._props[l]) && (m += 2);
      }
      r += m += 1;
    }
    e._obj.style.height = r + "px", s || e.updateView();
  };
  function o() {
    a = !1, e.callEvent("onAfterSchedulerResize", []), a = !0;
  }
  var t = function() {
    if (!e.config.container_autoresize || !a)
      return !0;
    var s = e.getState().mode;
    if (!s)
      return !0;
    var c = window.requestAnimationFrame || window.setTimeout, u = document.documentElement.scrollTop;
    c(function() {
      !e.$destroyed && e.$initialized && _();
    }), e.matrix && e.matrix[s] || s == "month" ? c(function() {
      !e.$destroyed && e.$initialized && (_(!0), document.documentElement.scrollTop = u, o());
    }, 1) : o();
  };
  function n() {
    var s = document.createElement("div");
    s.style.cssText = "visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;", document.body.appendChild(s);
    var c = s.offsetWidth - s.clientWidth;
    return document.body.removeChild(s), c;
  }
  e.attachEvent("onBeforeViewChange", function() {
    var s = e.config.container_autoresize;
    if (e.xy.$original_scroll_width || (e.xy.$original_scroll_width = e.xy.scroll_width), e.xy.scroll_width = s ? 0 : e.xy.$original_scroll_width, e.matrix)
      for (var c in e.matrix) {
        var u = e.matrix[c];
        u.$original_section_autoheight || (u.$original_section_autoheight = u.section_autoheight), u.section_autoheight = !s && u.$original_section_autoheight;
      }
    return !0;
  }), e.attachEvent("onViewChange", t), e.attachEvent("onXLE", t), e.attachEvent("onEventChanged", t), e.attachEvent("onEventCreated", t), e.attachEvent("onEventAdded", t), e.attachEvent("onEventDeleted", t), e.attachEvent("onAfterSchedulerResize", t), e.attachEvent("onClearAll", t), e.attachEvent("onBeforeExpand", function() {
    return a = !1, !0;
  }), e.attachEvent("onBeforeCollapse", function() {
    return a = !0, !0;
  });
}, cookie: function(e) {
  function h(d) {
    return (d._obj.id || "scheduler") + "_settings";
  }
  var a = !0;
  e.attachEvent("onBeforeViewChange", function(d, i, _, o) {
    if (a && e._get_url_nav) {
      var t = e._get_url_nav();
      (t.date || t.mode || t.event) && (a = !1);
    }
    var n = h(e);
    if (a) {
      a = !1;
      var s = function(u) {
        var v = u + "=";
        if (document.cookie.length > 0) {
          var m = document.cookie.indexOf(v);
          if (m != -1) {
            m += v.length;
            var l = document.cookie.indexOf(";", m);
            return l == -1 && (l = document.cookie.length), document.cookie.substring(m, l);
          }
        }
        return "";
      }(n);
      if (s) {
        e._min_date || (e._min_date = o), (s = unescape(s).split("@"))[0] = this._helpers.parseDate(s[0]);
        var c = this.isViewExists(s[1]) ? s[1] : _;
        return o = isNaN(+s[0]) ? o : s[0], window.setTimeout(function() {
          e.$destroyed || e.setCurrentView(o, c);
        }, 1), !1;
      }
    }
    return !0;
  }), e.attachEvent("onViewChange", function(d, i) {
    var _, o, t = h(e), n = escape(this._helpers.formatDate(i) + "@" + d);
    o = t + "=" + n + ((_ = "expires=Sun, 31 Jan 9999 22:00:00 GMT") ? "; " + _ : ""), document.cookie = o;
  });
  var r = e._load;
  e._load = function() {
    var d = arguments;
    if (e._date)
      r.apply(this, d);
    else {
      var i = this;
      window.setTimeout(function() {
        r.apply(i, d);
      }, 1);
    }
  };
}, daytimeline: function(e) {
  R("Day Timeline", e.assert);
}, drag_between: function(e) {
  R("Drag Between", e.assert);
}, editors: function(e) {
  e.form_blocks.combo = { render: function(h) {
    h.cached_options || (h.cached_options = {});
    var a = "";
    return a += "<div class='" + h.type + "' ></div>";
  }, set_value: function(h, a, r, d) {
    (function() {
      v();
      var u = e.attachEvent("onAfterLightbox", function() {
        v(), e.detachEvent(u);
      });
      function v() {
        if (h._combo && h._combo.DOMParent) {
          var m = h._combo;
          m.unload ? m.unload() : m.destructor && m.destructor(), m.DOMParent = m.DOMelem = null;
        }
      }
    })(), window.dhx_globalImgPath = d.image_path || "/", h._combo = new dhtmlXCombo(h, d.name, h.offsetWidth - 8), d.onchange && h._combo.attachEvent("onChange", d.onchange), d.options_height && h._combo.setOptionHeight(d.options_height);
    var i = h._combo;
    if (i.enableFilteringMode(d.filtering, d.script_path || null, !!d.cache), d.script_path) {
      var _ = r[d.map_to];
      _ ? d.cached_options[_] ? (i.addOption(_, d.cached_options[_]), i.disable(1), i.selectOption(0), i.disable(0)) : e.ajax.get(d.script_path + "?id=" + _ + "&uid=" + e.uid(), function(u) {
        var v, m = u.xmlDoc.responseText;
        try {
          v = JSON.parse(m).options[0].text;
        } catch {
          v = e.ajax.xpath("//option", u.xmlDoc)[0].childNodes[0].nodeValue;
        }
        d.cached_options[_] = v, i.addOption(_, v), i.disable(1), i.selectOption(0), i.disable(0);
      }) : i.setComboValue("");
    } else {
      for (var o = [], t = 0; t < d.options.length; t++) {
        var n = d.options[t], s = [n.key, n.label, n.css];
        o.push(s);
      }
      if (i.addOption(o), r[d.map_to]) {
        var c = i.getIndexByValue(r[d.map_to]);
        i.selectOption(c);
      }
    }
  }, get_value: function(h, a, r) {
    var d = h._combo.getSelectedValue();
    return r.script_path && (r.cached_options[d] = h._combo.getSelectedText()), d;
  }, focus: function(h) {
  } }, e.form_blocks.radio = { render: function(h) {
    var a = "";
    a += `<div class='dhx_cal_ltext dhx_cal_radio ${h.vertical ? "dhx_cal_radio_vertical" : ""}' style='max-height:${h.height}px;'>`;
    for (var r = 0; r < h.options.length; r++) {
      var d = e.uid();
      a += "<label class='dhx_cal_radio_item' for='" + d + "'><input id='" + d + "' type='radio' name='" + h.name + "' value='" + h.options[r].key + "'><span> " + h.options[r].label + "</span></label>";
    }
    return a += "</div>";
  }, set_value: function(h, a, r, d) {
    for (var i = h.getElementsByTagName("input"), _ = 0; _ < i.length; _++) {
      i[_].checked = !1;
      var o = r[d.map_to] || a;
      i[_].value == o && (i[_].checked = !0);
    }
  }, get_value: function(h, a, r) {
    for (var d = h.getElementsByTagName("input"), i = 0; i < d.length; i++)
      if (d[i].checked)
        return d[i].value;
  }, focus: function(h) {
  } }, e.form_blocks.checkbox = { render: function(h) {
    return e.config.wide_form ? '<div class="dhx_cal_wide_checkbox"></div>' : "";
  }, set_value: function(h, a, r, d) {
    h = e._lightbox.querySelector(`#${d.id}`);
    var i = e.uid(), _ = d.checked_value !== void 0 ? a == d.checked_value : !!a;
    h.className += " dhx_cal_checkbox";
    var o = "<input id='" + i + "' type='checkbox' value='true' name='" + d.name + "'" + (_ ? "checked='true'" : "") + "'>", t = "<label for='" + i + "'>" + (e.locale.labels["section_" + d.name] || d.name) + "</label>";
    if (e.config.wide_form ? (h.innerHTML = t, h.nextSibling.innerHTML = o) : h.innerHTML = o + t, d.handler) {
      var n = h.getElementsByTagName("input")[0];
      if (n.$_eventAttached)
        return;
      n.$_eventAttached = !0, e.event(n, "click", d.handler);
    }
  }, get_value: function(h, a, r) {
    var d = (h = e._lightbox.querySelector(`#${r.id}`)).getElementsByTagName("input")[0];
    return d || (d = h.nextSibling.getElementsByTagName("input")[0]), d.checked ? r.checked_value || !0 : r.unchecked_value || !1;
  }, focus: function(h) {
  } };
}, expand: function(e) {
  e.ext.fullscreen = { toggleIcon: null }, e.expand = function() {
    if (e.callEvent("onBeforeExpand", [])) {
      var h = e._obj;
      do
        h._position = h.style.position || "", h.style.position = "static";
      while ((h = h.parentNode) && h.style);
      (h = e._obj).style.position = "absolute", h._width = h.style.width, h._height = h.style.height, h.style.width = h.style.height = "100%", h.style.top = h.style.left = "0px";
      var a = document.body;
      a.scrollTop = 0, (a = a.parentNode) && (a.scrollTop = 0), document.body._overflow = document.body.style.overflow || "", document.body.style.overflow = "hidden", e._maximize(), e.callEvent("onExpand", []);
    }
  }, e.collapse = function() {
    if (e.callEvent("onBeforeCollapse", [])) {
      var h = e._obj;
      do
        h.style.position = h._position;
      while ((h = h.parentNode) && h.style);
      (h = e._obj).style.width = h._width, h.style.height = h._height, document.body.style.overflow = document.body._overflow, e._maximize(), e.callEvent("onCollapse", []);
    }
  }, e.attachEvent("onTemplatesReady", function() {
    var h = document.createElement("div");
    h.className = "dhx_expand_icon", e.ext.fullscreen.toggleIcon = h, h.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g>
	<line x1="0.5" y1="5" x2="0.5" y2="3.0598e-08" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line y1="0.5" x2="5" y2="0.5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="0.5" y1="11" x2="0.5" y2="16" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line y1="15.5" x2="5" y2="15.5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="11" y1="0.5" x2="16" y2="0.5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="15.5" y1="2.18557e-08" x2="15.5" y2="5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="11" y1="15.5" x2="16" y2="15.5" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	<line x1="15.5" y1="16" x2="15.5" y2="11" stroke="var(--dhx-scheduler-base-colors-icons)"/>
	</g>
	</svg>
	`, e._obj.appendChild(h), e.event(h, "click", function() {
      e.expanded ? e.collapse() : e.expand();
    });
  }), e._maximize = function() {
    this.expanded = !this.expanded, this.expanded ? this.ext.fullscreen.toggleIcon.classList.add("dhx_expand_icon--expanded") : this.ext.fullscreen.toggleIcon.classList.remove("dhx_expand_icon--expanded");
    for (var h = ["left", "top"], a = 0; a < h.length; a++) {
      var r = e["_prev_margin_" + h[a]];
      e.xy["margin_" + h[a]] ? (e["_prev_margin_" + h[a]] = e.xy["margin_" + h[a]], e.xy["margin_" + h[a]] = 0) : r && (e.xy["margin_" + h[a]] = e["_prev_margin_" + h[a]], delete e["_prev_margin_" + h[a]]);
    }
    e.setCurrentView();
  };
}, export_api: function(e) {
  (function() {
    function h(r, d) {
      for (var i in d)
        r[i] || (r[i] = d[i]);
      return r;
    }
    function a(r, d) {
      var i = {};
      return (r = d._els[r]) && r[0] ? (i.x = r[0].scrollWidth, i.y = r[0].scrollHeight) : (i.x = 0, i.y = 0), i;
    }
    window.dhtmlxAjax || (window.dhtmlxAjax = { post: function(r, d, i) {
      return window.dhx4.ajax.post(r, d, i);
    }, get: function(r, d) {
      return window.ajax.get(r, d);
    } }), function(r) {
      function d() {
        var i = r.getState().mode;
        return r.matrix && r.matrix[i] ? r.matrix[i] : null;
      }
      r.exportToPDF = function(i) {
        (i = h(i || {}, { name: "calendar.pdf", format: "A4", orientation: "landscape", dpi: 96, zoom: 1, rtl: r.config.rtl })).html = this._export_html(i), i.mode = this.getState().mode, this._send_to_export(i, "pdf");
      }, r.exportToPNG = function(i) {
        (i = h(i || {}, { name: "calendar.png", format: "A4", orientation: "landscape", dpi: 96, zoom: 1, rtl: r.config.rtl })).html = this._export_html(i), i.mode = this.getState().mode, this._send_to_export(i, "png");
      }, r.exportToICal = function(i) {
        i = h(i || {}, { name: "calendar.ical", data: this._serialize_plain(null, i) }), this._send_to_export(i, "ical");
      }, r.exportToExcel = function(i) {
        i = h(i || {}, { name: "calendar.xlsx", title: "Events", data: this._serialize_plain(this.templates.xml_format, i), columns: this._serialize_columns() }), this._send_to_export(i, "excel");
      }, r._ajax_to_export = function(i, _, o) {
        delete i.callback;
        var t = i.server || "https://export.dhtmlx.com/scheduler";
        window.dhtmlxAjax.post(t, "type=" + _ + "&store=1&data=" + encodeURIComponent(JSON.stringify(i)), function(n) {
          var s = null;
          if (!(n.xmlDoc.status > 400))
            try {
              s = JSON.parse(n.xmlDoc.responseText);
            } catch {
            }
          o(s);
        });
      }, r._plain_export_copy = function(i, _) {
        var o = {};
        for (var t in i)
          o[t] = i[t];
        return o.start_date = _(o.start_date), o.end_date = _(o.end_date), o.$text = this.templates.event_text(i.start_date, i.end_date, i), o;
      }, r._serialize_plain = function(i, _) {
        var o;
        i = i || r.date.date_to_str("%Y%m%dT%H%i%s", !0), o = _ && _.start && _.end ? r.getEvents(_.start, _.end) : r.getEvents();
        for (var t = [], n = 0; n < o.length; n++)
          t[n] = this._plain_export_copy(o[n], i);
        return t;
      }, r._serialize_columns = function() {
        return [{ id: "start_date", header: "Start Date", width: 30 }, { id: "end_date", header: "End Date", width: 30 }, { id: "$text", header: "Text", width: 100 }];
      }, r._send_to_export = function(i, _) {
        if (i.version || (i.version = r.version), i.skin || (i.skin = r.skin), i.callback)
          return r._ajax_to_export(i, _, i.callback);
        var o = this._create_hidden_form();
        o.firstChild.action = i.server || "https://export.dhtmlx.com/scheduler", o.firstChild.childNodes[0].value = JSON.stringify(i), o.firstChild.childNodes[1].value = _, o.firstChild.submit();
      }, r._create_hidden_form = function() {
        if (!this._hidden_export_form) {
          var i = this._hidden_export_form = document.createElement("div");
          i.style.display = "none", i.innerHTML = "<form method='POST' target='_blank'><input type='text' name='data'><input type='hidden' name='type' value=''></form>", document.body.appendChild(i);
        }
        return this._hidden_export_form;
      }, r._get_export_size = function(i, _, o, t, n, s, c) {
        t = parseInt(t) / 25.4 || 4;
        var u = { A5: { x: 148, y: 210 }, A4: { x: 210, y: 297 }, A3: { x: 297, y: 420 }, A2: { x: 420, y: 594 }, A1: { x: 594, y: 841 }, A0: { x: 841, y: 1189 } }, v = a("dhx_cal_data", this).x, m = { y: a("dhx_cal_data", this).y + a("dhx_cal_header", this).y + a("dhx_multi_day", this).y };
        return m.x = i === "full" ? v : Math.floor((_ === "landscape" ? u[i].y : u[i].x) * t), c && (m.x *= parseFloat(c.x) || 1, m.y *= parseFloat(c.y) || 1), m;
      }, r._export_html = function(i) {
        var _, o, t, n = (_ = void 0, o = void 0, (t = d()) && (o = t.scrollable, _ = t.smart_rendering), { nav_height: r.xy.nav_height, scroll_width: r.xy.scroll_width, style_width: r._obj.style.width, style_height: r._obj.style.height, timeline_scrollable: o, timeline_smart_rendering: _ }), s = r._get_export_size(i.format, i.orientation, i.zoom, i.dpi, i.header, i.footer, i.scales), c = "";
        try {
          (function(u, v) {
            r._obj.style.width = u.x + "px", r._obj.style.height = u.y + "px", r.xy.nav_height = 0, r.xy.scroll_width = 0;
            var m = d();
            (v.timeline_scrollable || v.timeline_smart_rendering) && (m.scrollable = !1, m.smart_rendering = !1);
          })(s, n), r.setCurrentView(), c = r._obj.innerHTML;
        } catch (u) {
          console.error(u);
        } finally {
          (function(u) {
            r.xy.scroll_width = u.scroll_width, r.xy.nav_height = u.nav_height, r._obj.style.width = u.style_width, r._obj.style.height = u.style_height;
            var v = d();
            (u.timeline_scrollable || u.timeline_smart_rendering) && (v.scrollable = u.timeline_scrollable, v.smart_rendering = u.timeline_smart_rendering);
          })(n), r.setCurrentView();
        }
        return c;
      };
    }(e);
  })();
}, grid_view: function(e) {
  R("Grid", e.assert);
}, html_templates: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    for (var h = document.body.getElementsByTagName("DIV"), a = 0; a < h.length; a++) {
      var r = h[a].className || "";
      if ((r = r.split(":")).length == 2 && r[0] == "template") {
        var d = 'return "' + (h[a].innerHTML || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\n\r]+/g, "") + '";';
        d = unescape(d).replace(/\{event\.([a-z]+)\}/g, function(i, _) {
          return '"+ev.' + _ + '+"';
        }), e.templates[r[1]] = Function("start", "end", "ev", d), h[a].style.display = "none";
      }
    }
  });
}, key_nav: function(e) {
  function h(a) {
    var r = { minicalButton: e.$keyboardNavigation.MinicalButton, minicalDate: e.$keyboardNavigation.MinicalCell, scheduler: e.$keyboardNavigation.SchedulerNode, dataArea: e.$keyboardNavigation.DataArea, timeSlot: e.$keyboardNavigation.TimeSlot, event: e.$keyboardNavigation.Event }, d = {};
    for (var i in r)
      d[i.toLowerCase()] = r[i];
    return d[a = (a + "").toLowerCase()] || r.scheduler;
  }
  e.config.key_nav = !0, e.config.key_nav_step = 30, e.addShortcut = function(a, r, d) {
    var i = h(d);
    i && i.prototype.bind(a, r);
  }, e.getShortcutHandler = function(a, r) {
    var d = h(r);
    if (d) {
      var i = e.$keyboardNavigation.shortcuts.parse(a);
      if (i.length)
        return d.prototype.findHandler(i[0]);
    }
  }, e.removeShortcut = function(a, r) {
    var d = h(r);
    d && d.prototype.unbind(a);
  }, e.focus = function() {
    if (e.config.key_nav) {
      var a = e.$keyboardNavigation.dispatcher;
      a.enable();
      var r = a.getActiveNode();
      !r || r instanceof e.$keyboardNavigation.MinicalButton || r instanceof e.$keyboardNavigation.MinicalCell ? a.setDefaultNode() : a.focusNode(a.getActiveNode());
    }
  }, e.$keyboardNavigation = {}, e._compose = function() {
    for (var a = Array.prototype.slice.call(arguments, 0), r = {}, d = 0; d < a.length; d++) {
      var i = a[d];
      for (var _ in typeof i == "function" && (i = new i()), i)
        r[_] = i[_];
    }
    return r;
  }, function(a) {
    a.$keyboardNavigation.shortcuts = { createCommand: function() {
      return { modifiers: { shift: !1, alt: !1, ctrl: !1, meta: !1 }, keyCode: null };
    }, parse: function(r) {
      for (var d = [], i = this.getExpressions(this.trim(r)), _ = 0; _ < i.length; _++) {
        for (var o = this.getWords(i[_]), t = this.createCommand(), n = 0; n < o.length; n++)
          this.commandKeys[o[n]] ? t.modifiers[o[n]] = !0 : this.specialKeys[o[n]] ? t.keyCode = this.specialKeys[o[n]] : t.keyCode = o[n].charCodeAt(0);
        d.push(t);
      }
      return d;
    }, getCommandFromEvent: function(r) {
      var d = this.createCommand();
      d.modifiers.shift = !!r.shiftKey, d.modifiers.alt = !!r.altKey, d.modifiers.ctrl = !!r.ctrlKey, d.modifiers.meta = !!r.metaKey, d.keyCode = r.which || r.keyCode, d.keyCode >= 96 && d.keyCode <= 105 && (d.keyCode -= 48);
      var i = String.fromCharCode(d.keyCode);
      return i && (d.keyCode = i.toLowerCase().charCodeAt(0)), d;
    }, getHashFromEvent: function(r) {
      return this.getHash(this.getCommandFromEvent(r));
    }, getHash: function(r) {
      var d = [];
      for (var i in r.modifiers)
        r.modifiers[i] && d.push(i);
      return d.push(r.keyCode), d.join(this.junctionChar);
    }, getExpressions: function(r) {
      return r.split(this.junctionChar);
    }, getWords: function(r) {
      return r.split(this.combinationChar);
    }, trim: function(r) {
      return r.replace(/\s/g, "");
    }, junctionChar: ",", combinationChar: "+", commandKeys: { shift: 16, alt: 18, ctrl: 17, meta: !0 }, specialKeys: { backspace: 8, tab: 9, enter: 13, esc: 27, space: 32, up: 38, down: 40, left: 37, right: 39, home: 36, end: 35, pageup: 33, pagedown: 34, delete: 46, insert: 45, plus: 107, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123 } };
  }(e), function(a) {
    a.$keyboardNavigation.EventHandler = { _handlers: null, findHandler: function(r) {
      this._handlers || (this._handlers = {});
      var d = a.$keyboardNavigation.shortcuts.getHash(r);
      return this._handlers[d];
    }, doAction: function(r, d) {
      var i = this.findHandler(r);
      i && (i.call(this, d), d.preventDefault ? d.preventDefault() : d.returnValue = !1);
    }, bind: function(r, d) {
      this._handlers || (this._handlers = {});
      for (var i = a.$keyboardNavigation.shortcuts, _ = i.parse(r), o = 0; o < _.length; o++)
        this._handlers[i.getHash(_[o])] = d;
    }, unbind: function(r) {
      for (var d = a.$keyboardNavigation.shortcuts, i = d.parse(r), _ = 0; _ < i.length; _++)
        this._handlers[d.getHash(i[_])] && delete this._handlers[d.getHash(i[_])];
    }, bindAll: function(r) {
      for (var d in r)
        this.bind(d, r[d]);
    }, initKeys: function() {
      this._handlers || (this._handlers = {}), this.keys && this.bindAll(this.keys);
    } };
  }(e), function(a) {
    a.$keyboardNavigation.getFocusableNodes = a._getFocusableNodes, a.$keyboardNavigation.trapFocus = function(r, d) {
      if (d.keyCode != 9)
        return !1;
      for (var i, _ = a.$keyboardNavigation.getFocusableNodes(r), o = document.activeElement, t = -1, n = 0; n < _.length; n++)
        if (_[n] == o) {
          t = n;
          break;
        }
      if (d.shiftKey) {
        if (i = _[t <= 0 ? _.length - 1 : t - 1])
          return i.focus(), d.preventDefault(), !0;
      } else if (i = _[t >= _.length - 1 ? 0 : t + 1])
        return i.focus(), d.preventDefault(), !0;
      return !1;
    };
  }(e), function(a) {
    a.$keyboardNavigation.marker = { clear: function() {
      for (var r = a.$container.querySelectorAll(".dhx_focus_slot"), d = 0; d < r.length; d++)
        r[d].parentNode.removeChild(r[d]);
    }, createElement: function() {
      var r = document.createElement("div");
      return r.setAttribute("tabindex", -1), r.className = "dhx_focus_slot", r;
    }, renderMultiple: function(r, d, i) {
      for (var _ = [], o = new Date(r), t = new Date(Math.min(d.valueOf(), a.date.add(a.date.day_start(new Date(r)), 1, "day").valueOf())); o.valueOf() < d.valueOf(); )
        _ = _.concat(i.call(this, o, new Date(Math.min(t.valueOf(), d.valueOf())))), o = a.date.day_start(a.date.add(o, 1, "day")), t = a.date.day_start(a.date.add(o, 1, "day")), t = new Date(Math.min(t.valueOf(), d.valueOf()));
      return _;
    }, render: function(r, d, i) {
      this.clear();
      var _ = [], o = a.$keyboardNavigation.TimeSlot.prototype._modes;
      switch (a.$keyboardNavigation.TimeSlot.prototype._getMode()) {
        case o.units:
          _ = this.renderVerticalMarker(r, d, i);
          break;
        case o.timeline:
          _ = this.renderTimelineMarker(r, d, i);
          break;
        case o.year:
          _ = _.concat(this.renderMultiple(r, d, this.renderYearMarker));
          break;
        case o.month:
          _ = this.renderMonthMarker(r, d);
          break;
        case o.weekAgenda:
          _ = _.concat(this.renderMultiple(r, d, this.renderWeekAgendaMarker));
          break;
        case o.list:
          _ = this.renderAgendaMarker(r, d);
          break;
        case o.dayColumns:
          _ = _.concat(this.renderMultiple(r, d, this.renderVerticalMarker));
      }
      this.addWaiAriaLabel(_, r, d, i), this.addDataAttributes(_, r, d, i);
      for (var t = _.length - 1; t >= 0; t--)
        if (_[t].offsetWidth)
          return _[t];
      return null;
    }, addDataAttributes: function(r, d, i, _) {
      for (var o = a.date.date_to_str(a.config.api_date), t = o(d), n = o(i), s = 0; s < r.length; s++)
        r[s].setAttribute("data-start-date", t), r[s].setAttribute("data-end-date", n), _ && r[s].setAttribute("data-section", _);
    }, addWaiAriaLabel: function(r, d, i, _) {
      var o = "", t = a.getState().mode, n = !1;
      if (o += a.templates.day_date(d), a.date.day_start(new Date(d)).valueOf() != d.valueOf() && (o += " " + a.templates.hour_scale(d), n = !0), a.date.day_start(new Date(d)).valueOf() != a.date.day_start(new Date(i)).valueOf() && (o += " - " + a.templates.day_date(i), (n || a.date.day_start(new Date(i)).valueOf() != i.valueOf()) && (o += " " + a.templates.hour_scale(i))), _) {
        if (a.matrix && a.matrix[t]) {
          const c = a.matrix[t], u = c.y_unit[c.order[_]];
          o += ", " + a.templates[t + "_scale_label"](u.key, u.label, u);
        } else if (a._props && a._props[t]) {
          const c = a._props[t], u = c.options[c.order[_]];
          o += ", " + a.templates[t + "_scale_text"](u.key, u.label, u);
        }
      }
      for (var s = 0; s < r.length; s++)
        a._waiAria.setAttributes(r[s], { "aria-label": o, "aria-live": "polite" });
    }, renderWeekAgendaMarker: function(r, d) {
      for (var i = a.$container.querySelectorAll(".dhx_wa_day_cont .dhx_wa_scale_bar"), _ = a.date.week_start(new Date(a.getState().min_date)), o = -1, t = a.date.day_start(new Date(r)), n = 0; n < i.length && (o++, a.date.day_start(new Date(_)).valueOf() != t.valueOf()); n++)
        _ = a.date.add(_, 1, "day");
      return o != -1 ? this._wrapDiv(i[o]) : [];
    }, _wrapDiv: function(r) {
      var d = this.createElement();
      return d.style.top = r.offsetTop + "px", d.style.left = r.offsetLeft + "px", d.style.width = r.offsetWidth + "px", d.style.height = r.offsetHeight + "px", r.appendChild(d), [d];
    }, renderYearMarker: function(r, d) {
      var i = a._get_year_cell(r);
      i.style.position = "relative";
      var _ = this.createElement();
      return _.style.top = "0px", _.style.left = "0px", _.style.width = "100%", _.style.height = "100%", i.appendChild(_), [_];
    }, renderAgendaMarker: function(r, d) {
      var i = this.createElement();
      return i.style.height = "1px", i.style.width = "100%", i.style.opacity = 1, i.style.top = "0px", i.style.left = "0px", a.$container.querySelector(".dhx_cal_data").appendChild(i), [i];
    }, renderTimelineMarker: function(r, d, i) {
      var _ = a._lame_copy({}, a.matrix[a._mode]), o = _._scales;
      _.round_position = !1;
      var t = [], n = r ? new Date(r) : a._min_date, s = d ? new Date(d) : a._max_date;
      if (n.valueOf() < a._min_date.valueOf() && (n = new Date(a._min_date)), s.valueOf() > a._max_date.valueOf() && (s = new Date(a._max_date)), !_._trace_x)
        return t;
      for (var c = 0; c < _._trace_x.length && !a._is_column_visible(_._trace_x[c]); c++)
        ;
      if (c == _._trace_x.length)
        return t;
      var u = o[i];
      if (!(n < d && s > r))
        return t;
      var v = this.createElement();
      let m, l;
      function f(b, k) {
        k.setDate(1), k.setFullYear(b.getFullYear()), k.setMonth(b.getMonth()), k.setDate(b.getDate());
      }
      if (a.getView().days) {
        const b = new Date(r);
        f(a._min_date, b);
        const k = new Date(d);
        f(a._min_date, k), m = a._timeline_getX({ start_date: b }, !1, _), l = a._timeline_getX({ start_date: k }, !1, _);
      } else
        m = a._timeline_getX({ start_date: r }, !1, _), l = a._timeline_getX({ start_date: d }, !1, _);
      var g = _._section_height[i] - 1 || _.dy - 1, p = 0;
      a._isRender("cell") && (p = u.offsetTop, m += _.dx, l += _.dx, u = a.$container.querySelector(".dhx_cal_data"));
      var y = Math.max(1, l - m - 1);
      let w = "left";
      return a.config.rtl && (w = "right"), v.style.cssText = `height:${g}px; ${w}:${m}px; width:${y}px; top:${p}px;`, u && (u.appendChild(v), t.push(v)), t;
    }, renderMonthCell: function(r) {
      for (var d = a.$container.querySelectorAll(".dhx_month_head"), i = [], _ = 0; _ < d.length; _++)
        i.push(d[_].parentNode);
      var o = -1, t = 0, n = -1, s = a.date.week_start(new Date(a.getState().min_date)), c = a.date.day_start(new Date(r));
      for (_ = 0; _ < i.length && (o++, n == 6 ? (t++, n = 0) : n++, a.date.day_start(new Date(s)).valueOf() != c.valueOf()); _++)
        s = a.date.add(s, 1, "day");
      if (o == -1)
        return [];
      var u = a._colsS[n], v = a._colsS.heights[t], m = this.createElement();
      m.style.top = v + "px", m.style.left = u + "px", m.style.width = a._cols[n] + "px", m.style.height = (a._colsS.heights[t + 1] - v || a._colsS.height) + "px";
      var l = a.$container.querySelector(".dhx_cal_data"), f = l.querySelector(".dhx_cal_month_table");
      return f.nextSibling ? l.insertBefore(m, f.nextSibling) : l.appendChild(m), m;
    }, renderMonthMarker: function(r, d) {
      for (var i = [], _ = r; _.valueOf() < d.valueOf(); )
        i.push(this.renderMonthCell(_)), _ = a.date.add(_, 1, "day");
      return i;
    }, renderVerticalMarker: function(r, d, i) {
      var _ = a.locate_holder_day(r), o = [], t = null, n = a.config;
      if (a._ignores[_])
        return o;
      if (a._props && a._props[a._mode] && i) {
        var s = a._props[a._mode];
        _ = s.order[i];
        var c = s.order[i];
        s.days > 1 ? _ = a.locate_holder_day(r) + c : (_ = c, s.size && _ > s.position + s.size && (_ = 0));
      }
      if (!(t = a.locate_holder(_)) || t.querySelector(".dhx_scale_hour"))
        return document.createElement("div");
      var u = Math.max(60 * r.getHours() + r.getMinutes(), 60 * n.first_hour), v = Math.min(60 * d.getHours() + d.getMinutes(), 60 * n.last_hour);
      if (!v && a.date.day_start(new Date(d)).valueOf() > a.date.day_start(new Date(r)).valueOf() && (v = 60 * n.last_hour), v <= u)
        return [];
      var m = this.createElement(), l = a.config.hour_size_px * n.last_hour + 1, f = 36e5;
      return m.style.top = Math.round((60 * u * 1e3 - a.config.first_hour * f) * a.config.hour_size_px / f) % l + "px", m.style.lineHeight = m.style.height = Math.max(Math.round(60 * (v - u) * 1e3 * a.config.hour_size_px / f) % l, 1) + "px", m.style.width = "100%", t.appendChild(m), o.push(m), o[0];
    } };
  }(e), function(a) {
    a.$keyboardNavigation.SchedulerNode = function() {
    }, a.$keyboardNavigation.SchedulerNode.prototype = a._compose(a.$keyboardNavigation.EventHandler, { getDefaultNode: function() {
      var r = new a.$keyboardNavigation.TimeSlot();
      return r.isValid() || (r = r.fallback()), r;
    }, _modes: { month: "month", year: "year", dayColumns: "dayColumns", timeline: "timeline", units: "units", weekAgenda: "weekAgenda", list: "list" }, getMode: function() {
      var r = a.getState().mode;
      return a.matrix && a.matrix[r] ? this._modes.timeline : a._props && a._props[r] ? this._modes.units : r == "month" ? this._modes.month : r == "year" ? this._modes.year : r == "week_agenda" ? this._modes.weekAgenda : r == "map" || r == "agenda" || a._grid && a["grid_" + r] ? this._modes.list : this._modes.dayColumns;
    }, focus: function() {
      a.focus();
    }, blur: function() {
    }, disable: function() {
      a.$container.setAttribute("tabindex", "0");
    }, enable: function() {
      a.$container && a.$container.removeAttribute("tabindex");
    }, isEnabled: function() {
      return a.$container.hasAttribute("tabindex");
    }, _compareEvents: function(r, d) {
      return r.start_date.valueOf() == d.start_date.valueOf() ? r.id > d.id ? 1 : -1 : r.start_date.valueOf() > d.start_date.valueOf() ? 1 : -1;
    }, _pickEvent: function(r, d, i, _) {
      var o = a.getState();
      r = new Date(Math.max(o.min_date.valueOf(), r.valueOf())), d = new Date(Math.min(o.max_date.valueOf(), d.valueOf()));
      var t = a.getEvents(r, d);
      t.sort(this._compareEvents), _ && (t = t.reverse());
      for (var n = !!i, s = 0; s < t.length && n; s++)
        t[s].id == i && (n = !1), t.splice(s, 1), s--;
      for (s = 0; s < t.length; s++)
        if (new a.$keyboardNavigation.Event(t[s].id).getNode())
          return t[s];
      return null;
    }, nextEventHandler: function(r) {
      var d = a.$keyboardNavigation.dispatcher.activeNode, i = r || d && d.eventId, _ = null;
      if (i && a.getEvent(i)) {
        var o = a.getEvent(i);
        _ = a.$keyboardNavigation.SchedulerNode.prototype._pickEvent(o.start_date, a.date.add(o.start_date, 1, "year"), o.id, !1);
      }
      if (!_ && !r) {
        var t = a.getState();
        _ = a.$keyboardNavigation.SchedulerNode.prototype._pickEvent(t.min_date, a.date.add(t.min_date, 1, "year"), null, !1);
      }
      if (_) {
        var n = new a.$keyboardNavigation.Event(_.id);
        n.isValid() ? (d && d.blur(), a.$keyboardNavigation.dispatcher.setActiveNode(n)) : this.nextEventHandler(_.id);
      }
    }, prevEventHandler: function(r) {
      var d = a.$keyboardNavigation.dispatcher.activeNode, i = r || d && d.eventId, _ = null;
      if (i && a.getEvent(i)) {
        var o = a.getEvent(i);
        _ = a.$keyboardNavigation.SchedulerNode.prototype._pickEvent(a.date.add(o.end_date, -1, "year"), o.end_date, o.id, !0);
      }
      if (!_ && !r) {
        var t = a.getState();
        _ = a.$keyboardNavigation.SchedulerNode.prototype._pickEvent(a.date.add(t.max_date, -1, "year"), t.max_date, null, !0);
      }
      if (_) {
        var n = new a.$keyboardNavigation.Event(_.id);
        n.isValid() ? (d && d.blur(), a.$keyboardNavigation.dispatcher.setActiveNode(n)) : this.prevEventHandler(_.id);
      }
    }, keys: { "alt+1, alt+2, alt+3, alt+4, alt+5, alt+6, alt+7, alt+8, alt+9": function(r) {
      var d = a.$keyboardNavigation.HeaderCell.prototype.getNodes(".dhx_cal_navline .dhx_cal_tab"), i = r.key;
      i === void 0 && (i = r.keyCode - 48), d[1 * i - 1] && d[1 * i - 1].click();
    }, "ctrl+left,meta+left": function(r) {
      a._click.dhx_cal_prev_button();
    }, "ctrl+right,meta+right": function(r) {
      a._click.dhx_cal_next_button();
    }, "ctrl+up,meta+up": function(r) {
      a.$container.querySelector(".dhx_cal_data").scrollTop -= 20;
    }, "ctrl+down,meta+down": function(r) {
      a.$container.querySelector(".dhx_cal_data").scrollTop += 20;
    }, e: function() {
      this.nextEventHandler();
    }, home: function() {
      a.setCurrentView(/* @__PURE__ */ new Date());
    }, "shift+e": function() {
      this.prevEventHandler();
    }, "ctrl+enter,meta+enter": function() {
      a.addEventNow({ start_date: new Date(a.getState().date) });
    }, "ctrl+c,meta+c": function(r) {
      a._key_nav_copy_paste(r);
    }, "ctrl+v,meta+v": function(r) {
      a._key_nav_copy_paste(r);
    }, "ctrl+x,meta+x": function(r) {
      a._key_nav_copy_paste(r);
    } } }), a.$keyboardNavigation.SchedulerNode.prototype.bindAll(a.$keyboardNavigation.SchedulerNode.prototype.keys);
  }(e), function(a) {
    a.$keyboardNavigation.KeyNavNode = function() {
    }, a.$keyboardNavigation.KeyNavNode.prototype = a._compose(a.$keyboardNavigation.EventHandler, { isValid: function() {
      return !0;
    }, fallback: function() {
      return null;
    }, moveTo: function(r) {
      a.$keyboardNavigation.dispatcher.setActiveNode(r);
    }, compareTo: function(r) {
      if (!r)
        return !1;
      for (var d in this) {
        if (!!this[d] != !!r[d])
          return !1;
        var i = !(!this[d] || !this[d].toString), _ = !(!r[d] || !r[d].toString);
        if (_ != i)
          return !1;
        if (_ && i) {
          if (r[d].toString() != this[d].toString())
            return !1;
        } else if (r[d] != this[d])
          return !1;
      }
      return !0;
    }, getNode: function() {
    }, focus: function() {
      var r = this.getNode();
      r && (r.setAttribute("tabindex", "-1"), r.focus && r.focus());
    }, blur: function() {
      var r = this.getNode();
      r && r.setAttribute("tabindex", "-1");
    } });
  }(e), function(a) {
    a.$keyboardNavigation.HeaderCell = function(r) {
      this.index = r || 0;
    }, a.$keyboardNavigation.HeaderCell.prototype = a._compose(a.$keyboardNavigation.KeyNavNode, { getNode: function(r) {
      r = r || this.index || 0;
      var d = this.getNodes();
      if (d[r])
        return d[r];
    }, getNodes: function(r) {
      r = r || [".dhx_cal_navline .dhx_cal_prev_button", ".dhx_cal_navline .dhx_cal_next_button", ".dhx_cal_navline .dhx_cal_today_button", ".dhx_cal_navline .dhx_cal_tab"].join(", ");
      var d = Array.prototype.slice.call(a.$container.querySelectorAll(r));
      return d.sort(function(i, _) {
        return i.offsetLeft - _.offsetLeft;
      }), d;
    }, _handlers: null, isValid: function() {
      return !!this.getNode(this.index);
    }, fallback: function() {
      var r = this.getNode(0);
      return r || (r = new a.$keyboardNavigation.TimeSlot()), r;
    }, keys: { left: function() {
      var r = this.index - 1;
      r < 0 && (r = this.getNodes().length - 1), this.moveTo(new a.$keyboardNavigation.HeaderCell(r));
    }, right: function() {
      var r = this.index + 1;
      r >= this.getNodes().length && (r = 0), this.moveTo(new a.$keyboardNavigation.HeaderCell(r));
    }, down: function() {
      this.moveTo(new a.$keyboardNavigation.TimeSlot());
    }, enter: function() {
      var r = this.getNode();
      r && r.click();
    } } }), a.$keyboardNavigation.HeaderCell.prototype.bindAll(a.$keyboardNavigation.HeaderCell.prototype.keys);
  }(e), function(a) {
    a.$keyboardNavigation.Event = function(r) {
      if (this.eventId = null, a.getEvent(r)) {
        var d = a.getEvent(r);
        this.start = new Date(d.start_date), this.end = new Date(d.end_date), this.section = this._getSection(d), this.eventId = r;
      }
    }, a.$keyboardNavigation.Event.prototype = a._compose(a.$keyboardNavigation.KeyNavNode, { _getNodes: function() {
      return Array.prototype.slice.call(a.$container.querySelectorAll("[" + a.config.event_attribute + "]"));
    }, _modes: a.$keyboardNavigation.SchedulerNode.prototype._modes, getMode: a.$keyboardNavigation.SchedulerNode.prototype.getMode, _handlers: null, isValid: function() {
      return !(!a.getEvent(this.eventId) || !this.getNode());
    }, fallback: function() {
      var r = this._getNodes()[0], d = null;
      if (r && a._locate_event(r)) {
        var i = a._locate_event(r);
        d = new a.$keyboardNavigation.Event(i);
      } else
        d = new a.$keyboardNavigation.TimeSlot();
      return d;
    }, isScrolledIntoView: function(r) {
      var d = r.getBoundingClientRect(), i = a.$container.querySelector(".dhx_cal_data").getBoundingClientRect();
      return !(d.bottom < i.top || d.top > i.bottom);
    }, getNode: function() {
      var r = "[" + a.config.event_attribute + "='" + this.eventId + "']", d = a.$keyboardNavigation.dispatcher.getInlineEditor(this.eventId);
      if (d)
        return d;
      if (a.isMultisectionEvent && a.isMultisectionEvent(a.getEvent(this.eventId))) {
        for (var i = a.$container.querySelectorAll(r), _ = 0; _ < i.length; _++)
          if (this.isScrolledIntoView(i[_]))
            return i[_];
        return i[0];
      }
      return a.$container.querySelector(r);
    }, focus: function() {
      var r = a.getEvent(this.eventId), d = a.getState();
      (r.start_date.valueOf() > d.max_date.valueOf() || r.end_date.valueOf() <= d.min_date.valueOf()) && a.setCurrentView(r.start_date);
      var i = this.getNode();
      this.isScrolledIntoView(i) ? a.$keyboardNavigation.dispatcher.keepScrollPosition((function() {
        a.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
      }).bind(this)) : a.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      a.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, _getSection: function(r) {
      var d = null, i = a.getState().mode;
      return a.matrix && a.matrix[i] ? d = r[a.matrix[a.getState().mode].y_property] : a._props && a._props[i] && (d = r[a._props[i].map_to]), d;
    }, _moveToSlot: function(r) {
      var d = a.getEvent(this.eventId);
      if (d) {
        var i = this._getSection(d), _ = new a.$keyboardNavigation.TimeSlot(d.start_date, null, i);
        this.moveTo(_.nextSlot(_, r));
      } else
        this.moveTo(new a.$keyboardNavigation.TimeSlot());
    }, keys: { left: function() {
      this._moveToSlot("left");
    }, right: function() {
      this._moveToSlot("right");
    }, down: function() {
      this.getMode() == this._modes.list ? a.$keyboardNavigation.SchedulerNode.prototype.nextEventHandler() : this._moveToSlot("down");
    }, space: function() {
      var r = this.getNode();
      r && r.click ? r.click() : this.moveTo(new a.$keyboardNavigation.TimeSlot());
    }, up: function() {
      this.getMode() == this._modes.list ? a.$keyboardNavigation.SchedulerNode.prototype.prevEventHandler() : this._moveToSlot("up");
    }, delete: function() {
      a.getEvent(this.eventId) ? a._click.buttons.delete(this.eventId) : this.moveTo(new a.$keyboardNavigation.TimeSlot());
    }, enter: function() {
      a.getEvent(this.eventId) ? a.showLightbox(this.eventId) : this.moveTo(new a.$keyboardNavigation.TimeSlot());
    } } }), a.$keyboardNavigation.Event.prototype.bindAll(a.$keyboardNavigation.Event.prototype.keys);
  }(e), function(a) {
    a.$keyboardNavigation.TimeSlot = function(r, d, i, _) {
      var o = a.getState(), t = a.matrix && a.matrix[o.mode];
      r || (r = this.getDefaultDate()), d || (d = t ? a.date.add(r, t.x_step, t.x_unit) : a.date.add(r, a.config.key_nav_step, "minute")), this.section = i || this._getDefaultSection(), this.start_date = new Date(r), this.end_date = new Date(d), this.movingDate = _ || null;
    }, a.$keyboardNavigation.TimeSlot.prototype = a._compose(a.$keyboardNavigation.KeyNavNode, { _handlers: null, getDefaultDate: function() {
      var r, d = a.getState(), i = new Date(d.date);
      i.setSeconds(0), i.setMilliseconds(0);
      var _ = /* @__PURE__ */ new Date();
      _.setSeconds(0), _.setMilliseconds(0);
      var o = a.matrix && a.matrix[d.mode], t = !1;
      if (i.valueOf() === _.valueOf() && (t = !0), o)
        t ? (o.x_unit === "day" ? (_.setHours(0), _.setMinutes(0)) : o.x_unit === "hour" && _.setMinutes(0), r = _) : r = a.date[o.name + "_start"](new Date(d.date)), r = this.findVisibleColumn(r);
      else if (r = new Date(a.getState().min_date), t && (r = _), r = this.findVisibleColumn(r), t || r.setHours(a.config.first_hour), !a._table_view) {
        var n = a.$container.querySelector(".dhx_cal_data");
        n.scrollTop && r.setHours(a.config.first_hour + Math.ceil(n.scrollTop / a.config.hour_size_px));
      }
      return r;
    }, clone: function(r) {
      return new a.$keyboardNavigation.TimeSlot(r.start_date, r.end_date, r.section, r.movingDate);
    }, _getMultisectionView: function() {
      var r, d = a.getState();
      return a._props && a._props[d.mode] ? r = a._props[d.mode] : a.matrix && a.matrix[d.mode] && (r = a.matrix[d.mode]), r;
    }, _getDefaultSection: function() {
      var r = null;
      return this._getMultisectionView() && !r && (r = this._getNextSection()), r;
    }, _getNextSection: function(r, d) {
      var i = this._getMultisectionView(), _ = i.order[r], o = _;
      (o = _ !== void 0 ? _ + d : i.size && i.position ? i.position : 0) < 0 && (o = 0);
      var t = i.options || i.y_unit;
      return o >= t.length && (o = t.length - 1), t[o] ? t[o].key : null;
    }, isValid: function() {
      var r = a.getState();
      if (this.start_date.valueOf() < r.min_date.valueOf() || this.start_date.valueOf() >= r.max_date.valueOf() || !this.isVisible(this.start_date, this.end_date))
        return !1;
      var d = this._getMultisectionView();
      return !d || d.order[this.section] !== void 0;
    }, fallback: function() {
      var r = new a.$keyboardNavigation.TimeSlot();
      return r.isValid() ? r : new a.$keyboardNavigation.DataArea();
    }, getNodes: function() {
      return Array.prototype.slice.call(a.$container.querySelectorAll(".dhx_focus_slot"));
    }, getNode: function() {
      return this.getNodes()[0];
    }, focus: function() {
      this.section && a.getView() && a.getView().smart_rendering && a.getView().scrollTo && !a.$container.querySelector(`[data-section-id="${this.section}"]`) && a.getView().scrollTo({ section: this.section }), a.$keyboardNavigation.marker.render(this.start_date, this.end_date, this.section), a.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this), a.$keyboardNavigation._pasteDate = this.start_date, a.$keyboardNavigation._pasteSection = this.section;
    }, blur: function() {
      a.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this), a.$keyboardNavigation.marker.clear();
    }, _modes: a.$keyboardNavigation.SchedulerNode.prototype._modes, _getMode: a.$keyboardNavigation.SchedulerNode.prototype.getMode, addMonthDate: function(r, d, i) {
      var _;
      switch (d) {
        case "up":
          _ = a.date.add(r, -1, "week");
          break;
        case "down":
          _ = a.date.add(r, 1, "week");
          break;
        case "left":
          _ = a.date.day_start(a.date.add(r, -1, "day")), _ = this.findVisibleColumn(_, -1);
          break;
        case "right":
          _ = a.date.day_start(a.date.add(r, 1, "day")), _ = this.findVisibleColumn(_, 1);
          break;
        default:
          _ = a.date.day_start(new Date(r));
      }
      var o = a.getState();
      return (r.valueOf() < o.min_date.valueOf() || !i && r.valueOf() >= o.max_date.valueOf()) && (_ = new Date(o.min_date)), _;
    }, nextMonthSlot: function(r, d, i) {
      var _, o;
      return (_ = this.addMonthDate(r.start_date, d, i)).setHours(a.config.first_hour), (o = new Date(_)).setHours(a.config.last_hour), { start_date: _, end_date: o };
    }, _alignTimeSlot: function(r, d, i, _) {
      for (var o = new Date(d); o.valueOf() < r.valueOf(); )
        o = a.date.add(o, _, i);
      return o.valueOf() > r.valueOf() && (o = a.date.add(o, -_, i)), o;
    }, nextTimelineSlot: function(r, d, i) {
      var _ = a.getState(), o = a.matrix[_.mode], t = this._alignTimeSlot(r.start_date, a.date[o.name + "_start"](new Date(r.start_date)), o.x_unit, o.x_step), n = this._alignTimeSlot(r.end_date, a.date[o.name + "_start"](new Date(r.end_date)), o.x_unit, o.x_step);
      n.valueOf() <= t.valueOf() && (n = a.date.add(t, o.x_step, o.x_unit));
      var s = this.clone(r);
      switch (s.start_date = t, s.end_date = n, s.section = r.section || this._getNextSection(), d) {
        case "up":
          s.section = this._getNextSection(r.section, -1);
          break;
        case "down":
          s.section = this._getNextSection(r.section, 1);
          break;
        case "left":
          s.start_date = this.findVisibleColumn(a.date.add(s.start_date, -o.x_step, o.x_unit), -1), s.end_date = a.date.add(s.start_date, o.x_step, o.x_unit);
          break;
        case "right":
          s.start_date = this.findVisibleColumn(a.date.add(s.start_date, o.x_step, o.x_unit), 1), s.end_date = a.date.add(s.start_date, o.x_step, o.x_unit);
      }
      return (s.start_date.valueOf() < _.min_date.valueOf() || s.start_date.valueOf() >= _.max_date.valueOf()) && (i && s.start_date.valueOf() >= _.max_date.valueOf() ? s.start_date = new Date(_.max_date) : (s.start_date = a.date[_.mode + "_start"](a.date.add(_.date, d == "left" ? -1 : 1, _.mode)), s.end_date = a.date.add(s.start_date, o.x_step, o.x_unit))), s;
    }, nextUnitsSlot: function(r, d, i) {
      var _ = this.clone(r);
      _.section = r.section || this._getNextSection();
      var o = r.section || this._getNextSection(), t = a.getState(), n = a._props[t.mode];
      switch (d) {
        case "left":
          o = this._getNextSection(r.section, -1);
          var s = n.size ? n.size - 1 : n.options.length;
          n.days > 1 && n.order[o] == s - 1 && a.date.add(r.start_date, -1, "day").valueOf() >= t.min_date.valueOf() && (_ = this.nextDaySlot(r, d, i));
          break;
        case "right":
          o = this._getNextSection(r.section, 1), n.days > 1 && !n.order[o] && a.date.add(r.start_date, 1, "day").valueOf() < t.max_date.valueOf() && (_ = this.nextDaySlot(r, d, i));
          break;
        default:
          _ = this.nextDaySlot(r, d, i), o = r.section;
      }
      return _.section = o, _;
    }, _moveDate: function(r, d) {
      var i = this.findVisibleColumn(a.date.add(r, d, "day"), d);
      return i.setHours(r.getHours()), i.setMinutes(r.getMinutes()), i;
    }, isBeforeLastHour: function(r, d) {
      var i = r.getMinutes(), _ = r.getHours(), o = a.config.last_hour;
      return _ < o || !d && (o == 24 || _ == o) && !i;
    }, isAfterFirstHour: function(r, d) {
      var i = r.getMinutes(), _ = r.getHours(), o = a.config.first_hour, t = a.config.last_hour;
      return _ >= o || !d && !i && (!_ && t == 24 || _ == t);
    }, isInVisibleDayTime: function(r, d) {
      return this.isBeforeLastHour(r, d) && this.isAfterFirstHour(r, d);
    }, nextDaySlot: function(r, d, i) {
      var _, o, t = a.config.key_nav_step, n = this._alignTimeSlot(r.start_date, a.date.day_start(new Date(r.start_date)), "minute", t), s = r.start_date;
      switch (d) {
        case "up":
          if (_ = a.date.add(n, -t, "minute"), !this.isInVisibleDayTime(_, !0) && (!i || this.isInVisibleDayTime(s, !0))) {
            var c = !0;
            i && a.date.date_part(new Date(_)).valueOf() != a.date.date_part(new Date(s)).valueOf() && (c = !1), c && (_ = this.findVisibleColumn(a.date.add(r.start_date, -1, "day"), -1)), _.setHours(a.config.last_hour), _.setMinutes(0), _ = a.date.add(_, -t, "minute");
          }
          o = a.date.add(_, t, "minute");
          break;
        case "down":
          _ = a.date.add(n, t, "minute");
          var u = i ? _ : a.date.add(_, t, "minute");
          this.isInVisibleDayTime(u, !1) || i && !this.isInVisibleDayTime(s, !1) || (i ? (c = !0, a.date.date_part(new Date(s)).valueOf() == s.valueOf() && (c = !1), c && (_ = this.findVisibleColumn(a.date.add(r.start_date, 1, "day"), 1)), _.setHours(a.config.first_hour), _.setMinutes(0), _ = a.date.add(_, t, "minute")) : ((_ = this.findVisibleColumn(a.date.add(r.start_date, 1, "day"), 1)).setHours(a.config.first_hour), _.setMinutes(0))), o = a.date.add(_, t, "minute");
          break;
        case "left":
          _ = this._moveDate(r.start_date, -1), o = this._moveDate(r.end_date, -1);
          break;
        case "right":
          _ = this._moveDate(r.start_date, 1), o = this._moveDate(r.end_date, 1);
          break;
        default:
          _ = n, o = a.date.add(_, t, "minute");
      }
      return { start_date: _, end_date: o };
    }, nextWeekAgendaSlot: function(r, d) {
      var i, _, o = a.getState();
      switch (d) {
        case "down":
        case "left":
          i = a.date.day_start(a.date.add(r.start_date, -1, "day")), i = this.findVisibleColumn(i, -1);
          break;
        case "up":
        case "right":
          i = a.date.day_start(a.date.add(r.start_date, 1, "day")), i = this.findVisibleColumn(i, 1);
          break;
        default:
          i = a.date.day_start(r.start_date);
      }
      return (r.start_date.valueOf() < o.min_date.valueOf() || r.start_date.valueOf() >= o.max_date.valueOf()) && (i = new Date(o.min_date)), (_ = new Date(i)).setHours(a.config.last_hour), { start_date: i, end_date: _ };
    }, nextAgendaSlot: function(r, d) {
      return { start_date: r.start_date, end_date: r.end_date };
    }, isDateVisible: function(r) {
      if (!a._ignores_detected)
        return !0;
      var d, i = a.matrix && a.matrix[a.getState().mode];
      return d = i ? a._get_date_index(i, r) : a.locate_holder_day(r), !a._ignores[d];
    }, findVisibleColumn: function(r, d) {
      var i = r;
      d = d || 1;
      for (var _ = a.getState(); !this.isDateVisible(i) && (d > 0 && i.valueOf() <= _.max_date.valueOf() || d < 0 && i.valueOf() >= _.min_date.valueOf()); )
        i = this.nextDateColumn(i, d);
      return i;
    }, nextDateColumn: function(r, d) {
      d = d || 1;
      var i = a.matrix && a.matrix[a.getState().mode];
      return i ? a.date.add(r, d * i.x_step, i.x_unit) : a.date.day_start(a.date.add(r, d, "day"));
    }, isVisible: function(r, d) {
      if (!a._ignores_detected)
        return !0;
      for (var i = new Date(r); i.valueOf() < d.valueOf(); ) {
        if (this.isDateVisible(i))
          return !0;
        i = this.nextDateColumn(i);
      }
      return !1;
    }, nextSlot: function(r, d, i, _) {
      var o;
      i = i || this._getMode();
      var t = a.$keyboardNavigation.TimeSlot.prototype.clone(r);
      switch (i) {
        case this._modes.units:
          o = this.nextUnitsSlot(t, d, _);
          break;
        case this._modes.timeline:
          o = this.nextTimelineSlot(t, d, _);
          break;
        case this._modes.year:
        case this._modes.month:
          o = this.nextMonthSlot(t, d, _);
          break;
        case this._modes.weekAgenda:
          o = this.nextWeekAgendaSlot(t, d, _);
          break;
        case this._modes.list:
          o = this.nextAgendaSlot(t, d, _);
          break;
        case this._modes.dayColumns:
          o = this.nextDaySlot(t, d, _);
      }
      return o.start_date.valueOf() >= o.end_date.valueOf() && (o = this.nextSlot(o, d, i)), a.$keyboardNavigation.TimeSlot.prototype.clone(o);
    }, extendSlot: function(r, d) {
      var i;
      switch (this._getMode()) {
        case this._modes.units:
          i = d == "left" || d == "right" ? this.nextUnitsSlot(r, d) : this.extendUnitsSlot(r, d);
          break;
        case this._modes.timeline:
          i = d == "down" || d == "up" ? this.nextTimelineSlot(r, d) : this.extendTimelineSlot(r, d);
          break;
        case this._modes.year:
        case this._modes.month:
          i = this.extendMonthSlot(r, d);
          break;
        case this._modes.dayColumns:
          i = this.extendDaySlot(r, d);
          break;
        case this._modes.weekAgenda:
          i = this.extendWeekAgendaSlot(r, d);
          break;
        default:
          i = r;
      }
      var _ = a.getState();
      return i.start_date.valueOf() < _.min_date.valueOf() && (i.start_date = this.findVisibleColumn(_.min_date), i.start_date.setHours(a.config.first_hour)), i.end_date.valueOf() > _.max_date.valueOf() && (i.end_date = this.findVisibleColumn(_.max_date, -1)), a.$keyboardNavigation.TimeSlot.prototype.clone(i);
    }, extendTimelineSlot: function(r, d) {
      return this.extendGenericSlot({ left: "start_date", right: "end_date" }, r, d, "timeline");
    }, extendWeekAgendaSlot: function(r, d) {
      return this.extendGenericSlot({ left: "start_date", right: "end_date" }, r, d, "weekAgenda");
    }, extendGenericSlot: function(r, d, i, _) {
      var o, t = d.movingDate;
      if (t || (t = r[i]), !t || !r[i])
        return d;
      if (!i)
        return a.$keyboardNavigation.TimeSlot.prototype.clone(d);
      (o = this.nextSlot({ start_date: d[t], section: d.section }, i, _, !0)).start_date.valueOf() == d.start_date.valueOf() && (o = this.nextSlot({ start_date: o.start_date, section: o.section }, i, _, !0)), o.movingDate = t;
      var n = this.extendSlotDates(d, o, o.movingDate);
      return n.end_date.valueOf() <= n.start_date.valueOf() && (o.movingDate = o.movingDate == "end_date" ? "start_date" : "end_date"), n = this.extendSlotDates(d, o, o.movingDate), o.start_date = n.start_date, o.end_date = n.end_date, o;
    }, extendSlotDates: function(r, d, i) {
      var _ = { start_date: null, end_date: null };
      return i == "start_date" ? (_.start_date = d.start_date, _.end_date = r.end_date) : (_.start_date = r.start_date, _.end_date = d.start_date), _;
    }, extendMonthSlot: function(r, d) {
      return (r = this.extendGenericSlot({ up: "start_date", down: "end_date", left: "start_date", right: "end_date" }, r, d, "month")).start_date.setHours(a.config.first_hour), r.end_date = a.date.add(r.end_date, -1, "day"), r.end_date.setHours(a.config.last_hour), r;
    }, extendUnitsSlot: function(r, d) {
      var i;
      switch (d) {
        case "down":
        case "up":
          i = this.extendDaySlot(r, d);
          break;
        default:
          i = r;
      }
      return i.section = r.section, i;
    }, extendDaySlot: function(r, d) {
      return this.extendGenericSlot({ up: "start_date", down: "end_date", left: "start_date", right: "end_date" }, r, d, "dayColumns");
    }, scrollSlot: function(r) {
      var d = a.getState(), i = this.nextSlot(this, r);
      (i.start_date.valueOf() < d.min_date.valueOf() || i.start_date.valueOf() >= d.max_date.valueOf()) && a.setCurrentView(new Date(i.start_date)), this.moveTo(i);
    }, keys: { left: function() {
      this.scrollSlot("left");
    }, right: function() {
      this.scrollSlot("right");
    }, down: function() {
      this._getMode() == this._modes.list ? a.$keyboardNavigation.SchedulerNode.prototype.nextEventHandler() : this.scrollSlot("down");
    }, up: function() {
      this._getMode() == this._modes.list ? a.$keyboardNavigation.SchedulerNode.prototype.prevEventHandler() : this.scrollSlot("up");
    }, "shift+down": function() {
      this.moveTo(this.extendSlot(this, "down"));
    }, "shift+up": function() {
      this.moveTo(this.extendSlot(this, "up"));
    }, "shift+right": function() {
      this.moveTo(this.extendSlot(this, "right"));
    }, "shift+left": function() {
      this.moveTo(this.extendSlot(this, "left"));
    }, enter: function() {
      var r = { start_date: new Date(this.start_date), end_date: new Date(this.end_date) }, d = a.getState().mode;
      a.matrix && a.matrix[d] ? r[a.matrix[a.getState().mode].y_property] = this.section : a._props && a._props[d] && (r[a._props[d].map_to] = this.section), a.addEventNow(r);
    } } }), a.$keyboardNavigation.TimeSlot.prototype.bindAll(a.$keyboardNavigation.TimeSlot.prototype.keys);
  }(e), function(a) {
    a.$keyboardNavigation.MinicalButton = function(r, d) {
      this.container = r, this.index = d || 0;
    }, a.$keyboardNavigation.MinicalButton.prototype = a._compose(a.$keyboardNavigation.KeyNavNode, { isValid: function() {
      return !!this.container.offsetWidth;
    }, fallback: function() {
      var r = new a.$keyboardNavigation.TimeSlot();
      return r.isValid() ? r : new a.$keyboardNavigation.DataArea();
    }, focus: function() {
      a.$keyboardNavigation.dispatcher.globalNode.disable(), this.container.removeAttribute("tabindex"), a.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      this.container.setAttribute("tabindex", "0"), a.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, getNode: function() {
      return this.index ? this.container.querySelector(".dhx_cal_next_button") : this.container.querySelector(".dhx_cal_prev_button");
    }, keys: { right: function(r) {
      this.moveTo(new a.$keyboardNavigation.MinicalButton(this.container, this.index ? 0 : 1));
    }, left: function(r) {
      this.moveTo(new a.$keyboardNavigation.MinicalButton(this.container, this.index ? 0 : 1));
    }, down: function() {
      var r = new a.$keyboardNavigation.MinicalCell(this.container, 0, 0);
      r && !r.isValid() && (r = r.fallback()), this.moveTo(r);
    }, enter: function(r) {
      this.getNode().click();
    } } }), a.$keyboardNavigation.MinicalButton.prototype.bindAll(a.$keyboardNavigation.MinicalButton.prototype.keys);
  }(e), function(a) {
    a.$keyboardNavigation.MinicalCell = function(r, d, i) {
      this.container = r, this.row = d || 0, this.col = i || 0;
    }, a.$keyboardNavigation.MinicalCell.prototype = a._compose(a.$keyboardNavigation.KeyNavNode, { isValid: function() {
      var r = this._getGrid();
      return !(!r[this.row] || !r[this.row][this.col]);
    }, fallback: function() {
      var r = this.row, d = this.col, i = this._getGrid();
      i[r] || (r = 0);
      var _ = !0;
      if (r > i.length / 2 && (_ = !1), !i[r]) {
        var o = new a.$keyboardNavigation.TimeSlot();
        return o.isValid() ? o : new a.$keyboardNavigation.DataArea();
      }
      if (_) {
        for (var t = d; i[r] && t < i[r].length; t++)
          if (i[r][t] || t != i[r].length - 1 || (r++, d = 0), i[r][t])
            return new a.$keyboardNavigation.MinicalCell(this.container, r, t);
      } else
        for (t = d; i[r] && t < i[r].length; t--)
          if (i[r][t] || t || (d = i[--r].length - 1), i[r][t])
            return new a.$keyboardNavigation.MinicalCell(this.container, r, t);
      return new a.$keyboardNavigation.MinicalButton(this.container, 0);
    }, focus: function() {
      a.$keyboardNavigation.dispatcher.globalNode.disable(), this.container.removeAttribute("tabindex"), a.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      this.container.setAttribute("tabindex", "0"), a.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, _getNode: function(r, d) {
      return this.container.querySelector(".dhx_year_body tr:nth-child(" + (r + 1) + ") td:nth-child(" + (d + 1) + ")");
    }, getNode: function() {
      return this._getNode(this.row, this.col);
    }, _getGrid: function() {
      for (var r = this.container.querySelectorAll(".dhx_year_body tr"), d = [], i = 0; i < r.length; i++) {
        d[i] = [];
        for (var _ = r[i].querySelectorAll("td"), o = 0; o < _.length; o++) {
          var t = _[o], n = !0, s = a._getClassName(t);
          (s.indexOf("dhx_after") > -1 || s.indexOf("dhx_before") > -1 || s.indexOf("dhx_scale_ignore") > -1) && (n = !1), d[i][o] = n;
        }
      }
      return d;
    }, keys: { right: function(r) {
      var d = this._getGrid(), i = this.row, _ = this.col + 1;
      d[i] && d[i][_] || (d[i + 1] ? (i += 1, _ = 0) : _ = this.col);
      var o = new a.$keyboardNavigation.MinicalCell(this.container, i, _);
      o.isValid() || (o = o.fallback()), this.moveTo(o);
    }, left: function(r) {
      var d = this._getGrid(), i = this.row, _ = this.col - 1;
      d[i] && d[i][_] || (_ = d[i - 1] ? d[i -= 1].length - 1 : this.col);
      var o = new a.$keyboardNavigation.MinicalCell(this.container, i, _);
      o.isValid() || (o = o.fallback()), this.moveTo(o);
    }, down: function() {
      var r = this._getGrid(), d = this.row + 1, i = this.col;
      r[d] && r[d][i] || (d = this.row);
      var _ = new a.$keyboardNavigation.MinicalCell(this.container, d, i);
      _.isValid() || (_ = _.fallback()), this.moveTo(_);
    }, up: function() {
      var r = this._getGrid(), d = this.row - 1, i = this.col;
      if (r[d] && r[d][i]) {
        var _ = new a.$keyboardNavigation.MinicalCell(this.container, d, i);
        _.isValid() || (_ = _.fallback()), this.moveTo(_);
      } else {
        var o = 0;
        this.col > r[this.row].length / 2 && (o = 1), this.moveTo(new a.$keyboardNavigation.MinicalButton(this.container, o));
      }
    }, enter: function(r) {
      this.getNode().querySelector(".dhx_month_head").click();
    } } }), a.$keyboardNavigation.MinicalCell.prototype.bindAll(a.$keyboardNavigation.MinicalCell.prototype.keys);
  }(e), function(a) {
    a.$keyboardNavigation.DataArea = function(r) {
      this.index = r || 0;
    }, a.$keyboardNavigation.DataArea.prototype = a._compose(a.$keyboardNavigation.KeyNavNode, { getNode: function(r) {
      return a.$container.querySelector(".dhx_cal_data");
    }, _handlers: null, isValid: function() {
      return !0;
    }, fallback: function() {
      return this;
    }, keys: { "up,down,right,left": function() {
      this.moveTo(new a.$keyboardNavigation.TimeSlot());
    } } }), a.$keyboardNavigation.DataArea.prototype.bindAll(a.$keyboardNavigation.DataArea.prototype.keys);
  }(e), rt(e), function(a) {
    a.$keyboardNavigation.dispatcher = { isActive: !1, activeNode: null, globalNode: new a.$keyboardNavigation.SchedulerNode(), keepScrollPosition: function(r) {
      var d, i, _ = a.$container.querySelector(".dhx_timeline_scrollable_data");
      _ || (_ = a.$container.querySelector(".dhx_cal_data")), _ && (d = _.scrollTop, i = _.scrollLeft), r(), _ && (_.scrollTop = d, _.scrollLeft = i);
    }, enable: function() {
      if (a.$container) {
        this.isActive = !0;
        var r = this;
        this.keepScrollPosition(function() {
          r.globalNode.enable(), r.setActiveNode(r.getActiveNode());
        });
      }
    }, disable: function() {
      this.isActive = !1, this.globalNode.disable();
    }, isEnabled: function() {
      return !!this.isActive;
    }, getDefaultNode: function() {
      return this.globalNode.getDefaultNode();
    }, setDefaultNode: function() {
      this.setActiveNode(this.getDefaultNode());
    }, getActiveNode: function() {
      var r = this.activeNode;
      return r && !r.isValid() && (r = r.fallback()), r;
    }, focusGlobalNode: function() {
      this.blurNode(this.globalNode), this.focusNode(this.globalNode);
    }, setActiveNode: function(r) {
      r && r.isValid() && (this.activeNode && this.activeNode.compareTo(r) || this.isEnabled() && (this.blurNode(this.activeNode), this.activeNode = r, this.focusNode(this.activeNode)));
    }, focusNode: function(r) {
      r && r.focus && (r.focus(), r.getNode && document.activeElement != r.getNode() && this.setActiveNode(new a.$keyboardNavigation.DataArea()));
    }, blurNode: function(r) {
      r && r.blur && r.blur();
    }, getInlineEditor: function(r) {
      var d = a.$container.querySelector(".dhx_cal_editor[" + a.config.event_attribute + "='" + r + "'] textarea");
      return d && d.offsetWidth ? d : null;
    }, keyDownHandler: function(r) {
      if (!r.defaultPrevented) {
        var d = this.getActiveNode();
        if ((!a.$keyboardNavigation.isModal() || d && d.container && a.utils.dom.locateCss({ target: d.container }, "dhx_minical_popup", !1)) && (!a.getState().editor_id || !this.getInlineEditor(a.getState().editor_id)) && this.isEnabled()) {
          r = r || window.event;
          var i = this.globalNode, _ = a.$keyboardNavigation.shortcuts.getCommandFromEvent(r);
          d ? d.findHandler(_) ? d.doAction(_, r) : i.findHandler(_) && i.doAction(_, r) : this.setDefaultNode();
        }
      }
    }, _timeout: null, delay: function(r, d) {
      clearTimeout(this._timeout), this._timeout = setTimeout(r, d || 1);
    } };
  }(e), ot(e), function() {
    st(e), function(o) {
      o.$keyboardNavigation._minicalendars = [], o.$keyboardNavigation.isMinical = function(t) {
        for (var n = o.$keyboardNavigation._minicalendars, s = 0; s < n.length; s++)
          if (this.isChildOf(t, n[s]))
            return !0;
        return !1;
      }, o.$keyboardNavigation.isChildOf = function(t, n) {
        for (; t && t !== n; )
          t = t.parentNode;
        return t === n;
      }, o.$keyboardNavigation.patchMinicalendar = function() {
        var t = o.$keyboardNavigation.dispatcher;
        function n(v) {
          var m = v.target;
          t.enable(), t.setActiveNode(new o.$keyboardNavigation.MinicalButton(m, 0));
        }
        function s(v) {
          var m = v.target || v.srcElement, l = o.utils.dom.locateCss(v, "dhx_cal_prev_button", !1), f = o.utils.dom.locateCss(v, "dhx_cal_next_button", !1), g = o.utils.dom.locateCss(v, "dhx_year_body", !1), p = 0, y = 0;
          if (g) {
            for (var w, b, k = m; k && k.tagName.toLowerCase() != "td"; )
              k = k.parentNode;
            if (k && (w = (b = k).parentNode), w && b) {
              for (var E = w.parentNode.querySelectorAll("tr"), D = 0; D < E.length; D++)
                if (E[D] == w) {
                  p = D;
                  break;
                }
              var x = w.querySelectorAll("td");
              for (D = 0; D < x.length; D++)
                if (x[D] == b) {
                  y = D;
                  break;
                }
            }
          }
          var S = v.currentTarget;
          t.delay(function() {
            var N;
            (l || f || g) && (l ? (N = new o.$keyboardNavigation.MinicalButton(S, 0), t.setActiveNode(new o.$keyboardNavigation.MinicalButton(S, 0))) : f ? N = new o.$keyboardNavigation.MinicalButton(S, 1) : g && (N = new o.$keyboardNavigation.MinicalCell(S, p, y)), N && (t.enable(), N.isValid() && (t.activeNode = null, t.setActiveNode(N))));
          });
        }
        if (o.renderCalendar) {
          var c = o.renderCalendar;
          o.renderCalendar = function() {
            var v = c.apply(this, arguments), m = o.$keyboardNavigation._minicalendars;
            o.eventRemove(v, "click", s), o.event(v, "click", s), o.eventRemove(v, "focus", n), o.event(v, "focus", n);
            for (var l = !1, f = 0; f < m.length; f++)
              if (m[f] == v) {
                l = !0;
                break;
              }
            if (l || m.push(v), t.isEnabled()) {
              var g = t.getActiveNode();
              g && g.container == v ? t.focusNode(g) : v.setAttribute("tabindex", "0");
            } else
              v.setAttribute("tabindex", "0");
            return v;
          };
        }
        if (o.destroyCalendar) {
          var u = o.destroyCalendar;
          o.destroyCalendar = function(v, m) {
            v = v || (o._def_count ? o._def_count.firstChild : null);
            var l = u.apply(this, arguments);
            if (!v || !v.parentNode)
              for (var f = o.$keyboardNavigation._minicalendars, g = 0; g < f.length; g++)
                f[g] == v && (o.eventRemove(f[g], "focus", n), f.splice(g, 1), g--);
            return l;
          };
        }
      };
    }(e);
    var a = e.$keyboardNavigation.dispatcher;
    if (e.$keyboardNavigation.attachSchedulerHandlers(), e.renderCalendar)
      e.$keyboardNavigation.patchMinicalendar();
    else
      var r = e.attachEvent("onSchedulerReady", function() {
        e.detachEvent(r), e.$keyboardNavigation.patchMinicalendar();
      });
    function d() {
      if (e.config.key_nav) {
        var o = document.activeElement;
        return !(!o || e.utils.dom.locateCss(o, "dhx_cal_quick_info", !1)) && (e.$keyboardNavigation.isChildOf(o, e.$container) || e.$keyboardNavigation.isMinical(o));
      }
    }
    function i(o) {
      o && !a.isEnabled() ? a.enable() : !o && a.isEnabled() && a.disable();
    }
    const _ = setInterval(function() {
      if (e.$container && e.$keyboardNavigation.isChildOf(e.$container, document.body)) {
        var o = d();
        o ? i(o) : !o && a.isEnabled() && setTimeout(function() {
          e.$destroyed || (e.config.key_nav ? i(d()) : e.$container.removeAttribute("tabindex"));
        }, 100);
      }
    }, 500);
    e.attachEvent("onDestroy", function() {
      clearInterval(_);
    });
  }();
}, layer: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    this.layers.sort(function(a, r) {
      return a.zIndex - r.zIndex;
    }), e._dp_init = function(a) {
      a._methods = ["_set_event_text_style", "", "changeEventId", "deleteEvent"], this.attachEvent("onEventAdded", function(r) {
        !this._loading && this.validId(r) && this.getEvent(r) && this.getEvent(r).layer == a.layer && a.setUpdated(r, !0, "inserted");
      }), this.attachEvent("onBeforeEventDelete", function(r) {
        if (this.getEvent(r) && this.getEvent(r).layer == a.layer) {
          if (!this.validId(r))
            return;
          var d = a.getState(r);
          return d == "inserted" || this._new_event ? (a.setUpdated(r, !1), !0) : d != "deleted" && (d == "true_deleted" || (a.setUpdated(r, !0, "deleted"), !1));
        }
        return !0;
      }), this.attachEvent("onEventChanged", function(r) {
        !this._loading && this.validId(r) && this.getEvent(r) && this.getEvent(r).layer == a.layer && a.setUpdated(r, !0, "updated");
      }), a._getRowData = function(r, d) {
        var i = this.obj.getEvent(r), _ = {};
        for (var o in i)
          o.indexOf("_") !== 0 && (i[o] && i[o].getUTCFullYear ? _[o] = this.obj._helpers.formatDate(i[o]) : _[o] = i[o]);
        return _;
      }, a._clearUpdateFlag = function() {
      }, a.attachEvent("insertCallback", e._update_callback), a.attachEvent("updateCallback", e._update_callback), a.attachEvent("deleteCallback", function(r, d) {
        this.obj.setUserData(d, this.action_param, "true_deleted"), this.obj.deleteEvent(d);
      });
    }, function() {
      var a = function(i) {
        if (i === null || typeof i != "object")
          return i;
        var _ = new i.constructor();
        for (var o in i)
          _[o] = a(i[o]);
        return _;
      };
      e._dataprocessors = [], e._layers_zindex = {};
      for (var r = 0; r < e.layers.length; r++) {
        if (e.config["lightbox_" + e.layers[r].name] = {}, e.config["lightbox_" + e.layers[r].name].sections = a(e.config.lightbox.sections), e._layers_zindex[e.layers[r].name] = e.config.initial_layer_zindex || 5 + 3 * r, e.layers[r].url) {
          var d = e.createDataProcessor({ url: e.layers[r].url });
          d.layer = e.layers[r].name, e._dataprocessors.push(d), e._dataprocessors[r].init(e);
        }
        e.layers[r].isDefault && (e.defaultLayer = e.layers[r].name);
      }
    }(), e.showLayer = function(a) {
      this.toggleLayer(a, !0);
    }, e.hideLayer = function(a) {
      this.toggleLayer(a, !1);
    }, e.toggleLayer = function(a, r) {
      var d = this.getLayer(a);
      d.visible = r !== void 0 ? !!r : !d.visible, this.setCurrentView(this._date, this._mode);
    }, e.getLayer = function(a) {
      var r, d;
      typeof a == "string" && (d = a), typeof a == "object" && (d = a.layer);
      for (var i = 0; i < e.layers.length; i++)
        e.layers[i].name == d && (r = e.layers[i]);
      return r;
    }, e.attachEvent("onBeforeLightbox", function(a) {
      var r = this.getEvent(a);
      return this.config.lightbox.sections = this.config["lightbox_" + r.layer].sections, e.resetLightbox(), !0;
    }), e.attachEvent("onClick", function(a, r) {
      var d = e.getEvent(a);
      return !e.getLayer(d.layer).noMenu;
    }), e.attachEvent("onEventCollision", function(a, r) {
      var d = this.getLayer(a);
      if (!d.checkCollision)
        return !1;
      for (var i = 0, _ = 0; _ < r.length; _++)
        r[_].layer == d.name && r[_].id != a.id && i++;
      return i >= e.config.collision_limit;
    }), e.addEvent = function(a, r, d, i, _) {
      var o = a;
      arguments.length != 1 && ((o = _ || {}).start_date = a, o.end_date = r, o.text = d, o.id = i, o.layer = this.defaultLayer), o.id = o.id || e.uid(), o.text = o.text || "", typeof o.start_date == "string" && (o.start_date = this.templates.api_date(o.start_date)), typeof o.end_date == "string" && (o.end_date = this.templates.api_date(o.end_date)), o._timed = this.isOneDayEvent(o);
      var t = !this._events[o.id];
      this._events[o.id] = o, this.event_updated(o), this._loading || this.callEvent(t ? "onEventAdded" : "onEventChanged", [o.id, o]);
    }, this._evs_layer = {};
    for (var h = 0; h < this.layers.length; h++)
      this._evs_layer[this.layers[h].name] = [];
    e.addEventNow = function(a, r, d) {
      var i = {};
      typeof a == "object" && (i = a, a = null);
      var _ = 6e4 * (this.config.event_duration || this.config.time_step);
      a || (a = Math.round(e._currentDate().valueOf() / _) * _);
      var o = new Date(a);
      if (!r) {
        var t = this.config.first_hour;
        t > o.getHours() && (o.setHours(t), a = o.valueOf()), r = a + _;
      }
      i.start_date = i.start_date || o, i.end_date = i.end_date || new Date(r), i.text = i.text || this.locale.labels.new_event, i.id = this._drag_id = this.uid(), i.layer = this.defaultLayer, this._drag_mode = "new-size", this._loading = !0, this.addEvent(i), this.callEvent("onEventCreated", [this._drag_id, d]), this._loading = !1, this._drag_event = {}, this._on_mouse_up(d);
    }, e._t_render_view_data = function(a) {
      if (this.config.multi_day && !this._table_view) {
        for (var r = [], d = [], i = 0; i < a.length; i++)
          a[i]._timed ? r.push(a[i]) : d.push(a[i]);
        this._table_view = !0, this.render_data(d), this._table_view = !1, this.render_data(r);
      } else
        this.render_data(a);
    }, e.render_view_data = function() {
      if (this._not_render)
        this._render_wait = !0;
      else {
        this._render_wait = !1, this.clear_view(), this._evs_layer = {};
        for (var a = 0; a < this.layers.length; a++)
          this._evs_layer[this.layers[a].name] = [];
        var r = this.get_visible_events();
        for (a = 0; a < r.length; a++)
          this._evs_layer[r[a].layer] && this._evs_layer[r[a].layer].push(r[a]);
        if (this._mode == "month") {
          var d = [];
          for (a = 0; a < this.layers.length; a++)
            this.layers[a].visible && (d = d.concat(this._evs_layer[this.layers[a].name]));
          this._t_render_view_data(d);
        } else
          for (a = 0; a < this.layers.length; a++)
            if (this.layers[a].visible) {
              var i = this._evs_layer[this.layers[a].name];
              this._t_render_view_data(i);
            }
      }
    }, e._render_v_bar = function(a, r, d, i, _, o, t, n, s) {
      var c = a.id;
      t.indexOf("<div class=") == -1 && (t = e.templates["event_header_" + a.layer] ? e.templates["event_header_" + a.layer](a.start_date, a.end_date, a) : t), n.indexOf("<div class=") == -1 && (n = e.templates["event_text_" + a.layer] ? e.templates["event_text_" + a.layer](a.start_date, a.end_date, a) : n);
      var u = document.createElement("div"), v = "dhx_cal_event", m = e.templates["event_class_" + a.layer] ? e.templates["event_class_" + a.layer](a.start_date, a.end_date, a) : e.templates.event_class(a.start_date, a.end_date, a);
      m && (v = v + " " + m);
      var l = e._border_box_events(), f = i - 2, g = l ? f : i - 4, p = l ? f : i - 6, y = l ? f : i - 14, w = l ? f - 2 : i - 8, b = l ? _ - this.xy.event_header_height : _ - 30 + 1, k = '<div event_id="' + c + '" ' + e.config.event_attribute + '="' + c + '" class="' + v + '" style="position:absolute; top:' + d + "px; left:" + r + "px; width:" + g + "px; height:" + _ + "px;" + (o || "") + '">';
      return k += '<div class="dhx_header" style=" width:' + p + 'px;" >&nbsp;</div>', k += '<div class="dhx_title">' + t + "</div>", k += '<div class="dhx_body" style=" width:' + y + "px; height:" + b + 'px;">' + n + "</div>", k += '<div class="dhx_footer" style=" width:' + w + "px;" + (s ? " margin-top:-1px;" : "") + '" ></div></div>', u.innerHTML = k, u.style.zIndex = 100, u.firstChild;
    }, e.render_event_bar = function(a) {
      var r = this._els.dhx_cal_data[0], d = this._colsS[a._sday], i = this._colsS[a._eday];
      i == d && (i = this._colsS[a._eday + 1]);
      var _ = this.xy.bar_height, o = this._colsS.heights[a._sweek] + (this._colsS.height ? this.xy.month_scale_height + 2 : 2) + a._sorder * _, t = document.createElement("div"), n = a._timed ? "dhx_cal_event_clear" : "dhx_cal_event_line", s = e.templates["event_class_" + a.layer] ? e.templates["event_class_" + a.layer](a.start_date, a.end_date, a) : e.templates.event_class(a.start_date, a.end_date, a);
      s && (n = n + " " + s);
      var c = '<div event_id="' + a.id + '" ' + this.config.event_attribute + '="' + a.id + '" class="' + n + '" style="position:absolute; top:' + o + "px; left:" + d + "px; width:" + (i - d - 15) + "px;" + (a._text_style || "") + '">';
      a._timed && (c += e.templates["event_bar_date_" + a.layer] ? e.templates["event_bar_date_" + a.layer](a.start_date, a.end_date, a) : e.templates.event_bar_date(a.start_date, a.end_date, a)), c += e.templates["event_bar_text_" + a.layer] ? e.templates["event_bar_text_" + a.layer](a.start_date, a.end_date, a) : e.templates.event_bar_text(a.start_date, a.end_date, a) + "</div>)", c += "</div>", t.innerHTML = c, this._rendered.push(t.firstChild), r.appendChild(t.firstChild);
    }, e.render_event = function(a) {
      var r = e.xy.menu_width;
      if (e.getLayer(a.layer).noMenu && (r = 0), !(a._sday < 0)) {
        var d = e.locate_holder(a._sday);
        if (d) {
          var i = 60 * a.start_date.getHours() + a.start_date.getMinutes(), _ = 60 * a.end_date.getHours() + a.end_date.getMinutes() || 60 * e.config.last_hour, o = Math.round((60 * i * 1e3 - 60 * this.config.first_hour * 60 * 1e3) * this.config.hour_size_px / 36e5) % (24 * this.config.hour_size_px) + 1, t = Math.max(e.xy.min_event_height, (_ - i) * this.config.hour_size_px / 60) + 1, n = Math.floor((d.clientWidth - r) / a._count), s = a._sorder * n + 1;
          a._inner || (n *= a._count - a._sorder);
          var c = this._render_v_bar(a.id, r + s, o, n, t, a._text_style, e.templates.event_header(a.start_date, a.end_date, a), e.templates.event_text(a.start_date, a.end_date, a));
          if (this._rendered.push(c), d.appendChild(c), s = s + parseInt(d.style.left, 10) + r, o += this._dy_shift, c.style.zIndex = this._layers_zindex[a.layer], this._edit_id == a.id) {
            c.style.zIndex = parseInt(c.style.zIndex) + 1;
            var u = c.style.zIndex;
            n = Math.max(n - 4, e.xy.editor_width), (c = document.createElement("div")).setAttribute("event_id", a.id), c.setAttribute(this.config.event_attribute, a.id), this.set_xy(c, n, t - 20, s, o + 14), c.className = "dhx_cal_editor", c.style.zIndex = u;
            var v = document.createElement("div");
            this.set_xy(v, n - 6, t - 26), v.style.cssText += ";margin:2px 2px 2px 2px;overflow:hidden;", v.style.zIndex = u, c.appendChild(v), this._els.dhx_cal_data[0].appendChild(c), this._rendered.push(c), v.innerHTML = "<textarea class='dhx_cal_editor'>" + a.text + "</textarea>", this._editor = v.firstChild, this._editor.addEventListener("keypress", function(p) {
              if (p.shiftKey)
                return !0;
              var y = p.keyCode;
              y == e.keys.edit_save && e.editStop(!0), y == e.keys.edit_cancel && e.editStop(!1);
            }), this._editor.addEventListener("selectstart", function(p) {
              return p.cancelBubble = !0, !0;
            }), v.firstChild.focus(), this._els.dhx_cal_data[0].scrollLeft = 0, v.firstChild.select();
          }
          if (this._select_id == a.id) {
            c.style.zIndex = parseInt(c.style.zIndex) + 1;
            for (var m = this.config["icons_" + (this._edit_id == a.id ? "edit" : "select")], l = "", f = 0; f < m.length; f++)
              l += "<div class='dhx_menu_icon " + m[f] + "' title='" + this.locale.labels[m[f]] + "'></div>";
            var g = this._render_v_bar(a.id, s - r + 1, o, r, 20 * m.length + 26, "", "<div class='dhx_menu_head'></div>", l, !0);
            g.style.left = s - r + 1, g.style.zIndex = c.style.zIndex, this._els.dhx_cal_data[0].appendChild(g), this._rendered.push(g);
          }
        }
      }
    }, e.filter_agenda = function(a, r) {
      var d = e.getLayer(r.layer);
      return d && d.visible;
    };
  });
}, limit: function(e) {
  e.config.limit_start = null, e.config.limit_end = null, e.config.limit_view = !1, e.config.check_limits = !0, e.config.mark_now = !0, e.config.display_marked_timespans = !0, e.config.overwrite_marked_timespans = !0, e._temp_limit_scope = function() {
    var h = null, a = "dhx_time_block", r = "default", d = function(o, t, n) {
      var s = typeof o == "object" ? o : { days: o };
      return s.type = a, s.css = "", t && (n && (s.sections = n), s = function(c, u, v) {
        return u instanceof Date && v instanceof Date ? (c.start_date = u, c.end_date = v) : (c.days = u, c.zones = v), c;
      }(s, o, t)), s;
    };
    e.blockTime = function(o, t, n) {
      var s = d(o, t, n);
      return e.addMarkedTimespan(s);
    }, e.unblockTime = function(o, t, n) {
      var s = d(o, t = t || "fullday", n);
      return e.deleteMarkedTimespan(s);
    }, e.attachEvent("onBeforeViewChange", function(o, t, n, s) {
      function c(u, v) {
        var m = e.config.limit_start, l = e.config.limit_end, f = e.date.add(u, 1, v);
        return u.valueOf() > l.valueOf() || f <= m.valueOf();
      }
      return !e.config.limit_view || !c(s = s || t, n = n || o) || t.valueOf() == s.valueOf() || (setTimeout(function() {
        if (e.$destroyed)
          return !0;
        var u = c(t, n) ? e.config.limit_start : t;
        e.setCurrentView(c(u, n) ? null : u, n);
      }, 1), !1);
    }), e.checkInMarkedTimespan = function(o, t, n) {
      t = t || r;
      for (var s = !0, c = new Date(o.start_date.valueOf()), u = e.date.add(c, 1, "day"), v = e._marked_timespans; c < o.end_date; c = e.date.date_part(u), u = e.date.add(c, 1, "day")) {
        var m = +e.date.date_part(new Date(c)), l = _(o, v, c.getDay(), m, t);
        if (l)
          for (var f = 0; f < l.length; f += 2) {
            var g = e._get_zone_minutes(c), p = o.end_date > u || o.end_date.getDate() != c.getDate() ? 1440 : e._get_zone_minutes(o.end_date), y = l[f], w = l[f + 1];
            if (y < p && w > g && !(s = typeof n == "function" && n(o, g, p, y, w)))
              break;
          }
      }
      return !s;
    };
    var i = e.checkLimitViolation = function(o) {
      if (!o || !e.config.check_limits)
        return !0;
      var t = e, n = t.config, s = [];
      if (o.rec_type)
        for (var c = e.getRecDates(o), u = 0; u < c.length; u++) {
          var v = e._copy_event(o);
          e._lame_copy(v, c[u]), s.push(v);
        }
      else
        s = [o];
      for (var m = !0, l = 0; l < s.length; l++) {
        var f = !0;
        (v = s[l])._timed = e.isOneDayEvent(v), (f = !n.limit_start || !n.limit_end || v.start_date.valueOf() >= n.limit_start.valueOf() && v.end_date.valueOf() <= n.limit_end.valueOf()) && (f = !e.checkInMarkedTimespan(v, a, function(g, p, y, w, b) {
          var k = !0;
          return p <= b && p >= w && ((b == 1440 || y <= b) && (k = !1), g._timed && t._drag_id && t._drag_mode == "new-size" ? (g.start_date.setHours(0), g.start_date.setMinutes(b)) : k = !1), (y >= w && y <= b || p < w && y > b) && (g._timed && t._drag_id && t._drag_mode == "new-size" ? (g.end_date.setHours(0), g.end_date.setMinutes(w)) : k = !1), k;
        })), f || (f = t.checkEvent("onLimitViolation") ? t.callEvent("onLimitViolation", [v.id, v]) : f), m = m && f;
      }
      return m || (t._drag_id = null, t._drag_mode = null), m;
    };
    function _(o, t, n, s, c) {
      var u = e, v = [], m = { _props: "map_to", matrix: "y_property" };
      for (var l in m) {
        var f = m[l];
        if (u[l])
          for (var g in u[l]) {
            var p = u[l][g][f];
            o[p] && (v = u._add_timespan_zones(v, e._get_blocked_zones(t[g], o[p], n, s, c)));
          }
      }
      return v = u._add_timespan_zones(v, e._get_blocked_zones(t, "global", n, s, c));
    }
    e._get_blocked_zones = function(o, t, n, s, c) {
      var u = [];
      if (o && o[t])
        for (var v = o[t], m = this._get_relevant_blocked_zones(n, s, v, c), l = 0; l < m.length; l++)
          u = this._add_timespan_zones(u, m[l].zones);
      return u;
    }, e._get_relevant_blocked_zones = function(o, t, n, s) {
      var c;
      return e.config.overwrite_marked_timespans ? c = n[t] && n[t][s] ? n[t][s] : n[o] && n[o][s] ? n[o][s] : [] : (c = [], n[t] && n[t][s] && (c = c.concat(n[t][s])), n[o] && n[o][s] && (c = c.concat(n[o][s]))), c;
    }, e.attachEvent("onMouseDown", function(o) {
      return o != a;
    }), e.attachEvent("onBeforeDrag", function(o) {
      return !o || i(e.getEvent(o));
    }), e.attachEvent("onClick", function(o, t) {
      return i(e.getEvent(o));
    }), e.attachEvent("onBeforeLightbox", function(o) {
      var t = e.getEvent(o);
      return h = [t.start_date, t.end_date], i(t);
    }), e.attachEvent("onEventSave", function(o, t, n) {
      if (!t.start_date || !t.end_date) {
        var s = e.getEvent(o);
        t.start_date = new Date(s.start_date), t.end_date = new Date(s.end_date);
      }
      if (t.rec_type) {
        var c = e._lame_clone(t);
        return e._roll_back_dates(c), i(c);
      }
      return i(t);
    }), e.attachEvent("onEventAdded", function(o) {
      if (!o)
        return !0;
      var t = e.getEvent(o);
      return !i(t) && e.config.limit_start && e.config.limit_end && (t.start_date < e.config.limit_start && (t.start_date = new Date(e.config.limit_start)), t.start_date.valueOf() >= e.config.limit_end.valueOf() && (t.start_date = this.date.add(e.config.limit_end, -1, "day")), t.end_date < e.config.limit_start && (t.end_date = new Date(e.config.limit_start)), t.end_date.valueOf() >= e.config.limit_end.valueOf() && (t.end_date = this.date.add(e.config.limit_end, -1, "day")), t.start_date.valueOf() >= t.end_date.valueOf() && (t.end_date = this.date.add(t.start_date, this.config.event_duration || this.config.time_step, "minute")), t._timed = this.isOneDayEvent(t)), !0;
    }), e.attachEvent("onEventChanged", function(o) {
      if (!o)
        return !0;
      var t = e.getEvent(o);
      if (!i(t)) {
        if (!h)
          return !1;
        t.start_date = h[0], t.end_date = h[1], t._timed = this.isOneDayEvent(t);
      }
      return !0;
    }), e.attachEvent("onBeforeEventChanged", function(o, t, n) {
      return i(o);
    }), e.attachEvent("onBeforeEventCreated", function(o) {
      var t = e.getActionData(o).date, n = { _timed: !0, start_date: t, end_date: e.date.add(t, e.config.time_step, "minute") };
      return i(n);
    }), e.attachEvent("onViewChange", function() {
      e._mark_now();
    }), e.attachEvent("onAfterSchedulerResize", function() {
      return window.setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e._mark_now();
      }, 1), !0;
    }), e.attachEvent("onTemplatesReady", function() {
      e._mark_now_timer = window.setInterval(function() {
        e._is_initialized() && e._mark_now();
      }, 6e4);
    }), e.attachEvent("onDestroy", function() {
      clearInterval(e._mark_now_timer);
    }), e._mark_now = function(o) {
      var t = "dhx_now_time";
      this._els[t] || (this._els[t] = []);
      var n = e._currentDate(), s = this.config;
      if (e._remove_mark_now(), !o && s.mark_now && n < this._max_date && n > this._min_date && n.getHours() >= s.first_hour && n.getHours() < s.last_hour) {
        var c = this.locate_holder_day(n);
        this._els[t] = e._append_mark_now(c, n);
      }
    }, e._append_mark_now = function(o, t) {
      var n = "dhx_now_time", s = e._get_zone_minutes(t), c = { zones: [s, s + 1], css: n, type: n };
      if (!this._table_view) {
        if (this._props && this._props[this._mode]) {
          var u, v, m = this._props[this._mode], l = m.size || m.options.length;
          m.days > 1 ? (m.size && m.options.length && (o = (m.position + o) / m.options.length * m.size), u = o, v = o + l) : v = (u = 0) + l;
          for (var f = [], g = u; g < v; g++) {
            var p = g;
            c.days = p;
            var y = e._render_marked_timespan(c, null, p)[0];
            f.push(y);
          }
          return f;
        }
        return c.days = o, e._render_marked_timespan(c, null, o);
      }
      if (this._mode == "month")
        return c.days = +e.date.date_part(t), e._render_marked_timespan(c, null, null);
    }, e._remove_mark_now = function() {
      for (var o = "dhx_now_time", t = this._els[o], n = 0; n < t.length; n++) {
        var s = t[n], c = s.parentNode;
        c && c.removeChild(s);
      }
      this._els[o] = [];
    }, e._marked_timespans = { global: {} }, e._get_zone_minutes = function(o) {
      return 60 * o.getHours() + o.getMinutes();
    }, e._prepare_timespan_options = function(o) {
      var t = [], n = [];
      if (o.days == "fullweek" && (o.days = [0, 1, 2, 3, 4, 5, 6]), o.days instanceof Array) {
        for (var s = o.days.slice(), c = 0; c < s.length; c++) {
          var u = e._lame_clone(o);
          u.days = s[c], t.push.apply(t, e._prepare_timespan_options(u));
        }
        return t;
      }
      if (!o || !(o.start_date && o.end_date && o.end_date > o.start_date || o.days !== void 0 && o.zones) && !o.type)
        return t;
      o.zones == "fullday" && (o.zones = [0, 1440]), o.zones && o.invert_zones && (o.zones = e.invertZones(o.zones)), o.id = e.uid(), o.css = o.css || "", o.type = o.type || r;
      var v = o.sections;
      if (v) {
        for (var m in v)
          if (v.hasOwnProperty(m)) {
            var l = v[m];
            for (l instanceof Array || (l = [l]), c = 0; c < l.length; c++)
              (k = e._lame_copy({}, o)).sections = {}, k.sections[m] = l[c], n.push(k);
          }
      } else
        n.push(o);
      for (var f = 0; f < n.length; f++) {
        var g = n[f], p = g.start_date, y = g.end_date;
        if (p && y)
          for (var w = e.date.date_part(new Date(p)), b = e.date.add(w, 1, "day"); w < y; ) {
            var k;
            delete (k = e._lame_copy({}, g)).start_date, delete k.end_date, k.days = w.valueOf();
            var E = p > w ? e._get_zone_minutes(p) : 0, D = y > b || y.getDate() != w.getDate() ? 1440 : e._get_zone_minutes(y);
            k.zones = [E, D], t.push(k), w = b, b = e.date.add(b, 1, "day");
          }
        else
          g.days instanceof Date && (g.days = e.date.date_part(g.days).valueOf()), g.zones = o.zones.slice(), t.push(g);
      }
      return t;
    }, e._get_dates_by_index = function(o, t, n) {
      var s = [];
      t = e.date.date_part(new Date(t || e._min_date)), n = new Date(n || e._max_date);
      for (var c = t.getDay(), u = o - c >= 0 ? o - c : 7 - t.getDay() + o, v = e.date.add(t, u, "day"); v < n; v = e.date.add(v, 1, "week"))
        s.push(v);
      return s;
    }, e._get_css_classes_by_config = function(o) {
      var t = [];
      return o.type == a && (t.push(a), o.css && t.push(a + "_reset")), t.push("dhx_marked_timespan", o.css), t.join(" ");
    }, e._get_block_by_config = function(o) {
      var t = document.createElement("div");
      return o.html && (typeof o.html == "string" ? t.innerHTML = o.html : t.appendChild(o.html)), t;
    }, e._render_marked_timespan = function(o, t, n) {
      var s = [], c = e.config, u = this._min_date, v = this._max_date, m = !1;
      if (!c.display_marked_timespans)
        return s;
      if (!n && n !== 0) {
        if (o.days < 7)
          n = o.days;
        else {
          var l = new Date(o.days);
          if (m = +l, !(+v > +l && +u <= +l))
            return s;
          n = l.getDay();
        }
        var f = u.getDay();
        f > n ? n = 7 - (f - n) : n -= f;
      }
      var g = o.zones, p = e._get_css_classes_by_config(o);
      if (e._table_view && e._mode == "month") {
        var y = [], w = [];
        if (t)
          y.push(t), w.push(n);
        else {
          w = m ? [m] : e._get_dates_by_index(n);
          for (var b = 0; b < w.length; b++)
            y.push(this._scales[w[b]]);
        }
        for (b = 0; b < y.length; b++) {
          t = y[b], n = w[b];
          var k = this.locate_holder_day(n, !1) % this._cols.length;
          if (!this._ignores[k]) {
            var E = e._get_block_by_config(o);
            E.className = p, E.style.top = "0px", E.style.height = "100%";
            for (var D = 0; D < g.length; D += 2) {
              var x = g[b];
              if ((A = g[b + 1]) <= x)
                return [];
              (C = E.cloneNode(!0)).style.left = "0px", C.style.width = "100%", t.appendChild(C), s.push(C);
            }
          }
        }
      } else {
        var S = n;
        if (this._ignores[this.locate_holder_day(n, !1)])
          return s;
        if (this._props && this._props[this._mode] && o.sections && o.sections[this._mode]) {
          var N = this._props[this._mode];
          S = N.order[o.sections[this._mode]];
          var M = N.order[o.sections[this._mode]];
          N.days > 1 ? S = S * (N.size || N.options.length) + M : (S = M, N.size && S > N.position + N.size && (S = 0));
        }
        for (t = t || e.locate_holder(S), b = 0; b < g.length; b += 2) {
          var A, C;
          if (x = Math.max(g[b], 60 * c.first_hour), (A = Math.min(g[b + 1], 60 * c.last_hour)) <= x) {
            if (b + 2 < g.length)
              continue;
            return [];
          }
          (C = e._get_block_by_config(o)).className = p;
          var T = 24 * this.config.hour_size_px + 1, O = 36e5;
          C.style.top = Math.round((60 * x * 1e3 - this.config.first_hour * O) * this.config.hour_size_px / O) % T + "px", C.style.height = Math.max(Math.round(60 * (A - x) * 1e3 * this.config.hour_size_px / O) % T, 1) + "px", t.appendChild(C), s.push(C);
        }
      }
      return s;
    }, e._mark_timespans = function() {
      var o = this._els.dhx_cal_data[0], t = [];
      if (e._table_view && e._mode == "month")
        for (var n in this._scales) {
          var s = /* @__PURE__ */ new Date(+n);
          t.push.apply(t, e._on_scale_add_marker(this._scales[n], s));
        }
      else {
        s = new Date(e._min_date);
        for (var c = 0, u = o.childNodes.length; c < u; c++) {
          var v = o.childNodes[c];
          v.firstChild && e._getClassName(v.firstChild).indexOf("dhx_scale_hour") > -1 || (t.push.apply(t, e._on_scale_add_marker(v, s)), s = e.date.add(s, 1, "day"));
        }
      }
      return t;
    }, e.markTimespan = function(o) {
      if (!this._els)
        throw new Error("`scheduler.markTimespan` can't be used before scheduler initialization. Place `scheduler.markTimespan` call after `scheduler.init`.");
      var t = !1;
      this._els.dhx_cal_data || (e.get_elements(), t = !0);
      var n = e._marked_timespans_ids, s = e._marked_timespans_types, c = e._marked_timespans;
      e.deleteMarkedTimespan(), e.addMarkedTimespan(o);
      var u = e._mark_timespans();
      return t && (e._els = []), e._marked_timespans_ids = n, e._marked_timespans_types = s, e._marked_timespans = c, u;
    }, e.unmarkTimespan = function(o) {
      if (o)
        for (var t = 0; t < o.length; t++) {
          var n = o[t];
          n.parentNode && n.parentNode.removeChild(n);
        }
    }, e._addMarkerTimespanConfig = function(o) {
      var t = "global", n = e._marked_timespans, s = o.id, c = e._marked_timespans_ids;
      c[s] || (c[s] = []);
      var u = o.days, v = o.sections, m = o.type;
      if (o.id = s, v) {
        for (var l in v)
          if (v.hasOwnProperty(l)) {
            n[l] || (n[l] = {});
            var f = v[l], g = n[l];
            g[f] || (g[f] = {}), g[f][u] || (g[f][u] = {}), g[f][u][m] || (g[f][u][m] = [], e._marked_timespans_types || (e._marked_timespans_types = {}), e._marked_timespans_types[m] || (e._marked_timespans_types[m] = !0));
            var p = g[f][u][m];
            o._array = p, p.push(o), c[s].push(o);
          }
      } else
        n[t][u] || (n[t][u] = {}), n[t][u][m] || (n[t][u][m] = []), e._marked_timespans_types || (e._marked_timespans_types = {}), e._marked_timespans_types[m] || (e._marked_timespans_types[m] = !0), p = n[t][u][m], o._array = p, p.push(o), c[s].push(o);
    }, e._marked_timespans_ids = {}, e.addMarkedTimespan = function(o) {
      var t = e._prepare_timespan_options(o);
      if (t.length) {
        for (var n = t[0].id, s = 0; s < t.length; s++)
          e._addMarkerTimespanConfig(t[s]);
        return n;
      }
    }, e._add_timespan_zones = function(o, t) {
      var n = o.slice();
      if (t = t.slice(), !n.length)
        return t;
      for (var s = 0; s < n.length; s += 2)
        for (var c = n[s], u = n[s + 1], v = s + 2 == n.length, m = 0; m < t.length; m += 2) {
          var l = t[m], f = t[m + 1];
          if (f > u && l <= u || l < c && f >= c)
            n[s] = Math.min(c, l), n[s + 1] = Math.max(u, f), s -= 2;
          else {
            if (!v)
              continue;
            var g = c > l ? 0 : 2;
            n.splice(s + g, 0, l, f);
          }
          t.splice(m--, 2);
          break;
        }
      return n;
    }, e._subtract_timespan_zones = function(o, t) {
      for (var n = o.slice(), s = 0; s < n.length; s += 2)
        for (var c = n[s], u = n[s + 1], v = 0; v < t.length; v += 2) {
          var m = t[v], l = t[v + 1];
          if (l > c && m < u) {
            var f = !1;
            c >= m && u <= l && n.splice(s, 2), c < m && (n.splice(s, 2, c, m), f = !0), u > l && n.splice(f ? s + 2 : s, f ? 0 : 2, l, u), s -= 2;
            break;
          }
        }
      return n;
    }, e.invertZones = function(o) {
      return e._subtract_timespan_zones([0, 1440], o.slice());
    }, e._delete_marked_timespan_by_id = function(o) {
      var t = e._marked_timespans_ids[o];
      if (t) {
        for (var n = 0; n < t.length; n++)
          for (var s = t[n], c = s._array, u = 0; u < c.length; u++)
            if (c[u] == s) {
              c.splice(u, 1);
              break;
            }
      }
    }, e._delete_marked_timespan_by_config = function(o) {
      var t, n = e._marked_timespans, s = o.sections, c = o.days, u = o.type || r;
      if (s) {
        for (var v in s)
          if (s.hasOwnProperty(v) && n[v]) {
            var m = s[v];
            n[v][m] && (t = n[v][m]);
          }
      } else
        t = n.global;
      if (t) {
        if (c !== void 0)
          t[c] && t[c][u] && (e._addMarkerTimespanConfig(o), e._delete_marked_timespans_list(t[c][u], o));
        else
          for (var l in t)
            if (t[l][u]) {
              var f = e._lame_clone(o);
              o.days = l, e._addMarkerTimespanConfig(f), e._delete_marked_timespans_list(t[l][u], o);
            }
      }
    }, e._delete_marked_timespans_list = function(o, t) {
      for (var n = 0; n < o.length; n++) {
        var s = o[n], c = e._subtract_timespan_zones(s.zones, t.zones);
        if (c.length)
          s.zones = c;
        else {
          o.splice(n, 1), n--;
          for (var u = e._marked_timespans_ids[s.id], v = 0; v < u.length; v++)
            if (u[v] == s) {
              u.splice(v, 1);
              break;
            }
        }
      }
    }, e.deleteMarkedTimespan = function(o) {
      if (arguments.length || (e._marked_timespans = { global: {} }, e._marked_timespans_ids = {}, e._marked_timespans_types = {}), typeof o != "object")
        e._delete_marked_timespan_by_id(o);
      else {
        o.start_date && o.end_date || (o.days !== void 0 || o.type || (o.days = "fullweek"), o.zones || (o.zones = "fullday"));
        var t = [];
        if (o.type)
          t.push(o.type);
        else
          for (var n in e._marked_timespans_types)
            t.push(n);
        for (var s = e._prepare_timespan_options(o), c = 0; c < s.length; c++)
          for (var u = s[c], v = 0; v < t.length; v++) {
            var m = e._lame_clone(u);
            m.type = t[v], e._delete_marked_timespan_by_config(m);
          }
      }
    }, e._get_types_to_render = function(o, t) {
      var n = o ? e._lame_copy({}, o) : {};
      for (var s in t || {})
        t.hasOwnProperty(s) && (n[s] = t[s]);
      return n;
    }, e._get_configs_to_render = function(o) {
      var t = [];
      for (var n in o)
        o.hasOwnProperty(n) && t.push.apply(t, o[n]);
      return t;
    }, e._on_scale_add_marker = function(o, t) {
      if (!e._table_view || e._mode == "month") {
        var n = t.getDay(), s = t.valueOf(), c = this._mode, u = e._marked_timespans, v = [], m = [];
        if (this._props && this._props[c]) {
          var l = this._props[c], f = l.options, g = f[e._get_unit_index(l, t)];
          if (l.days > 1) {
            var p = Math.round((t - e._min_date) / 864e5), y = l.size || f.length;
            t = e.date.add(e._min_date, Math.floor(p / y), "day"), t = e.date.date_part(t);
          } else
            t = e.date.date_part(new Date(this._date));
          if (n = t.getDay(), s = t.valueOf(), u[c] && u[c][g.key]) {
            var w = u[c][g.key], b = e._get_types_to_render(w[n], w[s]);
            v.push.apply(v, e._get_configs_to_render(b));
          }
        }
        var k = u.global;
        if (e.config.overwrite_marked_timespans) {
          var E = k[s] || k[n];
          v.push.apply(v, e._get_configs_to_render(E));
        } else
          k[s] && v.push.apply(v, e._get_configs_to_render(k[s])), k[n] && v.push.apply(v, e._get_configs_to_render(k[n]));
        for (var D = 0; D < v.length; D++)
          m.push.apply(m, e._render_marked_timespan(v[D], o, t));
        return m;
      }
    }, e.attachEvent("onScaleAdd", function() {
      e._on_scale_add_marker.apply(e, arguments);
    }), e.dblclick_dhx_marked_timespan = function(o, t) {
      e.callEvent("onScaleDblClick", [e.getActionData(o).date, t, o]), e.config.dblclick_create && e.addEventNow(e.getActionData(o).date, null, o);
    };
  }, e._temp_limit_scope();
}, map_view: function(e) {
  e.ext || (e.ext = {}), e.ext.mapView = { geocoder: null, map: null, points: null, markers: null, infoWindow: null, createMarker: function(h) {
    return new google.maps.Marker(h);
  } }, e.xy.map_date_width = 188, e.xy.map_icon_width = 25, e.xy.map_description_width = 400, e.config.map_resolve_event_location = !0, e.config.map_resolve_user_location = !0, e.config.map_initial_position = new google.maps.LatLng(48.724, 8.215), e.config.map_error_position = new google.maps.LatLng(15, 15), e.config.map_infowindow_max_width = 300, e.config.map_type = google.maps.MapTypeId.ROADMAP, e.config.map_zoom_after_resolve = 15, e.locale.labels.marker_geo_success = "It seems you are here.", e.locale.labels.marker_geo_fail = "Sorry, could not get your current position using geolocation.", e.templates.marker_date = e.date.date_to_str("%Y-%m-%d %H:%i"), e.templates.marker_text = function(h, a, r) {
    return "<div><b>" + r.text + "</b><br/><br/>" + (r.event_location || "") + "<br/><br/>" + e.templates.marker_date(h) + " - " + e.templates.marker_date(a) + "</div>";
  }, e.dblclick_dhx_map_area = function() {
    !this.config.readonly && this.config.dblclick_create && this.addEventNow({ start_date: e._date, end_date: e.date.add(e._date, e.config.time_step, "minute") });
  }, e.templates.map_time = function(h, a, r) {
    return e.config.rtl && !r._timed ? e.templates.day_date(a) + " &ndash; " + e.templates.day_date(h) : r._timed ? this.day_date(r.start_date, r.end_date, r) + " " + this.event_date(h) : e.templates.day_date(h) + " &ndash; " + e.templates.day_date(a);
  }, e.templates.map_text = function(h, a, r) {
    return r.text;
  }, e.date.map_start = function(h) {
    return h;
  }, e.date.add_map = function(h, a, r) {
    return new Date(h.valueOf());
  }, e.templates.map_date = function(h, a, r) {
    return "";
  }, e._latLngUpdate = !1, e.attachEvent("onSchedulerReady", function() {
    e._isMapPositionSet = !1;
    const h = document.createElement("div");
    h.className = "dhx_map", h.id = "dhx_gmap", h.style.display = "none", e._obj.appendChild(h), e._els.dhx_gmap = [], e._els.dhx_gmap.push(h), o("dhx_gmap");
    const a = { zoom: e.config.map_initial_zoom || 10, center: e.config.map_initial_position, mapTypeId: e.config.map_type || google.maps.MapTypeId.ROADMAP }, r = new google.maps.Map(document.getElementById("dhx_gmap"), a);
    r.disableDefaultUI = !1, r.disableDoubleClickZoom = !e.config.readonly, google.maps.event.addListener(r, "dblclick", function(u) {
      const v = e.ext.mapView.geocoder;
      if (!e.config.readonly && e.config.dblclick_create) {
        var m = u.latLng;
        v.geocode({ latLng: m }, function(l, f) {
          f == google.maps.GeocoderStatus.OK && (m = l[0].geometry.location, e.addEventNow({ lat: m.lat(), lng: m.lng(), event_location: l[0].formatted_address, start_date: e._date, end_date: e.date.add(e._date, e.config.time_step, "minute") }));
        });
      }
    });
    var d = { content: "" };
    e.config.map_infowindow_max_width && (d.maxWidth = e.config.map_infowindow_max_width), e.map = { _points: [], _markers: [], _infowindow: new google.maps.InfoWindow(d), _infowindows_content: [], _initialization_count: -1, _obj: r }, e.ext.mapView.geocoder = new google.maps.Geocoder(), e.ext.mapView.map = r, e.ext.mapView.points = e.map._points, e.ext.mapView.markers = e.map._markers, e.ext.mapView.infoWindow = e.map._infowindow, e.config.map_resolve_user_location && navigator.geolocation && (e._isMapPositionSet || navigator.geolocation.getCurrentPosition(function(u) {
      var v = new google.maps.LatLng(u.coords.latitude, u.coords.longitude);
      r.setCenter(v), r.setZoom(e.config.map_zoom_after_resolve || 10), e.map._infowindow.setContent(e.locale.labels.marker_geo_success), e.map._infowindow.position = r.getCenter(), e.map._infowindow.open(r), e._isMapPositionSet = !0;
    }, function() {
      e.map._infowindow.setContent(e.locale.labels.marker_geo_fail), e.map._infowindow.setPosition(r.getCenter()), e.map._infowindow.open(r), e._isMapPositionSet = !0;
    })), google.maps.event.addListener(r, "resize", function(u) {
      h.style.zIndex = "5", r.setZoom(r.getZoom());
    }), google.maps.event.addListener(r, "tilesloaded", function(u) {
      h.style.zIndex = "5";
    }), h.style.display = "none";
    const i = e.render_data;
    function _() {
      var u = e.get_visible_events();
      u.sort(function(E, D) {
        return E.start_date.valueOf() == D.start_date.valueOf() ? E.id > D.id ? 1 : -1 : E.start_date > D.start_date ? 1 : -1;
      });
      for (var v = "<div " + (y = e._waiAria.mapAttrString()) + " class='dhx_map_area'>", m = 0; m < u.length; m++) {
        var l = u[m], f = l.id == e._selected_event_id ? "dhx_map_line highlight" : "dhx_map_line", g = l.color ? "--dhx-scheduler-event-background:" + l.color + ";" : "", p = l.textColor ? "--dhx-scheduler-event-color:" + l.textColor + ";" : "", y = e._waiAria.mapRowAttrString(l), w = e._waiAria.mapDetailsBtnString();
        v += "<div " + y + " class='" + f + "' event_id='" + l.id + "' " + e.config.event_attribute + "='" + l.id + "' style='" + g + p + (l._text_style || "") + " width: " + (e.xy.map_date_width + e.xy.map_description_width + 2) + "px;'><div class='dhx_map_event_time' style='width: " + e.xy.map_date_width + "px;' >" + e.templates.map_time(l.start_date, l.end_date, l) + "</div>", v += `<div ${w} class='dhx_event_icon icon_details'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15.4444 16.4H4.55556V7.6H15.4444V16.4ZM13.1111 2V3.6H6.88889V2H5.33333V3.6H4.55556C3.69222 3.6 3 4.312 3 5.2V16.4C3 16.8243 3.16389 17.2313 3.45561 17.5314C3.74733 17.8314 4.143 18 4.55556 18H15.4444C15.857 18 16.2527 17.8314 16.5444 17.5314C16.8361 17.2313 17 16.8243 17 16.4V5.2C17 4.312 16.3 3.6 15.4444 3.6H14.6667V2H13.1111ZM13.8889 10.8H10V14.8H13.8889V10.8Z" fill="#A1A4A6"/>
			</svg></div>`, v += "<div class='line_description' style='width:" + (e.xy.map_description_width - e.xy.map_icon_width) + "px;'>" + e.templates.map_text(l.start_date, l.end_date, l) + "</div></div>";
      }
      v += "<div class='dhx_v_border' style=" + (e.config.rtl ? "'right: " : "'left: ") + (e.xy.map_date_width - 1) + "px;'></div><div class='dhx_v_border_description'></div></div>", e._els.dhx_cal_data[0].scrollTop = 0, e._els.dhx_cal_data[0].innerHTML = v;
      var b = e._els.dhx_cal_data[0].firstChild.childNodes, k = e._getNavDateElement();
      for (k && (k.innerHTML = e.templates[e._mode + "_date"](e._min_date, e._max_date, e._mode)), e._rendered = [], m = 0; m < b.length - 2; m++)
        e._rendered[m] = b[m];
    }
    function o(u) {
      var v = document.getElementById(u);
      const m = e.$container.querySelector(".dhx_cal_navline").offsetHeight;
      var l = e._y - m;
      l < 0 && (l = 0);
      var f = e._x - e.xy.map_date_width - e.xy.map_description_width - 1;
      f < 0 && (f = 0), v.style.height = l + "px", v.style.width = f + "px", v.style.position = "absolute", v.style.top = m + "px", e.config.rtl ? v.style.marginRight = e.xy.map_date_width + e.xy.map_description_width + 1 + "px" : v.style.marginLeft = e.xy.map_date_width + e.xy.map_description_width + 1 + "px", v.style.marginTop = e.xy.nav_height + 2 + "px";
    }
    e.render_data = function(u, v) {
      if (this._mode != "map")
        return i.apply(this, arguments);
      _();
      for (var m = e.get_visible_events(), l = 0; l < m.length; l++)
        e.map._markers[m[l].id] || n(m[l], !1, !1);
    }, e.map_view = function(u) {
      e.map._initialization_count++;
      var v, m = e._els.dhx_gmap[0];
      if (e._min_date = e.config.map_start || e._currentDate(), e._max_date = e.config.map_end || e.date.add(e._currentDate(), 1, "year"), e._table_view = !0, function(g) {
        if (g) {
          var p = e.locale.labels;
          e._els.dhx_cal_header[0].innerHTML = "<div class='dhx_map_head' style='width: " + (e.xy.map_date_width + e.xy.map_description_width + 2) + "px;' ><div class='headline_date' style='width: " + e.xy.map_date_width + "px;'>" + p.date + "</div><div class='headline_description' style='width: " + e.xy.map_description_width + "px;'>" + p.description + "</div></div>", e._table_view = !0, e.set_sizes();
        }
      }(u), u) {
        (function() {
          e._selected_event_id = null, e.map._infowindow.close();
          var g = e.map._markers;
          for (var p in g)
            g.hasOwnProperty(p) && (g[p].setMap(null), delete e.map._markers[p], e.map._infowindows_content[p] && delete e.map._infowindows_content[p]);
        })(), _(), m.style.display = "block", o("dhx_gmap"), v = e.map._obj.getCenter();
        for (var l = e.get_visible_events(), f = 0; f < l.length; f++)
          e.map._markers[l[f].id] || n(l[f]);
      } else
        m.style.display = "none";
      google.maps.event.trigger(e.map._obj, "resize"), e.map._initialization_count === 0 && v && e.map._obj.setCenter(v), e._selected_event_id && t(e._selected_event_id);
    };
    var t = function(u) {
      e.map._obj.setCenter(e.map._points[u]), e.callEvent("onClick", [u]);
    }, n = function(u, v, m) {
      var l = e.config.map_error_position;
      u.lat && u.lng && (l = new google.maps.LatLng(u.lat, u.lng));
      var f = e.templates.marker_text(u.start_date, u.end_date, u);
      e._new_event || (e.map._infowindows_content[u.id] = f, e.map._markers[u.id] && e.map._markers[u.id].setMap(null), e.map._markers[u.id] = e.ext.mapView.createMarker({ position: l, map: e.map._obj }), google.maps.event.addListener(e.map._markers[u.id], "click", function() {
        e.map._infowindow.setContent(e.map._infowindows_content[u.id]), e.map._infowindow.open(e.map._obj, e.map._markers[u.id]), e._selected_event_id = u.id, e.render_data();
      }), e.map._points[u.id] = l, v && e.map._obj.setCenter(e.map._points[u.id]), m && e.callEvent("onClick", [u.id]));
    };
    e.attachEvent("onClick", function(u, v) {
      if (this._mode == "map") {
        e._selected_event_id = u;
        for (var m = 0; m < e._rendered.length; m++)
          e._rendered[m].className = "dhx_map_line", e._rendered[m].getAttribute(e.config.event_attribute) == u && (e._rendered[m].className += " highlight");
        e.map._points[u] && e.map._markers[u] && (e.map._obj.setCenter(e.map._points[u]), google.maps.event.trigger(e.map._markers[u], "click"));
      }
      return !0;
    });
    var s = function(u) {
      const v = e.ext.mapView.geocoder;
      u.event_location && v ? v.geocode({ address: u.event_location, language: e.uid().toString() }, function(m, l) {
        var f = {};
        l != google.maps.GeocoderStatus.OK ? (f = e.callEvent("onLocationError", [u.id])) && f !== !0 || (f = e.config.map_error_position) : f = m[0].geometry.location, u.lat = f.lat(), u.lng = f.lng(), e._selected_event_id = u.id, e._latLngUpdate = !0, e.callEvent("onEventChanged", [u.id, u]), n(u, !0, !0);
      }) : n(u, !0, !0);
    }, c = function(u) {
      const v = e.ext.mapView.geocoder;
      u.event_location && v && v.geocode({ address: u.event_location, language: e.uid().toString() }, function(m, l) {
        var f = {};
        l != google.maps.GeocoderStatus.OK ? (f = e.callEvent("onLocationError", [u.id])) && f !== !0 || (f = e.config.map_error_position) : f = m[0].geometry.location, u.lat = f.lat(), u.lng = f.lng(), e._latLngUpdate = !0, e.callEvent("onEventChanged", [u.id, u]);
      });
    };
    e.attachEvent("onEventChanged", function(u, v) {
      return this._latLngUpdate ? this._latLngUpdate = !1 : (v = e.getEvent(u)).start_date < e._min_date && v.end_date > e._min_date || v.start_date < e._max_date && v.end_date > e._max_date || v.start_date.valueOf() >= e._min_date && v.end_date.valueOf() <= e._max_date ? (e.map._markers[u] && e.map._markers[u].setMap(null), s(v)) : (e._selected_event_id = null, e.map._infowindow.close(), e.map._markers[u] && e.map._markers[u].setMap(null)), !0;
    }), e.attachEvent("onEventIdChange", function(u, v) {
      var m = e.getEvent(v);
      return (m.start_date < e._min_date && m.end_date > e._min_date || m.start_date < e._max_date && m.end_date > e._max_date || m.start_date.valueOf() >= e._min_date && m.end_date.valueOf() <= e._max_date) && (e.map._markers[u] && (e.map._markers[u].setMap(null), delete e.map._markers[u]), e.map._infowindows_content[u] && delete e.map._infowindows_content[u], s(m)), !0;
    }), e.attachEvent("onEventAdded", function(u, v) {
      return e._dataprocessor || (v.start_date < e._min_date && v.end_date > e._min_date || v.start_date < e._max_date && v.end_date > e._max_date || v.start_date.valueOf() >= e._min_date && v.end_date.valueOf() <= e._max_date) && (e.map._markers[u] && e.map._markers[u].setMap(null), s(v)), !0;
    }), e.attachEvent("onBeforeEventDelete", function(u, v) {
      return e.map._markers[u] && e.map._markers[u].setMap(null), e._selected_event_id = null, e.map._infowindow.close(), !0;
    }), e._event_resolve_delay = 1500, e.attachEvent("onEventLoading", function(u) {
      return e.config.map_resolve_event_location && u.event_location && !u.lat && !u.lng && (e._event_resolve_delay += 1500, function(v, m, l, f) {
        setTimeout(function() {
          if (e.$destroyed)
            return !0;
          var g = v.apply(m, l);
          return v = m = l = null, g;
        }, f || 1);
      }(c, this, [u], e._event_resolve_delay)), !0;
    }), e.attachEvent("onEventCancel", function(u, v) {
      return v && (e.map._markers[u] && e.map._markers[u].setMap(null), e.map._infowindow.close()), !0;
    });
  });
}, minical: function(e) {
  const h = e._createDomEventScope();
  e.config.minicalendar = { mark_events: !0 }, e._synced_minicalendars = [], e.renderCalendar = function(a, r, d) {
    var i = null, _ = a.date || e._currentDate();
    if (typeof _ == "string" && (_ = this.templates.api_date(_)), r)
      i = this._render_calendar(r.parentNode, _, a, r), e.unmarkCalendar(i);
    else {
      var o = a.container, t = a.position;
      if (typeof o == "string" && (o = document.getElementById(o)), typeof t == "string" && (t = document.getElementById(t)), t && t.left === void 0 && t.right === void 0) {
        var n = e.$domHelpers.getOffset(t);
        t = { top: n.top + t.offsetHeight, left: n.left };
      }
      o || (o = e._get_def_cont(t)), (i = this._render_calendar(o, _, a)).$_eventAttached || (i.$_eventAttached = !0, h.attach(i, "click", (function(p) {
        var y = p.target || p.srcElement, w = e.$domHelpers;
        if (w.closest(y, ".dhx_month_head") && !w.closest(y, ".dhx_after") && !w.closest(y, ".dhx_before")) {
          var b = w.closest(y, "[data-cell-date]").getAttribute("data-cell-date"), k = e.templates.parse_date(b);
          e.unmarkCalendar(this), e.markCalendar(this, k, "dhx_calendar_click"), this._last_date = k, this.conf.handler && this.conf.handler.call(e, k, this);
        }
      }).bind(i)));
    }
    if (e.config.minicalendar.mark_events)
      for (var s = e.date.month_start(_), c = e.date.add(s, 1, "month"), u = this.getEvents(s, c), v = this["filter_" + this._mode], m = {}, l = 0; l < u.length; l++) {
        var f = u[l];
        if (!v || v(f.id, f)) {
          var g = f.start_date;
          for (g.valueOf() < s.valueOf() && (g = s), g = e.date.date_part(new Date(g.valueOf())); g < f.end_date && (m[+g] || (m[+g] = !0, this.markCalendar(i, g, "dhx_year_event")), !((g = this.date.add(g, 1, "day")).valueOf() >= c.valueOf())); )
            ;
        }
      }
    return this._markCalendarCurrentDate(i), i.conf = a, a.sync && !d && this._synced_minicalendars.push(i), i.conf._on_xle_handler || (i.conf._on_xle_handler = e.attachEvent("onXLE", function() {
      e.updateCalendar(i, i.conf.date);
    })), this.config.wai_aria_attributes && this.config.wai_aria_application_role && i.setAttribute("role", "application"), i;
  }, e._get_def_cont = function(a) {
    return this._def_count || (this._def_count = document.createElement("div"), this._def_count.className = "dhx_minical_popup", e.event(this._def_count, "click", function(r) {
      r.cancelBubble = !0;
    }), document.body.appendChild(this._def_count)), a.left && (this._def_count.style.left = a.left + "px"), a.right && (this._def_count.style.right = a.right + "px"), a.top && (this._def_count.style.top = a.top + "px"), a.bottom && (this._def_count.style.bottom = a.bottom + "px"), this._def_count._created = /* @__PURE__ */ new Date(), this._def_count;
  }, e._locateCalendar = function(a, r) {
    if (typeof r == "string" && (r = e.templates.api_date(r)), +r > +a._max_date || +r < +a._min_date)
      return null;
    for (var d = a.querySelector(".dhx_year_body").childNodes[0], i = 0, _ = new Date(a._min_date); +this.date.add(_, 1, "week") <= +r; )
      _ = this.date.add(_, 1, "week"), i++;
    var o = e.config.start_on_monday, t = (r.getDay() || (o ? 7 : 0)) - (o ? 1 : 0);
    const n = d.querySelector(`.dhx_cal_month_row:nth-child(${i + 1}) .dhx_cal_month_cell:nth-child(${t + 1})`);
    return n ? n.firstChild : null;
  }, e.markCalendar = function(a, r, d) {
    var i = this._locateCalendar(a, r);
    i && (i.className += " " + d);
  }, e.unmarkCalendar = function(a, r, d) {
    if (d = d || "dhx_calendar_click", r = r || a._last_date) {
      var i = this._locateCalendar(a, r);
      i && (i.className = (i.className || "").replace(RegExp(d, "g")));
    }
  }, e._week_template = function(a) {
    for (var r = a || 250, d = 0, i = document.createElement("div"), _ = this.date.week_start(e._currentDate()), o = 0; o < 7; o++)
      this._cols[o] = Math.floor(r / (7 - o)), this._render_x_header(o, d, _, i), _ = this.date.add(_, 1, "day"), r -= this._cols[o], d += this._cols[o];
    return i.lastChild.className += " dhx_scale_bar_last", i;
  }, e.updateCalendar = function(a, r) {
    a.conf.date = r, this.renderCalendar(a.conf, a, !0);
  }, e._mini_cal_arrows = ["&nbsp;", "&nbsp;"], e._render_calendar = function(a, r, d, i) {
    var _ = e.templates, o = this._cols;
    this._cols = [];
    var t = this._mode;
    this._mode = "calendar";
    var n = this._colsS;
    this._colsS = { height: 0 };
    var s = new Date(this._min_date), c = new Date(this._max_date), u = new Date(e._date), v = _.month_day, m = this._ignores_detected;
    this._ignores_detected = 0, _.month_day = _.calendar_date, r = this.date.month_start(r);
    var l, f = this._week_template(a.offsetWidth - 1 - this.config.minicalendar.padding);
    i ? l = i : (l = document.createElement("div")).className = "dhx_cal_container dhx_mini_calendar", l.setAttribute("date", this._helpers.formatDate(r)), l.innerHTML = "<div class='dhx_year_month'></div><div class='dhx_year_grid" + (e.config.rtl ? " dhx_grid_rtl'>" : "'>") + "<div class='dhx_year_week'>" + (f ? f.innerHTML : "") + "</div><div class='dhx_year_body'></div></div>";
    var g = l.querySelector(".dhx_year_month"), p = l.querySelector(".dhx_year_week"), y = l.querySelector(".dhx_year_body");
    if (g.innerHTML = this.templates.calendar_month(r), d.navigation)
      for (var w = function(H, P) {
        var z = e.date.add(H._date, P, "month");
        e.updateCalendar(H, z), e._date.getMonth() == H._date.getMonth() && e._date.getFullYear() == H._date.getFullYear() && e._markCalendarCurrentDate(H);
      }, b = ["dhx_cal_prev_button", "dhx_cal_next_button"], k = ["left:1px;top:4px;position:absolute;", "left:auto; right:1px;top:4px;position:absolute;"], E = [-1, 1], D = function(H) {
        return function() {
          if (d.sync)
            for (var P = e._synced_minicalendars, z = 0; z < P.length; z++)
              w(P[z], H);
          else
            e.config.rtl && (H = -H), w(l, H);
        };
      }, x = [e.locale.labels.prev, e.locale.labels.next], S = 0; S < 2; S++) {
        var N = document.createElement("div");
        N.className = b[S], e._waiAria.headerButtonsAttributes(N, x[S]), N.style.cssText = k[S], N.innerHTML = this._mini_cal_arrows[S], g.appendChild(N), h.attach(N, "click", D(E[S]));
      }
    l._date = new Date(r), l.week_start = (r.getDay() - (this.config.start_on_monday ? 1 : 0) + 7) % 7;
    var M = l._min_date = this.date.week_start(r);
    l._max_date = this.date.add(l._min_date, 6, "week"), this._reset_month_scale(y, r, M, 6), i || a.appendChild(l), p.style.height = p.childNodes[0].offsetHeight - 1 + "px";
    var A = e.uid();
    e._waiAria.minicalHeader(g, A), e._waiAria.minicalGrid(l.querySelector(".dhx_year_grid"), A), e._waiAria.minicalRow(p);
    for (var C = p.querySelectorAll(".dhx_scale_bar"), T = 0; T < C.length; T++)
      e._waiAria.minicalHeadCell(C[T]);
    var O = y.querySelectorAll(".dhx_cal_month_cell"), L = new Date(M);
    for (T = 0; T < O.length; T++)
      e._waiAria.minicalDayCell(O[T], new Date(L)), L = e.date.add(L, 1, "day");
    return e._waiAria.minicalHeader(g, A), this._cols = o, this._mode = t, this._colsS = n, this._min_date = s, this._max_date = c, e._date = u, _.month_day = v, this._ignores_detected = m, l;
  }, e.destroyCalendar = function(a, r) {
    !a && this._def_count && this._def_count.firstChild && (r || (/* @__PURE__ */ new Date()).valueOf() - this._def_count._created.valueOf() > 500) && (a = this._def_count.firstChild), a && (h.detachAll(), a.innerHTML = "", a.parentNode && a.parentNode.removeChild(a), this._def_count && (this._def_count.style.top = "-1000px"), a.conf && a.conf._on_xle_handler && e.detachEvent(a.conf._on_xle_handler));
  }, e.isCalendarVisible = function() {
    return !!(this._def_count && parseInt(this._def_count.style.top, 10) > 0) && this._def_count;
  }, e.attachEvent("onTemplatesReady", function() {
    e.event(document.body, "click", function() {
      e.destroyCalendar();
    });
  }, { once: !0 }), e.form_blocks.calendar_time = { render: function(a) {
    var r = "<span class='dhx_minical_input_wrapper'><input class='dhx_readonly dhx_minical_input' type='text' readonly='true'></span>", d = e.config, i = this.date.date_part(e._currentDate()), _ = 1440, o = 0;
    d.limit_time_select && (o = 60 * d.first_hour, _ = 60 * d.last_hour + 1), i.setHours(o / 60), a._time_values = [], r += " <select class='dhx_lightbox_time_select'>";
    for (var t = o; t < _; t += 1 * this.config.time_step)
      r += "<option value='" + t + "'>" + this.templates.time_picker(i) + "</option>", a._time_values.push(t), i = this.date.add(i, this.config.time_step, "minute");
    return "<div class='dhx_section_time dhx_lightbox_minical'>" + (r += "</select>") + "<span class='dhx_lightbox_minical_spacer'> &nbsp;&ndash;&nbsp; </span>" + r + "</div>";
  }, set_value: function(a, r, d, i) {
    var _, o, t = a.getElementsByTagName("input"), n = a.getElementsByTagName("select"), s = function(g, p, y) {
      e.event(g, "click", function() {
        e.destroyCalendar(null, !0), e.renderCalendar({ position: g, date: new Date(this._date), navigation: !0, handler: function(w) {
          g.value = e.templates.calendar_time(w), g._date = new Date(w), e.destroyCalendar(), e.config.event_duration && e.config.auto_end_date && y === 0 && m();
        } });
      });
    };
    if (e.config.full_day) {
      if (!a._full_day) {
        var c = "<label class='dhx_fullday'><input type='checkbox' name='full_day' value='true'> " + e.locale.labels.full_day + "&nbsp;</label></input>";
        e.config.wide_form || (c = a.previousSibling.innerHTML + c), a.previousSibling.innerHTML = c, a._full_day = !0;
      }
      var u = a.previousSibling.getElementsByTagName("input")[0], v = e.date.time_part(d.start_date) === 0 && e.date.time_part(d.end_date) === 0;
      u.checked = v, n[0].disabled = u.checked, n[1].disabled = u.checked, u.$_eventAttached || (u.$_eventAttached = !0, e.event(u, "click", function() {
        if (u.checked === !0) {
          var g = {};
          e.form_blocks.calendar_time.get_value(a, g), _ = e.date.date_part(g.start_date), (+(o = e.date.date_part(g.end_date)) == +_ || +o >= +_ && (d.end_date.getHours() !== 0 || d.end_date.getMinutes() !== 0)) && (o = e.date.add(o, 1, "day"));
        }
        var p = _ || d.start_date, y = o || d.end_date;
        l(t[0], p), l(t[1], y), n[0].value = 60 * p.getHours() + p.getMinutes(), n[1].value = 60 * y.getHours() + y.getMinutes(), n[0].disabled = u.checked, n[1].disabled = u.checked;
      }));
    }
    if (e.config.event_duration && e.config.auto_end_date) {
      var m = function() {
        e.config.auto_end_date && e.config.event_duration && (_ = e.date.add(t[0]._date, n[0].value, "minute"), o = new Date(_.getTime() + 60 * e.config.event_duration * 1e3), t[1].value = e.templates.calendar_time(o), t[1]._date = e.date.date_part(new Date(o)), n[1].value = 60 * o.getHours() + o.getMinutes());
      };
      n[0].$_eventAttached || n[0].addEventListener("change", m);
    }
    function l(g, p, y) {
      s(g, p, y), g.value = e.templates.calendar_time(p), g._date = e.date.date_part(new Date(p));
    }
    function f(g) {
      for (var p = i._time_values, y = 60 * g.getHours() + g.getMinutes(), w = y, b = !1, k = 0; k < p.length; k++) {
        var E = p[k];
        if (E === y) {
          b = !0;
          break;
        }
        E < y && (w = E);
      }
      return b || w ? b ? y : w : -1;
    }
    l(t[0], d.start_date, 0), l(t[1], d.end_date, 1), s = function() {
    }, n[0].value = f(d.start_date), n[1].value = f(d.end_date);
  }, get_value: function(a, r) {
    var d = a.getElementsByTagName("input"), i = a.getElementsByTagName("select");
    return r.start_date = e.date.add(d[0]._date, i[0].value, "minute"), r.end_date = e.date.add(d[1]._date, i[1].value, "minute"), r.end_date <= r.start_date && (r.end_date = e.date.add(r.start_date, e.config.time_step, "minute")), { start_date: new Date(r.start_date), end_date: new Date(r.end_date) };
  }, focus: function(a) {
  } }, e.linkCalendar = function(a, r) {
    var d = function() {
      var i = e._date, _ = new Date(i.valueOf());
      return r && (_ = r(_)), _.setDate(1), e.updateCalendar(a, _), !0;
    };
    e.attachEvent("onViewChange", d), e.attachEvent("onXLE", d), e.attachEvent("onEventAdded", d), e.attachEvent("onEventChanged", d), e.attachEvent("onEventDeleted", d), d();
  }, e._markCalendarCurrentDate = function(a) {
    var r = e.getState(), d = r.min_date, i = r.max_date, _ = r.mode, o = e.date.month_start(new Date(a._date)), t = e.date.add(o, 1, "month");
    if (!({ month: !0, year: !0, agenda: !0, grid: !0 }[_] || d.valueOf() <= o.valueOf() && i.valueOf() >= t.valueOf()))
      for (var n = d; n.valueOf() < i.valueOf(); )
        o.valueOf() <= n.valueOf() && t > n && e.markCalendar(a, n, "dhx_calendar_click"), n = e.date.add(n, 1, "day");
  }, e.attachEvent("onEventCancel", function() {
    e.destroyCalendar(null, !0);
  }), e.attachEvent("onDestroy", function() {
    e.destroyCalendar();
  });
}, monthheight: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    e.xy.scroll_width = 0;
    var h = e.render_view_data;
    e.render_view_data = function() {
      var r = this._els.dhx_cal_data[0];
      r.firstChild._h_fix = !0, h.apply(e, arguments);
      var d = parseInt(r.style.height);
      r.style.height = "1px", r.style.height = r.scrollHeight + "px", this._obj.style.height = this._obj.clientHeight + r.scrollHeight - d + "px";
    };
    var a = e._reset_month_scale;
    e._reset_month_scale = function(r, d, i, _) {
      var o = { clientHeight: 100 };
      a.apply(e, [o, d, i, _]), r.innerHTML = o.innerHTML;
    };
  });
}, multisection: function(e) {
  R("Multisection", e.assert);
}, multiselect: function(e) {
  e.form_blocks.multiselect = { render: function(h) {
    var a = "dhx_multi_select_control dhx_multi_select_" + h.name;
    h.vertical && (a += " dhx_multi_select_control_vertical");
    for (var r = "<div class='" + a + "' style='overflow: auto; max-height: " + h.height + "px; position: relative;' >", d = 0; d < h.options.length; d++)
      r += "<label><input type='checkbox' value='" + h.options[d].key + "'/>" + h.options[d].label + "</label>";
    return r += "</div>";
  }, set_value: function(h, a, r, d) {
    for (var i = h.getElementsByTagName("input"), _ = 0; _ < i.length; _++)
      i[_].checked = !1;
    function o(u) {
      for (var v = h.getElementsByTagName("input"), m = 0; m < v.length; m++)
        v[m].checked = !!u[v[m].value];
    }
    var t = {};
    if (r[d.map_to]) {
      var n = (r[d.map_to] + "").split(d.delimiter || e.config.section_delimiter || ",");
      for (_ = 0; _ < n.length; _++)
        t[n[_]] = !0;
      o(t);
    } else {
      if (e._new_event || !d.script_url)
        return;
      var s = document.createElement("div");
      s.className = "dhx_loading", s.style.cssText = "position: absolute; top: 40%; left: 40%;", h.appendChild(s);
      var c = [d.script_url, d.script_url.indexOf("?") == -1 ? "?" : "&", "dhx_crosslink_" + d.map_to + "=" + r.id + "&uid=" + e.uid()].join("");
      e.ajax.get(c, function(u) {
        var v = function(m, l) {
          try {
            for (var f = JSON.parse(m.xmlDoc.responseText), g = {}, p = 0; p < f.length; p++) {
              var y = f[p];
              g[y.value || y.key || y.id] = !0;
            }
            return g;
          } catch {
            return null;
          }
        }(u);
        v || (v = function(m, l) {
          for (var f = e.ajax.xpath("//data/item", m.xmlDoc), g = {}, p = 0; p < f.length; p++)
            g[f[p].getAttribute(l.map_to)] = !0;
          return g;
        }(u, d)), o(v), h.removeChild(s);
      });
    }
  }, get_value: function(h, a, r) {
    for (var d = [], i = h.getElementsByTagName("input"), _ = 0; _ < i.length; _++)
      i[_].checked && d.push(i[_].value);
    return d.join(r.delimiter || e.config.section_delimiter || ",");
  }, focus: function(h) {
  } };
}, multisource: function(e) {
  var h = e._load;
  e._load = function(a, r) {
    if (typeof (a = a || this._load_url) == "object")
      for (var d = function(_) {
        var o = function() {
        };
        return o.prototype = _, o;
      }(this._loaded), i = 0; i < a.length; i++)
        this._loaded = new d(), h.call(this, a[i], r);
    else
      h.apply(this, arguments);
  };
}, mvc: function(e) {
  var h, a = { use_id: !1 };
  function r(_) {
    var o = {};
    for (var t in _)
      t.indexOf("_") !== 0 && (o[t] = _[t]);
    return a.use_id || delete o.id, o;
  }
  function d(_) {
    _._not_render = !1, _._render_wait && _.render_view_data(), _._loading = !1, _.callEvent("onXLE", []);
  }
  function i(_) {
    return a.use_id ? _.id : _.cid;
  }
  e.backbone = function(_, o) {
    o && (a = o), _.bind("change", function(s, c) {
      var u = i(s), v = e._events[u] = s.toJSON();
      v.id = u, e._init_event(v), clearTimeout(h), h = setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.updateView();
      }, 1);
    }), _.bind("remove", function(s, c) {
      var u = i(s);
      e._events[u] && e.deleteEvent(u);
    });
    var t = [];
    function n() {
      if (e.$destroyed)
        return !0;
      t.length && (e.parse(t, "json"), t = []);
    }
    _.bind("add", function(s, c) {
      var u = i(s);
      if (!e._events[u]) {
        var v = s.toJSON();
        v.id = u, e._init_event(v), t.push(v), t.length == 1 && setTimeout(n, 1);
      }
    }), _.bind("request", function(s) {
      var c;
      s instanceof Backbone.Collection && ((c = e)._loading = !0, c._not_render = !0, c.callEvent("onXLS", []));
    }), _.bind("sync", function(s) {
      s instanceof Backbone.Collection && d(e);
    }), _.bind("error", function(s) {
      s instanceof Backbone.Collection && d(e);
    }), e.attachEvent("onEventCreated", function(s) {
      var c = new _.model(e.getEvent(s));
      return e._events[s] = c.toJSON(), e._events[s].id = s, !0;
    }), e.attachEvent("onEventAdded", function(s) {
      if (!_.get(s)) {
        var c = r(e.getEvent(s)), u = new _.model(c), v = i(u);
        v != s && this.changeEventId(s, v), _.add(u), _.trigger("scheduler:add", u);
      }
      return !0;
    }), e.attachEvent("onEventChanged", function(s) {
      var c = _.get(s), u = r(e.getEvent(s));
      return c.set(u), _.trigger("scheduler:change", c), !0;
    }), e.attachEvent("onEventDeleted", function(s) {
      var c = _.get(s);
      return c && (_.trigger("scheduler:remove", c), _.remove(s)), !0;
    });
  };
}, outerdrag: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    var h, a = new dhtmlDragAndDropObject(), r = a.stopDrag;
    function d(i, _, o, t) {
      if (!e.checkEvent("onBeforeExternalDragIn") || e.callEvent("onBeforeExternalDragIn", [i, _, o, t, h])) {
        var n = e.attachEvent("onEventCreated", function(m) {
          e.callEvent("onExternalDragIn", [m, i, h]) || (this._drag_mode = this._drag_id = null, this.deleteEvent(m));
        }), s = e.getActionData(h), c = { start_date: new Date(s.date) };
        if (e.matrix && e.matrix[e._mode]) {
          var u = e.matrix[e._mode];
          c[u.y_property] = s.section;
          var v = e._locate_cell_timeline(h);
          c.start_date = u._trace_x[v.x], c.end_date = e.date.add(c.start_date, u.x_step, u.x_unit);
        }
        e._props && e._props[e._mode] && (c[e._props[e._mode].map_to] = s.section), e.addEventNow(c), e.detachEvent(n);
      }
    }
    a.stopDrag = function(i) {
      return h = i, r.apply(this, arguments);
    }, a.addDragLanding(e._els.dhx_cal_data[0], { _drag: function(i, _, o, t) {
      d(i, _, o, t);
    }, _dragIn: function(i, _) {
      return i;
    }, _dragOut: function(i) {
      return this;
    } }), dhtmlx.DragControl && dhtmlx.DragControl.addDrop(e._els.dhx_cal_data[0], { onDrop: function(i, _, o, t) {
      var n = dhtmlx.DragControl.getMaster(i);
      h = t, d(i, n, _, t.target || t.srcElement);
    }, onDragIn: function(i, _, o) {
      return _;
    } }, !0);
  });
}, pdf: function(e) {
  var h, a, r = new RegExp("<[^>]*>", "g"), d = new RegExp("<br[^>]*>", "g");
  function i(b) {
    return b.replace(d, `
`).replace(r, "");
  }
  function _(b, k) {
    b = parseFloat(b), k = parseFloat(k), isNaN(k) || (b -= k);
    var E = t(b);
    return b = b - E.width + E.cols * h, isNaN(b) ? "auto" : 100 * b / h;
  }
  function o(b, k, E) {
    b = parseFloat(b), k = parseFloat(k), !isNaN(k) && E && (b -= k);
    var D = t(b);
    return b = b - D.width + D.cols * h, isNaN(b) ? "auto" : 100 * b / (h - (isNaN(k) ? 0 : k));
  }
  function t(b) {
    for (var k = 0, E = e._els.dhx_cal_header[0].childNodes, D = E[1] ? E[1].childNodes : E[0].childNodes, x = 0; x < D.length; x++) {
      var S = D[x].style ? D[x] : D[x].parentNode, N = parseFloat(S.style.width);
      if (!(b > N))
        break;
      b -= N + 1, k += N + 1;
    }
    return { width: k, cols: x };
  }
  function n(b) {
    return b = parseFloat(b), isNaN(b) ? "auto" : 100 * b / a;
  }
  function s(b, k) {
    return (window.getComputedStyle ? window.getComputedStyle(b, null)[k] : b.currentStyle ? b.currentStyle[k] : null) || "";
  }
  function c(b, k) {
    for (var E = parseInt(b.style.left, 10), D = 0; D < e._cols.length; D++)
      if ((E -= e._cols[D]) < 0)
        return D;
    return k;
  }
  function u(b, k) {
    for (var E = parseInt(b.style.top, 10), D = 0; D < e._colsS.heights.length; D++)
      if (e._colsS.heights[D] > E)
        return D;
    return k;
  }
  function v(b) {
    return b ? "</" + b + ">" : "";
  }
  function m(b, k, E, D) {
    var x = "<" + b + " profile='" + k + "'";
    return E && (x += " header='" + E + "'"), D && (x += " footer='" + D + "'"), x += ">";
  }
  function l() {
    var b = "", k = e._mode;
    if (e.matrix && e.matrix[e._mode] && (k = e.matrix[e._mode].render == "cell" ? "matrix" : "timeline"), b += "<scale mode='" + k + "' today='" + e._els.dhx_cal_date[0].innerHTML + "'>", e._mode == "week_agenda")
      for (var E = e._els.dhx_cal_data[0].getElementsByTagName("DIV"), D = 0; D < E.length; D++)
        E[D].className == "dhx_wa_scale_bar" && (b += "<column>" + i(E[D].innerHTML) + "</column>");
    else if (e._mode == "agenda" || e._mode == "map")
      b += "<column>" + i((E = e._els.dhx_cal_header[0].childNodes[0].childNodes)[0].innerHTML) + "</column><column>" + i(E[1].innerHTML) + "</column>";
    else if (e._mode == "year")
      for (E = e._els.dhx_cal_data[0].childNodes, D = 0; D < E.length; D++)
        b += "<month label='" + i(E[D].querySelector(".dhx_year_month").innerHTML) + "'>", b += g(E[D].querySelector(".dhx_year_week").childNodes), b += f(E[D].querySelector(".dhx_year_body")), b += "</month>";
    else {
      b += "<x>", b += g(E = e._els.dhx_cal_header[0].childNodes), b += "</x>";
      var x = e._els.dhx_cal_data[0];
      if (e.matrix && e.matrix[e._mode]) {
        for (b += "<y>", D = 0; D < x.firstChild.rows.length; D++)
          b += "<row><![CDATA[" + i(x.firstChild.rows[D].cells[0].innerHTML) + "]]></row>";
        b += "</y>", a = x.firstChild.rows[0].cells[0].offsetHeight;
      } else if (x.firstChild.tagName == "TABLE")
        b += f(x);
      else {
        for (x = x.childNodes[x.childNodes.length - 1]; x.className.indexOf("dhx_scale_holder") == -1; )
          x = x.previousSibling;
        for (x = x.childNodes, b += "<y>", D = 0; D < x.length; D++)
          b += `
<row><![CDATA[` + i(x[D].innerHTML) + "]]></row>";
        b += "</y>", a = x[0].offsetHeight;
      }
    }
    return b += "</scale>";
  }
  function f(b) {
    for (var k = "", E = b.querySelectorAll("tr"), D = 0; D < E.length; D++) {
      for (var x = [], S = E[D].querySelectorAll("td"), N = 0; N < S.length; N++)
        x.push(S[N].querySelector(".dhx_month_head").innerHTML);
      k += `
<row height='` + S[0].offsetHeight + "'><![CDATA[" + i(x.join("|")) + "]]></row>", a = S[0].offsetHeight;
    }
    return k;
  }
  function g(b) {
    var k, E = "";
    e.matrix && e.matrix[e._mode] && (e.matrix[e._mode].second_scale && (k = b[1].childNodes), b = b[0].childNodes);
    for (var D = 0; D < b.length; D++)
      E += `
<column><![CDATA[` + i(b[D].innerHTML) + "]]></column>";
    if (h = b[0].offsetWidth, k) {
      var x = 0, S = b[0].offsetWidth, N = 1;
      for (D = 0; D < k.length; D++)
        E += `
<column second_scale='` + N + "'><![CDATA[" + i(k[D].innerHTML) + "]]></column>", (x += k[D].offsetWidth) >= S && (S += b[N] ? b[N].offsetWidth : 0, N++), h = k[0].offsetWidth;
    }
    return E;
  }
  function p(b) {
    var k = "", E = e._rendered, D = e.matrix && e.matrix[e._mode];
    if (e._mode == "agenda" || e._mode == "map")
      for (var x = 0; x < E.length; x++)
        k += "<event><head><![CDATA[" + i(E[x].childNodes[0].innerHTML) + "]]></head><body><![CDATA[" + i(E[x].childNodes[2].innerHTML) + "]]></body></event>";
    else if (e._mode == "week_agenda")
      for (x = 0; x < E.length; x++)
        k += "<event day='" + E[x].parentNode.getAttribute("day") + "'><body>" + i(E[x].innerHTML) + "</body></event>";
    else if (e._mode == "year")
      for (E = e.get_visible_events(), x = 0; x < E.length; x++) {
        var S = E[x].start_date;
        for (S.valueOf() < e._min_date.valueOf() && (S = e._min_date); S < E[x].end_date; ) {
          var N = S.getMonth() + 12 * (S.getFullYear() - e._min_date.getFullYear()) - e.week_starts._month, M = e.week_starts[N] + S.getDate() - 1, A = b ? s(e._get_year_cell(S), "color") : "", C = b ? s(e._get_year_cell(S), "backgroundColor") : "";
          if (k += "<event day='" + M % 7 + "' week='" + Math.floor(M / 7) + "' month='" + N + "' backgroundColor='" + C + "' color='" + A + "'></event>", (S = e.date.add(S, 1, "day")).valueOf() >= e._max_date.valueOf())
            break;
        }
      }
    else if (D && D.render == "cell")
      for (E = e._els.dhx_cal_data[0].getElementsByTagName("TD"), x = 0; x < E.length; x++)
        A = b ? s(E[x], "color") : "", k += `
<event><body backgroundColor='` + (C = b ? s(E[x], "backgroundColor") : "") + "' color='" + A + "'><![CDATA[" + i(E[x].innerHTML) + "]]></body></event>";
    else
      for (x = 0; x < E.length; x++) {
        var T, O;
        if (e.matrix && e.matrix[e._mode])
          T = _(E[x].style.left), O = _(E[x].offsetWidth) - 1;
        else {
          var L = e.config.use_select_menu_space ? 0 : 26;
          T = o(E[x].style.left, L, !0), O = o(E[x].style.width, L) - 1;
        }
        if (!isNaN(1 * O)) {
          var H = n(E[x].style.top), P = n(E[x].style.height), z = E[x].className.split(" ")[0].replace("dhx_cal_", "");
          if (z !== "dhx_tooltip_line") {
            var $ = e.getEvent(E[x].getAttribute(e.config.event_attribute));
            if ($) {
              M = $._sday;
              var j = $._sweek, F = $._length || 0;
              if (e._mode == "month")
                P = parseInt(E[x].offsetHeight, 10), H = parseInt(E[x].style.top, 10) - e.xy.month_head_height, M = c(E[x], M), j = u(E[x], j);
              else if (e.matrix && e.matrix[e._mode]) {
                M = 0, j = E[x].parentNode.parentNode.parentNode.rowIndex;
                var U = a;
                a = E[x].parentNode.offsetHeight, H = n(E[x].style.top), H -= 0.2 * H, a = U;
              } else {
                if (E[x].parentNode == e._els.dhx_cal_data[0])
                  continue;
                var J = e._els.dhx_cal_data[0].childNodes[0], se = parseFloat(J.className.indexOf("dhx_scale_holder") != -1 ? J.style.left : 0);
                T += _(E[x].parentNode.style.left, se);
              }
              k += `
<event week='` + j + "' day='" + M + "' type='" + z + "' x='" + T + "' y='" + H + "' width='" + O + "' height='" + P + "' len='" + F + "'>", z == "event" ? (k += "<header><![CDATA[" + i(E[x].childNodes[1].innerHTML) + "]]></header>", A = b ? s(E[x].childNodes[2], "color") : "", k += "<body backgroundColor='" + (C = b ? s(E[x].childNodes[2], "backgroundColor") : "") + "' color='" + A + "'><![CDATA[" + i(E[x].childNodes[2].innerHTML) + "]]></body>") : (A = b ? s(E[x], "color") : "", k += "<body backgroundColor='" + (C = b ? s(E[x], "backgroundColor") : "") + "' color='" + A + "'><![CDATA[" + i(E[x].innerHTML) + "]]></body>"), k += "</event>";
            }
          }
        }
      }
    return k;
  }
  function y(b, k, E, D, x, S) {
    var N = !1;
    D == "fullcolor" && (N = !0, D = "color"), D = D || "color";
    var M, A = "";
    if (b) {
      var C = e._date, T = e._mode;
      k = e.date[E + "_start"](k), k = e.date["get_" + E + "_end"] ? e.date["get_" + E + "_end"](k) : e.date.add(k, 1, E), A = m("pages", D, x, S);
      for (var O = new Date(b); +O < +k; O = this.date.add(O, 1, E))
        this.setCurrentView(O, E), A += ((M = "page") ? "<" + M + ">" : "") + l().replace("–", "-") + p(N) + v("page");
      A += v("pages"), this.setCurrentView(C, T);
    } else
      A = m("data", D, x, S) + l().replace("–", "-") + p(N) + v("data");
    return A;
  }
  function w(b, k, E, D, x, S, N) {
    (function(M, A) {
      var C = e.uid(), T = document.createElement("div");
      T.style.display = "none", document.body.appendChild(T), T.innerHTML = '<form id="' + C + '" method="post" target="_blank" action="' + A + '" accept-charset="utf-8" enctype="application/x-www-form-urlencoded"><input type="hidden" name="mycoolxmlbody"/> </form>', document.getElementById(C).firstChild.value = encodeURIComponent(M), document.getElementById(C).submit(), T.parentNode.removeChild(T);
    })(typeof x == "object" ? function(M) {
      for (var A = "<data>", C = 0; C < M.length; C++)
        A += M[C].source.getPDFData(M[C].start, M[C].end, M[C].view, M[C].mode, M[C].header, M[C].footer);
      return A += "</data>", A;
    }(x) : y.apply(this, [b, k, E, x, S, N]), D);
  }
  e.getPDFData = y, e.toPDF = function(b, k, E, D) {
    return w.apply(this, [null, null, null, b, k, E, D]);
  }, e.toPDFRange = function(b, k, E, D, x, S, N) {
    return typeof b == "string" && (b = e.templates.api_date(b), k = e.templates.api_date(k)), w.apply(this, arguments);
  };
}, quick_info: function(e) {
  e.config.icons_select = ["icon_form", "icon_delete"], e.config.details_on_create = !0, e.config.show_quick_info = !0, e.xy.menu_width = 0, e.attachEvent("onClick", function(h) {
    if (e.config.show_quick_info)
      return e.showQuickInfo(h), !0;
  }), function() {
    for (var h = ["onEmptyClick", "onViewChange", "onLightbox", "onBeforeEventDelete", "onBeforeDrag"], a = function() {
      return e.hideQuickInfo(!0), !0;
    }, r = 0; r < h.length; r++)
      e.attachEvent(h[r], a);
  }(), e.templates.quick_info_title = function(h, a, r) {
    return r.text.substr(0, 50);
  }, e.templates.quick_info_content = function(h, a, r) {
    return r.details || "";
  }, e.templates.quick_info_date = function(h, a, r) {
    return e.isOneDayEvent(r) && e.config.rtl ? e.templates.day_date(h, a, r) + " " + e.templates.event_header(a, h, r) : e.isOneDayEvent(r) ? e.templates.day_date(h, a, r) + " " + e.templates.event_header(h, a, r) : e.config.rtl ? e.templates.week_date(a, h, r) : e.templates.week_date(h, a, r);
  }, e.showQuickInfo = function(h) {
    if (h != this._quick_info_box_id && (this.hideQuickInfo(!0), this.callEvent("onBeforeQuickInfo", [h]) !== !1)) {
      var a = this._get_event_counter_part(h);
      a && (this._quick_info_box = this._init_quick_info(a), this._fill_quick_data(h), this._show_quick_info(a), this.callEvent("onQuickInfo", [h]));
    }
  }, function() {
    function h(a) {
      a = a || "";
      var r, d = parseFloat(a), i = a.match(/m?s/);
      switch (i && (i = i[0]), i) {
        case "s":
          r = 1e3 * d;
          break;
        case "ms":
          r = d;
          break;
        default:
          r = 0;
      }
      return r;
    }
    e.hideQuickInfo = function(a) {
      var r = this._quick_info_box, d = this._quick_info_box_id;
      if (this._quick_info_box_id = 0, r && r.parentNode) {
        var i = r.offsetWidth;
        if (e.config.quick_info_detached)
          return this.callEvent("onAfterQuickInfo", [d]), r.parentNode.removeChild(r);
        if (r.style.right == "auto" ? r.style.left = -i + "px" : r.style.right = -i + "px", a)
          r.parentNode.removeChild(r);
        else {
          var _;
          window.getComputedStyle ? _ = window.getComputedStyle(r, null) : r.currentStyle && (_ = r.currentStyle);
          var o = h(_["transition-delay"]) + h(_["transition-duration"]);
          setTimeout(function() {
            r.parentNode && r.parentNode.removeChild(r);
          }, o);
        }
        this.callEvent("onAfterQuickInfo", [d]);
      }
    };
  }(), e.event(window, "keydown", function(h) {
    h.keyCode == 27 && e.hideQuickInfo();
  }), e._show_quick_info = function(h) {
    var a = e._quick_info_box;
    e._obj.appendChild(a);
    var r = a.offsetWidth, d = a.offsetHeight;
    if (e.config.quick_info_detached) {
      var i = h.left - h.dx * (r - h.width);
      e.getView() && e.getView()._x_scroll && (e.config.rtl ? i += e.getView()._x_scroll : i -= e.getView()._x_scroll), i + r > window.innerWidth && (i = window.innerWidth - r), i = Math.max(0, i), a.style.left = i + "px", a.style.top = h.top - (h.dy ? d : -h.height) + "px";
    } else {
      const _ = e.$container.querySelector(".dhx_cal_data").offsetTop;
      a.style.top = _ + 20 + "px", h.dx == 1 ? (a.style.right = "auto", a.style.left = -r + "px", setTimeout(function() {
        a.style.left = "-10px";
      }, 1)) : (a.style.left = "auto", a.style.right = -r + "px", setTimeout(function() {
        a.style.right = "-10px";
      }, 1)), a.className = a.className.replace(" dhx_qi_left", "").replace(" dhx_qi_right", "") + " dhx_qi_" + (h.dx == 1 ? "left" : "right");
    }
  }, e.attachEvent("onTemplatesReady", function() {
    if (e.hideQuickInfo(), this._quick_info_box) {
      var h = this._quick_info_box;
      h.parentNode && h.parentNode.removeChild(h), this._quick_info_box = null;
    }
  }), e._quick_info_onscroll_handler = function(h) {
    e.hideQuickInfo();
  }, e._init_quick_info = function() {
    if (!this._quick_info_box) {
      var h = this._quick_info_box = document.createElement("div");
      this._waiAria.quickInfoAttr(h), h.className = "dhx_cal_quick_info", e.$testmode && (h.className += " dhx_no_animate"), e.config.rtl && (h.className += " dhx_quick_info_rtl");
      var a = `
		<div class="dhx_cal_qi_tcontrols">
			<a class="dhx_cal_qi_close_btn scheduler_icon close"></a>
		</div>
		<div class="dhx_cal_qi_title" ${this._waiAria.quickInfoHeaderAttrString()}>
				
				<div class="dhx_cal_qi_tcontent"></div>
				<div class="dhx_cal_qi_tdate"></div>
			</div>
			<div class="dhx_cal_qi_content"></div>`;
      a += '<div class="dhx_cal_qi_controls">';
      for (var r = e.config.icons_select, d = 0; d < r.length; d++)
        a += `<div ${this._waiAria.quickInfoButtonAttrString(this.locale.labels[r[d]])} class="dhx_qi_big_icon ${r[d]}" title="${e.locale.labels[r[d]]}">
				<div class='dhx_menu_icon ${r[d]}'></div><div>${e.locale.labels[r[d]]}</div></div>`;
      a += "</div>", h.innerHTML = a, e.event(h, "click", function(i) {
        e._qi_button_click(i.target || i.srcElement);
      }), e.config.quick_info_detached && (e._detachDomEvent(e._els.dhx_cal_data[0], "scroll", e._quick_info_onscroll_handler), e.event(e._els.dhx_cal_data[0], "scroll", e._quick_info_onscroll_handler));
    }
    return this._quick_info_box;
  }, e._qi_button_click = function(h) {
    var a = e._quick_info_box;
    if (h && h != a)
      if (h.closest(".dhx_cal_qi_close_btn"))
        e.hideQuickInfo();
      else {
        var r = e._getClassName(h);
        if (r.indexOf("_icon") != -1) {
          var d = e._quick_info_box_id;
          e._click.buttons[r.split(" ")[1].replace("icon_", "")](d);
        } else
          e._qi_button_click(h.parentNode);
      }
  }, e._get_event_counter_part = function(h) {
    for (var a = e.getRenderedEvent(h), r = 0, d = 0, i = a; i && i != e._obj; )
      r += i.offsetLeft, d += i.offsetTop - i.scrollTop, i = i.offsetParent;
    return i ? { left: r, top: d, dx: r + a.offsetWidth / 2 > e._x / 2 ? 1 : 0, dy: d + a.offsetHeight / 2 > e._y / 2 ? 1 : 0, width: a.offsetWidth, height: a.offsetHeight } : 0;
  }, e._fill_quick_data = function(h) {
    var a = e.getEvent(h), r = e._quick_info_box;
    e._quick_info_box_id = h;
    var d = { content: e.templates.quick_info_title(a.start_date, a.end_date, a), date: e.templates.quick_info_date(a.start_date, a.end_date, a) };
    r.querySelector(".dhx_cal_qi_tcontent").innerHTML = `<span>${d.content}</span>`, r.querySelector(".dhx_cal_qi_tdate").innerHTML = d.date, e._waiAria.quickInfoHeader(r, [d.content, d.date].join(" "));
    var i = r.querySelector(".dhx_cal_qi_content");
    const _ = e.templates.quick_info_content(a.start_date, a.end_date, a);
    _ ? (i.classList.remove("dhx_hidden"), i.innerHTML = _) : i.classList.add("dhx_hidden");
  };
}, readonly: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    var h;
    e.form_blocks.recurring && (h = e.form_blocks.recurring.set_value);
    var a = e.config.buttons_left.slice(), r = e.config.buttons_right.slice();
    function d(o, t, n, s) {
      for (var c = t.getElementsByTagName(o), u = n.getElementsByTagName(o), v = u.length - 1; v >= 0; v--)
        if (n = u[v], s) {
          var m = document.createElement("span");
          m.className = "dhx_text_disabled", m.innerHTML = s(c[v]), n.parentNode.insertBefore(m, n), n.parentNode.removeChild(n);
        } else
          n.disabled = !0, t.checked && (n.checked = !0);
    }
    e.attachEvent("onBeforeLightbox", function(o) {
      this.config.readonly_form || this.getEvent(o).readonly ? this.config.readonly_active = !0 : (this.config.readonly_active = !1, e.config.buttons_left = a.slice(), e.config.buttons_right = r.slice(), e.form_blocks.recurring && (e.form_blocks.recurring.set_value = h));
      var t = this.config.lightbox.sections;
      if (this.config.readonly_active) {
        for (var n = 0; n < t.length; n++)
          t[n].type == "recurring" && this.config.readonly_active && e.form_blocks.recurring && (e.form_blocks.recurring.set_value = function(g, p, y) {
            var w = e.$domHelpers.closest(g, ".dhx_wrap_section"), b = "none";
            w.querySelector(".dhx_cal_lsection").display = b, w.querySelector(".dhx_form_repeat").display = b, w.style.display = b, e.setLightboxSize();
          });
        var s = ["dhx_delete_btn", "dhx_save_btn"], c = [e.config.buttons_left, e.config.buttons_right];
        for (n = 0; n < s.length; n++)
          for (var u = s[n], v = 0; v < c.length; v++) {
            for (var m = c[v], l = -1, f = 0; f < m.length; f++)
              if (m[f] == u) {
                l = f;
                break;
              }
            l != -1 && m.splice(l, 1);
          }
      }
      return this.resetLightbox(), !0;
    });
    var i = e._fill_lightbox;
    e._fill_lightbox = function() {
      var o = this.getLightbox();
      this.config.readonly_active && (o.style.visibility = "hidden", o.style.display = "block");
      var t = i.apply(this, arguments);
      if (this.config.readonly_active && (o.style.visibility = "", o.style.display = "none"), this.config.readonly_active) {
        var n = this.getLightbox(), s = this._lightbox_r = n.cloneNode(!0);
        s.id = e.uid(), s.className += " dhx_cal_light_readonly", d("textarea", n, s, function(c) {
          return c.value;
        }), d("input", n, s, !1), d("select", n, s, function(c) {
          return c.options.length ? c.options[Math.max(c.selectedIndex || 0, 0)].text : "";
        }), n.parentNode.insertBefore(s, n), this.showCover(s), e._lightbox && e._lightbox.parentNode.removeChild(e._lightbox), this._lightbox = s, e.config.drag_lightbox && e.event(s.firstChild, "mousedown", e._ready_to_dnd), e._init_lightbox_events(), this.setLightboxSize();
      }
      return t;
    };
    var _ = e.hide_lightbox;
    e.hide_lightbox = function() {
      return this._lightbox_r && (this._lightbox_r.parentNode.removeChild(this._lightbox_r), this._lightbox_r = this._lightbox = null), _.apply(this, arguments);
    };
  });
}, recurring: function(e) {
  function h() {
    var i = e.formSection("recurring");
    if (i || (i = a("recurring")), !i)
      throw new Error(["Can't locate the Recurring form section.", "Make sure that you have the recurring control on the lightbox configuration https://docs.dhtmlx.com/scheduler/recurring_events.html#recurringlightbox ", 'and that the recurring control has name "recurring":', "", "scheduler.config.lightbox.sections = [", '	{name:"recurring", ... }', "];"].join(`
`));
    return i;
  }
  function a(i) {
    for (var _ = 0; _ < e.config.lightbox.sections.length; _++) {
      var o = e.config.lightbox.sections[_];
      if (o.type === i)
        return e.formSection(o.name);
    }
    return null;
  }
  function r(i) {
    return new Date(i.getFullYear(), i.getMonth(), i.getDate(), i.getHours(), i.getMinutes(), i.getSeconds(), 0);
  }
  var d;
  e.config.occurrence_timestamp_in_utc = !1, e.config.recurring_workdays = [1, 2, 3, 4, 5], e.form_blocks.recurring = { _get_node: function(i) {
    if (typeof i == "string") {
      let _ = e._lightbox.querySelector(`#${i}`);
      _ || (_ = document.getElementById(i)), i = _;
    }
    return i.style.display == "none" && (i.style.display = ""), i;
  }, _outer_html: function(i) {
    return i.outerHTML || (_ = i, (t = document.createElement("div")).appendChild(_.cloneNode(!0)), o = t.innerHTML, t = null, o);
    var _, o, t;
  }, render: function(i) {
    if (i.form) {
      var _ = e.form_blocks.recurring, o = _._get_node(i.form), t = _._outer_html(o);
      return o.style.display = "none", t;
    }
    var n = e.locale.labels;
    return '<div class="dhx_form_repeat"> <form> <div class="dhx_repeat_left"> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="day" />' + n.repeat_radio_day + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="week"/>' + n.repeat_radio_week + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="month" checked />' + n.repeat_radio_month + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="year" />' + n.repeat_radio_year + '</label></div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_center"> <div style="display:none;" id="dhx_repeat_day"> <div><label><input class="dhx_repeat_radio" type="radio" name="day_type" value="d"/>' + n.repeat_radio_day_type + '</label><label><input class="dhx_repeat_text" type="text" name="day_count" value="1" />' + n.repeat_text_day_count + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="day_type" checked value="w"/>' + n.repeat_radio_day_type2 + '</label></div> </div> <div style="display:none;" id="dhx_repeat_week"><div><label>' + n.repeat_week + '<input class="dhx_repeat_text" type="text" name="week_count" value="1" /></label><span>' + n.repeat_text_week_count + '</span></div>  <table class="dhx_repeat_days"> <tr> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="1" />' + n.day_for_recurring[1] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="4" />' + n.day_for_recurring[4] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="2" />' + n.day_for_recurring[2] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="5" />' + n.day_for_recurring[5] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="3" />' + n.day_for_recurring[3] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="6" />' + n.day_for_recurring[6] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="0" />' + n.day_for_recurring[0] + '</label></div> </td> </tr> </table> </div> <div id="dhx_repeat_month"> <div><label class = "dhx_repeat_month_label"><input class="dhx_repeat_radio" type="radio" name="month_type" value="d"/>' + n.repeat_radio_month_type + '</label><label><input class="dhx_repeat_text" type="text" name="month_day" value="1" />' + n.repeat_text_month_day + '</label><label><input class="dhx_repeat_text" type="text" name="month_count" value="1" />' + n.repeat_text_month_count + '</label></div> <div><label class = "dhx_repeat_month_label"><input class="dhx_repeat_radio" type="radio" name="month_type" checked value="w"/>' + n.repeat_radio_month_start + '</label><input class="dhx_repeat_text" type="text" name="month_week2" value="1" /><label><select name="month_day2">	<option value="1" selected >' + e.locale.date.day_full[1] + '<option value="2">' + e.locale.date.day_full[2] + '<option value="3">' + e.locale.date.day_full[3] + '<option value="4">' + e.locale.date.day_full[4] + '<option value="5">' + e.locale.date.day_full[5] + '<option value="6">' + e.locale.date.day_full[6] + '<option value="0">' + e.locale.date.day_full[0] + "</select>" + n.repeat_text_month_count2_before + '</label><label><input class="dhx_repeat_text" type="text" name="month_count2" value="1" />' + n.repeat_text_month_count2_after + '</label></div> </div> <div style="display:none;" id="dhx_repeat_year"> <div><label class = "dhx_repeat_year_label"><input class="dhx_repeat_radio" type="radio" name="year_type" value="d"/>' + n.repeat_radio_day_type + '</label><label><input class="dhx_repeat_text" type="text" name="year_day" value="1" />' + n.repeat_text_year_day + '</label><label><select name="year_month"><option value="0" selected >' + n.month_for_recurring[0] + '<option value="1">' + n.month_for_recurring[1] + '<option value="2">' + n.month_for_recurring[2] + '<option value="3">' + n.month_for_recurring[3] + '<option value="4">' + n.month_for_recurring[4] + '<option value="5">' + n.month_for_recurring[5] + '<option value="6">' + n.month_for_recurring[6] + '<option value="7">' + n.month_for_recurring[7] + '<option value="8">' + n.month_for_recurring[8] + '<option value="9">' + n.month_for_recurring[9] + '<option value="10">' + n.month_for_recurring[10] + '<option value="11">' + n.month_for_recurring[11] + "</select>" + n.select_year_month + '</label></div> <div><label class = "dhx_repeat_year_label"><input class="dhx_repeat_radio" type="radio" name="year_type" checked value="w"/>' + n.repeat_year_label + '</label><input class="dhx_repeat_text" type="text" name="year_week2" value="1" /><select name="year_day2"><option value="1" selected >' + e.locale.date.day_full[1] + '<option value="2">' + e.locale.date.day_full[2] + '<option value="3">' + e.locale.date.day_full[3] + '<option value="4">' + e.locale.date.day_full[4] + '<option value="5">' + e.locale.date.day_full[5] + '<option value="6">' + e.locale.date.day_full[6] + '<option value="7">' + e.locale.date.day_full[0] + "</select>" + n.select_year_day2 + '<select name="year_month2"><option value="0" selected >' + n.month_for_recurring[0] + '<option value="1">' + n.month_for_recurring[1] + '<option value="2">' + n.month_for_recurring[2] + '<option value="3">' + n.month_for_recurring[3] + '<option value="4">' + n.month_for_recurring[4] + '<option value="5">' + n.month_for_recurring[5] + '<option value="6">' + n.month_for_recurring[6] + '<option value="7">' + n.month_for_recurring[7] + '<option value="8">' + n.month_for_recurring[8] + '<option value="9">' + n.month_for_recurring[9] + '<option value="10">' + n.month_for_recurring[10] + '<option value="11">' + n.month_for_recurring[11] + '</select></div> </div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_right"> <div><label><input class="dhx_repeat_radio" type="radio" name="end" checked/>' + n.repeat_radio_end + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="end" />' + n.repeat_radio_end2 + '</label><input class="dhx_repeat_text" type="text" name="occurences_count" value="1" />' + n.repeat_text_occurences_count + '</div> <div><label><input class="dhx_repeat_radio" type="radio" name="end" />' + n.repeat_radio_end3 + '</label><input class="dhx_repeat_date" type="text" name="date_of_end" value="' + e.config.repeat_date_of_end + '" /></div> </div> </form> </div> </div>';
  }, _ds: {}, _get_form_node: function(i, _, o) {
    var t = i[_];
    if (!t)
      return null;
    if (t.nodeName)
      return t;
    if (t.length) {
      for (var n = 0; n < t.length; n++)
        if (t[n].value == o)
          return t[n];
    }
  }, _get_node_value: function(i, _, o) {
    var t = i[_];
    if (!t)
      return "";
    if (t.length) {
      if (o) {
        for (var n = [], s = 0; s < t.length; s++)
          t[s].checked && n.push(t[s].value);
        return n;
      }
      for (s = 0; s < t.length; s++)
        if (t[s].checked)
          return t[s].value;
    }
    return t.value ? o ? [t.value] : t.value : void 0;
  }, _get_node_numeric_value: function(i, _) {
    return 1 * e.form_blocks.recurring._get_node_value(i, _) || 0;
  }, _set_node_value: function(i, _, o) {
    var t = i[_];
    if (t) {
      if (t.name == _)
        t.value = o;
      else if (t.length)
        for (var n = typeof o == "object", s = 0; s < t.length; s++)
          (n || t[s].value == o) && (t[s].checked = n ? !!o[t[s].value] : !!o);
    }
  }, _init_set_value: function(i, _, o) {
    var t = e.form_blocks.recurring, n = t._get_node_value, s = t._set_node_value;
    e.form_blocks.recurring._ds = { start: o.start_date, end: o._end_date };
    var c = e.date.str_to_date(e.config.repeat_date, !1, !0), u = e.date.date_to_str(e.config.repeat_date), v = i.getElementsByTagName("FORM")[0], m = {};
    function l(D) {
      for (var x = 0; x < D.length; x++) {
        var S = D[x];
        if (S.name)
          if (m[S.name])
            if (m[S.name].nodeType) {
              var N = m[S.name];
              m[S.name] = [N, S];
            } else
              m[S.name].push(S);
          else
            m[S.name] = S;
      }
    }
    if (l(v.getElementsByTagName("INPUT")), l(v.getElementsByTagName("SELECT")), !e.config.repeat_date_of_end) {
      var f = e.date.date_to_str(e.config.repeat_date);
      e.config.repeat_date_of_end = f(e.date.add(e._currentDate(), 30, "day"));
    }
    s(m, "date_of_end", e.config.repeat_date_of_end);
    var g = function(D) {
      return e._lightbox.querySelector(`#${D}`) || { style: {} };
    };
    function p() {
      g("dhx_repeat_day").style.display = "none", g("dhx_repeat_week").style.display = "none", g("dhx_repeat_month").style.display = "none", g("dhx_repeat_year").style.display = "none", g("dhx_repeat_" + this.value).style.display = "", e.setLightboxSize();
    }
    function y(D, x) {
      var S = D.end;
      if (S.length)
        if (S[0].value && S[0].value != "on")
          for (var N = 0; N < S.length; N++)
            S[N].value == x && (S[N].checked = !0);
        else {
          var M = 0;
          switch (x) {
            case "no":
              M = 0;
              break;
            case "date_of_end":
              M = 2;
              break;
            default:
              M = 1;
          }
          S[M].checked = !0;
        }
      else
        S.value = x;
    }
    e.form_blocks.recurring._get_repeat_code = function(D) {
      var x = [n(m, "repeat")];
      for (w[x[0]](x, D); x.length < 5; )
        x.push("");
      var S = "", N = function(M) {
        var A = M.end;
        if (A.length) {
          for (var C = 0; C < A.length; C++)
            if (A[C].checked)
              return A[C].value && A[C].value != "on" ? A[C].value : C ? C == 2 ? "date_of_end" : "occurences_count" : "no";
        } else if (A.value)
          return A.value;
        return "no";
      }(m);
      return N == "no" ? (D.end = new Date(9999, 1, 1), S = "no") : N == "date_of_end" ? D.end = function(M) {
        var A = c(M);
        return e.config.include_end_by && (A = e.date.add(A, 1, "day")), A;
      }(n(m, "date_of_end")) : (e.transpose_type(x.join("_")), S = Math.max(1, n(m, "occurences_count")), D.end = e.date["add_" + x.join("_")](new Date(D.start), S + 0, { start_date: D.start }) || D.start), x.join("_") + "#" + S;
    };
    var w = { month: function(D, x) {
      var S = e.form_blocks.recurring._get_node_value, N = e.form_blocks.recurring._get_node_numeric_value;
      S(m, "month_type") == "d" ? (D.push(Math.max(1, N(m, "month_count"))), x.start.setDate(S(m, "month_day"))) : (D.push(Math.max(1, N(m, "month_count2"))), D.push(S(m, "month_day2")), D.push(Math.max(1, N(m, "month_week2"))), e.config.repeat_precise || x.start.setDate(1)), x._start = !0;
    }, week: function(D, x) {
      var S = e.form_blocks.recurring._get_node_value, N = e.form_blocks.recurring._get_node_numeric_value;
      D.push(Math.max(1, N(m, "week_count"))), D.push(""), D.push("");
      for (var M = [], A = S(m, "week_day", !0), C = x.start.getDay(), T = !1, O = 0; O < A.length; O++)
        M.push(A[O]), T = T || A[O] == C;
      M.length || (M.push(C), T = !0), M.sort(), e.config.repeat_precise ? T || (e.transpose_day_week(x.start, M, 1, 7), x._start = !0) : (x.start = e.date.week_start(x.start), x._start = !0), D.push(M.join(","));
    }, day: function(D) {
      var x = e.form_blocks.recurring._get_node_value, S = e.form_blocks.recurring._get_node_numeric_value;
      x(m, "day_type") == "d" ? D.push(Math.max(1, S(m, "day_count"))) : (D.push("week"), D.push(1), D.push(""), D.push(""), D.push(e.config.recurring_workdays.join(",")), D.splice(0, 1));
    }, year: function(D, x) {
      var S = e.form_blocks.recurring._get_node_value;
      S(m, "year_type") == "d" ? (D.push("1"), x.start.setMonth(0), x.start.setDate(S(m, "year_day")), x.start.setMonth(S(m, "year_month"))) : (D.push("1"), D.push(S(m, "year_day2")), D.push(S(m, "year_week2")), x.start.setDate(1), x.start.setMonth(S(m, "year_month2"))), x._start = !0;
    } }, b = { week: function(D, x) {
      var S = e.form_blocks.recurring._set_node_value;
      S(m, "week_count", D[1]);
      for (var N = D[4].split(","), M = {}, A = 0; A < N.length; A++)
        M[N[A]] = !0;
      S(m, "week_day", M);
    }, month: function(D, x) {
      var S = e.form_blocks.recurring._set_node_value;
      D[2] === "" ? (S(m, "month_type", "d"), S(m, "month_count", D[1]), S(m, "month_day", x.start.getDate())) : (S(m, "month_type", "w"), S(m, "month_count2", D[1]), S(m, "month_week2", D[3]), S(m, "month_day2", D[2]));
    }, day: function(D, x) {
      var S = e.form_blocks.recurring._set_node_value;
      S(m, "day_type", "d"), S(m, "day_count", D[1]);
    }, year: function(D, x) {
      var S = e.form_blocks.recurring._set_node_value;
      D[2] === "" ? (S(m, "year_type", "d"), S(m, "year_day", x.start.getDate()), S(m, "year_month", x.start.getMonth())) : (S(m, "year_type", "w"), S(m, "year_week2", D[3]), S(m, "year_day2", D[2]), S(m, "year_month2", x.start.getMonth()));
    } };
    e.form_blocks.recurring._set_repeat_code = function(D, x) {
      var S = e.form_blocks.recurring._set_node_value, N = D.split("#");
      switch (D = N[0].split("_"), b[D[0]](D, x), N[1]) {
        case "no":
          y(m, "no");
          break;
        case "":
          y(m, "date_of_end");
          var M = x.end;
          e.config.include_end_by && (M = e.date.add(M, -1, "day")), S(m, "date_of_end", u(M));
          break;
        default:
          y(m, "occurences_count"), S(m, "occurences_count", N[1]);
      }
      S(m, "repeat", D[0]);
      var A = e.form_blocks.recurring._get_form_node(m, "repeat", D[0]);
      A.nodeName == "SELECT" ? (A.dispatchEvent(new Event("change")), A.dispatchEvent(new MouseEvent("click"))) : A.dispatchEvent(new MouseEvent("click"));
    };
    for (var k = 0; k < v.elements.length; k++) {
      var E = v.elements[k];
      E.name === "repeat" && (E.nodeName != "SELECT" || E.$_eventAttached ? E.$_eventAttached || (E.$_eventAttached = !0, E.addEventListener("click", p)) : (E.$_eventAttached = !0, E.addEventListener("change", p)));
    }
    e._lightbox._rec_init_done = !0;
  }, set_value: function(i, _, o) {
    var t = e.form_blocks.recurring;
    e._lightbox._rec_init_done || t._init_set_value(i, _, o), i.open = !o.rec_type, i.blocked = this._is_modified_occurence(o);
    var n = t._ds;
    n.start = o.start_date, n.end = o._end_date, t._toggle_block(), _ && t._set_repeat_code(_, n);
  }, get_value: function(i, _) {
    if (i.open) {
      var o = e.form_blocks.recurring._ds, t = {};
      (function() {
        var n = e.formSection("time");
        if (n || (n = a("time")), n || (n = a("calendar_time")), !n)
          throw new Error(["Can't calculate the recurring rule, the Recurring form block can't find the Time control. Make sure you have the time control in 'scheduler.config.lightbox.sections' config.", "You can use either the default time control https://docs.dhtmlx.com/scheduler/time.html, or the datepicker https://docs.dhtmlx.com/scheduler/minicalendar.html, or a custom control. ", 'In the latter case, make sure the control is named "time":', "", "scheduler.config.lightbox.sections = [", '{name:"time", height:72, type:"YOU CONTROL", map_to:"auto" }];'].join(`
`));
        return n;
      })().getValue(t), o.start = t.start_date, _.rec_type = e.form_blocks.recurring._get_repeat_code(o), o._start ? (_.start_date = new Date(o.start), _._start_date = new Date(o.start), o._start = !1) : _._start_date = null, _._end_date = o.end, _.rec_pattern = _.rec_type.split("#")[0];
    } else
      _.rec_type = _.rec_pattern = "", _._end_date = _.end_date;
    return _.rec_type;
  }, _get_button: function() {
    return h().header.firstChild.firstChild;
  }, _get_form: function() {
    return h().node;
  }, open: function() {
    var i = e.form_blocks.recurring;
    i._get_form().open || i._toggle_block();
  }, close: function() {
    var i = e.form_blocks.recurring;
    i._get_form().open && i._toggle_block();
  }, _toggle_block: function() {
    var i = e.form_blocks.recurring, _ = i._get_form(), o = i._get_button();
    _.open || _.blocked ? (_.style.height = "0px", o && (o.style.backgroundPosition = "-5px 20px", o.nextSibling.innerHTML = e.locale.labels.button_recurring)) : (_.style.height = "auto", o && (o.style.backgroundPosition = "-5px 0px", o.nextSibling.innerHTML = e.locale.labels.button_recurring_open)), _.open = !_.open, e.setLightboxSize();
  }, focus: function(i) {
  }, button_click: function(i, _, o) {
    e.form_blocks.recurring._get_form().blocked || e.form_blocks.recurring._toggle_block();
  } }, e._rec_markers = {}, e._rec_markers_pull = {}, e._add_rec_marker = function(i, _) {
    i._pid_time = _, this._rec_markers[i.id] = i, this._rec_markers_pull[i.event_pid] || (this._rec_markers_pull[i.event_pid] = {}), this._rec_markers_pull[i.event_pid][_] = i;
  }, e._get_rec_marker = function(i, _) {
    var o = this._rec_markers_pull[_];
    return o ? o[i] : null;
  }, e._get_rec_markers = function(i) {
    return this._rec_markers_pull[i] || [];
  }, e._rec_temp = [], d = e.addEvent, e.addEvent = function(i, _, o, t, n) {
    var s = d.apply(this, arguments);
    if (s && e.getEvent(s)) {
      var c = e.getEvent(s);
      c.start_date && (c.start_date = r(c.start_date)), c.end_date && (c.end_date = r(c.end_date)), this._is_modified_occurence(c) && e._add_rec_marker(c, 1e3 * c.event_length), c.rec_type && (c.rec_pattern = c.rec_type.split("#")[0]);
    }
    return s;
  }, e.attachEvent("onEventIdChange", function(i, _) {
    if (!this._ignore_call) {
      this._ignore_call = !0, e._rec_markers[i] && (e._rec_markers[_] = e._rec_markers[i], delete e._rec_markers[i]), e._rec_markers_pull[i] && (e._rec_markers_pull[_] = e._rec_markers_pull[i], delete e._rec_markers_pull[i]);
      for (var o = 0; o < this._rec_temp.length; o++)
        (t = this._rec_temp[o]).event_pid == i && (t.event_pid = _, this.changeEventId(t.id, _ + "#" + t.id.split("#")[1]));
      for (var o in this._rec_markers) {
        var t;
        (t = this._rec_markers[o]).event_pid == i && (t.event_pid = _, t._pid_changed = !0);
      }
      var n = e._rec_markers[_];
      n && n._pid_changed && (delete n._pid_changed, setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.callEvent("onEventChanged", [_, e.getEvent(_)]);
      }, 1)), delete this._ignore_call;
    }
  }), e.attachEvent("onConfirmedBeforeEventDelete", function(i) {
    var _ = this.getEvent(i);
    if (this._is_virtual_event(i) || this._is_modified_occurence(_) && _.rec_type && _.rec_type != "none") {
      i = i.split("#");
      var o = this.uid(), t = i[1] ? i[1] : Math.round(_._pid_time / 1e3), n = this._copy_event(_);
      n.id = o, n.event_pid = _.event_pid || i[0];
      var s = t;
      n.event_length = s, n.rec_type = n.rec_pattern = "none", this.addEvent(n), this._add_rec_marker(n, 1e3 * s);
    } else {
      _.rec_type && this._lightbox_id && this._roll_back_dates(_);
      var c = this._get_rec_markers(i);
      for (var u in c)
        c.hasOwnProperty(u) && (i = c[u].id, this.getEvent(i) && this.deleteEvent(i, !0));
    }
    return !0;
  }), e.attachEvent("onEventDeleted", function(i, _) {
    !this._is_virtual_event(i) && this._is_modified_occurence(_) && (e._events[i] || (_.rec_type = _.rec_pattern = "none", this.setEvent(i, _)));
  }), e.attachEvent("onEventChanged", function(i, _) {
    if (this._loading)
      return !0;
    var o = this.getEvent(i);
    if (this._is_virtual_event(i)) {
      i = i.split("#");
      var t = this.uid();
      this._not_render = !0;
      var n = this._copy_event(_);
      n.id = t, n.event_pid = i[0];
      var s = i[1];
      n.event_length = s, n.rec_type = n.rec_pattern = "", this._add_rec_marker(n, 1e3 * s), this.addEvent(n), this._not_render = !1;
    } else {
      o.start_date && (o.start_date = r(o.start_date)), o.end_date && (o.end_date = r(o.end_date)), o.rec_type && this._lightbox_id && this._roll_back_dates(o);
      var c = this._get_rec_markers(i);
      for (var u in c)
        c.hasOwnProperty(u) && (delete this._rec_markers[c[u].id], this.deleteEvent(c[u].id, !0));
      delete this._rec_markers_pull[i];
      for (var v = !1, m = 0; m < this._rendered.length; m++)
        this._rendered[m].getAttribute(this.config.event_attribute) == i && (v = !0);
      v || (this._select_id = null);
    }
    return !0;
  }), e.attachEvent("onEventAdded", function(i) {
    if (!this._loading) {
      var _ = this.getEvent(i);
      _.rec_type && !_.event_length && this._roll_back_dates(_);
    }
    return !0;
  }), e.attachEvent("onEventSave", function(i, _, o) {
    return this.getEvent(i).rec_type || !_.rec_type || this._is_virtual_event(i) || (this._select_id = null), !0;
  }), e.attachEvent("onEventCreated", function(i) {
    var _ = this.getEvent(i);
    return _.rec_type || (_.rec_type = _.rec_pattern = _.event_length = _.event_pid = ""), !0;
  }), e.attachEvent("onEventCancel", function(i) {
    var _ = this.getEvent(i);
    _.rec_type && (this._roll_back_dates(_), this.render_view_data());
  }), e._roll_back_dates = function(i) {
    i.start_date && (i.start_date = r(i.start_date)), i.end_date && (i.end_date = r(i.end_date)), i.event_length = Math.round((i.end_date.valueOf() - i.start_date.valueOf()) / 1e3), i.end_date = i._end_date, i._start_date && (i.start_date.setMonth(0), i.start_date.setDate(i._start_date.getDate()), i.start_date.setMonth(i._start_date.getMonth()), i.start_date.setFullYear(i._start_date.getFullYear()));
  }, e._is_virtual_event = function(i) {
    return i.toString().indexOf("#") != -1;
  }, e._is_modified_occurence = function(i) {
    return i.event_pid && i.event_pid != "0";
  }, e.showLightbox_rec = e.showLightbox, e.showLightbox = function(i) {
    var _ = this.locale, o = e.config.lightbox_recurring, t = this.getEvent(i), n = t.event_pid, s = this._is_virtual_event(i);
    s && (n = i.split("#")[0]);
    var c = function(v) {
      var m = e.getEvent(v);
      return m._end_date = m.end_date, m.end_date = new Date(m.start_date.valueOf() + 1e3 * m.event_length), e.showLightbox_rec(v);
    };
    if ((n || 1 * n == 0) && t.rec_type)
      return c(i);
    if (!n || n === "0" || !_.labels.confirm_recurring || o == "instance" || o == "series" && !s)
      return this.showLightbox_rec(i);
    if (o == "ask") {
      var u = this;
      e.modalbox({ text: _.labels.confirm_recurring, title: _.labels.title_confirm_recurring, width: "500px", position: "middle", buttons: [_.labels.button_edit_series, _.labels.button_edit_occurrence, _.labels.icon_cancel], callback: function(v) {
        switch (+v) {
          case 0:
            return c(n);
          case 1:
            return u.showLightbox_rec(i);
          case 2:
            return;
        }
      } });
    } else
      c(n);
  }, e.get_visible_events_rec = e.get_visible_events, e.get_visible_events = function(i) {
    for (var _ = 0; _ < this._rec_temp.length; _++)
      delete this._events[this._rec_temp[_].id];
    this._rec_temp = [];
    var o = this.get_visible_events_rec(i), t = [];
    for (_ = 0; _ < o.length; _++)
      o[_].rec_type ? o[_].rec_pattern != "none" && this.repeat_date(o[_], t) : t.push(o[_]);
    return t;
  }, function() {
    var i = e.isOneDayEvent;
    e.isOneDayEvent = function(o) {
      return !!o.rec_type || i.call(this, o);
    };
    var _ = e.updateEvent;
    e.updateEvent = function(o) {
      var t = e.getEvent(o);
      t && t.rec_type && (t.rec_pattern = (t.rec_type || "").split("#")[0]), t && t.rec_type && !this._is_virtual_event(o) ? e.update_view() : _.call(this, o);
    };
  }(), e.transponse_size = { day: 1, week: 7, month: 1, year: 12 }, e.date.day_week = function(i, _, o) {
    i.setDate(1);
    var t = e.date.month_start(new Date(i)), n = 1 * _ + (o = 7 * (o - 1)) - i.getDay() + 1;
    i.setDate(n <= o ? n + 7 : n);
    var s = e.date.month_start(new Date(i));
    return t.valueOf() === s.valueOf();
  }, e.transpose_day_week = function(i, _, o, t, n) {
    for (var s = (i.getDay() || (e.config.start_on_monday ? 7 : 0)) - o, c = 0; c < _.length; c++)
      if (_[c] > s)
        return i.setDate(i.getDate() + 1 * _[c] - s - (t ? o : n));
    this.transpose_day_week(i, _, o + t, null, o);
  }, e.transpose_type = function(i) {
    var _ = "transpose_" + i;
    if (!this.date[_]) {
      var o = i.split("_"), t = "add_" + i, n = this.transponse_size[o[0]] * o[1];
      if (o[0] == "day" || o[0] == "week") {
        var s = null;
        if (o[4] && (s = o[4].split(","), e.config.start_on_monday)) {
          for (var c = 0; c < s.length; c++)
            s[c] = 1 * s[c] || 7;
          s.sort();
        }
        this.date[_] = function(u, v) {
          var m = Math.floor((v.valueOf() - u.valueOf()) / (864e5 * n));
          return m > 0 && u.setDate(u.getDate() + m * n), s && e.transpose_day_week(u, s, 1, n), u;
        }, this.date[t] = function(u, v) {
          var m = new Date(u.valueOf());
          if (s)
            for (var l = 0; l < v; l++)
              e.transpose_day_week(m, s, 0, n);
          else
            m.setDate(m.getDate() + v * n);
          return m;
        };
      } else
        o[0] != "month" && o[0] != "year" || (this.date[_] = function(u, v, m) {
          var l = Math.ceil((12 * v.getFullYear() + 1 * v.getMonth() + 1 - (12 * u.getFullYear() + 1 * u.getMonth() + 1)) / n - 1);
          return l >= 0 && (u.setDate(1), u.setMonth(u.getMonth() + l * n)), e.date[t](u, 0, m);
        }, this.date[t] = function(u, v, m, l) {
          if (l ? l++ : l = 1, l > 12)
            return null;
          var f = new Date(u.valueOf());
          f.setDate(1), f.setMonth(f.getMonth() + v * n);
          var g = f.getMonth(), p = f.getFullYear();
          f.setDate(m.start_date.getDate()), o[3] && e.date.day_week(f, o[2], o[3]);
          var y = e.config.recurring_overflow_instances;
          return f.getMonth() != g && y != "none" && (f = y === "lastDay" ? new Date(p, g + 1, 0, f.getHours(), f.getMinutes(), f.getSeconds(), f.getMilliseconds()) : e.date[t](new Date(p, g + 1, 0), v || 1, m, l)), f;
        });
    }
  }, e.repeat_date = function(i, _, o, t, n, s) {
    t = t || this._min_date, n = n || this._max_date;
    var c = s || -1, u = new Date(i.start_date.valueOf()), v = u.getHours(), m = 0;
    for (!i.rec_pattern && i.rec_type && (i.rec_pattern = i.rec_type.split("#")[0]), this.transpose_type(i.rec_pattern), u = e.date["transpose_" + i.rec_pattern](u, t, i); u && (u < i.start_date || e._fix_daylight_saving_date(u, t, i, u, new Date(u.valueOf() + 1e3 * i.event_length)).valueOf() <= t.valueOf() || u.valueOf() + 1e3 * i.event_length <= t.valueOf()); )
      u = this.date["add_" + i.rec_pattern](u, 1, i);
    for (; u && u < n && u < i.end_date && (c < 0 || m < c); ) {
      u.setHours(v);
      var l = e.config.occurrence_timestamp_in_utc ? Date.UTC(u.getFullYear(), u.getMonth(), u.getDate(), u.getHours(), u.getMinutes(), u.getSeconds()) : u.valueOf(), f = this._get_rec_marker(l, i.id);
      if (f)
        o && (f.rec_type != "none" && m++, _.push(f));
      else {
        var g = new Date(u.valueOf() + 1e3 * i.event_length), p = this._copy_event(i);
        if (p.text = i.text, p.start_date = u, p.event_pid = i.id, p.id = i.id + "#" + Math.round(l / 1e3), p.end_date = g, p.end_date = e._fix_daylight_saving_date(p.start_date, p.end_date, i, u, p.end_date), p._timed = this.isOneDayEvent(p), !p._timed && !this._table_view && !this.config.multi_day)
          return;
        _.push(p), o || (this._events[p.id] = p, this._rec_temp.push(p)), m++;
      }
      u = this.date["add_" + i.rec_pattern](u, 1, i);
    }
  }, e._fix_daylight_saving_date = function(i, _, o, t, n) {
    var s = i.getTimezoneOffset() - _.getTimezoneOffset();
    return s ? s > 0 ? new Date(t.valueOf() + 1e3 * o.event_length - 60 * s * 1e3) : new Date(_.valueOf() - 60 * s * 1e3) : new Date(n.valueOf());
  }, e.getRecDates = function(i, _) {
    var o = typeof i == "object" ? i : e.getEvent(i), t = [];
    if (_ = _ || 100, !o.rec_type)
      return [{ start_date: o.start_date, end_date: o.end_date }];
    if (o.rec_type == "none")
      return [];
    e.repeat_date(o, t, !0, o.start_date, o.end_date, _);
    for (var n = [], s = 0; s < t.length; s++)
      t[s].rec_type != "none" && n.push({ start_date: t[s].start_date, end_date: t[s].end_date });
    return n;
  }, e.getEvents = function(i, _) {
    var o = [];
    for (var t in this._events) {
      var n = this._events[t];
      if (n && n.start_date < _ && n.end_date > i)
        if (n.rec_pattern) {
          if (n.rec_pattern == "none")
            continue;
          var s = [];
          this.repeat_date(n, s, !0, i, _);
          for (var c = 0; c < s.length; c++)
            !s[c].rec_pattern && s[c].start_date < _ && s[c].end_date > i && !this._rec_markers[s[c].id] && o.push(s[c]);
        } else
          this._is_virtual_event(n.id) || o.push(n);
    }
    return o;
  }, e.config.repeat_date = "%m.%d.%Y", e.config.lightbox.sections = [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "recurring", type: "recurring", map_to: "rec_type", button: "recurring" }, { name: "time", height: 72, type: "time", map_to: "auto" }], e._copy_dummy = function(i) {
    var _ = new Date(this.start_date), o = new Date(this.end_date);
    this.start_date = _, this.end_date = o, this.event_length = this.event_pid = this.rec_pattern = this.rec_type = null;
  }, e.config.include_end_by = !1, e.config.lightbox_recurring = "ask", e.attachEvent("onClearAll", function() {
    e._rec_markers = {}, e._rec_markers_pull = {}, e._rec_temp = [];
  });
}, serialize: function(e) {
  const h = oe(e);
  e.data_attributes = function() {
    var a = [], r = e._helpers.formatDate, d = h();
    for (var i in d) {
      var _ = d[i];
      for (var o in _)
        o.substr(0, 1) != "_" && a.push([o, o == "start_date" || o == "end_date" ? r : null]);
      break;
    }
    return a;
  }, e.toXML = function(a) {
    var r = [], d = this.data_attributes(), i = h();
    for (var _ in i) {
      var o = i[_];
      r.push("<event>");
      for (var t = 0; t < d.length; t++)
        r.push("<" + d[t][0] + "><![CDATA[" + (d[t][1] ? d[t][1](o[d[t][0]]) : o[d[t][0]]) + "]]></" + d[t][0] + ">");
      r.push("</event>");
    }
    return (a || "") + "<data>" + r.join(`
`) + "</data>";
  }, e._serialize_json_value = function(a) {
    return a === null || typeof a == "boolean" ? a = "" + a : (a || a === 0 || (a = ""), a = '"' + a.toString().replace(/\n/g, "").replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'), a;
  }, e.toJSON = function() {
    return JSON.stringify(this.serialize());
  }, e.toICal = function(a) {
    var r = e.date.date_to_str("%Y%m%dT%H%i%s"), d = e.date.date_to_str("%Y%m%d"), i = [], _ = h();
    for (var o in _) {
      var t = _[o];
      i.push("BEGIN:VEVENT"), t._timed && (t.start_date.getHours() || t.start_date.getMinutes()) ? i.push("DTSTART:" + r(t.start_date)) : i.push("DTSTART:" + d(t.start_date)), t._timed && (t.end_date.getHours() || t.end_date.getMinutes()) ? i.push("DTEND:" + r(t.end_date)) : i.push("DTEND:" + d(t.end_date)), i.push("SUMMARY:" + t.text), i.push("END:VEVENT");
    }
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//dhtmlXScheduler//NONSGML v2.2//EN
DESCRIPTION:` + (a || "") + `
` + i.join(`
`) + `
END:VCALENDAR`;
  };
}, timeline: function(e) {
  R("Timeline", e.assert);
}, tooltip: function(e) {
  e.config.tooltip_timeout = 30, e.config.tooltip_offset_y = 20, e.config.tooltip_offset_x = 10, e.config.tooltip_hide_timeout = 30;
  const h = new _t(e);
  e.ext.tooltips = h, e.attachEvent("onSchedulerReady", function() {
    h.tooltipFor({ selector: "[" + e.config.event_attribute + "]", html: (a) => {
      if (e._mobile && !e.config.touch_tooltip)
        return;
      const r = e._locate_event(a.target);
      if (e.getEvent(r)) {
        const d = e.getEvent(r);
        return e.templates.tooltip_text(d.start_date, d.end_date, d);
      }
      return null;
    }, global: !1 });
  }), e.attachEvent("onDestroy", function() {
    h.destructor();
  }), e.attachEvent("onLightbox", function() {
    h.hideTooltip();
  }), e.attachEvent("onBeforeDrag", function() {
    return h.hideTooltip(), !0;
  }), e.attachEvent("onEventDeleted", function() {
    return h.hideTooltip(), !0;
  });
}, treetimeline: function(e) {
  R("Tree Timeline", e.assert);
}, units: function(e) {
  R("Units", e.assert);
}, url: function(e) {
  e._get_url_nav = function() {
    for (var h = {}, a = (document.location.hash || "").replace("#", "").split(","), r = 0; r < a.length; r++) {
      var d = a[r].split("=");
      d.length == 2 && (h[d[0]] = d[1]);
    }
    return h;
  }, e.attachEvent("onTemplatesReady", function() {
    var h = !0, a = e.date.str_to_date("%Y-%m-%d"), r = e.date.date_to_str("%Y-%m-%d"), d = e._get_url_nav().event || null;
    function i(_) {
      if (e.$destroyed)
        return !0;
      d = _, e.getEvent(_) && e.showEvent(_);
    }
    e.attachEvent("onAfterEventDisplay", function(_) {
      return d = null, !0;
    }), e.attachEvent("onBeforeViewChange", function(_, o, t, n) {
      if (h) {
        h = !1;
        var s = e._get_url_nav();
        if (s.event)
          try {
            if (e.getEvent(s.event))
              return setTimeout(function() {
                i(s.event);
              }), !1;
            var c = e.attachEvent("onXLE", function() {
              setTimeout(function() {
                i(s.event);
              }), e.detachEvent(c);
            });
          } catch {
          }
        if (s.date || s.mode) {
          try {
            this.setCurrentView(s.date ? a(s.date) : null, s.mode || null);
          } catch {
            this.setCurrentView(s.date ? a(s.date) : null, t);
          }
          return !1;
        }
      }
      var u = ["date=" + r(n || o), "mode=" + (t || _)];
      d && u.push("event=" + d);
      var v = "#" + u.join(",");
      return document.location.hash = v, !0;
    });
  });
}, week_agenda: function(e) {
  R("Week Agenda", e.assert);
}, wp: function(e) {
  e.attachEvent("onLightBox", function() {
    if (this._cover)
      try {
        this._cover.style.height = this.expanded ? "100%" : (document.body.parentNode || document.body).scrollHeight + "px";
      } catch {
      }
  }), e.form_blocks.select.set_value = function(h, a, r) {
    a !== void 0 && a !== "" || (a = (h.firstChild.options[0] || {}).value), h.firstChild.value = a || "";
  };
}, year_view: function(e) {
  e.templates.year_date = function(o) {
    return e.date.date_to_str(e.locale.labels.year_tab + " %Y")(o);
  }, e.templates.year_month = e.date.date_to_str("%F"), e.templates.year_scale_date = e.date.date_to_str("%D"), e.templates.year_tooltip = function(o, t, n) {
    return n.text;
  };
  const h = function() {
    return e._mode == "year";
  }, a = function(o) {
    var t = e.$domHelpers.closest(o, "[data-cell-date]");
    return t && t.hasAttribute("data-cell-date") ? e.templates.parse_date(t.getAttribute("data-cell-date")) : null;
  };
  e.dblclick_dhx_month_head = function(o) {
    if (h()) {
      const t = o.target;
      if (e.$domHelpers.closest(t, ".dhx_before") || e.$domHelpers.closest(t, ".dhx_after"))
        return !1;
      const n = a(t);
      if (n) {
        const s = n, c = this.date.add(s, 1, "day");
        !this.config.readonly && this.config.dblclick_create && this.addEventNow(s.valueOf(), c.valueOf(), o);
      }
    }
  }, e.attachEvent("onEventIdChange", function() {
    h() && this.year_view(!0);
  });
  var r = e.render_data;
  e.render_data = function(o) {
    if (!h())
      return r.apply(this, arguments);
    for (var t = 0; t < o.length; t++)
      this._year_render_event(o[t]);
  };
  var d = e.clear_view;
  e.clear_view = function() {
    if (!h())
      return d.apply(this, arguments);
    var o = e._year_marked_cells;
    for (var t in o)
      o.hasOwnProperty(t) && o[t].classList.remove("dhx_year_event", "dhx_cal_datepicker_event");
    e._year_marked_cells = {};
  }, e._hideToolTip = function() {
    this._tooltip && (this._tooltip.style.display = "none", this._tooltip.date = new Date(9999, 1, 1));
  }, e._showToolTip = function(o, t, n, s) {
    if (this._tooltip) {
      if (this._tooltip.date.valueOf() == o.valueOf())
        return;
      this._tooltip.innerHTML = "";
    } else {
      var c = this._tooltip = document.createElement("div");
      c.className = "dhx_year_tooltip", this.config.rtl && (c.className += " dhx_tooltip_rtl"), document.body.appendChild(c), c.addEventListener("click", e._click.dhx_cal_data), c.addEventListener("click", function(p) {
        if (p.target.closest(`[${e.config.event_attribute}]`)) {
          const y = p.target.closest(`[${e.config.event_attribute}]`).getAttribute(e.config.event_attribute);
          e.showLightbox(y);
        }
      });
    }
    for (var u = this.getEvents(o, this.date.add(o, 1, "day")), v = "", m = 0; m < u.length; m++) {
      var l = u[m];
      if (this.filter_event(l.id, l)) {
        var f = l.color ? "--dhx-scheduler-event-background:" + l.color + ";" : "", g = l.textColor ? "--dhx-scheduler-event-color:" + l.textColor + ";" : "";
        v += "<div class='dhx_tooltip_line' style='" + f + g + "' event_id='" + u[m].id + "' " + this.config.event_attribute + "='" + u[m].id + "'>", v += "<div class='dhx_tooltip_date' style='" + f + g + "'>" + (u[m]._timed ? this.templates.event_date(u[m].start_date) : "") + "</div>", v += "<div class='dhx_event_icon icon_details'>&nbsp;</div>", v += this.templates.year_tooltip(u[m].start_date, u[m].end_date, u[m]) + "</div>";
      }
    }
    this._tooltip.style.display = "", this._tooltip.style.top = "0px", document.body.offsetWidth - t.left - this._tooltip.offsetWidth < 0 ? this._tooltip.style.left = t.left - this._tooltip.offsetWidth + "px" : this._tooltip.style.left = t.left + s.offsetWidth + "px", this._tooltip.date = o, this._tooltip.innerHTML = v, document.body.offsetHeight - t.top - this._tooltip.offsetHeight < 0 ? this._tooltip.style.top = t.top - this._tooltip.offsetHeight + s.offsetHeight + "px" : this._tooltip.style.top = t.top + "px";
  }, e._year_view_tooltip_handler = function(o) {
    if (h()) {
      var t = o.target || o.srcElement;
      t.tagName.toLowerCase() == "a" && (t = t.parentNode), e._getClassName(t).indexOf("dhx_year_event") != -1 ? e._showToolTip(e.templates.parse_date(t.getAttribute("data-year-date")), e.$domHelpers.getOffset(t), o, t) : e._hideToolTip();
    }
  }, e._init_year_tooltip = function() {
    e._detachDomEvent(e._els.dhx_cal_data[0], "mouseover", e._year_view_tooltip_handler), e.event(e._els.dhx_cal_data[0], "mouseover", e._year_view_tooltip_handler);
  }, e._get_year_cell = function(o) {
    for (var t = e.templates.format_date(o), n = this.$root.querySelectorAll(`.dhx_cal_data .dhx_cal_datepicker_date[data-cell-date="${t}"]`), s = 0; s < n.length; s++)
      if (!e.$domHelpers.closest(n[s], ".dhx_after, .dhx_before"))
        return n[s];
    return null;
  }, e._year_marked_cells = {}, e._mark_year_date = function(o, t) {
    var n = e.templates.format_date(o), s = this._get_year_cell(o);
    if (s) {
      var c = this.templates.event_class(t.start_date, t.end_date, t);
      e._year_marked_cells[n] || (s.classList.add("dhx_year_event", "dhx_cal_datepicker_event"), s.setAttribute("data-year-date", n), s.setAttribute("date", n), e._year_marked_cells[n] = s), c && s.classList.add(c);
    }
  }, e._unmark_year_date = function(o) {
    var t = this._get_year_cell(o);
    t && t.classList.remove("dhx_year_event", "dhx_cal_datepicker_event");
  }, e._year_render_event = function(o) {
    var t = o.start_date;
    for (t = t.valueOf() < this._min_date.valueOf() ? this._min_date : this.date.date_part(new Date(t)); t < o.end_date; )
      if (this._mark_year_date(t, o), (t = this.date.add(t, 1, "day")).valueOf() >= this._max_date.valueOf())
        return;
  }, e.year_view = function(o) {
    if (e.set_sizes(), e._table_view = o, !this._load_mode || !this._load())
      if (o) {
        if (e._init_year_tooltip(), e._reset_year_scale(), e._load_mode && e._load())
          return void (e._render_wait = !0);
        e.render_view_data();
      } else
        e._hideToolTip();
  }, e._reset_year_scale = function() {
    this._cols = [], this._colsS = {};
    var o = [], t = this._els.dhx_cal_data[0], n = this.config;
    t.scrollTop = 0, t.innerHTML = "", Math.floor((parseInt(t.style.height) - e.xy.year_top) / n.year_y);
    var s = document.createElement("div"), c = this.date.week_start(e._currentDate());
    this._process_ignores(c, 7, "day", 1);
    for (var u = 0; u < 7; u++)
      this._ignores && this._ignores[u] || (this._cols[u] = "var(--dhx-scheduler-datepicker-cell-size)", this._render_x_header(u, 0, c, s)), c = this.date.add(c, 1, "day");
    for (s.lastChild.className += " dhx_scale_bar_last", u = 0; u < s.childNodes.length; u++)
      this._waiAria.yearHeadCell(s.childNodes[u]);
    var v = this.date[this._mode + "_start"](this.date.copy(this._date)), m = v, l = null;
    const f = document.createElement("div");
    for (f.classList.add("dhx_year_wrapper"), u = 0; u < n.year_y; u++)
      for (var g = 0; g < n.year_x; g++) {
        (l = document.createElement("div")).className = "dhx_year_box", l.setAttribute("date", this._helpers.formatDate(v)), l.setAttribute("data-month-date", this._helpers.formatDate(v)), l.innerHTML = "<div class='dhx_year_month'></div><div class='dhx_year_grid'><div class='dhx_year_week'>" + s.innerHTML + "</div><div class='dhx_year_body'></div></div>";
        var p = l.querySelector(".dhx_year_month"), y = l.querySelector(".dhx_year_grid"), w = l.querySelector(".dhx_year_body"), b = e.uid();
        this._waiAria.yearHeader(p, b), this._waiAria.yearGrid(y, b), p.innerHTML = this.templates.year_month(v);
        var k = this.date.week_start(v);
        this._reset_month_scale(w, v, k, 6);
        for (var E = w.querySelectorAll("td"), D = 0; D < E.length; D++)
          this._waiAria.yearDayCell(E[D]);
        f.appendChild(l), o[u * n.year_x + g] = (v.getDay() - (this.config.start_on_monday ? 1 : 0) + 7) % 7, v = this.date.add(v, 1, "month");
      }
    t.appendChild(f);
    var x = this._getNavDateElement();
    x && (x.innerHTML = this.templates[this._mode + "_date"](m, v, this._mode)), this.week_starts = o, o._month = m.getMonth(), this._min_date = m, this._max_date = v;
  }, e._reset_year_scale = function() {
    var o = this._els.dhx_cal_data[0];
    o.scrollTop = 0, o.innerHTML = "";
    let t = this.date.year_start(new Date(this._date));
    this._min_date = this.date.week_start(new Date(t));
    const n = document.createElement("div");
    n.classList.add("dhx_year_wrapper");
    let s = t;
    for (let v = 0; v < 12; v++) {
      let m = document.createElement("div");
      m.className = "dhx_year_box", m.setAttribute("date", this._helpers.formatDate(s)), m.setAttribute("data-month-date", this._helpers.formatDate(s)), m.innerHTML = `<div class='dhx_year_month'>${this.templates.year_month(s)}</div>
			<div class='dhx_year_grid'></div>`;
      const l = m.querySelector(".dhx_year_grid"), f = e._createDatePicker(null, { date: s, minWeeks: 6 });
      f._renderDayGrid(l), f.destructor(), n.appendChild(m), s = this.date.add(s, 1, "month");
    }
    o.appendChild(n);
    let c = this.date.add(t, 1, "year");
    c.valueOf() != this.date.week_start(new Date(c)).valueOf() && (c = this.date.week_start(new Date(c)), c = this.date.add(c, 1, "week")), this._max_date = c;
    var u = this._getNavDateElement();
    u && (u.innerHTML = this.templates[this._mode + "_date"](t, c, this._mode));
  };
  var i = e.getActionData;
  e.getActionData = function(o) {
    return h() ? { date: a(o.target), section: null } : i.apply(e, arguments);
  };
  var _ = e._locate_event;
  e._locate_event = function(o) {
    var t = _.apply(e, arguments);
    if (!t) {
      var n = a(o);
      if (!n)
        return null;
      var s = e.getEvents(n, e.date.add(n, 1, "day"));
      if (!s.length)
        return null;
      t = s[0].id;
    }
    return t;
  }, e.attachEvent("onDestroy", function() {
    e._hideToolTip();
  });
} }, X = new class {
  constructor(e) {
    this._seed = 0, this._schedulerPlugins = [], this._bundledExtensions = e, this._extensionsManager = new it(e);
  }
  plugin(e) {
    this._schedulerPlugins.push(e), I.scheduler && e(I.scheduler);
  }
  getSchedulerInstance(e) {
    for (var h = nt(this._extensionsManager), a = 0; a < this._schedulerPlugins.length; a++)
      this._schedulerPlugins[a](h);
    return h._internal_id = this._seed++, this.$syncFactory && this.$syncFactory(h), e && this._initFromConfig(h, e), h;
  }
  _initFromConfig(e, h) {
    if (h.plugins && e.plugins(h.plugins), h.config && e.mixin(e.config, h.config, !0), h.templates && e.attachEvent("onTemplatesReady", function() {
      e.mixin(e.templates, h.templates, !0);
    }, { once: !0 }), h.events)
      for (const a in h.events)
        e.attachEvent(a, h.events[a]);
    h.locale && e.i18n.setLocale(h.locale), Array.isArray(h.calendars) && h.calendars.forEach(function(a) {
      e.addCalendar(a);
    }), h.container ? e.init(h.container) : e.init(), h.data && (typeof h.data == "string" ? e.load(h.data) : e.parse(h.data));
  }
}(lt), Z = X.getSchedulerInstance(), ae = { plugin: Z.bind(X.plugin, X) };
window.scheduler = Z, window.Scheduler = ae, window.$dhx || (window.$dhx = {}), window.$dhx.scheduler = Z, window.$dhx.Scheduler = ae;
export {
  ae as Scheduler,
  Z as default,
  Z as scheduler
};
//# sourceMappingURL=dhtmlxscheduler.es.js.map
