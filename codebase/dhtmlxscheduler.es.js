/** @license

dhtmlxScheduler v.7.2.1 Standard

To use dhtmlxScheduler in non-GPL projects (and get Pro version of the product), please obtain Commercial/Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxScheduler/#licensing or contact us at sales@dhtmlx.com

(c) XB Software Ltd.

*/
const de = typeof window < "u" ? window : global;
function St(e) {
  let i = [], t = !1, r = null, s = null;
  function n() {
    return e.config.drag_highlight && e.markTimespan;
  }
  function o(d) {
    const l = e.getView(d);
    return l ? l.layout : d;
  }
  function _(d) {
    const { event: l, layout: c, viewName: f, sectionId: v, eventNode: p } = d;
    (function(m, y) {
      switch (y) {
        case "month":
          m.style.top = "", m.style.left = "";
          break;
        case "timeline":
          m.style.left = "", m.style.marginLeft = "1px";
          break;
        default:
          m.style.top = "";
      }
    })(p, c);
    const h = {};
    let u = { start_date: l.start_date, end_date: l.end_date, css: "dhx_scheduler_dnd_marker", html: p };
    return c != "timeline" && c != "month" || (u = { ...u, end_date: e.date.add(l.start_date, 1, "minute") }), v && (h[f] = v, u.sections = h), u;
  }
  function a(d) {
    const { layout: l } = d;
    let c;
    switch (l) {
      case "month":
        c = function(f) {
          let v = [];
          const { event: p, layout: h, viewName: u, sectionId: m } = f, y = [];
          let w = new Date(p.start_date);
          for (; w.valueOf() < p.end_date.valueOf(); ) {
            let E = { start_date: w };
            y.push(E), w = e.date.week_start(e.date.add(w, 1, "week"));
          }
          let D = e.$container.querySelectorAll(`[${e.config.event_attribute}='${p.id}']`);
          for (let E = 0; E < D.length; E++) {
            const S = { event: y[E], layout: h, viewName: u, sectionId: m, eventNode: D[E].cloneNode(!0) };
            v.push(_(S));
          }
          return v;
        }(d);
        break;
      case "timeline":
      case "units":
        c = function(f) {
          let v = [];
          const { event: p, layout: h, viewName: u, eventNode: m } = f;
          let y = function(w) {
            const D = e.getView(w);
            return D.y_property ? D.y_property : D.map_to ? D.map_to : void 0;
          }(u);
          if (y) {
            const w = String(p[y]).split(e.config.section_delimiter).map((E) => String(E)), D = [];
            for (let E = 0; E < w.length; E++) {
              D[E] = m.cloneNode(!0);
              const S = { event: p, layout: h, viewName: u, sectionId: w[E], eventNode: D[E] };
              v.push(_(S));
            }
          }
          return v;
        }(d);
        break;
      default:
        c = function(f) {
          const { event: v, layout: p, viewName: h, sectionId: u } = f;
          let m = [], y = e.$container.querySelectorAll(`[${e.config.event_attribute}='${v.id}']:not(.dhx_cal_select_menu):not(.dhx_drag_marker)`);
          if (y)
            for (let w = 0; w < y.length; w++) {
              let D = y[w].cloneNode(!0);
              const E = { event: { start_date: /* @__PURE__ */ new Date(+D.getAttribute("data-bar-start")), end_date: /* @__PURE__ */ new Date(+D.getAttribute("data-bar-end")) }, layout: p, viewName: h, sectionId: u, eventNode: D };
              m.push(_(E));
            }
          return m;
        }(d);
    }
    c.forEach((f) => {
      i.push(e.markTimespan(f));
    });
  }
  e.attachEvent("onBeforeDrag", function(d, l, c) {
    return n() && (t = !0, s = e.getEvent(d), r = c.target.closest(`[${e.config.event_attribute}]`), o(e.getState().mode) == "units" && e.config.cascade_event_display && (e.unselect(d), r = c.target.closest(`[${e.config.event_attribute}]`))), !0;
  }), e.attachEvent("onEventDrag", function(d, l, c) {
    if (t && n()) {
      t = !1;
      const f = e.getState().mode, v = o(f), p = e.getActionData(c).section;
      s && a({ event: s, layout: v, viewName: f, sectionId: p, eventNode: r });
    }
  }), e.attachEvent("onDragEnd", function(d, l, c) {
    for (let f = 0; f < i.length; f++)
      e.unmarkTimespan(i[f]);
    i = [], r = null, s = null;
  });
}
function Mt(e) {
  e.config.mark_now = !0, e.config.display_marked_timespans = !0, e.config.overwrite_marked_timespans = !0;
  var i = "dhx_time_block", t = "default", r = function(n, o, _) {
    var a = typeof n == "object" ? n : { days: n };
    return a.type = i, a.css = "", o && (_ && (a.sections = _), a = function(d, l, c) {
      return l instanceof Date && c instanceof Date ? (d.start_date = l, d.end_date = c) : (d.days = l, d.zones = c), d;
    }(a, n, o)), a;
  };
  function s(n, o, _, a, d) {
    var l = e, c = [], f = { _props: "map_to", matrix: "y_property" };
    for (var v in f) {
      var p = f[v];
      if (l[v])
        for (var h in l[v]) {
          var u = l[v][h][p];
          n[u] && (c = l._add_timespan_zones(c, e._get_blocked_zones(o[h], n[u], _, a, d)));
        }
    }
    return c = l._add_timespan_zones(c, e._get_blocked_zones(o, "global", _, a, d));
  }
  e.blockTime = function(n, o, _) {
    var a = r(n, o, _);
    return e.addMarkedTimespan(a);
  }, e.unblockTime = function(n, o, _) {
    var a = r(n, o = o || "fullday", _);
    return e.deleteMarkedTimespan(a);
  }, e.checkInMarkedTimespan = function(n, o, _) {
    o = o || t;
    for (var a = !0, d = new Date(n.start_date.valueOf()), l = e.date.add(d, 1, "day"), c = e._marked_timespans; d < n.end_date; d = e.date.date_part(l), l = e.date.add(d, 1, "day")) {
      var f = +e.date.date_part(new Date(d)), v = s(n, c, d.getDay(), f, o);
      if (v)
        for (var p = 0; p < v.length; p += 2) {
          var h = e._get_zone_minutes(d), u = n.end_date > l || n.end_date.getDate() != d.getDate() ? 1440 : e._get_zone_minutes(n.end_date), m = v[p], y = v[p + 1];
          if (m < u && y > h && !(a = typeof _ == "function" && _(n, h, u, m, y)))
            break;
        }
    }
    return !a;
  }, e.checkLimitViolation = function(n) {
    if (!n || !e.config.check_limits)
      return !0;
    var o = e, _ = o.config, a = [];
    if (n.rec_type && n._end_date || n.rrule) {
      const v = n._end_date || n.end_date;
      return !_.limit_start || !_.limit_end || v.valueOf() >= _.limit_start.valueOf() && n.start_date.valueOf() <= _.limit_end.valueOf();
    }
    a = [n];
    for (var d = !0, l = 0; l < a.length; l++) {
      var c = !0, f = a[l];
      f._timed = e.isOneDayEvent(f), (c = !_.limit_start || !_.limit_end || f.start_date.valueOf() >= _.limit_start.valueOf() && f.end_date.valueOf() <= _.limit_end.valueOf()) && (c = !e.checkInMarkedTimespan(f, i, function(v, p, h, u, m) {
        var y = !0;
        return p <= m && p >= u && ((m == 1440 || h <= m) && (y = !1), v._timed && o._drag_id && o._drag_mode == "new-size" ? (v.start_date.setHours(0), v.start_date.setMinutes(m)) : y = !1), (h >= u && h <= m || p < u && h > m) && (v._timed && o._drag_id && o._drag_mode == "new-size" ? (v.end_date.setHours(0), v.end_date.setMinutes(u)) : y = !1), y;
      })), c || (c = o.checkEvent("onLimitViolation") ? o.callEvent("onLimitViolation", [f.id, f]) : c), d = d && c;
    }
    return d || (o._drag_id = null, o._drag_mode = null), d;
  }, e._get_blocked_zones = function(n, o, _, a, d) {
    var l = [];
    if (n && n[o])
      for (var c = n[o], f = this._get_relevant_blocked_zones(_, a, c, d), v = 0; v < f.length; v++)
        l = this._add_timespan_zones(l, f[v].zones);
    return l;
  }, e._get_relevant_blocked_zones = function(n, o, _, a) {
    var d;
    return e.config.overwrite_marked_timespans ? d = _[o] && _[o][a] ? _[o][a] : _[n] && _[n][a] ? _[n][a] : [] : (d = [], _[o] && _[o][a] && (d = d.concat(_[o][a])), _[n] && _[n][a] && (d = d.concat(_[n][a]))), d;
  }, e._mark_now = function(n) {
    var o = "dhx_now_time";
    this._els[o] || (this._els[o] = []);
    var _ = e._currentDate(), a = this.config;
    if (e._remove_mark_now(), !n && a.mark_now && _ < this._max_date && _ > this._min_date && _.getHours() >= a.first_hour && _.getHours() < a.last_hour) {
      var d = this.locate_holder_day(_);
      this._els[o] = e._append_mark_now(d, _);
    }
  }, e._append_mark_now = function(n, o) {
    var _ = "dhx_now_time", a = e._get_zone_minutes(o), d = { zones: [a, a + 1], css: _, type: _ };
    if (!this._table_view) {
      if (this._props && this._props[this._mode]) {
        var l, c, f = this._props[this._mode], v = f.size || f.options.length;
        f.days > 1 ? (f.size && f.options.length && (n = (f.position + n) / f.options.length * f.size), l = n, c = n + v) : c = (l = 0) + v;
        for (var p = [], h = l; h < c; h++) {
          var u = h;
          d.days = u;
          var m = e._render_marked_timespan(d, null, u)[0];
          p.push(m);
        }
        return p;
      }
      return d.days = n, e._render_marked_timespan(d, null, n);
    }
    if (this._mode == "month")
      return d.days = +e.date.date_part(o), e._render_marked_timespan(d, null, null);
  }, e._remove_mark_now = function() {
    for (var n = "dhx_now_time", o = this._els[n], _ = 0; _ < o.length; _++) {
      var a = o[_], d = a.parentNode;
      d && d.removeChild(a);
    }
    this._els[n] = [];
  }, e._marked_timespans = { global: {} }, e._get_zone_minutes = function(n) {
    return 60 * n.getHours() + n.getMinutes();
  }, e._prepare_timespan_options = function(n) {
    var o = [], _ = [];
    if (n.days == "fullweek" && (n.days = [0, 1, 2, 3, 4, 5, 6]), n.days instanceof Array) {
      for (var a = n.days.slice(), d = 0; d < a.length; d++) {
        var l = e._lame_clone(n);
        l.days = a[d], o.push.apply(o, e._prepare_timespan_options(l));
      }
      return o;
    }
    if (!n || !(n.start_date && n.end_date && n.end_date > n.start_date || n.days !== void 0 && n.zones) && !n.type)
      return o;
    n.zones == "fullday" && (n.zones = [0, 1440]), n.zones && n.invert_zones && (n.zones = e.invertZones(n.zones)), n.id = e.uid(), n.css = n.css || "", n.type = n.type || t;
    var c = n.sections;
    if (c) {
      for (var f in c)
        if (c.hasOwnProperty(f)) {
          var v = c[f];
          for (v instanceof Array || (v = [v]), d = 0; d < v.length; d++)
            (D = e._lame_copy({}, n)).sections = {}, D.sections[f] = v[d], _.push(D);
        }
    } else
      _.push(n);
    for (var p = 0; p < _.length; p++) {
      var h = _[p], u = h.start_date, m = h.end_date;
      if (u && m)
        for (var y = e.date.date_part(new Date(u)), w = e.date.add(y, 1, "day"); y < m; ) {
          var D;
          delete (D = e._lame_copy({}, h)).start_date, delete D.end_date, D.days = y.valueOf();
          var E = u > y ? e._get_zone_minutes(u) : 0, S = m > w || m.getDate() != y.getDate() ? 1440 : e._get_zone_minutes(m);
          D.zones = [E, S], o.push(D), y = w, w = e.date.add(w, 1, "day");
        }
      else
        h.days instanceof Date && (h.days = e.date.date_part(h.days).valueOf()), h.zones = n.zones.slice(), o.push(h);
    }
    return o;
  }, e._get_dates_by_index = function(n, o, _) {
    var a = [];
    o = e.date.date_part(new Date(o || e._min_date)), _ = new Date(_ || e._max_date);
    for (var d = o.getDay(), l = n - d >= 0 ? n - d : 7 - o.getDay() + n, c = e.date.add(o, l, "day"); c < _; c = e.date.add(c, 1, "week"))
      a.push(c);
    return a;
  }, e._get_css_classes_by_config = function(n) {
    var o = [];
    return n.type == i && (o.push(i), n.css && o.push(i + "_reset")), o.push("dhx_marked_timespan", n.css), o.join(" ");
  }, e._get_block_by_config = function(n) {
    var o = document.createElement("div");
    return n.html && (typeof n.html == "string" ? o.innerHTML = n.html : o.appendChild(n.html)), o;
  }, e._render_marked_timespan = function(n, o, _) {
    var a = [], d = e.config, l = this._min_date, c = this._max_date, f = !1;
    if (!d.display_marked_timespans)
      return a;
    if (!_ && _ !== 0) {
      if (n.days < 7)
        _ = n.days;
      else {
        var v = new Date(n.days);
        if (f = +v, !(+c > +v && +l <= +v))
          return a;
        _ = v.getDay();
      }
      var p = l.getDay();
      p > _ ? _ = 7 - (p - _) : _ -= p;
    }
    var h = n.zones, u = e._get_css_classes_by_config(n);
    if (e._table_view && e._mode == "month") {
      var m = [], y = [];
      if (o)
        m.push(o), y.push(_);
      else {
        y = f ? [f] : e._get_dates_by_index(_);
        for (var w = 0; w < y.length; w++)
          m.push(this._scales[y[w]]);
      }
      for (w = 0; w < m.length; w++) {
        o = m[w], _ = y[w];
        var D = this.locate_holder_day(_, !1) % this._cols.length;
        if (!this._ignores[D]) {
          var E = e._get_block_by_config(n);
          E.className = u, E.style.top = "0px", E.style.height = "100%";
          for (var S = 0; S < h.length; S += 2) {
            var g = h[w];
            if ((M = h[w + 1]) <= g)
              return [];
            (N = E.cloneNode(!0)).style.left = "0px", N.style.width = "100%", o.appendChild(N), a.push(N);
          }
        }
      }
    } else {
      var b = _;
      if (this._ignores[this.locate_holder_day(_, !1)])
        return a;
      if (this._props && this._props[this._mode] && n.sections && n.sections[this._mode]) {
        var x = this._props[this._mode];
        b = x.order[n.sections[this._mode]];
        var k = x.order[n.sections[this._mode]];
        x.days > 1 ? b = b * (x.size || x.options.length) + k : (b = k, x.size && b > x.position + x.size && (b = 0));
      }
      for (o = o || e.locate_holder(b), w = 0; w < h.length; w += 2) {
        var M, N;
        if (g = Math.max(h[w], 60 * d.first_hour), (M = Math.min(h[w + 1], 60 * d.last_hour)) <= g) {
          if (w + 2 < h.length)
            continue;
          return [];
        }
        (N = e._get_block_by_config(n)).className = u;
        var T = 24 * this.config.hour_size_px + 1, A = 36e5;
        N.style.top = Math.round((60 * g * 1e3 - this.config.first_hour * A) * this.config.hour_size_px / A) % T + "px", N.style.height = Math.max(Math.round(60 * (M - g) * 1e3 * this.config.hour_size_px / A) % T, 1) + "px", o.appendChild(N), a.push(N);
      }
    }
    return a;
  }, e._mark_timespans = function() {
    var n = this._els.dhx_cal_data[0], o = [];
    if (e._table_view && e._mode == "month")
      for (var _ in this._scales) {
        var a = /* @__PURE__ */ new Date(+_);
        o.push.apply(o, e._on_scale_add_marker(this._scales[_], a));
      }
    else {
      a = new Date(e._min_date);
      for (var d = 0, l = n.childNodes.length; d < l; d++) {
        var c = n.childNodes[d];
        c.firstChild && e._getClassName(c.firstChild).indexOf("dhx_scale_hour") > -1 || (o.push.apply(o, e._on_scale_add_marker(c, a)), a = e.date.add(a, 1, "day"));
      }
    }
    return o;
  }, e.markTimespan = function(n) {
    if (!this._els)
      throw new Error("`scheduler.markTimespan` can't be used before scheduler initialization. Place `scheduler.markTimespan` call after `scheduler.init`.");
    var o = !1;
    this._els.dhx_cal_data || (e.get_elements(), o = !0);
    var _ = e._marked_timespans_ids, a = e._marked_timespans_types, d = e._marked_timespans;
    e.deleteMarkedTimespan(), e.addMarkedTimespan(n);
    var l = e._mark_timespans();
    return o && (e._els = []), e._marked_timespans_ids = _, e._marked_timespans_types = a, e._marked_timespans = d, l;
  }, e.unmarkTimespan = function(n) {
    if (n)
      for (var o = 0; o < n.length; o++) {
        var _ = n[o];
        _.parentNode && _.parentNode.removeChild(_);
      }
  }, e._addMarkerTimespanConfig = function(n) {
    var o = "global", _ = e._marked_timespans, a = n.id, d = e._marked_timespans_ids;
    d[a] || (d[a] = []);
    var l = n.days, c = n.sections, f = n.type;
    if (n.id = a, c) {
      for (var v in c)
        if (c.hasOwnProperty(v)) {
          _[v] || (_[v] = {});
          var p = c[v], h = _[v];
          h[p] || (h[p] = {}), h[p][l] || (h[p][l] = {}), h[p][l][f] || (h[p][l][f] = [], e._marked_timespans_types || (e._marked_timespans_types = {}), e._marked_timespans_types[f] || (e._marked_timespans_types[f] = !0));
          var u = h[p][l][f];
          n._array = u, u.push(n), d[a].push(n);
        }
    } else
      _[o][l] || (_[o][l] = {}), _[o][l][f] || (_[o][l][f] = []), e._marked_timespans_types || (e._marked_timespans_types = {}), e._marked_timespans_types[f] || (e._marked_timespans_types[f] = !0), u = _[o][l][f], n._array = u, u.push(n), d[a].push(n);
  }, e._marked_timespans_ids = {}, e.addMarkedTimespan = function(n) {
    var o = e._prepare_timespan_options(n);
    if (o.length) {
      for (var _ = o[0].id, a = 0; a < o.length; a++)
        e._addMarkerTimespanConfig(o[a]);
      return _;
    }
  }, e._add_timespan_zones = function(n, o) {
    var _ = n.slice();
    if (o = o.slice(), !_.length)
      return o;
    for (var a = 0; a < _.length; a += 2)
      for (var d = _[a], l = _[a + 1], c = a + 2 == _.length, f = 0; f < o.length; f += 2) {
        var v = o[f], p = o[f + 1];
        if (p > l && v <= l || v < d && p >= d)
          _[a] = Math.min(d, v), _[a + 1] = Math.max(l, p), a -= 2;
        else {
          if (!c)
            continue;
          var h = d > v ? 0 : 2;
          _.splice(a + h, 0, v, p);
        }
        o.splice(f--, 2);
        break;
      }
    return _;
  }, e._subtract_timespan_zones = function(n, o) {
    for (var _ = n.slice(), a = 0; a < _.length; a += 2)
      for (var d = _[a], l = _[a + 1], c = 0; c < o.length; c += 2) {
        var f = o[c], v = o[c + 1];
        if (v > d && f < l) {
          var p = !1;
          d >= f && l <= v && _.splice(a, 2), d < f && (_.splice(a, 2, d, f), p = !0), l > v && _.splice(p ? a + 2 : a, p ? 0 : 2, v, l), a -= 2;
          break;
        }
      }
    return _;
  }, e.invertZones = function(n) {
    return e._subtract_timespan_zones([0, 1440], n.slice());
  }, e._delete_marked_timespan_by_id = function(n) {
    var o = e._marked_timespans_ids[n];
    if (o) {
      for (var _ = 0; _ < o.length; _++)
        for (var a = o[_], d = a._array, l = 0; l < d.length; l++)
          if (d[l] == a) {
            d.splice(l, 1);
            break;
          }
    }
  }, e._delete_marked_timespan_by_config = function(n) {
    var o, _ = e._marked_timespans, a = n.sections, d = n.days, l = n.type || t;
    if (a) {
      for (var c in a)
        if (a.hasOwnProperty(c) && _[c]) {
          var f = a[c];
          _[c][f] && (o = _[c][f]);
        }
    } else
      o = _.global;
    if (o) {
      if (d !== void 0)
        o[d] && o[d][l] && (e._addMarkerTimespanConfig(n), e._delete_marked_timespans_list(o[d][l], n));
      else
        for (var v in o)
          if (o[v][l]) {
            var p = e._lame_clone(n);
            n.days = v, e._addMarkerTimespanConfig(p), e._delete_marked_timespans_list(o[v][l], n);
          }
    }
  }, e._delete_marked_timespans_list = function(n, o) {
    for (var _ = 0; _ < n.length; _++) {
      var a = n[_], d = e._subtract_timespan_zones(a.zones, o.zones);
      if (d.length)
        a.zones = d;
      else {
        n.splice(_, 1), _--;
        for (var l = e._marked_timespans_ids[a.id], c = 0; c < l.length; c++)
          if (l[c] == a) {
            l.splice(c, 1);
            break;
          }
      }
    }
  }, e.deleteMarkedTimespan = function(n) {
    if (arguments.length || (e._marked_timespans = { global: {} }, e._marked_timespans_ids = {}, e._marked_timespans_types = {}), typeof n != "object")
      e._delete_marked_timespan_by_id(n);
    else {
      n.start_date && n.end_date || (n.days !== void 0 || n.type || (n.days = "fullweek"), n.zones || (n.zones = "fullday"));
      var o = [];
      if (n.type)
        o.push(n.type);
      else
        for (var _ in e._marked_timespans_types)
          o.push(_);
      for (var a = e._prepare_timespan_options(n), d = 0; d < a.length; d++)
        for (var l = a[d], c = 0; c < o.length; c++) {
          var f = e._lame_clone(l);
          f.type = o[c], e._delete_marked_timespan_by_config(f);
        }
    }
  }, e._get_types_to_render = function(n, o) {
    var _ = n ? e._lame_copy({}, n) : {};
    for (var a in o || {})
      o.hasOwnProperty(a) && (_[a] = o[a]);
    return _;
  }, e._get_configs_to_render = function(n) {
    var o = [];
    for (var _ in n)
      n.hasOwnProperty(_) && o.push.apply(o, n[_]);
    return o;
  }, e._on_scale_add_marker = function(n, o) {
    if (!e._table_view || e._mode == "month") {
      var _ = o.getDay(), a = o.valueOf(), d = this._mode, l = e._marked_timespans, c = [], f = [];
      if (this._props && this._props[d]) {
        var v = this._props[d], p = v.options, h = p[e._get_unit_index(v, o)];
        if (v.days > 1) {
          var u = Math.round((o - e._min_date) / 864e5), m = v.size || p.length;
          o = e.date.add(e._min_date, Math.floor(u / m), "day"), o = e.date.date_part(o);
        } else
          o = e.date.date_part(new Date(this._date));
        if (_ = o.getDay(), a = o.valueOf(), l[d] && l[d][h.key]) {
          var y = l[d][h.key], w = e._get_types_to_render(y[_], y[a]);
          c.push.apply(c, e._get_configs_to_render(w));
        }
      }
      var D = l.global;
      if (e.config.overwrite_marked_timespans) {
        var E = D[a] || D[_];
        c.push.apply(c, e._get_configs_to_render(E));
      } else
        D[a] && c.push.apply(c, e._get_configs_to_render(D[a])), D[_] && c.push.apply(c, e._get_configs_to_render(D[_]));
      for (var S = 0; S < c.length; S++)
        f.push.apply(f, e._render_marked_timespan(c[S], n, o));
      return f;
    }
  }, e.attachEvent("onScaleAdd", function() {
    e._on_scale_add_marker.apply(e, arguments);
  }), e.dblclick_dhx_marked_timespan = function(n, o) {
    e.callEvent("onScaleDblClick", [e.getActionData(n).date, o, n]), e.config.dblclick_create && e.addEventNow(e.getActionData(n).date, null, n);
  };
}
function Nt(e) {
  var i = {}, t = !1;
  function r(a, d) {
    d = typeof d == "function" ? d : function() {
    }, i[a] || (i[a] = this[a], this[a] = d);
  }
  function s(a) {
    i[a] && (this[a] = i[a], i[a] = null);
  }
  function n(a) {
    for (var d in a)
      r.call(this, d, a[d]);
  }
  function o() {
    for (var a in i)
      s.call(this, a);
  }
  function _(a) {
    try {
      a();
    } catch (d) {
      window.console.error(d);
    }
  }
  return e.$stateProvider.registerProvider("batchUpdate", function() {
    return { batch_update: t };
  }, !1), function(a, d) {
    if (t)
      return void _(a);
    var l, c = this._dp && this._dp.updateMode != "off";
    c && (l = this._dp.updateMode, this._dp.setUpdateMode("off"));
    const f = { setModeDate: { date: null, mode: null }, needRender: !1, needUpdateView: !1, repaintEvents: {} }, v = (h, u) => {
      h && (f.setModeDate.date = h), u && (f.setModeDate.mode = u);
    };
    var p = { render: (h, u) => {
      f.needRender = !0, v(h, u);
    }, setCurrentView: (h, u) => {
      f.needRender = !0, v(h, u);
    }, updateView: (h, u) => {
      f.needUpdateView = !0, v(h, u);
    }, render_data: () => f.needRender = !0, render_view_data: (h) => {
      h && h.length ? h.forEach((u) => f.repaintEvents[u.id] = !0) : f.needRender = !0;
    } };
    if (n.call(this, p), t = !0, this.callEvent("onBeforeBatchUpdate", []), _(a), this.callEvent("onAfterBatchUpdate", []), o.call(this), t = !1, !d)
      if (f.needRender)
        e.render(f.setModeDate.date, f.setModeDate.mode);
      else if (f.needUpdateView)
        e.updateView(f.setModeDate.date, f.setModeDate.mode);
      else
        for (const h in f.repaintEvents)
          e.updateEvent(h);
    c && (this._dp.setUpdateMode(l), this._dp.sendData());
  };
}
class Tt {
  constructor(i) {
    const { url: t, token: r } = i;
    this._url = t, this._token = r, this._mode = 1, this._seed = 1, this._queue = [], this.data = {}, this.api = {}, this._events = {};
  }
  headers() {
    return { Accept: "application/json", "Content-Type": "application/json", "Remote-Token": this._token };
  }
  fetch(i, t) {
    const r = { credentials: "include", headers: this.headers() };
    return t && (r.method = "POST", r.body = t), fetch(i, r).then((s) => s.json());
  }
  load(i) {
    return i && (this._url = i), this.fetch(this._url).then((t) => this.parse(t));
  }
  parse(i) {
    const { key: t, websocket: r } = i;
    t && (this._token = i.key);
    for (const s in i.data)
      this.data[s] = i.data[s];
    for (const s in i.api) {
      const n = this.api[s] = {}, o = i.api[s];
      for (const _ in o)
        n[_] = this._wrapper(s + "." + _);
    }
    return r && this.connect(), this;
  }
  connect() {
    const i = this._socket;
    i && (this._socket = null, i.onclose = function() {
    }, i.close()), this._mode = 2, this._socket = function(t, r, s, n) {
      let o = r;
      o[0] === "/" && (o = document.location.protocol + "//" + document.location.host + r), o = o.replace(/^http(s|):/, "ws$1:");
      const _ = o.indexOf("?") != -1 ? "&" : "?";
      o = `${o}${_}token=${s}&ws=1`;
      const a = new WebSocket(o);
      return a.onclose = () => setTimeout(() => t.connect(), 2e3), a.onmessage = (d) => {
        const l = JSON.parse(d.data);
        switch (l.action) {
          case "result":
            t.result(l.body, []);
            break;
          case "event":
            t.fire(l.body.name, l.body.value);
            break;
          case "start":
            n();
            break;
          default:
            t.onError(l.data);
        }
      }, a;
    }(this, this._url, this._token, () => (this._mode = 3, this._send(), this._resubscribe(), this));
  }
  _wrapper(i) {
    return (function() {
      const t = [].slice.call(arguments);
      let r = null;
      const s = new Promise((n, o) => {
        r = { data: { id: this._uid(), name: i, args: t }, status: 1, resolve: n, reject: o }, this._queue.push(r);
      });
      return this.onCall(r, s), this._mode === 3 ? this._send(r) : setTimeout(() => this._send(), 1), s;
    }).bind(this);
  }
  _uid() {
    return (this._seed++).toString();
  }
  _send(i) {
    if (this._mode == 2)
      return void setTimeout(() => this._send(), 100);
    const t = i ? [i] : this._queue.filter((s) => s.status === 1);
    if (!t.length)
      return;
    const r = t.map((s) => (s.status = 2, s.data));
    this._mode !== 3 ? this.fetch(this._url, JSON.stringify(r)).catch((s) => this.onError(s)).then((s) => this.result(s, r)) : this._socket.send(JSON.stringify({ action: "call", body: r }));
  }
  result(i, t) {
    const r = {};
    if (i)
      for (let s = 0; s < i.length; s++)
        r[i[s].id] = i[s];
    else
      for (let s = 0; s < t.length; s++)
        r[t[s].id] = { id: t[s].id, error: "Network Error", data: null };
    for (let s = this._queue.length - 1; s >= 0; s--) {
      const n = this._queue[s], o = r[n.data.id];
      o && (this.onResponse(n, o), o.error ? n.reject(o.error) : n.resolve(o.data), this._queue.splice(s, 1));
    }
  }
  on(i, t) {
    const r = this._uid();
    let s = this._events[i];
    const n = !!s;
    return n || (s = this._events[i] = []), s.push({ id: r, handler: t }), n || this._mode != 3 || this._socket.send(JSON.stringify({ action: "subscribe", name: i })), { name: i, id: r };
  }
  _resubscribe() {
    if (this._mode == 3)
      for (const i in this._events)
        this._socket.send(JSON.stringify({ action: "subscribe", name: i }));
  }
  detach(i) {
    if (!i) {
      if (this._mode == 3)
        for (const n in this._events)
          this._socket.send(JSON.stringify({ action: "unsubscribe", key: n }));
      return void (this._events = {});
    }
    const { id: t, name: r } = i, s = this._events[r];
    if (s) {
      const n = s.filter((o) => o.id != t);
      n.length ? this._events[r] = n : (delete this._events[r], this._mode == 3 && this._socket.send(JSON.stringify({ action: "unsubscribe", name: r })));
    }
  }
  fire(i, t) {
    const r = this._events[i];
    if (r)
      for (let s = 0; s < r.length; s++)
        r[s].handler(t);
  }
  onError(i) {
    return null;
  }
  onCall(i, t) {
  }
  onResponse(i, t) {
  }
}
class At {
  constructor(i, t) {
    const r = new Tt({ url: i, token: t });
    r.fetch = function(s, n) {
      const o = { headers: this.headers() };
      return n && (o.method = "POST", o.body = n), fetch(s, o).then((_) => _.json());
    }, this._ready = r.load().then((s) => this._remote = s);
  }
  ready() {
    return this._ready;
  }
  on(i, t) {
    this.ready().then((r) => {
      if (typeof i == "string")
        r.on(i, t);
      else
        for (const s in i)
          r.on(s, i[s]);
    });
  }
}
function Ct(e) {
  function i(r, s) {
    switch (r) {
      case "add-event":
        (function(n) {
          if (e.getEvent(n.id))
            return void console.warn(`Event with ID ${n.id} already exists. Skipping add.`);
          n.start_date = e.templates.parse_date(n.start_date), n.end_date = e.templates.parse_date(n.end_date), n.original_start && (n.original_start = e.templates.parse_date(n.original_start)), t(() => {
            e.addEvent(n);
          });
        })(s);
        break;
      case "update-event":
        (function(n) {
          const o = n.id;
          if (!e.getEvent(o))
            return void console.warn(`Event with ID ${o} does not exist. Skipping update.`);
          const _ = e.getEvent(o);
          t(() => {
            for (let a in n)
              a !== "start_date" && a !== "end_date" && (_[a] = n[a]);
            _.start_date = e.templates.parse_date(n.start_date), _.end_date = e.templates.parse_date(n.end_date), n.original_start && (n.original_start = e.templates.parse_date(n.original_start)), e.callEvent("onEventChanged", [o, _]), e.updateEvent(o), o !== n.id && e.changeEventId(o, n.id);
          });
        })(s);
        break;
      case "delete-event":
        (function(n) {
          const o = n.id;
          if (!e.getEvent(o))
            return void (n.event_pid && t(() => {
              e.addEvent(n);
            }));
          t(() => {
            const _ = e.getEvent(o);
            if (_) {
              if (_.rec_type || _.rrule) {
                e._roll_back_dates(_);
                const a = e._get_rec_markers(o);
                for (const d in a)
                  e.getEvent(d) && e.deleteEvent(d, !0);
              }
              if (e.getState().lightbox_id == o && (this._new_event = this._lightbox_id, n.id = this._lightbox_id, this._events[this._lightbox_id] = n, e.callEvent("onLiveUpdateCollision", [o, null, "delete", n]) === !1))
                return void e.endLightbox(!1, e._lightbox);
              e.deleteEvent(o, !0);
            }
          });
        })(s);
    }
  }
  function t(r) {
    e._dp ? e._dp.ignore(r) : r();
  }
  return { events: function(r) {
    if (!r || !r.event || !r.event.id)
      return void console.error("Invalid message format:", r);
    const { type: s, event: n } = r;
    if (!e._dp._in_progress[n.id]) {
      if (s === "add-event") {
        for (const o in e._dp._in_progress)
          if (e._dp.getState(o) === "inserted")
            return void e._dp.attachEvent("onFullSync", function() {
              e.getEvent(n.id) || i(s, n);
            }, { once: !0 });
      }
      i(s, n);
    }
  } };
}
function Ot(e) {
  (function(i) {
    const t = {};
    i.attachEvent("onConfirmedBeforeEventDelete", function(r) {
      return t[r] = !0, !0;
    }), i.attachEvent("onEventDeleted", function(r, s) {
      if (!t[r])
        return;
      delete t[r];
      let n = i.copy(s);
      i.config.undo_deleted && !i.getState().new_event && i.message({ text: `<div class="dhx_info_message">
                            <span class="undo_popup_text">Event deleted</span>
                            <button class="undo_button" data-deleted-event-id="${s.id}">Undo</button>
                        </div>`, expire: 1e4, type: "popup_after_delete", callback: function(o) {
        o.target.closest(`[data-deleted-event-id="${s.id}"]`) && (n.rrule && n.duration && (n.end_date = new Date(n.start_date.valueOf() + 1e3 * n.duration), i.addEvent(n)), i.addEvent(n), i.render());
      } });
    });
  })(e), St(e), Mt(e), function(i) {
    i.batchUpdate = Nt(i);
  }(e), function(i) {
    i.ext || (i.ext = {}), i.ext.liveUpdates = { RemoteEvents: At, remoteUpdates: Ct(i) };
  }(e);
}
var Lt = Date.now();
function Te(e) {
  return !(!e || typeof e != "object") && !!(e.getFullYear && e.getMonth && e.getDate);
}
const ae = { uid: function() {
  return Lt++;
}, mixin: function(e, i, t) {
  for (var r in i)
    (e[r] === void 0 || t) && (e[r] = i[r]);
  return e;
}, copy: function e(i) {
  var t, r, s;
  if (i && typeof i == "object")
    switch (!0) {
      case Te(i):
        r = new Date(i);
        break;
      case (s = i, Array.isArray ? Array.isArray(s) : s && s.length !== void 0 && s.pop && s.push):
        for (r = new Array(i.length), t = 0; t < i.length; t++)
          r[t] = e(i[t]);
        break;
      case function(n) {
        return n && typeof n == "object" && Function.prototype.toString.call(n.constructor) === "function String() { [native code] }";
      }(i):
        r = new String(i);
        break;
      case function(n) {
        return n && typeof n == "object" && Function.prototype.toString.call(n.constructor) === "function Number() { [native code] }";
      }(i):
        r = new Number(i);
        break;
      case function(n) {
        return n && typeof n == "object" && Function.prototype.toString.call(n.constructor) === "function Boolean() { [native code] }";
      }(i):
        r = new Boolean(i);
        break;
      default:
        for (t in r = {}, i) {
          const n = typeof i[t];
          n === "string" || n === "number" || n === "boolean" ? r[t] = i[t] : Te(i[t]) ? r[t] = new Date(i[t]) : Object.prototype.hasOwnProperty.apply(i, [t]) && (r[t] = e(i[t]));
        }
    }
  return r || i;
}, defined: function(e) {
  return e !== void 0;
}, isDate: Te, delay: function(e, i) {
  var t, r = function() {
    r.$cancelTimeout(), r.$pending = !0;
    var s = Array.prototype.slice.call(arguments);
    t = setTimeout(function() {
      e.apply(this, s), r.$pending = !1;
    }, i);
  };
  return r.$pending = !1, r.$cancelTimeout = function() {
    clearTimeout(t), r.$pending = !1;
  }, r.$execute = function() {
    var s = Array.prototype.slice.call(arguments);
    e.apply(this, s), r.$cancelTimeout();
  }, r;
} };
function $t(e) {
  function i(p) {
    var h = document.createElement("div");
    return (p || "").split(" ").forEach(function(u) {
      h.classList.add(u);
    }), h;
  }
  var t = function() {
    return i("dhx_cal_navbar_rows_container");
  }, r = function() {
    return i("dhx_cal_navbar_row");
  }, s = function(p) {
    var h = i("dhx_cal_tab");
    return h.setAttribute("name", p.view + "_tab"), h.setAttribute("data-tab", p.view), e.config.fix_tab_position && (p.$firstTab ? h.classList.add("dhx_cal_tab_first") : p.$lastTab ? h.classList.add("dhx_cal_tab_last") : p.view !== "week" && h.classList.add("dhx_cal_tab_standalone"), p.$segmentedTab && h.classList.add("dhx_cal_tab_segmented")), h;
  }, n = function() {
    return i("dhx_cal_date");
  }, o = function(p) {
    return i("dhx_cal_nav_button dhx_cal_nav_button_custom dhx_cal_tab");
  }, _ = function(p) {
    return i("dhx_cal_" + p.view + "_button dhx_cal_nav_button");
  }, a = function() {
    return i("dhx_cal_line_spacer");
  }, d = function(p) {
    var h = i("dhx_minical_icon");
    return p.click || h.$_eventAttached || e.event(h, "click", function() {
      e.isCalendarVisible() ? e.destroyCalendar() : e.renderCalendar({ position: this, date: e.getState().date, navigation: !0, handler: function(u, m) {
        e.setCurrentView(u), e.destroyCalendar();
      } });
    }), h;
  };
  function l(p) {
    var h = function(y) {
      var w;
      if (y.view)
        switch (y.view) {
          case "today":
          case "next":
          case "prev":
            w = _;
            break;
          case "date":
            w = n;
            break;
          case "spacer":
            w = a;
            break;
          case "button":
            w = o;
            break;
          case "minicalendar":
            w = d;
            break;
          default:
            w = s;
        }
      else
        y.rows ? w = t : y.cols && (w = r);
      return w;
    }(p);
    if (h) {
      var u = h(p);
      if (p.css && u.classList.add(p.css), p.width && ((m = p.width) === 1 * m && (m += "px"), u.style.width = m), p.height && ((m = p.height) === 1 * m && (m += "px"), u.style.height = m), p.click && e.event(u, "click", p.click), p.html && (u.innerHTML = p.html), p.align) {
        var m = "";
        p.align == "right" ? m = "flex-end" : p.align == "left" && (m = "flex-start"), u.style.justifyContent = m;
      }
      return u;
    }
  }
  function c(p) {
    return typeof p == "string" && (p = { view: p }), p.view || p.rows || p.cols || (p.view = "button"), p;
  }
  function f(p) {
    var h, u = document.createDocumentFragment();
    h = Array.isArray(p) ? p : [p];
    for (var m = 0; m < h.length; m++) {
      var y, w = c(h[m]);
      w.view === "day" && h[m + 1] && ((y = c(h[m + 1])).view !== "week" && y.view !== "month" || (w.$firstTab = !0, w.$segmentedTab = !0)), w.view === "week" && h[m - 1] && ((y = c(h[m + 1])).view !== "week" && y.view !== "month" || (w.$segmentedTab = !0)), w.view === "month" && h[m - 1] && ((y = c(h[m - 1])).view !== "week" && y.view !== "day" || (w.$lastTab = !0, w.$segmentedTab = !0));
      var D = l(w);
      u.appendChild(D), (w.cols || w.rows) && D.appendChild(f(w.cols || w.rows));
    }
    return u;
  }
  e._init_nav_bar = function(p) {
    var h = this.$container.querySelector(".dhx_cal_navline");
    return h || ((h = document.createElement("div")).className = "dhx_cal_navline dhx_cal_navline_flex", e._update_nav_bar(p, h), h);
  };
  var v = null;
  e._update_nav_bar = function(p, h) {
    if (p) {
      var u = !1, m = p.height || e.xy.nav_height;
      v !== null && v === m || (u = !0), u && (e.xy.nav_height = m), h.innerHTML = "", h.appendChild(f(p)), e.unset_actions(), e._els = [], e.get_elements(), e.set_actions(), h.style.display = m === 0 ? "none" : "", v = m;
    }
  };
}
function Ht(e) {
  function i(n) {
    return n.isConnected !== void 0 ? n.isConnected : document.body.contains(n);
  }
  function t(n) {
    return { w: n.innerWidth || document.documentElement.clientWidth, h: n.innerHeight || document.documentElement.clientHeight };
  }
  function r(n, o) {
    var _, a = t(o);
    n.event(o, "resize", function() {
      clearTimeout(_), _ = setTimeout(function() {
        if (i(n.$container) && !n.$destroyed) {
          var d, l, c = t(o);
          l = c, ((d = a).w != l.w || d.h != l.h) && (a = c, s(n));
        }
      }, 150);
    });
  }
  function s(n) {
    n.$initialized && !n.$destroyed && n.$root && i(n.$root) && n.callEvent("onSchedulerResize", []) && (n.updateView(), n.callEvent("onAfterSchedulerResize", []));
  }
  (function(n) {
    var o = n.$container;
    if (window.getComputedStyle(o).getPropertyValue("position") == "static" && (o.style.position = "relative"), window.ResizeObserver) {
      let a = !0;
      const d = new ResizeObserver(function(l) {
        a ? a = !1 : s(n);
      });
      d.observe(o), n.attachEvent("onDestroy", function() {
        d.unobserve(o);
      });
    } else {
      var _ = document.createElement("iframe");
      _.className = "scheduler_container_resize_watcher", _.tabIndex = -1, n.config.wai_aria_attributes && (_.setAttribute("role", "none"), _.setAttribute("aria-hidden", !0)), window.Sfdc || window.$A || window.Aura ? function(a) {
        var d = a.$root.offsetHeight, l = a.$root.offsetWidth;
        (function c() {
          a.$destroyed || (a.$root && (a.$root.offsetHeight == d && a.$root.offsetWidth == l || s(a), d = a.$root.offsetHeight, l = a.$root.offsetWidth), setTimeout(c, 200));
        })();
      }(n) : (o.appendChild(_), _.contentWindow ? r(n, _.contentWindow) : (o.removeChild(_), r(n, window)));
    }
  })(e);
}
class zt {
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
function Ve(e) {
  const i = new zt();
  e.attachEvent = function(t, r, s) {
    t = "ev_" + t.toLowerCase(), i.listeners[t] || (i.listeners[t] = function(o) {
      let _ = {}, a = 0;
      const d = function() {
        let l = !0;
        for (const c in _) {
          const f = _[c].apply(o, arguments);
          l = l && f;
        }
        return l;
      };
      return d.addEvent = function(l, c) {
        if (typeof l == "function") {
          let f;
          if (c && c.id ? f = c.id : (f = a, a++), c && c.once) {
            const v = l;
            l = function() {
              v(), d.removeEvent(f);
            };
          }
          return _[f] = l, f;
        }
        return !1;
      }, d.removeEvent = function(l) {
        delete _[l];
      }, d.clear = function() {
        _ = {};
      }, d;
    }(this)), s && s.thisObject && (r = r.bind(s.thisObject));
    let n = t + ":" + i.listeners[t].addEvent(r, s);
    return s && s.id && (n = s.id), n;
  }, e.attachAll = function(t) {
    this.attachEvent("listen_all", t);
  }, e.callEvent = function(t, r) {
    if (i._silent_mode)
      return !0;
    const s = "ev_" + t.toLowerCase(), n = i.listeners;
    return n.ev_listen_all && n.ev_listen_all.apply(this, [t].concat(r)), !n[s] || n[s].apply(this, r);
  }, e.checkEvent = function(t) {
    return !!i.listeners["ev_" + t.toLowerCase()];
  }, e.detachEvent = function(t) {
    if (t) {
      let r = i.listeners;
      for (const n in r)
        r[n].removeEvent(t);
      const s = t.split(":");
      if (r = i.listeners, s.length === 2) {
        const n = s[0], o = s[1];
        r[n] && r[n].removeEvent(o);
      }
    }
  }, e.detachAllEvents = function() {
    for (const t in i.listeners)
      i.listeners[t].clear();
  };
}
const Ke = { event: function(e, i, t) {
  e.addEventListener ? e.addEventListener(i, t, !1) : e.attachEvent && e.attachEvent("on" + i, t);
}, eventRemove: function(e, i, t) {
  e.removeEventListener ? e.removeEventListener(i, t, !1) : e.detachEvent && e.detachEvent("on" + i, t);
} };
function qt(e) {
  var i = function() {
    var t = function(r, s) {
      r = r || Ke.event, s = s || Ke.eventRemove;
      var n = [], o = { attach: function(_, a, d, l) {
        n.push({ element: _, event: a, callback: d, capture: l }), r(_, a, d, l);
      }, detach: function(_, a, d, l) {
        s(_, a, d, l);
        for (var c = 0; c < n.length; c++) {
          var f = n[c];
          f.element === _ && f.event === a && f.callback === d && f.capture === l && (n.splice(c, 1), c--);
        }
      }, detachAll: function() {
        for (var _ = n.slice(), a = 0; a < _.length; a++) {
          var d = _[a];
          o.detach(d.element, d.event, d.callback, d.capture), o.detach(d.element, d.event, d.callback, void 0), o.detach(d.element, d.event, d.callback, !1), o.detach(d.element, d.event, d.callback, !0);
        }
        n.splice(0, n.length);
      }, extend: function() {
        return t(this.event, this.eventRemove);
      } };
      return o;
    };
    return t();
  }();
  e.event = i.attach, e.eventRemove = i.detach, e._eventRemoveAll = i.detachAll, e._createDomEventScope = i.extend, e._trim = function(t) {
    return (String.prototype.trim || function() {
      return this.replace(/^\s+|\s+$/g, "");
    }).apply(t);
  }, e._isDate = function(t) {
    return !(!t || typeof t != "object") && !!(t.getFullYear && t.getMonth && t.getDate);
  }, e._isObject = function(t) {
    return t && typeof t == "object";
  };
}
function ft(e) {
  if (!e)
    return "";
  var i = e.className || "";
  return i.baseVal && (i = i.baseVal), i.indexOf || (i = ""), i || "";
}
function pt(e, i, t) {
  t === void 0 && (t = !0);
  for (var r = e.target || e.srcElement, s = ""; r; ) {
    if (s = ft(r)) {
      var n = s.indexOf(i);
      if (n >= 0) {
        if (!t)
          return r;
        var o = n === 0 || !(s.charAt(n - 1) || "").trim(), _ = n + i.length >= s.length || !s.charAt(n + i.length).trim();
        if (o && _)
          return r;
      }
    }
    r = r.parentNode;
  }
  return null;
}
function jt(e) {
  var i = !1, t = !1;
  if (window.getComputedStyle) {
    var r = window.getComputedStyle(e, null);
    i = r.display, t = r.visibility;
  } else
    e.currentStyle && (i = e.currentStyle.display, t = e.currentStyle.visibility);
  var s = !1, n = pt({ target: e }, "dhx_form_repeat", !1);
  return n && (s = n.style.height == "0px"), s = s || !e.offsetHeight, i != "none" && t != "hidden" && !s;
}
function Rt(e) {
  return !isNaN(e.getAttribute("tabindex")) && 1 * e.getAttribute("tabindex") >= 0;
}
function It(e) {
  return !{ a: !0, area: !0 }[e.nodeName.loLowerCase()] || !!e.getAttribute("href");
}
function Pt(e) {
  return !{ input: !0, select: !0, textarea: !0, button: !0, object: !0 }[e.nodeName.toLowerCase()] || !e.hasAttribute("disabled");
}
function vt() {
  return document.head.createShadowRoot || document.head.attachShadow;
}
function Ge(e) {
  if (!e || !vt())
    return document.body;
  for (; e.parentNode && (e = e.parentNode); )
    if (e instanceof ShadowRoot)
      return e.host;
  return document.body;
}
const ce = { getAbsoluteLeft: function(e) {
  return this.getOffset(e).left;
}, getAbsoluteTop: function(e) {
  return this.getOffset(e).top;
}, getOffsetSum: function(e) {
  for (var i = 0, t = 0; e; )
    i += parseInt(e.offsetTop), t += parseInt(e.offsetLeft), e = e.offsetParent;
  return { top: i, left: t };
}, getOffsetRect: function(e) {
  var i = e.getBoundingClientRect(), t = 0, r = 0;
  if (/Mobi/.test(navigator.userAgent)) {
    var s = document.createElement("div");
    s.style.position = "absolute", s.style.left = "0px", s.style.top = "0px", s.style.width = "1px", s.style.height = "1px", document.body.appendChild(s);
    var n = s.getBoundingClientRect();
    t = i.top - n.top, r = i.left - n.left, s.parentNode.removeChild(s);
  } else {
    var o = document.body, _ = document.documentElement, a = window.pageYOffset || _.scrollTop || o.scrollTop, d = window.pageXOffset || _.scrollLeft || o.scrollLeft, l = _.clientTop || o.clientTop || 0, c = _.clientLeft || o.clientLeft || 0;
    t = i.top + a - l, r = i.left + d - c;
  }
  return { top: Math.round(t), left: Math.round(r) };
}, getOffset: function(e) {
  return e.getBoundingClientRect ? this.getOffsetRect(e) : this.getOffsetSum(e);
}, closest: function(e, i) {
  return e && i ? $e(e, i) : null;
}, insertAfter: function(e, i) {
  i.nextSibling ? i.parentNode.insertBefore(e, i.nextSibling) : i.parentNode.appendChild(e);
}, remove: function(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}, isChildOf: function(e, i) {
  return i.contains(e);
}, getFocusableNodes: function(e) {
  for (var i = e.querySelectorAll(["a[href]", "area[href]", "input", "select", "textarea", "button", "iframe", "object", "embed", "[tabindex]", "[contenteditable]"].join(", ")), t = Array.prototype.slice.call(i, 0), r = 0; r < t.length; r++)
    t[r].$position = r;
  for (t.sort(function(n, o) {
    return n.tabIndex === 0 && o.tabIndex !== 0 ? 1 : n.tabIndex !== 0 && o.tabIndex === 0 ? -1 : n.tabIndex === o.tabIndex ? n.$position - o.$position : n.tabIndex < o.tabIndex ? -1 : 1;
  }), r = 0; r < t.length; r++) {
    var s = t[r];
    (Rt(s) || Pt(s) || It(s)) && jt(s) || (t.splice(r, 1), r--);
  }
  return t;
}, getClassName: ft, locateCss: pt, getRootNode: Ge, hasShadowParent: function(e) {
  return !!Ge(e);
}, isShadowDomSupported: vt, getActiveElement: function() {
  var e = document.activeElement;
  return e.shadowRoot && (e = e.shadowRoot.activeElement), e === document.body && document.getSelection && (e = document.getSelection().focusNode || document.body), e;
}, getRelativeEventPosition: function(e, i) {
  var t = document.documentElement, r = function(s) {
    var n = 0, o = 0, _ = 0, a = 0;
    if (s.getBoundingClientRect) {
      var d = s.getBoundingClientRect(), l = document.body, c = document.documentElement || document.body.parentNode || document.body, f = window.pageYOffset || c.scrollTop || l.scrollTop, v = window.pageXOffset || c.scrollLeft || l.scrollLeft, p = c.clientTop || l.clientTop || 0, h = c.clientLeft || l.clientLeft || 0;
      n = d.top + f - p, o = d.left + v - h, _ = document.body.offsetWidth - d.right, a = document.body.offsetHeight - d.bottom;
    } else {
      for (; s; )
        n += parseInt(s.offsetTop, 10), o += parseInt(s.offsetLeft, 10), s = s.offsetParent;
      _ = document.body.offsetWidth - s.offsetWidth - o, a = document.body.offsetHeight - s.offsetHeight - n;
    }
    return { y: Math.round(n), x: Math.round(o), width: s.offsetWidth, height: s.offsetHeight, right: Math.round(_), bottom: Math.round(a) };
  }(i);
  return { x: e.clientX - t.clientLeft - r.x + i.scrollLeft, y: e.clientY - t.clientTop - r.y + i.scrollTop };
}, getTargetNode: function(e) {
  var i;
  return e.tagName ? i = e : (i = (e = e || window.event).target || e.srcElement).shadowRoot && e.composedPath && (i = e.composedPath()[0]), i;
}, getNodePosition: function(e) {
  var i = 0, t = 0, r = 0, s = 0;
  if (e.getBoundingClientRect) {
    var n = e.getBoundingClientRect(), o = document.body, _ = document.documentElement || document.body.parentNode || document.body, a = window.pageYOffset || _.scrollTop || o.scrollTop, d = window.pageXOffset || _.scrollLeft || o.scrollLeft, l = _.clientTop || o.clientTop || 0, c = _.clientLeft || o.clientLeft || 0;
    i = n.top + a - l, t = n.left + d - c, r = document.body.offsetWidth - n.right, s = document.body.offsetHeight - n.bottom;
  } else {
    for (; e; )
      i += parseInt(e.offsetTop, 10), t += parseInt(e.offsetLeft, 10), e = e.offsetParent;
    r = document.body.offsetWidth - e.offsetWidth - t, s = document.body.offsetHeight - e.offsetHeight - i;
  }
  return { y: Math.round(i), x: Math.round(t), width: e.offsetWidth, height: e.offsetHeight, right: Math.round(r), bottom: Math.round(s) };
} };
var $e;
if (Element.prototype.closest)
  $e = function(e, i) {
    return e.closest(i);
  };
else {
  var Ut = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  $e = function(e, i) {
    var t = e;
    do {
      if (Ut.call(t, i))
        return t;
      t = t.parentElement || t.parentNode;
    } while (t !== null && t.nodeType === 1);
    return null;
  };
}
var _e = typeof window < "u";
const Yt = { isIE: _e && (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0), isOpera: _e && navigator.userAgent.indexOf("Opera") >= 0, isChrome: _e && navigator.userAgent.indexOf("Chrome") >= 0, isKHTML: _e && (navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0), isFF: _e && navigator.userAgent.indexOf("Firefox") >= 0, isIPad: _e && navigator.userAgent.search(/iPad/gi) >= 0, isEdge: _e && navigator.userAgent.indexOf("Edge") != -1, isNode: !_e || typeof navigator > "u" };
function Ae(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
  var i = "";
  for (var t in e) {
    var r = "";
    e.hasOwnProperty(t) && (r = t + "=" + (r = typeof e[t] == "string" ? encodeURIComponent(e[t]) : typeof e[t] == "number" ? e[t] : encodeURIComponent(JSON.stringify(e[t]))), i.length && (r = "&" + r), i += r);
  }
  return i;
}
function Vt(e) {
  var i = function(n, o) {
    for (var _ = "var temp=date.match(/[a-zA-Z]+|[0-9]+/g);", a = n.match(/%[a-zA-Z]/g), d = 0; d < a.length; d++)
      switch (a[d]) {
        case "%j":
        case "%d":
          _ += "set[2]=temp[" + d + "]||1;";
          break;
        case "%n":
        case "%m":
          _ += "set[1]=(temp[" + d + "]||1)-1;";
          break;
        case "%y":
          _ += "set[0]=temp[" + d + "]*1+(temp[" + d + "]>50?1900:2000);";
          break;
        case "%g":
        case "%G":
        case "%h":
        case "%H":
          _ += "set[3]=temp[" + d + "]||0;";
          break;
        case "%i":
          _ += "set[4]=temp[" + d + "]||0;";
          break;
        case "%Y":
          _ += "set[0]=temp[" + d + "]||0;";
          break;
        case "%a":
        case "%A":
          _ += "set[3]=set[3]%12+((temp[" + d + "]||'').toLowerCase()=='am'?0:12);";
          break;
        case "%s":
          _ += "set[5]=temp[" + d + "]||0;";
          break;
        case "%M":
          _ += "set[1]=this.locale.date.month_short_hash[temp[" + d + "]]||0;";
          break;
        case "%F":
          _ += "set[1]=this.locale.date.month_full_hash[temp[" + d + "]]||0;";
      }
    var l = "set[0],set[1],set[2],set[3],set[4],set[5]";
    return o && (l = " Date.UTC(" + l + ")"), new Function("date", "var set=[0,0,1,0,0,0]; " + _ + " return new Date(" + l + ");");
  }, t = function(n, o) {
    const _ = n.match(/%[a-zA-Z]/g);
    return function(a) {
      for (var d = [0, 0, 1, 0, 0, 0], l = a.match(/[a-zA-Z]+|[0-9]+/g), c = 0; c < _.length; c++)
        switch (_[c]) {
          case "%j":
          case "%d":
            d[2] = l[c] || 1;
            break;
          case "%n":
          case "%m":
            d[1] = (l[c] || 1) - 1;
            break;
          case "%y":
            d[0] = 1 * l[c] + (l[c] > 50 ? 1900 : 2e3);
            break;
          case "%g":
          case "%G":
          case "%h":
          case "%H":
            d[3] = l[c] || 0;
            break;
          case "%i":
            d[4] = l[c] || 0;
            break;
          case "%Y":
            d[0] = l[c] || 0;
            break;
          case "%a":
          case "%A":
            d[3] = d[3] % 12 + ((l[c] || "").toLowerCase() == "am" ? 0 : 12);
            break;
          case "%s":
            d[5] = l[c] || 0;
            break;
          case "%M":
            d[1] = e.locale.date.month_short_hash[l[c]] || 0;
            break;
          case "%F":
            d[1] = e.locale.date.month_full_hash[l[c]] || 0;
        }
      return o ? new Date(Date.UTC(d[0], d[1], d[2], d[3], d[4], d[5])) : new Date(d[0], d[1], d[2], d[3], d[4], d[5]);
    };
  };
  let r;
  function s() {
    var n = !1;
    return e.config.csp === "auto" ? (r === void 0 && (r = function() {
      try {
        new Function("cspEnabled = false;"), r = !1;
      } catch {
        r = !0;
      }
      return r;
    }()), n = r) : n = e.config.csp, n;
  }
  e.date = { init: function() {
    for (var n = e.locale.date.month_short, o = e.locale.date.month_short_hash = {}, _ = 0; _ < n.length; _++)
      o[n[_]] = _;
    for (n = e.locale.date.month_full, o = e.locale.date.month_full_hash = {}, _ = 0; _ < n.length; _++)
      o[n[_]] = _;
  }, date_part: function(n) {
    const o = new Date(n);
    var _ = new Date(o);
    return o.setHours(0), o.setMinutes(0), o.setSeconds(0), o.setMilliseconds(0), o.getHours() && (o.getDate() < _.getDate() || o.getMonth() < _.getMonth() || o.getFullYear() < _.getFullYear()) && o.setTime(o.getTime() + 36e5 * (24 - o.getHours())), o;
  }, time_part: function(n) {
    return (n.valueOf() / 1e3 - 60 * n.getTimezoneOffset()) % 86400;
  }, week_start: function(n) {
    var o = n.getDay();
    return e.config.start_on_monday && (o === 0 ? o = 6 : o--), this.date_part(this.add(n, -1 * o, "day"));
  }, month_start: function(n) {
    const o = new Date(n);
    return o.setDate(1), this.date_part(o);
  }, year_start: function(n) {
    const o = new Date(n);
    return o.setMonth(0), this.month_start(o);
  }, day_start: function(n) {
    const o = new Date(n);
    return this.date_part(o);
  }, _add_days: function(n, o) {
    var _ = new Date(n.valueOf());
    if (_.setDate(_.getDate() + o), o == Math.round(o) && o > 0) {
      var a = (+_ - +n) % 864e5;
      if (a && n.getTimezoneOffset() == _.getTimezoneOffset()) {
        var d = a / 36e5;
        _.setTime(_.getTime() + 60 * (24 - d) * 60 * 1e3);
      }
    }
    return o >= 0 && !n.getHours() && _.getHours() && (_.getDate() < n.getDate() || _.getMonth() < n.getMonth() || _.getFullYear() < n.getFullYear()) && _.setTime(_.getTime() + 36e5 * (24 - _.getHours())), _;
  }, add: function(n, o, _) {
    var a = new Date(n.valueOf());
    switch (_) {
      case "day":
        a = e.date._add_days(a, o);
        break;
      case "week":
        a = e.date._add_days(a, 7 * o);
        break;
      case "month":
        a.setMonth(a.getMonth() + o);
        break;
      case "year":
        a.setYear(a.getFullYear() + o);
        break;
      case "hour":
        a.setTime(a.getTime() + 60 * o * 60 * 1e3);
        break;
      case "minute":
        a.setTime(a.getTime() + 60 * o * 1e3);
        break;
      default:
        return e.date["add_" + _](n, o, _);
    }
    return a;
  }, to_fixed: function(n) {
    return n < 10 ? "0" + n : n;
  }, copy: function(n) {
    return new Date(n.valueOf());
  }, date_to_str: function(n, o) {
    return s() ? function(_, a) {
      return function(d) {
        return _.replace(/%[a-zA-Z]/g, function(l) {
          switch (l) {
            case "%d":
              return a ? e.date.to_fixed(d.getUTCDate()) : e.date.to_fixed(d.getDate());
            case "%m":
              return a ? e.date.to_fixed(d.getUTCMonth() + 1) : e.date.to_fixed(d.getMonth() + 1);
            case "%j":
              return a ? d.getUTCDate() : d.getDate();
            case "%n":
              return a ? d.getUTCMonth() + 1 : d.getMonth() + 1;
            case "%y":
              return a ? e.date.to_fixed(d.getUTCFullYear() % 100) : e.date.to_fixed(d.getFullYear() % 100);
            case "%Y":
              return a ? d.getUTCFullYear() : d.getFullYear();
            case "%D":
              return a ? e.locale.date.day_short[d.getUTCDay()] : e.locale.date.day_short[d.getDay()];
            case "%l":
              return a ? e.locale.date.day_full[d.getUTCDay()] : e.locale.date.day_full[d.getDay()];
            case "%M":
              return a ? e.locale.date.month_short[d.getUTCMonth()] : e.locale.date.month_short[d.getMonth()];
            case "%F":
              return a ? e.locale.date.month_full[d.getUTCMonth()] : e.locale.date.month_full[d.getMonth()];
            case "%h":
              return a ? e.date.to_fixed((d.getUTCHours() + 11) % 12 + 1) : e.date.to_fixed((d.getHours() + 11) % 12 + 1);
            case "%g":
              return a ? (d.getUTCHours() + 11) % 12 + 1 : (d.getHours() + 11) % 12 + 1;
            case "%G":
              return a ? d.getUTCHours() : d.getHours();
            case "%H":
              return a ? e.date.to_fixed(d.getUTCHours()) : e.date.to_fixed(d.getHours());
            case "%i":
              return a ? e.date.to_fixed(d.getUTCMinutes()) : e.date.to_fixed(d.getMinutes());
            case "%a":
              return a ? d.getUTCHours() > 11 ? "pm" : "am" : d.getHours() > 11 ? "pm" : "am";
            case "%A":
              return a ? d.getUTCHours() > 11 ? "PM" : "AM" : d.getHours() > 11 ? "PM" : "AM";
            case "%s":
              return a ? e.date.to_fixed(d.getUTCSeconds()) : e.date.to_fixed(d.getSeconds());
            case "%W":
              return a ? e.date.to_fixed(e.date.getUTCISOWeek(d)) : e.date.to_fixed(e.date.getISOWeek(d));
            default:
              return l;
          }
        });
      };
    }(n, o) : (n = n.replace(/%[a-zA-Z]/g, function(_) {
      switch (_) {
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
          return _;
      }
    }), o && (n = n.replace(/date\.get/g, "date.getUTC")), new Function("date", 'return "' + n + '";').bind(e));
  }, str_to_date: function(n, o, _) {
    var a = s() ? t : i, d = a(n, o), l = /^[0-9]{4}(\-|\/)[0-9]{2}(\-|\/)[0-9]{2} ?(([0-9]{1,2}:[0-9]{1,2})(:[0-9]{1,2})?)?$/, c = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4} ?(([0-9]{1,2}:[0-9]{2})(:[0-9]{1,2})?)?$/, f = /^[0-9]{2}\-[0-9]{2}\-[0-9]{4} ?(([0-9]{1,2}:[0-9]{1,2})(:[0-9]{1,2})?)?$/, v = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/, p = a("%Y-%m-%d %H:%i:%s", o), h = a("%m/%d/%Y %H:%i:%s", o), u = a("%d-%m-%Y %H:%i:%s", o);
    return function(m) {
      if (!_ && !e.config.parse_exact_format) {
        if (m && m.getISOWeek)
          return new Date(m);
        if (typeof m == "number")
          return new Date(m);
        if (y = m, l.test(String(y)))
          return p(m);
        if (function(w) {
          return c.test(String(w));
        }(m))
          return h(m);
        if (function(w) {
          return f.test(String(w));
        }(m))
          return u(m);
        if (function(w) {
          return v.test(w);
        }(m))
          return new Date(m);
      }
      var y;
      return d.call(e, m);
    };
  }, getISOWeek: function(n) {
    if (!n)
      return !1;
    var o = (n = this.date_part(new Date(n))).getDay();
    o === 0 && (o = 7);
    var _ = new Date(n.valueOf());
    _.setDate(n.getDate() + (4 - o));
    var a = _.getFullYear(), d = Math.round((_.getTime() - new Date(a, 0, 1).getTime()) / 864e5);
    return 1 + Math.floor(d / 7);
  }, getUTCISOWeek: function(n) {
    return this.getISOWeek(this.convert_to_utc(n));
  }, convert_to_utc: function(n) {
    return new Date(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), n.getUTCHours(), n.getUTCMinutes(), n.getUTCSeconds());
  } };
}
function mt(e) {
  return (function() {
    var i = {};
    for (var t in this._events) {
      var r = this._events[t];
      r.id.toString().indexOf("#") == -1 && (i[r.id] = r);
    }
    return i;
  }).bind(e);
}
function Ft(e) {
  e._loaded = {}, e._load = function(t, r) {
    if (t = t || this._load_url) {
      var s;
      if (t += (t.indexOf("?") == -1 ? "?" : "&") + "timeshift=" + (/* @__PURE__ */ new Date()).getTimezoneOffset(), this.config.prevent_cache && (t += "&uid=" + this.uid()), r = r || this._date, this._load_mode) {
        var n = this.templates.load_format;
        for (r = this.date[this._load_mode + "_start"](new Date(r.valueOf())); r > this._min_date; )
          r = this.date.add(r, -1, this._load_mode);
        s = r;
        for (var o = !0; s < this._max_date; )
          s = this.date.add(s, 1, this._load_mode), this._loaded[n(r)] && o ? r = this.date.add(r, 1, this._load_mode) : o = !1;
        var _ = s;
        do
          s = _, _ = this.date.add(s, -1, this._load_mode);
        while (_ > r && this._loaded[n(_)]);
        if (s <= r)
          return !1;
        for (e.ajax.get(t + "&from=" + n(r) + "&to=" + n(s), a); r < s; )
          this._loaded[n(r)] = !0, r = this.date.add(r, 1, this._load_mode);
      } else
        e.ajax.get(t, a);
      return this.callEvent("onXLS", []), this.callEvent("onLoadStart", []), !0;
    }
    function a(d) {
      e.on_load(d), e.callEvent("onLoadEnd", []);
    }
  }, e._parsers = {}, function(t) {
    t._parsers.xml = { canParse: function(r, s) {
      if (s.responseXML && s.responseXML.firstChild)
        return !0;
      try {
        var n = t.ajax.parse(s.responseText), o = t.ajax.xmltop("data", n);
        if (o && o.tagName === "data")
          return !0;
      } catch {
      }
      return !1;
    }, parse: function(r) {
      var s;
      if (r.xmlDoc.responseXML || (r.xmlDoc.responseXML = t.ajax.parse(r.xmlDoc.responseText)), (s = t.ajax.xmltop("data", r.xmlDoc)).tagName != "data")
        return null;
      var n = s.getAttribute("dhx_security");
      n && (window.dhtmlx && (window.dhtmlx.security_key = n), t.security_key = n);
      for (var o = t.ajax.xpath("//coll_options", r.xmlDoc), _ = 0; _ < o.length; _++) {
        var a = o[_].getAttribute("for"), d = t.serverList[a];
        d || (t.serverList[a] = d = []), d.splice(0, d.length);
        for (var l = t.ajax.xpath(".//item", o[_]), c = 0; c < l.length; c++) {
          for (var f = l[c].attributes, v = { key: l[c].getAttribute("value"), label: l[c].getAttribute("label") }, p = 0; p < f.length; p++) {
            var h = f[p];
            h.nodeName != "value" && h.nodeName != "label" && (v[h.nodeName] = h.nodeValue);
          }
          d.push(v);
        }
      }
      o.length && t.callEvent("onOptionsLoad", []);
      var u = t.ajax.xpath("//userdata", r.xmlDoc);
      for (_ = 0; _ < u.length; _++) {
        var m = t._xmlNodeToJSON(u[_]);
        t._userdata[m.name] = m.text;
      }
      var y = [];
      for (s = t.ajax.xpath("//event", r.xmlDoc), _ = 0; _ < s.length; _++) {
        var w = y[_] = t._xmlNodeToJSON(s[_]);
        t._init_event(w);
      }
      return y;
    } };
  }(e), function(t) {
    t.json = t._parsers.json = { canParse: function(r) {
      if (r && typeof r == "object")
        return !0;
      if (typeof r == "string")
        try {
          var s = JSON.parse(r);
          return Object.prototype.toString.call(s) === "[object Object]" || Object.prototype.toString.call(s) === "[object Array]";
        } catch {
          return !1;
        }
      return !1;
    }, parse: function(r) {
      var s = [];
      typeof r == "string" && (r = JSON.parse(r)), Object.prototype.toString.call(r) === "[object Array]" ? s = r : r && (r.events ? s = r.events : r.data && (s = r.data)), s = s || [], r.dhx_security && (window.dhtmlx && (window.dhtmlx.security_key = r.dhx_security), t.security_key = r.dhx_security);
      var n = r && r.collections ? r.collections : {}, o = !1;
      for (var _ in n)
        if (n.hasOwnProperty(_)) {
          o = !0;
          var a = n[_], d = t.serverList[_];
          d || (t.serverList[_] = d = []), d.splice(0, d.length);
          for (var l = 0; l < a.length; l++) {
            var c = a[l], f = { key: c.value, label: c.label };
            for (var v in c)
              if (c.hasOwnProperty(v)) {
                if (v == "value" || v == "label")
                  continue;
                f[v] = c[v];
              }
            d.push(f);
          }
        }
      o && t.callEvent("onOptionsLoad", []);
      for (var p = [], h = 0; h < s.length; h++) {
        var u = s[h];
        t._init_event(u), p.push(u);
      }
      return p;
    } };
  }(e), function(t) {
    t.ical = t._parsers.ical = { canParse: function(r) {
      return typeof r == "string" && new RegExp("^BEGIN:VCALENDAR").test(r);
    }, parse: function(r) {
      var s = r.match(RegExp(this.c_start + "[^\f]*" + this.c_end, ""));
      if (s.length) {
        s[0] = s[0].replace(/[\r\n]+ /g, ""), s[0] = s[0].replace(/[\r\n]+(?=[a-z \t])/g, " "), s[0] = s[0].replace(/;[^:\r\n]*:/g, ":");
        for (var n, o = [], _ = RegExp("(?:" + this.e_start + ")([^\f]*?)(?:" + this.e_end + ")", "g"); (n = _.exec(s)) !== null; ) {
          for (var a, d = {}, l = /[^\r\n]+[\r\n]+/g; (a = l.exec(n[1])) !== null; )
            this.parse_param(a.toString(), d);
          d.uid && !d.id && (d.id = d.uid), o.push(d);
        }
        return o;
      }
    }, parse_param: function(r, s) {
      var n = r.indexOf(":");
      if (n != -1) {
        var o = r.substr(0, n).toLowerCase(), _ = r.substr(n + 1).replace(/\\,/g, ",").replace(/[\r\n]+$/, "");
        o == "summary" ? o = "text" : o == "dtstart" ? (o = "start_date", _ = this.parse_date(_, 0, 0)) : o == "dtend" && (o = "end_date", _ = this.parse_date(_, 0, 0)), s[o] = _;
      }
    }, parse_date: function(r, s, n) {
      var o = r.split("T"), _ = !1;
      o[1] && (s = o[1].substr(0, 2), n = o[1].substr(2, 2), _ = o[1][6] == "Z");
      var a = o[0].substr(0, 4), d = parseInt(o[0].substr(4, 2), 10) - 1, l = o[0].substr(6, 2);
      return t.config.server_utc || _ ? new Date(Date.UTC(a, d, l, s, n)) : new Date(a, d, l, s, n);
    }, c_start: "BEGIN:VCALENDAR", e_start: "BEGIN:VEVENT", e_end: "END:VEVENT", c_end: "END:VCALENDAR" };
  }(e), e.on_load = function(t) {
    var r;
    this.callEvent("onBeforeParse", []);
    var s = !1, n = !1;
    for (var o in this._parsers) {
      var _ = this._parsers[o];
      if (_.canParse(t.xmlDoc.responseText, t.xmlDoc)) {
        try {
          var a = t.xmlDoc.responseText;
          o === "xml" && (a = t), (r = _.parse(a)) || (s = !0);
        } catch {
          s = !0;
        }
        n = !0;
        break;
      }
    }
    if (!n)
      if (this._process && this[this._process])
        try {
          r = this[this._process].parse(t.xmlDoc.responseText);
        } catch {
          s = !0;
        }
      else
        s = !0;
    (s || t.xmlDoc.status && t.xmlDoc.status >= 400) && (this.callEvent("onLoadError", [t.xmlDoc]), r = []), this._process_loading(r), this.callEvent("onXLE", []), this.callEvent("onParse", []);
  }, e._process_loading = function(t) {
    this._loading = !0, this._not_render = !0;
    for (var r = 0; r < t.length; r++)
      this.callEvent("onEventLoading", [t[r]]) && this.addEvent(t[r]);
    this._not_render = !1, this._render_wait && this.render_view_data(), this._loading = !1, this._after_call && this._after_call(), this._after_call = null;
  }, e._init_event = function(t) {
    t.text = t.text || t._tagvalue || "", t.start_date = e._init_date(t.start_date), t.end_date = e._init_date(t.end_date);
  }, e._init_date = function(t) {
    return t ? typeof t == "string" ? e._helpers.parseDate(t) : new Date(t) : null;
  };
  const i = mt(e);
  e.serialize = function() {
    const t = [], r = i();
    for (var s in r) {
      const _ = {};
      var n = r[s];
      for (var o in n) {
        if (o.charAt(0) == "$" || o.charAt(0) == "_")
          continue;
        let a;
        const d = n[o];
        a = e.utils.isDate(d) ? e.defined(e.templates.xml_format) ? e.templates.xml_format(d) : e.templates.format_date(d) : d, _[o] = a;
      }
      t.push(_);
    }
    return t;
  }, e.parse = function(t, r) {
    this._process = r, this.on_load({ xmlDoc: { responseText: t } });
  }, e.load = function(t, r) {
    typeof r == "string" && (this._process = r, r = arguments[2]), this._load_url = t, this._after_call = r, this._load(t, this._date);
  }, e.setLoadMode = function(t) {
    t == "all" && (t = ""), this._load_mode = t;
  }, e.serverList = function(t, r) {
    return r ? (this.serverList[t] = r.slice(0), this.serverList[t]) : (this.serverList[t] = this.serverList[t] || [], this.serverList[t]);
  }, e._userdata = {}, e._xmlNodeToJSON = function(t) {
    for (var r = {}, s = 0; s < t.attributes.length; s++)
      r[t.attributes[s].name] = t.attributes[s].value;
    for (s = 0; s < t.childNodes.length; s++) {
      var n = t.childNodes[s];
      n.nodeType == 1 && (r[n.tagName] = n.firstChild ? n.firstChild.nodeValue : "");
    }
    return r.text || (r.text = t.firstChild ? t.firstChild.nodeValue : ""), r;
  }, e.attachEvent("onXLS", function() {
    var t;
    this.config.show_loading === !0 && ((t = this.config.show_loading = document.createElement("div")).className = "dhx_loading", t.style.left = Math.round((this._x - 128) / 2) + "px", t.style.top = Math.round((this._y - 15) / 2) + "px", this._obj.appendChild(t));
  }), e.attachEvent("onXLE", function() {
    var t = this.config.show_loading;
    t && typeof t == "object" && (t.parentNode && t.parentNode.removeChild(t), this.config.show_loading = !0);
  });
}
function Bt(e) {
  e._init_touch_events = function() {
    if ((this.config.touch && (navigator.userAgent.indexOf("Mobile") != -1 || navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("Android") != -1 || navigator.userAgent.indexOf("Touch") != -1) && !window.MSStream || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && (this.xy.scroll_width = 0, this._mobile = !0), this.config.touch) {
      var i = !0;
      try {
        document.createEvent("TouchEvent");
      } catch {
        i = !1;
      }
      i ? this._touch_events(["touchmove", "touchstart", "touchend"], function(t) {
        return t.touches && t.touches.length > 1 ? null : t.touches[0] ? { target: t.target, pageX: t.touches[0].pageX, pageY: t.touches[0].pageY, clientX: t.touches[0].clientX, clientY: t.touches[0].clientY } : t;
      }, function() {
        return !1;
      }) : window.PointerEvent || window.navigator.pointerEnabled ? this._touch_events(["pointermove", "pointerdown", "pointerup"], function(t) {
        return t.pointerType == "mouse" ? null : t;
      }, function(t) {
        return !t || t.pointerType == "mouse";
      }) : window.navigator.msPointerEnabled && this._touch_events(["MSPointerMove", "MSPointerDown", "MSPointerUp"], function(t) {
        return t.pointerType == t.MSPOINTER_TYPE_MOUSE ? null : t;
      }, function(t) {
        return !t || t.pointerType == t.MSPOINTER_TYPE_MOUSE;
      });
    }
  }, e._touch_events = function(i, t, r) {
    var s, n, o, _, a, d, l = 0;
    function c(v, p, h) {
      e.event(v, p, function(u) {
        return !!e._is_lightbox_open() || (r(u) ? void 0 : h(u));
      }, { passive: !1 });
    }
    function f(v) {
      r(v) || (e._hide_global_tip(), _ && (e._on_mouse_up(t(v)), e._temp_touch_block = !1), e._drag_id = null, e._drag_mode = null, e._drag_pos = null, e._pointerDragId = null, clearTimeout(o), _ = d = !1, a = !0);
    }
    c(document.body, i[0], function(v) {
      if (!r(v)) {
        var p = t(v);
        if (p) {
          if (_)
            return function(h) {
              if (!r(h)) {
                var u = e.getState().drag_mode, m = !!e.matrix && e.matrix[e._mode], y = e.render_view_data;
                u == "create" && m && (e.render_view_data = function() {
                  for (var w = e.getState().drag_id, D = e.getEvent(w), E = m.y_property, S = e.getEvents(D.start_date, D.end_date), g = 0; g < S.length; g++)
                    S[g][E] != D[E] && (S.splice(g, 1), g--);
                  D._sorder = S.length - 1, D._count = S.length, this.render_data([D], e.getState().mode);
                }), e._on_mouse_move(h), u == "create" && m && (e.render_view_data = y), h.preventDefault && h.preventDefault(), h.cancelBubble = !0;
              }
            }(p), v.preventDefault && v.preventDefault(), v.cancelBubble = !0, e._update_global_tip(), !1;
          n = t(v), d && (n ? (s.target != n.target || Math.abs(s.pageX - n.pageX) > 5 || Math.abs(s.pageY - n.pageY) > 5) && (a = !0, clearTimeout(o)) : a = !0);
        }
      }
    }), c(this._els.dhx_cal_data[0], "touchcancel", f), c(this._els.dhx_cal_data[0], "contextmenu", function(v) {
      if (!r(v))
        return d ? (v && v.preventDefault && v.preventDefault(), v.cancelBubble = !0, !1) : void 0;
    }), c(this._obj, i[1], function(v) {
      var p;
      if (document && document.body && document.body.classList.add("dhx_cal_touch_active"), !r(v))
        if (e._pointerDragId = v.pointerId, _ = a = !1, d = !0, p = n = t(v)) {
          var h = /* @__PURE__ */ new Date();
          if (!a && !_ && h - l < 250)
            return e._click.dhx_cal_data(p), window.setTimeout(function() {
              e.$destroyed || e._on_dbl_click(p);
            }, 50), v.preventDefault && v.preventDefault(), v.cancelBubble = !0, e._block_next_stop = !0, !1;
          if (l = h, !a && !_ && e.config.touch_drag) {
            var u = e._locate_event(document.activeElement), m = e._locate_event(p.target), y = s ? e._locate_event(s.target) : null;
            if (u && m && u == m && u != y)
              return v.preventDefault && v.preventDefault(), v.cancelBubble = !0, e._ignore_next_click = !1, e._click.dhx_cal_data(p), s = p, !1;
            o = setTimeout(function() {
              if (!e.$destroyed) {
                _ = !0;
                var w = s.target, D = e._getClassName(w);
                w && D.indexOf("dhx_body") != -1 && (w = w.previousSibling), e._on_mouse_down(s, w), e._drag_mode && e._drag_mode != "create" && e.for_rendered(e._drag_id, function(E, S) {
                  E.style.display = "none", e._rendered.splice(S, 1);
                }), e.config.touch_tip && e._show_global_tip(), e.updateEvent(e._drag_id);
              }
            }, e.config.touch_drag), s = p;
          }
        } else
          a = !0;
    }), c(this._els.dhx_cal_data[0], i[2], function(v) {
      if (document && document.body && document.body.classList.remove("dhx_cal_touch_active"), !r(v))
        return e.config.touch_swipe_dates && !_ && function(p, h, u, m) {
          if (!p || !h)
            return !1;
          for (var y = p.target; y && y != e._obj; )
            y = y.parentNode;
          if (y != e._obj || e.matrix && e.matrix[e.getState().mode] && e.matrix[e.getState().mode].scrollable)
            return !1;
          var w = Math.abs(p.pageY - h.pageY), D = Math.abs(p.pageX - h.pageX);
          return w < m && D > u && (!w || D / w > 3) && (p.pageX > h.pageX ? e._click.dhx_cal_next_button() : e._click.dhx_cal_prev_button(), !0);
        }(s, n, 200, 100) && (e._block_next_stop = !0), _ && (e._ignore_next_click = !0, setTimeout(function() {
          e._ignore_next_click = !1;
        }, 100)), f(v), e._block_next_stop ? (e._block_next_stop = !1, v.preventDefault && v.preventDefault(), v.cancelBubble = !0, !1) : void 0;
    }), e.event(document.body, i[2], f);
  }, e._show_global_tip = function() {
    e._hide_global_tip();
    var i = e._global_tip = document.createElement("div");
    i.className = "dhx_global_tip", e._update_global_tip(1), document.body.appendChild(i);
  }, e._update_global_tip = function(i) {
    var t = e._global_tip;
    if (t) {
      var r = "";
      if (e._drag_id && !i) {
        var s = e.getEvent(e._drag_id);
        s && (r = "<div>" + (s._timed ? e.templates.event_header(s.start_date, s.end_date, s) : e.templates.day_date(s.start_date, s.end_date, s)) + "</div>");
      }
      e._drag_mode == "create" || e._drag_mode == "new-size" ? t.innerHTML = (e.locale.labels.drag_to_create || "Drag to create") + r : t.innerHTML = (e.locale.labels.drag_to_move || "Drag to move") + r;
    }
  }, e._hide_global_tip = function() {
    var i = e._global_tip;
    i && i.parentNode && (i.parentNode.removeChild(i), e._global_tip = 0);
  };
}
function Jt(e) {
  var i, t;
  function r() {
    if (e._is_material_skin())
      return !0;
    if (t !== void 0)
      return t;
    var _ = document.createElement("div");
    _.style.position = "absolute", _.style.left = "-9999px", _.style.top = "-9999px", _.innerHTML = "<div class='dhx_cal_container'><div class='dhx_cal_data'><div class='dhx_cal_event'><div class='dhx_body'></div></div><div>", document.body.appendChild(_);
    var a = window.getComputedStyle(_.querySelector(".dhx_body")).getPropertyValue("box-sizing");
    document.body.removeChild(_), (t = a === "border-box") || setTimeout(function() {
      t = void 0;
    }, 1e3);
  }
  function s() {
    if (!e._is_material_skin() && !e._border_box_events()) {
      var _ = t;
      t = void 0, i = void 0, _ !== r() && e.$container && e.getState().mode && e.setCurrentView();
    }
  }
  function n(_) {
    var a = _.getMinutes();
    return a = a < 10 ? "0" + a : a, "<span class='dhx_scale_h'>" + _.getHours() + "</span><span class='dhx_scale_m'>&nbsp;" + a + "</span>";
  }
  e._addThemeClass = function() {
    document.documentElement.setAttribute("data-scheduler-theme", e.skin);
  }, e._skin_settings = { fix_tab_position: [1, 0], use_select_menu_space: [1, 0], wide_form: [1, 0], hour_size_px: [44, 42], displayed_event_color: ["#ff4a4a", "ffc5ab"], displayed_event_text_color: ["#ffef80", "7e2727"] }, e._skin_xy = { lightbox_additional_height: [90, 50], nav_height: [59, 22], bar_height: [24, 20] }, e._is_material_skin = function() {
    return e.skin ? (e.skin + "").indexOf("material") > -1 : function() {
      if (i === void 0) {
        var _ = document.createElement("div");
        _.style.position = "absolute", _.style.left = "-9999px", _.style.top = "-9999px", _.innerHTML = "<div class='dhx_cal_container'><div class='dhx_cal_scale_placeholder'></div><div>", document.body.appendChild(_);
        var a = window.getComputedStyle(_.querySelector(".dhx_cal_scale_placeholder")).getPropertyValue("position");
        i = a === "absolute", setTimeout(function() {
          i = null, _ && _.parentNode && _.parentNode.removeChild(_);
        }, 500);
      }
      return i;
    }();
  }, e._build_skin_info = function() {
    (function() {
      const v = e.$container;
      clearInterval(o), v && (o = setInterval(() => {
        const p = getComputedStyle(v).getPropertyValue("--dhx-scheduler-theme");
        p && p !== e.skin && e.setSkin(p);
      }, 100));
    })();
    const _ = getComputedStyle(this.$container), a = _.getPropertyValue("--dhx-scheduler-theme");
    let d, l = !!a, c = {}, f = !1;
    if (l) {
      d = a;
      for (let v in e.xy)
        c[v] = _.getPropertyValue(`--dhx-scheduler-xy-${v}`);
      c.hour_size_px = _.getPropertyValue("--dhx-scheduler-config-hour_size_px"), c.wide_form = _.getPropertyValue("--dhx-scheduler-config-form_wide");
    } else
      d = function() {
        for (var v = document.getElementsByTagName("link"), p = 0; p < v.length; p++) {
          var h = v[p].href.match("dhtmlxscheduler_([a-z]+).css");
          if (h)
            return h[1];
        }
      }(), f = e._is_material_skin();
    if (e._theme_info = { theme: d, cssVarTheme: l, oldMaterialTheme: f, values: c }, e._theme_info.cssVarTheme) {
      const v = this._theme_info.values;
      for (let p in e.xy)
        isNaN(parseInt(v[p])) || (e.xy[p] = parseInt(v[p]));
    }
  }, e.event(window, "DOMContentLoaded", s), e.event(window, "load", s), e._border_box_events = function() {
    return r();
  }, e._configure = function(_, a, d) {
    for (var l in a)
      _[l] === void 0 && (_[l] = a[l][d]);
  }, e.setSkin = function(_) {
    this.skin = _, e._addThemeClass(), e.$container && (this._skin_init(), this.render());
  };
  let o = null;
  e.attachEvent("onDestroy", function() {
    clearInterval(o);
  }), e._skin_init = function() {
    this._build_skin_info(), this.skin || (this.skin = this._theme_info.theme), e._addThemeClass(), e.skin === "flat" ? e.templates.hour_scale = n : e.templates.hour_scale === n && (e.templates.hour_scale = e.date.date_to_str(e.config.hour_date)), e.attachEvent("onTemplatesReady", function() {
      var _ = e.date.date_to_str("%d");
      e.templates._old_month_day || (e.templates._old_month_day = e.templates.month_day);
      var a = e.templates._old_month_day;
      e.templates.month_day = function(d) {
        if (this._mode == "month") {
          var l = _(d);
          return d.getDate() == 1 && (l = e.locale.date.month_full[d.getMonth()] + " " + l), +d == +e.date.date_part(this._currentDate()) && (l = e.locale.labels.dhx_cal_today_button + " " + l), l;
        }
        return a.call(this, d);
      }, e.config.fix_tab_position && (e._els.dhx_cal_navline[0].querySelectorAll("[data-tab]").forEach((d) => {
        switch (d.getAttribute("data-tab") || d.getAttribute("name")) {
          case "day":
          case "day_tab":
            d.classList.add("dhx_cal_tab_first"), d.classList.add("dhx_cal_tab_segmented");
            break;
          case "week":
          case "week_tab":
            d.classList.add("dhx_cal_tab_segmented");
            break;
          case "month":
          case "month_tab":
            d.classList.add("dhx_cal_tab_last"), d.classList.add("dhx_cal_tab_segmented");
            break;
          default:
            d.classList.add("dhx_cal_tab_standalone");
        }
      }), function(d) {
        if (e.config.header)
          return;
        const l = Array.from(d.querySelectorAll(".dhx_cal_tab")), c = ["day", "week", "month"].map((v) => l.find((p) => p.getAttribute("data-tab") === v)).filter((v) => v !== void 0);
        let f = l.length > 0 ? l[0] : null;
        c.reverse().forEach((v) => {
          d.insertBefore(v, f), f = v;
        });
      }(e._els.dhx_cal_navline[0]));
    }, { once: !0 });
  };
}
function Wt(e, i) {
  this.$scheduler = e, this.$dp = i, this._dataProcessorHandlers = [], this.attach = function() {
    var t = this.$dp, r = this.$scheduler;
    this._dataProcessorHandlers.push(r.attachEvent("onEventAdded", function(s) {
      !this._loading && this._validId(s) && t.setUpdated(s, !0, "inserted");
    })), this._dataProcessorHandlers.push(r.attachEvent("onConfirmedBeforeEventDelete", function(s) {
      if (this._validId(s)) {
        var n = t.getState(s);
        return n == "inserted" || this._new_event ? (t.setUpdated(s, !1), !0) : n != "deleted" && (n == "true_deleted" || (t.setUpdated(s, !0, "deleted"), !1));
      }
    })), this._dataProcessorHandlers.push(r.attachEvent("onEventChanged", function(s) {
      !this._loading && this._validId(s) && t.setUpdated(s, !0, "updated");
    })), this._dataProcessorHandlers.push(r.attachEvent("onClearAll", function() {
      t._in_progress = {}, t._invalid = {}, t.updatedRows = [], t._waitMode = 0;
    })), t.attachEvent("insertCallback", r._update_callback), t.attachEvent("updateCallback", r._update_callback), t.attachEvent("deleteCallback", function(s, n) {
      r.getEvent(n) ? (r.setUserData(n, this.action_param, "true_deleted"), r.deleteEvent(n)) : r._add_rec_marker && r._update_callback(s, n);
    });
  }, this.detach = function() {
    for (var t in this._dataProcessorHandlers) {
      var r = this._dataProcessorHandlers[t];
      this.$scheduler.detachEvent(r);
    }
    this._dataProcessorHandlers = [];
  };
}
function He(e) {
  return this.serverProcessor = e, this.action_param = "!nativeeditor_status", this.object = null, this.updatedRows = [], this.autoUpdate = !0, this.updateMode = "cell", this._tMode = "GET", this._headers = null, this._payload = null, this.post_delim = "_", this._waitMode = 0, this._in_progress = {}, this._invalid = {}, this.messages = [], this.styles = { updated: "font-weight:bold;", inserted: "font-weight:bold;", deleted: "text-decoration : line-through;", invalid: "background-color:FFE0E0;", invalid_cell: "border-bottom:2px solid red;", error: "color:red;", clear: "font-weight:normal;text-decoration:none;" }, this.enableUTFencoding(!0), Ve(this), this;
}
function Kt(e) {
  var i = "data-dhxbox", t = null;
  function r(m, y, w) {
    var D = m.callback;
    D && D(y, w), p.hide(m.box), t = m.box = null;
  }
  function s(m) {
    if (t) {
      var y = m.which || m.keyCode, w = !1;
      if (h.keyboard) {
        if (y == 13 || y == 32) {
          var D = m.target || m.srcElement;
          ce.getClassName(D).indexOf("scheduler_popup_button") > -1 && D.click ? D.click() : (r(t, !0), w = !0);
        }
        y == 27 && (r(t, !1), w = !0);
      }
      return w ? (m.preventDefault && m.preventDefault(), !(m.cancelBubble = !0)) : void 0;
    }
  }
  function n(m) {
    n.cover || (n.cover = document.createElement("div"), e.event(n.cover, "keydown", s), n.cover.className = "dhx_modal_cover", document.body.appendChild(n.cover)), n.cover.style.display = m ? "inline-block" : "none";
  }
  function o(m, y, w) {
    var D = e._waiAria.messageButtonAttrString(m), E = (y || "").toLowerCase().replace(/ /g, "_");
    return `<div ${D} class='scheduler_popup_button dhtmlx_popup_button ${`scheduler_${E}_button dhtmlx_${E}_button`}' data-result='${w}' result='${w}' ><div>${m}</div></div>`;
  }
  function _() {
    for (var m = [].slice.apply(arguments, [0]), y = 0; y < m.length; y++)
      if (m[y])
        return m[y];
  }
  function a(m, y, w) {
    var D = m.tagName ? m : function(g, b, x) {
      var k = document.createElement("div"), M = ae.uid();
      e._waiAria.messageModalAttr(k, M), k.className = " scheduler_modal_box dhtmlx_modal_box scheduler-" + g.type + " dhtmlx-" + g.type, k.setAttribute(i, 1);
      var N = "";
      if (g.width && (k.style.width = g.width), g.height && (k.style.height = g.height), g.title && (N += '<div class="scheduler_popup_title dhtmlx_popup_title">' + g.title + "</div>"), N += '<div class="scheduler_popup_text dhtmlx_popup_text" id="' + M + '"><span>' + (g.content ? "" : g.text) + '</span></div><div  class="scheduler_popup_controls dhtmlx_popup_controls">', b && (N += o(_(g.ok, e.locale.labels.message_ok, "OK"), "ok", !0)), x && (N += o(_(g.cancel, e.locale.labels.message_cancel, "Cancel"), "cancel", !1)), g.buttons)
        for (var T = 0; T < g.buttons.length; T++) {
          var A = g.buttons[T];
          N += typeof A == "object" ? o(A.label, A.css || "scheduler_" + A.label.toLowerCase() + "_button dhtmlx_" + A.label.toLowerCase() + "_button", A.value || T) : o(A, A, T);
        }
      if (N += "</div>", k.innerHTML = N, g.content) {
        var C = g.content;
        typeof C == "string" && (C = document.getElementById(C)), C.style.display == "none" && (C.style.display = ""), k.childNodes[g.title ? 1 : 0].appendChild(C);
      }
      return e.event(k, "click", function($) {
        var O = $.target || $.srcElement;
        if (O.className || (O = O.parentNode), ce.closest(O, ".scheduler_popup_button")) {
          var j = O.getAttribute("data-result");
          r(g, j = j == "true" || j != "false" && j, $);
        }
      }), g.box = k, (b || x) && (t = g), k;
    }(m, y, w);
    m.hidden || n(!0), document.body.appendChild(D);
    var E = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - D.offsetWidth) / 2)), S = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - D.offsetHeight) / 2));
    return m.position == "top" ? D.style.top = "-3px" : D.style.top = S + "px", D.style.left = E + "px", e.event(D, "keydown", s), p.focus(D), m.hidden && p.hide(D), e.callEvent("onMessagePopup", [D]), D;
  }
  function d(m) {
    return a(m, !0, !1);
  }
  function l(m) {
    return a(m, !0, !0);
  }
  function c(m) {
    return a(m);
  }
  function f(m, y, w) {
    return typeof m != "object" && (typeof y == "function" && (w = y, y = ""), m = { text: m, type: y, callback: w }), m;
  }
  function v(m, y, w, D, E) {
    return typeof m != "object" && (m = { text: m, type: y, expire: w, id: D, callback: E }), m.id = m.id || ae.uid(), m.expire = m.expire || h.expire, m;
  }
  e.event(document, "keydown", s, !0);
  var p = function() {
    var m = f.apply(this, arguments);
    return m.type = m.type || "alert", c(m);
  };
  p.hide = function(m) {
    for (; m && m.getAttribute && !m.getAttribute(i); )
      m = m.parentNode;
    m && (m.parentNode.removeChild(m), n(!1), e.callEvent("onAfterMessagePopup", [m]));
  }, p.focus = function(m) {
    setTimeout(function() {
      var y = ce.getFocusableNodes(m);
      y.length && y[0].focus && y[0].focus();
    }, 1);
  };
  var h = function(m, y, w, D) {
    switch ((m = v.apply(this, arguments)).type = m.type || "info", m.type.split("-")[0]) {
      case "alert":
        return d(m);
      case "confirm":
        return l(m);
      case "modalbox":
        return c(m);
      default:
        return function(E) {
          h.area || (h.area = document.createElement("div"), h.area.className = "scheduler_message_area dhtmlx_message_area", h.area.style[h.position] = "5px", document.body.appendChild(h.area)), h.hide(E.id);
          var S = document.createElement("div");
          return S.innerHTML = "<div>" + E.text + "</div>", S.className = "scheduler-info dhtmlx-info scheduler-" + E.type + " dhtmlx-" + E.type, e.event(S, "click", function(g) {
            E.callback && E.callback.call(this, g), h.hide(E.id), E = null;
          }), e._waiAria.messageInfoAttr(S), h.position == "bottom" && h.area.firstChild ? h.area.insertBefore(S, h.area.firstChild) : h.area.appendChild(S), E.expire > 0 && (h.timers[E.id] = window.setTimeout(function() {
            h && h.hide(E.id);
          }, E.expire)), h.pull[E.id] = S, S = null, E.id;
        }(m);
    }
  };
  h.seed = (/* @__PURE__ */ new Date()).valueOf(), h.uid = ae.uid, h.expire = 4e3, h.keyboard = !0, h.position = "top", h.pull = {}, h.timers = {}, h.hideAll = function() {
    for (var m in h.pull)
      h.hide(m);
  }, h.hide = function(m) {
    var y = h.pull[m];
    y && y.parentNode && (window.setTimeout(function() {
      y.parentNode.removeChild(y), y = null;
    }, 2e3), y.className += " hidden", h.timers[m] && window.clearTimeout(h.timers[m]), delete h.pull[m]);
  };
  var u = [];
  return e.attachEvent("onMessagePopup", function(m) {
    u.push(m);
  }), e.attachEvent("onAfterMessagePopup", function(m) {
    for (var y = 0; y < u.length; y++)
      u[y] === m && (u.splice(y, 1), y--);
  }), e.attachEvent("onDestroy", function() {
    n.cover && n.cover.parentNode && n.cover.parentNode.removeChild(n.cover);
    for (var m = 0; m < u.length; m++)
      u[m].parentNode && u[m].parentNode.removeChild(u[m]);
    u = null, h.area && h.area.parentNode && h.area.parentNode.removeChild(h.area), h = null;
  }), { alert: function() {
    var m = f.apply(this, arguments);
    return m.type = m.type || "confirm", d(m);
  }, confirm: function() {
    var m = f.apply(this, arguments);
    return m.type = m.type || "alert", l(m);
  }, message: h, modalbox: p };
}
He.prototype = { setTransactionMode: function(e, i) {
  typeof e == "object" ? (this._tMode = e.mode || this._tMode, e.headers !== void 0 && (this._headers = e.headers), e.payload !== void 0 && (this._payload = e.payload), this._tSend = !!i) : (this._tMode = e, this._tSend = i), this._tMode == "REST" && (this._tSend = !1, this._endnm = !0), this._tMode === "JSON" || this._tMode === "REST-JSON" ? (this._tSend = !1, this._endnm = !0, this._serializeAsJson = !0, this._headers = this._headers || {}, this._headers["Content-Type"] = "application/json") : this._headers && !this._headers["Content-Type"] && (this._headers["Content-Type"] = "application/x-www-form-urlencoded"), this._tMode === "CUSTOM" && (this._tSend = !1, this._endnm = !0, this._router = e.router);
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
}, setUpdateMode: function(e, i) {
  this.autoUpdate = e == "cell", this.updateMode = e, this.dnd = i;
}, ignore: function(e, i) {
  this._silent_mode = !0, e.call(i || window), this._silent_mode = !1;
}, setUpdated: function(e, i, t) {
  if (!this._silent_mode) {
    var r = this.findRow(e);
    t = t || "updated";
    var s = this.$scheduler.getUserData(e, this.action_param);
    s && t == "updated" && (t = s), i ? (this.set_invalid(e, !1), this.updatedRows[r] = e, this.$scheduler.setUserData(e, this.action_param, t), this._in_progress[e] && (this._in_progress[e] = "wait")) : this.is_invalid(e) || (this.updatedRows.splice(r, 1), this.$scheduler.setUserData(e, this.action_param, "")), this.markRow(e, i, t), i && this.autoUpdate && this.sendData(e);
  }
}, markRow: function(e, i, t) {
  var r = "", s = this.is_invalid(e);
  if (s && (r = this.styles[s], i = !0), this.callEvent("onRowMark", [e, i, t, s]) && (r = this.styles[i ? t : "clear"] + r, this.$scheduler[this._methods[0]](e, r), s && s.details)) {
    r += this.styles[s + "_cell"];
    for (var n = 0; n < s.details.length; n++)
      s.details[n] && this.$scheduler[this._methods[1]](e, n, r);
  }
}, getActionByState: function(e) {
  return e === "inserted" ? "create" : e === "updated" ? "update" : e === "deleted" ? "delete" : "update";
}, getState: function(e) {
  return this.$scheduler.getUserData(e, this.action_param);
}, is_invalid: function(e) {
  return this._invalid[e];
}, set_invalid: function(e, i, t) {
  t && (i = { value: i, details: t, toString: function() {
    return this.value.toString();
  } }), this._invalid[e] = i;
}, checkBeforeUpdate: function(e) {
  return !0;
}, sendData: function(e) {
  return this.$scheduler.editStop && this.$scheduler.editStop(), e === void 0 || this._tSend ? this.sendAllData() : !this._in_progress[e] && (this.messages = [], !(!this.checkBeforeUpdate(e) && this.callEvent("onValidationError", [e, this.messages])) && void this._beforeSendData(this._getRowData(e), e));
}, _beforeSendData: function(e, i) {
  if (!this.callEvent("onBeforeUpdate", [i, this.getState(i), e]))
    return !1;
  this._sendData(e, i);
}, serialize: function(e, i) {
  if (this._serializeAsJson)
    return this._serializeAsJSON(e);
  if (typeof e == "string")
    return e;
  if (i !== void 0)
    return this.serialize_one(e, "");
  var t = [], r = [];
  for (var s in e)
    e.hasOwnProperty(s) && (t.push(this.serialize_one(e[s], s + this.post_delim)), r.push(s));
  return t.push("ids=" + this.escape(r.join(","))), this.$scheduler.security_key && t.push("dhx_security=" + this.$scheduler.security_key), t.join("&");
}, serialize_one: function(e, i) {
  if (typeof e == "string")
    return e;
  var t = [], r = "";
  for (var s in e)
    if (e.hasOwnProperty(s)) {
      if ((s == "id" || s == this.action_param) && this._tMode == "REST")
        continue;
      r = typeof e[s] == "string" || typeof e[s] == "number" ? e[s] : JSON.stringify(e[s]), t.push(this.escape((i || "") + s) + "=" + this.escape(r));
    }
  return t.join("&");
}, _applyPayload: function(e) {
  var i = this.$scheduler.ajax;
  if (this._payload)
    for (var t in this._payload)
      e = e + i.urlSeparator(e) + this.escape(t) + "=" + this.escape(this._payload[t]);
  return e;
}, _sendData: function(e, i) {
  if (e) {
    if (!this.callEvent("onBeforeDataSending", i ? [i, this.getState(i), e] : [null, null, e]))
      return !1;
    i && (this._in_progress[i] = (/* @__PURE__ */ new Date()).valueOf());
    var t = this, r = this.$scheduler.ajax;
    if (this._tMode !== "CUSTOM") {
      var s, n = { callback: function(p) {
        var h = [];
        if (i)
          h.push(i);
        else if (e)
          for (var u in e)
            h.push(u);
        return t.afterUpdate(t, p, h);
      }, headers: t._headers }, o = this.serverProcessor + (this._user ? r.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + this.$scheduler.getUserData(0, "version")].join("&") : ""), _ = this._applyPayload(o);
      switch (this._tMode) {
        case "GET":
          s = this._cleanupArgumentsBeforeSend(e), n.url = _ + r.urlSeparator(_) + this.serialize(s, i), n.method = "GET";
          break;
        case "POST":
          s = this._cleanupArgumentsBeforeSend(e), n.url = _, n.method = "POST", n.data = this.serialize(s, i);
          break;
        case "JSON":
          s = {};
          var a = this._cleanupItemBeforeSend(e);
          for (var d in a)
            d !== this.action_param && d !== "id" && d !== "gr_id" && (s[d] = a[d]);
          n.url = _, n.method = "POST", n.data = JSON.stringify({ id: i, action: e[this.action_param], data: s });
          break;
        case "REST":
        case "REST-JSON":
          switch (_ = o.replace(/(&|\?)editing=true/, ""), s = "", this.getState(i)) {
            case "inserted":
              n.method = "POST", n.data = this.serialize(e, i);
              break;
            case "deleted":
              n.method = "DELETE", _ = _ + (_.slice(-1) === "/" ? "" : "/") + i;
              break;
            default:
              n.method = "PUT", n.data = this.serialize(e, i), _ = _ + (_.slice(-1) === "/" ? "" : "/") + i;
          }
          n.url = this._applyPayload(_);
      }
      return this._waitMode++, r.query(n);
    }
    {
      var l = this.getState(i), c = this.getActionByState(l), f = function(h) {
        var u = l;
        if (h && h.responseText && h.setRequestHeader) {
          h.status !== 200 && (u = "error");
          try {
            h = JSON.parse(h.responseText);
          } catch {
          }
        }
        u = u || "updated";
        var m = i, y = i;
        h && (u = h.action || u, m = h.sid || m, y = h.id || h.tid || y), t.afterUpdateCallback(m, y, u, h);
      };
      const p = "event";
      var v;
      if (this._router instanceof Function)
        v = this._router(p, c, e, i);
      else
        switch (l) {
          case "inserted":
            v = this._router[p].create(e);
            break;
          case "deleted":
            v = this._router[p].delete(i);
            break;
          default:
            v = this._router[p].update(e, i);
        }
      if (v) {
        if (!v.then && v.id === void 0 && v.tid === void 0 && v.action === void 0)
          throw new Error("Incorrect router return value. A Promise or a response object is expected");
        v.then ? v.then(f).catch(function(h) {
          h && h.action ? f(h) : f({ action: "error", value: h });
        }) : f(v);
      } else
        f(null);
    }
  }
}, sendAllData: function() {
  if (this.updatedRows.length && this.updateMode !== "off") {
    this.messages = [];
    var e = !0;
    if (this._forEachUpdatedRow(function(i) {
      e = e && this.checkBeforeUpdate(i);
    }), !e && !this.callEvent("onValidationError", ["", this.messages]))
      return !1;
    this._tSend ? this._sendData(this._getAllData()) : this._forEachUpdatedRow(function(i) {
      if (!this._in_progress[i]) {
        if (this.is_invalid(i))
          return;
        this._beforeSendData(this._getRowData(i), i);
      }
    });
  }
}, _getAllData: function(e) {
  var i = {}, t = !1;
  return this._forEachUpdatedRow(function(r) {
    if (!this._in_progress[r] && !this.is_invalid(r)) {
      var s = this._getRowData(r);
      this.callEvent("onBeforeUpdate", [r, this.getState(r), s]) && (i[r] = s, t = !0, this._in_progress[r] = (/* @__PURE__ */ new Date()).valueOf());
    }
  }), t ? i : null;
}, findRow: function(e) {
  var i = 0;
  for (i = 0; i < this.updatedRows.length && e != this.updatedRows[i]; i++)
    ;
  return i;
}, defineAction: function(e, i) {
  this._uActions || (this._uActions = {}), this._uActions[e] = i;
}, afterUpdateCallback: function(e, i, t, r) {
  if (this.$scheduler) {
    var s = e, n = t !== "error" && t !== "invalid";
    if (n || this.set_invalid(e, t), this._uActions && this._uActions[t] && !this._uActions[t](r))
      return delete this._in_progress[s];
    this._in_progress[s] !== "wait" && this.setUpdated(e, !1);
    var o = e;
    switch (t) {
      case "inserted":
      case "insert":
        i != e && (this.setUpdated(e, !1), this.$scheduler[this._methods[2]](e, i), e = i);
        break;
      case "delete":
      case "deleted":
        return this.$scheduler.setUserData(e, this.action_param, "true_deleted"), this.$scheduler[this._methods[3]](e, i), delete this._in_progress[s], this.callEvent("onAfterUpdate", [e, t, i, r]);
    }
    this._in_progress[s] !== "wait" ? (n && this.$scheduler.setUserData(e, this.action_param, ""), delete this._in_progress[s]) : (delete this._in_progress[s], this.setUpdated(i, !0, this.$scheduler.getUserData(e, this.action_param))), this.callEvent("onAfterUpdate", [o, t, i, r]);
  }
}, _errorResponse: function(e, i) {
  return this.$scheduler && this.$scheduler.callEvent && this.$scheduler.callEvent("onSaveError", [i, e.xmlDoc]), this.cleanUpdate(i);
}, _setDefaultTransactionMode: function() {
  this.serverProcessor && (this.setTransactionMode("POST", !0), this.serverProcessor += (this.serverProcessor.indexOf("?") !== -1 ? "&" : "?") + "editing=true", this._serverProcessor = this.serverProcessor);
}, afterUpdate: function(e, i, t) {
  var r = this.$scheduler.ajax;
  if (i.xmlDoc.status === 200) {
    var s;
    try {
      s = JSON.parse(i.xmlDoc.responseText);
    } catch {
      i.xmlDoc.responseText.length || (s = {});
    }
    if (s) {
      var n = s.action || this.getState(t) || "updated", o = s.sid || t[0], _ = s.tid || t[0];
      return e.afterUpdateCallback(o, _, n, s), void e.finalizeUpdate();
    }
    var a = r.xmltop("data", i.xmlDoc);
    if (!a)
      return this._errorResponse(i, t);
    var d = r.xpath("//data/action", a);
    if (!d.length)
      return this._errorResponse(i, t);
    for (var l = 0; l < d.length; l++) {
      var c = d[l];
      n = c.getAttribute("type"), o = c.getAttribute("sid"), _ = c.getAttribute("tid"), e.afterUpdateCallback(o, _, n, c);
    }
    e.finalizeUpdate();
  } else
    this._errorResponse(i, t);
}, cleanUpdate: function(e) {
  if (e)
    for (var i = 0; i < e.length; i++)
      delete this._in_progress[e[i]];
}, finalizeUpdate: function() {
  this._waitMode && this._waitMode--, this.callEvent("onAfterUpdateFinish", []), this.updatedRows.length || this.callEvent("onFullSync", []);
}, init: function(e) {
  if (!this._initialized) {
    this.$scheduler = e, this.$scheduler._dp_init && this.$scheduler._dp_init(this), this._setDefaultTransactionMode(), this._methods = this._methods || ["_set_event_text_style", "", "_dp_change_event_id", "_dp_hook_delete"], function(t, r) {
      t._validId = function(s) {
        return !this._is_virtual_event || !this._is_virtual_event(s);
      }, t.setUserData = function(s, n, o) {
        if (s) {
          var _ = this.getEvent(s);
          _ && (_[n] = o);
        } else
          this._userdata[n] = o;
      }, t.getUserData = function(s, n) {
        if (s) {
          var o = this.getEvent(s);
          return o ? o[n] : null;
        }
        return this._userdata[n];
      }, t._set_event_text_style = function(s, n) {
        if (t.getEvent(s)) {
          this.for_rendered(s, function(_) {
            _.style.cssText += ";" + n;
          });
          var o = this.getEvent(s);
          o._text_style = n, this.event_updated(o);
        }
      }, t._update_callback = function(s, n) {
        var o = t._xmlNodeToJSON(s.firstChild);
        o.rec_type == "none" && (o.rec_pattern = "none"), o.text = o.text || o._tagvalue, o.start_date = t._helpers.parseDate(o.start_date), o.end_date = t._helpers.parseDate(o.end_date), t.addEvent(o), t._add_rec_marker && t.setCurrentView();
      }, t._dp_change_event_id = function(s, n) {
        t.getEvent(s) && t.changeEventId(s, n);
      }, t._dp_hook_delete = function(s, n) {
        if (t.getEvent(s))
          return n && s != n && (this.getUserData(s, r.action_param) == "true_deleted" && this.setUserData(s, r.action_param, "updated"), this.changeEventId(s, n)), this.deleteEvent(n, !0);
      }, t.setDp = function() {
        this._dp = r;
      }, t.setDp();
    }(this.$scheduler, this);
    var i = new Wt(this.$scheduler, this);
    i.attach(), this.attachEvent("onDestroy", function() {
      delete this._getRowData, delete this.$scheduler._dp, delete this.$scheduler._dataprocessor, delete this.$scheduler._set_event_text_style, delete this.$scheduler._dp_change_event_id, delete this.$scheduler._dp_hook_delete, delete this.$scheduler, i.detach();
    }), this.$scheduler.callEvent("onDataProcessorReady", [this]), this._initialized = !0, e._dataprocessor = this;
  }
}, setOnAfterUpdate: function(e) {
  this.attachEvent("onAfterUpdate", e);
}, setOnBeforeUpdateHandler: function(e) {
  this.attachEvent("onBeforeDataSending", e);
}, setAutoUpdate: function(e, i) {
  e = e || 2e3, this._user = i || (/* @__PURE__ */ new Date()).valueOf(), this._need_update = !1, this._update_busy = !1, this.attachEvent("onAfterUpdate", function(s, n, o, _) {
    this.afterAutoUpdate(s, n, o, _);
  }), this.attachEvent("onFullSync", function() {
    this.fullSync();
  });
  var t = this;
  let r = de.setInterval(function() {
    t.loadUpdate();
  }, e);
  this.attachEvent("onDestroy", function() {
    clearInterval(r);
  });
}, afterAutoUpdate: function(e, i, t, r) {
  return i != "collision" || (this._need_update = !0, !1);
}, fullSync: function() {
  return this._need_update && (this._need_update = !1, this.loadUpdate()), !0;
}, getUpdates: function(e, i) {
  var t = this.$scheduler.ajax;
  if (this._update_busy)
    return !1;
  this._update_busy = !0, t.get(e, i);
}, _getXmlNodeValue: function(e) {
  return e.firstChild ? e.firstChild.nodeValue : "";
}, loadUpdate: function() {
  var e = this, i = this.$scheduler.ajax, t = this.$scheduler.getUserData(0, "version"), r = this.serverProcessor + i.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + t].join("&");
  r = r.replace("editing=true&", ""), this.getUpdates(r, function(s) {
    var n = i.xpath("//userdata", s);
    e.$scheduler.setUserData(0, "version", e._getXmlNodeValue(n[0]));
    var o = i.xpath("//update", s);
    if (o.length) {
      e._silent_mode = !0;
      for (var _ = 0; _ < o.length; _++) {
        var a = o[_].getAttribute("status"), d = o[_].getAttribute("id"), l = o[_].getAttribute("parent");
        switch (a) {
          case "inserted":
            this.callEvent("insertCallback", [o[_], d, l]);
            break;
          case "updated":
            this.callEvent("updateCallback", [o[_], d, l]);
            break;
          case "deleted":
            this.callEvent("deleteCallback", [o[_], d, l]);
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
  var i = this.$scheduler.utils.copy(e);
  return this._tMode === "REST-JSON" && (delete i.id, delete i[this.action_param]), JSON.stringify(i);
}, _cleanupArgumentsBeforeSend: function(e) {
  var i;
  if (e[this.action_param] === void 0)
    for (var t in i = {}, e)
      i[t] = this._cleanupArgumentsBeforeSend(e[t]);
  else
    i = this._cleanupItemBeforeSend(e);
  return i;
}, _cleanupItemBeforeSend: function(e) {
  var i = null;
  return e && (e[this.action_param] === "deleted" ? ((i = {}).id = e.id, i[this.action_param] = e[this.action_param]) : i = e), i;
}, _forEachUpdatedRow: function(e) {
  for (var i = this.updatedRows.slice(), t = 0; t < i.length; t++) {
    var r = i[t];
    this.$scheduler.getUserData(r, this.action_param) && e.call(this, r);
  }
}, _prepareItemForJson(e) {
  const i = {}, t = this.$scheduler, r = t.utils.copy(e);
  for (let s in r) {
    let n = r[s];
    s.indexOf("_") !== 0 && (n ? n.getUTCFullYear ? i[s] = t._helpers.formatDate(n) : i[s] = typeof n == "object" ? this._prepareItemForJson(n) : n : n !== void 0 && (i[s] = n));
  }
  return i[this.action_param] = t.getUserData(e.id, this.action_param), i;
}, _prepareItemForForm(e) {
  const i = {}, t = this.$scheduler, r = t.utils.copy(e);
  for (var s in r) {
    let n = r[s];
    s.indexOf("_") !== 0 && (n ? n.getUTCFullYear ? i[s] = t._helpers.formatDate(n) : i[s] = typeof n == "object" ? this._prepareItemForForm(n) : n : i[s] = "");
  }
  return i[this.action_param] = t.getUserData(e.id, this.action_param), i;
}, _prepareDataItem: function(e) {
  return this._serializeAsJson ? this._prepareItemForJson(e) : this._prepareItemForForm(e);
}, _getRowData: function(e) {
  var i = this.$scheduler.getEvent(e);
  return i || (i = { id: e }), this._prepareDataItem(i);
} };
const Gt = { date: { month_full: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"], month_short: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_full: ["الأحد", "الأثنين", "ألثلاثاء", "الأربعاء", "ألحميس", "ألجمعة", "السبت"], day_short: ["احد", "اثنين", "ثلاثاء", "اربعاء", "خميس", "جمعة", "سبت"] }, labels: { dhx_cal_today_button: "اليوم", day_tab: "يوم", week_tab: "أسبوع", month_tab: "شهر", new_event: "حدث جديد", icon_save: "اخزن", icon_cancel: "الغاء", icon_details: "تفاصيل", icon_edit: "تحرير", icon_delete: "حذف", confirm_closing: "التغييرات سوف تضيع, هل انت متأكد؟", confirm_deleting: "الحدث سيتم حذفها نهائيا ، هل أنت متأكد؟", section_description: "الوصف", section_time: "الفترة الزمنية", full_day: "طوال اليوم", confirm_recurring: "هل تريد تحرير مجموعة كاملة من الأحداث المتكررة؟", section_recurring: "تكرار الحدث", button_recurring: "تعطيل", button_recurring_open: "تمكين", button_edit_series: "تحرير سلسلة", button_edit_occurrence: "تعديل نسخة", button_edit_occurrence_and_following: "This and following events", grid_tab: "جدول", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "يومي", repeat_radio_week: "أسبوعي", repeat_radio_month: "شهري", repeat_radio_year: "سنوي", repeat_radio_day_type: "كل", repeat_text_day_count: "يوم", repeat_radio_day_type2: "كل يوم عمل", repeat_week: " تكرار كل", repeat_text_week_count: "أسبوع في الأيام التالية:", repeat_radio_month_type: "تكرار", repeat_radio_month_start: "في", repeat_text_month_day: "يوم كل", repeat_text_month_count: "شهر", repeat_text_month_count2_before: "كل", repeat_text_month_count2_after: "شهر", repeat_year_label: "في", select_year_day2: "من", repeat_text_year_day: "يوم", select_year_month: "شهر", repeat_radio_end: "بدون تاريخ انتهاء", repeat_text_occurrences_count: "تكرارات", repeat_radio_end2: "بعد", repeat_radio_end3: "ينتهي في", repeat_never: "أبداً", repeat_daily: "كل يوم", repeat_workdays: "كل يوم عمل", repeat_weekly: "كل أسبوع", repeat_monthly: "كل شهر", repeat_yearly: "كل سنة", repeat_custom: "تخصيص", repeat_freq_day: "يوم", repeat_freq_week: "أسبوع", repeat_freq_month: "شهر", repeat_freq_year: "سنة", repeat_on_date: "في التاريخ", repeat_ends: "ينتهي", month_for_recurring: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_for_recurring: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] } }, Xt = { date: { month_full: ["Студзень", "Люты", "Сакавік", "Красавік", "Maй", "Чэрвень", "Ліпень", "Жнівень", "Верасень", "Кастрычнік", "Лістапад", "Снежань"], month_short: ["Студз", "Лют", "Сак", "Крас", "Maй", "Чэр", "Ліп", "Жнів", "Вер", "Каст", "Ліст", "Снеж"], day_full: ["Нядзеля", "Панядзелак", "Аўторак", "Серада", "Чацвер", "Пятніца", "Субота"], day_short: ["Нд", "Пн", "Аўт", "Ср", "Чцв", "Пт", "Сб"] }, labels: { dhx_cal_today_button: "Сёння", day_tab: "Дзень", week_tab: "Тыдзень", month_tab: "Месяц", new_event: "Новая падзея", icon_save: "Захаваць", icon_cancel: "Адмяніць", icon_details: "Дэталі", icon_edit: "Змяніць", icon_delete: "Выдаліць", confirm_closing: "", confirm_deleting: "Падзея будзе выдалена незваротна, працягнуць?", section_description: "Апісанне", section_time: "Перыяд часу", full_day: "Увесь дзень", confirm_recurring: "Вы хочаце змяніць усю серыю паўтаральных падзей?", section_recurring: "Паўтарэнне", button_recurring: "Адключана", button_recurring_open: "Уключана", button_edit_series: "Рэдагаваць серыю", button_edit_occurrence: "Рэдагаваць асобнік", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Спіс", date: "Дата", description: "Апісанне", year_tab: "Год", week_agenda_tab: "Спіс", grid_tab: "Спic", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Дзень", repeat_radio_week: "Тыдзень", repeat_radio_month: "Месяц", repeat_radio_year: "Год", repeat_radio_day_type: "Кожны", repeat_text_day_count: "дзень", repeat_radio_day_type2: "Кожны працоўны дзень", repeat_week: " Паўтараць кожны", repeat_text_week_count: "тыдзень", repeat_radio_month_type: "Паўтараць", repeat_radio_month_start: "", repeat_text_month_day: " чысла кожнага", repeat_text_month_count: "месяцу", repeat_text_month_count2_before: "кожны ", repeat_text_month_count2_after: "месяц", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "дзень", select_year_month: "", repeat_radio_end: "Без даты заканчэння", repeat_text_occurrences_count: "паўтораў", repeat_radio_end2: "", repeat_radio_end3: "Да ", repeat_never: "Ніколі", repeat_daily: "Кожны дзень", repeat_workdays: "Кожны працоўны дзень", repeat_weekly: "Кожны тыдзень", repeat_monthly: "Кожны месяц", repeat_yearly: "Кожны год", repeat_custom: "Наладжвальны", repeat_freq_day: "Дзень", repeat_freq_week: "Тыдзень", repeat_freq_month: "Месяц", repeat_freq_year: "Год", repeat_on_date: "На дату", repeat_ends: "Заканчваецца", month_for_recurring: ["Студзеня", "Лютага", "Сакавіка", "Красавіка", "Мая", "Чэрвеня", "Ліпeня", "Жніўня", "Верасня", "Кастрычніка", "Лістапада", "Снежня"], day_for_recurring: ["Нядзелю", "Панядзелак", "Аўторак", "Сераду", "Чацвер", "Пятніцу", "Суботу"] } }, Zt = { date: { month_full: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], month_short: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"], day_full: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"], day_short: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"] }, labels: { dhx_cal_today_button: "Hui", day_tab: "Dia", week_tab: "Setmana", month_tab: "Mes", new_event: "Nou esdeveniment", icon_save: "Guardar", icon_cancel: "Cancel·lar", icon_details: "Detalls", icon_edit: "Editar", icon_delete: "Esborrar", confirm_closing: "", confirm_deleting: "L'esdeveniment s'esborrarà definitivament, continuar ?", section_description: "Descripció", section_time: "Periode de temps", full_day: "Tot el dia", confirm_recurring: "¿Desitja modificar el conjunt d'esdeveniments repetits?", section_recurring: "Repeteixca l'esdeveniment", button_recurring: "Impedit", button_recurring_open: "Permés", button_edit_series: "Edit sèrie", button_edit_occurrence: "Edita Instància", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Data", description: "Descripció", year_tab: "Any", week_agenda_tab: "Agenda", grid_tab: "Taula", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diari", repeat_radio_week: "Setmanal", repeat_radio_month: "Mensual", repeat_radio_year: "Anual", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia", repeat_radio_day_type2: "Cada dia laborable", repeat_week: " Repetir cada", repeat_text_week_count: "setmana els dies següents:", repeat_radio_month_type: "Repetir", repeat_radio_month_start: "El", repeat_text_month_day: "dia cada", repeat_text_month_count: "mes", repeat_text_month_count2_before: "cada", repeat_text_month_count2_after: "mes", repeat_year_label: "El", select_year_day2: "de", repeat_text_year_day: "dia", select_year_month: "mes", repeat_radio_end: "Sense data de finalització", repeat_text_occurrences_count: "ocurrències", repeat_radio_end2: "Després", repeat_radio_end3: "Finalitzar el", repeat_never: "Mai", repeat_daily: "Cada dia", repeat_workdays: "Cada dia laborable", repeat_weekly: "Cada setmana", repeat_monthly: "Cada mes", repeat_yearly: "Cada any", repeat_custom: "Personalitzat", repeat_freq_day: "Dia", repeat_freq_week: "Setmana", repeat_freq_month: "Mes", repeat_freq_year: "Any", repeat_on_date: "En la data", repeat_ends: "Finalitza", month_for_recurring: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], day_for_recurring: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"] } }, Qt = { date: { month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], day_short: ["日", "一", "二", "三", "四", "五", "六"] }, labels: { dhx_cal_today_button: "今天", day_tab: "日", week_tab: "周", month_tab: "月", new_event: "新建日程", icon_save: "保存", icon_cancel: "关闭", icon_details: "详细", icon_edit: "编辑", icon_delete: "删除", confirm_closing: "请确认是否撤销修改!", confirm_deleting: "是否删除日程?", section_description: "描述", section_time: "时间范围", full_day: "整天", confirm_recurring: "请确认是否将日程设为重复模式?", section_recurring: "重复周期", button_recurring: "禁用", button_recurring_open: "启用", button_edit_series: "编辑系列", button_edit_occurrence: "编辑实例", button_edit_occurrence_and_following: "This and following events", agenda_tab: "议程", date: "日期", description: "说明", year_tab: "今年", week_agenda_tab: "议程", grid_tab: "电网", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "按天", repeat_radio_week: "按周", repeat_radio_month: "按月", repeat_radio_year: "按年", repeat_radio_day_type: "每", repeat_text_day_count: "天", repeat_radio_day_type2: "每个工作日", repeat_week: " 重复 每", repeat_text_week_count: "星期的:", repeat_radio_month_type: "重复", repeat_radio_month_start: "在", repeat_text_month_day: "日 每", repeat_text_month_count: "月", repeat_text_month_count2_before: "每", repeat_text_month_count2_after: "月", repeat_year_label: "在", select_year_day2: "的", repeat_text_year_day: "日", select_year_month: "月", repeat_radio_end: "无结束日期", repeat_text_occurrences_count: "次结束", repeat_radio_end2: "重复", repeat_radio_end3: "结束于", repeat_never: "从不", repeat_daily: "每天", repeat_workdays: "每个工作日", repeat_weekly: "每周", repeat_monthly: "每月", repeat_yearly: "每年", repeat_custom: "自定义", repeat_freq_day: "天", repeat_freq_week: "周", repeat_freq_month: "月", repeat_freq_year: "年", repeat_on_date: "在日期", repeat_ends: "结束", month_for_recurring: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], day_for_recurring: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"] } }, ea = { date: { month_full: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], month_short: ["Led", "Ún", "Bře", "Dub", "Kvě", "Čer", "Čec", "Srp", "Září", "Říj", "List", "Pro"], day_full: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"], day_short: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"] }, labels: { dhx_cal_today_button: "Dnes", day_tab: "Den", week_tab: "Týden", month_tab: "Měsíc", new_event: "Nová událost", icon_save: "Uložit", icon_cancel: "Zpět", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Smazat", confirm_closing: "", confirm_deleting: "Událost bude trvale smazána, opravdu?", section_description: "Poznámky", section_time: "Doba platnosti", confirm_recurring: "Přejete si upravit celou řadu opakovaných událostí?", section_recurring: "Opakování události", button_recurring: "Vypnuto", button_recurring_open: "Zapnuto", button_edit_series: "Edit series", button_edit_occurrence: "Upravit instance", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Program", date: "Datum", description: "Poznámka", year_tab: "Rok", full_day: "Full day", week_agenda_tab: "Program", grid_tab: "Mřížka", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Denně", repeat_radio_week: "Týdně", repeat_radio_month: "Měsíčně", repeat_radio_year: "Ročně", repeat_radio_day_type: "každý", repeat_text_day_count: "Den", repeat_radio_day_type2: "pracovní dny", repeat_week: "Opakuje každých", repeat_text_week_count: "Týdnů na:", repeat_radio_month_type: "u každého", repeat_radio_month_start: "na", repeat_text_month_day: "Den každého", repeat_text_month_count: "Měsíc", repeat_text_month_count2_before: "každý", repeat_text_month_count2_after: "Měsíc", repeat_year_label: "na", select_year_day2: "v", repeat_text_year_day: "Den v", select_year_month: "", repeat_radio_end: "bez data ukončení", repeat_text_occurrences_count: "Události", repeat_radio_end2: "po", repeat_radio_end3: "Konec", repeat_never: "Nikdy", repeat_daily: "Každý den", repeat_workdays: "Každý pracovní den", repeat_weekly: "Každý týden", repeat_monthly: "Každý měsíc", repeat_yearly: "Každý rok", repeat_custom: "Vlastní", repeat_freq_day: "Den", repeat_freq_week: "Týden", repeat_freq_month: "Měsíc", repeat_freq_year: "Rok", repeat_on_date: "Na datum", repeat_ends: "Končí", month_for_recurring: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], day_for_recurring: ["Neděle ", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"] } }, ta = { date: { month_full: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Uge", month_tab: "Måned", new_event: "Ny begivenhed", icon_save: "Gem", icon_cancel: "Fortryd", icon_details: "Detaljer", icon_edit: "Tilret", icon_delete: "Slet", confirm_closing: "Dine rettelser vil gå tabt.. Er dy sikker?", confirm_deleting: "Bigivenheden vil blive slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", confirm_recurring: "Vil du tilrette hele serien af gentagne begivenheder?", section_recurring: "Gentag begivenhed", button_recurring: "Frakoblet", button_recurring_open: "Tilkoblet", button_edit_series: "Rediger serien", button_edit_occurrence: "Rediger en kopi", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Dagsorden", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Dagsorden", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ugenlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "På hver arbejdsdag", repeat_week: " Gentager sig hver", repeat_text_week_count: "uge på følgende dage:", repeat_radio_month_type: "Hver den", repeat_radio_month_start: "Den", repeat_text_month_day: " i hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "Den", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "", repeat_radio_end: "Ingen slutdato", repeat_text_occurrences_count: "gentagelse", repeat_radio_end2: "Efter", repeat_radio_end3: "Slut", repeat_never: "Aldrig", repeat_daily: "Hver dag", repeat_workdays: "Hver hverdag", repeat_weekly: "Hver uge", repeat_monthly: "Hver måned", repeat_yearly: "Hvert år", repeat_custom: "Brugerdefineret", repeat_freq_day: "Dag", repeat_freq_week: "Uge", repeat_freq_month: "Måned", repeat_freq_year: "År", repeat_on_date: "På dato", repeat_ends: "Slutter", month_for_recurring: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], day_for_recurring: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, aa = { date: { month_full: [" Januar", " Februar", " März ", " April", " Mai", " Juni", " Juli", " August", " September ", " Oktober", " November ", " Dezember"], month_short: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], day_full: ["Sonntag", "Montag", "Dienstag", " Mittwoch", " Donnerstag", "Freitag", "Samstag"], day_short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"] }, labels: { dhx_cal_today_button: "Heute", day_tab: "Tag", week_tab: "Woche", month_tab: "Monat", new_event: "neuer Eintrag", icon_save: "Speichern", icon_cancel: "Abbrechen", icon_details: "Details", icon_edit: "Ändern", icon_delete: "Löschen", confirm_closing: "", confirm_deleting: "Der Eintrag wird gelöscht", section_description: "Beschreibung", section_time: "Zeitspanne", full_day: "Ganzer Tag", confirm_recurring: "Wollen Sie alle Einträge bearbeiten oder nur diesen einzelnen Eintrag?", section_recurring: "Wiederholung", button_recurring: "Aus", button_recurring_open: "An", button_edit_series: "Bearbeiten Sie die Serie", button_edit_occurrence: "Bearbeiten Sie eine Kopie", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Datum", description: "Beschreibung", year_tab: "Jahre", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Täglich", repeat_radio_week: "Wöchentlich", repeat_radio_month: "Monatlich", repeat_radio_year: "Jährlich", repeat_radio_day_type: "jeden", repeat_text_day_count: "Tag", repeat_radio_day_type2: "an jedem Arbeitstag", repeat_week: " Wiederholt sich jede", repeat_text_week_count: "Woche am:", repeat_radio_month_type: "an jedem", repeat_radio_month_start: "am", repeat_text_month_day: "Tag eines jeden", repeat_text_month_count: "Monats", repeat_text_month_count2_before: "jeden", repeat_text_month_count2_after: "Monats", repeat_year_label: "am", select_year_day2: "im", repeat_text_year_day: "Tag im", select_year_month: "", repeat_radio_end: "kein Enddatum", repeat_text_occurrences_count: "Ereignissen", repeat_radio_end3: "Schluß", repeat_radio_end2: "nach", repeat_never: "Nie", repeat_daily: "Jeden Tag", repeat_workdays: "Jeden Werktag", repeat_weekly: "Jede Woche", repeat_monthly: "Jeden Monat", repeat_yearly: "Jedes Jahr", repeat_custom: "Benutzerdefiniert", repeat_freq_day: "Tag", repeat_freq_week: "Woche", repeat_freq_month: "Monat", repeat_freq_year: "Jahr", repeat_on_date: "Am Datum", repeat_ends: "Endet", month_for_recurring: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], day_for_recurring: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"] } }, na = { date: { month_full: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], month_short: ["ΙΑΝ", "ΦΕΒ", "ΜΑΡ", "ΑΠΡ", "ΜΑΙ", "ΙΟΥΝ", "ΙΟΥΛ", "ΑΥΓ", "ΣΕΠ", "ΟΚΤ", "ΝΟΕ", "ΔΕΚ"], day_full: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"], day_short: ["ΚΥ", "ΔΕ", "ΤΡ", "ΤΕ", "ΠΕ", "ΠΑ", "ΣΑ"] }, labels: { dhx_cal_today_button: "Σήμερα", day_tab: "Ημέρα", week_tab: "Εβδομάδα", month_tab: "Μήνας", new_event: "Νέο έργο", icon_save: "Αποθήκευση", icon_cancel: "Άκυρο", icon_details: "Λεπτομέρειες", icon_edit: "Επεξεργασία", icon_delete: "Διαγραφή", confirm_closing: "", confirm_deleting: "Το έργο θα διαγραφεί οριστικά. Θέλετε να συνεχίσετε;", section_description: "Περιγραφή", section_time: "Χρονική περίοδος", full_day: "Πλήρης Ημέρα", confirm_recurring: "Θέλετε να επεξεργασθείτε ολόκληρη την ομάδα των επαναλαμβανόμενων έργων;", section_recurring: "Επαναλαμβανόμενο έργο", button_recurring: "Ανενεργό", button_recurring_open: "Ενεργό", button_edit_series: "Επεξεργαστείτε τη σειρά", button_edit_occurrence: "Επεξεργασία ένα αντίγραφο", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Ημερήσια Διάταξη", date: "Ημερομηνία", description: "Περιγραφή", year_tab: "Έτος", week_agenda_tab: "Ημερήσια Διάταξη", grid_tab: "Πλέγμα", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Ημερησίως", repeat_radio_week: "Εβδομαδιαίως", repeat_radio_month: "Μηνιαίως", repeat_radio_year: "Ετησίως", repeat_radio_day_type: "Κάθε", repeat_text_day_count: "ημέρα", repeat_radio_day_type2: "Κάθε εργάσιμη", repeat_week: " Επανάληψη κάθε", repeat_text_week_count: "εβδομάδα τις επόμενες ημέρες:", repeat_radio_month_type: "Επανάληψη", repeat_radio_month_start: "Την", repeat_text_month_day: "ημέρα κάθε", repeat_text_month_count: "μήνα", repeat_text_month_count2_before: "κάθε", repeat_text_month_count2_after: "μήνα", repeat_year_label: "Την", select_year_day2: "του", repeat_text_year_day: "ημέρα", select_year_month: "μήνα", repeat_radio_end: "Χωρίς ημερομηνία λήξεως", repeat_text_occurrences_count: "επαναλήψεις", repeat_radio_end3: "Λήγει την", repeat_radio_end2: "Μετά από", repeat_never: "Ποτέ", repeat_daily: "Κάθε μέρα", repeat_workdays: "Κάθε εργάσιμη μέρα", repeat_weekly: "Κάθε εβδομάδα", repeat_monthly: "Κάθε μήνα", repeat_yearly: "Κάθε χρόνο", repeat_custom: "Προσαρμοσμένο", repeat_freq_day: "Ημέρα", repeat_freq_week: "Εβδομάδα", repeat_freq_month: "Μήνας", repeat_freq_year: "Χρόνος", repeat_on_date: "Σε ημερομηνία", repeat_ends: "Λήγει", month_for_recurring: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], day_for_recurring: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"] } }, ra = { date: { month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, labels: { dhx_cal_today_button: "Today", day_tab: "Day", week_tab: "Week", month_tab: "Month", new_event: "New event", icon_save: "Save", icon_cancel: "Cancel", icon_details: "Details", icon_edit: "Edit", icon_delete: "Delete", confirm_closing: "", confirm_deleting: "Event will be deleted permanently, are you sure?", section_description: "Description", section_time: "Time period", full_day: "Full day", confirm_recurring: "Edit recurring event", section_recurring: "Repeat event", button_recurring: "Disabled", button_recurring_open: "Enabled", button_edit_series: "All events", button_edit_occurrence: "This event", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Date", description: "Description", year_tab: "Year", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daily", repeat_radio_week: "Weekly", repeat_radio_month: "Monthly", repeat_radio_year: "Yearly", repeat_radio_day_type: "Every", repeat_text_day_count: "day", repeat_radio_day_type2: "Every workday", repeat_week: " Repeat every", repeat_text_week_count: "week next days:", repeat_radio_month_type: "Repeat", repeat_radio_month_start: "On", repeat_text_month_day: "day every", repeat_text_month_count: "month", repeat_text_month_count2_before: "every", repeat_text_month_count2_after: "month", repeat_year_label: "On", select_year_day2: "of", repeat_text_year_day: "day", select_year_month: "month", repeat_radio_end: "No end date", repeat_text_occurrences_count: "occurrences", repeat_radio_end2: "After", repeat_radio_end3: "End by", repeat_never: "Never", repeat_daily: "Every day", repeat_workdays: "Every weekday", repeat_weekly: "Every week", repeat_monthly: "Every month", repeat_yearly: "Every year", repeat_custom: "Custom", repeat_freq_day: "Day", repeat_freq_week: "Week", repeat_freq_month: "Month", repeat_freq_year: "Year", repeat_on_date: "On date", repeat_ends: "Ends", month_for_recurring: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], day_for_recurring: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] } }, ia = { date: { month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] }, labels: { dhx_cal_today_button: "Hoy", day_tab: "Día", week_tab: "Semana", month_tab: "Mes", new_event: "Nuevo evento", icon_save: "Guardar", icon_cancel: "Cancelar", icon_details: "Detalles", icon_edit: "Editar", icon_delete: "Eliminar", confirm_closing: "", confirm_deleting: "El evento se borrará definitivamente, ¿continuar?", section_description: "Descripción", section_time: "Período", full_day: "Todo el día", confirm_recurring: "¿Desea modificar el conjunto de eventos repetidos?", section_recurring: "Repita el evento", button_recurring: "Impedido", button_recurring_open: "Permitido", button_edit_series: "Editar la serie", button_edit_occurrence: "Editar este evento", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Día", date: "Fecha", description: "Descripción", year_tab: "Año", week_agenda_tab: "Día", grid_tab: "Reja", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diariamente", repeat_radio_week: "Semanalmente", repeat_radio_month: "Mensualmente", repeat_radio_year: "Anualmente", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia", repeat_radio_day_type2: "Cada jornada de trabajo", repeat_week: " Repetir cada", repeat_text_week_count: "semana:", repeat_radio_month_type: "Repita", repeat_radio_month_start: "El", repeat_text_month_day: "dia cada ", repeat_text_month_count: "mes", repeat_text_month_count2_before: "cada", repeat_text_month_count2_after: "mes", repeat_year_label: "El", select_year_day2: "del", repeat_text_year_day: "dia", select_year_month: "mes", repeat_radio_end: "Sin fecha de finalización", repeat_text_occurrences_count: "ocurrencias", repeat_radio_end3: "Fin", repeat_radio_end2: "Después de", repeat_never: "Nunca", repeat_daily: "Cada día", repeat_workdays: "Cada día laborable", repeat_weekly: "Cada semana", repeat_monthly: "Cada mes", repeat_yearly: "Cada año", repeat_custom: "Personalizado", repeat_freq_day: "Día", repeat_freq_week: "Semana", repeat_freq_month: "Mes", repeat_freq_year: "Año", repeat_on_date: "En la fecha", repeat_ends: "Termina", month_for_recurring: ["Enero", "Febrero", "Маrzo", "Аbril", "Mayo", "Junio", "Julio", "Аgosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"], day_for_recurring: ["Domingo", "Lunes", "Martes", "Miércoles", "Jeuves", "Viernes", "Sabado"] } }, oa = { date: { month_full: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], month_short: ["Tam", "Hel", "Maa", "Huh", "Tou", "Kes", "Hei", "Elo", "Syy", "Lok", "Mar", "Jou"], day_full: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"], day_short: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"] }, labels: { dhx_cal_today_button: "Tänään", day_tab: "Päivä", week_tab: "Viikko", month_tab: "Kuukausi", new_event: "Uusi tapahtuma", icon_save: "Tallenna", icon_cancel: "Peru", icon_details: "Tiedot", icon_edit: "Muokkaa", icon_delete: "Poista", confirm_closing: "", confirm_deleting: "Haluatko varmasti poistaa tapahtuman?", section_description: "Kuvaus", section_time: "Aikajakso", full_day: "Koko päivä", confirm_recurring: "Haluatko varmasti muokata toistuvan tapahtuman kaikkia jaksoja?", section_recurring: "Toista tapahtuma", button_recurring: "Ei k&auml;yt&ouml;ss&auml;", button_recurring_open: "K&auml;yt&ouml;ss&auml;", button_edit_series: "Muokkaa sarja", button_edit_occurrence: "Muokkaa kopio", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Esityslista", date: "Päivämäärä", description: "Kuvaus", year_tab: "Vuoden", week_agenda_tab: "Esityslista", grid_tab: "Ritilä", drag_to_create: "Luo uusi vetämällä", drag_to_move: "Siirrä vetämällä", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "P&auml;ivitt&auml;in", repeat_radio_week: "Viikoittain", repeat_radio_month: "Kuukausittain", repeat_radio_year: "Vuosittain", repeat_radio_day_type: "Joka", repeat_text_day_count: "p&auml;iv&auml;", repeat_radio_day_type2: "Joka arkip&auml;iv&auml;", repeat_week: "Toista joka", repeat_text_week_count: "viikko n&auml;in&auml; p&auml;ivin&auml;:", repeat_radio_month_type: "Toista", repeat_radio_month_start: "", repeat_text_month_day: "p&auml;iv&auml;n&auml; joka", repeat_text_month_count: "kuukausi", repeat_text_month_count2_before: "joka", repeat_text_month_count2_after: "kuukausi", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "p&auml;iv&auml;", select_year_month: "kuukausi", repeat_radio_end: "Ei loppumisaikaa", repeat_text_occurrences_count: "Toiston j&auml;lkeen", repeat_radio_end3: "Loppuu", repeat_radio_end2: "", repeat_never: "Ei koskaan", repeat_daily: "Joka päivä", repeat_workdays: "Joka arkipäivä", repeat_weekly: "Joka viikko", repeat_monthly: "Joka kuukausi", repeat_yearly: "Joka vuosi", repeat_custom: "Mukautettu", repeat_freq_day: "Päivä", repeat_freq_week: "Viikko", repeat_freq_month: "Kuukausi", repeat_freq_year: "Vuosi", repeat_on_date: "Tiettynä päivänä", repeat_ends: "Päättyy", month_for_recurring: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], day_for_recurring: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"] } }, sa = { date: { month_full: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], month_short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"], day_full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"], day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] }, labels: { dhx_cal_today_button: "Aujourd'hui", day_tab: "Jour", week_tab: "Semaine", month_tab: "Mois", new_event: "Nouvel événement", icon_save: "Enregistrer", icon_cancel: "Annuler", icon_details: "Détails", icon_edit: "Modifier", icon_delete: "Effacer", confirm_closing: "", confirm_deleting: "L'événement sera effacé sans appel, êtes-vous sûr ?", section_description: "Description", section_time: "Période", full_day: "Journée complète", confirm_recurring: "Voulez-vous éditer toute une série d'évènements répétés?", section_recurring: "Périodicité", button_recurring: "Désactivé", button_recurring_open: "Activé", button_edit_series: "Modifier la série", button_edit_occurrence: "Modifier une copie", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Jour", date: "Date", description: "Description", year_tab: "Année", week_agenda_tab: "Jour", grid_tab: "Grille", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Quotidienne", repeat_radio_week: "Hebdomadaire", repeat_radio_month: "Mensuelle", repeat_radio_year: "Annuelle", repeat_radio_day_type: "Chaque", repeat_text_day_count: "jour", repeat_radio_day_type2: "Chaque journée de travail", repeat_week: " Répéter toutes les", repeat_text_week_count: "semaine:", repeat_radio_month_type: "Répéter", repeat_radio_month_start: "Le", repeat_text_month_day: "jour chaque", repeat_text_month_count: "mois", repeat_text_month_count2_before: "chaque", repeat_text_month_count2_after: "mois", repeat_year_label: "Le", select_year_day2: "du", repeat_text_year_day: "jour", select_year_month: "mois", repeat_radio_end: "Pas de date d&quot;achèvement", repeat_text_occurrences_count: "occurrences", repeat_radio_end3: "Fin", repeat_radio_end2: "Après", repeat_never: "Jamais", repeat_daily: "Chaque jour", repeat_workdays: "Chaque jour ouvrable", repeat_weekly: "Chaque semaine", repeat_monthly: "Chaque mois", repeat_yearly: "Chaque année", repeat_custom: "Personnalisé", repeat_freq_day: "Jour", repeat_freq_week: "Semaine", repeat_freq_month: "Mois", repeat_freq_year: "Année", repeat_on_date: "À la date", repeat_ends: "Se termine", month_for_recurring: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], day_for_recurring: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] } }, da = { date: { month_full: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], month_short: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"], day_full: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"], day_short: ["א", "ב", "ג", "ד", "ה", "ו", "ש"] }, labels: { dhx_cal_today_button: "היום", day_tab: "יום", week_tab: "שבוע", month_tab: "חודש", new_event: "ארוע חדש", icon_save: "שמור", icon_cancel: "בטל", icon_details: "פרטים", icon_edit: "ערוך", icon_delete: "מחק", confirm_closing: "", confirm_deleting: "ארוע ימחק סופית.להמשיך?", section_description: "תיאור", section_time: "תקופה", confirm_recurring: "האם ברצונך לשנות כל סדרת ארועים מתמשכים?", section_recurring: "להעתיק ארוע", button_recurring: "לא פעיל", button_recurring_open: "פעיל", full_day: "יום שלם", button_edit_series: "ערוך את הסדרה", button_edit_occurrence: "עריכת עותק", button_edit_occurrence_and_following: "This and following events", agenda_tab: "סדר יום", date: "תאריך", description: "תיאור", year_tab: "לשנה", week_agenda_tab: "סדר יום", grid_tab: "סורג", drag_to_create: "Drag to create", drag_to_move: "גרור כדי להזיז", message_ok: "OK", message_cancel: "בטל", next: "הבא", prev: "הקודם", year: "שנה", month: "חודש", day: "יום", hour: "שעה", minute: "דקה", repeat_radio_day: "יומי", repeat_radio_week: "שבועי", repeat_radio_month: "חודשי", repeat_radio_year: "שנתי", repeat_radio_day_type: "חזור כל", repeat_text_day_count: "ימים", repeat_radio_day_type2: "חזור כל יום עבודה", repeat_week: " חזור כל", repeat_text_week_count: "שבוע לפי ימים:", repeat_radio_month_type: "חזור כל", repeat_radio_month_start: "כל", repeat_text_month_day: "ימים כל", repeat_text_month_count: "חודשים", repeat_text_month_count2_before: "חזור כל", repeat_text_month_count2_after: "חודש", repeat_year_label: "כל", select_year_day2: "בחודש", repeat_text_year_day: "ימים", select_year_month: "חודש", repeat_radio_end: "לעולם לא מסתיים", repeat_text_occurrences_count: "אירועים", repeat_radio_end3: "מסתיים ב", repeat_radio_end2: "אחרי", repeat_never: "אף פעם", repeat_daily: "כל יום", repeat_workdays: "כל יום עבודה", repeat_weekly: "כל שבוע", repeat_monthly: "כל חודש", repeat_yearly: "כל שנה", repeat_custom: "מותאם אישית", repeat_freq_day: "יום", repeat_freq_week: "שבוע", repeat_freq_month: "חודש", repeat_freq_year: "שנה", repeat_on_date: "בתאריך", repeat_ends: "מסתיים", month_for_recurring: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], day_for_recurring: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"] } }, _a = { date: { month_full: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], month_short: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Vasárnap", "Hétfõ", "Kedd", "Szerda", "Csütörtök", "Péntek", "szombat"], day_short: ["Va", "Hé", "Ke", "Sze", "Csü", "Pé", "Szo"] }, labels: { dhx_cal_today_button: "Ma", day_tab: "Nap", week_tab: "Hét", month_tab: "Hónap", new_event: "Új esemény", icon_save: "Mentés", icon_cancel: "Mégse", icon_details: "Részletek", icon_edit: "Szerkesztés", icon_delete: "Törlés", confirm_closing: "", confirm_deleting: "Az esemény törölve lesz, biztosan folytatja?", section_description: "Leírás", section_time: "Idõszak", full_day: "Egesz napos", confirm_recurring: "Biztosan szerkeszteni akarod az összes ismétlõdõ esemény beállítását?", section_recurring: "Esemény ismétlése", button_recurring: "Tiltás", button_recurring_open: "Engedélyezés", button_edit_series: "Edit series", button_edit_occurrence: "Szerkesztés bíróság", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Napirend", date: "Dátum", description: "Leírás", year_tab: "Év", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Napi", repeat_radio_week: "Heti", repeat_radio_month: "Havi", repeat_radio_year: "Éves", repeat_radio_day_type: "Minden", repeat_text_day_count: "nap", repeat_radio_day_type2: "Minden munkanap", repeat_week: " Ismételje meg minden", repeat_text_week_count: "héten a következő napokon:", repeat_radio_month_type: "Ismétlés", repeat_radio_month_start: "Ekkor", repeat_text_month_day: "nap minden", repeat_text_month_count: "hónapban", repeat_text_month_count2_before: "minden", repeat_text_month_count2_after: "hónapban", repeat_year_label: "Ekkor", select_year_day2: "-án/-én", repeat_text_year_day: "nap", select_year_month: "hónap", repeat_radio_end: "Nincs befejezési dátum", repeat_text_occurrences_count: "esemény", repeat_radio_end2: "Után", repeat_radio_end3: "Befejező dátum", repeat_never: "Soha", repeat_daily: "Minden nap", repeat_workdays: "Minden munkanap", repeat_weekly: "Minden héten", repeat_monthly: "Minden hónapban", repeat_yearly: "Minden évben", repeat_custom: "Egyedi", repeat_freq_day: "Nap", repeat_freq_week: "Hét", repeat_freq_month: "Hónap", repeat_freq_year: "Év", repeat_on_date: "Dátum szerint", repeat_ends: "Befejeződik", month_for_recurring: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], day_for_recurring: ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"] } }, la = { date: { month_full: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"], day_full: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], day_short: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] }, labels: { dhx_cal_today_button: "Hari Ini", day_tab: "Hari", week_tab: "Minggu", month_tab: "Bulan", new_event: "Acara Baru", icon_save: "Simpan", icon_cancel: "Batal", icon_details: "Detail", icon_edit: "Edit", icon_delete: "Hapus", confirm_closing: "", confirm_deleting: "Acara akan dihapus", section_description: "Keterangan", section_time: "Periode", full_day: "Hari penuh", confirm_recurring: "Apakah acara ini akan berulang?", section_recurring: "Acara Rutin", button_recurring: "Tidak Difungsikan", button_recurring_open: "Difungsikan", button_edit_series: "Mengedit seri", button_edit_occurrence: "Mengedit salinan", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Tanggal", description: "Keterangan", year_tab: "Tahun", week_agenda_tab: "Agenda", grid_tab: "Tabel", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Harian", repeat_radio_week: "Mingguan", repeat_radio_month: "Bulanan", repeat_radio_year: "Tahunan", repeat_radio_day_type: "Setiap", repeat_text_day_count: "hari", repeat_radio_day_type2: "Setiap hari kerja", repeat_week: " Ulangi setiap", repeat_text_week_count: "minggu pada hari berikut:", repeat_radio_month_type: "Ulangi", repeat_radio_month_start: "Pada", repeat_text_month_day: "hari setiap", repeat_text_month_count: "bulan", repeat_text_month_count2_before: "setiap", repeat_text_month_count2_after: "bulan", repeat_year_label: "Pada", select_year_day2: "dari", repeat_text_year_day: "hari", select_year_month: "bulan", repeat_radio_end: "Tanpa tanggal akhir", repeat_text_occurrences_count: "kejadian", repeat_radio_end2: "Setelah", repeat_radio_end3: "Berakhir pada", repeat_never: "Tidak pernah", repeat_daily: "Setiap hari", repeat_workdays: "Setiap hari kerja", repeat_weekly: "Setiap minggu", repeat_monthly: "Setiap bulan", repeat_yearly: "Setiap tahun", repeat_custom: "Kustom", repeat_freq_day: "Hari", repeat_freq_week: "Minggu", repeat_freq_month: "Bulan", repeat_freq_year: "Tahun", repeat_on_date: "Pada tanggal", repeat_ends: "Berakhir", month_for_recurring: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] } }, ca = { date: { month_full: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], month_short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"], day_full: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"], day_short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"] }, labels: { dhx_cal_today_button: "Oggi", day_tab: "Giorno", week_tab: "Settimana", month_tab: "Mese", new_event: "Nuovo evento", icon_save: "Salva", icon_cancel: "Chiudi", icon_details: "Dettagli", icon_edit: "Modifica", icon_delete: "Elimina", confirm_closing: "", confirm_deleting: "L'evento sarà eliminato, siete sicuri?", section_description: "Descrizione", section_time: "Periodo di tempo", full_day: "Intera giornata", confirm_recurring: "Vuoi modificare l'intera serie di eventi?", section_recurring: "Ripetere l'evento", button_recurring: "Disattivato", button_recurring_open: "Attivato", button_edit_series: "Modificare la serie", button_edit_occurrence: "Modificare una copia", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Data", description: "Descrizione", year_tab: "Anno", week_agenda_tab: "Agenda", grid_tab: "Griglia", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Quotidiano", repeat_radio_week: "Settimanale", repeat_radio_month: "Mensile", repeat_radio_year: "Annuale", repeat_radio_day_type: "Ogni", repeat_text_day_count: "giorno", repeat_radio_day_type2: "Ogni giornata lavorativa", repeat_week: " Ripetere ogni", repeat_text_week_count: "settimana:", repeat_radio_month_type: "Ripetere", repeat_radio_month_start: "Il", repeat_text_month_day: "giorno ogni", repeat_text_month_count: "mese", repeat_text_month_count2_before: "ogni", repeat_text_month_count2_after: "mese", repeat_year_label: "Il", select_year_day2: "del", repeat_text_year_day: "giorno", select_year_month: "mese", repeat_radio_end: "Senza data finale", repeat_text_occurrences_count: "occorenze", repeat_radio_end3: "Fine", repeat_radio_end2: "Dopo", repeat_never: "Mai", repeat_daily: "Ogni giorno", repeat_workdays: "Ogni giorno feriale", repeat_weekly: "Ogni settimana", repeat_monthly: "Ogni mese", repeat_yearly: "Ogni anno", repeat_custom: "Personalizzato", repeat_freq_day: "Giorno", repeat_freq_week: "Settimana", repeat_freq_month: "Mese", repeat_freq_year: "Anno", repeat_on_date: "Alla data", repeat_ends: "Finisce", month_for_recurring: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Jiugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], day_for_recurring: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Jovedì", "Venerdì", "Sabato"] } }, ha = { date: { month_full: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], day_short: ["日", "月", "火", "水", "木", "金", "土"] }, labels: { dhx_cal_today_button: "今日", day_tab: "日", week_tab: "週", month_tab: "月", new_event: "新イベント", icon_save: "保存", icon_cancel: "キャンセル", icon_details: "詳細", icon_edit: "編集", icon_delete: "削除", confirm_closing: "", confirm_deleting: "イベント完全に削除されます、宜しいですか？", section_description: "デスクリプション", section_time: "期間", confirm_recurring: "繰り返されているイベントを全て編集しますか？", section_recurring: "イベントを繰り返す", button_recurring: "無効", button_recurring_open: "有効", full_day: "終日", button_edit_series: "シリーズを編集します", button_edit_occurrence: "コピーを編集", button_edit_occurrence_and_following: "This and following events", agenda_tab: "議題は", date: "日付", description: "説明", year_tab: "今年", week_agenda_tab: "議題は", grid_tab: "グリッド", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "毎日", repeat_radio_week: "毎週", repeat_radio_month: "毎月", repeat_radio_year: "毎年", repeat_radio_day_type: "毎", repeat_text_day_count: "日", repeat_radio_day_type2: "毎営業日", repeat_week: " 繰り返し毎", repeat_text_week_count: "週 次の日:", repeat_radio_month_type: "繰り返し", repeat_radio_month_start: "オン", repeat_text_month_day: "日毎", repeat_text_month_count: "月", repeat_text_month_count2_before: "毎", repeat_text_month_count2_after: "月", repeat_year_label: "オン", select_year_day2: "の", repeat_text_year_day: "日", select_year_month: "月", repeat_radio_end: "終了日なし", repeat_text_occurrences_count: "回数", repeat_radio_end2: "後", repeat_radio_end3: "終了日まで", repeat_never: "決して", repeat_daily: "毎日", repeat_workdays: "毎営業日", repeat_weekly: "毎週", repeat_monthly: "毎月", repeat_yearly: "毎年", repeat_custom: "カスタム", repeat_freq_day: "日", repeat_freq_week: "週", repeat_freq_month: "月", repeat_freq_year: "年", repeat_on_date: "日にち", repeat_ends: "終了", month_for_recurring: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_for_recurring: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"] } };
class ua {
  constructor(i) {
    this._locales = {};
    for (const t in i)
      this._locales[t] = i[t];
  }
  addLocale(i, t) {
    this._locales[i] = t;
  }
  getLocale(i) {
    return this._locales[i];
  }
}
const fa = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Mon", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "I dag", day_tab: "Dag", week_tab: "Uke", month_tab: "Måned", new_event: "Ny hendelse", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Rediger", icon_delete: "Slett", confirm_closing: "", confirm_deleting: "Hendelsen vil bli slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", confirm_recurring: "Vil du forandre hele dette settet av repeterende hendelser?", section_recurring: "Repeter hendelsen", button_recurring: "Av", button_recurring_open: "På", button_edit_series: "Rediger serien", button_edit_occurrence: "Redigere en kopi", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ukentlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "Alle hverdager", repeat_week: " Gjentas hver", repeat_text_week_count: "uke på:", repeat_radio_month_type: "På hver", repeat_radio_month_start: "På", repeat_text_month_day: "dag hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "på", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "", repeat_radio_end: "Ingen sluttdato", repeat_text_occurrences_count: "forekomst", repeat_radio_end3: "Stop den", repeat_radio_end2: "Etter", repeat_never: "Aldri", repeat_daily: "Hver dag", repeat_workdays: "Hver ukedag", repeat_weekly: "Hver uke", repeat_monthly: "Hver måned", repeat_yearly: "Hvert år", repeat_custom: "Tilpasset", repeat_freq_day: "Dag", repeat_freq_week: "Uke", repeat_freq_month: "Måned", repeat_freq_year: "År", repeat_on_date: "På dato", repeat_ends: "Slutter", month_for_recurring: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Sondag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, pa = { date: { month_full: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"], day_short: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"] }, labels: { dhx_cal_today_button: "Vandaag", day_tab: "Dag", week_tab: "Week", month_tab: "Maand", new_event: "Nieuw item", icon_save: "Opslaan", icon_cancel: "Annuleren", icon_details: "Details", icon_edit: "Bewerken", icon_delete: "Verwijderen", confirm_closing: "", confirm_deleting: "Item zal permanent worden verwijderd, doorgaan?", section_description: "Beschrijving", section_time: "Tijd periode", full_day: "Hele dag", confirm_recurring: "Wilt u alle terugkerende items bijwerken?", section_recurring: "Item herhalen", button_recurring: "Uit", button_recurring_open: "Aan", button_edit_series: "Bewerk de serie", button_edit_occurrence: "Bewerk een kopie", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Datum", description: "Omschrijving", year_tab: "Jaar", week_agenda_tab: "Agenda", grid_tab: "Tabel", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dagelijks", repeat_radio_week: "Wekelijks", repeat_radio_month: "Maandelijks", repeat_radio_year: "Jaarlijks", repeat_radio_day_type: "Elke", repeat_text_day_count: "dag(en)", repeat_radio_day_type2: "Elke werkdag", repeat_week: " Herhaal elke", repeat_text_week_count: "week op de volgende dagen:", repeat_radio_month_type: "Herhaal", repeat_radio_month_start: "Op", repeat_text_month_day: "dag iedere", repeat_text_month_count: "maanden", repeat_text_month_count2_before: "iedere", repeat_text_month_count2_after: "maanden", repeat_year_label: "Op", select_year_day2: "van", repeat_text_year_day: "dag", select_year_month: "maand", repeat_radio_end: "Geen eind datum", repeat_text_occurrences_count: "keren", repeat_radio_end3: "Eindigd per", repeat_radio_end2: "Na", repeat_never: "Nooit", repeat_daily: "Elke dag", repeat_workdays: "Elke werkdag", repeat_weekly: "Elke week", repeat_monthly: "Elke maand", repeat_yearly: "Elk jaar", repeat_custom: "Aangepast", repeat_freq_day: "Dag", repeat_freq_week: "Week", repeat_freq_month: "Maand", repeat_freq_year: "Jaar", repeat_on_date: "Op datum", repeat_ends: "Eindigt", month_for_recurring: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], day_for_recurring: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"] } }, va = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Uke", month_tab: "Måned", new_event: "Ny", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Endre", icon_delete: "Slett", confirm_closing: "Endringer blir ikke lagret, er du sikker?", confirm_deleting: "Oppføringen vil bli slettet, er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", full_day: "Full dag", confirm_recurring: "Vil du endre hele settet med repeterende oppføringer?", section_recurring: "Repeterende oppføring", button_recurring: "Ikke aktiv", button_recurring_open: "Aktiv", button_edit_series: "Rediger serien", button_edit_occurrence: "Redigere en kopi", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ukentlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "Hver arbeidsdag", repeat_week: " Gjenta hver", repeat_text_week_count: "uke neste dager:", repeat_radio_month_type: "Gjenta", repeat_radio_month_start: "På", repeat_text_month_day: "dag hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "På", select_year_day2: "av", repeat_text_year_day: "dag", select_year_month: "måned", repeat_radio_end: "Ingen sluttdato", repeat_text_occurrences_count: "forekomster", repeat_radio_end2: "Etter", repeat_radio_end3: "Slutt innen", repeat_never: "Aldri", repeat_daily: "Hver dag", repeat_workdays: "Hver ukedag", repeat_weekly: "Hver uke", repeat_monthly: "Hver måned", repeat_yearly: "Hvert år", repeat_custom: "Tilpasset", repeat_freq_day: "Dag", repeat_freq_week: "Uke", repeat_freq_month: "Måned", repeat_freq_year: "År", repeat_on_date: "På dato", repeat_ends: "Slutter", month_for_recurring: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, ma = { date: { month_full: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"], month_short: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"], day_full: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"], day_short: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"] }, labels: { dhx_cal_today_button: "Dziś", day_tab: "Dzień", week_tab: "Tydzień", month_tab: "Miesiąc", new_event: "Nowe zdarzenie", icon_save: "Zapisz", icon_cancel: "Anuluj", icon_details: "Szczegóły", icon_edit: "Edytuj", icon_delete: "Usuń", confirm_closing: "", confirm_deleting: "Zdarzenie zostanie usunięte na zawsze, kontynuować?", section_description: "Opis", section_time: "Okres czasu", full_day: "Cały dzień", confirm_recurring: "Czy chcesz edytować cały zbiór powtarzających się zdarzeń?", section_recurring: "Powtórz zdarzenie", button_recurring: "Nieaktywne", button_recurring_open: "Aktywne", button_edit_series: "Edytuj serię", button_edit_occurrence: "Edytuj kopię", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Data", description: "Opis", year_tab: "Rok", week_agenda_tab: "Agenda", grid_tab: "Tabela", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Codziennie", repeat_radio_week: "Co tydzie", repeat_radio_month: "Co miesic", repeat_radio_year: "Co rok", repeat_radio_day_type: "Kadego", repeat_text_day_count: "dnia", repeat_radio_day_type2: "Kadego dnia roboczego", repeat_week: " Powtarzaj kadego", repeat_text_week_count: "tygodnia w dni:", repeat_radio_month_type: "Powtrz", repeat_radio_month_start: "W", repeat_text_month_day: "dnia kadego", repeat_text_month_count: "miesica", repeat_text_month_count2_before: "kadego", repeat_text_month_count2_after: "miesica", repeat_year_label: "W", select_year_day2: "miesica", repeat_text_year_day: "dnia miesica", select_year_month: "", repeat_radio_end: "Bez daty kocowej", repeat_text_occurrences_count: "wystpieniu/ach", repeat_radio_end3: "Zakocz w", repeat_radio_end2: "Po", repeat_never: "Nigdy", repeat_daily: "Codziennie", repeat_workdays: "Każdy dzień roboczy", repeat_weekly: "Co tydzień", repeat_monthly: "Co miesiąc", repeat_yearly: "Co rok", repeat_custom: "Niestandardowy", repeat_freq_day: "Dzień", repeat_freq_week: "Tydzień", repeat_freq_month: "Miesiąc", repeat_freq_year: "Rok", repeat_on_date: "W dniu", repeat_ends: "Kończy się", month_for_recurring: ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Wrzenia", "Padziernka", "Listopada", "Grudnia"], day_for_recurring: ["Niedziela", "Poniedziaek", "Wtorek", "roda", "Czwartek", "Pitek", "Sobota"] } }, ga = { date: { month_full: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], month_short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], day_full: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"], day_short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] }, labels: { dhx_cal_today_button: "Hoje", day_tab: "Dia", week_tab: "Semana", month_tab: "Mês", new_event: "Novo evento", icon_save: "Salvar", icon_cancel: "Cancelar", icon_details: "Detalhes", icon_edit: "Editar", icon_delete: "Deletar", confirm_closing: "", confirm_deleting: "Tem certeza que deseja excluir?", section_description: "Descrição", section_time: "Período de tempo", full_day: "Dia inteiro", confirm_recurring: "Deseja editar todos esses eventos repetidos?", section_recurring: "Repetir evento", button_recurring: "Desabilitar", button_recurring_open: "Habilitar", button_edit_series: "Editar a série", button_edit_occurrence: "Editar uma cópia", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Dia", date: "Data", description: "Descrição", year_tab: "Ano", week_agenda_tab: "Dia", grid_tab: "Grade", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diário", repeat_radio_week: "Semanal", repeat_radio_month: "Mensal", repeat_radio_year: "Anual", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia(s)", repeat_radio_day_type2: "Cada trabalho diário", repeat_week: " Repita cada", repeat_text_week_count: "semana:", repeat_radio_month_type: "Repetir", repeat_radio_month_start: "Em", repeat_text_month_day: "todo dia", repeat_text_month_count: "mês", repeat_text_month_count2_before: "todo", repeat_text_month_count2_after: "mês", repeat_year_label: "Em", select_year_day2: "of", repeat_text_year_day: "dia", select_year_month: "mês", repeat_radio_end: "Sem data final", repeat_text_occurrences_count: "ocorrências", repeat_radio_end3: "Fim", repeat_radio_end2: "Depois", repeat_never: "Nunca", repeat_daily: "Todos os dias", repeat_workdays: "Todos os dias úteis", repeat_weekly: "Toda semana", repeat_monthly: "Todo mês", repeat_yearly: "Todo ano", repeat_custom: "Personalizado", repeat_freq_day: "Dia", repeat_freq_week: "Semana", repeat_freq_month: "Mês", repeat_freq_year: "Ano", repeat_on_date: "Na data", repeat_ends: "Termina", month_for_recurring: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], day_for_recurring: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] } }, ya = { date: { month_full: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "November", "December"], month_short: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"], day_short: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"] }, labels: { dhx_cal_today_button: "Astazi", day_tab: "Zi", week_tab: "Saptamana", month_tab: "Luna", new_event: "Eveniment nou", icon_save: "Salveaza", icon_cancel: "Anuleaza", icon_details: "Detalii", icon_edit: "Editeaza", icon_delete: "Sterge", confirm_closing: "Schimbarile nu vor fi salvate, esti sigur?", confirm_deleting: "Evenimentul va fi sters permanent, esti sigur?", section_description: "Descriere", section_time: "Interval", full_day: "Toata ziua", confirm_recurring: "Vrei sa editezi toata seria de evenimente repetate?", section_recurring: "Repetare", button_recurring: "Dezactivata", button_recurring_open: "Activata", button_edit_series: "Editeaza serie", button_edit_occurrence: "Editeaza doar intrare", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Data", description: "Descriere", year_tab: "An", week_agenda_tab: "Agenda", grid_tab: "Lista", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Zilnic", repeat_radio_week: "Saptamanal", repeat_radio_month: "Lunar", repeat_radio_year: "Anual", repeat_radio_day_type: "La fiecare", repeat_text_day_count: "zi(le)", repeat_radio_day_type2: "Fiecare zi lucratoare", repeat_week: " Repeta la fiecare", repeat_text_week_count: "saptamana in urmatoarele zile:", repeat_radio_month_type: "Repeta in", repeat_radio_month_start: "In a", repeat_text_month_day: "zi la fiecare", repeat_text_month_count: "luni", repeat_text_month_count2_before: "la fiecare", repeat_text_month_count2_after: "luni", repeat_year_label: "In", select_year_day2: "a lunii", repeat_text_year_day: "zi a lunii", select_year_month: "", repeat_radio_end: "Fara data de sfarsit", repeat_text_occurrences_count: "evenimente", repeat_radio_end3: "La data", repeat_radio_end2: "Dupa", repeat_never: "Niciodată", repeat_daily: "În fiecare zi", repeat_workdays: "În fiecare zi lucrătoare", repeat_weekly: "În fiecare săptămână", repeat_monthly: "În fiecare lună", repeat_yearly: "În fiecare an", repeat_custom: "Personalizat", repeat_freq_day: "Zi", repeat_freq_week: "Săptămână", repeat_freq_month: "Lună", repeat_freq_year: "An", repeat_on_date: "La data", repeat_ends: "Se termină", month_for_recurring: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"], day_for_recurring: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"] } }, ba = { date: { month_full: ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"], month_short: ["Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек"], day_full: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"], day_short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] }, labels: { dhx_cal_today_button: "Сегодня", day_tab: "День", week_tab: "Неделя", month_tab: "Месяц", new_event: "Новое событие", icon_save: "Сохранить", icon_cancel: "Отменить", icon_details: "Детали", icon_edit: "Изменить", icon_delete: "Удалить", confirm_closing: "", confirm_deleting: "Событие будет удалено безвозвратно, продолжить?", section_description: "Описание", section_time: "Период времени", full_day: "Весь день", confirm_recurring: "Вы хотите изменить всю серию повторяющихся событий?", section_recurring: "Повторение", button_recurring: "Отключено", button_recurring_open: "Включено", button_edit_series: "Редактировать серию", button_edit_occurrence: "Редактировать экземпляр", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Список", date: "Дата", description: "Описание", year_tab: "Год", week_agenda_tab: "Список", grid_tab: "Таблица", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "День", repeat_radio_week: "Неделя", repeat_radio_month: "Месяц", repeat_radio_year: "Год", repeat_radio_day_type: "Каждый", repeat_text_day_count: "день", repeat_radio_day_type2: "Каждый рабочий день", repeat_week: " Повторять каждую", repeat_text_week_count: "неделю , в:", repeat_radio_month_type: "Повторять", repeat_radio_month_start: "", repeat_text_month_day: " числа каждый ", repeat_text_month_count: "месяц", repeat_text_month_count2_before: "каждый ", repeat_text_month_count2_after: "месяц", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "день", select_year_month: "", repeat_radio_end: "Без даты окончания", repeat_text_occurrences_count: "повторений", repeat_radio_end3: "До ", repeat_radio_end2: "", repeat_never: "Никогда", repeat_daily: "Каждый день", repeat_workdays: "Каждый будний день", repeat_weekly: "Каждую неделю", repeat_monthly: "Каждый месяц", repeat_yearly: "Каждый год", repeat_custom: "Настроить", repeat_freq_day: "День", repeat_freq_week: "Неделя", repeat_freq_month: "Месяц", repeat_freq_year: "Год", repeat_on_date: "В дату", repeat_ends: "Заканчивается", month_for_recurring: ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"], day_for_recurring: ["Воскресенье", "Понедельник", "Вторник", "Среду", "Четверг", "Пятницу", "Субботу"] } }, xa = { date: { month_full: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"], day_short: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"] }, labels: { dhx_cal_today_button: "Danes", day_tab: "Dan", week_tab: "Teden", month_tab: "Mesec", new_event: "Nov dogodek", icon_save: "Shrani", icon_cancel: "Prekliči", icon_details: "Podrobnosti", icon_edit: "Uredi", icon_delete: "Izbriši", confirm_closing: "", confirm_deleting: "Dogodek bo izbrisan. Želite nadaljevati?", section_description: "Opis", section_time: "Časovni okvir", full_day: "Ves dan", confirm_recurring: "Želite urediti celoten set ponavljajočih dogodkov?", section_recurring: "Ponovi dogodek", button_recurring: "Onemogočeno", button_recurring_open: "Omogočeno", button_edit_series: "Edit series", button_edit_occurrence: "Edit occurrence", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Zadeva", date: "Datum", description: "Opis", year_tab: "Leto", week_agenda_tab: "Zadeva", grid_tab: "Miza", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dnevno", repeat_radio_week: "Tedensko", repeat_radio_month: "Mesečno", repeat_radio_year: "Letno", repeat_radio_day_type: "Vsak", repeat_text_day_count: "dan", repeat_radio_day_type2: "Vsak delovni dan", repeat_week: " Ponavljaj vsak", repeat_text_week_count: "teden na naslednje dni:", repeat_radio_month_type: "Ponavljaj", repeat_radio_month_start: "Na", repeat_text_month_day: "dan vsak", repeat_text_month_count: "mesec", repeat_text_month_count2_before: "vsak", repeat_text_month_count2_after: "mesec", repeat_year_label: "Na", select_year_day2: "od", repeat_text_year_day: "dan", select_year_month: "mesec", repeat_radio_end: "Brez končnega datuma", repeat_text_occurrences_count: "pojavitve", repeat_radio_end2: "Po", repeat_radio_end3: "Končaj do", repeat_never: "Nikoli", repeat_daily: "Vsak dan", repeat_workdays: "Vsak delovni dan", repeat_weekly: "Vsak teden", repeat_monthly: "Vsak mesec", repeat_yearly: "Vsako leto", repeat_custom: "Po meri", repeat_freq_day: "Dan", repeat_freq_week: "Teden", repeat_freq_month: "Mesec", repeat_freq_year: "Leto", repeat_on_date: "Na datum", repeat_ends: "Konča se", month_for_recurring: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], day_for_recurring: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"] } }, wa = { date: { month_full: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sept", "Okt", "Nov", "Dec"], day_full: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"], day_short: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"] }, labels: { dhx_cal_today_button: "Dnes", day_tab: "Deň", week_tab: "Týždeň", month_tab: "Mesiac", new_event: "Nová udalosť", icon_save: "Uložiť", icon_cancel: "Späť", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Zmazať", confirm_closing: "Vaše zmeny nebudú uložené. Skutočne?", confirm_deleting: "Udalosť bude natrvalo vymazaná. Skutočne?", section_description: "Poznámky", section_time: "Doba platnosti", confirm_recurring: "Prajete si upraviť celú radu opakovaných udalostí?", section_recurring: "Opakovanie udalosti", button_recurring: "Vypnuté", button_recurring_open: "Zapnuté", button_edit_series: "Upraviť opakovania", button_edit_occurrence: "Upraviť inštancie", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Program", date: "Dátum", description: "Poznámka", year_tab: "Rok", full_day: "Celý deň", week_agenda_tab: "Program", grid_tab: "Mriežka", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Denne", repeat_radio_week: "Týždenne", repeat_radio_month: "Mesaène", repeat_radio_year: "Roène", repeat_radio_day_type: "Každý", repeat_text_day_count: "deò", repeat_radio_day_type2: "Každý prac. deò", repeat_week: "Opakova každý", repeat_text_week_count: "týždeò v dòoch:", repeat_radio_month_type: "Opakova", repeat_radio_month_start: "On", repeat_text_month_day: "deò každý", repeat_text_month_count: "mesiac", repeat_text_month_count2_before: "každý", repeat_text_month_count2_after: "mesiac", repeat_year_label: "On", select_year_day2: "poèas", repeat_text_year_day: "deò", select_year_month: "mesiac", repeat_radio_end: "Bez dátumu ukonèenia", repeat_text_occurrences_count: "udalostiach", repeat_radio_end3: "Ukonèi", repeat_radio_end2: "Po", repeat_never: "Nikdy", repeat_daily: "Každý deň", repeat_workdays: "Každý pracovný deň", repeat_weekly: "Každý týždeň", repeat_monthly: "Každý mesiac", repeat_yearly: "Každý rok", repeat_custom: "Vlastné", repeat_freq_day: "Deň", repeat_freq_week: "Týždeň", repeat_freq_month: "Mesiac", repeat_freq_year: "Rok", repeat_on_date: "Na dátum", repeat_ends: "Koniec", month_for_recurring: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], day_for_recurring: ["Nede¾a", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"] } }, ka = { date: { month_full: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"], day_short: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Vecka", month_tab: "Månad", new_event: "Ny händelse", icon_save: "Spara", icon_cancel: "Ångra", icon_details: "Detaljer", icon_edit: "Ändra", icon_delete: "Ta bort", confirm_closing: "", confirm_deleting: "Är du säker på att du vill ta bort händelsen permanent?", section_description: "Beskrivning", section_time: "Tid", full_day: "Hela dagen", confirm_recurring: "Vill du redigera hela serien med repeterande händelser?", section_recurring: "Upprepa händelse", button_recurring: "Inaktiverat", button_recurring_open: "Aktiverat", button_edit_series: "Redigera serien", button_edit_occurrence: "Redigera en kopia", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Dagordning", date: "Datum", description: "Beskrivning", year_tab: "År", week_agenda_tab: "Dagordning", grid_tab: "Galler", drag_to_create: "Dra för att skapa ny", drag_to_move: "Dra för att flytta", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dagligen", repeat_radio_week: "Veckovis", repeat_radio_month: "Månadsvis", repeat_radio_year: "Årligen", repeat_radio_day_type: "Var", repeat_text_day_count: "dag", repeat_radio_day_type2: "Varje arbetsdag", repeat_week: " Upprepa var", repeat_text_week_count: "vecka dessa dagar:", repeat_radio_month_type: "Upprepa", repeat_radio_month_start: "Den", repeat_text_month_day: "dagen var", repeat_text_month_count: "månad", repeat_text_month_count2_before: "var", repeat_text_month_count2_after: "månad", repeat_year_label: "Den", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "månad", repeat_radio_end: "Inget slutdatum", repeat_text_occurrences_count: "upprepningar", repeat_radio_end3: "Sluta efter", repeat_radio_end2: "Efter", repeat_never: "Aldrig", repeat_daily: "Varje dag", repeat_workdays: "Varje vardag", repeat_weekly: "Varje vecka", repeat_monthly: "Varje månad", repeat_yearly: "Varje år", repeat_custom: "Anpassad", repeat_freq_day: "Dag", repeat_freq_week: "Vecka", repeat_freq_month: "Månad", repeat_freq_year: "År", repeat_on_date: "På datum", repeat_ends: "Slutar", month_for_recurring: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], day_for_recurring: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"] } }, Ea = { date: { month_full: ["Ocak", "Þubat", "Mart", "Nisan", "Mayýs", "Haziran", "Temmuz", "Aðustos", "Eylül", "Ekim", "Kasým", "Aralýk"], month_short: ["Oca", "Þub", "Mar", "Nis", "May", "Haz", "Tem", "Aðu", "Eyl", "Eki", "Kas", "Ara"], day_full: ["Pazar", "Pazartes,", "Salý", "Çarþamba", "Perþembe", "Cuma", "Cumartesi"], day_short: ["Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"] }, labels: { dhx_cal_today_button: "Bugün", day_tab: "Gün", week_tab: "Hafta", month_tab: "Ay", new_event: "Uygun", icon_save: "Kaydet", icon_cancel: "Ýptal", icon_details: "Detaylar", icon_edit: "Düzenle", icon_delete: "Sil", confirm_closing: "", confirm_deleting: "Etkinlik silinecek, devam?", section_description: "Açýklama", section_time: "Zaman aralýðý", full_day: "Tam gün", confirm_recurring: "Tüm tekrar eden etkinlikler silinecek, devam?", section_recurring: "Etkinliði tekrarla", button_recurring: "Pasif", button_recurring_open: "Aktif", button_edit_series: "Dizi düzenleme", button_edit_occurrence: "Bir kopyasını düzenleyin", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Ajanda", date: "Tarih", description: "Açýklama", year_tab: "Yýl", week_agenda_tab: "Ajanda", grid_tab: "Izgara", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Günlük", repeat_radio_week: "Haftalık", repeat_radio_month: "Aylık", repeat_radio_year: "Yıllık", repeat_radio_day_type: "Her", repeat_text_day_count: "gün", repeat_radio_day_type2: "Her iş günü", repeat_week: " Tekrar her", repeat_text_week_count: "hafta şu günlerde:", repeat_radio_month_type: "Tekrar et", repeat_radio_month_start: "Tarihinde", repeat_text_month_day: "gün her", repeat_text_month_count: "ay", repeat_text_month_count2_before: "her", repeat_text_month_count2_after: "ay", repeat_year_label: "Tarihinde", select_year_day2: "ayın", repeat_text_year_day: "günü", select_year_month: "ay", repeat_radio_end: "Bitiş tarihi yok", repeat_text_occurrences_count: "olay", repeat_radio_end2: "Sonra", repeat_radio_end3: "Tarihinde bitir", repeat_never: "Asla", repeat_daily: "Her gün", repeat_workdays: "Her iş günü", repeat_weekly: "Her hafta", repeat_monthly: "Her ay", repeat_yearly: "Her yıl", repeat_custom: "Özel", repeat_freq_day: "Gün", repeat_freq_week: "Hafta", repeat_freq_month: "Ay", repeat_freq_year: "Yıl", repeat_on_date: "Tarihinde", repeat_ends: "Biter", month_for_recurring: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"], day_for_recurring: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"] } }, Da = { date: { month_full: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"], month_short: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], day_full: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"], day_short: ["Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"] }, labels: { dhx_cal_today_button: "Сьогодні", day_tab: "День", week_tab: "Тиждень", month_tab: "Місяць", new_event: "Нова подія", icon_save: "Зберегти", icon_cancel: "Відміна", icon_details: "Деталі", icon_edit: "Редагувати", icon_delete: "Вилучити", confirm_closing: "", confirm_deleting: "Подія вилучиться назавжди. Ви впевнені?", section_description: "Опис", section_time: "Часовий проміжок", full_day: "Весь день", confirm_recurring: "Хочете редагувати весь перелік повторюваних подій?", section_recurring: "Повторювана подія", button_recurring: "Відключено", button_recurring_open: "Включено", button_edit_series: "Редагувати серію", button_edit_occurrence: "Редагувати примірник", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Перелік", date: "Дата", description: "Опис", year_tab: "Рік", week_agenda_tab: "Перелік", grid_tab: "Таблиця", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "День", repeat_radio_week: "Тиждень", repeat_radio_month: "Місяць", repeat_radio_year: "Рік", repeat_radio_day_type: "Кожний", repeat_text_day_count: "день", repeat_radio_day_type2: "Кожний робочий день", repeat_week: " Повторювати кожен", repeat_text_week_count: "тиждень , по:", repeat_radio_month_type: "Повторювати", repeat_radio_month_start: "", repeat_text_month_day: " числа кожний ", repeat_text_month_count: "місяць", repeat_text_month_count2_before: "кожен ", repeat_text_month_count2_after: "місяць", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "день", select_year_month: "", repeat_radio_end: "Без дати закінчення", repeat_text_occurrences_count: "повторень", repeat_radio_end3: "До ", repeat_radio_end2: "", repeat_never: "Ніколи", repeat_daily: "Щодня", repeat_workdays: "Щодня в робочі дні", repeat_weekly: "Щотижня", repeat_monthly: "Щомісяця", repeat_yearly: "Щороку", repeat_custom: "Налаштоване", repeat_freq_day: "День", repeat_freq_week: "Тиждень", repeat_freq_month: "Місяць", repeat_freq_year: "Рік", repeat_on_date: "На дату", repeat_ends: "Закінчується", month_for_recurring: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"], day_for_recurring: ["Неділям", "Понеділкам", "Вівторкам", "Середам", "Четвергам", "П'ятницям", "Суботам"] } };
class Sa {
  constructor(i, t, r = {}) {
    this.state = { date: /* @__PURE__ */ new Date(), modes: ["days", "months", "years"], currentRange: [], eventDates: [], filterDays: null, currentModeIndex: 0, ...r }, this.container = null, this.element = null, this.onStateChangeHandlers = [], this.scheduler = i, this._domEvents = i._createDomEventScope(), this.state = this.getState(), Ve(this), t && (this.container = t, this.render(this.container)), this.onStateChange((s, n) => {
      this.callEvent("onStateChange", [n, s]);
    });
  }
  getState() {
    return { ...this.state, mode: this.state.modes[this.state.currentModeIndex] };
  }
  setState(i) {
    const t = { ...this.state };
    i.mode && (i.currentModeIndex = this.state.modes.indexOf(i.mode)), this.state = { ...this.state, ...i }, this._notifyStateChange(t, this.state), this.container && this.render(this.container);
  }
  onStateChange(i) {
    return this.onStateChangeHandlers.push(i), () => {
      const t = this.onStateChangeHandlers.indexOf(i);
      t !== -1 && this.onStateChangeHandlers.splice(t, 1);
    };
  }
  _notifyStateChange(i, t) {
    this.onStateChangeHandlers.forEach((r) => r(i, t));
  }
  _adjustDate(i) {
    const { mode: t, date: r } = this.getState(), s = new Date(r);
    t === "days" ? s.setMonth(r.getMonth() + i) : t === "months" ? s.setFullYear(r.getFullYear() + i) : s.setFullYear(r.getFullYear() + 10 * i), this.setState({ date: s });
  }
  _toggleMode() {
    const i = (this.state.currentModeIndex + 1) % this.state.modes.length;
    this.setState({ currentModeIndex: i });
  }
  _renderCalendarHeader(i) {
    const { mode: t, date: r } = this.getState(), s = document.createElement("div");
    s.classList.add("dhx_cal_datepicker_header");
    const n = document.createElement("button");
    n.classList.add("dhx_cal_datepicker_arrow", "scheduler_icon", "arrow_left"), s.appendChild(n);
    const o = document.createElement("div");
    if (o.classList.add("dhx_cal_datepicker_title"), t === "days")
      o.innerText = r.toLocaleString("default", { month: "long" }) + " " + r.getFullYear();
    else if (t === "months")
      o.innerText = r.getFullYear();
    else {
      const a = 10 * Math.floor(r.getFullYear() / 10);
      o.innerText = `${a} - ${a + 9}`;
    }
    this._domEvents.attach(o, "click", this._toggleMode.bind(this)), s.appendChild(o);
    const _ = document.createElement("button");
    _.classList.add("dhx_cal_datepicker_arrow", "scheduler_icon", "arrow_right"), s.appendChild(_), i.appendChild(s), this._domEvents.attach(n, "click", this._adjustDate.bind(this, -1)), this._domEvents.attach(_, "click", this._adjustDate.bind(this, 1));
  }
  render(i) {
    this._domEvents.detachAll(), this.container = i || this.container, this.container.innerHTML = "", this.element || (this.element = document.createElement("div"), this.element.classList.add("dhx_cal_datepicker")), this.element.innerHTML = "", this.container.appendChild(this.element), this._renderCalendarHeader(this.element);
    const t = document.createElement("div");
    t.classList.add("dhx_cal_datepicker_data"), this.element.appendChild(t);
    const { mode: r } = this.getState();
    r === "days" ? this._renderDayGrid(t) : r === "months" ? this._renderMonthGrid(t) : this._renderYearGrid(t);
  }
  _renderDayGridHeader(i) {
    const { date: t, filterDays: r } = this.getState(), s = this.scheduler;
    let n = s.date.week_start(new Date(t));
    const o = s.date.add(s.date.week_start(new Date(t)), 1, "week");
    i.classList.add("dhx_cal_datepicker_days");
    const _ = s.date.date_to_str("%D");
    for (; n.valueOf() < o.valueOf(); ) {
      if (!r || !r(n)) {
        const a = _(n), d = document.createElement("div");
        d.setAttribute("data-day", n.getDay()), d.classList.add("dhx_cal_datepicker_dayname"), d.innerText = a, i.appendChild(d);
      }
      n = s.date.add(n, 1, "day");
    }
  }
  _weeksBetween(i, t) {
    const r = this.scheduler;
    let s = 0, n = new Date(i);
    for (; n.valueOf() < t.valueOf(); )
      s += 1, n = r.date.week_start(r.date.add(n, 1, "week"));
    return s;
  }
  _renderDayGrid(i) {
    const { date: t, currentRange: r, eventDates: s, minWeeks: n, filterDays: o } = this.getState();
    let _ = r[0], a = r[1];
    const d = s.reduce((E, S) => (E[this.scheduler.date.day_start(new Date(S)).valueOf()] = !0, E), {}), l = document.createElement("div");
    this._renderDayGridHeader(l);
    const c = l.children.length;
    i.appendChild(l), c !== 7 && i.style.setProperty("--dhx-scheduler-week-length", c);
    const f = this.scheduler, v = f.date.week_start(f.date.month_start(new Date(t))), p = f.date.month_start(new Date(t)), h = f.date.add(f.date.month_start(new Date(t)), 1, "month");
    let u = f.date.add(f.date.month_start(new Date(t)), 1, "month");
    const m = f.date.date_part(f._currentDate());
    u.getDay() !== 0 && (u = f.date.add(f.date.week_start(u), 1, "week"));
    let y = this._weeksBetween(v, u);
    n && y < n && (u = f.date.add(u, n - y, "week"));
    let w = v;
    const D = document.createElement("div");
    for (D.classList.add("dhx_cal_datepicker_days"), this._domEvents.attach(D, "click", (E) => {
      const S = E.target.closest("[data-cell-date]"), g = new Date(S.getAttribute("data-cell-date"));
      this.callEvent("onDateClick", [g, E]);
    }); w.valueOf() < u.valueOf(); ) {
      if (!o || !o(w)) {
        const E = document.createElement("div");
        E.setAttribute("data-cell-date", f.templates.format_date(w)), E.setAttribute("data-day", w.getDay()), E.innerHTML = w.getDate(), w.valueOf() < p.valueOf() ? E.classList.add("dhx_before") : w.valueOf() >= h.valueOf() && E.classList.add("dhx_after"), w.getDay() !== 0 && w.getDay() !== 6 || E.classList.add("dhx_cal_datepicker_weekend"), w.valueOf() == m.valueOf() && E.classList.add("dhx_now"), _ && a && w.valueOf() >= _.valueOf() && w.valueOf() < a.valueOf() && E.classList.add("dhx_cal_datepicker_current"), d[w.valueOf()] && E.classList.add("dhx_cal_datepicker_event"), E.classList.add("dhx_cal_datepicker_date"), D.appendChild(E);
      }
      w = f.date.add(w, 1, "day");
    }
    i.appendChild(D);
  }
  _renderMonthGrid(i) {
    const { date: t } = this.getState(), r = document.createElement("div");
    r.classList.add("dhx_cal_datepicker_months");
    const s = [];
    for (let a = 0; a < 12; a++)
      s.push(new Date(t.getFullYear(), a, 1));
    const n = this.scheduler.date.date_to_str("%M");
    s.forEach((a) => {
      const d = document.createElement("div");
      d.classList.add("dhx_cal_datepicker_month"), t.getMonth() === a.getMonth() && d.classList.add("dhx_cal_datepicker_current"), d.setAttribute("data-month", a.getMonth()), d.innerHTML = n(a), this._domEvents.attach(d, "click", () => {
        const l = new Date(a);
        this.setState({ date: l, mode: "days" });
      }), r.appendChild(d);
    }), i.appendChild(r);
    const o = document.createElement("div");
    o.classList.add("dhx_cal_datepicker_done");
    const _ = document.createElement("button");
    _.innerText = "Done", _.classList.add("dhx_cal_datepicker_done_btn"), this._domEvents.attach(_, "click", () => {
      this.setState({ mode: "days" });
    }), o.appendChild(_), i.appendChild(o);
  }
  _renderYearGrid(i) {
    const { date: t } = this.getState(), r = 10 * Math.floor(t.getFullYear() / 10), s = document.createElement("div");
    s.classList.add("dhx_cal_datepicker_years");
    for (let _ = r - 1; _ <= r + 10; _++) {
      const a = document.createElement("div");
      a.innerText = _, a.classList.add("dhx_cal_datepicker_year"), a.setAttribute("data-year", _), t.getFullYear() === _ && a.classList.add("dhx_cal_datepicker_current"), this._domEvents.attach(a, "click", () => {
        this.setState({ date: new Date(_, t.getMonth(), 1), mode: "months" });
      }), s.appendChild(a);
    }
    i.appendChild(s);
    const n = document.createElement("div");
    n.classList.add("dhx_cal_datepicker_done");
    const o = document.createElement("button");
    o.innerText = "Done", o.classList.add("dhx_cal_datepicker_done_btn"), this._domEvents.attach(o, "click", () => {
      this.setState({ mode: "months" });
    }), n.appendChild(o), i.appendChild(n);
  }
  destructor() {
    this.onStateChangeHandlers = [], this.element && (this.element.innerHTML = "", this.element.remove()), this._domEvents.detachAll(), this.callEvent("onDestroy", []), this.detachAllEvents(), this.scheduler = null;
  }
}
function Ma(e) {
  const i = { version: "7.2.1" };
  i.$stateProvider = function() {
    const a = {};
    return { getState: function(d) {
      if (a[d])
        return a[d].method();
      {
        const l = {};
        for (const c in a)
          a[c].internal || ae.mixin(l, a[c].method(), !0);
        return l;
      }
    }, registerProvider: function(d, l, c) {
      a[d] = { method: l, internal: c };
    }, unregisterProvider: function(d) {
      delete a[d];
    } };
  }(), i.getState = i.$stateProvider.getState, function(a) {
    var d = { agenda: "https://docs.dhtmlx.com/scheduler/agenda_view.html", grid: "https://docs.dhtmlx.com/scheduler/grid_view.html", map: "https://docs.dhtmlx.com/scheduler/map_view.html", unit: "https://docs.dhtmlx.com/scheduler/units_view.html", timeline: "https://docs.dhtmlx.com/scheduler/timeline_view.html", week_agenda: "https://docs.dhtmlx.com/scheduler/weekagenda_view.html", year: "https://docs.dhtmlx.com/scheduler/year_view.html", anythingElse: "https://docs.dhtmlx.com/scheduler/views.html" }, l = { agenda: "ext/dhtmlxscheduler_agenda_view.js", grid: "ext/dhtmlxscheduler_grid_view.js", map: "ext/dhtmlxscheduler_map_view.js", unit: "ext/dhtmlxscheduler_units.js", timeline: "ext/dhtmlxscheduler_timeline.js, ext/dhtmlxscheduler_treetimeline.js, ext/dhtmlxscheduler_daytimeline.js", week_agenda: "ext/dhtmlxscheduler_week_agenda.js", year: "ext/dhtmlxscheduler_year_view.js", limit: "ext/dhtmlxscheduler_limit.js" };
    a._commonErrorMessages = { unknownView: function(c) {
      var f = l[c] ? "You're probably missing " + l[c] + "." : "";
      return "`" + c + "` view is not defined. \nPlease check parameters you pass to `scheduler.init` or `scheduler.setCurrentView` in your code and ensure you've imported appropriate extensions. \nRelated docs: " + (d[c] || d.anythingElse) + `
` + (f ? f + `
` : "");
    }, collapsedContainer: function(c) {
      return `Scheduler container height is set to *100%* but the rendered height is zero and the scheduler is not visible. 
Make sure that the container has some initial height or use different units. For example:
<div id='scheduler_here' class='dhx_cal_container' style='width:100%; height:600px;'> 
`;
    } }, a.createTimelineView = function() {
      throw new Error("scheduler.createTimelineView is not implemented. Be sure to add the required extension: " + l.timeline + `
Related docs: ` + d.timeline);
    }, a.createUnitsView = function() {
      throw new Error("scheduler.createUnitsView is not implemented. Be sure to add the required extension: " + l.unit + `
Related docs: ` + d.unit);
    }, a.createGridView = function() {
      throw new Error("scheduler.createGridView is not implemented. Be sure to add the required extension: " + l.grid + `
Related docs: ` + d.grid);
    }, a.addMarkedTimespan = function() {
      throw new Error(`scheduler.addMarkedTimespan is not implemented. Be sure to add the required extension: ext/dhtmlxscheduler_limit.js
Related docs: https://docs.dhtmlx.com/scheduler/limits.html`);
    }, a.renderCalendar = function() {
      throw new Error(`scheduler.renderCalendar is not implemented. Be sure to add the required extension: ext/dhtmlxscheduler_minical.js
https://docs.dhtmlx.com/scheduler/minicalendar.html`);
    }, a.exportToPNG = function() {
      throw new Error(["scheduler.exportToPNG is not implemented.", "This feature requires an additional module, be sure to check the related doc here https://docs.dhtmlx.com/scheduler/png.html", "Licensing info: https://dhtmlx.com/docs/products/dhtmlxScheduler/export.shtml"].join(`
`));
    }, a.exportToPDF = function() {
      throw new Error(["scheduler.exportToPDF is not implemented.", "This feature requires an additional module, be sure to check the related doc here https://docs.dhtmlx.com/scheduler/pdf.html", "Licensing info: https://dhtmlx.com/docs/products/dhtmlxScheduler/export.shtml"].join(`
`));
    };
  }(i), qt(i), function(a) {
    Ve(a), $t(a), a._detachDomEvent = function(h, u, m) {
      h.removeEventListener ? h.removeEventListener(u, m, !1) : h.detachEvent && h.detachEvent("on" + u, m);
    }, a._init_once = function() {
      Ht(a), a._init_once = function() {
      };
    };
    const d = { render: function(h) {
      return a._init_nav_bar(h);
    } }, l = { render: function(h) {
      const u = document.createElement("div");
      return u.className = "dhx_cal_header", u;
    } }, c = { render: function(h) {
      const u = document.createElement("div");
      return u.className = "dhx_cal_data", u;
    } };
    function f(h) {
      return !!(h.querySelector(".dhx_cal_header") && h.querySelector(".dhx_cal_data") && h.querySelector(".dhx_cal_navline"));
    }
    a.init = function(h, u, m) {
      if (!this.$destroyed) {
        if (u = u || a._currentDate(), m = m || "week", this._obj && this.unset_actions(), this._obj = typeof h == "string" ? document.getElementById(h) : h, this.$container = this._obj, this.$root = this._obj, !this.$container.offsetHeight && this.$container.offsetWidth && this.$container.style.height === "100%" && window.console.error(a._commonErrorMessages.collapsedContainer(), this.$container), this.config.wai_aria_attributes && this.config.wai_aria_application_role && this.$container.setAttribute("role", "application"), this.config.header || f(this.$container) || (this.config.header = function(y) {
          const w = ["day", "week", "month"];
          if (y.matrix)
            for (const D in y.matrix)
              w.push(D);
          if (y._props)
            for (const D in y._props)
              w.push(D);
          if (y._grid && y._grid.names)
            for (const D in y._grid.names)
              w.push(D);
          return ["map", "agenda", "week_agenda", "year"].forEach(function(D) {
            y[D + "_view"] && w.push(D);
          }), w.concat(["date"]).concat(["prev", "today", "next"]);
        }(this), window.console.log(["Required DOM elements are missing from the scheduler container and **scheduler.config.header** is not specified.", "Using a default header configuration: ", "scheduler.config.header = " + JSON.stringify(this.config.header, null, 2), "Check this article for the details: https://docs.dhtmlx.com/scheduler/initialization.html"].join(`
`))), this.config.header)
          this.$container.innerHTML = "", this.$container.classList.add("dhx_cal_container"), this.config.header.height && (this.xy.nav_height = this.config.header.height), this.$container.appendChild(d.render(this.config.header)), this.$container.appendChild(l.render()), this.$container.appendChild(c.render());
        else if (!f(this.$container))
          throw new Error(["Required DOM elements are missing from the scheduler container.", "Be sure to either specify them manually in the markup: https://docs.dhtmlx.com/scheduler/initialization.html#initializingschedulerviamarkup", "Or to use **scheduler.config.header** setting so they could be created automatically: https://docs.dhtmlx.com/scheduler/initialization.html#initializingschedulerviaheaderconfig"].join(`
`));
        this.config.rtl && (this.$container.className += " dhx_cal_container_rtl"), this._skin_init && a._skin_init(), a.date.init(), this._scroll = !0, this._els = [], this.get_elements(), this.init_templates(), this.set_actions(), this._init_once(), this._init_touch_events(), this.set_sizes(), a.callEvent("onSchedulerReady", []), a.$initialized = !0, this.setCurrentView(u, m);
      }
    }, a.xy = { min_event_height: 20, bar_height: 24, scale_width: 50, scroll_width: 18, scale_height: 20, month_scale_height: 20, menu_width: 25, margin_top: 0, margin_left: 0, editor_width: 140, month_head_height: 22, event_header_height: 14 }, a.keys = { edit_save: 13, edit_cancel: 27 }, a.bind = function(h, u) {
      return h.bind ? h.bind(u) : function() {
        return h.apply(u, arguments);
      };
    }, a.set_sizes = function() {
      var h = this._x = this._obj.clientWidth - this.xy.margin_left, u = this._table_view ? 0 : this.xy.scale_width + this.xy.scroll_width, m = this.$container.querySelector(".dhx_cal_scale_placeholder");
      a._is_material_skin() ? (m || ((m = document.createElement("div")).className = "dhx_cal_scale_placeholder", this.$container.insertBefore(m, this._els.dhx_cal_header[0])), m.style.display = "block", this.set_xy(m, h, this.xy.scale_height + 1, 0, this._els.dhx_cal_header[0].offsetTop)) : m && m.parentNode.removeChild(m), this._lightbox && (a.$container.offsetWidth < 1200 || this._setLbPosition(document.querySelector(".dhx_cal_light"))), this._data_width = h - u, this._els.dhx_cal_navline[0].style.width = h + "px";
      const y = this._els.dhx_cal_header[0];
      this.set_xy(y, this._data_width, this.xy.scale_height), y.style.left = "", y.style.right = "", this._table_view ? this.config.rtl ? y.style.right = "-1px" : y.style.left = "-1px" : this.config.rtl ? y.style.right = `${this.xy.scale_width}px` : y.style.left = `${this.xy.scale_width}px`;
    }, a.set_xy = function(h, u, m, y, w) {
      function D(S) {
        let g = S;
        return isNaN(Number(g)) || (g = Math.max(0, g) + "px"), g;
      }
      var E = "left";
      u !== void 0 && (h.style.width = D(u)), m !== void 0 && (h.style.height = D(m)), arguments.length > 3 && (y !== void 0 && (this.config.rtl && (E = "right"), h.style[E] = y + "px"), w !== void 0 && (h.style.top = w + "px"));
    }, a.get_elements = function() {
      const h = this._obj.getElementsByTagName("DIV");
      for (let u = 0; u < h.length; u++) {
        let m = a._getClassName(h[u]);
        const y = h[u].getAttribute("data-tab") || h[u].getAttribute("name") || "";
        m && (m = m.split(" ")[0]), this._els[m] || (this._els[m] = []), this._els[m].push(h[u]);
        let w = a.locale.labels[y + "_tab"] || a.locale.labels[y || m];
        typeof w != "string" && y && !h[u].innerHTML && (w = y.split("_")[0]), w && (this._waiAria.labelAttr(h[u], w), h[u].innerHTML = w);
      }
    };
    const v = a._createDomEventScope();
    function p(h, u) {
      const m = new Date(h), y = (new Date(u).getTime() - m.getTime()) / 864e5;
      return Math.abs(y);
    }
    a.unset_actions = function() {
      v.detachAll();
    }, a.set_actions = function() {
      for (const h in this._els)
        if (this._click[h])
          for (let u = 0; u < this._els[h].length; u++) {
            const m = this._els[h][u], y = this._click[h].bind(m);
            v.attach(m, "click", y);
          }
      v.attach(this._obj, "selectstart", function(h) {
        return h.preventDefault(), !1;
      }), v.attach(this._obj, "mousemove", function(h) {
        a._temp_touch_block || a._on_mouse_move(h);
      }), v.attach(this._obj, "mousedown", function(h) {
        a._ignore_next_click || a._on_mouse_down(h);
      }), v.attach(this._obj, "mouseup", function(h) {
        a._ignore_next_click || a._on_mouse_up(h);
      }), v.attach(this._obj, "dblclick", function(h) {
        a._on_dbl_click(h);
      }), v.attach(this._obj, "contextmenu", function(h) {
        return a.checkEvent("onContextMenu") && h.preventDefault(), a.callEvent("onContextMenu", [a._locate_event(h.target), h]);
      });
    }, a.select = function(h) {
      this._select_id != h && (a._close_not_saved(), this.editStop(!1), this._select_id && this.unselect(), this._select_id = h, this.updateEvent(h), this.callEvent("onEventSelected", [h]));
    }, a.unselect = function(h) {
      if (h && h != this._select_id)
        return;
      const u = this._select_id;
      this._select_id = null, u && this.getEvent(u) && this.updateEvent(u), this.callEvent("onEventUnselected", [u]);
    }, a.$stateProvider.registerProvider("global", (function() {
      return { mode: this._mode, date: new Date(this._date), min_date: new Date(this._min_date), max_date: new Date(this._max_date), editor_id: this._edit_id, lightbox_id: this._lightbox_id, new_event: this._new_event, select_id: this._select_id, expanded: this.expanded, drag_id: this._drag_id, drag_mode: this._drag_mode };
    }).bind(a)), a._click = { dhx_cal_data: function(h) {
      if (a._ignore_next_click)
        return h.preventDefault && h.preventDefault(), h.cancelBubble = !0, a._ignore_next_click = !1, !1;
      const u = a._locate_event(h.target);
      if (u) {
        if (!a.callEvent("onClick", [u, h]) || a.config.readonly)
          return;
      } else
        a.callEvent("onEmptyClick", [a.getActionData(h).date, h]);
      if (u && a.config.select) {
        a.select(u);
        const m = h.target.closest(".dhx_menu_icon"), y = a._getClassName(m);
        y.indexOf("_icon") != -1 && a._click.buttons[y.split(" ")[1].replace("icon_", "")](u);
      } else
        a._close_not_saved(), a.getState().select_id && (/* @__PURE__ */ new Date()).valueOf() - (a._new_event || 0) > 500 && a.unselect();
    }, dhx_cal_prev_button: function() {
      a._click.dhx_cal_next_button(0, -1);
    }, dhx_cal_next_button: function(h, u) {
      let m = 1;
      a.config.rtl && (u = -u, m = -m), a.setCurrentView(a.date.add(a.date[a._mode + "_start"](new Date(a._date)), u || m, a._mode));
    }, dhx_cal_today_button: function() {
      a.callEvent("onBeforeTodayDisplayed", []) && a.setCurrentView(a._currentDate());
    }, dhx_cal_tab: function() {
      const h = this.getAttribute("data-tab"), u = this.getAttribute("name"), m = h || u.substring(0, u.search("_tab"));
      a.setCurrentView(a._date, m);
    }, buttons: { delete: function(h) {
      const u = a.locale.labels.confirm_deleting;
      a._dhtmlx_confirm({ message: u, title: a.locale.labels.title_confirm_deleting, callback: function() {
        a.deleteEvent(h);
      }, config: { ok: a.locale.labels.icon_delete } });
    }, edit: function(h) {
      a.edit(h);
    }, save: function(h) {
      a.editStop(!0);
    }, details: function(h) {
      a.showLightbox(h);
    }, form: function(h) {
      a.showLightbox(h);
    }, cancel: function(h) {
      a.editStop(!1);
    } } }, a._dhtmlx_confirm = function({ message: h, title: u, callback: m, config: y }) {
      if (!h)
        return m();
      y = y || {};
      const w = { ...y, text: h };
      u && (w.title = u), m && (w.callback = function(D) {
        D && m();
      }), a.confirm(w);
    }, a.addEventNow = function(h, u, m) {
      let y = {};
      a._isObject(h) && !a._isDate(h) && (y = h, h = null);
      const w = 6e4 * (this.config.event_duration || this.config.time_step);
      h || (h = y.start_date || Math.round(a._currentDate().valueOf() / w) * w);
      let D = new Date(h);
      if (!u) {
        let g = this.config.first_hour;
        g > D.getHours() && (D.setHours(g), h = D.valueOf()), u = h.valueOf() + w;
      }
      let E = new Date(u);
      D.valueOf() == E.valueOf() && E.setTime(E.valueOf() + w), y.start_date = y.start_date || D, y.end_date = y.end_date || E, y.text = y.text || this.locale.labels.new_event, y.id = this._drag_id = y.id || this.uid(), this._drag_mode = "new-size", this._loading = !0;
      const S = this.addEvent(y);
      return this.callEvent("onEventCreated", [this._drag_id, m]), this._loading = !1, this._drag_event = {}, this._on_mouse_up(m), S;
    }, a._on_dbl_click = function(h, u) {
      if (u = u || h.target, this.config.readonly)
        return;
      const m = a._getClassName(u).split(" ")[0];
      switch (m) {
        case "dhx_scale_holder":
        case "dhx_scale_holder_now":
        case "dhx_month_body":
        case "dhx_wa_day_data":
          if (!a.config.dblclick_create)
            break;
          this.addEventNow(this.getActionData(h).date, null, h);
          break;
        case "dhx_cal_event":
        case "dhx_wa_ev_body":
        case "dhx_agenda_line":
        case "dhx_cal_agenda_event_line":
        case "dhx_grid_event":
        case "dhx_cal_event_line":
        case "dhx_cal_event_clear": {
          const y = this._locate_event(u);
          if (!this.callEvent("onDblClick", [y, h]))
            return;
          this.config.details_on_dblclick || this._table_view || !this.getEvent(y)._timed || !this.config.select ? this.showLightbox(y) : this.edit(y);
          break;
        }
        case "dhx_time_block":
        case "dhx_cal_container":
          return;
        default: {
          const y = this["dblclick_" + m];
          if (y)
            y.call(this, h);
          else if (u.parentNode && u != this)
            return a._on_dbl_click(h, u.parentNode);
          break;
        }
      }
    }, a._get_column_index = function(h) {
      let u = 0;
      if (this._cols) {
        let m = 0, y = 0;
        for (; m + this._cols[y] < h && y < this._cols.length; )
          m += this._cols[y], y++;
        if (u = y + (this._cols[y] ? (h - m) / this._cols[y] : 0), this._ignores && u >= this._cols.length)
          for (; u >= 1 && this._ignores[Math.floor(u)]; )
            u--;
      }
      return u;
    }, a._week_indexes_from_pos = function(h) {
      if (this._cols) {
        const u = this._get_column_index(h.x);
        return h.x = Math.min(this._cols.length - 1, Math.max(0, Math.ceil(u) - 1)), h.y = Math.max(0, Math.ceil(60 * h.y / (this.config.time_step * this.config.hour_size_px)) - 1) + this.config.first_hour * (60 / this.config.time_step), h;
      }
      return h;
    }, a._mouse_coords = function(h) {
      let u;
      const m = document.body, y = document.documentElement;
      u = this.$env.isIE || !h.pageX && !h.pageY ? { x: h.clientX + (m.scrollLeft || y.scrollLeft || 0) - m.clientLeft, y: h.clientY + (m.scrollTop || y.scrollTop || 0) - m.clientTop } : { x: h.pageX, y: h.pageY }, this.config.rtl && this._colsS ? (u.x = this.$container.querySelector(".dhx_cal_data").offsetWidth - u.x, u.x += this.$domHelpers.getAbsoluteLeft(this._obj), this._mode !== "month" && (u.x -= this.xy.scale_width)) : u.x -= this.$domHelpers.getAbsoluteLeft(this._obj) + (this._table_view ? 0 : this.xy.scale_width);
      const w = this.$container.querySelector(".dhx_cal_data");
      u.y -= this.$domHelpers.getAbsoluteTop(w) - this._els.dhx_cal_data[0].scrollTop, u.ev = h;
      const D = this["mouse_" + this._mode];
      if (D)
        u = D.call(this, u);
      else if (this._table_view) {
        const E = this._get_column_index(u.x);
        if (!this._cols || !this._colsS)
          return u;
        let S = 0;
        for (S = 1; S < this._colsS.heights.length && !(this._colsS.heights[S] > u.y); S++)
          ;
        u.y = Math.ceil(24 * (Math.max(0, E) + 7 * Math.max(0, S - 1)) * 60 / this.config.time_step), (a._drag_mode || this._mode == "month") && (u.y = 24 * (Math.max(0, Math.ceil(E) - 1) + 7 * Math.max(0, S - 1)) * 60 / this.config.time_step), this._drag_mode == "move" && a._ignores_detected && a.config.preserve_length && (u._ignores = !0, this._drag_event._event_length || (this._drag_event._event_length = this._get_real_event_length(this._drag_event.start_date, this._drag_event.end_date, { x_step: 1, x_unit: "day" }))), u.x = 0;
      } else
        u = this._week_indexes_from_pos(u);
      return u.timestamp = +/* @__PURE__ */ new Date(), u;
    }, a._close_not_saved = function() {
      if ((/* @__PURE__ */ new Date()).valueOf() - (a._new_event || 0) > 500 && a._edit_id) {
        const h = a.locale.labels.confirm_closing;
        a._dhtmlx_confirm({ message: h, title: a.locale.labels.title_confirm_closing, callback: function() {
          a.editStop(a.config.positive_closing);
        } }), h && (this._drag_id = this._drag_pos = this._drag_mode = null);
      }
    }, a._correct_shift = function(h, u) {
      return h - 6e4 * (new Date(a._min_date).getTimezoneOffset() - new Date(h).getTimezoneOffset()) * (u ? -1 : 1);
    }, a._is_pos_changed = function(h, u) {
      function m(y, w, D) {
        return Math.abs(y - w) > D;
      }
      return !h || !this._drag_pos || !!(this._drag_pos.has_moved || !this._drag_pos.timestamp || u.timestamp - this._drag_pos.timestamp > 100 || m(h.ev.clientX, u.ev.clientX, 5) || m(h.ev.clientY, u.ev.clientY, 5));
    }, a._correct_drag_start_date = function(h) {
      let u;
      a.matrix && (u = a.matrix[a._mode]), u = u || { x_step: 1, x_unit: "day" }, h = new Date(h);
      let m = 1;
      return (u._start_correction || u._end_correction) && (m = 60 * (u.last_hour || 0) - (60 * h.getHours() + h.getMinutes()) || 1), 1 * h + (a._get_fictional_event_length(h, m, u) - m);
    }, a._correct_drag_end_date = function(h, u) {
      let m;
      a.matrix && (m = a.matrix[a._mode]), m = m || { x_step: 1, x_unit: "day" };
      const y = 1 * h + a._get_fictional_event_length(h, u, m);
      return new Date(1 * y - (a._get_fictional_event_length(y, -1, m, -1) + 1));
    }, a._on_mouse_move = function(h) {
      if (this._drag_mode) {
        var u = this._mouse_coords(h);
        if (this._is_pos_changed(this._drag_pos, u)) {
          var m, y;
          if (this._edit_id != this._drag_id && this._close_not_saved(), !this._drag_mode)
            return;
          var w = null;
          if (this._drag_pos && !this._drag_pos.has_moved && ((w = this._drag_pos).has_moved = !0), this._drag_pos = u, this._drag_pos.has_moved = !0, this._drag_mode == "create") {
            if (w && (u = w), this._close_not_saved(), this.unselect(this._select_id), this._loading = !0, m = this._get_date_from_pos(u).valueOf(), !this._drag_start)
              return this.callEvent("onBeforeEventCreated", [h, this._drag_id]) ? (this._loading = !1, void (this._drag_start = m)) : void (this._loading = !1);
            y = m, this._drag_start;
            var D = new Date(this._drag_start), E = new Date(y);
            this._mode != "day" && this._mode != "week" || D.getHours() != E.getHours() || D.getMinutes() != E.getMinutes() || (E = new Date(this._drag_start + 1e3)), this._drag_id = this.uid(), this.addEvent(D, E, this.locale.labels.new_event, this._drag_id, u.fields), this.callEvent("onEventCreated", [this._drag_id, h]), this._loading = !1, this._drag_mode = "new-size";
          }
          var S, g = this.config.time_step, b = this.getEvent(this._drag_id);
          if (a.matrix && (S = a.matrix[a._mode]), S = S || { x_step: 1, x_unit: "day" }, this._drag_mode == "move")
            m = this._min_date.valueOf() + 6e4 * (u.y * this.config.time_step + 24 * u.x * 60), !u.custom && this._table_view && (m += 1e3 * this.date.time_part(b.start_date)), !this._table_view && this._dragEventBody && this._drag_event._move_event_shift === void 0 && (this._drag_event._move_event_shift = m - b.start_date), this._drag_event._move_event_shift && (m -= this._drag_event._move_event_shift), m = this._correct_shift(m), u._ignores && this.config.preserve_length && this._table_view && S ? (m = a._correct_drag_start_date(m), y = a._correct_drag_end_date(m, this._drag_event._event_length)) : y = b.end_date.valueOf() - (b.start_date.valueOf() - m);
          else {
            if (m = b.start_date.valueOf(), y = b.end_date.valueOf(), this._table_view) {
              var x = this._min_date.valueOf() + u.y * this.config.time_step * 6e4 + (u.custom ? 0 : 864e5);
              if (this._mode == "month")
                if (x = this._correct_shift(x, !1), this._drag_from_start) {
                  var k = 864e5;
                  x <= a.date.date_part(new Date(y + k - 1)).valueOf() && (m = x - k);
                } else
                  y = x;
              else
                this.config.preserve_length ? u.resize_from_start ? m = a._correct_drag_start_date(x) : y = a._correct_drag_end_date(x, 0) : u.resize_from_start ? m = x : y = x;
            } else {
              var M = this.date.date_part(new Date(b.end_date.valueOf() - 1)).valueOf(), N = new Date(M), T = this.config.first_hour, A = 60 / g * (this.config.last_hour - T);
              this.config.time_step = 1;
              var C = this._mouse_coords(h);
              this.config.time_step = g;
              var $ = u.y * g * 6e4, O = Math.min(u.y + 1, A) * g * 6e4, j = 6e4 * C.y;
              y = Math.abs($ - j) > Math.abs(O - j) ? M + O : M + $, y += 6e4 * (new Date(y).getTimezoneOffset() - N.getTimezoneOffset()), this._els.dhx_cal_data[0].style.cursor = "s-resize", this._mode != "week" && this._mode != "day" || (y = this._correct_shift(y));
            }
            if (this._drag_mode == "new-size")
              if (y <= this._drag_start) {
                var V = u.shift || (this._table_view && !u.custom ? 864e5 : 0);
                m = y - (u.shift ? 0 : V), y = this._drag_start + (V || 6e4 * g);
              } else
                m = this._drag_start;
            else
              y <= m && (y = m + 6e4 * g);
          }
          var Y = new Date(y - 1), z = new Date(m);
          if (this._drag_mode == "move" && a.config.limit_drag_out && (+z < +a._min_date || +y > +a._max_date)) {
            if (+b.start_date < +a._min_date || +b.end_date > +a._max_date)
              z = new Date(b.start_date), y = new Date(b.end_date);
            else {
              var R = y - z;
              +z < +a._min_date ? (z = new Date(a._min_date), u._ignores && this.config.preserve_length && this._table_view ? (z = new Date(a._correct_drag_start_date(z)), S._start_correction && (z = new Date(z.valueOf() + S._start_correction)), y = new Date(1 * z + this._get_fictional_event_length(z, this._drag_event._event_length, S))) : y = new Date(+z + R)) : (y = new Date(a._max_date), u._ignores && this.config.preserve_length && this._table_view ? (S._end_correction && (y = new Date(y.valueOf() - S._end_correction)), y = new Date(1 * y - this._get_fictional_event_length(y, 0, S, !0)), z = new Date(1 * y - this._get_fictional_event_length(y, this._drag_event._event_length, S, !0)), this._ignores_detected && (z = a.date.add(z, S.x_step, S.x_unit), y = new Date(1 * y - this._get_fictional_event_length(y, 0, S, !0)), y = a.date.add(y, S.x_step, S.x_unit))) : z = new Date(+y - R));
            }
            Y = new Date(y - 1);
          }
          if (!this._table_view && this._dragEventBody && !a.config.all_timed && (!a._get_section_view() && u.x != this._get_event_sday({ start_date: new Date(m), end_date: new Date(m) }) || new Date(m).getHours() < this.config.first_hour) && (R = y - z, this._drag_mode == "move" && (k = this._min_date.valueOf() + 24 * u.x * 60 * 6e4, (z = new Date(k)).setHours(this.config.first_hour), +z <= +b.start_date ? y = new Date(+z + R) : z = new Date(+y - R))), this._table_view || a.config.all_timed || !(!a.getView() && u.x != this._get_event_sday({ start_date: new Date(y), end_date: new Date(y) }) || new Date(y).getHours() >= this.config.last_hour) || (R = y - z, k = this._min_date.valueOf() + 24 * u.x * 60 * 6e4, (y = a.date.date_part(new Date(k))).setHours(this.config.last_hour), Y = new Date(y - 1), this._drag_mode == "move" && (+z <= +b.start_date ? y = new Date(+z + R) : z = new Date(+y - R))), !this._table_view && a.config.all_timed) {
            let W = this._min_date.valueOf() + 24 * u.x * 60 * 6e4;
            new Date(a._drag_start).getDay() != new Date(W) && (W = new Date(a._drag_start));
            let Ne = new Date(W).setHours(this.config.last_hour);
            a._drag_start && this._drag_mode == "new-size" && Ne < new Date(y) && ((y = a.date.date_part(new Date(W))).setHours(this.config.last_hour), Y = new Date(y - 1));
          }
          if (this._table_view || Y.getDate() == z.getDate() && Y.getHours() < this.config.last_hour || a._allow_dnd)
            if (b.start_date = z, b.end_date = new Date(y), this.config.update_render) {
              var I = a._els.dhx_cal_data[0].scrollTop;
              this.update_view(), a._els.dhx_cal_data[0].scrollTop = I;
            } else
              this.updateEvent(this._drag_id);
          this._table_view && this.for_rendered(this._drag_id, function(W) {
            W.className += " dhx_in_move dhx_cal_event_drag";
          }), this.callEvent("onEventDrag", [this._drag_id, this._drag_mode, h]);
        }
      } else if (a.checkEvent("onMouseMove")) {
        var fe = this._locate_event(h.target || h.srcElement);
        this.callEvent("onMouseMove", [fe, h]);
      }
    }, a._on_mouse_down = function(h, u) {
      if (h.button != 2 && !this.config.readonly && !this._drag_mode) {
        u = u || h.target || h.srcElement;
        var m = a._getClassName(u).split(" ")[0];
        switch (this.config.drag_event_body && m == "dhx_body" && u.parentNode && u.parentNode.className.indexOf("dhx_cal_select_menu") === -1 && (m = "dhx_event_move", this._dragEventBody = !0), m) {
          case "dhx_cal_event_line":
          case "dhx_cal_event_clear":
            this._table_view && (this._drag_mode = "move");
            break;
          case "dhx_event_move":
          case "dhx_wa_ev_body":
            this._drag_mode = "move";
            break;
          case "dhx_event_resize":
            this._drag_mode = "resize", a._getClassName(u).indexOf("dhx_event_resize_end") < 0 ? a._drag_from_start = !0 : a._drag_from_start = !1;
            break;
          case "dhx_scale_holder":
          case "dhx_scale_holder_now":
          case "dhx_month_body":
          case "dhx_matrix_cell":
          case "dhx_marked_timespan":
            this._drag_mode = "create";
            break;
          case "":
            if (u.parentNode)
              return a._on_mouse_down(h, u.parentNode);
            break;
          default:
            if ((!a.checkEvent("onMouseDown") || a.callEvent("onMouseDown", [m, h])) && u.parentNode && u != this && m != "dhx_body")
              return a._on_mouse_down(h, u.parentNode);
            this._drag_mode = null, this._drag_id = null;
        }
        if (this._drag_mode) {
          var y = this._locate_event(u);
          if (this.config["drag_" + this._drag_mode] && this.callEvent("onBeforeDrag", [y, this._drag_mode, h])) {
            if (this._drag_id = y, (this._edit_id != this._drag_id || this._edit_id && this._drag_mode == "create") && this._close_not_saved(), !this._drag_mode)
              return;
            this._drag_event = a._lame_clone(this.getEvent(this._drag_id) || {}), this._drag_pos = this._mouse_coords(h);
          } else
            this._drag_mode = this._drag_id = 0;
        }
        this._drag_start = null;
      }
    }, a._get_private_properties = function(h) {
      var u = {};
      for (var m in h)
        m.indexOf("_") === 0 && (u[m] = !0);
      return u;
    }, a._clear_temporary_properties = function(h, u) {
      var m = this._get_private_properties(h), y = this._get_private_properties(u);
      for (var w in y)
        m[w] || delete u[w];
    }, a._on_mouse_up = function(h) {
      if (!h || h.button != 2 || !this._mobile) {
        if (this._drag_mode && this._drag_id) {
          this._els.dhx_cal_data[0].style.cursor = "default";
          var u = this._drag_id, m = this._drag_mode, y = !this._drag_pos || this._drag_pos.has_moved;
          delete this._drag_event._move_event_shift;
          var w = this.getEvent(this._drag_id);
          if (y && (this._drag_event._dhx_changed || !this._drag_event.start_date || w.start_date.valueOf() != this._drag_event.start_date.valueOf() || w.end_date.valueOf() != this._drag_event.end_date.valueOf())) {
            var D = this._drag_mode == "new-size";
            if (this.callEvent("onBeforeEventChanged", [w, h, D, this._drag_event]))
              if (this._drag_id = this._drag_mode = null, D && this.config.edit_on_create) {
                if (this.unselect(), this._new_event = /* @__PURE__ */ new Date(), this._table_view || this.config.details_on_create || !this.config.select || !this.isOneDayEvent(this.getEvent(u)))
                  return a.callEvent("onDragEnd", [u, m, h]), this.showLightbox(u);
                this._drag_pos = !0, this._select_id = this._edit_id = u;
              } else
                this._new_event || this.callEvent(D ? "onEventAdded" : "onEventChanged", [u, this.getEvent(u)]);
            else
              D ? this.deleteEvent(w.id, !0) : (this._drag_event._dhx_changed = !1, this._clear_temporary_properties(w, this._drag_event), a._lame_copy(w, this._drag_event), this.updateEvent(w.id));
          }
          this._drag_pos && (this._drag_pos.has_moved || this._drag_pos === !0) && (this._drag_id = this._drag_mode = null, this.render_view_data()), a.callEvent("onDragEnd", [u, m, h]);
        }
        this._drag_id = null, this._drag_mode = null, this._drag_pos = null, this._drag_event = null, this._drag_from_start = null;
      }
    }, a._trigger_dyn_loading = function() {
      return !(!this._load_mode || !this._load() || (this._render_wait = !0, 0));
    }, a.update_view = function() {
      this._reset_ignores(), this._update_nav_bar(this.config.header, this.$container.querySelector(".dhx_cal_navline"));
      var h = this[this._mode + "_view"];
      if (h ? h.call(this, !0) : this._reset_scale(), this._trigger_dyn_loading())
        return !0;
      this.render_view_data();
    }, a.isViewExists = function(h) {
      return !!(a[h + "_view"] || a.date[h + "_start"] && a.templates[h + "_date"] && a.templates[h + "_scale_date"]);
    }, a._set_aria_buttons_attrs = function() {
      for (var h = ["dhx_cal_next_button", "dhx_cal_prev_button", "dhx_cal_tab", "dhx_cal_today_button"], u = 0; u < h.length; u++)
        for (var m = this._els[h[u]], y = 0; m && y < m.length; y++) {
          var w = m[y].getAttribute("data-tab") || m[y].getAttribute("name"), D = this.locale.labels[h[u]];
          w && (D = this.locale.labels[w + "_tab"] || this.locale.labels[w] || D), h[u] == "dhx_cal_next_button" ? D = this.locale.labels.next : h[u] == "dhx_cal_prev_button" && (D = this.locale.labels.prev), this._waiAria.headerButtonsAttributes(m[y], D || "");
        }
    }, a.updateView = function(h, u) {
      if (!this.$container)
        throw new Error(`The scheduler is not initialized. 
 **scheduler.updateView** or **scheduler.setCurrentView** can be called only after **scheduler.init**`);
      h = h || this._date, u = u || this._mode;
      var m = "dhx_cal_data";
      this.locale.labels.icon_form || (this.locale.labels.icon_form = this.locale.labels.icon_edit);
      var y = this._obj, w = "dhx_scheduler_" + this._mode, D = "dhx_scheduler_" + u;
      this._mode && y.className.indexOf(w) != -1 ? y.className = y.className.replace(w, D) : y.className += " " + D;
      var E, S = "dhx_multi_day", g = !(this._mode != u || !this.config.preserve_scroll) && this._els[m][0].scrollTop;
      this._els[S] && this._els[S][0] && (E = this._els[S][0].scrollTop), this[this._mode + "_view"] && u && this._mode != u && this[this._mode + "_view"](!1), this._close_not_saved(), this._els[S] && (this._els[S][0].parentNode.removeChild(this._els[S][0]), this._els[S] = null), this._mode = u, this._date = h, this._table_view = this._mode == "month", this._dy_shift = 0, this.update_view(), this._set_aria_buttons_attrs();
      var b = this._els.dhx_cal_tab;
      if (b)
        for (var x = 0; x < b.length; x++) {
          var k = b[x];
          k.getAttribute("data-tab") == this._mode || k.getAttribute("name") == this._mode + "_tab" ? (k.classList.add("active"), this._waiAria.headerToggleState(k, !0)) : (k.classList.remove("active"), this._waiAria.headerToggleState(k, !1));
        }
      typeof g == "number" && (this._els[m][0].scrollTop = g), typeof E == "number" && this._els[S] && this._els[S][0] && (this._els[S][0].scrollTop = E);
    }, a.setCurrentView = function(h, u) {
      this.callEvent("onBeforeViewChange", [this._mode, this._date, u || this._mode, h || this._date]) && (this.updateView(h, u), this.callEvent("onViewChange", [this._mode, this._date]));
    }, a.render = function(h, u) {
      a.setCurrentView(h, u);
    }, a._render_x_header = function(h, u, m, y, w) {
      w = w || 0;
      var D = document.createElement("div");
      D.className = "dhx_scale_bar", this.templates[this._mode + "_scalex_class"] && (D.className += " " + this.templates[this._mode + "_scalex_class"](m));
      var E = this._cols[h];
      this._mode == "month" && h === 0 && this.config.left_border && (D.className += " dhx_scale_bar_border", u += 1), this.set_xy(D, E, this.xy.scale_height - 1, u, w);
      var S = this.templates[this._mode + "_scale_date"](m, this._mode);
      D.innerHTML = S, this._waiAria.dayHeaderAttr(D, S), y.appendChild(D);
    }, a._get_columns_num = function(h, u) {
      var m = 7;
      if (!a._table_view) {
        var y = a.date["get_" + a._mode + "_end"];
        y && (u = y(h)), m = Math.round((u.valueOf() - h.valueOf()) / 864e5);
      }
      return m;
    }, a._get_timeunit_start = function() {
      return this.date[this._mode + "_start"](new Date(this._date.valueOf()));
    }, a._get_view_end = function() {
      var h = this._get_timeunit_start(), u = a.date.add(h, 1, this._mode);
      if (!a._table_view) {
        var m = a.date["get_" + a._mode + "_end"];
        m && (u = m(h));
      }
      return u;
    }, a._calc_scale_sizes = function(h, u, m) {
      var y = this.config.rtl, w = h, D = this._get_columns_num(u, m);
      this._process_ignores(u, D, "day", 1);
      for (var E = D - this._ignores_detected, S = 0; S < D; S++)
        this._ignores[S] ? (this._cols[S] = 0, E++) : this._cols[S] = Math.floor(w / (E - S)), w -= this._cols[S], this._colsS[S] = (this._cols[S - 1] || 0) + (this._colsS[S - 1] || (this._table_view ? 0 : y ? this.xy.scroll_width : this.xy.scale_width));
      this._colsS.col_length = D, this._colsS[D] = this._cols[D - 1] + this._colsS[D - 1] || 0;
    }, a._set_scale_col_size = function(h, u, m) {
      var y = this.config;
      this.set_xy(h, u, y.hour_size_px * (y.last_hour - y.first_hour), m + this.xy.scale_width + 1, 0);
    }, a._render_scales = function(h, u) {
      var m = new Date(a._min_date), y = new Date(a._max_date), w = this.date.date_part(a._currentDate()), D = parseInt(h.style.width, 10) - 1, E = new Date(this._min_date), S = this._get_columns_num(m, y);
      this._calc_scale_sizes(D, m, y);
      var g = 0;
      h.innerHTML = "";
      for (var b = 0; b < S; b++) {
        if (this._ignores[b] || this._render_x_header(b, g, E, h), !this._table_view) {
          var x = document.createElement("div"), k = "dhx_scale_holder";
          E.valueOf() == w.valueOf() && (k += " dhx_scale_holder_now"), x.setAttribute("data-column-index", b), this._ignores_detected && this._ignores[b] && (k += " dhx_scale_ignore");
          for (let M = 1 * this.config.first_hour; M < this.config.last_hour; M++) {
            const N = document.createElement("div");
            N.className = "dhx_scale_time_slot dhx_scale_time_slot_hour_start", N.style.height = this.config.hour_size_px / 2 + "px";
            let T = new Date(E.getFullYear(), E.getMonth(), E.getDate(), M, 0);
            N.setAttribute("data-slot-date", this.templates.format_date(T));
            let A = this.templates.time_slot_text(T);
            A && (N.innerHTML = A);
            let C = this.templates.time_slot_class(T);
            C && N.classList.add(C), x.appendChild(N);
            const $ = document.createElement("div");
            $.className = "dhx_scale_time_slot", T = new Date(E.getFullYear(), E.getMonth(), E.getDate(), M, 30), $.setAttribute("data-slot-date", this.templates.format_date(T)), $.style.height = this.config.hour_size_px / 2 + "px", A = this.templates.time_slot_text(T), A && ($.innerHTML = A), C = this.templates.time_slot_class(T), C && $.classList.add(C), x.appendChild($);
          }
          x.className = k + " " + this.templates.week_date_class(E, w), this._waiAria.dayColumnAttr(x, E), this._set_scale_col_size(x, this._cols[b], g), u.appendChild(x), this.callEvent("onScaleAdd", [x, E]);
        }
        g += this._cols[b], E = this.date.add(E, 1, "day"), E = this.date.day_start(E);
      }
    }, a._getNavDateElement = function() {
      return this.$container.querySelector(".dhx_cal_date");
    }, a._reset_scale = function() {
      if (this.templates[this._mode + "_date"]) {
        var h = this._els.dhx_cal_header[0], u = this._els.dhx_cal_data[0], m = this.config;
        h.innerHTML = "", u.innerHTML = "";
        var y, w, D = (m.readonly || !m.drag_resize ? " dhx_resize_denied" : "") + (m.readonly || !m.drag_move ? " dhx_move_denied" : "");
        u.className = "dhx_cal_data" + D, this._scales = {}, this._cols = [], this._colsS = { height: 0 }, this._dy_shift = 0, this.set_sizes();
        var E = this._get_timeunit_start(), S = a._get_view_end();
        y = w = this._table_view ? a.date.week_start(E) : E, this._min_date = y;
        var g = this.templates[this._mode + "_date"](E, S, this._mode), b = this._getNavDateElement();
        if (b && (b.innerHTML = g, this._waiAria.navBarDateAttr(b, g)), this._max_date = S, a._render_scales(h, u), this._table_view)
          this._reset_month_scale(u, E, w);
        else if (this._reset_hours_scale(u, E, w), m.multi_day) {
          var x = "dhx_multi_day";
          this._els[x] && (this._els[x][0].parentNode.removeChild(this._els[x][0]), this._els[x] = null);
          var k = document.createElement("div");
          k.className = x, k.style.visibility = "hidden", k.style.display = "none";
          var M = this._colsS[this._colsS.col_length], N = m.rtl ? this.xy.scale_width : this.xy.scroll_width, T = Math.max(M + N, 0);
          this.set_xy(k, T, 0, 0), u.parentNode.insertBefore(k, u);
          var A = k.cloneNode(!0);
          A.className = x + "_icon", A.style.visibility = "hidden", A.style.display = "none", this.set_xy(A, this.xy.scale_width + 1, 0, 0), k.appendChild(A), this._els[x] = [k, A], a.event(this._els[x][0], "click", this._click.dhx_cal_data);
        }
      }
    }, a._reset_hours_scale = function(h, u, m) {
      var y = document.createElement("div");
      y.className = "dhx_scale_holder";
      for (var w = new Date(1980, 1, 1, this.config.first_hour, 0, 0), D = 1 * this.config.first_hour; D < this.config.last_hour; D++) {
        var E = document.createElement("div");
        E.className = "dhx_scale_hour", E.style.height = this.config.hour_size_px + "px";
        var S = this.xy.scale_width;
        this.config.left_border && (E.className += " dhx_scale_hour_border"), E.style.width = S + "px";
        var g = a.templates.hour_scale(w);
        E.innerHTML = g, this._waiAria.hourScaleAttr(E, g), y.appendChild(E), w = this.date.add(w, 1, "hour");
      }
      h.appendChild(y), this.config.scroll_hour && (h.scrollTop = this.config.hour_size_px * (this.config.scroll_hour - this.config.first_hour));
    }, a._currentDate = function() {
      return a.config.now_date ? new Date(a.config.now_date) : /* @__PURE__ */ new Date();
    }, a._reset_ignores = function() {
      this._ignores = {}, this._ignores_detected = 0;
    }, a._process_ignores = function(h, u, m, y, w) {
      this._reset_ignores();
      var D = a["ignore_" + this._mode];
      if (D)
        for (var E = new Date(h), S = 0; S < u; S++)
          D(E) && (this._ignores_detected += 1, this._ignores[S] = !0, w && u++), E = a.date.add(E, y, m), a.date[m + "_start"] && (E = a.date[m + "_start"](E));
    }, a._render_month_scale = function(h, u, m, y) {
      var w = a.date.add(u, 1, "month"), D = new Date(m), E = a._currentDate();
      this.date.date_part(E), this.date.date_part(m), y = y || Math.ceil(Math.round((w.valueOf() - m.valueOf()) / 864e5) / 7);
      for (var S = [], g = 0; g <= 7; g++) {
        var b = this._cols[g] || 0;
        isNaN(Number(b)) || (b += "px"), S[g] = b;
      }
      function x(z) {
        var R = a._colsS.height;
        return a._colsS.heights[z + 1] !== void 0 && (R = a._colsS.heights[z + 1] - (a._colsS.heights[z] || 0)), R;
      }
      var k = 0;
      const M = document.createElement("div");
      for (M.classList.add("dhx_cal_month_table"), g = 0; g < y; g++) {
        var N = document.createElement("div");
        N.classList.add("dhx_cal_month_row"), N.style.height = x(g) + "px", M.appendChild(N);
        for (var T = 0; T < 7; T++) {
          var A = document.createElement("div");
          N.appendChild(A);
          var C = "dhx_cal_month_cell";
          m < u ? C += " dhx_before" : m >= w ? C += " dhx_after" : m.valueOf() == E.valueOf() && (C += " dhx_now"), this._ignores_detected && this._ignores[T] && (C += " dhx_scale_ignore"), A.className = C + " " + this.templates.month_date_class(m, E), A.setAttribute("data-cell-date", a.templates.format_date(m));
          var $ = "dhx_month_body", O = "dhx_month_head";
          if (T === 0 && this.config.left_border && ($ += " dhx_month_body_border", O += " dhx_month_head_border"), this._ignores_detected && this._ignores[T])
            A.appendChild(document.createElement("div")), A.appendChild(document.createElement("div"));
          else {
            A.style.width = S[T], this._waiAria.monthCellAttr(A, m);
            var j = document.createElement("div");
            j.style.height = a.xy.month_head_height + "px", j.className = O, j.innerHTML = this.templates.month_day(m), A.appendChild(j);
            var V = document.createElement("div");
            V.className = $, A.appendChild(V);
          }
          var Y = m.getDate();
          (m = this.date.add(m, 1, "day")).getDate() - Y > 1 && (m = new Date(m.getFullYear(), m.getMonth(), Y + 1, 12, 0));
        }
        a._colsS.heights[g] = k, k += x(g);
      }
      return this._min_date = D, this._max_date = m, h.innerHTML = "", h.appendChild(M), this._scales = {}, h.querySelectorAll("[data-cell-date]").forEach((z) => {
        const R = a.templates.parse_date(z.getAttribute("data-cell-date")), I = z.querySelector(".dhx_month_body");
        this._scales[+R] = I, this.callEvent("onScaleAdd", [this._scales[+R], R]);
      }), this._max_date;
    }, a._reset_month_scale = function(h, u, m, y) {
      var w = a.date.add(u, 1, "month"), D = a._currentDate();
      this.date.date_part(D), this.date.date_part(m), y = y || Math.ceil(Math.round((w.valueOf() - m.valueOf()) / 864e5) / 7);
      var E = Math.floor(h.clientHeight / y) - this.xy.month_head_height;
      return this._colsS.height = E + this.xy.month_head_height, this._colsS.heights = [], a._render_month_scale(h, u, m, y);
    }, a.getView = function(h) {
      return h || (h = a.getState().mode), a.matrix && a.matrix[h] ? a.matrix[h] : a._props && a._props[h] ? a._props[h] : null;
    }, a.getLabel = function(h, u) {
      for (var m = this.config.lightbox.sections, y = 0; y < m.length; y++)
        if (m[y].map_to == h) {
          for (var w = m[y].options, D = 0; D < w.length; D++)
            if (w[D].key == u)
              return w[D].label;
        }
      return "";
    }, a.updateCollection = function(h, u) {
      var m = a.serverList(h);
      return !!m && (m.splice(0, m.length), m.push.apply(m, u || []), a.callEvent("onOptionsLoad", []), a.resetLightbox(), a.hideCover(), !0);
    }, a._lame_clone = function(h, u) {
      var m, y, w;
      for (u = u || [], m = 0; m < u.length; m += 2)
        if (h === u[m])
          return u[m + 1];
      if (h && typeof h == "object") {
        for (w = Object.create(h), y = [Array, Date, Number, String, Boolean], m = 0; m < y.length; m++)
          h instanceof y[m] && (w = m ? new y[m](h) : new y[m]());
        for (m in u.push(h, w), h)
          Object.prototype.hasOwnProperty.apply(h, [m]) && (w[m] = a._lame_clone(h[m], u));
      }
      return w || h;
    }, a._lame_copy = function(h, u) {
      for (var m in u)
        u.hasOwnProperty(m) && (h[m] = u[m]);
      return h;
    }, a._get_date_from_pos = function(h) {
      var u = this._min_date.valueOf() + 6e4 * (h.y * this.config.time_step + 24 * (this._table_view ? 0 : h.x) * 60);
      return new Date(this._correct_shift(u));
    }, a.getActionData = function(h) {
      var u = this._mouse_coords(h);
      return { date: this._get_date_from_pos(u), section: u.section };
    }, a._focus = function(h, u) {
      if (h && h.focus)
        if (this._mobile)
          window.setTimeout(function() {
            h.focus();
          }, 10);
        else
          try {
            u && h.select && h.offsetWidth && h.select(), h.focus();
          } catch {
          }
    }, a._get_real_event_length = function(h, u, m) {
      var y, w = u - h, D = this["ignore_" + this._mode], E = 0;
      m.render ? (E = this._get_date_index(m, h), y = this._get_date_index(m, u), h.valueOf() < a.getState().min_date.valueOf() && (E = -p(h, a.getState().min_date)), u.valueOf() > a.getState().max_date.valueOf() && (y += p(u, a.getState().max_date))) : y = Math.round(w / 60 / 60 / 1e3 / 24);
      for (var S = !0; E < y; ) {
        var g = a.date.add(u, -m.x_step, m.x_unit);
        if (D && D(u) && (!S || S && D(g)))
          w -= u - g;
        else {
          let b = 0;
          const x = new Date(Math.max(g.valueOf(), h.valueOf())), k = u, M = new Date(x.getFullYear(), x.getMonth(), x.getDate(), m.first_hour), N = new Date(x.getFullYear(), x.getMonth(), x.getDate(), m.last_hour || 24), T = new Date(u.getFullYear(), u.getMonth(), u.getDate(), m.first_hour), A = new Date(u.getFullYear(), u.getMonth(), u.getDate(), m.last_hour || 24);
          k.valueOf() > A.valueOf() && (b += k - A), k.valueOf() > T.valueOf() ? b += m._start_correction : b += 60 * k.getHours() * 60 * 1e3 + 60 * k.getMinutes() * 1e3, x.valueOf() <= N.valueOf() && (b += m._end_correction), x.valueOf() < M.valueOf() && (b += M.valueOf() - x.valueOf()), w -= b, S = !1;
        }
        u = g, y--;
      }
      return w;
    }, a._get_fictional_event_length = function(h, u, m, y) {
      var w = new Date(h), D = y ? -1 : 1;
      if (m._start_correction || m._end_correction) {
        var E;
        E = y ? 60 * w.getHours() + w.getMinutes() - 60 * (m.first_hour || 0) : 60 * (m.last_hour || 0) - (60 * w.getHours() + w.getMinutes());
        var S = 60 * (m.last_hour - m.first_hour), g = Math.ceil((u / 6e4 - E) / S);
        g < 0 && (g = 0), u += g * (1440 - S) * 60 * 1e3;
      }
      var b, x = new Date(1 * h + u * D), k = this["ignore_" + this._mode], M = 0;
      for (m.render ? (M = this._get_date_index(m, w), b = this._get_date_index(m, x)) : b = Math.round(u / 60 / 60 / 1e3 / 24); M * D <= b * D; ) {
        var N = a.date.add(w, m.x_step * D, m.x_unit);
        k && k(w) && (u += (N - w) * D, b += D), w = N, M += D;
      }
      return u;
    }, a._get_section_view = function() {
      return this.getView();
    }, a._get_section_property = function() {
      return this.matrix && this.matrix[this._mode] ? this.matrix[this._mode].y_property : this._props && this._props[this._mode] ? this._props[this._mode].map_to : null;
    }, a._is_initialized = function() {
      var h = this.getState();
      return this._obj && h.date && h.mode;
    }, a._is_lightbox_open = function() {
      var h = this.getState();
      return h.lightbox_id !== null && h.lightbox_id !== void 0;
    };
  }(i), function(a) {
    (function() {
      var d = new RegExp(`<(?:.|
)*?>`, "gm"), l = new RegExp(" +", "gm");
      function c(h) {
        return (h + "").replace(d, " ").replace(l, " ");
      }
      var f = new RegExp("'", "gm");
      function v(h) {
        return (h + "").replace(f, "&#39;");
      }
      for (var p in a._waiAria = { getAttributeString: function(h) {
        var u = [" "];
        for (var m in h)
          if (typeof h[m] != "function" && typeof h[m] != "object") {
            var y = v(c(h[m]));
            u.push(m + "='" + y + "'");
          }
        return u.push(" "), u.join(" ");
      }, setAttributes: function(h, u) {
        for (var m in u)
          h.setAttribute(m, c(u[m]));
        return h;
      }, labelAttr: function(h, u) {
        return this.setAttributes(h, { "aria-label": u });
      }, label: function(h) {
        return a._waiAria.getAttributeString({ "aria-label": h });
      }, hourScaleAttr: function(h, u) {
        this.labelAttr(h, u);
      }, monthCellAttr: function(h, u) {
        this.labelAttr(h, a.templates.day_date(u));
      }, navBarDateAttr: function(h, u) {
        this.labelAttr(h, u);
      }, dayHeaderAttr: function(h, u) {
        this.labelAttr(h, u);
      }, dayColumnAttr: function(h, u) {
        this.dayHeaderAttr(h, a.templates.day_date(u));
      }, headerButtonsAttributes: function(h, u) {
        return this.setAttributes(h, { role: "button", "aria-label": u });
      }, headerToggleState: function(h, u) {
        return this.setAttributes(h, { "aria-pressed": u ? "true" : "false" });
      }, getHeaderCellAttr: function(h) {
        return a._waiAria.getAttributeString({ "aria-label": h });
      }, eventAttr: function(h, u) {
        this._eventCommonAttr(h, u);
      }, _eventCommonAttr: function(h, u) {
        u.setAttribute("aria-label", c(a.templates.event_text(h.start_date, h.end_date, h))), a.config.readonly && u.setAttribute("aria-readonly", !0), h.$dataprocessor_class && u.setAttribute("aria-busy", !0), u.setAttribute("aria-selected", a.getState().select_id == h.id ? "true" : "false");
      }, setEventBarAttr: function(h, u) {
        this._eventCommonAttr(h, u);
      }, _getAttributes: function(h, u) {
        var m = { setAttribute: function(y, w) {
          this[y] = w;
        } };
        return h.apply(this, [u, m]), m;
      }, eventBarAttrString: function(h) {
        return this.getAttributeString(this._getAttributes(this.setEventBarAttr, h));
      }, agendaHeadAttrString: function() {
        return this.getAttributeString({ role: "row" });
      }, agendaHeadDateString: function(h) {
        return this.getAttributeString({ role: "columnheader", "aria-label": h });
      }, agendaHeadDescriptionString: function(h) {
        return this.agendaHeadDateString(h);
      }, agendaDataAttrString: function() {
        return this.getAttributeString({ role: "grid" });
      }, agendaEventAttrString: function(h) {
        var u = this._getAttributes(this._eventCommonAttr, h);
        return u.role = "row", this.getAttributeString(u);
      }, agendaDetailsBtnString: function() {
        return this.getAttributeString({ role: "button", "aria-label": a.locale.labels.icon_details });
      }, gridAttrString: function() {
        return this.getAttributeString({ role: "grid" });
      }, gridRowAttrString: function(h) {
        return this.agendaEventAttrString(h);
      }, gridCellAttrString: function(h, u, m) {
        return this.getAttributeString({ role: "gridcell", "aria-label": [u.label === void 0 ? u.id : u.label, ": ", m] });
      }, mapAttrString: function() {
        return this.gridAttrString();
      }, mapRowAttrString: function(h) {
        return this.gridRowAttrString(h);
      }, mapDetailsBtnString: function() {
        return this.agendaDetailsBtnString();
      }, minicalHeader: function(h, u) {
        this.setAttributes(h, { id: u + "", "aria-live": "assertice", "aria-atomic": "true" });
      }, minicalGrid: function(h, u) {
        this.setAttributes(h, { "aria-labelledby": u + "", role: "grid" });
      }, minicalRow: function(h) {
        this.setAttributes(h, { role: "row" });
      }, minicalDayCell: function(h, u) {
        var m = u.valueOf() < a._max_date.valueOf() && u.valueOf() >= a._min_date.valueOf();
        this.setAttributes(h, { role: "gridcell", "aria-label": a.templates.day_date(u), "aria-selected": m ? "true" : "false" });
      }, minicalHeadCell: function(h) {
        this.setAttributes(h, { role: "columnheader" });
      }, weekAgendaDayCell: function(h, u) {
        var m = h.querySelector(".dhx_wa_scale_bar"), y = h.querySelector(".dhx_wa_day_data"), w = a.uid() + "";
        this.setAttributes(m, { id: w }), this.setAttributes(y, { "aria-labelledby": w });
      }, weekAgendaEvent: function(h, u) {
        this.eventAttr(u, h);
      }, lightboxHiddenAttr: function(h) {
        h.setAttribute("aria-hidden", "true");
      }, lightboxVisibleAttr: function(h) {
        h.setAttribute("aria-hidden", "false");
      }, lightboxSectionButtonAttrString: function(h) {
        return this.getAttributeString({ role: "button", "aria-label": h, tabindex: "0" });
      }, yearHeader: function(h, u) {
        this.setAttributes(h, { id: u + "" });
      }, yearGrid: function(h, u) {
        this.minicalGrid(h, u);
      }, yearHeadCell: function(h) {
        return this.minicalHeadCell(h);
      }, yearRow: function(h) {
        return this.minicalRow(h);
      }, yearDayCell: function(h) {
        this.setAttributes(h, { role: "gridcell" });
      }, lightboxAttr: function(h) {
        h.setAttribute("role", "dialog"), h.setAttribute("aria-hidden", "true"), h.firstChild.setAttribute("role", "heading");
      }, lightboxButtonAttrString: function(h) {
        return this.getAttributeString({ role: "button", "aria-label": a.locale.labels[h], tabindex: "0" });
      }, eventMenuAttrString: function(h) {
        return this.getAttributeString({ role: "button", "aria-label": a.locale.labels[h] });
      }, lightboxHeader: function(h, u) {
        h.setAttribute("aria-label", u);
      }, lightboxSelectAttrString: function(h) {
        var u = "";
        switch (h) {
          case "%Y":
            u = a.locale.labels.year;
            break;
          case "%m":
            u = a.locale.labels.month;
            break;
          case "%d":
            u = a.locale.labels.day;
            break;
          case "%H:%i":
            u = a.locale.labels.hour + " " + a.locale.labels.minute;
        }
        return a._waiAria.getAttributeString({ "aria-label": u });
      }, messageButtonAttrString: function(h) {
        return "tabindex='0' role='button' aria-label='" + h + "'";
      }, messageInfoAttr: function(h) {
        h.setAttribute("role", "alert");
      }, messageModalAttr: function(h, u) {
        h.setAttribute("role", "dialog"), u && h.setAttribute("aria-labelledby", u);
      }, quickInfoAttr: function(h) {
        h.setAttribute("role", "dialog");
      }, quickInfoHeaderAttrString: function() {
        return " role='heading' ";
      }, quickInfoHeader: function(h, u) {
        h.setAttribute("aria-label", u);
      }, quickInfoButtonAttrString: function(h) {
        return a._waiAria.getAttributeString({ role: "button", "aria-label": h, tabindex: "0" });
      }, tooltipAttr: function(h) {
        h.setAttribute("role", "tooltip");
      }, tooltipVisibleAttr: function(h) {
        h.setAttribute("aria-hidden", "false");
      }, tooltipHiddenAttr: function(h) {
        h.setAttribute("aria-hidden", "true");
      } }, a._waiAria)
        a._waiAria[p] = function(h) {
          return function() {
            return a.config.wai_aria_attributes ? h.apply(this, arguments) : " ";
          };
        }(a._waiAria[p]);
    })();
  }(i), i.utils = ae, i.$domHelpers = ce, i.utils.dom = ce, i.uid = ae.uid, i.mixin = ae.mixin, i.defined = ae.defined, i.assert = function(a) {
    return function(d, l) {
      d || a.config.show_errors && a.callEvent("onError", [l]) !== !1 && (a.message ? a.message({ type: "error", text: l, expire: -1 }) : console.log(l));
    };
  }(i), i.copy = ae.copy, i._createDatePicker = function(a, d) {
    return new Sa(i, a, d);
  }, i._getFocusableNodes = ce.getFocusableNodes, i._getClassName = ce.getClassName, i._locate_css = ce.locateCss;
  const t = Kt(i);
  var r, s, n;
  i.utils.mixin(i, t), i.env = i.$env = Yt, i.Promise = window.Promise, function(a) {
    a.destructor = function() {
      for (var d in a.callEvent("onDestroy", []), this.clearAll(), this.$container && (this.$container.innerHTML = ""), this._eventRemoveAll && this._eventRemoveAll(), this.resetLightbox && this.resetLightbox(), this._dp && this._dp.destructor && this._dp.destructor(), this.detachAllEvents(), this)
        d.indexOf("$") === 0 && delete this[d];
      a.$destroyed = !0;
    };
  }(i), function(a) {
    function d(l, c) {
      var f = { method: l };
      if (c.length === 0)
        throw new Error("Arguments list of query is wrong.");
      if (c.length === 1)
        return typeof c[0] == "string" ? (f.url = c[0], f.async = !0) : (f.url = c[0].url, f.async = c[0].async || !0, f.callback = c[0].callback, f.headers = c[0].headers), c[0].data ? typeof c[0].data != "string" ? f.data = Ae(c[0].data) : f.data = c[0].data : f.data = "", f;
      switch (f.url = c[0], l) {
        case "GET":
        case "DELETE":
          f.callback = c[1], f.headers = c[2];
          break;
        case "POST":
        case "PUT":
          c[1] ? typeof c[1] != "string" ? f.data = Ae(c[1]) : f.data = c[1] : f.data = "", f.callback = c[2], f.headers = c[3];
      }
      return f;
    }
    a.Promise = window.Promise, a.ajax = { cache: !0, method: "get", serializeRequestParams: Ae, parse: function(l) {
      return typeof l != "string" ? l : (l = l.replace(/^[\s]+/, ""), typeof DOMParser > "u" || a.$env.isIE ? window.ActiveXObject !== void 0 && ((c = new window.ActiveXObject("Microsoft.XMLDOM")).async = "false", c.loadXML(l)) : c = new DOMParser().parseFromString(l, "text/xml"), c);
      var c;
    }, xmltop: function(l, c, f) {
      if (c.status === void 0 || c.status < 400) {
        var v = c.responseXML ? c.responseXML || c : this.parse(c.responseText || c);
        if (v && v.documentElement !== null && !v.getElementsByTagName("parsererror").length)
          return v.getElementsByTagName(l)[0];
      }
      return f !== -1 && a.callEvent("onLoadXMLError", ["Incorrect XML", arguments[1], f]), document.createElement("DIV");
    }, xpath: function(l, c) {
      if (c.nodeName || (c = c.responseXML || c), a.$env.isIE)
        return c.selectNodes(l) || [];
      for (var f, v = [], p = (c.ownerDocument || c).evaluate(l, c, null, XPathResult.ANY_TYPE, null); f = p.iterateNext(); )
        v.push(f);
      return v;
    }, query: function(l) {
      return this._call(l.method || "GET", l.url, l.data || "", l.async || !0, l.callback, l.headers);
    }, get: function(l, c, f) {
      var v = d("GET", arguments);
      return this.query(v);
    }, getSync: function(l, c) {
      var f = d("GET", arguments);
      return f.async = !1, this.query(f);
    }, put: function(l, c, f, v) {
      var p = d("PUT", arguments);
      return this.query(p);
    }, del: function(l, c, f) {
      var v = d("DELETE", arguments);
      return this.query(v);
    }, post: function(l, c, f, v) {
      arguments.length == 1 ? c = "" : arguments.length == 2 && typeof c == "function" && (f = c, c = "");
      var p = d("POST", arguments);
      return this.query(p);
    }, postSync: function(l, c, f) {
      c = c === null ? "" : String(c);
      var v = d("POST", arguments);
      return v.async = !1, this.query(v);
    }, _call: function(l, c, f, v, p, h) {
      return new a.Promise((function(u, m) {
        var y = typeof XMLHttpRequest === void 0 || a.$env.isIE ? new window.ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest(), w = navigator.userAgent.match(/AppleWebKit/) !== null && navigator.userAgent.match(/Qt/) !== null && navigator.userAgent.match(/Safari/) !== null;
        if (v && y.addEventListener("readystatechange", function() {
          if (y.readyState == 4 || w && y.readyState == 3) {
            if ((y.status != 200 || y.responseText === "") && !a.callEvent("onAjaxError", [y]))
              return;
            setTimeout(function() {
              typeof p == "function" && p.apply(window, [{ xmlDoc: y, filePath: c }]), u(y), typeof p == "function" && (p = null, y = null);
            }, 0);
          }
        }), l != "GET" || this.cache || (c += (c.indexOf("?") >= 0 ? "&" : "?") + "dhxr" + (/* @__PURE__ */ new Date()).getTime() + "=1"), y.open(l, c, v), h)
          for (var D in h)
            y.setRequestHeader(D, h[D]);
        else
          l.toUpperCase() == "POST" || l == "PUT" || l == "DELETE" ? y.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") : l == "GET" && (f = null);
        if (y.setRequestHeader("X-Requested-With", "XMLHttpRequest"), y.send(f), !v)
          return { xmlDoc: y, filePath: c };
      }).bind(this));
    }, urlSeparator: function(l) {
      return l.indexOf("?") != -1 ? "&" : "?";
    } }, a.$ajax = a.ajax;
  }(i), Vt(i), function(a) {
    a.config = { default_date: "%j %M %Y", month_date: "%F %Y", load_date: "%Y-%m-%d", week_date: "%l", day_date: "%D %j", hour_date: "%H:%i", month_day: "%d", date_format: "%Y-%m-%d %H:%i", api_date: "%d-%m-%Y %H:%i", parse_exact_format: !1, preserve_length: !0, time_step: 5, displayed_event_color: "#ff4a4a", displayed_event_text_color: "#ffef80", wide_form: 0, day_column_padding: 8, use_select_menu_space: !0, fix_tab_position: !0, start_on_monday: !0, first_hour: 0, last_hour: 24, readonly: !1, drag_resize: !0, drag_move: !0, drag_create: !0, drag_event_body: !0, dblclick_create: !0, details_on_dblclick: !0, edit_on_create: !0, details_on_create: !0, header: null, hour_size_px: 44, resize_month_events: !1, resize_month_timed: !1, responsive_lightbox: !1, separate_short_events: !0, rtl: !1, cascade_event_display: !1, cascade_event_count: 4, cascade_event_margin: 30, multi_day: !0, multi_day_height_limit: 200, drag_lightbox: !0, preserve_scroll: !0, select: !0, undo_deleted: !0, server_utc: !1, touch: !0, touch_tip: !0, touch_drag: 500, touch_swipe_dates: !1, quick_info_detached: !0, positive_closing: !1, drag_highlight: !0, limit_drag_out: !1, icons_edit: ["icon_save", "icon_cancel"], icons_select: ["icon_details", "icon_edit", "icon_delete"], buttons_left: ["dhx_save_btn", "dhx_cancel_btn"], buttons_right: ["dhx_delete_btn"], lightbox: { sections: [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "time", height: 72, type: "time", map_to: "auto" }] }, highlight_displayed_event: !0, left_border: !1, ajax_error: "alert", delay_render: 0, timeline_swap_resize: !0, wai_aria_attributes: !0, wai_aria_application_role: !0, csp: "auto", event_attribute: "data-event-id", show_errors: !0 }, a.config.buttons_left.$initial = a.config.buttons_left.join(), a.config.buttons_right.$initial = a.config.buttons_right.join(), a._helpers = { parseDate: function(d) {
      return (a.templates.xml_date || a.templates.parse_date)(d);
    }, formatDate: function(d) {
      return (a.templates.xml_format || a.templates.format_date)(d);
    } }, a.templates = {}, a.init_templates = function() {
      var d = a.date.date_to_str, l = a.config;
      (function(c, f) {
        for (var v in f)
          c[v] || (c[v] = f[v]);
      })(a.templates, { day_date: d(l.default_date), month_date: d(l.month_date), week_date: function(c, f) {
        return l.rtl ? a.templates.day_date(a.date.add(f, -1, "day")) + " &ndash; " + a.templates.day_date(c) : a.templates.day_date(c) + " &ndash; " + a.templates.day_date(a.date.add(f, -1, "day"));
      }, day_scale_date: d(l.default_date), time_slot_text: function(c) {
        return "";
      }, time_slot_class: function(c) {
        return "";
      }, month_scale_date: d(l.week_date), week_scale_date: d(l.day_date), hour_scale: d(l.hour_date), time_picker: d(l.hour_date), event_date: d(l.hour_date), month_day: d(l.month_day), load_format: d(l.load_date), format_date: d(l.date_format, l.server_utc), parse_date: a.date.str_to_date(l.date_format, l.server_utc), api_date: a.date.str_to_date(l.api_date, !1, !1), event_header: function(c, f, v) {
        return v._mode === "small" || v._mode === "smallest" ? a.templates.event_date(c) : a.templates.event_date(c) + " - " + a.templates.event_date(f);
      }, event_text: function(c, f, v) {
        return v.text;
      }, event_class: function(c, f, v) {
        return "";
      }, month_date_class: function(c) {
        return "";
      }, week_date_class: function(c) {
        return "";
      }, event_bar_date: function(c, f, v) {
        return a.templates.event_date(c);
      }, event_bar_text: function(c, f, v) {
        return v.text;
      }, month_events_link: function(c, f) {
        return "<a>View more(" + f + " events)</a>";
      }, drag_marker_class: function(c, f, v) {
        return "";
      }, drag_marker_content: function(c, f, v) {
        return "";
      }, tooltip_date_format: a.date.date_to_str("%Y-%m-%d %H:%i"), tooltip_text: function(c, f, v) {
        return "<b>Event:</b> " + v.text + "<br/><b>Start date:</b> " + a.templates.tooltip_date_format(c) + "<br/><b>End date:</b> " + a.templates.tooltip_date_format(f);
      }, calendar_month: d("%F %Y"), calendar_scale_date: d("%D"), calendar_date: d("%d"), calendar_time: d("%d-%m-%Y") }), this.callEvent("onTemplatesReady", []);
    };
  }(i), function(a) {
    a._events = {}, a.clearAll = function() {
      this._events = {}, this._loaded = {}, this._edit_id = null, this._select_id = null, this._drag_id = null, this._drag_mode = null, this._drag_pos = null, this._new_event = null, this.clear_view(), this.callEvent("onClearAll", []);
    }, a.addEvent = function(d, l, c, f, v) {
      if (!arguments.length)
        return this.addEventNow();
      var p = d;
      arguments.length != 1 && ((p = v || {}).start_date = d, p.end_date = l, p.text = c, p.id = f), p.id = p.id || a.uid(), p.text = p.text || "", typeof p.start_date == "string" && (p.start_date = this.templates.api_date(p.start_date)), typeof p.end_date == "string" && (p.end_date = this.templates.api_date(p.end_date));
      var h = 6e4 * (this.config.event_duration || this.config.time_step);
      p.start_date.valueOf() == p.end_date.valueOf() && p.end_date.setTime(p.end_date.valueOf() + h), p.start_date.setMilliseconds(0), p.end_date.setMilliseconds(0), p._timed = this.isOneDayEvent(p);
      var u = !this._events[p.id];
      return this._events[p.id] = p, this.event_updated(p), this._loading || this.callEvent(u ? "onEventAdded" : "onEventChanged", [p.id, p]), p.id;
    }, a.deleteEvent = function(d, l) {
      var c = this._events[d];
      (l || this.callEvent("onBeforeEventDelete", [d, c]) && this.callEvent("onConfirmedBeforeEventDelete", [d, c])) && (c && (a.getState().select_id == d && a.unselect(), delete this._events[d], this.event_updated(c), this._drag_id == c.id && (this._drag_id = null, this._drag_mode = null, this._drag_pos = null)), this.callEvent("onEventDeleted", [d, c]));
    }, a.getEvent = function(d) {
      return this._events[d];
    }, a.setEvent = function(d, l) {
      l.id || (l.id = d), this._events[d] = l;
    }, a.for_rendered = function(d, l) {
      for (var c = this._rendered.length - 1; c >= 0; c--)
        this._rendered[c].getAttribute(this.config.event_attribute) == d && l(this._rendered[c], c);
    }, a.changeEventId = function(d, l) {
      if (d != l) {
        var c = this._events[d];
        c && (c.id = l, this._events[l] = c, delete this._events[d]), this.for_rendered(d, function(f) {
          f.setAttribute("event_id", l), f.setAttribute(a.config.event_attribute, l);
        }), this._select_id == d && (this._select_id = l), this._edit_id == d && (this._edit_id = l), this.callEvent("onEventIdChange", [d, l]);
      }
    }, function() {
      for (var d = ["text", "Text", "start_date", "StartDate", "end_date", "EndDate"], l = function(v) {
        return function(p) {
          return a.getEvent(p)[v];
        };
      }, c = function(v) {
        return function(p, h) {
          var u = a.getEvent(p);
          u[v] = h, u._changed = !0, u._timed = this.isOneDayEvent(u), a.event_updated(u, !0);
        };
      }, f = 0; f < d.length; f += 2)
        a["getEvent" + d[f + 1]] = l(d[f]), a["setEvent" + d[f + 1]] = c(d[f]);
    }(), a.event_updated = function(d, l) {
      this.is_visible_events(d) ? this.render_view_data() : this.clear_event(d.id);
    }, a.is_visible_events = function(d) {
      if (!this._min_date || !this._max_date)
        return !1;
      if (d.start_date.valueOf() < this._max_date.valueOf() && this._min_date.valueOf() < d.end_date.valueOf()) {
        var l = d.start_date.getHours(), c = d.end_date.getHours() + d.end_date.getMinutes() / 60, f = this.config.last_hour, v = this.config.first_hour;
        return !(!this._table_view && (c > f || c <= v) && (l >= f || l < v) && !((d.end_date.valueOf() - d.start_date.valueOf()) / 36e5 > 24 - (this.config.last_hour - this.config.first_hour) || l < f && c > v));
      }
      return !1;
    }, a.isOneDayEvent = function(d) {
      var l = new Date(d.end_date.valueOf() - 1);
      return d.start_date.getFullYear() === l.getFullYear() && d.start_date.getMonth() === l.getMonth() && d.start_date.getDate() === l.getDate() && d.end_date.valueOf() - d.start_date.valueOf() < 864e5;
    }, a.get_visible_events = function(d) {
      var l = [];
      for (var c in this._events)
        this.is_visible_events(this._events[c]) && (d && !this._events[c]._timed || this.filter_event(c, this._events[c]) && l.push(this._events[c]));
      return l;
    }, a.filter_event = function(d, l) {
      var c = this["filter_" + this._mode];
      return !c || c(d, l);
    }, a._is_main_area_event = function(d) {
      return !!d._timed;
    }, a.render_view_data = function(d, l) {
      var c = !1;
      if (!d) {
        if (c = !0, this._not_render)
          return void (this._render_wait = !0);
        this._render_wait = !1, this.clear_view(), d = this.get_visible_events(!(this._table_view || this.config.multi_day));
      }
      for (var f = 0, v = d.length; f < v; f++)
        this._recalculate_timed(d[f]);
      if (this.config.multi_day && !this._table_view) {
        var p = [], h = [];
        for (f = 0; f < d.length; f++)
          this._is_main_area_event(d[f]) ? p.push(d[f]) : h.push(d[f]);
        if (!this._els.dhx_multi_day) {
          var u = a._commonErrorMessages.unknownView(this._mode);
          throw new Error(u);
        }
        this._rendered_location = this._els.dhx_multi_day[0], this._table_view = !0, this.render_data(h, l), this._table_view = !1, this._rendered_location = this._els.dhx_cal_data[0], this._table_view = !1, this.render_data(p, l);
      } else {
        var m = document.createDocumentFragment(), y = this._els.dhx_cal_data[0];
        this._rendered_location = m, this.render_data(d, l), y.appendChild(m), this._rendered_location = y;
      }
      c && this.callEvent("onDataRender", []);
    }, a._view_month_day = function(d) {
      var l = a.getActionData(d).date;
      a.callEvent("onViewMoreClick", [l]) && a.setCurrentView(l, "day");
    }, a._render_month_link = function(d) {
      for (var l = this._rendered_location, c = this._lame_clone(d), f = d._sday; f < d._eday; f++) {
        c._sday = f, c._eday = f + 1;
        var v = a.date, p = a._min_date;
        p = v.add(p, c._sweek, "week"), p = v.add(p, c._sday, "day");
        var h = a.getEvents(p, v.add(p, 1, "day")).length, u = this._get_event_bar_pos(c), m = u.x2 - u.x, y = document.createElement("div");
        a.event(y, "click", function(w) {
          a._view_month_day(w);
        }), y.className = "dhx_month_link", y.style.top = u.y + "px", y.style.left = u.x + "px", y.style.width = m + "px", y.innerHTML = a.templates.month_events_link(p, h), this._rendered.push(y), l.appendChild(y);
      }
    }, a._recalculate_timed = function(d) {
      var l;
      d && (l = typeof d != "object" ? this._events[d] : d) && (l._timed = a.isOneDayEvent(l));
    }, a.attachEvent("onEventChanged", a._recalculate_timed), a.attachEvent("onEventAdded", a._recalculate_timed), a.render_data = function(d, l) {
      d = this._pre_render_events(d, l);
      for (var c = {}, f = 0; f < d.length; f++)
        if (this._table_view)
          if (a._mode != "month")
            this.render_event_bar(d[f]);
          else {
            var v = a.config.max_month_events;
            v !== 1 * v || d[f]._sorder < v ? this.render_event_bar(d[f]) : v !== void 0 && d[f]._sorder == v && a._render_month_link(d[f]);
          }
        else {
          var p = d[f], h = a.locate_holder(p._sday);
          if (!h)
            continue;
          c[p._sday] || (c[p._sday] = { real: h, buffer: document.createDocumentFragment(), width: h.clientWidth });
          var u = c[p._sday];
          this.render_event(p, u.buffer, u.width);
        }
      for (var f in c)
        (u = c[f]).real && u.buffer && u.real.appendChild(u.buffer);
    }, a._get_first_visible_cell = function(d) {
      for (var l = 0; l < d.length; l++)
        if ((d[l].className || "").indexOf("dhx_scale_ignore") == -1)
          return d[l];
      return d[0];
    }, a._pre_render_events = function(d, l) {
      var c = this.xy.bar_height, f = this._colsS.heights, v = this._colsS.heights = [0, 0, 0, 0, 0, 0, 0], p = this._els.dhx_cal_data[0];
      if (d = this._table_view ? this._pre_render_events_table(d, l) : this._pre_render_events_line(d, l), this._table_view)
        if (l)
          this._colsS.heights = f;
        else {
          var h = p.querySelectorAll(".dhx_cal_month_row");
          if (h.length) {
            for (var u = 0; u < h.length; u++) {
              v[u]++;
              var m = h[u].querySelectorAll(".dhx_cal_month_cell"), y = this._colsS.height - this.xy.month_head_height;
              if (v[u] * c > y) {
                var w = y;
                1 * this.config.max_month_events !== this.config.max_month_events || v[u] <= this.config.max_month_events ? w = v[u] * c : (this.config.max_month_events + 1) * c > y && (w = (this.config.max_month_events + 1) * c), h[u].style.height = w + this.xy.month_head_height + "px";
              }
              v[u] = (v[u - 1] || 0) + a._get_first_visible_cell(m).offsetHeight;
            }
            v.unshift(0);
            const N = this.$container.querySelector(".dhx_cal_data");
            if (N.offsetHeight < N.scrollHeight && !a._colsS.scroll_fix && a.xy.scroll_width) {
              var D = a._colsS, E = D[D.col_length], S = D.heights.slice();
              E -= a.xy.scroll_width || 0, this._calc_scale_sizes(E, this._min_date, this._max_date), a._colsS.heights = S, this.set_xy(this._els.dhx_cal_header[0], E), a._render_scales(this._els.dhx_cal_header[0]), a._render_month_scale(this._els.dhx_cal_data[0], this._get_timeunit_start(), this._min_date), D.scroll_fix = !0;
            }
          } else if (d.length || this._els.dhx_multi_day[0].style.visibility != "visible" || (v[0] = -1), d.length || v[0] == -1) {
            var g = (v[0] + 1) * c + 4, b = g, x = g + "px";
            this.config.multi_day_height_limit && (x = (b = Math.min(g, this.config.multi_day_height_limit)) + "px");
            var k = this._els.dhx_multi_day[0];
            k.style.height = x, k.style.visibility = v[0] == -1 ? "hidden" : "visible", k.style.display = v[0] == -1 ? "none" : "";
            var M = this._els.dhx_multi_day[1];
            M.style.height = x, M.style.visibility = v[0] == -1 ? "hidden" : "visible", M.style.display = v[0] == -1 ? "none" : "", M.className = v[0] ? "dhx_multi_day_icon" : "dhx_multi_day_icon_small", this._dy_shift = (v[0] + 1) * c, this.config.multi_day_height_limit && (this._dy_shift = Math.min(this.config.multi_day_height_limit, this._dy_shift)), v[0] = 0, b != g && (k.style.overflowY = "auto", M.style.position = "fixed", M.style.top = "", M.style.left = "");
          }
        }
      return d;
    }, a._get_event_sday = function(d) {
      var l = this.date.day_start(new Date(d.start_date));
      return Math.round((l.valueOf() - this._min_date.valueOf()) / 864e5);
    }, a._get_event_mapped_end_date = function(d) {
      var l = d.end_date;
      if (this.config.separate_short_events) {
        var c = (d.end_date - d.start_date) / 6e4;
        c < this._min_mapped_duration && (l = this.date.add(l, this._min_mapped_duration - c, "minute"));
      }
      return l;
    }, a._pre_render_events_line = function(d, l) {
      d.sort(function(M, N) {
        return M.start_date.valueOf() == N.start_date.valueOf() ? M.id > N.id ? 1 : -1 : M.start_date > N.start_date ? 1 : -1;
      });
      var c = [], f = [];
      this._min_mapped_duration = Math.floor(60 * this.xy.min_event_height / this.config.hour_size_px);
      for (var v = 0; v < d.length; v++) {
        var p = d[v], h = p.start_date, u = p.end_date, m = h.getHours(), y = u.getHours();
        if (p._sday = this._get_event_sday(p), this._ignores[p._sday])
          d.splice(v, 1), v--;
        else {
          if (c[p._sday] || (c[p._sday] = []), !l) {
            p._inner = !1;
            for (var w = c[p._sday]; w.length; ) {
              var D = w[w.length - 1];
              if (!(this._get_event_mapped_end_date(D).valueOf() <= p.start_date.valueOf()))
                break;
              w.splice(w.length - 1, 1);
            }
            for (var E = w.length, S = !1, g = 0; g < w.length; g++)
              if (D = w[g], this._get_event_mapped_end_date(D).valueOf() <= p.start_date.valueOf()) {
                S = !0, p._sorder = D._sorder, E = g, p._inner = !0;
                break;
              }
            if (w.length && (w[w.length - 1]._inner = !0), !S)
              if (w.length)
                if (w.length <= w[w.length - 1]._sorder) {
                  if (w[w.length - 1]._sorder)
                    for (g = 0; g < w.length; g++) {
                      for (var b = !1, x = 0; x < w.length; x++)
                        if (w[x]._sorder == g) {
                          b = !0;
                          break;
                        }
                      if (!b) {
                        p._sorder = g;
                        break;
                      }
                    }
                  else
                    p._sorder = 0;
                  p._inner = !0;
                } else {
                  var k = w[0]._sorder;
                  for (g = 1; g < w.length; g++)
                    w[g]._sorder > k && (k = w[g]._sorder);
                  p._sorder = k + 1, p._inner = !1;
                }
              else
                p._sorder = 0;
            w.splice(E, E == w.length ? 0 : 1, p), w.length > (w.max_count || 0) ? (w.max_count = w.length, p._count = w.length) : p._count = p._count ? p._count : 1;
          }
          (m < this.config.first_hour || y >= this.config.last_hour) && (f.push(p), d[v] = p = this._copy_event(p), m < this.config.first_hour && (p.start_date.setHours(this.config.first_hour), p.start_date.setMinutes(0)), y >= this.config.last_hour && (p.end_date.setMinutes(0), p.end_date.setHours(this.config.last_hour)), p.start_date > p.end_date || m == this.config.last_hour) && (d.splice(v, 1), v--);
        }
      }
      if (!l) {
        for (v = 0; v < d.length; v++)
          d[v]._count = c[d[v]._sday].max_count;
        for (v = 0; v < f.length; v++)
          f[v]._count = c[f[v]._sday].max_count;
      }
      return d;
    }, a._time_order = function(d) {
      d.sort(function(l, c) {
        return l.start_date.valueOf() == c.start_date.valueOf() ? l._timed && !c._timed ? 1 : !l._timed && c._timed ? -1 : l.id > c.id ? 1 : -1 : l.start_date > c.start_date ? 1 : -1;
      });
    }, a._is_any_multiday_cell_visible = function(d, l, c) {
      var f = this._cols.length, v = !1, p = d, h = !0, u = new Date(l);
      for (a.date.day_start(new Date(l)).valueOf() != l.valueOf() && (u = a.date.day_start(u), u = a.date.add(u, 1, "day")); p < u; ) {
        h = !1;
        var m = this.locate_holder_day(p, !1, c) % f;
        if (!this._ignores[m]) {
          v = !0;
          break;
        }
        p = a.date.add(p, 1, "day");
      }
      return h || v;
    }, a._pre_render_events_table = function(d, l) {
      this._time_order(d);
      for (var c, f = [], v = [[], [], [], [], [], [], []], p = this._colsS.heights, h = this._cols.length, u = {}, m = 0; m < d.length; m++) {
        var y = d[m], w = y.id;
        u[w] || (u[w] = { first_chunk: !0, last_chunk: !0 });
        var D = u[w], E = c || y.start_date, S = y.end_date;
        E < this._min_date && (D.first_chunk = !1, E = this._min_date), S > this._max_date && (D.last_chunk = !1, S = this._max_date);
        var g = this.locate_holder_day(E, !1, y);
        if (y._sday = g % h, !this._ignores[y._sday] || !y._timed) {
          var b = this.locate_holder_day(S, !0, y) || h;
          if (y._eday = b % h || h, y._length = b - g, y._sweek = Math.floor((this._correct_shift(E.valueOf(), 1) - this._min_date.valueOf()) / (864e5 * h)), a._is_any_multiday_cell_visible(E, S, y)) {
            var x, k = v[y._sweek];
            for (x = 0; x < k.length && !(k[x]._eday <= y._sday); x++)
              ;
            if (y._sorder && l || (y._sorder = x), y._sday + y._length <= h)
              c = null, f.push(y), k[x] = y, p[y._sweek] = k.length - 1, y._first_chunk = D.first_chunk, y._last_chunk = D.last_chunk;
            else {
              var M = this._copy_event(y);
              M.id = y.id, M._length = h - y._sday, M._eday = h, M._sday = y._sday, M._sweek = y._sweek, M._sorder = y._sorder, M.end_date = this.date.add(E, M._length, "day"), M._first_chunk = D.first_chunk, D.first_chunk && (D.first_chunk = !1), f.push(M), k[x] = M, c = M.end_date, p[y._sweek] = k.length - 1, m--;
            }
          } else
            c = null;
        }
      }
      return f;
    }, a._copy_dummy = function() {
      var d = new Date(this.start_date), l = new Date(this.end_date);
      this.start_date = d, this.end_date = l;
    }, a._copy_event = function(d) {
      return this._copy_dummy.prototype = d, new this._copy_dummy();
    }, a._rendered = [], a.clear_view = function() {
      for (var d = 0; d < this._rendered.length; d++) {
        var l = this._rendered[d];
        l.parentNode && l.parentNode.removeChild(l);
      }
      this._rendered = [];
    }, a.updateEvent = function(d) {
      var l = this.getEvent(d);
      this.clear_event(d), l && this.is_visible_events(l) && this.filter_event(d, l) && (this._table_view || this.config.multi_day || l._timed) && (this.config.update_render ? this.render_view_data() : this.getState().mode != "month" || this.getState().drag_id || this.isOneDayEvent(l) ? this.render_view_data([l], !0) : this.render_view_data());
    }, a.clear_event = function(d) {
      this.for_rendered(d, function(l, c) {
        l.parentNode && l.parentNode.removeChild(l), a._rendered.splice(c, 1);
      });
    }, a._y_from_date = function(d) {
      var l = 60 * d.getHours() + d.getMinutes();
      return Math.round((60 * l * 1e3 - 60 * this.config.first_hour * 60 * 1e3) * this.config.hour_size_px / 36e5) % (24 * this.config.hour_size_px);
    }, a._calc_event_y = function(d, l) {
      l = l || 0;
      var c = 60 * d.start_date.getHours() + d.start_date.getMinutes(), f = 60 * d.end_date.getHours() + d.end_date.getMinutes() || 60 * a.config.last_hour;
      return { top: this._y_from_date(d.start_date), height: Math.max(l, (f - c) * this.config.hour_size_px / 60) };
    }, a.render_event = function(d, l, c) {
      var f = a.xy.menu_width, v = this.config.use_select_menu_space ? 0 : f;
      if (!(d._sday < 0)) {
        var p = a.locate_holder(d._sday);
        if (p) {
          l = l || p;
          var h = this._calc_event_y(d, a.xy.min_event_height), u = h.top, m = h.height, y = d._count || 1, w = d._sorder || 0;
          c = c || p.clientWidth, this.config.day_column_padding && (c -= this.config.day_column_padding);
          var D = Math.floor((c - v) / y), E = w * D + 1;
          if (d._inner || (D *= y - w), this.config.cascade_event_display) {
            const A = this.config.cascade_event_count, C = this.config.cascade_event_margin;
            let $, O = (y - w - 1) % A * C, j = w % A * C;
            y * C < c - this.config.day_column_padding ? $ = d._inner ? O / 2 : 0 : ($ = d._inner ? O / 3 : 0, E = j / 3, y * C / 2 > c - this.config.day_column_padding && ($ = d._inner ? O / A : 0, E = j / A)), D = Math.floor(c - v - E - $);
          }
          d._mode = m < 30 ? "smallest" : m < 42 ? "small" : null;
          var S = this._render_v_bar(d, v + E, u, D, m, d._text_style, a.templates.event_header(d.start_date, d.end_date, d), a.templates.event_text(d.start_date, d.end_date, d));
          if (d._mode === "smallest" ? S.classList.add("dhx_cal_event--xsmall") : d._mode === "small" && S.classList.add("dhx_cal_event--small"), this._waiAria.eventAttr(d, S), this._rendered.push(S), l.appendChild(S), E = E + parseInt(this.config.rtl ? p.style.right : p.style.left, 10) + v, this._edit_id == d.id) {
            S.style.zIndex = 1, D = Math.max(D, a.xy.editor_width), (S = document.createElement("div")).setAttribute("event_id", d.id), S.setAttribute(this.config.event_attribute, d.id), this._waiAria.eventAttr(d, S), S.className = "dhx_cal_event dhx_cal_editor", this.config.rtl && E++, this.set_xy(S, D, m, E, u), d.color && S.style.setProperty("--dhx-scheduler-event-background", d.color);
            var g = a.templates.event_class(d.start_date, d.end_date, d);
            g && (S.className += " " + g);
            var b = document.createElement("div");
            b.style.cssText += "overflow:hidden;height:100%", S.appendChild(b), this._els.dhx_cal_data[0].appendChild(S), this._rendered.push(S), b.innerHTML = "<textarea class='dhx_cal_editor'>" + d.text + "</textarea>", this._editor = b.querySelector("textarea"), a.event(this._editor, "keydown", function(A) {
              if (A.shiftKey)
                return !0;
              var C = A.keyCode;
              C == a.keys.edit_save && a.editStop(!0), C == a.keys.edit_cancel && a.editStop(!1), C != a.keys.edit_save && C != a.keys.edit_cancel || A.preventDefault && A.preventDefault();
            }), a.event(this._editor, "selectstart", function(A) {
              return A.cancelBubble = !0, !0;
            }), a._focus(this._editor, !0), this._els.dhx_cal_data[0].scrollLeft = 0;
          }
          if (this.xy.menu_width !== 0 && this._select_id == d.id) {
            this.config.cascade_event_display && this._drag_mode && (S.style.zIndex = 1);
            for (var x, k = this.config["icons_" + (this._edit_id == d.id ? "edit" : "select")], M = "", N = 0; N < k.length; N++) {
              const A = k[N];
              x = this._waiAria.eventMenuAttrString(A), M += `<div class='dhx_menu_icon ${A}' title='${this.locale.labels[A]}' ${x}></div>`;
            }
            var T = this._render_v_bar(d, E - f - 1, u, f, null, "", "<div class='dhx_menu_head'></div>", M, !0);
            d.color && T.style.setProperty("--dhx-scheduler-event-background", d.color), d.textColor && T.style.setProperty("--dhx-scheduler-event-color", d.textColor), this._els.dhx_cal_data[0].appendChild(T), this._rendered.push(T);
          }
          this.config.drag_highlight && this._drag_id == d.id && this.highlightEventPosition(d);
        }
      }
    }, a._render_v_bar = function(d, l, c, f, v, p, h, u, m) {
      var y = document.createElement("div"), w = d.id, D = m ? "dhx_cal_event dhx_cal_select_menu" : "dhx_cal_event", E = a.getState();
      E.drag_id == d.id && (D += " dhx_cal_event_drag"), E.select_id == d.id && (D += " dhx_cal_event_selected");
      var S = a.templates.event_class(d.start_date, d.end_date, d);
      S && (D = D + " " + S), this.config.cascade_event_display && (D += " dhx_cal_event_cascade");
      var g = f - 1, b = `<div event_id="${w}" ${this.config.event_attribute}="${w}" class="${D}"
				style="position:absolute; top:${c}px; ${this.config.rtl ? "right:" : "left:"}${l}px; width:${g}px; height:${v}px; ${p || ""}" 
				data-bar-start="${d.start_date.valueOf()}" data-bar-end="${d.end_date.valueOf()}">
				</div>`;
      y.innerHTML = b;
      var x = y.cloneNode(!0).firstChild;
      if (!m && a.renderEvent(x, d, f, v, h, u))
        return d.color && x.style.setProperty("--dhx-scheduler-event-background", d.color), d.textColor && x.style.setProperty("--dhx-scheduler-event-color", d.textColor), x;
      x = y.firstChild, d.color && x.style.setProperty("--dhx-scheduler-event-background", d.color), d.textColor && x.style.setProperty("--dhx-scheduler-event-color", d.textColor);
      var k = '<div class="dhx_event_move dhx_header" >&nbsp;</div>';
      k += '<div class="dhx_event_move dhx_title">' + h + "</div>", k += '<div class="dhx_body">' + u + "</div>";
      var M = "dhx_event_resize dhx_footer";
      return (m || d._drag_resize === !1) && (M = "dhx_resize_denied " + M), k += '<div class="' + M + '" style=" width:' + (m ? " margin-top:-1px;" : "") + '" ></div>', x.innerHTML = k, x;
    }, a.renderEvent = function() {
      return !1;
    }, a.locate_holder = function(d) {
      return this._mode == "day" ? this._els.dhx_cal_data[0].firstChild : this._els.dhx_cal_data[0].childNodes[d];
    }, a.locate_holder_day = function(d, l) {
      var c = Math.floor((this._correct_shift(d, 1) - this._min_date) / 864e5);
      return l && this.date.time_part(d) && c++, c;
    }, a._get_dnd_order = function(d, l, c) {
      if (!this._drag_event)
        return d;
      this._drag_event._orig_sorder ? d = this._drag_event._orig_sorder : this._drag_event._orig_sorder = d;
      for (var f = l * d; f + l > c; )
        d--, f -= l;
      return Math.max(d, 0);
    }, a._get_event_bar_pos = function(d) {
      var l = this.config.rtl, c = this._colsS, f = c[d._sday], v = c[d._eday];
      l && (f = c[c.col_length] - c[d._eday] + c[0], v = c[c.col_length] - c[d._sday] + c[0]), v == f && (v = c[d._eday + 1]);
      var p = this.xy.bar_height, h = d._sorder;
      if (d.id == this._drag_id) {
        var u = c.heights[d._sweek + 1] - c.heights[d._sweek] - this.xy.month_head_height;
        h = a._get_dnd_order(h, p, u);
      }
      var m = h * p;
      return { x: f, x2: v, y: c.heights[d._sweek] + (c.height ? this.xy.month_scale_height + 2 : 2) + m };
    }, a.render_event_bar = function(d) {
      var l = this._rendered_location, c = this._get_event_bar_pos(d), f = c.y, v = c.x, p = c.x2, h = "";
      if (p) {
        var u = a.config.resize_month_events && this._mode == "month" && (!d._timed || a.config.resize_month_timed), m = document.createElement("div"), y = d.hasOwnProperty("_first_chunk") && d._first_chunk, w = d.hasOwnProperty("_last_chunk") && d._last_chunk, D = u && (d._timed || y), E = u && (d._timed || w), S = !0, g = "dhx_cal_event_clear";
        d._timed && !u || (S = !1, g = "dhx_cal_event_line"), y && (g += " dhx_cal_event_line_start"), w && (g += " dhx_cal_event_line_end"), D && (h += "<div class='dhx_event_resize dhx_event_resize_start'></div>"), E && (h += "<div class='dhx_event_resize dhx_event_resize_end'></div>");
        var b = a.templates.event_class(d.start_date, d.end_date, d);
        b && (g += " " + b);
        var x = d.color ? "--dhx-scheduler-event-background:" + d.color + ";" : "", k = d.textColor ? "--dhx-scheduler-event-color:" + d.textColor + ";" : "", M = ["position:absolute", "top:" + f + "px", "left:" + v + "px", "width:" + (p - v - (S ? 1 : 0)) + "px", "height:" + (this.xy.bar_height - 2) + "px", k, x, d._text_style || ""].join(";"), N = "<div event_id='" + d.id + "' " + this.config.event_attribute + "='" + d.id + "' class='" + g + "' style='" + M + "'" + this._waiAria.eventBarAttrString(d) + ">";
        u && (N += h), a.getState().mode != "month" || d._beforeEventChangedFlag || (d = a.getEvent(d.id)), d._timed && (N += `<span class='dhx_cal_event_clear_date'>${a.templates.event_bar_date(d.start_date, d.end_date, d)}</span>`), N += "<div class='dhx_cal_event_line_content'>", N += a.templates.event_bar_text(d.start_date, d.end_date, d) + "</div>", N += "</div>", N += "</div>", m.innerHTML = N, this._rendered.push(m.firstChild), l.appendChild(m.firstChild);
      }
    }, a._locate_event = function(d) {
      for (var l = null; d && !l && d.getAttribute; )
        l = d.getAttribute(this.config.event_attribute), d = d.parentNode;
      return l;
    }, a.edit = function(d) {
      this._edit_id != d && (this.editStop(!1, d), this._edit_id = d, this.updateEvent(d));
    }, a.editStop = function(d, l) {
      if (!l || this._edit_id != l) {
        var c = this.getEvent(this._edit_id);
        c && (d && (c.text = this._editor.value), this._edit_id = null, this._editor = null, this.updateEvent(c.id), this._edit_stop_event(c, d));
      }
    }, a._edit_stop_event = function(d, l) {
      this._new_event ? (l ? this.callEvent("onEventAdded", [d.id, d]) : d && this.deleteEvent(d.id, !0), this._new_event = null) : l && this.callEvent("onEventChanged", [d.id, d]);
    }, a.getEvents = function(d, l) {
      var c = [];
      for (var f in this._events) {
        var v = this._events[f];
        v && (!d && !l || v.start_date < l && v.end_date > d) && c.push(v);
      }
      return c;
    }, a.getRenderedEvent = function(d) {
      if (d) {
        for (var l = a._rendered, c = 0; c < l.length; c++) {
          var f = l[c];
          if (f.getAttribute(a.config.event_attribute) == d)
            return f;
        }
        return null;
      }
    }, a.showEvent = function(d, l) {
      d && typeof d == "object" && (l = d.mode, w = d.section, d = d.section);
      var c = typeof d == "number" || typeof d == "string" ? a.getEvent(d) : d;
      if (l = l || a._mode, c && (!this.checkEvent("onBeforeEventDisplay") || this.callEvent("onBeforeEventDisplay", [c, l]))) {
        var f = a.config.scroll_hour;
        a.config.scroll_hour = c.start_date.getHours();
        var v = a.config.preserve_scroll;
        a.config.preserve_scroll = !1;
        var p = c.color, h = c.textColor;
        if (a.config.highlight_displayed_event && (c.color = a.config.displayed_event_color, c.textColor = a.config.displayed_event_text_color), a.setCurrentView(new Date(c.start_date), l), a.config.scroll_hour = f, a.config.preserve_scroll = v, a.matrix && a.matrix[l]) {
          var u = a.getView(), m = u.y_property, y = a.getEvent(c.id);
          if (y) {
            if (!w) {
              var w = y[m];
              Array.isArray(w) ? w = w[0] : typeof w == "string" && a.config.section_delimiter && w.indexOf(a.config.section_delimiter) > -1 && (w = w.split(a.config.section_delimiter)[0]);
            }
            var D = u.getSectionTop(w), E = u.posFromDate(y.start_date), S = a.$container.querySelector(".dhx_timeline_data_wrapper");
            if (E -= (S.offsetWidth - u.dx) / 2, D = D - S.offsetHeight / 2 + u.dy / 2, u._smartRenderingEnabled())
              var g = u.attachEvent("onScroll", function() {
                b(), u.detachEvent(g);
              });
            u.scrollTo({ left: E, top: D }), u._smartRenderingEnabled() || b();
          }
        } else
          b();
        a.callEvent("onAfterEventDisplay", [c, l]);
      }
      function b() {
        c.color = p, c.textColor = h;
      }
    };
  }(i), function(a) {
    a._append_drag_marker = function(d) {
      if (!d.parentNode) {
        var l = a._els.dhx_cal_data[0].lastChild, c = a._getClassName(l);
        c.indexOf("dhx_scale_holder") < 0 && l.previousSibling && (l = l.previousSibling), c = a._getClassName(l), l && c.indexOf("dhx_scale_holder") === 0 && l.appendChild(d);
      }
    }, a._update_marker_position = function(d, l) {
      var c = a._calc_event_y(l, 0);
      d.style.top = c.top + "px", d.style.height = c.height + "px";
    }, a.highlightEventPosition = function(d) {
      var l = document.createElement("div");
      l.setAttribute("event_id", d.id), l.setAttribute(this.config.event_attribute, d.id), this._rendered.push(l), this._update_marker_position(l, d);
      var c = this.templates.drag_marker_class(d.start_date, d.end_date, d), f = this.templates.drag_marker_content(d.start_date, d.end_date, d);
      l.className = "dhx_drag_marker", c && (l.className += " " + c), f && (l.innerHTML = f), this._append_drag_marker(l);
    };
  }(i), Ft(i), function(a) {
    function d() {
      const l = a.config.csp === !0, c = !!window.Sfdc || !!window.$A || window.Aura || "$shadowResolver$" in document.body;
      return l || c ? a.$root : document.body;
    }
    a._lightbox_controls = {}, a.formSection = function(l) {
      for (var c = this.config.lightbox.sections, f = 0; f < c.length && c[f].name != l; f++)
        ;
      if (f === c.length)
        return null;
      var v = c[f];
      a._lightbox || a.getLightbox();
      var p = a._lightbox.querySelector(`#${v.id}`), h = p.nextSibling, u = { section: v, header: p, node: h, getValue: function(y) {
        return a.form_blocks[v.type].get_value(h, y || {}, v);
      }, setValue: function(y, w) {
        return a.form_blocks[v.type].set_value(h, y, w || {}, v);
      } }, m = a._lightbox_controls["get_" + v.type + "_control"];
      return m ? m(u) : u;
    }, a._lightbox_controls.get_template_control = function(l) {
      return l.control = l.node, l;
    }, a._lightbox_controls.get_select_control = function(l) {
      return l.control = l.node.getElementsByTagName("select")[0], l;
    }, a._lightbox_controls.get_textarea_control = function(l) {
      return l.control = l.node.getElementsByTagName("textarea")[0], l;
    }, a._lightbox_controls.get_time_control = function(l) {
      return l.control = l.node.getElementsByTagName("select"), l;
    }, a._lightbox_controls.defaults = { template: { height: 30 }, textarea: { height: 200 }, select: { height: 23 }, time: { height: 20 } }, a.form_blocks = { template: { render: function(l) {
      return "<div class='dhx_cal_ltext dhx_cal_template' ></div>";
    }, set_value: function(l, c, f, v) {
      l.innerHTML = c || "";
    }, get_value: function(l, c, f) {
      return l.innerHTML || "";
    }, focus: function(l) {
    } }, textarea: { render: function(l) {
      return `<div class='dhx_cal_ltext'><textarea ${l.placeholder ? `placeholder='${l.placeholder}'` : ""}></textarea></div>`;
    }, set_value: function(l, c, f) {
      a.form_blocks.textarea._get_input(l).value = c || "";
    }, get_value: function(l, c) {
      return a.form_blocks.textarea._get_input(l).value;
    }, focus: function(l) {
      var c = a.form_blocks.textarea._get_input(l);
      a._focus(c, !0);
    }, _get_input: function(l) {
      return l.getElementsByTagName("textarea")[0];
    } }, select: { render: function(l) {
      for (var c = "<div class='dhx_cal_ltext dhx_cal_select'><select style='width:100%;'>", f = 0; f < l.options.length; f++)
        c += "<option value='" + l.options[f].key + "'>" + l.options[f].label + "</option>";
      return c + "</select></div>";
    }, set_value: function(l, c, f, v) {
      var p = l.firstChild;
      !p._dhx_onchange && v.onchange && (a.event(p, "change", v.onchange), p._dhx_onchange = !0), c === void 0 && (c = (p.options[0] || {}).value), p.value = c || "";
    }, get_value: function(l, c) {
      return l.firstChild.value;
    }, focus: function(l) {
      var c = l.firstChild;
      a._focus(c, !0);
    } }, time: { render: function(l) {
      l.time_format || (l.time_format = ["%H:%i", "%d", "%m", "%Y"]), l._time_format_order = {};
      var c = l.time_format, f = a.config, v = a.date.date_part(a._currentDate()), p = 1440, h = 0;
      a.config.limit_time_select && (p = 60 * f.last_hour + 1, h = 60 * f.first_hour, v.setHours(f.first_hour));
      for (var u = "", m = 0; m < c.length; m++) {
        var y = c[m];
        m > 0 && (u += " ");
        var w = "", D = "";
        switch (y) {
          case "%Y":
            var E, S, g;
            w = "dhx_lightbox_year_select", l._time_format_order[3] = m, l.year_range && (isNaN(l.year_range) ? l.year_range.push && (S = l.year_range[0], g = l.year_range[1]) : E = l.year_range), E = E || 10;
            var b = b || Math.floor(E / 2);
            S = S || v.getFullYear() - b, g = g || S + E;
            for (var x = S; x < g; x++)
              D += "<option value='" + x + "'>" + x + "</option>";
            break;
          case "%m":
            for (w = "dhx_lightbox_month_select", l._time_format_order[2] = m, x = 0; x < 12; x++)
              D += "<option value='" + x + "'>" + this.locale.date.month_full[x] + "</option>";
            break;
          case "%d":
            for (w = "dhx_lightbox_day_select", l._time_format_order[1] = m, x = 1; x < 32; x++)
              D += "<option value='" + x + "'>" + x + "</option>";
            break;
          case "%H:%i":
            w = "dhx_lightbox_time_select", l._time_format_order[0] = m, x = h;
            var k = v.getDate();
            for (l._time_values = []; x < p; )
              D += "<option value='" + x + "'>" + this.templates.time_picker(v) + "</option>", l._time_values.push(x), v.setTime(v.valueOf() + 60 * this.config.time_step * 1e3), x = 24 * (v.getDate() != k ? 1 : 0) * 60 + 60 * v.getHours() + v.getMinutes();
        }
        if (D) {
          var M = a._waiAria.lightboxSelectAttrString(y);
          u += "<select class='" + w + "' " + (l.readonly ? "disabled='disabled'" : "") + M + ">" + D + "</select> ";
        }
      }
      return "<div class='dhx_section_time'>" + u + "<span style='font-weight:normal; font-size:10pt;' class='dhx_section_time_spacer'> &nbsp;&ndash;&nbsp; </span>" + u + "</div>";
    }, set_value: function(l, c, f, v) {
      var p, h, u = a.config, m = l.getElementsByTagName("select"), y = v._time_format_order;
      if (u.full_day) {
        if (!l._full_day) {
          var w = "<label class='dhx_fullday'><input type='checkbox' name='full_day' value='true'> " + a.locale.labels.full_day + "&nbsp;</label></input>";
          a.config.wide_form || (w = l.previousSibling.innerHTML + w), l.previousSibling.innerHTML = w, l._full_day = !0;
        }
        var D = l.previousSibling.getElementsByTagName("input")[0];
        D.checked = a.date.time_part(f.start_date) === 0 && a.date.time_part(f.end_date) === 0, m[y[0]].disabled = D.checked, m[y[0] + m.length / 2].disabled = D.checked, D.$_eventAttached || (D.$_eventAttached = !0, a.event(D, "click", function() {
          if (D.checked) {
            var b = {};
            a.form_blocks.time.get_value(l, b, v), p = a.date.date_part(b.start_date), (+(h = a.date.date_part(b.end_date)) == +p || +h >= +p && (f.end_date.getHours() !== 0 || f.end_date.getMinutes() !== 0)) && (h = a.date.add(h, 1, "day"));
          } else
            p = null, h = null;
          m[y[0]].disabled = D.checked, m[y[0] + m.length / 2].disabled = D.checked, g(m, 0, p || f.start_date), g(m, 4, h || f.end_date);
        }));
      }
      if (u.auto_end_date && u.event_duration)
        for (var E = function() {
          u.auto_end_date && u.event_duration && (p = new Date(m[y[3]].value, m[y[2]].value, m[y[1]].value, 0, m[y[0]].value), h = new Date(p.getTime() + 60 * a.config.event_duration * 1e3), g(m, 4, h));
        }, S = 0; S < 4; S++)
          m[S].$_eventAttached || (m[S].$_eventAttached = !0, a.event(m[S], "change", E));
      function g(b, x, k) {
        for (var M = v._time_values, N = 60 * k.getHours() + k.getMinutes(), T = N, A = !1, C = 0; C < M.length; C++) {
          var $ = M[C];
          if ($ === N) {
            A = !0;
            break;
          }
          $ < N && (T = $);
        }
        b[x + y[0]].value = A ? N : T, A || T || (b[x + y[0]].selectedIndex = -1), b[x + y[1]].value = k.getDate(), b[x + y[2]].value = k.getMonth(), b[x + y[3]].value = k.getFullYear();
      }
      g(m, 0, f.start_date), g(m, 4, f.end_date);
    }, get_value: function(l, c, f) {
      var v = l.getElementsByTagName("select"), p = f._time_format_order;
      if (c.start_date = new Date(v[p[3]].value, v[p[2]].value, v[p[1]].value, 0, v[p[0]].value), c.end_date = new Date(v[p[3] + 4].value, v[p[2] + 4].value, v[p[1] + 4].value, 0, v[p[0] + 4].value), !v[p[3]].value || !v[p[3] + 4].value) {
        var h = a.getEvent(a._lightbox_id);
        h && (c.start_date = h.start_date, c.end_date = h.end_date);
      }
      return c.end_date <= c.start_date && (c.end_date = a.date.add(c.start_date, a.config.time_step, "minute")), { start_date: new Date(c.start_date), end_date: new Date(c.end_date) };
    }, focus: function(l) {
      a._focus(l.getElementsByTagName("select")[0]);
    } } }, a._setLbPosition = function(l) {
      l && (l.style.top = Math.max(d().offsetHeight / 2 - l.offsetHeight / 2, 0) + "px", l.style.left = Math.max(d().offsetWidth / 2 - l.offsetWidth / 2, 0) + "px");
    }, a.showCover = function(l) {
      l && (l.style.display = "block", this._setLbPosition(l)), a.config.responsive_lightbox && (document.documentElement.classList.add("dhx_cal_overflow_container"), d().classList.add("dhx_cal_overflow_container")), this.show_cover(), this._cover.style.display = "";
    }, a.showLightbox = function(l) {
      if (l)
        if (this.callEvent("onBeforeLightbox", [l])) {
          this.showCover(c);
          var c = this.getLightbox();
          this._setLbPosition(c), this._fill_lightbox(l, c), this._waiAria.lightboxVisibleAttr(c), this.callEvent("onLightbox", [l]);
        } else
          this._new_event && (this._new_event = null);
    }, a._fill_lightbox = function(l, c) {
      var f = this.getEvent(l), v = c.getElementsByTagName("span"), p = [];
      if (a.templates.lightbox_header) {
        p.push("");
        var h = a.templates.lightbox_header(f.start_date, f.end_date, f);
        p.push(h), v[1].innerHTML = "", v[2].innerHTML = h;
      } else {
        var u = this.templates.event_header(f.start_date, f.end_date, f), m = (this.templates.event_bar_text(f.start_date, f.end_date, f) || "").substr(0, 70);
        p.push(u), p.push(m), v[1].innerHTML = u, v[2].innerHTML = m;
      }
      this._waiAria.lightboxHeader(c, p.join(" "));
      for (var y = this.config.lightbox.sections, w = 0; w < y.length; w++) {
        var D = y[w], E = a._get_lightbox_section_node(D), S = this.form_blocks[D.type], g = f[D.map_to] !== void 0 ? f[D.map_to] : D.default_value;
        S.set_value.call(this, E, g, f, D), y[w].focus && S.focus.call(this, E);
      }
      a._lightbox_id = l;
    }, a._get_lightbox_section_node = function(l) {
      return a._lightbox.querySelector(`#${l.id}`).nextSibling;
    }, a._lightbox_out = function(l) {
      for (var c = this.config.lightbox.sections, f = 0; f < c.length; f++) {
        var v = a._lightbox.querySelector(`#${c[f].id}`);
        v = v && v.nextSibling;
        var p = this.form_blocks[c[f].type].get_value.call(this, v, l, c[f]);
        c[f].map_to != "auto" && (l[c[f].map_to] = p);
      }
      return l;
    }, a._empty_lightbox = function(l) {
      var c = a._lightbox_id, f = this.getEvent(c);
      this._lame_copy(f, l), this.setEvent(f.id, f), this._edit_stop_event(f, !0), this.render_view_data();
    }, a.hide_lightbox = function(l) {
      a.endLightbox(!1, this.getLightbox());
    }, a.hideCover = function(l) {
      l && (l.style.display = "none"), this.hide_cover(), a.config.responsive_lightbox && (document.documentElement.classList.remove("dhx_cal_overflow_container"), d().classList.remove("dhx_cal_overflow_container"));
    }, a.hide_cover = function() {
      this._cover && this._cover.parentNode.removeChild(this._cover), this._cover = null;
    }, a.show_cover = function() {
      this._cover || (this._cover = document.createElement("div"), this._cover.className = "dhx_cal_cover", this._cover.style.display = "none", a.event(this._cover, "mousemove", a._move_while_dnd), a.event(this._cover, "mouseup", a._finish_dnd), d().appendChild(this._cover));
    }, a.save_lightbox = function() {
      var l = this._lightbox_out({}, this._lame_copy(this.getEvent(this._lightbox_id)));
      this.checkEvent("onEventSave") && !this.callEvent("onEventSave", [this._lightbox_id, l, this._new_event]) || (this._empty_lightbox(l), this.hide_lightbox());
    }, a.startLightbox = function(l, c) {
      this._lightbox_id = l, this._custom_lightbox = !0, this._temp_lightbox = this._lightbox, this._lightbox = c, this.showCover(c);
    }, a.endLightbox = function(l, c) {
      c = c || a.getLightbox();
      var f = a.getEvent(this._lightbox_id);
      f && this._edit_stop_event(f, l), l && a.render_view_data(), this.hideCover(c), this._custom_lightbox && (this._lightbox = this._temp_lightbox, this._custom_lightbox = !1), this._temp_lightbox = this._lightbox_id = null, this._waiAria.lightboxHiddenAttr(c), this.resetLightbox(), this.callEvent("onAfterLightbox", []);
    }, a.resetLightbox = function() {
      a._lightbox && !a._custom_lightbox && a._lightbox.parentNode.removeChild(a._lightbox), a._lightbox = null;
    }, a.cancel_lightbox = function() {
      this._lightbox_id && this.callEvent("onEventCancel", [this._lightbox_id, !!this._new_event]), this.hide_lightbox();
    }, a.hideLightbox = a.cancel_lightbox, a._init_lightbox_events = function() {
      if (this.getLightbox().$_eventAttached)
        return;
      const l = this.getLightbox();
      l.$_eventAttached = !0, a.event(l, "click", function(c) {
        c.target.closest(".dhx_cal_ltitle_close_btn") && a.cancel_lightbox();
        const f = a.$domHelpers.closest(c.target, ".dhx_btn_set");
        if (!f) {
          const h = a.$domHelpers.closest(c.target, ".dhx_custom_button[data-section-index]");
          if (h) {
            const u = Number(h.getAttribute("data-section-index"));
            a.form_blocks[a.config.lightbox.sections[u].type].button_click(a.$domHelpers.closest(h, ".dhx_cal_lsection"), h, c);
          }
          return;
        }
        const v = f ? f.getAttribute("data-action") : null;
        switch (v) {
          case "dhx_save_btn":
          case "save":
            if (a.config.readonly_active)
              return;
            a.save_lightbox();
            break;
          case "dhx_delete_btn":
          case "delete":
            if (a.config.readonly_active)
              return;
            var p = a.locale.labels.confirm_deleting;
            a._dhtmlx_confirm({ message: p, title: a.locale.labels.title_confirm_deleting, callback: function() {
              let h = a.getEvent(a._lightbox_id);
              h._thisAndFollowing ? (h._removeFollowing = !0, a.callEvent("onEventSave", [h.id, h, a._new_event])) : a.deleteEvent(a._lightbox_id), a._new_event = null, a.hide_lightbox();
            }, config: { ok: a.locale.labels.icon_delete } });
            break;
          case "dhx_cancel_btn":
          case "cancel":
            a.cancel_lightbox();
            break;
          default:
            a.callEvent("onLightboxButton", [v, f, c]);
        }
      }), a.event(l, "keydown", function(c) {
        var f = c || window.event, v = c.target || c.srcElement, p = v.querySelector("[dhx_button]");
        switch (p || (p = v.parentNode.querySelector(".dhx_custom_button, .dhx_readonly")), (c || f).keyCode) {
          case 32:
            if ((c || f).shiftKey)
              return;
            p && p.click && p.click();
            break;
          case a.keys.edit_save:
            if ((c || f).shiftKey)
              return;
            if (p && p.click)
              p.click();
            else {
              if (a.config.readonly_active)
                return;
              a.save_lightbox();
            }
            break;
          case a.keys.edit_cancel:
            a.cancel_lightbox();
        }
      });
    }, a.setLightboxSize = function() {
    }, a._init_dnd_events = function() {
      a.event(d(), "mousemove", a._move_while_dnd), a.event(d(), "mouseup", a._finish_dnd), a._init_dnd_events = function() {
      };
    }, a._move_while_dnd = function(l) {
      if (a._dnd_start_lb) {
        document.dhx_unselectable || (d().classList.add("dhx_unselectable"), document.dhx_unselectable = !0);
        var c = a.getLightbox(), f = [l.pageX, l.pageY];
        c.style.top = a._lb_start[1] + f[1] - a._dnd_start_lb[1] + "px", c.style.left = a._lb_start[0] + f[0] - a._dnd_start_lb[0] + "px";
      }
    }, a._ready_to_dnd = function(l) {
      var c = a.getLightbox();
      a._lb_start = [c.offsetLeft, c.offsetTop], a._dnd_start_lb = [l.pageX, l.pageY];
    }, a._finish_dnd = function() {
      a._lb_start && (a._lb_start = a._dnd_start_lb = !1, d().classList.remove("dhx_unselectable"), document.dhx_unselectable = !1);
    }, a.getLightbox = function() {
      if (!this._lightbox) {
        var l = document.createElement("div");
        l.className = "dhx_cal_light", a.config.wide_form && (l.className += " dhx_cal_light_wide"), a.form_blocks.recurring && (l.className += " dhx_cal_light_rec"), a.config.rtl && (l.className += " dhx_cal_light_rtl"), a.config.responsive_lightbox && (l.className += " dhx_cal_light_responsive"), l.style.visibility = "hidden";
        var c = this._lightbox_template, f = this.config.buttons_left;
        c += "<div class='dhx_cal_lcontrols'>";
        for (var v = 0; v < f.length; v++)
          c += "<div " + this._waiAria.lightboxButtonAttrString(f[v]) + " data-action='" + f[v] + "' class='dhx_btn_set dhx_" + (a.config.rtl ? "right" : "left") + "_btn_set " + f[v] + "_set'><div class='dhx_btn_inner " + f[v] + "'></div><div>" + a.locale.labels[f[v]] + "</div></div>";
        f = this.config.buttons_right;
        var p = a.config.rtl;
        for (v = 0; v < f.length; v++)
          c += "<div class='dhx_cal_lcontrols_push_right'></div>", c += "<div " + this._waiAria.lightboxButtonAttrString(f[v]) + " data-action='" + f[v] + "' class='dhx_btn_set dhx_" + (p ? "left" : "right") + "_btn_set " + f[v] + "_set'><div class='dhx_btn_inner " + f[v] + "'></div><div>" + a.locale.labels[f[v]] + "</div></div>";
        c += "</div>", c += "</div>", l.innerHTML = c, a.config.drag_lightbox && (a.event(l.firstChild, "mousedown", a._ready_to_dnd), a.event(l.firstChild, "selectstart", function(E) {
          return E.preventDefault(), !1;
        }), l.firstChild.style.cursor = "move", a._init_dnd_events()), this._waiAria.lightboxAttr(l), this.show_cover(), this._cover.insertBefore(l, this._cover.firstChild), this._lightbox = l;
        var h = this.config.lightbox.sections;
        for (c = "", v = 0; v < h.length; v++) {
          var u = this.form_blocks[h[v].type];
          if (u) {
            h[v].id = "area_" + this.uid();
            var m = "";
            h[v].button && (m = "<div " + a._waiAria.lightboxSectionButtonAttrString(this.locale.labels["button_" + h[v].button]) + " class='dhx_custom_button' data-section-index='" + v + "' index='" + v + "'><div class='dhx_custom_button_" + h[v].button + "'></div><div>" + this.locale.labels["button_" + h[v].button] + "</div></div>"), this.config.wide_form && (c += "<div class='dhx_wrap_section'>");
            var y = this.locale.labels["section_" + h[v].name];
            typeof y != "string" && (y = h[v].name), c += "<div id='" + h[v].id + "' class='dhx_cal_lsection dhx_cal_lsection_" + h[v].name + "'>" + m + "<label>" + y + "</label></div>" + u.render.call(this, h[v]), c += "</div>";
          }
        }
        var w = l.getElementsByTagName("div");
        for (v = 0; v < w.length; v++) {
          var D = w[v];
          if (a._getClassName(D) == "dhx_cal_larea") {
            D.innerHTML = c;
            break;
          }
        }
        a._bindLightboxLabels(h), this.setLightboxSize(), this._init_lightbox_events(this), l.style.visibility = "visible";
      }
      return this._lightbox;
    }, a._bindLightboxLabels = function(l) {
      for (var c = 0; c < l.length; c++) {
        var f = l[c];
        if (f.id && a._lightbox.querySelector(`#${f.id}`)) {
          for (var v = a._lightbox.querySelector(`#${f.id}`).querySelector("label"), p = a._get_lightbox_section_node(f); p && !p.querySelector; )
            p = p.nextSibling;
          var h = !0;
          if (p) {
            var u = p.querySelector("input, select, textarea");
            u && (f.inputId = u.id || "input_" + a.uid(), u.id || (u.id = f.inputId), v.setAttribute("for", f.inputId), h = !1);
          }
          h && a.form_blocks[f.type].focus && a.event(v, "click", function(m) {
            return function() {
              var y = a.form_blocks[m.type], w = a._get_lightbox_section_node(m);
              y && y.focus && y.focus.call(a, w);
            };
          }(f));
        }
      }
    }, a.attachEvent("onEventIdChange", function(l, c) {
      this._lightbox_id == l && (this._lightbox_id = c);
    }), a._lightbox_template = `<div class='dhx_cal_ltitle'><div class="dhx_cal_ltitle_descr"><span class='dhx_mark'>&nbsp;</span><span class='dhx_time'></span><span class='dhx_title'></span>
</div>
<div class="dhx_cal_ltitle_controls">
<a class="dhx_cal_ltitle_close_btn scheduler_icon close"></a>
</div></div><div class='dhx_cal_larea'></div>`;
  }(i), Bt(i), function(a) {
    a.getRootView = function() {
      return { view: { render: function() {
        return { tag: "div", type: 1, attrs: { style: "width:100%;height:100%;" }, hooks: { didInsert: function() {
          a.setCurrentView();
        } }, body: [{ el: this.el, type: 1 }] };
      }, init: function() {
        var d = document.createElement("DIV");
        d.id = "scheduler_" + a.uid(), d.style.width = "100%", d.style.height = "100%", d.classList.add("dhx_cal_container"), d.cmp = "grid", d.innerHTML = '<div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" data-tab="day"></div><div class="dhx_cal_tab" data-tab="week"></div><div class="dhx_cal_tab" data-tab="month"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>', a.init(d), this.el = d;
      } }, type: 4 };
    };
  }(i), Jt(i), window.jQuery && (r = window.jQuery, s = 0, n = [], r.fn.dhx_scheduler = function(a) {
    if (typeof a != "string") {
      var d = [];
      return this.each(function() {
        if (this && this.getAttribute)
          if (this.getAttribute("dhxscheduler"))
            d.push(window[this.getAttribute("dhxscheduler")]);
          else {
            var l = "scheduler";
            s && (l = "scheduler" + (s + 1), window[l] = Scheduler.getSchedulerInstance());
            var c = window[l];
            for (var f in this.setAttribute("dhxscheduler", l), a)
              f != "data" && (c.config[f] = a[f]);
            this.getElementsByTagName("div").length || (this.innerHTML = '<div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" name="day_tab" data-tab="day" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" data-tab="week" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" data-tab="month" style="right:76px;"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>', this.className += " dhx_cal_container"), c.init(this, c.config.date, c.config.mode), a.data && c.parse(a.data), d.push(c), s++;
          }
      }), d.length === 1 ? d[0] : d;
    }
    if (n[a])
      return n[a].apply(this, []);
    r.error("Method " + a + " does not exist on jQuery.dhx_scheduler");
  }), function(a) {
    (function() {
      var d = a.setCurrentView, l = a.updateView, c = null, f = null, v = function(u, m) {
        var y = this;
        de.clearTimeout(f), de.clearTimeout(c);
        var w = y._date, D = y._mode;
        h(this, u, m), f = setTimeout(function() {
          a.$destroyed || (y.callEvent("onBeforeViewChange", [D, w, m || y._mode, u || y._date]) ? (l.call(y, u, m), y.callEvent("onViewChange", [y._mode, y._date]), de.clearTimeout(c), f = 0) : h(y, w, D));
        }, a.config.delay_render);
      }, p = function(u, m) {
        var y = this, w = arguments;
        h(this, u, m), de.clearTimeout(c), c = setTimeout(function() {
          a.$destroyed || f || l.apply(y, w);
        }, a.config.delay_render);
      };
      function h(u, m, y) {
        m && (u._date = m), y && (u._mode = y);
      }
      a.attachEvent("onSchedulerReady", function() {
        a.config.delay_render ? (a.setCurrentView = v, a.updateView = p) : (a.setCurrentView = d, a.updateView = l);
      });
    })();
  }(i), function(a) {
    a.createDataProcessor = function(d) {
      var l, c;
      d instanceof Function ? l = d : d.hasOwnProperty("router") ? l = d.router : d.hasOwnProperty("event") && (l = d), c = l ? "CUSTOM" : d.mode || "REST-JSON";
      var f = new He(d.url);
      return f.init(a), f.setTransactionMode({ mode: c, router: l }, d.batchUpdate), f;
    }, a.DataProcessor = He;
  }(i), function(a) {
    a.attachEvent("onSchedulerReady", function() {
      typeof dhtmlxError < "u" && window.dhtmlxError.catchError("LoadXML", function(d, l, c) {
        var f = c[0].responseText;
        switch (a.config.ajax_error) {
          case "alert":
            de.alert(f);
            break;
          case "console":
            de.console.log(f);
        }
      });
    });
  }(i);
  const o = new ua({ en: ra, ar: Gt, be: Xt, ca: Zt, cn: Qt, cs: ea, da: ta, de: aa, el: na, es: ia, fi: oa, fr: sa, he: da, hu: _a, id: la, it: ca, jp: ha, nb: fa, nl: pa, no: va, pl: ma, pt: ga, ro: ya, ru: ba, si: xa, sk: wa, sv: ka, tr: Ea, ua: Da });
  i.i18n = { addLocale: o.addLocale, setLocale: function(a) {
    if (typeof a == "string") {
      var d = o.getLocale(a);
      d || (d = o.getLocale("en")), i.locale = d;
    } else if (a)
      if (i.locale)
        for (var l in a)
          a[l] && typeof a[l] == "object" ? (i.locale[l] || (i.locale[l] = {}), i.mixin(i.locale[l], a[l], !0)) : i.locale[l] = a[l];
      else
        i.locale = a;
    var c = i.locale.labels;
    c.dhx_save_btn = c.icon_save, c.dhx_cancel_btn = c.icon_cancel, c.dhx_delete_btn = c.icon_delete, i.$container && i.get_elements();
  }, getLocale: o.getLocale }, i.i18n.setLocale("en"), i.ext = {}, Ot(i);
  const _ = {};
  return i.plugins = function(a) {
    (function(l, c, f) {
      const v = [];
      for (const p in l)
        if (l[p]) {
          const h = p.toLowerCase();
          c[h] && c[h].forEach(function(u) {
            const m = u.toLowerCase();
            l[m] || v.push(m);
          }), v.push(h);
        }
      return v.sort(function(p, h) {
        const u = f[p] || 0, m = f[h] || 0;
        return u > m ? 1 : u < m ? -1 : 0;
      }), v;
    })(a, { treetimeline: ["timeline"], daytimeline: ["timeline"], outerdrag: ["legacy"] }, { legacy: 1, limit: 1, timeline: 2, daytimeline: 3, treetimeline: 3, outerdrag: 6 }).forEach(function(l) {
      if (!_[l]) {
        const c = e.getExtension(l);
        if (!c)
          throw new Error("unknown plugin " + l);
        c(i), _[l] = !0;
      }
    });
  }, i.plugins({ all_timed: "short" }), i;
}
class Na {
  constructor(i) {
    this._extensions = {};
    for (const t in i)
      this._extensions[t] = i[t];
  }
  addExtension(i, t) {
    this._extensions[i] = t;
  }
  getExtension(i) {
    return this._extensions[i];
  }
}
typeof dhtmlx < "u" && dhtmlx.attaches && (dhtmlx.attaches.attachScheduler = function(e, i, t, r) {
  t = t || '<div class="dhx_cal_tab" name="day_tab" data-tab="day" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" data-tab="week" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" data-tab="month" style="right:76px;"></div>';
  var s = document.createElement("DIV");
  return s.id = "dhxSchedObj_" + this._genStr(12), s.innerHTML = '<div id="' + s.id + '" class="dhx_cal_container" style="width:100%; height:100%;"><div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div>' + t + '</div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div></div>', document.body.appendChild(s.firstChild), this.attachObject(s.id, !1, !0), this.vs[this.av].sched = r, this.vs[this.av].schedId = s.id, r.setSizes = r.updateView, r.destructor = function() {
  }, r.init(s.id, e, i), this.vs[this._viewRestore()].sched;
});
const le = (e, i) => {
  i(!1, `The ${e} extension is not included in this version of dhtmlxScheduler.<br>
		You may need a <a href="https://docs.dhtmlx.com/scheduler/editions_comparison.html" target="_blank">Professional version of the component</a>.<br>
		Contact us at <a href="https://dhtmlx.com/docs/contact.shtml" target="_blank">https://dhtmlx.com/docs/contact.shtml</a> if you have any questions.`);
};
function Ta(e) {
  (function() {
    var i = [];
    function t() {
      return !!i.length;
    }
    function r(_) {
      setTimeout(function() {
        if (e.$destroyed)
          return !0;
        t() || function(a, d) {
          for (; a && a != d; )
            a = a.parentNode;
          return a == d;
        }(document.activeElement, e.$container) || e.focus();
      }, 1);
    }
    function s(_) {
      var a = (_ = _ || window.event).currentTarget;
      a == i[i.length - 1] && e.$keyboardNavigation.trapFocus(a, _);
    }
    if (e.attachEvent("onLightbox", function() {
      var _;
      _ = e.getLightbox(), e.eventRemove(_, "keydown", s), e.event(_, "keydown", s), i.push(_);
    }), e.attachEvent("onAfterLightbox", function() {
      var _ = i.pop();
      _ && e.eventRemove(_, "keydown", s), r();
    }), e.attachEvent("onAfterQuickInfo", function() {
      r();
    }), !e._keyNavMessagePopup) {
      e._keyNavMessagePopup = !0;
      var n = null, o = null;
      const _ = [];
      e.attachEvent("onMessagePopup", function(a) {
        for (n = document.activeElement, o = n; o && e._getClassName(o).indexOf("dhx_cal_data") < 0; )
          o = o.parentNode;
        o && (o = o.parentNode), e.eventRemove(a, "keydown", s), e.event(a, "keydown", s), _.push(a);
      }), e.attachEvent("onAfterMessagePopup", function() {
        var a = _.pop();
        a && e.eventRemove(a, "keydown", s), setTimeout(function() {
          if (e.$destroyed)
            return !0;
          for (var d = document.activeElement; d && e._getClassName(d).indexOf("dhx_cal_light") < 0; )
            d = d.parentNode;
          d || (n && n.parentNode ? n.focus() : o && o.parentNode && o.focus(), n = null, o = null);
        }, 1);
      });
    }
    e.$keyboardNavigation.isModal = t;
  })();
}
function Aa(e) {
  e._temp_key_scope = function() {
    e.config.key_nav = !0, e.$keyboardNavigation._pasteDate = null, e.$keyboardNavigation._pasteSection = null;
    var i = null, t = {};
    function r(o) {
      o = o || window.event, t.x = o.clientX, t.y = o.clientY;
    }
    function s() {
      for (var o, _, a = document.elementFromPoint(t.x, t.y); a && a != e._obj; )
        a = a.parentNode;
      return o = a == e._obj, _ = e.$keyboardNavigation.dispatcher.isEnabled(), o || _;
    }
    function n(o) {
      return e._lame_copy({}, o);
    }
    document.body ? e.event(document.body, "mousemove", r) : e.event(window, "load", function() {
      e.event(document.body, "mousemove", r);
    }), e.attachEvent("onMouseMove", function(o, _) {
      var a = e.getState();
      if (a.mode && a.min_date) {
        var d = e.getActionData(_);
        e.$keyboardNavigation._pasteDate = d.date, e.$keyboardNavigation._pasteSection = d.section;
      }
    }), e._make_pasted_event = function(o) {
      var _ = e.$keyboardNavigation._pasteDate, a = e.$keyboardNavigation._pasteSection, d = o.end_date - o.start_date, l = n(o);
      if (function(f) {
        delete f.rec_type, delete f.rec_pattern, delete f.event_pid, delete f.event_length;
      }(l), l.start_date = new Date(_), l.end_date = new Date(l.start_date.valueOf() + d), a) {
        var c = e._get_section_property();
        e.config.multisection && o[c] && e.isMultisectionEvent && e.isMultisectionEvent(o) ? l[c] = o[c] : l[c] = a;
      }
      return l;
    }, e._do_paste = function(o, _, a) {
      e.callEvent("onBeforeEventPasted", [o, _, a]) !== !1 && (e.addEvent(_), e.callEvent("onEventPasted", [o, _, a]));
    }, e._is_key_nav_active = function() {
      return !(!this._is_initialized() || this._is_lightbox_open() || !this.config.key_nav);
    }, e.event(document, "keydown", function(o) {
      (o.ctrlKey || o.metaKey) && o.keyCode == 86 && e._buffer_event && !e.$keyboardNavigation.dispatcher.isEnabled() && (e.$keyboardNavigation.dispatcher.isActive = s());
    }), e._key_nav_copy_paste = function(o) {
      if (!e._is_key_nav_active())
        return !0;
      if (o.keyCode == 37 || o.keyCode == 39) {
        o.cancelBubble = !0;
        var _ = e.date.add(e._date, o.keyCode == 37 ? -1 : 1, e._mode);
        return e.setCurrentView(_), !0;
      }
      var a, d = (a = e.$keyboardNavigation.dispatcher.getActiveNode()) && a.eventId ? a.eventId : e._select_id;
      if ((o.ctrlKey || o.metaKey) && o.keyCode == 67)
        return d && (e._buffer_event = n(e.getEvent(d)), i = !0, e.callEvent("onEventCopied", [e.getEvent(d)])), !0;
      if ((o.ctrlKey || o.metaKey) && o.keyCode == 88 && d) {
        i = !1;
        var l = e._buffer_event = n(e.getEvent(d));
        e.updateEvent(l.id), e.callEvent("onEventCut", [l]);
      }
      if ((o.ctrlKey || o.metaKey) && o.keyCode == 86 && s()) {
        if (l = (l = e._buffer_event ? e.getEvent(e._buffer_event.id) : e._buffer_event) || e._buffer_event) {
          var c = e._make_pasted_event(l);
          i ? (c.id = e.uid(), e._do_paste(i, c, l)) : e.callEvent("onBeforeEventChanged", [c, o, !1, l]) && (e._do_paste(i, c, l), i = !0);
        }
        return !0;
      }
    };
  }, e._temp_key_scope();
}
function Ca(e) {
  e.$keyboardNavigation.attachSchedulerHandlers = function() {
    var i, t = e.$keyboardNavigation.dispatcher, r = function(a) {
      if (e.config.key_nav)
        return t.keyDownHandler(a);
    }, s = function() {
      t.keepScrollPosition(function() {
        t.focusGlobalNode();
      });
    };
    e.attachEvent("onDataRender", function() {
      e.config.key_nav && t.isEnabled() && !e.getState().editor_id && (clearTimeout(i), i = setTimeout(function() {
        if (e.$destroyed)
          return !0;
        t.isEnabled() || t.enable(), n();
      }));
    });
    var n = function() {
      if (t.isEnabled()) {
        var a = t.getActiveNode();
        a && (a.isValid() || (a = a.fallback()), !a || a instanceof e.$keyboardNavigation.MinicalButton || a instanceof e.$keyboardNavigation.MinicalCell || t.keepScrollPosition(function() {
          a.focus(!0);
        }));
      }
    };
    function o(a) {
      if (!e.config.key_nav)
        return !0;
      const d = e.getView();
      let l = !1;
      if (e.getState().mode === "month")
        l = e.$keyboardNavigation.isChildOf(a.target || a.srcElement, e.$container.querySelector(".dhx_cal_month_table"));
      else if (d && d.layout === "timeline")
        l = e.$keyboardNavigation.isChildOf(a.target || a.srcElement, e.$container.querySelector(".dhx_timeline_data_col"));
      else {
        const v = e.$container.querySelectorAll(".dhx_scale_holder");
        l = Array.from(v).some((p) => p === a.target.parentNode);
      }
      var c, f = e.getActionData(a);
      e._locate_event(a.target || a.srcElement) ? c = new e.$keyboardNavigation.Event(e._locate_event(a.target || a.srcElement)) : l && (c = new e.$keyboardNavigation.TimeSlot(), f.date && l && (c = c.nextSlot(new e.$keyboardNavigation.TimeSlot(f.date, null, f.section)))), c && (t.isEnabled() ? f.date && l && t.delay(function() {
        t.setActiveNode(c);
      }) : t.activeNode = c);
    }
    e.attachEvent("onSchedulerReady", function() {
      var a = e.$container;
      e.eventRemove(document, "keydown", r), e.eventRemove(a, "mousedown", o), e.eventRemove(a, "focus", s), e.config.key_nav ? (e.event(document, "keydown", r), e.event(a, "mousedown", o), e.event(a, "focus", s), a.setAttribute("tabindex", "0")) : a.removeAttribute("tabindex");
    });
    var _ = e.updateEvent;
    e.updateEvent = function(a) {
      var d = _.apply(this, arguments);
      if (e.config.key_nav && t.isEnabled() && e.getState().select_id == a) {
        var l = new e.$keyboardNavigation.Event(a);
        e.getState().lightbox_id || function(c) {
          if (e.config.key_nav && t.isEnabled()) {
            var f = c, v = new e.$keyboardNavigation.Event(f.eventId);
            if (!v.isValid()) {
              var p = v.start || f.start, h = v.end || f.end, u = v.section || f.section;
              (v = new e.$keyboardNavigation.TimeSlot(p, h, u)).isValid() || (v = new e.$keyboardNavigation.TimeSlot());
            }
            t.setActiveNode(v);
            var m = t.getActiveNode();
            m && m.getNode && document.activeElement != m.getNode() && t.focusNode(t.getActiveNode());
          }
        }(l);
      }
      return d;
    }, e.attachEvent("onEventDeleted", function(a) {
      return e.config.key_nav && t.isEnabled() && t.getActiveNode().eventId == a && t.setActiveNode(new e.$keyboardNavigation.TimeSlot()), !0;
    }), e.attachEvent("onClearAll", function() {
      if (!e.config.key_nav)
        return !0;
      t.isEnabled() && t.getActiveNode() instanceof e.$keyboardNavigation.Event && t.setActiveNode(new e.$keyboardNavigation.TimeSlot());
    });
  };
}
class Oa {
  constructor(i) {
    this.map = null, this._markers = [], this.scheduler = i;
  }
  onEventClick(i) {
    if (this._markers && this._markers.length > 0) {
      for (let t = 0; t < this._markers.length; t++)
        if (i.id == this._markers[t].event.id) {
          let r = this.settings.zoom_after_resolve || this.settings.initial_zoom;
          i.lat && i.lng ? (this.map.setCenter({ lat: i.lat, lng: i.lng }), this.map.setZoom(r)) : (this.map.setCenter({ lat: this.settings.error_position.lat, lng: this.settings.error_position.lng }), this.map.setZoom(r)), google.maps.event.trigger(this._markers[t].marker, "click");
        }
    }
  }
  initialize(i, t) {
    this.settings = t;
    let r = this.scheduler, s = { center: { lat: t.initial_position.lat, lng: t.initial_position.lng }, zoom: t.initial_zoom, mapId: i.id, scrollwheel: !0, mapTypeId: t.type };
    if (this.map === null)
      this.map = new google.maps.Map(i, s);
    else {
      let n = this.map;
      i.appendChild(this.map.__gm.messageOverlay), i.appendChild(this.map.__gm.outerContainer), setTimeout(function() {
        n.setOptions({ container: i.id });
      }, 500);
    }
    google.maps.event.addListener(this.map, "dblclick", function(n) {
      const o = new google.maps.Geocoder();
      if (!r.config.readonly && r.config.dblclick_create) {
        let _ = n.latLng;
        o.geocode({ latLng: _ }, function(a, d) {
          d == google.maps.GeocoderStatus.OK ? (_ = a[0].geometry.location, r.addEventNow({ lat: _.lat(), lng: _.lng(), event_location: a[0].formatted_address, start_date: r.getState().date, end_date: r.date.add(r.getState().date, r.config.time_step, "minute") })) : console.error("Geocode was not successful for the following reason: " + d);
        });
      }
    });
  }
  destroy(i) {
    for (google.maps.event.clearInstanceListeners(window), google.maps.event.clearInstanceListeners(document), google.maps.event.clearInstanceListeners(i); i.firstChild; )
      i.firstChild.remove();
    i.innerHTML = "";
  }
  async addEventMarker(i) {
    let t = { title: i.text, position: {}, map: {} };
    i.lat && i.lng ? t.position = { lat: i.lat, lng: i.lng } : t.position = { lat: this.settings.error_position.lat, lng: this.settings.error_position.lng };
    const { AdvancedMarkerElement: r } = await google.maps.importLibrary("marker");
    let s;
    this.scheduler.ext.mapView.createMarker ? (t.map = this.map, s = this.scheduler.ext.mapView.createMarker(t)) : (s = new r(t), s.map = this.map), s.setMap(this.map), i["!nativeeditor_status"] == "true_deleted" && s.setMap(null), google.maps.event.addListener(s, "click", () => {
      this.infoWindow && this.infoWindow.close(), this.infoWindow = new google.maps.InfoWindow({ maxWidth: this.settings.info_window_max_width }), this.infoWindow.setContent(this.scheduler.templates.map_info_content(i)), this.infoWindow.open({ anchor: s, map: this.map });
    });
    let n = { event: i, ...t, marker: s };
    this._markers.push(n);
  }
  removeEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      i == this._markers[t].event.id && (this._markers[t].marker.setVisible(!1), this._markers[t].marker.setMap(null), this._markers[t].marker.setPosition(null), this._markers[t].marker = null, this._markers.splice(t, 1), t--);
  }
  updateEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      if (this._markers[t].event.id == i.id) {
        this._markers[t].event = i, this._markers[t].position.lat = i.lat, this._markers[t].position.lng = i.lng, this._markers[t].text = i.text;
        let r = new google.maps.LatLng(i.lat, i.lng);
        this._markers[t].marker.setPosition(r);
      }
  }
  clearEventMarkers() {
    if (this._markers.length > 0) {
      for (let i = 0; i < this._markers.length; i++)
        this._markers[i].marker.setMap(null);
      this._markers = [];
    }
  }
  setView(i, t, r) {
    this.map.setCenter({ lat: i, lng: t }), this.map.setZoom(r);
  }
  async resolveAddress(i) {
    const t = new google.maps.Geocoder();
    return await new Promise((r) => {
      t.geocode({ address: i }, function(s, n) {
        n == google.maps.GeocoderStatus.OK ? r({ lat: s[0].geometry.location.lat(), lng: s[0].geometry.location.lng() }) : (console.error("Geocode was not successful for the following reason: " + n), r({}));
      });
    });
  }
}
class La {
  constructor(i) {
    this.map = null, this._markers = [], this.scheduler = i;
  }
  onEventClick(i) {
    if (this._markers && this._markers.length > 0)
      for (let t = 0; t < this._markers.length; t++)
        i.id == this._markers[t].event.id && (this._markers[t].marker.openPopup(), this._markers[t].marker.closeTooltip(), i.lat && i.lng ? this.setView(i.lat, i.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom) : this.setView(this.settings.error_position.lat, this.settings.error_position.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom));
  }
  initialize(i, t) {
    let r = this.scheduler, s = document.createElement("div");
    s.className = "mapWrapper", s.id = "mapWrapper", s.style.width = i.style.width, s.style.height = i.style.height, i.appendChild(s);
    let n = L.map(s, { center: L.latLng(t.initial_position.lat, t.initial_position.lng), zoom: t.initial_zoom, keyboard: !1 });
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(n), n.on("dblclick", async function(o) {
      let _ = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${o.latlng.lat}&lon=${o.latlng.lng}&format=json`, { method: "GET", headers: { "Accept-Language": "en" } }).then((a) => a.json());
      if (_.address) {
        let a = _.address.country;
        r.addEventNow({ lat: o.latlng.lat, lng: o.latlng.lng, event_location: a, start_date: r.getState().date, end_date: r.date.add(r.getState().date, r.config.time_step, "minute") });
      } else
        console.error("unable recieve a position of the event", _.error);
    }), this.map = n, this.settings = t;
  }
  destroy(i) {
    for (this.map.remove(); i.firstChild; )
      i.firstChild.remove();
    i.innerHTML = "";
  }
  addEventMarker(i) {
    const t = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png", iconSize: [25, 41], shadowSize: [30, 65], iconAnchor: [12, 41], shadowAnchor: [7, 65] });
    let r = { minWidth: 180, maxWidth: this.settings.info_window_max_width };
    const s = L.popup(r).setContent(this.scheduler.templates.map_info_content(i)), n = L.tooltip().setContent(i.text);
    let o = [i.lat, i.lng];
    i.lat && i.lng || (o = [this.settings.error_position.lat, this.settings.error_position.lng]);
    const _ = { event: i, marker: L.marker(o, { icon: t }).bindPopup(s).bindTooltip(n).addTo(this.map) };
    this._markers.push(_);
  }
  removeEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      i == this._markers[t].event.id && (this.map.removeLayer(this._markers[t].marker), this._markers.splice(t, 1), t--);
  }
  updateEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      this._markers[t].event.id == i.id && (this._markers[t].event = i, i.lat && i.lng ? this._markers[t].marker.setLatLng([i.lat, i.lng]) : this._markers[t].marker.setLatLng([this.settings.error_position.lat, this.settings.error_position.lng]));
  }
  clearEventMarkers() {
    if (this._markers) {
      for (let i = 0; i < this._markers.length; i++)
        this.map.removeLayer(this._markers[i].marker);
      this._markers = [];
    }
  }
  setView(i, t, r) {
    this.map.setView([i, t], r);
  }
  async resolveAddress(i) {
    let t = {}, r = await fetch(`https://nominatim.openstreetmap.org/search?q=${i}&format=json`, { method: "GET", headers: { "Accept-Language": "en" } }).then((s) => s.json());
    return r && r.length ? (t.lat = +r[0].lat, t.lng = +r[0].lon) : console.error(`Unable recieve a position of the event's location: ${i}`), t;
  }
}
class $a {
  constructor(i) {
    this.map = null, this._markers = [], this.scheduler = i;
  }
  onEventClick(i) {
    if (this._markers && this._markers.length > 0)
      for (let t = 0; t < this._markers.length; t++) {
        const r = this._markers[t].marker.getPopup();
        r.isOpen() && r.remove(), i.id == this._markers[t].event.id && (this._markers[t].marker.togglePopup(), i.lat && i.lng ? this.setView(i.lat, i.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom) : this.setView(this.settings.error_position.lat, this.settings.error_position.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom));
      }
  }
  initialize(i, t) {
    let r = this.scheduler;
    mapboxgl.accessToken = t.accessToken;
    const s = new mapboxgl.Map({ container: i, center: [t.initial_position.lng, t.initial_position.lat], zoom: t.initial_zoom + 1 });
    s.on("dblclick", async function(n) {
      let o = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${n.lngLat.lng},${n.lngLat.lat}.json?access_token=${t.accessToken}`).then((_) => _.json());
      if (o.features) {
        let _ = o.features[0].place_name;
        r.addEventNow({ lat: n.lngLat.lat, lng: n.lngLat.lng, event_location: _, start_date: r.getState().date, end_date: r.date.add(r.getState().date, r.config.time_step, "minute") });
      } else
        console.error("unable recieve a position of the event");
    }), this.map = s, this.settings = t;
  }
  destroy(i) {
    for (this.map.remove(); i.firstChild; )
      i.firstChild.remove();
    i.innerHTML = "";
  }
  addEventMarker(i) {
    let t = [i.lng, i.lat];
    i.lat && i.lng || (t = [this.settings.error_position.lng, this.settings.error_position.lat]);
    const r = new mapboxgl.Popup({ offset: 25, focusAfterOpen: !1 }).setMaxWidth(`${this.settings.info_window_max_width}px`).setHTML(this.scheduler.templates.map_info_content(i)), s = { event: i, marker: new mapboxgl.Marker().setLngLat(t).setPopup(r).addTo(this.map) };
    this._markers.push(s);
  }
  removeEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      i == this._markers[t].event.id && (this._markers[t].marker.remove(), this._markers.splice(t, 1), t--);
  }
  updateEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      this._markers[t].event.id == i.id && (this._markers[t].event = i, i.lat && i.lng ? this._markers[t].marker.setLngLat([i.lng, i.lat]) : this._markers[t].marker.setLngLat([this.settings.error_position.lng, this.settings.error_position.lat]));
  }
  clearEventMarkers() {
    for (let i = 0; i < this._markers.length; i++)
      this._markers[i].marker.remove();
    this._markers = [];
  }
  setView(i, t, r) {
    this.map.setCenter([t, i]), this.map.setZoom(r);
  }
  async resolveAddress(i) {
    let t = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${i}.json?access_token=${this.settings.accessToken}`).then((s) => s.json()), r = {};
    return t && t.features.length ? (r.lng = t.features[0].center[0], r.lat = t.features[0].center[1]) : console.error(`Unable recieve a position of the event's location: ${i}`), r;
  }
}
var ze = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"], X = function() {
  function e(i, t) {
    if (t === 0)
      throw new Error("Can't create weekday with n == 0");
    this.weekday = i, this.n = t;
  }
  return e.fromStr = function(i) {
    return new e(ze.indexOf(i));
  }, e.prototype.nth = function(i) {
    return this.n === i ? this : new e(this.weekday, i);
  }, e.prototype.equals = function(i) {
    return this.weekday === i.weekday && this.n === i.n;
  }, e.prototype.toString = function() {
    var i = ze[this.weekday];
    return this.n && (i = (this.n > 0 ? "+" : "") + String(this.n) + i), i;
  }, e.prototype.getJsWeekday = function() {
    return this.weekday === 6 ? 0 : this.weekday + 1;
  }, e;
}(), B = function(e) {
  return e != null;
}, ne = function(e) {
  return typeof e == "number";
}, Xe = function(e) {
  return typeof e == "string" && ze.includes(e);
}, Z = Array.isArray, ie = function(e, i) {
  i === void 0 && (i = e), arguments.length === 1 && (i = e, e = 0);
  for (var t = [], r = e; r < i; r++)
    t.push(r);
  return t;
}, P = function(e, i) {
  var t = 0, r = [];
  if (Z(e))
    for (; t < i; t++)
      r[t] = [].concat(e);
  else
    for (; t < i; t++)
      r[t] = e;
  return r;
};
function ve(e, i, t) {
  t === void 0 && (t = " ");
  var r = String(e);
  return i |= 0, r.length > i ? String(r) : ((i -= r.length) > t.length && (t += P(t, i / t.length)), t.slice(0, i) + String(r));
}
var ee = function(e, i) {
  var t = e % i;
  return t * i < 0 ? t + i : t;
}, Ce = function(e, i) {
  return { div: Math.floor(e / i), mod: ee(e, i) };
}, re = function(e) {
  return !B(e) || e.length === 0;
}, J = function(e) {
  return !re(e);
}, F = function(e, i) {
  return J(e) && e.indexOf(i) !== -1;
}, pe = function(e, i, t, r, s, n) {
  return r === void 0 && (r = 0), s === void 0 && (s = 0), n === void 0 && (n = 0), new Date(Date.UTC(e, i - 1, t, r, s, n));
}, Ha = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], gt = 864e5, yt = pe(1970, 1, 1), za = [6, 0, 1, 2, 3, 4, 5], be = function(e) {
  return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}, bt = function(e) {
  return e instanceof Date;
}, xe = function(e) {
  return bt(e) && !isNaN(e.getTime());
}, qe = function(e) {
  return i = yt, t = e.getTime() - i.getTime(), Math.round(t / gt);
  var i, t;
}, xt = function(e) {
  return new Date(yt.getTime() + e * gt);
}, qa = function(e) {
  var i = e.getUTCMonth();
  return i === 1 && be(e.getUTCFullYear()) ? 29 : Ha[i];
}, ye = function(e) {
  return za[e.getUTCDay()];
}, Ze = function(e, i) {
  var t = pe(e, i + 1, 1);
  return [ye(t), qa(t)];
}, wt = function(e, i) {
  return i = i || e, new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), i.getHours(), i.getMinutes(), i.getSeconds(), i.getMilliseconds()));
}, je = function(e) {
  return new Date(e.getTime());
}, Qe = function(e) {
  for (var i = [], t = 0; t < e.length; t++)
    i.push(je(e[t]));
  return i;
}, ke = function(e) {
  e.sort(function(i, t) {
    return i.getTime() - t.getTime();
  });
}, Fe = function(e, i) {
  i === void 0 && (i = !0);
  var t = new Date(e);
  return [ve(t.getUTCFullYear().toString(), 4, "0"), ve(t.getUTCMonth() + 1, 2, "0"), ve(t.getUTCDate(), 2, "0"), "T", ve(t.getUTCHours(), 2, "0"), ve(t.getUTCMinutes(), 2, "0"), ve(t.getUTCSeconds(), 2, "0"), i ? "Z" : ""].join("");
}, Be = function(e) {
  var i = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/.exec(e);
  if (!i)
    throw new Error("Invalid UNTIL value: ".concat(e));
  return new Date(Date.UTC(parseInt(i[1], 10), parseInt(i[2], 10) - 1, parseInt(i[3], 10), parseInt(i[5], 10) || 0, parseInt(i[6], 10) || 0, parseInt(i[7], 10) || 0));
}, et = function(e, i) {
  return e.toLocaleString("sv-SE", { timeZone: i }).replace(" ", "T") + "Z";
}, ge = function() {
  function e(i, t) {
    this.minDate = null, this.maxDate = null, this._result = [], this.total = 0, this.method = i, this.args = t, i === "between" ? (this.maxDate = t.inc ? t.before : new Date(t.before.getTime() - 1), this.minDate = t.inc ? t.after : new Date(t.after.getTime() + 1)) : i === "before" ? this.maxDate = t.inc ? t.dt : new Date(t.dt.getTime() - 1) : i === "after" && (this.minDate = t.inc ? t.dt : new Date(t.dt.getTime() + 1));
  }
  return e.prototype.accept = function(i) {
    ++this.total;
    var t = this.minDate && i < this.minDate, r = this.maxDate && i > this.maxDate;
    if (this.method === "between") {
      if (t)
        return !0;
      if (r)
        return !1;
    } else if (this.method === "before") {
      if (r)
        return !1;
    } else if (this.method === "after")
      return !!t || (this.add(i), !1);
    return this.add(i);
  }, e.prototype.add = function(i) {
    return this._result.push(i), !0;
  }, e.prototype.getValue = function() {
    var i = this._result;
    switch (this.method) {
      case "all":
      case "between":
        return i;
      default:
        return i.length ? i[i.length - 1] : null;
    }
  }, e.prototype.clone = function() {
    return new e(this.method, this.args);
  }, e;
}(), Re = function(e, i) {
  return Re = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, r) {
    t.__proto__ = r;
  } || function(t, r) {
    for (var s in r)
      Object.prototype.hasOwnProperty.call(r, s) && (t[s] = r[s]);
  }, Re(e, i);
};
function Je(e, i) {
  if (typeof i != "function" && i !== null)
    throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
  function t() {
    this.constructor = e;
  }
  Re(e, i), e.prototype = i === null ? Object.create(i) : (t.prototype = i.prototype, new t());
}
var Q = function() {
  return Q = Object.assign || function(e) {
    for (var i, t = 1, r = arguments.length; t < r; t++)
      for (var s in i = arguments[t])
        Object.prototype.hasOwnProperty.call(i, s) && (e[s] = i[s]);
    return e;
  }, Q.apply(this, arguments);
};
function q(e, i, t) {
  if (t || arguments.length === 2)
    for (var r, s = 0, n = i.length; s < n; s++)
      !r && s in i || (r || (r = Array.prototype.slice.call(i, 0, s)), r[s] = i[s]);
  return e.concat(r || Array.prototype.slice.call(i));
}
var U, tt = function(e) {
  function i(t, r, s) {
    var n = e.call(this, t, r) || this;
    return n.iterator = s, n;
  }
  return Je(i, e), i.prototype.add = function(t) {
    return !!this.iterator(t, this._result.length) && (this._result.push(t), !0);
  }, i;
}(ge), Ee = { dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], tokens: { SKIP: /^[ \r\n\t]+|^\.$/, number: /^[1-9][0-9]*/, numberAsText: /^(one|two|three)/i, every: /^every/i, "day(s)": /^days?/i, "weekday(s)": /^weekdays?/i, "week(s)": /^weeks?/i, "hour(s)": /^hours?/i, "minute(s)": /^minutes?/i, "month(s)": /^months?/i, "year(s)": /^years?/i, on: /^(on|in)/i, at: /^(at)/i, the: /^the/i, first: /^first/i, second: /^second/i, third: /^third/i, nth: /^([1-9][0-9]*)(\.|th|nd|rd|st)/i, last: /^last/i, for: /^for/i, "time(s)": /^times?/i, until: /^(un)?til/i, monday: /^mo(n(day)?)?/i, tuesday: /^tu(e(s(day)?)?)?/i, wednesday: /^we(d(n(esday)?)?)?/i, thursday: /^th(u(r(sday)?)?)?/i, friday: /^fr(i(day)?)?/i, saturday: /^sa(t(urday)?)?/i, sunday: /^su(n(day)?)?/i, january: /^jan(uary)?/i, february: /^feb(ruary)?/i, march: /^mar(ch)?/i, april: /^apr(il)?/i, may: /^may/i, june: /^june?/i, july: /^july?/i, august: /^aug(ust)?/i, september: /^sep(t(ember)?)?/i, october: /^oct(ober)?/i, november: /^nov(ember)?/i, december: /^dec(ember)?/i, comma: /^(,\s*|(and|or)\s*)+/i } }, at = function(e, i) {
  return e.indexOf(i) !== -1;
}, ja = function(e) {
  return e.toString();
}, Ra = function(e, i, t) {
  return "".concat(i, " ").concat(t, ", ").concat(e);
}, se = function() {
  function e(i, t, r, s) {
    if (t === void 0 && (t = ja), r === void 0 && (r = Ee), s === void 0 && (s = Ra), this.text = [], this.language = r || Ee, this.gettext = t, this.dateFormatter = s, this.rrule = i, this.options = i.options, this.origOptions = i.origOptions, this.origOptions.bymonthday) {
      var n = [].concat(this.options.bymonthday), o = [].concat(this.options.bynmonthday);
      n.sort(function(l, c) {
        return l - c;
      }), o.sort(function(l, c) {
        return c - l;
      }), this.bymonthday = n.concat(o), this.bymonthday.length || (this.bymonthday = null);
    }
    if (B(this.origOptions.byweekday)) {
      var _ = Z(this.origOptions.byweekday) ? this.origOptions.byweekday : [this.origOptions.byweekday], a = String(_);
      this.byweekday = { allWeeks: _.filter(function(l) {
        return !l.n;
      }), someWeeks: _.filter(function(l) {
        return !!l.n;
      }), isWeekdays: a.indexOf("MO") !== -1 && a.indexOf("TU") !== -1 && a.indexOf("WE") !== -1 && a.indexOf("TH") !== -1 && a.indexOf("FR") !== -1 && a.indexOf("SA") === -1 && a.indexOf("SU") === -1, isEveryDay: a.indexOf("MO") !== -1 && a.indexOf("TU") !== -1 && a.indexOf("WE") !== -1 && a.indexOf("TH") !== -1 && a.indexOf("FR") !== -1 && a.indexOf("SA") !== -1 && a.indexOf("SU") !== -1 };
      var d = function(l, c) {
        return l.weekday - c.weekday;
      };
      this.byweekday.allWeeks.sort(d), this.byweekday.someWeeks.sort(d), this.byweekday.allWeeks.length || (this.byweekday.allWeeks = null), this.byweekday.someWeeks.length || (this.byweekday.someWeeks = null);
    } else
      this.byweekday = null;
  }
  return e.isFullyConvertible = function(i) {
    if (!(i.options.freq in e.IMPLEMENTED) || i.origOptions.until && i.origOptions.count)
      return !1;
    for (var t in i.origOptions) {
      if (at(["dtstart", "tzid", "wkst", "freq"], t))
        return !0;
      if (!at(e.IMPLEMENTED[i.options.freq], t))
        return !1;
    }
    return !0;
  }, e.prototype.isFullyConvertible = function() {
    return e.isFullyConvertible(this.rrule);
  }, e.prototype.toString = function() {
    var i = this.gettext;
    if (!(this.options.freq in e.IMPLEMENTED))
      return i("RRule error: Unable to fully convert this rrule to text");
    if (this.text = [i("every")], this[H.FREQUENCIES[this.options.freq]](), this.options.until) {
      this.add(i("until"));
      var t = this.options.until;
      this.add(this.dateFormatter(t.getUTCFullYear(), this.language.monthNames[t.getUTCMonth()], t.getUTCDate()));
    } else
      this.options.count && this.add(i("for")).add(this.options.count.toString()).add(this.plural(this.options.count) ? i("times") : i("time"));
    return this.isFullyConvertible() || this.add(i("(~ approximate)")), this.text.join("");
  }, e.prototype.HOURLY = function() {
    var i = this.gettext;
    this.options.interval !== 1 && this.add(this.options.interval.toString()), this.add(this.plural(this.options.interval) ? i("hours") : i("hour"));
  }, e.prototype.MINUTELY = function() {
    var i = this.gettext;
    this.options.interval !== 1 && this.add(this.options.interval.toString()), this.add(this.plural(this.options.interval) ? i("minutes") : i("minute"));
  }, e.prototype.DAILY = function() {
    var i = this.gettext;
    this.options.interval !== 1 && this.add(this.options.interval.toString()), this.byweekday && this.byweekday.isWeekdays ? this.add(this.plural(this.options.interval) ? i("weekdays") : i("weekday")) : this.add(this.plural(this.options.interval) ? i("days") : i("day")), this.origOptions.bymonth && (this.add(i("in")), this._bymonth()), this.bymonthday ? this._bymonthday() : this.byweekday ? this._byweekday() : this.origOptions.byhour && this._byhour();
  }, e.prototype.WEEKLY = function() {
    var i = this.gettext;
    this.options.interval !== 1 && this.add(this.options.interval.toString()).add(this.plural(this.options.interval) ? i("weeks") : i("week")), this.byweekday && this.byweekday.isWeekdays ? this.options.interval === 1 ? this.add(this.plural(this.options.interval) ? i("weekdays") : i("weekday")) : this.add(i("on")).add(i("weekdays")) : this.byweekday && this.byweekday.isEveryDay ? this.add(this.plural(this.options.interval) ? i("days") : i("day")) : (this.options.interval === 1 && this.add(i("week")), this.origOptions.bymonth && (this.add(i("in")), this._bymonth()), this.bymonthday ? this._bymonthday() : this.byweekday && this._byweekday(), this.origOptions.byhour && this._byhour());
  }, e.prototype.MONTHLY = function() {
    var i = this.gettext;
    this.origOptions.bymonth ? (this.options.interval !== 1 && (this.add(this.options.interval.toString()).add(i("months")), this.plural(this.options.interval) && this.add(i("in"))), this._bymonth()) : (this.options.interval !== 1 && this.add(this.options.interval.toString()), this.add(this.plural(this.options.interval) ? i("months") : i("month"))), this.bymonthday ? this._bymonthday() : this.byweekday && this.byweekday.isWeekdays ? this.add(i("on")).add(i("weekdays")) : this.byweekday && this._byweekday();
  }, e.prototype.YEARLY = function() {
    var i = this.gettext;
    this.origOptions.bymonth ? (this.options.interval !== 1 && (this.add(this.options.interval.toString()), this.add(i("years"))), this._bymonth()) : (this.options.interval !== 1 && this.add(this.options.interval.toString()), this.add(this.plural(this.options.interval) ? i("years") : i("year"))), this.bymonthday ? this._bymonthday() : this.byweekday && this._byweekday(), this.options.byyearday && this.add(i("on the")).add(this.list(this.options.byyearday, this.nth, i("and"))).add(i("day")), this.options.byweekno && this.add(i("in")).add(this.plural(this.options.byweekno.length) ? i("weeks") : i("week")).add(this.list(this.options.byweekno, void 0, i("and")));
  }, e.prototype._bymonthday = function() {
    var i = this.gettext;
    this.byweekday && this.byweekday.allWeeks ? this.add(i("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext, i("or"))).add(i("the")).add(this.list(this.bymonthday, this.nth, i("or"))) : this.add(i("on the")).add(this.list(this.bymonthday, this.nth, i("and")));
  }, e.prototype._byweekday = function() {
    var i = this.gettext;
    this.byweekday.allWeeks && !this.byweekday.isWeekdays && this.add(i("on")).add(this.list(this.byweekday.allWeeks, this.weekdaytext)), this.byweekday.someWeeks && (this.byweekday.allWeeks && this.add(i("and")), this.add(i("on the")).add(this.list(this.byweekday.someWeeks, this.weekdaytext, i("and"))));
  }, e.prototype._byhour = function() {
    var i = this.gettext;
    this.add(i("at")).add(this.list(this.origOptions.byhour, void 0, i("and")));
  }, e.prototype._bymonth = function() {
    this.add(this.list(this.options.bymonth, this.monthtext, this.gettext("and")));
  }, e.prototype.nth = function(i) {
    var t;
    i = parseInt(i.toString(), 10);
    var r = this.gettext;
    if (i === -1)
      return r("last");
    var s = Math.abs(i);
    switch (s) {
      case 1:
      case 21:
      case 31:
        t = s + r("st");
        break;
      case 2:
      case 22:
        t = s + r("nd");
        break;
      case 3:
      case 23:
        t = s + r("rd");
        break;
      default:
        t = s + r("th");
    }
    return i < 0 ? t + " " + r("last") : t;
  }, e.prototype.monthtext = function(i) {
    return this.language.monthNames[i - 1];
  }, e.prototype.weekdaytext = function(i) {
    var t = ne(i) ? (i + 1) % 7 : i.getJsWeekday();
    return (i.n ? this.nth(i.n) + " " : "") + this.language.dayNames[t];
  }, e.prototype.plural = function(i) {
    return i % 100 != 1;
  }, e.prototype.add = function(i) {
    return this.text.push(" "), this.text.push(i), this;
  }, e.prototype.list = function(i, t, r, s) {
    var n = this;
    s === void 0 && (s = ","), Z(i) || (i = [i]), t = t || function(_) {
      return _.toString();
    };
    var o = function(_) {
      return t && t.call(n, _);
    };
    return r ? function(_, a, d) {
      for (var l = "", c = 0; c < _.length; c++)
        c !== 0 && (c === _.length - 1 ? l += " " + d + " " : l += a + " "), l += _[c];
      return l;
    }(i.map(o), s, r) : i.map(o).join(s + " ");
  }, e;
}(), Ia = function() {
  function e(i) {
    this.done = !0, this.rules = i;
  }
  return e.prototype.start = function(i) {
    return this.text = i, this.done = !1, this.nextSymbol();
  }, e.prototype.isDone = function() {
    return this.done && this.symbol === null;
  }, e.prototype.nextSymbol = function() {
    var i, t;
    this.symbol = null, this.value = null;
    do {
      if (this.done)
        return !1;
      for (var r in i = null, this.rules) {
        var s = this.rules[r].exec(this.text);
        s && (i === null || s[0].length > i[0].length) && (i = s, t = r);
      }
      if (i != null && (this.text = this.text.substr(i[0].length), this.text === "" && (this.done = !0)), i == null)
        return this.done = !0, this.symbol = null, void (this.value = null);
    } while (t === "SKIP");
    return this.symbol = t, this.value = i, !0;
  }, e.prototype.accept = function(i) {
    if (this.symbol === i) {
      if (this.value) {
        var t = this.value;
        return this.nextSymbol(), t;
      }
      return this.nextSymbol(), !0;
    }
    return !1;
  }, e.prototype.acceptNumber = function() {
    return this.accept("number");
  }, e.prototype.expect = function(i) {
    if (this.accept(i))
      return !0;
    throw new Error("expected " + i + " but found " + this.symbol);
  }, e;
}();
function kt(e, i) {
  i === void 0 && (i = Ee);
  var t = {}, r = new Ia(i.tokens);
  return r.start(e) ? (function() {
    r.expect("every");
    var l = r.acceptNumber();
    if (l && (t.interval = parseInt(l[0], 10)), r.isDone())
      throw new Error("Unexpected end");
    switch (r.symbol) {
      case "day(s)":
        t.freq = H.DAILY, r.nextSymbol() && (n(), d());
        break;
      case "weekday(s)":
        t.freq = H.WEEKLY, t.byweekday = [H.MO, H.TU, H.WE, H.TH, H.FR], r.nextSymbol(), n(), d();
        break;
      case "week(s)":
        t.freq = H.WEEKLY, r.nextSymbol() && (s(), n(), d());
        break;
      case "hour(s)":
        t.freq = H.HOURLY, r.nextSymbol() && (s(), d());
        break;
      case "minute(s)":
        t.freq = H.MINUTELY, r.nextSymbol() && (s(), d());
        break;
      case "month(s)":
        t.freq = H.MONTHLY, r.nextSymbol() && (s(), d());
        break;
      case "year(s)":
        t.freq = H.YEARLY, r.nextSymbol() && (s(), d());
        break;
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        t.freq = H.WEEKLY;
        var c = r.symbol.substr(0, 2).toUpperCase();
        if (t.byweekday = [H[c]], !r.nextSymbol())
          return;
        for (; r.accept("comma"); ) {
          if (r.isDone())
            throw new Error("Unexpected end");
          var f = _();
          if (!f)
            throw new Error("Unexpected symbol " + r.symbol + ", expected weekday");
          t.byweekday.push(H[f]), r.nextSymbol();
        }
        n(), function() {
          r.accept("on"), r.accept("the");
          var p = a();
          if (p)
            for (t.bymonthday = [p], r.nextSymbol(); r.accept("comma"); ) {
              if (!(p = a()))
                throw new Error("Unexpected symbol " + r.symbol + "; expected monthday");
              t.bymonthday.push(p), r.nextSymbol();
            }
        }(), d();
        break;
      case "january":
      case "february":
      case "march":
      case "april":
      case "may":
      case "june":
      case "july":
      case "august":
      case "september":
      case "october":
      case "november":
      case "december":
        if (t.freq = H.YEARLY, t.bymonth = [o()], !r.nextSymbol())
          return;
        for (; r.accept("comma"); ) {
          if (r.isDone())
            throw new Error("Unexpected end");
          var v = o();
          if (!v)
            throw new Error("Unexpected symbol " + r.symbol + ", expected month");
          t.bymonth.push(v), r.nextSymbol();
        }
        s(), d();
        break;
      default:
        throw new Error("Unknown symbol");
    }
  }(), t) : null;
  function s() {
    var l = r.accept("on"), c = r.accept("the");
    if (l || c)
      do {
        var f = a(), v = _(), p = o();
        if (f)
          v ? (r.nextSymbol(), t.byweekday || (t.byweekday = []), t.byweekday.push(H[v].nth(f))) : (t.bymonthday || (t.bymonthday = []), t.bymonthday.push(f), r.accept("day(s)"));
        else if (v)
          r.nextSymbol(), t.byweekday || (t.byweekday = []), t.byweekday.push(H[v]);
        else if (r.symbol === "weekday(s)")
          r.nextSymbol(), t.byweekday || (t.byweekday = [H.MO, H.TU, H.WE, H.TH, H.FR]);
        else if (r.symbol === "week(s)") {
          r.nextSymbol();
          var h = r.acceptNumber();
          if (!h)
            throw new Error("Unexpected symbol " + r.symbol + ", expected week number");
          for (t.byweekno = [parseInt(h[0], 10)]; r.accept("comma"); ) {
            if (!(h = r.acceptNumber()))
              throw new Error("Unexpected symbol " + r.symbol + "; expected monthday");
            t.byweekno.push(parseInt(h[0], 10));
          }
        } else {
          if (!p)
            return;
          r.nextSymbol(), t.bymonth || (t.bymonth = []), t.bymonth.push(p);
        }
      } while (r.accept("comma") || r.accept("the") || r.accept("on"));
  }
  function n() {
    if (r.accept("at"))
      do {
        var l = r.acceptNumber();
        if (!l)
          throw new Error("Unexpected symbol " + r.symbol + ", expected hour");
        for (t.byhour = [parseInt(l[0], 10)]; r.accept("comma"); ) {
          if (!(l = r.acceptNumber()))
            throw new Error("Unexpected symbol " + r.symbol + "; expected hour");
          t.byhour.push(parseInt(l[0], 10));
        }
      } while (r.accept("comma") || r.accept("at"));
  }
  function o() {
    switch (r.symbol) {
      case "january":
        return 1;
      case "february":
        return 2;
      case "march":
        return 3;
      case "april":
        return 4;
      case "may":
        return 5;
      case "june":
        return 6;
      case "july":
        return 7;
      case "august":
        return 8;
      case "september":
        return 9;
      case "october":
        return 10;
      case "november":
        return 11;
      case "december":
        return 12;
      default:
        return !1;
    }
  }
  function _() {
    switch (r.symbol) {
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        return r.symbol.substr(0, 2).toUpperCase();
      default:
        return !1;
    }
  }
  function a() {
    switch (r.symbol) {
      case "last":
        return r.nextSymbol(), -1;
      case "first":
        return r.nextSymbol(), 1;
      case "second":
        return r.nextSymbol(), r.accept("last") ? -2 : 2;
      case "third":
        return r.nextSymbol(), r.accept("last") ? -3 : 3;
      case "nth":
        var l = parseInt(r.value[1], 10);
        if (l < -366 || l > 366)
          throw new Error("Nth out of range: " + l);
        return r.nextSymbol(), r.accept("last") ? -l : l;
      default:
        return !1;
    }
  }
  function d() {
    if (r.symbol === "until") {
      var l = Date.parse(r.text);
      if (!l)
        throw new Error("Cannot parse until date:" + r.text);
      t.until = new Date(l);
    } else
      r.accept("for") && (t.count = parseInt(r.value[0], 10), r.expect("number"));
  }
}
function Oe(e) {
  return e < U.HOURLY;
}
(function(e) {
  e[e.YEARLY = 0] = "YEARLY", e[e.MONTHLY = 1] = "MONTHLY", e[e.WEEKLY = 2] = "WEEKLY", e[e.DAILY = 3] = "DAILY", e[e.HOURLY = 4] = "HOURLY", e[e.MINUTELY = 5] = "MINUTELY", e[e.SECONDLY = 6] = "SECONDLY";
})(U || (U = {}));
var Pa = function(e, i) {
  return i === void 0 && (i = Ee), new H(kt(e, i) || void 0);
}, me = ["count", "until", "interval", "byweekday", "bymonthday", "bymonth"];
se.IMPLEMENTED = [], se.IMPLEMENTED[U.HOURLY] = me, se.IMPLEMENTED[U.MINUTELY] = me, se.IMPLEMENTED[U.DAILY] = ["byhour"].concat(me), se.IMPLEMENTED[U.WEEKLY] = me, se.IMPLEMENTED[U.MONTHLY] = me, se.IMPLEMENTED[U.YEARLY] = ["byweekno", "byyearday"].concat(me);
var Ua = se.isFullyConvertible, De = function() {
  function e(i, t, r, s) {
    this.hour = i, this.minute = t, this.second = r, this.millisecond = s || 0;
  }
  return e.prototype.getHours = function() {
    return this.hour;
  }, e.prototype.getMinutes = function() {
    return this.minute;
  }, e.prototype.getSeconds = function() {
    return this.second;
  }, e.prototype.getMilliseconds = function() {
    return this.millisecond;
  }, e.prototype.getTime = function() {
    return 1e3 * (60 * this.hour * 60 + 60 * this.minute + this.second) + this.millisecond;
  }, e;
}(), Ya = function(e) {
  function i(t, r, s, n, o, _, a) {
    var d = e.call(this, n, o, _, a) || this;
    return d.year = t, d.month = r, d.day = s, d;
  }
  return Je(i, e), i.fromDate = function(t) {
    return new this(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.valueOf() % 1e3);
  }, i.prototype.getWeekday = function() {
    return ye(new Date(this.getTime()));
  }, i.prototype.getTime = function() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond)).getTime();
  }, i.prototype.getDay = function() {
    return this.day;
  }, i.prototype.getMonth = function() {
    return this.month;
  }, i.prototype.getYear = function() {
    return this.year;
  }, i.prototype.addYears = function(t) {
    this.year += t;
  }, i.prototype.addMonths = function(t) {
    if (this.month += t, this.month > 12) {
      var r = Math.floor(this.month / 12), s = ee(this.month, 12);
      this.month = s, this.year += r, this.month === 0 && (this.month = 12, --this.year);
    }
  }, i.prototype.addWeekly = function(t, r) {
    r > this.getWeekday() ? this.day += -(this.getWeekday() + 1 + (6 - r)) + 7 * t : this.day += -(this.getWeekday() - r) + 7 * t, this.fixDay();
  }, i.prototype.addDaily = function(t) {
    this.day += t, this.fixDay();
  }, i.prototype.addHours = function(t, r, s) {
    for (r && (this.hour += Math.floor((23 - this.hour) / t) * t); ; ) {
      this.hour += t;
      var n = Ce(this.hour, 24), o = n.div, _ = n.mod;
      if (o && (this.hour = _, this.addDaily(o)), re(s) || F(s, this.hour))
        break;
    }
  }, i.prototype.addMinutes = function(t, r, s, n) {
    for (r && (this.minute += Math.floor((1439 - (60 * this.hour + this.minute)) / t) * t); ; ) {
      this.minute += t;
      var o = Ce(this.minute, 60), _ = o.div, a = o.mod;
      if (_ && (this.minute = a, this.addHours(_, !1, s)), (re(s) || F(s, this.hour)) && (re(n) || F(n, this.minute)))
        break;
    }
  }, i.prototype.addSeconds = function(t, r, s, n, o) {
    for (r && (this.second += Math.floor((86399 - (3600 * this.hour + 60 * this.minute + this.second)) / t) * t); ; ) {
      this.second += t;
      var _ = Ce(this.second, 60), a = _.div, d = _.mod;
      if (a && (this.second = d, this.addMinutes(a, !1, s, n)), (re(s) || F(s, this.hour)) && (re(n) || F(n, this.minute)) && (re(o) || F(o, this.second)))
        break;
    }
  }, i.prototype.fixDay = function() {
    if (!(this.day <= 28)) {
      var t = Ze(this.year, this.month - 1)[1];
      if (!(this.day <= t))
        for (; this.day > t; ) {
          if (this.day -= t, ++this.month, this.month === 13 && (this.month = 1, ++this.year, this.year > 9999))
            return;
          t = Ze(this.year, this.month - 1)[1];
        }
    }
  }, i.prototype.add = function(t, r) {
    var s = t.freq, n = t.interval, o = t.wkst, _ = t.byhour, a = t.byminute, d = t.bysecond;
    switch (s) {
      case U.YEARLY:
        return this.addYears(n);
      case U.MONTHLY:
        return this.addMonths(n);
      case U.WEEKLY:
        return this.addWeekly(n, o);
      case U.DAILY:
        return this.addDaily(n);
      case U.HOURLY:
        return this.addHours(n, r, _);
      case U.MINUTELY:
        return this.addMinutes(n, r, _, a);
      case U.SECONDLY:
        return this.addSeconds(n, r, _, a, d);
    }
  }, i;
}(De);
function Et(e) {
  for (var i = [], t = 0, r = Object.keys(e); t < r.length; t++) {
    var s = r[t];
    F(un, s) || i.push(s), bt(e[s]) && !xe(e[s]) && i.push(s);
  }
  if (i.length)
    throw new Error("Invalid options: " + i.join(", "));
  return Q({}, e);
}
function Va(e) {
  var i = Q(Q({}, We), Et(e));
  if (B(i.byeaster) && (i.freq = H.YEARLY), !B(i.freq) || !H.FREQUENCIES[i.freq])
    throw new Error("Invalid frequency: ".concat(i.freq, " ").concat(e.freq));
  if (i.dtstart || (i.dtstart = new Date((/* @__PURE__ */ new Date()).setMilliseconds(0))), B(i.wkst) ? ne(i.wkst) || (i.wkst = i.wkst.weekday) : i.wkst = H.MO.weekday, B(i.bysetpos)) {
    ne(i.bysetpos) && (i.bysetpos = [i.bysetpos]);
    for (var t = 0; t < i.bysetpos.length; t++)
      if ((n = i.bysetpos[t]) === 0 || !(n >= -366 && n <= 366))
        throw new Error("bysetpos must be between 1 and 366, or between -366 and -1");
  }
  if (!(i.byweekno || J(i.byweekno) || J(i.byyearday) || i.bymonthday || J(i.bymonthday) || B(i.byweekday) || B(i.byeaster)))
    switch (i.freq) {
      case H.YEARLY:
        i.bymonth || (i.bymonth = i.dtstart.getUTCMonth() + 1), i.bymonthday = i.dtstart.getUTCDate();
        break;
      case H.MONTHLY:
        i.bymonthday = i.dtstart.getUTCDate();
        break;
      case H.WEEKLY:
        i.byweekday = [ye(i.dtstart)];
    }
  if (B(i.bymonth) && !Z(i.bymonth) && (i.bymonth = [i.bymonth]), B(i.byyearday) && !Z(i.byyearday) && ne(i.byyearday) && (i.byyearday = [i.byyearday]), B(i.bymonthday))
    if (Z(i.bymonthday)) {
      var r = [], s = [];
      for (t = 0; t < i.bymonthday.length; t++) {
        var n;
        (n = i.bymonthday[t]) > 0 ? r.push(n) : n < 0 && s.push(n);
      }
      i.bymonthday = r, i.bynmonthday = s;
    } else
      i.bymonthday < 0 ? (i.bynmonthday = [i.bymonthday], i.bymonthday = []) : (i.bynmonthday = [], i.bymonthday = [i.bymonthday]);
  else
    i.bymonthday = [], i.bynmonthday = [];
  if (B(i.byweekno) && !Z(i.byweekno) && (i.byweekno = [i.byweekno]), B(i.byweekday))
    if (ne(i.byweekday))
      i.byweekday = [i.byweekday], i.bynweekday = null;
    else if (Xe(i.byweekday))
      i.byweekday = [X.fromStr(i.byweekday).weekday], i.bynweekday = null;
    else if (i.byweekday instanceof X)
      !i.byweekday.n || i.freq > H.MONTHLY ? (i.byweekday = [i.byweekday.weekday], i.bynweekday = null) : (i.bynweekday = [[i.byweekday.weekday, i.byweekday.n]], i.byweekday = null);
    else {
      var o = [], _ = [];
      for (t = 0; t < i.byweekday.length; t++) {
        var a = i.byweekday[t];
        ne(a) ? o.push(a) : Xe(a) ? o.push(X.fromStr(a).weekday) : !a.n || i.freq > H.MONTHLY ? o.push(a.weekday) : _.push([a.weekday, a.n]);
      }
      i.byweekday = J(o) ? o : null, i.bynweekday = J(_) ? _ : null;
    }
  else
    i.bynweekday = null;
  return B(i.byhour) ? ne(i.byhour) && (i.byhour = [i.byhour]) : i.byhour = i.freq < H.HOURLY ? [i.dtstart.getUTCHours()] : null, B(i.byminute) ? ne(i.byminute) && (i.byminute = [i.byminute]) : i.byminute = i.freq < H.MINUTELY ? [i.dtstart.getUTCMinutes()] : null, B(i.bysecond) ? ne(i.bysecond) && (i.bysecond = [i.bysecond]) : i.bysecond = i.freq < H.SECONDLY ? [i.dtstart.getUTCSeconds()] : null, { parsedOptions: i };
}
function Ie(e) {
  var i = e.split(`
`).map(Fa).filter(function(t) {
    return t !== null;
  });
  return Q(Q({}, i[0]), i[1]);
}
function Se(e) {
  var i = {}, t = /DTSTART(?:;TZID=([^:=]+?))?(?::|=)([^;\s]+)/i.exec(e);
  if (!t)
    return i;
  var r = t[1], s = t[2];
  return r && (i.tzid = r), i.dtstart = Be(s), i;
}
function Fa(e) {
  if (!(e = e.replace(/^\s+|\s+$/, "")).length)
    return null;
  var i = /^([A-Z]+?)[:;]/.exec(e.toUpperCase());
  if (!i)
    return nt(e);
  var t = i[1];
  switch (t.toUpperCase()) {
    case "RRULE":
    case "EXRULE":
      return nt(e);
    case "DTSTART":
      return Se(e);
    default:
      throw new Error("Unsupported RFC prop ".concat(t, " in ").concat(e));
  }
}
function nt(e) {
  var i = Se(e.replace(/^RRULE:/i, ""));
  return e.replace(/^(?:RRULE|EXRULE):/i, "").split(";").forEach(function(t) {
    var r = t.split("="), s = r[0], n = r[1];
    switch (s.toUpperCase()) {
      case "FREQ":
        i.freq = U[n.toUpperCase()];
        break;
      case "WKST":
        i.wkst = te[n.toUpperCase()];
        break;
      case "COUNT":
      case "INTERVAL":
      case "BYSETPOS":
      case "BYMONTH":
      case "BYMONTHDAY":
      case "BYYEARDAY":
      case "BYWEEKNO":
      case "BYHOUR":
      case "BYMINUTE":
      case "BYSECOND":
        var o = function(d) {
          return d.indexOf(",") !== -1 ? d.split(",").map(rt) : rt(d);
        }(n), _ = s.toLowerCase();
        i[_] = o;
        break;
      case "BYWEEKDAY":
      case "BYDAY":
        i.byweekday = function(d) {
          var l = d.split(",");
          return l.map(function(c) {
            if (c.length === 2)
              return te[c];
            var f = c.match(/^([+-]?\d{1,2})([A-Z]{2})$/);
            if (!f || f.length < 3)
              throw new SyntaxError("Invalid weekday string: ".concat(c));
            var v = Number(f[1]), p = f[2], h = te[p].weekday;
            return new X(h, v);
          });
        }(n);
        break;
      case "DTSTART":
      case "TZID":
        var a = Se(e);
        i.tzid = a.tzid, i.dtstart = a.dtstart;
        break;
      case "UNTIL":
        i.until = Be(n);
        break;
      case "BYEASTER":
        i.byeaster = Number(n);
        break;
      default:
        throw new Error("Unknown RRULE property '" + s + "'");
    }
  }), i;
}
function rt(e) {
  return /^[+-]?\d+$/.test(e) ? Number(e) : e;
}
var Me = function() {
  function e(i, t) {
    if (isNaN(i.getTime()))
      throw new RangeError("Invalid date passed to DateWithZone");
    this.date = i, this.tzid = t;
  }
  return Object.defineProperty(e.prototype, "isUTC", { get: function() {
    return !this.tzid || this.tzid.toUpperCase() === "UTC";
  }, enumerable: !1, configurable: !0 }), e.prototype.toString = function() {
    var i = Fe(this.date.getTime(), this.isUTC);
    return this.isUTC ? ":".concat(i) : ";TZID=".concat(this.tzid, ":").concat(i);
  }, e.prototype.getTime = function() {
    return this.date.getTime();
  }, e.prototype.rezonedDate = function() {
    return this.isUTC ? this.date : (i = this.date, t = this.tzid, r = Intl.DateTimeFormat().resolvedOptions().timeZone, s = new Date(et(i, r)), n = new Date(et(i, t ?? "UTC")).getTime() - s.getTime(), new Date(i.getTime() - n));
    var i, t, r, s, n;
  }, e;
}();
function Pe(e) {
  for (var i, t = [], r = "", s = Object.keys(e), n = Object.keys(We), o = 0; o < s.length; o++)
    if (s[o] !== "tzid" && F(n, s[o])) {
      var _ = s[o].toUpperCase(), a = e[s[o]], d = "";
      if (B(a) && (!Z(a) || a.length)) {
        switch (_) {
          case "FREQ":
            d = H.FREQUENCIES[e.freq];
            break;
          case "WKST":
            d = ne(a) ? new X(a).toString() : a.toString();
            break;
          case "BYWEEKDAY":
            _ = "BYDAY", d = (i = a, Z(i) ? i : [i]).map(function(p) {
              return p instanceof X ? p : Z(p) ? new X(p[0], p[1]) : new X(p);
            }).toString();
            break;
          case "DTSTART":
            r = Ba(a, e.tzid);
            break;
          case "UNTIL":
            d = Fe(a, !e.tzid);
            break;
          default:
            if (Z(a)) {
              for (var l = [], c = 0; c < a.length; c++)
                l[c] = String(a[c]);
              d = l.toString();
            } else
              d = String(a);
        }
        d && t.push([_, d]);
      }
    }
  var f = t.map(function(p) {
    var h = p[0], u = p[1];
    return "".concat(h, "=").concat(u.toString());
  }).join(";"), v = "";
  return f !== "" && (v = "RRULE:".concat(f)), [r, v].filter(function(p) {
    return !!p;
  }).join(`
`);
}
function Ba(e, i) {
  return e ? "DTSTART" + new Me(new Date(e), i).toString() : "";
}
function Ja(e, i) {
  return Array.isArray(e) ? !!Array.isArray(i) && e.length === i.length && e.every(function(t, r) {
    return t.getTime() === i[r].getTime();
  }) : e instanceof Date ? i instanceof Date && e.getTime() === i.getTime() : e === i;
}
var Wa = function() {
  function e() {
    this.all = !1, this.before = [], this.after = [], this.between = [];
  }
  return e.prototype._cacheAdd = function(i, t, r) {
    t && (t = t instanceof Date ? je(t) : Qe(t)), i === "all" ? this.all = t : (r._value = t, this[i].push(r));
  }, e.prototype._cacheGet = function(i, t) {
    var r = !1, s = t ? Object.keys(t) : [], n = function(l) {
      for (var c = 0; c < s.length; c++) {
        var f = s[c];
        if (!Ja(t[f], l[f]))
          return !0;
      }
      return !1;
    }, o = this[i];
    if (i === "all")
      r = this.all;
    else if (Z(o))
      for (var _ = 0; _ < o.length; _++) {
        var a = o[_];
        if (!s.length || !n(a)) {
          r = a._value;
          break;
        }
      }
    if (!r && this.all) {
      var d = new ge(i, t);
      for (_ = 0; _ < this.all.length && d.accept(this.all[_]); _++)
        ;
      r = d.getValue(), this._cacheAdd(i, r, t);
    }
    return Z(r) ? Qe(r) : r instanceof Date ? je(r) : r;
  }, e;
}(), Ka = q(q(q(q(q(q(q(q(q(q(q(q(q([], P(1, 31), !0), P(2, 28), !0), P(3, 31), !0), P(4, 30), !0), P(5, 31), !0), P(6, 30), !0), P(7, 31), !0), P(8, 31), !0), P(9, 30), !0), P(10, 31), !0), P(11, 30), !0), P(12, 31), !0), P(1, 7), !0), Ga = q(q(q(q(q(q(q(q(q(q(q(q(q([], P(1, 31), !0), P(2, 29), !0), P(3, 31), !0), P(4, 30), !0), P(5, 31), !0), P(6, 30), !0), P(7, 31), !0), P(8, 31), !0), P(9, 30), !0), P(10, 31), !0), P(11, 30), !0), P(12, 31), !0), P(1, 7), !0), Xa = ie(1, 29), Za = ie(1, 30), he = ie(1, 31), K = ie(1, 32), Qa = q(q(q(q(q(q(q(q(q(q(q(q(q([], K, !0), Za, !0), K, !0), he, !0), K, !0), he, !0), K, !0), K, !0), he, !0), K, !0), he, !0), K, !0), K.slice(0, 7), !0), en = q(q(q(q(q(q(q(q(q(q(q(q(q([], K, !0), Xa, !0), K, !0), he, !0), K, !0), he, !0), K, !0), K, !0), he, !0), K, !0), he, !0), K, !0), K.slice(0, 7), !0), tn = ie(-28, 0), an = ie(-29, 0), ue = ie(-30, 0), G = ie(-31, 0), nn = q(q(q(q(q(q(q(q(q(q(q(q(q([], G, !0), an, !0), G, !0), ue, !0), G, !0), ue, !0), G, !0), G, !0), ue, !0), G, !0), ue, !0), G, !0), G.slice(0, 7), !0), rn = q(q(q(q(q(q(q(q(q(q(q(q(q([], G, !0), tn, !0), G, !0), ue, !0), G, !0), ue, !0), G, !0), G, !0), ue, !0), G, !0), ue, !0), G, !0), G.slice(0, 7), !0), on = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366], sn = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365], it = function() {
  for (var e = [], i = 0; i < 55; i++)
    e = e.concat(ie(7));
  return e;
}();
function dn(e, i) {
  var t, r, s = pe(e, 1, 1), n = be(e) ? 366 : 365, o = be(e + 1) ? 366 : 365, _ = qe(s), a = ye(s), d = Q(Q({ yearlen: n, nextyearlen: o, yearordinal: _, yearweekday: a }, function(g) {
    var b = be(g) ? 366 : 365, x = pe(g, 1, 1), k = ye(x);
    return b === 365 ? { mmask: Ka, mdaymask: en, nmdaymask: rn, wdaymask: it.slice(k), mrange: sn } : { mmask: Ga, mdaymask: Qa, nmdaymask: nn, wdaymask: it.slice(k), mrange: on };
  }(e)), { wnomask: null });
  if (re(i.byweekno))
    return d;
  d.wnomask = P(0, n + 7);
  var l = t = ee(7 - a + i.wkst, 7);
  l >= 4 ? (l = 0, r = d.yearlen + ee(a - i.wkst, 7)) : r = n - l;
  for (var c = Math.floor(r / 7), f = ee(r, 7), v = Math.floor(c + f / 4), p = 0; p < i.byweekno.length; p++) {
    var h = i.byweekno[p];
    if (h < 0 && (h += v + 1), h > 0 && h <= v) {
      var u = void 0;
      h > 1 ? (u = l + 7 * (h - 1), l !== t && (u -= 7 - t)) : u = l;
      for (var m = 0; m < 7 && (d.wnomask[u] = 1, u++, d.wdaymask[u] !== i.wkst); m++)
        ;
    }
  }
  if (F(i.byweekno, 1) && (u = l + 7 * v, l !== t && (u -= 7 - t), u < n))
    for (p = 0; p < 7 && (d.wnomask[u] = 1, u += 1, d.wdaymask[u] !== i.wkst); p++)
      ;
  if (l) {
    var y = void 0;
    if (F(i.byweekno, -1))
      y = -1;
    else {
      var w = ye(pe(e - 1, 1, 1)), D = ee(7 - w.valueOf() + i.wkst, 7), E = be(e - 1) ? 366 : 365, S = void 0;
      D >= 4 ? (D = 0, S = E + ee(w - i.wkst, 7)) : S = n - l, y = Math.floor(52 + ee(S, 7) / 4);
    }
    if (F(i.byweekno, y))
      for (u = 0; u < l; u++)
        d.wnomask[u] = 1;
  }
  return d;
}
var _n = function() {
  function e(i) {
    this.options = i;
  }
  return e.prototype.rebuild = function(i, t) {
    var r = this.options;
    if (i !== this.lastyear && (this.yearinfo = dn(i, r)), J(r.bynweekday) && (t !== this.lastmonth || i !== this.lastyear)) {
      var s = this.yearinfo, n = s.yearlen, o = s.mrange, _ = s.wdaymask;
      this.monthinfo = function(a, d, l, c, f, v) {
        var p = { lastyear: a, lastmonth: d, nwdaymask: [] }, h = [];
        if (v.freq === H.YEARLY)
          if (re(v.bymonth))
            h = [[0, l]];
          else
            for (var u = 0; u < v.bymonth.length; u++)
              d = v.bymonth[u], h.push(c.slice(d - 1, d + 1));
        else
          v.freq === H.MONTHLY && (h = [c.slice(d - 1, d + 1)]);
        if (re(h))
          return p;
        for (p.nwdaymask = P(0, l), u = 0; u < h.length; u++)
          for (var m = h[u], y = m[0], w = m[1] - 1, D = 0; D < v.bynweekday.length; D++) {
            var E = void 0, S = v.bynweekday[D], g = S[0], b = S[1];
            b < 0 ? (E = w + 7 * (b + 1), E -= ee(f[E] - g, 7)) : (E = y + 7 * (b - 1), E += ee(7 - f[E] + g, 7)), y <= E && E <= w && (p.nwdaymask[E] = 1);
          }
        return p;
      }(i, t, n, o, _, r);
    }
    B(r.byeaster) && (this.eastermask = function(a, d) {
      d === void 0 && (d = 0);
      var l = a % 19, c = Math.floor(a / 100), f = a % 100, v = Math.floor(c / 4), p = c % 4, h = Math.floor((c + 8) / 25), u = Math.floor((c - h + 1) / 3), m = Math.floor(19 * l + c - v - u + 15) % 30, y = Math.floor(f / 4), w = f % 4, D = Math.floor(32 + 2 * p + 2 * y - m - w) % 7, E = Math.floor((l + 11 * m + 22 * D) / 451), S = Math.floor((m + D - 7 * E + 114) / 31), g = (m + D - 7 * E + 114) % 31 + 1, b = Date.UTC(a, S - 1, g + d), x = Date.UTC(a, 0, 1);
      return [Math.ceil((b - x) / 864e5)];
    }(i, r.byeaster));
  }, Object.defineProperty(e.prototype, "lastyear", { get: function() {
    return this.monthinfo ? this.monthinfo.lastyear : null;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "lastmonth", { get: function() {
    return this.monthinfo ? this.monthinfo.lastmonth : null;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "yearlen", { get: function() {
    return this.yearinfo.yearlen;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "yearordinal", { get: function() {
    return this.yearinfo.yearordinal;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "mrange", { get: function() {
    return this.yearinfo.mrange;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "wdaymask", { get: function() {
    return this.yearinfo.wdaymask;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "mmask", { get: function() {
    return this.yearinfo.mmask;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "wnomask", { get: function() {
    return this.yearinfo.wnomask;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "nwdaymask", { get: function() {
    return this.monthinfo ? this.monthinfo.nwdaymask : [];
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "nextyearlen", { get: function() {
    return this.yearinfo.nextyearlen;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "mdaymask", { get: function() {
    return this.yearinfo.mdaymask;
  }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "nmdaymask", { get: function() {
    return this.yearinfo.nmdaymask;
  }, enumerable: !1, configurable: !0 }), e.prototype.ydayset = function() {
    return [ie(this.yearlen), 0, this.yearlen];
  }, e.prototype.mdayset = function(i, t) {
    for (var r = this.mrange[t - 1], s = this.mrange[t], n = P(null, this.yearlen), o = r; o < s; o++)
      n[o] = o;
    return [n, r, s];
  }, e.prototype.wdayset = function(i, t, r) {
    for (var s = P(null, this.yearlen + 7), n = qe(pe(i, t, r)) - this.yearordinal, o = n, _ = 0; _ < 7 && (s[n] = n, ++n, this.wdaymask[n] !== this.options.wkst); _++)
      ;
    return [s, o, n];
  }, e.prototype.ddayset = function(i, t, r) {
    var s = P(null, this.yearlen), n = qe(pe(i, t, r)) - this.yearordinal;
    return s[n] = n, [s, n, n + 1];
  }, e.prototype.htimeset = function(i, t, r, s) {
    var n = this, o = [];
    return this.options.byminute.forEach(function(_) {
      o = o.concat(n.mtimeset(i, _, r, s));
    }), ke(o), o;
  }, e.prototype.mtimeset = function(i, t, r, s) {
    var n = this.options.bysecond.map(function(o) {
      return new De(i, t, o, s);
    });
    return ke(n), n;
  }, e.prototype.stimeset = function(i, t, r, s) {
    return [new De(i, t, r, s)];
  }, e.prototype.getdayset = function(i) {
    switch (i) {
      case U.YEARLY:
        return this.ydayset.bind(this);
      case U.MONTHLY:
        return this.mdayset.bind(this);
      case U.WEEKLY:
        return this.wdayset.bind(this);
      case U.DAILY:
      default:
        return this.ddayset.bind(this);
    }
  }, e.prototype.gettimeset = function(i) {
    switch (i) {
      case U.HOURLY:
        return this.htimeset.bind(this);
      case U.MINUTELY:
        return this.mtimeset.bind(this);
      case U.SECONDLY:
        return this.stimeset.bind(this);
    }
  }, e;
}();
function ln(e, i, t, r, s, n) {
  for (var o = [], _ = 0; _ < e.length; _++) {
    var a = void 0, d = void 0, l = e[_];
    l < 0 ? (a = Math.floor(l / i.length), d = ee(l, i.length)) : (a = Math.floor((l - 1) / i.length), d = ee(l - 1, i.length));
    for (var c = [], f = t; f < r; f++) {
      var v = n[f];
      B(v) && c.push(v);
    }
    var p = void 0;
    p = a < 0 ? c.slice(a)[0] : c[a];
    var h = i[d], u = xt(s.yearordinal + p), m = wt(u, h);
    F(o, m) || o.push(m);
  }
  return ke(o), o;
}
function Dt(e, i) {
  var t = i.dtstart, r = i.freq, s = i.interval, n = i.until, o = i.bysetpos, _ = i.count;
  if (_ === 0 || s === 0)
    return oe(e);
  var a = Ya.fromDate(t), d = new _n(i);
  d.rebuild(a.year, a.month);
  for (var l = function(b, x, k) {
    var M = k.freq, N = k.byhour, T = k.byminute, A = k.bysecond;
    return Oe(M) ? function(C) {
      var $ = C.dtstart.getTime() % 1e3;
      if (!Oe(C.freq))
        return [];
      var O = [];
      return C.byhour.forEach(function(j) {
        C.byminute.forEach(function(V) {
          C.bysecond.forEach(function(Y) {
            O.push(new De(j, V, Y, $));
          });
        });
      }), O;
    }(k) : M >= H.HOURLY && J(N) && !F(N, x.hour) || M >= H.MINUTELY && J(T) && !F(T, x.minute) || M >= H.SECONDLY && J(A) && !F(A, x.second) ? [] : b.gettimeset(M)(x.hour, x.minute, x.second, x.millisecond);
  }(d, a, i); ; ) {
    var c = d.getdayset(r)(a.year, a.month, a.day), f = c[0], v = c[1], p = c[2], h = hn(f, v, p, d, i);
    if (J(o))
      for (var u = ln(o, l, v, p, d, f), m = 0; m < u.length; m++) {
        var y = u[m];
        if (n && y > n)
          return oe(e);
        if (y >= t) {
          var w = ot(y, i);
          if (!e.accept(w) || _ && !--_)
            return oe(e);
        }
      }
    else
      for (m = v; m < p; m++) {
        var D = f[m];
        if (B(D))
          for (var E = xt(d.yearordinal + D), S = 0; S < l.length; S++) {
            var g = l[S];
            if (y = wt(E, g), n && y > n || y >= t && (w = ot(y, i), !e.accept(w) || _ && !--_))
              return oe(e);
          }
      }
    if (i.interval === 0 || (a.add(i, h), a.year > 9999))
      return oe(e);
    Oe(r) || (l = d.gettimeset(r)(a.hour, a.minute, a.second, 0)), d.rebuild(a.year, a.month);
  }
}
function cn(e, i, t) {
  var r = t.bymonth, s = t.byweekno, n = t.byweekday, o = t.byeaster, _ = t.bymonthday, a = t.bynmonthday, d = t.byyearday;
  return J(r) && !F(r, e.mmask[i]) || J(s) && !e.wnomask[i] || J(n) && !F(n, e.wdaymask[i]) || J(e.nwdaymask) && !e.nwdaymask[i] || o !== null && !F(e.eastermask, i) || (J(_) || J(a)) && !F(_, e.mdaymask[i]) && !F(a, e.nmdaymask[i]) || J(d) && (i < e.yearlen && !F(d, i + 1) && !F(d, -e.yearlen + i) || i >= e.yearlen && !F(d, i + 1 - e.yearlen) && !F(d, -e.nextyearlen + i - e.yearlen));
}
function ot(e, i) {
  return new Me(e, i.tzid).rezonedDate();
}
function oe(e) {
  return e.getValue();
}
function hn(e, i, t, r, s) {
  for (var n = !1, o = i; o < t; o++) {
    var _ = e[o];
    (n = cn(r, _, s)) && (e[_] = null);
  }
  return n;
}
var te = { MO: new X(0), TU: new X(1), WE: new X(2), TH: new X(3), FR: new X(4), SA: new X(5), SU: new X(6) }, We = { freq: U.YEARLY, dtstart: null, interval: 1, wkst: te.MO, count: null, until: null, tzid: null, bysetpos: null, bymonth: null, bymonthday: null, bynmonthday: null, byyearday: null, byweekno: null, byweekday: null, bynweekday: null, byhour: null, byminute: null, bysecond: null, byeaster: null }, un = Object.keys(We), H = function() {
  function e(i, t) {
    i === void 0 && (i = {}), t === void 0 && (t = !1), this._cache = t ? null : new Wa(), this.origOptions = Et(i);
    var r = Va(i).parsedOptions;
    this.options = r;
  }
  return e.parseText = function(i, t) {
    return kt(i, t);
  }, e.fromText = function(i, t) {
    return Pa(i, t);
  }, e.fromString = function(i) {
    return new e(e.parseString(i) || void 0);
  }, e.prototype._iter = function(i) {
    return Dt(i, this.options);
  }, e.prototype._cacheGet = function(i, t) {
    return !!this._cache && this._cache._cacheGet(i, t);
  }, e.prototype._cacheAdd = function(i, t, r) {
    if (this._cache)
      return this._cache._cacheAdd(i, t, r);
  }, e.prototype.all = function(i) {
    if (i)
      return this._iter(new tt("all", {}, i));
    var t = this._cacheGet("all");
    return t === !1 && (t = this._iter(new ge("all", {})), this._cacheAdd("all", t)), t;
  }, e.prototype.between = function(i, t, r, s) {
    if (r === void 0 && (r = !1), !xe(i) || !xe(t))
      throw new Error("Invalid date passed in to RRule.between");
    var n = { before: t, after: i, inc: r };
    if (s)
      return this._iter(new tt("between", n, s));
    var o = this._cacheGet("between", n);
    return o === !1 && (o = this._iter(new ge("between", n)), this._cacheAdd("between", o, n)), o;
  }, e.prototype.before = function(i, t) {
    if (t === void 0 && (t = !1), !xe(i))
      throw new Error("Invalid date passed in to RRule.before");
    var r = { dt: i, inc: t }, s = this._cacheGet("before", r);
    return s === !1 && (s = this._iter(new ge("before", r)), this._cacheAdd("before", s, r)), s;
  }, e.prototype.after = function(i, t) {
    if (t === void 0 && (t = !1), !xe(i))
      throw new Error("Invalid date passed in to RRule.after");
    var r = { dt: i, inc: t }, s = this._cacheGet("after", r);
    return s === !1 && (s = this._iter(new ge("after", r)), this._cacheAdd("after", s, r)), s;
  }, e.prototype.count = function() {
    return this.all().length;
  }, e.prototype.toString = function() {
    return Pe(this.origOptions);
  }, e.prototype.toText = function(i, t, r) {
    return function(s, n, o, _) {
      return new se(s, n, o, _).toString();
    }(this, i, t, r);
  }, e.prototype.isFullyConvertibleToText = function() {
    return Ua(this);
  }, e.prototype.clone = function() {
    return new e(this.origOptions);
  }, e.FREQUENCIES = ["YEARLY", "MONTHLY", "WEEKLY", "DAILY", "HOURLY", "MINUTELY", "SECONDLY"], e.YEARLY = U.YEARLY, e.MONTHLY = U.MONTHLY, e.WEEKLY = U.WEEKLY, e.DAILY = U.DAILY, e.HOURLY = U.HOURLY, e.MINUTELY = U.MINUTELY, e.SECONDLY = U.SECONDLY, e.MO = te.MO, e.TU = te.TU, e.WE = te.WE, e.TH = te.TH, e.FR = te.FR, e.SA = te.SA, e.SU = te.SU, e.parseString = Ie, e.optionsToString = Pe, e;
}(), st = { dtstart: null, cache: !1, unfold: !1, forceset: !1, compatible: !1, tzid: null };
function fn(e, i) {
  var t = [], r = [], s = [], n = [], o = Se(e), _ = o.dtstart, a = o.tzid, d = function(l, c) {
    if (c === void 0 && (c = !1), l = l && l.trim(), !l)
      throw new Error("Invalid empty string");
    if (!c)
      return l.split(/\s/);
    for (var f = l.split(`
`), v = 0; v < f.length; ) {
      var p = f[v] = f[v].replace(/\s+$/g, "");
      p ? v > 0 && p[0] === " " ? (f[v - 1] += p.slice(1), f.splice(v, 1)) : v += 1 : f.splice(v, 1);
    }
    return f;
  }(e, i.unfold);
  return d.forEach(function(l) {
    var c;
    if (l) {
      var f = function(m) {
        var y = function(S) {
          if (S.indexOf(":") === -1)
            return { name: "RRULE", value: S };
          var g = (k = S, M = ":", N = 1, T = k.split(M), N ? T.slice(0, N).concat([T.slice(N).join(M)]) : T), b = g[0], x = g[1], k, M, N, T;
          return { name: b, value: x };
        }(m), w = y.name, D = y.value, E = w.split(";");
        if (!E)
          throw new Error("empty property name");
        return { name: E[0].toUpperCase(), parms: E.slice(1), value: D };
      }(l), v = f.name, p = f.parms, h = f.value;
      switch (v.toUpperCase()) {
        case "RRULE":
          if (p.length)
            throw new Error("unsupported RRULE parm: ".concat(p.join(",")));
          t.push(Ie(l));
          break;
        case "RDATE":
          var u = ((c = /RDATE(?:;TZID=([^:=]+))?/i.exec(l)) !== null && c !== void 0 ? c : [])[1];
          u && !a && (a = u), r = r.concat(dt(h, p));
          break;
        case "EXRULE":
          if (p.length)
            throw new Error("unsupported EXRULE parm: ".concat(p.join(",")));
          s.push(Ie(h));
          break;
        case "EXDATE":
          n = n.concat(dt(h, p));
          break;
        case "DTSTART":
          break;
        default:
          throw new Error("unsupported property: " + v);
      }
    }
  }), { dtstart: _, tzid: a, rrulevals: t, rdatevals: r, exrulevals: s, exdatevals: n };
}
function we(e, i) {
  return i === void 0 && (i = {}), function(t, r) {
    var s = fn(t, r), n = s.rrulevals, o = s.rdatevals, _ = s.exrulevals, a = s.exdatevals, d = s.dtstart, l = s.tzid, c = r.cache === !1;
    if (r.compatible && (r.forceset = !0, r.unfold = !0), r.forceset || n.length > 1 || o.length || _.length || a.length) {
      var f = new pn(c);
      return f.dtstart(d), f.tzid(l || void 0), n.forEach(function(p) {
        f.rrule(new H(Le(p, d, l), c));
      }), o.forEach(function(p) {
        f.rdate(p);
      }), _.forEach(function(p) {
        f.exrule(new H(Le(p, d, l), c));
      }), a.forEach(function(p) {
        f.exdate(p);
      }), r.compatible && r.dtstart && f.rdate(d), f;
    }
    var v = n[0] || {};
    return new H(Le(v, v.dtstart || r.dtstart || d, v.tzid || r.tzid || l), c);
  }(e, function(t) {
    var r = [], s = Object.keys(t), n = Object.keys(st);
    if (s.forEach(function(o) {
      F(n, o) || r.push(o);
    }), r.length)
      throw new Error("Invalid options: " + r.join(", "));
    return Q(Q({}, st), t);
  }(i));
}
function Le(e, i, t) {
  return Q(Q({}, e), { dtstart: i, tzid: t });
}
function dt(e, i) {
  return function(t) {
    t.forEach(function(r) {
      if (!/(VALUE=DATE(-TIME)?)|(TZID=)/.test(r))
        throw new Error("unsupported RDATE/EXDATE parm: " + r);
    });
  }(i), e.split(",").map(function(t) {
    return Be(t);
  });
}
function _t(e) {
  var i = this;
  return function(t) {
    if (t !== void 0 && (i["_".concat(e)] = t), i["_".concat(e)] !== void 0)
      return i["_".concat(e)];
    for (var r = 0; r < i._rrule.length; r++) {
      var s = i._rrule[r].origOptions[e];
      if (s)
        return s;
    }
  };
}
var pn = function(e) {
  function i(t) {
    t === void 0 && (t = !1);
    var r = e.call(this, {}, t) || this;
    return r.dtstart = _t.apply(r, ["dtstart"]), r.tzid = _t.apply(r, ["tzid"]), r._rrule = [], r._rdate = [], r._exrule = [], r._exdate = [], r;
  }
  return Je(i, e), i.prototype._iter = function(t) {
    return function(r, s, n, o, _, a) {
      var d = {}, l = r.accept;
      function c(h, u) {
        n.forEach(function(m) {
          m.between(h, u, !0).forEach(function(y) {
            d[Number(y)] = !0;
          });
        });
      }
      _.forEach(function(h) {
        var u = new Me(h, a).rezonedDate();
        d[Number(u)] = !0;
      }), r.accept = function(h) {
        var u = Number(h);
        return isNaN(u) ? l.call(this, h) : !(!d[u] && (c(new Date(u - 1), new Date(u + 1)), !d[u])) || (d[u] = !0, l.call(this, h));
      }, r.method === "between" && (c(r.args.after, r.args.before), r.accept = function(h) {
        var u = Number(h);
        return !!d[u] || (d[u] = !0, l.call(this, h));
      });
      for (var f = 0; f < o.length; f++) {
        var v = new Me(o[f], a).rezonedDate();
        if (!r.accept(new Date(v.getTime())))
          break;
      }
      s.forEach(function(h) {
        Dt(r, h.options);
      });
      var p = r._result;
      switch (ke(p), r.method) {
        case "all":
        case "between":
          return p;
        case "before":
          return p.length && p[p.length - 1] || null;
        default:
          return p.length && p[0] || null;
      }
    }(t, this._rrule, this._exrule, this._rdate, this._exdate, this.tzid());
  }, i.prototype.rrule = function(t) {
    lt(t, this._rrule);
  }, i.prototype.exrule = function(t) {
    lt(t, this._exrule);
  }, i.prototype.rdate = function(t) {
    ct(t, this._rdate);
  }, i.prototype.exdate = function(t) {
    ct(t, this._exdate);
  }, i.prototype.rrules = function() {
    return this._rrule.map(function(t) {
      return we(t.toString());
    });
  }, i.prototype.exrules = function() {
    return this._exrule.map(function(t) {
      return we(t.toString());
    });
  }, i.prototype.rdates = function() {
    return this._rdate.map(function(t) {
      return new Date(t.getTime());
    });
  }, i.prototype.exdates = function() {
    return this._exdate.map(function(t) {
      return new Date(t.getTime());
    });
  }, i.prototype.valueOf = function() {
    var t = [];
    return !this._rrule.length && this._dtstart && (t = t.concat(Pe({ dtstart: this._dtstart }))), this._rrule.forEach(function(r) {
      t = t.concat(r.toString().split(`
`));
    }), this._exrule.forEach(function(r) {
      t = t.concat(r.toString().split(`
`).map(function(s) {
        return s.replace(/^RRULE:/, "EXRULE:");
      }).filter(function(s) {
        return !/^DTSTART/.test(s);
      }));
    }), this._rdate.length && t.push(ht("RDATE", this._rdate, this.tzid())), this._exdate.length && t.push(ht("EXDATE", this._exdate, this.tzid())), t;
  }, i.prototype.toString = function() {
    return this.valueOf().join(`
`);
  }, i.prototype.clone = function() {
    var t = new i(!!this._cache);
    return this._rrule.forEach(function(r) {
      return t.rrule(r.clone());
    }), this._exrule.forEach(function(r) {
      return t.exrule(r.clone());
    }), this._rdate.forEach(function(r) {
      return t.rdate(new Date(r.getTime()));
    }), this._exdate.forEach(function(r) {
      return t.exdate(new Date(r.getTime()));
    }), t;
  }, i;
}(H);
function lt(e, i) {
  if (!(e instanceof H))
    throw new TypeError(String(e) + " is not RRule instance");
  F(i.map(String), String(e)) || i.push(e);
}
function ct(e, i) {
  if (!(e instanceof Date))
    throw new TypeError(String(e) + " is not Date instance");
  F(i.map(Number), Number(e)) || (i.push(e), ke(i));
}
function ht(e, i, t) {
  var r = !t || t.toUpperCase() === "UTC", s = r ? "".concat(e, ":") : "".concat(e, ";TZID=").concat(t, ":"), n = i.map(function(o) {
    return Fe(o.valueOf(), r);
  }).join(",");
  return "".concat(s).concat(n);
}
class vn {
  constructor(i) {
    this._scheduler = i;
  }
  getNode() {
    const i = this._scheduler;
    return this._tooltipNode || (this._tooltipNode = document.createElement("div"), this._tooltipNode.className = "dhtmlXTooltip scheduler_tooltip tooltip", i._waiAria.tooltipAttr(this._tooltipNode)), i.config.rtl ? this._tooltipNode.classList.add("dhtmlXTooltip_rtl") : this._tooltipNode.classList.remove("dhtmlXTooltip_rtl"), this._tooltipNode;
  }
  setViewport(i) {
    return this._root = i, this;
  }
  show(i, t) {
    const r = this._scheduler, s = r.$domHelpers, n = document.body, o = this.getNode();
    if (s.isChildOf(o, n) || (this.hide(), n.appendChild(o)), this._isLikeMouseEvent(i)) {
      const _ = this._calculateTooltipPosition(i);
      t = _.top, i = _.left;
    }
    return o.style.top = t + "px", o.style.left = i + "px", r._waiAria.tooltipVisibleAttr(o), this;
  }
  hide() {
    const i = this._scheduler, t = this.getNode();
    return t && t.parentNode && t.parentNode.removeChild(t), i._waiAria.tooltipHiddenAttr(t), this;
  }
  setContent(i) {
    return this.getNode().innerHTML = i, this;
  }
  _isLikeMouseEvent(i) {
    return !(!i || typeof i != "object") && "clientX" in i && "clientY" in i;
  }
  _getViewPort() {
    return this._root || document.body;
  }
  _calculateTooltipPosition(i) {
    const t = this._scheduler, r = t.$domHelpers, s = this._getViewPortSize(), n = this.getNode(), o = { top: 0, left: 0, width: n.offsetWidth, height: n.offsetHeight, bottom: 0, right: 0 }, _ = t.config.tooltip_offset_x, a = t.config.tooltip_offset_y, d = document.body, l = r.getRelativeEventPosition(i, d), c = r.getNodePosition(d);
    l.y += c.y, o.top = l.y, o.left = l.x, o.top += a, o.left += _, o.bottom = o.top + o.height, o.right = o.left + o.width;
    const f = window.scrollY + d.scrollTop;
    return o.top < s.top - f ? (o.top = s.top, o.bottom = o.top + o.height) : o.bottom > s.bottom && (o.bottom = s.bottom, o.top = o.bottom - o.height), o.left < s.left ? (o.left = s.left, o.right = s.left + o.width) : o.right > s.right && (o.right = s.right, o.left = o.right - o.width), l.x >= o.left && l.x <= o.right && (o.left = l.x - o.width - _, o.right = o.left + o.width), l.y >= o.top && l.y <= o.bottom && (o.top = l.y - o.height - a, o.bottom = o.top + o.height), o;
  }
  _getViewPortSize() {
    const i = this._scheduler, t = i.$domHelpers, r = this._getViewPort();
    let s, n = r, o = window.scrollY + document.body.scrollTop, _ = window.scrollX + document.body.scrollLeft;
    return r === i.$event_data ? (n = i.$event, o = 0, _ = 0, s = t.getNodePosition(i.$event)) : s = t.getNodePosition(n), { left: s.x + _, top: s.y + o, width: s.width, height: s.height, bottom: s.y + s.height + o, right: s.x + s.width + _ };
  }
}
class mn {
  constructor(i) {
    this._listeners = {}, this.tooltip = new vn(i), this._scheduler = i, this._domEvents = i._createDomEventScope(), this._initDelayedFunctions();
  }
  destructor() {
    this.tooltip.hide(), this._domEvents.detachAll();
  }
  hideTooltip() {
    this.delayHide();
  }
  attach(i) {
    let t = document.body;
    const r = this._scheduler, s = r.$domHelpers;
    i.global || (t = r.$root);
    let n = null;
    const o = (_) => {
      const a = s.getTargetNode(_), d = s.closest(a, i.selector);
      if (s.isChildOf(a, this.tooltip.getNode()))
        return;
      const l = () => {
        n = d, i.onmouseenter(_, d);
      };
      r._mobile && r.config.touch_tooltip && (d ? l() : i.onmouseleave(_, d)), n ? d && d === n ? i.onmousemove(_, d) : (i.onmouseleave(_, n), n = null, d && d !== n && l()) : d && l();
    };
    this.detach(i.selector), this._domEvents.attach(t, "mousemove", o), this._listeners[i.selector] = { node: t, handler: o };
  }
  detach(i) {
    const t = this._listeners[i];
    t && this._domEvents.detach(t.node, "mousemove", t.handler);
  }
  tooltipFor(i) {
    const t = (r) => {
      let s = r;
      return document.createEventObject && !document.createEvent && (s = document.createEventObject(r)), s;
    };
    this._initDelayedFunctions(), this.attach({ selector: i.selector, global: i.global, onmouseenter: (r, s) => {
      const n = i.html(r, s);
      n && this.delayShow(t(r), n);
    }, onmousemove: (r, s) => {
      const n = i.html(r, s);
      n ? this.delayShow(t(r), n) : (this.delayShow.$cancelTimeout(), this.delayHide());
    }, onmouseleave: () => {
      this.delayShow.$cancelTimeout(), this.delayHide();
    } });
  }
  _initDelayedFunctions() {
    const i = this._scheduler;
    this.delayShow && this.delayShow.$cancelTimeout(), this.delayHide && this.delayHide.$cancelTimeout(), this.tooltip.hide(), this.delayShow = ae.delay((t, r) => {
      i.callEvent("onBeforeTooltip", [t]) === !1 ? this.tooltip.hide() : (this.tooltip.setContent(r), this.tooltip.show(t));
    }, i.config.tooltip_timeout || 1), this.delayHide = ae.delay(() => {
      this.delayShow.$cancelTimeout(), this.tooltip.hide();
    }, i.config.tooltip_hide_timeout || 1);
  }
}
const gn = { active_links: function(e) {
  e.config.active_link_view = "day", e._active_link_click = function(i) {
    var t = i.target.getAttribute("data-link-date"), r = e.date.str_to_date(e.config.api_date, !1, !0);
    if (t)
      return e.setCurrentView(r(t), e.config.active_link_view), i && i.preventDefault && i.preventDefault(), !1;
  }, e.attachEvent("onTemplatesReady", function() {
    var i = function(r, s) {
      s = s || r + "_scale_date", e.templates["_active_links_old_" + s] || (e.templates["_active_links_old_" + s] = e.templates[s]);
      var n = e.templates["_active_links_old_" + s], o = e.date.date_to_str(e.config.api_date);
      e.templates[s] = function(_) {
        return "<a data-link-date='" + o(_) + "' href='#'>" + n(_) + "</a>";
      };
    };
    if (i("week"), i("", "month_day"), this.matrix)
      for (var t in this.matrix)
        i(t);
    this._detachDomEvent(this._obj, "click", e._active_link_click), e.event(this._obj, "click", e._active_link_click);
  });
}, agenda_legacy: function(e) {
  e.date.add_agenda_legacy = function(i) {
    return e.date.add(i, 1, "year");
  }, e.templates.agenda_legacy_time = function(i, t, r) {
    return r._timed ? this.day_date(r.start_date, r.end_date, r) + " " + this.event_date(i) : e.templates.day_date(i) + " &ndash; " + e.templates.day_date(t);
  }, e.templates.agenda_legacy_text = function(i, t, r) {
    return r.text;
  }, e.templates.agenda_legacy_date = function() {
    return "";
  }, e.date.agenda_legacy_start = function() {
    return e.date.date_part(e._currentDate());
  }, e.attachEvent("onTemplatesReady", function() {
    var i = e.dblclick_dhx_cal_data;
    e.dblclick_dhx_cal_data = function() {
      if (this._mode == "agenda_legacy")
        !this.config.readonly && this.config.dblclick_create && this.addEventNow();
      else if (i)
        return i.apply(this, arguments);
    };
    var t = e.render_data;
    e.render_data = function(n) {
      if (this._mode != "agenda_legacy")
        return t.apply(this, arguments);
      s();
    };
    var r = e.render_view_data;
    function s() {
      var n = e.get_visible_events();
      n.sort(function(m, y) {
        return m.start_date > y.start_date ? 1 : -1;
      });
      for (var o, _ = "<div class='dhx_agenda_area' " + e._waiAria.agendaDataAttrString() + ">", a = 0; a < n.length; a++) {
        var d = n[a], l = d.color ? "--dhx-scheduler-event-background:" + d.color + ";" : "", c = d.textColor ? "--dhx-scheduler-event-color:" + d.textColor + ";" : "", f = e.templates.event_class(d.start_date, d.end_date, d);
        o = e._waiAria.agendaEventAttrString(d);
        var v = e._waiAria.agendaDetailsBtnString();
        _ += "<div " + o + " class='dhx_agenda_line" + (f ? " " + f : "") + "' event_id='" + d.id + "' " + e.config.event_attribute + "='" + d.id + "' style='" + c + l + (d._text_style || "") + "'><div class='dhx_agenda_event_time'>" + (e.config.rtl ? e.templates.agenda_time(d.end_date, d.start_date, d) : e.templates.agenda_time(d.start_date, d.end_date, d)) + "</div>", _ += `<div ${v} class='dhx_event_icon icon_details'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15.4444 16.4H4.55556V7.6H15.4444V16.4ZM13.1111 2V3.6H6.88889V2H5.33333V3.6H4.55556C3.69222 3.6 3 4.312 3 5.2V16.4C3 16.8243 3.16389 17.2313 3.45561 17.5314C3.74733 17.8314 4.143 18 4.55556 18H15.4444C15.857 18 16.2527 17.8314 16.5444 17.5314C16.8361 17.2313 17 16.8243 17 16.4V5.2C17 4.312 16.3 3.6 15.4444 3.6H14.6667V2H13.1111ZM13.8889 10.8H10V14.8H13.8889V10.8Z" fill="#A1A4A6"/>
			</svg></div>`, _ += "<span>" + e.templates.agenda_text(d.start_date, d.end_date, d) + "</span></div>";
      }
      _ += "<div class='dhx_v_border'></div></div>", e._els.dhx_cal_data[0].innerHTML = _, e._els.dhx_cal_data[0].childNodes[0].scrollTop = e._agendaScrollTop || 0;
      var p = e._els.dhx_cal_data[0].childNodes[0];
      p.childNodes[p.childNodes.length - 1].style.height = p.offsetHeight < e._els.dhx_cal_data[0].offsetHeight ? "100%" : p.offsetHeight + "px";
      var h = e._els.dhx_cal_data[0].firstChild.childNodes, u = e._getNavDateElement();
      for (u && (u.innerHTML = e.templates.agenda_date(e._min_date, e._max_date, e._mode)), e._rendered = [], a = 0; a < h.length - 1; a++)
        e._rendered[a] = h[a];
    }
    e.render_view_data = function() {
      return this._mode == "agenda_legacy" && (e._agendaScrollTop = e._els.dhx_cal_data[0].childNodes[0].scrollTop, e._els.dhx_cal_data[0].childNodes[0].scrollTop = 0), r.apply(this, arguments);
    }, e.agenda_legacy_view = function(n) {
      e._min_date = e.config.agenda_start || e.date.agenda_legacy_start(e._date), e._max_date = e.config.agenda_end || e.date.add_agenda_legacy(e._min_date, 1), function(o) {
        if (o) {
          var _ = e.locale.labels, a = e._waiAria.agendaHeadAttrString(), d = e._waiAria.agendaHeadDateString(_.date), l = e._waiAria.agendaHeadDescriptionString(_.description);
          e._els.dhx_cal_header[0].innerHTML = "<div " + a + " class='dhx_agenda_line dhx_agenda_line_header'><div " + d + ">" + _.date + "</div><span class = 'description_header' style='padding-left:25px' " + l + ">" + _.description + "</span></div>", e._table_view = !0, e.set_sizes();
        }
      }(n), n ? (e._cols = null, e._colsS = null, e._table_view = !0, s()) : e._table_view = !1;
    };
  });
}, agenda_view: function(e) {
  e.date.add_agenda = function(s, n) {
    return e.date.add(s, 1 * n, "month");
  }, e.templates.agenda_time = function(s, n, o) {
    return o._timed ? `${this.event_date(s)} - ${this.event_date(n)}` : e.locale.labels.full_day;
  }, e.templates.agenda_text = function(s, n, o) {
    return o.text;
  };
  const i = e.date.date_to_str("%F %j"), t = e.date.date_to_str("%l");
  e.templates.agenda_day = function(s) {
    return `<div class="dhx_agenda_day_date">${i(s)}</div>
		<div class="dhx_agenda_day_dow">${t(s)}</div>`;
  }, e.templates.agenda_date = function(s, n) {
    return e.templates.month_date(e.getState().date);
  }, e.date.agenda_start = function(s) {
    return e.date.month_start(new Date(s));
  };
  let r = 0;
  e.attachEvent("onTemplatesReady", function() {
    var s = e.dblclick_dhx_cal_data;
    e.dblclick_dhx_cal_data = function() {
      if (this._mode == "agenda")
        !this.config.readonly && this.config.dblclick_create && this.addEventNow();
      else if (s)
        return s.apply(this, arguments);
    };
    var n = e.render_data;
    e.render_data = function(d) {
      if (this._mode != "agenda")
        return n.apply(this, arguments);
      _();
    };
    var o = e.render_view_data;
    function _() {
      const d = e.get_visible_events();
      d.sort(function(u, m) {
        return u.start_date > m.start_date ? 1 : -1;
      });
      const l = {};
      let c = e.getState().min_date;
      const f = e.getState().max_date;
      for (; c.valueOf() < f.valueOf(); )
        l[c.valueOf()] = [], c = e.date.add(c, 1, "day");
      let v = !1;
      if (d.forEach((u) => {
        let m = e.date.day_start(new Date(u.start_date));
        for (; m.valueOf() < u.end_date.valueOf(); )
          l[m.valueOf()] && (l[m.valueOf()].push(u), v = !0), m = e.date.day_start(e.date.add(m, 1, "day"));
      }), v) {
        let u = "";
        for (let m in l)
          e.ignore_agenda && e.ignore_agenda(new Date(1 * m)) || (u += a(new Date(1 * m), l[m]));
        e._els.dhx_cal_data[0].innerHTML = u;
      } else
        e._els.dhx_cal_data[0].innerHTML = `<div class="dhx_cal_agenda_no_events">${e.locale.labels.agenda_tab}</div>`;
      e._els.dhx_cal_data[0].scrollTop = r;
      let p = e._els.dhx_cal_data[0].querySelectorAll(".dhx_cal_agenda_event_line");
      e._rendered = [];
      for (var h = 0; h < p.length - 1; h++)
        e._rendered[h] = p[h];
    }
    function a(d, l) {
      if (!l.length)
        return "";
      let c = `
<div class="dhx_cal_agenda_day" data-date="${e.templates.format_date(d)}" data-day="${d.getDay()}">
	<div class="dhx_cal_agenda_day_header">${e.templates.agenda_day(d)}</div>
	<div class="dhx_cal_agenda_day_events">
`;
      return l.forEach((f) => {
        c += function(v, p) {
          const h = e.templates.agenda_time(p.start_date, p.end_date, p), u = e.getState().select_id, m = e.templates.event_class(p.start_date, p.end_date, p), y = e.templates.agenda_text(p.start_date, p.end_date, p);
          let w = "";
          return (p.color || p.textColor) && (w = ` style="${p.color ? "--dhx-scheduler-event-background:" + p.color + ";" : ""}${p.textColor ? "--dhx-scheduler-event-color:" + p.textColor + ";" : ""}" `), `<div class="dhx_cal_agenda_event_line ${m || ""} ${p.id == u ? "dhx_cal_agenda_event_line_selected" : ""}" ${w} ${e.config.event_attribute}="${p.id}">
	<div class="dhx_cal_agenda_event_line_marker"></div>
	<div class="dhx_cal_agenda_event_line_time">${h}</div>
	<div class="dhx_cal_agenda_event_line_text">${y}</div>
</div>`;
        }(0, f);
      }), c += "</div></div>", c;
    }
    e.render_view_data = function() {
      return this._mode == "agenda" && (r = e._els.dhx_cal_data[0].scrollTop, e._els.dhx_cal_data[0].scrollTop = 0), o.apply(this, arguments);
    }, e.agenda_view = function(d) {
      d ? (e._min_date = e.config.agenda_start || e.date.agenda_start(e._date), e._max_date = e.config.agenda_end || e.date.add_agenda(e._min_date, 1), e._cols = null, e._colsS = null, e._table_view = !0, e._getNavDateElement().innerHTML = e.templates.agenda_date(e._date), _()) : e._table_view = !1;
    };
  });
}, all_timed: function(e) {
  e.config.all_timed = "short", e.config.all_timed_month = !1, e.ext.allTimed = { isMainAreaEvent: function(_) {
    return !!(_._timed || e.config.all_timed === !0 || e.config.all_timed == "short" && i(_));
  } };
  var i = function(_) {
    return !((_.end_date - _.start_date) / 36e5 >= 24) || e._drag_mode == "resize" && e._drag_id == _.id;
  };
  e._safe_copy = function(_) {
    var a = null, d = e._copy_event(_);
    return _.event_pid && (a = e.getEvent(_.event_pid)), a && a.isPrototypeOf(_) && (delete d.event_length, delete d.event_pid, delete d.rec_pattern, delete d.rec_type), d;
  };
  var t = e._pre_render_events_line, r = e._pre_render_events_table, s = function(_, a) {
    return this._table_view ? r.call(this, _, a) : t.call(this, _, a);
  };
  e._pre_render_events_line = e._pre_render_events_table = function(_, a) {
    if (!this.config.all_timed || this._table_view && this._mode != "month" || this._mode == "month" && !this.config.all_timed_month)
      return s.call(this, _, a);
    for (var d = 0; d < _.length; d++) {
      var l = _[d];
      if (!l._timed)
        if (this.config.all_timed != "short" || i(l)) {
          var c = this._safe_copy(l);
          l._virtual ? c._first_chunk = !1 : c._first_chunk = !0, c._drag_resize = !1, c._virtual = !0, c.start_date = new Date(c.start_date), h(l) ? (c.end_date = u(c.start_date), this.config.last_hour != 24 && (c.end_date = m(c.start_date, this.config.last_hour))) : c.end_date = new Date(l.end_date);
          var f = !1;
          c.start_date < this._max_date && c.end_date > this._min_date && c.start_date < c.end_date && (_[d] = c, f = !0);
          var v = this._safe_copy(l);
          if (v._virtual = !0, v.end_date = new Date(v.end_date), v.start_date < this._min_date ? v.start_date = m(this._min_date, this.config.first_hour) : v.start_date = m(u(l.start_date), this.config.first_hour), v.start_date < this._max_date && v.start_date < v.end_date) {
            if (!f) {
              _[d--] = v;
              continue;
            }
            _.splice(d + 1, 0, v), v._last_chunk = !1;
          } else
            c._last_chunk = !0, c._drag_resize = !0;
        } else
          this._mode != "month" && _.splice(d--, 1);
    }
    var p = this._drag_mode != "move" && a;
    return s.call(this, _, p);
    function h(y) {
      var w = u(y.start_date);
      return +y.end_date > +w;
    }
    function u(y) {
      var w = e.date.add(y, 1, "day");
      return w = e.date.date_part(w);
    }
    function m(y, w) {
      var D = e.date.date_part(new Date(y));
      return D.setHours(w), D;
    }
  };
  var n = e.get_visible_events;
  e.get_visible_events = function(_) {
    return this.config.all_timed && this.config.multi_day ? n.call(this, !1) : n.call(this, _);
  }, e.attachEvent("onBeforeViewChange", function(_, a, d, l) {
    return e._allow_dnd = d == "day" || d == "week" || e.getView(d), !0;
  }), e._is_main_area_event = function(_) {
    return e.ext.allTimed.isMainAreaEvent(_);
  };
  var o = e.updateEvent;
  e.updateEvent = function(_) {
    var a, d, l = e.getEvent(_);
    l && (a = e.config.all_timed && !(e.isOneDayEvent(e._events[_]) || e.getState().drag_id)) && (d = e.config.update_render, e.config.update_render = !0), o.apply(e, arguments), l && a && (e.config.update_render = d);
  };
}, collision: function(e) {
  let i, t;
  function r(s) {
    e._get_section_view() && s && (i = e.getEvent(s)[e._get_section_property()]);
  }
  e.config.collision_limit = 1, e.attachEvent("onBeforeDrag", function(s) {
    return r(s), !0;
  }), e.attachEvent("onBeforeLightbox", function(s) {
    const n = e.getEvent(s);
    return t = [n.start_date, n.end_date], r(s), !0;
  }), e.attachEvent("onEventChanged", function(s) {
    if (!s || !e.getEvent(s))
      return !0;
    const n = e.getEvent(s);
    if (!e.checkCollision(n)) {
      if (!t)
        return !1;
      n.start_date = t[0], n.end_date = t[1], n._timed = this.isOneDayEvent(n);
    }
    return !0;
  }), e.attachEvent("onBeforeEventChanged", function(s, n, o) {
    return e.checkCollision(s);
  }), e.attachEvent("onEventAdded", function(s, n) {
    e.checkCollision(n) || e.deleteEvent(s);
  }), e.attachEvent("onEventSave", function(s, n, o) {
    if ((n = e._lame_clone(n)).id = s, !n.start_date || !n.end_date) {
      const _ = e.getEvent(s);
      n.start_date = new Date(_.start_date), n.end_date = new Date(_.end_date);
    }
    return (n.rrule && !n.recurring_event_id || n.rec_type) && e._roll_back_dates(n), e.checkCollision(n);
  }), e._check_sections_collision = function(s, n) {
    const o = e._get_section_property();
    return s[o] == n[o] && s.id != n.id;
  }, e.checkCollision = function(s) {
    let n = [];
    const o = e.config.collision_limit;
    if (s.rec_type) {
      let l = e.getRecDates(s);
      for (let c = 0; c < l.length; c++) {
        let f = e.getEvents(l[c].start_date, l[c].end_date);
        for (let v = 0; v < f.length; v++)
          (f[v].event_pid || f[v].id) != s.id && n.push(f[v]);
      }
    } else if (s.rrule) {
      let l = e.getRecDates(s);
      for (let c = 0; c < l.length; c++) {
        let f = e.getEvents(l[c].start_date, l[c].end_date);
        for (let v = 0; v < f.length; v++)
          (String(f[v].id).split("#")[0] || f[v].id) != s.id && n.push(f[v]);
      }
    } else {
      n = e.getEvents(s.start_date, s.end_date);
      for (let l = 0; l < n.length; l++) {
        let c = n[l];
        if (c.id == s.id || c.event_length && [c.event_pid, c.event_length].join("#") == s.id) {
          n.splice(l, 1);
          break;
        }
        if (c.recurring_event_id && [c.recurring_event_id, c._pid_time].join("#") == s.id) {
          n.splice(l, 1);
          break;
        }
      }
    }
    const _ = e._get_section_view(), a = e._get_section_property();
    let d = !0;
    if (_) {
      let l = 0;
      for (let c = 0; c < n.length; c++)
        n[c].id != s.id && this._check_sections_collision(n[c], s) && l++;
      l >= o && (d = !1);
    } else
      n.length >= o && (d = !1);
    if (!d) {
      let l = !e.callEvent("onEventCollision", [s, n]);
      return l || (s[a] = i || s[a]), l;
    }
    return d;
  };
}, container_autoresize: function(e) {
  e.config.container_autoresize = !0, e.config.month_day_min_height = 90, e.config.min_grid_size = 25, e.config.min_map_size = 400;
  var i = e._pre_render_events, t = !0, r = 0, s = 0;
  e._pre_render_events = function(l, c) {
    if (!e.config.container_autoresize || !t)
      return i.apply(this, arguments);
    var f = this.xy.bar_height, v = this._colsS.heights, p = this._colsS.heights = [0, 0, 0, 0, 0, 0, 0], h = this._els.dhx_cal_data[0];
    if (l = this._table_view ? this._pre_render_events_table(l, c) : this._pre_render_events_line(l, c), this._table_view)
      if (c)
        this._colsS.heights = v;
      else {
        var u = h.firstChild;
        const g = u.querySelectorAll(".dhx_cal_month_row");
        if (g && g.length) {
          for (var m = 0; m < g.length; m++) {
            if (p[m]++, p[m] * f > this._colsS.height - this.xy.month_head_height) {
              var y = g[m].querySelectorAll(".dhx_cal_month_cell"), w = this._colsS.height - this.xy.month_head_height;
              1 * this.config.max_month_events !== this.config.max_month_events || p[m] <= this.config.max_month_events ? w = p[m] * f : (this.config.max_month_events + 1) * f > this._colsS.height - this.xy.month_head_height && (w = (this.config.max_month_events + 1) * f), g[m].style.height = w + this.xy.month_head_height + "px";
              for (var D = 0; D < y.length; D++)
                y[D].childNodes[1].style.height = w + "px";
              p[m] = (p[m - 1] || 0) + y[0].offsetHeight;
            }
            p[m] = (p[m - 1] || 0) + g[m].querySelectorAll(".dhx_cal_month_cell")[0].offsetHeight;
          }
          p.unshift(0), u.parentNode.offsetHeight < u.parentNode.scrollHeight && u._h_fix;
        } else if (l.length || this._els.dhx_multi_day[0].style.visibility != "visible" || (p[0] = -1), l.length || p[0] == -1) {
          var E = (p[0] + 1) * f + 1;
          s != E + 1 && (this._obj.style.height = r - s + E - 1 + "px"), E += "px";
          const b = this._els.dhx_cal_navline[0].offsetHeight, x = this._els.dhx_cal_header[0].offsetHeight;
          h.style.height = this._obj.offsetHeight - b - x - (this.xy.margin_top || 0) + "px";
          var S = this._els.dhx_multi_day[0];
          S.style.height = E, S.style.visibility = p[0] == -1 ? "hidden" : "visible", S.style.display = p[0] == -1 ? "none" : "", (S = this._els.dhx_multi_day[1]).style.height = E, S.style.visibility = p[0] == -1 ? "hidden" : "visible", S.style.display = p[0] == -1 ? "none" : "", S.className = p[0] ? "dhx_multi_day_icon" : "dhx_multi_day_icon_small", this._dy_shift = (p[0] + 1) * f, p[0] = 0;
        }
      }
    return l;
  };
  var n = ["dhx_cal_navline", "dhx_cal_header", "dhx_multi_day", "dhx_cal_data"], o = function(l) {
    r = 0;
    for (var c = 0; c < n.length; c++) {
      var f = n[c], v = e._els[f] ? e._els[f][0] : null, p = 0;
      switch (f) {
        case "dhx_cal_navline":
        case "dhx_cal_header":
          p = v.offsetHeight;
          break;
        case "dhx_multi_day":
          p = v ? v.offsetHeight - 1 : 0, s = p;
          break;
        case "dhx_cal_data":
          var h = e.getState().mode;
          if (v.childNodes[1] && h != "month") {
            let N = 0;
            for (let T = 0; T < v.childNodes.length; T++)
              v.childNodes[T].offsetHeight > N && (N = v.childNodes[T].offsetHeight);
            p = N;
          } else
            p = Math.max(v.offsetHeight - 1, v.scrollHeight);
          if (h == "month")
            e.config.month_day_min_height && !l && (p = v.querySelectorAll(".dhx_cal_month_row").length * e.config.month_day_min_height), l && (v.style.height = p + "px");
          else if (h == "year")
            p = 190 * e.config.year_y;
          else if (h == "agenda") {
            if (p = 0, v.childNodes && v.childNodes.length)
              for (var u = 0; u < v.childNodes.length; u++)
                p += v.childNodes[u].offsetHeight;
            p + 2 < e.config.min_grid_size ? p = e.config.min_grid_size : p += 2;
          } else if (h == "week_agenda") {
            for (var m, y, w = e.xy.week_agenda_scale_height + e.config.min_grid_size, D = 0; D < v.childNodes.length; D++)
              for (y = v.childNodes[D], u = 0; u < y.childNodes.length; u++) {
                for (var E = 0, S = y.childNodes[u].childNodes[1], g = 0; g < S.childNodes.length; g++)
                  E += S.childNodes[g].offsetHeight;
                m = E + e.xy.week_agenda_scale_height, (m = D != 1 || u != 2 && u != 3 ? m : 2 * m) > w && (w = m);
              }
            p = 3 * w;
          } else if (h == "map") {
            p = 0;
            var b = v.querySelectorAll(".dhx_map_line");
            for (u = 0; u < b.length; u++)
              p += b[u].offsetHeight;
            p + 2 < e.config.min_map_size ? p = e.config.min_map_size : p += 2;
          } else if (e._gridView)
            if (p = 0, v.childNodes[1].childNodes[0].childNodes && v.childNodes[1].childNodes[0].childNodes.length) {
              for (b = v.childNodes[1].childNodes[0].childNodes[0].childNodes, u = 0; u < b.length; u++)
                p += b[u].offsetHeight;
              (p += 2) < e.config.min_grid_size && (p = e.config.min_grid_size);
            } else
              p = e.config.min_grid_size;
          if (e.matrix && e.matrix[h]) {
            if (l)
              p += 0, v.style.height = p + "px";
            else {
              p = 0;
              for (var x = e.matrix[h], k = x.y_unit, M = 0; M < k.length; M++)
                p += x.getSectionHeight(k[M].key);
              e.$container.clientWidth != e.$container.scrollWidth && (p += d());
            }
            p -= 1;
          }
          (h == "day" || h == "week" || e._props && e._props[h]) && (p += 2);
      }
      r += p += 1;
    }
    e._obj.style.height = r + "px", l || e.updateView();
  };
  function _() {
    t = !1, e.callEvent("onAfterSchedulerResize", []), t = !0;
  }
  var a = function() {
    if (!e.config.container_autoresize || !t)
      return !0;
    var l = e.getState().mode;
    if (!l)
      return !0;
    var c = window.requestAnimationFrame || window.setTimeout, f = document.documentElement.scrollTop;
    c(function() {
      !e.$destroyed && e.$initialized && o();
    }), e.matrix && e.matrix[l] || l == "month" ? c(function() {
      !e.$destroyed && e.$initialized && (o(!0), document.documentElement.scrollTop = f, _());
    }, 1) : _();
  };
  function d() {
    var l = document.createElement("div");
    l.style.cssText = "visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;", document.body.appendChild(l);
    var c = l.offsetWidth - l.clientWidth;
    return document.body.removeChild(l), c;
  }
  e.attachEvent("onBeforeViewChange", function() {
    var l = e.config.container_autoresize;
    if (e.xy.$original_scroll_width || (e.xy.$original_scroll_width = e.xy.scroll_width), e.xy.scroll_width = l ? 0 : e.xy.$original_scroll_width, e.matrix)
      for (var c in e.matrix) {
        var f = e.matrix[c];
        f.$original_section_autoheight || (f.$original_section_autoheight = f.section_autoheight), f.section_autoheight = !l && f.$original_section_autoheight;
      }
    return !0;
  }), e.attachEvent("onViewChange", a), e.attachEvent("onXLE", a), e.attachEvent("onEventChanged", a), e.attachEvent("onEventCreated", a), e.attachEvent("onEventAdded", a), e.attachEvent("onEventDeleted", a), e.attachEvent("onAfterSchedulerResize", a), e.attachEvent("onClearAll", a), e.attachEvent("onBeforeExpand", function() {
    return t = !1, !0;
  }), e.attachEvent("onBeforeCollapse", function() {
    return t = !0, !0;
  });
}, cookie: function(e) {
  function i(s) {
    return (s._obj.id || "scheduler") + "_settings";
  }
  var t = !0;
  e.attachEvent("onBeforeViewChange", function(s, n, o, _) {
    if (t && e._get_url_nav) {
      var a = e._get_url_nav();
      (a.date || a.mode || a.event) && (t = !1);
    }
    var d = i(e);
    if (t) {
      t = !1;
      var l = function(f) {
        var v = f + "=";
        if (document.cookie.length > 0) {
          var p = document.cookie.indexOf(v);
          if (p != -1) {
            p += v.length;
            var h = document.cookie.indexOf(";", p);
            return h == -1 && (h = document.cookie.length), document.cookie.substring(p, h);
          }
        }
        return "";
      }(d);
      if (l) {
        e._min_date || (e._min_date = _), (l = unescape(l).split("@"))[0] = this._helpers.parseDate(l[0]);
        var c = this.isViewExists(l[1]) ? l[1] : o;
        return _ = isNaN(+l[0]) ? _ : l[0], window.setTimeout(function() {
          e.$destroyed || e.setCurrentView(_, c);
        }, 1), !1;
      }
    }
    return !0;
  }), e.attachEvent("onViewChange", function(s, n) {
    var o, _, a = i(e), d = escape(this._helpers.formatDate(n) + "@" + s);
    _ = a + "=" + d + ((o = "expires=Sun, 31 Jan 9999 22:00:00 GMT") ? "; " + o : ""), document.cookie = _;
  });
  var r = e._load;
  e._load = function() {
    var s = arguments;
    if (e._date)
      r.apply(this, s);
    else {
      var n = this;
      window.setTimeout(function() {
        r.apply(n, s);
      }, 1);
    }
  };
}, daytimeline: function(e) {
  le("Day Timeline", e.assert);
}, drag_between: function(e) {
  le("Drag Between", e.assert);
}, editors: function(e) {
  e.form_blocks.combo = { render: function(i) {
    i.cached_options || (i.cached_options = {});
    var t = "";
    return t += "<div class='" + i.type + "' ></div>";
  }, set_value: function(i, t, r, s) {
    (function() {
      v();
      var f = e.attachEvent("onAfterLightbox", function() {
        v(), e.detachEvent(f);
      });
      function v() {
        if (i._combo && i._combo.DOMParent) {
          var p = i._combo;
          p.unload ? p.unload() : p.destructor && p.destructor(), p.DOMParent = p.DOMelem = null;
        }
      }
    })(), window.dhx_globalImgPath = s.image_path || "/", i._combo = new dhtmlXCombo(i, s.name, i.offsetWidth - 8), s.onchange && i._combo.attachEvent("onChange", s.onchange), s.options_height && i._combo.setOptionHeight(s.options_height);
    var n = i._combo;
    if (n.enableFilteringMode(s.filtering, s.script_path || null, !!s.cache), s.script_path) {
      var o = r[s.map_to];
      o ? s.cached_options[o] ? (n.addOption(o, s.cached_options[o]), n.disable(1), n.selectOption(0), n.disable(0)) : e.ajax.get(s.script_path + "?id=" + o + "&uid=" + e.uid(), function(f) {
        var v, p = f.xmlDoc.responseText;
        try {
          v = JSON.parse(p).options[0].text;
        } catch {
          v = e.ajax.xpath("//option", f.xmlDoc)[0].childNodes[0].nodeValue;
        }
        s.cached_options[o] = v, n.addOption(o, v), n.disable(1), n.selectOption(0), n.disable(0);
      }) : n.setComboValue("");
    } else {
      for (var _ = [], a = 0; a < s.options.length; a++) {
        var d = s.options[a], l = [d.key, d.label, d.css];
        _.push(l);
      }
      if (n.addOption(_), r[s.map_to]) {
        var c = n.getIndexByValue(r[s.map_to]);
        n.selectOption(c);
      }
    }
  }, get_value: function(i, t, r) {
    var s = i._combo.getSelectedValue();
    return r.script_path && (r.cached_options[s] = i._combo.getSelectedText()), s;
  }, focus: function(i) {
  } }, e.form_blocks.radio = { render: function(i) {
    var t = "";
    t += `<div class='dhx_cal_ltext dhx_cal_radio ${i.vertical ? "dhx_cal_radio_vertical" : ""}' style='max-height:${i.height}px;'>`;
    for (var r = 0; r < i.options.length; r++) {
      var s = e.uid();
      t += "<label class='dhx_cal_radio_item' for='" + s + "'><input id='" + s + "' type='radio' name='" + i.name + "' value='" + i.options[r].key + "'><span> " + i.options[r].label + "</span></label>";
    }
    return t += "</div>";
  }, set_value: function(i, t, r, s) {
    for (var n = i.getElementsByTagName("input"), o = 0; o < n.length; o++) {
      n[o].checked = !1;
      var _ = r[s.map_to] || t;
      n[o].value == _ && (n[o].checked = !0);
    }
  }, get_value: function(i, t, r) {
    for (var s = i.getElementsByTagName("input"), n = 0; n < s.length; n++)
      if (s[n].checked)
        return s[n].value;
  }, focus: function(i) {
  } }, e.form_blocks.checkbox = { render: function(i) {
    return e.config.wide_form ? '<div class="dhx_cal_wide_checkbox"></div>' : "";
  }, set_value: function(i, t, r, s) {
    i = e._lightbox.querySelector(`#${s.id}`);
    var n = e.uid(), o = s.checked_value !== void 0 ? t == s.checked_value : !!t;
    i.className += " dhx_cal_checkbox";
    var _ = "<input id='" + n + "' type='checkbox' value='true' name='" + s.name + "'" + (o ? "checked='true'" : "") + "'>", a = "<label for='" + n + "'>" + (e.locale.labels["section_" + s.name] || s.name) + "</label>";
    if (e.config.wide_form ? (i.innerHTML = a, i.nextSibling.innerHTML = _) : i.innerHTML = _ + a, s.handler) {
      var d = i.getElementsByTagName("input")[0];
      if (d.$_eventAttached)
        return;
      d.$_eventAttached = !0, e.event(d, "click", s.handler);
    }
  }, get_value: function(i, t, r) {
    var s = (i = e._lightbox.querySelector(`#${r.id}`)).getElementsByTagName("input")[0];
    return s || (s = i.nextSibling.getElementsByTagName("input")[0]), s.checked ? r.checked_value || !0 : r.unchecked_value || !1;
  }, focus: function(i) {
  } };
}, expand: function(e) {
  e.ext.fullscreen = { toggleIcon: null }, e.expand = function() {
    if (e.callEvent("onBeforeExpand", [])) {
      var i = e._obj;
      do
        i._position = i.style.position || "", i.style.position = "static";
      while ((i = i.parentNode) && i.style);
      (i = e._obj).style.position = "absolute", i._width = i.style.width, i._height = i.style.height, i.style.width = i.style.height = "100%", i.style.top = i.style.left = "0px";
      var t = document.body;
      t.scrollTop = 0, (t = t.parentNode) && (t.scrollTop = 0), document.body._overflow = document.body.style.overflow || "", document.body.style.overflow = "hidden", e._maximize(), e.callEvent("onExpand", []);
    }
  }, e.collapse = function() {
    if (e.callEvent("onBeforeCollapse", [])) {
      var i = e._obj;
      do
        i.style.position = i._position;
      while ((i = i.parentNode) && i.style);
      (i = e._obj).style.width = i._width, i.style.height = i._height, document.body.style.overflow = document.body._overflow, e._maximize(), e.callEvent("onCollapse", []);
    }
  }, e.attachEvent("onTemplatesReady", function() {
    var i = document.createElement("div");
    i.className = "dhx_expand_icon", e.ext.fullscreen.toggleIcon = i, i.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
	`, e._obj.appendChild(i), e.event(i, "click", function() {
      e.expanded ? e.collapse() : e.expand();
    });
  }), e._maximize = function() {
    this.expanded = !this.expanded, this.expanded ? this.ext.fullscreen.toggleIcon.classList.add("dhx_expand_icon--expanded") : this.ext.fullscreen.toggleIcon.classList.remove("dhx_expand_icon--expanded");
    for (var i = ["left", "top"], t = 0; t < i.length; t++) {
      var r = e["_prev_margin_" + i[t]];
      e.xy["margin_" + i[t]] ? (e["_prev_margin_" + i[t]] = e.xy["margin_" + i[t]], e.xy["margin_" + i[t]] = 0) : r && (e.xy["margin_" + i[t]] = e["_prev_margin_" + i[t]], delete e["_prev_margin_" + i[t]]);
    }
    e.setCurrentView();
  };
}, export_api: function(e) {
  (function() {
    function i(r, s) {
      for (var n in s)
        r[n] || (r[n] = s[n]);
      return r;
    }
    function t(r, s) {
      var n = {};
      return (r = s._els[r]) && r[0] ? (n.x = r[0].scrollWidth, n.y = r[0].scrollHeight) : (n.x = 0, n.y = 0), n;
    }
    window.dhtmlxAjax || (window.dhtmlxAjax = { post: function(r, s, n) {
      return window.dhx4.ajax.post(r, s, n);
    }, get: function(r, s) {
      return window.ajax.get(r, s);
    } }), function(r) {
      function s() {
        var n = r.getState().mode;
        return r.matrix && r.matrix[n] ? r.matrix[n] : null;
      }
      r.exportToPDF = function(n) {
        (n = i(n || {}, { name: "calendar.pdf", format: "A4", orientation: "landscape", dpi: 96, zoom: 1, rtl: r.config.rtl })).html = this._export_html(n), n.mode = this.getState().mode, this._send_to_export(n, "pdf");
      }, r.exportToPNG = function(n) {
        (n = i(n || {}, { name: "calendar.png", format: "A4", orientation: "landscape", dpi: 96, zoom: 1, rtl: r.config.rtl })).html = this._export_html(n), n.mode = this.getState().mode, this._send_to_export(n, "png");
      }, r.exportToICal = function(n) {
        n = i(n || {}, { name: "calendar.ical", data: this._serialize_plain(null, n) }), this._send_to_export(n, "ical");
      }, r.exportToExcel = function(n) {
        n = i(n || {}, { name: "calendar.xlsx", title: "Events", data: this._serialize_plain(this.templates.xml_format, n), columns: this._serialize_columns() }), this._send_to_export(n, "excel");
      }, r._ajax_to_export = function(n, o, _) {
        delete n.callback;
        var a = n.server || "https://export.dhtmlx.com/scheduler";
        window.dhtmlxAjax.post(a, "type=" + o + "&store=1&data=" + encodeURIComponent(JSON.stringify(n)), function(d) {
          var l = null;
          if (!(d.xmlDoc.status > 400))
            try {
              l = JSON.parse(d.xmlDoc.responseText);
            } catch {
            }
          _(l);
        });
      }, r._plain_export_copy = function(n, o) {
        var _ = {};
        for (var a in n)
          _[a] = n[a];
        return _.start_date = o(_.start_date), _.end_date = o(_.end_date), _.$text = this.templates.event_text(n.start_date, n.end_date, n), _;
      }, r._serialize_plain = function(n, o) {
        var _;
        n = n || r.date.date_to_str("%Y%m%dT%H%i%s", !0), _ = o && o.start && o.end ? r.getEvents(o.start, o.end) : r.getEvents();
        for (var a = [], d = 0; d < _.length; d++)
          a[d] = this._plain_export_copy(_[d], n);
        return a;
      }, r._serialize_columns = function() {
        return [{ id: "start_date", header: "Start Date", width: 30 }, { id: "end_date", header: "End Date", width: 30 }, { id: "$text", header: "Text", width: 100 }];
      }, r._send_to_export = function(n, o) {
        if (n.version || (n.version = r.version), n.skin || (n.skin = r.skin), n.callback)
          return r._ajax_to_export(n, o, n.callback);
        var _ = this._create_hidden_form();
        _.firstChild.action = n.server || "https://export.dhtmlx.com/scheduler", _.firstChild.childNodes[0].value = JSON.stringify(n), _.firstChild.childNodes[1].value = o, _.firstChild.submit();
      }, r._create_hidden_form = function() {
        if (!this._hidden_export_form) {
          var n = this._hidden_export_form = document.createElement("div");
          n.style.display = "none", n.innerHTML = "<form method='POST' target='_blank'><input type='text' name='data'><input type='hidden' name='type' value=''></form>", document.body.appendChild(n);
        }
        return this._hidden_export_form;
      }, r._get_export_size = function(n, o, _, a, d, l, c) {
        a = parseInt(a) / 25.4 || 4;
        var f = { A5: { x: 148, y: 210 }, A4: { x: 210, y: 297 }, A3: { x: 297, y: 420 }, A2: { x: 420, y: 594 }, A1: { x: 594, y: 841 }, A0: { x: 841, y: 1189 } }, v = t("dhx_cal_data", this).x, p = { y: t("dhx_cal_data", this).y + t("dhx_cal_header", this).y + t("dhx_multi_day", this).y };
        return p.x = n === "full" ? v : Math.floor((o === "landscape" ? f[n].y : f[n].x) * a), c && (p.x *= parseFloat(c.x) || 1, p.y *= parseFloat(c.y) || 1), p;
      }, r._export_html = function(n) {
        var o, _, a, d = (o = void 0, _ = void 0, (a = s()) && (_ = a.scrollable, o = a.smart_rendering), { nav_height: r.xy.nav_height, scroll_width: r.xy.scroll_width, style_width: r._obj.style.width, style_height: r._obj.style.height, timeline_scrollable: _, timeline_smart_rendering: o }), l = r._get_export_size(n.format, n.orientation, n.zoom, n.dpi, n.header, n.footer, n.scales), c = "";
        try {
          (function(f, v) {
            r._obj.style.width = f.x + "px", r._obj.style.height = f.y + "px", r.xy.nav_height = 0, r.xy.scroll_width = 0;
            var p = s();
            (v.timeline_scrollable || v.timeline_smart_rendering) && (p.scrollable = !1, p.smart_rendering = !1);
          })(l, d), r.setCurrentView(), c = r._obj.innerHTML;
        } catch (f) {
          console.error(f);
        } finally {
          (function(f) {
            r.xy.scroll_width = f.scroll_width, r.xy.nav_height = f.nav_height, r._obj.style.width = f.style_width, r._obj.style.height = f.style_height;
            var v = s();
            (f.timeline_scrollable || f.timeline_smart_rendering) && (v.scrollable = f.timeline_scrollable, v.smart_rendering = f.timeline_smart_rendering);
          })(d), r.setCurrentView();
        }
        return c;
      };
    }(e);
  })();
}, grid_view: function(e) {
  le("Grid", e.assert);
}, html_templates: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    for (var i = document.body.getElementsByTagName("DIV"), t = 0; t < i.length; t++) {
      var r = i[t].className || "";
      if ((r = r.split(":")).length == 2 && r[0] == "template") {
        var s = 'return "' + (i[t].innerHTML || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\n\r]+/g, "") + '";';
        s = unescape(s).replace(/\{event\.([a-z]+)\}/g, function(n, o) {
          return '"+ev.' + o + '+"';
        }), e.templates[r[1]] = Function("start", "end", "ev", s), i[t].style.display = "none";
      }
    }
  });
}, key_nav: function(e) {
  function i(t) {
    var r = { minicalButton: e.$keyboardNavigation.MinicalButton, minicalDate: e.$keyboardNavigation.MinicalCell, scheduler: e.$keyboardNavigation.SchedulerNode, dataArea: e.$keyboardNavigation.DataArea, timeSlot: e.$keyboardNavigation.TimeSlot, event: e.$keyboardNavigation.Event }, s = {};
    for (var n in r)
      s[n.toLowerCase()] = r[n];
    return s[t = (t + "").toLowerCase()] || r.scheduler;
  }
  e.config.key_nav = !0, e.config.key_nav_step = 30, e.addShortcut = function(t, r, s) {
    var n = i(s);
    n && n.prototype.bind(t, r);
  }, e.getShortcutHandler = function(t, r) {
    var s = i(r);
    if (s) {
      var n = e.$keyboardNavigation.shortcuts.parse(t);
      if (n.length)
        return s.prototype.findHandler(n[0]);
    }
  }, e.removeShortcut = function(t, r) {
    var s = i(r);
    s && s.prototype.unbind(t);
  }, e.focus = function() {
    if (e.config.key_nav) {
      var t = e.$keyboardNavigation.dispatcher;
      t.enable();
      var r = t.getActiveNode();
      !r || r instanceof e.$keyboardNavigation.MinicalButton || r instanceof e.$keyboardNavigation.MinicalCell ? t.setDefaultNode() : t.focusNode(t.getActiveNode());
    }
  }, e.$keyboardNavigation = {}, e._compose = function() {
    for (var t = Array.prototype.slice.call(arguments, 0), r = {}, s = 0; s < t.length; s++) {
      var n = t[s];
      for (var o in typeof n == "function" && (n = new n()), n)
        r[o] = n[o];
    }
    return r;
  }, function(t) {
    t.$keyboardNavigation.shortcuts = { createCommand: function() {
      return { modifiers: { shift: !1, alt: !1, ctrl: !1, meta: !1 }, keyCode: null };
    }, parse: function(r) {
      for (var s = [], n = this.getExpressions(this.trim(r)), o = 0; o < n.length; o++) {
        for (var _ = this.getWords(n[o]), a = this.createCommand(), d = 0; d < _.length; d++)
          this.commandKeys[_[d]] ? a.modifiers[_[d]] = !0 : this.specialKeys[_[d]] ? a.keyCode = this.specialKeys[_[d]] : a.keyCode = _[d].charCodeAt(0);
        s.push(a);
      }
      return s;
    }, getCommandFromEvent: function(r) {
      var s = this.createCommand();
      s.modifiers.shift = !!r.shiftKey, s.modifiers.alt = !!r.altKey, s.modifiers.ctrl = !!r.ctrlKey, s.modifiers.meta = !!r.metaKey, s.keyCode = r.which || r.keyCode, s.keyCode >= 96 && s.keyCode <= 105 && (s.keyCode -= 48);
      var n = String.fromCharCode(s.keyCode);
      return n && (s.keyCode = n.toLowerCase().charCodeAt(0)), s;
    }, getHashFromEvent: function(r) {
      return this.getHash(this.getCommandFromEvent(r));
    }, getHash: function(r) {
      var s = [];
      for (var n in r.modifiers)
        r.modifiers[n] && s.push(n);
      return s.push(r.keyCode), s.join(this.junctionChar);
    }, getExpressions: function(r) {
      return r.split(this.junctionChar);
    }, getWords: function(r) {
      return r.split(this.combinationChar);
    }, trim: function(r) {
      return r.replace(/\s/g, "");
    }, junctionChar: ",", combinationChar: "+", commandKeys: { shift: 16, alt: 18, ctrl: 17, meta: !0 }, specialKeys: { backspace: 8, tab: 9, enter: 13, esc: 27, space: 32, up: 38, down: 40, left: 37, right: 39, home: 36, end: 35, pageup: 33, pagedown: 34, delete: 46, insert: 45, plus: 107, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123 } };
  }(e), function(t) {
    t.$keyboardNavigation.EventHandler = { _handlers: null, findHandler: function(r) {
      this._handlers || (this._handlers = {});
      var s = t.$keyboardNavigation.shortcuts.getHash(r);
      return this._handlers[s];
    }, doAction: function(r, s) {
      var n = this.findHandler(r);
      n && (n.call(this, s), s.preventDefault ? s.preventDefault() : s.returnValue = !1);
    }, bind: function(r, s) {
      this._handlers || (this._handlers = {});
      for (var n = t.$keyboardNavigation.shortcuts, o = n.parse(r), _ = 0; _ < o.length; _++)
        this._handlers[n.getHash(o[_])] = s;
    }, unbind: function(r) {
      for (var s = t.$keyboardNavigation.shortcuts, n = s.parse(r), o = 0; o < n.length; o++)
        this._handlers[s.getHash(n[o])] && delete this._handlers[s.getHash(n[o])];
    }, bindAll: function(r) {
      for (var s in r)
        this.bind(s, r[s]);
    }, initKeys: function() {
      this._handlers || (this._handlers = {}), this.keys && this.bindAll(this.keys);
    } };
  }(e), function(t) {
    t.$keyboardNavigation.getFocusableNodes = t._getFocusableNodes, t.$keyboardNavigation.trapFocus = function(r, s) {
      if (s.keyCode != 9)
        return !1;
      for (var n, o = t.$keyboardNavigation.getFocusableNodes(r), _ = document.activeElement, a = -1, d = 0; d < o.length; d++)
        if (o[d] == _) {
          a = d;
          break;
        }
      if (s.shiftKey) {
        if (n = o[a <= 0 ? o.length - 1 : a - 1])
          return n.focus(), s.preventDefault(), !0;
      } else if (n = o[a >= o.length - 1 ? 0 : a + 1])
        return n.focus(), s.preventDefault(), !0;
      return !1;
    };
  }(e), function(t) {
    t.$keyboardNavigation.marker = { clear: function() {
      for (var r = t.$container.querySelectorAll(".dhx_focus_slot"), s = 0; s < r.length; s++)
        r[s].parentNode.removeChild(r[s]);
    }, createElement: function() {
      var r = document.createElement("div");
      return r.setAttribute("tabindex", -1), r.className = "dhx_focus_slot", r;
    }, renderMultiple: function(r, s, n) {
      for (var o = [], _ = new Date(r), a = new Date(Math.min(s.valueOf(), t.date.add(t.date.day_start(new Date(r)), 1, "day").valueOf())); _.valueOf() < s.valueOf(); )
        o = o.concat(n.call(this, _, new Date(Math.min(a.valueOf(), s.valueOf())))), _ = t.date.day_start(t.date.add(_, 1, "day")), a = t.date.day_start(t.date.add(_, 1, "day")), a = new Date(Math.min(a.valueOf(), s.valueOf()));
      return o;
    }, render: function(r, s, n) {
      this.clear();
      var o = [], _ = t.$keyboardNavigation.TimeSlot.prototype._modes;
      switch (t.$keyboardNavigation.TimeSlot.prototype._getMode()) {
        case _.units:
          o = this.renderVerticalMarker(r, s, n);
          break;
        case _.timeline:
          o = this.renderTimelineMarker(r, s, n);
          break;
        case _.year:
          o = o.concat(this.renderMultiple(r, s, this.renderYearMarker));
          break;
        case _.month:
          o = this.renderMonthMarker(r, s);
          break;
        case _.weekAgenda:
          o = o.concat(this.renderMultiple(r, s, this.renderWeekAgendaMarker));
          break;
        case _.list:
          o = this.renderAgendaMarker(r, s);
          break;
        case _.dayColumns:
          o = o.concat(this.renderMultiple(r, s, this.renderVerticalMarker));
      }
      this.addWaiAriaLabel(o, r, s, n), this.addDataAttributes(o, r, s, n);
      for (var a = o.length - 1; a >= 0; a--)
        if (o[a].offsetWidth)
          return o[a];
      return null;
    }, addDataAttributes: function(r, s, n, o) {
      for (var _ = t.date.date_to_str(t.config.api_date), a = _(s), d = _(n), l = 0; l < r.length; l++)
        r[l].setAttribute("data-start-date", a), r[l].setAttribute("data-end-date", d), o && r[l].setAttribute("data-section", o);
    }, addWaiAriaLabel: function(r, s, n, o) {
      var _ = "", a = t.getState().mode, d = !1;
      if (_ += t.templates.day_date(s), t.date.day_start(new Date(s)).valueOf() != s.valueOf() && (_ += " " + t.templates.hour_scale(s), d = !0), t.date.day_start(new Date(s)).valueOf() != t.date.day_start(new Date(n)).valueOf() && (_ += " - " + t.templates.day_date(n), (d || t.date.day_start(new Date(n)).valueOf() != n.valueOf()) && (_ += " " + t.templates.hour_scale(n))), o) {
        if (t.matrix && t.matrix[a]) {
          const c = t.matrix[a], f = c.y_unit[c.order[o]];
          _ += ", " + t.templates[a + "_scale_label"](f.key, f.label, f);
        } else if (t._props && t._props[a]) {
          const c = t._props[a], f = c.options[c.order[o]];
          _ += ", " + t.templates[a + "_scale_text"](f.key, f.label, f);
        }
      }
      for (var l = 0; l < r.length; l++)
        t._waiAria.setAttributes(r[l], { "aria-label": _, "aria-live": "polite" });
    }, renderWeekAgendaMarker: function(r, s) {
      for (var n = t.$container.querySelectorAll(".dhx_wa_day_cont .dhx_wa_scale_bar"), o = t.date.week_start(new Date(t.getState().min_date)), _ = -1, a = t.date.day_start(new Date(r)), d = 0; d < n.length && (_++, t.date.day_start(new Date(o)).valueOf() != a.valueOf()); d++)
        o = t.date.add(o, 1, "day");
      return _ != -1 ? this._wrapDiv(n[_]) : [];
    }, _wrapDiv: function(r) {
      var s = this.createElement();
      return s.style.top = r.offsetTop + "px", s.style.left = r.offsetLeft + "px", s.style.width = r.offsetWidth + "px", s.style.height = r.offsetHeight + "px", r.appendChild(s), [s];
    }, renderYearMarker: function(r, s) {
      var n = t._get_year_cell(r);
      n.style.position = "relative";
      var o = this.createElement();
      return o.style.top = "0px", o.style.left = "0px", o.style.width = "100%", o.style.height = "100%", n.appendChild(o), [o];
    }, renderAgendaMarker: function(r, s) {
      var n = this.createElement();
      return n.style.height = "1px", n.style.width = "100%", n.style.opacity = 1, n.style.top = "0px", n.style.left = "0px", t.$container.querySelector(".dhx_cal_data").appendChild(n), [n];
    }, renderTimelineMarker: function(r, s, n) {
      var o = t._lame_copy({}, t.matrix[t._mode]), _ = o._scales;
      o.round_position = !1;
      var a = [], d = r ? new Date(r) : t._min_date, l = s ? new Date(s) : t._max_date;
      if (d.valueOf() < t._min_date.valueOf() && (d = new Date(t._min_date)), l.valueOf() > t._max_date.valueOf() && (l = new Date(t._max_date)), !o._trace_x)
        return a;
      for (var c = 0; c < o._trace_x.length && !t._is_column_visible(o._trace_x[c]); c++)
        ;
      if (c == o._trace_x.length)
        return a;
      var f = _[n];
      if (!(d < s && l > r))
        return a;
      var v = this.createElement();
      let p, h;
      function u(E, S) {
        S.setDate(1), S.setFullYear(E.getFullYear()), S.setMonth(E.getMonth()), S.setDate(E.getDate());
      }
      if (t.getView().days) {
        const E = new Date(r);
        u(t._min_date, E);
        const S = new Date(s);
        u(t._min_date, S), p = t._timeline_getX({ start_date: E }, !1, o), h = t._timeline_getX({ start_date: S }, !1, o);
      } else
        p = t._timeline_getX({ start_date: r }, !1, o), h = t._timeline_getX({ start_date: s }, !1, o);
      var m = o._section_height[n] - 1 || o.dy - 1, y = 0;
      t._isRender("cell") && (y = f.offsetTop, p += o.dx, h += o.dx, f = t.$container.querySelector(".dhx_cal_data"));
      var w = Math.max(1, h - p - 1);
      let D = "left";
      return t.config.rtl && (D = "right"), v.style.cssText = `height:${m}px; ${D}:${p}px; width:${w}px; top:${y}px;`, f && (f.appendChild(v), a.push(v)), a;
    }, renderMonthCell: function(r) {
      for (var s = t.$container.querySelectorAll(".dhx_month_head"), n = [], o = 0; o < s.length; o++)
        n.push(s[o].parentNode);
      var _ = -1, a = 0, d = -1, l = t.date.week_start(new Date(t.getState().min_date)), c = t.date.day_start(new Date(r));
      for (o = 0; o < n.length && (_++, d == 6 ? (a++, d = 0) : d++, t.date.day_start(new Date(l)).valueOf() != c.valueOf()); o++)
        l = t.date.add(l, 1, "day");
      if (_ == -1)
        return [];
      var f = t._colsS[d], v = t._colsS.heights[a], p = this.createElement();
      p.style.top = v + "px", p.style.left = f + "px", p.style.width = t._cols[d] + "px", p.style.height = (t._colsS.heights[a + 1] - v || t._colsS.height) + "px";
      var h = t.$container.querySelector(".dhx_cal_data"), u = h.querySelector(".dhx_cal_month_table");
      return u.nextSibling ? h.insertBefore(p, u.nextSibling) : h.appendChild(p), p;
    }, renderMonthMarker: function(r, s) {
      for (var n = [], o = r; o.valueOf() < s.valueOf(); )
        n.push(this.renderMonthCell(o)), o = t.date.add(o, 1, "day");
      return n;
    }, renderVerticalMarker: function(r, s, n) {
      var o = t.locate_holder_day(r), _ = [], a = null, d = t.config;
      if (t._ignores[o])
        return _;
      if (t._props && t._props[t._mode] && n) {
        var l = t._props[t._mode];
        o = l.order[n];
        var c = l.order[n];
        l.days > 1 ? o = t.locate_holder_day(r) + c : (o = c, l.size && o > l.position + l.size && (o = 0));
      }
      if (!(a = t.locate_holder(o)) || a.querySelector(".dhx_scale_hour"))
        return document.createElement("div");
      var f = Math.max(60 * r.getHours() + r.getMinutes(), 60 * d.first_hour), v = Math.min(60 * s.getHours() + s.getMinutes(), 60 * d.last_hour);
      if (!v && t.date.day_start(new Date(s)).valueOf() > t.date.day_start(new Date(r)).valueOf() && (v = 60 * d.last_hour), v <= f)
        return [];
      var p = this.createElement(), h = t.config.hour_size_px * d.last_hour + 1, u = 36e5;
      return p.style.top = Math.round((60 * f * 1e3 - t.config.first_hour * u) * t.config.hour_size_px / u) % h + "px", p.style.lineHeight = p.style.height = Math.max(Math.round(60 * (v - f) * 1e3 * t.config.hour_size_px / u) % h, 1) + "px", p.style.width = "100%", a.appendChild(p), _.push(p), _[0];
    } };
  }(e), function(t) {
    t.$keyboardNavigation.SchedulerNode = function() {
    }, t.$keyboardNavigation.SchedulerNode.prototype = t._compose(t.$keyboardNavigation.EventHandler, { getDefaultNode: function() {
      var r = new t.$keyboardNavigation.TimeSlot();
      return r.isValid() || (r = r.fallback()), r;
    }, _modes: { month: "month", year: "year", dayColumns: "dayColumns", timeline: "timeline", units: "units", weekAgenda: "weekAgenda", list: "list" }, getMode: function() {
      var r = t.getState().mode;
      return t.matrix && t.matrix[r] ? this._modes.timeline : t._props && t._props[r] ? this._modes.units : r == "month" ? this._modes.month : r == "year" ? this._modes.year : r == "week_agenda" ? this._modes.weekAgenda : r == "map" || r == "agenda" || t._grid && t["grid_" + r] ? this._modes.list : this._modes.dayColumns;
    }, focus: function() {
      t.focus();
    }, blur: function() {
    }, disable: function() {
      t.$container.setAttribute("tabindex", "0");
    }, enable: function() {
      t.$container && t.$container.removeAttribute("tabindex");
    }, isEnabled: function() {
      return t.$container.hasAttribute("tabindex");
    }, _compareEvents: function(r, s) {
      return r.start_date.valueOf() == s.start_date.valueOf() ? r.id > s.id ? 1 : -1 : r.start_date.valueOf() > s.start_date.valueOf() ? 1 : -1;
    }, _pickEvent: function(r, s, n, o) {
      var _ = t.getState();
      r = new Date(Math.max(_.min_date.valueOf(), r.valueOf())), s = new Date(Math.min(_.max_date.valueOf(), s.valueOf()));
      var a = t.getEvents(r, s);
      a.sort(this._compareEvents), o && (a = a.reverse());
      for (var d = !!n, l = 0; l < a.length && d; l++)
        a[l].id == n && (d = !1), a.splice(l, 1), l--;
      for (l = 0; l < a.length; l++)
        if (new t.$keyboardNavigation.Event(a[l].id).getNode())
          return a[l];
      return null;
    }, nextEventHandler: function(r) {
      var s = t.$keyboardNavigation.dispatcher.activeNode, n = r || s && s.eventId, o = null;
      if (n && t.getEvent(n)) {
        var _ = t.getEvent(n);
        o = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(_.start_date, t.date.add(_.start_date, 1, "year"), _.id, !1);
      }
      if (!o && !r) {
        var a = t.getState();
        o = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(a.min_date, t.date.add(a.min_date, 1, "year"), null, !1);
      }
      if (o) {
        var d = new t.$keyboardNavigation.Event(o.id);
        d.isValid() ? (s && s.blur(), t.$keyboardNavigation.dispatcher.setActiveNode(d)) : this.nextEventHandler(o.id);
      }
    }, prevEventHandler: function(r) {
      var s = t.$keyboardNavigation.dispatcher.activeNode, n = r || s && s.eventId, o = null;
      if (n && t.getEvent(n)) {
        var _ = t.getEvent(n);
        o = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(t.date.add(_.end_date, -1, "year"), _.end_date, _.id, !0);
      }
      if (!o && !r) {
        var a = t.getState();
        o = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(t.date.add(a.max_date, -1, "year"), a.max_date, null, !0);
      }
      if (o) {
        var d = new t.$keyboardNavigation.Event(o.id);
        d.isValid() ? (s && s.blur(), t.$keyboardNavigation.dispatcher.setActiveNode(d)) : this.prevEventHandler(o.id);
      }
    }, keys: { "alt+1, alt+2, alt+3, alt+4, alt+5, alt+6, alt+7, alt+8, alt+9": function(r) {
      var s = t.$keyboardNavigation.HeaderCell.prototype.getNodes(".dhx_cal_navline .dhx_cal_tab"), n = r.key;
      n === void 0 && (n = r.keyCode - 48), s[1 * n - 1] && s[1 * n - 1].click();
    }, "ctrl+left,meta+left": function(r) {
      t._click.dhx_cal_prev_button();
    }, "ctrl+right,meta+right": function(r) {
      t._click.dhx_cal_next_button();
    }, "ctrl+up,meta+up": function(r) {
      t.$container.querySelector(".dhx_cal_data").scrollTop -= 20;
    }, "ctrl+down,meta+down": function(r) {
      t.$container.querySelector(".dhx_cal_data").scrollTop += 20;
    }, e: function() {
      this.nextEventHandler();
    }, home: function() {
      t.setCurrentView(/* @__PURE__ */ new Date());
    }, "shift+e": function() {
      this.prevEventHandler();
    }, "ctrl+enter,meta+enter": function() {
      t.addEventNow({ start_date: new Date(t.getState().date) });
    }, "ctrl+c,meta+c": function(r) {
      t._key_nav_copy_paste(r);
    }, "ctrl+v,meta+v": function(r) {
      t._key_nav_copy_paste(r);
    }, "ctrl+x,meta+x": function(r) {
      t._key_nav_copy_paste(r);
    } } }), t.$keyboardNavigation.SchedulerNode.prototype.bindAll(t.$keyboardNavigation.SchedulerNode.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.KeyNavNode = function() {
    }, t.$keyboardNavigation.KeyNavNode.prototype = t._compose(t.$keyboardNavigation.EventHandler, { isValid: function() {
      return !0;
    }, fallback: function() {
      return null;
    }, moveTo: function(r) {
      t.$keyboardNavigation.dispatcher.setActiveNode(r);
    }, compareTo: function(r) {
      if (!r)
        return !1;
      for (var s in this) {
        if (!!this[s] != !!r[s])
          return !1;
        var n = !(!this[s] || !this[s].toString), o = !(!r[s] || !r[s].toString);
        if (o != n)
          return !1;
        if (o && n) {
          if (r[s].toString() != this[s].toString())
            return !1;
        } else if (r[s] != this[s])
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
  }(e), function(t) {
    t.$keyboardNavigation.HeaderCell = function(r) {
      this.index = r || 0;
    }, t.$keyboardNavigation.HeaderCell.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { getNode: function(r) {
      r = r || this.index || 0;
      var s = this.getNodes();
      if (s[r])
        return s[r];
    }, getNodes: function(r) {
      r = r || [".dhx_cal_navline .dhx_cal_prev_button", ".dhx_cal_navline .dhx_cal_next_button", ".dhx_cal_navline .dhx_cal_today_button", ".dhx_cal_navline .dhx_cal_tab"].join(", ");
      var s = Array.prototype.slice.call(t.$container.querySelectorAll(r));
      return s.sort(function(n, o) {
        return n.offsetLeft - o.offsetLeft;
      }), s;
    }, _handlers: null, isValid: function() {
      return !!this.getNode(this.index);
    }, fallback: function() {
      var r = this.getNode(0);
      return r || (r = new t.$keyboardNavigation.TimeSlot()), r;
    }, keys: { left: function() {
      var r = this.index - 1;
      r < 0 && (r = this.getNodes().length - 1), this.moveTo(new t.$keyboardNavigation.HeaderCell(r));
    }, right: function() {
      var r = this.index + 1;
      r >= this.getNodes().length && (r = 0), this.moveTo(new t.$keyboardNavigation.HeaderCell(r));
    }, down: function() {
      this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, enter: function() {
      var r = this.getNode();
      r && r.click();
    } } }), t.$keyboardNavigation.HeaderCell.prototype.bindAll(t.$keyboardNavigation.HeaderCell.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.Event = function(r) {
      if (this.eventId = null, t.getEvent(r)) {
        var s = t.getEvent(r);
        this.start = new Date(s.start_date), this.end = new Date(s.end_date), this.section = this._getSection(s), this.eventId = r;
      }
    }, t.$keyboardNavigation.Event.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { _getNodes: function() {
      return Array.prototype.slice.call(t.$container.querySelectorAll("[" + t.config.event_attribute + "]"));
    }, _modes: t.$keyboardNavigation.SchedulerNode.prototype._modes, getMode: t.$keyboardNavigation.SchedulerNode.prototype.getMode, _handlers: null, isValid: function() {
      return !(!t.getEvent(this.eventId) || !this.getNode());
    }, fallback: function() {
      var r = this._getNodes()[0], s = null;
      if (r && t._locate_event(r)) {
        var n = t._locate_event(r);
        s = new t.$keyboardNavigation.Event(n);
      } else
        s = new t.$keyboardNavigation.TimeSlot();
      return s;
    }, isScrolledIntoView: function(r) {
      var s = r.getBoundingClientRect(), n = t.$container.querySelector(".dhx_cal_data").getBoundingClientRect();
      return !(s.bottom < n.top || s.top > n.bottom);
    }, getNode: function() {
      var r = "[" + t.config.event_attribute + "='" + this.eventId + "']", s = t.$keyboardNavigation.dispatcher.getInlineEditor(this.eventId);
      if (s)
        return s;
      if (t.isMultisectionEvent && t.isMultisectionEvent(t.getEvent(this.eventId))) {
        for (var n = t.$container.querySelectorAll(r), o = 0; o < n.length; o++)
          if (this.isScrolledIntoView(n[o]))
            return n[o];
        return n[0];
      }
      return t.$container.querySelector(r);
    }, focus: function() {
      var r = t.getEvent(this.eventId), s = t.getState();
      (r.start_date.valueOf() > s.max_date.valueOf() || r.end_date.valueOf() <= s.min_date.valueOf()) && t.setCurrentView(r.start_date);
      var n = this.getNode();
      this.isScrolledIntoView(n) ? t.$keyboardNavigation.dispatcher.keepScrollPosition((function() {
        t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
      }).bind(this)) : t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, _getSection: function(r) {
      var s = null, n = t.getState().mode;
      return t.matrix && t.matrix[n] ? s = r[t.matrix[t.getState().mode].y_property] : t._props && t._props[n] && (s = r[t._props[n].map_to]), s;
    }, _moveToSlot: function(r) {
      var s = t.getEvent(this.eventId);
      if (s) {
        var n = this._getSection(s), o = new t.$keyboardNavigation.TimeSlot(s.start_date, null, n);
        this.moveTo(o.nextSlot(o, r));
      } else
        this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, keys: { left: function() {
      this._moveToSlot("left");
    }, right: function() {
      this._moveToSlot("right");
    }, down: function() {
      this.getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.nextEventHandler() : this._moveToSlot("down");
    }, space: function() {
      var r = this.getNode();
      r && r.click ? r.click() : this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, up: function() {
      this.getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.prevEventHandler() : this._moveToSlot("up");
    }, delete: function() {
      t.getEvent(this.eventId) ? t._click.buttons.delete(this.eventId) : this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, enter: function() {
      t.getEvent(this.eventId) ? t.showLightbox(this.eventId) : this.moveTo(new t.$keyboardNavigation.TimeSlot());
    } } }), t.$keyboardNavigation.Event.prototype.bindAll(t.$keyboardNavigation.Event.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.TimeSlot = function(r, s, n, o) {
      var _ = t.getState(), a = t.matrix && t.matrix[_.mode];
      r || (r = this.getDefaultDate()), s || (s = a ? t.date.add(r, a.x_step, a.x_unit) : t.date.add(r, t.config.key_nav_step, "minute")), this.section = n || this._getDefaultSection(), this.start_date = new Date(r), this.end_date = new Date(s), this.movingDate = o || null;
    }, t.$keyboardNavigation.TimeSlot.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { _handlers: null, getDefaultDate: function() {
      var r, s = t.getState(), n = new Date(s.date);
      n.setSeconds(0), n.setMilliseconds(0);
      var o = /* @__PURE__ */ new Date();
      o.setSeconds(0), o.setMilliseconds(0);
      var _ = t.matrix && t.matrix[s.mode], a = !1;
      if (n.valueOf() === o.valueOf() && (a = !0), _)
        a ? (_.x_unit === "day" ? (o.setHours(0), o.setMinutes(0)) : _.x_unit === "hour" && o.setMinutes(0), r = o) : r = t.date[_.name + "_start"](new Date(s.date)), r = this.findVisibleColumn(r);
      else if (r = new Date(t.getState().min_date), a && (r = o), r = this.findVisibleColumn(r), a || r.setHours(t.config.first_hour), !t._table_view) {
        var d = t.$container.querySelector(".dhx_cal_data");
        d.scrollTop && r.setHours(t.config.first_hour + Math.ceil(d.scrollTop / t.config.hour_size_px));
      }
      return r;
    }, clone: function(r) {
      return new t.$keyboardNavigation.TimeSlot(r.start_date, r.end_date, r.section, r.movingDate);
    }, _getMultisectionView: function() {
      var r, s = t.getState();
      return t._props && t._props[s.mode] ? r = t._props[s.mode] : t.matrix && t.matrix[s.mode] && (r = t.matrix[s.mode]), r;
    }, _getDefaultSection: function() {
      var r = null;
      return this._getMultisectionView() && !r && (r = this._getNextSection()), r;
    }, _getNextSection: function(r, s) {
      var n = this._getMultisectionView(), o = n.order[r], _ = o;
      (_ = o !== void 0 ? o + s : n.size && n.position ? n.position : 0) < 0 && (_ = 0);
      var a = n.options || n.y_unit;
      return _ >= a.length && (_ = a.length - 1), a[_] ? a[_].key : null;
    }, isValid: function() {
      var r = t.getState();
      if (this.start_date.valueOf() < r.min_date.valueOf() || this.start_date.valueOf() >= r.max_date.valueOf() || !this.isVisible(this.start_date, this.end_date))
        return !1;
      var s = this._getMultisectionView();
      return !s || s.order[this.section] !== void 0;
    }, fallback: function() {
      var r = new t.$keyboardNavigation.TimeSlot();
      return r.isValid() ? r : new t.$keyboardNavigation.DataArea();
    }, getNodes: function() {
      return Array.prototype.slice.call(t.$container.querySelectorAll(".dhx_focus_slot"));
    }, getNode: function() {
      return this.getNodes()[0];
    }, focus: function() {
      this.section && t.getView() && t.getView().smart_rendering && t.getView().scrollTo && !t.$container.querySelector(`[data-section-id="${this.section}"]`) && t.getView().scrollTo({ section: this.section }), t.$keyboardNavigation.marker.render(this.start_date, this.end_date, this.section), t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this), t.$keyboardNavigation._pasteDate = this.start_date, t.$keyboardNavigation._pasteSection = this.section;
    }, blur: function() {
      t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this), t.$keyboardNavigation.marker.clear();
    }, _modes: t.$keyboardNavigation.SchedulerNode.prototype._modes, _getMode: t.$keyboardNavigation.SchedulerNode.prototype.getMode, addMonthDate: function(r, s, n) {
      var o;
      switch (s) {
        case "up":
          o = t.date.add(r, -1, "week");
          break;
        case "down":
          o = t.date.add(r, 1, "week");
          break;
        case "left":
          o = t.date.day_start(t.date.add(r, -1, "day")), o = this.findVisibleColumn(o, -1);
          break;
        case "right":
          o = t.date.day_start(t.date.add(r, 1, "day")), o = this.findVisibleColumn(o, 1);
          break;
        default:
          o = t.date.day_start(new Date(r));
      }
      var _ = t.getState();
      return (r.valueOf() < _.min_date.valueOf() || !n && r.valueOf() >= _.max_date.valueOf()) && (o = new Date(_.min_date)), o;
    }, nextMonthSlot: function(r, s, n) {
      var o, _;
      return (o = this.addMonthDate(r.start_date, s, n)).setHours(t.config.first_hour), (_ = new Date(o)).setHours(t.config.last_hour), { start_date: o, end_date: _ };
    }, _alignTimeSlot: function(r, s, n, o) {
      for (var _ = new Date(s); _.valueOf() < r.valueOf(); )
        _ = t.date.add(_, o, n);
      return _.valueOf() > r.valueOf() && (_ = t.date.add(_, -o, n)), _;
    }, nextTimelineSlot: function(r, s, n) {
      var o = t.getState(), _ = t.matrix[o.mode], a = this._alignTimeSlot(r.start_date, t.date[_.name + "_start"](new Date(r.start_date)), _.x_unit, _.x_step), d = this._alignTimeSlot(r.end_date, t.date[_.name + "_start"](new Date(r.end_date)), _.x_unit, _.x_step);
      d.valueOf() <= a.valueOf() && (d = t.date.add(a, _.x_step, _.x_unit));
      var l = this.clone(r);
      switch (l.start_date = a, l.end_date = d, l.section = r.section || this._getNextSection(), s) {
        case "up":
          l.section = this._getNextSection(r.section, -1);
          break;
        case "down":
          l.section = this._getNextSection(r.section, 1);
          break;
        case "left":
          l.start_date = this.findVisibleColumn(t.date.add(l.start_date, -_.x_step, _.x_unit), -1), l.end_date = t.date.add(l.start_date, _.x_step, _.x_unit);
          break;
        case "right":
          l.start_date = this.findVisibleColumn(t.date.add(l.start_date, _.x_step, _.x_unit), 1), l.end_date = t.date.add(l.start_date, _.x_step, _.x_unit);
      }
      return (l.start_date.valueOf() < o.min_date.valueOf() || l.start_date.valueOf() >= o.max_date.valueOf()) && (n && l.start_date.valueOf() >= o.max_date.valueOf() ? l.start_date = new Date(o.max_date) : (l.start_date = t.date[o.mode + "_start"](t.date.add(o.date, s == "left" ? -1 : 1, o.mode)), l.end_date = t.date.add(l.start_date, _.x_step, _.x_unit))), l;
    }, nextUnitsSlot: function(r, s, n) {
      var o = this.clone(r);
      o.section = r.section || this._getNextSection();
      var _ = r.section || this._getNextSection(), a = t.getState(), d = t._props[a.mode];
      switch (s) {
        case "left":
          _ = this._getNextSection(r.section, -1);
          var l = d.size ? d.size - 1 : d.options.length;
          d.days > 1 && d.order[_] == l - 1 && t.date.add(r.start_date, -1, "day").valueOf() >= a.min_date.valueOf() && (o = this.nextDaySlot(r, s, n));
          break;
        case "right":
          _ = this._getNextSection(r.section, 1), d.days > 1 && !d.order[_] && t.date.add(r.start_date, 1, "day").valueOf() < a.max_date.valueOf() && (o = this.nextDaySlot(r, s, n));
          break;
        default:
          o = this.nextDaySlot(r, s, n), _ = r.section;
      }
      return o.section = _, o;
    }, _moveDate: function(r, s) {
      var n = this.findVisibleColumn(t.date.add(r, s, "day"), s);
      return n.setHours(r.getHours()), n.setMinutes(r.getMinutes()), n;
    }, isBeforeLastHour: function(r, s) {
      var n = r.getMinutes(), o = r.getHours(), _ = t.config.last_hour;
      return o < _ || !s && (_ == 24 || o == _) && !n;
    }, isAfterFirstHour: function(r, s) {
      var n = r.getMinutes(), o = r.getHours(), _ = t.config.first_hour, a = t.config.last_hour;
      return o >= _ || !s && !n && (!o && a == 24 || o == a);
    }, isInVisibleDayTime: function(r, s) {
      return this.isBeforeLastHour(r, s) && this.isAfterFirstHour(r, s);
    }, nextDaySlot: function(r, s, n) {
      var o, _, a = t.config.key_nav_step, d = this._alignTimeSlot(r.start_date, t.date.day_start(new Date(r.start_date)), "minute", a), l = r.start_date;
      switch (s) {
        case "up":
          if (o = t.date.add(d, -a, "minute"), !this.isInVisibleDayTime(o, !0) && (!n || this.isInVisibleDayTime(l, !0))) {
            var c = !0;
            n && t.date.date_part(new Date(o)).valueOf() != t.date.date_part(new Date(l)).valueOf() && (c = !1), c && (o = this.findVisibleColumn(t.date.add(r.start_date, -1, "day"), -1)), o.setHours(t.config.last_hour), o.setMinutes(0), o = t.date.add(o, -a, "minute");
          }
          _ = t.date.add(o, a, "minute");
          break;
        case "down":
          o = t.date.add(d, a, "minute");
          var f = n ? o : t.date.add(o, a, "minute");
          this.isInVisibleDayTime(f, !1) || n && !this.isInVisibleDayTime(l, !1) || (n ? (c = !0, t.date.date_part(new Date(l)).valueOf() == l.valueOf() && (c = !1), c && (o = this.findVisibleColumn(t.date.add(r.start_date, 1, "day"), 1)), o.setHours(t.config.first_hour), o.setMinutes(0), o = t.date.add(o, a, "minute")) : ((o = this.findVisibleColumn(t.date.add(r.start_date, 1, "day"), 1)).setHours(t.config.first_hour), o.setMinutes(0))), _ = t.date.add(o, a, "minute");
          break;
        case "left":
          o = this._moveDate(r.start_date, -1), _ = this._moveDate(r.end_date, -1);
          break;
        case "right":
          o = this._moveDate(r.start_date, 1), _ = this._moveDate(r.end_date, 1);
          break;
        default:
          o = d, _ = t.date.add(o, a, "minute");
      }
      return { start_date: o, end_date: _ };
    }, nextWeekAgendaSlot: function(r, s) {
      var n, o, _ = t.getState();
      switch (s) {
        case "down":
        case "left":
          n = t.date.day_start(t.date.add(r.start_date, -1, "day")), n = this.findVisibleColumn(n, -1);
          break;
        case "up":
        case "right":
          n = t.date.day_start(t.date.add(r.start_date, 1, "day")), n = this.findVisibleColumn(n, 1);
          break;
        default:
          n = t.date.day_start(r.start_date);
      }
      return (r.start_date.valueOf() < _.min_date.valueOf() || r.start_date.valueOf() >= _.max_date.valueOf()) && (n = new Date(_.min_date)), (o = new Date(n)).setHours(t.config.last_hour), { start_date: n, end_date: o };
    }, nextAgendaSlot: function(r, s) {
      return { start_date: r.start_date, end_date: r.end_date };
    }, isDateVisible: function(r) {
      if (!t._ignores_detected)
        return !0;
      var s, n = t.matrix && t.matrix[t.getState().mode];
      return s = n ? t._get_date_index(n, r) : t.locate_holder_day(r), !t._ignores[s];
    }, findVisibleColumn: function(r, s) {
      var n = r;
      s = s || 1;
      for (var o = t.getState(); !this.isDateVisible(n) && (s > 0 && n.valueOf() <= o.max_date.valueOf() || s < 0 && n.valueOf() >= o.min_date.valueOf()); )
        n = this.nextDateColumn(n, s);
      return n;
    }, nextDateColumn: function(r, s) {
      s = s || 1;
      var n = t.matrix && t.matrix[t.getState().mode];
      return n ? t.date.add(r, s * n.x_step, n.x_unit) : t.date.day_start(t.date.add(r, s, "day"));
    }, isVisible: function(r, s) {
      if (!t._ignores_detected)
        return !0;
      for (var n = new Date(r); n.valueOf() < s.valueOf(); ) {
        if (this.isDateVisible(n))
          return !0;
        n = this.nextDateColumn(n);
      }
      return !1;
    }, nextSlot: function(r, s, n, o) {
      var _;
      n = n || this._getMode();
      var a = t.$keyboardNavigation.TimeSlot.prototype.clone(r);
      switch (n) {
        case this._modes.units:
          _ = this.nextUnitsSlot(a, s, o);
          break;
        case this._modes.timeline:
          _ = this.nextTimelineSlot(a, s, o);
          break;
        case this._modes.year:
        case this._modes.month:
          _ = this.nextMonthSlot(a, s, o);
          break;
        case this._modes.weekAgenda:
          _ = this.nextWeekAgendaSlot(a, s, o);
          break;
        case this._modes.list:
          _ = this.nextAgendaSlot(a, s, o);
          break;
        case this._modes.dayColumns:
          _ = this.nextDaySlot(a, s, o);
      }
      return _.start_date.valueOf() >= _.end_date.valueOf() && (_ = this.nextSlot(_, s, n)), t.$keyboardNavigation.TimeSlot.prototype.clone(_);
    }, extendSlot: function(r, s) {
      var n;
      switch (this._getMode()) {
        case this._modes.units:
          n = s == "left" || s == "right" ? this.nextUnitsSlot(r, s) : this.extendUnitsSlot(r, s);
          break;
        case this._modes.timeline:
          n = s == "down" || s == "up" ? this.nextTimelineSlot(r, s) : this.extendTimelineSlot(r, s);
          break;
        case this._modes.year:
        case this._modes.month:
          n = this.extendMonthSlot(r, s);
          break;
        case this._modes.dayColumns:
          n = this.extendDaySlot(r, s);
          break;
        case this._modes.weekAgenda:
          n = this.extendWeekAgendaSlot(r, s);
          break;
        default:
          n = r;
      }
      var o = t.getState();
      return n.start_date.valueOf() < o.min_date.valueOf() && (n.start_date = this.findVisibleColumn(o.min_date), n.start_date.setHours(t.config.first_hour)), n.end_date.valueOf() > o.max_date.valueOf() && (n.end_date = this.findVisibleColumn(o.max_date, -1)), t.$keyboardNavigation.TimeSlot.prototype.clone(n);
    }, extendTimelineSlot: function(r, s) {
      return this.extendGenericSlot({ left: "start_date", right: "end_date" }, r, s, "timeline");
    }, extendWeekAgendaSlot: function(r, s) {
      return this.extendGenericSlot({ left: "start_date", right: "end_date" }, r, s, "weekAgenda");
    }, extendGenericSlot: function(r, s, n, o) {
      var _, a = s.movingDate;
      if (a || (a = r[n]), !a || !r[n])
        return s;
      if (!n)
        return t.$keyboardNavigation.TimeSlot.prototype.clone(s);
      (_ = this.nextSlot({ start_date: s[a], section: s.section }, n, o, !0)).start_date.valueOf() == s.start_date.valueOf() && (_ = this.nextSlot({ start_date: _.start_date, section: _.section }, n, o, !0)), _.movingDate = a;
      var d = this.extendSlotDates(s, _, _.movingDate);
      return d.end_date.valueOf() <= d.start_date.valueOf() && (_.movingDate = _.movingDate == "end_date" ? "start_date" : "end_date"), d = this.extendSlotDates(s, _, _.movingDate), _.start_date = d.start_date, _.end_date = d.end_date, _;
    }, extendSlotDates: function(r, s, n) {
      var o = { start_date: null, end_date: null };
      return n == "start_date" ? (o.start_date = s.start_date, o.end_date = r.end_date) : (o.start_date = r.start_date, o.end_date = s.start_date), o;
    }, extendMonthSlot: function(r, s) {
      return (r = this.extendGenericSlot({ up: "start_date", down: "end_date", left: "start_date", right: "end_date" }, r, s, "month")).start_date.setHours(t.config.first_hour), r.end_date = t.date.add(r.end_date, -1, "day"), r.end_date.setHours(t.config.last_hour), r;
    }, extendUnitsSlot: function(r, s) {
      var n;
      switch (s) {
        case "down":
        case "up":
          n = this.extendDaySlot(r, s);
          break;
        default:
          n = r;
      }
      return n.section = r.section, n;
    }, extendDaySlot: function(r, s) {
      return this.extendGenericSlot({ up: "start_date", down: "end_date", left: "start_date", right: "end_date" }, r, s, "dayColumns");
    }, scrollSlot: function(r) {
      var s = t.getState(), n = this.nextSlot(this, r);
      (n.start_date.valueOf() < s.min_date.valueOf() || n.start_date.valueOf() >= s.max_date.valueOf()) && t.setCurrentView(new Date(n.start_date)), this.moveTo(n);
    }, keys: { left: function() {
      this.scrollSlot("left");
    }, right: function() {
      this.scrollSlot("right");
    }, down: function() {
      this._getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.nextEventHandler() : this.scrollSlot("down");
    }, up: function() {
      this._getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.prevEventHandler() : this.scrollSlot("up");
    }, "shift+down": function() {
      this.moveTo(this.extendSlot(this, "down"));
    }, "shift+up": function() {
      this.moveTo(this.extendSlot(this, "up"));
    }, "shift+right": function() {
      this.moveTo(this.extendSlot(this, "right"));
    }, "shift+left": function() {
      this.moveTo(this.extendSlot(this, "left"));
    }, enter: function() {
      var r = { start_date: new Date(this.start_date), end_date: new Date(this.end_date) }, s = t.getState().mode;
      t.matrix && t.matrix[s] ? r[t.matrix[t.getState().mode].y_property] = this.section : t._props && t._props[s] && (r[t._props[s].map_to] = this.section), t.addEventNow(r);
    } } }), t.$keyboardNavigation.TimeSlot.prototype.bindAll(t.$keyboardNavigation.TimeSlot.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.MinicalButton = function(r, s) {
      this.container = r, this.index = s || 0;
    }, t.$keyboardNavigation.MinicalButton.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { isValid: function() {
      return !!this.container.offsetWidth;
    }, fallback: function() {
      var r = new t.$keyboardNavigation.TimeSlot();
      return r.isValid() ? r : new t.$keyboardNavigation.DataArea();
    }, focus: function() {
      t.$keyboardNavigation.dispatcher.globalNode.disable(), this.container.removeAttribute("tabindex"), t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      this.container.setAttribute("tabindex", "0"), t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, getNode: function() {
      return this.index ? this.container.querySelector(".dhx_cal_next_button") : this.container.querySelector(".dhx_cal_prev_button");
    }, keys: { right: function(r) {
      this.moveTo(new t.$keyboardNavigation.MinicalButton(this.container, this.index ? 0 : 1));
    }, left: function(r) {
      this.moveTo(new t.$keyboardNavigation.MinicalButton(this.container, this.index ? 0 : 1));
    }, down: function() {
      var r = new t.$keyboardNavigation.MinicalCell(this.container, 0, 0);
      r && !r.isValid() && (r = r.fallback()), this.moveTo(r);
    }, enter: function(r) {
      this.getNode().click();
    } } }), t.$keyboardNavigation.MinicalButton.prototype.bindAll(t.$keyboardNavigation.MinicalButton.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.MinicalCell = function(r, s, n) {
      this.container = r, this.row = s || 0, this.col = n || 0;
    }, t.$keyboardNavigation.MinicalCell.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { isValid: function() {
      var r = this._getGrid();
      return !(!r[this.row] || !r[this.row][this.col]);
    }, fallback: function() {
      var r = this.row, s = this.col, n = this._getGrid();
      n[r] || (r = 0);
      var o = !0;
      if (r > n.length / 2 && (o = !1), !n[r]) {
        var _ = new t.$keyboardNavigation.TimeSlot();
        return _.isValid() ? _ : new t.$keyboardNavigation.DataArea();
      }
      if (o) {
        for (var a = s; n[r] && a < n[r].length; a++)
          if (n[r][a] || a != n[r].length - 1 || (r++, s = 0), n[r][a])
            return new t.$keyboardNavigation.MinicalCell(this.container, r, a);
      } else
        for (a = s; n[r] && a < n[r].length; a--)
          if (n[r][a] || a || (s = n[--r].length - 1), n[r][a])
            return new t.$keyboardNavigation.MinicalCell(this.container, r, a);
      return new t.$keyboardNavigation.MinicalButton(this.container, 0);
    }, focus: function() {
      t.$keyboardNavigation.dispatcher.globalNode.disable(), this.container.removeAttribute("tabindex"), t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      this.container.setAttribute("tabindex", "0"), t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, _getNode: function(r, s) {
      return this.container.querySelector(".dhx_year_body tr:nth-child(" + (r + 1) + ") td:nth-child(" + (s + 1) + ")");
    }, getNode: function() {
      return this._getNode(this.row, this.col);
    }, _getGrid: function() {
      for (var r = this.container.querySelectorAll(".dhx_year_body tr"), s = [], n = 0; n < r.length; n++) {
        s[n] = [];
        for (var o = r[n].querySelectorAll("td"), _ = 0; _ < o.length; _++) {
          var a = o[_], d = !0, l = t._getClassName(a);
          (l.indexOf("dhx_after") > -1 || l.indexOf("dhx_before") > -1 || l.indexOf("dhx_scale_ignore") > -1) && (d = !1), s[n][_] = d;
        }
      }
      return s;
    }, keys: { right: function(r) {
      var s = this._getGrid(), n = this.row, o = this.col + 1;
      s[n] && s[n][o] || (s[n + 1] ? (n += 1, o = 0) : o = this.col);
      var _ = new t.$keyboardNavigation.MinicalCell(this.container, n, o);
      _.isValid() || (_ = _.fallback()), this.moveTo(_);
    }, left: function(r) {
      var s = this._getGrid(), n = this.row, o = this.col - 1;
      s[n] && s[n][o] || (o = s[n - 1] ? s[n -= 1].length - 1 : this.col);
      var _ = new t.$keyboardNavigation.MinicalCell(this.container, n, o);
      _.isValid() || (_ = _.fallback()), this.moveTo(_);
    }, down: function() {
      var r = this._getGrid(), s = this.row + 1, n = this.col;
      r[s] && r[s][n] || (s = this.row);
      var o = new t.$keyboardNavigation.MinicalCell(this.container, s, n);
      o.isValid() || (o = o.fallback()), this.moveTo(o);
    }, up: function() {
      var r = this._getGrid(), s = this.row - 1, n = this.col;
      if (r[s] && r[s][n]) {
        var o = new t.$keyboardNavigation.MinicalCell(this.container, s, n);
        o.isValid() || (o = o.fallback()), this.moveTo(o);
      } else {
        var _ = 0;
        this.col > r[this.row].length / 2 && (_ = 1), this.moveTo(new t.$keyboardNavigation.MinicalButton(this.container, _));
      }
    }, enter: function(r) {
      this.getNode().querySelector(".dhx_month_head").click();
    } } }), t.$keyboardNavigation.MinicalCell.prototype.bindAll(t.$keyboardNavigation.MinicalCell.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.DataArea = function(r) {
      this.index = r || 0;
    }, t.$keyboardNavigation.DataArea.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { getNode: function(r) {
      return t.$container.querySelector(".dhx_cal_data");
    }, _handlers: null, isValid: function() {
      return !0;
    }, fallback: function() {
      return this;
    }, keys: { "up,down,right,left": function() {
      this.moveTo(new t.$keyboardNavigation.TimeSlot());
    } } }), t.$keyboardNavigation.DataArea.prototype.bindAll(t.$keyboardNavigation.DataArea.prototype.keys);
  }(e), Ta(e), function(t) {
    t.$keyboardNavigation.dispatcher = { isActive: !1, activeNode: null, globalNode: new t.$keyboardNavigation.SchedulerNode(), keepScrollPosition: function(r) {
      var s, n, o = t.$container.querySelector(".dhx_timeline_scrollable_data");
      o || (o = t.$container.querySelector(".dhx_cal_data")), o && (s = o.scrollTop, n = o.scrollLeft), r(), o && (o.scrollTop = s, o.scrollLeft = n);
    }, enable: function() {
      if (t.$container) {
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
      r && r.focus && (r.focus(), r.getNode && document.activeElement != r.getNode() && this.setActiveNode(new t.$keyboardNavigation.DataArea()));
    }, blurNode: function(r) {
      r && r.blur && r.blur();
    }, getInlineEditor: function(r) {
      var s = t.$container.querySelector(".dhx_cal_editor[" + t.config.event_attribute + "='" + r + "'] textarea");
      return s && s.offsetWidth ? s : null;
    }, keyDownHandler: function(r) {
      if (!r.defaultPrevented) {
        var s = this.getActiveNode();
        if ((!t.$keyboardNavigation.isModal() || s && s.container && t.utils.dom.locateCss({ target: s.container }, "dhx_minical_popup", !1)) && (!t.getState().editor_id || !this.getInlineEditor(t.getState().editor_id)) && this.isEnabled()) {
          r = r || window.event;
          var n = this.globalNode, o = t.$keyboardNavigation.shortcuts.getCommandFromEvent(r);
          s ? s.findHandler(o) ? s.doAction(o, r) : n.findHandler(o) && n.doAction(o, r) : this.setDefaultNode();
        }
      }
    }, _timeout: null, delay: function(r, s) {
      clearTimeout(this._timeout), this._timeout = setTimeout(r, s || 1);
    } };
  }(e), Aa(e), function() {
    Ca(e), function(_) {
      _.$keyboardNavigation._minicalendars = [], _.$keyboardNavigation.isMinical = function(a) {
        for (var d = _.$keyboardNavigation._minicalendars, l = 0; l < d.length; l++)
          if (this.isChildOf(a, d[l]))
            return !0;
        return !1;
      }, _.$keyboardNavigation.isChildOf = function(a, d) {
        for (; a && a !== d; )
          a = a.parentNode;
        return a === d;
      }, _.$keyboardNavigation.patchMinicalendar = function() {
        var a = _.$keyboardNavigation.dispatcher;
        function d(v) {
          var p = v.target;
          a.enable(), a.setActiveNode(new _.$keyboardNavigation.MinicalButton(p, 0));
        }
        function l(v) {
          var p = v.target || v.srcElement, h = _.utils.dom.locateCss(v, "dhx_cal_prev_button", !1), u = _.utils.dom.locateCss(v, "dhx_cal_next_button", !1), m = _.utils.dom.locateCss(v, "dhx_year_body", !1), y = 0, w = 0;
          if (m) {
            for (var D, E, S = p; S && S.tagName.toLowerCase() != "td"; )
              S = S.parentNode;
            if (S && (D = (E = S).parentNode), D && E) {
              for (var g = D.parentNode.querySelectorAll("tr"), b = 0; b < g.length; b++)
                if (g[b] == D) {
                  y = b;
                  break;
                }
              var x = D.querySelectorAll("td");
              for (b = 0; b < x.length; b++)
                if (x[b] == E) {
                  w = b;
                  break;
                }
            }
          }
          var k = v.currentTarget;
          a.delay(function() {
            var M;
            (h || u || m) && (h ? (M = new _.$keyboardNavigation.MinicalButton(k, 0), a.setActiveNode(new _.$keyboardNavigation.MinicalButton(k, 0))) : u ? M = new _.$keyboardNavigation.MinicalButton(k, 1) : m && (M = new _.$keyboardNavigation.MinicalCell(k, y, w)), M && (a.enable(), M.isValid() && (a.activeNode = null, a.setActiveNode(M))));
          });
        }
        if (_.renderCalendar) {
          var c = _.renderCalendar;
          _.renderCalendar = function() {
            var v = c.apply(this, arguments), p = _.$keyboardNavigation._minicalendars;
            _.eventRemove(v, "click", l), _.event(v, "click", l), _.eventRemove(v, "focus", d), _.event(v, "focus", d);
            for (var h = !1, u = 0; u < p.length; u++)
              if (p[u] == v) {
                h = !0;
                break;
              }
            if (h || p.push(v), a.isEnabled()) {
              var m = a.getActiveNode();
              m && m.container == v ? a.focusNode(m) : v.setAttribute("tabindex", "0");
            } else
              v.setAttribute("tabindex", "0");
            return v;
          };
        }
        if (_.destroyCalendar) {
          var f = _.destroyCalendar;
          _.destroyCalendar = function(v, p) {
            v = v || (_._def_count ? _._def_count.firstChild : null);
            var h = f.apply(this, arguments);
            if (!v || !v.parentNode)
              for (var u = _.$keyboardNavigation._minicalendars, m = 0; m < u.length; m++)
                u[m] == v && (_.eventRemove(u[m], "focus", d), u.splice(m, 1), m--);
            return h;
          };
        }
      };
    }(e);
    var t = e.$keyboardNavigation.dispatcher;
    if (e.$keyboardNavigation.attachSchedulerHandlers(), e.renderCalendar)
      e.$keyboardNavigation.patchMinicalendar();
    else
      var r = e.attachEvent("onSchedulerReady", function() {
        e.detachEvent(r), e.$keyboardNavigation.patchMinicalendar();
      });
    function s() {
      if (e.config.key_nav) {
        var _ = document.activeElement;
        return !(!_ || e.utils.dom.locateCss(_, "dhx_cal_quick_info", !1)) && (e.$keyboardNavigation.isChildOf(_, e.$container) || e.$keyboardNavigation.isMinical(_));
      }
    }
    function n(_) {
      _ && !t.isEnabled() ? t.enable() : !_ && t.isEnabled() && t.disable();
    }
    const o = setInterval(function() {
      if (e.$container && e.$keyboardNavigation.isChildOf(e.$container, document.body)) {
        var _ = s();
        _ ? n(_) : !_ && t.isEnabled() && setTimeout(function() {
          e.$destroyed || (e.config.key_nav ? n(s()) : e.$container.removeAttribute("tabindex"));
        }, 100);
      }
    }, 500);
    e.attachEvent("onDestroy", function() {
      clearInterval(o);
    });
  }();
}, layer: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    this.layers.sort(function(t, r) {
      return t.zIndex - r.zIndex;
    }), e._dp_init = function(t) {
      t._methods = ["_set_event_text_style", "", "changeEventId", "deleteEvent"], this.attachEvent("onEventAdded", function(r) {
        !this._loading && this.validId(r) && this.getEvent(r) && this.getEvent(r).layer == t.layer && t.setUpdated(r, !0, "inserted");
      }), this.attachEvent("onBeforeEventDelete", function(r) {
        if (this.getEvent(r) && this.getEvent(r).layer == t.layer) {
          if (!this.validId(r))
            return;
          var s = t.getState(r);
          return s == "inserted" || this._new_event ? (t.setUpdated(r, !1), !0) : s != "deleted" && (s == "true_deleted" || (t.setUpdated(r, !0, "deleted"), !1));
        }
        return !0;
      }), this.attachEvent("onEventChanged", function(r) {
        !this._loading && this.validId(r) && this.getEvent(r) && this.getEvent(r).layer == t.layer && t.setUpdated(r, !0, "updated");
      }), t._getRowData = function(r, s) {
        var n = this.obj.getEvent(r), o = {};
        for (var _ in n)
          _.indexOf("_") !== 0 && (n[_] && n[_].getUTCFullYear ? o[_] = this.obj._helpers.formatDate(n[_]) : o[_] = n[_]);
        return o;
      }, t._clearUpdateFlag = function() {
      }, t.attachEvent("insertCallback", e._update_callback), t.attachEvent("updateCallback", e._update_callback), t.attachEvent("deleteCallback", function(r, s) {
        this.obj.setUserData(s, this.action_param, "true_deleted"), this.obj.deleteEvent(s);
      });
    }, function() {
      var t = function(n) {
        if (n === null || typeof n != "object")
          return n;
        var o = new n.constructor();
        for (var _ in n)
          o[_] = t(n[_]);
        return o;
      };
      e._dataprocessors = [], e._layers_zindex = {};
      for (var r = 0; r < e.layers.length; r++) {
        if (e.config["lightbox_" + e.layers[r].name] = {}, e.config["lightbox_" + e.layers[r].name].sections = t(e.config.lightbox.sections), e._layers_zindex[e.layers[r].name] = e.config.initial_layer_zindex || 5 + 3 * r, e.layers[r].url) {
          var s = e.createDataProcessor({ url: e.layers[r].url });
          s.layer = e.layers[r].name, e._dataprocessors.push(s), e._dataprocessors[r].init(e);
        }
        e.layers[r].isDefault && (e.defaultLayer = e.layers[r].name);
      }
    }(), e.showLayer = function(t) {
      this.toggleLayer(t, !0);
    }, e.hideLayer = function(t) {
      this.toggleLayer(t, !1);
    }, e.toggleLayer = function(t, r) {
      var s = this.getLayer(t);
      s.visible = r !== void 0 ? !!r : !s.visible, this.setCurrentView(this._date, this._mode);
    }, e.getLayer = function(t) {
      var r, s;
      typeof t == "string" && (s = t), typeof t == "object" && (s = t.layer);
      for (var n = 0; n < e.layers.length; n++)
        e.layers[n].name == s && (r = e.layers[n]);
      return r;
    }, e.attachEvent("onBeforeLightbox", function(t) {
      var r = this.getEvent(t);
      return this.config.lightbox.sections = this.config["lightbox_" + r.layer].sections, e.resetLightbox(), !0;
    }), e.attachEvent("onClick", function(t, r) {
      var s = e.getEvent(t);
      return !e.getLayer(s.layer).noMenu;
    }), e.attachEvent("onEventCollision", function(t, r) {
      var s = this.getLayer(t);
      if (!s.checkCollision)
        return !1;
      for (var n = 0, o = 0; o < r.length; o++)
        r[o].layer == s.name && r[o].id != t.id && n++;
      return n >= e.config.collision_limit;
    }), e.addEvent = function(t, r, s, n, o) {
      var _ = t;
      arguments.length != 1 && ((_ = o || {}).start_date = t, _.end_date = r, _.text = s, _.id = n, _.layer = this.defaultLayer), _.id = _.id || e.uid(), _.text = _.text || "", typeof _.start_date == "string" && (_.start_date = this.templates.api_date(_.start_date)), typeof _.end_date == "string" && (_.end_date = this.templates.api_date(_.end_date)), _._timed = this.isOneDayEvent(_);
      var a = !this._events[_.id];
      this._events[_.id] = _, this.event_updated(_), this._loading || this.callEvent(a ? "onEventAdded" : "onEventChanged", [_.id, _]);
    }, this._evs_layer = {};
    for (var i = 0; i < this.layers.length; i++)
      this._evs_layer[this.layers[i].name] = [];
    e.addEventNow = function(t, r, s) {
      var n = {};
      typeof t == "object" && (n = t, t = null);
      var o = 6e4 * (this.config.event_duration || this.config.time_step);
      t || (t = Math.round(e._currentDate().valueOf() / o) * o);
      var _ = new Date(t);
      if (!r) {
        var a = this.config.first_hour;
        a > _.getHours() && (_.setHours(a), t = _.valueOf()), r = t + o;
      }
      n.start_date = n.start_date || _, n.end_date = n.end_date || new Date(r), n.text = n.text || this.locale.labels.new_event, n.id = this._drag_id = this.uid(), n.layer = this.defaultLayer, this._drag_mode = "new-size", this._loading = !0, this.addEvent(n), this.callEvent("onEventCreated", [this._drag_id, s]), this._loading = !1, this._drag_event = {}, this._on_mouse_up(s);
    }, e._t_render_view_data = function(t) {
      if (this.config.multi_day && !this._table_view) {
        for (var r = [], s = [], n = 0; n < t.length; n++)
          t[n]._timed ? r.push(t[n]) : s.push(t[n]);
        this._table_view = !0, this.render_data(s), this._table_view = !1, this.render_data(r);
      } else
        this.render_data(t);
    }, e.render_view_data = function() {
      if (this._not_render)
        this._render_wait = !0;
      else {
        this._render_wait = !1, this.clear_view(), this._evs_layer = {};
        for (var t = 0; t < this.layers.length; t++)
          this._evs_layer[this.layers[t].name] = [];
        var r = this.get_visible_events();
        for (t = 0; t < r.length; t++)
          this._evs_layer[r[t].layer] && this._evs_layer[r[t].layer].push(r[t]);
        if (this._mode == "month") {
          var s = [];
          for (t = 0; t < this.layers.length; t++)
            this.layers[t].visible && (s = s.concat(this._evs_layer[this.layers[t].name]));
          this._t_render_view_data(s);
        } else
          for (t = 0; t < this.layers.length; t++)
            if (this.layers[t].visible) {
              var n = this._evs_layer[this.layers[t].name];
              this._t_render_view_data(n);
            }
      }
    }, e._render_v_bar = function(t, r, s, n, o, _, a, d, l) {
      var c = t.id;
      a.indexOf("<div class=") == -1 && (a = e.templates["event_header_" + t.layer] ? e.templates["event_header_" + t.layer](t.start_date, t.end_date, t) : a), d.indexOf("<div class=") == -1 && (d = e.templates["event_text_" + t.layer] ? e.templates["event_text_" + t.layer](t.start_date, t.end_date, t) : d);
      var f = document.createElement("div"), v = "dhx_cal_event", p = e.templates["event_class_" + t.layer] ? e.templates["event_class_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_class(t.start_date, t.end_date, t);
      p && (v = v + " " + p);
      var h = e._border_box_events(), u = n - 2, m = h ? u : n - 4, y = h ? u : n - 6, w = h ? u : n - 14, D = h ? u - 2 : n - 8, E = h ? o - this.xy.event_header_height : o - 30 + 1, S = '<div event_id="' + c + '" ' + e.config.event_attribute + '="' + c + '" class="' + v + '" style="position:absolute; top:' + s + "px; left:" + r + "px; width:" + m + "px; height:" + o + "px;" + (_ || "") + '">';
      return S += '<div class="dhx_header" style=" width:' + y + 'px;" >&nbsp;</div>', S += '<div class="dhx_title">' + a + "</div>", S += '<div class="dhx_body" style=" width:' + w + "px; height:" + E + 'px;">' + d + "</div>", S += '<div class="dhx_footer" style=" width:' + D + "px;" + (l ? " margin-top:-1px;" : "") + '" ></div></div>', f.innerHTML = S, f.style.zIndex = 100, f.firstChild;
    }, e.render_event_bar = function(t) {
      var r = this._els.dhx_cal_data[0], s = this._colsS[t._sday], n = this._colsS[t._eday];
      n == s && (n = this._colsS[t._eday + 1]);
      var o = this.xy.bar_height, _ = this._colsS.heights[t._sweek] + (this._colsS.height ? this.xy.month_scale_height + 2 : 2) + t._sorder * o, a = document.createElement("div"), d = t._timed ? "dhx_cal_event_clear" : "dhx_cal_event_line", l = e.templates["event_class_" + t.layer] ? e.templates["event_class_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_class(t.start_date, t.end_date, t);
      l && (d = d + " " + l);
      var c = '<div event_id="' + t.id + '" ' + this.config.event_attribute + '="' + t.id + '" class="' + d + '" style="position:absolute; top:' + _ + "px; left:" + s + "px; width:" + (n - s - 15) + "px;" + (t._text_style || "") + '">';
      t._timed && (c += e.templates["event_bar_date_" + t.layer] ? e.templates["event_bar_date_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_bar_date(t.start_date, t.end_date, t)), c += e.templates["event_bar_text_" + t.layer] ? e.templates["event_bar_text_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_bar_text(t.start_date, t.end_date, t) + "</div>)", c += "</div>", a.innerHTML = c, this._rendered.push(a.firstChild), r.appendChild(a.firstChild);
    }, e.render_event = function(t) {
      var r = e.xy.menu_width;
      if (e.getLayer(t.layer).noMenu && (r = 0), !(t._sday < 0)) {
        var s = e.locate_holder(t._sday);
        if (s) {
          var n = 60 * t.start_date.getHours() + t.start_date.getMinutes(), o = 60 * t.end_date.getHours() + t.end_date.getMinutes() || 60 * e.config.last_hour, _ = Math.round((60 * n * 1e3 - 60 * this.config.first_hour * 60 * 1e3) * this.config.hour_size_px / 36e5) % (24 * this.config.hour_size_px) + 1, a = Math.max(e.xy.min_event_height, (o - n) * this.config.hour_size_px / 60) + 1, d = Math.floor((s.clientWidth - r) / t._count), l = t._sorder * d + 1;
          t._inner || (d *= t._count - t._sorder);
          var c = this._render_v_bar(t.id, r + l, _, d, a, t._text_style, e.templates.event_header(t.start_date, t.end_date, t), e.templates.event_text(t.start_date, t.end_date, t));
          if (this._rendered.push(c), s.appendChild(c), l = l + parseInt(s.style.left, 10) + r, _ += this._dy_shift, c.style.zIndex = this._layers_zindex[t.layer], this._edit_id == t.id) {
            c.style.zIndex = parseInt(c.style.zIndex) + 1;
            var f = c.style.zIndex;
            d = Math.max(d - 4, e.xy.editor_width), (c = document.createElement("div")).setAttribute("event_id", t.id), c.setAttribute(this.config.event_attribute, t.id), this.set_xy(c, d, a - 20, l, _ + 14), c.className = "dhx_cal_editor", c.style.zIndex = f;
            var v = document.createElement("div");
            this.set_xy(v, d - 6, a - 26), v.style.cssText += ";margin:2px 2px 2px 2px;overflow:hidden;", v.style.zIndex = f, c.appendChild(v), this._els.dhx_cal_data[0].appendChild(c), this._rendered.push(c), v.innerHTML = "<textarea class='dhx_cal_editor'>" + t.text + "</textarea>", this._editor = v.firstChild, this._editor.addEventListener("keypress", function(y) {
              if (y.shiftKey)
                return !0;
              var w = y.keyCode;
              w == e.keys.edit_save && e.editStop(!0), w == e.keys.edit_cancel && e.editStop(!1);
            }), this._editor.addEventListener("selectstart", function(y) {
              return y.cancelBubble = !0, !0;
            }), v.firstChild.focus(), this._els.dhx_cal_data[0].scrollLeft = 0, v.firstChild.select();
          }
          if (this._select_id == t.id) {
            c.style.zIndex = parseInt(c.style.zIndex) + 1;
            for (var p = this.config["icons_" + (this._edit_id == t.id ? "edit" : "select")], h = "", u = 0; u < p.length; u++)
              h += "<div class='dhx_menu_icon " + p[u] + "' title='" + this.locale.labels[p[u]] + "'></div>";
            var m = this._render_v_bar(t.id, l - r + 1, _, r, 20 * p.length + 26, "", "<div class='dhx_menu_head'></div>", h, !0);
            m.style.left = l - r + 1, m.style.zIndex = c.style.zIndex, this._els.dhx_cal_data[0].appendChild(m), this._rendered.push(m);
          }
        }
      }
    }, e.filter_agenda = function(t, r) {
      var s = e.getLayer(r.layer);
      return s && s.visible;
    };
  });
}, limit: function(e) {
  e.config.limit_start = null, e.config.limit_end = null, e.config.limit_view = !1, e.config.check_limits = !0, e._temp_limit_scope = function() {
    var i = null;
    e.attachEvent("onBeforeViewChange", function(t, r, s, n) {
      function o(_, a) {
        var d = e.config.limit_start, l = e.config.limit_end, c = e.date.add(_, 1, a);
        return _.valueOf() > l.valueOf() || c <= d.valueOf();
      }
      return !e.config.limit_view || !o(n = n || r, s = s || t) || r.valueOf() == n.valueOf() || (setTimeout(function() {
        if (e.$destroyed)
          return !0;
        var _ = o(r, s) ? e.config.limit_start : r;
        e.setCurrentView(o(_, s) ? null : _, s);
      }, 1), !1);
    }), e.attachEvent("onMouseDown", function(t) {
      return t != "dhx_time_block";
    }), e.attachEvent("onBeforeDrag", function(t) {
      return !t || e.checkLimitViolation(e.getEvent(t));
    }), e.attachEvent("onClick", function(t, r) {
      return e.checkLimitViolation(e.getEvent(t));
    }), e.attachEvent("onBeforeLightbox", function(t) {
      var r = e.getEvent(t);
      return i = [r.start_date, r.end_date], e.checkLimitViolation(r);
    }), e.attachEvent("onEventSave", function(t, r, s) {
      if (!r.start_date || !r.end_date) {
        var n = e.getEvent(t);
        r.start_date = new Date(n.start_date), r.end_date = new Date(n.end_date);
      }
      if (r.rec_type) {
        var o = e._lame_clone(r);
        return e._roll_back_dates(o), e.checkLimitViolation(o);
      }
      return e.checkLimitViolation(r);
    }), e.attachEvent("onEventAdded", function(t) {
      if (!t)
        return !0;
      var r = e.getEvent(t);
      return !e.checkLimitViolation(r) && e.config.limit_start && e.config.limit_end && (r.start_date < e.config.limit_start && (r.start_date = new Date(e.config.limit_start)), r.start_date.valueOf() >= e.config.limit_end.valueOf() && (r.start_date = this.date.add(e.config.limit_end, -1, "day")), r.end_date < e.config.limit_start && (r.end_date = new Date(e.config.limit_start)), r.end_date.valueOf() >= e.config.limit_end.valueOf() && (r.end_date = this.date.add(e.config.limit_end, -1, "day")), r.start_date.valueOf() >= r.end_date.valueOf() && (r.end_date = this.date.add(r.start_date, this.config.event_duration || this.config.time_step, "minute")), r._timed = this.isOneDayEvent(r)), !0;
    }), e.attachEvent("onEventChanged", function(t) {
      if (!t)
        return !0;
      var r = e.getEvent(t);
      if (!e.checkLimitViolation(r)) {
        if (!i)
          return !1;
        r.start_date = i[0], r.end_date = i[1], r._timed = this.isOneDayEvent(r);
      }
      return !0;
    }), e.attachEvent("onBeforeEventChanged", function(t, r, s) {
      return e.checkLimitViolation(t);
    }), e.attachEvent("onBeforeEventCreated", function(t) {
      var r = e.getActionData(t).date, s = { _timed: !0, start_date: r, end_date: e.date.add(r, e.config.time_step, "minute") };
      return e.checkLimitViolation(s);
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
    });
  }, e._temp_limit_scope();
}, map_view: function(e) {
  let i = null, t = [];
  const r = { googleMap: new Oa(e), openStreetMaps: new La(e), mapbox: new $a(e) };
  function s(o) {
    i = o.ext.mapView.createAdapter(), t.push(e.attachEvent("onEventSave", function(_, a, d) {
      let l = e.getEvent(_);
      return l && l.event_location != a.event_location && (e._eventLocationChanged = !0), !0;
    }), e.attachEvent("onEventChanged", (_, a) => {
      const { start_date: d, end_date: l } = a, { min_date: c, max_date: f } = e.getState();
      return d.valueOf() < f.valueOf() && l.valueOf() > c.valueOf() && i && (e.config.map_settings.resolve_event_location && a.event_location && !e._latLngUpdate ? n(a, i) : i.updateEventMarker(a)), e._latLngUpdate = !1, !0;
    }), e.attachEvent("onEventIdChange", function(_, a) {
      let d = e.getEvent(a);
      i == null || i.removeEventMarker(_), i == null || i.addEventMarker(d);
    }), e.attachEvent("onEventAdded", (_, a) => {
      const { start_date: d, end_date: l } = a, { min_date: c, max_date: f } = e.getState();
      d.valueOf() < f.valueOf() && l.valueOf() > c.valueOf() && i && (e.config.map_settings.resolve_event_location && a.event_location && e._eventLocationChanged ? (n(a, i), e._eventLocationChanged = !1) : (i.addEventMarker(a), i.onEventClick(a)));
    }), e.attachEvent("onClick", function(_, a) {
      const d = e.getEvent(_);
      return i && d && i.onEventClick(d), !1;
    }), e.attachEvent("onBeforeEventDelete", (_, a) => (i && i.removeEventMarker(_), !0)));
  }
  async function n(o, _) {
    let a = await _.resolveAddress(o.event_location);
    return o.lat = a.lat, o.lng = a.lng, _.removeEventMarker(String(o.id)), _.addEventMarker(o), o;
  }
  e.ext || (e.ext = {}), e.ext.mapView = { createAdapter: function() {
    return r[e.config.map_view_provider];
  }, createMarker: function(o) {
    return new google.maps.Marker(o);
  }, currentAdapter: null, adapters: r }, e._latLngUpdate = !1, e._eventLocationChanged = !1, e.config.map_view_provider = "googleMap", e.config.map_settings = { initial_position: { lat: 48.724, lng: 8.215 }, error_position: { lat: 15, lng: 15 }, initial_zoom: 1, zoom_after_resolve: 15, info_window_max_width: 300, resolve_user_location: !0, resolve_event_location: !0, view_provider: "googleMap" }, e.config.map_initial_position && (e.config.map_settings.initial_position = { lat: e.config.map_initial_position.lat(), lng: e.config.map_initial_position.lng() }), e.config.map_error_position && (e.config.map_settings.error_position = { lat: e.config.map_error_position.lat(), lng: e.config.map_error_position.lng() }), e.xy.map_date_width = 188, e.xy.map_icon_width = 25, e.xy.map_description_width = 400, e.date.add_map = function(o, _, a) {
    return new Date(o.valueOf());
  }, e.templates.map_date = function(o, _, a) {
    return "";
  }, e.templates.map_time = function(o, _, a) {
    return e.config.rtl && !a._timed ? e.templates.day_date(_) + " &ndash; " + e.templates.day_date(o) : a._timed ? this.day_date(a.start_date, a.end_date, a) + " " + this.event_date(o) : e.templates.day_date(o) + " &ndash; " + e.templates.day_date(_);
  }, e.templates.map_text = function(o, _, a) {
    return a.text;
  }, e.templates.map_info_content = function(o) {
    return `<div><b>Event's text:</b> ${o.text}
				<div><b>Location:</b> ${o.event_location}</div>
				<div><b>Starts:</b> ${e.templates.tooltip_date_format(o.start_date)}</div>
				<div><b>Ends:</b> ${e.templates.tooltip_date_format(o.end_date)}</div>
			</div>`;
  }, e.date.map_start = function(o) {
    return o;
  }, e.dblclick_dhx_map_area = function(o) {
    let _ = o.target.closest(`[${e.config.event_attribute}]`);
    if (_) {
      let a = _.getAttribute(`${e.config.event_attribute}`);
      e.showLightbox(a);
    }
    this.config.readonly || !this.config.dblclick_create || _ || this.addEventNow({ start_date: e.config.map_start, end_date: e.date.add(e.config.map_start, e.config.time_step, "minute") });
  }, e.attachEvent("onSchedulerReady", function() {
    e.config.map_initial_zoom !== void 0 && (e.config.map_settings.initial_zoom = e.config.map_initial_zoom), e.config.map_zoom_after_resolve !== void 0 && (e.config.map_settings.zoom_after_resolve = e.config.map_zoom_after_resolve), e.config.map_infowindow_max_width !== void 0 && (e.config.map_settings.info_window_max_width = e.config.map_infowindow_max_width), e.config.map_resolve_user_location !== void 0 && (e.config.map_settings.resolve_user_location = e.config.map_resolve_user_location), e.config.map_view_provider !== void 0 && (e.config.map_settings.view_provider = e.config.map_view_provider), e.config.map_type !== void 0 && (e.config.map_settings.type = e.config.map_type), e.config.map_resolve_event_location !== void 0 && (e.config.map_settings.resolve_event_location = e.config.map_resolve_event_location), e.ext.mapView.currentAdapter = e.config.map_view_provider;
    let o = document.createElement("div");
    o.className = "mapContainer", o.id = "mapContainer", o.style.display = "none", o.style.zIndex = "1", e._obj.appendChild(o);
    const _ = e.render_data;
    function a() {
      let l = e.get_visible_events();
      l.sort(function(p, h) {
        return p.start_date.valueOf() == h.start_date.valueOf() ? p.id > h.id ? 1 : -1 : p.start_date > h.start_date ? 1 : -1;
      });
      let c = "<div " + e._waiAria.mapAttrString() + " class='dhx_map_area'>";
      for (let p = 0; p < l.length; p++) {
        let h = l[p], u = h.id == e._selected_event_id ? "dhx_map_line highlight" : "dhx_map_line", m = h.color ? "--dhx-scheduler-event-background:" + h.color + ";" : "", y = h.textColor ? "--dhx-scheduler-event-color:" + h.textColor + ";" : "", w = e._waiAria.mapRowAttrString(h), D = e._waiAria.mapDetailsBtnString();
        c += "<div " + w + " class='" + u + "' event_id='" + h.id + "' " + e.config.event_attribute + "='" + h.id + "' style='" + m + y + (h._text_style || "") + " width: " + (e.xy.map_date_width + e.xy.map_description_width + 2) + "px;'><div class='dhx_map_event_time' style='width: " + e.xy.map_date_width + "px;' >" + e.templates.map_time(h.start_date, h.end_date, h) + "</div>", c += `<div ${D} class='dhx_event_icon icon_details'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15.4444 16.4H4.55556V7.6H15.4444V16.4ZM13.1111 2V3.6H6.88889V2H5.33333V3.6H4.55556C3.69222 3.6 3 4.312 3 5.2V16.4C3 16.8243 3.16389 17.2313 3.45561 17.5314C3.74733 17.8314 4.143 18 4.55556 18H15.4444C15.857 18 16.2527 17.8314 16.5444 17.5314C16.8361 17.2313 17 16.8243 17 16.4V5.2C17 4.312 16.3 3.6 15.4444 3.6H14.6667V2H13.1111ZM13.8889 10.8H10V14.8H13.8889V10.8Z" fill="#A1A4A6"/>
			</svg></div>`, c += "<div class='line_description' style='width:" + (e.xy.map_description_width - e.xy.map_icon_width) + "px;'>" + e.templates.map_text(h.start_date, h.end_date, h) + "</div></div>";
      }
      c += "<div class='dhx_v_border' style=" + (e.config.rtl ? "'right: " : "'left: ") + (e.xy.map_date_width - 1) + "px;'></div><div class='dhx_v_border_description'></div></div>", e._els.dhx_cal_data[0].scrollTop = 0, e._els.dhx_cal_data[0].innerHTML = c;
      let f = e._els.dhx_cal_data[0].firstChild.childNodes, v = e._getNavDateElement();
      v && (v.innerHTML = e.templates[e._mode + "_date"](e._min_date, e._max_date, e._mode)), e._rendered = [];
      for (let p = 0; p < f.length - 2; p++)
        e._rendered[p] = f[p];
    }
    e.render_data = function(l, c) {
      if (this._mode != "map")
        return _.apply(this, arguments);
      {
        a();
        let f = e.get_visible_events();
        i && (i.clearEventMarkers(), f.forEach((v) => i == null ? void 0 : i.addEventMarker(v)));
      }
    }, e.map_view = function(l) {
      e._els.dhx_cal_data[0].style.width = e.xy.map_date_width + e.xy.map_description_width + 1 + "px", e._min_date = e.config.map_start || e._currentDate(), e._max_date = e.config.map_end || e.date.add(e._currentDate(), 1, "year"), e._table_view = !0, function(p) {
        if (p) {
          const h = e.locale.labels;
          e._els.dhx_cal_header[0].innerHTML = "<div class='dhx_map_head' style='width: " + (e.xy.map_date_width + e.xy.map_description_width + 2) + "px;' ><div class='headline_date' style='width: " + e.xy.map_date_width + "px;'>" + h.date + "</div><div class='headline_description' style='width: " + e.xy.map_description_width + "px;'>" + h.description + "</div></div>", e._table_view = !0, e.set_sizes();
        }
      }(l);
      let c = document.getElementById("mapContainer");
      var f, v;
      (function(p) {
        let h = document.getElementById(p);
        if (h) {
          const u = e.$container.querySelector(".dhx_cal_navline").offsetHeight;
          let m = e.$container.querySelector(".dhx_cal_data").offsetHeight + e.$container.querySelector(".dhx_cal_header").offsetHeight;
          m < 0 && (m = 0);
          let y = e._x - e.xy.map_date_width - e.xy.map_description_width - 1;
          y < 0 && (y = 0), h.style.height = m + "px", h.style.width = y + "px", h.style.position = "absolute", h.style.top = u + "px", e.config.rtl ? h.style.marginRight = e.xy.map_date_width + e.xy.map_description_width + 1 + "px" : h.style.marginLeft = e.xy.map_date_width + e.xy.map_description_width + 1 + "px", h.style.marginTop = e.xy.nav_height + 2 + "px";
        }
      })("mapContainer"), l && c ? (o.style.display = "block", a(), e.config.map_view_provider == e.ext.mapView.currentAdapter ? (i == null || i.destroy(c), s(e), i == null || i.initialize(c, e.config.map_settings)) : (i == null || i.destroy(c), s(e), i == null || i.initialize(c, e.config.map_settings), e.ext.mapView.currentAdapter = e.config.map_view_provider), i && (f = e.config.map_settings, v = i, f.resolve_user_location ? navigator.geolocation && navigator.geolocation.getCurrentPosition(function(p) {
        v.setView(p.coords.latitude, p.coords.longitude, f.zoom_after_resolve || f.initial_zoom);
      }) : v.setView(f.initial_position.lat, f.initial_position.lng, f.initial_zoom))) : (o.style.display = "none", e._els.dhx_cal_data[0].style.width = "100%", i && c && (i.destroy(c), i = null, e.ext.mapView.currentAdapter = e.config.map_view_provider), t.forEach((p) => e.detachEvent(p)), t = []);
    }, e.attachEvent("onLocationError", function(l) {
      return alert("Location can't be found"), google.maps.LatLng(51.47784, -1492e-6);
    });
    let d = async function(l) {
      if (i) {
        const c = await i.resolveAddress(l.event_location);
        c.lat && c.lng ? (l.lat = +c.lat, l.lng = +c.lng) : (e.callEvent("onLocationError", [l.id]), l.lng = e.config.map_settings.error_position.lng, l.lat = e.config.map_settings.error_position.lat), e._latLngUpdate = !0, e.callEvent("onEventChanged", [l.id, l]);
      }
    };
    e._event_resolve_delay = 1500, e.attachEvent("onEventLoading", function(l) {
      return l.lat && l.lng && (l.lat = +l.lat, l.lng = +l.lng), e.config.map_settings.resolve_event_location && l.event_location && !l.lat && !l.lng && (e._event_resolve_delay += 1500, function(c, f, v, p) {
        setTimeout(function() {
          if (e.$destroyed)
            return !0;
          let h = c.apply(f, v);
          return c = f = v = null, h;
        }, p || 1);
      }(d, this, [l], e._event_resolve_delay)), !0;
    });
  });
}, minical: function(e) {
  const i = e._createDomEventScope();
  e.config.minicalendar = { mark_events: !0 }, e._synced_minicalendars = [], e.renderCalendar = function(t, r, s) {
    var n = null, o = t.date || e._currentDate();
    if (typeof o == "string" && (o = this.templates.api_date(o)), r)
      n = this._render_calendar(r.parentNode, o, t, r), e.unmarkCalendar(n);
    else {
      var _ = t.container, a = t.position;
      if (typeof _ == "string" && (_ = document.getElementById(_)), typeof a == "string" && (a = document.getElementById(a)), a && a.left === void 0 && a.right === void 0) {
        var d = e.$domHelpers.getOffset(a);
        a = { top: d.top + a.offsetHeight, left: d.left };
      }
      _ || (_ = e._get_def_cont(a)), (n = this._render_calendar(_, o, t)).$_eventAttached || (n.$_eventAttached = !0, i.attach(n, "click", (function(y) {
        var w = y.target || y.srcElement, D = e.$domHelpers;
        if (D.closest(w, ".dhx_month_head") && !D.closest(w, ".dhx_after") && !D.closest(w, ".dhx_before")) {
          var E = D.closest(w, "[data-cell-date]").getAttribute("data-cell-date"), S = e.templates.parse_date(E);
          e.unmarkCalendar(this), e.markCalendar(this, S, "dhx_calendar_click"), this._last_date = S, this.conf.events && this.conf.events.onDateClick && this.conf.events.onDateClick.call(this, S, y), this.conf.handler && this.conf.handler.call(e, S, this);
        }
      }).bind(n)), i.attach(n, "mouseover", (function(y) {
        const w = y.target;
        if (w.classList.contains("dhx_cal_month_cell")) {
          var D = w.getAttribute("data-cell-date"), E = e.templates.parse_date(D);
          this.conf.events && this.conf.events.onDateMouseOver && this.conf.events.onDateMouseOver.call(this, E, y);
        }
      }).bind(n)));
    }
    if (e.config.minicalendar.mark_events)
      for (var l = e.date.month_start(o), c = e.date.add(l, 1, "month"), f = this.getEvents(l, c), v = this["filter_" + this._mode], p = {}, h = 0; h < f.length; h++) {
        var u = f[h];
        if (!v || v(u.id, u)) {
          var m = u.start_date;
          for (m.valueOf() < l.valueOf() && (m = l), m = e.date.date_part(new Date(m.valueOf())); m < u.end_date && (p[+m] || (p[+m] = !0, this.markCalendar(n, m, "dhx_year_event")), !((m = this.date.add(m, 1, "day")).valueOf() >= c.valueOf())); )
            ;
        }
      }
    return this._markCalendarCurrentDate(n), n.conf = t, t.sync && !s && this._synced_minicalendars.push(n), n.conf._on_xle_handler || (n.conf._on_xle_handler = e.attachEvent("onXLE", function() {
      e.updateCalendar(n, n.conf.date);
    })), this.config.wai_aria_attributes && this.config.wai_aria_application_role && n.setAttribute("role", "application"), n;
  }, e._get_def_cont = function(t) {
    return this._def_count || (this._def_count = document.createElement("div"), this._def_count.className = "dhx_minical_popup", e.event(this._def_count, "click", function(r) {
      r.cancelBubble = !0;
    }), document.body.appendChild(this._def_count)), t.left && (this._def_count.style.left = t.left + "px"), t.right && (this._def_count.style.right = t.right + "px"), t.top && (this._def_count.style.top = t.top + "px"), t.bottom && (this._def_count.style.bottom = t.bottom + "px"), this._def_count._created = /* @__PURE__ */ new Date(), this._def_count;
  }, e._locateCalendar = function(t, r) {
    if (typeof r == "string" && (r = e.templates.api_date(r)), +r > +t._max_date || +r < +t._min_date)
      return null;
    for (var s = t.querySelector(".dhx_year_body").childNodes[0], n = 0, o = new Date(t._min_date); +this.date.add(o, 1, "week") <= +r; )
      o = this.date.add(o, 1, "week"), n++;
    var _ = e.config.start_on_monday, a = (r.getDay() || (_ ? 7 : 0)) - (_ ? 1 : 0);
    const d = s.querySelector(`.dhx_cal_month_row:nth-child(${n + 1}) .dhx_cal_month_cell:nth-child(${a + 1})`);
    return d ? d.firstChild : null;
  }, e.markCalendar = function(t, r, s) {
    var n = this._locateCalendar(t, r);
    n && (n.className += " " + s);
  }, e.unmarkCalendar = function(t, r, s) {
    if (s = s || "dhx_calendar_click", r = r || t._last_date) {
      var n = this._locateCalendar(t, r);
      n && (n.className = (n.className || "").replace(RegExp(s, "g")));
    }
  }, e._week_template = function(t) {
    for (var r = t || 250, s = 0, n = document.createElement("div"), o = this.date.week_start(e._currentDate()), _ = 0; _ < 7; _++)
      this._cols[_] = Math.floor(r / (7 - _)), this._render_x_header(_, s, o, n), o = this.date.add(o, 1, "day"), r -= this._cols[_], s += this._cols[_];
    return n.lastChild.className += " dhx_scale_bar_last", n;
  }, e.updateCalendar = function(t, r) {
    if (t.conf.date && t.conf.events && t.conf.events.onBeforeMonthChange && t.conf.events.onBeforeMonthChange.call(t, t.conf.date, r, t) === !1)
      return;
    const s = t.conf.date;
    t.conf.date = r, this.renderCalendar(t.conf, t, !0), t.conf.events && t.conf.events.onMonthChange && t.conf.events.onMonthChange.call(t, s, r);
  }, e._mini_cal_arrows = ["&nbsp;", "&nbsp;"], e._render_calendar = function(t, r, s, n) {
    var o = e.templates, _ = this._cols;
    this._cols = [];
    var a = this._mode;
    this._mode = "calendar";
    var d = this._colsS;
    this._colsS = { height: 0 };
    var l = new Date(this._min_date), c = new Date(this._max_date), f = new Date(e._date), v = o.month_day, p = this._ignores_detected;
    this._ignores_detected = 0, o.month_day = o.calendar_date, r = this.date.month_start(r);
    var h, u = this._week_template(t.offsetWidth - 1 - this.config.minicalendar.padding);
    n ? h = n : (h = document.createElement("div")).className = "dhx_cal_container dhx_mini_calendar", h.setAttribute("date", this._helpers.formatDate(r)), h.innerHTML = "<div class='dhx_year_month'></div><div class='dhx_year_grid" + (e.config.rtl ? " dhx_grid_rtl'>" : "'>") + "<div class='dhx_year_week'>" + (u ? u.innerHTML : "") + "</div><div class='dhx_year_body'></div></div>";
    var m = h.querySelector(".dhx_year_month"), y = h.querySelector(".dhx_year_week"), w = h.querySelector(".dhx_year_body");
    if (m.innerHTML = this.templates.calendar_month(r), s.navigation)
      for (var D = function(j, V) {
        var Y = e.date.add(j._date, V, "month");
        e.updateCalendar(j, Y), e._date.getMonth() == j._date.getMonth() && e._date.getFullYear() == j._date.getFullYear() && e._markCalendarCurrentDate(j);
      }, E = ["dhx_cal_prev_button", "dhx_cal_next_button"], S = ["left:1px;top:4px;position:absolute;", "left:auto; right:1px;top:4px;position:absolute;"], g = [-1, 1], b = function(j) {
        return function() {
          if (s.sync)
            for (var V = e._synced_minicalendars, Y = 0; Y < V.length; Y++)
              D(V[Y], j);
          else
            e.config.rtl && (j = -j), D(h, j);
        };
      }, x = [e.locale.labels.prev, e.locale.labels.next], k = 0; k < 2; k++) {
        var M = document.createElement("div");
        M.className = E[k], e._waiAria.headerButtonsAttributes(M, x[k]), M.style.cssText = S[k], M.innerHTML = this._mini_cal_arrows[k], m.appendChild(M), i.attach(M, "click", b(g[k]));
      }
    h._date = new Date(r), h.week_start = (r.getDay() - (this.config.start_on_monday ? 1 : 0) + 7) % 7;
    var N = h._min_date = this.date.week_start(r);
    h._max_date = this.date.add(h._min_date, 6, "week"), this._reset_month_scale(w, r, N, 6), n || t.appendChild(h), y.style.height = y.childNodes[0].offsetHeight - 1 + "px";
    var T = e.uid();
    e._waiAria.minicalHeader(m, T), e._waiAria.minicalGrid(h.querySelector(".dhx_year_grid"), T), e._waiAria.minicalRow(y);
    for (var A = y.querySelectorAll(".dhx_scale_bar"), C = 0; C < A.length; C++)
      e._waiAria.minicalHeadCell(A[C]);
    var $ = w.querySelectorAll(".dhx_cal_month_cell"), O = new Date(N);
    for (C = 0; C < $.length; C++)
      e._waiAria.minicalDayCell($[C], new Date(O)), O = e.date.add(O, 1, "day");
    return e._waiAria.minicalHeader(m, T), this._cols = _, this._mode = a, this._colsS = d, this._min_date = l, this._max_date = c, e._date = f, o.month_day = v, this._ignores_detected = p, h;
  }, e.destroyCalendar = function(t, r) {
    !t && this._def_count && this._def_count.firstChild && (r || (/* @__PURE__ */ new Date()).valueOf() - this._def_count._created.valueOf() > 500) && (t = this._def_count.firstChild), t && (i.detachAll(), t.innerHTML = "", t.parentNode && t.parentNode.removeChild(t), this._def_count && (this._def_count.style.top = "-1000px"), t.conf && t.conf._on_xle_handler && e.detachEvent(t.conf._on_xle_handler));
  }, e.isCalendarVisible = function() {
    return !!(this._def_count && parseInt(this._def_count.style.top, 10) > 0) && this._def_count;
  }, e.attachEvent("onTemplatesReady", function() {
    e.event(document.body, "click", function() {
      e.destroyCalendar();
    });
  }, { once: !0 }), e.form_blocks.calendar_time = { render: function(t) {
    var r = "<span class='dhx_minical_input_wrapper'><input class='dhx_readonly dhx_minical_input' type='text' readonly='true'></span>", s = e.config, n = this.date.date_part(e._currentDate()), o = 1440, _ = 0;
    s.limit_time_select && (_ = 60 * s.first_hour, o = 60 * s.last_hour + 1), n.setHours(_ / 60), t._time_values = [], r += " <select class='dhx_lightbox_time_select'>";
    for (var a = _; a < o; a += 1 * this.config.time_step)
      r += "<option value='" + a + "'>" + this.templates.time_picker(n) + "</option>", t._time_values.push(a), n = this.date.add(n, this.config.time_step, "minute");
    return "<div class='dhx_section_time dhx_lightbox_minical'>" + (r += "</select>") + "<span class='dhx_lightbox_minical_spacer'> &nbsp;&ndash;&nbsp; </span>" + r + "</div>";
  }, set_value: function(t, r, s, n) {
    var o, _, a = t.getElementsByTagName("input"), d = t.getElementsByTagName("select"), l = function(m, y, w) {
      e.event(m, "click", function() {
        e.destroyCalendar(null, !0), e.renderCalendar({ position: m, date: new Date(this._date), navigation: !0, handler: function(D) {
          m.value = e.templates.calendar_time(D), m._date = new Date(D), e.destroyCalendar(), e.config.event_duration && e.config.auto_end_date && w === 0 && p();
        } });
      });
    };
    if (e.config.full_day) {
      if (!t._full_day) {
        var c = "<label class='dhx_fullday'><input type='checkbox' name='full_day' value='true'> " + e.locale.labels.full_day + "&nbsp;</label></input>";
        e.config.wide_form || (c = t.previousSibling.innerHTML + c), t.previousSibling.innerHTML = c, t._full_day = !0;
      }
      var f = t.previousSibling.getElementsByTagName("input")[0], v = e.date.time_part(s.start_date) === 0 && e.date.time_part(s.end_date) === 0;
      f.checked = v, d[0].disabled = f.checked, d[1].disabled = f.checked, f.$_eventAttached || (f.$_eventAttached = !0, e.event(f, "click", function() {
        if (f.checked === !0) {
          var m = {};
          e.form_blocks.calendar_time.get_value(t, m), o = e.date.date_part(m.start_date), (+(_ = e.date.date_part(m.end_date)) == +o || +_ >= +o && (s.end_date.getHours() !== 0 || s.end_date.getMinutes() !== 0)) && (_ = e.date.add(_, 1, "day"));
        } else
          o = null, _ = null;
        var y = o || s.start_date, w = _ || s.end_date;
        h(a[0], y), h(a[1], w), d[0].value = 60 * y.getHours() + y.getMinutes(), d[1].value = 60 * w.getHours() + w.getMinutes(), d[0].disabled = f.checked, d[1].disabled = f.checked;
      }));
    }
    if (e.config.event_duration && e.config.auto_end_date) {
      var p = function() {
        e.config.auto_end_date && e.config.event_duration && (o = e.date.add(a[0]._date, d[0].value, "minute"), _ = new Date(o.getTime() + 60 * e.config.event_duration * 1e3), a[1].value = e.templates.calendar_time(_), a[1]._date = e.date.date_part(new Date(_)), d[1].value = 60 * _.getHours() + _.getMinutes());
      };
      d[0].$_eventAttached || d[0].addEventListener("change", p);
    }
    function h(m, y, w) {
      l(m, y, w), m.value = e.templates.calendar_time(y), m._date = e.date.date_part(new Date(y));
    }
    function u(m) {
      for (var y = n._time_values, w = 60 * m.getHours() + m.getMinutes(), D = w, E = !1, S = 0; S < y.length; S++) {
        var g = y[S];
        if (g === w) {
          E = !0;
          break;
        }
        g < w && (D = g);
      }
      return E || D ? E ? w : D : -1;
    }
    h(a[0], s.start_date, 0), h(a[1], s.end_date, 1), l = function() {
    }, d[0].value = u(s.start_date), d[1].value = u(s.end_date);
  }, get_value: function(t, r) {
    var s = t.getElementsByTagName("input"), n = t.getElementsByTagName("select");
    return r.start_date = e.date.add(s[0]._date, n[0].value, "minute"), r.end_date = e.date.add(s[1]._date, n[1].value, "minute"), r.end_date <= r.start_date && (r.end_date = e.date.add(r.start_date, e.config.time_step, "minute")), { start_date: new Date(r.start_date), end_date: new Date(r.end_date) };
  }, focus: function(t) {
  } }, e.linkCalendar = function(t, r) {
    var s = function() {
      var n = e._date, o = new Date(n.valueOf());
      return r && (o = r(o)), o.setDate(1), e.updateCalendar(t, o), !0;
    };
    e.attachEvent("onViewChange", s), e.attachEvent("onXLE", s), e.attachEvent("onEventAdded", s), e.attachEvent("onEventChanged", s), e.attachEvent("onEventDeleted", s), s();
  }, e._markCalendarCurrentDate = function(t) {
    var r = e.getState(), s = r.min_date, n = r.max_date, o = r.mode, _ = e.date.month_start(new Date(t._date)), a = e.date.add(_, 1, "month");
    if (!({ month: !0, year: !0, agenda: !0, grid: !0 }[o] || s.valueOf() <= _.valueOf() && n.valueOf() >= a.valueOf()))
      for (var d = s; d.valueOf() < n.valueOf(); )
        _.valueOf() <= d.valueOf() && a > d && e.markCalendar(t, d, "dhx_calendar_click"), d = e.date.add(d, 1, "day");
  }, e.attachEvent("onEventCancel", function() {
    e.destroyCalendar(null, !0);
  }), e.attachEvent("onDestroy", function() {
    e.destroyCalendar();
  });
}, monthheight: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    e.xy.scroll_width = 0;
    var i = e.render_view_data;
    e.render_view_data = function() {
      var r = this._els.dhx_cal_data[0];
      r.firstChild._h_fix = !0, i.apply(e, arguments);
      var s = parseInt(r.style.height);
      r.style.height = "1px", r.style.height = r.scrollHeight + "px", this._obj.style.height = this._obj.clientHeight + r.scrollHeight - s + "px";
    };
    var t = e._reset_month_scale;
    e._reset_month_scale = function(r, s, n, o) {
      var _ = { clientHeight: 100 };
      t.apply(e, [_, s, n, o]), r.innerHTML = _.innerHTML;
    };
  });
}, multisection: function(e) {
  le("Multisection", e.assert);
}, multiselect: function(e) {
  e.form_blocks.multiselect = { render: function(i) {
    var t = "dhx_multi_select_control dhx_multi_select_" + i.name;
    i.vertical && (t += " dhx_multi_select_control_vertical");
    for (var r = "<div class='" + t + "' style='overflow: auto; max-height: " + i.height + "px; position: relative;' >", s = 0; s < i.options.length; s++)
      r += "<label><input type='checkbox' value='" + i.options[s].key + "'/>" + i.options[s].label + "</label>";
    return r += "</div>";
  }, set_value: function(i, t, r, s) {
    for (var n = i.getElementsByTagName("input"), o = 0; o < n.length; o++)
      n[o].checked = !1;
    function _(f) {
      for (var v = i.getElementsByTagName("input"), p = 0; p < v.length; p++)
        v[p].checked = !!f[v[p].value];
    }
    var a = {};
    if (r[s.map_to]) {
      var d = (r[s.map_to] + "").split(s.delimiter || e.config.section_delimiter || ",");
      for (o = 0; o < d.length; o++)
        a[d[o]] = !0;
      _(a);
    } else {
      if (e._new_event || !s.script_url)
        return;
      var l = document.createElement("div");
      l.className = "dhx_loading", l.style.cssText = "position: absolute; top: 40%; left: 40%;", i.appendChild(l);
      var c = [s.script_url, s.script_url.indexOf("?") == -1 ? "?" : "&", "dhx_crosslink_" + s.map_to + "=" + r.id + "&uid=" + e.uid()].join("");
      e.ajax.get(c, function(f) {
        var v = function(p) {
          try {
            for (var h = JSON.parse(p.xmlDoc.responseText), u = {}, m = 0; m < h.length; m++) {
              var y = h[m];
              u[y.value || y.key || y.id] = !0;
            }
            return u;
          } catch {
            return null;
          }
        }(f);
        v || (v = function(p, h) {
          for (var u = e.ajax.xpath("//data/item", p.xmlDoc), m = {}, y = 0; y < u.length; y++)
            m[u[y].getAttribute(h.map_to)] = !0;
          return m;
        }(f, s)), _(v), i.removeChild(l);
      });
    }
  }, get_value: function(i, t, r) {
    for (var s = [], n = i.getElementsByTagName("input"), o = 0; o < n.length; o++)
      n[o].checked && s.push(n[o].value);
    return s.join(r.delimiter || e.config.section_delimiter || ",");
  }, focus: function(i) {
  } };
}, multisource: function(e) {
  var i = e._load;
  e._load = function(t, r) {
    if (typeof (t = t || this._load_url) == "object")
      for (var s = function(o) {
        var _ = function() {
        };
        return _.prototype = o, _;
      }(this._loaded), n = 0; n < t.length; n++)
        this._loaded = new s(), i.call(this, t[n], r);
    else
      i.apply(this, arguments);
  };
}, mvc: function(e) {
  var i, t = { use_id: !1 };
  function r(o) {
    var _ = {};
    for (var a in o)
      a.indexOf("_") !== 0 && (_[a] = o[a]);
    return t.use_id || delete _.id, _;
  }
  function s(o) {
    o._not_render = !1, o._render_wait && o.render_view_data(), o._loading = !1, o.callEvent("onXLE", []);
  }
  function n(o) {
    return t.use_id ? o.id : o.cid;
  }
  e.backbone = function(o, _) {
    _ && (t = _), o.bind("change", function(l, c) {
      var f = n(l), v = e._events[f] = l.toJSON();
      v.id = f, e._init_event(v), clearTimeout(i), i = setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.updateView();
      }, 1);
    }), o.bind("remove", function(l, c) {
      var f = n(l);
      e._events[f] && e.deleteEvent(f);
    });
    var a = [];
    function d() {
      if (e.$destroyed)
        return !0;
      a.length && (e.parse(a, "json"), a = []);
    }
    o.bind("add", function(l, c) {
      var f = n(l);
      if (!e._events[f]) {
        var v = l.toJSON();
        v.id = f, e._init_event(v), a.push(v), a.length == 1 && setTimeout(d, 1);
      }
    }), o.bind("request", function(l) {
      var c;
      l instanceof Backbone.Collection && ((c = e)._loading = !0, c._not_render = !0, c.callEvent("onXLS", []));
    }), o.bind("sync", function(l) {
      l instanceof Backbone.Collection && s(e);
    }), o.bind("error", function(l) {
      l instanceof Backbone.Collection && s(e);
    }), e.attachEvent("onEventCreated", function(l) {
      var c = new o.model(e.getEvent(l));
      return e._events[l] = c.toJSON(), e._events[l].id = l, !0;
    }), e.attachEvent("onEventAdded", function(l) {
      if (!o.get(l)) {
        var c = r(e.getEvent(l)), f = new o.model(c), v = n(f);
        v != l && this.changeEventId(l, v), o.add(f), o.trigger("scheduler:add", f);
      }
      return !0;
    }), e.attachEvent("onEventChanged", function(l) {
      var c = o.get(l), f = r(e.getEvent(l));
      return c.set(f), o.trigger("scheduler:change", c), !0;
    }), e.attachEvent("onEventDeleted", function(l) {
      var c = o.get(l);
      return c && (o.trigger("scheduler:remove", c), o.remove(l)), !0;
    });
  };
}, outerdrag: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    var i, t = new dhtmlDragAndDropObject(), r = t.stopDrag;
    function s(n, o, _, a) {
      if (!e.checkEvent("onBeforeExternalDragIn") || e.callEvent("onBeforeExternalDragIn", [n, o, _, a, i])) {
        var d = e.attachEvent("onEventCreated", function(p) {
          e.callEvent("onExternalDragIn", [p, n, i]) || (this._drag_mode = this._drag_id = null, this.deleteEvent(p));
        }), l = e.getActionData(i), c = { start_date: new Date(l.date) };
        if (e.matrix && e.matrix[e._mode]) {
          var f = e.matrix[e._mode];
          c[f.y_property] = l.section;
          var v = e._locate_cell_timeline(i);
          c.start_date = f._trace_x[v.x], c.end_date = e.date.add(c.start_date, f.x_step, f.x_unit);
        }
        e._props && e._props[e._mode] && (c[e._props[e._mode].map_to] = l.section), e.addEventNow(c), e.detachEvent(d);
      }
    }
    t.stopDrag = function(n) {
      return i = n, r.apply(this, arguments);
    }, t.addDragLanding(e._els.dhx_cal_data[0], { _drag: function(n, o, _, a) {
      s(n, o, _, a);
    }, _dragIn: function(n, o) {
      return n;
    }, _dragOut: function(n) {
      return this;
    } }), dhtmlx.DragControl && dhtmlx.DragControl.addDrop(e._els.dhx_cal_data[0], { onDrop: function(n, o, _, a) {
      var d = dhtmlx.DragControl.getMaster(n);
      i = a, s(n, d, o, a.target || a.srcElement);
    }, onDragIn: function(n, o, _) {
      return o;
    } }, !0);
  });
}, pdf: function(e) {
  var i, t, r = new RegExp("<[^>]*>", "g"), s = new RegExp("<br[^>]*>", "g");
  function n(E) {
    return E.replace(s, `
`).replace(r, "");
  }
  function o(E, S) {
    E = parseFloat(E), S = parseFloat(S), isNaN(S) || (E -= S);
    var g = a(E);
    return E = E - g.width + g.cols * i, isNaN(E) ? "auto" : 100 * E / i;
  }
  function _(E, S, g) {
    E = parseFloat(E), S = parseFloat(S), !isNaN(S) && g && (E -= S);
    var b = a(E);
    return E = E - b.width + b.cols * i, isNaN(E) ? "auto" : 100 * E / (i - (isNaN(S) ? 0 : S));
  }
  function a(E) {
    for (var S = 0, g = e._els.dhx_cal_header[0].childNodes, b = g[1] ? g[1].childNodes : g[0].childNodes, x = 0; x < b.length; x++) {
      var k = b[x].style ? b[x] : b[x].parentNode, M = parseFloat(k.style.width);
      if (!(E > M))
        break;
      E -= M + 1, S += M + 1;
    }
    return { width: S, cols: x };
  }
  function d(E) {
    return E = parseFloat(E), isNaN(E) ? "auto" : 100 * E / t;
  }
  function l(E, S) {
    return (window.getComputedStyle ? window.getComputedStyle(E, null)[S] : E.currentStyle ? E.currentStyle[S] : null) || "";
  }
  function c(E, S) {
    for (var g = parseInt(E.style.left, 10), b = 0; b < e._cols.length; b++)
      if ((g -= e._cols[b]) < 0)
        return b;
    return S;
  }
  function f(E, S) {
    for (var g = parseInt(E.style.top, 10), b = 0; b < e._colsS.heights.length; b++)
      if (e._colsS.heights[b] > g)
        return b;
    return S;
  }
  function v(E) {
    return E ? "</" + E + ">" : "";
  }
  function p(E, S, g, b) {
    var x = "<" + E + " profile='" + S + "'";
    return g && (x += " header='" + g + "'"), b && (x += " footer='" + b + "'"), x += ">";
  }
  function h() {
    var E = "", S = e._mode;
    if (e.matrix && e.matrix[e._mode] && (S = e.matrix[e._mode].render == "cell" ? "matrix" : "timeline"), E += "<scale mode='" + S + "' today='" + e._els.dhx_cal_date[0].innerHTML + "'>", e._mode == "week_agenda")
      for (var g = e._els.dhx_cal_data[0].getElementsByTagName("DIV"), b = 0; b < g.length; b++)
        g[b].className == "dhx_wa_scale_bar" && (E += "<column>" + n(g[b].innerHTML) + "</column>");
    else if (e._mode == "agenda" || e._mode == "map")
      E += "<column>" + n((g = e._els.dhx_cal_header[0].childNodes[0].childNodes)[0].innerHTML) + "</column><column>" + n(g[1].innerHTML) + "</column>";
    else if (e._mode == "year")
      for (g = e._els.dhx_cal_data[0].childNodes, b = 0; b < g.length; b++)
        E += "<month label='" + n(g[b].querySelector(".dhx_year_month").innerHTML) + "'>", E += m(g[b].querySelector(".dhx_year_week").childNodes), E += u(g[b].querySelector(".dhx_year_body")), E += "</month>";
    else {
      E += "<x>", E += m(g = e._els.dhx_cal_header[0].childNodes), E += "</x>";
      var x = e._els.dhx_cal_data[0];
      if (e.matrix && e.matrix[e._mode]) {
        for (E += "<y>", b = 0; b < x.firstChild.rows.length; b++)
          E += "<row><![CDATA[" + n(x.firstChild.rows[b].cells[0].innerHTML) + "]]></row>";
        E += "</y>", t = x.firstChild.rows[0].cells[0].offsetHeight;
      } else if (x.firstChild.tagName == "TABLE")
        E += u(x);
      else {
        for (x = x.childNodes[x.childNodes.length - 1]; x.className.indexOf("dhx_scale_holder") == -1; )
          x = x.previousSibling;
        for (x = x.childNodes, E += "<y>", b = 0; b < x.length; b++)
          E += `
<row><![CDATA[` + n(x[b].innerHTML) + "]]></row>";
        E += "</y>", t = x[0].offsetHeight;
      }
    }
    return E += "</scale>";
  }
  function u(E) {
    for (var S = "", g = E.querySelectorAll("tr"), b = 0; b < g.length; b++) {
      for (var x = [], k = g[b].querySelectorAll("td"), M = 0; M < k.length; M++)
        x.push(k[M].querySelector(".dhx_month_head").innerHTML);
      S += `
<row height='` + k[0].offsetHeight + "'><![CDATA[" + n(x.join("|")) + "]]></row>", t = k[0].offsetHeight;
    }
    return S;
  }
  function m(E) {
    var S, g = "";
    e.matrix && e.matrix[e._mode] && (e.matrix[e._mode].second_scale && (S = E[1].childNodes), E = E[0].childNodes);
    for (var b = 0; b < E.length; b++)
      g += `
<column><![CDATA[` + n(E[b].innerHTML) + "]]></column>";
    if (i = E[0].offsetWidth, S) {
      var x = 0, k = E[0].offsetWidth, M = 1;
      for (b = 0; b < S.length; b++)
        g += `
<column second_scale='` + M + "'><![CDATA[" + n(S[b].innerHTML) + "]]></column>", (x += S[b].offsetWidth) >= k && (k += E[M] ? E[M].offsetWidth : 0, M++), i = S[0].offsetWidth;
    }
    return g;
  }
  function y(E) {
    var S = "", g = e._rendered, b = e.matrix && e.matrix[e._mode];
    if (e._mode == "agenda" || e._mode == "map")
      for (var x = 0; x < g.length; x++)
        S += "<event><head><![CDATA[" + n(g[x].childNodes[0].innerHTML) + "]]></head><body><![CDATA[" + n(g[x].childNodes[2].innerHTML) + "]]></body></event>";
    else if (e._mode == "week_agenda")
      for (x = 0; x < g.length; x++)
        S += "<event day='" + g[x].parentNode.getAttribute("day") + "'><body>" + n(g[x].innerHTML) + "</body></event>";
    else if (e._mode == "year")
      for (g = e.get_visible_events(), x = 0; x < g.length; x++) {
        var k = g[x].start_date;
        for (k.valueOf() < e._min_date.valueOf() && (k = e._min_date); k < g[x].end_date; ) {
          var M = k.getMonth() + 12 * (k.getFullYear() - e._min_date.getFullYear()) - e.week_starts._month, N = e.week_starts[M] + k.getDate() - 1, T = E ? l(e._get_year_cell(k), "color") : "", A = E ? l(e._get_year_cell(k), "backgroundColor") : "";
          if (S += "<event day='" + N % 7 + "' week='" + Math.floor(N / 7) + "' month='" + M + "' backgroundColor='" + A + "' color='" + T + "'></event>", (k = e.date.add(k, 1, "day")).valueOf() >= e._max_date.valueOf())
            break;
        }
      }
    else if (b && b.render == "cell")
      for (g = e._els.dhx_cal_data[0].getElementsByTagName("TD"), x = 0; x < g.length; x++)
        T = E ? l(g[x], "color") : "", S += `
<event><body backgroundColor='` + (A = E ? l(g[x], "backgroundColor") : "") + "' color='" + T + "'><![CDATA[" + n(g[x].innerHTML) + "]]></body></event>";
    else
      for (x = 0; x < g.length; x++) {
        var C, $;
        if (e.matrix && e.matrix[e._mode])
          C = o(g[x].style.left), $ = o(g[x].offsetWidth) - 1;
        else {
          var O = e.config.use_select_menu_space ? 0 : 26;
          C = _(g[x].style.left, O, !0), $ = _(g[x].style.width, O) - 1;
        }
        if (!isNaN(1 * $)) {
          var j = d(g[x].style.top), V = d(g[x].style.height), Y = g[x].className.split(" ")[0].replace("dhx_cal_", "");
          if (Y !== "dhx_tooltip_line") {
            var z = e.getEvent(g[x].getAttribute(e.config.event_attribute));
            if (z) {
              N = z._sday;
              var R = z._sweek, I = z._length || 0;
              if (e._mode == "month")
                V = parseInt(g[x].offsetHeight, 10), j = parseInt(g[x].style.top, 10) - e.xy.month_head_height, N = c(g[x], N), R = f(g[x], R);
              else if (e.matrix && e.matrix[e._mode]) {
                N = 0, R = g[x].parentNode.parentNode.parentNode.rowIndex;
                var fe = t;
                t = g[x].parentNode.offsetHeight, j = d(g[x].style.top), j -= 0.2 * j, t = fe;
              } else {
                if (g[x].parentNode == e._els.dhx_cal_data[0])
                  continue;
                var W = e._els.dhx_cal_data[0].childNodes[0], Ne = parseFloat(W.className.indexOf("dhx_scale_holder") != -1 ? W.style.left : 0);
                C += o(g[x].parentNode.style.left, Ne);
              }
              S += `
<event week='` + R + "' day='" + N + "' type='" + Y + "' x='" + C + "' y='" + j + "' width='" + $ + "' height='" + V + "' len='" + I + "'>", Y == "event" ? (S += "<header><![CDATA[" + n(g[x].childNodes[1].innerHTML) + "]]></header>", T = E ? l(g[x].childNodes[2], "color") : "", S += "<body backgroundColor='" + (A = E ? l(g[x].childNodes[2], "backgroundColor") : "") + "' color='" + T + "'><![CDATA[" + n(g[x].childNodes[2].innerHTML) + "]]></body>") : (T = E ? l(g[x], "color") : "", S += "<body backgroundColor='" + (A = E ? l(g[x], "backgroundColor") : "") + "' color='" + T + "'><![CDATA[" + n(g[x].innerHTML) + "]]></body>"), S += "</event>";
            }
          }
        }
      }
    return S;
  }
  function w(E, S, g, b, x, k) {
    var M = !1;
    b == "fullcolor" && (M = !0, b = "color"), b = b || "color";
    var N, T = "";
    if (E) {
      var A = e._date, C = e._mode;
      S = e.date[g + "_start"](S), S = e.date["get_" + g + "_end"] ? e.date["get_" + g + "_end"](S) : e.date.add(S, 1, g), T = p("pages", b, x, k);
      for (var $ = new Date(E); +$ < +S; $ = this.date.add($, 1, g))
        this.setCurrentView($, g), T += ((N = "page") ? "<" + N + ">" : "") + h().replace("–", "-") + y(M) + v("page");
      T += v("pages"), this.setCurrentView(A, C);
    } else
      T = p("data", b, x, k) + h().replace("–", "-") + y(M) + v("data");
    return T;
  }
  function D(E, S, g, b, x, k, M) {
    (function(N, T) {
      var A = e.uid(), C = document.createElement("div");
      C.style.display = "none", document.body.appendChild(C), C.innerHTML = '<form id="' + A + '" method="post" target="_blank" action="' + T + '" accept-charset="utf-8" enctype="application/x-www-form-urlencoded"><input type="hidden" name="mycoolxmlbody"/> </form>', document.getElementById(A).firstChild.value = encodeURIComponent(N), document.getElementById(A).submit(), C.parentNode.removeChild(C);
    })(typeof x == "object" ? function(N) {
      for (var T = "<data>", A = 0; A < N.length; A++)
        T += N[A].source.getPDFData(N[A].start, N[A].end, N[A].view, N[A].mode, N[A].header, N[A].footer);
      return T += "</data>", T;
    }(x) : w.apply(this, [E, S, g, x, k, M]), b);
  }
  e.getPDFData = w, e.toPDF = function(E, S, g, b) {
    return D.apply(this, [null, null, null, E, S, g, b]);
  }, e.toPDFRange = function(E, S, g, b, x, k, M) {
    return typeof E == "string" && (E = e.templates.api_date(E), S = e.templates.api_date(S)), D.apply(this, arguments);
  };
}, quick_info: function(e) {
  e.config.icons_select = ["icon_form", "icon_delete"], e.config.details_on_create = !0, e.config.show_quick_info = !0, e.xy.menu_width = 0;
  let i = null;
  function t(s) {
    const n = s.getBoundingClientRect(), o = e.$container.getBoundingClientRect().bottom - n.bottom;
    o < 0 && (s.style.top = `${parseFloat(s.style.top) + o}px`);
  }
  function r(s) {
    let n = 0, o = 0, _ = s;
    for (; _ && _ != e._obj; )
      n += _.offsetLeft, o += _.offsetTop - _.scrollTop, _ = _.offsetParent;
    return _ ? { left: n, top: o, dx: n + s.offsetWidth / 2 > e._x / 2 ? 1 : 0, dy: o + s.offsetHeight / 2 > e._y / 2 ? 1 : 0, width: s.offsetWidth, height: s.offsetHeight } : 0;
  }
  e.attachEvent("onSchedulerReady", function() {
    const s = e.$container;
    s._$quickInfoHandler || (s._$quickInfoHandler = !0, e.event(s, "mousedown", function(n) {
      const o = n.target.closest(`[${e.config.event_attribute}]`);
      o && (i = { id: o.getAttribute(e.config.event_attribute), position: r(o) });
    }), e.attachEvent("onDestroy", () => {
      delete s._$quickInfoHandler;
    }));
  }), e.attachEvent("onClick", function(s) {
    if (e.config.show_quick_info)
      return e.showQuickInfo(s), !0;
  }), function() {
    for (var s = ["onEmptyClick", "onViewChange", "onLightbox", "onBeforeEventDelete", "onBeforeDrag"], n = function() {
      return e.hideQuickInfo(!0), !0;
    }, o = 0; o < s.length; o++)
      e.attachEvent(s[o], n);
  }(), e.templates.quick_info_title = function(s, n, o) {
    return o.text.substr(0, 50);
  }, e.templates.quick_info_content = function(s, n, o) {
    return o.details || "";
  }, e.templates.quick_info_date = function(s, n, o) {
    return e.isOneDayEvent(o) && e.config.rtl ? e.templates.day_date(s, n, o) + " " + e.templates.event_header(n, s, o) : e.isOneDayEvent(o) ? e.templates.day_date(s, n, o) + " " + e.templates.event_header(s, n, o) : e.config.rtl ? e.templates.week_date(n, s, o) : e.templates.week_date(s, n, o);
  }, e.showQuickInfo = function(s) {
    if (s == this._quick_info_box_id || (this.hideQuickInfo(!0), this.callEvent("onBeforeQuickInfo", [s]) === !1))
      return;
    let n;
    n = i && i.id == s ? i.position : this._get_event_counter_part(s), n && (this._quick_info_box = this._init_quick_info(n), this._fill_quick_data(s), this._show_quick_info(n), this.callEvent("onQuickInfo", [s]));
  }, function() {
    function s(n) {
      n = n || "";
      var o, _ = parseFloat(n), a = n.match(/m?s/);
      switch (a && (a = a[0]), a) {
        case "s":
          o = 1e3 * _;
          break;
        case "ms":
          o = _;
          break;
        default:
          o = 0;
      }
      return o;
    }
    e.hideQuickInfo = function(n) {
      var o = this._quick_info_box, _ = this._quick_info_box_id;
      if (this._quick_info_box_id = 0, o && o.parentNode) {
        var a = o.offsetWidth;
        if (e.config.quick_info_detached)
          return this.callEvent("onAfterQuickInfo", [_]), o.parentNode.removeChild(o);
        if (o.style.right == "auto" ? o.style.left = -a + "px" : o.style.right = -a + "px", n)
          o.parentNode.removeChild(o);
        else {
          var d;
          window.getComputedStyle ? d = window.getComputedStyle(o, null) : o.currentStyle && (d = o.currentStyle);
          var l = s(d["transition-delay"]) + s(d["transition-duration"]);
          setTimeout(function() {
            o.parentNode && o.parentNode.removeChild(o);
          }, l);
        }
        this.callEvent("onAfterQuickInfo", [_]);
      }
    };
  }(), e.event(window, "keydown", function(s) {
    s.keyCode == 27 && e.hideQuickInfo();
  }), e._show_quick_info = function(s) {
    var n = e._quick_info_box;
    e._obj.appendChild(n);
    var o = n.offsetWidth, _ = n.offsetHeight;
    if (e.config.quick_info_detached) {
      var a = s.left - s.dx * (o - s.width);
      e.getView() && e.getView()._x_scroll && (e.config.rtl ? a += e.getView()._x_scroll : a -= e.getView()._x_scroll), a + o > window.innerWidth && (a = window.innerWidth - o), a = Math.max(0, a), n.style.left = a + "px", n.style.top = s.top - (s.dy ? _ : -s.height) + "px";
    } else {
      const d = e.$container.querySelector(".dhx_cal_data").offsetTop;
      n.style.top = d + 20 + "px", s.dx == 1 ? (n.style.right = "auto", n.style.left = -o + "px", setTimeout(function() {
        n.style.left = "-10px";
      }, 1)) : (n.style.left = "auto", n.style.right = -o + "px", setTimeout(function() {
        n.style.right = "-10px";
      }, 1)), n.className = n.className.replace(" dhx_qi_left", "").replace(" dhx_qi_right", "") + " dhx_qi_" + (s.dx == 1 ? "left" : "right");
    }
    n.ontransitionend = () => {
      t(n), n.ontransitionend = null;
    }, setTimeout(() => {
      t(n);
    }, 1);
  }, e.attachEvent("onTemplatesReady", function() {
    if (e.hideQuickInfo(), this._quick_info_box) {
      var s = this._quick_info_box;
      s.parentNode && s.parentNode.removeChild(s), this._quick_info_box = null;
    }
  }), e._quick_info_onscroll_handler = function(s) {
    e.hideQuickInfo();
  }, e._init_quick_info = function() {
    if (!this._quick_info_box) {
      var s = this._quick_info_box = document.createElement("div");
      this._waiAria.quickInfoAttr(s), s.className = "dhx_cal_quick_info", e.$testmode && (s.className += " dhx_no_animate"), e.config.rtl && (s.className += " dhx_quick_info_rtl");
      var n = `
		<div class="dhx_cal_qi_tcontrols">
			<a class="dhx_cal_qi_close_btn scheduler_icon close"></a>
		</div>
		<div class="dhx_cal_qi_title" ${this._waiAria.quickInfoHeaderAttrString()}>
				
				<div class="dhx_cal_qi_tcontent"></div>
				<div class="dhx_cal_qi_tdate"></div>
			</div>
			<div class="dhx_cal_qi_content"></div>`;
      n += '<div class="dhx_cal_qi_controls">';
      for (var o = e.config.icons_select, _ = 0; _ < o.length; _++)
        n += `<div ${this._waiAria.quickInfoButtonAttrString(this.locale.labels[o[_]])} class="dhx_qi_big_icon ${o[_]}" title="${e.locale.labels[o[_]]}">
				<div class='dhx_menu_icon ${o[_]}'></div><div>${e.locale.labels[o[_]]}</div></div>`;
      n += "</div>", s.innerHTML = n, e.event(s, "click", function(a) {
        e._qi_button_click(a.target || a.srcElement);
      }), e.config.quick_info_detached && (e._detachDomEvent(e._els.dhx_cal_data[0], "scroll", e._quick_info_onscroll_handler), e.event(e._els.dhx_cal_data[0], "scroll", e._quick_info_onscroll_handler));
    }
    return this._quick_info_box;
  }, e._qi_button_click = function(s) {
    var n = e._quick_info_box;
    if (s && s != n)
      if (s.closest(".dhx_cal_qi_close_btn"))
        e.hideQuickInfo();
      else {
        var o = e._getClassName(s);
        if (o.indexOf("_icon") != -1) {
          var _ = e._quick_info_box_id;
          e._click.buttons[o.split(" ")[1].replace("icon_", "")](_);
        } else
          e._qi_button_click(s.parentNode);
      }
  }, e._get_event_counter_part = function(s) {
    return r(e.getRenderedEvent(s));
  }, e._fill_quick_data = function(s) {
    var n = e.getEvent(s), o = e._quick_info_box;
    e._quick_info_box_id = s;
    var _ = { content: e.templates.quick_info_title(n.start_date, n.end_date, n), date: e.templates.quick_info_date(n.start_date, n.end_date, n) };
    o.querySelector(".dhx_cal_qi_tcontent").innerHTML = `<span>${_.content}</span>`, o.querySelector(".dhx_cal_qi_tdate").innerHTML = _.date, e._waiAria.quickInfoHeader(o, [_.content, _.date].join(" "));
    var a = o.querySelector(".dhx_cal_qi_content");
    const d = e.templates.quick_info_content(n.start_date, n.end_date, n);
    d ? (a.classList.remove("dhx_hidden"), a.innerHTML = d) : a.classList.add("dhx_hidden");
  };
}, readonly: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    var i;
    e.form_blocks.recurring && (i = e.form_blocks.recurring.set_value);
    var t = e.config.buttons_left.slice(), r = e.config.buttons_right.slice();
    function s(_, a, d, l) {
      for (var c = a.getElementsByTagName(_), f = d.getElementsByTagName(_), v = f.length - 1; v >= 0; v--)
        if (d = f[v], l) {
          var p = document.createElement("span");
          p.className = "dhx_text_disabled", p.innerHTML = l(c[v]), d.parentNode.insertBefore(p, d), d.parentNode.removeChild(d);
        } else
          d.disabled = !0, a.checked && (d.checked = !0);
    }
    e.attachEvent("onBeforeLightbox", function(_) {
      if (this.config.readonly_form || this.getEvent(_).readonly ? this.config.readonly_active = !0 : (this.config.readonly_active = !1, e.config.buttons_left = t.slice(), e.config.buttons_right = r.slice(), e.form_blocks.recurring && (e.form_blocks.recurring.set_value = i)), this.config.readonly_active)
        for (var a = ["dhx_delete_btn", "dhx_save_btn"], d = [e.config.buttons_left, e.config.buttons_right], l = 0; l < a.length; l++)
          for (var c = a[l], f = 0; f < d.length; f++) {
            for (var v = d[f], p = -1, h = 0; h < v.length; h++)
              if (v[h] == c) {
                p = h;
                break;
              }
            p != -1 && v.splice(p, 1);
          }
      return this.resetLightbox(), !0;
    });
    var n = e._fill_lightbox;
    e._fill_lightbox = function() {
      var _ = this.getLightbox();
      this.config.readonly_active && (_.style.visibility = "hidden", _.style.display = "block");
      var a = n.apply(this, arguments);
      if (this.config.readonly_active && (_.style.visibility = "", _.style.display = "none"), this.config.readonly_active) {
        var d = this.getLightbox(), l = this._lightbox_r = d.cloneNode(!0);
        l.id = e.uid(), l.className += " dhx_cal_light_readonly", s("textarea", d, l, function(c) {
          return c.value;
        }), s("input", d, l, !1), s("select", d, l, function(c) {
          return c.options.length ? c.options[Math.max(c.selectedIndex || 0, 0)].text : "";
        }), d.parentNode.insertBefore(l, d), this.showCover(l), e._lightbox && e._lightbox.parentNode.removeChild(e._lightbox), this._lightbox = l, e.config.drag_lightbox && e.event(l.firstChild, "mousedown", e._ready_to_dnd), e._init_lightbox_events(), this.setLightboxSize();
      }
      return a;
    };
    var o = e.hide_lightbox;
    e.hide_lightbox = function() {
      return this._lightbox_r && (this._lightbox_r.parentNode.removeChild(this._lightbox_r), this._lightbox_r = this._lightbox = null), o.apply(this, arguments);
    };
  });
}, recurring: function(e) {
  function i(g) {
    return new Date(g.getFullYear(), g.getMonth(), g.getDate(), g.getHours(), g.getMinutes(), g.getSeconds(), 0);
  }
  function t(g) {
    return !!g.rrule && !g.recurring_event_id;
  }
  function r(g) {
    return new Date(Date.UTC(g.getFullYear(), g.getMonth(), g.getDate(), g.getHours(), g.getMinutes(), g.getSeconds()));
  }
  function s(g) {
    g.rrule.includes(";UNTIL=") && (g.rrule = g.rrule.split(";UNTIL=")[0]);
    let b = we(`RRULE:${g.rrule};UNTIL=${h(g._end_date || g.end_date)}`, { dtstart: g.start_date }), x = new H(b.origOptions).toString().replace("RRULE:", "");
    x = x.split(`
`)[1], g.rrule = x;
  }
  function n(g, b) {
    b || (b = e.getEvent(g));
    let x = b.rrule.split(";"), k = [];
    for (let M = 0; M < x.length; M++) {
      let N = x[M].split("="), T = N[0], A = N[1];
      T !== "BYDAY" && (k.push(T), k.push("="), k.push(A), k.push(";"));
    }
    k.pop(), b.rrule = k.join("");
  }
  var o;
  function _(g, b) {
    g._end_date = g.end_date, e._isExceptionFirstOccurrence(b) ? (g.start_date = b.start_date, g.end_date = new Date(b.start_date.valueOf() + 1e3 * g.duration), g._start_date = b.original_start, g._modified = !0) : (g.end_date = new Date(b.start_date.valueOf() + 1e3 * g.duration), g.start_date = b.start_date, g._firstOccurrence = !0), g._thisAndFollowing = b.id;
  }
  function a(g, b, x, k) {
    const M = x._modified ? k.id : g;
    e._events[M] = { ...k, text: b.text, duration: b.duration, start_date: b.start_date, rrule: b.rrule, end_date: k._end_date, _start_date: k.start_date, _thisAndFollowing: null, _end_date: null }, x._modified && delete e._events[g], e.callEvent("onEventChanged", [e._events[M].id, e._events[M]]);
  }
  function d(g) {
    for (const b in e._events)
      e._events[b].id == g.id && delete e._events[b];
  }
  function l(g, b) {
    for (let x in e._events) {
      let k = e._events[x];
      (k.recurring_event_id == g || e._is_virtual_event(k.id) && k.id.split("#")[0] == g) && (k.text = b.text, e.updateEvent(k.id));
    }
  }
  function c(g, b) {
    let x = g, k = new Date(b.original_start).valueOf();
    g = String(x).split("#") || b._pid_time || k;
    let M = e.uid(), N = g[1] ? g[1] : b._pid_time || k, T = e._copy_event(b);
    T.id = M, T.recurring_event_id = b.recurring_event_id || g[0], T.original_start = new Date(Number(N)), T.deleted = !0, e.addEvent(T);
  }
  function f() {
    for (const g in e._events)
      g === "$dnd_recurring_placeholder" && delete e._events[g];
    e.render();
  }
  function v(g, b) {
    const x = e.locale;
    g.find((M) => M.checked) || (g[0].checked = !0);
    const k = g.reduce((M, N) => (M[N.value] = N.callback, M), {});
    e.modalbox({ text: `<div class="dhx_edit_recurrence_options">
				${g.map((M) => `<label class="dhx_styled_radio">
					<input type="radio" value="${M.value}" name="option" ${M.checked ? "checked" : ""}>
					${M.label}
				</label>`).join("")}
			</div>`, type: "recurring_mode", title: x.labels.confirm_recurring, width: "auto", position: "middle", buttons: [{ label: x.labels.message_ok, value: "ok", css: "rec_ok" }, { label: x.labels.message_cancel, value: "cancel" }], callback: function(M, N) {
      if (b && b(M, N), M === "cancel")
        return;
      const T = N.target.closest(".scheduler_modal_box").querySelector("input[type='radio']:checked");
      let A;
      T && (A = T.value), A && k[A]();
    } });
  }
  function p() {
    const g = {};
    for (const b in e._events) {
      const x = e._events[b];
      x.recurring_event_id && x.original_start && (g[x.recurring_event_id] || (g[x.recurring_event_id] = {}), g[x.recurring_event_id][x.original_start.valueOf()] = x);
    }
    return g;
  }
  e._isFollowing = function(g) {
    let b = e.getEvent(g);
    return !(!b || !b._thisAndFollowing);
  }, e._isFirstOccurrence = function(g) {
    if (e._is_virtual_event(g.id)) {
      let b = g.id.split("#")[0];
      return e.getEvent(b).start_date.valueOf() === g.start_date.valueOf();
    }
  }, e._isExceptionFirstOccurrence = function(g) {
    if (e._is_modified_occurrence(g)) {
      let b = g.recurring_event_id, x = e.getEvent(b);
      return !(!g.original_start.valueOf() || g.original_start.valueOf() !== x.start_date.valueOf());
    }
  }, e._rec_temp = [], e._rec_markers_pull = {}, e._rec_markers = {}, e._add_rec_marker = function(g, b) {
    g._pid_time = b, this._rec_markers[g.id] = g, this._rec_markers_pull[g.event_pid] || (this._rec_markers_pull[g.event_pid] = {}), this._rec_markers_pull[g.event_pid][b] = g;
  }, e._get_rec_marker = function(g, b) {
    let x = this._rec_markers_pull[b];
    return x ? x[g] : null;
  }, e._get_rec_markers = function(g) {
    return this._rec_markers_pull[g] || [];
  }, o = e.addEvent, e.addEvent = function(g, b, x, k, M) {
    var N = o.apply(this, arguments);
    if (N && e.getEvent(N)) {
      var T = e.getEvent(N);
      T.start_date && (T.start_date = i(T.start_date)), T.end_date && (T.end_date = i(T.end_date));
    }
    return N;
  }, e.attachEvent("onEventLoading", function(g) {
    return g.original_start && !g.original_start.getFullYear && (g.original_start = e.templates.parse_date(g.original_start)), !0;
  }), e.attachEvent("onEventIdChange", function(g, b) {
    if (!this._ignore_call) {
      this._ignore_call = !0, e._rec_markers[g] && (e._rec_markers[b] = e._rec_markers[g], delete e._rec_markers[g]), e._rec_markers_pull[g] && (e._rec_markers_pull[b] = e._rec_markers_pull[g], delete e._rec_markers_pull[g]);
      for (var x = 0; x < this._rec_temp.length; x++) {
        var k = this._rec_temp[x];
        this._is_virtual_event(k.id) && k.id.split("#")[0] == g && (k.recurring_event_id = b, this.changeEventId(k.id, b + "#" + k.id.split("#")[1]));
      }
      for (var x in this._rec_markers)
        (k = this._rec_markers[x]).recurring_event_id == g && (k.recurring_event_id = b, k._pid_changed = !0);
      var M = e._rec_markers[b];
      M && M._pid_changed && (delete M._pid_changed, setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.callEvent("onEventChanged", [b, e.getEvent(b)]);
      }, 1)), delete this._ignore_call;
    }
  }), e.attachEvent("onConfirmedBeforeEventDelete", function(g) {
    var b = this.getEvent(g);
    if (this._is_virtual_event(g) || this._is_modified_occurrence(b) && !function(M) {
      return !!M.deleted;
    }(b))
      c(g, b);
    else {
      t(b) && this._lightbox_id && this._roll_back_dates(b);
      var x = this._get_rec_markers(g);
      for (var k in x)
        x.hasOwnProperty(k) && (g = x[k].id, this.getEvent(g) && this.deleteEvent(g, !0));
    }
    return !0;
  }), e.attachEvent("onEventDeleted", function(g, b) {
    !this._is_virtual_event(g) && this._is_modified_occurrence(b) && (e._events[g] || (b.deleted = !0, this.setEvent(g, b), e.render()));
  }), e.attachEvent("onBeforeEventChanged", function(g, b, x, k) {
    return !(!x && g && (e._is_virtual_event(g.id) || e._is_modified_occurrence(g)) && (k.start_date.getDate() !== g.start_date.getDate() ? g._beforeEventChangedFlag = "edit" : g._beforeEventChangedFlag = "ask", !e.config.collision_limit || e.checkCollision(g))) || (e._events.$dnd_recurring_placeholder = e._lame_clone(g), e._showRequiredModalBox(g.id, g._beforeEventChangedFlag), !1);
  }), e.attachEvent("onEventChanged", function(g, b) {
    if (this._loading)
      return !0;
    let x = this.getEvent(g);
    if (this._is_virtual_event(g))
      (function(A) {
        let C = A.id.split("#"), $ = e.uid();
        e._not_render = !0;
        let O = e._copy_event(A);
        O.id = $, O.recurring_event_id = C[0];
        let j = C[1];
        O.original_start = new Date(Number(j)), e._add_rec_marker(O, j), e.addEvent(O), e._not_render = !1;
      })(x);
    else {
      x.start_date && (x.start_date = i(x.start_date)), x.end_date && (x.end_date = i(x.end_date)), t(x) && this._lightbox_id && (x._removeFollowing || this._isFollowing(g) ? x._removeFollowing = null : this._roll_back_dates(x));
      var k = this._get_rec_markers(g);
      for (var M in k)
        k.hasOwnProperty(M) && (delete this._rec_markers[k[M].id], this.deleteEvent(k[M].id, !0));
      delete this._rec_markers_pull[g];
      for (var N = !1, T = 0; T < this._rendered.length; T++)
        this._rendered[T].getAttribute(this.config.event_attribute) == g && (N = !0);
      N || (this._select_id = null);
    }
    return f(), !0;
  }), e.attachEvent("onEventAdded", function(g) {
    if (!this._loading) {
      var b = this.getEvent(g);
      t(b) && this._roll_back_dates(b);
    }
    return !0;
  }), e.attachEvent("onEventSave", function(g, b, x) {
    let k = this.getEvent(g), M = e._lame_clone(k), N = b.rrule;
    if (k && t(k) && !x && this._isFollowing(g)) {
      if (k._removeFollowing) {
        if (e.getEvent(k._thisAndFollowing) && (k._firstOccurrence || k._modified))
          return e.hideLightbox(), e.deleteEvent(k.id), !1;
        if (k.end_date = new Date(k.start_date.valueOf() - 1e3), k._end_date = k._shorten_end_date, k.start_date = k._start_date, k._shorten = !0, s(k), e.callEvent("onEventChanged", [k.id, k]), e.getEvent(k._thisAndFollowing))
          for (const T in e._events) {
            let A = e._events[T];
            A.recurring_event_id === g && A.start_date.valueOf() > M.start_date.valueOf() && c(A.id, A);
          }
        return e.hideLightbox(), !1;
      }
      {
        let T = e.getEvent(k._thisAndFollowing);
        if (T && k._firstOccurrence)
          for (const A in e._events)
            e._events[A].id == k.id && a(A, b, k, M);
        else if (T && k._modified)
          for (const A in e._events) {
            let C = e._events[A];
            C.recurring_event_id == g && C.id == M._thisAndFollowing && a(A, b, k, M);
          }
        else {
          e._is_modified_occurrence(T) && d(T), k.end_date = k._shorten_end_date, k._end_date = k._shorten_end_date, k.start_date = k._start_date, k._shorten = !0, s(k), e.callEvent("onEventChanged", [k.id, k]);
          let A = { ...M };
          A.text = b.text, A.duration = b.duration, A.rrule = N, A._start_date = null, A.id = e.uid(), e.addEvent(A.start_date, A.end_date, A.text, A.id, A);
        }
        return x || l(g, b), e.hideLightbox(), !1;
      }
    }
    return x || l(g, b), M._ocr && M._beforeEventChangedFlag ? (k.start_date = M.start_date, k.end_date = M.end_date, k._start_date = M._start_date, k._end_date = M._end_date, e.updateEvent(k.id), !0) : (this._select_id = null, f(), !0);
  }), e.attachEvent("onEventCreated", function(g) {
    var b = this.getEvent(g);
    return t(b) || function(x) {
      x.rrule = "", x.original_start = null, x.recurring_event_id = null, x.duration = null, x.deleted = null;
    }(b), !0;
  }), e.attachEvent("onEventCancel", function(g) {
    var b = this.getEvent(g);
    t(b) && (this._roll_back_dates(b), this.render_view_data()), f();
  }), e._roll_back_dates = function(g) {
    g.start_date && (g.start_date = i(g.start_date)), g.end_date && (g.end_date = i(g.end_date)), g._end_date && (g._shorten || (g.duration = Math.round((g.end_date.valueOf() - g.start_date.valueOf()) / 1e3)), g.end_date = g._end_date), g._start_date && (g.start_date.setMonth(0), g.start_date.setDate(g._start_date.getDate()), g.start_date.setMonth(g._start_date.getMonth()), g.start_date.setFullYear(g._start_date.getFullYear()), this._isFollowing(g.id) && (g.start_date.setHours(g._start_date.getHours()), g.start_date.setMinutes(g._start_date.getMinutes()), g.start_date.setSeconds(g._start_date.getSeconds()))), g._thisAndFollowing = null, g._shorten_end_date && (g._shorten_end_date = null), g._removeFollowing && (g._removeFollowing = null), g._firstOccurrence && (g._firstOccurrence = null), g._modified && (g._modified = null);
  }, e._is_virtual_event = function(g) {
    return g.toString().indexOf("#") != -1;
  }, e._is_modified_occurrence = function(g) {
    return g.recurring_event_id && g.recurring_event_id != "0";
  }, e.showLightbox_rec = e.showLightbox, e.showLightbox = function(g) {
    const b = this.locale;
    let x = e.config.lightbox_recurring, k = this.getEvent(g), M = k.recurring_event_id, N = this._is_virtual_event(g);
    N && (M = g.split("#")[0]);
    const T = function(A, C) {
      const $ = e.getEvent(A), O = e.getEvent(M), j = e.getView();
      if (j && $[j.y_property] && (O[j.y_property] = $[j.y_property]), j && $[j.property] && (O[j.property] = $[j.property]), C === "Occurrence")
        return e.showLightbox_rec(A);
      if (C === "Following") {
        if (e._isExceptionFirstOccurrence($) || e._isFirstOccurrence($))
          return _(O, $), e.showLightbox_rec(M);
        {
          O._end_date = O.end_date;
          const V = $.original_start || $.start_date;
          return O._shorten_end_date = new Date(V.valueOf() - 1e3), O.end_date = new Date($.start_date.valueOf() + 1e3 * O.duration), O._start_date = O.start_date, O.start_date = $.start_date, O._thisAndFollowing = $.id, k._beforeEventChangedFlag && (O._beforeEventChangedFlag = k._beforeEventChangedFlag, O._shorten_end_date = new Date(V.valueOf() - 1e3)), e.showLightbox_rec(M);
        }
      }
      if (C === "AllEvents") {
        if (e._isExceptionFirstOccurrence($))
          return _(O, $), e.showLightbox_rec(M);
        const V = new Date(O.start_date);
        return O._end_date = O.end_date, O._start_date = V, O.start_date.setHours($.start_date.getHours()), O.start_date.setMinutes($.start_date.getMinutes()), O.start_date.setSeconds($.start_date.getSeconds()), O.end_date = new Date(O.start_date.valueOf() + 1e3 * O.duration), O._thisAndFollowing = null, e.showLightbox_rec(M);
      }
    };
    if ((M || 1 * M == 0) && t(k))
      return T(g, "AllEvents");
    if (!M || M === "0" || !b.labels.confirm_recurring || x == "instance" || x == "series" && !N)
      return this.showLightbox_rec(g);
    if (x === "ask") {
      const A = e.locale;
      v([{ value: "Occurrence", label: A.labels.button_edit_occurrence, checked: !0, callback: () => T(g, "Occurrence") }, { value: "Following", label: A.labels.button_edit_occurrence_and_following, callback: () => T(g, "Following") }, { value: "AllEvents", label: A.labels.button_edit_series, callback: () => T(g, "AllEvents") }]);
    }
  }, e._showRequiredModalBox = function(g, b) {
    let x;
    const k = e.locale;
    let M = e.getEvent(g), N = M.recurring_event_id;
    e._is_virtual_event(M.id) && (N = M.id.split("#")[0]);
    let T = e.getEvent(N);
    const A = e.getView();
    let C, $, O = e._lame_clone(T);
    A && M[A.y_property] && (O[A.y_property] = M[A.y_property]), A && M[A.property] && (O[A.property] = M[A.property]), M && M._beforeEventChangedFlag && (C = M.start_date, $ = M.end_date);
    const j = { value: "AllEvents", label: k.labels.button_edit_series, callback: () => function(z) {
      let R = e._lame_clone(z);
      if (e._isExceptionFirstOccurrence(R) && d(R), $ && C && (O.start_date.setHours(C.getHours()), O.start_date.setMinutes(C.getMinutes()), O.start_date.setSeconds(C.getSeconds()), O.duration = (+$ - +C) / 1e3), O._beforeEventChangedFlag = z._beforeEventChangedFlag, O._thisAndFollowing = null, !e.config.collision_limit || e.checkCollision(O))
        for (const I in e._events)
          e._events[I].id == O.id && (e._events[I] = { ...O }, e.callEvent("onEventChanged", [e._events[I].id, e._events[I]]));
    }(M) }, V = { value: "Following", label: k.labels.button_edit_occurrence_and_following, callback: () => function(z) {
      let R = e._lame_clone(z);
      if ($ && C && (z._start_date = z.start_date, z.start_date = C, z.end_date = $), e._isFirstOccurrence(R) || e._isExceptionFirstOccurrence(R)) {
        if (e._isExceptionFirstOccurrence(R) && d(R), O._start_date = T.start_date, O.start_date = z.start_date, O.duration = (+z.end_date - +z.start_date) / 1e3, O._beforeEventChangedFlag = z._beforeEventChangedFlag, O.rrule && n(O.id, O), !e.config.collision_limit || e.checkCollision(O))
          for (const I in e._events)
            e._events[I].id == O.id && (e._events[I] = { ...O }, e.callEvent("onEventChanged", [e._events[I].id, e._events[I]]));
      } else {
        O._end_date = T.end_date;
        const I = z.original_start || e.date.date_part(new Date(z._start_date));
        O._shorten_end_date = new Date(I.valueOf() - 1e3), O.end_date = z.end_date, O._start_date = T.start_date, O.start_date = z.start_date, O._thisAndFollowing = z.id, O.rrule && n(O.id, O);
        let fe = O.end_date;
        if (O.end_date = O._end_date, !e.config.collision_limit || e.checkCollision(O)) {
          O.end_date = fe;
          for (const W in e._events)
            e._events[W].id == O.id && (e._events[W] = { ...O }, e.callEvent("onEventSave", [e._events[W].id, e._events[W], e._new_event]), e.callEvent("onEventChanged", [e._events[W].id, e._events[W]]));
        }
      }
    }(M) }, Y = { value: "Occurrence", label: k.labels.button_edit_occurrence, callback: () => function(z) {
      let R = { ...T, ...e.getEvent("$dnd_recurring_placeholder") };
      if ($ && C && (R.start_date = C, R.end_date = $, R._beforeEventChangedFlag = z._beforeEventChangedFlag, R._ocr = !0), !e.config.collision_limit || e.checkCollision(R))
        for (const I in e._events) {
          let fe = e._events[I];
          I !== "$dnd_recurring_placeholder" && fe.id == R.id && (e._events[I] = { ...R }, e.callEvent("onEventChanged", [e._events[I].id, e._events[I]]));
        }
    }(M), checked: !0 };
    x = b === "ask" ? [Y, V, j] : [Y, V], v(x, (z) => {
      z === "cancel" && f();
    });
  }, e.get_visible_events_rec = e.get_visible_events, e.get_visible_events = function(g) {
    for (var b = 0; b < this._rec_temp.length; b++)
      delete this._events[this._rec_temp[b].id];
    this._rec_temp = [];
    const x = p();
    var k = this.get_visible_events_rec(g), M = [];
    for (b = 0; b < k.length; b++)
      k[b].deleted || k[b].recurring_event_id || (t(k[b]) ? this.repeat_date(k[b], M, void 0, void 0, void 0, void 0, x) : M.push(k[b]));
    return function(N) {
      const T = {};
      return N.forEach((A) => {
        const C = T[A.id];
        (!C || C._beforeEventChangedFlag || A._beforeEventChangedFlag) && (T[A.id] = A);
      }), Object.values(T);
    }(M);
  }, function() {
    var g = e.isOneDayEvent;
    e.isOneDayEvent = function(x) {
      return !!t(x) || g.call(this, x);
    };
    var b = e.updateEvent;
    e.updateEvent = function(x) {
      var k = e.getEvent(x);
      k && t(k) && !this._is_virtual_event(x) ? e.update_view() : b.call(this, x);
    };
  }();
  const h = e.date.date_to_str("%Y%m%dT%H%i%s");
  function u(g) {
    const b = g.getDay(), x = g.getDate();
    return { dayOfWeek: b, dayNumber: Math.ceil(x / 7) };
  }
  e.repeat_date = function(g, b, x, k, M, N, T) {
    if (!g.rrule)
      return;
    let A = T ? T[g.id] : p()[g.id];
    A || (A = {}), k = r(k || new Date(e._min_date.valueOf() - 1e3)), M = r(M || new Date(e._max_date.valueOf() - 1e3));
    const C = r(g.start_date);
    let $;
    $ = we(N ? `RRULE:${g.rrule};UNTIL=${h(g.end_date)};COUNT=${N}` : `RRULE:${g.rrule};UNTIL=${h(g.end_date)}`, { dtstart: C });
    const O = $.between(k, M, !0).map((Y) => {
      const z = (R = Y, new Date(R.getUTCFullYear(), R.getUTCMonth(), R.getUTCDate(), R.getUTCHours(), R.getUTCMinutes(), R.getUTCSeconds()));
      var R;
      return z.setHours(g.start_date.getHours()), z.setMinutes(g.start_date.getMinutes()), z.setSeconds(g.start_date.getSeconds()), z;
    });
    let j = 0;
    const V = g.duration;
    for (let Y = 0; Y < O.length && !(N && j >= N); Y++) {
      const z = O[Y];
      let R = A[z.valueOf()];
      if (R) {
        if (R.deleted)
          continue;
        j++, b.push(R);
      } else {
        const I = e._copy_event(g);
        if (I.text = g.text, I.start_date = z, I.id = g.id + "#" + Math.ceil(z.valueOf()), I.end_date = new Date(z.valueOf() + 1e3 * V), I.end_date = e._fix_daylight_saving_date(I.start_date, I.end_date, g, z, I.end_date), I._timed = e.isOneDayEvent(I), !I._timed && !e._table_view && !e.config.multi_day)
          continue;
        b.push(I), x || (e._events[I.id] = I, e._rec_temp.push(I)), j++;
      }
    }
    if (A && O.length == 0)
      for (let Y in A) {
        let z = A[Y];
        if (z) {
          if (z.deleted)
            continue;
          k && M && z.start_date < M && z.end_date > k && b.push(z);
        }
      }
  }, e._fix_daylight_saving_date = function(g, b, x, k, M) {
    var N = g.getTimezoneOffset() - b.getTimezoneOffset();
    return N ? N > 0 ? new Date(k.valueOf() + 1e3 * x.duration - 60 * N * 1e3) : new Date(b.valueOf() - 60 * N * 1e3) : new Date(M.valueOf());
  }, e.getRecDates = function(g, b) {
    var x = typeof g == "object" ? g : e.getEvent(g), k = [];
    if (b = b || 100, !t(x))
      return [{ start_date: x.start_date, end_date: x.end_date }];
    if (x.deleted)
      return [];
    e.repeat_date(x, k, !0, x.start_date, x.end_date, b);
    for (var M = [], N = 0; N < k.length; N++)
      k[N].deleted || M.push({ start_date: k[N].start_date, end_date: k[N].end_date });
    return M;
  }, e.getEvents = function(g, b) {
    var x = [];
    const k = p();
    for (var M in this._events) {
      var N = this._events[M];
      if (!N.recurring_event_id)
        if (g && b && N.start_date < b && N.end_date > g)
          if (t(N)) {
            var T = [];
            this.repeat_date(N, T, !0, g, b, void 0, k), T.forEach(function(A) {
              A.start_date < b && A.end_date > g && x.push(A);
            });
          } else
            this._is_virtual_event(N.id) || x.push(N);
        else
          g || b || this._is_virtual_event(N.id) || x.push(N);
    }
    return x;
  }, e._copy_dummy = function(g) {
    var b = new Date(this.start_date), x = new Date(this.end_date);
    this.start_date = b, this.end_date = x, this.duration = this.rrule = null;
  }, e.config.include_end_by = !1, e.config.lightbox_recurring = "ask", e.config.recurring_workdays = [H.MO.weekday, H.TU.weekday, H.WE.weekday, H.TH.weekday, H.FR.weekday], e.config.repeat_date = "%m.%d.%Y", e.config.lightbox.sections = [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "recurring", type: "recurring", map_to: "rrule" }, { name: "time", height: 72, type: "time", map_to: "auto" }], e.attachEvent("onClearAll", function() {
    e._rec_markers = {}, e._rec_markers_pull = {}, e._rec_temp = [];
  });
  const m = { 0: "SU", 1: "MO", 2: "TU", 3: "WE", 4: "TH", 5: "FR", 6: "SA" }, y = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 0 };
  function w(g) {
    switch (g) {
      case 1:
      case 31:
        return `${g}st`;
      case 2:
        return `${g}nd`;
      case 3:
        return `${g}rd`;
      default:
        return `${g}th`;
    }
  }
  e.templates.repeat_monthly_date = function(g, b) {
    return `Every ${w(g.getDate())}`;
  }, e.templates.repeat_monthly_weekday = function(g, b) {
    const x = u(g);
    return `Every ${w(x.dayNumber)} ${e.locale.date.day_full[x.dayOfWeek]}`;
  }, e.templates.repeat_yearly_month_date = function(g, b) {
    const x = g.getDate(), k = e.locale.date.month_full[g.getMonth()];
    return `Every ${w(x)} day of ${k}`;
  }, e.templates.repeat_yearly_month_weekday = function(g, b) {
    const x = u(g), k = e.locale.date.month_full[g.getMonth()];
    return `Every ${w(x.dayNumber)} ${e.locale.date.day_full[x.dayOfWeek]} of ${k}`;
  };
  const D = { MONTHLY: function(g) {
    return { rrule: { freq: H.MONTHLY, interval: 1, bymonthday: g.start.getDate() }, until: new Date(9999, 1, 1) };
  }, WEEKLY: function(g) {
    let b = g.start.getDay() - 1;
    return b == -1 && (b = 6), { rrule: { freq: H.WEEKLY, interval: 1, byweekday: [b] }, until: new Date(9999, 1, 1) };
  }, DAILY: function(g) {
    return { rrule: { freq: H.DAILY, interval: 1 }, until: new Date(9999, 1, 1) };
  }, YEARLY: function(g) {
    return { rrule: { freq: H.YEARLY, bymonth: g.start.getMonth() + 1, interval: 1, bymonthday: g.start.getDate() }, until: new Date(9999, 1, 1) };
  }, WORKDAYS: function(g) {
    return { rrule: { freq: H.WEEKLY, interval: 1, byweekday: e.config.recurring_workdays }, until: new Date(9999, 1, 1) };
  }, CUSTOM: function(g, b) {
    const x = {}, k = b.querySelector('[name="repeat_interval_unit"]').value, M = Math.max(1, b.querySelector('[name="repeat_interval_value"]').value), N = b.querySelector('[name="dhx_custom_month_option"]').value, T = b.querySelector('[name="dhx_custom_year_option"]').value;
    let A, C;
    switch (x.interval = M, k) {
      case "DAILY":
        x.freq = H.DAILY;
        break;
      case "WEEKLY":
        x.freq = H.WEEKLY, A = [], b.querySelectorAll('.dhx_form_repeat_custom_week [name="week_day"]').forEach((V) => {
          V.checked && A.push(V.value);
        }), x.byweekday = A.map((V) => {
          switch (V) {
            case "MO":
              return H.MO.weekday;
            case "TU":
              return H.TU.weekday;
            case "WE":
              return H.WE.weekday;
            case "TH":
              return H.TH.weekday;
            case "FR":
              return H.FR.weekday;
            case "SA":
              return H.SA.weekday;
            case "SU":
              return H.SU.weekday;
          }
        });
        break;
      case "MONTHLY":
        x.freq = H.MONTHLY, N === "month_date" ? x.bymonthday = g.start.getDate() : (C = g.start.getDay() - 1, C == -1 && (C = 6), x.byweekday = [C], x.bysetpos = u(g.start).dayNumber);
        break;
      case "YEARLY":
        x.freq = H.YEARLY, x.bymonth = g.start.getMonth() + 1, T == "month_date" ? x.bymonthday = g.start.getDate() : (C = g.start.getDay() - 1, C == -1 && (C = 6), x.byweekday = [C], x.bysetpos = u(g.start).dayNumber);
    }
    const $ = e.date.str_to_date("%Y-%m-%d");
    let O = new Date(9999, 1, 1);
    const j = b.querySelector('[name="dhx_custom_repeat_ends"]');
    return j.value === "ON" ? (O = $(b.querySelector('[name="dhx_form_repeat_ends_ondate"]').value), x.until = new Date(O)) : j.value === "AFTER" && (x.count = Math.max(1, b.querySelector('[name="dhx_form_repeat_ends_after"]').value)), { rrule: x, until: O };
  }, NEVER: function() {
  } };
  function E(g, b, x) {
    (function(k, M) {
      k.querySelector("[name='repeat_interval_value']").value = (M ? M.interval : 1) || 1;
    })(g, b), function(k, M, N) {
      if (k.querySelector("[name='repeat_interval_value']").value = (M ? M.interval : 1) || 1, k.querySelectorAll(".dhx_form_repeat_custom_week input").forEach((T) => T.checked = !1), M && M.byweekday)
        M.byweekday.forEach((T) => {
          const A = y[T.weekday], C = m[A];
          k.querySelector(`.dhx_form_repeat_custom_week input[value="${C}"]`).checked = !0;
        });
      else {
        const T = m[N.start_date.getDay()];
        k.querySelector(`.dhx_form_repeat_custom_week input[value="${T}"]`).checked = !0;
      }
    }(g, b, x), function(k, M, N) {
      k.querySelector("[name='repeat_interval_value']").value = (M ? M.interval : 1) || 1;
      const T = k.querySelector('.dhx_form_repeat_custom_month [value="month_date"]'), A = k.querySelector('.dhx_form_repeat_custom_month [value="month_nth_weekday"]');
      T.innerText = e.templates.repeat_monthly_date(N.start_date, N), A.innerText = e.templates.repeat_monthly_weekday(N.start_date, N), M && (!M.bysetpos || M.byweekday && M.byweekday.length) ? k.querySelector('[name="dhx_custom_month_option"]').value = "month_nth_weekday" : k.querySelector('[name="dhx_custom_month_option"]').value = "month_date";
    }(g, b, x), function(k, M, N) {
      const T = k.querySelector('.dhx_form_repeat_custom_year [value="month_date"]'), A = k.querySelector('.dhx_form_repeat_custom_year [value="month_nth_weekday"]');
      T.innerText = e.templates.repeat_yearly_month_date(N.start_date, N), A.innerText = e.templates.repeat_yearly_month_weekday(N.start_date, N), M && (!M.bysetpos || M.byweekday && M.byweekday.length) ? k.querySelector('[name="dhx_custom_year_option"]').value = "month_nth_weekday" : k.querySelector('[name="dhx_custom_year_option"]').value = "month_date";
    }(g, b, x), function(k, M, N) {
      const T = k.querySelector('.dhx_form_repeat_ends_extra [name="dhx_form_repeat_ends_after"]'), A = k.querySelector('.dhx_form_repeat_ends_extra [name="dhx_form_repeat_ends_ondate"]'), C = k.querySelector("[name='dhx_custom_repeat_ends']");
      T.value = 1;
      let $ = e.date.date_to_str("%Y-%m-%d");
      e.config.repeat_date_of_end || (e.config.repeat_date_of_end = $(e.date.add(e._currentDate(), 30, "day"))), A.value = e.config.repeat_date_of_end, M && M.count ? (C.value = "AFTER", T.value = M.count) : N._end_date && N._end_date.getFullYear() !== 9999 ? (C.value = "ON", A.value = $(N._end_date)) : C.value = "NEVER", C.dispatchEvent(new Event("change"));
    }(g, b, x);
  }
  function S(g) {
    for (let b = 0; b < e.config.lightbox.sections.length; b++) {
      let x = e.config.lightbox.sections[b];
      if (x.type === g)
        return e.formSection(x.name);
    }
    return null;
  }
  e.form_blocks.recurring = { render: function(g) {
    if (g.form) {
      let x = e.form_blocks.recurring, k = x._get_node(g.form), M = x._outer_html(k);
      return k.style.display = "none", M;
    }
    let b = e.locale.labels;
    return `<div class="dhx_form_rrule">
		<div class="dhx_form_repeat_pattern">
			<select>
				<option value="NEVER">${b.repeat_never}</option>
				<option value="DAILY">${b.repeat_daily}</option>
				<option value="WEEKLY">${b.repeat_weekly}</option>
				<option value="MONTHLY">${b.repeat_monthly}</option>
				<option value="YEARLY">${b.repeat_yearly}</option>
				<option value="WORKDAYS">${b.repeat_workdays}</option>
				<option value="CUSTOM">${b.repeat_custom}</option>
			</select>
		</div>
		<div class="dhx_form_repeat_custom dhx_hidden">
			<div class="dhx_form_repeat_custom_interval">
				<input name="repeat_interval_value" type="number" min="1">
				<select name="repeat_interval_unit">
					<option value="DAILY">${b.repeat_freq_day}</option>
					<option value="WEEKLY">${b.repeat_freq_week}</option>
					<option value="MONTHLY">${b.repeat_freq_month}</option>
					<option value="YEARLY">${b.repeat_freq_year}</option>
				</select>
			</div>

			<div class="dhx_form_repeat_custom_additional">
				<div class="dhx_form_repeat_custom_week dhx_hidden">
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="MO" />${b.day_for_recurring[1]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="TU" />${b.day_for_recurring[2]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="WE" />${b.day_for_recurring[3]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="TH" />${b.day_for_recurring[4]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="FR" />${b.day_for_recurring[5]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="SA" />${b.day_for_recurring[6]}</label>
					<label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="SU" />${b.day_for_recurring[0]}</label>
				</div>

				<div class="dhx_form_repeat_custom_month dhx_hidden">
					<select name="dhx_custom_month_option">
						<option value="month_date"></option>
						<option value="month_nth_weekday"></option>
					</select>
				</div>

				<div class="dhx_form_repeat_custom_year dhx_hidden">
					<select name="dhx_custom_year_option">
						<option value="month_date"></option>
						<option value="month_nth_weekday"></option>
					</select>
				</div>
			</div>

			<div class="dhx_form_repeat_ends">
				<div>${b.repeat_ends}</div>
				<div class="dhx_form_repeat_ends_options">
					<select name="dhx_custom_repeat_ends">
						<option value="NEVER">${b.repeat_never}</option>
						<option value="AFTER">${b.repeat_radio_end2}</option>
						<option value="ON">${b.repeat_on_date}</option>
					</select>
					<div class="dhx_form_repeat_ends_extra">
						<div class="dhx_form_repeat_ends_after dhx_hidden">
							<label><input type="number" min="1" name="dhx_form_repeat_ends_after">${b.repeat_text_occurrences_count}</label>
						</div>
						<div class="dhx_form_repeat_ends_on dhx_hidden">
							<input type="date" name="dhx_form_repeat_ends_ondate">
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>`;
  }, _init_set_value: function(g, b, x) {
    function k(N) {
      N.classList.add("dhx_hidden");
    }
    function M(N) {
      N.classList.remove("dhx_hidden");
    }
    e.form_blocks.recurring._ds = { start: x.start_date, end: x.end_date }, g.querySelector(".dhx_form_repeat_pattern select").addEventListener("change", function() {
      (function(N) {
        const T = g.querySelector(".dhx_form_repeat_custom");
        N === "CUSTOM" ? M(T) : k(T);
      })(this.value);
    }), g.querySelector(".dhx_form_repeat_custom_interval [name='repeat_interval_unit']").addEventListener("change", function() {
      (function(N) {
        const T = { weekly: g.querySelector(".dhx_form_repeat_custom_week"), monthly: g.querySelector(".dhx_form_repeat_custom_month"), yearly: g.querySelector(".dhx_form_repeat_custom_year") };
        switch (N) {
          case "DAILY":
            k(T.weekly), k(T.monthly), k(T.yearly);
            break;
          case "WEEKLY":
            M(T.weekly), k(T.monthly), k(T.yearly);
            break;
          case "MONTHLY":
            k(T.weekly), M(T.monthly), k(T.yearly);
            break;
          case "YEARLY":
            k(T.weekly), k(T.monthly), M(T.yearly);
        }
      })(this.value);
    }), g.querySelector(".dhx_form_repeat_ends [name='dhx_custom_repeat_ends']").addEventListener("change", function() {
      (function(N) {
        const T = { after: g.querySelector(".dhx_form_repeat_ends_extra .dhx_form_repeat_ends_after"), on: g.querySelector(".dhx_form_repeat_ends_extra .dhx_form_repeat_ends_on") };
        switch (N) {
          case "NEVER":
            k(T.after), k(T.on);
            break;
          case "AFTER":
            M(T.after), k(T.on);
            break;
          case "ON":
            k(T.after), M(T.on);
        }
      })(this.value);
    }), e._lightbox._rec_init_done = !0;
  }, button_click: function() {
  }, set_value: function(g, b, x) {
    let k = e.form_blocks.recurring;
    e._lightbox._rec_init_done || k._init_set_value(g, b, x), g.open = !x.rrule, g.blocked = this._is_modified_occurrence(x);
    let M = k._ds;
    if (M.start = x.start_date, M.end = x._end_date, x.rrule) {
      const N = we(x.rrule);
      E(g, N.origOptions, x);
      const T = function(A, C) {
        const $ = A.options, O = $.until || C;
        return $.count || O && O.getFullYear() !== 9999 ? "CUSTOM" : $.freq !== H.DAILY || $.interval !== 1 || $.byweekday ? $.freq !== H.WEEKLY || $.interval !== 1 || $.byweekday ? $.freq !== H.MONTHLY || $.interval !== 1 || $.bysetpos ? $.freq !== H.YEARLY || $.interval !== 1 || $.bysetpos ? $.freq === H.DAILY && $.byweekday && $.byweekday.length === e.config.recurring_workdays.length && $.byweekday.includes(H.MO) && $.byweekday.includes(H.TU) && $.byweekday.includes(H.WE) && $.byweekday.includes(H.TH) && $.byweekday.includes(H.FR) ? "WORKDAYS" : "CUSTOM" : "YEARLY" : "MONTHLY" : "WEEKLY" : "DAILY";
      }(N, x._end_date);
      if (g.querySelector(".dhx_form_repeat_pattern select").value = T, T === "CUSTOM") {
        let A;
        switch (N.origOptions.freq) {
          case H.DAILY:
            A = "DAILY";
            break;
          case H.WEEKLY:
            A = "WEEKLY";
            break;
          case H.MONTHLY:
            A = "MONTHLY";
            break;
          case H.YEARLY:
            A = "YEARLY";
        }
        A && (g.querySelector('[name="repeat_interval_unit"]').value = A, g.querySelector('[name="repeat_interval_unit"]').dispatchEvent(new Event("change")));
      }
    } else
      E(g, null, x), g.querySelector(".dhx_form_repeat_pattern select").value = "NEVER";
    g.querySelector(".dhx_form_repeat_pattern select").dispatchEvent(new Event("change"));
  }, get_value: function(g, b) {
    if (g.blocked || g.querySelector(".dhx_form_repeat_pattern select").value === "NEVER")
      b.rrule = b.rrule = "", b._end_date = b.end_date;
    else {
      let x = e.form_blocks.recurring._ds, k = {};
      (function() {
        let T = e.formSection("time");
        if (T || (T = S("time")), T || (T = S("calendar_time")), !T)
          throw new Error(["Can't calculate the recurring rule, the Recurring form block can't find the Time control. Make sure you have the time control in 'scheduler.config.lightbox.sections' config.", "You can use either the default time control https://docs.dhtmlx.com/scheduler/time.html, or the datepicker https://docs.dhtmlx.com/scheduler/minicalendar.html, or a custom control. ", 'In the latter case, make sure the control is named "time":', "", "scheduler.config.lightbox.sections = [", '{name:"time", height:72, type:"YOU CONTROL", map_to:"auto" }];'].join(`
`));
        return T;
      })().getValue(k), x.start = k.start_date;
      const M = g.querySelector(".dhx_form_repeat_pattern select").value, N = D[M](x, g);
      b.rrule = new H(N.rrule).toString().replace("RRULE:", ""), x.end = N.until, b.duration = Math.floor((k.end_date - k.start_date) / 1e3), x._start ? (b.start_date = new Date(x.start), b._start_date = new Date(x.start), x._start = !1) : b._start_date = null, b._end_date = x.end;
    }
    return b.rrule;
  }, focus: function(g) {
  } };
}, recurring_legacy: function(e) {
  function i() {
    var n = e.formSection("recurring");
    if (n || (n = t("recurring")), !n)
      throw new Error(["Can't locate the Recurring form section.", "Make sure that you have the recurring control on the lightbox configuration https://docs.dhtmlx.com/scheduler/recurring_events.html#recurringlightbox ", 'and that the recurring control has name "recurring":', "", "scheduler.config.lightbox.sections = [", '	{name:"recurring", ... }', "];"].join(`
`));
    return n;
  }
  function t(n) {
    for (var o = 0; o < e.config.lightbox.sections.length; o++) {
      var _ = e.config.lightbox.sections[o];
      if (_.type === n)
        return e.formSection(_.name);
    }
    return null;
  }
  function r(n) {
    return new Date(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds(), 0);
  }
  var s;
  e.config.occurrence_timestamp_in_utc = !1, e.config.recurring_workdays = [1, 2, 3, 4, 5], e.form_blocks.recurring = { _get_node: function(n) {
    if (typeof n == "string") {
      let o = e._lightbox.querySelector(`#${n}`);
      o || (o = document.getElementById(n)), n = o;
    }
    return n.style.display == "none" && (n.style.display = ""), n;
  }, _outer_html: function(n) {
    return n.outerHTML || (o = n, (a = document.createElement("div")).appendChild(o.cloneNode(!0)), _ = a.innerHTML, a = null, _);
    var o, _, a;
  }, render: function(n) {
    if (n.form) {
      var o = e.form_blocks.recurring, _ = o._get_node(n.form), a = o._outer_html(_);
      return _.style.display = "none", a;
    }
    var d = e.locale.labels;
    return '<div class="dhx_form_repeat"> <form> <div class="dhx_repeat_left"> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="day" />' + d.repeat_radio_day + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="week"/>' + d.repeat_radio_week + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="month" checked />' + d.repeat_radio_month + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="year" />' + d.repeat_radio_year + '</label></div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_center"> <div style="display:none;" id="dhx_repeat_day"> <div><label><input class="dhx_repeat_radio" type="radio" name="day_type" value="d"/>' + d.repeat_radio_day_type + '</label><label><input class="dhx_repeat_text" type="text" name="day_count" value="1" />' + d.repeat_text_day_count + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="day_type" checked value="w"/>' + d.repeat_radio_day_type2 + '</label></div> </div> <div style="display:none;" id="dhx_repeat_week"><div><label>' + d.repeat_week + '<input class="dhx_repeat_text" type="text" name="week_count" value="1" /></label><span>' + d.repeat_text_week_count + '</span></div>  <table class="dhx_repeat_days"> <tr> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="1" />' + d.day_for_recurring[1] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="4" />' + d.day_for_recurring[4] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="2" />' + d.day_for_recurring[2] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="5" />' + d.day_for_recurring[5] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="3" />' + d.day_for_recurring[3] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="6" />' + d.day_for_recurring[6] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="0" />' + d.day_for_recurring[0] + '</label></div> </td> </tr> </table> </div> <div id="dhx_repeat_month"> <div><label class = "dhx_repeat_month_label"><input class="dhx_repeat_radio" type="radio" name="month_type" value="d"/>' + d.repeat_radio_month_type + '</label><label><input class="dhx_repeat_text" type="text" name="month_day" value="1" />' + d.repeat_text_month_day + '</label><label><input class="dhx_repeat_text" type="text" name="month_count" value="1" />' + d.repeat_text_month_count + '</label></div> <div><label class = "dhx_repeat_month_label"><input class="dhx_repeat_radio" type="radio" name="month_type" checked value="w"/>' + d.repeat_radio_month_start + '</label><input class="dhx_repeat_text" type="text" name="month_week2" value="1" /><label><select name="month_day2">	<option value="1" selected >' + e.locale.date.day_full[1] + '<option value="2">' + e.locale.date.day_full[2] + '<option value="3">' + e.locale.date.day_full[3] + '<option value="4">' + e.locale.date.day_full[4] + '<option value="5">' + e.locale.date.day_full[5] + '<option value="6">' + e.locale.date.day_full[6] + '<option value="0">' + e.locale.date.day_full[0] + "</select>" + d.repeat_text_month_count2_before + '</label><label><input class="dhx_repeat_text" type="text" name="month_count2" value="1" />' + d.repeat_text_month_count2_after + '</label></div> </div> <div style="display:none;" id="dhx_repeat_year"> <div><label class = "dhx_repeat_year_label"><input class="dhx_repeat_radio" type="radio" name="year_type" value="d"/>' + d.repeat_radio_day_type + '</label><label><input class="dhx_repeat_text" type="text" name="year_day" value="1" />' + d.repeat_text_year_day + '</label><label><select name="year_month"><option value="0" selected >' + d.month_for_recurring[0] + '<option value="1">' + d.month_for_recurring[1] + '<option value="2">' + d.month_for_recurring[2] + '<option value="3">' + d.month_for_recurring[3] + '<option value="4">' + d.month_for_recurring[4] + '<option value="5">' + d.month_for_recurring[5] + '<option value="6">' + d.month_for_recurring[6] + '<option value="7">' + d.month_for_recurring[7] + '<option value="8">' + d.month_for_recurring[8] + '<option value="9">' + d.month_for_recurring[9] + '<option value="10">' + d.month_for_recurring[10] + '<option value="11">' + d.month_for_recurring[11] + "</select>" + d.select_year_month + '</label></div> <div><label class = "dhx_repeat_year_label"><input class="dhx_repeat_radio" type="radio" name="year_type" checked value="w"/>' + d.repeat_year_label + '</label><input class="dhx_repeat_text" type="text" name="year_week2" value="1" /><select name="year_day2"><option value="1" selected >' + e.locale.date.day_full[1] + '<option value="2">' + e.locale.date.day_full[2] + '<option value="3">' + e.locale.date.day_full[3] + '<option value="4">' + e.locale.date.day_full[4] + '<option value="5">' + e.locale.date.day_full[5] + '<option value="6">' + e.locale.date.day_full[6] + '<option value="7">' + e.locale.date.day_full[0] + "</select>" + d.select_year_day2 + '<select name="year_month2"><option value="0" selected >' + d.month_for_recurring[0] + '<option value="1">' + d.month_for_recurring[1] + '<option value="2">' + d.month_for_recurring[2] + '<option value="3">' + d.month_for_recurring[3] + '<option value="4">' + d.month_for_recurring[4] + '<option value="5">' + d.month_for_recurring[5] + '<option value="6">' + d.month_for_recurring[6] + '<option value="7">' + d.month_for_recurring[7] + '<option value="8">' + d.month_for_recurring[8] + '<option value="9">' + d.month_for_recurring[9] + '<option value="10">' + d.month_for_recurring[10] + '<option value="11">' + d.month_for_recurring[11] + '</select></div> </div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_right"> <div><label><input class="dhx_repeat_radio" type="radio" name="end" checked/>' + d.repeat_radio_end + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="end" />' + d.repeat_radio_end2 + '</label><input class="dhx_repeat_text" type="text" name="occurences_count" value="1" />' + d.repeat_text_occurences_count + '</div> <div><label><input class="dhx_repeat_radio" type="radio" name="end" />' + d.repeat_radio_end3 + '</label><input class="dhx_repeat_date" type="text" name="date_of_end" value="' + e.config.repeat_date_of_end + '" /></div> </div> </form> </div> </div>';
  }, _ds: {}, _get_form_node: function(n, o, _) {
    var a = n[o];
    if (!a)
      return null;
    if (a.nodeName)
      return a;
    if (a.length) {
      for (var d = 0; d < a.length; d++)
        if (a[d].value == _)
          return a[d];
    }
  }, _get_node_value: function(n, o, _) {
    var a = n[o];
    if (!a)
      return "";
    if (a.length) {
      if (_) {
        for (var d = [], l = 0; l < a.length; l++)
          a[l].checked && d.push(a[l].value);
        return d;
      }
      for (l = 0; l < a.length; l++)
        if (a[l].checked)
          return a[l].value;
    }
    return a.value ? _ ? [a.value] : a.value : void 0;
  }, _get_node_numeric_value: function(n, o) {
    return 1 * e.form_blocks.recurring._get_node_value(n, o) || 0;
  }, _set_node_value: function(n, o, _) {
    var a = n[o];
    if (a) {
      if (a.name == o)
        a.value = _;
      else if (a.length)
        for (var d = typeof _ == "object", l = 0; l < a.length; l++)
          (d || a[l].value == _) && (a[l].checked = d ? !!_[a[l].value] : !!_);
    }
  }, _init_set_value: function(n, o, _) {
    var a = e.form_blocks.recurring, d = a._get_node_value, l = a._set_node_value;
    e.form_blocks.recurring._ds = { start: _.start_date, end: _._end_date };
    var c = e.date.str_to_date(e.config.repeat_date, !1, !0), f = e.date.date_to_str(e.config.repeat_date), v = n.getElementsByTagName("FORM")[0], p = {};
    function h(b) {
      for (var x = 0; x < b.length; x++) {
        var k = b[x];
        if (k.name)
          if (p[k.name])
            if (p[k.name].nodeType) {
              var M = p[k.name];
              p[k.name] = [M, k];
            } else
              p[k.name].push(k);
          else
            p[k.name] = k;
      }
    }
    if (h(v.getElementsByTagName("INPUT")), h(v.getElementsByTagName("SELECT")), !e.config.repeat_date_of_end) {
      var u = e.date.date_to_str(e.config.repeat_date);
      e.config.repeat_date_of_end = u(e.date.add(e._currentDate(), 30, "day"));
    }
    l(p, "date_of_end", e.config.repeat_date_of_end);
    var m = function(b) {
      return e._lightbox.querySelector(`#${b}`) || { style: {} };
    };
    function y() {
      m("dhx_repeat_day").style.display = "none", m("dhx_repeat_week").style.display = "none", m("dhx_repeat_month").style.display = "none", m("dhx_repeat_year").style.display = "none", m("dhx_repeat_" + this.value).style.display = "", e.setLightboxSize();
    }
    function w(b, x) {
      var k = b.end;
      if (k.length)
        if (k[0].value && k[0].value != "on")
          for (var M = 0; M < k.length; M++)
            k[M].value == x && (k[M].checked = !0);
        else {
          var N = 0;
          switch (x) {
            case "no":
              N = 0;
              break;
            case "date_of_end":
              N = 2;
              break;
            default:
              N = 1;
          }
          k[N].checked = !0;
        }
      else
        k.value = x;
    }
    e.form_blocks.recurring._get_repeat_code = function(b) {
      var x = [d(p, "repeat")];
      for (D[x[0]](x, b); x.length < 5; )
        x.push("");
      var k = "", M = function(N) {
        var T = N.end;
        if (T.length) {
          for (var A = 0; A < T.length; A++)
            if (T[A].checked)
              return T[A].value && T[A].value != "on" ? T[A].value : A ? A == 2 ? "date_of_end" : "occurences_count" : "no";
        } else if (T.value)
          return T.value;
        return "no";
      }(p);
      return M == "no" ? (b.end = new Date(9999, 1, 1), k = "no") : M == "date_of_end" ? b.end = function(N) {
        var T = c(N);
        return e.config.include_end_by && (T = e.date.add(T, 1, "day")), T;
      }(d(p, "date_of_end")) : (e.transpose_type(x.join("_")), k = Math.max(1, d(p, "occurences_count")), b.end = e.date["add_" + x.join("_")](new Date(b.start), k + 0, { start_date: b.start }) || b.start), x.join("_") + "#" + k;
    };
    var D = { month: function(b, x) {
      var k = e.form_blocks.recurring._get_node_value, M = e.form_blocks.recurring._get_node_numeric_value;
      k(p, "month_type") == "d" ? (b.push(Math.max(1, M(p, "month_count"))), x.start.setDate(k(p, "month_day"))) : (b.push(Math.max(1, M(p, "month_count2"))), b.push(k(p, "month_day2")), b.push(Math.max(1, M(p, "month_week2"))), e.config.repeat_precise || x.start.setDate(1)), x._start = !0;
    }, week: function(b, x) {
      var k = e.form_blocks.recurring._get_node_value, M = e.form_blocks.recurring._get_node_numeric_value;
      b.push(Math.max(1, M(p, "week_count"))), b.push(""), b.push("");
      for (var N = [], T = k(p, "week_day", !0), A = x.start.getDay(), C = !1, $ = 0; $ < T.length; $++)
        N.push(T[$]), C = C || T[$] == A;
      N.length || (N.push(A), C = !0), N.sort(), e.config.repeat_precise ? C || (e.transpose_day_week(x.start, N, 1, 7), x._start = !0) : (x.start = e.date.week_start(x.start), x._start = !0), b.push(N.join(","));
    }, day: function(b) {
      var x = e.form_blocks.recurring._get_node_value, k = e.form_blocks.recurring._get_node_numeric_value;
      x(p, "day_type") == "d" ? b.push(Math.max(1, k(p, "day_count"))) : (b.push("week"), b.push(1), b.push(""), b.push(""), b.push(e.config.recurring_workdays.join(",")), b.splice(0, 1));
    }, year: function(b, x) {
      var k = e.form_blocks.recurring._get_node_value;
      k(p, "year_type") == "d" ? (b.push("1"), x.start.setMonth(0), x.start.setDate(k(p, "year_day")), x.start.setMonth(k(p, "year_month"))) : (b.push("1"), b.push(k(p, "year_day2")), b.push(k(p, "year_week2")), x.start.setDate(1), x.start.setMonth(k(p, "year_month2"))), x._start = !0;
    } }, E = { week: function(b, x) {
      var k = e.form_blocks.recurring._set_node_value;
      k(p, "week_count", b[1]);
      for (var M = b[4].split(","), N = {}, T = 0; T < M.length; T++)
        N[M[T]] = !0;
      k(p, "week_day", N);
    }, month: function(b, x) {
      var k = e.form_blocks.recurring._set_node_value;
      b[2] === "" ? (k(p, "month_type", "d"), k(p, "month_count", b[1]), k(p, "month_day", x.start.getDate())) : (k(p, "month_type", "w"), k(p, "month_count2", b[1]), k(p, "month_week2", b[3]), k(p, "month_day2", b[2]));
    }, day: function(b, x) {
      var k = e.form_blocks.recurring._set_node_value;
      k(p, "day_type", "d"), k(p, "day_count", b[1]);
    }, year: function(b, x) {
      var k = e.form_blocks.recurring._set_node_value;
      b[2] === "" ? (k(p, "year_type", "d"), k(p, "year_day", x.start.getDate()), k(p, "year_month", x.start.getMonth())) : (k(p, "year_type", "w"), k(p, "year_week2", b[3]), k(p, "year_day2", b[2]), k(p, "year_month2", x.start.getMonth()));
    } };
    e.form_blocks.recurring._set_repeat_code = function(b, x) {
      var k = e.form_blocks.recurring._set_node_value, M = b.split("#");
      switch (b = M[0].split("_"), E[b[0]](b, x), M[1]) {
        case "no":
          w(p, "no");
          break;
        case "":
          w(p, "date_of_end");
          var N = x.end;
          e.config.include_end_by && (N = e.date.add(N, -1, "day")), k(p, "date_of_end", f(N));
          break;
        default:
          w(p, "occurences_count"), k(p, "occurences_count", M[1]);
      }
      k(p, "repeat", b[0]);
      var T = e.form_blocks.recurring._get_form_node(p, "repeat", b[0]);
      T.nodeName == "SELECT" ? (T.dispatchEvent(new Event("change")), T.dispatchEvent(new MouseEvent("click"))) : T.dispatchEvent(new MouseEvent("click"));
    };
    for (var S = 0; S < v.elements.length; S++) {
      var g = v.elements[S];
      g.name === "repeat" && (g.nodeName != "SELECT" || g.$_eventAttached ? g.$_eventAttached || (g.$_eventAttached = !0, g.addEventListener("click", y)) : (g.$_eventAttached = !0, g.addEventListener("change", y)));
    }
    e._lightbox._rec_init_done = !0;
  }, set_value: function(n, o, _) {
    var a = e.form_blocks.recurring;
    e._lightbox._rec_init_done || a._init_set_value(n, o, _), n.open = !_.rec_type, n.blocked = this._is_modified_occurence(_);
    var d = a._ds;
    d.start = _.start_date, d.end = _._end_date, a._toggle_block(), o && a._set_repeat_code(o, d);
  }, get_value: function(n, o) {
    if (n.open) {
      var _ = e.form_blocks.recurring._ds, a = {};
      (function() {
        var d = e.formSection("time");
        if (d || (d = t("time")), d || (d = t("calendar_time")), !d)
          throw new Error(["Can't calculate the recurring rule, the Recurring form block can't find the Time control. Make sure you have the time control in 'scheduler.config.lightbox.sections' config.", "You can use either the default time control https://docs.dhtmlx.com/scheduler/time.html, or the datepicker https://docs.dhtmlx.com/scheduler/minicalendar.html, or a custom control. ", 'In the latter case, make sure the control is named "time":', "", "scheduler.config.lightbox.sections = [", '{name:"time", height:72, type:"YOU CONTROL", map_to:"auto" }];'].join(`
`));
        return d;
      })().getValue(a), _.start = a.start_date, o.rec_type = e.form_blocks.recurring._get_repeat_code(_), _._start ? (o.start_date = new Date(_.start), o._start_date = new Date(_.start), _._start = !1) : o._start_date = null, o._end_date = _.end, o.rec_pattern = o.rec_type.split("#")[0];
    } else
      o.rec_type = o.rec_pattern = "", o._end_date = o.end_date;
    return o.rec_type;
  }, _get_button: function() {
    return i().header.firstChild.firstChild;
  }, _get_form: function() {
    return i().node;
  }, open: function() {
    var n = e.form_blocks.recurring;
    n._get_form().open || n._toggle_block();
  }, close: function() {
    var n = e.form_blocks.recurring;
    n._get_form().open && n._toggle_block();
  }, _toggle_block: function() {
    var n = e.form_blocks.recurring, o = n._get_form(), _ = n._get_button();
    o.open || o.blocked ? (o.style.height = "0px", _ && (_.style.backgroundPosition = "-5px 20px", _.nextSibling.innerHTML = e.locale.labels.button_recurring)) : (o.style.height = "auto", _ && (_.style.backgroundPosition = "-5px 0px", _.nextSibling.innerHTML = e.locale.labels.button_recurring_open)), o.open = !o.open, e.setLightboxSize();
  }, focus: function(n) {
  }, button_click: function(n, o, _) {
    e.form_blocks.recurring._get_form().blocked || e.form_blocks.recurring._toggle_block();
  } }, e._rec_markers = {}, e._rec_markers_pull = {}, e._add_rec_marker = function(n, o) {
    n._pid_time = o, this._rec_markers[n.id] = n, this._rec_markers_pull[n.event_pid] || (this._rec_markers_pull[n.event_pid] = {}), this._rec_markers_pull[n.event_pid][o] = n;
  }, e._get_rec_marker = function(n, o) {
    var _ = this._rec_markers_pull[o];
    return _ ? _[n] : null;
  }, e._get_rec_markers = function(n) {
    return this._rec_markers_pull[n] || [];
  }, e._rec_temp = [], s = e.addEvent, e.addEvent = function(n, o, _, a, d) {
    var l = s.apply(this, arguments);
    if (l && e.getEvent(l)) {
      var c = e.getEvent(l);
      c.start_date && (c.start_date = r(c.start_date)), c.end_date && (c.end_date = r(c.end_date)), this._is_modified_occurence(c) && e._add_rec_marker(c, 1e3 * c.event_length), c.rec_type && (c.rec_pattern = c.rec_type.split("#")[0]);
    }
    return l;
  }, e.attachEvent("onEventIdChange", function(n, o) {
    if (!this._ignore_call) {
      this._ignore_call = !0, e._rec_markers[n] && (e._rec_markers[o] = e._rec_markers[n], delete e._rec_markers[n]), e._rec_markers_pull[n] && (e._rec_markers_pull[o] = e._rec_markers_pull[n], delete e._rec_markers_pull[n]);
      for (var _ = 0; _ < this._rec_temp.length; _++)
        (a = this._rec_temp[_]).event_pid == n && (a.event_pid = o, this.changeEventId(a.id, o + "#" + a.id.split("#")[1]));
      for (var _ in this._rec_markers) {
        var a;
        (a = this._rec_markers[_]).event_pid == n && (a.event_pid = o, a._pid_changed = !0);
      }
      var d = e._rec_markers[o];
      d && d._pid_changed && (delete d._pid_changed, setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.callEvent("onEventChanged", [o, e.getEvent(o)]);
      }, 1)), delete this._ignore_call;
    }
  }), e.attachEvent("onConfirmedBeforeEventDelete", function(n) {
    var o = this.getEvent(n);
    if (this._is_virtual_event(n) || this._is_modified_occurence(o) && o.rec_type && o.rec_type != "none") {
      n = n.split("#");
      var _ = this.uid(), a = n[1] ? n[1] : Math.round(o._pid_time / 1e3), d = this._copy_event(o);
      d.id = _, d.event_pid = o.event_pid || n[0];
      var l = a;
      d.event_length = l, d.rec_type = d.rec_pattern = "none", this.addEvent(d), this._add_rec_marker(d, 1e3 * l);
    } else {
      o.rec_type && this._lightbox_id && this._roll_back_dates(o);
      var c = this._get_rec_markers(n);
      for (var f in c)
        c.hasOwnProperty(f) && (n = c[f].id, this.getEvent(n) && this.deleteEvent(n, !0));
    }
    return !0;
  }), e.attachEvent("onEventDeleted", function(n, o) {
    !this._is_virtual_event(n) && this._is_modified_occurence(o) && (e._events[n] || (o.rec_type = o.rec_pattern = "none", this.setEvent(n, o)));
  }), e.attachEvent("onEventChanged", function(n, o) {
    if (this._loading)
      return !0;
    var _ = this.getEvent(n);
    if (this._is_virtual_event(n)) {
      n = n.split("#");
      var a = this.uid();
      this._not_render = !0;
      var d = this._copy_event(o);
      d.id = a, d.event_pid = n[0];
      var l = n[1];
      d.event_length = l, d.rec_type = d.rec_pattern = "", this._add_rec_marker(d, 1e3 * l), this.addEvent(d), this._not_render = !1;
    } else {
      _.start_date && (_.start_date = r(_.start_date)), _.end_date && (_.end_date = r(_.end_date)), _.rec_type && this._lightbox_id && this._roll_back_dates(_);
      var c = this._get_rec_markers(n);
      for (var f in c)
        c.hasOwnProperty(f) && (delete this._rec_markers[c[f].id], this.deleteEvent(c[f].id, !0));
      delete this._rec_markers_pull[n];
      for (var v = !1, p = 0; p < this._rendered.length; p++)
        this._rendered[p].getAttribute(this.config.event_attribute) == n && (v = !0);
      v || (this._select_id = null);
    }
    return !0;
  }), e.attachEvent("onEventAdded", function(n) {
    if (!this._loading) {
      var o = this.getEvent(n);
      o.rec_type && !o.event_length && this._roll_back_dates(o);
    }
    return !0;
  }), e.attachEvent("onEventSave", function(n, o, _) {
    return this.getEvent(n).rec_type || !o.rec_type || this._is_virtual_event(n) || (this._select_id = null), !0;
  }), e.attachEvent("onEventCreated", function(n) {
    var o = this.getEvent(n);
    return o.rec_type || (o.rec_type = o.rec_pattern = o.event_length = o.event_pid = ""), !0;
  }), e.attachEvent("onEventCancel", function(n) {
    var o = this.getEvent(n);
    o.rec_type && (this._roll_back_dates(o), this.render_view_data());
  }), e._roll_back_dates = function(n) {
    n.start_date && (n.start_date = r(n.start_date)), n.end_date && (n.end_date = r(n.end_date)), n.event_length = Math.round((n.end_date.valueOf() - n.start_date.valueOf()) / 1e3), n.end_date = n._end_date, n._start_date && (n.start_date.setMonth(0), n.start_date.setDate(n._start_date.getDate()), n.start_date.setMonth(n._start_date.getMonth()), n.start_date.setFullYear(n._start_date.getFullYear()));
  }, e._is_virtual_event = function(n) {
    return n.toString().indexOf("#") != -1;
  }, e._is_modified_occurence = function(n) {
    return n.event_pid && n.event_pid != "0";
  }, e.showLightbox_rec = e.showLightbox, e.showLightbox = function(n) {
    var o = this.locale, _ = e.config.lightbox_recurring, a = this.getEvent(n), d = a.event_pid, l = this._is_virtual_event(n);
    l && (d = n.split("#")[0]);
    var c = function(v) {
      var p = e.getEvent(v);
      return p._end_date = p.end_date, p.end_date = new Date(p.start_date.valueOf() + 1e3 * p.event_length), e.showLightbox_rec(v);
    };
    if ((d || 1 * d == 0) && a.rec_type)
      return c(n);
    if (!d || d === "0" || !o.labels.confirm_recurring || _ == "instance" || _ == "series" && !l)
      return this.showLightbox_rec(n);
    if (_ == "ask") {
      var f = this;
      e.modalbox({ text: o.labels.confirm_recurring, title: o.labels.title_confirm_recurring, width: "500px", position: "middle", buttons: [o.labels.button_edit_series, o.labels.button_edit_occurrence, o.labels.icon_cancel], callback: function(v) {
        switch (+v) {
          case 0:
            return c(d);
          case 1:
            return f.showLightbox_rec(n);
          case 2:
            return;
        }
      } });
    } else
      c(d);
  }, e.get_visible_events_rec = e.get_visible_events, e.get_visible_events = function(n) {
    for (var o = 0; o < this._rec_temp.length; o++)
      delete this._events[this._rec_temp[o].id];
    this._rec_temp = [];
    var _ = this.get_visible_events_rec(n), a = [];
    for (o = 0; o < _.length; o++)
      _[o].rec_type ? _[o].rec_pattern != "none" && this.repeat_date(_[o], a) : a.push(_[o]);
    return a;
  }, function() {
    var n = e.isOneDayEvent;
    e.isOneDayEvent = function(_) {
      return !!_.rec_type || n.call(this, _);
    };
    var o = e.updateEvent;
    e.updateEvent = function(_) {
      var a = e.getEvent(_);
      a && a.rec_type && (a.rec_pattern = (a.rec_type || "").split("#")[0]), a && a.rec_type && !this._is_virtual_event(_) ? e.update_view() : o.call(this, _);
    };
  }(), e.transponse_size = { day: 1, week: 7, month: 1, year: 12 }, e.date.day_week = function(n, o, _) {
    n.setDate(1);
    var a = e.date.month_start(new Date(n)), d = 1 * o + (_ = 7 * (_ - 1)) - n.getDay() + 1;
    n.setDate(d <= _ ? d + 7 : d);
    var l = e.date.month_start(new Date(n));
    return a.valueOf() === l.valueOf();
  }, e.transpose_day_week = function(n, o, _, a, d) {
    for (var l = (n.getDay() || (e.config.start_on_monday ? 7 : 0)) - _, c = 0; c < o.length; c++)
      if (o[c] > l)
        return n.setDate(n.getDate() + 1 * o[c] - l - (a ? _ : d));
    this.transpose_day_week(n, o, _ + a, null, _);
  }, e.transpose_type = function(n) {
    var o = "transpose_" + n;
    if (!this.date[o]) {
      var _ = n.split("_"), a = "add_" + n, d = this.transponse_size[_[0]] * _[1];
      if (_[0] == "day" || _[0] == "week") {
        var l = null;
        if (_[4] && (l = _[4].split(","), e.config.start_on_monday)) {
          for (var c = 0; c < l.length; c++)
            l[c] = 1 * l[c] || 7;
          l.sort();
        }
        this.date[o] = function(f, v) {
          var p = Math.floor((v.valueOf() - f.valueOf()) / (864e5 * d));
          return p > 0 && f.setDate(f.getDate() + p * d), l && e.transpose_day_week(f, l, 1, d), f;
        }, this.date[a] = function(f, v) {
          var p = new Date(f.valueOf());
          if (l)
            for (var h = 0; h < v; h++)
              e.transpose_day_week(p, l, 0, d);
          else
            p.setDate(p.getDate() + v * d);
          return p;
        };
      } else
        _[0] != "month" && _[0] != "year" || (this.date[o] = function(f, v, p) {
          var h = Math.ceil((12 * v.getFullYear() + 1 * v.getMonth() + 1 - (12 * f.getFullYear() + 1 * f.getMonth() + 1)) / d - 1);
          return h >= 0 && (f.setDate(1), f.setMonth(f.getMonth() + h * d)), e.date[a](f, 0, p);
        }, this.date[a] = function(f, v, p, h) {
          if (h ? h++ : h = 1, h > 12)
            return null;
          var u = new Date(f.valueOf());
          u.setDate(1), u.setMonth(u.getMonth() + v * d);
          var m = u.getMonth(), y = u.getFullYear();
          u.setDate(p.start_date.getDate()), _[3] && e.date.day_week(u, _[2], _[3]);
          var w = e.config.recurring_overflow_instances;
          return u.getMonth() != m && w != "none" && (u = w === "lastDay" ? new Date(y, m + 1, 0, u.getHours(), u.getMinutes(), u.getSeconds(), u.getMilliseconds()) : e.date[a](new Date(y, m + 1, 0), v || 1, p, h)), u;
        });
    }
  }, e.repeat_date = function(n, o, _, a, d, l) {
    a = a || this._min_date, d = d || this._max_date;
    var c = l || -1, f = new Date(n.start_date.valueOf()), v = f.getHours(), p = 0;
    for (!n.rec_pattern && n.rec_type && (n.rec_pattern = n.rec_type.split("#")[0]), this.transpose_type(n.rec_pattern), f = e.date["transpose_" + n.rec_pattern](f, a, n); f && (f < n.start_date || e._fix_daylight_saving_date(f, a, n, f, new Date(f.valueOf() + 1e3 * n.event_length)).valueOf() <= a.valueOf() || f.valueOf() + 1e3 * n.event_length <= a.valueOf()); )
      f = this.date["add_" + n.rec_pattern](f, 1, n);
    for (; f && f < d && f < n.end_date && (c < 0 || p < c); ) {
      f.setHours(v);
      var h = e.config.occurrence_timestamp_in_utc ? Date.UTC(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), f.getMinutes(), f.getSeconds()) : f.valueOf(), u = this._get_rec_marker(h, n.id);
      if (u)
        _ && (u.rec_type != "none" && p++, o.push(u));
      else {
        var m = new Date(f.valueOf() + 1e3 * n.event_length), y = this._copy_event(n);
        if (y.text = n.text, y.start_date = f, y.event_pid = n.id, y.id = n.id + "#" + Math.round(h / 1e3), y.end_date = m, y.end_date = e._fix_daylight_saving_date(y.start_date, y.end_date, n, f, y.end_date), y._timed = this.isOneDayEvent(y), !y._timed && !this._table_view && !this.config.multi_day)
          return;
        o.push(y), _ || (this._events[y.id] = y, this._rec_temp.push(y)), p++;
      }
      f = this.date["add_" + n.rec_pattern](f, 1, n);
    }
  }, e._fix_daylight_saving_date = function(n, o, _, a, d) {
    var l = n.getTimezoneOffset() - o.getTimezoneOffset();
    return l ? l > 0 ? new Date(a.valueOf() + 1e3 * _.event_length - 60 * l * 1e3) : new Date(o.valueOf() - 60 * l * 1e3) : new Date(d.valueOf());
  }, e.getRecDates = function(n, o) {
    var _ = typeof n == "object" ? n : e.getEvent(n), a = [];
    if (o = o || 100, !_.rec_type)
      return [{ start_date: _.start_date, end_date: _.end_date }];
    if (_.rec_type == "none")
      return [];
    e.repeat_date(_, a, !0, _.start_date, _.end_date, o);
    for (var d = [], l = 0; l < a.length; l++)
      a[l].rec_type != "none" && d.push({ start_date: a[l].start_date, end_date: a[l].end_date });
    return d;
  }, e.getEvents = function(n, o) {
    var _ = [];
    for (var a in this._events) {
      var d = this._events[a];
      if (d && d.start_date < o && d.end_date > n)
        if (d.rec_pattern) {
          if (d.rec_pattern == "none")
            continue;
          var l = [];
          this.repeat_date(d, l, !0, n, o);
          for (var c = 0; c < l.length; c++)
            !l[c].rec_pattern && l[c].start_date < o && l[c].end_date > n && !this._rec_markers[l[c].id] && _.push(l[c]);
        } else
          this._is_virtual_event(d.id) || _.push(d);
    }
    return _;
  }, e.config.repeat_date = "%m.%d.%Y", e.config.lightbox.sections = [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "recurring", type: "recurring", map_to: "rec_type", button: "recurring" }, { name: "time", height: 72, type: "time", map_to: "auto" }], e._copy_dummy = function(n) {
    var o = new Date(this.start_date), _ = new Date(this.end_date);
    this.start_date = o, this.end_date = _, this.event_length = this.event_pid = this.rec_pattern = this.rec_type = null;
  }, e.config.include_end_by = !1, e.config.lightbox_recurring = "ask", e.attachEvent("onClearAll", function() {
    e._rec_markers = {}, e._rec_markers_pull = {}, e._rec_temp = [];
  });
}, serialize: function(e) {
  const i = mt(e);
  e.data_attributes = function() {
    var t = [], r = e._helpers.formatDate, s = i();
    for (var n in s) {
      var o = s[n];
      for (var _ in o)
        _.substr(0, 1) != "_" && t.push([_, _ == "start_date" || _ == "end_date" ? r : null]);
      break;
    }
    return t;
  }, e.toXML = function(t) {
    var r = [], s = this.data_attributes(), n = i();
    for (var o in n) {
      var _ = n[o];
      r.push("<event>");
      for (var a = 0; a < s.length; a++)
        r.push("<" + s[a][0] + "><![CDATA[" + (s[a][1] ? s[a][1](_[s[a][0]]) : _[s[a][0]]) + "]]></" + s[a][0] + ">");
      r.push("</event>");
    }
    return (t || "") + "<data>" + r.join(`
`) + "</data>";
  }, e._serialize_json_value = function(t) {
    return t === null || typeof t == "boolean" ? t = "" + t : (t || t === 0 || (t = ""), t = '"' + t.toString().replace(/\n/g, "").replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'), t;
  }, e.toJSON = function() {
    return JSON.stringify(this.serialize());
  }, e.toICal = function(t) {
    var r = e.date.date_to_str("%Y%m%dT%H%i%s"), s = e.date.date_to_str("%Y%m%d"), n = [], o = i();
    for (var _ in o) {
      var a = o[_];
      n.push("BEGIN:VEVENT"), a._timed && (a.start_date.getHours() || a.start_date.getMinutes()) ? n.push("DTSTART:" + r(a.start_date)) : n.push("DTSTART:" + s(a.start_date)), a._timed && (a.end_date.getHours() || a.end_date.getMinutes()) ? n.push("DTEND:" + r(a.end_date)) : n.push("DTEND:" + s(a.end_date)), n.push("SUMMARY:" + a.text), n.push("END:VEVENT");
    }
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//dhtmlXScheduler//NONSGML v2.2//EN
DESCRIPTION:` + (t || "") + `
` + n.join(`
`) + `
END:VCALENDAR`;
  };
}, timeline: function(e) {
  le("Timeline", e.assert);
}, tooltip: function(e) {
  e.config.tooltip_timeout = 30, e.config.tooltip_offset_y = 20, e.config.tooltip_offset_x = 10, e.config.tooltip_hide_timeout = 30;
  const i = new mn(e);
  e.ext.tooltips = i, e.attachEvent("onSchedulerReady", function() {
    i.tooltipFor({ selector: "[" + e.config.event_attribute + "]", html: (t) => {
      if (e._mobile && !e.config.touch_tooltip)
        return;
      const r = e._locate_event(t.target);
      if (e.getEvent(r)) {
        const s = e.getEvent(r);
        return e.templates.tooltip_text(s.start_date, s.end_date, s);
      }
      return null;
    }, global: !1 });
  }), e.attachEvent("onDestroy", function() {
    i.destructor();
  }), e.attachEvent("onLightbox", function() {
    i.hideTooltip();
  }), e.attachEvent("onBeforeDrag", function() {
    return e._mobile && e.config.touch_tooltip || i.hideTooltip(), !0;
  }), e.attachEvent("onEventDeleted", function() {
    return i.hideTooltip(), !0;
  });
}, treetimeline: function(e) {
  le("Tree Timeline", e.assert);
}, units: function(e) {
  le("Units", e.assert);
}, url: function(e) {
  e._get_url_nav = function() {
    for (var i = {}, t = (document.location.hash || "").replace("#", "").split(","), r = 0; r < t.length; r++) {
      var s = t[r].split("=");
      s.length == 2 && (i[s[0]] = s[1]);
    }
    return i;
  }, e.attachEvent("onTemplatesReady", function() {
    var i = !0, t = e.date.str_to_date("%Y-%m-%d"), r = e.date.date_to_str("%Y-%m-%d"), s = e._get_url_nav().event || null;
    function n(o) {
      if (e.$destroyed)
        return !0;
      s = o, e.getEvent(o) && e.showEvent(o);
    }
    e.attachEvent("onAfterEventDisplay", function(o) {
      return s = null, !0;
    }), e.attachEvent("onBeforeViewChange", function(o, _, a, d) {
      if (i) {
        i = !1;
        var l = e._get_url_nav();
        if (l.event)
          try {
            if (e.getEvent(l.event))
              return setTimeout(function() {
                n(l.event);
              }), !1;
            var c = e.attachEvent("onXLE", function() {
              setTimeout(function() {
                n(l.event);
              }), e.detachEvent(c);
            });
          } catch {
          }
        if (l.date || l.mode) {
          try {
            this.setCurrentView(l.date ? t(l.date) : null, l.mode || null);
          } catch {
            this.setCurrentView(l.date ? t(l.date) : null, a);
          }
          return !1;
        }
      }
      var f = ["date=" + r(d || _), "mode=" + (a || o)];
      s && f.push("event=" + s);
      var v = "#" + f.join(",");
      return document.location.hash = v, !0;
    });
  });
}, week_agenda: function(e) {
  le("Week Agenda", e.assert);
}, wp: function(e) {
  e.attachEvent("onLightBox", function() {
    if (this._cover)
      try {
        this._cover.style.height = this.expanded ? "100%" : (document.body.parentNode || document.body).scrollHeight + "px";
      } catch {
      }
  }), e.form_blocks.select.set_value = function(i, t, r) {
    t !== void 0 && t !== "" || (t = (i.firstChild.options[0] || {}).value), i.firstChild.value = t || "";
  };
}, year_view: function(e) {
  e.templates.year_date = function(_) {
    return e.date.date_to_str(e.locale.labels.year_tab + " %Y")(_);
  }, e.templates.year_month = e.date.date_to_str("%F"), e.templates.year_scale_date = e.date.date_to_str("%D"), e.templates.year_tooltip = function(_, a, d) {
    return d.text;
  };
  const i = function() {
    return e._mode == "year";
  }, t = function(_) {
    var a = e.$domHelpers.closest(_, "[data-cell-date]");
    return a && a.hasAttribute("data-cell-date") ? e.templates.parse_date(a.getAttribute("data-cell-date")) : null;
  };
  e.dblclick_dhx_year_grid = function(_) {
    if (i()) {
      const a = _.target;
      if (e.$domHelpers.closest(a, ".dhx_before") || e.$domHelpers.closest(a, ".dhx_after"))
        return !1;
      const d = t(a);
      if (d) {
        const l = d, c = this.date.add(l, 1, "day");
        !this.config.readonly && this.config.dblclick_create && this.addEventNow(l.valueOf(), c.valueOf(), _);
      }
    }
  }, e.attachEvent("onEventIdChange", function() {
    i() && this.year_view(!0);
  });
  var r = e.render_data;
  e.render_data = function(_) {
    if (!i())
      return r.apply(this, arguments);
    for (var a = 0; a < _.length; a++)
      this._year_render_event(_[a]);
  };
  var s = e.clear_view;
  e.clear_view = function() {
    if (!i())
      return s.apply(this, arguments);
    var _ = e._year_marked_cells;
    for (var a in _)
      _.hasOwnProperty(a) && _[a].classList.remove("dhx_year_event", "dhx_cal_datepicker_event");
    e._year_marked_cells = {};
  }, e._hideToolTip = function() {
    this._tooltip && (this._tooltip.style.display = "none", this._tooltip.date = new Date(9999, 1, 1));
  }, e._showToolTip = function(_, a, d, l) {
    if (this._tooltip) {
      if (this._tooltip.date.valueOf() == _.valueOf())
        return;
      this._tooltip.innerHTML = "";
    } else {
      var c = this._tooltip = document.createElement("div");
      c.className = "dhx_year_tooltip", this.config.rtl && (c.className += " dhx_tooltip_rtl"), document.body.appendChild(c), c.addEventListener("click", e._click.dhx_cal_data), c.addEventListener("click", function(y) {
        if (y.target.closest(`[${e.config.event_attribute}]`)) {
          const w = y.target.closest(`[${e.config.event_attribute}]`).getAttribute(e.config.event_attribute);
          e.showLightbox(w);
        }
      });
    }
    for (var f = this.getEvents(_, this.date.add(_, 1, "day")), v = "", p = 0; p < f.length; p++) {
      var h = f[p];
      if (this.filter_event(h.id, h)) {
        var u = h.color ? "--dhx-scheduler-event-background:" + h.color + ";" : "", m = h.textColor ? "--dhx-scheduler-event-color:" + h.textColor + ";" : "";
        v += "<div class='dhx_tooltip_line' style='" + u + m + "' event_id='" + f[p].id + "' " + this.config.event_attribute + "='" + f[p].id + "'>", v += "<div class='dhx_tooltip_date' style='" + u + m + "'>" + (f[p]._timed ? this.templates.event_date(f[p].start_date) : "") + "</div>", v += "<div class='dhx_event_icon icon_details'>&nbsp;</div>", v += this.templates.year_tooltip(f[p].start_date, f[p].end_date, f[p]) + "</div>";
      }
    }
    this._tooltip.style.display = "", this._tooltip.style.top = "0px", document.body.offsetWidth - a.left - this._tooltip.offsetWidth < 0 ? this._tooltip.style.left = a.left - this._tooltip.offsetWidth + "px" : this._tooltip.style.left = a.left + l.offsetWidth + "px", this._tooltip.date = _, this._tooltip.innerHTML = v, document.body.offsetHeight - a.top - this._tooltip.offsetHeight < 0 ? this._tooltip.style.top = a.top - this._tooltip.offsetHeight + l.offsetHeight + "px" : this._tooltip.style.top = a.top + "px";
  }, e._year_view_tooltip_handler = function(_) {
    if (i()) {
      var a = _.target || _.srcElement;
      a.tagName.toLowerCase() == "a" && (a = a.parentNode), e._getClassName(a).indexOf("dhx_year_event") != -1 ? e._showToolTip(e.templates.parse_date(a.getAttribute("data-year-date")), e.$domHelpers.getOffset(a), _, a) : e._hideToolTip();
    }
  }, e._init_year_tooltip = function() {
    e._detachDomEvent(e._els.dhx_cal_data[0], "mouseover", e._year_view_tooltip_handler), e.event(e._els.dhx_cal_data[0], "mouseover", e._year_view_tooltip_handler);
  }, e._get_year_cell = function(_) {
    for (var a = e.templates.format_date(_), d = this.$root.querySelectorAll(`.dhx_cal_data .dhx_cal_datepicker_date[data-cell-date="${a}"]`), l = 0; l < d.length; l++)
      if (!e.$domHelpers.closest(d[l], ".dhx_after, .dhx_before"))
        return d[l];
    return null;
  }, e._year_marked_cells = {}, e._mark_year_date = function(_, a) {
    var d = e.templates.format_date(_), l = this._get_year_cell(_);
    if (l) {
      var c = this.templates.event_class(a.start_date, a.end_date, a);
      e._year_marked_cells[d] || (l.classList.add("dhx_year_event", "dhx_cal_datepicker_event"), l.setAttribute("data-year-date", d), l.setAttribute("date", d), e._year_marked_cells[d] = l), c && l.classList.add(c);
    }
  }, e._unmark_year_date = function(_) {
    var a = this._get_year_cell(_);
    a && a.classList.remove("dhx_year_event", "dhx_cal_datepicker_event");
  }, e._year_render_event = function(_) {
    var a = _.start_date;
    for (a = a.valueOf() < this._min_date.valueOf() ? this._min_date : this.date.date_part(new Date(a)); a < _.end_date; )
      if (this._mark_year_date(a, _), (a = this.date.add(a, 1, "day")).valueOf() >= this._max_date.valueOf())
        return;
  }, e.year_view = function(_) {
    if (e.set_sizes(), e._table_view = _, !this._load_mode || !this._load())
      if (_) {
        if (e._init_year_tooltip(), e._reset_year_scale(), e._load_mode && e._load())
          return void (e._render_wait = !0);
        e.render_view_data();
      } else
        e._hideToolTip();
  }, e._reset_year_scale = function() {
    this._cols = [], this._colsS = {};
    var _ = [], a = this._els.dhx_cal_data[0], d = this.config;
    a.scrollTop = 0, a.innerHTML = "", Math.floor((parseInt(a.style.height) - e.xy.year_top) / d.year_y);
    var l = document.createElement("div"), c = this.date.week_start(e._currentDate());
    this._process_ignores(c, 7, "day", 1);
    for (var f = 0; f < 7; f++)
      this._ignores && this._ignores[f] || (this._cols[f] = "var(--dhx-scheduler-datepicker-cell-size)", this._render_x_header(f, 0, c, l)), c = this.date.add(c, 1, "day");
    for (l.lastChild.className += " dhx_scale_bar_last", f = 0; f < l.childNodes.length; f++)
      this._waiAria.yearHeadCell(l.childNodes[f]);
    var v = this.date[this._mode + "_start"](this.date.copy(this._date)), p = v, h = null;
    const u = document.createElement("div");
    for (u.classList.add("dhx_year_wrapper"), f = 0; f < d.year_y; f++)
      for (var m = 0; m < d.year_x; m++) {
        (h = document.createElement("div")).className = "dhx_year_box", h.setAttribute("date", this._helpers.formatDate(v)), h.setAttribute("data-month-date", this._helpers.formatDate(v)), h.innerHTML = "<div class='dhx_year_month'></div><div class='dhx_year_grid'><div class='dhx_year_week'>" + l.innerHTML + "</div><div class='dhx_year_body'></div></div>";
        var y = h.querySelector(".dhx_year_month"), w = h.querySelector(".dhx_year_grid"), D = h.querySelector(".dhx_year_body"), E = e.uid();
        this._waiAria.yearHeader(y, E), this._waiAria.yearGrid(w, E), y.innerHTML = this.templates.year_month(v);
        var S = this.date.week_start(v);
        this._reset_month_scale(D, v, S, 6);
        for (var g = D.querySelectorAll("td"), b = 0; b < g.length; b++)
          this._waiAria.yearDayCell(g[b]);
        u.appendChild(h), _[f * d.year_x + m] = (v.getDay() - (this.config.start_on_monday ? 1 : 0) + 7) % 7, v = this.date.add(v, 1, "month");
      }
    a.appendChild(u);
    var x = this._getNavDateElement();
    x && (x.innerHTML = this.templates[this._mode + "_date"](p, v, this._mode)), this.week_starts = _, _._month = p.getMonth(), this._min_date = p, this._max_date = v;
  }, e._reset_year_scale = function() {
    var _ = this._els.dhx_cal_data[0];
    _.scrollTop = 0, _.innerHTML = "";
    let a = this.date.year_start(new Date(this._date));
    this._min_date = this.date.week_start(new Date(a));
    const d = document.createElement("div");
    d.classList.add("dhx_year_wrapper");
    let l = a;
    for (let v = 0; v < 12; v++) {
      let p = document.createElement("div");
      p.className = "dhx_year_box", p.setAttribute("date", this._helpers.formatDate(l)), p.setAttribute("data-month-date", this._helpers.formatDate(l)), p.innerHTML = `<div class='dhx_year_month'>${this.templates.year_month(l)}</div>
			<div class='dhx_year_grid'></div>`;
      const h = p.querySelector(".dhx_year_grid"), u = e._createDatePicker(null, { date: l, filterDays: e.ignore_year, minWeeks: 6 });
      u._renderDayGrid(h), u.destructor(), d.appendChild(p), l = this.date.add(l, 1, "month");
    }
    _.appendChild(d);
    let c = this.date.add(a, 1, "year");
    c.valueOf() != this.date.week_start(new Date(c)).valueOf() && (c = this.date.week_start(new Date(c)), c = this.date.add(c, 1, "week")), this._max_date = c;
    var f = this._getNavDateElement();
    f && (f.innerHTML = this.templates[this._mode + "_date"](a, c, this._mode));
  };
  var n = e.getActionData;
  e.getActionData = function(_) {
    return i() ? { date: t(_.target), section: null } : n.apply(e, arguments);
  };
  var o = e._locate_event;
  e._locate_event = function(_) {
    var a = o.apply(e, arguments);
    if (!a) {
      var d = t(_);
      if (!d)
        return null;
      var l = e.getEvents(d, e.date.add(d, 1, "day"));
      if (!l.length)
        return null;
      a = l[0].id;
    }
    return a;
  }, e.attachEvent("onDestroy", function() {
    e._hideToolTip();
  });
} }, Ue = new class {
  constructor(e) {
    this._seed = 0, this._schedulerPlugins = [], this._bundledExtensions = e, this._extensionsManager = new Na(e);
  }
  plugin(e) {
    this._schedulerPlugins.push(e), de.scheduler && e(de.scheduler);
  }
  getSchedulerInstance(e) {
    for (var i = Ma(this._extensionsManager), t = 0; t < this._schedulerPlugins.length; t++)
      this._schedulerPlugins[t](i);
    return i._internal_id = this._seed++, this.$syncFactory && this.$syncFactory(i), e && this._initFromConfig(i, e), i;
  }
  _initFromConfig(e, i) {
    if (i.plugins && e.plugins(i.plugins), i.config && e.mixin(e.config, i.config, !0), i.templates && e.attachEvent("onTemplatesReady", function() {
      e.mixin(e.templates, i.templates, !0);
    }, { once: !0 }), i.events)
      for (const t in i.events)
        e.attachEvent(t, i.events[t]);
    i.locale && e.i18n.setLocale(i.locale), Array.isArray(i.calendars) && i.calendars.forEach(function(t) {
      e.addCalendar(t);
    }), i.container ? e.init(i.container) : e.init(), i.data && (typeof i.data == "string" ? e.load(i.data) : e.parse(i.data));
  }
}(gn), Ye = Ue.getSchedulerInstance(), ut = { plugin: Ye.bind(Ue.plugin, Ue) };
window.scheduler = Ye, window.Scheduler = ut, window.$dhx || (window.$dhx = {}), window.$dhx.scheduler = Ye, window.$dhx.Scheduler = ut;
export {
  ut as Scheduler,
  Ye as default,
  Ye as scheduler
};
//# sourceMappingURL=dhtmlxscheduler.es.js.map
