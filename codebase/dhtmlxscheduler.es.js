/** @license

dhtmlxScheduler v.7.2.6 Standard

To use dhtmlxScheduler in non-GPL projects (and get Pro version of the product), please obtain Commercial/Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxScheduler/#licensing or contact us at sales@dhtmlx.com

(c) XB Software Ltd.

*/
const le = typeof window < "u" ? window : global;
function St(e) {
  let i = [], t = !1, n = null, o = null;
  function a() {
    return e.config.drag_highlight && e.markTimespan;
  }
  function s(d) {
    const l = e.getView(d);
    return l ? l.layout : d;
  }
  function _(d) {
    const { event: l, layout: h, viewName: v, sectionId: m, eventNode: f } = d;
    (function(p, y) {
      switch (y) {
        case "month":
          p.style.top = "", p.style.left = "";
          break;
        case "timeline":
          p.style.left = "", p.style.marginLeft = "1px";
          break;
        default:
          p.style.top = "";
      }
    })(f, h);
    const c = {};
    let u = { start_date: l.start_date, end_date: l.end_date, css: "dhx_scheduler_dnd_marker", html: f };
    if (h == "timeline") {
      const p = e.getView(v);
      if (p.round_position) {
        const y = e._get_date_index(p, l.start_date), x = p._trace_x[y];
        u.start_date = x;
      }
    }
    return h != "timeline" && h != "month" || (u = { ...u, end_date: e.date.add(l.start_date, 1, "minute") }), m && (c[v] = m, u.sections = c), u;
  }
  function r(d) {
    const { layout: l } = d;
    let h;
    switch (l) {
      case "month":
        h = function(v) {
          let m = [];
          const { event: f, layout: c, viewName: u, sectionId: p } = v, y = [];
          let x = new Date(f.start_date);
          for (; x.valueOf() < f.end_date.valueOf(); ) {
            let k = { start_date: x };
            y.push(k), x = e.date.week_start(e.date.add(x, 1, "week"));
          }
          let S = e.$container.querySelectorAll(`[${e.config.event_attribute}='${f.id}']`);
          for (let k = 0; k < S.length; k++) {
            const D = { event: y[k], layout: c, viewName: u, sectionId: p, eventNode: S[k].cloneNode(!0) };
            m.push(_(D));
          }
          return m;
        }(d);
        break;
      case "timeline":
      case "units":
        h = function(v) {
          let m = [];
          const { event: f, layout: c, viewName: u, eventNode: p } = v;
          let y = function(x) {
            const S = e.getView(x);
            return S.y_property ? S.y_property : S.map_to ? S.map_to : void 0;
          }(u);
          if (y) {
            const x = String(f[y]).split(e.config.section_delimiter).map((k) => String(k)), S = [];
            for (let k = 0; k < x.length; k++) {
              S[k] = p.cloneNode(!0);
              const D = { event: f, layout: c, viewName: u, sectionId: x[k], eventNode: S[k] };
              m.push(_(D));
            }
          }
          return m;
        }(d);
        break;
      default:
        h = function(v) {
          const { event: m, layout: f, viewName: c, sectionId: u } = v;
          let p = [], y = e.$container.querySelectorAll(`[${e.config.event_attribute}='${m.id}']:not(.dhx_cal_select_menu):not(.dhx_drag_marker)`);
          if (y)
            for (let x = 0; x < y.length; x++) {
              let S = y[x].cloneNode(!0);
              const k = { event: { start_date: /* @__PURE__ */ new Date(+S.getAttribute("data-bar-start")), end_date: /* @__PURE__ */ new Date(+S.getAttribute("data-bar-end")) }, layout: f, viewName: c, sectionId: u, eventNode: S };
              p.push(_(k));
            }
          return p;
        }(d);
    }
    h.forEach((v) => {
      i.push(e.markTimespan(v));
    });
  }
  e.attachEvent("onBeforeDrag", function(d, l, h) {
    return a() && (t = !0, o = e.getEvent(d), n = h.target.closest(`[${e.config.event_attribute}]`), s(e.getState().mode) == "units" && e.config.cascade_event_display && (e.unselect(d), n = h.target.closest(`[${e.config.event_attribute}]`))), !0;
  }), e.attachEvent("onEventDrag", function(d, l, h) {
    if (t && a()) {
      t = !1;
      const v = e.getState().mode, m = s(v), f = e.getActionData(h).section;
      o && r({ event: o, layout: m, viewName: v, sectionId: f, eventNode: n });
    }
  }), e.attachEvent("onDragEnd", function(d, l, h) {
    for (let v = 0; v < i.length; v++)
      e.unmarkTimespan(i[v]);
    i = [], n = null, o = null;
  });
}
function Mt(e) {
  e.config.mark_now = !0, e.config.display_marked_timespans = !0, e.config.overwrite_marked_timespans = !0;
  var i = "dhx_time_block", t = "default", n = function(a, s, _) {
    var r = typeof a == "object" ? a : { days: a };
    return r.type = i, r.css = "", s && (_ && (r.sections = _), r = function(d, l, h) {
      return l instanceof Date && h instanceof Date ? (d.start_date = l, d.end_date = h) : (d.days = l, d.zones = h), d;
    }(r, a, s)), r;
  };
  function o(a, s, _, r, d) {
    var l = e, h = [], v = { _props: "map_to", matrix: "y_property" };
    for (var m in v) {
      var f = v[m];
      if (l[m])
        for (var c in l[m]) {
          var u = l[m][c][f];
          a[u] && (h = l._add_timespan_zones(h, e._get_blocked_zones(s[c], a[u], _, r, d)));
        }
    }
    return h = l._add_timespan_zones(h, e._get_blocked_zones(s, "global", _, r, d));
  }
  e.blockTime = function(a, s, _) {
    var r = n(a, s, _);
    return e.addMarkedTimespan(r);
  }, e.unblockTime = function(a, s, _) {
    var r = n(a, s = s || "fullday", _);
    return e.deleteMarkedTimespan(r);
  }, e.checkInMarkedTimespan = function(a, s, _) {
    s = s || t;
    for (var r = !0, d = new Date(a.start_date.valueOf()), l = e.date.add(d, 1, "day"), h = e._marked_timespans; d < a.end_date; d = e.date.date_part(l), l = e.date.add(d, 1, "day")) {
      var v = +e.date.date_part(new Date(d)), m = o(a, h, d.getDay(), v, s);
      if (m)
        for (var f = 0; f < m.length; f += 2) {
          var c = e._get_zone_minutes(d), u = a.end_date > l || a.end_date.getDate() != d.getDate() ? 1440 : e._get_zone_minutes(a.end_date), p = m[f], y = m[f + 1];
          if (p < u && y > c && !(r = typeof _ == "function" && _(a, c, u, p, y)))
            break;
        }
    }
    return !r;
  }, e.checkLimitViolation = function(a) {
    if (!a || !e.config.check_limits)
      return !0;
    var s = e, _ = s.config, r = [];
    if (a.rec_type && a._end_date || a.rrule) {
      const m = a._end_date || a.end_date;
      return !_.limit_start || !_.limit_end || m.valueOf() >= _.limit_start.valueOf() && a.start_date.valueOf() <= _.limit_end.valueOf();
    }
    r = [a];
    for (var d = !0, l = 0; l < r.length; l++) {
      var h = !0, v = r[l];
      v._timed = e.isOneDayEvent(v), (h = !_.limit_start || !_.limit_end || v.start_date.valueOf() >= _.limit_start.valueOf() && v.end_date.valueOf() <= _.limit_end.valueOf()) && (h = !e.checkInMarkedTimespan(v, i, function(m, f, c, u, p) {
        var y = !0;
        return f <= p && f >= u && ((p == 1440 || c <= p) && (y = !1), m._timed && s._drag_id && s._drag_mode == "new-size" ? (m.start_date.setHours(0), m.start_date.setMinutes(p)) : y = !1), (c >= u && c <= p || f < u && c > p) && (m._timed && s._drag_id && s._drag_mode == "new-size" ? (m.end_date.setHours(0), m.end_date.setMinutes(u)) : y = !1), y;
      })), h || (h = s.checkEvent("onLimitViolation") ? s.callEvent("onLimitViolation", [v.id, v]) : h), d = d && h;
    }
    return d || (s._drag_id = null, s._drag_mode = null), d;
  }, e._get_blocked_zones = function(a, s, _, r, d) {
    var l = [];
    if (a && a[s])
      for (var h = a[s], v = this._get_relevant_blocked_zones(_, r, h, d), m = 0; m < v.length; m++)
        l = this._add_timespan_zones(l, v[m].zones);
    return l;
  }, e._get_relevant_blocked_zones = function(a, s, _, r) {
    var d;
    return e.config.overwrite_marked_timespans ? d = _[s] && _[s][r] ? _[s][r] : _[a] && _[a][r] ? _[a][r] : [] : (d = [], _[s] && _[s][r] && (d = d.concat(_[s][r])), _[a] && _[a][r] && (d = d.concat(_[a][r]))), d;
  }, e._mark_now = function(a) {
    var s = "dhx_now_time";
    this._els[s] || (this._els[s] = []);
    var _ = e._currentDate(), r = this.config;
    if (e._remove_mark_now(), !a && r.mark_now && _ < this._max_date && _ > this._min_date && _.getHours() >= r.first_hour && _.getHours() < r.last_hour) {
      var d = this.locate_holder_day(_);
      this._els[s] = e._append_mark_now(d, _);
    }
  }, e._append_mark_now = function(a, s) {
    var _ = "dhx_now_time", r = e._get_zone_minutes(s), d = { zones: [r, r + 1], css: _, type: _ };
    if (!this._table_view) {
      if (this._props && this._props[this._mode]) {
        var l, h, v = this._props[this._mode], m = v.size || v.options.length;
        v.days > 1 ? (v.size && v.options.length && (a = (v.position + a) / v.options.length * v.size), l = a, h = a + m) : h = (l = 0) + m;
        for (var f = [], c = l; c < h; c++) {
          var u = c;
          d.days = u;
          var p = e._render_marked_timespan(d, null, u)[0];
          f.push(p);
        }
        return f;
      }
      return d.days = a, e._render_marked_timespan(d, null, a);
    }
    if (this._mode == "month")
      return d.days = +e.date.date_part(s), e._render_marked_timespan(d, null, null);
  }, e._remove_mark_now = function() {
    for (var a = "dhx_now_time", s = this._els[a], _ = 0; _ < s.length; _++) {
      var r = s[_], d = r.parentNode;
      d && d.removeChild(r);
    }
    this._els[a] = [];
  }, e._marked_timespans = { global: {} }, e._get_zone_minutes = function(a) {
    return 60 * a.getHours() + a.getMinutes();
  }, e._prepare_timespan_options = function(a) {
    var s = [], _ = [];
    if (a.days == "fullweek" && (a.days = [0, 1, 2, 3, 4, 5, 6]), a.days instanceof Array) {
      for (var r = a.days.slice(), d = 0; d < r.length; d++) {
        var l = e._lame_clone(a);
        l.days = r[d], s.push.apply(s, e._prepare_timespan_options(l));
      }
      return s;
    }
    if (!a || !(a.start_date && a.end_date && a.end_date > a.start_date || a.days !== void 0 && a.zones) && !a.type)
      return s;
    a.zones == "fullday" && (a.zones = [0, 1440]), a.zones && a.invert_zones && (a.zones = e.invertZones(a.zones)), a.id = e.uid(), a.css = a.css || "", a.type = a.type || t;
    var h = a.sections;
    if (h) {
      for (var v in h)
        if (h.hasOwnProperty(v)) {
          var m = h[v];
          for (m instanceof Array || (m = [m]), d = 0; d < m.length; d++)
            (S = e._lame_copy({}, a)).sections = {}, S.sections[v] = m[d], _.push(S);
        }
    } else
      _.push(a);
    for (var f = 0; f < _.length; f++) {
      var c = _[f], u = c.start_date, p = c.end_date;
      if (u && p)
        for (var y = e.date.date_part(new Date(u)), x = e.date.add(y, 1, "day"); y < p; ) {
          var S;
          delete (S = e._lame_copy({}, c)).start_date, delete S.end_date, S.days = y.valueOf();
          var k = u > y ? e._get_zone_minutes(u) : 0, D = p > x || p.getDate() != y.getDate() ? 1440 : e._get_zone_minutes(p);
          S.zones = [k, D], s.push(S), y = x, x = e.date.add(x, 1, "day");
        }
      else
        c.days instanceof Date && (c.days = e.date.date_part(c.days).valueOf()), c.zones = a.zones.slice(), s.push(c);
    }
    return s;
  }, e._get_dates_by_index = function(a, s, _) {
    var r = [];
    s = e.date.date_part(new Date(s || e._min_date)), _ = new Date(_ || e._max_date);
    for (var d = s.getDay(), l = a - d >= 0 ? a - d : 7 - s.getDay() + a, h = e.date.add(s, l, "day"); h < _; h = e.date.add(h, 1, "week"))
      r.push(h);
    return r;
  }, e._get_css_classes_by_config = function(a) {
    var s = [];
    return a.type == i && (s.push(i), a.css && s.push(i + "_reset")), s.push("dhx_marked_timespan", a.css), s.join(" ");
  }, e._get_block_by_config = function(a) {
    var s = document.createElement("div");
    return a.html && (typeof a.html == "string" ? s.innerHTML = a.html : s.appendChild(a.html)), s;
  }, e._render_marked_timespan = function(a, s, _) {
    var r = [], d = e.config, l = this._min_date, h = this._max_date, v = !1;
    if (!d.display_marked_timespans)
      return r;
    if (!_ && _ !== 0) {
      if (a.days < 7)
        _ = a.days;
      else {
        var m = new Date(a.days);
        if (v = +m, !(+h > +m && +l <= +m))
          return r;
        _ = m.getDay();
      }
      var f = l.getDay();
      f > _ ? _ = 7 - (f - _) : _ -= f;
    }
    var c = a.zones, u = e._get_css_classes_by_config(a);
    if (e._table_view && e._mode == "month") {
      var p = [], y = [];
      if (s)
        p.push(s), y.push(_);
      else {
        y = v ? [v] : e._get_dates_by_index(_);
        for (var x = 0; x < y.length; x++)
          p.push(this._scales[y[x]]);
      }
      for (x = 0; x < p.length; x++) {
        s = p[x], _ = y[x];
        var S = this.locate_holder_day(_, !1) % this._cols.length;
        if (!this._ignores[S]) {
          var k = e._get_block_by_config(a);
          k.className = u, k.style.top = "0px", k.style.height = "100%";
          for (var D = 0; D < c.length; D += 2) {
            var M = c[x];
            if ((E = c[x + 1]) <= M)
              return [];
            (N = k.cloneNode(!0)).style.left = "0px", N.style.width = "100%", s.appendChild(N), r.push(N);
          }
        }
      }
    } else {
      var g = _;
      if (this._ignores[this.locate_holder_day(_, !1)])
        return r;
      if (this._props && this._props[this._mode] && a.sections && a.sections[this._mode]) {
        var b = this._props[this._mode];
        g = b.order[a.sections[this._mode]];
        var w = b.order[a.sections[this._mode]];
        b.days > 1 ? g = g * (b.size || b.options.length) + w : (g = w, b.size && g > b.position + b.size && (g = 0));
      }
      for (s = s || e.locate_holder(g), x = 0; x < c.length; x += 2) {
        var E, N;
        if (M = Math.max(c[x], 60 * d.first_hour), (E = Math.min(c[x + 1], 60 * d.last_hour)) <= M) {
          if (x + 2 < c.length)
            continue;
          return [];
        }
        (N = e._get_block_by_config(a)).className = u;
        var T = 24 * this.config.hour_size_px + 1, A = 36e5;
        N.style.top = Math.round((60 * M * 1e3 - this.config.first_hour * A) * this.config.hour_size_px / A) % T + "px", N.style.height = Math.max(Math.round(60 * (E - M) * 1e3 * this.config.hour_size_px / A) % T, 1) + "px", s.appendChild(N), r.push(N);
      }
    }
    return r;
  }, e._mark_timespans = function() {
    var a = this._els.dhx_cal_data[0], s = [];
    if (e._table_view && e._mode == "month")
      for (var _ in this._scales) {
        var r = /* @__PURE__ */ new Date(+_);
        s.push.apply(s, e._on_scale_add_marker(this._scales[_], r));
      }
    else {
      r = new Date(e._min_date);
      for (var d = 0, l = a.childNodes.length; d < l; d++) {
        var h = a.childNodes[d];
        h.firstChild && e._getClassName(h.firstChild).indexOf("dhx_scale_hour") > -1 || (s.push.apply(s, e._on_scale_add_marker(h, r)), r = e.date.add(r, 1, "day"));
      }
    }
    return s;
  }, e.markTimespan = function(a) {
    if (!this._els)
      throw new Error("`scheduler.markTimespan` can't be used before scheduler initialization. Place `scheduler.markTimespan` call after `scheduler.init`.");
    var s = !1;
    this._els.dhx_cal_data || (e.get_elements(), s = !0);
    var _ = e._marked_timespans_ids, r = e._marked_timespans_types, d = e._marked_timespans;
    e.deleteMarkedTimespan(), e.addMarkedTimespan(a);
    var l = e._mark_timespans();
    return s && (e._els = []), e._marked_timespans_ids = _, e._marked_timespans_types = r, e._marked_timespans = d, l;
  }, e.unmarkTimespan = function(a) {
    if (a)
      for (var s = 0; s < a.length; s++) {
        var _ = a[s];
        _.parentNode && _.parentNode.removeChild(_);
      }
  }, e._addMarkerTimespanConfig = function(a) {
    var s = "global", _ = e._marked_timespans, r = a.id, d = e._marked_timespans_ids;
    d[r] || (d[r] = []);
    var l = a.days, h = a.sections, v = a.type;
    if (a.id = r, h) {
      for (var m in h)
        if (h.hasOwnProperty(m)) {
          _[m] || (_[m] = {});
          var f = h[m], c = _[m];
          c[f] || (c[f] = {}), c[f][l] || (c[f][l] = {}), c[f][l][v] || (c[f][l][v] = [], e._marked_timespans_types || (e._marked_timespans_types = {}), e._marked_timespans_types[v] || (e._marked_timespans_types[v] = !0));
          var u = c[f][l][v];
          a._array = u, u.push(a), d[r].push(a);
        }
    } else
      _[s][l] || (_[s][l] = {}), _[s][l][v] || (_[s][l][v] = []), e._marked_timespans_types || (e._marked_timespans_types = {}), e._marked_timespans_types[v] || (e._marked_timespans_types[v] = !0), u = _[s][l][v], a._array = u, u.push(a), d[r].push(a);
  }, e._marked_timespans_ids = {}, e.addMarkedTimespan = function(a) {
    var s = e._prepare_timespan_options(a);
    if (s.length) {
      for (var _ = s[0].id, r = 0; r < s.length; r++)
        e._addMarkerTimespanConfig(s[r]);
      return _;
    }
  }, e._add_timespan_zones = function(a, s) {
    var _ = a.slice();
    if (s = s.slice(), !_.length)
      return s;
    for (var r = 0; r < _.length; r += 2)
      for (var d = _[r], l = _[r + 1], h = r + 2 == _.length, v = 0; v < s.length; v += 2) {
        var m = s[v], f = s[v + 1];
        if (f > l && m <= l || m < d && f >= d)
          _[r] = Math.min(d, m), _[r + 1] = Math.max(l, f), r -= 2;
        else {
          if (!h)
            continue;
          var c = d > m ? 0 : 2;
          _.splice(r + c, 0, m, f);
        }
        s.splice(v--, 2);
        break;
      }
    return _;
  }, e._subtract_timespan_zones = function(a, s) {
    for (var _ = a.slice(), r = 0; r < _.length; r += 2)
      for (var d = _[r], l = _[r + 1], h = 0; h < s.length; h += 2) {
        var v = s[h], m = s[h + 1];
        if (m > d && v < l) {
          var f = !1;
          d >= v && l <= m && _.splice(r, 2), d < v && (_.splice(r, 2, d, v), f = !0), l > m && _.splice(f ? r + 2 : r, f ? 0 : 2, m, l), r -= 2;
          break;
        }
      }
    return _;
  }, e.invertZones = function(a) {
    return e._subtract_timespan_zones([0, 1440], a.slice());
  }, e._delete_marked_timespan_by_id = function(a) {
    var s = e._marked_timespans_ids[a];
    if (s) {
      for (var _ = 0; _ < s.length; _++)
        for (var r = s[_], d = r._array, l = 0; l < d.length; l++)
          if (d[l] == r) {
            d.splice(l, 1);
            break;
          }
    }
  }, e._delete_marked_timespan_by_config = function(a) {
    var s, _ = e._marked_timespans, r = a.sections, d = a.days, l = a.type || t;
    if (r) {
      for (var h in r)
        if (r.hasOwnProperty(h) && _[h]) {
          var v = r[h];
          _[h][v] && (s = _[h][v]);
        }
    } else
      s = _.global;
    if (s) {
      if (d !== void 0)
        s[d] && s[d][l] && (e._addMarkerTimespanConfig(a), e._delete_marked_timespans_list(s[d][l], a));
      else
        for (var m in s)
          if (s[m][l]) {
            var f = e._lame_clone(a);
            a.days = m, e._addMarkerTimespanConfig(f), e._delete_marked_timespans_list(s[m][l], a);
          }
    }
  }, e._delete_marked_timespans_list = function(a, s) {
    for (var _ = 0; _ < a.length; _++) {
      var r = a[_], d = e._subtract_timespan_zones(r.zones, s.zones);
      if (d.length)
        r.zones = d;
      else {
        a.splice(_, 1), _--;
        for (var l = e._marked_timespans_ids[r.id], h = 0; h < l.length; h++)
          if (l[h] == r) {
            l.splice(h, 1);
            break;
          }
      }
    }
  }, e.deleteMarkedTimespan = function(a) {
    if (arguments.length || (e._marked_timespans = { global: {} }, e._marked_timespans_ids = {}, e._marked_timespans_types = {}), typeof a != "object")
      e._delete_marked_timespan_by_id(a);
    else {
      a.start_date && a.end_date || (a.days !== void 0 || a.type || (a.days = "fullweek"), a.zones || (a.zones = "fullday"));
      var s = [];
      if (a.type)
        s.push(a.type);
      else
        for (var _ in e._marked_timespans_types)
          s.push(_);
      for (var r = e._prepare_timespan_options(a), d = 0; d < r.length; d++)
        for (var l = r[d], h = 0; h < s.length; h++) {
          var v = e._lame_clone(l);
          v.type = s[h], e._delete_marked_timespan_by_config(v);
        }
    }
  }, e._get_types_to_render = function(a, s) {
    var _ = a ? e._lame_copy({}, a) : {};
    for (var r in s || {})
      s.hasOwnProperty(r) && (_[r] = s[r]);
    return _;
  }, e._get_configs_to_render = function(a) {
    var s = [];
    for (var _ in a)
      a.hasOwnProperty(_) && s.push.apply(s, a[_]);
    return s;
  }, e._on_scale_add_marker = function(a, s) {
    if (!e._table_view || e._mode == "month") {
      var _ = s.getDay(), r = s.valueOf(), d = this._mode, l = e._marked_timespans, h = [], v = [];
      if (this._props && this._props[d]) {
        var m = this._props[d], f = m.options, c = f[e._get_unit_index(m, s)];
        if (m.days > 1) {
          var u = Math.round((s - e._min_date) / 864e5), p = m.size || f.length;
          s = e.date.add(e._min_date, Math.floor(u / p), "day"), s = e.date.date_part(s);
        } else
          s = e.date.date_part(new Date(this._date));
        if (_ = s.getDay(), r = s.valueOf(), l[d] && l[d][c.key]) {
          var y = l[d][c.key], x = e._get_types_to_render(y[_], y[r]);
          h.push.apply(h, e._get_configs_to_render(x));
        }
      }
      var S = l.global;
      if (e.config.overwrite_marked_timespans) {
        var k = S[r] || S[_];
        h.push.apply(h, e._get_configs_to_render(k));
      } else
        S[r] && h.push.apply(h, e._get_configs_to_render(S[r])), S[_] && h.push.apply(h, e._get_configs_to_render(S[_]));
      for (var D = 0; D < h.length; D++)
        v.push.apply(v, e._render_marked_timespan(h[D], a, s));
      return v;
    }
  }, e.attachEvent("onScaleAdd", function() {
    e._on_scale_add_marker.apply(e, arguments);
  }), e.dblclick_dhx_marked_timespan = function(a, s) {
    e.callEvent("onScaleDblClick", [e.getActionData(a).date, s, a]), e.config.dblclick_create && e.addEventNow(e.getActionData(a).date, null, a);
  };
}
function Nt(e) {
  var i = {}, t = !1;
  function n(r, d) {
    d = typeof d == "function" ? d : function() {
    }, i[r] || (i[r] = this[r], this[r] = d);
  }
  function o(r) {
    i[r] && (this[r] = i[r], i[r] = null);
  }
  function a(r) {
    for (var d in r)
      n.call(this, d, r[d]);
  }
  function s() {
    for (var r in i)
      o.call(this, r);
  }
  function _(r) {
    try {
      r();
    } catch (d) {
      window.console.error(d);
    }
  }
  return e.$stateProvider.registerProvider("batchUpdate", function() {
    return { batch_update: t };
  }, !1), function(r, d) {
    if (t)
      return void _(r);
    var l, h = this._dp && this._dp.updateMode != "off";
    h && (l = this._dp.updateMode, this._dp.setUpdateMode("off"));
    const v = { setModeDate: { date: null, mode: null }, needRender: !1, needUpdateView: !1, repaintEvents: {} }, m = (c, u) => {
      c && (v.setModeDate.date = c), u && (v.setModeDate.mode = u);
    };
    var f = { render: (c, u) => {
      v.needRender = !0, m(c, u);
    }, setCurrentView: (c, u) => {
      v.needRender = !0, m(c, u);
    }, updateView: (c, u) => {
      v.needUpdateView = !0, m(c, u);
    }, render_data: () => v.needRender = !0, render_view_data: (c) => {
      c && c.length ? c.forEach((u) => v.repaintEvents[u.id] = !0) : v.needRender = !0;
    } };
    if (a.call(this, f), t = !0, this.callEvent("onBeforeBatchUpdate", []), _(r), this.callEvent("onAfterBatchUpdate", []), s.call(this), t = !1, !d)
      if (v.needRender)
        e.render(v.setModeDate.date, v.setModeDate.mode);
      else if (v.needUpdateView)
        e.updateView(v.setModeDate.date, v.setModeDate.mode);
      else
        for (const c in v.repaintEvents)
          e.updateEvent(c);
    h && (this._dp.setUpdateMode(l), this._dp.sendData());
  };
}
class Tt {
  constructor(i) {
    const { url: t, token: n } = i;
    this._url = t, this._token = n, this._mode = 1, this._seed = 1, this._queue = [], this.data = {}, this.api = {}, this._events = {};
  }
  headers() {
    return { Accept: "application/json", "Content-Type": "application/json", "Remote-Token": this._token };
  }
  fetch(i, t) {
    const n = { credentials: "include", headers: this.headers() };
    return t && (n.method = "POST", n.body = t), fetch(i, n).then((o) => o.json());
  }
  load(i) {
    return i && (this._url = i), this.fetch(this._url).then((t) => this.parse(t));
  }
  parse(i) {
    const { key: t, websocket: n } = i;
    t && (this._token = i.key);
    for (const o in i.data)
      this.data[o] = i.data[o];
    for (const o in i.api) {
      const a = this.api[o] = {}, s = i.api[o];
      for (const _ in s)
        a[_] = this._wrapper(o + "." + _);
    }
    return n && this.connect(), this;
  }
  connect() {
    const i = this._socket;
    i && (this._socket = null, i.onclose = function() {
    }, i.close()), this._mode = 2, this._socket = function(t, n, o, a) {
      let s = n;
      s[0] === "/" && (s = document.location.protocol + "//" + document.location.host + n), s = s.replace(/^http(s|):/, "ws$1:");
      const _ = s.indexOf("?") != -1 ? "&" : "?";
      s = `${s}${_}token=${o}&ws=1`;
      const r = new WebSocket(s);
      return r.onclose = () => setTimeout(() => t.connect(), 2e3), r.onmessage = (d) => {
        const l = JSON.parse(d.data);
        switch (l.action) {
          case "result":
            t.result(l.body, []);
            break;
          case "event":
            t.fire(l.body.name, l.body.value);
            break;
          case "start":
            a();
            break;
          default:
            t.onError(l.data);
        }
      }, r;
    }(this, this._url, this._token, () => (this._mode = 3, this._send(), this._resubscribe(), this));
  }
  _wrapper(i) {
    return (function() {
      const t = [].slice.call(arguments);
      let n = null;
      const o = new Promise((a, s) => {
        n = { data: { id: this._uid(), name: i, args: t }, status: 1, resolve: a, reject: s }, this._queue.push(n);
      });
      return this.onCall(n, o), this._mode === 3 ? this._send(n) : setTimeout(() => this._send(), 1), o;
    }).bind(this);
  }
  _uid() {
    return (this._seed++).toString();
  }
  _send(i) {
    if (this._mode == 2)
      return void setTimeout(() => this._send(), 100);
    const t = i ? [i] : this._queue.filter((o) => o.status === 1);
    if (!t.length)
      return;
    const n = t.map((o) => (o.status = 2, o.data));
    this._mode !== 3 ? this.fetch(this._url, JSON.stringify(n)).catch((o) => this.onError(o)).then((o) => this.result(o, n)) : this._socket.send(JSON.stringify({ action: "call", body: n }));
  }
  result(i, t) {
    const n = {};
    if (i)
      for (let o = 0; o < i.length; o++)
        n[i[o].id] = i[o];
    else
      for (let o = 0; o < t.length; o++)
        n[t[o].id] = { id: t[o].id, error: "Network Error", data: null };
    for (let o = this._queue.length - 1; o >= 0; o--) {
      const a = this._queue[o], s = n[a.data.id];
      s && (this.onResponse(a, s), s.error ? a.reject(s.error) : a.resolve(s.data), this._queue.splice(o, 1));
    }
  }
  on(i, t) {
    const n = this._uid();
    let o = this._events[i];
    const a = !!o;
    return a || (o = this._events[i] = []), o.push({ id: n, handler: t }), a || this._mode != 3 || this._socket.send(JSON.stringify({ action: "subscribe", name: i })), { name: i, id: n };
  }
  _resubscribe() {
    if (this._mode == 3)
      for (const i in this._events)
        this._socket.send(JSON.stringify({ action: "subscribe", name: i }));
  }
  detach(i) {
    if (!i) {
      if (this._mode == 3)
        for (const a in this._events)
          this._socket.send(JSON.stringify({ action: "unsubscribe", key: a }));
      return void (this._events = {});
    }
    const { id: t, name: n } = i, o = this._events[n];
    if (o) {
      const a = o.filter((s) => s.id != t);
      a.length ? this._events[n] = a : (delete this._events[n], this._mode == 3 && this._socket.send(JSON.stringify({ action: "unsubscribe", name: n })));
    }
  }
  fire(i, t) {
    const n = this._events[i];
    if (n)
      for (let o = 0; o < n.length; o++)
        n[o].handler(t);
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
    const n = new Tt({ url: i, token: t });
    n.fetch = function(o, a) {
      const s = { headers: this.headers() };
      return a && (s.method = "POST", s.body = a), fetch(o, s).then((_) => _.json());
    }, this._ready = n.load().then((o) => this._remote = o);
  }
  ready() {
    return this._ready;
  }
  on(i, t) {
    this.ready().then((n) => {
      if (typeof i == "string")
        n.on(i, t);
      else
        for (const o in i)
          n.on(o, i[o]);
    });
  }
}
function Ct(e) {
  function i(n, o) {
    switch (n) {
      case "add-event":
        (function(a) {
          if (e.getEvent(a.id))
            return void console.warn(`Event with ID ${a.id} already exists. Skipping add.`);
          a.start_date = e.templates.parse_date(a.start_date), a.end_date = e.templates.parse_date(a.end_date), a.original_start && (a.original_start = e.templates.parse_date(a.original_start)), t(() => {
            e.addEvent(a);
          });
        })(o);
        break;
      case "update-event":
        (function(a) {
          const s = a.id;
          if (!e.getEvent(s))
            return void console.warn(`Event with ID ${s} does not exist. Skipping update.`);
          const _ = e.getEvent(s);
          t(() => {
            for (let r in a)
              r !== "start_date" && r !== "end_date" && (_[r] = a[r]);
            _.start_date = e.templates.parse_date(a.start_date), _.end_date = e.templates.parse_date(a.end_date), a.original_start && (a.original_start = e.templates.parse_date(a.original_start)), e.callEvent("onEventChanged", [s, _]), e.updateEvent(s), s !== a.id && e.changeEventId(s, a.id);
          });
        })(o);
        break;
      case "delete-event":
        (function(a) {
          const s = a.id;
          if (!e.getEvent(s))
            return void (a.event_pid && t(() => {
              e.addEvent(a);
            }));
          t(() => {
            const _ = e.getEvent(s);
            if (_) {
              if (_.rec_type || _.rrule) {
                e._roll_back_dates(_);
                const r = e._get_rec_markers(s);
                for (const d in r)
                  e.getEvent(d) && e.deleteEvent(d, !0);
              }
              if (e.getState().lightbox_id == s && (this._new_event = this._lightbox_id, a.id = this._lightbox_id, this._events[this._lightbox_id] = a, e.callEvent("onLiveUpdateCollision", [s, null, "delete", a]) === !1))
                return void e.endLightbox(!1, e._lightbox);
              e.deleteEvent(s, !0);
            }
          });
        })(o);
    }
  }
  function t(n) {
    e._dp ? e._dp.ignore(n) : n();
  }
  return { events: function(n) {
    if (!n || !n.event || !n.event.id)
      return void console.error("Invalid message format:", n);
    const { type: o, event: a } = n;
    if (!e._dp._in_progress[a.id]) {
      if (o === "add-event") {
        for (const s in e._dp._in_progress)
          if (e._dp.getState(s) === "inserted")
            return void e._dp.attachEvent("onFullSync", function() {
              e.getEvent(a.id) || i(o, a);
            }, { once: !0 });
      }
      i(o, a);
    }
  } };
}
function Ot(e) {
  (function(i) {
    const t = {};
    i.attachEvent("onConfirmedBeforeEventDelete", function(n) {
      return t[n] = !0, !0;
    }), i.attachEvent("onEventDeleted", function(n, o) {
      if (!t[n])
        return;
      delete t[n];
      let a = i.copy(o);
      i.config.undo_deleted && !i.getState().new_event && i.message({ text: `<div class="dhx_info_message">
                            <span class="undo_popup_text">Event deleted</span>
                            <button class="undo_button" data-deleted-event-id="${o.id}">Undo</button>
                        </div>`, expire: 1e4, type: "popup_after_delete", callback: function(s) {
        s.target.closest(`[data-deleted-event-id="${o.id}"]`) && (a.rrule && a.duration && (a.end_date = new Date(a.start_date.valueOf() + 1e3 * a.duration), i.addEvent(a)), i.addEvent(a), i.render());
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
const re = { uid: function() {
  return Lt++;
}, mixin: function(e, i, t) {
  for (var n in i)
    (e[n] === void 0 || t) && (e[n] = i[n]);
  return e;
}, copy: function e(i) {
  var t, n, o;
  if (i && typeof i == "object")
    switch (!0) {
      case Te(i):
        n = new Date(i);
        break;
      case (o = i, Array.isArray ? Array.isArray(o) : o && o.length !== void 0 && o.pop && o.push):
        for (n = new Array(i.length), t = 0; t < i.length; t++)
          n[t] = e(i[t]);
        break;
      case function(a) {
        return a && typeof a == "object" && Function.prototype.toString.call(a.constructor) === "function String() { [native code] }";
      }(i):
        n = new String(i);
        break;
      case function(a) {
        return a && typeof a == "object" && Function.prototype.toString.call(a.constructor) === "function Number() { [native code] }";
      }(i):
        n = new Number(i);
        break;
      case function(a) {
        return a && typeof a == "object" && Function.prototype.toString.call(a.constructor) === "function Boolean() { [native code] }";
      }(i):
        n = new Boolean(i);
        break;
      default:
        for (t in n = {}, i) {
          const a = typeof i[t];
          a === "string" || a === "number" || a === "boolean" ? n[t] = i[t] : Te(i[t]) ? n[t] = new Date(i[t]) : Object.prototype.hasOwnProperty.apply(i, [t]) && (n[t] = e(i[t]));
        }
    }
  return n || i;
}, defined: function(e) {
  return e !== void 0;
}, isDate: Te, delay: function(e, i) {
  var t, n = function() {
    n.$cancelTimeout(), n.$pending = !0;
    var o = Array.prototype.slice.call(arguments);
    t = setTimeout(function() {
      e.apply(this, o), n.$pending = !1;
    }, i);
  };
  return n.$pending = !1, n.$cancelTimeout = function() {
    clearTimeout(t), n.$pending = !1;
  }, n.$execute = function() {
    var o = Array.prototype.slice.call(arguments);
    e.apply(this, o), n.$cancelTimeout();
  }, n;
} };
function $t(e) {
  function i(f) {
    var c = document.createElement("div");
    return (f || "").split(" ").forEach(function(u) {
      c.classList.add(u);
    }), c;
  }
  var t = function() {
    return i("dhx_cal_navbar_rows_container");
  }, n = function() {
    return i("dhx_cal_navbar_row");
  }, o = function(f) {
    var c = i("dhx_cal_tab");
    return c.setAttribute("name", f.view + "_tab"), c.setAttribute("data-tab", f.view), e.config.fix_tab_position && (f.$firstTab ? c.classList.add("dhx_cal_tab_first") : f.$lastTab ? c.classList.add("dhx_cal_tab_last") : f.view !== "week" && c.classList.add("dhx_cal_tab_standalone"), f.$segmentedTab && c.classList.add("dhx_cal_tab_segmented")), c;
  }, a = function() {
    return i("dhx_cal_date");
  }, s = function(f) {
    return i("dhx_cal_nav_button dhx_cal_nav_button_custom dhx_cal_tab");
  }, _ = function(f) {
    return i("dhx_cal_" + f.view + "_button dhx_cal_nav_button");
  }, r = function() {
    return i("dhx_cal_line_spacer");
  }, d = function(f) {
    var c = i("dhx_minical_icon");
    return f.click || c.$_eventAttached || e.event(c, "click", function() {
      e.isCalendarVisible() ? e.destroyCalendar() : e.renderCalendar({ position: this, date: e.getState().date, navigation: !0, handler: function(u, p) {
        e.setCurrentView(u), e.destroyCalendar();
      } });
    }), c;
  };
  function l(f) {
    var c = function(y) {
      var x;
      if (y.view)
        switch (y.view) {
          case "today":
          case "next":
          case "prev":
            x = _;
            break;
          case "date":
            x = a;
            break;
          case "spacer":
            x = r;
            break;
          case "button":
            x = s;
            break;
          case "minicalendar":
            x = d;
            break;
          default:
            x = o;
        }
      else
        y.rows ? x = t : y.cols && (x = n);
      return x;
    }(f);
    if (c) {
      var u = c(f);
      if (f.css && u.classList.add(f.css), f.width && ((p = f.width) === 1 * p && (p += "px"), u.style.width = p), f.height && ((p = f.height) === 1 * p && (p += "px"), u.style.height = p), f.click && e.event(u, "click", f.click), f.html && (u.innerHTML = f.html), f.align) {
        var p = "";
        f.align == "right" ? p = "flex-end" : f.align == "left" && (p = "flex-start"), u.style.justifyContent = p;
      }
      return u;
    }
  }
  function h(f) {
    return typeof f == "string" && (f = { view: f }), f.view || f.rows || f.cols || (f.view = "button"), f;
  }
  function v(f) {
    var c, u = document.createDocumentFragment();
    c = Array.isArray(f) ? f : [f];
    for (var p = 0; p < c.length; p++) {
      var y, x = h(c[p]);
      x.view === "day" && c[p + 1] && ((y = h(c[p + 1])).view !== "week" && y.view !== "month" || (x.$firstTab = !0, x.$segmentedTab = !0)), x.view === "week" && c[p - 1] && ((y = h(c[p + 1])).view !== "week" && y.view !== "month" || (x.$segmentedTab = !0)), x.view === "month" && c[p - 1] && ((y = h(c[p - 1])).view !== "week" && y.view !== "day" || (x.$lastTab = !0, x.$segmentedTab = !0));
      var S = l(x);
      u.appendChild(S), (x.cols || x.rows) && S.appendChild(v(x.cols || x.rows));
    }
    return u;
  }
  e._init_nav_bar = function(f) {
    var c = this.$container.querySelector(".dhx_cal_navline");
    return c || ((c = document.createElement("div")).className = "dhx_cal_navline dhx_cal_navline_flex", e._update_nav_bar(f, c), c);
  };
  var m = null;
  e._update_nav_bar = function(f, c) {
    if (f) {
      var u = !1, p = f.height || e.xy.nav_height;
      m !== null && m === p || (u = !0), u && (e.xy.nav_height = p), c.innerHTML = "", c.appendChild(v(f)), e.unset_actions(), e._els = [], e.get_elements(), e.set_actions(), c.style.display = p === 0 ? "none" : "", m = p;
    }
  };
}
function Ht(e) {
  function i(a) {
    return a.isConnected !== void 0 ? a.isConnected : document.body.contains(a);
  }
  function t(a) {
    return { w: a.innerWidth || document.documentElement.clientWidth, h: a.innerHeight || document.documentElement.clientHeight };
  }
  function n(a, s) {
    var _, r = t(s);
    a.event(s, "resize", function() {
      clearTimeout(_), _ = setTimeout(function() {
        if (i(a.$container) && !a.$destroyed) {
          var d, l, h = t(s);
          l = h, ((d = r).w != l.w || d.h != l.h) && (r = h, o(a));
        }
      }, 150);
    });
  }
  function o(a) {
    a.$initialized && !a.$destroyed && a.$root && i(a.$root) && a.callEvent("onSchedulerResize", []) && (a.updateView(), a.callEvent("onAfterSchedulerResize", []));
  }
  (function(a) {
    var s = a.$container;
    if (window.getComputedStyle(s).getPropertyValue("position") == "static" && (s.style.position = "relative"), window.ResizeObserver) {
      let r = !0;
      const d = new ResizeObserver(function(l) {
        r ? r = !1 : o(a);
      });
      d.observe(s), a.attachEvent("onDestroy", function() {
        d.unobserve(s);
      });
    } else {
      var _ = document.createElement("iframe");
      _.className = "scheduler_container_resize_watcher", _.tabIndex = -1, a.config.wai_aria_attributes && (_.setAttribute("role", "none"), _.setAttribute("aria-hidden", !0)), window.Sfdc || window.$A || window.Aura ? function(r) {
        var d = r.$root.offsetHeight, l = r.$root.offsetWidth;
        (function h() {
          r.$destroyed || (r.$root && (r.$root.offsetHeight == d && r.$root.offsetWidth == l || o(r), d = r.$root.offsetHeight, l = r.$root.offsetWidth), setTimeout(h, 200));
        })();
      }(a) : (s.appendChild(_), _.contentWindow ? n(a, _.contentWindow) : (s.removeChild(_), n(a, window)));
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
  e.attachEvent = function(t, n, o) {
    t = "ev_" + t.toLowerCase(), i.listeners[t] || (i.listeners[t] = function(s) {
      let _ = {}, r = 0;
      const d = function() {
        let l = !0;
        for (const h in _) {
          const v = _[h].apply(s, arguments);
          l = l && v;
        }
        return l;
      };
      return d.addEvent = function(l, h) {
        if (typeof l == "function") {
          let v;
          if (h && h.id ? v = h.id : (v = r, r++), h && h.once) {
            const m = l;
            l = function() {
              m(), d.removeEvent(v);
            };
          }
          return _[v] = l, v;
        }
        return !1;
      }, d.removeEvent = function(l) {
        delete _[l];
      }, d.clear = function() {
        _ = {};
      }, d;
    }(this)), o && o.thisObject && (n = n.bind(o.thisObject));
    let a = t + ":" + i.listeners[t].addEvent(n, o);
    return o && o.id && (a = o.id), a;
  }, e.attachAll = function(t) {
    this.attachEvent("listen_all", t);
  }, e.callEvent = function(t, n) {
    if (i._silent_mode)
      return !0;
    const o = "ev_" + t.toLowerCase(), a = i.listeners;
    return a.ev_listen_all && a.ev_listen_all.apply(this, [t].concat(n)), !a[o] || a[o].apply(this, n);
  }, e.checkEvent = function(t) {
    return !!i.listeners["ev_" + t.toLowerCase()];
  }, e.detachEvent = function(t) {
    if (t) {
      let n = i.listeners;
      for (const a in n)
        n[a].removeEvent(t);
      const o = t.split(":");
      if (n = i.listeners, o.length === 2) {
        const a = o[0], s = o[1];
        n[a] && n[a].removeEvent(s);
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
    var t = function(n, o) {
      n = n || Ke.event, o = o || Ke.eventRemove;
      var a = [], s = { attach: function(_, r, d, l) {
        a.push({ element: _, event: r, callback: d, capture: l }), n(_, r, d, l);
      }, detach: function(_, r, d, l) {
        o(_, r, d, l);
        for (var h = 0; h < a.length; h++) {
          var v = a[h];
          v.element === _ && v.event === r && v.callback === d && v.capture === l && (a.splice(h, 1), h--);
        }
      }, detachAll: function() {
        for (var _ = a.slice(), r = 0; r < _.length; r++) {
          var d = _[r];
          s.detach(d.element, d.event, d.callback, d.capture), s.detach(d.element, d.event, d.callback, void 0), s.detach(d.element, d.event, d.callback, !1), s.detach(d.element, d.event, d.callback, !0);
        }
        a.splice(0, a.length);
      }, extend: function() {
        return t(this.event, this.eventRemove);
      } };
      return s;
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
  for (var n = e.target || e.srcElement, o = ""; n; ) {
    if (o = ft(n)) {
      var a = o.indexOf(i);
      if (a >= 0) {
        if (!t)
          return n;
        var s = a === 0 || !(o.charAt(a - 1) || "").trim(), _ = a + i.length >= o.length || !o.charAt(a + i.length).trim();
        if (s && _)
          return n;
      }
    }
    n = n.parentNode;
  }
  return null;
}
function jt(e) {
  var i = !1, t = !1;
  if (window.getComputedStyle) {
    var n = window.getComputedStyle(e, null);
    i = n.display, t = n.visibility;
  } else
    e.currentStyle && (i = e.currentStyle.display, t = e.currentStyle.visibility);
  var o = !1, a = pt({ target: e }, "dhx_form_repeat", !1);
  return a && (o = a.style.height == "0px"), o = o || !e.offsetHeight, i != "none" && t != "hidden" && !o;
}
function It(e) {
  return !isNaN(e.getAttribute("tabindex")) && 1 * e.getAttribute("tabindex") >= 0;
}
function Rt(e) {
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
const ue = { getAbsoluteLeft: function(e) {
  return this.getOffset(e).left;
}, getAbsoluteTop: function(e) {
  return this.getOffset(e).top;
}, getOffsetSum: function(e) {
  for (var i = 0, t = 0; e; )
    i += parseInt(e.offsetTop), t += parseInt(e.offsetLeft), e = e.offsetParent;
  return { top: i, left: t };
}, getOffsetRect: function(e) {
  var i = e.getBoundingClientRect(), t = 0, n = 0;
  if (/Mobi/.test(navigator.userAgent)) {
    var o = document.createElement("div");
    o.style.position = "absolute", o.style.left = "0px", o.style.top = "0px", o.style.width = "1px", o.style.height = "1px", document.body.appendChild(o);
    var a = o.getBoundingClientRect();
    t = i.top - a.top, n = i.left - a.left, o.parentNode.removeChild(o);
  } else {
    var s = document.body, _ = document.documentElement, r = window.pageYOffset || _.scrollTop || s.scrollTop, d = window.pageXOffset || _.scrollLeft || s.scrollLeft, l = _.clientTop || s.clientTop || 0, h = _.clientLeft || s.clientLeft || 0;
    t = i.top + r - l, n = i.left + d - h;
  }
  return { top: Math.round(t), left: Math.round(n) };
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
  for (var i = e.querySelectorAll(["a[href]", "area[href]", "input", "select", "textarea", "button", "iframe", "object", "embed", "[tabindex]", "[contenteditable]"].join(", ")), t = Array.prototype.slice.call(i, 0), n = 0; n < t.length; n++)
    t[n].$position = n;
  for (t.sort(function(a, s) {
    return a.tabIndex === 0 && s.tabIndex !== 0 ? 1 : a.tabIndex !== 0 && s.tabIndex === 0 ? -1 : a.tabIndex === s.tabIndex ? a.$position - s.$position : a.tabIndex < s.tabIndex ? -1 : 1;
  }), n = 0; n < t.length; n++) {
    var o = t[n];
    (It(o) || Pt(o) || Rt(o)) && jt(o) || (t.splice(n, 1), n--);
  }
  return t;
}, getClassName: ft, locateCss: pt, getRootNode: Ge, hasShadowParent: function(e) {
  return !!Ge(e);
}, isShadowDomSupported: vt, getActiveElement: function() {
  var e = document.activeElement;
  return e.shadowRoot && (e = e.shadowRoot.activeElement), e === document.body && document.getSelection && (e = document.getSelection().focusNode || document.body), e;
}, getRelativeEventPosition: function(e, i) {
  var t = document.documentElement, n = function(o) {
    var a = 0, s = 0, _ = 0, r = 0;
    if (o.getBoundingClientRect) {
      var d = o.getBoundingClientRect(), l = document.body, h = document.documentElement || document.body.parentNode || document.body, v = window.pageYOffset || h.scrollTop || l.scrollTop, m = window.pageXOffset || h.scrollLeft || l.scrollLeft, f = h.clientTop || l.clientTop || 0, c = h.clientLeft || l.clientLeft || 0;
      a = d.top + v - f, s = d.left + m - c, _ = document.body.offsetWidth - d.right, r = document.body.offsetHeight - d.bottom;
    } else {
      for (; o; )
        a += parseInt(o.offsetTop, 10), s += parseInt(o.offsetLeft, 10), o = o.offsetParent;
      _ = document.body.offsetWidth - o.offsetWidth - s, r = document.body.offsetHeight - o.offsetHeight - a;
    }
    return { y: Math.round(a), x: Math.round(s), width: o.offsetWidth, height: o.offsetHeight, right: Math.round(_), bottom: Math.round(r) };
  }(i);
  return { x: e.clientX - t.clientLeft - n.x + i.scrollLeft, y: e.clientY - t.clientTop - n.y + i.scrollTop };
}, getTargetNode: function(e) {
  var i;
  return e.tagName ? i = e : (i = (e = e || window.event).target || e.srcElement).shadowRoot && e.composedPath && (i = e.composedPath()[0]), i;
}, getNodePosition: function(e) {
  var i = 0, t = 0, n = 0, o = 0;
  if (e.getBoundingClientRect) {
    var a = e.getBoundingClientRect(), s = document.body, _ = document.documentElement || document.body.parentNode || document.body, r = window.pageYOffset || _.scrollTop || s.scrollTop, d = window.pageXOffset || _.scrollLeft || s.scrollLeft, l = _.clientTop || s.clientTop || 0, h = _.clientLeft || s.clientLeft || 0;
    i = a.top + r - l, t = a.left + d - h, n = document.body.offsetWidth - a.right, o = document.body.offsetHeight - a.bottom;
  } else {
    for (; e; )
      i += parseInt(e.offsetTop, 10), t += parseInt(e.offsetLeft, 10), e = e.offsetParent;
    n = document.body.offsetWidth - e.offsetWidth - t, o = document.body.offsetHeight - e.offsetHeight - i;
  }
  return { y: Math.round(i), x: Math.round(t), width: e.offsetWidth, height: e.offsetHeight, right: Math.round(n), bottom: Math.round(o) };
} };
var $e;
if (Element.prototype.closest)
  $e = function(e, i) {
    return e.closest(i);
  };
else {
  var Yt = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  $e = function(e, i) {
    var t = e;
    do {
      if (Yt.call(t, i))
        return t;
      t = t.parentElement || t.parentNode;
    } while (t !== null && t.nodeType === 1);
    return null;
  };
}
var ce = typeof window < "u";
const Ut = { isIE: ce && (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0), isOpera: ce && navigator.userAgent.indexOf("Opera") >= 0, isChrome: ce && navigator.userAgent.indexOf("Chrome") >= 0, isKHTML: ce && (navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0), isFF: ce && navigator.userAgent.indexOf("Firefox") >= 0, isIPad: ce && navigator.userAgent.search(/iPad/gi) >= 0, isEdge: ce && navigator.userAgent.indexOf("Edge") != -1, isNode: !ce || typeof navigator > "u" };
function Ae(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
  var i = "";
  for (var t in e) {
    var n = "";
    e.hasOwnProperty(t) && (n = t + "=" + (n = typeof e[t] == "string" ? encodeURIComponent(e[t]) : typeof e[t] == "number" ? e[t] : encodeURIComponent(JSON.stringify(e[t]))), i.length && (n = "&" + n), i += n);
  }
  return i;
}
function Vt(e) {
  var i = function(a, s) {
    for (var _ = "var temp=date.match(/[a-zA-Z]+|[0-9]+/g);", r = a.match(/%[a-zA-Z]/g), d = 0; d < r.length; d++)
      switch (r[d]) {
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
    return s && (l = " Date.UTC(" + l + ")"), new Function("date", "var set=[0,0,1,0,0,0]; " + _ + " return new Date(" + l + ");");
  }, t = function(a, s) {
    const _ = a.match(/%[a-zA-Z]/g);
    return function(r) {
      for (var d = [0, 0, 1, 0, 0, 0], l = r.match(/[a-zA-Z]+|[0-9]+/g), h = 0; h < _.length; h++)
        switch (_[h]) {
          case "%j":
          case "%d":
            d[2] = l[h] || 1;
            break;
          case "%n":
          case "%m":
            d[1] = (l[h] || 1) - 1;
            break;
          case "%y":
            d[0] = 1 * l[h] + (l[h] > 50 ? 1900 : 2e3);
            break;
          case "%g":
          case "%G":
          case "%h":
          case "%H":
            d[3] = l[h] || 0;
            break;
          case "%i":
            d[4] = l[h] || 0;
            break;
          case "%Y":
            d[0] = l[h] || 0;
            break;
          case "%a":
          case "%A":
            d[3] = d[3] % 12 + ((l[h] || "").toLowerCase() == "am" ? 0 : 12);
            break;
          case "%s":
            d[5] = l[h] || 0;
            break;
          case "%M":
            d[1] = e.locale.date.month_short_hash[l[h]] || 0;
            break;
          case "%F":
            d[1] = e.locale.date.month_full_hash[l[h]] || 0;
        }
      return s ? new Date(Date.UTC(d[0], d[1], d[2], d[3], d[4], d[5])) : new Date(d[0], d[1], d[2], d[3], d[4], d[5]);
    };
  };
  let n;
  function o() {
    var a = !1;
    return e.config.csp === "auto" ? (n === void 0 && (n = function() {
      try {
        new Function("cspEnabled = false;"), n = !1;
      } catch {
        n = !0;
      }
      return n;
    }()), a = n) : a = e.config.csp, a;
  }
  e.date = { init: function() {
    for (var a = e.locale.date.month_short, s = e.locale.date.month_short_hash = {}, _ = 0; _ < a.length; _++)
      s[a[_]] = _;
    for (a = e.locale.date.month_full, s = e.locale.date.month_full_hash = {}, _ = 0; _ < a.length; _++)
      s[a[_]] = _;
  }, date_part: function(a) {
    const s = new Date(a);
    var _ = new Date(s);
    return s.setHours(0), s.setMinutes(0), s.setSeconds(0), s.setMilliseconds(0), s.getHours() && (s.getDate() < _.getDate() || s.getMonth() < _.getMonth() || s.getFullYear() < _.getFullYear()) && s.setTime(s.getTime() + 36e5 * (24 - s.getHours())), s;
  }, time_part: function(a) {
    return (a.valueOf() / 1e3 - 60 * a.getTimezoneOffset()) % 86400;
  }, week_start: function(a) {
    var s = a.getDay();
    return e.config.start_on_monday && (s === 0 ? s = 6 : s--), this.date_part(this.add(a, -1 * s, "day"));
  }, month_start: function(a) {
    const s = new Date(a);
    return s.setDate(1), this.date_part(s);
  }, year_start: function(a) {
    const s = new Date(a);
    return s.setMonth(0), this.month_start(s);
  }, day_start: function(a) {
    const s = new Date(a);
    return this.date_part(s);
  }, _add_days: function(a, s) {
    var _ = new Date(a.valueOf());
    if (_.setDate(_.getDate() + s), s == Math.round(s) && s > 0) {
      var r = (+_ - +a) % 864e5;
      if (r && a.getTimezoneOffset() == _.getTimezoneOffset()) {
        var d = r / 36e5;
        _.setTime(_.getTime() + 60 * (24 - d) * 60 * 1e3);
      }
    }
    return s >= 0 && !a.getHours() && _.getHours() && (_.getDate() < a.getDate() || _.getMonth() < a.getMonth() || _.getFullYear() < a.getFullYear()) && _.setTime(_.getTime() + 36e5 * (24 - _.getHours())), _;
  }, add: function(a, s, _) {
    var r = new Date(a.valueOf());
    switch (_) {
      case "day":
        r = e.date._add_days(r, s);
        break;
      case "week":
        r = e.date._add_days(r, 7 * s);
        break;
      case "month":
        r.setMonth(r.getMonth() + s);
        break;
      case "year":
        r.setYear(r.getFullYear() + s);
        break;
      case "hour":
        r.setTime(r.getTime() + 60 * s * 60 * 1e3);
        break;
      case "minute":
        r.setTime(r.getTime() + 60 * s * 1e3);
        break;
      default:
        return e.date["add_" + _](a, s, _);
    }
    return r;
  }, to_fixed: function(a) {
    return a < 10 ? "0" + a : a;
  }, copy: function(a) {
    return new Date(a.valueOf());
  }, date_to_str: function(a, s) {
    return o() ? function(_, r) {
      return function(d) {
        return _.replace(/%[a-zA-Z]/g, function(l) {
          switch (l) {
            case "%d":
              return r ? e.date.to_fixed(d.getUTCDate()) : e.date.to_fixed(d.getDate());
            case "%m":
              return r ? e.date.to_fixed(d.getUTCMonth() + 1) : e.date.to_fixed(d.getMonth() + 1);
            case "%j":
              return r ? d.getUTCDate() : d.getDate();
            case "%n":
              return r ? d.getUTCMonth() + 1 : d.getMonth() + 1;
            case "%y":
              return r ? e.date.to_fixed(d.getUTCFullYear() % 100) : e.date.to_fixed(d.getFullYear() % 100);
            case "%Y":
              return r ? d.getUTCFullYear() : d.getFullYear();
            case "%D":
              return r ? e.locale.date.day_short[d.getUTCDay()] : e.locale.date.day_short[d.getDay()];
            case "%l":
              return r ? e.locale.date.day_full[d.getUTCDay()] : e.locale.date.day_full[d.getDay()];
            case "%M":
              return r ? e.locale.date.month_short[d.getUTCMonth()] : e.locale.date.month_short[d.getMonth()];
            case "%F":
              return r ? e.locale.date.month_full[d.getUTCMonth()] : e.locale.date.month_full[d.getMonth()];
            case "%h":
              return r ? e.date.to_fixed((d.getUTCHours() + 11) % 12 + 1) : e.date.to_fixed((d.getHours() + 11) % 12 + 1);
            case "%g":
              return r ? (d.getUTCHours() + 11) % 12 + 1 : (d.getHours() + 11) % 12 + 1;
            case "%G":
              return r ? d.getUTCHours() : d.getHours();
            case "%H":
              return r ? e.date.to_fixed(d.getUTCHours()) : e.date.to_fixed(d.getHours());
            case "%i":
              return r ? e.date.to_fixed(d.getUTCMinutes()) : e.date.to_fixed(d.getMinutes());
            case "%a":
              return r ? d.getUTCHours() > 11 ? "pm" : "am" : d.getHours() > 11 ? "pm" : "am";
            case "%A":
              return r ? d.getUTCHours() > 11 ? "PM" : "AM" : d.getHours() > 11 ? "PM" : "AM";
            case "%s":
              return r ? e.date.to_fixed(d.getUTCSeconds()) : e.date.to_fixed(d.getSeconds());
            case "%W":
              return r ? e.date.to_fixed(e.date.getUTCISOWeek(d)) : e.date.to_fixed(e.date.getISOWeek(d));
            default:
              return l;
          }
        });
      };
    }(a, s) : (a = a.replace(/%[a-zA-Z]/g, function(_) {
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
    }), s && (a = a.replace(/date\.get/g, "date.getUTC")), new Function("date", 'return "' + a + '";').bind(e));
  }, str_to_date: function(a, s, _) {
    var r = o() ? t : i, d = r(a, s), l = /^[0-9]{4}(\-|\/)[0-9]{2}(\-|\/)[0-9]{2} ?(([0-9]{1,2}:[0-9]{1,2})(:[0-9]{1,2})?)?$/, h = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4} ?(([0-9]{1,2}:[0-9]{2})(:[0-9]{1,2})?)?$/, v = /^[0-9]{2}\-[0-9]{2}\-[0-9]{4} ?(([0-9]{1,2}:[0-9]{1,2})(:[0-9]{1,2})?)?$/, m = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/, f = r("%Y-%m-%d %H:%i:%s", s), c = r("%m/%d/%Y %H:%i:%s", s), u = r("%d-%m-%Y %H:%i:%s", s);
    return function(p) {
      if (!_ && !e.config.parse_exact_format) {
        if (p && p.getISOWeek)
          return new Date(p);
        if (typeof p == "number")
          return new Date(p);
        if (y = p, l.test(String(y)))
          return f(p);
        if (function(x) {
          return h.test(String(x));
        }(p))
          return c(p);
        if (function(x) {
          return v.test(String(x));
        }(p))
          return u(p);
        if (function(x) {
          return m.test(x);
        }(p))
          return new Date(p);
      }
      var y;
      return d.call(e, p);
    };
  }, getISOWeek: function(a) {
    if (!a)
      return !1;
    var s = (a = this.date_part(new Date(a))).getDay();
    s === 0 && (s = 7);
    var _ = new Date(a.valueOf());
    _.setDate(a.getDate() + (4 - s));
    var r = _.getFullYear(), d = Math.round((_.getTime() - new Date(r, 0, 1).getTime()) / 864e5);
    return 1 + Math.floor(d / 7);
  }, getUTCISOWeek: function(a) {
    return this.getISOWeek(this.convert_to_utc(a));
  }, convert_to_utc: function(a) {
    return new Date(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds());
  } };
}
function mt(e) {
  return (function() {
    var i = {};
    for (var t in this._events) {
      var n = this._events[t];
      n.id.toString().indexOf("#") == -1 && (i[n.id] = n);
    }
    return i;
  }).bind(e);
}
function Ft(e) {
  e._loaded = {}, e._load = function(t, n) {
    if (t = t || this._load_url) {
      var o;
      if (t += (t.indexOf("?") == -1 ? "?" : "&") + "timeshift=" + (/* @__PURE__ */ new Date()).getTimezoneOffset(), this.config.prevent_cache && (t += "&uid=" + this.uid()), n = n || this._date, this._load_mode) {
        var a = this.templates.load_format;
        for (n = this.date[this._load_mode + "_start"](new Date(n.valueOf())); n > this._min_date; )
          n = this.date.add(n, -1, this._load_mode);
        o = n;
        for (var s = !0; o < this._max_date; )
          o = this.date.add(o, 1, this._load_mode), this._loaded[a(n)] && s ? n = this.date.add(n, 1, this._load_mode) : s = !1;
        var _ = o;
        do
          o = _, _ = this.date.add(o, -1, this._load_mode);
        while (_ > n && this._loaded[a(_)]);
        if (o <= n)
          return !1;
        for (e.ajax.get(t + "&from=" + a(n) + "&to=" + a(o), r); n < o; )
          this._loaded[a(n)] = !0, n = this.date.add(n, 1, this._load_mode);
      } else
        e.ajax.get(t, r);
      return this.callEvent("onXLS", []), this.callEvent("onLoadStart", []), !0;
    }
    function r(d) {
      e.on_load(d), e.callEvent("onLoadEnd", []);
    }
  }, e._parsers = {}, function(t) {
    t._parsers.xml = { canParse: function(n, o) {
      if (o.responseXML && o.responseXML.firstChild)
        return !0;
      try {
        var a = t.ajax.parse(o.responseText), s = t.ajax.xmltop("data", a);
        if (s && s.tagName === "data")
          return !0;
      } catch {
      }
      return !1;
    }, parse: function(n) {
      var o;
      if (n.xmlDoc.responseXML || (n.xmlDoc.responseXML = t.ajax.parse(n.xmlDoc.responseText)), (o = t.ajax.xmltop("data", n.xmlDoc)).tagName != "data")
        return null;
      var a = o.getAttribute("dhx_security");
      a && (window.dhtmlx && (window.dhtmlx.security_key = a), t.security_key = a);
      for (var s = t.ajax.xpath("//coll_options", n.xmlDoc), _ = 0; _ < s.length; _++) {
        var r = s[_].getAttribute("for"), d = t.serverList[r];
        d || (t.serverList[r] = d = []), d.splice(0, d.length);
        for (var l = t.ajax.xpath(".//item", s[_]), h = 0; h < l.length; h++) {
          for (var v = l[h].attributes, m = { key: l[h].getAttribute("value"), label: l[h].getAttribute("label") }, f = 0; f < v.length; f++) {
            var c = v[f];
            c.nodeName != "value" && c.nodeName != "label" && (m[c.nodeName] = c.nodeValue);
          }
          d.push(m);
        }
      }
      s.length && t.callEvent("onOptionsLoad", []);
      var u = t.ajax.xpath("//userdata", n.xmlDoc);
      for (_ = 0; _ < u.length; _++) {
        var p = t._xmlNodeToJSON(u[_]);
        t._userdata[p.name] = p.text;
      }
      var y = [];
      for (o = t.ajax.xpath("//event", n.xmlDoc), _ = 0; _ < o.length; _++) {
        var x = y[_] = t._xmlNodeToJSON(o[_]);
        t._init_event(x);
      }
      return y;
    } };
  }(e), function(t) {
    t.json = t._parsers.json = { canParse: function(n) {
      if (n && typeof n == "object")
        return !0;
      if (typeof n == "string")
        try {
          var o = JSON.parse(n);
          return Object.prototype.toString.call(o) === "[object Object]" || Object.prototype.toString.call(o) === "[object Array]";
        } catch {
          return !1;
        }
      return !1;
    }, parse: function(n) {
      var o = [];
      typeof n == "string" && (n = JSON.parse(n)), Object.prototype.toString.call(n) === "[object Array]" ? o = n : n && (n.events ? o = n.events : n.data && (o = n.data)), o = o || [], n.dhx_security && (window.dhtmlx && (window.dhtmlx.security_key = n.dhx_security), t.security_key = n.dhx_security);
      var a = n && n.collections ? n.collections : {}, s = !1;
      for (var _ in a)
        if (a.hasOwnProperty(_)) {
          s = !0;
          var r = a[_], d = t.serverList[_];
          d || (t.serverList[_] = d = []), d.splice(0, d.length);
          for (var l = 0; l < r.length; l++) {
            var h = r[l], v = { key: h.value, label: h.label };
            for (var m in h)
              if (h.hasOwnProperty(m)) {
                if (m == "value" || m == "label")
                  continue;
                v[m] = h[m];
              }
            d.push(v);
          }
        }
      s && t.callEvent("onOptionsLoad", []);
      for (var f = [], c = 0; c < o.length; c++) {
        var u = o[c];
        t._init_event(u), f.push(u);
      }
      return f;
    } };
  }(e), function(t) {
    t.ical = t._parsers.ical = { canParse: function(n) {
      return typeof n == "string" && new RegExp("^BEGIN:VCALENDAR").test(n);
    }, parse: function(n) {
      var o = n.match(RegExp(this.c_start + "[^\f]*" + this.c_end, ""));
      if (o.length) {
        o[0] = o[0].replace(/[\r\n]+ /g, ""), o[0] = o[0].replace(/[\r\n]+(?=[a-z \t])/g, " "), o[0] = o[0].replace(/;[^:\r\n]*:/g, ":");
        for (var a, s = [], _ = RegExp("(?:" + this.e_start + ")([^\f]*?)(?:" + this.e_end + ")", "g"); (a = _.exec(o)) !== null; ) {
          for (var r, d = {}, l = /[^\r\n]+[\r\n]+/g; (r = l.exec(a[1])) !== null; )
            this.parse_param(r.toString(), d);
          d.uid && !d.id && (d.id = d.uid), s.push(d);
        }
        return s;
      }
    }, parse_param: function(n, o) {
      var a = n.indexOf(":");
      if (a != -1) {
        var s = n.substr(0, a).toLowerCase(), _ = n.substr(a + 1).replace(/\\,/g, ",").replace(/[\r\n]+$/, "");
        s == "summary" ? s = "text" : s == "dtstart" ? (s = "start_date", _ = this.parse_date(_, 0, 0)) : s == "dtend" && (s = "end_date", _ = this.parse_date(_, 0, 0)), o[s] = _;
      }
    }, parse_date: function(n, o, a) {
      var s = n.split("T"), _ = !1;
      s[1] && (o = s[1].substr(0, 2), a = s[1].substr(2, 2), _ = s[1][6] == "Z");
      var r = s[0].substr(0, 4), d = parseInt(s[0].substr(4, 2), 10) - 1, l = s[0].substr(6, 2);
      return t.config.server_utc || _ ? new Date(Date.UTC(r, d, l, o, a)) : new Date(r, d, l, o, a);
    }, c_start: "BEGIN:VCALENDAR", e_start: "BEGIN:VEVENT", e_end: "END:VEVENT", c_end: "END:VCALENDAR" };
  }(e), e.on_load = function(t) {
    var n;
    this.callEvent("onBeforeParse", []);
    var o = !1, a = !1;
    for (var s in this._parsers) {
      var _ = this._parsers[s];
      if (_.canParse(t.xmlDoc.responseText, t.xmlDoc)) {
        try {
          var r = t.xmlDoc.responseText;
          s === "xml" && (r = t), (n = _.parse(r)) || (o = !0);
        } catch {
          o = !0;
        }
        a = !0;
        break;
      }
    }
    if (!a)
      if (this._process && this[this._process])
        try {
          n = this[this._process].parse(t.xmlDoc.responseText);
        } catch {
          o = !0;
        }
      else
        o = !0;
    (o || t.xmlDoc.status && t.xmlDoc.status >= 400) && (this.callEvent("onLoadError", [t.xmlDoc]), n = []), this._process_loading(n), this.callEvent("onXLE", []), this.callEvent("onParse", []);
  }, e._process_loading = function(t) {
    this._loading = !0, this._not_render = !0;
    for (var n = 0; n < t.length; n++)
      this.callEvent("onEventLoading", [t[n]]) && this.addEvent(t[n]);
    this._not_render = !1, this._render_wait && this.render_view_data(), this._loading = !1, this._after_call && this._after_call(), this._after_call = null;
  }, e._init_event = function(t) {
    t.text = t.text || t._tagvalue || "", t.start_date = e._init_date(t.start_date), t.end_date = e._init_date(t.end_date);
  }, e._init_date = function(t) {
    return t ? typeof t == "string" ? e._helpers.parseDate(t) : new Date(t) : null;
  };
  const i = mt(e);
  e.serialize = function() {
    const t = [], n = i();
    for (var o in n) {
      const _ = {};
      var a = n[o];
      for (var s in a) {
        if (s.charAt(0) == "$" || s.charAt(0) == "_")
          continue;
        let r;
        const d = a[s];
        r = e.utils.isDate(d) ? e.defined(e.templates.xml_format) ? e.templates.xml_format(d) : e.templates.format_date(d) : d, _[s] = r;
      }
      t.push(_);
    }
    return t;
  }, e.parse = function(t, n) {
    this._process = n, this.on_load({ xmlDoc: { responseText: t } });
  }, e.load = function(t, n) {
    typeof n == "string" && (this._process = n, n = arguments[2]), this._load_url = t, this._after_call = n, this._load(t, this._date);
  }, e.setLoadMode = function(t) {
    t == "all" && (t = ""), this._load_mode = t;
  }, e.serverList = function(t, n) {
    return n ? (this.serverList[t] = n.slice(0), this.serverList[t]) : (this.serverList[t] = this.serverList[t] || [], this.serverList[t]);
  }, e._userdata = {}, e._xmlNodeToJSON = function(t) {
    for (var n = {}, o = 0; o < t.attributes.length; o++)
      n[t.attributes[o].name] = t.attributes[o].value;
    for (o = 0; o < t.childNodes.length; o++) {
      var a = t.childNodes[o];
      a.nodeType == 1 && (n[a.tagName] = a.firstChild ? a.firstChild.nodeValue : "");
    }
    return n.text || (n.text = t.firstChild ? t.firstChild.nodeValue : ""), n;
  }, e.attachEvent("onXLS", function() {
    var t;
    this.config.show_loading === !0 && ((t = this.config.show_loading = document.createElement("div")).className = "dhx_loading", t.style.left = Math.round((this._x - 128) / 2) + "px", t.style.top = Math.round((this._y - 15) / 2) + "px", this._obj.appendChild(t));
  }), e.attachEvent("onXLE", function() {
    var t = this.config.show_loading;
    t && typeof t == "object" && (t.parentNode && t.parentNode.removeChild(t), this.config.show_loading = !0);
  });
}
function Bt(e) {
  function i() {
    const t = e.config.csp === !0, n = !!window.Sfdc || !!window.$A || window.Aura || "$shadowResolver$" in document.body;
    return t || n ? e.$root : document.body;
  }
  e._lightbox_controls = {}, e.formSection = function(t) {
    for (var n = this.config.lightbox.sections, o = 0; o < n.length && n[o].name != t; o++)
      ;
    if (o === n.length)
      return null;
    var a = n[o];
    e._lightbox || e.getLightbox();
    var s = e._lightbox.querySelector(`#${a.id}`), _ = s.nextSibling, r = { section: a, header: s, node: _, getValue: function(l) {
      return e.form_blocks[a.type].get_value(_, l || {}, a);
    }, setValue: function(l, h) {
      return e.form_blocks[a.type].set_value(_, l, h || {}, a);
    } }, d = e._lightbox_controls["get_" + a.type + "_control"];
    return d ? d(r) : r;
  }, e._lightbox_controls.get_template_control = function(t) {
    return t.control = t.node, t;
  }, e._lightbox_controls.get_select_control = function(t) {
    return t.control = t.node.getElementsByTagName("select")[0], t;
  }, e._lightbox_controls.get_textarea_control = function(t) {
    return t.control = t.node.getElementsByTagName("textarea")[0], t;
  }, e._lightbox_controls.get_time_control = function(t) {
    return t.control = t.node.getElementsByTagName("select"), t;
  }, e._lightbox_controls.defaults = { template: { height: 30 }, textarea: { height: 200 }, select: { height: 23 }, time: { height: 20 } }, e.form_blocks = { template: { render: function(t) {
    return `<div class='dhx_cal_ltext dhx_cal_template' ${t.height ? `style='height:${t.height}px;'` : ""}></div>`;
  }, set_value: function(t, n, o, a) {
    t.innerHTML = n || "";
  }, get_value: function(t, n, o) {
    return t.innerHTML || "";
  }, focus: function(t) {
  } }, textarea: { render: function(t) {
    return `<div class='dhx_cal_ltext' ${t.height ? `style='height:${t.height}px;'` : ""}><textarea ${t.placeholder ? `placeholder='${t.placeholder}'` : ""}></textarea></div>`;
  }, set_value: function(t, n, o) {
    e.form_blocks.textarea._get_input(t).value = n || "";
  }, get_value: function(t, n) {
    return e.form_blocks.textarea._get_input(t).value;
  }, focus: function(t) {
    var n = e.form_blocks.textarea._get_input(t);
    e._focus(n, !0);
  }, _get_input: function(t) {
    return t.getElementsByTagName("textarea")[0];
  } }, select: { render: function(t) {
    for (var n = `<div class='dhx_cal_ltext dhx_cal_select' ${t.height ? `style='height:${t.height}px;'` : ""}><select style='width:100%;'>`, o = 0; o < t.options.length; o++)
      n += "<option value='" + t.options[o].key + "'>" + t.options[o].label + "</option>";
    return n += "</select></div>";
  }, set_value: function(t, n, o, a) {
    var s = t.firstChild;
    !s._dhx_onchange && a.onchange && (e.event(s, "change", a.onchange), s._dhx_onchange = !0), n === void 0 && (n = (s.options[0] || {}).value), s.value = n || "";
  }, get_value: function(t, n) {
    return t.firstChild.value;
  }, focus: function(t) {
    var n = t.firstChild;
    e._focus(n, !0);
  } }, time: { render: function(t) {
    t.time_format || (t.time_format = ["%H:%i", "%d", "%m", "%Y"]), t._time_format_order = {};
    var n = t.time_format, o = e.config, a = e.date.date_part(e._currentDate()), s = 1440, _ = 0;
    e.config.limit_time_select && (s = 60 * o.last_hour + 1, _ = 60 * o.first_hour, a.setHours(o.first_hour));
    for (var r = "", d = 0; d < n.length; d++) {
      var l = n[d];
      d > 0 && (r += " ");
      var h = "", v = "";
      switch (l) {
        case "%Y":
          var m, f, c;
          h = "dhx_lightbox_year_select", t._time_format_order[3] = d, t.year_range && (isNaN(t.year_range) ? t.year_range.push && (f = t.year_range[0], c = t.year_range[1]) : m = t.year_range), m = m || 10;
          var u = u || Math.floor(m / 2);
          f = f || a.getFullYear() - u, c = c || f + m;
          for (var p = f; p < c; p++)
            v += "<option value='" + p + "'>" + p + "</option>";
          break;
        case "%m":
          for (h = "dhx_lightbox_month_select", t._time_format_order[2] = d, p = 0; p < 12; p++)
            v += "<option value='" + p + "'>" + this.locale.date.month_full[p] + "</option>";
          break;
        case "%d":
          for (h = "dhx_lightbox_day_select", t._time_format_order[1] = d, p = 1; p < 32; p++)
            v += "<option value='" + p + "'>" + p + "</option>";
          break;
        case "%H:%i":
          h = "dhx_lightbox_time_select", t._time_format_order[0] = d, p = _;
          var y = a.getDate();
          for (t._time_values = []; p < s; )
            v += "<option value='" + p + "'>" + this.templates.time_picker(a) + "</option>", t._time_values.push(p), a.setTime(a.valueOf() + 60 * this.config.time_step * 1e3), p = 24 * (a.getDate() != y ? 1 : 0) * 60 + 60 * a.getHours() + a.getMinutes();
      }
      if (v) {
        var x = e._waiAria.lightboxSelectAttrString(l);
        r += "<select class='" + h + "' " + (t.readonly ? "disabled='disabled'" : "") + x + ">" + v + "</select> ";
      }
    }
    return `<div class='dhx_section_time' ${t.height ? `style='height:${t.height}px;'` : ""}>${r}<span style='font-weight:normal; font-size:10pt;' class='dhx_section_time_spacer'> &nbsp;&ndash;&nbsp; </span>${r}</div>`;
  }, set_value: function(t, n, o, a) {
    var s, _, r = e.config, d = t.getElementsByTagName("select"), l = a._time_format_order;
    if (r.full_day) {
      if (!t._full_day) {
        var h = "<label class='dhx_fullday'><input type='checkbox' name='full_day' value='true'> " + e.locale.labels.full_day + "&nbsp;</label></input>";
        e.config.wide_form || (h = t.previousSibling.innerHTML + h), t.previousSibling.innerHTML = h, t._full_day = !0;
      }
      var v = t.previousSibling.getElementsByTagName("input")[0];
      v.checked = e.date.time_part(o.start_date) === 0 && e.date.time_part(o.end_date) === 0, d[l[0]].disabled = v.checked, d[l[0] + d.length / 2].disabled = v.checked, v.$_eventAttached || (v.$_eventAttached = !0, e.event(v, "click", function() {
        if (v.checked) {
          var u = {};
          e.form_blocks.time.get_value(t, u, a), s = e.date.date_part(u.start_date), (+(_ = e.date.date_part(u.end_date)) == +s || +_ >= +s && (o.end_date.getHours() !== 0 || o.end_date.getMinutes() !== 0)) && (_ = e.date.add(_, 1, "day"));
        } else
          s = null, _ = null;
        d[l[0]].disabled = v.checked, d[l[0] + d.length / 2].disabled = v.checked, c(d, 0, s || o.start_date), c(d, 4, _ || o.end_date);
      }));
    }
    if (r.auto_end_date && r.event_duration)
      for (var m = function() {
        r.auto_end_date && r.event_duration && (s = new Date(d[l[3]].value, d[l[2]].value, d[l[1]].value, 0, d[l[0]].value), _ = new Date(s.getTime() + 60 * e.config.event_duration * 1e3), c(d, 4, _));
      }, f = 0; f < 4; f++)
        d[f].$_eventAttached || (d[f].$_eventAttached = !0, e.event(d[f], "change", m));
    function c(u, p, y) {
      for (var x = a._time_values, S = 60 * y.getHours() + y.getMinutes(), k = S, D = !1, M = 0; M < x.length; M++) {
        var g = x[M];
        if (g === S) {
          D = !0;
          break;
        }
        g < S && (k = g);
      }
      u[p + l[0]].value = D ? S : k, D || k || (u[p + l[0]].selectedIndex = -1), u[p + l[1]].value = y.getDate(), u[p + l[2]].value = y.getMonth(), u[p + l[3]].value = y.getFullYear();
    }
    c(d, 0, o.start_date), c(d, 4, o.end_date);
  }, get_value: function(t, n, o) {
    var a = t.getElementsByTagName("select"), s = o._time_format_order;
    if (n.start_date = new Date(a[s[3]].value, a[s[2]].value, a[s[1]].value, 0, a[s[0]].value), n.end_date = new Date(a[s[3] + 4].value, a[s[2] + 4].value, a[s[1] + 4].value, 0, a[s[0] + 4].value), !a[s[3]].value || !a[s[3] + 4].value) {
      var _ = e.getEvent(e._lightbox_id);
      _ && (n.start_date = _.start_date, n.end_date = _.end_date);
    }
    return n.end_date <= n.start_date && (n.end_date = e.date.add(n.start_date, e.config.time_step, "minute")), { start_date: new Date(n.start_date), end_date: new Date(n.end_date) };
  }, focus: function(t) {
    e._focus(t.getElementsByTagName("select")[0]);
  } } }, e._setLbPosition = function(t) {
    t && (t.style.top = Math.max(i().offsetHeight / 2 - t.offsetHeight / 2, 0) + "px", t.style.left = Math.max(i().offsetWidth / 2 - t.offsetWidth / 2, 0) + "px");
  }, e.showCover = function(t) {
    t && (t.style.display = "block", this._setLbPosition(t)), e.config.responsive_lightbox && (document.documentElement.classList.add("dhx_cal_overflow_container"), i().classList.add("dhx_cal_overflow_container")), this.show_cover(), this._cover.style.display = "";
  }, e.showLightbox = function(t) {
    if (t)
      if (this.callEvent("onBeforeLightbox", [t])) {
        this.showCover(n);
        var n = this.getLightbox();
        this._setLbPosition(n), this._fill_lightbox(t, n), this._waiAria.lightboxVisibleAttr(n), this.callEvent("onLightbox", [t]);
      } else
        this._new_event && (this._new_event = null);
  }, e._fill_lightbox = function(t, n) {
    var o = this.getEvent(t), a = n.getElementsByTagName("span"), s = [];
    if (e.templates.lightbox_header) {
      s.push("");
      var _ = e.templates.lightbox_header(o.start_date, o.end_date, o);
      s.push(_), a[1].innerHTML = "", a[2].innerHTML = _;
    } else {
      var r = this.templates.event_header(o.start_date, o.end_date, o), d = (this.templates.event_bar_text(o.start_date, o.end_date, o) || "").substr(0, 70);
      s.push(r), s.push(d), a[1].innerHTML = r, a[2].innerHTML = d;
    }
    this._waiAria.lightboxHeader(n, s.join(" "));
    for (var l = this.config.lightbox.sections, h = 0; h < l.length; h++) {
      var v = l[h], m = e._get_lightbox_section_node(v), f = this.form_blocks[v.type], c = o[v.map_to] !== void 0 ? o[v.map_to] : v.default_value;
      f.set_value.call(this, m, c, o, v), l[h].focus && f.focus.call(this, m);
    }
    e._lightbox_id = t;
  }, e._get_lightbox_section_node = function(t) {
    return e._lightbox.querySelector(`#${t.id}`).nextSibling;
  }, e._lightbox_out = function(t) {
    for (var n = this.config.lightbox.sections, o = 0; o < n.length; o++) {
      var a = e._lightbox.querySelector(`#${n[o].id}`);
      a = a && a.nextSibling;
      var s = this.form_blocks[n[o].type].get_value.call(this, a, t, n[o]);
      n[o].map_to != "auto" && (t[n[o].map_to] = s);
    }
    return t;
  }, e._empty_lightbox = function(t) {
    var n = e._lightbox_id, o = this.getEvent(n);
    this._lame_copy(o, t), this.setEvent(o.id, o), this._edit_stop_event(o, !0), this.render_view_data();
  }, e.hide_lightbox = function(t) {
    e.endLightbox(!1, this.getLightbox());
  }, e.hideCover = function(t) {
    t && (t.style.display = "none"), this.hide_cover(), e.config.responsive_lightbox && (document.documentElement.classList.remove("dhx_cal_overflow_container"), i().classList.remove("dhx_cal_overflow_container"));
  }, e.hide_cover = function() {
    this._cover && this._cover.parentNode.removeChild(this._cover), this._cover = null;
  }, e.show_cover = function() {
    this._cover || (this._cover = document.createElement("div"), this._cover.className = "dhx_cal_cover", this._cover.style.display = "none", e.event(this._cover, "mousemove", e._move_while_dnd), e.event(this._cover, "mouseup", e._finish_dnd), i().appendChild(this._cover));
  }, e.save_lightbox = function() {
    var t = this._lightbox_out({}, this._lame_copy(this.getEvent(this._lightbox_id)));
    this.checkEvent("onEventSave") && !this.callEvent("onEventSave", [this._lightbox_id, t, this._new_event]) || (this._empty_lightbox(t), this.hide_lightbox());
  }, e.startLightbox = function(t, n) {
    this._lightbox_id = t, this._custom_lightbox = !0, this._temp_lightbox = this._lightbox, this._lightbox = n, this.showCover(n);
  }, e.endLightbox = function(t, n) {
    n = n || e.getLightbox();
    var o = e.getEvent(this._lightbox_id);
    o && this._edit_stop_event(o, t), t && e.render_view_data(), this.hideCover(n), this._custom_lightbox && (this._lightbox = this._temp_lightbox, this._custom_lightbox = !1), this._temp_lightbox = this._lightbox_id = null, this._waiAria.lightboxHiddenAttr(n), this.resetLightbox(), this.callEvent("onAfterLightbox", []);
  }, e.resetLightbox = function() {
    e._lightbox && !e._custom_lightbox && e._lightbox.parentNode.removeChild(e._lightbox), e._lightbox = null;
  }, e.cancel_lightbox = function() {
    this._lightbox_id && this.callEvent("onEventCancel", [this._lightbox_id, !!this._new_event]), this.hide_lightbox();
  }, e.hideLightbox = e.cancel_lightbox, e._init_lightbox_events = function() {
    if (this.getLightbox().$_eventAttached)
      return;
    const t = this.getLightbox();
    t.$_eventAttached = !0, e.event(t, "click", function(n) {
      n.target.closest(".dhx_cal_ltitle_close_btn") && e.cancel_lightbox();
      const o = e.$domHelpers.closest(n.target, ".dhx_btn_set");
      if (!o) {
        const _ = e.$domHelpers.closest(n.target, ".dhx_custom_button[data-section-index]");
        if (_) {
          const r = Number(_.getAttribute("data-section-index"));
          e.form_blocks[e.config.lightbox.sections[r].type].button_click(e.$domHelpers.closest(_, ".dhx_cal_lsection"), _, n);
        }
        return;
      }
      const a = o ? o.getAttribute("data-action") : null;
      switch (a) {
        case "dhx_save_btn":
        case "save":
          if (e.config.readonly_active)
            return;
          e.save_lightbox();
          break;
        case "dhx_delete_btn":
        case "delete":
          if (e.config.readonly_active)
            return;
          var s = e.locale.labels.confirm_deleting;
          e._dhtmlx_confirm({ message: s, title: e.locale.labels.title_confirm_deleting, callback: function() {
            let _ = e.getEvent(e._lightbox_id);
            _._thisAndFollowing ? (_._removeFollowing = !0, e.callEvent("onEventSave", [_.id, _, e._new_event])) : e.deleteEvent(e._lightbox_id), e._new_event = null, e.hide_lightbox();
          }, config: { ok: e.locale.labels.icon_delete } });
          break;
        case "dhx_cancel_btn":
        case "cancel":
          e.cancel_lightbox();
          break;
        default:
          e.callEvent("onLightboxButton", [a, o, n]);
      }
    }), e.event(t, "keydown", function(n) {
      var o = n || window.event, a = n.target || n.srcElement, s = a.querySelector("[dhx_button]");
      switch (s || (s = a.parentNode.querySelector(".dhx_custom_button, .dhx_readonly")), (n || o).keyCode) {
        case 32:
          if ((n || o).shiftKey)
            return;
          s && s.click && s.click();
          break;
        case e.keys.edit_save:
          if ((n || o).shiftKey)
            return;
          if (s && s.click)
            s.click();
          else {
            if (e.config.readonly_active)
              return;
            e.save_lightbox();
          }
          break;
        case e.keys.edit_cancel:
          e.cancel_lightbox();
      }
    }), e.event(t, "click", function(n) {
      if (n.target.closest(".dhx_lightbox_day_select") || n.target.closest(".dhx_lightbox_month_select")) {
        const o = t.querySelectorAll(".dhx_lightbox_month_select"), a = t.querySelectorAll(".dhx_lightbox_day_select"), s = t.querySelectorAll(".dhx_lightbox_year_select");
        o.length && a.length && s && o.forEach((_, r) => {
          const d = a[r], l = parseInt(_.value, 10);
          let h = parseInt(s[r].value, 10);
          h || (h = new Date(e.getState().date).getFullYear());
          const v = function(c, u) {
            return new Date(c, u + 1, 0).getDate();
          }(h, l), m = v || 31;
          let f = d.value;
          d.innerHTML = "";
          for (let c = 1; c <= m; c++) {
            const u = document.createElement("option");
            u.value = c, u.textContent = c, d.appendChild(u);
          }
          d.value = Math.min(f, m);
        });
      }
    });
  }, e.setLightboxSize = function() {
  }, e._init_dnd_events = function() {
    e.event(i(), "mousemove", e._move_while_dnd), e.event(i(), "mouseup", e._finish_dnd), e._init_dnd_events = function() {
    };
  }, e._move_while_dnd = function(t) {
    if (e._dnd_start_lb) {
      document.dhx_unselectable || (i().classList.add("dhx_unselectable"), document.dhx_unselectable = !0);
      var n = e.getLightbox(), o = [t.pageX, t.pageY];
      n.style.top = e._lb_start[1] + o[1] - e._dnd_start_lb[1] + "px", n.style.left = e._lb_start[0] + o[0] - e._dnd_start_lb[0] + "px";
    }
  }, e._ready_to_dnd = function(t) {
    var n = e.getLightbox();
    e._lb_start = [n.offsetLeft, n.offsetTop], e._dnd_start_lb = [t.pageX, t.pageY];
  }, e._finish_dnd = function() {
    e._lb_start && (e._lb_start = e._dnd_start_lb = !1, i().classList.remove("dhx_unselectable"), document.dhx_unselectable = !1);
  }, e.getLightbox = function() {
    if (!this._lightbox) {
      var t = document.createElement("div");
      t.className = "dhx_cal_light", e.config.wide_form && (t.className += " dhx_cal_light_wide"), e.form_blocks.recurring && (t.className += " dhx_cal_light_rec"), e.config.rtl && (t.className += " dhx_cal_light_rtl"), e.config.responsive_lightbox && (t.className += " dhx_cal_light_responsive"), t.style.visibility = "hidden";
      var n = this._lightbox_template, o = this.config.buttons_right;
      n += "<div class='dhx_cal_lcontrols'>";
      for (var a = 0; a < o.length; a++)
        n += "<div " + this._waiAria.lightboxButtonAttrString(o[a]) + " data-action='" + o[a] + "' class='dhx_btn_set dhx_" + (e.config.rtl ? "right" : "left") + "_btn_set " + o[a] + "_set'><div class='dhx_btn_inner " + o[a] + "'></div><div>" + e.locale.labels[o[a]] + "</div></div>";
      o = this.config.buttons_left;
      var s = e.config.rtl;
      for (a = 0; a < o.length; a++)
        n += "<div class='dhx_cal_lcontrols_push_right'></div>", n += "<div " + this._waiAria.lightboxButtonAttrString(o[a]) + " data-action='" + o[a] + "' class='dhx_btn_set dhx_" + (s ? "left" : "right") + "_btn_set " + o[a] + "_set'><div class='dhx_btn_inner " + o[a] + "'></div><div>" + e.locale.labels[o[a]] + "</div></div>";
      n += "</div>", n += "</div>", t.innerHTML = n, e.config.drag_lightbox && (e.event(t.firstChild, "mousedown", e._ready_to_dnd), e.event(t.firstChild, "selectstart", function(m) {
        return m.preventDefault(), !1;
      }), t.firstChild.style.cursor = "move", e._init_dnd_events()), this._waiAria.lightboxAttr(t), this.show_cover(), this._cover.insertBefore(t, this._cover.firstChild), this._lightbox = t;
      var _ = this.config.lightbox.sections;
      for (n = "", a = 0; a < _.length; a++) {
        var r = this.form_blocks[_[a].type];
        if (r) {
          _[a].id = "area_" + this.uid();
          var d = "";
          _[a].button && (d = "<div " + e._waiAria.lightboxSectionButtonAttrString(this.locale.labels["button_" + _[a].button]) + " class='dhx_custom_button' data-section-index='" + a + "' index='" + a + "'><div class='dhx_custom_button_" + _[a].button + "'></div><div>" + this.locale.labels["button_" + _[a].button] + "</div></div>"), this.config.wide_form && (n += "<div class='dhx_wrap_section'>");
          var l = this.locale.labels["section_" + _[a].name];
          typeof l != "string" && (l = _[a].name), n += "<div id='" + _[a].id + "' class='dhx_cal_lsection dhx_cal_lsection_" + _[a].name + "'>" + d + "<label>" + l + "</label></div>" + r.render.call(this, _[a]), n += "</div>";
        }
      }
      var h = t.getElementsByTagName("div");
      for (a = 0; a < h.length; a++) {
        var v = h[a];
        if (e._getClassName(v) == "dhx_cal_larea") {
          v.innerHTML = n;
          break;
        }
      }
      e._bindLightboxLabels(_), this.setLightboxSize(), this._init_lightbox_events(this), t.style.visibility = "visible";
    }
    return this._lightbox;
  }, e._bindLightboxLabels = function(t) {
    for (var n = 0; n < t.length; n++) {
      var o = t[n];
      if (o.id && e._lightbox.querySelector(`#${o.id}`)) {
        for (var a = e._lightbox.querySelector(`#${o.id}`).querySelector("label"), s = e._get_lightbox_section_node(o); s && !s.querySelector; )
          s = s.nextSibling;
        var _ = !0;
        if (s) {
          var r = s.querySelector("input, select, textarea");
          r && (o.inputId = r.id || "input_" + e.uid(), r.id || (r.id = o.inputId), a.setAttribute("for", o.inputId), _ = !1);
        }
        _ && e.form_blocks[o.type].focus && e.event(a, "click", function(d) {
          return function() {
            var l = e.form_blocks[d.type], h = e._get_lightbox_section_node(d);
            l && l.focus && l.focus.call(e, h);
          };
        }(o));
      }
    }
  }, e.attachEvent("onEventIdChange", function(t, n) {
    this._lightbox_id == t && (this._lightbox_id = n);
  }), e._lightbox_template = `<div class='dhx_cal_ltitle'><div class="dhx_cal_ltitle_descr"><span class='dhx_mark'>&nbsp;</span><span class='dhx_time'></span><span class='dhx_title'></span>
</div>
<div class="dhx_cal_ltitle_controls">
<a class="dhx_cal_ltitle_close_btn scheduler_icon close"></a>
</div></div><div class='dhx_cal_larea'></div>`;
}
function Jt(e) {
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
  }, e._touch_events = function(i, t, n) {
    var o, a, s, _, r, d, l = 0;
    function h(m, f, c) {
      e.event(m, f, function(u) {
        return !!e._is_lightbox_open() || (n(u) ? void 0 : c(u));
      }, { passive: !1 });
    }
    function v(m) {
      n(m) || (e._hide_global_tip(), _ && (e._on_mouse_up(t(m)), e._temp_touch_block = !1), e._drag_id = null, e._drag_mode = null, e._drag_pos = null, e._pointerDragId = null, clearTimeout(s), _ = d = !1, r = !0);
    }
    h(document.body, i[0], function(m) {
      if (!n(m)) {
        var f = t(m);
        if (f) {
          if (_)
            return function(c) {
              if (!n(c)) {
                var u = e.getState().drag_mode, p = !!e.matrix && e.matrix[e._mode], y = e.render_view_data;
                u == "create" && p && (e.render_view_data = function() {
                  for (var x = e.getState().drag_id, S = e.getEvent(x), k = p.y_property, D = e.getEvents(S.start_date, S.end_date), M = 0; M < D.length; M++)
                    D[M][k] != S[k] && (D.splice(M, 1), M--);
                  S._sorder = D.length - 1, S._count = D.length, this.render_data([S], e.getState().mode);
                }), e._on_mouse_move(c), u == "create" && p && (e.render_view_data = y), c.preventDefault && c.preventDefault(), c.cancelBubble = !0;
              }
            }(f), m.preventDefault && m.preventDefault(), m.cancelBubble = !0, e._update_global_tip(), !1;
          a = t(m), d && (a ? (o.target != a.target || Math.abs(o.pageX - a.pageX) > 5 || Math.abs(o.pageY - a.pageY) > 5) && (r = !0, clearTimeout(s)) : r = !0);
        }
      }
    }), h(this._els.dhx_cal_data[0], "touchcancel", v), h(this._els.dhx_cal_data[0], "contextmenu", function(m) {
      if (!n(m))
        return d ? (m && m.preventDefault && m.preventDefault(), m.cancelBubble = !0, !1) : void 0;
    }), h(this._obj, i[1], function(m) {
      var f;
      if (document && document.body && document.body.classList.add("dhx_cal_touch_active"), !n(m))
        if (e._pointerDragId = m.pointerId, _ = r = !1, d = !0, f = a = t(m)) {
          var c = /* @__PURE__ */ new Date();
          if (!r && !_ && c - l < 250)
            return e._click.dhx_cal_data(f), window.setTimeout(function() {
              e.$destroyed || e._on_dbl_click(f);
            }, 50), m.preventDefault && m.preventDefault(), m.cancelBubble = !0, e._block_next_stop = !0, !1;
          if (l = c, !r && !_ && e.config.touch_drag) {
            var u = e._locate_event(document.activeElement), p = e._locate_event(f.target), y = o ? e._locate_event(o.target) : null;
            if (u && p && u == p && u != y)
              return m.preventDefault && m.preventDefault(), m.cancelBubble = !0, e._ignore_next_click = !1, e._click.dhx_cal_data(f), o = f, !1;
            s = setTimeout(function() {
              if (!e.$destroyed) {
                _ = !0;
                var x = o.target, S = e._getClassName(x);
                x && S.indexOf("dhx_body") != -1 && (x = x.previousSibling), e._on_mouse_down(o, x), e._drag_mode && e._drag_mode != "create" && e.for_rendered(e._drag_id, function(k, D) {
                  k.style.display = "none", e._rendered.splice(D, 1);
                }), e.config.touch_tip && e._show_global_tip(), e.updateEvent(e._drag_id);
              }
            }, e.config.touch_drag), o = f;
          }
        } else
          r = !0;
    }), h(this._els.dhx_cal_data[0], i[2], function(m) {
      if (document && document.body && document.body.classList.remove("dhx_cal_touch_active"), !n(m))
        return e.config.touch_swipe_dates && !_ && function(f, c, u, p) {
          if (!f || !c)
            return !1;
          for (var y = f.target; y && y != e._obj; )
            y = y.parentNode;
          if (y != e._obj || e.matrix && e.matrix[e.getState().mode] && e.matrix[e.getState().mode].scrollable)
            return !1;
          var x = Math.abs(f.pageY - c.pageY), S = Math.abs(f.pageX - c.pageX);
          return x < p && S > u && (!x || S / x > 3) && (f.pageX > c.pageX ? e._click.dhx_cal_next_button() : e._click.dhx_cal_prev_button(), !0);
        }(o, a, 200, 100) && (e._block_next_stop = !0), _ && (e._ignore_next_click = !0, setTimeout(function() {
          e._ignore_next_click = !1;
        }, 100)), v(m), e._block_next_stop ? (e._block_next_stop = !1, m.preventDefault && m.preventDefault(), m.cancelBubble = !0, !1) : void 0;
    }), e.event(document.body, i[2], v);
  }, e._show_global_tip = function() {
    e._hide_global_tip();
    var i = e._global_tip = document.createElement("div");
    i.className = "dhx_global_tip", e._update_global_tip(1), document.body.appendChild(i);
  }, e._update_global_tip = function(i) {
    var t = e._global_tip;
    if (t) {
      var n = "";
      if (e._drag_id && !i) {
        var o = e.getEvent(e._drag_id);
        o && (n = "<div>" + (o._timed ? e.templates.event_header(o.start_date, o.end_date, o) : e.templates.day_date(o.start_date, o.end_date, o)) + "</div>");
      }
      e._drag_mode == "create" || e._drag_mode == "new-size" ? t.innerHTML = (e.locale.labels.drag_to_create || "Drag to create") + n : t.innerHTML = (e.locale.labels.drag_to_move || "Drag to move") + n;
    }
  }, e._hide_global_tip = function() {
    var i = e._global_tip;
    i && i.parentNode && (i.parentNode.removeChild(i), e._global_tip = 0);
  };
}
function Wt(e) {
  var i, t;
  function n() {
    if (e._is_material_skin())
      return !0;
    if (t !== void 0)
      return t;
    var _ = document.createElement("div");
    _.style.position = "absolute", _.style.left = "-9999px", _.style.top = "-9999px", _.innerHTML = "<div class='dhx_cal_container'><div class='dhx_cal_data'><div class='dhx_cal_event'><div class='dhx_body'></div></div><div>", document.body.appendChild(_);
    var r = window.getComputedStyle(_.querySelector(".dhx_body")).getPropertyValue("box-sizing");
    document.body.removeChild(_), (t = r === "border-box") || setTimeout(function() {
      t = void 0;
    }, 1e3);
  }
  function o() {
    if (!e._is_material_skin() && !e._border_box_events()) {
      var _ = t;
      t = void 0, i = void 0, _ !== n() && e.$container && e.getState().mode && e.setCurrentView();
    }
  }
  function a(_) {
    var r = _.getMinutes();
    return r = r < 10 ? "0" + r : r, "<span class='dhx_scale_h'>" + _.getHours() + "</span><span class='dhx_scale_m'>&nbsp;" + r + "</span>";
  }
  e._addThemeClass = function() {
    document.documentElement.setAttribute("data-scheduler-theme", e.skin);
  }, e._skin_settings = { fix_tab_position: [1, 0], use_select_menu_space: [1, 0], wide_form: [1, 0], hour_size_px: [44, 42], displayed_event_color: ["#ff4a4a", "ffc5ab"], displayed_event_text_color: ["#ffef80", "7e2727"] }, e._skin_xy = { lightbox_additional_height: [90, 50], nav_height: [59, 22], bar_height: [24, 20] }, e._is_material_skin = function() {
    return e.skin ? (e.skin + "").indexOf("material") > -1 : function() {
      if (i === void 0) {
        var _ = document.createElement("div");
        _.style.position = "absolute", _.style.left = "-9999px", _.style.top = "-9999px", _.innerHTML = "<div class='dhx_cal_container'><div class='dhx_cal_scale_placeholder'></div><div>", document.body.appendChild(_);
        var r = window.getComputedStyle(_.querySelector(".dhx_cal_scale_placeholder")).getPropertyValue("position");
        i = r === "absolute", setTimeout(function() {
          i = null, _ && _.parentNode && _.parentNode.removeChild(_);
        }, 500);
      }
      return i;
    }();
  }, e._build_skin_info = function() {
    (function() {
      const m = e.$container;
      clearInterval(s), m && (s = setInterval(() => {
        const f = getComputedStyle(m).getPropertyValue("--dhx-scheduler-theme");
        f && f !== e.skin && e.setSkin(f);
      }, 100));
    })();
    const _ = getComputedStyle(this.$container), r = _.getPropertyValue("--dhx-scheduler-theme");
    let d, l = !!r, h = {}, v = !1;
    if (l) {
      d = r;
      for (let m in e.xy)
        h[m] = _.getPropertyValue(`--dhx-scheduler-xy-${m}`);
      h.hour_size_px = _.getPropertyValue("--dhx-scheduler-config-hour_size_px"), h.wide_form = _.getPropertyValue("--dhx-scheduler-config-form_wide");
    } else
      d = function() {
        for (var m = document.getElementsByTagName("link"), f = 0; f < m.length; f++) {
          var c = m[f].href.match("dhtmlxscheduler_([a-z]+).css");
          if (c)
            return c[1];
        }
      }(), v = e._is_material_skin();
    if (e._theme_info = { theme: d, cssVarTheme: l, oldMaterialTheme: v, values: h }, e._theme_info.cssVarTheme) {
      const m = this._theme_info.values;
      for (let f in e.xy)
        isNaN(parseInt(m[f])) || (e.xy[f] = parseInt(m[f]));
    }
  }, e.event(window, "DOMContentLoaded", o), e.event(window, "load", o), e._border_box_events = function() {
    return n();
  }, e._configure = function(_, r, d) {
    for (var l in r)
      _[l] === void 0 && (_[l] = r[l][d]);
  }, e.setSkin = function(_) {
    this.skin = _, e._addThemeClass(), e.$container && (this._skin_init(), this.render());
  };
  let s = null;
  e.attachEvent("onDestroy", function() {
    clearInterval(s);
  }), e._skin_init = function() {
    this._build_skin_info(), this.skin || (this.skin = this._theme_info.theme), e._addThemeClass(), e.skin === "flat" ? e.templates.hour_scale = a : e.templates.hour_scale === a && (e.templates.hour_scale = e.date.date_to_str(e.config.hour_date)), e.attachEvent("onTemplatesReady", function() {
      var _ = e.date.date_to_str("%d");
      e.templates._old_month_day || (e.templates._old_month_day = e.templates.month_day);
      var r = e.templates._old_month_day;
      e.templates.month_day = function(d) {
        if (this._mode == "month") {
          var l = _(d);
          return d.getDate() == 1 && (l = e.locale.date.month_full[d.getMonth()] + " " + l), +d == +e.date.date_part(this._currentDate()) && (l = e.locale.labels.dhx_cal_today_button + " " + l), l;
        }
        return r.call(this, d);
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
        const l = Array.from(d.querySelectorAll(".dhx_cal_tab")), h = ["day", "week", "month"].map((m) => l.find((f) => f.getAttribute("data-tab") === m)).filter((m) => m !== void 0);
        let v = l.length > 0 ? l[0] : null;
        h.reverse().forEach((m) => {
          d.insertBefore(m, v), v = m;
        });
      }(e._els.dhx_cal_navline[0]));
    }, { once: !0 });
  };
}
function Kt(e, i) {
  this.$scheduler = e, this.$dp = i, this._dataProcessorHandlers = [], this.attach = function() {
    var t = this.$dp, n = this.$scheduler;
    this._dataProcessorHandlers.push(n.attachEvent("onEventAdded", function(o) {
      !this._loading && this._validId(o) && t.setUpdated(o, !0, "inserted");
    })), this._dataProcessorHandlers.push(n.attachEvent("onConfirmedBeforeEventDelete", function(o) {
      if (this._validId(o)) {
        var a = t.getState(o);
        return a == "inserted" || this._new_event ? (t.setUpdated(o, !1), !0) : a != "deleted" && (a == "true_deleted" || (t.setUpdated(o, !0, "deleted"), !1));
      }
    })), this._dataProcessorHandlers.push(n.attachEvent("onEventChanged", function(o) {
      !this._loading && this._validId(o) && t.setUpdated(o, !0, "updated");
    })), this._dataProcessorHandlers.push(n.attachEvent("onClearAll", function() {
      t._in_progress = {}, t._invalid = {}, t.updatedRows = [], t._waitMode = 0;
    })), t.attachEvent("insertCallback", n._update_callback), t.attachEvent("updateCallback", n._update_callback), t.attachEvent("deleteCallback", function(o, a) {
      n.getEvent(a) ? (n.setUserData(a, this.action_param, "true_deleted"), n.deleteEvent(a)) : n._add_rec_marker && n._update_callback(o, a);
    });
  }, this.detach = function() {
    for (var t in this._dataProcessorHandlers) {
      var n = this._dataProcessorHandlers[t];
      this.$scheduler.detachEvent(n);
    }
    this._dataProcessorHandlers = [];
  };
}
function He(e) {
  return this.serverProcessor = e, this.action_param = "!nativeeditor_status", this.object = null, this.updatedRows = [], this.autoUpdate = !0, this.updateMode = "cell", this._tMode = "GET", this._headers = null, this._payload = null, this.post_delim = "_", this._waitMode = 0, this._in_progress = {}, this._invalid = {}, this.messages = [], this.styles = { updated: "font-weight:bold;", inserted: "font-weight:bold;", deleted: "text-decoration : line-through;", invalid: "background-color:FFE0E0;", invalid_cell: "border-bottom:2px solid red;", error: "color:red;", clear: "font-weight:normal;text-decoration:none;" }, this.enableUTFencoding(!0), Ve(this), this;
}
function Gt(e) {
  var i = "data-dhxbox", t = null;
  function n(p, y, x) {
    var S = p.callback;
    S && S(y, x), f.hide(p.box), t = p.box = null;
  }
  function o(p) {
    if (t) {
      var y = p.which || p.keyCode, x = !1;
      if (c.keyboard) {
        if (y == 13 || y == 32) {
          var S = p.target || p.srcElement;
          ue.getClassName(S).indexOf("scheduler_popup_button") > -1 && S.click ? S.click() : (n(t, !0), x = !0);
        }
        y == 27 && (n(t, !1), x = !0);
      }
      return x ? (p.preventDefault && p.preventDefault(), !(p.cancelBubble = !0)) : void 0;
    }
  }
  function a(p) {
    a.cover || (a.cover = document.createElement("div"), e.event(a.cover, "keydown", o), a.cover.className = "dhx_modal_cover", document.body.appendChild(a.cover)), a.cover.style.display = p ? "inline-block" : "none";
  }
  function s(p, y, x) {
    var S = e._waiAria.messageButtonAttrString(p), k = (y || "").toLowerCase().replace(/ /g, "_");
    return `<div ${S} class='scheduler_popup_button dhtmlx_popup_button ${`scheduler_${k}_button dhtmlx_${k}_button`}' data-result='${x}' result='${x}' ><div>${p}</div></div>`;
  }
  function _() {
    for (var p = [].slice.apply(arguments, [0]), y = 0; y < p.length; y++)
      if (p[y])
        return p[y];
  }
  function r(p, y, x) {
    var S = p.tagName ? p : function(M, g, b) {
      var w = document.createElement("div"), E = re.uid();
      e._waiAria.messageModalAttr(w, E), w.className = " scheduler_modal_box dhtmlx_modal_box scheduler-" + M.type + " dhtmlx-" + M.type, w.setAttribute(i, 1);
      var N = "";
      if (M.width && (w.style.width = M.width), M.height && (w.style.height = M.height), M.title && (N += '<div class="scheduler_popup_title dhtmlx_popup_title">' + M.title + "</div>"), N += '<div class="scheduler_popup_text dhtmlx_popup_text" id="' + E + '"><span>' + (M.content ? "" : M.text) + '</span></div><div  class="scheduler_popup_controls dhtmlx_popup_controls">', g && (N += s(_(M.ok, e.locale.labels.message_ok, "OK"), "ok", !0)), b && (N += s(_(M.cancel, e.locale.labels.message_cancel, "Cancel"), "cancel", !1)), M.buttons)
        for (var T = 0; T < M.buttons.length; T++) {
          var A = M.buttons[T];
          N += typeof A == "object" ? s(A.label, A.css || "scheduler_" + A.label.toLowerCase() + "_button dhtmlx_" + A.label.toLowerCase() + "_button", A.value || T) : s(A, A, T);
        }
      if (N += "</div>", w.innerHTML = N, M.content) {
        var C = M.content;
        typeof C == "string" && (C = document.getElementById(C)), C.style.display == "none" && (C.style.display = ""), w.childNodes[M.title ? 1 : 0].appendChild(C);
      }
      return e.event(w, "click", function($) {
        var H = $.target || $.srcElement;
        if (H.className || (H = H.parentNode), ue.closest(H, ".scheduler_popup_button")) {
          var O = H.getAttribute("data-result");
          n(M, O = O == "true" || O != "false" && O, $);
        }
      }), M.box = w, (g || b) && (t = M), w;
    }(p, y, x);
    p.hidden || a(!0), document.body.appendChild(S);
    var k = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - S.offsetWidth) / 2)), D = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - S.offsetHeight) / 2));
    return p.position == "top" ? S.style.top = "-3px" : S.style.top = D + "px", S.style.left = k + "px", e.event(S, "keydown", o), f.focus(S), p.hidden && f.hide(S), e.callEvent("onMessagePopup", [S]), S;
  }
  function d(p) {
    return r(p, !0, !1);
  }
  function l(p) {
    return r(p, !0, !0);
  }
  function h(p) {
    return r(p);
  }
  function v(p, y, x) {
    return typeof p != "object" && (typeof y == "function" && (x = y, y = ""), p = { text: p, type: y, callback: x }), p;
  }
  function m(p, y, x, S, k) {
    return typeof p != "object" && (p = { text: p, type: y, expire: x, id: S, callback: k }), p.id = p.id || re.uid(), p.expire = p.expire || c.expire, p;
  }
  e.event(document, "keydown", o, !0);
  var f = function() {
    var p = v.apply(this, arguments);
    return p.type = p.type || "alert", h(p);
  };
  f.hide = function(p) {
    for (; p && p.getAttribute && !p.getAttribute(i); )
      p = p.parentNode;
    p && (p.parentNode.removeChild(p), a(!1), e.callEvent("onAfterMessagePopup", [p]));
  }, f.focus = function(p) {
    setTimeout(function() {
      var y = ue.getFocusableNodes(p);
      y.length && y[0].focus && y[0].focus();
    }, 1);
  };
  var c = function(p, y, x, S) {
    switch ((p = m.apply(this, arguments)).type = p.type || "info", p.type.split("-")[0]) {
      case "alert":
        return d(p);
      case "confirm":
        return l(p);
      case "modalbox":
        return h(p);
      default:
        return function(k) {
          c.area || (c.area = document.createElement("div"), c.area.className = "scheduler_message_area dhtmlx_message_area", c.area.style[c.position] = "5px", document.body.appendChild(c.area)), c.hide(k.id);
          var D = document.createElement("div");
          return D.innerHTML = "<div>" + k.text + "</div>", D.className = "scheduler-info dhtmlx-info scheduler-" + k.type + " dhtmlx-" + k.type, e.event(D, "click", function(M) {
            k.callback && k.callback.call(this, M), c.hide(k.id), k = null;
          }), e._waiAria.messageInfoAttr(D), c.position == "bottom" && c.area.firstChild ? c.area.insertBefore(D, c.area.firstChild) : c.area.appendChild(D), k.expire > 0 && (c.timers[k.id] = window.setTimeout(function() {
            c && c.hide(k.id);
          }, k.expire)), c.pull[k.id] = D, D = null, k.id;
        }(p);
    }
  };
  c.seed = (/* @__PURE__ */ new Date()).valueOf(), c.uid = re.uid, c.expire = 4e3, c.keyboard = !0, c.position = "top", c.pull = {}, c.timers = {}, c.hideAll = function() {
    for (var p in c.pull)
      c.hide(p);
  }, c.hide = function(p) {
    var y = c.pull[p];
    y && y.parentNode && (window.setTimeout(function() {
      y.parentNode.removeChild(y), y = null;
    }, 2e3), y.className += " hidden", c.timers[p] && window.clearTimeout(c.timers[p]), delete c.pull[p]);
  };
  var u = [];
  return e.attachEvent("onMessagePopup", function(p) {
    u.push(p);
  }), e.attachEvent("onAfterMessagePopup", function(p) {
    for (var y = 0; y < u.length; y++)
      u[y] === p && (u.splice(y, 1), y--);
  }), e.attachEvent("onDestroy", function() {
    a.cover && a.cover.parentNode && a.cover.parentNode.removeChild(a.cover);
    for (var p = 0; p < u.length; p++)
      u[p].parentNode && u[p].parentNode.removeChild(u[p]);
    u = null, c.area && c.area.parentNode && c.area.parentNode.removeChild(c.area), c = null;
  }), { alert: function() {
    var p = v.apply(this, arguments);
    return p.type = p.type || "confirm", d(p);
  }, confirm: function() {
    var p = v.apply(this, arguments);
    return p.type = p.type || "alert", l(p);
  }, message: c, modalbox: f };
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
    var n = this.findRow(e);
    t = t || "updated";
    var o = this.$scheduler.getUserData(e, this.action_param);
    o && t == "updated" && (t = o), i ? (this.set_invalid(e, !1), this.updatedRows[n] = e, this.$scheduler.setUserData(e, this.action_param, t), this._in_progress[e] && (this._in_progress[e] = "wait")) : this.is_invalid(e) || (this.updatedRows.splice(n, 1), this.$scheduler.setUserData(e, this.action_param, "")), this.markRow(e, i, t), i && this.autoUpdate && this.sendData(e);
  }
}, markRow: function(e, i, t) {
  var n = "", o = this.is_invalid(e);
  if (o && (n = this.styles[o], i = !0), this.callEvent("onRowMark", [e, i, t, o]) && (n = this.styles[i ? t : "clear"] + n, this.$scheduler[this._methods[0]](e, n), o && o.details)) {
    n += this.styles[o + "_cell"];
    for (var a = 0; a < o.details.length; a++)
      o.details[a] && this.$scheduler[this._methods[1]](e, a, n);
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
  var t = [], n = [];
  for (var o in e)
    e.hasOwnProperty(o) && (t.push(this.serialize_one(e[o], o + this.post_delim)), n.push(o));
  return t.push("ids=" + this.escape(n.join(","))), this.$scheduler.security_key && t.push("dhx_security=" + this.$scheduler.security_key), t.join("&");
}, serialize_one: function(e, i) {
  if (typeof e == "string")
    return e;
  var t = [], n = "";
  for (var o in e)
    if (e.hasOwnProperty(o)) {
      if ((o == "id" || o == this.action_param) && this._tMode == "REST")
        continue;
      n = typeof e[o] == "string" || typeof e[o] == "number" ? e[o] : JSON.stringify(e[o]), t.push(this.escape((i || "") + o) + "=" + this.escape(n));
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
    var t = this, n = this.$scheduler.ajax;
    if (this._tMode !== "CUSTOM") {
      var o, a = { callback: function(f) {
        var c = [];
        if (i)
          c.push(i);
        else if (e)
          for (var u in e)
            c.push(u);
        return t.afterUpdate(t, f, c);
      }, headers: t._headers }, s = this.serverProcessor + (this._user ? n.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + this.$scheduler.getUserData(0, "version")].join("&") : ""), _ = this._applyPayload(s);
      switch (this._tMode) {
        case "GET":
          o = this._cleanupArgumentsBeforeSend(e), a.url = _ + n.urlSeparator(_) + this.serialize(o, i), a.method = "GET";
          break;
        case "POST":
          o = this._cleanupArgumentsBeforeSend(e), a.url = _, a.method = "POST", a.data = this.serialize(o, i);
          break;
        case "JSON":
          o = {};
          var r = this._cleanupItemBeforeSend(e);
          for (var d in r)
            d !== this.action_param && d !== "id" && d !== "gr_id" && (o[d] = r[d]);
          a.url = _, a.method = "POST", a.data = JSON.stringify({ id: i, action: e[this.action_param], data: o });
          break;
        case "REST":
        case "REST-JSON":
          switch (_ = s.replace(/(&|\?)editing=true/, ""), o = "", this.getState(i)) {
            case "inserted":
              a.method = "POST", a.data = this.serialize(e, i);
              break;
            case "deleted":
              a.method = "DELETE", _ = _ + (_.slice(-1) === "/" ? "" : "/") + i;
              break;
            default:
              a.method = "PUT", a.data = this.serialize(e, i), _ = _ + (_.slice(-1) === "/" ? "" : "/") + i;
          }
          a.url = this._applyPayload(_);
      }
      return this._waitMode++, n.query(a);
    }
    {
      var l = this.getState(i), h = this.getActionByState(l);
      delete e[this.action_param];
      var v = function(c) {
        var u = l;
        if (c && c.responseText && c.setRequestHeader) {
          c.status !== 200 && (u = "error");
          try {
            c = JSON.parse(c.responseText);
          } catch {
          }
        }
        u = u || "updated";
        var p = i, y = i;
        c && (u = c.action || u, p = c.sid || p, y = c.id || c.tid || y), t.afterUpdateCallback(p, y, u, c);
      };
      const f = "event";
      var m;
      if (this._router instanceof Function)
        m = this._router(f, h, e, i);
      else
        switch (l) {
          case "inserted":
            m = this._router[f].create(e);
            break;
          case "deleted":
            m = this._router[f].delete(i);
            break;
          default:
            m = this._router[f].update(e, i);
        }
      if (m) {
        if (!m.then && m.id === void 0 && m.tid === void 0 && m.action === void 0)
          throw new Error("Incorrect router return value. A Promise or a response object is expected");
        m.then ? m.then(v).catch(function(c) {
          c && c.action ? v(c) : v({ action: "error", value: c });
        }) : v(m);
      } else
        v(null);
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
  return this._forEachUpdatedRow(function(n) {
    if (!this._in_progress[n] && !this.is_invalid(n)) {
      var o = this._getRowData(n);
      this.callEvent("onBeforeUpdate", [n, this.getState(n), o]) && (i[n] = o, t = !0, this._in_progress[n] = (/* @__PURE__ */ new Date()).valueOf());
    }
  }), t ? i : null;
}, findRow: function(e) {
  var i = 0;
  for (i = 0; i < this.updatedRows.length && e != this.updatedRows[i]; i++)
    ;
  return i;
}, defineAction: function(e, i) {
  this._uActions || (this._uActions = {}), this._uActions[e] = i;
}, afterUpdateCallback: function(e, i, t, n) {
  if (this.$scheduler) {
    var o = e, a = t !== "error" && t !== "invalid";
    if (a || this.set_invalid(e, t), this._uActions && this._uActions[t] && !this._uActions[t](n))
      return delete this._in_progress[o];
    this._in_progress[o] !== "wait" && this.setUpdated(e, !1);
    var s = e;
    switch (t) {
      case "inserted":
      case "insert":
        i != e && (this.setUpdated(e, !1), this.$scheduler[this._methods[2]](e, i), e = i);
        break;
      case "delete":
      case "deleted":
        return this.$scheduler.setUserData(e, this.action_param, "true_deleted"), this.$scheduler[this._methods[3]](e, i), delete this._in_progress[o], this.callEvent("onAfterUpdate", [e, t, i, n]);
    }
    this._in_progress[o] !== "wait" ? (a && this.$scheduler.setUserData(e, this.action_param, ""), delete this._in_progress[o]) : (delete this._in_progress[o], this.setUpdated(i, !0, this.$scheduler.getUserData(e, this.action_param))), this.callEvent("onAfterUpdate", [s, t, i, n]);
  }
}, _errorResponse: function(e, i) {
  return this.$scheduler && this.$scheduler.callEvent && this.$scheduler.callEvent("onSaveError", [i, e.xmlDoc]), this.cleanUpdate(i);
}, _setDefaultTransactionMode: function() {
  this.serverProcessor && (this.setTransactionMode("POST", !0), this.serverProcessor += (this.serverProcessor.indexOf("?") !== -1 ? "&" : "?") + "editing=true", this._serverProcessor = this.serverProcessor);
}, afterUpdate: function(e, i, t) {
  var n = this.$scheduler.ajax;
  if (i.xmlDoc.status === 200) {
    var o;
    try {
      o = JSON.parse(i.xmlDoc.responseText);
    } catch {
      i.xmlDoc.responseText.length || (o = {});
    }
    if (o) {
      var a = o.action || this.getState(t) || "updated", s = o.sid || t[0], _ = o.tid || t[0];
      return e.afterUpdateCallback(s, _, a, o), void e.finalizeUpdate();
    }
    var r = n.xmltop("data", i.xmlDoc);
    if (!r)
      return this._errorResponse(i, t);
    var d = n.xpath("//data/action", r);
    if (!d.length)
      return this._errorResponse(i, t);
    for (var l = 0; l < d.length; l++) {
      var h = d[l];
      a = h.getAttribute("type"), s = h.getAttribute("sid"), _ = h.getAttribute("tid"), e.afterUpdateCallback(s, _, a, h);
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
    this.$scheduler = e, this.$scheduler._dp_init && this.$scheduler._dp_init(this), this._setDefaultTransactionMode(), this._methods = this._methods || ["_set_event_text_style", "", "_dp_change_event_id", "_dp_hook_delete"], function(t, n) {
      t._validId = function(o) {
        return !this._is_virtual_event || !this._is_virtual_event(o);
      }, t.setUserData = function(o, a, s) {
        if (o) {
          var _ = this.getEvent(o);
          _ && (_[a] = s);
        } else
          this._userdata[a] = s;
      }, t.getUserData = function(o, a) {
        if (o) {
          var s = this.getEvent(o);
          return s ? s[a] : null;
        }
        return this._userdata[a];
      }, t._set_event_text_style = function(o, a) {
        if (t.getEvent(o)) {
          this.for_rendered(o, function(_) {
            _.style.cssText += ";" + a;
          });
          var s = this.getEvent(o);
          s._text_style = a, this.event_updated(s);
        }
      }, t._update_callback = function(o, a) {
        var s = t._xmlNodeToJSON(o.firstChild);
        s.rec_type == "none" && (s.rec_pattern = "none"), s.text = s.text || s._tagvalue, s.start_date = t._helpers.parseDate(s.start_date), s.end_date = t._helpers.parseDate(s.end_date), t.addEvent(s), t._add_rec_marker && t.setCurrentView();
      }, t._dp_change_event_id = function(o, a) {
        t.getEvent(o) && t.changeEventId(o, a);
      }, t._dp_hook_delete = function(o, a) {
        if (t.getEvent(o))
          return a && o != a && (this.getUserData(o, n.action_param) == "true_deleted" && this.setUserData(o, n.action_param, "updated"), this.changeEventId(o, a)), this.deleteEvent(a, !0);
      }, t.setDp = function() {
        this._dp = n;
      }, t.setDp();
    }(this.$scheduler, this);
    var i = new Kt(this.$scheduler, this);
    i.attach(), this.attachEvent("onDestroy", function() {
      delete this._getRowData, delete this.$scheduler._dp, delete this.$scheduler._dataprocessor, delete this.$scheduler._set_event_text_style, delete this.$scheduler._dp_change_event_id, delete this.$scheduler._dp_hook_delete, delete this.$scheduler, i.detach();
    }), this.$scheduler.callEvent("onDataProcessorReady", [this]), this._initialized = !0, e._dataprocessor = this;
  }
}, setOnAfterUpdate: function(e) {
  this.attachEvent("onAfterUpdate", e);
}, setOnBeforeUpdateHandler: function(e) {
  this.attachEvent("onBeforeDataSending", e);
}, setAutoUpdate: function(e, i) {
  e = e || 2e3, this._user = i || (/* @__PURE__ */ new Date()).valueOf(), this._need_update = !1, this._update_busy = !1, this.attachEvent("onAfterUpdate", function(o, a, s, _) {
    this.afterAutoUpdate(o, a, s, _);
  }), this.attachEvent("onFullSync", function() {
    this.fullSync();
  });
  var t = this;
  let n = le.setInterval(function() {
    t.loadUpdate();
  }, e);
  this.attachEvent("onDestroy", function() {
    clearInterval(n);
  });
}, afterAutoUpdate: function(e, i, t, n) {
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
  var e = this, i = this.$scheduler.ajax, t = this.$scheduler.getUserData(0, "version"), n = this.serverProcessor + i.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + t].join("&");
  n = n.replace("editing=true&", ""), this.getUpdates(n, function(o) {
    var a = i.xpath("//userdata", o);
    e.$scheduler.setUserData(0, "version", e._getXmlNodeValue(a[0]));
    var s = i.xpath("//update", o);
    if (s.length) {
      e._silent_mode = !0;
      for (var _ = 0; _ < s.length; _++) {
        var r = s[_].getAttribute("status"), d = s[_].getAttribute("id"), l = s[_].getAttribute("parent");
        switch (r) {
          case "inserted":
            this.callEvent("insertCallback", [s[_], d, l]);
            break;
          case "updated":
            this.callEvent("updateCallback", [s[_], d, l]);
            break;
          case "deleted":
            this.callEvent("deleteCallback", [s[_], d, l]);
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
    var n = i[t];
    this.$scheduler.getUserData(n, this.action_param) && e.call(this, n);
  }
}, _prepareItemForJson(e) {
  const i = {}, t = this.$scheduler, n = t.utils.copy(e);
  for (let o in n) {
    let a = n[o];
    o.indexOf("_") !== 0 && (a ? a.getUTCFullYear ? i[o] = t._helpers.formatDate(a) : i[o] = typeof a == "object" ? this._prepareItemForJson(a) : a : a !== void 0 && (i[o] = a));
  }
  return i[this.action_param] = t.getUserData(e.id, this.action_param), i;
}, _prepareItemForForm(e) {
  const i = {}, t = this.$scheduler, n = t.utils.copy(e);
  for (var o in n) {
    let a = n[o];
    o.indexOf("_") !== 0 && (a ? a.getUTCFullYear ? i[o] = t._helpers.formatDate(a) : i[o] = typeof a == "object" ? this._prepareItemForForm(a) : a : i[o] = "");
  }
  return i[this.action_param] = t.getUserData(e.id, this.action_param), i;
}, _prepareDataItem: function(e) {
  return this._serializeAsJson ? this._prepareItemForJson(e) : this._prepareItemForForm(e);
}, _getRowData: function(e) {
  var i = this.$scheduler.getEvent(e);
  return i || (i = { id: e }), this._prepareDataItem(i);
} };
const Xt = { date: { month_full: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"], month_short: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_full: ["الأحد", "الأثنين", "ألثلاثاء", "الأربعاء", "ألحميس", "ألجمعة", "السبت"], day_short: ["احد", "اثنين", "ثلاثاء", "اربعاء", "خميس", "جمعة", "سبت"] }, labels: { dhx_cal_today_button: "اليوم", day_tab: "يوم", week_tab: "أسبوع", month_tab: "شهر", new_event: "حدث جديد", icon_save: "اخزن", icon_cancel: "الغاء", icon_details: "تفاصيل", icon_edit: "تحرير", icon_delete: "حذف", confirm_closing: "التغييرات سوف تضيع, هل انت متأكد؟", confirm_deleting: "الحدث سيتم حذفها نهائيا ، هل أنت متأكد؟", section_description: "الوصف", section_time: "الفترة الزمنية", full_day: "طوال اليوم", confirm_recurring: "هل تريد تحرير مجموعة كاملة من الأحداث المتكررة؟", section_recurring: "تكرار الحدث", button_recurring: "تعطيل", button_recurring_open: "تمكين", button_edit_series: "تحرير سلسلة", button_edit_occurrence: "تعديل نسخة", button_edit_occurrence_and_following: "This and following events", grid_tab: "جدول", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "يومي", repeat_radio_week: "أسبوعي", repeat_radio_month: "شهري", repeat_radio_year: "سنوي", repeat_radio_day_type: "كل", repeat_text_day_count: "يوم", repeat_radio_day_type2: "كل يوم عمل", repeat_week: " تكرار كل", repeat_text_week_count: "أسبوع في الأيام التالية:", repeat_radio_month_type: "تكرار", repeat_radio_month_start: "في", repeat_text_month_day: "يوم كل", repeat_text_month_count: "شهر", repeat_text_month_count2_before: "كل", repeat_text_month_count2_after: "شهر", repeat_year_label: "في", select_year_day2: "من", repeat_text_year_day: "يوم", select_year_month: "شهر", repeat_radio_end: "بدون تاريخ انتهاء", repeat_text_occurrences_count: "تكرارات", repeat_radio_end2: "بعد", repeat_radio_end3: "ينتهي في", repeat_never: "أبداً", repeat_daily: "كل يوم", repeat_workdays: "كل يوم عمل", repeat_weekly: "كل أسبوع", repeat_monthly: "كل شهر", repeat_yearly: "كل سنة", repeat_custom: "تخصيص", repeat_freq_day: "يوم", repeat_freq_week: "أسبوع", repeat_freq_month: "شهر", repeat_freq_year: "سنة", repeat_on_date: "في التاريخ", repeat_ends: "ينتهي", month_for_recurring: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], day_for_recurring: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] } }, Zt = { date: { month_full: ["Студзень", "Люты", "Сакавік", "Красавік", "Maй", "Чэрвень", "Ліпень", "Жнівень", "Верасень", "Кастрычнік", "Лістапад", "Снежань"], month_short: ["Студз", "Лют", "Сак", "Крас", "Maй", "Чэр", "Ліп", "Жнів", "Вер", "Каст", "Ліст", "Снеж"], day_full: ["Нядзеля", "Панядзелак", "Аўторак", "Серада", "Чацвер", "Пятніца", "Субота"], day_short: ["Нд", "Пн", "Аўт", "Ср", "Чцв", "Пт", "Сб"] }, labels: { dhx_cal_today_button: "Сёння", day_tab: "Дзень", week_tab: "Тыдзень", month_tab: "Месяц", new_event: "Новая падзея", icon_save: "Захаваць", icon_cancel: "Адмяніць", icon_details: "Дэталі", icon_edit: "Змяніць", icon_delete: "Выдаліць", confirm_closing: "", confirm_deleting: "Падзея будзе выдалена незваротна, працягнуць?", section_description: "Апісанне", section_time: "Перыяд часу", full_day: "Увесь дзень", confirm_recurring: "Вы хочаце змяніць усю серыю паўтаральных падзей?", section_recurring: "Паўтарэнне", button_recurring: "Адключана", button_recurring_open: "Уключана", button_edit_series: "Рэдагаваць серыю", button_edit_occurrence: "Рэдагаваць асобнік", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Спіс", date: "Дата", description: "Апісанне", year_tab: "Год", week_agenda_tab: "Спіс", grid_tab: "Спic", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Дзень", repeat_radio_week: "Тыдзень", repeat_radio_month: "Месяц", repeat_radio_year: "Год", repeat_radio_day_type: "Кожны", repeat_text_day_count: "дзень", repeat_radio_day_type2: "Кожны працоўны дзень", repeat_week: " Паўтараць кожны", repeat_text_week_count: "тыдзень", repeat_radio_month_type: "Паўтараць", repeat_radio_month_start: "", repeat_text_month_day: " чысла кожнага", repeat_text_month_count: "месяцу", repeat_text_month_count2_before: "кожны ", repeat_text_month_count2_after: "месяц", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "дзень", select_year_month: "", repeat_radio_end: "Без даты заканчэння", repeat_text_occurrences_count: "паўтораў", repeat_radio_end2: "", repeat_radio_end3: "Да ", repeat_never: "Ніколі", repeat_daily: "Кожны дзень", repeat_workdays: "Кожны працоўны дзень", repeat_weekly: "Кожны тыдзень", repeat_monthly: "Кожны месяц", repeat_yearly: "Кожны год", repeat_custom: "Наладжвальны", repeat_freq_day: "Дзень", repeat_freq_week: "Тыдзень", repeat_freq_month: "Месяц", repeat_freq_year: "Год", repeat_on_date: "На дату", repeat_ends: "Заканчваецца", month_for_recurring: ["Студзеня", "Лютага", "Сакавіка", "Красавіка", "Мая", "Чэрвеня", "Ліпeня", "Жніўня", "Верасня", "Кастрычніка", "Лістапада", "Снежня"], day_for_recurring: ["Нядзелю", "Панядзелак", "Аўторак", "Сераду", "Чацвер", "Пятніцу", "Суботу"] } }, Qt = { date: { month_full: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], month_short: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"], day_full: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"], day_short: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"] }, labels: { dhx_cal_today_button: "Hui", day_tab: "Dia", week_tab: "Setmana", month_tab: "Mes", new_event: "Nou esdeveniment", icon_save: "Guardar", icon_cancel: "Cancel·lar", icon_details: "Detalls", icon_edit: "Editar", icon_delete: "Esborrar", confirm_closing: "", confirm_deleting: "L'esdeveniment s'esborrarà definitivament, continuar ?", section_description: "Descripció", section_time: "Periode de temps", full_day: "Tot el dia", confirm_recurring: "¿Desitja modificar el conjunt d'esdeveniments repetits?", section_recurring: "Repeteixca l'esdeveniment", button_recurring: "Impedit", button_recurring_open: "Permés", button_edit_series: "Edit sèrie", button_edit_occurrence: "Edita Instància", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Data", description: "Descripció", year_tab: "Any", week_agenda_tab: "Agenda", grid_tab: "Taula", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diari", repeat_radio_week: "Setmanal", repeat_radio_month: "Mensual", repeat_radio_year: "Anual", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia", repeat_radio_day_type2: "Cada dia laborable", repeat_week: " Repetir cada", repeat_text_week_count: "setmana els dies següents:", repeat_radio_month_type: "Repetir", repeat_radio_month_start: "El", repeat_text_month_day: "dia cada", repeat_text_month_count: "mes", repeat_text_month_count2_before: "cada", repeat_text_month_count2_after: "mes", repeat_year_label: "El", select_year_day2: "de", repeat_text_year_day: "dia", select_year_month: "mes", repeat_radio_end: "Sense data de finalització", repeat_text_occurrences_count: "ocurrències", repeat_radio_end2: "Després", repeat_radio_end3: "Finalitzar el", repeat_never: "Mai", repeat_daily: "Cada dia", repeat_workdays: "Cada dia laborable", repeat_weekly: "Cada setmana", repeat_monthly: "Cada mes", repeat_yearly: "Cada any", repeat_custom: "Personalitzat", repeat_freq_day: "Dia", repeat_freq_week: "Setmana", repeat_freq_month: "Mes", repeat_freq_year: "Any", repeat_on_date: "En la data", repeat_ends: "Finalitza", month_for_recurring: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"], day_for_recurring: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"] } }, ea = { date: { month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], day_short: ["日", "一", "二", "三", "四", "五", "六"] }, labels: { dhx_cal_today_button: "今天", day_tab: "日", week_tab: "周", month_tab: "月", new_event: "新建日程", icon_save: "保存", icon_cancel: "关闭", icon_details: "详细", icon_edit: "编辑", icon_delete: "删除", confirm_closing: "请确认是否撤销修改!", confirm_deleting: "是否删除日程?", section_description: "描述", section_time: "时间范围", full_day: "整天", confirm_recurring: "请确认是否将日程设为重复模式?", section_recurring: "重复周期", button_recurring: "禁用", button_recurring_open: "启用", button_edit_series: "编辑系列", button_edit_occurrence: "编辑实例", button_edit_occurrence_and_following: "This and following events", agenda_tab: "议程", date: "日期", description: "说明", year_tab: "今年", week_agenda_tab: "议程", grid_tab: "电网", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "按天", repeat_radio_week: "按周", repeat_radio_month: "按月", repeat_radio_year: "按年", repeat_radio_day_type: "每", repeat_text_day_count: "天", repeat_radio_day_type2: "每个工作日", repeat_week: " 重复 每", repeat_text_week_count: "星期的:", repeat_radio_month_type: "重复", repeat_radio_month_start: "在", repeat_text_month_day: "日 每", repeat_text_month_count: "月", repeat_text_month_count2_before: "每", repeat_text_month_count2_after: "月", repeat_year_label: "在", select_year_day2: "的", repeat_text_year_day: "日", select_year_month: "月", repeat_radio_end: "无结束日期", repeat_text_occurrences_count: "次结束", repeat_radio_end2: "重复", repeat_radio_end3: "结束于", repeat_never: "从不", repeat_daily: "每天", repeat_workdays: "每个工作日", repeat_weekly: "每周", repeat_monthly: "每月", repeat_yearly: "每年", repeat_custom: "自定义", repeat_freq_day: "天", repeat_freq_week: "周", repeat_freq_month: "月", repeat_freq_year: "年", repeat_on_date: "在日期", repeat_ends: "结束", month_for_recurring: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], day_for_recurring: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"] } }, ta = { date: { month_full: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], month_short: ["Led", "Ún", "Bře", "Dub", "Kvě", "Čer", "Čec", "Srp", "Září", "Říj", "List", "Pro"], day_full: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"], day_short: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"] }, labels: { dhx_cal_today_button: "Dnes", day_tab: "Den", week_tab: "Týden", month_tab: "Měsíc", new_event: "Nová událost", icon_save: "Uložit", icon_cancel: "Zpět", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Smazat", confirm_closing: "", confirm_deleting: "Událost bude trvale smazána, opravdu?", section_description: "Poznámky", section_time: "Doba platnosti", confirm_recurring: "Přejete si upravit celou řadu opakovaných událostí?", section_recurring: "Opakování události", button_recurring: "Vypnuto", button_recurring_open: "Zapnuto", button_edit_series: "Edit series", button_edit_occurrence: "Upravit instance", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Program", date: "Datum", description: "Poznámka", year_tab: "Rok", full_day: "Full day", week_agenda_tab: "Program", grid_tab: "Mřížka", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Denně", repeat_radio_week: "Týdně", repeat_radio_month: "Měsíčně", repeat_radio_year: "Ročně", repeat_radio_day_type: "každý", repeat_text_day_count: "Den", repeat_radio_day_type2: "pracovní dny", repeat_week: "Opakuje každých", repeat_text_week_count: "Týdnů na:", repeat_radio_month_type: "u každého", repeat_radio_month_start: "na", repeat_text_month_day: "Den každého", repeat_text_month_count: "Měsíc", repeat_text_month_count2_before: "každý", repeat_text_month_count2_after: "Měsíc", repeat_year_label: "na", select_year_day2: "v", repeat_text_year_day: "Den v", select_year_month: "", repeat_radio_end: "bez data ukončení", repeat_text_occurrences_count: "Události", repeat_radio_end2: "po", repeat_radio_end3: "Konec", repeat_never: "Nikdy", repeat_daily: "Každý den", repeat_workdays: "Každý pracovní den", repeat_weekly: "Každý týden", repeat_monthly: "Každý měsíc", repeat_yearly: "Každý rok", repeat_custom: "Vlastní", repeat_freq_day: "Den", repeat_freq_week: "Týden", repeat_freq_month: "Měsíc", repeat_freq_year: "Rok", repeat_on_date: "Na datum", repeat_ends: "Končí", month_for_recurring: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], day_for_recurring: ["Neděle ", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"] } }, aa = { date: { month_full: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Uge", month_tab: "Måned", new_event: "Ny begivenhed", icon_save: "Gem", icon_cancel: "Fortryd", icon_details: "Detaljer", icon_edit: "Tilret", icon_delete: "Slet", confirm_closing: "Dine rettelser vil gå tabt.. Er dy sikker?", confirm_deleting: "Bigivenheden vil blive slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", confirm_recurring: "Vil du tilrette hele serien af gentagne begivenheder?", section_recurring: "Gentag begivenhed", button_recurring: "Frakoblet", button_recurring_open: "Tilkoblet", button_edit_series: "Rediger serien", button_edit_occurrence: "Rediger en kopi", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Dagsorden", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Dagsorden", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ugenlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "På hver arbejdsdag", repeat_week: " Gentager sig hver", repeat_text_week_count: "uge på følgende dage:", repeat_radio_month_type: "Hver den", repeat_radio_month_start: "Den", repeat_text_month_day: " i hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "Den", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "", repeat_radio_end: "Ingen slutdato", repeat_text_occurrences_count: "gentagelse", repeat_radio_end2: "Efter", repeat_radio_end3: "Slut", repeat_never: "Aldrig", repeat_daily: "Hver dag", repeat_workdays: "Hver hverdag", repeat_weekly: "Hver uge", repeat_monthly: "Hver måned", repeat_yearly: "Hvert år", repeat_custom: "Brugerdefineret", repeat_freq_day: "Dag", repeat_freq_week: "Uge", repeat_freq_month: "Måned", repeat_freq_year: "År", repeat_on_date: "På dato", repeat_ends: "Slutter", month_for_recurring: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], day_for_recurring: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, na = { date: { month_full: [" Januar", " Februar", " März ", " April", " Mai", " Juni", " Juli", " August", " September ", " Oktober", " November ", " Dezember"], month_short: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], day_full: ["Sonntag", "Montag", "Dienstag", " Mittwoch", " Donnerstag", "Freitag", "Samstag"], day_short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"] }, labels: { dhx_cal_today_button: "Heute", day_tab: "Tag", week_tab: "Woche", month_tab: "Monat", new_event: "neuer Eintrag", icon_save: "Speichern", icon_cancel: "Abbrechen", icon_details: "Details", icon_edit: "Ändern", icon_delete: "Löschen", confirm_closing: "", confirm_deleting: "Der Eintrag wird gelöscht", section_description: "Beschreibung", section_time: "Zeitspanne", full_day: "Ganzer Tag", confirm_recurring: "Wollen Sie alle Einträge bearbeiten oder nur diesen einzelnen Eintrag?", section_recurring: "Wiederholung", button_recurring: "Aus", button_recurring_open: "An", button_edit_series: "Bearbeiten Sie die Serie", button_edit_occurrence: "Bearbeiten Sie eine Kopie", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Datum", description: "Beschreibung", year_tab: "Jahre", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Täglich", repeat_radio_week: "Wöchentlich", repeat_radio_month: "Monatlich", repeat_radio_year: "Jährlich", repeat_radio_day_type: "jeden", repeat_text_day_count: "Tag", repeat_radio_day_type2: "an jedem Arbeitstag", repeat_week: " Wiederholt sich jede", repeat_text_week_count: "Woche am:", repeat_radio_month_type: "an jedem", repeat_radio_month_start: "am", repeat_text_month_day: "Tag eines jeden", repeat_text_month_count: "Monats", repeat_text_month_count2_before: "jeden", repeat_text_month_count2_after: "Monats", repeat_year_label: "am", select_year_day2: "im", repeat_text_year_day: "Tag im", select_year_month: "", repeat_radio_end: "kein Enddatum", repeat_text_occurrences_count: "Ereignissen", repeat_radio_end3: "Schluß", repeat_radio_end2: "nach", repeat_never: "Nie", repeat_daily: "Jeden Tag", repeat_workdays: "Jeden Werktag", repeat_weekly: "Jede Woche", repeat_monthly: "Jeden Monat", repeat_yearly: "Jedes Jahr", repeat_custom: "Benutzerdefiniert", repeat_freq_day: "Tag", repeat_freq_week: "Woche", repeat_freq_month: "Monat", repeat_freq_year: "Jahr", repeat_on_date: "Am Datum", repeat_ends: "Endet", month_for_recurring: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"], day_for_recurring: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"] } }, ra = { date: { month_full: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], month_short: ["ΙΑΝ", "ΦΕΒ", "ΜΑΡ", "ΑΠΡ", "ΜΑΙ", "ΙΟΥΝ", "ΙΟΥΛ", "ΑΥΓ", "ΣΕΠ", "ΟΚΤ", "ΝΟΕ", "ΔΕΚ"], day_full: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"], day_short: ["ΚΥ", "ΔΕ", "ΤΡ", "ΤΕ", "ΠΕ", "ΠΑ", "ΣΑ"] }, labels: { dhx_cal_today_button: "Σήμερα", day_tab: "Ημέρα", week_tab: "Εβδομάδα", month_tab: "Μήνας", new_event: "Νέο έργο", icon_save: "Αποθήκευση", icon_cancel: "Άκυρο", icon_details: "Λεπτομέρειες", icon_edit: "Επεξεργασία", icon_delete: "Διαγραφή", confirm_closing: "", confirm_deleting: "Το έργο θα διαγραφεί οριστικά. Θέλετε να συνεχίσετε;", section_description: "Περιγραφή", section_time: "Χρονική περίοδος", full_day: "Πλήρης Ημέρα", confirm_recurring: "Θέλετε να επεξεργασθείτε ολόκληρη την ομάδα των επαναλαμβανόμενων έργων;", section_recurring: "Επαναλαμβανόμενο έργο", button_recurring: "Ανενεργό", button_recurring_open: "Ενεργό", button_edit_series: "Επεξεργαστείτε τη σειρά", button_edit_occurrence: "Επεξεργασία ένα αντίγραφο", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Ημερήσια Διάταξη", date: "Ημερομηνία", description: "Περιγραφή", year_tab: "Έτος", week_agenda_tab: "Ημερήσια Διάταξη", grid_tab: "Πλέγμα", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Ημερησίως", repeat_radio_week: "Εβδομαδιαίως", repeat_radio_month: "Μηνιαίως", repeat_radio_year: "Ετησίως", repeat_radio_day_type: "Κάθε", repeat_text_day_count: "ημέρα", repeat_radio_day_type2: "Κάθε εργάσιμη", repeat_week: " Επανάληψη κάθε", repeat_text_week_count: "εβδομάδα τις επόμενες ημέρες:", repeat_radio_month_type: "Επανάληψη", repeat_radio_month_start: "Την", repeat_text_month_day: "ημέρα κάθε", repeat_text_month_count: "μήνα", repeat_text_month_count2_before: "κάθε", repeat_text_month_count2_after: "μήνα", repeat_year_label: "Την", select_year_day2: "του", repeat_text_year_day: "ημέρα", select_year_month: "μήνα", repeat_radio_end: "Χωρίς ημερομηνία λήξεως", repeat_text_occurrences_count: "επαναλήψεις", repeat_radio_end3: "Λήγει την", repeat_radio_end2: "Μετά από", repeat_never: "Ποτέ", repeat_daily: "Κάθε μέρα", repeat_workdays: "Κάθε εργάσιμη μέρα", repeat_weekly: "Κάθε εβδομάδα", repeat_monthly: "Κάθε μήνα", repeat_yearly: "Κάθε χρόνο", repeat_custom: "Προσαρμοσμένο", repeat_freq_day: "Ημέρα", repeat_freq_week: "Εβδομάδα", repeat_freq_month: "Μήνας", repeat_freq_year: "Χρόνος", repeat_on_date: "Σε ημερομηνία", repeat_ends: "Λήγει", month_for_recurring: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάϊος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"], day_for_recurring: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"] } }, ia = { date: { month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, labels: { dhx_cal_today_button: "Today", day_tab: "Day", week_tab: "Week", month_tab: "Month", new_event: "New event", icon_save: "Save", icon_cancel: "Cancel", icon_details: "Details", icon_edit: "Edit", icon_delete: "Delete", confirm_closing: "", confirm_deleting: "Event will be deleted permanently, are you sure?", section_description: "Description", section_time: "Time period", full_day: "Full day", confirm_recurring: "Edit recurring event", section_recurring: "Repeat event", button_recurring: "Disabled", button_recurring_open: "Enabled", button_edit_series: "All events", button_edit_occurrence: "This event", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Date", description: "Description", year_tab: "Year", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daily", repeat_radio_week: "Weekly", repeat_radio_month: "Monthly", repeat_radio_year: "Yearly", repeat_radio_day_type: "Every", repeat_text_day_count: "day", repeat_radio_day_type2: "Every workday", repeat_week: " Repeat every", repeat_text_week_count: "week next days:", repeat_radio_month_type: "Repeat", repeat_radio_month_start: "On", repeat_text_month_day: "day every", repeat_text_month_count: "month", repeat_text_month_count2_before: "every", repeat_text_month_count2_after: "month", repeat_year_label: "On", select_year_day2: "of", repeat_text_year_day: "day", select_year_month: "month", repeat_radio_end: "No end date", repeat_text_occurrences_count: "occurrences", repeat_radio_end2: "After", repeat_radio_end3: "End by", repeat_never: "Never", repeat_daily: "Every day", repeat_workdays: "Every weekday", repeat_weekly: "Every week", repeat_monthly: "Every month", repeat_yearly: "Every year", repeat_custom: "Custom", repeat_freq_day: "Day", repeat_freq_week: "Week", repeat_freq_month: "Month", repeat_freq_year: "Year", repeat_on_date: "On date", repeat_ends: "Ends", month_for_recurring: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], day_for_recurring: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] } }, oa = { date: { month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"], day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] }, labels: { dhx_cal_today_button: "Hoy", day_tab: "Día", week_tab: "Semana", month_tab: "Mes", new_event: "Nuevo evento", icon_save: "Guardar", icon_cancel: "Cancelar", icon_details: "Detalles", icon_edit: "Editar", icon_delete: "Eliminar", confirm_closing: "", confirm_deleting: "El evento se borrará definitivamente, ¿continuar?", section_description: "Descripción", section_time: "Período", full_day: "Todo el día", confirm_recurring: "¿Desea modificar el conjunto de eventos repetidos?", section_recurring: "Repita el evento", button_recurring: "Impedido", button_recurring_open: "Permitido", button_edit_series: "Editar la serie", button_edit_occurrence: "Editar este evento", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Día", date: "Fecha", description: "Descripción", year_tab: "Año", week_agenda_tab: "Día", grid_tab: "Reja", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diariamente", repeat_radio_week: "Semanalmente", repeat_radio_month: "Mensualmente", repeat_radio_year: "Anualmente", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia", repeat_radio_day_type2: "Cada jornada de trabajo", repeat_week: " Repetir cada", repeat_text_week_count: "semana:", repeat_radio_month_type: "Repita", repeat_radio_month_start: "El", repeat_text_month_day: "dia cada ", repeat_text_month_count: "mes", repeat_text_month_count2_before: "cada", repeat_text_month_count2_after: "mes", repeat_year_label: "El", select_year_day2: "del", repeat_text_year_day: "dia", select_year_month: "mes", repeat_radio_end: "Sin fecha de finalización", repeat_text_occurrences_count: "ocurrencias", repeat_radio_end3: "Fin", repeat_radio_end2: "Después de", repeat_never: "Nunca", repeat_daily: "Cada día", repeat_workdays: "Cada día laborable", repeat_weekly: "Cada semana", repeat_monthly: "Cada mes", repeat_yearly: "Cada año", repeat_custom: "Personalizado", repeat_freq_day: "Día", repeat_freq_week: "Semana", repeat_freq_month: "Mes", repeat_freq_year: "Año", repeat_on_date: "En la fecha", repeat_ends: "Termina", month_for_recurring: ["Enero", "Febrero", "Маrzo", "Аbril", "Mayo", "Junio", "Julio", "Аgosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"], day_for_recurring: ["Domingo", "Lunes", "Martes", "Miércoles", "Jeuves", "Viernes", "Sabado"] } }, sa = { date: { month_full: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], month_short: ["Tam", "Hel", "Maa", "Huh", "Tou", "Kes", "Hei", "Elo", "Syy", "Lok", "Mar", "Jou"], day_full: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"], day_short: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"] }, labels: { dhx_cal_today_button: "Tänään", day_tab: "Päivä", week_tab: "Viikko", month_tab: "Kuukausi", new_event: "Uusi tapahtuma", icon_save: "Tallenna", icon_cancel: "Peru", icon_details: "Tiedot", icon_edit: "Muokkaa", icon_delete: "Poista", confirm_closing: "", confirm_deleting: "Haluatko varmasti poistaa tapahtuman?", section_description: "Kuvaus", section_time: "Aikajakso", full_day: "Koko päivä", confirm_recurring: "Haluatko varmasti muokata toistuvan tapahtuman kaikkia jaksoja?", section_recurring: "Toista tapahtuma", button_recurring: "Ei k&auml;yt&ouml;ss&auml;", button_recurring_open: "K&auml;yt&ouml;ss&auml;", button_edit_series: "Muokkaa sarja", button_edit_occurrence: "Muokkaa kopio", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Esityslista", date: "Päivämäärä", description: "Kuvaus", year_tab: "Vuoden", week_agenda_tab: "Esityslista", grid_tab: "Ritilä", drag_to_create: "Luo uusi vetämällä", drag_to_move: "Siirrä vetämällä", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "P&auml;ivitt&auml;in", repeat_radio_week: "Viikoittain", repeat_radio_month: "Kuukausittain", repeat_radio_year: "Vuosittain", repeat_radio_day_type: "Joka", repeat_text_day_count: "p&auml;iv&auml;", repeat_radio_day_type2: "Joka arkip&auml;iv&auml;", repeat_week: "Toista joka", repeat_text_week_count: "viikko n&auml;in&auml; p&auml;ivin&auml;:", repeat_radio_month_type: "Toista", repeat_radio_month_start: "", repeat_text_month_day: "p&auml;iv&auml;n&auml; joka", repeat_text_month_count: "kuukausi", repeat_text_month_count2_before: "joka", repeat_text_month_count2_after: "kuukausi", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "p&auml;iv&auml;", select_year_month: "kuukausi", repeat_radio_end: "Ei loppumisaikaa", repeat_text_occurrences_count: "Toiston j&auml;lkeen", repeat_radio_end3: "Loppuu", repeat_radio_end2: "", repeat_never: "Ei koskaan", repeat_daily: "Joka päivä", repeat_workdays: "Joka arkipäivä", repeat_weekly: "Joka viikko", repeat_monthly: "Joka kuukausi", repeat_yearly: "Joka vuosi", repeat_custom: "Mukautettu", repeat_freq_day: "Päivä", repeat_freq_week: "Viikko", repeat_freq_month: "Kuukausi", repeat_freq_year: "Vuosi", repeat_on_date: "Tiettynä päivänä", repeat_ends: "Päättyy", month_for_recurring: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kes&auml;kuu", "Hein&auml;kuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"], day_for_recurring: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"] } }, da = { date: { month_full: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], month_short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"], day_full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"], day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] }, labels: { dhx_cal_today_button: "Aujourd'hui", day_tab: "Jour", week_tab: "Semaine", month_tab: "Mois", new_event: "Nouvel événement", icon_save: "Enregistrer", icon_cancel: "Annuler", icon_details: "Détails", icon_edit: "Modifier", icon_delete: "Effacer", confirm_closing: "", confirm_deleting: "L'événement sera effacé sans appel, êtes-vous sûr ?", section_description: "Description", section_time: "Période", full_day: "Journée complète", confirm_recurring: "Voulez-vous éditer toute une série d'évènements répétés?", section_recurring: "Périodicité", button_recurring: "Désactivé", button_recurring_open: "Activé", button_edit_series: "Modifier la série", button_edit_occurrence: "Modifier une copie", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Jour", date: "Date", description: "Description", year_tab: "Année", week_agenda_tab: "Jour", grid_tab: "Grille", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Quotidienne", repeat_radio_week: "Hebdomadaire", repeat_radio_month: "Mensuelle", repeat_radio_year: "Annuelle", repeat_radio_day_type: "Chaque", repeat_text_day_count: "jour", repeat_radio_day_type2: "Chaque journée de travail", repeat_week: " Répéter toutes les", repeat_text_week_count: "semaine:", repeat_radio_month_type: "Répéter", repeat_radio_month_start: "Le", repeat_text_month_day: "jour chaque", repeat_text_month_count: "mois", repeat_text_month_count2_before: "chaque", repeat_text_month_count2_after: "mois", repeat_year_label: "Le", select_year_day2: "du", repeat_text_year_day: "jour", select_year_month: "mois", repeat_radio_end: "Pas de date d&quot;achèvement", repeat_text_occurrences_count: "occurrences", repeat_radio_end3: "Fin", repeat_radio_end2: "Après", repeat_never: "Jamais", repeat_daily: "Chaque jour", repeat_workdays: "Chaque jour ouvrable", repeat_weekly: "Chaque semaine", repeat_monthly: "Chaque mois", repeat_yearly: "Chaque année", repeat_custom: "Personnalisé", repeat_freq_day: "Jour", repeat_freq_week: "Semaine", repeat_freq_month: "Mois", repeat_freq_year: "Année", repeat_on_date: "À la date", repeat_ends: "Se termine", month_for_recurring: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], day_for_recurring: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] } }, _a = { date: { month_full: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], month_short: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"], day_full: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"], day_short: ["א", "ב", "ג", "ד", "ה", "ו", "ש"] }, labels: { dhx_cal_today_button: "היום", day_tab: "יום", week_tab: "שבוע", month_tab: "חודש", new_event: "ארוע חדש", icon_save: "שמור", icon_cancel: "בטל", icon_details: "פרטים", icon_edit: "ערוך", icon_delete: "מחק", confirm_closing: "", confirm_deleting: "ארוע ימחק סופית.להמשיך?", section_description: "תיאור", section_time: "תקופה", confirm_recurring: "האם ברצונך לשנות כל סדרת ארועים מתמשכים?", section_recurring: "להעתיק ארוע", button_recurring: "לא פעיל", button_recurring_open: "פעיל", full_day: "יום שלם", button_edit_series: "ערוך את הסדרה", button_edit_occurrence: "עריכת עותק", button_edit_occurrence_and_following: "This and following events", agenda_tab: "סדר יום", date: "תאריך", description: "תיאור", year_tab: "לשנה", week_agenda_tab: "סדר יום", grid_tab: "סורג", drag_to_create: "Drag to create", drag_to_move: "גרור כדי להזיז", message_ok: "OK", message_cancel: "בטל", next: "הבא", prev: "הקודם", year: "שנה", month: "חודש", day: "יום", hour: "שעה", minute: "דקה", repeat_radio_day: "יומי", repeat_radio_week: "שבועי", repeat_radio_month: "חודשי", repeat_radio_year: "שנתי", repeat_radio_day_type: "חזור כל", repeat_text_day_count: "ימים", repeat_radio_day_type2: "חזור כל יום עבודה", repeat_week: " חזור כל", repeat_text_week_count: "שבוע לפי ימים:", repeat_radio_month_type: "חזור כל", repeat_radio_month_start: "כל", repeat_text_month_day: "ימים כל", repeat_text_month_count: "חודשים", repeat_text_month_count2_before: "חזור כל", repeat_text_month_count2_after: "חודש", repeat_year_label: "כל", select_year_day2: "בחודש", repeat_text_year_day: "ימים", select_year_month: "חודש", repeat_radio_end: "לעולם לא מסתיים", repeat_text_occurrences_count: "אירועים", repeat_radio_end3: "מסתיים ב", repeat_radio_end2: "אחרי", repeat_never: "אף פעם", repeat_daily: "כל יום", repeat_workdays: "כל יום עבודה", repeat_weekly: "כל שבוע", repeat_monthly: "כל חודש", repeat_yearly: "כל שנה", repeat_custom: "מותאם אישית", repeat_freq_day: "יום", repeat_freq_week: "שבוע", repeat_freq_month: "חודש", repeat_freq_year: "שנה", repeat_on_date: "בתאריך", repeat_ends: "מסתיים", month_for_recurring: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"], day_for_recurring: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"] } }, la = { date: { month_full: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], month_short: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Vasárnap", "Hétfõ", "Kedd", "Szerda", "Csütörtök", "Péntek", "szombat"], day_short: ["Va", "Hé", "Ke", "Sze", "Csü", "Pé", "Szo"] }, labels: { dhx_cal_today_button: "Ma", day_tab: "Nap", week_tab: "Hét", month_tab: "Hónap", new_event: "Új esemény", icon_save: "Mentés", icon_cancel: "Mégse", icon_details: "Részletek", icon_edit: "Szerkesztés", icon_delete: "Törlés", confirm_closing: "", confirm_deleting: "Az esemény törölve lesz, biztosan folytatja?", section_description: "Leírás", section_time: "Idõszak", full_day: "Egesz napos", confirm_recurring: "Biztosan szerkeszteni akarod az összes ismétlõdõ esemény beállítását?", section_recurring: "Esemény ismétlése", button_recurring: "Tiltás", button_recurring_open: "Engedélyezés", button_edit_series: "Edit series", button_edit_occurrence: "Szerkesztés bíróság", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Napirend", date: "Dátum", description: "Leírás", year_tab: "Év", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Napi", repeat_radio_week: "Heti", repeat_radio_month: "Havi", repeat_radio_year: "Éves", repeat_radio_day_type: "Minden", repeat_text_day_count: "nap", repeat_radio_day_type2: "Minden munkanap", repeat_week: " Ismételje meg minden", repeat_text_week_count: "héten a következő napokon:", repeat_radio_month_type: "Ismétlés", repeat_radio_month_start: "Ekkor", repeat_text_month_day: "nap minden", repeat_text_month_count: "hónapban", repeat_text_month_count2_before: "minden", repeat_text_month_count2_after: "hónapban", repeat_year_label: "Ekkor", select_year_day2: "-án/-én", repeat_text_year_day: "nap", select_year_month: "hónap", repeat_radio_end: "Nincs befejezési dátum", repeat_text_occurrences_count: "esemény", repeat_radio_end2: "Után", repeat_radio_end3: "Befejező dátum", repeat_never: "Soha", repeat_daily: "Minden nap", repeat_workdays: "Minden munkanap", repeat_weekly: "Minden héten", repeat_monthly: "Minden hónapban", repeat_yearly: "Minden évben", repeat_custom: "Egyedi", repeat_freq_day: "Nap", repeat_freq_week: "Hét", repeat_freq_month: "Hónap", repeat_freq_year: "Év", repeat_on_date: "Dátum szerint", repeat_ends: "Befejeződik", month_for_recurring: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"], day_for_recurring: ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"] } }, ca = { date: { month_full: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"], day_full: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], day_short: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] }, labels: { dhx_cal_today_button: "Hari Ini", day_tab: "Hari", week_tab: "Minggu", month_tab: "Bulan", new_event: "Acara Baru", icon_save: "Simpan", icon_cancel: "Batal", icon_details: "Detail", icon_edit: "Edit", icon_delete: "Hapus", confirm_closing: "", confirm_deleting: "Acara akan dihapus", section_description: "Keterangan", section_time: "Periode", full_day: "Hari penuh", confirm_recurring: "Apakah acara ini akan berulang?", section_recurring: "Acara Rutin", button_recurring: "Tidak Difungsikan", button_recurring_open: "Difungsikan", button_edit_series: "Mengedit seri", button_edit_occurrence: "Mengedit salinan", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Tanggal", description: "Keterangan", year_tab: "Tahun", week_agenda_tab: "Agenda", grid_tab: "Tabel", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Harian", repeat_radio_week: "Mingguan", repeat_radio_month: "Bulanan", repeat_radio_year: "Tahunan", repeat_radio_day_type: "Setiap", repeat_text_day_count: "hari", repeat_radio_day_type2: "Setiap hari kerja", repeat_week: " Ulangi setiap", repeat_text_week_count: "minggu pada hari berikut:", repeat_radio_month_type: "Ulangi", repeat_radio_month_start: "Pada", repeat_text_month_day: "hari setiap", repeat_text_month_count: "bulan", repeat_text_month_count2_before: "setiap", repeat_text_month_count2_after: "bulan", repeat_year_label: "Pada", select_year_day2: "dari", repeat_text_year_day: "hari", select_year_month: "bulan", repeat_radio_end: "Tanpa tanggal akhir", repeat_text_occurrences_count: "kejadian", repeat_radio_end2: "Setelah", repeat_radio_end3: "Berakhir pada", repeat_never: "Tidak pernah", repeat_daily: "Setiap hari", repeat_workdays: "Setiap hari kerja", repeat_weekly: "Setiap minggu", repeat_monthly: "Setiap bulan", repeat_yearly: "Setiap tahun", repeat_custom: "Kustom", repeat_freq_day: "Hari", repeat_freq_week: "Minggu", repeat_freq_month: "Bulan", repeat_freq_year: "Tahun", repeat_on_date: "Pada tanggal", repeat_ends: "Berakhir", month_for_recurring: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] } }, ha = { date: { month_full: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], month_short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"], day_full: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"], day_short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"] }, labels: { dhx_cal_today_button: "Oggi", day_tab: "Giorno", week_tab: "Settimana", month_tab: "Mese", new_event: "Nuovo evento", icon_save: "Salva", icon_cancel: "Chiudi", icon_details: "Dettagli", icon_edit: "Modifica", icon_delete: "Elimina", confirm_closing: "", confirm_deleting: "L'evento sarà eliminato, siete sicuri?", section_description: "Descrizione", section_time: "Periodo di tempo", full_day: "Intera giornata", confirm_recurring: "Vuoi modificare l'intera serie di eventi?", section_recurring: "Ripetere l'evento", button_recurring: "Disattivato", button_recurring_open: "Attivato", button_edit_series: "Modificare la serie", button_edit_occurrence: "Modificare una copia", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Data", description: "Descrizione", year_tab: "Anno", week_agenda_tab: "Agenda", grid_tab: "Griglia", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Quotidiano", repeat_radio_week: "Settimanale", repeat_radio_month: "Mensile", repeat_radio_year: "Annuale", repeat_radio_day_type: "Ogni", repeat_text_day_count: "giorno", repeat_radio_day_type2: "Ogni giornata lavorativa", repeat_week: " Ripetere ogni", repeat_text_week_count: "settimana:", repeat_radio_month_type: "Ripetere", repeat_radio_month_start: "Il", repeat_text_month_day: "giorno ogni", repeat_text_month_count: "mese", repeat_text_month_count2_before: "ogni", repeat_text_month_count2_after: "mese", repeat_year_label: "Il", select_year_day2: "del", repeat_text_year_day: "giorno", select_year_month: "mese", repeat_radio_end: "Senza data finale", repeat_text_occurrences_count: "occorenze", repeat_radio_end3: "Fine", repeat_radio_end2: "Dopo", repeat_never: "Mai", repeat_daily: "Ogni giorno", repeat_workdays: "Ogni giorno feriale", repeat_weekly: "Ogni settimana", repeat_monthly: "Ogni mese", repeat_yearly: "Ogni anno", repeat_custom: "Personalizzato", repeat_freq_day: "Giorno", repeat_freq_week: "Settimana", repeat_freq_month: "Mese", repeat_freq_year: "Anno", repeat_on_date: "Alla data", repeat_ends: "Finisce", month_for_recurring: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Jiugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"], day_for_recurring: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Jovedì", "Venerdì", "Sabato"] } }, ua = { date: { month_full: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_full: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], day_short: ["日", "月", "火", "水", "木", "金", "土"] }, labels: { dhx_cal_today_button: "今日", day_tab: "日", week_tab: "週", month_tab: "月", new_event: "新イベント", icon_save: "保存", icon_cancel: "キャンセル", icon_details: "詳細", icon_edit: "編集", icon_delete: "削除", confirm_closing: "", confirm_deleting: "イベント完全に削除されます、宜しいですか？", section_description: "デスクリプション", section_time: "期間", confirm_recurring: "繰り返されているイベントを全て編集しますか？", section_recurring: "イベントを繰り返す", button_recurring: "無効", button_recurring_open: "有効", full_day: "終日", button_edit_series: "シリーズを編集します", button_edit_occurrence: "コピーを編集", button_edit_occurrence_and_following: "This and following events", agenda_tab: "議題は", date: "日付", description: "説明", year_tab: "今年", week_agenda_tab: "議題は", grid_tab: "グリッド", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "毎日", repeat_radio_week: "毎週", repeat_radio_month: "毎月", repeat_radio_year: "毎年", repeat_radio_day_type: "毎", repeat_text_day_count: "日", repeat_radio_day_type2: "毎営業日", repeat_week: " 繰り返し毎", repeat_text_week_count: "週 次の日:", repeat_radio_month_type: "繰り返し", repeat_radio_month_start: "オン", repeat_text_month_day: "日毎", repeat_text_month_count: "月", repeat_text_month_count2_before: "毎", repeat_text_month_count2_after: "月", repeat_year_label: "オン", select_year_day2: "の", repeat_text_year_day: "日", select_year_month: "月", repeat_radio_end: "終了日なし", repeat_text_occurrences_count: "回数", repeat_radio_end2: "後", repeat_radio_end3: "終了日まで", repeat_never: "決して", repeat_daily: "毎日", repeat_workdays: "毎営業日", repeat_weekly: "毎週", repeat_monthly: "毎月", repeat_yearly: "毎年", repeat_custom: "カスタム", repeat_freq_day: "日", repeat_freq_week: "週", repeat_freq_month: "月", repeat_freq_year: "年", repeat_on_date: "日にち", repeat_ends: "終了", month_for_recurring: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], day_for_recurring: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"] } };
class fa {
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
const pa = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Mon", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "I dag", day_tab: "Dag", week_tab: "Uke", month_tab: "Måned", new_event: "Ny hendelse", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Rediger", icon_delete: "Slett", confirm_closing: "", confirm_deleting: "Hendelsen vil bli slettet permanent. Er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", confirm_recurring: "Vil du forandre hele dette settet av repeterende hendelser?", section_recurring: "Repeter hendelsen", button_recurring: "Av", button_recurring_open: "På", button_edit_series: "Rediger serien", button_edit_occurrence: "Redigere en kopi", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ukentlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "Alle hverdager", repeat_week: " Gjentas hver", repeat_text_week_count: "uke på:", repeat_radio_month_type: "På hver", repeat_radio_month_start: "På", repeat_text_month_day: "dag hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "på", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "", repeat_radio_end: "Ingen sluttdato", repeat_text_occurrences_count: "forekomst", repeat_radio_end3: "Stop den", repeat_radio_end2: "Etter", repeat_never: "Aldri", repeat_daily: "Hver dag", repeat_workdays: "Hver ukedag", repeat_weekly: "Hver uke", repeat_monthly: "Hver måned", repeat_yearly: "Hvert år", repeat_custom: "Tilpasset", repeat_freq_day: "Dag", repeat_freq_week: "Uke", repeat_freq_month: "Måned", repeat_freq_year: "År", repeat_on_date: "På dato", repeat_ends: "Slutter", month_for_recurring: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Sondag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, va = { date: { month_full: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"], day_short: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"] }, labels: { dhx_cal_today_button: "Vandaag", day_tab: "Dag", week_tab: "Week", month_tab: "Maand", new_event: "Nieuw item", icon_save: "Opslaan", icon_cancel: "Annuleren", icon_details: "Details", icon_edit: "Bewerken", icon_delete: "Verwijderen", confirm_closing: "", confirm_deleting: "Item zal permanent worden verwijderd, doorgaan?", section_description: "Beschrijving", section_time: "Tijd periode", full_day: "Hele dag", confirm_recurring: "Wilt u alle terugkerende items bijwerken?", section_recurring: "Item herhalen", button_recurring: "Uit", button_recurring_open: "Aan", button_edit_series: "Bewerk de serie", button_edit_occurrence: "Bewerk een kopie", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Datum", description: "Omschrijving", year_tab: "Jaar", week_agenda_tab: "Agenda", grid_tab: "Tabel", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dagelijks", repeat_radio_week: "Wekelijks", repeat_radio_month: "Maandelijks", repeat_radio_year: "Jaarlijks", repeat_radio_day_type: "Elke", repeat_text_day_count: "dag(en)", repeat_radio_day_type2: "Elke werkdag", repeat_week: " Herhaal elke", repeat_text_week_count: "week op de volgende dagen:", repeat_radio_month_type: "Herhaal", repeat_radio_month_start: "Op", repeat_text_month_day: "dag iedere", repeat_text_month_count: "maanden", repeat_text_month_count2_before: "iedere", repeat_text_month_count2_after: "maanden", repeat_year_label: "Op", select_year_day2: "van", repeat_text_year_day: "dag", select_year_month: "maand", repeat_radio_end: "Geen eind datum", repeat_text_occurrences_count: "keren", repeat_radio_end3: "Eindigd per", repeat_radio_end2: "Na", repeat_never: "Nooit", repeat_daily: "Elke dag", repeat_workdays: "Elke werkdag", repeat_weekly: "Elke week", repeat_monthly: "Elke maand", repeat_yearly: "Elk jaar", repeat_custom: "Aangepast", repeat_freq_day: "Dag", repeat_freq_week: "Week", repeat_freq_month: "Maand", repeat_freq_year: "Jaar", repeat_on_date: "Op datum", repeat_ends: "Eindigt", month_for_recurring: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"], day_for_recurring: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"] } }, ma = { date: { month_full: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], month_short: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"], day_full: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"], day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Uke", month_tab: "Måned", new_event: "Ny", icon_save: "Lagre", icon_cancel: "Avbryt", icon_details: "Detaljer", icon_edit: "Endre", icon_delete: "Slett", confirm_closing: "Endringer blir ikke lagret, er du sikker?", confirm_deleting: "Oppføringen vil bli slettet, er du sikker?", section_description: "Beskrivelse", section_time: "Tidsperiode", full_day: "Full dag", confirm_recurring: "Vil du endre hele settet med repeterende oppføringer?", section_recurring: "Repeterende oppføring", button_recurring: "Ikke aktiv", button_recurring_open: "Aktiv", button_edit_series: "Rediger serien", button_edit_occurrence: "Redigere en kopi", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Dato", description: "Beskrivelse", year_tab: "År", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Daglig", repeat_radio_week: "Ukentlig", repeat_radio_month: "Månedlig", repeat_radio_year: "Årlig", repeat_radio_day_type: "Hver", repeat_text_day_count: "dag", repeat_radio_day_type2: "Hver arbeidsdag", repeat_week: " Gjenta hver", repeat_text_week_count: "uke neste dager:", repeat_radio_month_type: "Gjenta", repeat_radio_month_start: "På", repeat_text_month_day: "dag hver", repeat_text_month_count: "måned", repeat_text_month_count2_before: "hver", repeat_text_month_count2_after: "måned", repeat_year_label: "På", select_year_day2: "av", repeat_text_year_day: "dag", select_year_month: "måned", repeat_radio_end: "Ingen sluttdato", repeat_text_occurrences_count: "forekomster", repeat_radio_end2: "Etter", repeat_radio_end3: "Slutt innen", repeat_never: "Aldri", repeat_daily: "Hver dag", repeat_workdays: "Hver ukedag", repeat_weekly: "Hver uke", repeat_monthly: "Hver måned", repeat_yearly: "Hvert år", repeat_custom: "Tilpasset", repeat_freq_day: "Dag", repeat_freq_week: "Uke", repeat_freq_month: "Måned", repeat_freq_year: "År", repeat_on_date: "På dato", repeat_ends: "Slutter", month_for_recurring: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"], day_for_recurring: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] } }, ga = { date: { month_full: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"], month_short: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"], day_full: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"], day_short: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"] }, labels: { dhx_cal_today_button: "Dziś", day_tab: "Dzień", week_tab: "Tydzień", month_tab: "Miesiąc", new_event: "Nowe zdarzenie", icon_save: "Zapisz", icon_cancel: "Anuluj", icon_details: "Szczegóły", icon_edit: "Edytuj", icon_delete: "Usuń", confirm_closing: "", confirm_deleting: "Zdarzenie zostanie usunięte na zawsze, kontynuować?", section_description: "Opis", section_time: "Okres czasu", full_day: "Cały dzień", confirm_recurring: "Czy chcesz edytować cały zbiór powtarzających się zdarzeń?", section_recurring: "Powtórz zdarzenie", button_recurring: "Nieaktywne", button_recurring_open: "Aktywne", button_edit_series: "Edytuj serię", button_edit_occurrence: "Edytuj kopię", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Data", description: "Opis", year_tab: "Rok", week_agenda_tab: "Agenda", grid_tab: "Tabela", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Codziennie", repeat_radio_week: "Co tydzie", repeat_radio_month: "Co miesic", repeat_radio_year: "Co rok", repeat_radio_day_type: "Kadego", repeat_text_day_count: "dnia", repeat_radio_day_type2: "Kadego dnia roboczego", repeat_week: " Powtarzaj kadego", repeat_text_week_count: "tygodnia w dni:", repeat_radio_month_type: "Powtrz", repeat_radio_month_start: "W", repeat_text_month_day: "dnia kadego", repeat_text_month_count: "miesica", repeat_text_month_count2_before: "kadego", repeat_text_month_count2_after: "miesica", repeat_year_label: "W", select_year_day2: "miesica", repeat_text_year_day: "dnia miesica", select_year_month: "", repeat_radio_end: "Bez daty kocowej", repeat_text_occurrences_count: "wystpieniu/ach", repeat_radio_end3: "Zakocz w", repeat_radio_end2: "Po", repeat_never: "Nigdy", repeat_daily: "Codziennie", repeat_workdays: "Każdy dzień roboczy", repeat_weekly: "Co tydzień", repeat_monthly: "Co miesiąc", repeat_yearly: "Co rok", repeat_custom: "Niestandardowy", repeat_freq_day: "Dzień", repeat_freq_week: "Tydzień", repeat_freq_month: "Miesiąc", repeat_freq_year: "Rok", repeat_on_date: "W dniu", repeat_ends: "Kończy się", month_for_recurring: ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwca", "Lipca", "Sierpnia", "Wrzenia", "Padziernka", "Listopada", "Grudnia"], day_for_recurring: ["Niedziela", "Poniedziaek", "Wtorek", "roda", "Czwartek", "Pitek", "Sobota"] } }, ya = { date: { month_full: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], month_short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], day_full: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"], day_short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] }, labels: { dhx_cal_today_button: "Hoje", day_tab: "Dia", week_tab: "Semana", month_tab: "Mês", new_event: "Novo evento", icon_save: "Salvar", icon_cancel: "Cancelar", icon_details: "Detalhes", icon_edit: "Editar", icon_delete: "Deletar", confirm_closing: "", confirm_deleting: "Tem certeza que deseja excluir?", section_description: "Descrição", section_time: "Período de tempo", full_day: "Dia inteiro", confirm_recurring: "Deseja editar todos esses eventos repetidos?", section_recurring: "Repetir evento", button_recurring: "Desabilitar", button_recurring_open: "Habilitar", button_edit_series: "Editar a série", button_edit_occurrence: "Editar uma cópia", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Dia", date: "Data", description: "Descrição", year_tab: "Ano", week_agenda_tab: "Dia", grid_tab: "Grade", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Diário", repeat_radio_week: "Semanal", repeat_radio_month: "Mensal", repeat_radio_year: "Anual", repeat_radio_day_type: "Cada", repeat_text_day_count: "dia(s)", repeat_radio_day_type2: "Cada trabalho diário", repeat_week: " Repita cada", repeat_text_week_count: "semana:", repeat_radio_month_type: "Repetir", repeat_radio_month_start: "Em", repeat_text_month_day: "todo dia", repeat_text_month_count: "mês", repeat_text_month_count2_before: "todo", repeat_text_month_count2_after: "mês", repeat_year_label: "Em", select_year_day2: "of", repeat_text_year_day: "dia", select_year_month: "mês", repeat_radio_end: "Sem data final", repeat_text_occurrences_count: "ocorrências", repeat_radio_end3: "Fim", repeat_radio_end2: "Depois", repeat_never: "Nunca", repeat_daily: "Todos os dias", repeat_workdays: "Todos os dias úteis", repeat_weekly: "Toda semana", repeat_monthly: "Todo mês", repeat_yearly: "Todo ano", repeat_custom: "Personalizado", repeat_freq_day: "Dia", repeat_freq_week: "Semana", repeat_freq_month: "Mês", repeat_freq_year: "Ano", repeat_on_date: "Na data", repeat_ends: "Termina", month_for_recurring: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], day_for_recurring: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] } }, ba = { date: { month_full: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "November", "December"], month_short: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"], day_full: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"], day_short: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"] }, labels: { dhx_cal_today_button: "Astazi", day_tab: "Zi", week_tab: "Saptamana", month_tab: "Luna", new_event: "Eveniment nou", icon_save: "Salveaza", icon_cancel: "Anuleaza", icon_details: "Detalii", icon_edit: "Editeaza", icon_delete: "Sterge", confirm_closing: "Schimbarile nu vor fi salvate, esti sigur?", confirm_deleting: "Evenimentul va fi sters permanent, esti sigur?", section_description: "Descriere", section_time: "Interval", full_day: "Toata ziua", confirm_recurring: "Vrei sa editezi toata seria de evenimente repetate?", section_recurring: "Repetare", button_recurring: "Dezactivata", button_recurring_open: "Activata", button_edit_series: "Editeaza serie", button_edit_occurrence: "Editeaza doar intrare", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Agenda", date: "Data", description: "Descriere", year_tab: "An", week_agenda_tab: "Agenda", grid_tab: "Lista", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Zilnic", repeat_radio_week: "Saptamanal", repeat_radio_month: "Lunar", repeat_radio_year: "Anual", repeat_radio_day_type: "La fiecare", repeat_text_day_count: "zi(le)", repeat_radio_day_type2: "Fiecare zi lucratoare", repeat_week: " Repeta la fiecare", repeat_text_week_count: "saptamana in urmatoarele zile:", repeat_radio_month_type: "Repeta in", repeat_radio_month_start: "In a", repeat_text_month_day: "zi la fiecare", repeat_text_month_count: "luni", repeat_text_month_count2_before: "la fiecare", repeat_text_month_count2_after: "luni", repeat_year_label: "In", select_year_day2: "a lunii", repeat_text_year_day: "zi a lunii", select_year_month: "", repeat_radio_end: "Fara data de sfarsit", repeat_text_occurrences_count: "evenimente", repeat_radio_end3: "La data", repeat_radio_end2: "Dupa", repeat_never: "Niciodată", repeat_daily: "În fiecare zi", repeat_workdays: "În fiecare zi lucrătoare", repeat_weekly: "În fiecare săptămână", repeat_monthly: "În fiecare lună", repeat_yearly: "În fiecare an", repeat_custom: "Personalizat", repeat_freq_day: "Zi", repeat_freq_week: "Săptămână", repeat_freq_month: "Lună", repeat_freq_year: "An", repeat_on_date: "La data", repeat_ends: "Se termină", month_for_recurring: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"], day_for_recurring: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"] } }, xa = { date: { month_full: ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"], month_short: ["Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек"], day_full: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"], day_short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] }, labels: { dhx_cal_today_button: "Сегодня", day_tab: "День", week_tab: "Неделя", month_tab: "Месяц", new_event: "Новое событие", icon_save: "Сохранить", icon_cancel: "Отменить", icon_details: "Детали", icon_edit: "Изменить", icon_delete: "Удалить", confirm_closing: "", confirm_deleting: "Событие будет удалено безвозвратно, продолжить?", section_description: "Описание", section_time: "Период времени", full_day: "Весь день", confirm_recurring: "Вы хотите изменить всю серию повторяющихся событий?", section_recurring: "Повторение", button_recurring: "Отключено", button_recurring_open: "Включено", button_edit_series: "Редактировать серию", button_edit_occurrence: "Редактировать экземпляр", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Список", date: "Дата", description: "Описание", year_tab: "Год", week_agenda_tab: "Список", grid_tab: "Таблица", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "День", repeat_radio_week: "Неделя", repeat_radio_month: "Месяц", repeat_radio_year: "Год", repeat_radio_day_type: "Каждый", repeat_text_day_count: "день", repeat_radio_day_type2: "Каждый рабочий день", repeat_week: " Повторять каждую", repeat_text_week_count: "неделю , в:", repeat_radio_month_type: "Повторять", repeat_radio_month_start: "", repeat_text_month_day: " числа каждый ", repeat_text_month_count: "месяц", repeat_text_month_count2_before: "каждый ", repeat_text_month_count2_after: "месяц", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "день", select_year_month: "", repeat_radio_end: "Без даты окончания", repeat_text_occurrences_count: "повторений", repeat_radio_end3: "До ", repeat_radio_end2: "", repeat_never: "Никогда", repeat_daily: "Каждый день", repeat_workdays: "Каждый будний день", repeat_weekly: "Каждую неделю", repeat_monthly: "Каждый месяц", repeat_yearly: "Каждый год", repeat_custom: "Настроить", repeat_freq_day: "День", repeat_freq_week: "Неделя", repeat_freq_month: "Месяц", repeat_freq_year: "Год", repeat_on_date: "В дату", repeat_ends: "Заканчивается", month_for_recurring: ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"], day_for_recurring: ["Воскресенье", "Понедельник", "Вторник", "Среду", "Четверг", "Пятницу", "Субботу"] } }, wa = { date: { month_full: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"], day_short: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"] }, labels: { dhx_cal_today_button: "Danes", day_tab: "Dan", week_tab: "Teden", month_tab: "Mesec", new_event: "Nov dogodek", icon_save: "Shrani", icon_cancel: "Prekliči", icon_details: "Podrobnosti", icon_edit: "Uredi", icon_delete: "Izbriši", confirm_closing: "", confirm_deleting: "Dogodek bo izbrisan. Želite nadaljevati?", section_description: "Opis", section_time: "Časovni okvir", full_day: "Ves dan", confirm_recurring: "Želite urediti celoten set ponavljajočih dogodkov?", section_recurring: "Ponovi dogodek", button_recurring: "Onemogočeno", button_recurring_open: "Omogočeno", button_edit_series: "Edit series", button_edit_occurrence: "Edit occurrence", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Zadeva", date: "Datum", description: "Opis", year_tab: "Leto", week_agenda_tab: "Zadeva", grid_tab: "Miza", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dnevno", repeat_radio_week: "Tedensko", repeat_radio_month: "Mesečno", repeat_radio_year: "Letno", repeat_radio_day_type: "Vsak", repeat_text_day_count: "dan", repeat_radio_day_type2: "Vsak delovni dan", repeat_week: " Ponavljaj vsak", repeat_text_week_count: "teden na naslednje dni:", repeat_radio_month_type: "Ponavljaj", repeat_radio_month_start: "Na", repeat_text_month_day: "dan vsak", repeat_text_month_count: "mesec", repeat_text_month_count2_before: "vsak", repeat_text_month_count2_after: "mesec", repeat_year_label: "Na", select_year_day2: "od", repeat_text_year_day: "dan", select_year_month: "mesec", repeat_radio_end: "Brez končnega datuma", repeat_text_occurrences_count: "pojavitve", repeat_radio_end2: "Po", repeat_radio_end3: "Končaj do", repeat_never: "Nikoli", repeat_daily: "Vsak dan", repeat_workdays: "Vsak delovni dan", repeat_weekly: "Vsak teden", repeat_monthly: "Vsak mesec", repeat_yearly: "Vsako leto", repeat_custom: "Po meri", repeat_freq_day: "Dan", repeat_freq_week: "Teden", repeat_freq_month: "Mesec", repeat_freq_year: "Leto", repeat_on_date: "Na datum", repeat_ends: "Konča se", month_for_recurring: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"], day_for_recurring: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"] } }, ka = { date: { month_full: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sept", "Okt", "Nov", "Dec"], day_full: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"], day_short: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"] }, labels: { dhx_cal_today_button: "Dnes", day_tab: "Deň", week_tab: "Týždeň", month_tab: "Mesiac", new_event: "Nová udalosť", icon_save: "Uložiť", icon_cancel: "Späť", icon_details: "Detail", icon_edit: "Edituj", icon_delete: "Zmazať", confirm_closing: "Vaše zmeny nebudú uložené. Skutočne?", confirm_deleting: "Udalosť bude natrvalo vymazaná. Skutočne?", section_description: "Poznámky", section_time: "Doba platnosti", confirm_recurring: "Prajete si upraviť celú radu opakovaných udalostí?", section_recurring: "Opakovanie udalosti", button_recurring: "Vypnuté", button_recurring_open: "Zapnuté", button_edit_series: "Upraviť opakovania", button_edit_occurrence: "Upraviť inštancie", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Program", date: "Dátum", description: "Poznámka", year_tab: "Rok", full_day: "Celý deň", week_agenda_tab: "Program", grid_tab: "Mriežka", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Denne", repeat_radio_week: "Týždenne", repeat_radio_month: "Mesaène", repeat_radio_year: "Roène", repeat_radio_day_type: "Každý", repeat_text_day_count: "deò", repeat_radio_day_type2: "Každý prac. deò", repeat_week: "Opakova každý", repeat_text_week_count: "týždeò v dòoch:", repeat_radio_month_type: "Opakova", repeat_radio_month_start: "On", repeat_text_month_day: "deò každý", repeat_text_month_count: "mesiac", repeat_text_month_count2_before: "každý", repeat_text_month_count2_after: "mesiac", repeat_year_label: "On", select_year_day2: "poèas", repeat_text_year_day: "deò", select_year_month: "mesiac", repeat_radio_end: "Bez dátumu ukonèenia", repeat_text_occurrences_count: "udalostiach", repeat_radio_end3: "Ukonèi", repeat_radio_end2: "Po", repeat_never: "Nikdy", repeat_daily: "Každý deň", repeat_workdays: "Každý pracovný deň", repeat_weekly: "Každý týždeň", repeat_monthly: "Každý mesiac", repeat_yearly: "Každý rok", repeat_custom: "Vlastné", repeat_freq_day: "Deň", repeat_freq_week: "Týždeň", repeat_freq_month: "Mesiac", repeat_freq_year: "Rok", repeat_on_date: "Na dátum", repeat_ends: "Koniec", month_for_recurring: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"], day_for_recurring: ["Nede¾a", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"] } }, Ea = { date: { month_full: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], day_full: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"], day_short: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"] }, labels: { dhx_cal_today_button: "Idag", day_tab: "Dag", week_tab: "Vecka", month_tab: "Månad", new_event: "Ny händelse", icon_save: "Spara", icon_cancel: "Ångra", icon_details: "Detaljer", icon_edit: "Ändra", icon_delete: "Ta bort", confirm_closing: "", confirm_deleting: "Är du säker på att du vill ta bort händelsen permanent?", section_description: "Beskrivning", section_time: "Tid", full_day: "Hela dagen", confirm_recurring: "Vill du redigera hela serien med repeterande händelser?", section_recurring: "Upprepa händelse", button_recurring: "Inaktiverat", button_recurring_open: "Aktiverat", button_edit_series: "Redigera serien", button_edit_occurrence: "Redigera en kopia", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Dagordning", date: "Datum", description: "Beskrivning", year_tab: "År", week_agenda_tab: "Dagordning", grid_tab: "Galler", drag_to_create: "Dra för att skapa ny", drag_to_move: "Dra för att flytta", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Dagligen", repeat_radio_week: "Veckovis", repeat_radio_month: "Månadsvis", repeat_radio_year: "Årligen", repeat_radio_day_type: "Var", repeat_text_day_count: "dag", repeat_radio_day_type2: "Varje arbetsdag", repeat_week: " Upprepa var", repeat_text_week_count: "vecka dessa dagar:", repeat_radio_month_type: "Upprepa", repeat_radio_month_start: "Den", repeat_text_month_day: "dagen var", repeat_text_month_count: "månad", repeat_text_month_count2_before: "var", repeat_text_month_count2_after: "månad", repeat_year_label: "Den", select_year_day2: "i", repeat_text_year_day: "dag i", select_year_month: "månad", repeat_radio_end: "Inget slutdatum", repeat_text_occurrences_count: "upprepningar", repeat_radio_end3: "Sluta efter", repeat_radio_end2: "Efter", repeat_never: "Aldrig", repeat_daily: "Varje dag", repeat_workdays: "Varje vardag", repeat_weekly: "Varje vecka", repeat_monthly: "Varje månad", repeat_yearly: "Varje år", repeat_custom: "Anpassad", repeat_freq_day: "Dag", repeat_freq_week: "Vecka", repeat_freq_month: "Månad", repeat_freq_year: "År", repeat_on_date: "På datum", repeat_ends: "Slutar", month_for_recurring: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"], day_for_recurring: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"] } }, Da = { date: { month_full: ["Ocak", "Þubat", "Mart", "Nisan", "Mayýs", "Haziran", "Temmuz", "Aðustos", "Eylül", "Ekim", "Kasým", "Aralýk"], month_short: ["Oca", "Þub", "Mar", "Nis", "May", "Haz", "Tem", "Aðu", "Eyl", "Eki", "Kas", "Ara"], day_full: ["Pazar", "Pazartes,", "Salý", "Çarþamba", "Perþembe", "Cuma", "Cumartesi"], day_short: ["Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"] }, labels: { dhx_cal_today_button: "Bugün", day_tab: "Gün", week_tab: "Hafta", month_tab: "Ay", new_event: "Uygun", icon_save: "Kaydet", icon_cancel: "Ýptal", icon_details: "Detaylar", icon_edit: "Düzenle", icon_delete: "Sil", confirm_closing: "", confirm_deleting: "Etkinlik silinecek, devam?", section_description: "Açýklama", section_time: "Zaman aralýðý", full_day: "Tam gün", confirm_recurring: "Tüm tekrar eden etkinlikler silinecek, devam?", section_recurring: "Etkinliði tekrarla", button_recurring: "Pasif", button_recurring_open: "Aktif", button_edit_series: "Dizi düzenleme", button_edit_occurrence: "Bir kopyasını düzenleyin", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Ajanda", date: "Tarih", description: "Açýklama", year_tab: "Yýl", week_agenda_tab: "Ajanda", grid_tab: "Izgara", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "Günlük", repeat_radio_week: "Haftalık", repeat_radio_month: "Aylık", repeat_radio_year: "Yıllık", repeat_radio_day_type: "Her", repeat_text_day_count: "gün", repeat_radio_day_type2: "Her iş günü", repeat_week: " Tekrar her", repeat_text_week_count: "hafta şu günlerde:", repeat_radio_month_type: "Tekrar et", repeat_radio_month_start: "Tarihinde", repeat_text_month_day: "gün her", repeat_text_month_count: "ay", repeat_text_month_count2_before: "her", repeat_text_month_count2_after: "ay", repeat_year_label: "Tarihinde", select_year_day2: "ayın", repeat_text_year_day: "günü", select_year_month: "ay", repeat_radio_end: "Bitiş tarihi yok", repeat_text_occurrences_count: "olay", repeat_radio_end2: "Sonra", repeat_radio_end3: "Tarihinde bitir", repeat_never: "Asla", repeat_daily: "Her gün", repeat_workdays: "Her iş günü", repeat_weekly: "Her hafta", repeat_monthly: "Her ay", repeat_yearly: "Her yıl", repeat_custom: "Özel", repeat_freq_day: "Gün", repeat_freq_week: "Hafta", repeat_freq_month: "Ay", repeat_freq_year: "Yıl", repeat_on_date: "Tarihinde", repeat_ends: "Biter", month_for_recurring: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"], day_for_recurring: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"] } }, Sa = { date: { month_full: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"], month_short: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], day_full: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"], day_short: ["Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"] }, labels: { dhx_cal_today_button: "Сьогодні", day_tab: "День", week_tab: "Тиждень", month_tab: "Місяць", new_event: "Нова подія", icon_save: "Зберегти", icon_cancel: "Відміна", icon_details: "Деталі", icon_edit: "Редагувати", icon_delete: "Вилучити", confirm_closing: "", confirm_deleting: "Подія вилучиться назавжди. Ви впевнені?", section_description: "Опис", section_time: "Часовий проміжок", full_day: "Весь день", confirm_recurring: "Хочете редагувати весь перелік повторюваних подій?", section_recurring: "Повторювана подія", button_recurring: "Відключено", button_recurring_open: "Включено", button_edit_series: "Редагувати серію", button_edit_occurrence: "Редагувати примірник", button_edit_occurrence_and_following: "This and following events", agenda_tab: "Перелік", date: "Дата", description: "Опис", year_tab: "Рік", week_agenda_tab: "Перелік", grid_tab: "Таблиця", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute", repeat_radio_day: "День", repeat_radio_week: "Тиждень", repeat_radio_month: "Місяць", repeat_radio_year: "Рік", repeat_radio_day_type: "Кожний", repeat_text_day_count: "день", repeat_radio_day_type2: "Кожний робочий день", repeat_week: " Повторювати кожен", repeat_text_week_count: "тиждень , по:", repeat_radio_month_type: "Повторювати", repeat_radio_month_start: "", repeat_text_month_day: " числа кожний ", repeat_text_month_count: "місяць", repeat_text_month_count2_before: "кожен ", repeat_text_month_count2_after: "місяць", repeat_year_label: "", select_year_day2: "", repeat_text_year_day: "день", select_year_month: "", repeat_radio_end: "Без дати закінчення", repeat_text_occurrences_count: "повторень", repeat_radio_end3: "До ", repeat_radio_end2: "", repeat_never: "Ніколи", repeat_daily: "Щодня", repeat_workdays: "Щодня в робочі дні", repeat_weekly: "Щотижня", repeat_monthly: "Щомісяця", repeat_yearly: "Щороку", repeat_custom: "Налаштоване", repeat_freq_day: "День", repeat_freq_week: "Тиждень", repeat_freq_month: "Місяць", repeat_freq_year: "Рік", repeat_on_date: "На дату", repeat_ends: "Закінчується", month_for_recurring: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"], day_for_recurring: ["Неділям", "Понеділкам", "Вівторкам", "Середам", "Четвергам", "П'ятницям", "Суботам"] } };
class Ma {
  constructor(i, t, n = {}) {
    this.state = { date: /* @__PURE__ */ new Date(), modes: ["days", "months", "years"], currentRange: [], eventDates: [], filterDays: null, currentModeIndex: 0, ...n }, this.container = null, this.element = null, this.onStateChangeHandlers = [], this.scheduler = i, this._domEvents = i._createDomEventScope(), this.state = this.getState(), Ve(this), t && (this.container = t, this.render(this.container)), this.onStateChange((o, a) => {
      this.callEvent("onStateChange", [a, o]);
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
    this.onStateChangeHandlers.forEach((n) => n(i, t));
  }
  _adjustDate(i) {
    const { mode: t, date: n } = this.getState(), o = new Date(n);
    t === "days" ? o.setMonth(n.getMonth() + i) : t === "months" ? o.setFullYear(n.getFullYear() + i) : o.setFullYear(n.getFullYear() + 10 * i), this.setState({ date: o });
  }
  _toggleMode() {
    const i = (this.state.currentModeIndex + 1) % this.state.modes.length;
    this.setState({ currentModeIndex: i });
  }
  _renderCalendarHeader(i) {
    const { mode: t, date: n } = this.getState(), o = document.createElement("div");
    o.classList.add("dhx_cal_datepicker_header");
    const a = document.createElement("button");
    a.classList.add("dhx_cal_datepicker_arrow", "scheduler_icon", "arrow_left"), o.appendChild(a);
    const s = document.createElement("div");
    if (s.classList.add("dhx_cal_datepicker_title"), t === "days")
      s.innerText = n.toLocaleString("default", { month: "long" }) + " " + n.getFullYear();
    else if (t === "months")
      s.innerText = n.getFullYear();
    else {
      const r = 10 * Math.floor(n.getFullYear() / 10);
      s.innerText = `${r} - ${r + 9}`;
    }
    this._domEvents.attach(s, "click", this._toggleMode.bind(this)), o.appendChild(s);
    const _ = document.createElement("button");
    _.classList.add("dhx_cal_datepicker_arrow", "scheduler_icon", "arrow_right"), o.appendChild(_), i.appendChild(o), this._domEvents.attach(a, "click", this._adjustDate.bind(this, -1)), this._domEvents.attach(_, "click", this._adjustDate.bind(this, 1));
  }
  render(i) {
    this._domEvents.detachAll(), this.container = i || this.container, this.container.innerHTML = "", this.element || (this.element = document.createElement("div"), this.element.classList.add("dhx_cal_datepicker")), this.element.innerHTML = "", this.container.appendChild(this.element), this._renderCalendarHeader(this.element);
    const t = document.createElement("div");
    t.classList.add("dhx_cal_datepicker_data"), this.element.appendChild(t);
    const { mode: n } = this.getState();
    n === "days" ? this._renderDayGrid(t) : n === "months" ? this._renderMonthGrid(t) : this._renderYearGrid(t);
  }
  _renderDayGridHeader(i) {
    const { date: t, filterDays: n } = this.getState(), o = this.scheduler;
    let a = o.date.week_start(new Date(t));
    const s = o.date.add(o.date.week_start(new Date(t)), 1, "week");
    i.classList.add("dhx_cal_datepicker_days");
    const _ = o.date.date_to_str("%D");
    for (; a.valueOf() < s.valueOf(); ) {
      if (!n || !n(a)) {
        const r = _(a), d = document.createElement("div");
        d.setAttribute("data-day", a.getDay()), d.classList.add("dhx_cal_datepicker_dayname"), d.innerText = r, i.appendChild(d);
      }
      a = o.date.add(a, 1, "day");
    }
  }
  _weeksBetween(i, t) {
    const n = this.scheduler;
    let o = 0, a = new Date(i);
    for (; a.valueOf() < t.valueOf(); )
      o += 1, a = n.date.week_start(n.date.add(a, 1, "week"));
    return o;
  }
  _renderDayGrid(i) {
    const { date: t, currentRange: n, eventDates: o, minWeeks: a, filterDays: s } = this.getState();
    let _ = n[0], r = n[1];
    const d = o.reduce((k, D) => (k[this.scheduler.date.day_start(new Date(D)).valueOf()] = !0, k), {}), l = document.createElement("div");
    this._renderDayGridHeader(l);
    const h = l.children.length;
    i.appendChild(l), h !== 7 && i.style.setProperty("--dhx-scheduler-week-length", h);
    const v = this.scheduler, m = v.date.week_start(v.date.month_start(new Date(t))), f = v.date.month_start(new Date(t)), c = v.date.add(v.date.month_start(new Date(t)), 1, "month");
    let u = v.date.add(v.date.month_start(new Date(t)), 1, "month");
    const p = v.date.date_part(v._currentDate());
    u.getDay() !== 0 && (u = v.date.add(v.date.week_start(u), 1, "week"));
    let y = this._weeksBetween(m, u);
    a && y < a && (u = v.date.add(u, a - y, "week"));
    let x = m;
    const S = document.createElement("div");
    for (S.classList.add("dhx_cal_datepicker_days"), this._domEvents.attach(S, "click", (k) => {
      const D = k.target.closest("[data-cell-date]"), M = new Date(D.getAttribute("data-cell-date"));
      this.callEvent("onDateClick", [M, k]);
    }); x.valueOf() < u.valueOf(); ) {
      if (!s || !s(x)) {
        const k = document.createElement("div");
        k.setAttribute("data-cell-date", v.templates.format_date(x)), k.setAttribute("data-day", x.getDay()), k.innerHTML = v.templates.month_day(x), x.valueOf() < f.valueOf() ? k.classList.add("dhx_before") : x.valueOf() >= c.valueOf() && k.classList.add("dhx_after"), x.getDay() !== 0 && x.getDay() !== 6 || k.classList.add("dhx_cal_datepicker_weekend"), x.valueOf() == p.valueOf() && k.classList.add("dhx_now"), _ && r && x.valueOf() >= _.valueOf() && x.valueOf() < r.valueOf() && k.classList.add("dhx_cal_datepicker_current"), d[x.valueOf()] && k.classList.add("dhx_cal_datepicker_event"), k.classList.add("dhx_cal_datepicker_date"), S.appendChild(k);
      }
      x = v.date.add(x, 1, "day");
    }
    i.appendChild(S);
  }
  _renderMonthGrid(i) {
    const { date: t } = this.getState(), n = document.createElement("div");
    n.classList.add("dhx_cal_datepicker_months");
    const o = [];
    for (let r = 0; r < 12; r++)
      o.push(new Date(t.getFullYear(), r, 1));
    const a = this.scheduler.date.date_to_str("%M");
    o.forEach((r) => {
      const d = document.createElement("div");
      d.classList.add("dhx_cal_datepicker_month"), t.getMonth() === r.getMonth() && d.classList.add("dhx_cal_datepicker_current"), d.setAttribute("data-month", r.getMonth()), d.innerHTML = a(r), this._domEvents.attach(d, "click", () => {
        const l = new Date(r);
        this.setState({ date: l, mode: "days" });
      }), n.appendChild(d);
    }), i.appendChild(n);
    const s = document.createElement("div");
    s.classList.add("dhx_cal_datepicker_done");
    const _ = document.createElement("button");
    _.innerText = "Done", _.classList.add("dhx_cal_datepicker_done_btn"), this._domEvents.attach(_, "click", () => {
      this.setState({ mode: "days" });
    }), s.appendChild(_), i.appendChild(s);
  }
  _renderYearGrid(i) {
    const { date: t } = this.getState(), n = 10 * Math.floor(t.getFullYear() / 10), o = document.createElement("div");
    o.classList.add("dhx_cal_datepicker_years");
    for (let _ = n - 1; _ <= n + 10; _++) {
      const r = document.createElement("div");
      r.innerText = _, r.classList.add("dhx_cal_datepicker_year"), r.setAttribute("data-year", _), t.getFullYear() === _ && r.classList.add("dhx_cal_datepicker_current"), this._domEvents.attach(r, "click", () => {
        this.setState({ date: new Date(_, t.getMonth(), 1), mode: "months" });
      }), o.appendChild(r);
    }
    i.appendChild(o);
    const a = document.createElement("div");
    a.classList.add("dhx_cal_datepicker_done");
    const s = document.createElement("button");
    s.innerText = "Done", s.classList.add("dhx_cal_datepicker_done_btn"), this._domEvents.attach(s, "click", () => {
      this.setState({ mode: "months" });
    }), a.appendChild(s), i.appendChild(a);
  }
  destructor() {
    this.onStateChangeHandlers = [], this.element && (this.element.innerHTML = "", this.element.remove()), this._domEvents.detachAll(), this.callEvent("onDestroy", []), this.detachAllEvents(), this.scheduler = null;
  }
}
function Na(e) {
  const i = { version: "7.2.6" };
  i.$stateProvider = function() {
    const r = {};
    return { getState: function(d) {
      if (r[d])
        return r[d].method();
      {
        const l = {};
        for (const h in r)
          r[h].internal || re.mixin(l, r[h].method(), !0);
        return l;
      }
    }, registerProvider: function(d, l, h) {
      r[d] = { method: l, internal: h };
    }, unregisterProvider: function(d) {
      delete r[d];
    } };
  }(), i.getState = i.$stateProvider.getState, function(r) {
    var d = { agenda: "https://docs.dhtmlx.com/scheduler/agenda_view.html", grid: "https://docs.dhtmlx.com/scheduler/grid_view.html", map: "https://docs.dhtmlx.com/scheduler/map_view.html", unit: "https://docs.dhtmlx.com/scheduler/units_view.html", timeline: "https://docs.dhtmlx.com/scheduler/timeline_view.html", week_agenda: "https://docs.dhtmlx.com/scheduler/weekagenda_view.html", year: "https://docs.dhtmlx.com/scheduler/year_view.html", anythingElse: "https://docs.dhtmlx.com/scheduler/views.html" }, l = { agenda: "ext/dhtmlxscheduler_agenda_view.js", grid: "ext/dhtmlxscheduler_grid_view.js", map: "ext/dhtmlxscheduler_map_view.js", unit: "ext/dhtmlxscheduler_units.js", timeline: "ext/dhtmlxscheduler_timeline.js, ext/dhtmlxscheduler_treetimeline.js, ext/dhtmlxscheduler_daytimeline.js", week_agenda: "ext/dhtmlxscheduler_week_agenda.js", year: "ext/dhtmlxscheduler_year_view.js", limit: "ext/dhtmlxscheduler_limit.js" };
    r._commonErrorMessages = { unknownView: function(h) {
      var v = l[h] ? "You're probably missing " + l[h] + "." : "";
      return "`" + h + "` view is not defined. \nPlease check parameters you pass to `scheduler.init` or `scheduler.setCurrentView` in your code and ensure you've imported appropriate extensions. \nRelated docs: " + (d[h] || d.anythingElse) + `
` + (v ? v + `
` : "");
    }, collapsedContainer: function(h) {
      return `Scheduler container height is set to *100%* but the rendered height is zero and the scheduler is not visible. 
Make sure that the container has some initial height or use different units. For example:
<div id='scheduler_here' class='dhx_cal_container' style='width:100%; height:600px;'> 
`;
    } }, r.createTimelineView = function() {
      throw new Error("scheduler.createTimelineView is not implemented. Be sure to add the required extension: " + l.timeline + `
Related docs: ` + d.timeline);
    }, r.createUnitsView = function() {
      throw new Error("scheduler.createUnitsView is not implemented. Be sure to add the required extension: " + l.unit + `
Related docs: ` + d.unit);
    }, r.createGridView = function() {
      throw new Error("scheduler.createGridView is not implemented. Be sure to add the required extension: " + l.grid + `
Related docs: ` + d.grid);
    }, r.addMarkedTimespan = function() {
      throw new Error(`scheduler.addMarkedTimespan is not implemented. Be sure to add the required extension: ext/dhtmlxscheduler_limit.js
Related docs: https://docs.dhtmlx.com/scheduler/limits.html`);
    }, r.renderCalendar = function() {
      throw new Error(`scheduler.renderCalendar is not implemented. Be sure to add the required extension: ext/dhtmlxscheduler_minical.js
https://docs.dhtmlx.com/scheduler/minicalendar.html`);
    }, r.exportToPNG = function() {
      throw new Error(["scheduler.exportToPNG is not implemented.", "This feature requires an additional module, be sure to check the related doc here https://docs.dhtmlx.com/scheduler/png.html", "Licensing info: https://dhtmlx.com/docs/products/dhtmlxScheduler/export.shtml"].join(`
`));
    }, r.exportToPDF = function() {
      throw new Error(["scheduler.exportToPDF is not implemented.", "This feature requires an additional module, be sure to check the related doc here https://docs.dhtmlx.com/scheduler/pdf.html", "Licensing info: https://dhtmlx.com/docs/products/dhtmlxScheduler/export.shtml"].join(`
`));
    };
  }(i), qt(i), function(r) {
    Ve(r), $t(r), r._detachDomEvent = function(c, u, p) {
      c.removeEventListener ? c.removeEventListener(u, p, !1) : c.detachEvent && c.detachEvent("on" + u, p);
    }, r._init_once = function() {
      Ht(r), r._init_once = function() {
      };
    };
    const d = { render: function(c) {
      return r._init_nav_bar(c);
    } }, l = { render: function(c) {
      const u = document.createElement("div");
      return u.className = "dhx_cal_header", u;
    } }, h = { render: function(c) {
      const u = document.createElement("div");
      return u.className = "dhx_cal_data", u;
    } };
    function v(c) {
      return !!(c.querySelector(".dhx_cal_header") && c.querySelector(".dhx_cal_data") && c.querySelector(".dhx_cal_navline"));
    }
    r.init = function(c, u, p) {
      if (!this.$destroyed) {
        if (u = u || r._currentDate(), p = p || "week", this._obj && this.unset_actions(), this._obj = typeof c == "string" ? document.getElementById(c) : c, this.$container = this._obj, this.$root = this._obj, !this.$container.offsetHeight && this.$container.offsetWidth && this.$container.style.height === "100%" && window.console.error(r._commonErrorMessages.collapsedContainer(), this.$container), this.config.wai_aria_attributes && this.config.wai_aria_application_role && this.$container.setAttribute("role", "application"), this.config.header || v(this.$container) || (this.config.header = function(y) {
          const x = ["day", "week", "month"];
          if (y.matrix)
            for (const S in y.matrix)
              x.push(S);
          if (y._props)
            for (const S in y._props)
              x.push(S);
          if (y._grid && y._grid.names)
            for (const S in y._grid.names)
              x.push(S);
          return ["map", "agenda", "week_agenda", "year"].forEach(function(S) {
            y[S + "_view"] && x.push(S);
          }), x.concat(["date"]).concat(["prev", "today", "next"]);
        }(this), window.console.log(["Required DOM elements are missing from the scheduler container and **scheduler.config.header** is not specified.", "Using a default header configuration: ", "scheduler.config.header = " + JSON.stringify(this.config.header, null, 2), "Check this article for the details: https://docs.dhtmlx.com/scheduler/initialization.html"].join(`
`))), this.config.header)
          this.$container.innerHTML = "", this.$container.classList.add("dhx_cal_container"), this.config.header.height && (this.xy.nav_height = this.config.header.height), this.$container.appendChild(d.render(this.config.header)), this.$container.appendChild(l.render()), this.$container.appendChild(h.render());
        else if (!v(this.$container))
          throw new Error(["Required DOM elements are missing from the scheduler container.", "Be sure to either specify them manually in the markup: https://docs.dhtmlx.com/scheduler/initialization.html#initializingschedulerviamarkup", "Or to use **scheduler.config.header** setting so they could be created automatically: https://docs.dhtmlx.com/scheduler/initialization.html#initializingschedulerviaheaderconfig"].join(`
`));
        this.config.rtl && (this.$container.className += " dhx_cal_container_rtl"), this._skin_init && r._skin_init(), r.date.init(), this._scroll = !0, this._els = [], this.get_elements(), this.init_templates(), this.set_actions(), this._init_once(), this._init_touch_events(), this.set_sizes(), r.callEvent("onSchedulerReady", []), r.$initialized = !0, this.setCurrentView(u, p);
      }
    }, r.xy = { min_event_height: 20, bar_height: 24, scale_width: 50, scroll_width: 18, scale_height: 20, month_scale_height: 20, menu_width: 25, margin_top: 0, margin_left: 0, editor_width: 140, month_head_height: 22, event_header_height: 14 }, r.keys = { edit_save: 13, edit_cancel: 27 }, r.bind = function(c, u) {
      return c.bind ? c.bind(u) : function() {
        return c.apply(u, arguments);
      };
    }, r.set_sizes = function() {
      var c = this._x = this._obj.clientWidth - this.xy.margin_left, u = this._table_view ? 0 : this.xy.scale_width + this.xy.scroll_width, p = this.$container.querySelector(".dhx_cal_scale_placeholder");
      r._is_material_skin() ? (p || ((p = document.createElement("div")).className = "dhx_cal_scale_placeholder", this.$container.insertBefore(p, this._els.dhx_cal_header[0])), p.style.display = "block", this.set_xy(p, c, this.xy.scale_height + 1, 0, this._els.dhx_cal_header[0].offsetTop)) : p && p.parentNode.removeChild(p), this._lightbox && (r.$container.offsetWidth < 1200 || this._setLbPosition(document.querySelector(".dhx_cal_light"))), this._data_width = c - u, this._els.dhx_cal_navline[0].style.width = c + "px";
      const y = this._els.dhx_cal_header[0];
      this.set_xy(y, this._data_width, this.xy.scale_height), y.style.left = "", y.style.right = "", this._table_view ? this.config.rtl ? y.style.right = "-1px" : y.style.left = "-1px" : this.config.rtl ? y.style.right = `${this.xy.scale_width}px` : y.style.left = `${this.xy.scale_width}px`;
    }, r.set_xy = function(c, u, p, y, x) {
      function S(D) {
        let M = D;
        return isNaN(Number(M)) || (M = Math.max(0, M) + "px"), M;
      }
      var k = "left";
      u !== void 0 && (c.style.width = S(u)), p !== void 0 && (c.style.height = S(p)), arguments.length > 3 && (y !== void 0 && (this.config.rtl && (k = "right"), c.style[k] = y + "px"), x !== void 0 && (c.style.top = x + "px"));
    }, r.get_elements = function() {
      const c = this._obj.getElementsByTagName("DIV");
      for (let u = 0; u < c.length; u++) {
        let p = r._getClassName(c[u]);
        const y = c[u].getAttribute("data-tab") || c[u].getAttribute("name") || "";
        p && (p = p.split(" ")[0]), this._els[p] || (this._els[p] = []), this._els[p].push(c[u]);
        let x = r.locale.labels[y + "_tab"] || r.locale.labels[y || p];
        typeof x != "string" && y && !c[u].innerHTML && (x = y.split("_")[0]), x && (this._waiAria.labelAttr(c[u], x), c[u].innerHTML = x);
      }
    };
    const m = r._createDomEventScope();
    function f(c, u) {
      const p = new Date(c), y = (new Date(u).getTime() - p.getTime()) / 864e5;
      return Math.abs(y);
    }
    r.unset_actions = function() {
      m.detachAll();
    }, r.set_actions = function() {
      for (const c in this._els)
        if (this._click[c])
          for (let u = 0; u < this._els[c].length; u++) {
            const p = this._els[c][u], y = this._click[c].bind(p);
            m.attach(p, "click", y);
          }
      m.attach(this._obj, "selectstart", function(c) {
        return c.preventDefault(), !1;
      }), m.attach(this._obj, "mousemove", function(c) {
        r._temp_touch_block || r._on_mouse_move(c);
      }), m.attach(this._obj, "mousedown", function(c) {
        r._ignore_next_click || r._on_mouse_down(c);
      }), m.attach(this._obj, "mouseup", function(c) {
        r._ignore_next_click || r._on_mouse_up(c);
      }), m.attach(this._obj, "dblclick", function(c) {
        r._on_dbl_click(c);
      }), m.attach(this._obj, "contextmenu", function(c) {
        return r.checkEvent("onContextMenu") && c.preventDefault(), r.callEvent("onContextMenu", [r._locate_event(c.target), c]);
      });
    }, r.select = function(c) {
      this._select_id != c && (r._close_not_saved(), this.editStop(!1), this._select_id && this.unselect(), this._select_id = c, this.updateEvent(c), this.callEvent("onEventSelected", [c]));
    }, r.unselect = function(c) {
      if (c && c != this._select_id)
        return;
      const u = this._select_id;
      this._select_id = null, u && this.getEvent(u) && this.updateEvent(u), this.callEvent("onEventUnselected", [u]);
    }, r.$stateProvider.registerProvider("global", (function() {
      return { mode: this._mode, date: new Date(this._date), min_date: new Date(this._min_date), max_date: new Date(this._max_date), editor_id: this._edit_id, lightbox_id: this._lightbox_id, new_event: this._new_event, select_id: this._select_id, expanded: this.expanded, drag_id: this._drag_id, drag_mode: this._drag_mode };
    }).bind(r)), r._click = { dhx_cal_data: function(c) {
      if (r._ignore_next_click)
        return c.preventDefault && c.preventDefault(), c.cancelBubble = !0, r._ignore_next_click = !1, !1;
      const u = r._locate_event(c.target);
      if (u) {
        if (!r.callEvent("onClick", [u, c]) || r.config.readonly)
          return;
      } else
        r.callEvent("onEmptyClick", [r.getActionData(c).date, c]);
      if (u && r.config.select) {
        r.select(u);
        const p = c.target.closest(".dhx_menu_icon"), y = r._getClassName(p);
        y.indexOf("_icon") != -1 && r._click.buttons[y.split(" ")[1].replace("icon_", "")](u);
      } else
        r._close_not_saved(), r.getState().select_id && (/* @__PURE__ */ new Date()).valueOf() - (r._new_event || 0) > 500 && r.unselect();
    }, dhx_cal_prev_button: function() {
      r._click.dhx_cal_next_button(0, -1);
    }, dhx_cal_next_button: function(c, u) {
      let p = 1;
      r.config.rtl && (u = -u, p = -p), r.setCurrentView(r.date.add(r.date[r._mode + "_start"](new Date(r._date)), u || p, r._mode));
    }, dhx_cal_today_button: function() {
      r.callEvent("onBeforeTodayDisplayed", []) && r.setCurrentView(r._currentDate());
    }, dhx_cal_tab: function() {
      const c = this.getAttribute("data-tab"), u = this.getAttribute("name"), p = c || u.substring(0, u.search("_tab"));
      r.setCurrentView(r._date, p);
    }, buttons: { delete: function(c) {
      const u = r.locale.labels.confirm_deleting;
      r._dhtmlx_confirm({ message: u, title: r.locale.labels.title_confirm_deleting, callback: function() {
        r.deleteEvent(c);
      }, config: { ok: r.locale.labels.icon_delete } });
    }, edit: function(c) {
      r.edit(c);
    }, save: function(c) {
      r.editStop(!0);
    }, details: function(c) {
      r.showLightbox(c);
    }, form: function(c) {
      r.showLightbox(c);
    }, cancel: function(c) {
      r.editStop(!1);
    } } }, r._dhtmlx_confirm = function({ message: c, title: u, callback: p, config: y }) {
      if (!c)
        return p();
      y = y || {};
      const x = { ...y, text: c };
      u && (x.title = u), p && (x.callback = function(S) {
        S && p();
      }), r.confirm(x);
    }, r.addEventNow = function(c, u, p) {
      let y = {};
      r._isObject(c) && !r._isDate(c) && (y = c, c = null);
      const x = 6e4 * (this.config.event_duration || this.config.time_step);
      c || (c = y.start_date || Math.round(r._currentDate().valueOf() / x) * x);
      let S = new Date(c);
      if (!u) {
        let M = this.config.first_hour;
        M > S.getHours() && (S.setHours(M), c = S.valueOf()), u = c.valueOf() + x;
      }
      let k = new Date(u);
      S.valueOf() == k.valueOf() && k.setTime(k.valueOf() + x), y.start_date = y.start_date || S, y.end_date = y.end_date || k, y.text = y.text || this.locale.labels.new_event, y.id = this._drag_id = y.id || this.uid(), this._drag_mode = "new-size", this._loading = !0;
      const D = this.addEvent(y);
      return this.callEvent("onEventCreated", [this._drag_id, p]), this._loading = !1, this._drag_event = {}, this._on_mouse_up(p), D;
    }, r._on_dbl_click = function(c, u) {
      if (u = u || c.target, this.config.readonly)
        return;
      const p = r._getClassName(u).split(" ")[0];
      switch (p) {
        case "dhx_scale_holder":
        case "dhx_scale_holder_now":
        case "dhx_month_body":
        case "dhx_wa_day_data":
          if (!r.config.dblclick_create)
            break;
          this.addEventNow(this.getActionData(c).date, null, c);
          break;
        case "dhx_cal_event":
        case "dhx_wa_ev_body":
        case "dhx_agenda_line":
        case "dhx_cal_agenda_event_line":
        case "dhx_grid_event":
        case "dhx_cal_event_line":
        case "dhx_cal_event_clear": {
          const y = this._locate_event(u);
          if (!this.callEvent("onDblClick", [y, c]))
            return;
          this.config.details_on_dblclick || this._table_view || !this.getEvent(y)._timed || !this.config.select ? this.showLightbox(y) : this.edit(y);
          break;
        }
        case "dhx_time_block":
        case "dhx_cal_container":
          return;
        default: {
          const y = this["dblclick_" + p];
          if (y)
            y.call(this, c);
          else if (u.parentNode && u != this)
            return r._on_dbl_click(c, u.parentNode);
          break;
        }
      }
    }, r._get_column_index = function(c) {
      let u = 0;
      if (this._cols) {
        let p = 0, y = 0;
        for (; p + this._cols[y] < c && y < this._cols.length; )
          p += this._cols[y], y++;
        if (u = y + (this._cols[y] ? (c - p) / this._cols[y] : 0), this._ignores && u >= this._cols.length)
          for (; u >= 1 && this._ignores[Math.floor(u)]; )
            u--;
      }
      return u;
    }, r._week_indexes_from_pos = function(c) {
      if (this._cols) {
        const u = this._get_column_index(c.x);
        return c.x = Math.min(this._cols.length - 1, Math.max(0, Math.ceil(u) - 1)), c.y = Math.max(0, Math.ceil(60 * c.y / (this.config.time_step * this.config.hour_size_px)) - 1) + this.config.first_hour * (60 / this.config.time_step), c;
      }
      return c;
    }, r._mouse_coords = function(c) {
      let u;
      const p = document.body, y = document.documentElement;
      u = this.$env.isIE || !c.pageX && !c.pageY ? { x: c.clientX + (p.scrollLeft || y.scrollLeft || 0) - p.clientLeft, y: c.clientY + (p.scrollTop || y.scrollTop || 0) - p.clientTop } : { x: c.pageX, y: c.pageY }, this.config.rtl && this._colsS ? (u.x = this.$container.querySelector(".dhx_cal_data").offsetWidth - u.x, u.x += this.$domHelpers.getAbsoluteLeft(this._obj), this._mode !== "month" && (u.x -= this.xy.scale_width)) : u.x -= this.$domHelpers.getAbsoluteLeft(this._obj) + (this._table_view ? 0 : this.xy.scale_width);
      const x = this.$container.querySelector(".dhx_cal_data");
      u.y -= this.$domHelpers.getAbsoluteTop(x) - this._els.dhx_cal_data[0].scrollTop, u.ev = c;
      const S = this["mouse_" + this._mode];
      if (S)
        u = S.call(this, u);
      else if (this._table_view) {
        const k = this._get_column_index(u.x);
        if (!this._cols || !this._colsS)
          return u;
        let D = 0;
        for (D = 1; D < this._colsS.heights.length && !(this._colsS.heights[D] > u.y); D++)
          ;
        u.y = Math.ceil(24 * (Math.max(0, k) + 7 * Math.max(0, D - 1)) * 60 / this.config.time_step), (r._drag_mode || this._mode == "month") && (u.y = 24 * (Math.max(0, Math.ceil(k) - 1) + 7 * Math.max(0, D - 1)) * 60 / this.config.time_step), this._drag_mode == "move" && r._ignores_detected && r.config.preserve_length && (u._ignores = !0, this._drag_event._event_length || (this._drag_event._event_length = this._get_real_event_length(this._drag_event.start_date, this._drag_event.end_date, { x_step: 1, x_unit: "day" }))), u.x = 0;
      } else
        u = this._week_indexes_from_pos(u);
      return u.timestamp = +/* @__PURE__ */ new Date(), u;
    }, r._close_not_saved = function() {
      if ((/* @__PURE__ */ new Date()).valueOf() - (r._new_event || 0) > 500 && r._edit_id) {
        const c = r.locale.labels.confirm_closing;
        r._dhtmlx_confirm({ message: c, title: r.locale.labels.title_confirm_closing, callback: function() {
          r.editStop(r.config.positive_closing);
        } }), c && (this._drag_id = this._drag_pos = this._drag_mode = null);
      }
    }, r._correct_shift = function(c, u) {
      return c - 6e4 * (new Date(r._min_date).getTimezoneOffset() - new Date(c).getTimezoneOffset()) * (u ? -1 : 1);
    }, r._is_pos_changed = function(c, u) {
      function p(y, x, S) {
        return Math.abs(y - x) > S;
      }
      return !c || !this._drag_pos || !!(this._drag_pos.has_moved || !this._drag_pos.timestamp || u.timestamp - this._drag_pos.timestamp > 100 || p(c.ev.clientX, u.ev.clientX, 5) || p(c.ev.clientY, u.ev.clientY, 5));
    }, r._correct_drag_start_date = function(c) {
      let u;
      r.matrix && (u = r.matrix[r._mode]), u = u || { x_step: 1, x_unit: "day" }, c = new Date(c);
      let p = 1;
      return (u._start_correction || u._end_correction) && (p = 60 * (u.last_hour || 0) - (60 * c.getHours() + c.getMinutes()) || 1), 1 * c + (r._get_fictional_event_length(c, p, u) - p);
    }, r._correct_drag_end_date = function(c, u) {
      let p;
      r.matrix && (p = r.matrix[r._mode]), p = p || { x_step: 1, x_unit: "day" };
      const y = 1 * c + r._get_fictional_event_length(c, u, p);
      return new Date(1 * y - (r._get_fictional_event_length(y, -1, p, -1) + 1));
    }, r._on_mouse_move = function(c) {
      if (this._drag_mode) {
        var u = this._mouse_coords(c);
        if (this._is_pos_changed(this._drag_pos, u)) {
          var p, y;
          if (this._edit_id != this._drag_id && this._close_not_saved(), !this._drag_mode)
            return;
          var x = null;
          if (this._drag_pos && !this._drag_pos.has_moved && ((x = this._drag_pos).has_moved = !0), this._drag_pos = u, this._drag_pos.has_moved = !0, this._drag_mode == "create") {
            if (x && (u = x), this._close_not_saved(), this.unselect(this._select_id), this._loading = !0, p = this._get_date_from_pos(u).valueOf(), !this._drag_start)
              return this.callEvent("onBeforeEventCreated", [c, this._drag_id]) ? (this._loading = !1, void (this._drag_start = p)) : void (this._loading = !1);
            y = p, this._drag_start;
            var S = new Date(this._drag_start), k = new Date(y);
            this._mode != "day" && this._mode != "week" || S.getHours() != k.getHours() || S.getMinutes() != k.getMinutes() || (k = new Date(this._drag_start + 1e3)), this._drag_id = this.uid(), this.addEvent(S, k, this.locale.labels.new_event, this._drag_id, u.fields), this.callEvent("onEventCreated", [this._drag_id, c]), this._loading = !1, this._drag_mode = "new-size";
          }
          var D, M = this.config.time_step, g = this.getEvent(this._drag_id);
          if (r.matrix && (D = r.matrix[r._mode]), D = D || { x_step: 1, x_unit: "day" }, this._drag_mode == "move")
            p = this._min_date.valueOf() + 6e4 * (u.y * this.config.time_step + 24 * u.x * 60), !u.custom && this._table_view && (p += 1e3 * this.date.time_part(g.start_date)), !this._table_view && this._dragEventBody && this._drag_event._move_event_shift === void 0 && (this._drag_event._move_event_shift = p - g.start_date), this._drag_event._move_event_shift && (p -= this._drag_event._move_event_shift), p = this._correct_shift(p), u._ignores && this.config.preserve_length && this._table_view && D ? (p = r._correct_drag_start_date(p), y = r._correct_drag_end_date(p, this._drag_event._event_length)) : y = g.end_date.valueOf() - (g.start_date.valueOf() - p);
          else {
            if (p = g.start_date.valueOf(), y = g.end_date.valueOf(), this._table_view) {
              var b = this._min_date.valueOf() + u.y * this.config.time_step * 6e4 + (u.custom ? 0 : 864e5);
              if (this._mode == "month")
                if (b = this._correct_shift(b, !1), this._drag_from_start) {
                  var w = 864e5;
                  b <= r.date.date_part(new Date(y + w - 1)).valueOf() && (p = b - w);
                } else
                  y = b;
              else if (this.config.preserve_length) {
                if (u.resize_from_start)
                  p = r._correct_drag_start_date(b), D.round_position && D.first_hour && D.last_hour && D.x_unit == "day" && (p = new Date(1 * p + D._start_correction));
                else if (y = r._correct_drag_end_date(b, 0), D.round_position && D.first_hour && D.last_hour && D.x_unit == "day" && (y = r.date.date_part(new Date(y)), y = new Date(1 * y - D._end_correction)), D.round_position && r["ignore_" + r._mode] && D.x_unit == "day") {
                  const K = this["ignore_" + this._mode];
                  let Q = r.date.add(new Date(y), -D.x_step, D.x_unit);
                  K(Q) && (y = Q);
                }
              } else
                u.resize_from_start ? p = b : y = b;
            } else {
              var E = this.date.date_part(new Date(g.end_date.valueOf() - 1)).valueOf(), N = new Date(E), T = this.config.first_hour, A = 60 / M * (this.config.last_hour - T);
              this.config.time_step = 1;
              var C = this._mouse_coords(c);
              this.config.time_step = M;
              var $ = u.y * M * 6e4, H = Math.min(u.y + 1, A) * M * 6e4, O = 6e4 * C.y;
              y = Math.abs($ - O) > Math.abs(H - O) ? E + H : E + $, y += 6e4 * (new Date(y).getTimezoneOffset() - N.getTimezoneOffset()), this._els.dhx_cal_data[0].style.cursor = "s-resize", this._mode != "week" && this._mode != "day" || (y = this._correct_shift(y));
            }
            if (this._drag_mode == "new-size")
              if (y <= this._drag_start) {
                var R = u.shift || (this._table_view && !u.custom ? 864e5 : 0);
                p = y - (u.shift ? 0 : R), y = this._drag_start + (R || 6e4 * M);
              } else
                p = this._drag_start;
            else
              y <= p && (y = D && D.round_position ? D.x_unit == "hour" || D.x_unit == "minute" ? r.date.add(p, D.x_step, D.x_unit) : r.date.add(r.date.date_part(new Date(p)), 1, D.x_unit) : p + 6e4 * M);
          }
          var U = new Date(y - 1), I = new Date(p);
          if (this._drag_mode == "move" && r.config.limit_drag_out && (+I < +r._min_date || +y > +r._max_date)) {
            if (+g.start_date < +r._min_date || +g.end_date > +r._max_date)
              I = new Date(g.start_date), y = new Date(g.end_date);
            else {
              var j = y - I;
              +I < +r._min_date ? (I = new Date(r._min_date), u._ignores && this.config.preserve_length && this._table_view ? (I = new Date(r._correct_drag_start_date(I)), D._start_correction && (I = new Date(I.valueOf() + D._start_correction)), y = new Date(1 * I + this._get_fictional_event_length(I, this._drag_event._event_length, D))) : y = new Date(+I + j)) : (y = new Date(r._max_date), u._ignores && this.config.preserve_length && this._table_view ? (D._end_correction && (y = new Date(y.valueOf() - D._end_correction)), y = new Date(1 * y - this._get_fictional_event_length(y, 0, D, !0)), I = new Date(1 * y - this._get_fictional_event_length(y, this._drag_event._event_length, D, !0)), this._ignores_detected && (I = r.date.add(I, D.x_step, D.x_unit), y = new Date(1 * y - this._get_fictional_event_length(y, 0, D, !0)), y = r.date.add(y, D.x_step, D.x_unit))) : I = new Date(+y - j));
            }
            U = new Date(y - 1);
          }
          if (!this._table_view && this._dragEventBody && !r.config.all_timed && (!r._get_section_view() && u.x != this._get_event_sday({ start_date: new Date(p), end_date: new Date(p) }) || new Date(p).getHours() < this.config.first_hour) && (j = y - I, this._drag_mode == "move" && (w = this._min_date.valueOf() + 24 * u.x * 60 * 6e4, (I = new Date(w)).setHours(this.config.first_hour), +I <= +g.start_date ? y = new Date(+I + j) : I = new Date(+y - j))), this._table_view || r.config.all_timed || !(!r.getView() && u.x != this._get_event_sday({ start_date: new Date(y), end_date: new Date(y) }) || new Date(y).getHours() >= this.config.last_hour) || (j = y - I, w = this._min_date.valueOf() + 24 * u.x * 60 * 6e4, (y = r.date.date_part(new Date(w))).setHours(this.config.last_hour), U = new Date(y - 1), this._drag_mode == "move" && (+I <= +g.start_date ? y = new Date(+I + j) : I = new Date(+y - j))), !this._table_view && r.config.all_timed) {
            let K = this._min_date.valueOf() + 24 * u.x * 60 * 6e4;
            new Date(r._drag_start).getDay() != new Date(K) && (K = new Date(r._drag_start));
            let Q = new Date(K).setHours(this.config.last_hour);
            r._drag_start && this._drag_mode == "new-size" && Q < new Date(y) && ((y = r.date.date_part(new Date(K))).setHours(this.config.last_hour), U = new Date(y - 1));
          }
          if (this._table_view && r["ignore_" + this._mode] && (this._drag_mode == "resize" || this._drag_mode == "new-size") && +y > +r._max_date) {
            y = new Date(r._max_date);
            const K = this["ignore_" + this._mode];
            for (; K(y); )
              y = r.date.add(y, -D.x_step, D.x_unit);
            y = r.date.add(y, D.x_step, D.x_unit);
          }
          if (this._table_view || U.getDate() == I.getDate() && U.getHours() < this.config.last_hour || r._allow_dnd)
            if (g.start_date = I, g.end_date = new Date(y), this.config.update_render) {
              var Y = r._els.dhx_cal_data[0].scrollTop;
              this.update_view(), r._els.dhx_cal_data[0].scrollTop = Y;
            } else
              this.updateEvent(this._drag_id);
          this._table_view && this.for_rendered(this._drag_id, function(K) {
            K.className += " dhx_in_move dhx_cal_event_drag";
          }), this.callEvent("onEventDrag", [this._drag_id, this._drag_mode, c]);
        }
      } else if (r.checkEvent("onMouseMove")) {
        var P = this._locate_event(c.target || c.srcElement);
        this.callEvent("onMouseMove", [P, c]);
      }
    }, r._on_mouse_down = function(c, u) {
      if (c.button != 2 && !this.config.readonly && !this._drag_mode) {
        u = u || c.target || c.srcElement;
        var p = r._getClassName(u).split(" ")[0];
        switch (this.config.drag_event_body && p == "dhx_body" && u.parentNode && u.parentNode.className.indexOf("dhx_cal_select_menu") === -1 && (p = "dhx_event_move", this._dragEventBody = !0), p) {
          case "dhx_cal_event_line":
          case "dhx_cal_event_clear":
            this._table_view && (this._drag_mode = "move");
            break;
          case "dhx_event_move":
          case "dhx_wa_ev_body":
            this._drag_mode = "move";
            break;
          case "dhx_event_resize":
            this._drag_mode = "resize", r._getClassName(u).indexOf("dhx_event_resize_end") < 0 ? r._drag_from_start = !0 : r._drag_from_start = !1;
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
              return r._on_mouse_down(c, u.parentNode);
            break;
          default:
            if ((!r.checkEvent("onMouseDown") || r.callEvent("onMouseDown", [p, c])) && u.parentNode && u != this && p != "dhx_body")
              return r._on_mouse_down(c, u.parentNode);
            this._drag_mode = null, this._drag_id = null;
        }
        if (this._drag_mode) {
          var y = this._locate_event(u);
          if (this.config["drag_" + this._drag_mode] && this.callEvent("onBeforeDrag", [y, this._drag_mode, c])) {
            if (this._drag_id = y, (this._edit_id != this._drag_id || this._edit_id && this._drag_mode == "create") && this._close_not_saved(), !this._drag_mode)
              return;
            this._drag_event = r._lame_clone(this.getEvent(this._drag_id) || {}), this._drag_pos = this._mouse_coords(c);
          } else
            this._drag_mode = this._drag_id = 0;
        }
        this._drag_start = null;
      }
    }, r._get_private_properties = function(c) {
      var u = {};
      for (var p in c)
        p.indexOf("_") === 0 && (u[p] = !0);
      return u;
    }, r._clear_temporary_properties = function(c, u) {
      var p = this._get_private_properties(c), y = this._get_private_properties(u);
      for (var x in y)
        p[x] || delete u[x];
    }, r._on_mouse_up = function(c) {
      if (!c || c.button != 2 || !this._mobile) {
        if (this._drag_mode && this._drag_id) {
          this._els.dhx_cal_data[0].style.cursor = "default";
          var u = this._drag_id, p = this._drag_mode, y = !this._drag_pos || this._drag_pos.has_moved;
          delete this._drag_event._move_event_shift;
          var x = this.getEvent(this._drag_id);
          if (y && (this._drag_event._dhx_changed || !this._drag_event.start_date || x.start_date.valueOf() != this._drag_event.start_date.valueOf() || x.end_date.valueOf() != this._drag_event.end_date.valueOf())) {
            var S = this._drag_mode == "new-size";
            if (this.callEvent("onBeforeEventChanged", [x, c, S, this._drag_event]))
              if (this._drag_id = this._drag_mode = null, S && this.config.edit_on_create) {
                if (this.unselect(), this._new_event = /* @__PURE__ */ new Date(), this._table_view || this.config.details_on_create || !this.config.select || !this.isOneDayEvent(this.getEvent(u)))
                  return r.callEvent("onDragEnd", [u, p, c]), this.showLightbox(u);
                this._drag_pos = !0, this._select_id = this._edit_id = u;
              } else
                this._new_event || this.callEvent(S ? "onEventAdded" : "onEventChanged", [u, this.getEvent(u)]);
            else
              S ? this.deleteEvent(x.id, !0) : (this._drag_event._dhx_changed = !1, this._clear_temporary_properties(x, this._drag_event), r._lame_copy(x, this._drag_event), this.updateEvent(x.id));
          }
          this._drag_pos && (this._drag_pos.has_moved || this._drag_pos === !0) && (this._drag_id = this._drag_mode = null, this.render_view_data()), r.callEvent("onDragEnd", [u, p, c]);
        }
        this._drag_id = null, this._drag_mode = null, this._drag_pos = null, this._drag_event = null, this._drag_from_start = null;
      }
    }, r._trigger_dyn_loading = function() {
      return !(!this._load_mode || !this._load() || (this._render_wait = !0, 0));
    }, r.update_view = function() {
      this._reset_ignores(), this._update_nav_bar(this.config.header, this.$container.querySelector(".dhx_cal_navline"));
      var c = this[this._mode + "_view"];
      if (c ? c.call(this, !0) : this._reset_scale(), this._trigger_dyn_loading())
        return !0;
      this.render_view_data();
    }, r.isViewExists = function(c) {
      return !!(r[c + "_view"] || r.date[c + "_start"] && r.templates[c + "_date"] && r.templates[c + "_scale_date"]);
    }, r._set_aria_buttons_attrs = function() {
      for (var c = ["dhx_cal_next_button", "dhx_cal_prev_button", "dhx_cal_tab", "dhx_cal_today_button"], u = 0; u < c.length; u++)
        for (var p = this._els[c[u]], y = 0; p && y < p.length; y++) {
          var x = p[y].getAttribute("data-tab") || p[y].getAttribute("name"), S = this.locale.labels[c[u]];
          x && (S = this.locale.labels[x + "_tab"] || this.locale.labels[x] || S), c[u] == "dhx_cal_next_button" ? S = this.locale.labels.next : c[u] == "dhx_cal_prev_button" && (S = this.locale.labels.prev), this._waiAria.headerButtonsAttributes(p[y], S || "");
        }
    }, r.updateView = function(c, u) {
      if (!this.$container)
        throw new Error(`The scheduler is not initialized. 
 **scheduler.updateView** or **scheduler.setCurrentView** can be called only after **scheduler.init**`);
      c = c || this._date, u = u || this._mode;
      var p = "dhx_cal_data";
      this.locale.labels.icon_form || (this.locale.labels.icon_form = this.locale.labels.icon_edit);
      var y = this._obj, x = "dhx_scheduler_" + this._mode, S = "dhx_scheduler_" + u;
      this._mode && y.className.indexOf(x) != -1 ? y.className = y.className.replace(x, S) : y.className += " " + S;
      var k, D = "dhx_multi_day", M = !(this._mode != u || !this.config.preserve_scroll) && this._els[p][0].scrollTop;
      this._els[D] && this._els[D][0] && (k = this._els[D][0].scrollTop), this[this._mode + "_view"] && u && this._mode != u && this[this._mode + "_view"](!1), this._close_not_saved(), this._els[D] && (this._els[D][0].parentNode.removeChild(this._els[D][0]), this._els[D] = null), this._mode = u, this._date = c, this._table_view = this._mode == "month", this._dy_shift = 0, this.update_view(), this._set_aria_buttons_attrs();
      var g = this._els.dhx_cal_tab;
      if (g)
        for (var b = 0; b < g.length; b++) {
          var w = g[b];
          w.getAttribute("data-tab") == this._mode || w.getAttribute("name") == this._mode + "_tab" ? (w.classList.add("active"), this._waiAria.headerToggleState(w, !0)) : (w.classList.remove("active"), this._waiAria.headerToggleState(w, !1));
        }
      typeof M == "number" && (this._els[p][0].scrollTop = M), typeof k == "number" && this._els[D] && this._els[D][0] && (this._els[D][0].scrollTop = k);
    }, r.setCurrentView = function(c, u) {
      this.callEvent("onBeforeViewChange", [this._mode, this._date, u || this._mode, c || this._date]) && (this.updateView(c, u), this.callEvent("onViewChange", [this._mode, this._date]));
    }, r.render = function(c, u) {
      r.setCurrentView(c, u);
    }, r._render_x_header = function(c, u, p, y, x) {
      x = x || 0;
      var S = document.createElement("div");
      S.className = "dhx_scale_bar", this.templates[this._mode + "_scalex_class"] && (S.className += " " + this.templates[this._mode + "_scalex_class"](p));
      var k = this._cols[c];
      this._mode == "month" && c === 0 && this.config.left_border && (S.className += " dhx_scale_bar_border", u += 1), this.set_xy(S, k, this.xy.scale_height - 1, u, x);
      var D = this.templates[this._mode + "_scale_date"](p, this._mode);
      S.innerHTML = D, this._waiAria.dayHeaderAttr(S, D), y.appendChild(S);
    }, r._get_columns_num = function(c, u) {
      var p = 7;
      if (!r._table_view) {
        var y = r.date["get_" + r._mode + "_end"];
        y && (u = y(c)), p = Math.round((u.valueOf() - c.valueOf()) / 864e5);
      }
      return p;
    }, r._get_timeunit_start = function() {
      return this.date[this._mode + "_start"](new Date(this._date.valueOf()));
    }, r._get_view_end = function() {
      var c = this._get_timeunit_start(), u = r.date.add(c, 1, this._mode);
      if (!r._table_view) {
        var p = r.date["get_" + r._mode + "_end"];
        p && (u = p(c));
      }
      return u;
    }, r._calc_scale_sizes = function(c, u, p) {
      var y = this.config.rtl, x = c, S = this._get_columns_num(u, p);
      this._process_ignores(u, S, "day", 1);
      for (var k = S - this._ignores_detected, D = 0; D < S; D++)
        this._ignores[D] ? (this._cols[D] = 0, k++) : this._cols[D] = Math.floor(x / (k - D)), x -= this._cols[D], this._colsS[D] = (this._cols[D - 1] || 0) + (this._colsS[D - 1] || (this._table_view ? 0 : y ? this.xy.scroll_width : this.xy.scale_width));
      this._colsS.col_length = S, this._colsS[S] = this._cols[S - 1] + this._colsS[S - 1] || 0;
    }, r._set_scale_col_size = function(c, u, p) {
      var y = this.config;
      this.set_xy(c, u, y.hour_size_px * (y.last_hour - y.first_hour), p + this.xy.scale_width + 1, 0);
    }, r._render_scales = function(c, u) {
      var p = new Date(r._min_date), y = new Date(r._max_date), x = this.date.date_part(r._currentDate()), S = parseInt(c.style.width, 10) - 1, k = new Date(this._min_date), D = this._get_columns_num(p, y);
      this._calc_scale_sizes(S, p, y);
      var M = 0;
      c.innerHTML = "";
      for (var g = 0; g < D; g++) {
        if (this._ignores[g] || this._render_x_header(g, M, k, c), !this._table_view) {
          var b = document.createElement("div"), w = "dhx_scale_holder";
          k.valueOf() == x.valueOf() && (w += " dhx_scale_holder_now"), b.setAttribute("data-column-index", g), this._ignores_detected && this._ignores[g] && (w += " dhx_scale_ignore");
          for (let E = 1 * this.config.first_hour; E < this.config.last_hour; E++) {
            const N = document.createElement("div");
            N.className = "dhx_scale_time_slot dhx_scale_time_slot_hour_start", N.style.height = this.config.hour_size_px / 2 + "px";
            let T = new Date(k.getFullYear(), k.getMonth(), k.getDate(), E, 0);
            N.setAttribute("data-slot-date", this.templates.format_date(T));
            let A = this.templates.time_slot_text(T);
            A && (N.innerHTML = A);
            let C = this.templates.time_slot_class(T);
            C && N.classList.add(C), b.appendChild(N);
            const $ = document.createElement("div");
            $.className = "dhx_scale_time_slot", T = new Date(k.getFullYear(), k.getMonth(), k.getDate(), E, 30), $.setAttribute("data-slot-date", this.templates.format_date(T)), $.style.height = this.config.hour_size_px / 2 + "px", A = this.templates.time_slot_text(T), A && ($.innerHTML = A), C = this.templates.time_slot_class(T), C && $.classList.add(C), b.appendChild($);
          }
          b.className = w + " " + this.templates.week_date_class(k, x), this._waiAria.dayColumnAttr(b, k), this._set_scale_col_size(b, this._cols[g], M), u.appendChild(b), this.callEvent("onScaleAdd", [b, k]);
        }
        M += this._cols[g], k = this.date.add(k, 1, "day"), k = this.date.day_start(k);
      }
    }, r._getNavDateElement = function() {
      return this.$container.querySelector(".dhx_cal_date");
    }, r._reset_scale = function() {
      if (this.templates[this._mode + "_date"]) {
        var c = this._els.dhx_cal_header[0], u = this._els.dhx_cal_data[0], p = this.config;
        c.innerHTML = "", u.innerHTML = "";
        var y, x, S = (p.readonly || !p.drag_resize ? " dhx_resize_denied" : "") + (p.readonly || !p.drag_move ? " dhx_move_denied" : "");
        u.className = "dhx_cal_data" + S, this._scales = {}, this._cols = [], this._colsS = { height: 0 }, this._dy_shift = 0, this.set_sizes();
        var k = this._get_timeunit_start(), D = r._get_view_end();
        y = x = this._table_view ? r.date.week_start(k) : k, this._min_date = y;
        var M = this.templates[this._mode + "_date"](k, D, this._mode), g = this._getNavDateElement();
        if (g && (g.innerHTML = M, this._waiAria.navBarDateAttr(g, M)), this._max_date = D, r._render_scales(c, u), this._table_view)
          this._reset_month_scale(u, k, x);
        else if (this._reset_hours_scale(u, k, x), p.multi_day) {
          var b = "dhx_multi_day";
          this._els[b] && (this._els[b][0].parentNode.removeChild(this._els[b][0]), this._els[b] = null);
          var w = document.createElement("div");
          w.className = b, w.style.visibility = "hidden", w.style.display = "none";
          var E = this._colsS[this._colsS.col_length], N = p.rtl ? this.xy.scale_width : this.xy.scroll_width, T = Math.max(E + N, 0);
          this.set_xy(w, T, 0, 0), u.parentNode.insertBefore(w, u);
          var A = w.cloneNode(!0);
          A.className = b + "_icon", A.style.visibility = "hidden", A.style.display = "none", this.set_xy(A, this.xy.scale_width + 1, 0, 0), w.appendChild(A), this._els[b] = [w, A], r.event(this._els[b][0], "click", this._click.dhx_cal_data);
        }
      }
    }, r._reset_hours_scale = function(c, u, p) {
      var y = document.createElement("div");
      y.className = "dhx_scale_holder";
      for (var x = new Date(1980, 1, 1, this.config.first_hour, 0, 0), S = 1 * this.config.first_hour; S < this.config.last_hour; S++) {
        var k = document.createElement("div");
        k.className = "dhx_scale_hour", k.style.height = this.config.hour_size_px + "px";
        var D = this.xy.scale_width;
        this.config.left_border && (k.className += " dhx_scale_hour_border"), k.style.width = D + "px";
        var M = r.templates.hour_scale(x);
        k.innerHTML = M, this._waiAria.hourScaleAttr(k, M), y.appendChild(k), x = this.date.add(x, 1, "hour");
      }
      c.appendChild(y), this.config.scroll_hour && (c.scrollTop = this.config.hour_size_px * (this.config.scroll_hour - this.config.first_hour));
    }, r._currentDate = function() {
      return r.config.now_date ? new Date(r.config.now_date) : /* @__PURE__ */ new Date();
    }, r._reset_ignores = function() {
      this._ignores = {}, this._ignores_detected = 0;
    }, r._process_ignores = function(c, u, p, y, x) {
      this._reset_ignores();
      var S = r["ignore_" + this._mode];
      if (S)
        for (var k = new Date(c), D = 0; D < u; D++)
          S(k) && (this._ignores_detected += 1, this._ignores[D] = !0, x && u++), k = r.date.add(k, y, p), r.date[p + "_start"] && (k = r.date[p + "_start"](k));
    }, r._render_month_scale = function(c, u, p, y) {
      var x = r.date.add(u, 1, "month"), S = new Date(p), k = r._currentDate();
      k = this.date.date_part(k), p = this.date.date_part(p), y = y || Math.ceil(Math.round((x.valueOf() - p.valueOf()) / 864e5) / 7);
      for (var D = [], M = 0; M <= 7; M++) {
        var g = this._cols[M] || 0;
        isNaN(Number(g)) || (g += "px"), D[M] = g;
      }
      function b(I) {
        var j = r._colsS.height;
        return r._colsS.heights[I + 1] !== void 0 && (j = r._colsS.heights[I + 1] - (r._colsS.heights[I] || 0)), j;
      }
      var w = 0;
      const E = document.createElement("div");
      for (E.classList.add("dhx_cal_month_table"), M = 0; M < y; M++) {
        var N = document.createElement("div");
        N.classList.add("dhx_cal_month_row"), N.style.height = b(M) + "px", E.appendChild(N);
        for (var T = 0; T < 7; T++) {
          var A = document.createElement("div");
          N.appendChild(A);
          var C = "dhx_cal_month_cell";
          p < u ? C += " dhx_before" : p >= x ? C += " dhx_after" : p.valueOf() == k.valueOf() && (C += " dhx_now"), this._ignores_detected && this._ignores[T] && (C += " dhx_scale_ignore"), A.className = C + " " + this.templates.month_date_class(p, k), A.setAttribute("data-cell-date", r.templates.format_date(p));
          var $ = "dhx_month_body", H = "dhx_month_head";
          if (T === 0 && this.config.left_border && ($ += " dhx_month_body_border", H += " dhx_month_head_border"), this._ignores_detected && this._ignores[T])
            A.appendChild(document.createElement("div")), A.appendChild(document.createElement("div"));
          else {
            A.style.width = D[T], this._waiAria.monthCellAttr(A, p);
            var O = document.createElement("div");
            O.style.height = r.xy.month_head_height + "px", O.className = H, O.innerHTML = this.templates.month_day(p), A.appendChild(O);
            var R = document.createElement("div");
            R.className = $, A.appendChild(R);
          }
          var U = p.getDate();
          (p = this.date.add(p, 1, "day")).getDate() - U > 1 && (p = new Date(p.getFullYear(), p.getMonth(), U + 1, 12, 0));
        }
        r._colsS.heights[M] = w, w += b(M);
      }
      return this._min_date = S, this._max_date = p, c.innerHTML = "", c.appendChild(E), this._scales = {}, c.querySelectorAll("[data-cell-date]").forEach((I) => {
        const j = r.templates.parse_date(I.getAttribute("data-cell-date")), Y = I.querySelector(".dhx_month_body");
        this._scales[+j] = Y, this.callEvent("onScaleAdd", [this._scales[+j], j]);
      }), this._max_date;
    }, r._reset_month_scale = function(c, u, p, y) {
      var x = r.date.add(u, 1, "month");
      p = this.date.date_part(p), y = y || Math.ceil(Math.round((x.valueOf() - p.valueOf()) / 864e5) / 7);
      var S = Math.floor(c.clientHeight / y) - this.xy.month_head_height;
      return this._colsS.height = S + this.xy.month_head_height, this._colsS.heights = [], r._render_month_scale(c, u, p, y);
    }, r.getView = function(c) {
      return c || (c = r.getState().mode), r.matrix && r.matrix[c] ? r.matrix[c] : r._props && r._props[c] ? r._props[c] : null;
    }, r.getLabel = function(c, u) {
      for (var p = this.config.lightbox.sections, y = 0; y < p.length; y++)
        if (p[y].map_to == c) {
          for (var x = p[y].options, S = 0; S < x.length; S++)
            if (x[S].key == u)
              return x[S].label;
        }
      return "";
    }, r.updateCollection = function(c, u) {
      var p = r.serverList(c);
      return !!p && (p.splice(0, p.length), p.push.apply(p, u || []), r.callEvent("onOptionsLoad", []), r.resetLightbox(), r.hideCover(), !0);
    }, r._lame_clone = function(c, u) {
      var p, y, x;
      for (u = u || [], p = 0; p < u.length; p += 2)
        if (c === u[p])
          return u[p + 1];
      if (c && typeof c == "object") {
        for (x = Object.create(c), y = [Array, Date, Number, String, Boolean], p = 0; p < y.length; p++)
          c instanceof y[p] && (x = p ? new y[p](c) : new y[p]());
        for (p in u.push(c, x), c)
          Object.prototype.hasOwnProperty.apply(c, [p]) && (x[p] = r._lame_clone(c[p], u));
      }
      return x || c;
    }, r._lame_copy = function(c, u) {
      for (var p in u)
        u.hasOwnProperty(p) && (c[p] = u[p]);
      return c;
    }, r._get_date_from_pos = function(c) {
      var u = this._min_date.valueOf() + 6e4 * (c.y * this.config.time_step + 24 * (this._table_view ? 0 : c.x) * 60);
      return new Date(this._correct_shift(u));
    }, r.getActionData = function(c) {
      var u = this._mouse_coords(c);
      return { date: this._get_date_from_pos(u), section: u.section };
    }, r._focus = function(c, u) {
      if (c && c.focus)
        if (this._mobile)
          window.setTimeout(function() {
            c.focus();
          }, 10);
        else
          try {
            u && c.select && c.offsetWidth && c.select(), c.focus();
          } catch {
          }
    }, r._get_real_event_length = function(c, u, p) {
      var y, x = u - c, S = this["ignore_" + this._mode], k = 0;
      p.render ? (k = this._get_date_index(p, c), y = this._get_date_index(p, u), c.valueOf() < r.getState().min_date.valueOf() && (k = -f(c, r.getState().min_date)), u.valueOf() > r.getState().max_date.valueOf() && (y += f(u, r.getState().max_date))) : y = Math.round(x / 60 / 60 / 1e3 / 24);
      for (var D = !0; k < y; ) {
        var M = r.date.add(u, -p.x_step, p.x_unit);
        if (S && S(u) && (!D || D && S(M)))
          x -= u - M;
        else {
          let g = 0;
          const b = new Date(Math.max(M.valueOf(), c.valueOf())), w = u, E = new Date(b.getFullYear(), b.getMonth(), b.getDate(), p.first_hour || 0), N = new Date(b.getFullYear(), b.getMonth(), b.getDate(), p.last_hour || 24), T = new Date(u.getFullYear(), u.getMonth(), u.getDate(), p.first_hour || 0), A = new Date(u.getFullYear(), u.getMonth(), u.getDate(), p.last_hour || 24);
          w.valueOf() > A.valueOf() && (g += w - A), w.valueOf() > T.valueOf() ? g += p._start_correction : g += 60 * w.getHours() * 60 * 1e3 + 60 * w.getMinutes() * 1e3, b.valueOf() <= N.valueOf() && (g += p._end_correction), b.valueOf() < E.valueOf() && (g += E.valueOf() - b.valueOf()), x -= g, D = !1;
        }
        u = M, y--;
      }
      return x;
    }, r._get_fictional_event_length = function(c, u, p, y) {
      var x = new Date(c), S = y ? -1 : 1;
      if (p._start_correction || p._end_correction) {
        var k;
        k = y ? 60 * x.getHours() + x.getMinutes() - 60 * (p.first_hour || 0) : 60 * (p.last_hour || 0) - (60 * x.getHours() + x.getMinutes());
        var D = 60 * (p.last_hour - p.first_hour), M = Math.ceil((u / 6e4 - k) / D);
        M < 0 && (M = 0), u += M * (1440 - D) * 60 * 1e3;
      }
      var g, b = new Date(1 * c + u * S), w = this["ignore_" + this._mode], E = 0;
      for (p.render ? (E = this._get_date_index(p, x), g = this._get_date_index(p, b)) : g = Math.round(u / 60 / 60 / 1e3 / 24); p.x_unit === "day" ? E * S < g * S : E * S <= g * S; ) {
        var N = r.date.add(x, p.x_step * S, p.x_unit);
        w && w(x) && (u += (N - x) * S, g += S), x = N, E += S;
      }
      return u;
    }, r._get_section_view = function() {
      return this.getView();
    }, r._get_section_property = function() {
      return this.matrix && this.matrix[this._mode] ? this.matrix[this._mode].y_property : this._props && this._props[this._mode] ? this._props[this._mode].map_to : null;
    }, r._is_initialized = function() {
      var c = this.getState();
      return this._obj && c.date && c.mode;
    }, r._is_lightbox_open = function() {
      var c = this.getState();
      return c.lightbox_id !== null && c.lightbox_id !== void 0;
    };
  }(i), function(r) {
    (function() {
      var d = new RegExp(`<(?:.|
)*?>`, "gm"), l = new RegExp(" +", "gm");
      function h(c) {
        return (c + "").replace(d, " ").replace(l, " ");
      }
      var v = new RegExp("'", "gm");
      function m(c) {
        return (c + "").replace(v, "&#39;");
      }
      for (var f in r._waiAria = { getAttributeString: function(c) {
        var u = [" "];
        for (var p in c)
          if (typeof c[p] != "function" && typeof c[p] != "object") {
            var y = m(h(c[p]));
            u.push(p + "='" + y + "'");
          }
        return u.push(" "), u.join(" ");
      }, setAttributes: function(c, u) {
        for (var p in u)
          c.setAttribute(p, h(u[p]));
        return c;
      }, labelAttr: function(c, u) {
        return this.setAttributes(c, { "aria-label": u });
      }, label: function(c) {
        return r._waiAria.getAttributeString({ "aria-label": c });
      }, hourScaleAttr: function(c, u) {
        this.labelAttr(c, u);
      }, monthCellAttr: function(c, u) {
        this.labelAttr(c, r.templates.day_date(u));
      }, navBarDateAttr: function(c, u) {
        this.labelAttr(c, u);
      }, dayHeaderAttr: function(c, u) {
        this.labelAttr(c, u);
      }, dayColumnAttr: function(c, u) {
        this.dayHeaderAttr(c, r.templates.day_date(u));
      }, headerButtonsAttributes: function(c, u) {
        return this.setAttributes(c, { role: "button", "aria-label": u });
      }, headerToggleState: function(c, u) {
        return this.setAttributes(c, { "aria-pressed": u ? "true" : "false" });
      }, getHeaderCellAttr: function(c) {
        return r._waiAria.getAttributeString({ "aria-label": c });
      }, eventAttr: function(c, u) {
        this._eventCommonAttr(c, u);
      }, _eventCommonAttr: function(c, u) {
        u.setAttribute("aria-label", h(r.templates.event_text(c.start_date, c.end_date, c))), r.config.readonly && u.setAttribute("aria-readonly", !0), c.$dataprocessor_class && u.setAttribute("aria-busy", !0), u.setAttribute("aria-selected", r.getState().select_id == c.id ? "true" : "false");
      }, setEventBarAttr: function(c, u) {
        this._eventCommonAttr(c, u);
      }, _getAttributes: function(c, u) {
        var p = { setAttribute: function(y, x) {
          this[y] = x;
        } };
        return c.apply(this, [u, p]), p;
      }, eventBarAttrString: function(c) {
        return this.getAttributeString(this._getAttributes(this.setEventBarAttr, c));
      }, agendaHeadAttrString: function() {
        return this.getAttributeString({ role: "row" });
      }, agendaHeadDateString: function(c) {
        return this.getAttributeString({ role: "columnheader", "aria-label": c });
      }, agendaHeadDescriptionString: function(c) {
        return this.agendaHeadDateString(c);
      }, agendaDataAttrString: function() {
        return this.getAttributeString({ role: "grid" });
      }, agendaEventAttrString: function(c) {
        var u = this._getAttributes(this._eventCommonAttr, c);
        return u.role = "row", this.getAttributeString(u);
      }, agendaDetailsBtnString: function() {
        return this.getAttributeString({ role: "button", "aria-label": r.locale.labels.icon_details });
      }, gridAttrString: function() {
        return this.getAttributeString({ role: "grid" });
      }, gridRowAttrString: function(c) {
        return this.agendaEventAttrString(c);
      }, gridCellAttrString: function(c, u, p) {
        return this.getAttributeString({ role: "gridcell", "aria-label": [u.label === void 0 ? u.id : u.label, ": ", p] });
      }, mapAttrString: function() {
        return this.gridAttrString();
      }, mapRowAttrString: function(c) {
        return this.gridRowAttrString(c);
      }, mapDetailsBtnString: function() {
        return this.agendaDetailsBtnString();
      }, minicalHeader: function(c, u) {
        this.setAttributes(c, { id: u + "", "aria-live": "assertice", "aria-atomic": "true" });
      }, minicalGrid: function(c, u) {
        this.setAttributes(c, { "aria-labelledby": u + "", role: "grid" });
      }, minicalRow: function(c) {
        this.setAttributes(c, { role: "row" });
      }, minicalDayCell: function(c, u) {
        var p = u.valueOf() < r._max_date.valueOf() && u.valueOf() >= r._min_date.valueOf();
        this.setAttributes(c, { role: "gridcell", "aria-label": r.templates.day_date(u), "aria-selected": p ? "true" : "false" });
      }, minicalHeadCell: function(c) {
        this.setAttributes(c, { role: "columnheader" });
      }, weekAgendaDayCell: function(c, u) {
        var p = c.querySelector(".dhx_wa_scale_bar"), y = c.querySelector(".dhx_wa_day_data"), x = r.uid() + "";
        this.setAttributes(p, { id: x }), this.setAttributes(y, { "aria-labelledby": x });
      }, weekAgendaEvent: function(c, u) {
        this.eventAttr(u, c);
      }, lightboxHiddenAttr: function(c) {
        c.setAttribute("aria-hidden", "true");
      }, lightboxVisibleAttr: function(c) {
        c.setAttribute("aria-hidden", "false");
      }, lightboxSectionButtonAttrString: function(c) {
        return this.getAttributeString({ role: "button", "aria-label": c, tabindex: "0" });
      }, yearHeader: function(c, u) {
        this.setAttributes(c, { id: u + "" });
      }, yearGrid: function(c, u) {
        this.minicalGrid(c, u);
      }, yearHeadCell: function(c) {
        return this.minicalHeadCell(c);
      }, yearRow: function(c) {
        return this.minicalRow(c);
      }, yearDayCell: function(c) {
        this.setAttributes(c, { role: "gridcell" });
      }, lightboxAttr: function(c) {
        c.setAttribute("role", "dialog"), c.setAttribute("aria-hidden", "true"), c.firstChild.setAttribute("role", "heading");
      }, lightboxButtonAttrString: function(c) {
        return this.getAttributeString({ role: "button", "aria-label": r.locale.labels[c], tabindex: "0" });
      }, eventMenuAttrString: function(c) {
        return this.getAttributeString({ role: "button", "aria-label": r.locale.labels[c] });
      }, lightboxHeader: function(c, u) {
        c.setAttribute("aria-label", u);
      }, lightboxSelectAttrString: function(c) {
        var u = "";
        switch (c) {
          case "%Y":
            u = r.locale.labels.year;
            break;
          case "%m":
            u = r.locale.labels.month;
            break;
          case "%d":
            u = r.locale.labels.day;
            break;
          case "%H:%i":
            u = r.locale.labels.hour + " " + r.locale.labels.minute;
        }
        return r._waiAria.getAttributeString({ "aria-label": u });
      }, messageButtonAttrString: function(c) {
        return "tabindex='0' role='button' aria-label='" + c + "'";
      }, messageInfoAttr: function(c) {
        c.setAttribute("role", "alert");
      }, messageModalAttr: function(c, u) {
        c.setAttribute("role", "dialog"), u && c.setAttribute("aria-labelledby", u);
      }, quickInfoAttr: function(c) {
        c.setAttribute("role", "dialog");
      }, quickInfoHeaderAttrString: function() {
        return " role='heading' ";
      }, quickInfoHeader: function(c, u) {
        c.setAttribute("aria-label", u);
      }, quickInfoButtonAttrString: function(c) {
        return r._waiAria.getAttributeString({ role: "button", "aria-label": c, tabindex: "0" });
      }, tooltipAttr: function(c) {
        c.setAttribute("role", "tooltip");
      }, tooltipVisibleAttr: function(c) {
        c.setAttribute("aria-hidden", "false");
      }, tooltipHiddenAttr: function(c) {
        c.setAttribute("aria-hidden", "true");
      } }, r._waiAria)
        r._waiAria[f] = function(c) {
          return function() {
            return r.config.wai_aria_attributes ? c.apply(this, arguments) : " ";
          };
        }(r._waiAria[f]);
    })();
  }(i), i.utils = re, i.$domHelpers = ue, i.utils.dom = ue, i.uid = re.uid, i.mixin = re.mixin, i.defined = re.defined, i.assert = function(r) {
    return function(d, l) {
      d || r.config.show_errors && r.callEvent("onError", [l]) !== !1 && (r.message ? r.message({ type: "error", text: l, expire: -1 }) : console.log(l));
    };
  }(i), i.copy = re.copy, i._createDatePicker = function(r, d) {
    return new Ma(i, r, d);
  }, i._getFocusableNodes = ue.getFocusableNodes, i._getClassName = ue.getClassName, i._locate_css = ue.locateCss;
  const t = Gt(i);
  var n, o, a;
  i.utils.mixin(i, t), i.env = i.$env = Ut, i.Promise = window.Promise, function(r) {
    r.destructor = function() {
      for (var d in r.callEvent("onDestroy", []), this.clearAll(), this.$container && (this.$container.innerHTML = ""), this._eventRemoveAll && this._eventRemoveAll(), this.resetLightbox && this.resetLightbox(), this._dp && this._dp.destructor && this._dp.destructor(), this.detachAllEvents(), this)
        d.indexOf("$") === 0 && delete this[d];
      r.$destroyed = !0;
    };
  }(i), function(r) {
    function d(l, h) {
      var v = { method: l };
      if (h.length === 0)
        throw new Error("Arguments list of query is wrong.");
      if (h.length === 1)
        return typeof h[0] == "string" ? (v.url = h[0], v.async = !0) : (v.url = h[0].url, v.async = h[0].async || !0, v.callback = h[0].callback, v.headers = h[0].headers), h[0].data ? typeof h[0].data != "string" ? v.data = Ae(h[0].data) : v.data = h[0].data : v.data = "", v;
      switch (v.url = h[0], l) {
        case "GET":
        case "DELETE":
          v.callback = h[1], v.headers = h[2];
          break;
        case "POST":
        case "PUT":
          h[1] ? typeof h[1] != "string" ? v.data = Ae(h[1]) : v.data = h[1] : v.data = "", v.callback = h[2], v.headers = h[3];
      }
      return v;
    }
    r.Promise = window.Promise, r.ajax = { cache: !0, method: "get", serializeRequestParams: Ae, parse: function(l) {
      return typeof l != "string" ? l : (l = l.replace(/^[\s]+/, ""), typeof DOMParser > "u" || r.$env.isIE ? window.ActiveXObject !== void 0 && ((h = new window.ActiveXObject("Microsoft.XMLDOM")).async = "false", h.loadXML(l)) : h = new DOMParser().parseFromString(l, "text/xml"), h);
      var h;
    }, xmltop: function(l, h, v) {
      if (h.status === void 0 || h.status < 400) {
        var m = h.responseXML ? h.responseXML || h : this.parse(h.responseText || h);
        if (m && m.documentElement !== null && !m.getElementsByTagName("parsererror").length)
          return m.getElementsByTagName(l)[0];
      }
      return v !== -1 && r.callEvent("onLoadXMLError", ["Incorrect XML", arguments[1], v]), document.createElement("DIV");
    }, xpath: function(l, h) {
      if (h.nodeName || (h = h.responseXML || h), r.$env.isIE)
        return h.selectNodes(l) || [];
      for (var v, m = [], f = (h.ownerDocument || h).evaluate(l, h, null, XPathResult.ANY_TYPE, null); v = f.iterateNext(); )
        m.push(v);
      return m;
    }, query: function(l) {
      return this._call(l.method || "GET", l.url, l.data || "", l.async || !0, l.callback, l.headers);
    }, get: function(l, h, v) {
      var m = d("GET", arguments);
      return this.query(m);
    }, getSync: function(l, h) {
      var v = d("GET", arguments);
      return v.async = !1, this.query(v);
    }, put: function(l, h, v, m) {
      var f = d("PUT", arguments);
      return this.query(f);
    }, del: function(l, h, v) {
      var m = d("DELETE", arguments);
      return this.query(m);
    }, post: function(l, h, v, m) {
      arguments.length == 1 ? h = "" : arguments.length == 2 && typeof h == "function" && (v = h, h = "");
      var f = d("POST", arguments);
      return this.query(f);
    }, postSync: function(l, h, v) {
      h = h === null ? "" : String(h);
      var m = d("POST", arguments);
      return m.async = !1, this.query(m);
    }, _call: function(l, h, v, m, f, c) {
      return new r.Promise((function(u, p) {
        var y = typeof XMLHttpRequest === void 0 || r.$env.isIE ? new window.ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest(), x = navigator.userAgent.match(/AppleWebKit/) !== null && navigator.userAgent.match(/Qt/) !== null && navigator.userAgent.match(/Safari/) !== null;
        if (m && y.addEventListener("readystatechange", function() {
          if (y.readyState == 4 || x && y.readyState == 3) {
            if ((y.status != 200 || y.responseText === "") && !r.callEvent("onAjaxError", [y]))
              return;
            setTimeout(function() {
              typeof f == "function" && f.apply(window, [{ xmlDoc: y, filePath: h }]), u(y), typeof f == "function" && (f = null, y = null);
            }, 0);
          }
        }), l != "GET" || this.cache || (h += (h.indexOf("?") >= 0 ? "&" : "?") + "dhxr" + (/* @__PURE__ */ new Date()).getTime() + "=1"), y.open(l, h, m), c)
          for (var S in c)
            y.setRequestHeader(S, c[S]);
        else
          l.toUpperCase() == "POST" || l == "PUT" || l == "DELETE" ? y.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") : l == "GET" && (v = null);
        if (y.setRequestHeader("X-Requested-With", "XMLHttpRequest"), y.send(v), !m)
          return { xmlDoc: y, filePath: h };
      }).bind(this));
    }, urlSeparator: function(l) {
      return l.indexOf("?") != -1 ? "&" : "?";
    } }, r.$ajax = r.ajax;
  }(i), Vt(i), function(r) {
    r.config = { default_date: "%j %M %Y", month_date: "%F %Y", load_date: "%Y-%m-%d", week_date: "%l", day_date: "%D %j", hour_date: "%H:%i", month_day: "%d", date_format: "%Y-%m-%d %H:%i", api_date: "%d-%m-%Y %H:%i", parse_exact_format: !1, preserve_length: !0, time_step: 5, displayed_event_color: "#ff4a4a", displayed_event_text_color: "#ffef80", wide_form: 0, day_column_padding: 8, use_select_menu_space: !0, fix_tab_position: !0, start_on_monday: !0, first_hour: 0, last_hour: 24, readonly: !1, drag_resize: !0, drag_move: !0, drag_create: !0, drag_event_body: !0, dblclick_create: !0, details_on_dblclick: !0, edit_on_create: !0, details_on_create: !0, header: null, hour_size_px: 44, resize_month_events: !1, resize_month_timed: !1, responsive_lightbox: !1, separate_short_events: !0, rtl: !1, cascade_event_display: !1, cascade_event_count: 4, cascade_event_margin: 30, multi_day: !0, multi_day_height_limit: 200, drag_lightbox: !0, preserve_scroll: !0, select: !0, undo_deleted: !0, server_utc: !1, touch: !0, touch_tip: !0, touch_drag: 500, touch_swipe_dates: !1, quick_info_detached: !0, positive_closing: !1, drag_highlight: !0, limit_drag_out: !1, icons_edit: ["icon_save", "icon_cancel"], icons_select: ["icon_details", "icon_edit", "icon_delete"], buttons_right: ["dhx_save_btn", "dhx_cancel_btn"], buttons_left: ["dhx_delete_btn"], lightbox: { sections: [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "time", height: 72, type: "time", map_to: "auto" }] }, highlight_displayed_event: !0, left_border: !1, ajax_error: "alert", delay_render: 0, timeline_swap_resize: !0, wai_aria_attributes: !0, wai_aria_application_role: !0, csp: "auto", event_attribute: "data-event-id", show_errors: !0 }, r.config.buttons_left.$initial = r.config.buttons_left.join(), r.config.buttons_right.$initial = r.config.buttons_right.join(), r._helpers = { parseDate: function(d) {
      return (r.templates.xml_date || r.templates.parse_date)(d);
    }, formatDate: function(d) {
      return (r.templates.xml_format || r.templates.format_date)(d);
    } }, r.templates = {}, r.init_templates = function() {
      var d = r.date.date_to_str, l = r.config;
      (function(h, v) {
        for (var m in v)
          h[m] || (h[m] = v[m]);
      })(r.templates, { day_date: d(l.default_date), month_date: d(l.month_date), week_date: function(h, v) {
        return l.rtl ? r.templates.day_date(r.date.add(v, -1, "day")) + " &ndash; " + r.templates.day_date(h) : r.templates.day_date(h) + " &ndash; " + r.templates.day_date(r.date.add(v, -1, "day"));
      }, day_scale_date: d(l.default_date), time_slot_text: function(h) {
        return "";
      }, time_slot_class: function(h) {
        return "";
      }, month_scale_date: d(l.week_date), week_scale_date: d(l.day_date), hour_scale: d(l.hour_date), time_picker: d(l.hour_date), event_date: d(l.hour_date), month_day: d(l.month_day), load_format: d(l.load_date), format_date: d(l.date_format, l.server_utc), parse_date: r.date.str_to_date(l.date_format, l.server_utc), api_date: r.date.str_to_date(l.api_date, !1, !1), event_header: function(h, v, m) {
        return m._mode === "small" || m._mode === "smallest" ? r.templates.event_date(h) : r.templates.event_date(h) + " - " + r.templates.event_date(v);
      }, event_text: function(h, v, m) {
        return m.text;
      }, event_class: function(h, v, m) {
        return "";
      }, month_date_class: function(h) {
        return "";
      }, week_date_class: function(h) {
        return "";
      }, event_bar_date: function(h, v, m) {
        return r.templates.event_date(h);
      }, event_bar_text: function(h, v, m) {
        return m.text;
      }, month_events_link: function(h, v) {
        return "<a>View more(" + v + " events)</a>";
      }, drag_marker_class: function(h, v, m) {
        return "";
      }, drag_marker_content: function(h, v, m) {
        return "";
      }, tooltip_date_format: r.date.date_to_str("%Y-%m-%d %H:%i"), tooltip_text: function(h, v, m) {
        return "<b>Event:</b> " + m.text + "<br/><b>Start date:</b> " + r.templates.tooltip_date_format(h) + "<br/><b>End date:</b> " + r.templates.tooltip_date_format(v);
      }, calendar_month: d("%F %Y"), calendar_scale_date: d("%D"), calendar_date: d("%d"), calendar_time: d("%d-%m-%Y") }), this.callEvent("onTemplatesReady", []);
    };
  }(i), function(r) {
    r._events = {}, r.clearAll = function() {
      this._events = {}, this._loaded = {}, this._edit_id = null, this._select_id = null, this._drag_id = null, this._drag_mode = null, this._drag_pos = null, this._new_event = null, this.clear_view(), this.callEvent("onClearAll", []);
    }, r.addEvent = function(d, l, h, v, m) {
      if (!arguments.length)
        return this.addEventNow();
      var f = d;
      arguments.length != 1 && ((f = m || {}).start_date = d, f.end_date = l, f.text = h, f.id = v), f.id = f.id || r.uid(), f.text = f.text || "", typeof f.start_date == "string" && (f.start_date = this.templates.api_date(f.start_date)), typeof f.end_date == "string" && (f.end_date = this.templates.api_date(f.end_date));
      var c = 6e4 * (this.config.event_duration || this.config.time_step);
      new Date(f.end_date).valueOf() - new Date(f.start_date).valueOf() <= c && f.end_date.setTime(f.end_date.valueOf() + c), f.start_date.setMilliseconds(0), f.end_date.setMilliseconds(0), f._timed = this.isOneDayEvent(f);
      var u = !this._events[f.id];
      return this._events[f.id] = f, this.event_updated(f), this._loading || this.callEvent(u ? "onEventAdded" : "onEventChanged", [f.id, f]), f.id;
    }, r.deleteEvent = function(d, l) {
      var h = this._events[d];
      (l || this.callEvent("onBeforeEventDelete", [d, h]) && this.callEvent("onConfirmedBeforeEventDelete", [d, h])) && (h && (r.getState().select_id == d && r.unselect(), delete this._events[d], this.event_updated(h), this._drag_id == h.id && (this._drag_id = null, this._drag_mode = null, this._drag_pos = null)), this.callEvent("onEventDeleted", [d, h]));
    }, r.getEvent = function(d) {
      return this._events[d];
    }, r.setEvent = function(d, l) {
      l.id || (l.id = d), this._events[d] = l;
    }, r.for_rendered = function(d, l) {
      for (var h = this._rendered.length - 1; h >= 0; h--)
        this._rendered[h].getAttribute(this.config.event_attribute) == d && l(this._rendered[h], h);
    }, r.changeEventId = function(d, l) {
      if (d != l) {
        var h = this._events[d];
        h && (h.id = l, this._events[l] = h, delete this._events[d]), this.for_rendered(d, function(v) {
          v.setAttribute("event_id", l), v.setAttribute(r.config.event_attribute, l);
        }), this._select_id == d && (this._select_id = l), this._edit_id == d && (this._edit_id = l), this.callEvent("onEventIdChange", [d, l]);
      }
    }, function() {
      for (var d = ["text", "Text", "start_date", "StartDate", "end_date", "EndDate"], l = function(m) {
        return function(f) {
          return r.getEvent(f)[m];
        };
      }, h = function(m) {
        return function(f, c) {
          var u = r.getEvent(f);
          u[m] = c, u._changed = !0, u._timed = this.isOneDayEvent(u), r.event_updated(u, !0);
        };
      }, v = 0; v < d.length; v += 2)
        r["getEvent" + d[v + 1]] = l(d[v]), r["setEvent" + d[v + 1]] = h(d[v]);
    }(), r.event_updated = function(d, l) {
      this.is_visible_events(d) ? this.render_view_data() : this.clear_event(d.id);
    }, r.is_visible_events = function(d) {
      if (!this._min_date || !this._max_date)
        return !1;
      if (d.start_date.valueOf() < this._max_date.valueOf() && this._min_date.valueOf() < d.end_date.valueOf()) {
        var l = d.start_date.getHours(), h = d.end_date.getHours() + d.end_date.getMinutes() / 60, v = this.config.last_hour, m = this.config.first_hour;
        return !(!this._table_view && (h > v || h <= m) && (l >= v || l < m) && !((d.end_date.valueOf() - d.start_date.valueOf()) / 36e5 > 24 - (this.config.last_hour - this.config.first_hour) || l < v && h > m));
      }
      return !1;
    }, r.isOneDayEvent = function(d) {
      var l = new Date(d.end_date.valueOf() - 1);
      return d.start_date.getFullYear() === l.getFullYear() && d.start_date.getMonth() === l.getMonth() && d.start_date.getDate() === l.getDate() && d.end_date.valueOf() - d.start_date.valueOf() < 864e5;
    }, r.get_visible_events = function(d) {
      var l = [];
      for (var h in this._events)
        this.is_visible_events(this._events[h]) && (d && !this._events[h]._timed || this.filter_event(h, this._events[h]) && l.push(this._events[h]));
      return l;
    }, r.filter_event = function(d, l) {
      var h = this["filter_" + this._mode];
      return !h || h(d, l);
    }, r._is_main_area_event = function(d) {
      return !!d._timed;
    }, r.render_view_data = function(d, l) {
      var h = !1;
      if (!d) {
        if (h = !0, this._not_render)
          return void (this._render_wait = !0);
        this._render_wait = !1, this.clear_view(), d = this.get_visible_events(!(this._table_view || this.config.multi_day));
      }
      for (var v = 0, m = d.length; v < m; v++)
        this._recalculate_timed(d[v]);
      if (this.config.multi_day && !this._table_view) {
        var f = [], c = [];
        for (v = 0; v < d.length; v++)
          this._is_main_area_event(d[v]) ? f.push(d[v]) : c.push(d[v]);
        if (!this._els.dhx_multi_day) {
          var u = r._commonErrorMessages.unknownView(this._mode);
          throw new Error(u);
        }
        this._rendered_location = this._els.dhx_multi_day[0], this._table_view = !0, this.render_data(c, l), this._table_view = !1, this._rendered_location = this._els.dhx_cal_data[0], this._table_view = !1, this.render_data(f, l);
      } else {
        var p = document.createDocumentFragment(), y = this._els.dhx_cal_data[0];
        this._rendered_location = p, this.render_data(d, l), y.appendChild(p), this._rendered_location = y;
      }
      h && this.callEvent("onDataRender", []);
    }, r._view_month_day = function(d) {
      var l = r.getActionData(d).date;
      r.callEvent("onViewMoreClick", [l]) && r.setCurrentView(l, "day");
    }, r._render_month_link = function(d) {
      for (var l = this._rendered_location, h = this._lame_clone(d), v = d._sday; v < d._eday; v++) {
        h._sday = v, h._eday = v + 1;
        var m = r.date, f = r._min_date;
        f = m.add(f, h._sweek, "week"), f = m.add(f, h._sday, "day");
        var c = r.getEvents(f, m.add(f, 1, "day")).length, u = this._get_event_bar_pos(h), p = u.x2 - u.x, y = document.createElement("div");
        r.event(y, "click", function(x) {
          r._view_month_day(x);
        }), y.className = "dhx_month_link", y.style.top = u.y + "px", y.style.left = u.x + "px", y.style.width = p + "px", y.innerHTML = r.templates.month_events_link(f, c), this._rendered.push(y), l.appendChild(y);
      }
    }, r._recalculate_timed = function(d) {
      var l;
      d && (l = typeof d != "object" ? this._events[d] : d) && (l._timed = r.isOneDayEvent(l));
    }, r.attachEvent("onEventChanged", r._recalculate_timed), r.attachEvent("onEventAdded", r._recalculate_timed), r.render_data = function(d, l) {
      d = this._pre_render_events(d, l);
      for (var h = {}, v = 0; v < d.length; v++)
        if (this._table_view)
          if (r._mode != "month")
            this.render_event_bar(d[v]);
          else {
            var m = r.config.max_month_events;
            m !== 1 * m || d[v]._sorder < m ? this.render_event_bar(d[v]) : m !== void 0 && d[v]._sorder == m && r._render_month_link(d[v]);
          }
        else {
          var f = d[v], c = r.locate_holder(f._sday);
          if (!c)
            continue;
          h[f._sday] || (h[f._sday] = { real: c, buffer: document.createDocumentFragment(), width: c.clientWidth });
          var u = h[f._sday];
          this.render_event(f, u.buffer, u.width);
        }
      for (var v in h)
        (u = h[v]).real && u.buffer && u.real.appendChild(u.buffer);
    }, r._get_first_visible_cell = function(d) {
      for (var l = 0; l < d.length; l++)
        if ((d[l].className || "").indexOf("dhx_scale_ignore") == -1)
          return d[l];
      return d[0];
    }, r._pre_render_events = function(d, l) {
      var h = this.xy.bar_height, v = this._colsS.heights, m = this._colsS.heights = [0, 0, 0, 0, 0, 0, 0], f = this._els.dhx_cal_data[0];
      if (d = this._table_view ? this._pre_render_events_table(d, l) : this._pre_render_events_line(d, l), this._table_view)
        if (l)
          this._colsS.heights = v;
        else {
          var c = f.querySelectorAll(".dhx_cal_month_row");
          if (c.length) {
            for (var u = 0; u < c.length; u++) {
              m[u]++;
              var p = c[u].querySelectorAll(".dhx_cal_month_cell"), y = this._colsS.height - this.xy.month_head_height;
              if (m[u] * h > y) {
                var x = y;
                1 * this.config.max_month_events !== this.config.max_month_events || m[u] <= this.config.max_month_events ? x = m[u] * h : (this.config.max_month_events + 1) * h > y && (x = (this.config.max_month_events + 1) * h), c[u].style.height = x + this.xy.month_head_height + "px";
              }
              m[u] = (m[u - 1] || 0) + r._get_first_visible_cell(p).offsetHeight;
            }
            m.unshift(0);
            const N = this.$container.querySelector(".dhx_cal_data");
            if (N.offsetHeight < N.scrollHeight && !r._colsS.scroll_fix && r.xy.scroll_width) {
              var S = r._colsS, k = S[S.col_length], D = S.heights.slice();
              k -= r.xy.scroll_width || 0, this._calc_scale_sizes(k, this._min_date, this._max_date), r._colsS.heights = D, this.set_xy(this._els.dhx_cal_header[0], k), r._render_scales(this._els.dhx_cal_header[0]), r._render_month_scale(this._els.dhx_cal_data[0], this._get_timeunit_start(), this._min_date), S.scroll_fix = !0;
            }
          } else if (d.length || this._els.dhx_multi_day[0].style.visibility != "visible" || (m[0] = -1), d.length || m[0] == -1) {
            var M = (m[0] + 1) * h + 4, g = M, b = M + "px";
            this.config.multi_day_height_limit && (b = (g = Math.min(M, this.config.multi_day_height_limit)) + "px");
            var w = this._els.dhx_multi_day[0];
            w.style.height = b, w.style.visibility = m[0] == -1 ? "hidden" : "visible", w.style.display = m[0] == -1 ? "none" : "";
            var E = this._els.dhx_multi_day[1];
            E.style.height = b, E.style.visibility = m[0] == -1 ? "hidden" : "visible", E.style.display = m[0] == -1 ? "none" : "", E.className = m[0] ? "dhx_multi_day_icon" : "dhx_multi_day_icon_small", this._dy_shift = (m[0] + 1) * h, this.config.multi_day_height_limit && (this._dy_shift = Math.min(this.config.multi_day_height_limit, this._dy_shift)), m[0] = 0, g != M && (w.style.overflowY = "auto", E.style.position = "fixed", E.style.top = "", E.style.left = "");
          }
        }
      return d;
    }, r._get_event_sday = function(d) {
      var l = this.date.day_start(new Date(d.start_date));
      return Math.round((l.valueOf() - this._min_date.valueOf()) / 864e5);
    }, r._get_event_mapped_end_date = function(d) {
      var l = d.end_date;
      if (this.config.separate_short_events) {
        var h = (d.end_date - d.start_date) / 6e4;
        h < this._min_mapped_duration && (l = this.date.add(l, this._min_mapped_duration - h, "minute"));
      }
      return l;
    }, r._pre_render_events_line = function(d, l) {
      d.sort(function(E, N) {
        return E.start_date.valueOf() == N.start_date.valueOf() ? E.id > N.id ? 1 : -1 : E.start_date > N.start_date ? 1 : -1;
      });
      var h = [], v = [];
      this._min_mapped_duration = Math.floor(60 * this.xy.min_event_height / this.config.hour_size_px);
      for (var m = 0; m < d.length; m++) {
        var f = d[m], c = f.start_date, u = f.end_date, p = c.getHours(), y = u.getHours();
        if (f._sday = this._get_event_sday(f), this._ignores[f._sday])
          d.splice(m, 1), m--;
        else {
          if (h[f._sday] || (h[f._sday] = []), !l) {
            f._inner = !1;
            for (var x = h[f._sday]; x.length; ) {
              var S = x[x.length - 1];
              if (!(this._get_event_mapped_end_date(S).valueOf() <= f.start_date.valueOf()))
                break;
              x.splice(x.length - 1, 1);
            }
            for (var k = x.length, D = !1, M = 0; M < x.length; M++)
              if (S = x[M], this._get_event_mapped_end_date(S).valueOf() <= f.start_date.valueOf()) {
                D = !0, f._sorder = S._sorder, k = M, f._inner = !0;
                break;
              }
            if (x.length && (x[x.length - 1]._inner = !0), !D)
              if (x.length)
                if (x.length <= x[x.length - 1]._sorder) {
                  if (x[x.length - 1]._sorder)
                    for (M = 0; M < x.length; M++) {
                      for (var g = !1, b = 0; b < x.length; b++)
                        if (x[b]._sorder == M) {
                          g = !0;
                          break;
                        }
                      if (!g) {
                        f._sorder = M;
                        break;
                      }
                    }
                  else
                    f._sorder = 0;
                  f._inner = !0;
                } else {
                  var w = x[0]._sorder;
                  for (M = 1; M < x.length; M++)
                    x[M]._sorder > w && (w = x[M]._sorder);
                  f._sorder = w + 1, f._inner = !1;
                }
              else
                f._sorder = 0;
            x.splice(k, k == x.length ? 0 : 1, f), x.length > (x.max_count || 0) ? (x.max_count = x.length, f._count = x.length) : f._count = f._count ? f._count : 1;
          }
          (p < this.config.first_hour || y >= this.config.last_hour) && (v.push(f), d[m] = f = this._copy_event(f), p < this.config.first_hour && (f.start_date.setHours(this.config.first_hour), f.start_date.setMinutes(0)), y >= this.config.last_hour && (f.end_date.setMinutes(0), f.end_date.setHours(this.config.last_hour)), f.start_date > f.end_date || p == this.config.last_hour) && (d.splice(m, 1), m--);
        }
      }
      if (!l) {
        for (m = 0; m < d.length; m++)
          d[m]._count = h[d[m]._sday].max_count;
        for (m = 0; m < v.length; m++)
          v[m]._count = h[v[m]._sday].max_count;
      }
      return d;
    }, r._time_order = function(d) {
      d.sort(function(l, h) {
        return l.start_date.valueOf() == h.start_date.valueOf() ? l._timed && !h._timed ? 1 : !l._timed && h._timed ? -1 : l.id > h.id ? 1 : -1 : l.start_date > h.start_date ? 1 : -1;
      });
    }, r._is_any_multiday_cell_visible = function(d, l, h) {
      var v = this._cols.length, m = !1, f = d, c = !0, u = new Date(l);
      for (r.date.day_start(new Date(l)).valueOf() != l.valueOf() && (u = r.date.day_start(u), u = r.date.add(u, 1, "day")); f < u; ) {
        c = !1;
        var p = this.locate_holder_day(f, !1, h) % v;
        if (!this._ignores[p]) {
          m = !0;
          break;
        }
        f = r.date.add(f, 1, "day");
      }
      return c || m;
    }, r._pre_render_events_table = function(d, l) {
      this._time_order(d);
      for (var h, v = [], m = [[], [], [], [], [], [], []], f = this._colsS.heights, c = this._cols.length, u = {}, p = 0; p < d.length; p++) {
        var y = d[p], x = y.id;
        u[x] || (u[x] = { first_chunk: !0, last_chunk: !0 });
        var S = u[x], k = h || y.start_date, D = y.end_date;
        k < this._min_date && (S.first_chunk = !1, k = this._min_date), D > this._max_date && (S.last_chunk = !1, D = this._max_date);
        var M = this.locate_holder_day(k, !1, y);
        if (y._sday = M % c, !this._ignores[y._sday] || !y._timed) {
          var g = this.locate_holder_day(D, !0, y) || c;
          if (y._eday = g % c || c, y._length = g - M, y._sweek = Math.floor((this._correct_shift(k.valueOf(), 1) - this._min_date.valueOf()) / (864e5 * c)), r._is_any_multiday_cell_visible(k, D, y)) {
            var b, w = m[y._sweek];
            for (b = 0; b < w.length && !(w[b]._eday <= y._sday); b++)
              ;
            if (y._sorder && l || (y._sorder = b), y._sday + y._length <= c)
              h = null, v.push(y), w[b] = y, f[y._sweek] = w.length - 1, y._first_chunk = S.first_chunk, y._last_chunk = S.last_chunk;
            else {
              var E = this._copy_event(y);
              E.id = y.id, E._length = c - y._sday, E._eday = c, E._sday = y._sday, E._sweek = y._sweek, E._sorder = y._sorder, E.end_date = this.date.add(k, E._length, "day"), E._first_chunk = S.first_chunk, S.first_chunk && (S.first_chunk = !1), v.push(E), w[b] = E, h = E.end_date, f[y._sweek] = w.length - 1, p--;
            }
          } else
            h = null;
        }
      }
      return v;
    }, r._copy_dummy = function() {
      var d = new Date(this.start_date), l = new Date(this.end_date);
      this.start_date = d, this.end_date = l;
    }, r._copy_event = function(d) {
      return this._copy_dummy.prototype = d, new this._copy_dummy();
    }, r._rendered = [], r.clear_view = function() {
      for (var d = 0; d < this._rendered.length; d++) {
        var l = this._rendered[d];
        l.parentNode && l.parentNode.removeChild(l);
      }
      this._rendered = [];
    }, r.updateEvent = function(d) {
      var l = this.getEvent(d);
      this.clear_event(d), l && this.is_visible_events(l) && this.filter_event(d, l) && (this._table_view || this.config.multi_day || l._timed) && (this.config.update_render ? this.render_view_data() : this.getState().mode != "month" || this.getState().drag_id || this.isOneDayEvent(l) ? this.render_view_data([l], !0) : this.render_view_data());
    }, r.clear_event = function(d) {
      this.for_rendered(d, function(l, h) {
        l.parentNode && l.parentNode.removeChild(l), r._rendered.splice(h, 1);
      });
    }, r._y_from_date = function(d) {
      var l = 60 * d.getHours() + d.getMinutes();
      return Math.round((60 * l * 1e3 - 60 * this.config.first_hour * 60 * 1e3) * this.config.hour_size_px / 36e5) % (24 * this.config.hour_size_px);
    }, r._calc_event_y = function(d, l) {
      l = l || 0;
      var h = 60 * d.start_date.getHours() + d.start_date.getMinutes(), v = 60 * d.end_date.getHours() + d.end_date.getMinutes() || 60 * r.config.last_hour;
      return { top: this._y_from_date(d.start_date), height: Math.max(l, (v - h) * this.config.hour_size_px / 60) };
    }, r.render_event = function(d, l, h) {
      var v = r.xy.menu_width, m = this.config.use_select_menu_space ? 0 : v;
      if (!(d._sday < 0)) {
        var f = r.locate_holder(d._sday);
        if (f) {
          l = l || f;
          var c = this._calc_event_y(d, r.xy.min_event_height), u = c.top, p = c.height, y = d._count || 1, x = d._sorder || 0;
          h = h || f.clientWidth, this.config.day_column_padding && (h -= this.config.day_column_padding);
          var S = Math.floor((h - m) / y), k = x * S + 1;
          if (d._inner || (S *= y - x), this.config.cascade_event_display) {
            const A = this.config.cascade_event_count, C = this.config.cascade_event_margin;
            let $, H = (y - x - 1) % A * C, O = x % A * C;
            y * C < h - this.config.day_column_padding ? $ = d._inner ? H / 2 : 0 : ($ = d._inner ? H / 3 : 0, k = O / 3, y * C / 2 > h - this.config.day_column_padding && ($ = d._inner ? H / A : 0, k = O / A)), S = Math.floor(h - m - k - $);
          }
          d._mode = p < 30 ? "smallest" : p < 42 ? "small" : null;
          var D = this._render_v_bar(d, m + k, u, S, p, d._text_style, r.templates.event_header(d.start_date, d.end_date, d), r.templates.event_text(d.start_date, d.end_date, d));
          if (d._mode === "smallest" ? D.classList.add("dhx_cal_event--xsmall") : d._mode === "small" && D.classList.add("dhx_cal_event--small"), this._waiAria.eventAttr(d, D), this._rendered.push(D), l.appendChild(D), k = k + parseInt(this.config.rtl ? f.style.right : f.style.left, 10) + m, this._edit_id == d.id) {
            D.style.zIndex = 1, S = Math.max(S, r.xy.editor_width), (D = document.createElement("div")).setAttribute("event_id", d.id), D.setAttribute(this.config.event_attribute, d.id), this._waiAria.eventAttr(d, D), D.className = "dhx_cal_event dhx_cal_editor", this.config.rtl && k++, this.set_xy(D, S, p, k, u), d.color && D.style.setProperty("--dhx-scheduler-event-background", d.color);
            var M = r.templates.event_class(d.start_date, d.end_date, d);
            M && (D.className += " " + M);
            var g = document.createElement("div");
            g.style.cssText += "overflow:hidden;height:100%", D.appendChild(g), this._els.dhx_cal_data[0].appendChild(D), this._rendered.push(D), g.innerHTML = "<textarea class='dhx_cal_editor'>" + d.text + "</textarea>", this._editor = g.querySelector("textarea"), r.event(this._editor, "keydown", function(A) {
              if (A.shiftKey)
                return !0;
              var C = A.keyCode;
              C == r.keys.edit_save && r.editStop(!0), C == r.keys.edit_cancel && r.editStop(!1), C != r.keys.edit_save && C != r.keys.edit_cancel || A.preventDefault && A.preventDefault();
            }), r.event(this._editor, "selectstart", function(A) {
              return A.cancelBubble = !0, !0;
            }), r._focus(this._editor, !0), this._els.dhx_cal_data[0].scrollLeft = 0;
          }
          if (this.xy.menu_width !== 0 && this._select_id == d.id) {
            this.config.cascade_event_display && this._drag_mode && (D.style.zIndex = 1);
            for (var b, w = this.config["icons_" + (this._edit_id == d.id ? "edit" : "select")], E = "", N = 0; N < w.length; N++) {
              const A = w[N];
              b = this._waiAria.eventMenuAttrString(A), E += `<div class='dhx_menu_icon ${A}' title='${this.locale.labels[A]}' ${b}></div>`;
            }
            var T = this._render_v_bar(d, k - v - 1, u, v, null, "", "<div class='dhx_menu_head'></div>", E, !0);
            d.color && T.style.setProperty("--dhx-scheduler-event-background", d.color), d.textColor && T.style.setProperty("--dhx-scheduler-event-color", d.textColor), this._els.dhx_cal_data[0].appendChild(T), this._rendered.push(T);
          }
          this.config.drag_highlight && this._drag_id == d.id && this.highlightEventPosition(d);
        }
      }
    }, r._render_v_bar = function(d, l, h, v, m, f, c, u, p) {
      var y = document.createElement("div"), x = d.id, S = p ? "dhx_cal_event dhx_cal_select_menu" : "dhx_cal_event", k = r.getState();
      k.drag_id == d.id && (S += " dhx_cal_event_drag"), k.select_id == d.id && (S += " dhx_cal_event_selected");
      var D = r.templates.event_class(d.start_date, d.end_date, d);
      D && (S = S + " " + D), this.config.cascade_event_display && (S += " dhx_cal_event_cascade");
      var M = v - 1, g = `<div event_id="${x}" ${this.config.event_attribute}="${x}" class="${S}"
				style="position:absolute; top:${h}px; ${this.config.rtl ? "right:" : "left:"}${l}px; width:${M}px; height:${m}px; ${f || ""}" 
				data-bar-start="${d.start_date.valueOf()}" data-bar-end="${d.end_date.valueOf()}">
				</div>`;
      y.innerHTML = g;
      var b = y.cloneNode(!0).firstChild;
      if (!p && r.renderEvent(b, d, v, m, c, u))
        return d.color && b.style.setProperty("--dhx-scheduler-event-background", d.color), d.textColor && b.style.setProperty("--dhx-scheduler-event-color", d.textColor), b;
      b = y.firstChild, d.color && b.style.setProperty("--dhx-scheduler-event-background", d.color), d.textColor && b.style.setProperty("--dhx-scheduler-event-color", d.textColor);
      var w = '<div class="dhx_event_move dhx_header" >&nbsp;</div>';
      w += '<div class="dhx_event_move dhx_title">' + c + "</div>", w += '<div class="dhx_body">' + u + "</div>";
      var E = "dhx_event_resize dhx_footer";
      return (p || d._drag_resize === !1) && (E = "dhx_resize_denied " + E), w += '<div class="' + E + '" style=" width:' + (p ? " margin-top:-1px;" : "") + '" ></div>', b.innerHTML = w, b;
    }, r.renderEvent = function() {
      return !1;
    }, r.locate_holder = function(d) {
      return this._mode == "day" ? this._els.dhx_cal_data[0].firstChild : this._els.dhx_cal_data[0].childNodes[d];
    }, r.locate_holder_day = function(d, l) {
      var h = Math.floor((this._correct_shift(d, 1) - this._min_date) / 864e5);
      return l && this.date.time_part(d) && h++, h;
    }, r._get_dnd_order = function(d, l, h) {
      if (!this._drag_event)
        return d;
      this._drag_event._orig_sorder ? d = this._drag_event._orig_sorder : this._drag_event._orig_sorder = d;
      for (var v = l * d; v + l > h; )
        d--, v -= l;
      return Math.max(d, 0);
    }, r._get_event_bar_pos = function(d) {
      var l = this.config.rtl, h = this._colsS, v = h[d._sday], m = h[d._eday];
      l && (v = h[h.col_length] - h[d._eday] + h[0], m = h[h.col_length] - h[d._sday] + h[0]), m == v && (m = h[d._eday + 1]);
      var f = this.xy.bar_height, c = d._sorder;
      if (d.id == this._drag_id) {
        var u = h.heights[d._sweek + 1] - h.heights[d._sweek] - this.xy.month_head_height;
        c = r._get_dnd_order(c, f, u);
      }
      var p = c * f;
      return { x: v, x2: m, y: h.heights[d._sweek] + (h.height ? this.xy.month_scale_height + 2 : 2) + p };
    }, r.render_event_bar = function(d) {
      var l = this._rendered_location, h = this._get_event_bar_pos(d), v = h.y, m = h.x, f = h.x2, c = "";
      if (f) {
        var u = r.config.resize_month_events && this._mode == "month" && (!d._timed || r.config.resize_month_timed), p = document.createElement("div"), y = d.hasOwnProperty("_first_chunk") && d._first_chunk, x = d.hasOwnProperty("_last_chunk") && d._last_chunk, S = u && (d._timed || y), k = u && (d._timed || x), D = !0, M = "dhx_cal_event_clear";
        d._timed && !u || (D = !1, M = "dhx_cal_event_line"), y && (M += " dhx_cal_event_line_start"), x && (M += " dhx_cal_event_line_end"), S && (c += "<div class='dhx_event_resize dhx_event_resize_start'></div>"), k && (c += "<div class='dhx_event_resize dhx_event_resize_end'></div>");
        var g = r.templates.event_class(d.start_date, d.end_date, d);
        g && (M += " " + g);
        var b = d.color ? "--dhx-scheduler-event-background:" + d.color + ";" : "", w = d.textColor ? "--dhx-scheduler-event-color:" + d.textColor + ";" : "", E = ["position:absolute", "top:" + v + "px", "left:" + m + "px", "width:" + (f - m - (D ? 1 : 0)) + "px", "height:" + (this.xy.bar_height - 2) + "px", w, b, d._text_style || ""].join(";"), N = "<div event_id='" + d.id + "' " + this.config.event_attribute + "='" + d.id + "' class='" + M + "' style='" + E + "'" + this._waiAria.eventBarAttrString(d) + ">";
        u && (N += c), r.getState().mode != "month" || d._beforeEventChangedFlag || (d = r.getEvent(d.id)), d._timed && (N += `<span class='dhx_cal_event_clear_date'>${r.templates.event_bar_date(d.start_date, d.end_date, d)}</span>`), N += "<div class='dhx_cal_event_line_content'>", N += r.templates.event_bar_text(d.start_date, d.end_date, d) + "</div>", N += "</div>", N += "</div>", p.innerHTML = N, this._rendered.push(p.firstChild), l.appendChild(p.firstChild);
      }
    }, r._locate_event = function(d) {
      for (var l = null; d && !l && d.getAttribute; )
        l = d.getAttribute(this.config.event_attribute), d = d.parentNode;
      return l;
    }, r.edit = function(d) {
      this._edit_id != d && (this.editStop(!1, d), this._edit_id = d, this.updateEvent(d));
    }, r.editStop = function(d, l) {
      if (!l || this._edit_id != l) {
        var h = this.getEvent(this._edit_id);
        h && (d && (h.text = this._editor.value), this._edit_id = null, this._editor = null, this.updateEvent(h.id), this._edit_stop_event(h, d));
      }
    }, r._edit_stop_event = function(d, l) {
      this._new_event ? (l ? this.callEvent("onEventAdded", [d.id, d]) : d && this.deleteEvent(d.id, !0), this._new_event = null) : l && this.callEvent("onEventChanged", [d.id, d]);
    }, r.getEvents = function(d, l) {
      var h = [];
      for (var v in this._events) {
        var m = this._events[v];
        m && (!d && !l || m.start_date < l && m.end_date > d) && h.push(m);
      }
      return h;
    }, r.getRenderedEvent = function(d) {
      if (d) {
        for (var l = r._rendered, h = 0; h < l.length; h++) {
          var v = l[h];
          if (v.getAttribute(r.config.event_attribute) == d)
            return v;
        }
        return null;
      }
    }, r.showEvent = function(d, l) {
      d && typeof d == "object" && (l = d.mode, x = d.section, d = d.section);
      var h = typeof d == "number" || typeof d == "string" ? r.getEvent(d) : d;
      if (l = l || r._mode, h && (!this.checkEvent("onBeforeEventDisplay") || this.callEvent("onBeforeEventDisplay", [h, l]))) {
        var v = r.config.scroll_hour;
        r.config.scroll_hour = h.start_date.getHours();
        var m = r.config.preserve_scroll;
        r.config.preserve_scroll = !1;
        var f = h.color, c = h.textColor;
        if (r.config.highlight_displayed_event && (h.color = r.config.displayed_event_color, h.textColor = r.config.displayed_event_text_color), r.setCurrentView(new Date(h.start_date), l), r.config.scroll_hour = v, r.config.preserve_scroll = m, r.matrix && r.matrix[l]) {
          var u = r.getView(), p = u.y_property, y = r.getEvent(h.id);
          if (y) {
            if (!x) {
              var x = y[p];
              Array.isArray(x) ? x = x[0] : typeof x == "string" && r.config.section_delimiter && x.indexOf(r.config.section_delimiter) > -1 && (x = x.split(r.config.section_delimiter)[0]);
            }
            var S = u.getSectionTop(x), k = u.posFromDate(y.start_date), D = r.$container.querySelector(".dhx_timeline_data_wrapper");
            if (k -= (D.offsetWidth - u.dx) / 2, S = S - D.offsetHeight / 2 + u.dy / 2, u._smartRenderingEnabled())
              var M = u.attachEvent("onScroll", function() {
                g(), u.detachEvent(M);
              });
            u.scrollTo({ left: k, top: S }), u._smartRenderingEnabled() || g();
          }
        } else
          g();
        r.callEvent("onAfterEventDisplay", [h, l]);
      }
      function g() {
        h.color = f, h.textColor = c;
      }
    };
  }(i), function(r) {
    r._append_drag_marker = function(d) {
      if (!d.parentNode) {
        var l = r._els.dhx_cal_data[0].lastChild, h = r._getClassName(l);
        h.indexOf("dhx_scale_holder") < 0 && l.previousSibling && (l = l.previousSibling), h = r._getClassName(l), l && h.indexOf("dhx_scale_holder") === 0 && l.appendChild(d);
      }
    }, r._update_marker_position = function(d, l) {
      var h = r._calc_event_y(l, 0);
      d.style.top = h.top + "px", d.style.height = h.height + "px";
    }, r.highlightEventPosition = function(d) {
      var l = document.createElement("div");
      l.setAttribute("event_id", d.id), l.setAttribute(this.config.event_attribute, d.id), this._rendered.push(l), this._update_marker_position(l, d);
      var h = this.templates.drag_marker_class(d.start_date, d.end_date, d), v = this.templates.drag_marker_content(d.start_date, d.end_date, d);
      l.className = "dhx_drag_marker", h && (l.className += " " + h), v && (l.innerHTML = v), this._append_drag_marker(l);
    };
  }(i), Ft(i), Bt(i), Jt(i), function(r) {
    r.getRootView = function() {
      return { view: { render: function() {
        return { tag: "div", type: 1, attrs: { style: "width:100%;height:100%;" }, hooks: { didInsert: function() {
          r.setCurrentView();
        } }, body: [{ el: this.el, type: 1 }] };
      }, init: function() {
        var d = document.createElement("DIV");
        d.id = "scheduler_" + r.uid(), d.style.width = "100%", d.style.height = "100%", d.classList.add("dhx_cal_container"), d.cmp = "grid", d.innerHTML = '<div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" data-tab="day"></div><div class="dhx_cal_tab" data-tab="week"></div><div class="dhx_cal_tab" data-tab="month"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>', r.init(d), this.el = d;
      } }, type: 4 };
    };
  }(i), Wt(i), window.jQuery && (n = window.jQuery, o = 0, a = [], n.fn.dhx_scheduler = function(r) {
    if (typeof r != "string") {
      var d = [];
      return this.each(function() {
        if (this && this.getAttribute)
          if (this.getAttribute("dhxscheduler"))
            d.push(window[this.getAttribute("dhxscheduler")]);
          else {
            var l = "scheduler";
            o && (l = "scheduler" + (o + 1), window[l] = Scheduler.getSchedulerInstance());
            var h = window[l];
            for (var v in this.setAttribute("dhxscheduler", l), r)
              v != "data" && (h.config[v] = r[v]);
            this.getElementsByTagName("div").length || (this.innerHTML = '<div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" name="day_tab" data-tab="day" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" data-tab="week" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" data-tab="month" style="right:76px;"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>', this.className += " dhx_cal_container"), h.init(this, h.config.date, h.config.mode), r.data && h.parse(r.data), d.push(h), o++;
          }
      }), d.length === 1 ? d[0] : d;
    }
    if (a[r])
      return a[r].apply(this, []);
    n.error("Method " + r + " does not exist on jQuery.dhx_scheduler");
  }), function(r) {
    (function() {
      var d = r.setCurrentView, l = r.updateView, h = null, v = null, m = function(u, p) {
        var y = this;
        le.clearTimeout(v), le.clearTimeout(h);
        var x = y._date, S = y._mode;
        c(this, u, p), v = setTimeout(function() {
          r.$destroyed || (y.callEvent("onBeforeViewChange", [S, x, p || y._mode, u || y._date]) ? (l.call(y, u, p), y.callEvent("onViewChange", [y._mode, y._date]), le.clearTimeout(h), v = 0) : c(y, x, S));
        }, r.config.delay_render);
      }, f = function(u, p) {
        var y = this, x = arguments;
        c(this, u, p), le.clearTimeout(h), h = setTimeout(function() {
          r.$destroyed || v || l.apply(y, x);
        }, r.config.delay_render);
      };
      function c(u, p, y) {
        p && (u._date = p), y && (u._mode = y);
      }
      r.attachEvent("onSchedulerReady", function() {
        r.config.delay_render ? (r.setCurrentView = m, r.updateView = f) : (r.setCurrentView = d, r.updateView = l);
      });
    })();
  }(i), function(r) {
    r.createDataProcessor = function(d) {
      var l, h;
      d instanceof Function ? l = d : d.hasOwnProperty("router") ? l = d.router : d.hasOwnProperty("event") && (l = d), h = l ? "CUSTOM" : d.mode || "REST-JSON";
      var v = new He(d.url);
      return v.init(r), v.setTransactionMode({ mode: h, router: l }, d.batchUpdate), v;
    }, r.DataProcessor = He;
  }(i), function(r) {
    r.attachEvent("onSchedulerReady", function() {
      typeof dhtmlxError < "u" && window.dhtmlxError.catchError("LoadXML", function(d, l, h) {
        var v = h[0].responseText;
        switch (r.config.ajax_error) {
          case "alert":
            le.alert(v);
            break;
          case "console":
            le.console.log(v);
        }
      });
    });
  }(i);
  const s = new fa({ en: ia, ar: Xt, be: Zt, ca: Qt, cn: ea, cs: ta, da: aa, de: na, el: ra, es: oa, fi: sa, fr: da, he: _a, hu: la, id: ca, it: ha, jp: ua, nb: pa, nl: va, no: ma, pl: ga, pt: ya, ro: ba, ru: xa, si: wa, sk: ka, sv: Ea, tr: Da, ua: Sa });
  i.i18n = { addLocale: s.addLocale, setLocale: function(r) {
    if (typeof r == "string") {
      var d = s.getLocale(r);
      d || (d = s.getLocale("en")), i.locale = d;
    } else if (r)
      if (i.locale)
        for (var l in r)
          r[l] && typeof r[l] == "object" ? (i.locale[l] || (i.locale[l] = {}), i.mixin(i.locale[l], r[l], !0)) : i.locale[l] = r[l];
      else
        i.locale = r;
    var h = i.locale.labels;
    h.dhx_save_btn = h.icon_save, h.dhx_cancel_btn = h.icon_cancel, h.dhx_delete_btn = h.icon_delete, i.$container && i.get_elements();
  }, getLocale: s.getLocale }, i.i18n.setLocale("en"), i.ext = {}, Ot(i);
  const _ = {};
  return i.plugins = function(r) {
    (function(l, h, v) {
      const m = [];
      for (const f in l)
        if (l[f]) {
          const c = f.toLowerCase();
          h[c] && h[c].forEach(function(u) {
            const p = u.toLowerCase();
            l[p] || m.push(p);
          }), m.push(c);
        }
      return m.sort(function(f, c) {
        const u = v[f] || 0, p = v[c] || 0;
        return u > p ? 1 : u < p ? -1 : 0;
      }), m;
    })(r, { treetimeline: ["timeline"], daytimeline: ["timeline"], outerdrag: ["legacy"] }, { legacy: 1, limit: 1, timeline: 2, daytimeline: 3, treetimeline: 3, outerdrag: 6 }).forEach(function(l) {
      if (!_[l]) {
        const h = e.getExtension(l);
        if (!h)
          throw new Error("unknown plugin " + l);
        h(i), _[l] = !0;
      }
    });
  }, i.plugins({ all_timed: "short" }), i;
}
class Ta {
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
typeof dhtmlx < "u" && dhtmlx.attaches && (dhtmlx.attaches.attachScheduler = function(e, i, t, n) {
  t = t || '<div class="dhx_cal_tab" name="day_tab" data-tab="day" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" data-tab="week" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" data-tab="month" style="right:76px;"></div>';
  var o = document.createElement("DIV");
  return o.id = "dhxSchedObj_" + this._genStr(12), o.innerHTML = '<div id="' + o.id + '" class="dhx_cal_container" style="width:100%; height:100%;"><div class="dhx_cal_navline"><div class="dhx_cal_prev_button"></div><div class="dhx_cal_next_button"></div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div>' + t + '</div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div></div>', document.body.appendChild(o.firstChild), this.attachObject(o.id, !1, !0), this.vs[this.av].sched = n, this.vs[this.av].schedId = o.id, n.setSizes = n.updateView, n.destructor = function() {
  }, n.init(o.id, e, i), this.vs[this._viewRestore()].sched;
});
const he = (e, i) => {
  i(!1, `The ${e} extension is not included in this version of dhtmlxScheduler.<br>
		You may need a <a href="https://docs.dhtmlx.com/scheduler/editions_comparison.html" target="_blank">Professional version of the component</a>.<br>
		Contact us at <a href="https://dhtmlx.com/docs/contact.shtml" target="_blank">https://dhtmlx.com/docs/contact.shtml</a> if you have any questions.`);
};
function Aa(e) {
  (function() {
    var i = [];
    function t() {
      return !!i.length;
    }
    function n(_) {
      setTimeout(function() {
        if (e.$destroyed)
          return !0;
        t() || function(r, d) {
          for (; r && r != d; )
            r = r.parentNode;
          return r == d;
        }(document.activeElement, e.$container) || e.focus();
      }, 1);
    }
    function o(_) {
      var r = (_ = _ || window.event).currentTarget;
      r == i[i.length - 1] && e.$keyboardNavigation.trapFocus(r, _);
    }
    if (e.attachEvent("onLightbox", function() {
      var _;
      _ = e.getLightbox(), e.eventRemove(_, "keydown", o), e.event(_, "keydown", o), i.push(_);
    }), e.attachEvent("onAfterLightbox", function() {
      var _ = i.pop();
      _ && e.eventRemove(_, "keydown", o), n();
    }), e.attachEvent("onAfterQuickInfo", function() {
      n();
    }), !e._keyNavMessagePopup) {
      e._keyNavMessagePopup = !0;
      var a = null, s = null;
      const _ = [];
      e.attachEvent("onMessagePopup", function(r) {
        for (a = document.activeElement, s = a; s && e._getClassName(s).indexOf("dhx_cal_data") < 0; )
          s = s.parentNode;
        s && (s = s.parentNode), e.eventRemove(r, "keydown", o), e.event(r, "keydown", o), _.push(r);
      }), e.attachEvent("onAfterMessagePopup", function() {
        var r = _.pop();
        r && e.eventRemove(r, "keydown", o), setTimeout(function() {
          if (e.$destroyed)
            return !0;
          for (var d = document.activeElement; d && e._getClassName(d).indexOf("dhx_cal_light") < 0; )
            d = d.parentNode;
          d || (a && a.parentNode ? a.focus() : s && s.parentNode && s.focus(), a = null, s = null);
        }, 1);
      });
    }
    e.$keyboardNavigation.isModal = t;
  })();
}
function Ca(e) {
  e._temp_key_scope = function() {
    e.config.key_nav = !0, e.$keyboardNavigation._pasteDate = null, e.$keyboardNavigation._pasteSection = null;
    var i = null, t = {};
    function n(s) {
      s = s || window.event, t.x = s.clientX, t.y = s.clientY;
    }
    function o() {
      for (var s, _, r = document.elementFromPoint(t.x, t.y); r && r != e._obj; )
        r = r.parentNode;
      return s = r == e._obj, _ = e.$keyboardNavigation.dispatcher.isEnabled(), s || _;
    }
    function a(s) {
      return e._lame_copy({}, s);
    }
    document.body ? e.event(document.body, "mousemove", n) : e.event(window, "load", function() {
      e.event(document.body, "mousemove", n);
    }), e.attachEvent("onMouseMove", function(s, _) {
      var r = e.getState();
      if (r.mode && r.min_date) {
        var d = e.getActionData(_);
        e.$keyboardNavigation._pasteDate = d.date, e.$keyboardNavigation._pasteSection = d.section;
      }
    }), e._make_pasted_event = function(s) {
      var _ = e.$keyboardNavigation._pasteDate, r = e.$keyboardNavigation._pasteSection, d = s.end_date - s.start_date, l = a(s);
      if (function(v) {
        delete v.rec_type, delete v.rec_pattern, delete v.event_pid, delete v.event_length;
      }(l), l.start_date = new Date(_), l.end_date = new Date(l.start_date.valueOf() + d), r) {
        var h = e._get_section_property();
        e.config.multisection && s[h] && e.isMultisectionEvent && e.isMultisectionEvent(s) ? l[h] = s[h] : l[h] = r;
      }
      return l;
    }, e._do_paste = function(s, _, r) {
      e.callEvent("onBeforeEventPasted", [s, _, r]) !== !1 && (e.addEvent(_), e.callEvent("onEventPasted", [s, _, r]));
    }, e._is_key_nav_active = function() {
      return !(!this._is_initialized() || this._is_lightbox_open() || !this.config.key_nav);
    }, e.event(document, "keydown", function(s) {
      (s.ctrlKey || s.metaKey) && s.keyCode == 86 && e._buffer_event && !e.$keyboardNavigation.dispatcher.isEnabled() && (e.$keyboardNavigation.dispatcher.isActive = o());
    }), e._key_nav_copy_paste = function(s) {
      if (!e._is_key_nav_active())
        return !0;
      if (s.keyCode == 37 || s.keyCode == 39) {
        s.cancelBubble = !0;
        var _ = e.date.add(e._date, s.keyCode == 37 ? -1 : 1, e._mode);
        return e.setCurrentView(_), !0;
      }
      var r, d = (r = e.$keyboardNavigation.dispatcher.getActiveNode()) && r.eventId ? r.eventId : e._select_id;
      if ((s.ctrlKey || s.metaKey) && s.keyCode == 67)
        return d && (e._buffer_event = a(e.getEvent(d)), i = !0, e.callEvent("onEventCopied", [e.getEvent(d)])), !0;
      if ((s.ctrlKey || s.metaKey) && s.keyCode == 88 && d) {
        i = !1;
        var l = e._buffer_event = a(e.getEvent(d));
        e.updateEvent(l.id), e.callEvent("onEventCut", [l]);
      }
      if ((s.ctrlKey || s.metaKey) && s.keyCode == 86 && o()) {
        if (l = (l = e._buffer_event ? e.getEvent(e._buffer_event.id) : e._buffer_event) || e._buffer_event) {
          var h = e._make_pasted_event(l);
          i ? (h.id = e.uid(), e._do_paste(i, h, l)) : e.callEvent("onBeforeEventChanged", [h, s, !1, l]) && (e._do_paste(i, h, l), i = !0);
        }
        return !0;
      }
    };
  }, e._temp_key_scope();
}
function Oa(e) {
  e.$keyboardNavigation.attachSchedulerHandlers = function() {
    var i, t = e.$keyboardNavigation.dispatcher, n = function(r) {
      if (e.config.key_nav)
        return t.keyDownHandler(r);
    }, o = function() {
      t.keepScrollPosition(function() {
        t.focusGlobalNode();
      });
    };
    e.attachEvent("onDataRender", function() {
      e.config.key_nav && t.isEnabled() && !e.getState().editor_id && (clearTimeout(i), i = setTimeout(function() {
        if (e.$destroyed)
          return !0;
        t.isEnabled() || t.enable(), a();
      }));
    });
    var a = function() {
      if (t.isEnabled()) {
        var r = t.getActiveNode();
        r && (r.isValid() || (r = r.fallback()), !r || r instanceof e.$keyboardNavigation.MinicalButton || r instanceof e.$keyboardNavigation.MinicalCell || t.keepScrollPosition(function() {
          r.focus(!0);
        }));
      }
    };
    function s(r) {
      if (!e.config.key_nav)
        return !0;
      const d = e.getView();
      let l = !1;
      if (e.getState().mode === "month")
        l = e.$keyboardNavigation.isChildOf(r.target || r.srcElement, e.$container.querySelector(".dhx_cal_month_table"));
      else if (d && d.layout === "timeline")
        l = e.$keyboardNavigation.isChildOf(r.target || r.srcElement, e.$container.querySelector(".dhx_timeline_data_col"));
      else {
        const m = e.$container.querySelectorAll(".dhx_scale_holder");
        l = Array.from(m).some((f) => f === r.target.parentNode);
      }
      var h, v = e.getActionData(r);
      e._locate_event(r.target || r.srcElement) ? h = new e.$keyboardNavigation.Event(e._locate_event(r.target || r.srcElement)) : l && (h = new e.$keyboardNavigation.TimeSlot(), v.date && l && (h = h.nextSlot(new e.$keyboardNavigation.TimeSlot(v.date, null, v.section)))), h && (t.isEnabled() ? v.date && l && t.delay(function() {
        t.setActiveNode(h);
      }) : t.activeNode = h);
    }
    e.attachEvent("onSchedulerReady", function() {
      var r = e.$container;
      e.eventRemove(document, "keydown", n), e.eventRemove(r, "mousedown", s), e.eventRemove(r, "focus", o), e.config.key_nav ? (e.event(document, "keydown", n), e.event(r, "mousedown", s), e.event(r, "focus", o), r.setAttribute("tabindex", "0")) : r.removeAttribute("tabindex");
    });
    var _ = e.updateEvent;
    e.updateEvent = function(r) {
      var d = _.apply(this, arguments);
      if (e.config.key_nav && t.isEnabled() && e.getState().select_id == r) {
        var l = new e.$keyboardNavigation.Event(r);
        e.getState().lightbox_id || function(h) {
          if (e.config.key_nav && t.isEnabled()) {
            var v = h, m = new e.$keyboardNavigation.Event(v.eventId);
            if (!m.isValid()) {
              var f = m.start || v.start, c = m.end || v.end, u = m.section || v.section;
              (m = new e.$keyboardNavigation.TimeSlot(f, c, u)).isValid() || (m = new e.$keyboardNavigation.TimeSlot());
            }
            t.setActiveNode(m);
            var p = t.getActiveNode();
            p && p.getNode && document.activeElement != p.getNode() && t.focusNode(t.getActiveNode());
          }
        }(l);
      }
      return d;
    }, e.attachEvent("onEventDeleted", function(r) {
      return e.config.key_nav && t.isEnabled() && t.getActiveNode().eventId == r && t.setActiveNode(new e.$keyboardNavigation.TimeSlot()), !0;
    }), e.attachEvent("onClearAll", function() {
      if (!e.config.key_nav)
        return !0;
      t.isEnabled() && t.getActiveNode() instanceof e.$keyboardNavigation.Event && t.setActiveNode(new e.$keyboardNavigation.TimeSlot());
    });
  };
}
class La {
  constructor(i) {
    this.map = null, this._markers = [], this.scheduler = i;
  }
  onEventClick(i) {
    if (this._markers && this._markers.length > 0) {
      for (let t = 0; t < this._markers.length; t++)
        if (i.id == this._markers[t].event.id) {
          let n = this.settings.zoom_after_resolve || this.settings.initial_zoom;
          i.lat && i.lng ? (this.map.setCenter({ lat: i.lat, lng: i.lng }), this.map.setZoom(n)) : (this.map.setCenter({ lat: this.settings.error_position.lat, lng: this.settings.error_position.lng }), this.map.setZoom(n)), google.maps.event.trigger(this._markers[t].marker, "click");
        }
    }
  }
  initialize(i, t) {
    this.settings = t;
    let n = this.scheduler, o = { center: { lat: t.initial_position.lat, lng: t.initial_position.lng }, zoom: t.initial_zoom, mapId: i.id, scrollwheel: !0, mapTypeId: t.type };
    if (this.map === null)
      this.map = new google.maps.Map(i, o);
    else {
      let a = this.map;
      i.appendChild(this.map.__gm.messageOverlay), i.appendChild(this.map.__gm.outerContainer), setTimeout(function() {
        a.setOptions({ container: i.id });
      }, 500);
    }
    google.maps.event.addListener(this.map, "dblclick", function(a) {
      const s = new google.maps.Geocoder();
      if (!n.config.readonly && n.config.dblclick_create) {
        let _ = a.latLng;
        s.geocode({ latLng: _ }, function(r, d) {
          d == google.maps.GeocoderStatus.OK ? (_ = r[0].geometry.location, n.addEventNow({ lat: _.lat(), lng: _.lng(), event_location: r[0].formatted_address, start_date: n.getState().date, end_date: n.date.add(n.getState().date, n.config.time_step, "minute") })) : console.error("Geocode was not successful for the following reason: " + d);
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
    const { AdvancedMarkerElement: n } = await google.maps.importLibrary("marker");
    let o;
    this.scheduler.ext.mapView.createMarker ? (t.map = this.map, o = this.scheduler.ext.mapView.createMarker(t)) : (o = new n(t), o.map = this.map), o.setMap(this.map), i["!nativeeditor_status"] == "true_deleted" && o.setMap(null), google.maps.event.addListener(o, "click", () => {
      this.infoWindow && this.infoWindow.close(), this.infoWindow = new google.maps.InfoWindow({ maxWidth: this.settings.info_window_max_width }), this.infoWindow.setContent(this.scheduler.templates.map_info_content(i)), this.infoWindow.open({ anchor: o, map: this.map });
    });
    let a = { event: i, ...t, marker: o };
    this._markers.push(a);
  }
  removeEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      i == this._markers[t].event.id && (this._markers[t].marker.setVisible(!1), this._markers[t].marker.setMap(null), this._markers[t].marker.setPosition(null), this._markers[t].marker = null, this._markers.splice(t, 1), t--);
  }
  updateEventMarker(i) {
    for (let t = 0; t < this._markers.length; t++)
      if (this._markers[t].event.id == i.id) {
        this._markers[t].event = i, this._markers[t].position.lat = i.lat, this._markers[t].position.lng = i.lng, this._markers[t].text = i.text;
        let n = new google.maps.LatLng(i.lat, i.lng);
        this._markers[t].marker.setPosition(n);
      }
  }
  clearEventMarkers() {
    if (this._markers.length > 0) {
      for (let i = 0; i < this._markers.length; i++)
        this._markers[i].marker.setMap(null);
      this._markers = [];
    }
  }
  setView(i, t, n) {
    this.map.setCenter({ lat: i, lng: t }), this.map.setZoom(n);
  }
  async resolveAddress(i) {
    const t = new google.maps.Geocoder();
    return await new Promise((n) => {
      t.geocode({ address: i }, function(o, a) {
        a == google.maps.GeocoderStatus.OK ? n({ lat: o[0].geometry.location.lat(), lng: o[0].geometry.location.lng() }) : (console.error("Geocode was not successful for the following reason: " + a), n({}));
      });
    });
  }
}
class $a {
  constructor(i) {
    this.map = null, this._markers = [], this.scheduler = i;
  }
  onEventClick(i) {
    if (this._markers && this._markers.length > 0)
      for (let t = 0; t < this._markers.length; t++)
        i.id == this._markers[t].event.id && (this._markers[t].marker.openPopup(), this._markers[t].marker.closeTooltip(), i.lat && i.lng ? this.setView(i.lat, i.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom) : this.setView(this.settings.error_position.lat, this.settings.error_position.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom));
  }
  initialize(i, t) {
    let n = this.scheduler, o = document.createElement("div");
    o.className = "mapWrapper", o.id = "mapWrapper", o.style.width = i.style.width, o.style.height = i.style.height, i.appendChild(o);
    let a = L.map(o, { center: L.latLng(t.initial_position.lat, t.initial_position.lng), zoom: t.initial_zoom, keyboard: !1 });
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(a), a.on("dblclick", async function(s) {
      let _ = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${s.latlng.lat}&lon=${s.latlng.lng}&format=json`, { method: "GET", headers: { "Accept-Language": "en" } }).then((r) => r.json());
      if (_.address) {
        let r = _.address.country;
        n.addEventNow({ lat: s.latlng.lat, lng: s.latlng.lng, event_location: r, start_date: n.getState().date, end_date: n.date.add(n.getState().date, n.config.time_step, "minute") });
      } else
        console.error("unable recieve a position of the event", _.error);
    }), this.map = a, this.settings = t;
  }
  destroy(i) {
    for (this.map.remove(); i.firstChild; )
      i.firstChild.remove();
    i.innerHTML = "";
  }
  addEventMarker(i) {
    const t = L.icon({ iconUrl: "https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png", iconSize: [25, 41], shadowSize: [30, 65], iconAnchor: [12, 41], shadowAnchor: [7, 65] });
    let n = { minWidth: 180, maxWidth: this.settings.info_window_max_width };
    const o = L.popup(n).setContent(this.scheduler.templates.map_info_content(i)), a = L.tooltip().setContent(i.text);
    let s = [i.lat, i.lng];
    i.lat && i.lng || (s = [this.settings.error_position.lat, this.settings.error_position.lng]);
    const _ = { event: i, marker: L.marker(s, { icon: t }).bindPopup(o).bindTooltip(a).addTo(this.map) };
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
  setView(i, t, n) {
    this.map.setView([i, t], n);
  }
  async resolveAddress(i) {
    let t = {}, n = await fetch(`https://nominatim.openstreetmap.org/search?q=${i}&format=json`, { method: "GET", headers: { "Accept-Language": "en" } }).then((o) => o.json());
    return n && n.length ? (t.lat = +n[0].lat, t.lng = +n[0].lon) : console.error(`Unable recieve a position of the event's location: ${i}`), t;
  }
}
class Ha {
  constructor(i) {
    this.map = null, this._markers = [], this.scheduler = i;
  }
  onEventClick(i) {
    if (this._markers && this._markers.length > 0)
      for (let t = 0; t < this._markers.length; t++) {
        const n = this._markers[t].marker.getPopup();
        n.isOpen() && n.remove(), i.id == this._markers[t].event.id && (this._markers[t].marker.togglePopup(), i.lat && i.lng ? this.setView(i.lat, i.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom) : this.setView(this.settings.error_position.lat, this.settings.error_position.lng, this.settings.zoom_after_resolve || this.settings.initial_zoom));
      }
  }
  initialize(i, t) {
    let n = this.scheduler;
    mapboxgl.accessToken = t.accessToken;
    const o = new mapboxgl.Map({ container: i, center: [t.initial_position.lng, t.initial_position.lat], zoom: t.initial_zoom + 1 });
    o.on("dblclick", async function(a) {
      let s = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${a.lngLat.lng},${a.lngLat.lat}.json?access_token=${t.accessToken}`).then((_) => _.json());
      if (s.features) {
        let _ = s.features[0].place_name;
        n.addEventNow({ lat: a.lngLat.lat, lng: a.lngLat.lng, event_location: _, start_date: n.getState().date, end_date: n.date.add(n.getState().date, n.config.time_step, "minute") });
      } else
        console.error("unable recieve a position of the event");
    }), this.map = o, this.settings = t;
  }
  destroy(i) {
    for (this.map.remove(); i.firstChild; )
      i.firstChild.remove();
    i.innerHTML = "";
  }
  addEventMarker(i) {
    let t = [i.lng, i.lat];
    i.lat && i.lng || (t = [this.settings.error_position.lng, this.settings.error_position.lat]);
    const n = new mapboxgl.Popup({ offset: 25, focusAfterOpen: !1 }).setMaxWidth(`${this.settings.info_window_max_width}px`).setHTML(this.scheduler.templates.map_info_content(i)), o = { event: i, marker: new mapboxgl.Marker().setLngLat(t).setPopup(n).addTo(this.map) };
    this._markers.push(o);
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
  setView(i, t, n) {
    this.map.setCenter([t, i]), this.map.setZoom(n);
  }
  async resolveAddress(i) {
    let t = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${i}.json?access_token=${this.settings.accessToken}`).then((o) => o.json()), n = {};
    return t && t.features.length ? (n.lng = t.features[0].center[0], n.lat = t.features[0].center[1]) : console.error(`Unable recieve a position of the event's location: ${i}`), n;
  }
}
var ze = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"], Z = function() {
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
}(), J = function(e) {
  return e != null;
}, ie = function(e) {
  return typeof e == "number";
}, Xe = function(e) {
  return typeof e == "string" && ze.includes(e);
}, ee = Array.isArray, se = function(e, i) {
  i === void 0 && (i = e), arguments.length === 1 && (i = e, e = 0);
  for (var t = [], n = e; n < i; n++)
    t.push(n);
  return t;
}, V = function(e, i) {
  var t = 0, n = [];
  if (ee(e))
    for (; t < i; t++)
      n[t] = [].concat(e);
  else
    for (; t < i; t++)
      n[t] = e;
  return n;
};
function me(e, i, t) {
  t === void 0 && (t = " ");
  var n = String(e);
  return i |= 0, n.length > i ? String(n) : ((i -= n.length) > t.length && (t += V(t, i / t.length)), t.slice(0, i) + String(n));
}
var ae = function(e, i) {
  var t = e % i;
  return t * i < 0 ? t + i : t;
}, Ce = function(e, i) {
  return { div: Math.floor(e / i), mod: ae(e, i) };
}, oe = function(e) {
  return !J(e) || e.length === 0;
}, W = function(e) {
  return !oe(e);
}, B = function(e, i) {
  return W(e) && e.indexOf(i) !== -1;
}, ve = function(e, i, t, n, o, a) {
  return n === void 0 && (n = 0), o === void 0 && (o = 0), a === void 0 && (a = 0), new Date(Date.UTC(e, i - 1, t, n, o, a));
}, za = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], gt = 864e5, yt = ve(1970, 1, 1), qa = [6, 0, 1, 2, 3, 4, 5], xe = function(e) {
  return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}, bt = function(e) {
  return e instanceof Date;
}, we = function(e) {
  return bt(e) && !isNaN(e.getTime());
}, qe = function(e) {
  return i = yt, t = e.getTime() - i.getTime(), Math.round(t / gt);
  var i, t;
}, xt = function(e) {
  return new Date(yt.getTime() + e * gt);
}, ja = function(e) {
  var i = e.getUTCMonth();
  return i === 1 && xe(e.getUTCFullYear()) ? 29 : za[i];
}, be = function(e) {
  return qa[e.getUTCDay()];
}, Ze = function(e, i) {
  var t = ve(e, i + 1, 1);
  return [be(t), ja(t)];
}, wt = function(e, i) {
  return i = i || e, new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), i.getHours(), i.getMinutes(), i.getSeconds(), i.getMilliseconds()));
}, je = function(e) {
  return new Date(e.getTime());
}, Qe = function(e) {
  for (var i = [], t = 0; t < e.length; t++)
    i.push(je(e[t]));
  return i;
}, Ee = function(e) {
  e.sort(function(i, t) {
    return i.getTime() - t.getTime();
  });
}, Fe = function(e, i) {
  i === void 0 && (i = !0);
  var t = new Date(e);
  return [me(t.getUTCFullYear().toString(), 4, "0"), me(t.getUTCMonth() + 1, 2, "0"), me(t.getUTCDate(), 2, "0"), "T", me(t.getUTCHours(), 2, "0"), me(t.getUTCMinutes(), 2, "0"), me(t.getUTCSeconds(), 2, "0"), i ? "Z" : ""].join("");
}, Be = function(e) {
  var i = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/.exec(e);
  if (!i)
    throw new Error("Invalid UNTIL value: ".concat(e));
  return new Date(Date.UTC(parseInt(i[1], 10), parseInt(i[2], 10) - 1, parseInt(i[3], 10), parseInt(i[5], 10) || 0, parseInt(i[6], 10) || 0, parseInt(i[7], 10) || 0));
}, et = function(e, i) {
  return e.toLocaleString("sv-SE", { timeZone: i }).replace(" ", "T") + "Z";
}, ye = function() {
  function e(i, t) {
    this.minDate = null, this.maxDate = null, this._result = [], this.total = 0, this.method = i, this.args = t, i === "between" ? (this.maxDate = t.inc ? t.before : new Date(t.before.getTime() - 1), this.minDate = t.inc ? t.after : new Date(t.after.getTime() + 1)) : i === "before" ? this.maxDate = t.inc ? t.dt : new Date(t.dt.getTime() - 1) : i === "after" && (this.minDate = t.inc ? t.dt : new Date(t.dt.getTime() + 1));
  }
  return e.prototype.accept = function(i) {
    ++this.total;
    var t = this.minDate && i < this.minDate, n = this.maxDate && i > this.maxDate;
    if (this.method === "between") {
      if (t)
        return !0;
      if (n)
        return !1;
    } else if (this.method === "before") {
      if (n)
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
}(), Ie = function(e, i) {
  return Ie = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var o in n)
      Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
  }, Ie(e, i);
};
function Je(e, i) {
  if (typeof i != "function" && i !== null)
    throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
  function t() {
    this.constructor = e;
  }
  Ie(e, i), e.prototype = i === null ? Object.create(i) : (t.prototype = i.prototype, new t());
}
var te = function() {
  return te = Object.assign || function(e) {
    for (var i, t = 1, n = arguments.length; t < n; t++)
      for (var o in i = arguments[t])
        Object.prototype.hasOwnProperty.call(i, o) && (e[o] = i[o]);
    return e;
  }, te.apply(this, arguments);
};
function q(e, i, t) {
  if (t || arguments.length === 2)
    for (var n, o = 0, a = i.length; o < a; o++)
      !n && o in i || (n || (n = Array.prototype.slice.call(i, 0, o)), n[o] = i[o]);
  return e.concat(n || Array.prototype.slice.call(i));
}
var F, tt = function(e) {
  function i(t, n, o) {
    var a = e.call(this, t, n) || this;
    return a.iterator = o, a;
  }
  return Je(i, e), i.prototype.add = function(t) {
    return !!this.iterator(t, this._result.length) && (this._result.push(t), !0);
  }, i;
}(ye), De = { dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], tokens: { SKIP: /^[ \r\n\t]+|^\.$/, number: /^[1-9][0-9]*/, numberAsText: /^(one|two|three)/i, every: /^every/i, "day(s)": /^days?/i, "weekday(s)": /^weekdays?/i, "week(s)": /^weeks?/i, "hour(s)": /^hours?/i, "minute(s)": /^minutes?/i, "month(s)": /^months?/i, "year(s)": /^years?/i, on: /^(on|in)/i, at: /^(at)/i, the: /^the/i, first: /^first/i, second: /^second/i, third: /^third/i, nth: /^([1-9][0-9]*)(\.|th|nd|rd|st)/i, last: /^last/i, for: /^for/i, "time(s)": /^times?/i, until: /^(un)?til/i, monday: /^mo(n(day)?)?/i, tuesday: /^tu(e(s(day)?)?)?/i, wednesday: /^we(d(n(esday)?)?)?/i, thursday: /^th(u(r(sday)?)?)?/i, friday: /^fr(i(day)?)?/i, saturday: /^sa(t(urday)?)?/i, sunday: /^su(n(day)?)?/i, january: /^jan(uary)?/i, february: /^feb(ruary)?/i, march: /^mar(ch)?/i, april: /^apr(il)?/i, may: /^may/i, june: /^june?/i, july: /^july?/i, august: /^aug(ust)?/i, september: /^sep(t(ember)?)?/i, october: /^oct(ober)?/i, november: /^nov(ember)?/i, december: /^dec(ember)?/i, comma: /^(,\s*|(and|or)\s*)+/i } }, at = function(e, i) {
  return e.indexOf(i) !== -1;
}, Ia = function(e) {
  return e.toString();
}, Ra = function(e, i, t) {
  return "".concat(i, " ").concat(t, ", ").concat(e);
}, _e = function() {
  function e(i, t, n, o) {
    if (t === void 0 && (t = Ia), n === void 0 && (n = De), o === void 0 && (o = Ra), this.text = [], this.language = n || De, this.gettext = t, this.dateFormatter = o, this.rrule = i, this.options = i.options, this.origOptions = i.origOptions, this.origOptions.bymonthday) {
      var a = [].concat(this.options.bymonthday), s = [].concat(this.options.bynmonthday);
      a.sort(function(l, h) {
        return l - h;
      }), s.sort(function(l, h) {
        return h - l;
      }), this.bymonthday = a.concat(s), this.bymonthday.length || (this.bymonthday = null);
    }
    if (J(this.origOptions.byweekday)) {
      var _ = ee(this.origOptions.byweekday) ? this.origOptions.byweekday : [this.origOptions.byweekday], r = String(_);
      this.byweekday = { allWeeks: _.filter(function(l) {
        return !l.n;
      }), someWeeks: _.filter(function(l) {
        return !!l.n;
      }), isWeekdays: r.indexOf("MO") !== -1 && r.indexOf("TU") !== -1 && r.indexOf("WE") !== -1 && r.indexOf("TH") !== -1 && r.indexOf("FR") !== -1 && r.indexOf("SA") === -1 && r.indexOf("SU") === -1, isEveryDay: r.indexOf("MO") !== -1 && r.indexOf("TU") !== -1 && r.indexOf("WE") !== -1 && r.indexOf("TH") !== -1 && r.indexOf("FR") !== -1 && r.indexOf("SA") !== -1 && r.indexOf("SU") !== -1 };
      var d = function(l, h) {
        return l.weekday - h.weekday;
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
    if (this.text = [i("every")], this[z.FREQUENCIES[this.options.freq]](), this.options.until) {
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
    var n = this.gettext;
    if (i === -1)
      return n("last");
    var o = Math.abs(i);
    switch (o) {
      case 1:
      case 21:
      case 31:
        t = o + n("st");
        break;
      case 2:
      case 22:
        t = o + n("nd");
        break;
      case 3:
      case 23:
        t = o + n("rd");
        break;
      default:
        t = o + n("th");
    }
    return i < 0 ? t + " " + n("last") : t;
  }, e.prototype.monthtext = function(i) {
    return this.language.monthNames[i - 1];
  }, e.prototype.weekdaytext = function(i) {
    var t = ie(i) ? (i + 1) % 7 : i.getJsWeekday();
    return (i.n ? this.nth(i.n) + " " : "") + this.language.dayNames[t];
  }, e.prototype.plural = function(i) {
    return i % 100 != 1;
  }, e.prototype.add = function(i) {
    return this.text.push(" "), this.text.push(i), this;
  }, e.prototype.list = function(i, t, n, o) {
    var a = this;
    o === void 0 && (o = ","), ee(i) || (i = [i]), t = t || function(_) {
      return _.toString();
    };
    var s = function(_) {
      return t && t.call(a, _);
    };
    return n ? function(_, r, d) {
      for (var l = "", h = 0; h < _.length; h++)
        h !== 0 && (h === _.length - 1 ? l += " " + d + " " : l += r + " "), l += _[h];
      return l;
    }(i.map(s), o, n) : i.map(s).join(o + " ");
  }, e;
}(), Pa = function() {
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
      for (var n in i = null, this.rules) {
        var o = this.rules[n].exec(this.text);
        o && (i === null || o[0].length > i[0].length) && (i = o, t = n);
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
  i === void 0 && (i = De);
  var t = {}, n = new Pa(i.tokens);
  return n.start(e) ? (function() {
    n.expect("every");
    var l = n.acceptNumber();
    if (l && (t.interval = parseInt(l[0], 10)), n.isDone())
      throw new Error("Unexpected end");
    switch (n.symbol) {
      case "day(s)":
        t.freq = z.DAILY, n.nextSymbol() && (a(), d());
        break;
      case "weekday(s)":
        t.freq = z.WEEKLY, t.byweekday = [z.MO, z.TU, z.WE, z.TH, z.FR], n.nextSymbol(), a(), d();
        break;
      case "week(s)":
        t.freq = z.WEEKLY, n.nextSymbol() && (o(), a(), d());
        break;
      case "hour(s)":
        t.freq = z.HOURLY, n.nextSymbol() && (o(), d());
        break;
      case "minute(s)":
        t.freq = z.MINUTELY, n.nextSymbol() && (o(), d());
        break;
      case "month(s)":
        t.freq = z.MONTHLY, n.nextSymbol() && (o(), d());
        break;
      case "year(s)":
        t.freq = z.YEARLY, n.nextSymbol() && (o(), d());
        break;
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        t.freq = z.WEEKLY;
        var h = n.symbol.substr(0, 2).toUpperCase();
        if (t.byweekday = [z[h]], !n.nextSymbol())
          return;
        for (; n.accept("comma"); ) {
          if (n.isDone())
            throw new Error("Unexpected end");
          var v = _();
          if (!v)
            throw new Error("Unexpected symbol " + n.symbol + ", expected weekday");
          t.byweekday.push(z[v]), n.nextSymbol();
        }
        a(), function() {
          n.accept("on"), n.accept("the");
          var f = r();
          if (f)
            for (t.bymonthday = [f], n.nextSymbol(); n.accept("comma"); ) {
              if (!(f = r()))
                throw new Error("Unexpected symbol " + n.symbol + "; expected monthday");
              t.bymonthday.push(f), n.nextSymbol();
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
        if (t.freq = z.YEARLY, t.bymonth = [s()], !n.nextSymbol())
          return;
        for (; n.accept("comma"); ) {
          if (n.isDone())
            throw new Error("Unexpected end");
          var m = s();
          if (!m)
            throw new Error("Unexpected symbol " + n.symbol + ", expected month");
          t.bymonth.push(m), n.nextSymbol();
        }
        o(), d();
        break;
      default:
        throw new Error("Unknown symbol");
    }
  }(), t) : null;
  function o() {
    var l = n.accept("on"), h = n.accept("the");
    if (l || h)
      do {
        var v = r(), m = _(), f = s();
        if (v)
          m ? (n.nextSymbol(), t.byweekday || (t.byweekday = []), t.byweekday.push(z[m].nth(v))) : (t.bymonthday || (t.bymonthday = []), t.bymonthday.push(v), n.accept("day(s)"));
        else if (m)
          n.nextSymbol(), t.byweekday || (t.byweekday = []), t.byweekday.push(z[m]);
        else if (n.symbol === "weekday(s)")
          n.nextSymbol(), t.byweekday || (t.byweekday = [z.MO, z.TU, z.WE, z.TH, z.FR]);
        else if (n.symbol === "week(s)") {
          n.nextSymbol();
          var c = n.acceptNumber();
          if (!c)
            throw new Error("Unexpected symbol " + n.symbol + ", expected week number");
          for (t.byweekno = [parseInt(c[0], 10)]; n.accept("comma"); ) {
            if (!(c = n.acceptNumber()))
              throw new Error("Unexpected symbol " + n.symbol + "; expected monthday");
            t.byweekno.push(parseInt(c[0], 10));
          }
        } else {
          if (!f)
            return;
          n.nextSymbol(), t.bymonth || (t.bymonth = []), t.bymonth.push(f);
        }
      } while (n.accept("comma") || n.accept("the") || n.accept("on"));
  }
  function a() {
    if (n.accept("at"))
      do {
        var l = n.acceptNumber();
        if (!l)
          throw new Error("Unexpected symbol " + n.symbol + ", expected hour");
        for (t.byhour = [parseInt(l[0], 10)]; n.accept("comma"); ) {
          if (!(l = n.acceptNumber()))
            throw new Error("Unexpected symbol " + n.symbol + "; expected hour");
          t.byhour.push(parseInt(l[0], 10));
        }
      } while (n.accept("comma") || n.accept("at"));
  }
  function s() {
    switch (n.symbol) {
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
    switch (n.symbol) {
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        return n.symbol.substr(0, 2).toUpperCase();
      default:
        return !1;
    }
  }
  function r() {
    switch (n.symbol) {
      case "last":
        return n.nextSymbol(), -1;
      case "first":
        return n.nextSymbol(), 1;
      case "second":
        return n.nextSymbol(), n.accept("last") ? -2 : 2;
      case "third":
        return n.nextSymbol(), n.accept("last") ? -3 : 3;
      case "nth":
        var l = parseInt(n.value[1], 10);
        if (l < -366 || l > 366)
          throw new Error("Nth out of range: " + l);
        return n.nextSymbol(), n.accept("last") ? -l : l;
      default:
        return !1;
    }
  }
  function d() {
    if (n.symbol === "until") {
      var l = Date.parse(n.text);
      if (!l)
        throw new Error("Cannot parse until date:" + n.text);
      t.until = new Date(l);
    } else
      n.accept("for") && (t.count = parseInt(n.value[0], 10), n.expect("number"));
  }
}
function Oe(e) {
  return e < F.HOURLY;
}
(function(e) {
  e[e.YEARLY = 0] = "YEARLY", e[e.MONTHLY = 1] = "MONTHLY", e[e.WEEKLY = 2] = "WEEKLY", e[e.DAILY = 3] = "DAILY", e[e.HOURLY = 4] = "HOURLY", e[e.MINUTELY = 5] = "MINUTELY", e[e.SECONDLY = 6] = "SECONDLY";
})(F || (F = {}));
var Ya = function(e, i) {
  return i === void 0 && (i = De), new z(kt(e, i) || void 0);
}, ge = ["count", "until", "interval", "byweekday", "bymonthday", "bymonth"];
_e.IMPLEMENTED = [], _e.IMPLEMENTED[F.HOURLY] = ge, _e.IMPLEMENTED[F.MINUTELY] = ge, _e.IMPLEMENTED[F.DAILY] = ["byhour"].concat(ge), _e.IMPLEMENTED[F.WEEKLY] = ge, _e.IMPLEMENTED[F.MONTHLY] = ge, _e.IMPLEMENTED[F.YEARLY] = ["byweekno", "byyearday"].concat(ge);
var Ua = _e.isFullyConvertible, Se = function() {
  function e(i, t, n, o) {
    this.hour = i, this.minute = t, this.second = n, this.millisecond = o || 0;
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
}(), Va = function(e) {
  function i(t, n, o, a, s, _, r) {
    var d = e.call(this, a, s, _, r) || this;
    return d.year = t, d.month = n, d.day = o, d;
  }
  return Je(i, e), i.fromDate = function(t) {
    return new this(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.valueOf() % 1e3);
  }, i.prototype.getWeekday = function() {
    return be(new Date(this.getTime()));
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
      var n = Math.floor(this.month / 12), o = ae(this.month, 12);
      this.month = o, this.year += n, this.month === 0 && (this.month = 12, --this.year);
    }
  }, i.prototype.addWeekly = function(t, n) {
    n > this.getWeekday() ? this.day += -(this.getWeekday() + 1 + (6 - n)) + 7 * t : this.day += -(this.getWeekday() - n) + 7 * t, this.fixDay();
  }, i.prototype.addDaily = function(t) {
    this.day += t, this.fixDay();
  }, i.prototype.addHours = function(t, n, o) {
    for (n && (this.hour += Math.floor((23 - this.hour) / t) * t); ; ) {
      this.hour += t;
      var a = Ce(this.hour, 24), s = a.div, _ = a.mod;
      if (s && (this.hour = _, this.addDaily(s)), oe(o) || B(o, this.hour))
        break;
    }
  }, i.prototype.addMinutes = function(t, n, o, a) {
    for (n && (this.minute += Math.floor((1439 - (60 * this.hour + this.minute)) / t) * t); ; ) {
      this.minute += t;
      var s = Ce(this.minute, 60), _ = s.div, r = s.mod;
      if (_ && (this.minute = r, this.addHours(_, !1, o)), (oe(o) || B(o, this.hour)) && (oe(a) || B(a, this.minute)))
        break;
    }
  }, i.prototype.addSeconds = function(t, n, o, a, s) {
    for (n && (this.second += Math.floor((86399 - (3600 * this.hour + 60 * this.minute + this.second)) / t) * t); ; ) {
      this.second += t;
      var _ = Ce(this.second, 60), r = _.div, d = _.mod;
      if (r && (this.second = d, this.addMinutes(r, !1, o, a)), (oe(o) || B(o, this.hour)) && (oe(a) || B(a, this.minute)) && (oe(s) || B(s, this.second)))
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
  }, i.prototype.add = function(t, n) {
    var o = t.freq, a = t.interval, s = t.wkst, _ = t.byhour, r = t.byminute, d = t.bysecond;
    switch (o) {
      case F.YEARLY:
        return this.addYears(a);
      case F.MONTHLY:
        return this.addMonths(a);
      case F.WEEKLY:
        return this.addWeekly(a, s);
      case F.DAILY:
        return this.addDaily(a);
      case F.HOURLY:
        return this.addHours(a, n, _);
      case F.MINUTELY:
        return this.addMinutes(a, n, _, r);
      case F.SECONDLY:
        return this.addSeconds(a, n, _, r, d);
    }
  }, i;
}(Se);
function Et(e) {
  for (var i = [], t = 0, n = Object.keys(e); t < n.length; t++) {
    var o = n[t];
    B(fn, o) || i.push(o), bt(e[o]) && !we(e[o]) && i.push(o);
  }
  if (i.length)
    throw new Error("Invalid options: " + i.join(", "));
  return te({}, e);
}
function Fa(e) {
  var i = te(te({}, We), Et(e));
  if (J(i.byeaster) && (i.freq = z.YEARLY), !J(i.freq) || !z.FREQUENCIES[i.freq])
    throw new Error("Invalid frequency: ".concat(i.freq, " ").concat(e.freq));
  if (i.dtstart || (i.dtstart = new Date((/* @__PURE__ */ new Date()).setMilliseconds(0))), J(i.wkst) ? ie(i.wkst) || (i.wkst = i.wkst.weekday) : i.wkst = z.MO.weekday, J(i.bysetpos)) {
    ie(i.bysetpos) && (i.bysetpos = [i.bysetpos]);
    for (var t = 0; t < i.bysetpos.length; t++)
      if ((a = i.bysetpos[t]) === 0 || !(a >= -366 && a <= 366))
        throw new Error("bysetpos must be between 1 and 366, or between -366 and -1");
  }
  if (!(i.byweekno || W(i.byweekno) || W(i.byyearday) || i.bymonthday || W(i.bymonthday) || J(i.byweekday) || J(i.byeaster)))
    switch (i.freq) {
      case z.YEARLY:
        i.bymonth || (i.bymonth = i.dtstart.getUTCMonth() + 1), i.bymonthday = i.dtstart.getUTCDate();
        break;
      case z.MONTHLY:
        i.bymonthday = i.dtstart.getUTCDate();
        break;
      case z.WEEKLY:
        i.byweekday = [be(i.dtstart)];
    }
  if (J(i.bymonth) && !ee(i.bymonth) && (i.bymonth = [i.bymonth]), J(i.byyearday) && !ee(i.byyearday) && ie(i.byyearday) && (i.byyearday = [i.byyearday]), J(i.bymonthday))
    if (ee(i.bymonthday)) {
      var n = [], o = [];
      for (t = 0; t < i.bymonthday.length; t++) {
        var a;
        (a = i.bymonthday[t]) > 0 ? n.push(a) : a < 0 && o.push(a);
      }
      i.bymonthday = n, i.bynmonthday = o;
    } else
      i.bymonthday < 0 ? (i.bynmonthday = [i.bymonthday], i.bymonthday = []) : (i.bynmonthday = [], i.bymonthday = [i.bymonthday]);
  else
    i.bymonthday = [], i.bynmonthday = [];
  if (J(i.byweekno) && !ee(i.byweekno) && (i.byweekno = [i.byweekno]), J(i.byweekday))
    if (ie(i.byweekday))
      i.byweekday = [i.byweekday], i.bynweekday = null;
    else if (Xe(i.byweekday))
      i.byweekday = [Z.fromStr(i.byweekday).weekday], i.bynweekday = null;
    else if (i.byweekday instanceof Z)
      !i.byweekday.n || i.freq > z.MONTHLY ? (i.byweekday = [i.byweekday.weekday], i.bynweekday = null) : (i.bynweekday = [[i.byweekday.weekday, i.byweekday.n]], i.byweekday = null);
    else {
      var s = [], _ = [];
      for (t = 0; t < i.byweekday.length; t++) {
        var r = i.byweekday[t];
        ie(r) ? s.push(r) : Xe(r) ? s.push(Z.fromStr(r).weekday) : !r.n || i.freq > z.MONTHLY ? s.push(r.weekday) : _.push([r.weekday, r.n]);
      }
      i.byweekday = W(s) ? s : null, i.bynweekday = W(_) ? _ : null;
    }
  else
    i.bynweekday = null;
  return J(i.byhour) ? ie(i.byhour) && (i.byhour = [i.byhour]) : i.byhour = i.freq < z.HOURLY ? [i.dtstart.getUTCHours()] : null, J(i.byminute) ? ie(i.byminute) && (i.byminute = [i.byminute]) : i.byminute = i.freq < z.MINUTELY ? [i.dtstart.getUTCMinutes()] : null, J(i.bysecond) ? ie(i.bysecond) && (i.bysecond = [i.bysecond]) : i.bysecond = i.freq < z.SECONDLY ? [i.dtstart.getUTCSeconds()] : null, { parsedOptions: i };
}
function Re(e) {
  var i = e.split(`
`).map(Ba).filter(function(t) {
    return t !== null;
  });
  return te(te({}, i[0]), i[1]);
}
function Me(e) {
  var i = {}, t = /DTSTART(?:;TZID=([^:=]+?))?(?::|=)([^;\s]+)/i.exec(e);
  if (!t)
    return i;
  var n = t[1], o = t[2];
  return n && (i.tzid = n), i.dtstart = Be(o), i;
}
function Ba(e) {
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
      return Me(e);
    default:
      throw new Error("Unsupported RFC prop ".concat(t, " in ").concat(e));
  }
}
function nt(e) {
  var i = Me(e.replace(/^RRULE:/i, ""));
  return e.replace(/^(?:RRULE|EXRULE):/i, "").split(";").forEach(function(t) {
    var n = t.split("="), o = n[0], a = n[1];
    switch (o.toUpperCase()) {
      case "FREQ":
        i.freq = F[a.toUpperCase()];
        break;
      case "WKST":
        i.wkst = ne[a.toUpperCase()];
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
        var s = function(d) {
          return d.indexOf(",") !== -1 ? d.split(",").map(rt) : rt(d);
        }(a), _ = o.toLowerCase();
        i[_] = s;
        break;
      case "BYWEEKDAY":
      case "BYDAY":
        i.byweekday = function(d) {
          var l = d.split(",");
          return l.map(function(h) {
            if (h.length === 2)
              return ne[h];
            var v = h.match(/^([+-]?\d{1,2})([A-Z]{2})$/);
            if (!v || v.length < 3)
              throw new SyntaxError("Invalid weekday string: ".concat(h));
            var m = Number(v[1]), f = v[2], c = ne[f].weekday;
            return new Z(c, m);
          });
        }(a);
        break;
      case "DTSTART":
      case "TZID":
        var r = Me(e);
        i.tzid = r.tzid, i.dtstart = r.dtstart;
        break;
      case "UNTIL":
        i.until = Be(a);
        break;
      case "BYEASTER":
        i.byeaster = Number(a);
        break;
      default:
        throw new Error("Unknown RRULE property '" + o + "'");
    }
  }), i;
}
function rt(e) {
  return /^[+-]?\d+$/.test(e) ? Number(e) : e;
}
var Ne = function() {
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
    return this.isUTC ? this.date : (i = this.date, t = this.tzid, n = Intl.DateTimeFormat().resolvedOptions().timeZone, o = new Date(et(i, n)), a = new Date(et(i, t ?? "UTC")).getTime() - o.getTime(), new Date(i.getTime() - a));
    var i, t, n, o, a;
  }, e;
}();
function Pe(e) {
  for (var i, t = [], n = "", o = Object.keys(e), a = Object.keys(We), s = 0; s < o.length; s++)
    if (o[s] !== "tzid" && B(a, o[s])) {
      var _ = o[s].toUpperCase(), r = e[o[s]], d = "";
      if (J(r) && (!ee(r) || r.length)) {
        switch (_) {
          case "FREQ":
            d = z.FREQUENCIES[e.freq];
            break;
          case "WKST":
            d = ie(r) ? new Z(r).toString() : r.toString();
            break;
          case "BYWEEKDAY":
            _ = "BYDAY", d = (i = r, ee(i) ? i : [i]).map(function(f) {
              return f instanceof Z ? f : ee(f) ? new Z(f[0], f[1]) : new Z(f);
            }).toString();
            break;
          case "DTSTART":
            n = Ja(r, e.tzid);
            break;
          case "UNTIL":
            d = Fe(r, !e.tzid);
            break;
          default:
            if (ee(r)) {
              for (var l = [], h = 0; h < r.length; h++)
                l[h] = String(r[h]);
              d = l.toString();
            } else
              d = String(r);
        }
        d && t.push([_, d]);
      }
    }
  var v = t.map(function(f) {
    var c = f[0], u = f[1];
    return "".concat(c, "=").concat(u.toString());
  }).join(";"), m = "";
  return v !== "" && (m = "RRULE:".concat(v)), [n, m].filter(function(f) {
    return !!f;
  }).join(`
`);
}
function Ja(e, i) {
  return e ? "DTSTART" + new Ne(new Date(e), i).toString() : "";
}
function Wa(e, i) {
  return Array.isArray(e) ? !!Array.isArray(i) && e.length === i.length && e.every(function(t, n) {
    return t.getTime() === i[n].getTime();
  }) : e instanceof Date ? i instanceof Date && e.getTime() === i.getTime() : e === i;
}
var Ka = function() {
  function e() {
    this.all = !1, this.before = [], this.after = [], this.between = [];
  }
  return e.prototype._cacheAdd = function(i, t, n) {
    t && (t = t instanceof Date ? je(t) : Qe(t)), i === "all" ? this.all = t : (n._value = t, this[i].push(n));
  }, e.prototype._cacheGet = function(i, t) {
    var n = !1, o = t ? Object.keys(t) : [], a = function(l) {
      for (var h = 0; h < o.length; h++) {
        var v = o[h];
        if (!Wa(t[v], l[v]))
          return !0;
      }
      return !1;
    }, s = this[i];
    if (i === "all")
      n = this.all;
    else if (ee(s))
      for (var _ = 0; _ < s.length; _++) {
        var r = s[_];
        if (!o.length || !a(r)) {
          n = r._value;
          break;
        }
      }
    if (!n && this.all) {
      var d = new ye(i, t);
      for (_ = 0; _ < this.all.length && d.accept(this.all[_]); _++)
        ;
      n = d.getValue(), this._cacheAdd(i, n, t);
    }
    return ee(n) ? Qe(n) : n instanceof Date ? je(n) : n;
  }, e;
}(), Ga = q(q(q(q(q(q(q(q(q(q(q(q(q([], V(1, 31), !0), V(2, 28), !0), V(3, 31), !0), V(4, 30), !0), V(5, 31), !0), V(6, 30), !0), V(7, 31), !0), V(8, 31), !0), V(9, 30), !0), V(10, 31), !0), V(11, 30), !0), V(12, 31), !0), V(1, 7), !0), Xa = q(q(q(q(q(q(q(q(q(q(q(q(q([], V(1, 31), !0), V(2, 29), !0), V(3, 31), !0), V(4, 30), !0), V(5, 31), !0), V(6, 30), !0), V(7, 31), !0), V(8, 31), !0), V(9, 30), !0), V(10, 31), !0), V(11, 30), !0), V(12, 31), !0), V(1, 7), !0), Za = se(1, 29), Qa = se(1, 30), fe = se(1, 31), G = se(1, 32), en = q(q(q(q(q(q(q(q(q(q(q(q(q([], G, !0), Qa, !0), G, !0), fe, !0), G, !0), fe, !0), G, !0), G, !0), fe, !0), G, !0), fe, !0), G, !0), G.slice(0, 7), !0), tn = q(q(q(q(q(q(q(q(q(q(q(q(q([], G, !0), Za, !0), G, !0), fe, !0), G, !0), fe, !0), G, !0), G, !0), fe, !0), G, !0), fe, !0), G, !0), G.slice(0, 7), !0), an = se(-28, 0), nn = se(-29, 0), pe = se(-30, 0), X = se(-31, 0), rn = q(q(q(q(q(q(q(q(q(q(q(q(q([], X, !0), nn, !0), X, !0), pe, !0), X, !0), pe, !0), X, !0), X, !0), pe, !0), X, !0), pe, !0), X, !0), X.slice(0, 7), !0), on = q(q(q(q(q(q(q(q(q(q(q(q(q([], X, !0), an, !0), X, !0), pe, !0), X, !0), pe, !0), X, !0), X, !0), pe, !0), X, !0), pe, !0), X, !0), X.slice(0, 7), !0), sn = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366], dn = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365], it = function() {
  for (var e = [], i = 0; i < 55; i++)
    e = e.concat(se(7));
  return e;
}();
function _n(e, i) {
  var t, n, o = ve(e, 1, 1), a = xe(e) ? 366 : 365, s = xe(e + 1) ? 366 : 365, _ = qe(o), r = be(o), d = te(te({ yearlen: a, nextyearlen: s, yearordinal: _, yearweekday: r }, function(M) {
    var g = xe(M) ? 366 : 365, b = ve(M, 1, 1), w = be(b);
    return g === 365 ? { mmask: Ga, mdaymask: tn, nmdaymask: on, wdaymask: it.slice(w), mrange: dn } : { mmask: Xa, mdaymask: en, nmdaymask: rn, wdaymask: it.slice(w), mrange: sn };
  }(e)), { wnomask: null });
  if (oe(i.byweekno))
    return d;
  d.wnomask = V(0, a + 7);
  var l = t = ae(7 - r + i.wkst, 7);
  l >= 4 ? (l = 0, n = d.yearlen + ae(r - i.wkst, 7)) : n = a - l;
  for (var h = Math.floor(n / 7), v = ae(n, 7), m = Math.floor(h + v / 4), f = 0; f < i.byweekno.length; f++) {
    var c = i.byweekno[f];
    if (c < 0 && (c += m + 1), c > 0 && c <= m) {
      var u = void 0;
      c > 1 ? (u = l + 7 * (c - 1), l !== t && (u -= 7 - t)) : u = l;
      for (var p = 0; p < 7 && (d.wnomask[u] = 1, u++, d.wdaymask[u] !== i.wkst); p++)
        ;
    }
  }
  if (B(i.byweekno, 1) && (u = l + 7 * m, l !== t && (u -= 7 - t), u < a))
    for (f = 0; f < 7 && (d.wnomask[u] = 1, u += 1, d.wdaymask[u] !== i.wkst); f++)
      ;
  if (l) {
    var y = void 0;
    if (B(i.byweekno, -1))
      y = -1;
    else {
      var x = be(ve(e - 1, 1, 1)), S = ae(7 - x.valueOf() + i.wkst, 7), k = xe(e - 1) ? 366 : 365, D = void 0;
      S >= 4 ? (S = 0, D = k + ae(x - i.wkst, 7)) : D = a - l, y = Math.floor(52 + ae(D, 7) / 4);
    }
    if (B(i.byweekno, y))
      for (u = 0; u < l; u++)
        d.wnomask[u] = 1;
  }
  return d;
}
var ln = function() {
  function e(i) {
    this.options = i;
  }
  return e.prototype.rebuild = function(i, t) {
    var n = this.options;
    if (i !== this.lastyear && (this.yearinfo = _n(i, n)), W(n.bynweekday) && (t !== this.lastmonth || i !== this.lastyear)) {
      var o = this.yearinfo, a = o.yearlen, s = o.mrange, _ = o.wdaymask;
      this.monthinfo = function(r, d, l, h, v, m) {
        var f = { lastyear: r, lastmonth: d, nwdaymask: [] }, c = [];
        if (m.freq === z.YEARLY)
          if (oe(m.bymonth))
            c = [[0, l]];
          else
            for (var u = 0; u < m.bymonth.length; u++)
              d = m.bymonth[u], c.push(h.slice(d - 1, d + 1));
        else
          m.freq === z.MONTHLY && (c = [h.slice(d - 1, d + 1)]);
        if (oe(c))
          return f;
        for (f.nwdaymask = V(0, l), u = 0; u < c.length; u++)
          for (var p = c[u], y = p[0], x = p[1] - 1, S = 0; S < m.bynweekday.length; S++) {
            var k = void 0, D = m.bynweekday[S], M = D[0], g = D[1];
            g < 0 ? (k = x + 7 * (g + 1), k -= ae(v[k] - M, 7)) : (k = y + 7 * (g - 1), k += ae(7 - v[k] + M, 7)), y <= k && k <= x && (f.nwdaymask[k] = 1);
          }
        return f;
      }(i, t, a, s, _, n);
    }
    J(n.byeaster) && (this.eastermask = function(r, d) {
      d === void 0 && (d = 0);
      var l = r % 19, h = Math.floor(r / 100), v = r % 100, m = Math.floor(h / 4), f = h % 4, c = Math.floor((h + 8) / 25), u = Math.floor((h - c + 1) / 3), p = Math.floor(19 * l + h - m - u + 15) % 30, y = Math.floor(v / 4), x = v % 4, S = Math.floor(32 + 2 * f + 2 * y - p - x) % 7, k = Math.floor((l + 11 * p + 22 * S) / 451), D = Math.floor((p + S - 7 * k + 114) / 31), M = (p + S - 7 * k + 114) % 31 + 1, g = Date.UTC(r, D - 1, M + d), b = Date.UTC(r, 0, 1);
      return [Math.ceil((g - b) / 864e5)];
    }(i, n.byeaster));
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
    return [se(this.yearlen), 0, this.yearlen];
  }, e.prototype.mdayset = function(i, t) {
    for (var n = this.mrange[t - 1], o = this.mrange[t], a = V(null, this.yearlen), s = n; s < o; s++)
      a[s] = s;
    return [a, n, o];
  }, e.prototype.wdayset = function(i, t, n) {
    for (var o = V(null, this.yearlen + 7), a = qe(ve(i, t, n)) - this.yearordinal, s = a, _ = 0; _ < 7 && (o[a] = a, ++a, this.wdaymask[a] !== this.options.wkst); _++)
      ;
    return [o, s, a];
  }, e.prototype.ddayset = function(i, t, n) {
    var o = V(null, this.yearlen), a = qe(ve(i, t, n)) - this.yearordinal;
    return o[a] = a, [o, a, a + 1];
  }, e.prototype.htimeset = function(i, t, n, o) {
    var a = this, s = [];
    return this.options.byminute.forEach(function(_) {
      s = s.concat(a.mtimeset(i, _, n, o));
    }), Ee(s), s;
  }, e.prototype.mtimeset = function(i, t, n, o) {
    var a = this.options.bysecond.map(function(s) {
      return new Se(i, t, s, o);
    });
    return Ee(a), a;
  }, e.prototype.stimeset = function(i, t, n, o) {
    return [new Se(i, t, n, o)];
  }, e.prototype.getdayset = function(i) {
    switch (i) {
      case F.YEARLY:
        return this.ydayset.bind(this);
      case F.MONTHLY:
        return this.mdayset.bind(this);
      case F.WEEKLY:
        return this.wdayset.bind(this);
      case F.DAILY:
      default:
        return this.ddayset.bind(this);
    }
  }, e.prototype.gettimeset = function(i) {
    switch (i) {
      case F.HOURLY:
        return this.htimeset.bind(this);
      case F.MINUTELY:
        return this.mtimeset.bind(this);
      case F.SECONDLY:
        return this.stimeset.bind(this);
    }
  }, e;
}();
function cn(e, i, t, n, o, a) {
  for (var s = [], _ = 0; _ < e.length; _++) {
    var r = void 0, d = void 0, l = e[_];
    l < 0 ? (r = Math.floor(l / i.length), d = ae(l, i.length)) : (r = Math.floor((l - 1) / i.length), d = ae(l - 1, i.length));
    for (var h = [], v = t; v < n; v++) {
      var m = a[v];
      J(m) && h.push(m);
    }
    var f = void 0;
    f = r < 0 ? h.slice(r)[0] : h[r];
    var c = i[d], u = xt(o.yearordinal + f), p = wt(u, c);
    B(s, p) || s.push(p);
  }
  return Ee(s), s;
}
function Dt(e, i) {
  var t = i.dtstart, n = i.freq, o = i.interval, a = i.until, s = i.bysetpos, _ = i.count;
  if (_ === 0 || o === 0)
    return de(e);
  var r = Va.fromDate(t), d = new ln(i);
  d.rebuild(r.year, r.month);
  for (var l = function(g, b, w) {
    var E = w.freq, N = w.byhour, T = w.byminute, A = w.bysecond;
    return Oe(E) ? function(C) {
      var $ = C.dtstart.getTime() % 1e3;
      if (!Oe(C.freq))
        return [];
      var H = [];
      return C.byhour.forEach(function(O) {
        C.byminute.forEach(function(R) {
          C.bysecond.forEach(function(U) {
            H.push(new Se(O, R, U, $));
          });
        });
      }), H;
    }(w) : E >= z.HOURLY && W(N) && !B(N, b.hour) || E >= z.MINUTELY && W(T) && !B(T, b.minute) || E >= z.SECONDLY && W(A) && !B(A, b.second) ? [] : g.gettimeset(E)(b.hour, b.minute, b.second, b.millisecond);
  }(d, r, i); ; ) {
    var h = d.getdayset(n)(r.year, r.month, r.day), v = h[0], m = h[1], f = h[2], c = un(v, m, f, d, i);
    if (W(s))
      for (var u = cn(s, l, m, f, d, v), p = 0; p < u.length; p++) {
        var y = u[p];
        if (a && y > a)
          return de(e);
        if (y >= t) {
          var x = ot(y, i);
          if (!e.accept(x) || _ && !--_)
            return de(e);
        }
      }
    else
      for (p = m; p < f; p++) {
        var S = v[p];
        if (J(S))
          for (var k = xt(d.yearordinal + S), D = 0; D < l.length; D++) {
            var M = l[D];
            if (y = wt(k, M), a && y > a || y >= t && (x = ot(y, i), !e.accept(x) || _ && !--_))
              return de(e);
          }
      }
    if (i.interval === 0 || (r.add(i, c), r.year > 9999))
      return de(e);
    Oe(n) || (l = d.gettimeset(n)(r.hour, r.minute, r.second, 0)), d.rebuild(r.year, r.month);
  }
}
function hn(e, i, t) {
  var n = t.bymonth, o = t.byweekno, a = t.byweekday, s = t.byeaster, _ = t.bymonthday, r = t.bynmonthday, d = t.byyearday;
  return W(n) && !B(n, e.mmask[i]) || W(o) && !e.wnomask[i] || W(a) && !B(a, e.wdaymask[i]) || W(e.nwdaymask) && !e.nwdaymask[i] || s !== null && !B(e.eastermask, i) || (W(_) || W(r)) && !B(_, e.mdaymask[i]) && !B(r, e.nmdaymask[i]) || W(d) && (i < e.yearlen && !B(d, i + 1) && !B(d, -e.yearlen + i) || i >= e.yearlen && !B(d, i + 1 - e.yearlen) && !B(d, -e.nextyearlen + i - e.yearlen));
}
function ot(e, i) {
  return new Ne(e, i.tzid).rezonedDate();
}
function de(e) {
  return e.getValue();
}
function un(e, i, t, n, o) {
  for (var a = !1, s = i; s < t; s++) {
    var _ = e[s];
    (a = hn(n, _, o)) && (e[_] = null);
  }
  return a;
}
var ne = { MO: new Z(0), TU: new Z(1), WE: new Z(2), TH: new Z(3), FR: new Z(4), SA: new Z(5), SU: new Z(6) }, We = { freq: F.YEARLY, dtstart: null, interval: 1, wkst: ne.MO, count: null, until: null, tzid: null, bysetpos: null, bymonth: null, bymonthday: null, bynmonthday: null, byyearday: null, byweekno: null, byweekday: null, bynweekday: null, byhour: null, byminute: null, bysecond: null, byeaster: null }, fn = Object.keys(We), z = function() {
  function e(i, t) {
    i === void 0 && (i = {}), t === void 0 && (t = !1), this._cache = t ? null : new Ka(), this.origOptions = Et(i);
    var n = Fa(i).parsedOptions;
    this.options = n;
  }
  return e.parseText = function(i, t) {
    return kt(i, t);
  }, e.fromText = function(i, t) {
    return Ya(i, t);
  }, e.fromString = function(i) {
    return new e(e.parseString(i) || void 0);
  }, e.prototype._iter = function(i) {
    return Dt(i, this.options);
  }, e.prototype._cacheGet = function(i, t) {
    return !!this._cache && this._cache._cacheGet(i, t);
  }, e.prototype._cacheAdd = function(i, t, n) {
    if (this._cache)
      return this._cache._cacheAdd(i, t, n);
  }, e.prototype.all = function(i) {
    if (i)
      return this._iter(new tt("all", {}, i));
    var t = this._cacheGet("all");
    return t === !1 && (t = this._iter(new ye("all", {})), this._cacheAdd("all", t)), t;
  }, e.prototype.between = function(i, t, n, o) {
    if (n === void 0 && (n = !1), !we(i) || !we(t))
      throw new Error("Invalid date passed in to RRule.between");
    var a = { before: t, after: i, inc: n };
    if (o)
      return this._iter(new tt("between", a, o));
    var s = this._cacheGet("between", a);
    return s === !1 && (s = this._iter(new ye("between", a)), this._cacheAdd("between", s, a)), s;
  }, e.prototype.before = function(i, t) {
    if (t === void 0 && (t = !1), !we(i))
      throw new Error("Invalid date passed in to RRule.before");
    var n = { dt: i, inc: t }, o = this._cacheGet("before", n);
    return o === !1 && (o = this._iter(new ye("before", n)), this._cacheAdd("before", o, n)), o;
  }, e.prototype.after = function(i, t) {
    if (t === void 0 && (t = !1), !we(i))
      throw new Error("Invalid date passed in to RRule.after");
    var n = { dt: i, inc: t }, o = this._cacheGet("after", n);
    return o === !1 && (o = this._iter(new ye("after", n)), this._cacheAdd("after", o, n)), o;
  }, e.prototype.count = function() {
    return this.all().length;
  }, e.prototype.toString = function() {
    return Pe(this.origOptions);
  }, e.prototype.toText = function(i, t, n) {
    return function(o, a, s, _) {
      return new _e(o, a, s, _).toString();
    }(this, i, t, n);
  }, e.prototype.isFullyConvertibleToText = function() {
    return Ua(this);
  }, e.prototype.clone = function() {
    return new e(this.origOptions);
  }, e.FREQUENCIES = ["YEARLY", "MONTHLY", "WEEKLY", "DAILY", "HOURLY", "MINUTELY", "SECONDLY"], e.YEARLY = F.YEARLY, e.MONTHLY = F.MONTHLY, e.WEEKLY = F.WEEKLY, e.DAILY = F.DAILY, e.HOURLY = F.HOURLY, e.MINUTELY = F.MINUTELY, e.SECONDLY = F.SECONDLY, e.MO = ne.MO, e.TU = ne.TU, e.WE = ne.WE, e.TH = ne.TH, e.FR = ne.FR, e.SA = ne.SA, e.SU = ne.SU, e.parseString = Re, e.optionsToString = Pe, e;
}(), st = { dtstart: null, cache: !1, unfold: !1, forceset: !1, compatible: !1, tzid: null };
function pn(e, i) {
  var t = [], n = [], o = [], a = [], s = Me(e), _ = s.dtstart, r = s.tzid, d = function(l, h) {
    if (h === void 0 && (h = !1), l = l && l.trim(), !l)
      throw new Error("Invalid empty string");
    if (!h)
      return l.split(/\s/);
    for (var v = l.split(`
`), m = 0; m < v.length; ) {
      var f = v[m] = v[m].replace(/\s+$/g, "");
      f ? m > 0 && f[0] === " " ? (v[m - 1] += f.slice(1), v.splice(m, 1)) : m += 1 : v.splice(m, 1);
    }
    return v;
  }(e, i.unfold);
  return d.forEach(function(l) {
    var h;
    if (l) {
      var v = function(p) {
        var y = function(D) {
          if (D.indexOf(":") === -1)
            return { name: "RRULE", value: D };
          var M = (w = D, E = ":", N = 1, T = w.split(E), N ? T.slice(0, N).concat([T.slice(N).join(E)]) : T), g = M[0], b = M[1], w, E, N, T;
          return { name: g, value: b };
        }(p), x = y.name, S = y.value, k = x.split(";");
        if (!k)
          throw new Error("empty property name");
        return { name: k[0].toUpperCase(), parms: k.slice(1), value: S };
      }(l), m = v.name, f = v.parms, c = v.value;
      switch (m.toUpperCase()) {
        case "RRULE":
          if (f.length)
            throw new Error("unsupported RRULE parm: ".concat(f.join(",")));
          t.push(Re(l));
          break;
        case "RDATE":
          var u = ((h = /RDATE(?:;TZID=([^:=]+))?/i.exec(l)) !== null && h !== void 0 ? h : [])[1];
          u && !r && (r = u), n = n.concat(dt(c, f));
          break;
        case "EXRULE":
          if (f.length)
            throw new Error("unsupported EXRULE parm: ".concat(f.join(",")));
          o.push(Re(c));
          break;
        case "EXDATE":
          a = a.concat(dt(c, f));
          break;
        case "DTSTART":
          break;
        default:
          throw new Error("unsupported property: " + m);
      }
    }
  }), { dtstart: _, tzid: r, rrulevals: t, rdatevals: n, exrulevals: o, exdatevals: a };
}
function ke(e, i) {
  return i === void 0 && (i = {}), function(t, n) {
    var o = pn(t, n), a = o.rrulevals, s = o.rdatevals, _ = o.exrulevals, r = o.exdatevals, d = o.dtstart, l = o.tzid, h = n.cache === !1;
    if (n.compatible && (n.forceset = !0, n.unfold = !0), n.forceset || a.length > 1 || s.length || _.length || r.length) {
      var v = new vn(h);
      return v.dtstart(d), v.tzid(l || void 0), a.forEach(function(f) {
        v.rrule(new z(Le(f, d, l), h));
      }), s.forEach(function(f) {
        v.rdate(f);
      }), _.forEach(function(f) {
        v.exrule(new z(Le(f, d, l), h));
      }), r.forEach(function(f) {
        v.exdate(f);
      }), n.compatible && n.dtstart && v.rdate(d), v;
    }
    var m = a[0] || {};
    return new z(Le(m, m.dtstart || n.dtstart || d, m.tzid || n.tzid || l), h);
  }(e, function(t) {
    var n = [], o = Object.keys(t), a = Object.keys(st);
    if (o.forEach(function(s) {
      B(a, s) || n.push(s);
    }), n.length)
      throw new Error("Invalid options: " + n.join(", "));
    return te(te({}, st), t);
  }(i));
}
function Le(e, i, t) {
  return te(te({}, e), { dtstart: i, tzid: t });
}
function dt(e, i) {
  return function(t) {
    t.forEach(function(n) {
      if (!/(VALUE=DATE(-TIME)?)|(TZID=)/.test(n))
        throw new Error("unsupported RDATE/EXDATE parm: " + n);
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
    for (var n = 0; n < i._rrule.length; n++) {
      var o = i._rrule[n].origOptions[e];
      if (o)
        return o;
    }
  };
}
var vn = function(e) {
  function i(t) {
    t === void 0 && (t = !1);
    var n = e.call(this, {}, t) || this;
    return n.dtstart = _t.apply(n, ["dtstart"]), n.tzid = _t.apply(n, ["tzid"]), n._rrule = [], n._rdate = [], n._exrule = [], n._exdate = [], n;
  }
  return Je(i, e), i.prototype._iter = function(t) {
    return function(n, o, a, s, _, r) {
      var d = {}, l = n.accept;
      function h(c, u) {
        a.forEach(function(p) {
          p.between(c, u, !0).forEach(function(y) {
            d[Number(y)] = !0;
          });
        });
      }
      _.forEach(function(c) {
        var u = new Ne(c, r).rezonedDate();
        d[Number(u)] = !0;
      }), n.accept = function(c) {
        var u = Number(c);
        return isNaN(u) ? l.call(this, c) : !(!d[u] && (h(new Date(u - 1), new Date(u + 1)), !d[u])) || (d[u] = !0, l.call(this, c));
      }, n.method === "between" && (h(n.args.after, n.args.before), n.accept = function(c) {
        var u = Number(c);
        return !!d[u] || (d[u] = !0, l.call(this, c));
      });
      for (var v = 0; v < s.length; v++) {
        var m = new Ne(s[v], r).rezonedDate();
        if (!n.accept(new Date(m.getTime())))
          break;
      }
      o.forEach(function(c) {
        Dt(n, c.options);
      });
      var f = n._result;
      switch (Ee(f), n.method) {
        case "all":
        case "between":
          return f;
        case "before":
          return f.length && f[f.length - 1] || null;
        default:
          return f.length && f[0] || null;
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
      return ke(t.toString());
    });
  }, i.prototype.exrules = function() {
    return this._exrule.map(function(t) {
      return ke(t.toString());
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
    return !this._rrule.length && this._dtstart && (t = t.concat(Pe({ dtstart: this._dtstart }))), this._rrule.forEach(function(n) {
      t = t.concat(n.toString().split(`
`));
    }), this._exrule.forEach(function(n) {
      t = t.concat(n.toString().split(`
`).map(function(o) {
        return o.replace(/^RRULE:/, "EXRULE:");
      }).filter(function(o) {
        return !/^DTSTART/.test(o);
      }));
    }), this._rdate.length && t.push(ht("RDATE", this._rdate, this.tzid())), this._exdate.length && t.push(ht("EXDATE", this._exdate, this.tzid())), t;
  }, i.prototype.toString = function() {
    return this.valueOf().join(`
`);
  }, i.prototype.clone = function() {
    var t = new i(!!this._cache);
    return this._rrule.forEach(function(n) {
      return t.rrule(n.clone());
    }), this._exrule.forEach(function(n) {
      return t.exrule(n.clone());
    }), this._rdate.forEach(function(n) {
      return t.rdate(new Date(n.getTime()));
    }), this._exdate.forEach(function(n) {
      return t.exdate(new Date(n.getTime()));
    }), t;
  }, i;
}(z);
function lt(e, i) {
  if (!(e instanceof z))
    throw new TypeError(String(e) + " is not RRule instance");
  B(i.map(String), String(e)) || i.push(e);
}
function ct(e, i) {
  if (!(e instanceof Date))
    throw new TypeError(String(e) + " is not Date instance");
  B(i.map(Number), Number(e)) || (i.push(e), Ee(i));
}
function ht(e, i, t) {
  var n = !t || t.toUpperCase() === "UTC", o = n ? "".concat(e, ":") : "".concat(e, ";TZID=").concat(t, ":"), a = i.map(function(s) {
    return Fe(s.valueOf(), n);
  }).join(",");
  return "".concat(o).concat(a);
}
class mn {
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
    const n = this._scheduler, o = n.$domHelpers, a = document.body, s = this.getNode();
    if (o.isChildOf(s, a) || (this.hide(), a.appendChild(s)), this._isLikeMouseEvent(i)) {
      const _ = this._calculateTooltipPosition(i);
      t = _.top, i = _.left;
    }
    return s.style.top = t + "px", s.style.left = i + "px", n._waiAria.tooltipVisibleAttr(s), this;
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
    const t = this._scheduler, n = t.$domHelpers, o = this._getViewPortSize(), a = this.getNode(), s = { top: 0, left: 0, width: a.offsetWidth, height: a.offsetHeight, bottom: 0, right: 0 }, _ = t.config.tooltip_offset_x, r = t.config.tooltip_offset_y, d = document.body, l = n.getRelativeEventPosition(i, d), h = n.getNodePosition(d);
    l.y += h.y, s.top = l.y, s.left = l.x, s.top += r, s.left += _, s.bottom = s.top + s.height, s.right = s.left + s.width;
    const v = window.scrollY + d.scrollTop;
    return s.top < o.top - v ? (s.top = o.top, s.bottom = s.top + s.height) : s.bottom > o.bottom && (s.bottom = o.bottom, s.top = s.bottom - s.height), s.left < o.left ? (s.left = o.left, s.right = o.left + s.width) : s.right > o.right && (s.right = o.right, s.left = s.right - s.width), l.x >= s.left && l.x <= s.right && (s.left = l.x - s.width - _, s.right = s.left + s.width), l.y >= s.top && l.y <= s.bottom && (s.top = l.y - s.height - r, s.bottom = s.top + s.height), s.left < 0 && (s.left = 0), s.right < 0 && (s.right = 0), s;
  }
  _getViewPortSize() {
    const i = this._scheduler, t = i.$domHelpers, n = this._getViewPort();
    let o, a = n, s = window.scrollY + document.body.scrollTop, _ = window.scrollX + document.body.scrollLeft;
    return n === i.$event_data ? (a = i.$event, s = 0, _ = 0, o = t.getNodePosition(i.$event)) : o = t.getNodePosition(a), { left: o.x + _, top: o.y + s, width: o.width, height: o.height, bottom: o.y + o.height + s, right: o.x + o.width + _ };
  }
}
class gn {
  constructor(i) {
    this._listeners = {}, this.tooltip = new mn(i), this._scheduler = i, this._domEvents = i._createDomEventScope(), this._initDelayedFunctions();
  }
  destructor() {
    this.tooltip.hide(), this._domEvents.detachAll();
  }
  hideTooltip() {
    this.delayHide();
  }
  attach(i) {
    let t = document.body;
    const n = this._scheduler, o = n.$domHelpers;
    i.global || (t = n.$root);
    let a = null;
    const s = (_) => {
      const r = o.getTargetNode(_), d = o.closest(r, i.selector);
      if (o.isChildOf(r, this.tooltip.getNode()))
        return;
      const l = () => {
        a = d, i.onmouseenter(_, d);
      };
      n._mobile && n.config.touch_tooltip && (d ? l() : i.onmouseleave(_, d)), a ? d && d === a ? i.onmousemove(_, d) : (i.onmouseleave(_, a), a = null, d && d !== a && l()) : d && l();
    };
    this.detach(i.selector), this._domEvents.attach(t, "mousemove", s), this._listeners[i.selector] = { node: t, handler: s };
  }
  detach(i) {
    const t = this._listeners[i];
    t && this._domEvents.detach(t.node, "mousemove", t.handler);
  }
  tooltipFor(i) {
    const t = (n) => {
      let o = n;
      return document.createEventObject && !document.createEvent && (o = document.createEventObject(n)), o;
    };
    this._initDelayedFunctions(), this.attach({ selector: i.selector, global: i.global, onmouseenter: (n, o) => {
      const a = i.html(n, o);
      a && this.delayShow(t(n), a);
    }, onmousemove: (n, o) => {
      const a = i.html(n, o);
      a ? this.delayShow(t(n), a) : (this.delayShow.$cancelTimeout(), this.delayHide());
    }, onmouseleave: () => {
      this.delayShow.$cancelTimeout(), this.delayHide();
    } });
  }
  _initDelayedFunctions() {
    const i = this._scheduler;
    this.delayShow && this.delayShow.$cancelTimeout(), this.delayHide && this.delayHide.$cancelTimeout(), this.tooltip.hide(), this.delayShow = re.delay((t, n) => {
      i.callEvent("onBeforeTooltip", [t]) === !1 ? this.tooltip.hide() : (this.tooltip.setContent(n), this.tooltip.show(t));
    }, i.config.tooltip_timeout || 1), this.delayHide = re.delay(() => {
      this.delayShow.$cancelTimeout(), this.tooltip.hide();
    }, i.config.tooltip_hide_timeout || 1);
  }
}
const yn = { active_links: function(e) {
  e.config.active_link_view = "day", e._active_link_click = function(i) {
    var t = i.target.getAttribute("data-link-date"), n = e.date.str_to_date(e.config.api_date, !1, !0);
    if (t)
      return e.setCurrentView(n(t), e.config.active_link_view), i && i.preventDefault && i.preventDefault(), !1;
  }, e.attachEvent("onTemplatesReady", function() {
    var i = function(n, o) {
      o = o || n + "_scale_date", e.templates["_active_links_old_" + o] || (e.templates["_active_links_old_" + o] = e.templates[o]);
      var a = e.templates["_active_links_old_" + o], s = e.date.date_to_str(e.config.api_date);
      e.templates[o] = function(_) {
        return "<a data-link-date='" + s(_) + "' href='#'>" + a(_) + "</a>";
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
  }, e.templates.agenda_legacy_time = function(i, t, n) {
    return n._timed ? this.day_date(n.start_date, n.end_date, n) + " " + this.event_date(i) : e.templates.day_date(i) + " &ndash; " + e.templates.day_date(t);
  }, e.templates.agenda_legacy_text = function(i, t, n) {
    return n.text;
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
    e.render_data = function(a) {
      if (this._mode != "agenda_legacy")
        return t.apply(this, arguments);
      o();
    };
    var n = e.render_view_data;
    function o() {
      var a = e.get_visible_events();
      a.sort(function(p, y) {
        return p.start_date > y.start_date ? 1 : -1;
      });
      for (var s, _ = "<div class='dhx_agenda_area' " + e._waiAria.agendaDataAttrString() + ">", r = 0; r < a.length; r++) {
        var d = a[r], l = d.color ? "--dhx-scheduler-event-background:" + d.color + ";" : "", h = d.textColor ? "--dhx-scheduler-event-color:" + d.textColor + ";" : "", v = e.templates.event_class(d.start_date, d.end_date, d);
        s = e._waiAria.agendaEventAttrString(d);
        var m = e._waiAria.agendaDetailsBtnString();
        _ += "<div " + s + " class='dhx_agenda_line" + (v ? " " + v : "") + "' event_id='" + d.id + "' " + e.config.event_attribute + "='" + d.id + "' style='" + h + l + (d._text_style || "") + "'><div class='dhx_agenda_event_time'>" + (e.config.rtl ? e.templates.agenda_time(d.end_date, d.start_date, d) : e.templates.agenda_time(d.start_date, d.end_date, d)) + "</div>", _ += `<div ${m} class='dhx_event_icon icon_details'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15.4444 16.4H4.55556V7.6H15.4444V16.4ZM13.1111 2V3.6H6.88889V2H5.33333V3.6H4.55556C3.69222 3.6 3 4.312 3 5.2V16.4C3 16.8243 3.16389 17.2313 3.45561 17.5314C3.74733 17.8314 4.143 18 4.55556 18H15.4444C15.857 18 16.2527 17.8314 16.5444 17.5314C16.8361 17.2313 17 16.8243 17 16.4V5.2C17 4.312 16.3 3.6 15.4444 3.6H14.6667V2H13.1111ZM13.8889 10.8H10V14.8H13.8889V10.8Z" fill="#A1A4A6"/>
			</svg></div>`, _ += "<span>" + e.templates.agenda_text(d.start_date, d.end_date, d) + "</span></div>";
      }
      _ += "<div class='dhx_v_border'></div></div>", e._els.dhx_cal_data[0].innerHTML = _, e._els.dhx_cal_data[0].childNodes[0].scrollTop = e._agendaScrollTop || 0;
      var f = e._els.dhx_cal_data[0].childNodes[0];
      f.childNodes[f.childNodes.length - 1].style.height = f.offsetHeight < e._els.dhx_cal_data[0].offsetHeight ? "100%" : f.offsetHeight + "px";
      var c = e._els.dhx_cal_data[0].firstChild.childNodes, u = e._getNavDateElement();
      for (u && (u.innerHTML = e.templates.agenda_date(e._min_date, e._max_date, e._mode)), e._rendered = [], r = 0; r < c.length - 1; r++)
        e._rendered[r] = c[r];
    }
    e.render_view_data = function() {
      return this._mode == "agenda_legacy" && (e._agendaScrollTop = e._els.dhx_cal_data[0].childNodes[0].scrollTop, e._els.dhx_cal_data[0].childNodes[0].scrollTop = 0), n.apply(this, arguments);
    }, e.agenda_legacy_view = function(a) {
      e._min_date = e.config.agenda_start || e.date.agenda_legacy_start(e._date), e._max_date = e.config.agenda_end || e.date.add_agenda_legacy(e._min_date, 1), function(s) {
        if (s) {
          var _ = e.locale.labels, r = e._waiAria.agendaHeadAttrString(), d = e._waiAria.agendaHeadDateString(_.date), l = e._waiAria.agendaHeadDescriptionString(_.description);
          e._els.dhx_cal_header[0].innerHTML = "<div " + r + " class='dhx_agenda_line dhx_agenda_line_header'><div " + d + ">" + _.date + "</div><span class = 'description_header' style='padding-left:25px' " + l + ">" + _.description + "</span></div>", e._table_view = !0, e.set_sizes();
        }
      }(a), a ? (e._cols = null, e._colsS = null, e._table_view = !0, o()) : e._table_view = !1;
    };
  });
}, agenda_view: function(e) {
  e.date.add_agenda = function(o, a) {
    return e.date.add(o, 1 * a, "month");
  }, e.templates.agenda_time = function(o, a, s) {
    return s._timed ? `${this.event_date(o)} - ${this.event_date(a)}` : e.locale.labels.full_day;
  }, e.templates.agenda_text = function(o, a, s) {
    return s.text;
  };
  const i = e.date.date_to_str("%F %j"), t = e.date.date_to_str("%l");
  e.templates.agenda_day = function(o) {
    return `<div class="dhx_agenda_day_date">${i(o)}</div>
		<div class="dhx_agenda_day_dow">${t(o)}</div>`;
  }, e.templates.agenda_date = function(o, a) {
    return e.templates.month_date(e.getState().date);
  }, e.date.agenda_start = function(o) {
    return e.date.month_start(new Date(o));
  };
  let n = 0;
  e.attachEvent("onTemplatesReady", function() {
    var o = e.dblclick_dhx_cal_data;
    e.dblclick_dhx_cal_data = function() {
      if (this._mode == "agenda")
        !this.config.readonly && this.config.dblclick_create && this.addEventNow();
      else if (o)
        return o.apply(this, arguments);
    };
    var a = e.render_data;
    e.render_data = function(d) {
      if (this._mode != "agenda")
        return a.apply(this, arguments);
      _();
    };
    var s = e.render_view_data;
    function _() {
      const d = e.get_visible_events();
      d.sort(function(u, p) {
        return u.start_date > p.start_date ? 1 : -1;
      });
      const l = {};
      let h = e.getState().min_date;
      const v = e.getState().max_date;
      for (; h.valueOf() < v.valueOf(); )
        l[h.valueOf()] = [], h = e.date.add(h, 1, "day");
      let m = !1;
      if (d.forEach((u) => {
        let p = e.date.day_start(new Date(u.start_date));
        for (; p.valueOf() < u.end_date.valueOf(); )
          l[p.valueOf()] && (l[p.valueOf()].push(u), m = !0), p = e.date.day_start(e.date.add(p, 1, "day"));
      }), m) {
        let u = "";
        for (let p in l)
          e.ignore_agenda && e.ignore_agenda(new Date(1 * p)) || (u += r(new Date(1 * p), l[p]));
        e._els.dhx_cal_data[0].innerHTML = u;
      } else
        e._els.dhx_cal_data[0].innerHTML = `<div class="dhx_cal_agenda_no_events">${e.locale.labels.agenda_tab}</div>`;
      e._els.dhx_cal_data[0].scrollTop = n;
      let f = e._els.dhx_cal_data[0].querySelectorAll(".dhx_cal_agenda_event_line");
      e._rendered = [];
      for (var c = 0; c < f.length - 1; c++)
        e._rendered[c] = f[c];
    }
    function r(d, l) {
      if (!l.length)
        return "";
      let h = `
<div class="dhx_cal_agenda_day" data-date="${e.templates.format_date(d)}" data-day="${d.getDay()}">
	<div class="dhx_cal_agenda_day_header">${e.templates.agenda_day(d)}</div>
	<div class="dhx_cal_agenda_day_events">
`;
      return l.forEach((v) => {
        h += function(m, f) {
          const c = e.templates.agenda_time(f.start_date, f.end_date, f), u = e.getState().select_id, p = e.templates.event_class(f.start_date, f.end_date, f), y = e.templates.agenda_text(f.start_date, f.end_date, f);
          let x = "";
          return (f.color || f.textColor) && (x = ` style="${f.color ? "--dhx-scheduler-event-background:" + f.color + ";" : ""}${f.textColor ? "--dhx-scheduler-event-color:" + f.textColor + ";" : ""}" `), `<div class="dhx_cal_agenda_event_line ${p || ""} ${f.id == u ? "dhx_cal_agenda_event_line_selected" : ""}" ${x} ${e.config.event_attribute}="${f.id}">
	<div class="dhx_cal_agenda_event_line_marker"></div>
	<div class="dhx_cal_agenda_event_line_time">${c}</div>
	<div class="dhx_cal_agenda_event_line_text">${y}</div>
</div>`;
        }(0, v);
      }), h += "</div></div>", h;
    }
    e.render_view_data = function() {
      return this._mode == "agenda" && (n = e._els.dhx_cal_data[0].scrollTop, e._els.dhx_cal_data[0].scrollTop = 0), s.apply(this, arguments);
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
    var r = null, d = e._copy_event(_);
    return _.event_pid && (r = e.getEvent(_.event_pid)), r && r.isPrototypeOf(_) && (delete d.event_length, delete d.event_pid, delete d.rec_pattern, delete d.rec_type), d;
  };
  var t = e._pre_render_events_line, n = e._pre_render_events_table, o = function(_, r) {
    return this._table_view ? n.call(this, _, r) : t.call(this, _, r);
  };
  e._pre_render_events_line = e._pre_render_events_table = function(_, r) {
    if (!this.config.all_timed || this._table_view && this._mode != "month" || this._mode == "month" && !this.config.all_timed_month)
      return o.call(this, _, r);
    for (var d = 0; d < _.length; d++) {
      var l = _[d];
      if (!l._timed)
        if (this.config.all_timed != "short" || i(l)) {
          var h = this._safe_copy(l);
          l._virtual ? h._first_chunk = !1 : h._first_chunk = !0, h._drag_resize = !1, h._virtual = !0, h.start_date = new Date(h.start_date), c(l) ? (h.end_date = u(h.start_date), this.config.last_hour != 24 && (h.end_date = p(h.start_date, this.config.last_hour))) : h.end_date = new Date(l.end_date);
          var v = !1;
          h.start_date < this._max_date && h.end_date > this._min_date && h.start_date < h.end_date && (_[d] = h, v = !0);
          var m = this._safe_copy(l);
          if (m._virtual = !0, m.end_date = new Date(m.end_date), m.start_date < this._min_date ? m.start_date = p(this._min_date, this.config.first_hour) : m.start_date = p(u(l.start_date), this.config.first_hour), m.start_date < this._max_date && m.start_date < m.end_date) {
            if (!v) {
              _[d--] = m;
              continue;
            }
            _.splice(d + 1, 0, m), m._last_chunk = !1;
          } else
            h._last_chunk = !0, h._drag_resize = !0;
        } else
          this._mode != "month" && _.splice(d--, 1);
    }
    var f = this._drag_mode != "move" && r;
    return o.call(this, _, f);
    function c(y) {
      var x = u(y.start_date);
      return +y.end_date > +x;
    }
    function u(y) {
      var x = e.date.add(y, 1, "day");
      return x = e.date.date_part(x);
    }
    function p(y, x) {
      var S = e.date.date_part(new Date(y));
      return S.setHours(x), S;
    }
  };
  var a = e.get_visible_events;
  e.get_visible_events = function(_) {
    return this.config.all_timed && this.config.multi_day ? a.call(this, !1) : a.call(this, _);
  }, e.attachEvent("onBeforeViewChange", function(_, r, d, l) {
    return e._allow_dnd = d == "day" || d == "week" || e.getView(d), !0;
  }), e._is_main_area_event = function(_) {
    return e.ext.allTimed.isMainAreaEvent(_);
  };
  var s = e.updateEvent;
  e.updateEvent = function(_) {
    var r, d, l = e.getEvent(_);
    l && (r = e.config.all_timed && !(e.isOneDayEvent(e._events[_]) || e.getState().drag_id)) && (d = e.config.update_render, e.config.update_render = !0), s.apply(e, arguments), l && r && (e.config.update_render = d);
  };
}, collision: function(e) {
  let i, t;
  function n(o) {
    e._get_section_view() && o && (i = e.getEvent(o)[e._get_section_property()]);
  }
  e.config.collision_limit = 1, e.attachEvent("onBeforeDrag", function(o) {
    return n(o), !0;
  }), e.attachEvent("onBeforeLightbox", function(o) {
    const a = e.getEvent(o);
    return t = [a.start_date, a.end_date], n(o), !0;
  }), e.attachEvent("onEventChanged", function(o) {
    if (!o || !e.getEvent(o))
      return !0;
    const a = e.getEvent(o);
    if (!e.checkCollision(a)) {
      if (!t)
        return !1;
      a.start_date = t[0], a.end_date = t[1], a._timed = this.isOneDayEvent(a);
    }
    return !0;
  }), e.attachEvent("onBeforeEventChanged", function(o, a, s) {
    return e.checkCollision(o);
  }), e.attachEvent("onEventAdded", function(o, a) {
    e.checkCollision(a) || e.deleteEvent(o);
  }), e.attachEvent("onEventSave", function(o, a, s) {
    if ((a = e._lame_clone(a)).id = o, !a.start_date || !a.end_date) {
      const _ = e.getEvent(o);
      a.start_date = new Date(_.start_date), a.end_date = new Date(_.end_date);
    }
    return (a.rrule && !a.recurring_event_id || a.rec_type) && e._roll_back_dates(a), e.checkCollision(a);
  }), e._check_sections_collision = function(o, a) {
    const s = e._get_section_property();
    return o[s] == a[s] && o.id != a.id;
  }, e.checkCollision = function(o) {
    let a = [];
    const s = e.config.collision_limit;
    if (o.rec_type) {
      let l = e.getRecDates(o);
      for (let h = 0; h < l.length; h++) {
        let v = e.getEvents(l[h].start_date, l[h].end_date);
        for (let m = 0; m < v.length; m++)
          (v[m].event_pid || v[m].id) != o.id && a.push(v[m]);
      }
    } else if (o.rrule) {
      let l = e.getRecDates(o);
      for (let h = 0; h < l.length; h++) {
        let v = e.getEvents(l[h].start_date, l[h].end_date);
        for (let m = 0; m < v.length; m++)
          (String(v[m].id).split("#")[0] || v[m].id) != o.id && a.push(v[m]);
      }
    } else {
      a = e.getEvents(o.start_date, o.end_date);
      for (let l = 0; l < a.length; l++) {
        let h = a[l];
        if (h.id == o.id || h.event_length && [h.event_pid, h.event_length].join("#") == o.id) {
          a.splice(l, 1);
          break;
        }
        if (h.recurring_event_id && [h.recurring_event_id, h._pid_time].join("#") == o.id) {
          a.splice(l, 1);
          break;
        }
      }
    }
    const _ = e._get_section_view(), r = e._get_section_property();
    let d = !0;
    if (_) {
      let l = 0;
      for (let h = 0; h < a.length; h++)
        a[h].id != o.id && this._check_sections_collision(a[h], o) && l++;
      l >= s && (d = !1);
    } else
      a.length >= s && (d = !1);
    if (!d) {
      let l = !e.callEvent("onEventCollision", [o, a]);
      return l || (o[r] = i || o[r]), l;
    }
    return d;
  };
}, container_autoresize: function(e) {
  e.config.container_autoresize = !0, e.config.month_day_min_height = 90, e.config.min_grid_size = 25, e.config.min_map_size = 400;
  var i = e._pre_render_events, t = !0, n = 0, o = 0;
  e._pre_render_events = function(l, h) {
    if (!e.config.container_autoresize || !t)
      return i.apply(this, arguments);
    var v = this.xy.bar_height, m = this._colsS.heights, f = this._colsS.heights = [0, 0, 0, 0, 0, 0, 0], c = this._els.dhx_cal_data[0];
    if (l = this._table_view ? this._pre_render_events_table(l, h) : this._pre_render_events_line(l, h), this._table_view)
      if (h)
        this._colsS.heights = m;
      else {
        var u = c.firstChild;
        const M = u.querySelectorAll(".dhx_cal_month_row");
        if (M && M.length) {
          for (var p = 0; p < M.length; p++) {
            if (f[p]++, f[p] * v > this._colsS.height - this.xy.month_head_height) {
              var y = M[p].querySelectorAll(".dhx_cal_month_cell"), x = this._colsS.height - this.xy.month_head_height;
              1 * this.config.max_month_events !== this.config.max_month_events || f[p] <= this.config.max_month_events ? x = f[p] * v : (this.config.max_month_events + 1) * v > this._colsS.height - this.xy.month_head_height && (x = (this.config.max_month_events + 1) * v), M[p].style.height = x + this.xy.month_head_height + "px";
              for (var S = 0; S < y.length; S++)
                y[S].childNodes[1].style.height = x + "px";
              f[p] = (f[p - 1] || 0) + y[0].offsetHeight;
            }
            f[p] = (f[p - 1] || 0) + M[p].querySelectorAll(".dhx_cal_month_cell")[0].offsetHeight;
          }
          f.unshift(0), u.parentNode.offsetHeight < u.parentNode.scrollHeight && u._h_fix;
        } else if (l.length || this._els.dhx_multi_day[0].style.visibility != "visible" || (f[0] = -1), l.length || f[0] == -1) {
          var k = (f[0] + 1) * v + 1;
          o != k + 1 && (this._obj.style.height = n - o + k - 1 + "px"), k += "px";
          const g = this._els.dhx_cal_navline[0].offsetHeight, b = this._els.dhx_cal_header[0].offsetHeight;
          c.style.height = this._obj.offsetHeight - g - b - (this.xy.margin_top || 0) + "px";
          var D = this._els.dhx_multi_day[0];
          D.style.height = k, D.style.visibility = f[0] == -1 ? "hidden" : "visible", D.style.display = f[0] == -1 ? "none" : "", (D = this._els.dhx_multi_day[1]).style.height = k, D.style.visibility = f[0] == -1 ? "hidden" : "visible", D.style.display = f[0] == -1 ? "none" : "", D.className = f[0] ? "dhx_multi_day_icon" : "dhx_multi_day_icon_small", this._dy_shift = (f[0] + 1) * v, f[0] = 0;
        }
      }
    return l;
  };
  var a = ["dhx_cal_navline", "dhx_cal_header", "dhx_multi_day", "dhx_cal_data"], s = function(l) {
    n = 0;
    for (var h = 0; h < a.length; h++) {
      var v = a[h], m = e._els[v] ? e._els[v][0] : null, f = 0;
      switch (v) {
        case "dhx_cal_navline":
        case "dhx_cal_header":
          f = m.offsetHeight;
          break;
        case "dhx_multi_day":
          f = m ? m.offsetHeight - 1 : 0, o = f;
          break;
        case "dhx_cal_data":
          var c = e.getState().mode;
          if (m.childNodes[1] && c != "month") {
            let N = 0;
            for (let T = 0; T < m.childNodes.length; T++)
              m.childNodes[T].offsetHeight > N && (N = m.childNodes[T].offsetHeight);
            f = N;
          } else
            f = Math.max(m.offsetHeight - 1, m.scrollHeight);
          if (c == "month")
            e.config.month_day_min_height && !l && (f = m.querySelectorAll(".dhx_cal_month_row").length * e.config.month_day_min_height), l && (m.style.height = f + "px");
          else if (c == "year")
            f = 190 * e.config.year_y;
          else if (c == "agenda") {
            if (f = 0, m.children && m.children.length)
              if (m.children.length === 1 && m.children[0].classList.contains("dhx_cal_agenda_no_events"))
                f = 300;
              else
                for (var u = 0; u < m.children.length; u++)
                  f += m.children[u].offsetHeight;
            f + 2 < e.config.min_grid_size ? f = e.config.min_grid_size : f += 2;
          } else if (c == "week_agenda") {
            for (var p, y, x = e.xy.week_agenda_scale_height + e.config.min_grid_size, S = 0; S < m.childNodes.length; S++)
              for (y = m.childNodes[S], u = 0; u < y.childNodes.length; u++) {
                for (var k = 0, D = y.childNodes[u].childNodes[1], M = 0; M < D.childNodes.length; M++)
                  k += D.childNodes[M].offsetHeight;
                p = k + e.xy.week_agenda_scale_height, (p = S != 1 || u != 2 && u != 3 ? p : 2 * p) > x && (x = p);
              }
            f = 3 * x;
          } else if (c == "map") {
            f = 0;
            var g = m.querySelectorAll(".dhx_map_line");
            for (u = 0; u < g.length; u++)
              f += g[u].offsetHeight;
            f + 2 < e.config.min_map_size ? f = e.config.min_map_size : f += 2;
          } else if (e._gridView)
            if (f = 0, m.childNodes[1].childNodes[0].childNodes && m.childNodes[1].childNodes[0].childNodes.length) {
              for (g = m.childNodes[1].childNodes[0].childNodes[0].childNodes, u = 0; u < g.length; u++)
                f += g[u].offsetHeight;
              (f += 2) < e.config.min_grid_size && (f = e.config.min_grid_size);
            } else
              f = e.config.min_grid_size;
          if (e.matrix && e.matrix[c]) {
            if (l)
              f += 0, m.style.height = f + "px";
            else {
              f = 0;
              for (var b = e.matrix[c], w = b.y_unit, E = 0; E < w.length; E++)
                f += b.getSectionHeight(w[E].key);
              e.$container.clientWidth != e.$container.scrollWidth && (f += d());
            }
            f -= 1;
          }
          (c == "day" || c == "week" || e._props && e._props[c]) && (f += 2);
      }
      n += f += 1;
    }
    e._obj.style.height = n + "px", l || e.updateView();
  };
  function _() {
    t = !1, e.callEvent("onAfterSchedulerResize", []), t = !0;
  }
  var r = function() {
    if (!e.config.container_autoresize || !t)
      return !0;
    var l = e.getState().mode;
    if (!l)
      return !0;
    var h = window.requestAnimationFrame || window.setTimeout, v = document.documentElement.scrollTop;
    h(function() {
      !e.$destroyed && e.$initialized && s();
    }), e.matrix && e.matrix[l] || l == "month" ? h(function() {
      !e.$destroyed && e.$initialized && (s(!0), document.documentElement.scrollTop = v, _());
    }, 1) : _();
  };
  function d() {
    var l = document.createElement("div");
    l.style.cssText = "visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;", document.body.appendChild(l);
    var h = l.offsetWidth - l.clientWidth;
    return document.body.removeChild(l), h;
  }
  e.attachEvent("onBeforeViewChange", function() {
    var l = e.config.container_autoresize;
    if (e.xy.$original_scroll_width || (e.xy.$original_scroll_width = e.xy.scroll_width), e.xy.scroll_width = l ? 0 : e.xy.$original_scroll_width, e.matrix)
      for (var h in e.matrix) {
        var v = e.matrix[h];
        v.$original_section_autoheight || (v.$original_section_autoheight = v.section_autoheight), v.section_autoheight = !l && v.$original_section_autoheight;
      }
    return !0;
  }), e.attachEvent("onViewChange", r), e.attachEvent("onXLE", r), e.attachEvent("onEventChanged", r), e.attachEvent("onEventCreated", r), e.attachEvent("onEventAdded", r), e.attachEvent("onEventDeleted", r), e.attachEvent("onAfterSchedulerResize", r), e.attachEvent("onClearAll", r), e.attachEvent("onBeforeExpand", function() {
    return t = !1, !0;
  }), e.attachEvent("onBeforeCollapse", function() {
    return t = !0, !0;
  });
}, cookie: function(e) {
  function i(o) {
    return (o._obj.id || "scheduler") + "_settings";
  }
  var t = !0;
  e.attachEvent("onBeforeViewChange", function(o, a, s, _) {
    if (t && e._get_url_nav) {
      var r = e._get_url_nav();
      (r.date || r.mode || r.event) && (t = !1);
    }
    var d = i(e);
    if (t) {
      t = !1;
      var l = function(v) {
        var m = v + "=";
        if (document.cookie.length > 0) {
          var f = document.cookie.indexOf(m);
          if (f != -1) {
            f += m.length;
            var c = document.cookie.indexOf(";", f);
            return c == -1 && (c = document.cookie.length), document.cookie.substring(f, c);
          }
        }
        return "";
      }(d);
      if (l) {
        e._min_date || (e._min_date = _), (l = unescape(l).split("@"))[0] = this._helpers.parseDate(l[0]);
        var h = this.isViewExists(l[1]) ? l[1] : s;
        return _ = isNaN(+l[0]) ? _ : l[0], window.setTimeout(function() {
          e.$destroyed || e.setCurrentView(_, h);
        }, 1), !1;
      }
    }
    return !0;
  }), e.attachEvent("onViewChange", function(o, a) {
    var s, _, r = i(e), d = escape(this._helpers.formatDate(a) + "@" + o);
    _ = r + "=" + d + ((s = "expires=Sun, 31 Jan 9999 22:00:00 GMT") ? "; " + s : ""), document.cookie = _;
  });
  var n = e._load;
  e._load = function() {
    var o = arguments;
    if (e._date)
      n.apply(this, o);
    else {
      var a = this;
      window.setTimeout(function() {
        n.apply(a, o);
      }, 1);
    }
  };
}, daytimeline: function(e) {
  he("Day Timeline", e.assert);
}, drag_between: function(e) {
  he("Drag Between", e.assert);
}, editors: function(e) {
  e.form_blocks.combo = { render: function(i) {
    i.cached_options || (i.cached_options = {});
    const t = i.height ? `style='height:${i.height}px;'` : "";
    var n = "";
    return n += `<div class='${i.type}' ${t}></div>`;
  }, set_value: function(i, t, n, o) {
    (function() {
      m();
      var v = e.attachEvent("onAfterLightbox", function() {
        m(), e.detachEvent(v);
      });
      function m() {
        if (i._combo && i._combo.DOMParent) {
          var f = i._combo;
          f.unload ? f.unload() : f.destructor && f.destructor(), f.DOMParent = f.DOMelem = null;
        }
      }
    })(), window.dhx_globalImgPath = o.image_path || "/", i._combo = new dhtmlXCombo(i, o.name, i.offsetWidth - 8), o.onchange && i._combo.attachEvent("onChange", o.onchange), o.options_height && i._combo.setOptionHeight(o.options_height);
    var a = i._combo;
    if (a.enableFilteringMode(o.filtering, o.script_path || null, !!o.cache), o.script_path) {
      var s = n[o.map_to];
      s ? o.cached_options[s] ? (a.addOption(s, o.cached_options[s]), a.disable(1), a.selectOption(0), a.disable(0)) : e.ajax.get(o.script_path + "?id=" + s + "&uid=" + e.uid(), function(v) {
        var m, f = v.xmlDoc.responseText;
        try {
          m = JSON.parse(f).options[0].text;
        } catch {
          m = e.ajax.xpath("//option", v.xmlDoc)[0].childNodes[0].nodeValue;
        }
        o.cached_options[s] = m, a.addOption(s, m), a.disable(1), a.selectOption(0), a.disable(0);
      }) : a.setComboValue("");
    } else {
      for (var _ = [], r = 0; r < o.options.length; r++) {
        var d = o.options[r], l = [d.key, d.label, d.css];
        _.push(l);
      }
      if (a.addOption(_), n[o.map_to]) {
        var h = a.getIndexByValue(n[o.map_to]);
        a.selectOption(h);
      }
    }
  }, get_value: function(i, t, n) {
    var o = i._combo.getSelectedValue();
    return n.script_path && (n.cached_options[o] = i._combo.getSelectedText()), o;
  }, focus: function(i) {
  } }, e.form_blocks.radio = { render: function(i) {
    var t = "";
    t += `<div class='dhx_cal_ltext dhx_cal_radio ${i.vertical ? "dhx_cal_radio_vertical" : ""}' style='height:${i.height}px;'>`;
    for (var n = 0; n < i.options.length; n++) {
      var o = e.uid();
      t += "<label class='dhx_cal_radio_item' for='" + o + "'><input id='" + o + "' type='radio' name='" + i.name + "' value='" + i.options[n].key + "'><span> " + i.options[n].label + "</span></label>";
    }
    return t += "</div>";
  }, set_value: function(i, t, n, o) {
    for (var a = i.getElementsByTagName("input"), s = 0; s < a.length; s++) {
      a[s].checked = !1;
      var _ = n[o.map_to] || t;
      a[s].value == _ && (a[s].checked = !0);
    }
  }, get_value: function(i, t, n) {
    for (var o = i.getElementsByTagName("input"), a = 0; a < o.length; a++)
      if (o[a].checked)
        return o[a].value;
  }, focus: function(i) {
  } }, e.form_blocks.checkbox = { render: function(i) {
    return e.config.wide_form ? '<div class="dhx_cal_wide_checkbox"></div>' : "";
  }, set_value: function(i, t, n, o) {
    i = e._lightbox.querySelector(`#${o.id}`), o.height && (i.style.height = `${o.height}px`);
    var a = e.uid(), s = o.checked_value !== void 0 ? t == o.checked_value : !!t;
    i.className += " dhx_cal_checkbox";
    var _ = "<input id='" + a + "' type='checkbox' value='true' name='" + o.name + "'" + (s ? "checked='true'" : "") + "'>", r = "<label for='" + a + "'>" + (e.locale.labels["section_" + o.name] || o.name) + "</label>";
    if (e.config.wide_form ? (i.innerHTML = r, i.nextSibling.innerHTML = _) : i.innerHTML = _ + r, o.handler) {
      var d = i.getElementsByTagName("input")[0];
      if (d.$_eventAttached)
        return;
      d.$_eventAttached = !0, e.event(d, "click", o.handler);
    }
  }, get_value: function(i, t, n) {
    var o = (i = e._lightbox.querySelector(`#${n.id}`)).getElementsByTagName("input")[0];
    return o || (o = i.nextSibling.getElementsByTagName("input")[0]), o.checked ? n.checked_value || !0 : n.unchecked_value || !1;
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
      var n = e["_prev_margin_" + i[t]];
      e.xy["margin_" + i[t]] ? (e["_prev_margin_" + i[t]] = e.xy["margin_" + i[t]], e.xy["margin_" + i[t]] = 0) : n && (e.xy["margin_" + i[t]] = e["_prev_margin_" + i[t]], delete e["_prev_margin_" + i[t]]);
    }
    e.setCurrentView();
  };
}, export_api: function(e) {
  (function() {
    function i(n, o) {
      for (var a in o)
        n[a] || (n[a] = o[a]);
      return n;
    }
    function t(n, o) {
      var a = {};
      return (n = o._els[n]) && n[0] ? (a.x = n[0].scrollWidth, a.y = n[0].scrollHeight) : (a.x = 0, a.y = 0), a;
    }
    window.dhtmlxAjax || (window.dhtmlxAjax = { post: function(n, o, a) {
      return window.dhx4.ajax.post(n, o, a);
    }, get: function(n, o) {
      return window.ajax.get(n, o);
    } }), function(n) {
      function o() {
        var a = n.getState().mode;
        return n.matrix && n.matrix[a] ? n.matrix[a] : null;
      }
      n.exportToPDF = function(a) {
        (a = i(a || {}, { name: "calendar.pdf", format: "A4", orientation: "landscape", dpi: 96, zoom: 1, rtl: n.config.rtl })).html = this._export_html(a), a.mode = this.getState().mode, this._send_to_export(a, "pdf");
      }, n.exportToPNG = function(a) {
        (a = i(a || {}, { name: "calendar.png", format: "A4", orientation: "landscape", dpi: 96, zoom: 1, rtl: n.config.rtl })).html = this._export_html(a), a.mode = this.getState().mode, this._send_to_export(a, "png");
      }, n.exportToICal = function(a) {
        a = i(a || {}, { name: "calendar.ical", data: this._serialize_plain(null, a) }), this._send_to_export(a, "ical");
      }, n.exportToExcel = function(a) {
        a = i(a || {}, { name: "calendar.xlsx", title: "Events", data: this._serialize_plain(this.templates.xml_format, a), columns: this._serialize_columns() }), this._send_to_export(a, "excel");
      }, n._ajax_to_export = function(a, s, _) {
        delete a.callback;
        var r = a.server || "https://export.dhtmlx.com/scheduler";
        window.dhtmlxAjax.post(r, "type=" + s + "&store=1&data=" + encodeURIComponent(JSON.stringify(a)), function(d) {
          var l = null;
          if (!(d.xmlDoc.status > 400))
            try {
              l = JSON.parse(d.xmlDoc.responseText);
            } catch {
            }
          _(l);
        });
      }, n._plain_export_copy = function(a, s) {
        var _ = {};
        for (var r in a)
          _[r] = a[r];
        return _.start_date = s(_.start_date), _.end_date = s(_.end_date), _.$text = this.templates.event_text(a.start_date, a.end_date, a), _;
      }, n._serialize_plain = function(a, s) {
        var _;
        a = a || n.date.date_to_str("%Y%m%dT%H%i%s", !0), _ = s && s.start && s.end ? n.getEvents(s.start, s.end) : n.getEvents();
        for (var r = [], d = 0; d < _.length; d++)
          r[d] = this._plain_export_copy(_[d], a);
        return r;
      }, n._serialize_columns = function() {
        return [{ id: "start_date", header: "Start Date", width: 30 }, { id: "end_date", header: "End Date", width: 30 }, { id: "$text", header: "Text", width: 100 }];
      }, n._send_to_export = function(a, s) {
        if (a.version || (a.version = n.version), a.skin || (a.skin = n.skin), a.callback)
          return n._ajax_to_export(a, s, a.callback);
        var _ = this._create_hidden_form();
        _.firstChild.action = a.server || "https://export.dhtmlx.com/scheduler", _.firstChild.childNodes[0].value = JSON.stringify(a), _.firstChild.childNodes[1].value = s, _.firstChild.submit();
      }, n._create_hidden_form = function() {
        if (!this._hidden_export_form) {
          var a = this._hidden_export_form = document.createElement("div");
          a.style.display = "none", a.innerHTML = "<form method='POST' target='_blank'><input type='text' name='data'><input type='hidden' name='type' value=''></form>", document.body.appendChild(a);
        }
        return this._hidden_export_form;
      }, n._get_export_size = function(a, s, _, r, d, l, h) {
        r = parseInt(r) / 25.4 || 4;
        var v = { A5: { x: 148, y: 210 }, A4: { x: 210, y: 297 }, A3: { x: 297, y: 420 }, A2: { x: 420, y: 594 }, A1: { x: 594, y: 841 }, A0: { x: 841, y: 1189 } }, m = t("dhx_cal_data", this).x, f = { y: t("dhx_cal_data", this).y + t("dhx_cal_header", this).y + t("dhx_multi_day", this).y };
        return f.x = a === "full" ? m : Math.floor((s === "landscape" ? v[a].y : v[a].x) * r), h && (f.x *= parseFloat(h.x) || 1, f.y *= parseFloat(h.y) || 1), f;
      }, n._export_html = function(a) {
        var s, _, r, d = (s = void 0, _ = void 0, (r = o()) && (_ = r.scrollable, s = r.smart_rendering), { nav_height: n.xy.nav_height, scroll_width: n.xy.scroll_width, style_width: n._obj.style.width, style_height: n._obj.style.height, timeline_scrollable: _, timeline_smart_rendering: s }), l = n._get_export_size(a.format, a.orientation, a.zoom, a.dpi, a.header, a.footer, a.scales), h = "";
        try {
          (function(v, m) {
            n._obj.style.width = v.x + "px", n._obj.style.height = v.y + "px", n.xy.nav_height = 0, n.xy.scroll_width = 0;
            var f = o();
            (m.timeline_scrollable || m.timeline_smart_rendering) && (f.scrollable = !1, f.smart_rendering = !1);
          })(l, d), n.setCurrentView(), h = n._obj.innerHTML;
        } catch (v) {
          console.error(v);
        } finally {
          (function(v) {
            n.xy.scroll_width = v.scroll_width, n.xy.nav_height = v.nav_height, n._obj.style.width = v.style_width, n._obj.style.height = v.style_height;
            var m = o();
            (v.timeline_scrollable || v.timeline_smart_rendering) && (m.scrollable = v.timeline_scrollable, m.smart_rendering = v.timeline_smart_rendering);
          })(d), n.setCurrentView();
        }
        return h;
      };
    }(e);
  })();
}, grid_view: function(e) {
  he("Grid", e.assert);
}, html_templates: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    for (var i = document.body.getElementsByTagName("DIV"), t = 0; t < i.length; t++) {
      var n = i[t].className || "";
      if ((n = n.split(":")).length == 2 && n[0] == "template") {
        var o = 'return "' + (i[t].innerHTML || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\n\r]+/g, "") + '";';
        o = unescape(o).replace(/\{event\.([a-z]+)\}/g, function(a, s) {
          return '"+ev.' + s + '+"';
        }), e.templates[n[1]] = Function("start", "end", "ev", o), i[t].style.display = "none";
      }
    }
  });
}, key_nav: function(e) {
  function i(t) {
    var n = { minicalButton: e.$keyboardNavigation.MinicalButton, minicalDate: e.$keyboardNavigation.MinicalCell, scheduler: e.$keyboardNavigation.SchedulerNode, dataArea: e.$keyboardNavigation.DataArea, timeSlot: e.$keyboardNavigation.TimeSlot, event: e.$keyboardNavigation.Event }, o = {};
    for (var a in n)
      o[a.toLowerCase()] = n[a];
    return o[t = (t + "").toLowerCase()] || n.scheduler;
  }
  e.config.key_nav = !0, e.config.key_nav_step = 30, e.addShortcut = function(t, n, o) {
    var a = i(o);
    a && a.prototype.bind(t, n);
  }, e.getShortcutHandler = function(t, n) {
    var o = i(n);
    if (o) {
      var a = e.$keyboardNavigation.shortcuts.parse(t);
      if (a.length)
        return o.prototype.findHandler(a[0]);
    }
  }, e.removeShortcut = function(t, n) {
    var o = i(n);
    o && o.prototype.unbind(t);
  }, e.focus = function() {
    if (e.config.key_nav) {
      var t = e.$keyboardNavigation.dispatcher;
      t.enable();
      var n = t.getActiveNode();
      !n || n instanceof e.$keyboardNavigation.MinicalButton || n instanceof e.$keyboardNavigation.MinicalCell ? t.setDefaultNode() : t.focusNode(t.getActiveNode());
    }
  }, e.$keyboardNavigation = {}, e._compose = function() {
    for (var t = Array.prototype.slice.call(arguments, 0), n = {}, o = 0; o < t.length; o++) {
      var a = t[o];
      for (var s in typeof a == "function" && (a = new a()), a)
        n[s] = a[s];
    }
    return n;
  }, function(t) {
    t.$keyboardNavigation.shortcuts = { createCommand: function() {
      return { modifiers: { shift: !1, alt: !1, ctrl: !1, meta: !1 }, keyCode: null };
    }, parse: function(n) {
      for (var o = [], a = this.getExpressions(this.trim(n)), s = 0; s < a.length; s++) {
        for (var _ = this.getWords(a[s]), r = this.createCommand(), d = 0; d < _.length; d++)
          this.commandKeys[_[d]] ? r.modifiers[_[d]] = !0 : this.specialKeys[_[d]] ? r.keyCode = this.specialKeys[_[d]] : r.keyCode = _[d].charCodeAt(0);
        o.push(r);
      }
      return o;
    }, getCommandFromEvent: function(n) {
      var o = this.createCommand();
      o.modifiers.shift = !!n.shiftKey, o.modifiers.alt = !!n.altKey, o.modifiers.ctrl = !!n.ctrlKey, o.modifiers.meta = !!n.metaKey, o.keyCode = n.which || n.keyCode, o.keyCode >= 96 && o.keyCode <= 105 && (o.keyCode -= 48);
      var a = String.fromCharCode(o.keyCode);
      return a && (o.keyCode = a.toLowerCase().charCodeAt(0)), o;
    }, getHashFromEvent: function(n) {
      return this.getHash(this.getCommandFromEvent(n));
    }, getHash: function(n) {
      var o = [];
      for (var a in n.modifiers)
        n.modifiers[a] && o.push(a);
      return o.push(n.keyCode), o.join(this.junctionChar);
    }, getExpressions: function(n) {
      return n.split(this.junctionChar);
    }, getWords: function(n) {
      return n.split(this.combinationChar);
    }, trim: function(n) {
      return n.replace(/\s/g, "");
    }, junctionChar: ",", combinationChar: "+", commandKeys: { shift: 16, alt: 18, ctrl: 17, meta: !0 }, specialKeys: { backspace: 8, tab: 9, enter: 13, esc: 27, space: 32, up: 38, down: 40, left: 37, right: 39, home: 36, end: 35, pageup: 33, pagedown: 34, delete: 46, insert: 45, plus: 107, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123 } };
  }(e), function(t) {
    t.$keyboardNavigation.EventHandler = { _handlers: null, findHandler: function(n) {
      this._handlers || (this._handlers = {});
      var o = t.$keyboardNavigation.shortcuts.getHash(n);
      return this._handlers[o];
    }, doAction: function(n, o) {
      var a = this.findHandler(n);
      a && (a.call(this, o), o.preventDefault ? o.preventDefault() : o.returnValue = !1);
    }, bind: function(n, o) {
      this._handlers || (this._handlers = {});
      for (var a = t.$keyboardNavigation.shortcuts, s = a.parse(n), _ = 0; _ < s.length; _++)
        this._handlers[a.getHash(s[_])] = o;
    }, unbind: function(n) {
      for (var o = t.$keyboardNavigation.shortcuts, a = o.parse(n), s = 0; s < a.length; s++)
        this._handlers[o.getHash(a[s])] && delete this._handlers[o.getHash(a[s])];
    }, bindAll: function(n) {
      for (var o in n)
        this.bind(o, n[o]);
    }, initKeys: function() {
      this._handlers || (this._handlers = {}), this.keys && this.bindAll(this.keys);
    } };
  }(e), function(t) {
    t.$keyboardNavigation.getFocusableNodes = t._getFocusableNodes, t.$keyboardNavigation.trapFocus = function(n, o) {
      if (o.keyCode != 9)
        return !1;
      for (var a, s = t.$keyboardNavigation.getFocusableNodes(n), _ = document.activeElement, r = -1, d = 0; d < s.length; d++)
        if (s[d] == _) {
          r = d;
          break;
        }
      if (o.shiftKey) {
        if (a = s[r <= 0 ? s.length - 1 : r - 1])
          return a.focus(), o.preventDefault(), !0;
      } else if (a = s[r >= s.length - 1 ? 0 : r + 1])
        return a.focus(), o.preventDefault(), !0;
      return !1;
    };
  }(e), function(t) {
    t.$keyboardNavigation.marker = { clear: function() {
      for (var n = t.$container.querySelectorAll(".dhx_focus_slot"), o = 0; o < n.length; o++)
        n[o].parentNode.removeChild(n[o]);
    }, createElement: function() {
      var n = document.createElement("div");
      return n.setAttribute("tabindex", -1), n.className = "dhx_focus_slot", n;
    }, renderMultiple: function(n, o, a) {
      for (var s = [], _ = new Date(n), r = new Date(Math.min(o.valueOf(), t.date.add(t.date.day_start(new Date(n)), 1, "day").valueOf())); _.valueOf() < o.valueOf(); )
        s = s.concat(a.call(this, _, new Date(Math.min(r.valueOf(), o.valueOf())))), _ = t.date.day_start(t.date.add(_, 1, "day")), r = t.date.day_start(t.date.add(_, 1, "day")), r = new Date(Math.min(r.valueOf(), o.valueOf()));
      return s;
    }, render: function(n, o, a) {
      this.clear();
      var s = [], _ = t.$keyboardNavigation.TimeSlot.prototype._modes;
      switch (t.$keyboardNavigation.TimeSlot.prototype._getMode()) {
        case _.units:
          s = this.renderVerticalMarker(n, o, a);
          break;
        case _.timeline:
          s = this.renderTimelineMarker(n, o, a);
          break;
        case _.year:
          s = s.concat(this.renderMultiple(n, o, this.renderYearMarker));
          break;
        case _.month:
          s = this.renderMonthMarker(n, o);
          break;
        case _.weekAgenda:
          s = s.concat(this.renderMultiple(n, o, this.renderWeekAgendaMarker));
          break;
        case _.list:
          s = this.renderAgendaMarker(n, o);
          break;
        case _.dayColumns:
          s = s.concat(this.renderMultiple(n, o, this.renderVerticalMarker));
      }
      this.addWaiAriaLabel(s, n, o, a), this.addDataAttributes(s, n, o, a);
      for (var r = s.length - 1; r >= 0; r--)
        if (s[r].offsetWidth)
          return s[r];
      return null;
    }, addDataAttributes: function(n, o, a, s) {
      for (var _ = t.date.date_to_str(t.config.api_date), r = _(o), d = _(a), l = 0; l < n.length; l++)
        n[l].setAttribute("data-start-date", r), n[l].setAttribute("data-end-date", d), s && n[l].setAttribute("data-section", s);
    }, addWaiAriaLabel: function(n, o, a, s) {
      var _ = "", r = t.getState().mode, d = !1;
      if (_ += t.templates.day_date(o), t.date.day_start(new Date(o)).valueOf() != o.valueOf() && (_ += " " + t.templates.hour_scale(o), d = !0), t.date.day_start(new Date(o)).valueOf() != t.date.day_start(new Date(a)).valueOf() && (_ += " - " + t.templates.day_date(a), (d || t.date.day_start(new Date(a)).valueOf() != a.valueOf()) && (_ += " " + t.templates.hour_scale(a))), s) {
        if (t.matrix && t.matrix[r]) {
          const h = t.matrix[r], v = h.y_unit[h.order[s]];
          _ += ", " + t.templates[r + "_scale_label"](v.key, v.label, v);
        } else if (t._props && t._props[r]) {
          const h = t._props[r], v = h.options[h.order[s]];
          _ += ", " + t.templates[r + "_scale_text"](v.key, v.label, v);
        }
      }
      for (var l = 0; l < n.length; l++)
        t._waiAria.setAttributes(n[l], { "aria-label": _, "aria-live": "polite" });
    }, renderWeekAgendaMarker: function(n, o) {
      for (var a = t.$container.querySelectorAll(".dhx_wa_day_cont .dhx_wa_scale_bar"), s = t.date.week_start(new Date(t.getState().min_date)), _ = -1, r = t.date.day_start(new Date(n)), d = 0; d < a.length && (_++, t.date.day_start(new Date(s)).valueOf() != r.valueOf()); d++)
        s = t.date.add(s, 1, "day");
      return _ != -1 ? this._wrapDiv(a[_]) : [];
    }, _wrapDiv: function(n) {
      var o = this.createElement();
      return o.style.top = n.offsetTop + "px", o.style.left = n.offsetLeft + "px", o.style.width = n.offsetWidth + "px", o.style.height = n.offsetHeight + "px", n.appendChild(o), [o];
    }, renderYearMarker: function(n, o) {
      var a = t._get_year_cell(n);
      a.style.position = "relative";
      var s = this.createElement();
      return s.style.top = "0px", s.style.left = "0px", s.style.width = "100%", s.style.height = "100%", a.appendChild(s), [s];
    }, renderAgendaMarker: function(n, o) {
      var a = this.createElement();
      return a.style.height = "1px", a.style.width = "100%", a.style.opacity = 1, a.style.top = "0px", a.style.left = "0px", t.$container.querySelector(".dhx_cal_data").appendChild(a), [a];
    }, renderTimelineMarker: function(n, o, a) {
      var s = t._lame_copy({}, t.matrix[t._mode]), _ = s._scales;
      s.round_position = !1;
      var r = [], d = n ? new Date(n) : t._min_date, l = o ? new Date(o) : t._max_date;
      if (d.valueOf() < t._min_date.valueOf() && (d = new Date(t._min_date)), l.valueOf() > t._max_date.valueOf() && (l = new Date(t._max_date)), !s._trace_x)
        return r;
      for (var h = 0; h < s._trace_x.length && !t._is_column_visible(s._trace_x[h]); h++)
        ;
      if (h == s._trace_x.length)
        return r;
      var v = _[a];
      if (!(d < o && l > n))
        return r;
      var m = this.createElement();
      let f, c;
      function u(k, D) {
        D.setDate(1), D.setFullYear(k.getFullYear()), D.setMonth(k.getMonth()), D.setDate(k.getDate());
      }
      if (t.getView().days) {
        const k = new Date(n);
        u(t._min_date, k);
        const D = new Date(o);
        u(t._min_date, D), f = t._timeline_getX({ start_date: k }, !1, s), c = t._timeline_getX({ start_date: D }, !1, s);
      } else
        f = t._timeline_getX({ start_date: n }, !1, s), c = t._timeline_getX({ start_date: o }, !1, s);
      var p = s._section_height[a] - 1 || s.dy - 1, y = 0;
      t._isRender("cell") && (y = v.offsetTop, f += s.dx, c += s.dx, v = t.$container.querySelector(".dhx_cal_data"));
      var x = Math.max(1, c - f - 1);
      let S = "left";
      return t.config.rtl && (S = "right"), m.style.cssText = `height:${p}px; ${S}:${f}px; width:${x}px; top:${y}px;`, v && (v.appendChild(m), r.push(m)), r;
    }, renderMonthCell: function(n) {
      for (var o = t.$container.querySelectorAll(".dhx_month_head"), a = [], s = 0; s < o.length; s++)
        a.push(o[s].parentNode);
      var _ = -1, r = 0, d = -1, l = t.date.week_start(new Date(t.getState().min_date)), h = t.date.day_start(new Date(n));
      for (s = 0; s < a.length && (_++, d == 6 ? (r++, d = 0) : d++, t.date.day_start(new Date(l)).valueOf() != h.valueOf()); s++)
        l = t.date.add(l, 1, "day");
      if (_ == -1)
        return [];
      var v = t._colsS[d], m = t._colsS.heights[r], f = this.createElement();
      f.style.top = m + "px", f.style.left = v + "px", f.style.width = t._cols[d] + "px", f.style.height = (t._colsS.heights[r + 1] - m || t._colsS.height) + "px";
      var c = t.$container.querySelector(".dhx_cal_data"), u = c.querySelector(".dhx_cal_month_table");
      return u.nextSibling ? c.insertBefore(f, u.nextSibling) : c.appendChild(f), f;
    }, renderMonthMarker: function(n, o) {
      for (var a = [], s = n; s.valueOf() < o.valueOf(); )
        a.push(this.renderMonthCell(s)), s = t.date.add(s, 1, "day");
      return a;
    }, renderVerticalMarker: function(n, o, a) {
      var s = t.locate_holder_day(n), _ = [], r = null, d = t.config;
      if (t._ignores[s])
        return _;
      if (t._props && t._props[t._mode] && a) {
        var l = t._props[t._mode];
        s = l.order[a];
        var h = l.order[a];
        l.days > 1 ? s = t.locate_holder_day(n) + h : (s = h, l.size && s > l.position + l.size && (s = 0));
      }
      if (!(r = t.locate_holder(s)) || r.querySelector(".dhx_scale_hour"))
        return document.createElement("div");
      var v = Math.max(60 * n.getHours() + n.getMinutes(), 60 * d.first_hour), m = Math.min(60 * o.getHours() + o.getMinutes(), 60 * d.last_hour);
      if (!m && t.date.day_start(new Date(o)).valueOf() > t.date.day_start(new Date(n)).valueOf() && (m = 60 * d.last_hour), m <= v)
        return [];
      var f = this.createElement(), c = t.config.hour_size_px * d.last_hour + 1, u = 36e5;
      return f.style.top = Math.round((60 * v * 1e3 - t.config.first_hour * u) * t.config.hour_size_px / u) % c + "px", f.style.lineHeight = f.style.height = Math.max(Math.round(60 * (m - v) * 1e3 * t.config.hour_size_px / u) % c, 1) + "px", f.style.width = "100%", r.appendChild(f), _.push(f), _[0];
    } };
  }(e), function(t) {
    t.$keyboardNavigation.SchedulerNode = function() {
    }, t.$keyboardNavigation.SchedulerNode.prototype = t._compose(t.$keyboardNavigation.EventHandler, { getDefaultNode: function() {
      var n = new t.$keyboardNavigation.TimeSlot();
      return n.isValid() || (n = n.fallback()), n;
    }, _modes: { month: "month", year: "year", dayColumns: "dayColumns", timeline: "timeline", units: "units", weekAgenda: "weekAgenda", list: "list" }, getMode: function() {
      var n = t.getState().mode;
      return t.matrix && t.matrix[n] ? this._modes.timeline : t._props && t._props[n] ? this._modes.units : n == "month" ? this._modes.month : n == "year" ? this._modes.year : n == "week_agenda" ? this._modes.weekAgenda : n == "map" || n == "agenda" || t._grid && t["grid_" + n] ? this._modes.list : this._modes.dayColumns;
    }, focus: function() {
      t.focus();
    }, blur: function() {
    }, disable: function() {
      t.$container.setAttribute("tabindex", "0");
    }, enable: function() {
      t.$container && t.$container.removeAttribute("tabindex");
    }, isEnabled: function() {
      return t.$container.hasAttribute("tabindex");
    }, _compareEvents: function(n, o) {
      return n.start_date.valueOf() == o.start_date.valueOf() ? n.id > o.id ? 1 : -1 : n.start_date.valueOf() > o.start_date.valueOf() ? 1 : -1;
    }, _pickEvent: function(n, o, a, s) {
      var _ = t.getState();
      n = new Date(Math.max(_.min_date.valueOf(), n.valueOf())), o = new Date(Math.min(_.max_date.valueOf(), o.valueOf()));
      var r = t.getEvents(n, o);
      r.sort(this._compareEvents), s && (r = r.reverse());
      for (var d = !!a, l = 0; l < r.length && d; l++)
        r[l].id == a && (d = !1), r.splice(l, 1), l--;
      for (l = 0; l < r.length; l++)
        if (new t.$keyboardNavigation.Event(r[l].id).getNode())
          return r[l];
      return null;
    }, nextEventHandler: function(n) {
      var o = t.$keyboardNavigation.dispatcher.activeNode, a = n || o && o.eventId, s = null;
      if (a && t.getEvent(a)) {
        var _ = t.getEvent(a);
        s = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(_.start_date, t.date.add(_.start_date, 1, "year"), _.id, !1);
      }
      if (!s && !n) {
        var r = t.getState();
        s = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(r.min_date, t.date.add(r.min_date, 1, "year"), null, !1);
      }
      if (s) {
        var d = new t.$keyboardNavigation.Event(s.id);
        d.isValid() ? (o && o.blur(), t.$keyboardNavigation.dispatcher.setActiveNode(d)) : this.nextEventHandler(s.id);
      }
    }, prevEventHandler: function(n) {
      var o = t.$keyboardNavigation.dispatcher.activeNode, a = n || o && o.eventId, s = null;
      if (a && t.getEvent(a)) {
        var _ = t.getEvent(a);
        s = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(t.date.add(_.end_date, -1, "year"), _.end_date, _.id, !0);
      }
      if (!s && !n) {
        var r = t.getState();
        s = t.$keyboardNavigation.SchedulerNode.prototype._pickEvent(t.date.add(r.max_date, -1, "year"), r.max_date, null, !0);
      }
      if (s) {
        var d = new t.$keyboardNavigation.Event(s.id);
        d.isValid() ? (o && o.blur(), t.$keyboardNavigation.dispatcher.setActiveNode(d)) : this.prevEventHandler(s.id);
      }
    }, keys: { "alt+1, alt+2, alt+3, alt+4, alt+5, alt+6, alt+7, alt+8, alt+9": function(n) {
      var o = t.$keyboardNavigation.HeaderCell.prototype.getNodes(".dhx_cal_navline .dhx_cal_tab"), a = n.key;
      a === void 0 && (a = n.keyCode - 48), o[1 * a - 1] && o[1 * a - 1].click();
    }, "ctrl+left,meta+left": function(n) {
      t._click.dhx_cal_prev_button();
    }, "ctrl+right,meta+right": function(n) {
      t._click.dhx_cal_next_button();
    }, "ctrl+up,meta+up": function(n) {
      t.$container.querySelector(".dhx_cal_data").scrollTop -= 20;
    }, "ctrl+down,meta+down": function(n) {
      t.$container.querySelector(".dhx_cal_data").scrollTop += 20;
    }, e: function() {
      this.nextEventHandler();
    }, home: function() {
      t.setCurrentView(/* @__PURE__ */ new Date());
    }, "shift+e": function() {
      this.prevEventHandler();
    }, "ctrl+enter,meta+enter": function() {
      t.addEventNow({ start_date: new Date(t.getState().date) });
    }, "ctrl+c,meta+c": function(n) {
      t._key_nav_copy_paste(n);
    }, "ctrl+v,meta+v": function(n) {
      t._key_nav_copy_paste(n);
    }, "ctrl+x,meta+x": function(n) {
      t._key_nav_copy_paste(n);
    } } }), t.$keyboardNavigation.SchedulerNode.prototype.bindAll(t.$keyboardNavigation.SchedulerNode.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.KeyNavNode = function() {
    }, t.$keyboardNavigation.KeyNavNode.prototype = t._compose(t.$keyboardNavigation.EventHandler, { isValid: function() {
      return !0;
    }, fallback: function() {
      return null;
    }, moveTo: function(n) {
      t.$keyboardNavigation.dispatcher.setActiveNode(n);
    }, compareTo: function(n) {
      if (!n)
        return !1;
      for (var o in this) {
        if (!!this[o] != !!n[o])
          return !1;
        var a = !(!this[o] || !this[o].toString), s = !(!n[o] || !n[o].toString);
        if (s != a)
          return !1;
        if (s && a) {
          if (n[o].toString() != this[o].toString())
            return !1;
        } else if (n[o] != this[o])
          return !1;
      }
      return !0;
    }, getNode: function() {
    }, focus: function() {
      var n = this.getNode();
      n && (n.setAttribute("tabindex", "-1"), n.focus && n.focus());
    }, blur: function() {
      var n = this.getNode();
      n && n.setAttribute("tabindex", "-1");
    } });
  }(e), function(t) {
    t.$keyboardNavigation.HeaderCell = function(n) {
      this.index = n || 0;
    }, t.$keyboardNavigation.HeaderCell.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { getNode: function(n) {
      n = n || this.index || 0;
      var o = this.getNodes();
      if (o[n])
        return o[n];
    }, getNodes: function(n) {
      n = n || [".dhx_cal_navline .dhx_cal_prev_button", ".dhx_cal_navline .dhx_cal_next_button", ".dhx_cal_navline .dhx_cal_today_button", ".dhx_cal_navline .dhx_cal_tab"].join(", ");
      var o = Array.prototype.slice.call(t.$container.querySelectorAll(n));
      return o.sort(function(a, s) {
        return a.offsetLeft - s.offsetLeft;
      }), o;
    }, _handlers: null, isValid: function() {
      return !!this.getNode(this.index);
    }, fallback: function() {
      var n = this.getNode(0);
      return n || (n = new t.$keyboardNavigation.TimeSlot()), n;
    }, keys: { left: function() {
      var n = this.index - 1;
      n < 0 && (n = this.getNodes().length - 1), this.moveTo(new t.$keyboardNavigation.HeaderCell(n));
    }, right: function() {
      var n = this.index + 1;
      n >= this.getNodes().length && (n = 0), this.moveTo(new t.$keyboardNavigation.HeaderCell(n));
    }, down: function() {
      this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, enter: function() {
      var n = this.getNode();
      n && n.click();
    } } }), t.$keyboardNavigation.HeaderCell.prototype.bindAll(t.$keyboardNavigation.HeaderCell.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.Event = function(n) {
      if (this.eventId = null, t.getEvent(n)) {
        var o = t.getEvent(n);
        this.start = new Date(o.start_date), this.end = new Date(o.end_date), this.section = this._getSection(o), this.eventId = n;
      }
    }, t.$keyboardNavigation.Event.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { _getNodes: function() {
      return Array.prototype.slice.call(t.$container.querySelectorAll("[" + t.config.event_attribute + "]"));
    }, _modes: t.$keyboardNavigation.SchedulerNode.prototype._modes, getMode: t.$keyboardNavigation.SchedulerNode.prototype.getMode, _handlers: null, isValid: function() {
      return !(!t.getEvent(this.eventId) || !this.getNode());
    }, fallback: function() {
      var n = this._getNodes()[0], o = null;
      if (n && t._locate_event(n)) {
        var a = t._locate_event(n);
        o = new t.$keyboardNavigation.Event(a);
      } else
        o = new t.$keyboardNavigation.TimeSlot();
      return o;
    }, isScrolledIntoView: function(n) {
      var o = n.getBoundingClientRect(), a = t.$container.querySelector(".dhx_cal_data").getBoundingClientRect();
      return !(o.bottom < a.top || o.top > a.bottom);
    }, getNode: function() {
      var n = "[" + t.config.event_attribute + "='" + this.eventId + "']", o = t.$keyboardNavigation.dispatcher.getInlineEditor(this.eventId);
      if (o)
        return o;
      if (t.isMultisectionEvent && t.isMultisectionEvent(t.getEvent(this.eventId))) {
        for (var a = t.$container.querySelectorAll(n), s = 0; s < a.length; s++)
          if (this.isScrolledIntoView(a[s]))
            return a[s];
        return a[0];
      }
      return t.$container.querySelector(n);
    }, focus: function() {
      var n = t.getEvent(this.eventId), o = t.getState();
      (n.start_date.valueOf() > o.max_date.valueOf() || n.end_date.valueOf() <= o.min_date.valueOf()) && t.setCurrentView(n.start_date);
      var a = this.getNode();
      this.isScrolledIntoView(a) ? t.$keyboardNavigation.dispatcher.keepScrollPosition((function() {
        t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
      }).bind(this)) : t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, _getSection: function(n) {
      var o = null, a = t.getState().mode;
      return t.matrix && t.matrix[a] ? o = n[t.matrix[t.getState().mode].y_property] : t._props && t._props[a] && (o = n[t._props[a].map_to]), o;
    }, _moveToSlot: function(n) {
      var o = t.getEvent(this.eventId);
      if (o) {
        var a = this._getSection(o), s = new t.$keyboardNavigation.TimeSlot(o.start_date, null, a);
        this.moveTo(s.nextSlot(s, n));
      } else
        this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, keys: { left: function() {
      this._moveToSlot("left");
    }, right: function() {
      this._moveToSlot("right");
    }, down: function() {
      this.getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.nextEventHandler() : this._moveToSlot("down");
    }, space: function() {
      var n = this.getNode();
      n && n.click ? n.click() : this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, up: function() {
      this.getMode() == this._modes.list ? t.$keyboardNavigation.SchedulerNode.prototype.prevEventHandler() : this._moveToSlot("up");
    }, delete: function() {
      t.getEvent(this.eventId) ? t._click.buttons.delete(this.eventId) : this.moveTo(new t.$keyboardNavigation.TimeSlot());
    }, enter: function() {
      t.getEvent(this.eventId) ? t.showLightbox(this.eventId) : this.moveTo(new t.$keyboardNavigation.TimeSlot());
    } } }), t.$keyboardNavigation.Event.prototype.bindAll(t.$keyboardNavigation.Event.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.TimeSlot = function(n, o, a, s) {
      var _ = t.getState(), r = t.matrix && t.matrix[_.mode];
      n || (n = this.getDefaultDate()), o || (o = r ? t.date.add(n, r.x_step, r.x_unit) : t.date.add(n, t.config.key_nav_step, "minute")), this.section = a || this._getDefaultSection(), this.start_date = new Date(n), this.end_date = new Date(o), this.movingDate = s || null;
    }, t.$keyboardNavigation.TimeSlot.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { _handlers: null, getDefaultDate: function() {
      var n, o = t.getState(), a = new Date(o.date);
      a.setSeconds(0), a.setMilliseconds(0);
      var s = /* @__PURE__ */ new Date();
      s.setSeconds(0), s.setMilliseconds(0);
      var _ = t.matrix && t.matrix[o.mode], r = !1;
      if (a.valueOf() === s.valueOf() && (r = !0), _)
        r ? (_.x_unit === "day" ? (s.setHours(0), s.setMinutes(0)) : _.x_unit === "hour" && s.setMinutes(0), n = s) : n = t.date[_.name + "_start"](new Date(o.date)), n = this.findVisibleColumn(n);
      else if (n = new Date(t.getState().min_date), r && (n = s), n = this.findVisibleColumn(n), r || n.setHours(t.config.first_hour), !t._table_view) {
        var d = t.$container.querySelector(".dhx_cal_data");
        d.scrollTop && n.setHours(t.config.first_hour + Math.ceil(d.scrollTop / t.config.hour_size_px));
      }
      return n;
    }, clone: function(n) {
      return new t.$keyboardNavigation.TimeSlot(n.start_date, n.end_date, n.section, n.movingDate);
    }, _getMultisectionView: function() {
      var n, o = t.getState();
      return t._props && t._props[o.mode] ? n = t._props[o.mode] : t.matrix && t.matrix[o.mode] && (n = t.matrix[o.mode]), n;
    }, _getDefaultSection: function() {
      var n = null;
      return this._getMultisectionView() && !n && (n = this._getNextSection()), n;
    }, _getNextSection: function(n, o) {
      var a = this._getMultisectionView(), s = a.order[n], _ = s;
      (_ = s !== void 0 ? s + o : a.size && a.position ? a.position : 0) < 0 && (_ = 0);
      var r = a.options || a.y_unit;
      return _ >= r.length && (_ = r.length - 1), r[_] ? r[_].key : null;
    }, isValid: function() {
      var n = t.getState();
      if (this.start_date.valueOf() < n.min_date.valueOf() || this.start_date.valueOf() >= n.max_date.valueOf() || !this.isVisible(this.start_date, this.end_date))
        return !1;
      var o = this._getMultisectionView();
      return !o || o.order[this.section] !== void 0;
    }, fallback: function() {
      var n = new t.$keyboardNavigation.TimeSlot();
      return n.isValid() ? n : new t.$keyboardNavigation.DataArea();
    }, getNodes: function() {
      return Array.prototype.slice.call(t.$container.querySelectorAll(".dhx_focus_slot"));
    }, getNode: function() {
      return this.getNodes()[0];
    }, focus: function() {
      this.section && t.getView() && t.getView().smart_rendering && t.getView().scrollTo && !t.$container.querySelector(`[data-section-id="${this.section}"]`) && t.getView().scrollTo({ section: this.section }), t.$keyboardNavigation.marker.render(this.start_date, this.end_date, this.section), t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this), t.$keyboardNavigation._pasteDate = this.start_date, t.$keyboardNavigation._pasteSection = this.section;
    }, blur: function() {
      t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this), t.$keyboardNavigation.marker.clear();
    }, _modes: t.$keyboardNavigation.SchedulerNode.prototype._modes, _getMode: t.$keyboardNavigation.SchedulerNode.prototype.getMode, addMonthDate: function(n, o, a) {
      var s;
      switch (o) {
        case "up":
          s = t.date.add(n, -1, "week");
          break;
        case "down":
          s = t.date.add(n, 1, "week");
          break;
        case "left":
          s = t.date.day_start(t.date.add(n, -1, "day")), s = this.findVisibleColumn(s, -1);
          break;
        case "right":
          s = t.date.day_start(t.date.add(n, 1, "day")), s = this.findVisibleColumn(s, 1);
          break;
        default:
          s = t.date.day_start(new Date(n));
      }
      var _ = t.getState();
      return (n.valueOf() < _.min_date.valueOf() || !a && n.valueOf() >= _.max_date.valueOf()) && (s = new Date(_.min_date)), s;
    }, nextMonthSlot: function(n, o, a) {
      var s, _;
      return (s = this.addMonthDate(n.start_date, o, a)).setHours(t.config.first_hour), (_ = new Date(s)).setHours(t.config.last_hour), { start_date: s, end_date: _ };
    }, _alignTimeSlot: function(n, o, a, s) {
      for (var _ = new Date(o); _.valueOf() < n.valueOf(); )
        _ = t.date.add(_, s, a);
      return _.valueOf() > n.valueOf() && (_ = t.date.add(_, -s, a)), _;
    }, nextTimelineSlot: function(n, o, a) {
      var s = t.getState(), _ = t.matrix[s.mode], r = this._alignTimeSlot(n.start_date, t.date[_.name + "_start"](new Date(n.start_date)), _.x_unit, _.x_step), d = this._alignTimeSlot(n.end_date, t.date[_.name + "_start"](new Date(n.end_date)), _.x_unit, _.x_step);
      d.valueOf() <= r.valueOf() && (d = t.date.add(r, _.x_step, _.x_unit));
      var l = this.clone(n);
      switch (l.start_date = r, l.end_date = d, l.section = n.section || this._getNextSection(), o) {
        case "up":
          l.section = this._getNextSection(n.section, -1);
          break;
        case "down":
          l.section = this._getNextSection(n.section, 1);
          break;
        case "left":
          l.start_date = this.findVisibleColumn(t.date.add(l.start_date, -_.x_step, _.x_unit), -1), l.end_date = t.date.add(l.start_date, _.x_step, _.x_unit);
          break;
        case "right":
          l.start_date = this.findVisibleColumn(t.date.add(l.start_date, _.x_step, _.x_unit), 1), l.end_date = t.date.add(l.start_date, _.x_step, _.x_unit);
      }
      return (l.start_date.valueOf() < s.min_date.valueOf() || l.start_date.valueOf() >= s.max_date.valueOf()) && (a && l.start_date.valueOf() >= s.max_date.valueOf() ? l.start_date = new Date(s.max_date) : (l.start_date = t.date[s.mode + "_start"](t.date.add(s.date, o == "left" ? -1 : 1, s.mode)), l.end_date = t.date.add(l.start_date, _.x_step, _.x_unit))), l;
    }, nextUnitsSlot: function(n, o, a) {
      var s = this.clone(n);
      s.section = n.section || this._getNextSection();
      var _ = n.section || this._getNextSection(), r = t.getState(), d = t._props[r.mode];
      switch (o) {
        case "left":
          _ = this._getNextSection(n.section, -1);
          var l = d.size ? d.size - 1 : d.options.length;
          d.days > 1 && d.order[_] == l - 1 && t.date.add(n.start_date, -1, "day").valueOf() >= r.min_date.valueOf() && (s = this.nextDaySlot(n, o, a));
          break;
        case "right":
          _ = this._getNextSection(n.section, 1), d.days > 1 && !d.order[_] && t.date.add(n.start_date, 1, "day").valueOf() < r.max_date.valueOf() && (s = this.nextDaySlot(n, o, a));
          break;
        default:
          s = this.nextDaySlot(n, o, a), _ = n.section;
      }
      return s.section = _, s;
    }, _moveDate: function(n, o) {
      var a = this.findVisibleColumn(t.date.add(n, o, "day"), o);
      return a.setHours(n.getHours()), a.setMinutes(n.getMinutes()), a;
    }, isBeforeLastHour: function(n, o) {
      var a = n.getMinutes(), s = n.getHours(), _ = t.config.last_hour;
      return s < _ || !o && (_ == 24 || s == _) && !a;
    }, isAfterFirstHour: function(n, o) {
      var a = n.getMinutes(), s = n.getHours(), _ = t.config.first_hour, r = t.config.last_hour;
      return s >= _ || !o && !a && (!s && r == 24 || s == r);
    }, isInVisibleDayTime: function(n, o) {
      return this.isBeforeLastHour(n, o) && this.isAfterFirstHour(n, o);
    }, nextDaySlot: function(n, o, a) {
      var s, _, r = t.config.key_nav_step, d = this._alignTimeSlot(n.start_date, t.date.day_start(new Date(n.start_date)), "minute", r), l = n.start_date;
      switch (o) {
        case "up":
          if (s = t.date.add(d, -r, "minute"), !this.isInVisibleDayTime(s, !0) && (!a || this.isInVisibleDayTime(l, !0))) {
            var h = !0;
            a && t.date.date_part(new Date(s)).valueOf() != t.date.date_part(new Date(l)).valueOf() && (h = !1), h && (s = this.findVisibleColumn(t.date.add(n.start_date, -1, "day"), -1)), s.setHours(t.config.last_hour), s.setMinutes(0), s = t.date.add(s, -r, "minute");
          }
          _ = t.date.add(s, r, "minute");
          break;
        case "down":
          s = t.date.add(d, r, "minute");
          var v = a ? s : t.date.add(s, r, "minute");
          this.isInVisibleDayTime(v, !1) || a && !this.isInVisibleDayTime(l, !1) || (a ? (h = !0, t.date.date_part(new Date(l)).valueOf() == l.valueOf() && (h = !1), h && (s = this.findVisibleColumn(t.date.add(n.start_date, 1, "day"), 1)), s.setHours(t.config.first_hour), s.setMinutes(0), s = t.date.add(s, r, "minute")) : ((s = this.findVisibleColumn(t.date.add(n.start_date, 1, "day"), 1)).setHours(t.config.first_hour), s.setMinutes(0))), _ = t.date.add(s, r, "minute");
          break;
        case "left":
          s = this._moveDate(n.start_date, -1), _ = this._moveDate(n.end_date, -1);
          break;
        case "right":
          s = this._moveDate(n.start_date, 1), _ = this._moveDate(n.end_date, 1);
          break;
        default:
          s = d, _ = t.date.add(s, r, "minute");
      }
      return { start_date: s, end_date: _ };
    }, nextWeekAgendaSlot: function(n, o) {
      var a, s, _ = t.getState();
      switch (o) {
        case "down":
        case "left":
          a = t.date.day_start(t.date.add(n.start_date, -1, "day")), a = this.findVisibleColumn(a, -1);
          break;
        case "up":
        case "right":
          a = t.date.day_start(t.date.add(n.start_date, 1, "day")), a = this.findVisibleColumn(a, 1);
          break;
        default:
          a = t.date.day_start(n.start_date);
      }
      return (n.start_date.valueOf() < _.min_date.valueOf() || n.start_date.valueOf() >= _.max_date.valueOf()) && (a = new Date(_.min_date)), (s = new Date(a)).setHours(t.config.last_hour), { start_date: a, end_date: s };
    }, nextAgendaSlot: function(n, o) {
      return { start_date: n.start_date, end_date: n.end_date };
    }, isDateVisible: function(n) {
      if (!t._ignores_detected)
        return !0;
      var o, a = t.matrix && t.matrix[t.getState().mode];
      return o = a ? t._get_date_index(a, n) : t.locate_holder_day(n), !t._ignores[o];
    }, findVisibleColumn: function(n, o) {
      var a = n;
      o = o || 1;
      for (var s = t.getState(); !this.isDateVisible(a) && (o > 0 && a.valueOf() <= s.max_date.valueOf() || o < 0 && a.valueOf() >= s.min_date.valueOf()); )
        a = this.nextDateColumn(a, o);
      return a;
    }, nextDateColumn: function(n, o) {
      o = o || 1;
      var a = t.matrix && t.matrix[t.getState().mode];
      return a ? t.date.add(n, o * a.x_step, a.x_unit) : t.date.day_start(t.date.add(n, o, "day"));
    }, isVisible: function(n, o) {
      if (!t._ignores_detected)
        return !0;
      for (var a = new Date(n); a.valueOf() < o.valueOf(); ) {
        if (this.isDateVisible(a))
          return !0;
        a = this.nextDateColumn(a);
      }
      return !1;
    }, nextSlot: function(n, o, a, s) {
      var _;
      a = a || this._getMode();
      var r = t.$keyboardNavigation.TimeSlot.prototype.clone(n);
      switch (a) {
        case this._modes.units:
          _ = this.nextUnitsSlot(r, o, s);
          break;
        case this._modes.timeline:
          _ = this.nextTimelineSlot(r, o, s);
          break;
        case this._modes.year:
        case this._modes.month:
          _ = this.nextMonthSlot(r, o, s);
          break;
        case this._modes.weekAgenda:
          _ = this.nextWeekAgendaSlot(r, o, s);
          break;
        case this._modes.list:
          _ = this.nextAgendaSlot(r, o, s);
          break;
        case this._modes.dayColumns:
          _ = this.nextDaySlot(r, o, s);
      }
      return _.start_date.valueOf() >= _.end_date.valueOf() && (_ = this.nextSlot(_, o, a)), t.$keyboardNavigation.TimeSlot.prototype.clone(_);
    }, extendSlot: function(n, o) {
      var a;
      switch (this._getMode()) {
        case this._modes.units:
          a = o == "left" || o == "right" ? this.nextUnitsSlot(n, o) : this.extendUnitsSlot(n, o);
          break;
        case this._modes.timeline:
          a = o == "down" || o == "up" ? this.nextTimelineSlot(n, o) : this.extendTimelineSlot(n, o);
          break;
        case this._modes.year:
        case this._modes.month:
          a = this.extendMonthSlot(n, o);
          break;
        case this._modes.dayColumns:
          a = this.extendDaySlot(n, o);
          break;
        case this._modes.weekAgenda:
          a = this.extendWeekAgendaSlot(n, o);
          break;
        default:
          a = n;
      }
      var s = t.getState();
      return a.start_date.valueOf() < s.min_date.valueOf() && (a.start_date = this.findVisibleColumn(s.min_date), a.start_date.setHours(t.config.first_hour)), a.end_date.valueOf() > s.max_date.valueOf() && (a.end_date = this.findVisibleColumn(s.max_date, -1)), t.$keyboardNavigation.TimeSlot.prototype.clone(a);
    }, extendTimelineSlot: function(n, o) {
      return this.extendGenericSlot({ left: "start_date", right: "end_date" }, n, o, "timeline");
    }, extendWeekAgendaSlot: function(n, o) {
      return this.extendGenericSlot({ left: "start_date", right: "end_date" }, n, o, "weekAgenda");
    }, extendGenericSlot: function(n, o, a, s) {
      var _, r = o.movingDate;
      if (r || (r = n[a]), !r || !n[a])
        return o;
      if (!a)
        return t.$keyboardNavigation.TimeSlot.prototype.clone(o);
      (_ = this.nextSlot({ start_date: o[r], section: o.section }, a, s, !0)).start_date.valueOf() == o.start_date.valueOf() && (_ = this.nextSlot({ start_date: _.start_date, section: _.section }, a, s, !0)), _.movingDate = r;
      var d = this.extendSlotDates(o, _, _.movingDate);
      return d.end_date.valueOf() <= d.start_date.valueOf() && (_.movingDate = _.movingDate == "end_date" ? "start_date" : "end_date"), d = this.extendSlotDates(o, _, _.movingDate), _.start_date = d.start_date, _.end_date = d.end_date, _;
    }, extendSlotDates: function(n, o, a) {
      var s = { start_date: null, end_date: null };
      return a == "start_date" ? (s.start_date = o.start_date, s.end_date = n.end_date) : (s.start_date = n.start_date, s.end_date = o.start_date), s;
    }, extendMonthSlot: function(n, o) {
      return (n = this.extendGenericSlot({ up: "start_date", down: "end_date", left: "start_date", right: "end_date" }, n, o, "month")).start_date.setHours(t.config.first_hour), n.end_date = t.date.add(n.end_date, -1, "day"), n.end_date.setHours(t.config.last_hour), n;
    }, extendUnitsSlot: function(n, o) {
      var a;
      switch (o) {
        case "down":
        case "up":
          a = this.extendDaySlot(n, o);
          break;
        default:
          a = n;
      }
      return a.section = n.section, a;
    }, extendDaySlot: function(n, o) {
      return this.extendGenericSlot({ up: "start_date", down: "end_date", left: "start_date", right: "end_date" }, n, o, "dayColumns");
    }, scrollSlot: function(n) {
      var o = t.getState(), a = this.nextSlot(this, n);
      (a.start_date.valueOf() < o.min_date.valueOf() || a.start_date.valueOf() >= o.max_date.valueOf()) && t.setCurrentView(new Date(a.start_date)), this.moveTo(a);
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
      var n = { start_date: new Date(this.start_date), end_date: new Date(this.end_date) }, o = t.getState().mode;
      t.matrix && t.matrix[o] ? n[t.matrix[t.getState().mode].y_property] = this.section : t._props && t._props[o] && (n[t._props[o].map_to] = this.section), t.addEventNow(n);
    } } }), t.$keyboardNavigation.TimeSlot.prototype.bindAll(t.$keyboardNavigation.TimeSlot.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.MinicalButton = function(n, o) {
      this.container = n, this.index = o || 0;
    }, t.$keyboardNavigation.MinicalButton.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { isValid: function() {
      return !!this.container.offsetWidth;
    }, fallback: function() {
      var n = new t.$keyboardNavigation.TimeSlot();
      return n.isValid() ? n : new t.$keyboardNavigation.DataArea();
    }, focus: function() {
      t.$keyboardNavigation.dispatcher.globalNode.disable(), this.container.removeAttribute("tabindex"), t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      this.container.setAttribute("tabindex", "0"), t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, getNode: function() {
      return this.index ? this.container.querySelector(".dhx_cal_next_button") : this.container.querySelector(".dhx_cal_prev_button");
    }, keys: { right: function(n) {
      this.moveTo(new t.$keyboardNavigation.MinicalButton(this.container, this.index ? 0 : 1));
    }, left: function(n) {
      this.moveTo(new t.$keyboardNavigation.MinicalButton(this.container, this.index ? 0 : 1));
    }, down: function() {
      var n = new t.$keyboardNavigation.MinicalCell(this.container, 0, 0);
      n && !n.isValid() && (n = n.fallback()), this.moveTo(n);
    }, enter: function(n) {
      this.getNode().click();
    } } }), t.$keyboardNavigation.MinicalButton.prototype.bindAll(t.$keyboardNavigation.MinicalButton.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.MinicalCell = function(n, o, a) {
      this.container = n, this.row = o || 0, this.col = a || 0;
    }, t.$keyboardNavigation.MinicalCell.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { isValid: function() {
      var n = this._getGrid();
      return !(!n[this.row] || !n[this.row][this.col]);
    }, fallback: function() {
      var n = this.row, o = this.col, a = this._getGrid();
      a[n] || (n = 0);
      var s = !0;
      if (n > a.length / 2 && (s = !1), !a[n]) {
        var _ = new t.$keyboardNavigation.TimeSlot();
        return _.isValid() ? _ : new t.$keyboardNavigation.DataArea();
      }
      if (s) {
        for (var r = o; a[n] && r < a[n].length; r++)
          if (a[n][r] || r != a[n].length - 1 || (n++, o = 0), a[n][r])
            return new t.$keyboardNavigation.MinicalCell(this.container, n, r);
      } else
        for (r = o; a[n] && r < a[n].length; r--)
          if (a[n][r] || r || (o = a[--n].length - 1), a[n][r])
            return new t.$keyboardNavigation.MinicalCell(this.container, n, r);
      return new t.$keyboardNavigation.MinicalButton(this.container, 0);
    }, focus: function() {
      t.$keyboardNavigation.dispatcher.globalNode.disable(), this.container.removeAttribute("tabindex"), t.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
    }, blur: function() {
      this.container.setAttribute("tabindex", "0"), t.$keyboardNavigation.KeyNavNode.prototype.blur.apply(this);
    }, _getNode: function(n, o) {
      return this.container.querySelector(".dhx_year_body tr:nth-child(" + (n + 1) + ") td:nth-child(" + (o + 1) + ")");
    }, getNode: function() {
      return this._getNode(this.row, this.col);
    }, _getGrid: function() {
      for (var n = this.container.querySelectorAll(".dhx_year_body tr"), o = [], a = 0; a < n.length; a++) {
        o[a] = [];
        for (var s = n[a].querySelectorAll("td"), _ = 0; _ < s.length; _++) {
          var r = s[_], d = !0, l = t._getClassName(r);
          (l.indexOf("dhx_after") > -1 || l.indexOf("dhx_before") > -1 || l.indexOf("dhx_scale_ignore") > -1) && (d = !1), o[a][_] = d;
        }
      }
      return o;
    }, keys: { right: function(n) {
      var o = this._getGrid(), a = this.row, s = this.col + 1;
      o[a] && o[a][s] || (o[a + 1] ? (a += 1, s = 0) : s = this.col);
      var _ = new t.$keyboardNavigation.MinicalCell(this.container, a, s);
      _.isValid() || (_ = _.fallback()), this.moveTo(_);
    }, left: function(n) {
      var o = this._getGrid(), a = this.row, s = this.col - 1;
      o[a] && o[a][s] || (s = o[a - 1] ? o[a -= 1].length - 1 : this.col);
      var _ = new t.$keyboardNavigation.MinicalCell(this.container, a, s);
      _.isValid() || (_ = _.fallback()), this.moveTo(_);
    }, down: function() {
      var n = this._getGrid(), o = this.row + 1, a = this.col;
      n[o] && n[o][a] || (o = this.row);
      var s = new t.$keyboardNavigation.MinicalCell(this.container, o, a);
      s.isValid() || (s = s.fallback()), this.moveTo(s);
    }, up: function() {
      var n = this._getGrid(), o = this.row - 1, a = this.col;
      if (n[o] && n[o][a]) {
        var s = new t.$keyboardNavigation.MinicalCell(this.container, o, a);
        s.isValid() || (s = s.fallback()), this.moveTo(s);
      } else {
        var _ = 0;
        this.col > n[this.row].length / 2 && (_ = 1), this.moveTo(new t.$keyboardNavigation.MinicalButton(this.container, _));
      }
    }, enter: function(n) {
      this.getNode().querySelector(".dhx_month_head").click();
    } } }), t.$keyboardNavigation.MinicalCell.prototype.bindAll(t.$keyboardNavigation.MinicalCell.prototype.keys);
  }(e), function(t) {
    t.$keyboardNavigation.DataArea = function(n) {
      this.index = n || 0;
    }, t.$keyboardNavigation.DataArea.prototype = t._compose(t.$keyboardNavigation.KeyNavNode, { getNode: function(n) {
      return t.$container.querySelector(".dhx_cal_data");
    }, _handlers: null, isValid: function() {
      return !0;
    }, fallback: function() {
      return this;
    }, keys: { "up,down,right,left": function() {
      this.moveTo(new t.$keyboardNavigation.TimeSlot());
    } } }), t.$keyboardNavigation.DataArea.prototype.bindAll(t.$keyboardNavigation.DataArea.prototype.keys);
  }(e), Aa(e), function(t) {
    t.$keyboardNavigation.dispatcher = { isActive: !1, activeNode: null, globalNode: new t.$keyboardNavigation.SchedulerNode(), keepScrollPosition: function(n) {
      var o, a, s = t.$container.querySelector(".dhx_timeline_scrollable_data");
      s || (s = t.$container.querySelector(".dhx_cal_data")), s && (o = s.scrollTop, a = s.scrollLeft), n(), s && (s.scrollTop = o, s.scrollLeft = a);
    }, enable: function() {
      if (t.$container) {
        this.isActive = !0;
        var n = this;
        this.keepScrollPosition(function() {
          n.globalNode.enable(), n.setActiveNode(n.getActiveNode());
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
      var n = this.activeNode;
      return n && !n.isValid() && (n = n.fallback()), n;
    }, focusGlobalNode: function() {
      this.blurNode(this.globalNode), this.focusNode(this.globalNode);
    }, setActiveNode: function(n) {
      n && n.isValid() && (this.activeNode && this.activeNode.compareTo(n) || this.isEnabled() && (this.blurNode(this.activeNode), this.activeNode = n, this.focusNode(this.activeNode)));
    }, focusNode: function(n) {
      n && n.focus && (n.focus(), n.getNode && document.activeElement != n.getNode() && this.setActiveNode(new t.$keyboardNavigation.DataArea()));
    }, blurNode: function(n) {
      n && n.blur && n.blur();
    }, getInlineEditor: function(n) {
      var o = t.$container.querySelector(".dhx_cal_editor[" + t.config.event_attribute + "='" + n + "'] textarea");
      return o && o.offsetWidth ? o : null;
    }, keyDownHandler: function(n) {
      if (!n.defaultPrevented) {
        var o = this.getActiveNode();
        if ((!t.$keyboardNavigation.isModal() || o && o.container && t.utils.dom.locateCss({ target: o.container }, "dhx_minical_popup", !1)) && (!t.getState().editor_id || !this.getInlineEditor(t.getState().editor_id)) && this.isEnabled()) {
          n = n || window.event;
          var a = this.globalNode, s = t.$keyboardNavigation.shortcuts.getCommandFromEvent(n);
          o ? o.findHandler(s) ? o.doAction(s, n) : a.findHandler(s) && a.doAction(s, n) : this.setDefaultNode();
        }
      }
    }, _timeout: null, delay: function(n, o) {
      clearTimeout(this._timeout), this._timeout = setTimeout(n, o || 1);
    } };
  }(e), Ca(e), function() {
    Oa(e), function(_) {
      _.$keyboardNavigation._minicalendars = [], _.$keyboardNavigation.isMinical = function(r) {
        for (var d = _.$keyboardNavigation._minicalendars, l = 0; l < d.length; l++)
          if (this.isChildOf(r, d[l]))
            return !0;
        return !1;
      }, _.$keyboardNavigation.isChildOf = function(r, d) {
        for (; r && r !== d; )
          r = r.parentNode;
        return r === d;
      }, _.$keyboardNavigation.patchMinicalendar = function() {
        var r = _.$keyboardNavigation.dispatcher;
        function d(m) {
          var f = m.target;
          r.enable(), r.setActiveNode(new _.$keyboardNavigation.MinicalButton(f, 0));
        }
        function l(m) {
          var f = m.target || m.srcElement, c = _.utils.dom.locateCss(m, "dhx_cal_prev_button", !1), u = _.utils.dom.locateCss(m, "dhx_cal_next_button", !1), p = _.utils.dom.locateCss(m, "dhx_year_body", !1), y = 0, x = 0;
          if (p) {
            for (var S, k, D = f; D && D.tagName.toLowerCase() != "td"; )
              D = D.parentNode;
            if (D && (S = (k = D).parentNode), S && k) {
              for (var M = S.parentNode.querySelectorAll("tr"), g = 0; g < M.length; g++)
                if (M[g] == S) {
                  y = g;
                  break;
                }
              var b = S.querySelectorAll("td");
              for (g = 0; g < b.length; g++)
                if (b[g] == k) {
                  x = g;
                  break;
                }
            }
          }
          var w = m.currentTarget;
          r.delay(function() {
            var E;
            (c || u || p) && (c ? (E = new _.$keyboardNavigation.MinicalButton(w, 0), r.setActiveNode(new _.$keyboardNavigation.MinicalButton(w, 0))) : u ? E = new _.$keyboardNavigation.MinicalButton(w, 1) : p && (E = new _.$keyboardNavigation.MinicalCell(w, y, x)), E && (r.enable(), E.isValid() && (r.activeNode = null, r.setActiveNode(E))));
          });
        }
        if (_.renderCalendar) {
          var h = _.renderCalendar;
          _.renderCalendar = function() {
            var m = h.apply(this, arguments), f = _.$keyboardNavigation._minicalendars;
            _.eventRemove(m, "click", l), _.event(m, "click", l), _.eventRemove(m, "focus", d), _.event(m, "focus", d);
            for (var c = !1, u = 0; u < f.length; u++)
              if (f[u] == m) {
                c = !0;
                break;
              }
            if (c || f.push(m), r.isEnabled()) {
              var p = r.getActiveNode();
              p && p.container == m ? r.focusNode(p) : m.setAttribute("tabindex", "0");
            } else
              m.setAttribute("tabindex", "0");
            return m;
          };
        }
        if (_.destroyCalendar) {
          var v = _.destroyCalendar;
          _.destroyCalendar = function(m, f) {
            m = m || (_._def_count ? _._def_count.firstChild : null);
            var c = v.apply(this, arguments);
            if (!m || !m.parentNode)
              for (var u = _.$keyboardNavigation._minicalendars, p = 0; p < u.length; p++)
                u[p] == m && (_.eventRemove(u[p], "focus", d), u.splice(p, 1), p--);
            return c;
          };
        }
      };
    }(e);
    var t = e.$keyboardNavigation.dispatcher;
    if (e.$keyboardNavigation.attachSchedulerHandlers(), e.renderCalendar)
      e.$keyboardNavigation.patchMinicalendar();
    else
      var n = e.attachEvent("onSchedulerReady", function() {
        e.detachEvent(n), e.$keyboardNavigation.patchMinicalendar();
      });
    function o() {
      if (e.config.key_nav) {
        var _ = document.activeElement;
        return !(!_ || e.utils.dom.locateCss(_, "dhx_cal_quick_info", !1)) && (e.$keyboardNavigation.isChildOf(_, e.$container) || e.$keyboardNavigation.isMinical(_));
      }
    }
    function a(_) {
      _ && !t.isEnabled() ? t.enable() : !_ && t.isEnabled() && t.disable();
    }
    const s = setInterval(function() {
      if (e.$container && e.$keyboardNavigation.isChildOf(e.$container, document.body)) {
        var _ = o();
        _ ? a(_) : !_ && t.isEnabled() && setTimeout(function() {
          e.$destroyed || (e.config.key_nav ? a(o()) : e.$container.removeAttribute("tabindex"));
        }, 100);
      }
    }, 500);
    e.attachEvent("onDestroy", function() {
      clearInterval(s);
    });
  }();
}, layer: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    this.layers.sort(function(t, n) {
      return t.zIndex - n.zIndex;
    }), e._dp_init = function(t) {
      t._methods = ["_set_event_text_style", "", "changeEventId", "deleteEvent"], this.attachEvent("onEventAdded", function(n) {
        !this._loading && this.validId(n) && this.getEvent(n) && this.getEvent(n).layer == t.layer && t.setUpdated(n, !0, "inserted");
      }), this.attachEvent("onBeforeEventDelete", function(n) {
        if (this.getEvent(n) && this.getEvent(n).layer == t.layer) {
          if (!this.validId(n))
            return;
          var o = t.getState(n);
          return o == "inserted" || this._new_event ? (t.setUpdated(n, !1), !0) : o != "deleted" && (o == "true_deleted" || (t.setUpdated(n, !0, "deleted"), !1));
        }
        return !0;
      }), this.attachEvent("onEventChanged", function(n) {
        !this._loading && this.validId(n) && this.getEvent(n) && this.getEvent(n).layer == t.layer && t.setUpdated(n, !0, "updated");
      }), t._getRowData = function(n, o) {
        var a = this.obj.getEvent(n), s = {};
        for (var _ in a)
          _.indexOf("_") !== 0 && (a[_] && a[_].getUTCFullYear ? s[_] = this.obj._helpers.formatDate(a[_]) : s[_] = a[_]);
        return s;
      }, t._clearUpdateFlag = function() {
      }, t.attachEvent("insertCallback", e._update_callback), t.attachEvent("updateCallback", e._update_callback), t.attachEvent("deleteCallback", function(n, o) {
        this.obj.setUserData(o, this.action_param, "true_deleted"), this.obj.deleteEvent(o);
      });
    }, function() {
      var t = function(a) {
        if (a === null || typeof a != "object")
          return a;
        var s = new a.constructor();
        for (var _ in a)
          s[_] = t(a[_]);
        return s;
      };
      e._dataprocessors = [], e._layers_zindex = {};
      for (var n = 0; n < e.layers.length; n++) {
        if (e.config["lightbox_" + e.layers[n].name] = {}, e.config["lightbox_" + e.layers[n].name].sections = t(e.config.lightbox.sections), e._layers_zindex[e.layers[n].name] = e.config.initial_layer_zindex || 5 + 3 * n, e.layers[n].url) {
          var o = e.createDataProcessor({ url: e.layers[n].url });
          o.layer = e.layers[n].name, e._dataprocessors.push(o), e._dataprocessors[n].init(e);
        }
        e.layers[n].isDefault && (e.defaultLayer = e.layers[n].name);
      }
    }(), e.showLayer = function(t) {
      this.toggleLayer(t, !0);
    }, e.hideLayer = function(t) {
      this.toggleLayer(t, !1);
    }, e.toggleLayer = function(t, n) {
      var o = this.getLayer(t);
      o.visible = n !== void 0 ? !!n : !o.visible, this.setCurrentView(this._date, this._mode);
    }, e.getLayer = function(t) {
      var n, o;
      typeof t == "string" && (o = t), typeof t == "object" && (o = t.layer);
      for (var a = 0; a < e.layers.length; a++)
        e.layers[a].name == o && (n = e.layers[a]);
      return n;
    }, e.attachEvent("onBeforeLightbox", function(t) {
      var n = this.getEvent(t);
      return this.config.lightbox.sections = this.config["lightbox_" + n.layer].sections, e.resetLightbox(), !0;
    }), e.attachEvent("onClick", function(t, n) {
      var o = e.getEvent(t);
      return !e.getLayer(o.layer).noMenu;
    }), e.attachEvent("onEventCollision", function(t, n) {
      var o = this.getLayer(t);
      if (!o.checkCollision)
        return !1;
      for (var a = 0, s = 0; s < n.length; s++)
        n[s].layer == o.name && n[s].id != t.id && a++;
      return a >= e.config.collision_limit;
    }), e.addEvent = function(t, n, o, a, s) {
      var _ = t;
      arguments.length != 1 && ((_ = s || {}).start_date = t, _.end_date = n, _.text = o, _.id = a, _.layer = this.defaultLayer), _.id = _.id || e.uid(), _.text = _.text || "", typeof _.start_date == "string" && (_.start_date = this.templates.api_date(_.start_date)), typeof _.end_date == "string" && (_.end_date = this.templates.api_date(_.end_date)), _._timed = this.isOneDayEvent(_);
      var r = !this._events[_.id];
      this._events[_.id] = _, this.event_updated(_), this._loading || this.callEvent(r ? "onEventAdded" : "onEventChanged", [_.id, _]);
    }, this._evs_layer = {};
    for (var i = 0; i < this.layers.length; i++)
      this._evs_layer[this.layers[i].name] = [];
    e.addEventNow = function(t, n, o) {
      var a = {};
      typeof t == "object" && (a = t, t = null);
      var s = 6e4 * (this.config.event_duration || this.config.time_step);
      t || (t = Math.round(e._currentDate().valueOf() / s) * s);
      var _ = new Date(t);
      if (!n) {
        var r = this.config.first_hour;
        r > _.getHours() && (_.setHours(r), t = _.valueOf()), n = t + s;
      }
      a.start_date = a.start_date || _, a.end_date = a.end_date || new Date(n), a.text = a.text || this.locale.labels.new_event, a.id = this._drag_id = this.uid(), a.layer = this.defaultLayer, this._drag_mode = "new-size", this._loading = !0, this.addEvent(a), this.callEvent("onEventCreated", [this._drag_id, o]), this._loading = !1, this._drag_event = {}, this._on_mouse_up(o);
    }, e._t_render_view_data = function(t) {
      if (this.config.multi_day && !this._table_view) {
        for (var n = [], o = [], a = 0; a < t.length; a++)
          t[a]._timed ? n.push(t[a]) : o.push(t[a]);
        this._table_view = !0, this.render_data(o), this._table_view = !1, this.render_data(n);
      } else
        this.render_data(t);
    }, e.render_view_data = function() {
      if (this._not_render)
        this._render_wait = !0;
      else {
        this._render_wait = !1, this.clear_view(), this._evs_layer = {};
        for (var t = 0; t < this.layers.length; t++)
          this._evs_layer[this.layers[t].name] = [];
        var n = this.get_visible_events();
        for (t = 0; t < n.length; t++)
          this._evs_layer[n[t].layer] && this._evs_layer[n[t].layer].push(n[t]);
        if (this._mode == "month") {
          var o = [];
          for (t = 0; t < this.layers.length; t++)
            this.layers[t].visible && (o = o.concat(this._evs_layer[this.layers[t].name]));
          this._t_render_view_data(o);
        } else
          for (t = 0; t < this.layers.length; t++)
            if (this.layers[t].visible) {
              var a = this._evs_layer[this.layers[t].name];
              this._t_render_view_data(a);
            }
      }
    }, e._render_v_bar = function(t, n, o, a, s, _, r, d, l) {
      var h = t.id;
      r.indexOf("<div class=") == -1 && (r = e.templates["event_header_" + t.layer] ? e.templates["event_header_" + t.layer](t.start_date, t.end_date, t) : r), d.indexOf("<div class=") == -1 && (d = e.templates["event_text_" + t.layer] ? e.templates["event_text_" + t.layer](t.start_date, t.end_date, t) : d);
      var v = document.createElement("div"), m = "dhx_cal_event", f = e.templates["event_class_" + t.layer] ? e.templates["event_class_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_class(t.start_date, t.end_date, t);
      f && (m = m + " " + f);
      var c = e._border_box_events(), u = a - 2, p = c ? u : a - 4, y = c ? u : a - 6, x = c ? u : a - 14, S = c ? u - 2 : a - 8, k = c ? s - this.xy.event_header_height : s - 30 + 1, D = '<div event_id="' + h + '" ' + e.config.event_attribute + '="' + h + '" class="' + m + '" style="position:absolute; top:' + o + "px; left:" + n + "px; width:" + p + "px; height:" + s + "px;" + (_ || "") + '">';
      return D += '<div class="dhx_header" style=" width:' + y + 'px;" >&nbsp;</div>', D += '<div class="dhx_title">' + r + "</div>", D += '<div class="dhx_body" style=" width:' + x + "px; height:" + k + 'px;">' + d + "</div>", D += '<div class="dhx_footer" style=" width:' + S + "px;" + (l ? " margin-top:-1px;" : "") + '" ></div></div>', v.innerHTML = D, v.style.zIndex = 100, v.firstChild;
    }, e.render_event_bar = function(t) {
      var n = this._els.dhx_cal_data[0], o = this._colsS[t._sday], a = this._colsS[t._eday];
      a == o && (a = this._colsS[t._eday + 1]);
      var s = this.xy.bar_height, _ = this._colsS.heights[t._sweek] + (this._colsS.height ? this.xy.month_scale_height + 2 : 2) + t._sorder * s, r = document.createElement("div"), d = t._timed ? "dhx_cal_event_clear" : "dhx_cal_event_line", l = e.templates["event_class_" + t.layer] ? e.templates["event_class_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_class(t.start_date, t.end_date, t);
      l && (d = d + " " + l);
      var h = '<div event_id="' + t.id + '" ' + this.config.event_attribute + '="' + t.id + '" class="' + d + '" style="position:absolute; top:' + _ + "px; left:" + o + "px; width:" + (a - o - 15) + "px;" + (t._text_style || "") + '">';
      t._timed && (h += e.templates["event_bar_date_" + t.layer] ? e.templates["event_bar_date_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_bar_date(t.start_date, t.end_date, t)), h += e.templates["event_bar_text_" + t.layer] ? e.templates["event_bar_text_" + t.layer](t.start_date, t.end_date, t) : e.templates.event_bar_text(t.start_date, t.end_date, t) + "</div>)", h += "</div>", r.innerHTML = h, this._rendered.push(r.firstChild), n.appendChild(r.firstChild);
    }, e.render_event = function(t) {
      var n = e.xy.menu_width;
      if (e.getLayer(t.layer).noMenu && (n = 0), !(t._sday < 0)) {
        var o = e.locate_holder(t._sday);
        if (o) {
          var a = 60 * t.start_date.getHours() + t.start_date.getMinutes(), s = 60 * t.end_date.getHours() + t.end_date.getMinutes() || 60 * e.config.last_hour, _ = Math.round((60 * a * 1e3 - 60 * this.config.first_hour * 60 * 1e3) * this.config.hour_size_px / 36e5) % (24 * this.config.hour_size_px) + 1, r = Math.max(e.xy.min_event_height, (s - a) * this.config.hour_size_px / 60) + 1, d = Math.floor((o.clientWidth - n) / t._count), l = t._sorder * d + 1;
          t._inner || (d *= t._count - t._sorder);
          var h = this._render_v_bar(t.id, n + l, _, d, r, t._text_style, e.templates.event_header(t.start_date, t.end_date, t), e.templates.event_text(t.start_date, t.end_date, t));
          if (this._rendered.push(h), o.appendChild(h), l = l + parseInt(o.style.left, 10) + n, _ += this._dy_shift, h.style.zIndex = this._layers_zindex[t.layer], this._edit_id == t.id) {
            h.style.zIndex = parseInt(h.style.zIndex) + 1;
            var v = h.style.zIndex;
            d = Math.max(d - 4, e.xy.editor_width), (h = document.createElement("div")).setAttribute("event_id", t.id), h.setAttribute(this.config.event_attribute, t.id), this.set_xy(h, d, r - 20, l, _ + 14), h.className = "dhx_cal_editor", h.style.zIndex = v;
            var m = document.createElement("div");
            this.set_xy(m, d - 6, r - 26), m.style.cssText += ";margin:2px 2px 2px 2px;overflow:hidden;", m.style.zIndex = v, h.appendChild(m), this._els.dhx_cal_data[0].appendChild(h), this._rendered.push(h), m.innerHTML = "<textarea class='dhx_cal_editor'>" + t.text + "</textarea>", this._editor = m.firstChild, this._editor.addEventListener("keypress", function(y) {
              if (y.shiftKey)
                return !0;
              var x = y.keyCode;
              x == e.keys.edit_save && e.editStop(!0), x == e.keys.edit_cancel && e.editStop(!1);
            }), this._editor.addEventListener("selectstart", function(y) {
              return y.cancelBubble = !0, !0;
            }), m.firstChild.focus(), this._els.dhx_cal_data[0].scrollLeft = 0, m.firstChild.select();
          }
          if (this._select_id == t.id) {
            h.style.zIndex = parseInt(h.style.zIndex) + 1;
            for (var f = this.config["icons_" + (this._edit_id == t.id ? "edit" : "select")], c = "", u = 0; u < f.length; u++)
              c += "<div class='dhx_menu_icon " + f[u] + "' title='" + this.locale.labels[f[u]] + "'></div>";
            var p = this._render_v_bar(t.id, l - n + 1, _, n, 20 * f.length + 26, "", "<div class='dhx_menu_head'></div>", c, !0);
            p.style.left = l - n + 1, p.style.zIndex = h.style.zIndex, this._els.dhx_cal_data[0].appendChild(p), this._rendered.push(p);
          }
        }
      }
    }, e.filter_agenda = function(t, n) {
      var o = e.getLayer(n.layer);
      return o && o.visible;
    };
  });
}, limit: function(e) {
  e.config.limit_start = null, e.config.limit_end = null, e.config.limit_view = !1, e.config.check_limits = !0, e._temp_limit_scope = function() {
    var i = null;
    e.attachEvent("onBeforeViewChange", function(t, n, o, a) {
      function s(_, r) {
        var d = e.config.limit_start, l = e.config.limit_end, h = e.date.add(_, 1, r);
        return _.valueOf() > l.valueOf() || h <= d.valueOf();
      }
      return !e.config.limit_view || !s(a = a || n, o = o || t) || n.valueOf() == a.valueOf() || (setTimeout(function() {
        if (e.$destroyed)
          return !0;
        var _ = s(n, o) ? e.config.limit_start : n;
        e.setCurrentView(s(_, o) ? null : _, o);
      }, 1), !1);
    }), e.attachEvent("onMouseDown", function(t) {
      return t != "dhx_time_block";
    }), e.attachEvent("onBeforeDrag", function(t) {
      return !t || e.checkLimitViolation(e.getEvent(t));
    }), e.attachEvent("onClick", function(t, n) {
      return e.checkLimitViolation(e.getEvent(t));
    }), e.attachEvent("onBeforeLightbox", function(t) {
      var n = e.getEvent(t);
      return i = [n.start_date, n.end_date], e.checkLimitViolation(n);
    }), e.attachEvent("onEventSave", function(t, n, o) {
      if (!n.start_date || !n.end_date) {
        var a = e.getEvent(t);
        n.start_date = new Date(a.start_date), n.end_date = new Date(a.end_date);
      }
      if (n.rec_type) {
        var s = e._lame_clone(n);
        return e._roll_back_dates(s), e.checkLimitViolation(s);
      }
      return e.checkLimitViolation(n);
    }), e.attachEvent("onEventAdded", function(t) {
      if (!t)
        return !0;
      var n = e.getEvent(t);
      return !e.checkLimitViolation(n) && e.config.limit_start && e.config.limit_end && (n.start_date < e.config.limit_start && (n.start_date = new Date(e.config.limit_start)), n.start_date.valueOf() >= e.config.limit_end.valueOf() && (n.start_date = this.date.add(e.config.limit_end, -1, "day")), n.end_date < e.config.limit_start && (n.end_date = new Date(e.config.limit_start)), n.end_date.valueOf() >= e.config.limit_end.valueOf() && (n.end_date = this.date.add(e.config.limit_end, -1, "day")), n.start_date.valueOf() >= n.end_date.valueOf() && (n.end_date = this.date.add(n.start_date, this.config.event_duration || this.config.time_step, "minute")), n._timed = this.isOneDayEvent(n)), !0;
    }), e.attachEvent("onEventChanged", function(t) {
      if (!t)
        return !0;
      var n = e.getEvent(t);
      if (!e.checkLimitViolation(n)) {
        if (!i)
          return !1;
        n.start_date = i[0], n.end_date = i[1], n._timed = this.isOneDayEvent(n);
      }
      return !0;
    }), e.attachEvent("onBeforeEventChanged", function(t, n, o) {
      return e.checkLimitViolation(t);
    }), e.attachEvent("onBeforeEventCreated", function(t) {
      var n = e.getActionData(t).date, o = { _timed: !0, start_date: n, end_date: e.date.add(n, e.config.time_step, "minute") };
      return e.checkLimitViolation(o);
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
  const n = { googleMap: new La(e), openStreetMaps: new $a(e), mapbox: new Ha(e) };
  function o(s) {
    i = s.ext.mapView.createAdapter(), t.push(e.attachEvent("onEventSave", function(_, r, d) {
      let l = e.getEvent(_);
      return l && l.event_location != r.event_location && (e._eventLocationChanged = !0), !0;
    }), e.attachEvent("onEventChanged", (_, r) => {
      const { start_date: d, end_date: l } = r, { min_date: h, max_date: v } = e.getState();
      return d.valueOf() < v.valueOf() && l.valueOf() > h.valueOf() && i && (e.config.map_settings.resolve_event_location && r.event_location && !e._latLngUpdate ? a(r, i) : i.updateEventMarker(r)), e._latLngUpdate = !1, !0;
    }), e.attachEvent("onEventIdChange", function(_, r) {
      let d = e.getEvent(r);
      i == null || i.removeEventMarker(_), i == null || i.addEventMarker(d);
    }), e.attachEvent("onEventAdded", (_, r) => {
      const { start_date: d, end_date: l } = r, { min_date: h, max_date: v } = e.getState();
      d.valueOf() < v.valueOf() && l.valueOf() > h.valueOf() && i && (e.config.map_settings.resolve_event_location && r.event_location && e._eventLocationChanged ? (a(r, i), e._eventLocationChanged = !1) : (i.addEventMarker(r), i.onEventClick(r)));
    }), e.attachEvent("onClick", function(_, r) {
      const d = e.getEvent(_);
      return i && d && i.onEventClick(d), !1;
    }), e.attachEvent("onBeforeEventDelete", (_, r) => (i && i.removeEventMarker(_), !0)));
  }
  async function a(s, _) {
    let r = await _.resolveAddress(s.event_location);
    return s.lat = r.lat, s.lng = r.lng, _.removeEventMarker(String(s.id)), _.addEventMarker(s), s;
  }
  e.ext || (e.ext = {}), e.ext.mapView = { createAdapter: function() {
    return n[e.config.map_view_provider];
  }, createMarker: function(s) {
    return new google.maps.Marker(s);
  }, currentAdapter: null, adapters: n }, e._latLngUpdate = !1, e._eventLocationChanged = !1, e.config.map_view_provider = "googleMap", e.config.map_settings = { initial_position: { lat: 48.724, lng: 8.215 }, error_position: { lat: 15, lng: 15 }, initial_zoom: 1, zoom_after_resolve: 15, info_window_max_width: 300, resolve_user_location: !0, resolve_event_location: !0, view_provider: "googleMap" }, e.config.map_initial_position && (e.config.map_settings.initial_position = { lat: e.config.map_initial_position.lat(), lng: e.config.map_initial_position.lng() }), e.config.map_error_position && (e.config.map_settings.error_position = { lat: e.config.map_error_position.lat(), lng: e.config.map_error_position.lng() }), e.xy.map_date_width = 188, e.xy.map_icon_width = 25, e.xy.map_description_width = 400, e.date.add_map = function(s, _, r) {
    return new Date(s.valueOf());
  }, e.templates.map_date = function(s, _, r) {
    return "";
  }, e.templates.map_time = function(s, _, r) {
    return e.config.rtl && !r._timed ? e.templates.day_date(_) + " &ndash; " + e.templates.day_date(s) : r._timed ? this.day_date(r.start_date, r.end_date, r) + " " + this.event_date(s) : e.templates.day_date(s) + " &ndash; " + e.templates.day_date(_);
  }, e.templates.map_text = function(s, _, r) {
    return r.text;
  }, e.templates.map_info_content = function(s) {
    return `<div><b>Event's text:</b> ${s.text}
				<div><b>Location:</b> ${s.event_location}</div>
				<div><b>Starts:</b> ${e.templates.tooltip_date_format(s.start_date)}</div>
				<div><b>Ends:</b> ${e.templates.tooltip_date_format(s.end_date)}</div>
			</div>`;
  }, e.date.map_start = function(s) {
    return s;
  }, e.dblclick_dhx_map_area = function(s) {
    let _ = s.target.closest(`[${e.config.event_attribute}]`);
    if (_) {
      let r = _.getAttribute(`${e.config.event_attribute}`);
      e.showLightbox(r);
    }
    this.config.readonly || !this.config.dblclick_create || _ || this.addEventNow({ start_date: e.config.map_start, end_date: e.date.add(e.config.map_start, e.config.time_step, "minute") });
  }, e.attachEvent("onSchedulerReady", function() {
    e.config.map_initial_zoom !== void 0 && (e.config.map_settings.initial_zoom = e.config.map_initial_zoom), e.config.map_zoom_after_resolve !== void 0 && (e.config.map_settings.zoom_after_resolve = e.config.map_zoom_after_resolve), e.config.map_infowindow_max_width !== void 0 && (e.config.map_settings.info_window_max_width = e.config.map_infowindow_max_width), e.config.map_resolve_user_location !== void 0 && (e.config.map_settings.resolve_user_location = e.config.map_resolve_user_location), e.config.map_view_provider !== void 0 && (e.config.map_settings.view_provider = e.config.map_view_provider), e.config.map_type !== void 0 && (e.config.map_settings.type = e.config.map_type), e.config.map_resolve_event_location !== void 0 && (e.config.map_settings.resolve_event_location = e.config.map_resolve_event_location), e.ext.mapView.currentAdapter = e.config.map_view_provider;
    let s = document.createElement("div");
    s.className = "mapContainer", s.id = "mapContainer", s.style.display = "none", s.style.zIndex = "1", e._obj.appendChild(s);
    const _ = e.render_data;
    function r() {
      let l = e.get_visible_events();
      l.sort(function(f, c) {
        return f.start_date.valueOf() == c.start_date.valueOf() ? f.id > c.id ? 1 : -1 : f.start_date > c.start_date ? 1 : -1;
      });
      let h = "<div " + e._waiAria.mapAttrString() + " class='dhx_map_area'>";
      for (let f = 0; f < l.length; f++) {
        let c = l[f], u = c.id == e._selected_event_id ? "dhx_map_line highlight" : "dhx_map_line", p = c.color ? "--dhx-scheduler-event-background:" + c.color + ";" : "", y = c.textColor ? "--dhx-scheduler-event-color:" + c.textColor + ";" : "", x = e._waiAria.mapRowAttrString(c), S = e._waiAria.mapDetailsBtnString();
        h += "<div " + x + " class='" + u + "' event_id='" + c.id + "' " + e.config.event_attribute + "='" + c.id + "' style='" + p + y + (c._text_style || "") + " width: " + (e.xy.map_date_width + e.xy.map_description_width + 2) + "px;'><div class='dhx_map_event_time' style='width: " + e.xy.map_date_width + "px;' >" + e.templates.map_time(c.start_date, c.end_date, c) + "</div>", h += `<div ${S} class='dhx_event_icon icon_details'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15.4444 16.4H4.55556V7.6H15.4444V16.4ZM13.1111 2V3.6H6.88889V2H5.33333V3.6H4.55556C3.69222 3.6 3 4.312 3 5.2V16.4C3 16.8243 3.16389 17.2313 3.45561 17.5314C3.74733 17.8314 4.143 18 4.55556 18H15.4444C15.857 18 16.2527 17.8314 16.5444 17.5314C16.8361 17.2313 17 16.8243 17 16.4V5.2C17 4.312 16.3 3.6 15.4444 3.6H14.6667V2H13.1111ZM13.8889 10.8H10V14.8H13.8889V10.8Z" fill="#A1A4A6"/>
			</svg></div>`, h += "<div class='line_description' style='width:" + (e.xy.map_description_width - e.xy.map_icon_width) + "px;'>" + e.templates.map_text(c.start_date, c.end_date, c) + "</div></div>";
      }
      h += "<div class='dhx_v_border' style=" + (e.config.rtl ? "'right: " : "'left: ") + (e.xy.map_date_width - 1) + "px;'></div><div class='dhx_v_border_description'></div></div>", e._els.dhx_cal_data[0].scrollTop = 0, e._els.dhx_cal_data[0].innerHTML = h;
      let v = e._els.dhx_cal_data[0].firstChild.childNodes, m = e._getNavDateElement();
      m && (m.innerHTML = e.templates[e._mode + "_date"](e._min_date, e._max_date, e._mode)), e._rendered = [];
      for (let f = 0; f < v.length - 2; f++)
        e._rendered[f] = v[f];
    }
    e.render_data = function(l, h) {
      if (this._mode != "map")
        return _.apply(this, arguments);
      {
        r();
        let v = e.get_visible_events();
        i && (i.clearEventMarkers(), v.forEach((m) => i == null ? void 0 : i.addEventMarker(m)));
      }
    }, e.map_view = function(l) {
      e._els.dhx_cal_data[0].style.width = e.xy.map_date_width + e.xy.map_description_width + 1 + "px", e._min_date = e.config.map_start || e._currentDate(), e._max_date = e.config.map_end || e.date.add(e._currentDate(), 1, "year"), e._table_view = !0, function(f) {
        if (f) {
          const c = e.locale.labels;
          e._els.dhx_cal_header[0].innerHTML = "<div class='dhx_map_head' style='width: " + (e.xy.map_date_width + e.xy.map_description_width + 2) + "px;' ><div class='headline_date' style='width: " + e.xy.map_date_width + "px;'>" + c.date + "</div><div class='headline_description' style='width: " + e.xy.map_description_width + "px;'>" + c.description + "</div></div>", e._table_view = !0, e.set_sizes();
        }
      }(l);
      let h = document.getElementById("mapContainer");
      var v, m;
      (function(f) {
        let c = document.getElementById(f);
        if (c) {
          const u = e.$container.querySelector(".dhx_cal_navline").offsetHeight;
          let p = e.$container.querySelector(".dhx_cal_data").offsetHeight + e.$container.querySelector(".dhx_cal_header").offsetHeight;
          p < 0 && (p = 0);
          let y = e._x - e.xy.map_date_width - e.xy.map_description_width - 1;
          y < 0 && (y = 0), c.style.height = p + "px", c.style.width = y + "px", c.style.position = "absolute", c.style.top = u + "px", e.config.rtl ? c.style.marginRight = e.xy.map_date_width + e.xy.map_description_width + 1 + "px" : c.style.marginLeft = e.xy.map_date_width + e.xy.map_description_width + 1 + "px", c.style.marginTop = e.xy.nav_height + 2 + "px";
        }
      })("mapContainer"), l && h ? (s.style.display = "block", r(), e.config.map_view_provider == e.ext.mapView.currentAdapter ? (i == null || i.destroy(h), o(e), i == null || i.initialize(h, e.config.map_settings)) : (i == null || i.destroy(h), o(e), i == null || i.initialize(h, e.config.map_settings), e.ext.mapView.currentAdapter = e.config.map_view_provider), i && (v = e.config.map_settings, m = i, v.resolve_user_location ? navigator.geolocation && navigator.geolocation.getCurrentPosition(function(f) {
        m.setView(f.coords.latitude, f.coords.longitude, v.zoom_after_resolve || v.initial_zoom);
      }) : m.setView(v.initial_position.lat, v.initial_position.lng, v.initial_zoom))) : (s.style.display = "none", e._els.dhx_cal_data[0].style.width = "100%", i && h && (i.destroy(h), i = null, e.ext.mapView.currentAdapter = e.config.map_view_provider), t.forEach((f) => e.detachEvent(f)), t = []);
    }, e.attachEvent("onLocationError", function(l) {
      return alert("Location can't be found"), google.maps.LatLng(51.47784, -1492e-6);
    });
    let d = async function(l) {
      if (i) {
        const h = await i.resolveAddress(l.event_location);
        h.lat && h.lng ? (l.lat = +h.lat, l.lng = +h.lng) : (e.callEvent("onLocationError", [l.id]), l.lng = e.config.map_settings.error_position.lng, l.lat = e.config.map_settings.error_position.lat), e._latLngUpdate = !0, e.callEvent("onEventChanged", [l.id, l]);
      }
    };
    e._event_resolve_delay = 1500, e.attachEvent("onEventLoading", function(l) {
      return l.lat && l.lng && (l.lat = +l.lat, l.lng = +l.lng), e.config.map_settings.resolve_event_location && l.event_location && !l.lat && !l.lng && (e._event_resolve_delay += 1500, function(h, v, m, f) {
        setTimeout(function() {
          if (e.$destroyed)
            return !0;
          let c = h.apply(v, m);
          return h = v = m = null, c;
        }, f || 1);
      }(d, this, [l], e._event_resolve_delay)), !0;
    });
  });
}, minical: function(e) {
  const i = e._createDomEventScope();
  e.config.minicalendar = { mark_events: !0 }, e._synced_minicalendars = [], e.renderCalendar = function(t, n, o) {
    var a = null, s = t.date || e._currentDate();
    if (typeof s == "string" && (s = this.templates.api_date(s)), n)
      a = this._render_calendar(n.parentNode, s, t, n), e.unmarkCalendar(a);
    else {
      var _ = t.container, r = t.position;
      if (typeof _ == "string" && (_ = document.getElementById(_)), typeof r == "string" && (r = document.getElementById(r)), r && r.left === void 0 && r.right === void 0) {
        var d = e.$domHelpers.getOffset(r);
        r = { top: d.top + r.offsetHeight, left: d.left };
      }
      _ || (_ = e._get_def_cont(r)), (a = this._render_calendar(_, s, t)).$_eventAttached || (a.$_eventAttached = !0, i.attach(a, "click", (function(y) {
        var x = y.target || y.srcElement, S = e.$domHelpers;
        if (S.closest(x, ".dhx_month_head") && !S.closest(x, ".dhx_after") && !S.closest(x, ".dhx_before")) {
          var k = S.closest(x, "[data-cell-date]").getAttribute("data-cell-date"), D = e.templates.parse_date(k);
          e.unmarkCalendar(this), e.markCalendar(this, D, "dhx_calendar_click"), this._last_date = D, this.conf.events && this.conf.events.onDateClick && this.conf.events.onDateClick.call(this, D, y), this.conf.handler && this.conf.handler.call(e, D, this);
        }
      }).bind(a)), i.attach(a, "mouseover", (function(y) {
        const x = y.target;
        if (x.classList.contains("dhx_cal_month_cell")) {
          var S = x.getAttribute("data-cell-date"), k = e.templates.parse_date(S);
          this.conf.events && this.conf.events.onDateMouseOver && this.conf.events.onDateMouseOver.call(this, k, y);
        }
      }).bind(a)));
    }
    if (e.config.minicalendar.mark_events)
      for (var l = e.date.month_start(s), h = e.date.add(l, 1, "month"), v = this.getEvents(l, h), m = this["filter_" + this._mode], f = {}, c = 0; c < v.length; c++) {
        var u = v[c];
        if (!m || m(u.id, u)) {
          var p = u.start_date;
          for (p.valueOf() < l.valueOf() && (p = l), p = e.date.date_part(new Date(p.valueOf())); p < u.end_date && (f[+p] || (f[+p] = !0, this.markCalendar(a, p, "dhx_year_event")), !((p = this.date.add(p, 1, "day")).valueOf() >= h.valueOf())); )
            ;
        }
      }
    return this._markCalendarCurrentDate(a), a.conf = t, t.sync && !o && this._synced_minicalendars.push(a), a.conf._on_xle_handler || (a.conf._on_xle_handler = e.attachEvent("onXLE", function() {
      e.updateCalendar(a, a.conf.date);
    })), this.config.wai_aria_attributes && this.config.wai_aria_application_role && a.setAttribute("role", "application"), a;
  }, e._get_def_cont = function(t) {
    return this._def_count || (this._def_count = document.createElement("div"), this._def_count.className = "dhx_minical_popup", e.event(this._def_count, "click", function(n) {
      n.cancelBubble = !0;
    }), document.body.appendChild(this._def_count)), t.left && (this._def_count.style.left = t.left + "px"), t.right && (this._def_count.style.right = t.right + "px"), t.top && (this._def_count.style.top = t.top + "px"), t.bottom && (this._def_count.style.bottom = t.bottom + "px"), this._def_count._created = /* @__PURE__ */ new Date(), this._def_count;
  }, e._locateCalendar = function(t, n) {
    if (typeof n == "string" && (n = e.templates.api_date(n)), +n > +t._max_date || +n < +t._min_date)
      return null;
    for (var o = t.querySelector(".dhx_year_body").childNodes[0], a = 0, s = new Date(t._min_date); +this.date.add(s, 1, "week") <= +n; )
      s = this.date.add(s, 1, "week"), a++;
    var _ = e.config.start_on_monday, r = (n.getDay() || (_ ? 7 : 0)) - (_ ? 1 : 0);
    const d = o.querySelector(`.dhx_cal_month_row:nth-child(${a + 1}) .dhx_cal_month_cell:nth-child(${r + 1})`);
    return d ? d.firstChild : null;
  }, e.markCalendar = function(t, n, o) {
    var a = this._locateCalendar(t, n);
    a && (a.className += " " + o);
  }, e.unmarkCalendar = function(t, n, o) {
    if (o = o || "dhx_calendar_click", n = n || t._last_date) {
      var a = this._locateCalendar(t, n);
      a && (a.className = (a.className || "").replace(RegExp(o, "g")));
    }
  }, e._week_template = function(t) {
    for (var n = t || 250, o = 0, a = document.createElement("div"), s = this.date.week_start(e._currentDate()), _ = 0; _ < 7; _++)
      this._cols[_] = Math.floor(n / (7 - _)), this._render_x_header(_, o, s, a), s = this.date.add(s, 1, "day"), n -= this._cols[_], o += this._cols[_];
    return a.lastChild.className += " dhx_scale_bar_last", a;
  }, e.updateCalendar = function(t, n) {
    if (t.conf.date && t.conf.events && t.conf.events.onBeforeMonthChange && t.conf.events.onBeforeMonthChange.call(t, t.conf.date, n, t) === !1)
      return;
    const o = t.conf.date;
    t.conf.date = n, this.renderCalendar(t.conf, t, !0), t.conf.events && t.conf.events.onMonthChange && t.conf.events.onMonthChange.call(t, o, n);
  }, e._mini_cal_arrows = ["&nbsp;", "&nbsp;"], e._render_calendar = function(t, n, o, a) {
    var s = e.templates, _ = this._cols;
    this._cols = [];
    var r = this._mode;
    this._mode = "calendar";
    var d = this._colsS;
    this._colsS = { height: 0 };
    var l = new Date(this._min_date), h = new Date(this._max_date), v = new Date(e._date), m = s.month_day, f = this._ignores_detected;
    this._ignores_detected = 0, s.month_day = s.calendar_date, n = this.date.month_start(n);
    var c, u = this._week_template(t.offsetWidth - 1 - this.config.minicalendar.padding);
    a ? c = a : ((c = document.createElement("div")).className = "dhx_cal_container dhx_mini_calendar", this.config.rtl && (c.className += " dhx_cal_container_rtl")), c.setAttribute("date", this._helpers.formatDate(n)), c.innerHTML = "<div class='dhx_year_month'></div><div class='dhx_year_grid" + (e.config.rtl ? " dhx_grid_rtl'>" : "'>") + "<div class='dhx_year_week'>" + (u ? u.innerHTML : "") + "</div><div class='dhx_year_body'></div></div>";
    var p = c.querySelector(".dhx_year_month"), y = c.querySelector(".dhx_year_week"), x = c.querySelector(".dhx_year_body");
    if (p.innerHTML = this.templates.calendar_month(n), o.navigation)
      for (var S = function(O, R) {
        var U = e.date.add(O._date, R, "month");
        e.updateCalendar(O, U), e._date.getMonth() == O._date.getMonth() && e._date.getFullYear() == O._date.getFullYear() && e._markCalendarCurrentDate(O);
      }, k = ["dhx_cal_prev_button", "dhx_cal_next_button"], D = ["left:1px;top:4px;position:absolute;", "left:auto; right:1px;top:4px;position:absolute;"], M = [-1, 1], g = function(O) {
        return function() {
          if (o.sync)
            for (var R = e._synced_minicalendars, U = 0; U < R.length; U++)
              S(R[U], O);
          else
            e.config.rtl && (O = -O), S(c, O);
        };
      }, b = [e.locale.labels.prev, e.locale.labels.next], w = 0; w < 2; w++) {
        var E = document.createElement("div");
        E.className = k[w], e._waiAria.headerButtonsAttributes(E, b[w]), E.style.cssText = D[w], E.innerHTML = this._mini_cal_arrows[w], p.appendChild(E), i.attach(E, "click", g(M[w]));
      }
    c._date = new Date(n), c.week_start = (n.getDay() - (this.config.start_on_monday ? 1 : 0) + 7) % 7;
    var N = c._min_date = this.date.week_start(n);
    c._max_date = this.date.add(c._min_date, 6, "week"), this._reset_month_scale(x, n, N, 6), a || t.appendChild(c), y.style.height = y.childNodes[0].offsetHeight - 1 + "px";
    var T = e.uid();
    e._waiAria.minicalHeader(p, T), e._waiAria.minicalGrid(c.querySelector(".dhx_year_grid"), T), e._waiAria.minicalRow(y);
    for (var A = y.querySelectorAll(".dhx_scale_bar"), C = 0; C < A.length; C++)
      e._waiAria.minicalHeadCell(A[C]);
    var $ = x.querySelectorAll(".dhx_cal_month_cell"), H = new Date(N);
    for (C = 0; C < $.length; C++)
      e._waiAria.minicalDayCell($[C], new Date(H)), H = e.date.add(H, 1, "day");
    return e._waiAria.minicalHeader(p, T), this._cols = _, this._mode = r, this._colsS = d, this._min_date = l, this._max_date = h, e._date = v, s.month_day = m, this._ignores_detected = f, c;
  }, e.destroyCalendar = function(t, n) {
    !t && this._def_count && this._def_count.firstChild && (n || (/* @__PURE__ */ new Date()).valueOf() - this._def_count._created.valueOf() > 500) && (t = this._def_count.firstChild), t && (i.detachAll(), t.innerHTML = "", t.parentNode && t.parentNode.removeChild(t), this._def_count && (this._def_count.style.top = "-1000px"), t.conf && t.conf._on_xle_handler && e.detachEvent(t.conf._on_xle_handler));
  }, e.isCalendarVisible = function() {
    return !!(this._def_count && parseInt(this._def_count.style.top, 10) > 0) && this._def_count;
  }, e.attachEvent("onTemplatesReady", function() {
    e.event(document.body, "click", function() {
      e.destroyCalendar();
    });
  }, { once: !0 }), e.form_blocks.calendar_time = { render: function(t) {
    var n = "<span class='dhx_minical_input_wrapper'><input class='dhx_readonly dhx_minical_input' type='text' readonly='true'></span>", o = e.config, a = this.date.date_part(e._currentDate()), s = 1440, _ = 0;
    o.limit_time_select && (_ = 60 * o.first_hour, s = 60 * o.last_hour + 1), a.setHours(_ / 60), t._time_values = [], n += " <select class='dhx_lightbox_time_select'>";
    for (var r = _; r < s; r += 1 * this.config.time_step)
      n += "<option value='" + r + "'>" + this.templates.time_picker(a) + "</option>", t._time_values.push(r), a = this.date.add(a, this.config.time_step, "minute");
    return "<div class='dhx_section_time dhx_lightbox_minical'>" + (n += "</select>") + "<span class='dhx_lightbox_minical_spacer'> &nbsp;&ndash;&nbsp; </span>" + n + "</div>";
  }, set_value: function(t, n, o, a) {
    var s, _, r = t.getElementsByTagName("input"), d = t.getElementsByTagName("select"), l = function(p, y, x) {
      e.event(p, "click", function() {
        e.destroyCalendar(null, !0), e.renderCalendar({ position: p, date: new Date(this._date), navigation: !0, handler: function(S) {
          p.value = e.templates.calendar_time(S), p._date = new Date(S), e.destroyCalendar(), e.config.event_duration && e.config.auto_end_date && x === 0 && f();
        } });
      });
    };
    if (e.config.full_day) {
      if (!t._full_day) {
        var h = "<label class='dhx_fullday'><input type='checkbox' name='full_day' value='true'> " + e.locale.labels.full_day + "&nbsp;</label></input>";
        e.config.wide_form || (h = t.previousSibling.innerHTML + h), t.previousSibling.innerHTML = h, t._full_day = !0;
      }
      var v = t.previousSibling.getElementsByTagName("input")[0], m = e.date.time_part(o.start_date) === 0 && e.date.time_part(o.end_date) === 0;
      v.checked = m, d[0].disabled = v.checked, d[1].disabled = v.checked, v.$_eventAttached || (v.$_eventAttached = !0, e.event(v, "click", function() {
        if (v.checked === !0) {
          var p = {};
          e.form_blocks.calendar_time.get_value(t, p), s = e.date.date_part(p.start_date), (+(_ = e.date.date_part(p.end_date)) == +s || +_ >= +s && (o.end_date.getHours() !== 0 || o.end_date.getMinutes() !== 0)) && (_ = e.date.add(_, 1, "day"));
        } else
          s = null, _ = null;
        var y = s || o.start_date, x = _ || o.end_date;
        c(r[0], y), c(r[1], x), d[0].value = 60 * y.getHours() + y.getMinutes(), d[1].value = 60 * x.getHours() + x.getMinutes(), d[0].disabled = v.checked, d[1].disabled = v.checked;
      }));
    }
    if (e.config.event_duration && e.config.auto_end_date) {
      var f = function() {
        e.config.auto_end_date && e.config.event_duration && (s = e.date.add(r[0]._date, d[0].value, "minute"), _ = new Date(s.getTime() + 60 * e.config.event_duration * 1e3), r[1].value = e.templates.calendar_time(_), r[1]._date = e.date.date_part(new Date(_)), d[1].value = 60 * _.getHours() + _.getMinutes());
      };
      d[0].$_eventAttached || d[0].addEventListener("change", f);
    }
    function c(p, y, x) {
      l(p, y, x), p.value = e.templates.calendar_time(y), p._date = e.date.date_part(new Date(y));
    }
    function u(p) {
      for (var y = a._time_values, x = 60 * p.getHours() + p.getMinutes(), S = x, k = !1, D = 0; D < y.length; D++) {
        var M = y[D];
        if (M === x) {
          k = !0;
          break;
        }
        M < x && (S = M);
      }
      return k || S ? k ? x : S : -1;
    }
    c(r[0], o.start_date, 0), c(r[1], o.end_date, 1), l = function() {
    }, d[0].value = u(o.start_date), d[1].value = u(o.end_date);
  }, get_value: function(t, n) {
    var o = t.getElementsByTagName("input"), a = t.getElementsByTagName("select");
    return n.start_date = e.date.add(o[0]._date, a[0].value, "minute"), n.end_date = e.date.add(o[1]._date, a[1].value, "minute"), n.end_date <= n.start_date && (n.end_date = e.date.add(n.start_date, e.config.time_step, "minute")), { start_date: new Date(n.start_date), end_date: new Date(n.end_date) };
  }, focus: function(t) {
  } }, e.linkCalendar = function(t, n) {
    var o = function() {
      var a = e._date, s = new Date(a.valueOf());
      return n && (s = n(s)), s.setDate(1), e.updateCalendar(t, s), !0;
    };
    e.attachEvent("onViewChange", o), e.attachEvent("onXLE", o), e.attachEvent("onEventAdded", o), e.attachEvent("onEventChanged", o), e.attachEvent("onEventDeleted", o), o();
  }, e._markCalendarCurrentDate = function(t) {
    var n = e.getState(), o = n.min_date, a = n.max_date, s = n.mode, _ = e.date.month_start(new Date(t._date)), r = e.date.add(_, 1, "month");
    if (!({ month: !0, year: !0, agenda: !0, grid: !0 }[s] || o.valueOf() <= _.valueOf() && a.valueOf() >= r.valueOf()))
      for (var d = o; d.valueOf() < a.valueOf(); )
        _.valueOf() <= d.valueOf() && r > d && e.markCalendar(t, d, "dhx_calendar_click"), d = e.date.add(d, 1, "day");
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
      var n = this._els.dhx_cal_data[0];
      n.firstChild._h_fix = !0, i.apply(e, arguments);
      var o = parseInt(n.style.height);
      n.style.height = "1px", n.style.height = n.scrollHeight + "px", this._obj.style.height = this._obj.clientHeight + n.scrollHeight - o + "px";
    };
    var t = e._reset_month_scale;
    e._reset_month_scale = function(n, o, a, s) {
      var _ = { clientHeight: 100 };
      t.apply(e, [_, o, a, s]), n.innerHTML = _.innerHTML;
    };
  });
}, multisection: function(e) {
  he("Multisection", e.assert);
}, multiselect: function(e) {
  e.form_blocks.multiselect = { render: function(i) {
    var t = "dhx_multi_select_control dhx_multi_select_" + i.name;
    i.vertical && (t += " dhx_multi_select_control_vertical");
    for (var n = "<div class='" + t + "' style='overflow: auto; height: " + i.height + "px; position: relative;' >", o = 0; o < i.options.length; o++)
      n += "<label><input type='checkbox' value='" + i.options[o].key + "'/>" + i.options[o].label + "</label>";
    return n += "</div>";
  }, set_value: function(i, t, n, o) {
    for (var a = i.getElementsByTagName("input"), s = 0; s < a.length; s++)
      a[s].checked = !1;
    function _(v) {
      for (var m = i.getElementsByTagName("input"), f = 0; f < m.length; f++)
        m[f].checked = !!v[m[f].value];
    }
    var r = {};
    if (n[o.map_to]) {
      var d = (n[o.map_to] + "").split(o.delimiter || e.config.section_delimiter || ",");
      for (s = 0; s < d.length; s++)
        r[d[s]] = !0;
      _(r);
    } else {
      if (e._new_event || !o.script_url)
        return;
      var l = document.createElement("div");
      l.className = "dhx_loading", l.style.cssText = "position: absolute; top: 40%; left: 40%;", i.appendChild(l);
      var h = [o.script_url, o.script_url.indexOf("?") == -1 ? "?" : "&", "dhx_crosslink_" + o.map_to + "=" + n.id + "&uid=" + e.uid()].join("");
      e.ajax.get(h, function(v) {
        var m = function(f) {
          try {
            for (var c = JSON.parse(f.xmlDoc.responseText), u = {}, p = 0; p < c.length; p++) {
              var y = c[p];
              u[y.value || y.key || y.id] = !0;
            }
            return u;
          } catch {
            return null;
          }
        }(v);
        m || (m = function(f, c) {
          for (var u = e.ajax.xpath("//data/item", f.xmlDoc), p = {}, y = 0; y < u.length; y++)
            p[u[y].getAttribute(c.map_to)] = !0;
          return p;
        }(v, o)), _(m), i.removeChild(l);
      });
    }
  }, get_value: function(i, t, n) {
    for (var o = [], a = i.getElementsByTagName("input"), s = 0; s < a.length; s++)
      a[s].checked && o.push(a[s].value);
    return o.join(n.delimiter || e.config.section_delimiter || ",");
  }, focus: function(i) {
  } };
}, multisource: function(e) {
  var i = e._load;
  e._load = function(t, n) {
    if (typeof (t = t || this._load_url) == "object")
      for (var o = function(s) {
        var _ = function() {
        };
        return _.prototype = s, _;
      }(this._loaded), a = 0; a < t.length; a++)
        this._loaded = new o(), i.call(this, t[a], n);
    else
      i.apply(this, arguments);
  };
}, mvc: function(e) {
  var i, t = { use_id: !1 };
  function n(s) {
    var _ = {};
    for (var r in s)
      r.indexOf("_") !== 0 && (_[r] = s[r]);
    return t.use_id || delete _.id, _;
  }
  function o(s) {
    s._not_render = !1, s._render_wait && s.render_view_data(), s._loading = !1, s.callEvent("onXLE", []);
  }
  function a(s) {
    return t.use_id ? s.id : s.cid;
  }
  e.backbone = function(s, _) {
    _ && (t = _), s.bind("change", function(l, h) {
      var v = a(l), m = e._events[v] = l.toJSON();
      m.id = v, e._init_event(m), clearTimeout(i), i = setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.updateView();
      }, 1);
    }), s.bind("remove", function(l, h) {
      var v = a(l);
      e._events[v] && e.deleteEvent(v);
    });
    var r = [];
    function d() {
      if (e.$destroyed)
        return !0;
      r.length && (e.parse(r, "json"), r = []);
    }
    s.bind("add", function(l, h) {
      var v = a(l);
      if (!e._events[v]) {
        var m = l.toJSON();
        m.id = v, e._init_event(m), r.push(m), r.length == 1 && setTimeout(d, 1);
      }
    }), s.bind("request", function(l) {
      var h;
      l instanceof Backbone.Collection && ((h = e)._loading = !0, h._not_render = !0, h.callEvent("onXLS", []));
    }), s.bind("sync", function(l) {
      l instanceof Backbone.Collection && o(e);
    }), s.bind("error", function(l) {
      l instanceof Backbone.Collection && o(e);
    }), e.attachEvent("onEventCreated", function(l) {
      var h = new s.model(e.getEvent(l));
      return e._events[l] = h.toJSON(), e._events[l].id = l, !0;
    }), e.attachEvent("onEventAdded", function(l) {
      if (!s.get(l)) {
        var h = n(e.getEvent(l)), v = new s.model(h), m = a(v);
        m != l && this.changeEventId(l, m), s.add(v), s.trigger("scheduler:add", v);
      }
      return !0;
    }), e.attachEvent("onEventChanged", function(l) {
      var h = s.get(l), v = n(e.getEvent(l));
      return h.set(v), s.trigger("scheduler:change", h), !0;
    }), e.attachEvent("onEventDeleted", function(l) {
      var h = s.get(l);
      return h && (s.trigger("scheduler:remove", h), s.remove(l)), !0;
    });
  };
}, outerdrag: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    var i, t = new dhtmlDragAndDropObject(), n = t.stopDrag;
    function o(a, s, _, r) {
      if (!e.checkEvent("onBeforeExternalDragIn") || e.callEvent("onBeforeExternalDragIn", [a, s, _, r, i])) {
        var d = e.attachEvent("onEventCreated", function(f) {
          e.callEvent("onExternalDragIn", [f, a, i]) || (this._drag_mode = this._drag_id = null, this.deleteEvent(f));
        }), l = e.getActionData(i), h = { start_date: new Date(l.date) };
        if (e.matrix && e.matrix[e._mode]) {
          var v = e.matrix[e._mode];
          h[v.y_property] = l.section;
          var m = e._locate_cell_timeline(i);
          h.start_date = v._trace_x[m.x], h.end_date = e.date.add(h.start_date, v.x_step, v.x_unit);
        }
        e._props && e._props[e._mode] && (h[e._props[e._mode].map_to] = l.section), e.addEventNow(h), e.detachEvent(d);
      }
    }
    t.stopDrag = function(a) {
      return i = a, n.apply(this, arguments);
    }, t.addDragLanding(e._els.dhx_cal_data[0], { _drag: function(a, s, _, r) {
      o(a, s, _, r);
    }, _dragIn: function(a, s) {
      return a;
    }, _dragOut: function(a) {
      return this;
    } }), dhtmlx.DragControl && dhtmlx.DragControl.addDrop(e._els.dhx_cal_data[0], { onDrop: function(a, s, _, r) {
      var d = dhtmlx.DragControl.getMaster(a);
      i = r, o(a, d, s, r.target || r.srcElement);
    }, onDragIn: function(a, s, _) {
      return s;
    } }, !0);
  });
}, pdf: function(e) {
  var i, t, n = new RegExp("<[^>]*>", "g"), o = new RegExp("<br[^>]*>", "g");
  function a(k) {
    return k.replace(o, `
`).replace(n, "");
  }
  function s(k, D) {
    k = parseFloat(k), D = parseFloat(D), isNaN(D) || (k -= D);
    var M = r(k);
    return k = k - M.width + M.cols * i, isNaN(k) ? "auto" : 100 * k / i;
  }
  function _(k, D, M) {
    k = parseFloat(k), D = parseFloat(D), !isNaN(D) && M && (k -= D);
    var g = r(k);
    return k = k - g.width + g.cols * i, isNaN(k) ? "auto" : 100 * k / (i - (isNaN(D) ? 0 : D));
  }
  function r(k) {
    for (var D = 0, M = e._els.dhx_cal_header[0].childNodes, g = M[1] ? M[1].childNodes : M[0].childNodes, b = 0; b < g.length; b++) {
      var w = g[b].style ? g[b] : g[b].parentNode, E = parseFloat(w.style.width);
      if (!(k > E))
        break;
      k -= E + 1, D += E + 1;
    }
    return { width: D, cols: b };
  }
  function d(k) {
    return k = parseFloat(k), isNaN(k) ? "auto" : 100 * k / t;
  }
  function l(k, D) {
    return (window.getComputedStyle ? window.getComputedStyle(k, null)[D] : k.currentStyle ? k.currentStyle[D] : null) || "";
  }
  function h(k, D) {
    for (var M = parseInt(k.style.left, 10), g = 0; g < e._cols.length; g++)
      if ((M -= e._cols[g]) < 0)
        return g;
    return D;
  }
  function v(k, D) {
    for (var M = parseInt(k.style.top, 10), g = 0; g < e._colsS.heights.length; g++)
      if (e._colsS.heights[g] > M)
        return g;
    return D;
  }
  function m(k) {
    return k ? "</" + k + ">" : "";
  }
  function f(k, D, M, g) {
    var b = "<" + k + " profile='" + D + "'";
    return M && (b += " header='" + M + "'"), g && (b += " footer='" + g + "'"), b += ">";
  }
  function c() {
    var k = "", D = e._mode;
    if (e.matrix && e.matrix[e._mode] && (D = e.matrix[e._mode].render == "cell" ? "matrix" : "timeline"), k += "<scale mode='" + D + "' today='" + e._els.dhx_cal_date[0].innerHTML + "'>", e._mode == "week_agenda")
      for (var M = e._els.dhx_cal_data[0].getElementsByTagName("DIV"), g = 0; g < M.length; g++)
        M[g].className == "dhx_wa_scale_bar" && (k += "<column>" + a(M[g].innerHTML) + "</column>");
    else if (e._mode == "agenda" || e._mode == "map")
      k += "<column>" + a((M = e._els.dhx_cal_header[0].childNodes[0].childNodes)[0].innerHTML) + "</column><column>" + a(M[1].innerHTML) + "</column>";
    else if (e._mode == "year")
      for (M = e._els.dhx_cal_data[0].childNodes, g = 0; g < M.length; g++)
        k += "<month label='" + a(M[g].querySelector(".dhx_year_month").innerHTML) + "'>", k += p(M[g].querySelector(".dhx_year_week").childNodes), k += u(M[g].querySelector(".dhx_year_body")), k += "</month>";
    else {
      k += "<x>", k += p(M = e._els.dhx_cal_header[0].childNodes), k += "</x>";
      var b = e._els.dhx_cal_data[0];
      if (e.matrix && e.matrix[e._mode]) {
        for (k += "<y>", g = 0; g < b.firstChild.rows.length; g++)
          k += "<row><![CDATA[" + a(b.firstChild.rows[g].cells[0].innerHTML) + "]]></row>";
        k += "</y>", t = b.firstChild.rows[0].cells[0].offsetHeight;
      } else if (b.firstChild.tagName == "TABLE")
        k += u(b);
      else {
        for (b = b.childNodes[b.childNodes.length - 1]; b.className.indexOf("dhx_scale_holder") == -1; )
          b = b.previousSibling;
        for (b = b.childNodes, k += "<y>", g = 0; g < b.length; g++)
          k += `
<row><![CDATA[` + a(b[g].innerHTML) + "]]></row>";
        k += "</y>", t = b[0].offsetHeight;
      }
    }
    return k += "</scale>";
  }
  function u(k) {
    for (var D = "", M = k.querySelectorAll("tr"), g = 0; g < M.length; g++) {
      for (var b = [], w = M[g].querySelectorAll("td"), E = 0; E < w.length; E++)
        b.push(w[E].querySelector(".dhx_month_head").innerHTML);
      D += `
<row height='` + w[0].offsetHeight + "'><![CDATA[" + a(b.join("|")) + "]]></row>", t = w[0].offsetHeight;
    }
    return D;
  }
  function p(k) {
    var D, M = "";
    e.matrix && e.matrix[e._mode] && (e.matrix[e._mode].second_scale && (D = k[1].childNodes), k = k[0].childNodes);
    for (var g = 0; g < k.length; g++)
      M += `
<column><![CDATA[` + a(k[g].innerHTML) + "]]></column>";
    if (i = k[0].offsetWidth, D) {
      var b = 0, w = k[0].offsetWidth, E = 1;
      for (g = 0; g < D.length; g++)
        M += `
<column second_scale='` + E + "'><![CDATA[" + a(D[g].innerHTML) + "]]></column>", (b += D[g].offsetWidth) >= w && (w += k[E] ? k[E].offsetWidth : 0, E++), i = D[0].offsetWidth;
    }
    return M;
  }
  function y(k) {
    var D = "", M = e._rendered, g = e.matrix && e.matrix[e._mode];
    if (e._mode == "agenda" || e._mode == "map")
      for (var b = 0; b < M.length; b++)
        D += "<event><head><![CDATA[" + a(M[b].childNodes[0].innerHTML) + "]]></head><body><![CDATA[" + a(M[b].childNodes[2].innerHTML) + "]]></body></event>";
    else if (e._mode == "week_agenda")
      for (b = 0; b < M.length; b++)
        D += "<event day='" + M[b].parentNode.getAttribute("day") + "'><body>" + a(M[b].innerHTML) + "</body></event>";
    else if (e._mode == "year")
      for (M = e.get_visible_events(), b = 0; b < M.length; b++) {
        var w = M[b].start_date;
        for (w.valueOf() < e._min_date.valueOf() && (w = e._min_date); w < M[b].end_date; ) {
          var E = w.getMonth() + 12 * (w.getFullYear() - e._min_date.getFullYear()) - e.week_starts._month, N = e.week_starts[E] + w.getDate() - 1, T = k ? l(e._get_year_cell(w), "color") : "", A = k ? l(e._get_year_cell(w), "backgroundColor") : "";
          if (D += "<event day='" + N % 7 + "' week='" + Math.floor(N / 7) + "' month='" + E + "' backgroundColor='" + A + "' color='" + T + "'></event>", (w = e.date.add(w, 1, "day")).valueOf() >= e._max_date.valueOf())
            break;
        }
      }
    else if (g && g.render == "cell")
      for (M = e._els.dhx_cal_data[0].getElementsByTagName("TD"), b = 0; b < M.length; b++)
        T = k ? l(M[b], "color") : "", D += `
<event><body backgroundColor='` + (A = k ? l(M[b], "backgroundColor") : "") + "' color='" + T + "'><![CDATA[" + a(M[b].innerHTML) + "]]></body></event>";
    else
      for (b = 0; b < M.length; b++) {
        var C, $;
        if (e.matrix && e.matrix[e._mode])
          C = s(M[b].style.left), $ = s(M[b].offsetWidth) - 1;
        else {
          var H = e.config.use_select_menu_space ? 0 : 26;
          C = _(M[b].style.left, H, !0), $ = _(M[b].style.width, H) - 1;
        }
        if (!isNaN(1 * $)) {
          var O = d(M[b].style.top), R = d(M[b].style.height), U = M[b].className.split(" ")[0].replace("dhx_cal_", "");
          if (U !== "dhx_tooltip_line") {
            var I = e.getEvent(M[b].getAttribute(e.config.event_attribute));
            if (I) {
              N = I._sday;
              var j = I._sweek, Y = I._length || 0;
              if (e._mode == "month")
                R = parseInt(M[b].offsetHeight, 10), O = parseInt(M[b].style.top, 10) - e.xy.month_head_height, N = h(M[b], N), j = v(M[b], j);
              else if (e.matrix && e.matrix[e._mode]) {
                N = 0, j = M[b].parentNode.parentNode.parentNode.rowIndex;
                var P = t;
                t = M[b].parentNode.offsetHeight, O = d(M[b].style.top), O -= 0.2 * O, t = P;
              } else {
                if (M[b].parentNode == e._els.dhx_cal_data[0])
                  continue;
                var K = e._els.dhx_cal_data[0].childNodes[0], Q = parseFloat(K.className.indexOf("dhx_scale_holder") != -1 ? K.style.left : 0);
                C += s(M[b].parentNode.style.left, Q);
              }
              D += `
<event week='` + j + "' day='" + N + "' type='" + U + "' x='" + C + "' y='" + O + "' width='" + $ + "' height='" + R + "' len='" + Y + "'>", U == "event" ? (D += "<header><![CDATA[" + a(M[b].childNodes[1].innerHTML) + "]]></header>", T = k ? l(M[b].childNodes[2], "color") : "", D += "<body backgroundColor='" + (A = k ? l(M[b].childNodes[2], "backgroundColor") : "") + "' color='" + T + "'><![CDATA[" + a(M[b].childNodes[2].innerHTML) + "]]></body>") : (T = k ? l(M[b], "color") : "", D += "<body backgroundColor='" + (A = k ? l(M[b], "backgroundColor") : "") + "' color='" + T + "'><![CDATA[" + a(M[b].innerHTML) + "]]></body>"), D += "</event>";
            }
          }
        }
      }
    return D;
  }
  function x(k, D, M, g, b, w) {
    var E = !1;
    g == "fullcolor" && (E = !0, g = "color"), g = g || "color";
    var N, T = "";
    if (k) {
      var A = e._date, C = e._mode;
      D = e.date[M + "_start"](D), D = e.date["get_" + M + "_end"] ? e.date["get_" + M + "_end"](D) : e.date.add(D, 1, M), T = f("pages", g, b, w);
      for (var $ = new Date(k); +$ < +D; $ = this.date.add($, 1, M))
        this.setCurrentView($, M), T += ((N = "page") ? "<" + N + ">" : "") + c().replace("–", "-") + y(E) + m("page");
      T += m("pages"), this.setCurrentView(A, C);
    } else
      T = f("data", g, b, w) + c().replace("–", "-") + y(E) + m("data");
    return T;
  }
  function S(k, D, M, g, b, w, E) {
    (function(N, T) {
      var A = e.uid(), C = document.createElement("div");
      C.style.display = "none", document.body.appendChild(C), C.innerHTML = '<form id="' + A + '" method="post" target="_blank" action="' + T + '" accept-charset="utf-8" enctype="application/x-www-form-urlencoded"><input type="hidden" name="mycoolxmlbody"/> </form>', document.getElementById(A).firstChild.value = encodeURIComponent(N), document.getElementById(A).submit(), C.parentNode.removeChild(C);
    })(typeof b == "object" ? function(N) {
      for (var T = "<data>", A = 0; A < N.length; A++)
        T += N[A].source.getPDFData(N[A].start, N[A].end, N[A].view, N[A].mode, N[A].header, N[A].footer);
      return T += "</data>", T;
    }(b) : x.apply(this, [k, D, M, b, w, E]), g);
  }
  e.getPDFData = x, e.toPDF = function(k, D, M, g) {
    return S.apply(this, [null, null, null, k, D, M, g]);
  }, e.toPDFRange = function(k, D, M, g, b, w, E) {
    return typeof k == "string" && (k = e.templates.api_date(k), D = e.templates.api_date(D)), S.apply(this, arguments);
  };
}, quick_info: function(e) {
  e.config.icons_select = ["icon_form", "icon_delete"], e.config.details_on_create = !0, e.config.show_quick_info = !0, e.xy.menu_width = 0;
  let i = null;
  function t(o) {
    const a = o.getBoundingClientRect(), s = e.$container.getBoundingClientRect().bottom - a.bottom;
    s < 0 && (o.style.top = `${parseFloat(o.style.top) + s}px`);
  }
  function n(o) {
    let a = 0, s = 0, _ = o;
    for (; _ && _ != e._obj; )
      a += _.offsetLeft, s += _.offsetTop - _.scrollTop, _ = _.offsetParent;
    return _ ? { left: a, top: s, dx: a + o.offsetWidth / 2 > e._x / 2 ? 1 : 0, dy: s + o.offsetHeight / 2 > e._y / 2 ? 1 : 0, width: o.offsetWidth, height: o.offsetHeight } : 0;
  }
  e.attachEvent("onSchedulerReady", function() {
    const o = e.$container;
    o._$quickInfoHandler || (o._$quickInfoHandler = !0, e.event(o, "mousedown", function(a) {
      const s = a.target.closest(`[${e.config.event_attribute}]`);
      s && (i = { id: s.getAttribute(e.config.event_attribute), position: n(s) });
    }), e.attachEvent("onDestroy", () => {
      delete o._$quickInfoHandler;
    }));
  }), e.attachEvent("onClick", function(o) {
    if (e.config.show_quick_info)
      return e.showQuickInfo(o), !0;
  }), function() {
    for (var o = ["onEmptyClick", "onViewChange", "onLightbox", "onBeforeEventDelete", "onBeforeDrag"], a = function() {
      return e.hideQuickInfo(!0), !0;
    }, s = 0; s < o.length; s++)
      e.attachEvent(o[s], a);
  }(), e.templates.quick_info_title = function(o, a, s) {
    return s.text.substr(0, 50);
  }, e.templates.quick_info_content = function(o, a, s) {
    return s.details || "";
  }, e.templates.quick_info_date = function(o, a, s) {
    return e.isOneDayEvent(s) && e.config.rtl ? e.templates.day_date(o, a, s) + " " + e.templates.event_header(a, o, s) : e.isOneDayEvent(s) ? e.templates.day_date(o, a, s) + " " + e.templates.event_header(o, a, s) : e.config.rtl ? e.templates.week_date(a, o, s) : e.templates.week_date(o, a, s);
  }, e.showQuickInfo = function(o) {
    if (o == this._quick_info_box_id || (this.hideQuickInfo(!0), this.callEvent("onBeforeQuickInfo", [o]) === !1))
      return;
    let a;
    a = i && i.id == o ? i.position : this._get_event_counter_part(o), a && (this._quick_info_box = this._init_quick_info(a), this._fill_quick_data(o), this._show_quick_info(a), this.callEvent("onQuickInfo", [o]));
  }, function() {
    function o(a) {
      a = a || "";
      var s, _ = parseFloat(a), r = a.match(/m?s/);
      switch (r && (r = r[0]), r) {
        case "s":
          s = 1e3 * _;
          break;
        case "ms":
          s = _;
          break;
        default:
          s = 0;
      }
      return s;
    }
    e.hideQuickInfo = function(a) {
      var s = this._quick_info_box, _ = this._quick_info_box_id;
      if (this._quick_info_box_id = 0, s && s.parentNode) {
        var r = s.offsetWidth;
        if (e.config.quick_info_detached)
          return this.callEvent("onAfterQuickInfo", [_]), s.parentNode.removeChild(s);
        if (s.style.right == "auto" ? s.style.left = -r + "px" : s.style.right = -r + "px", a)
          s.parentNode.removeChild(s);
        else {
          var d;
          window.getComputedStyle ? d = window.getComputedStyle(s, null) : s.currentStyle && (d = s.currentStyle);
          var l = o(d["transition-delay"]) + o(d["transition-duration"]);
          setTimeout(function() {
            s.parentNode && s.parentNode.removeChild(s);
          }, l);
        }
        this.callEvent("onAfterQuickInfo", [_]);
      }
    };
  }(), e.event(window, "keydown", function(o) {
    o.keyCode == 27 && e.hideQuickInfo();
  }), e._show_quick_info = function(o) {
    var a = e._quick_info_box;
    e._obj.appendChild(a);
    var s = a.offsetWidth, _ = a.offsetHeight;
    if (e.config.quick_info_detached) {
      var r = o.left - o.dx * (s - o.width);
      e.getView() && e.getView()._x_scroll && (e.config.rtl ? r += e.getView()._x_scroll : r -= e.getView()._x_scroll), r + s > window.innerWidth && (r = window.innerWidth - s), r = Math.max(0, r), a.style.left = r + "px", a.style.top = o.top - (o.dy ? _ : -o.height) + "px";
    } else {
      const d = e.$container.querySelector(".dhx_cal_data").offsetTop;
      a.style.top = d + 20 + "px", o.dx == 1 ? (a.style.right = "auto", a.style.left = -s + "px", setTimeout(function() {
        a.style.left = "-10px";
      }, 1)) : (a.style.left = "auto", a.style.right = -s + "px", setTimeout(function() {
        a.style.right = "-10px";
      }, 1)), a.className = a.className.replace(" dhx_qi_left", "").replace(" dhx_qi_right", "") + " dhx_qi_" + (o.dx == 1 ? "left" : "right");
    }
    a.ontransitionend = () => {
      t(a), a.ontransitionend = null;
    }, setTimeout(() => {
      t(a);
    }, 1);
  }, e.attachEvent("onTemplatesReady", function() {
    if (e.hideQuickInfo(), this._quick_info_box) {
      var o = this._quick_info_box;
      o.parentNode && o.parentNode.removeChild(o), this._quick_info_box = null;
    }
  }), e._quick_info_onscroll_handler = function(o) {
    e.hideQuickInfo();
  }, e._init_quick_info = function() {
    if (!this._quick_info_box) {
      var o = this._quick_info_box = document.createElement("div");
      this._waiAria.quickInfoAttr(o), o.className = "dhx_cal_quick_info", e.$testmode && (o.className += " dhx_no_animate"), e.config.rtl && (o.className += " dhx_quick_info_rtl");
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
      for (var s = e.config.icons_select, _ = 0; _ < s.length; _++)
        a += `<div ${this._waiAria.quickInfoButtonAttrString(this.locale.labels[s[_]])} class="dhx_qi_big_icon ${s[_]}" title="${e.locale.labels[s[_]]}">
				<div class='dhx_menu_icon ${s[_]}'></div><div>${e.locale.labels[s[_]]}</div></div>`;
      a += "</div>", o.innerHTML = a, e.event(o, "click", function(r) {
        e._qi_button_click(r.target || r.srcElement);
      }), e.config.quick_info_detached && (e._detachDomEvent(e._els.dhx_cal_data[0], "scroll", e._quick_info_onscroll_handler), e.event(e._els.dhx_cal_data[0], "scroll", e._quick_info_onscroll_handler));
    }
    return this._quick_info_box;
  }, e._qi_button_click = function(o) {
    var a = e._quick_info_box;
    if (o && o != a)
      if (o.closest(".dhx_cal_qi_close_btn"))
        e.hideQuickInfo();
      else {
        var s = e._getClassName(o);
        if (s.indexOf("_icon") != -1) {
          var _ = e._quick_info_box_id;
          e._click.buttons[s.split(" ")[1].replace("icon_", "")](_);
        } else
          e._qi_button_click(o.parentNode);
      }
  }, e._get_event_counter_part = function(o) {
    return n(e.getRenderedEvent(o));
  }, e._fill_quick_data = function(o) {
    var a = e.getEvent(o), s = e._quick_info_box;
    e._quick_info_box_id = o;
    var _ = { content: e.templates.quick_info_title(a.start_date, a.end_date, a), date: e.templates.quick_info_date(a.start_date, a.end_date, a) };
    s.querySelector(".dhx_cal_qi_tcontent").innerHTML = `<span>${_.content}</span>`, s.querySelector(".dhx_cal_qi_tdate").innerHTML = _.date, e._waiAria.quickInfoHeader(s, [_.content, _.date].join(" "));
    var r = s.querySelector(".dhx_cal_qi_content");
    const d = e.templates.quick_info_content(a.start_date, a.end_date, a);
    d ? (r.classList.remove("dhx_hidden"), r.innerHTML = d) : r.classList.add("dhx_hidden");
  };
}, readonly: function(e) {
  e.attachEvent("onTemplatesReady", function() {
    var i;
    e.form_blocks.recurring && (i = e.form_blocks.recurring.set_value);
    var t = e.config.buttons_left.slice(), n = e.config.buttons_right.slice();
    function o(_, r, d, l) {
      for (var h = r.getElementsByTagName(_), v = d.getElementsByTagName(_), m = v.length - 1; m >= 0; m--)
        if (d = v[m], l) {
          var f = document.createElement("span");
          f.className = "dhx_text_disabled", f.innerHTML = l(h[m]), d.parentNode.insertBefore(f, d), d.parentNode.removeChild(d);
        } else
          d.disabled = !0, r.checked && (d.checked = !0);
    }
    e.attachEvent("onBeforeLightbox", function(_) {
      if (this.config.readonly_form || this.getEvent(_).readonly ? this.config.readonly_active = !0 : (this.config.readonly_active = !1, e.config.buttons_left = t.slice(), e.config.buttons_right = n.slice(), e.form_blocks.recurring && (e.form_blocks.recurring.set_value = i)), this.config.readonly_active)
        for (var r = ["dhx_delete_btn", "dhx_save_btn"], d = [e.config.buttons_left, e.config.buttons_right], l = 0; l < r.length; l++)
          for (var h = r[l], v = 0; v < d.length; v++) {
            for (var m = d[v], f = -1, c = 0; c < m.length; c++)
              if (m[c] == h) {
                f = c;
                break;
              }
            f != -1 && m.splice(f, 1);
          }
      return this.resetLightbox(), !0;
    });
    var a = e._fill_lightbox;
    e._fill_lightbox = function() {
      var _ = this.getLightbox();
      this.config.readonly_active && (_.style.visibility = "hidden", _.style.display = "block");
      var r = a.apply(this, arguments);
      if (this.config.readonly_active && (_.style.visibility = "", _.style.display = "none"), this.config.readonly_active) {
        var d = this.getLightbox(), l = this._lightbox_r = d.cloneNode(!0);
        l.id = e.uid(), l.className += " dhx_cal_light_readonly", o("textarea", d, l, function(h) {
          return h.value;
        }), o("input", d, l, !1), o("select", d, l, function(h) {
          return h.options.length ? h.options[Math.max(h.selectedIndex || 0, 0)].text : "";
        }), d.parentNode.insertBefore(l, d), this.showCover(l), e._lightbox && e._lightbox.parentNode.removeChild(e._lightbox), this._lightbox = l, e.config.drag_lightbox && e.event(l.firstChild, "mousedown", e._ready_to_dnd), e._init_lightbox_events(), this.setLightboxSize();
      }
      return r;
    };
    var s = e.hide_lightbox;
    e.hide_lightbox = function() {
      return this._lightbox_r && (this._lightbox_r.parentNode.removeChild(this._lightbox_r), this._lightbox_r = this._lightbox = null), s.apply(this, arguments);
    };
  });
}, recurring: function(e) {
  function i(g) {
    return new Date(g.getFullYear(), g.getMonth(), g.getDate(), g.getHours(), g.getMinutes(), g.getSeconds(), 0);
  }
  function t(g) {
    return !!g.rrule && !g.recurring_event_id;
  }
  function n(g) {
    return new Date(Date.UTC(g.getFullYear(), g.getMonth(), g.getDate(), g.getHours(), g.getMinutes(), g.getSeconds()));
  }
  function o(g) {
    g.rrule.includes(";UNTIL=") && (g.rrule = g.rrule.split(";UNTIL=")[0]);
    let b = ke(`RRULE:${g.rrule};UNTIL=${c(g._end_date || g.end_date)}`, { dtstart: g.start_date }), w = new z(b.origOptions).toString().replace("RRULE:", "");
    w = w.split(`
`)[1], g.rrule = w;
  }
  function a(g, b) {
    b || (b = e.getEvent(g));
    let w = b.rrule.split(";"), E = [];
    for (let N = 0; N < w.length; N++) {
      let T = w[N].split("="), A = T[0], C = T[1];
      (A !== "BYDAY" || b.rrule.includes("WEEKLY") && C.length > 3) && (E.push(A), E.push("="), E.push(C), E.push(";"));
    }
    E.pop(), b.rrule = E.join("");
  }
  var s;
  function _(g, b) {
    g._end_date = g.end_date, e._isExceptionFirstOccurrence(b) ? (g.start_date = b.start_date, g.end_date = new Date(b.start_date.valueOf() + 1e3 * g.duration), g._start_date = b.original_start, g._modified = !0) : (g.end_date = new Date(b.start_date.valueOf() + 1e3 * g.duration), g.start_date = b.start_date, g._firstOccurrence = !0), g._thisAndFollowing = b.id;
  }
  function r(g, b, w, E) {
    const N = w._modified ? E.id : g;
    e._events[N] = { ...E, text: b.text, duration: b.duration, start_date: b.start_date, rrule: b.rrule, end_date: E._end_date, _start_date: E.start_date, _thisAndFollowing: null, _end_date: null }, w._modified && delete e._events[g], e.callEvent("onEventChanged", [e._events[N].id, e._events[N]]);
  }
  function d(g) {
    for (const b in e._events)
      e._events[b].id == g.id && delete e._events[b];
  }
  function l(g, b) {
    for (let w in e._events) {
      let E = e._events[w];
      (E.recurring_event_id == g || e._is_virtual_event(E.id) && E.id.split("#")[0] == g) && (E.text = b.text, e.updateEvent(E.id));
    }
  }
  function h(g, b) {
    let w = g, E = new Date(b.original_start).valueOf();
    g = String(w).split("#") || b._pid_time || E;
    let N = e.uid(), T = g[1] ? g[1] : b._pid_time || E, A = e._copy_event(b);
    A.id = N, A.recurring_event_id = b.recurring_event_id || g[0], A.original_start = new Date(Number(T)), A.deleted = !0, e.addEvent(A);
  }
  function v() {
    for (const g in e._events)
      g === "$dnd_recurring_placeholder" && delete e._events[g];
    e.render();
  }
  function m(g, b) {
    const w = e.locale;
    g.find((N) => N.checked) || (g[0].checked = !0);
    const E = g.reduce((N, T) => (N[T.value] = T.callback, N), {});
    e.modalbox({ text: `<div class="dhx_edit_recurrence_options">
				${g.map((N) => `<label class="dhx_styled_radio">
					<input type="radio" value="${N.value}" name="option" ${N.checked ? "checked" : ""}>
					${N.label}
				</label>`).join("")}
			</div>`, type: "recurring_mode", title: w.labels.confirm_recurring, width: "auto", position: "middle", buttons: [{ label: w.labels.message_ok, value: "ok", css: "rec_ok" }, { label: w.labels.message_cancel, value: "cancel" }], callback: function(N, T) {
      if (b && b(N, T), N === "cancel")
        return;
      const A = T.target.closest(".scheduler_modal_box").querySelector("input[type='radio']:checked");
      let C;
      A && (C = A.value), C && E[C]();
    } });
  }
  function f() {
    const g = {};
    for (const b in e._events) {
      const w = e._events[b];
      w.recurring_event_id && w.original_start && (g[w.recurring_event_id] || (g[w.recurring_event_id] = {}), g[w.recurring_event_id][w.original_start.valueOf()] = w);
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
      let b = g.recurring_event_id, w = e.getEvent(b);
      return !(!g.original_start || !g.original_start.valueOf() || g.original_start.valueOf() !== w.start_date.valueOf());
    }
  }, e._rec_temp = [], e._rec_markers_pull = {}, e._rec_markers = {}, e._add_rec_marker = function(g, b) {
    g._pid_time = b, this._rec_markers[g.id] = g, this._rec_markers_pull[g.event_pid] || (this._rec_markers_pull[g.event_pid] = {}), this._rec_markers_pull[g.event_pid][b] = g;
  }, e._get_rec_marker = function(g, b) {
    let w = this._rec_markers_pull[b];
    return w ? w[g] : null;
  }, e._get_rec_markers = function(g) {
    return this._rec_markers_pull[g] || [];
  }, s = e.addEvent, e.addEvent = function(g, b, w, E, N) {
    var T = s.apply(this, arguments);
    if (T && e.getEvent(T)) {
      var A = e.getEvent(T);
      A.start_date && (A.start_date = i(A.start_date)), A.end_date && (A.end_date = i(A.end_date));
    }
    return T;
  }, e.attachEvent("onEventLoading", function(g) {
    return g.original_start && !g.original_start.getFullYear && (g.original_start = e.templates.parse_date(g.original_start)), !0;
  }), e.attachEvent("onEventIdChange", function(g, b) {
    if (!this._ignore_call) {
      this._ignore_call = !0, e._rec_markers[g] && (e._rec_markers[b] = e._rec_markers[g], delete e._rec_markers[g]), e._rec_markers_pull[g] && (e._rec_markers_pull[b] = e._rec_markers_pull[g], delete e._rec_markers_pull[g]);
      for (var w = 0; w < this._rec_temp.length; w++) {
        var E = this._rec_temp[w];
        this._is_virtual_event(E.id) && E.id.split("#")[0] == g && (E.recurring_event_id = b, this.changeEventId(E.id, b + "#" + E.id.split("#")[1]));
      }
      for (var w in this._rec_markers)
        (E = this._rec_markers[w]).recurring_event_id == g && (E.recurring_event_id = b, E._pid_changed = !0);
      var N = e._rec_markers[b];
      N && N._pid_changed && (delete N._pid_changed, setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.callEvent("onEventChanged", [b, e.getEvent(b)]);
      }, 1)), delete this._ignore_call;
    }
  }), e.attachEvent("onConfirmedBeforeEventDelete", function(g) {
    var b = this.getEvent(g);
    if (this._is_virtual_event(g) || this._is_modified_occurrence(b) && !function(N) {
      return !!N.deleted;
    }(b))
      h(g, b);
    else {
      t(b) && this._lightbox_id && this._roll_back_dates(b);
      var w = this._get_rec_markers(g);
      for (var E in w)
        w.hasOwnProperty(E) && (g = w[E].id, this.getEvent(g) && this.deleteEvent(g, !0));
    }
    return !0;
  }), e.attachEvent("onEventDeleted", function(g, b) {
    !this._is_virtual_event(g) && this._is_modified_occurrence(b) && (e._events[g] || (b.deleted = !0, this.setEvent(g, b), e.render()));
  }), e.attachEvent("onBeforeEventChanged", function(g, b, w, E) {
    return !(!w && g && (e._is_virtual_event(g.id) || e._is_modified_occurrence(g)) && (E.start_date.getDate() !== g.start_date.getDate() ? g._beforeEventChangedFlag = "edit" : g._beforeEventChangedFlag = "ask", !e.config.collision_limit || e.checkCollision(g))) || (e._events.$dnd_recurring_placeholder = e._lame_clone(g), e._showRequiredModalBox(g.id, g._beforeEventChangedFlag), !1);
  }), e.attachEvent("onEventChanged", function(g, b) {
    if (this._loading)
      return !0;
    let w = this.getEvent(g);
    if (this._is_virtual_event(g))
      (function(C) {
        let $ = C.id.split("#"), H = e.uid();
        e._not_render = !0;
        let O = e._copy_event(C);
        O.id = H, O.recurring_event_id = $[0];
        let R = $[1];
        O.original_start = new Date(Number(R)), e._add_rec_marker(O, R), e.addEvent(O), e._not_render = !1;
      })(w);
    else {
      w.start_date && (w.start_date = i(w.start_date)), w.end_date && (w.end_date = i(w.end_date)), t(w) && this._lightbox_id && (w._removeFollowing || this._isFollowing(g) ? w._removeFollowing = null : this._roll_back_dates(w));
      var E = this._get_rec_markers(g);
      for (var N in E)
        E.hasOwnProperty(N) && (delete this._rec_markers[E[N].id], this.deleteEvent(E[N].id, !0));
      delete this._rec_markers_pull[g];
      for (var T = !1, A = 0; A < this._rendered.length; A++)
        this._rendered[A].getAttribute(this.config.event_attribute) == g && (T = !0);
      T || (this._select_id = null);
    }
    return v(), !0;
  }), e.attachEvent("onEventAdded", function(g) {
    if (!this._loading) {
      var b = this.getEvent(g);
      t(b) && this._roll_back_dates(b);
    }
    return !0;
  }), e.attachEvent("onEventSave", function(g, b, w) {
    let E = this.getEvent(g), N = e._lame_clone(E), T = b.rrule;
    if (E && t(E) && !w && this._isFollowing(g)) {
      if (E._removeFollowing) {
        if (e.getEvent(E._thisAndFollowing) && (E._firstOccurrence || E._modified))
          return e.hideLightbox(), e.deleteEvent(E.id), !1;
        if (E.end_date = new Date(E.start_date.valueOf() - 1e3), E._end_date = E._shorten_end_date, E.start_date = E._start_date, E._shorten = !0, o(E), e.callEvent("onEventChanged", [E.id, E]), e.getEvent(E._thisAndFollowing))
          for (const A in e._events) {
            let C = e._events[A];
            C.recurring_event_id === g && C.start_date.valueOf() > N.start_date.valueOf() && h(C.id, C);
          }
        return e.hideLightbox(), !1;
      }
      {
        let A = e.getEvent(E._thisAndFollowing);
        if (A && E._firstOccurrence)
          for (const C in e._events)
            e._events[C].id == E.id && r(C, b, E, N);
        else if (A && E._modified)
          for (const C in e._events) {
            let $ = e._events[C];
            $.recurring_event_id == g && $.id == N._thisAndFollowing && r(C, b, E, N);
          }
        else {
          e._is_modified_occurrence(A) && d(A), E.end_date = E._shorten_end_date, E._end_date = E._shorten_end_date, E.start_date = E._start_date, E._shorten = !0, o(E), e.callEvent("onEventChanged", [E.id, E]);
          let C = { ...N };
          C.text = b.text, C.duration = b.duration, C.rrule = T, C._start_date = null, C.id = e.uid(), e.addEvent(C.start_date, C.end_date, C.text, C.id, C);
        }
        return w || l(g, b), e.hideLightbox(), !1;
      }
    }
    return w || l(g, b), N._ocr && N._beforeEventChangedFlag ? (E.start_date = N.start_date, E.end_date = N.end_date, E._start_date = N._start_date, E._end_date = N._end_date, e.updateEvent(E.id), !0) : (this._select_id = null, v(), !0);
  }), e.attachEvent("onEventCreated", function(g) {
    var b = this.getEvent(g);
    return t(b) || function(w) {
      w.rrule = "", w.original_start = null, w.recurring_event_id = null, w.duration = null, w.deleted = null;
    }(b), !0;
  }), e.attachEvent("onEventCancel", function(g) {
    var b = this.getEvent(g);
    t(b) && (this._roll_back_dates(b), this.render_view_data()), v();
  }), e._roll_back_dates = function(g) {
    g.start_date && (g.start_date = i(g.start_date)), g.end_date && (g.end_date = i(g.end_date)), g._end_date && (g._shorten || (g.duration = Math.round((g.end_date.valueOf() - g.start_date.valueOf()) / 1e3)), g.end_date = g._end_date), g._start_date && (g.start_date.setMonth(0), g.start_date.setDate(g._start_date.getDate()), g.start_date.setMonth(g._start_date.getMonth()), g.start_date.setFullYear(g._start_date.getFullYear()), this._isFollowing(g.id) && (g.start_date.setHours(g._start_date.getHours()), g.start_date.setMinutes(g._start_date.getMinutes()), g.start_date.setSeconds(g._start_date.getSeconds()))), g._thisAndFollowing = null, g._shorten_end_date && (g._shorten_end_date = null), g._removeFollowing && (g._removeFollowing = null), g._firstOccurrence && (g._firstOccurrence = null), g._modified && (g._modified = null);
  }, e._is_virtual_event = function(g) {
    return g.toString().indexOf("#") != -1;
  }, e._is_modified_occurrence = function(g) {
    return g.recurring_event_id && g.recurring_event_id != "0";
  }, e.showLightbox_rec = e.showLightbox, e.showLightbox = function(g) {
    const b = this.locale;
    let w = e.config.lightbox_recurring, E = this.getEvent(g), N = E.recurring_event_id, T = this._is_virtual_event(g);
    T && (N = g.split("#")[0]);
    const A = function(C, $) {
      const H = e.getEvent(C), O = e.getEvent(N), R = e.getView();
      if (R && H[R.y_property] && (O[R.y_property] = H[R.y_property]), R && H[R.property] && (O[R.property] = H[R.property]), $ === "Occurrence")
        return e.showLightbox_rec(C);
      if ($ === "Following") {
        if (e._isExceptionFirstOccurrence(H) || e._isFirstOccurrence(H))
          return _(O, H), e.showLightbox_rec(N);
        {
          O._end_date = O.end_date;
          const U = H.original_start || H.start_date;
          return O._shorten_end_date = new Date(U.valueOf() - 1e3), O.end_date = new Date(H.start_date.valueOf() + 1e3 * O.duration), O._start_date = O.start_date, O.start_date = H.start_date, O._thisAndFollowing = H.id, E._beforeEventChangedFlag && (O._beforeEventChangedFlag = E._beforeEventChangedFlag, O._shorten_end_date = new Date(U.valueOf() - 1e3)), e.showLightbox_rec(N);
        }
      }
      if ($ === "AllEvents") {
        if (e._isExceptionFirstOccurrence(H) || e._isFirstOccurrence(H))
          return _(O, H), e.showLightbox_rec(N);
        const U = new Date(O.start_date);
        return O._end_date = O.end_date, O._start_date = U, O.start_date.setHours(H.start_date.getHours()), O.start_date.setMinutes(H.start_date.getMinutes()), O.start_date.setSeconds(H.start_date.getSeconds()), O.end_date = new Date(O.start_date.valueOf() + 1e3 * O.duration), O._thisAndFollowing = null, e.showLightbox_rec(N);
      }
    };
    if ((N || 1 * N == 0) && t(E))
      return A(g, "AllEvents");
    if (!N || N === "0" || !b.labels.confirm_recurring || w == "instance" || w == "series" && !T)
      return this.showLightbox_rec(g);
    if (w === "ask") {
      const C = e.locale;
      m([{ value: "Occurrence", label: C.labels.button_edit_occurrence, checked: !0, callback: () => A(g, "Occurrence") }, { value: "Following", label: C.labels.button_edit_occurrence_and_following, callback: () => A(g, "Following") }, { value: "AllEvents", label: C.labels.button_edit_series, callback: () => A(g, "AllEvents") }]);
    }
  }, e._showRequiredModalBox = function(g, b) {
    let w;
    const E = e.locale;
    let N = e.getEvent(g), T = N.recurring_event_id;
    e._is_virtual_event(N.id) && (T = N.id.split("#")[0]);
    let A = e.getEvent(T);
    const C = e.getView();
    let $, H, O = e._lame_clone(A);
    C && N[C.y_property] && (O[C.y_property] = N[C.y_property]), C && N[C.property] && (O[C.property] = N[C.property]), N && N._beforeEventChangedFlag && ($ = N.start_date, H = N.end_date);
    const R = { value: "AllEvents", label: E.labels.button_edit_series, callback: () => function(j) {
      let Y = e._lame_clone(j);
      if (e._isExceptionFirstOccurrence(Y) && d(Y), H && $ && (O.start_date.setHours($.getHours()), O.start_date.setMinutes($.getMinutes()), O.start_date.setSeconds($.getSeconds()), O.duration = (+H - +$) / 1e3), O._beforeEventChangedFlag = j._beforeEventChangedFlag, O._thisAndFollowing = null, !e.config.collision_limit || e.checkCollision(O))
        for (const P in e._events)
          e._events[P].id == O.id && (e._events[P] = { ...O }, e.callEvent("onEventChanged", [e._events[P].id, e._events[P]]));
    }(N) }, U = { value: "Following", label: E.labels.button_edit_occurrence_and_following, callback: () => function(j) {
      let Y = e._lame_clone(j);
      if (H && $ && (j._start_date = j.start_date, j.start_date = $, j.end_date = H), e._isFirstOccurrence(Y) || e._isExceptionFirstOccurrence(Y)) {
        if (e._isExceptionFirstOccurrence(Y) && d(Y), O._start_date = A.start_date, O.start_date = j.start_date, O.duration = (+j.end_date - +j.start_date) / 1e3, O._beforeEventChangedFlag = j._beforeEventChangedFlag, O.rrule && a(O.id, O), !e.config.collision_limit || e.checkCollision(O))
          for (const P in e._events)
            e._events[P].id == O.id && (e._events[P] = { ...O }, e.callEvent("onEventChanged", [e._events[P].id, e._events[P]]));
      } else {
        O._end_date = A.end_date;
        const P = j.original_start || e.date.date_part(new Date(j._start_date));
        O._shorten_end_date = new Date(P.valueOf() - 1e3), O.end_date = j.end_date, O._start_date = A.start_date, O.start_date = j.start_date, O._thisAndFollowing = j.id, O.rrule && a(O.id, O);
        let K = O.end_date;
        if (O.end_date = O._end_date, !e.config.collision_limit || e.checkCollision(O)) {
          O.end_date = K;
          for (const Q in e._events)
            e._events[Q].id == O.id && (e._events[Q] = { ...O }, e.callEvent("onEventSave", [e._events[Q].id, e._events[Q], e._new_event]), e.callEvent("onEventChanged", [e._events[Q].id, e._events[Q]]));
        }
      }
    }(N) }, I = { value: "Occurrence", label: E.labels.button_edit_occurrence, callback: () => function(j) {
      let Y = { ...A, ...e.getEvent("$dnd_recurring_placeholder") };
      if (H && $ && (Y.start_date = $, Y.end_date = H, Y._beforeEventChangedFlag = j._beforeEventChangedFlag, Y._ocr = !0), !e.config.collision_limit || e.checkCollision(Y))
        for (const P in e._events) {
          let K = e._events[P];
          P !== "$dnd_recurring_placeholder" && K.id == Y.id && (e._events[P] = { ...Y }, e.callEvent("onEventChanged", [e._events[P].id, e._events[P]]));
        }
    }(N), checked: !0 };
    w = b === "ask" ? [I, U, R] : [I, U], m(w, (j) => {
      j === "cancel" && v();
    });
  }, e.get_visible_events_rec = e.get_visible_events, e.get_visible_events = function(g) {
    for (var b = 0; b < this._rec_temp.length; b++)
      delete this._events[this._rec_temp[b].id];
    this._rec_temp = [];
    const w = f();
    var E = this.get_visible_events_rec(g), N = [];
    for (b = 0; b < E.length; b++)
      E[b].deleted || E[b].recurring_event_id || (t(E[b]) ? this.repeat_date(E[b], N, void 0, void 0, void 0, void 0, w) : N.push(E[b]));
    return function(T) {
      const A = {};
      return T.forEach((C) => {
        const $ = A[C.id];
        (!$ || $._beforeEventChangedFlag || C._beforeEventChangedFlag) && (A[C.id] = C);
      }), Object.values(A);
    }(N);
  }, function() {
    var g = e.isOneDayEvent;
    e.isOneDayEvent = function(w) {
      return !!t(w) || g.call(this, w);
    };
    var b = e.updateEvent;
    e.updateEvent = function(w) {
      var E = e.getEvent(w);
      E && t(E) && !this._is_virtual_event(w) ? e.update_view() : b.call(this, w);
    };
  }();
  const c = e.date.date_to_str("%Y%m%dT%H%i%s");
  function u(g) {
    const b = g.getDay(), w = g.getDate();
    return { dayOfWeek: b, dayNumber: Math.ceil(w / 7) };
  }
  e.repeat_date = function(g, b, w, E, N, T, A) {
    if (!g.rrule)
      return;
    let C = A ? A[g.id] : f()[g.id];
    C || (C = {}), E = n(E || new Date(e._min_date.valueOf() - 6048e5)), N = n(N || new Date(e._max_date.valueOf() - 1e3));
    const $ = n(g.start_date);
    let H;
    H = ke(T ? `RRULE:${g.rrule};UNTIL=${c(g.end_date)};COUNT=${T}` : `RRULE:${g.rrule};UNTIL=${c(g.end_date)}`, { dtstart: $ });
    const O = H.between(E, N, !0).map((I) => {
      const j = (Y = I, new Date(Y.getUTCFullYear(), Y.getUTCMonth(), Y.getUTCDate(), Y.getUTCHours(), Y.getUTCMinutes(), Y.getUTCSeconds()));
      var Y;
      return j.setHours(g.start_date.getHours()), j.setMinutes(g.start_date.getMinutes()), j.setSeconds(g.start_date.getSeconds()), j;
    });
    let R = 0;
    const U = g.duration;
    for (let I = 0; I < O.length && !(T && R >= T); I++) {
      const j = O[I];
      let Y = C[j.valueOf()];
      if (Y) {
        if (Y.deleted || Y.end_date.valueOf() < e._min_date.valueOf() || !e.filter_event(Y.id, Y))
          continue;
        R++, b.push(Y);
      } else {
        const P = e._copy_event(g);
        if (P.text = g.text, P.start_date = j, P.id = g.id + "#" + Math.ceil(j.valueOf()), P.end_date = new Date(j.valueOf() + 1e3 * U), P.end_date.valueOf() < e._min_date.valueOf() || (P.end_date = e._fix_daylight_saving_date(P.start_date, P.end_date, g, j, P.end_date), P._timed = e.isOneDayEvent(P), !P._timed && !e._table_view && !e.config.multi_day))
          continue;
        b.push(P), w || (e._events[P.id] = P, e._rec_temp.push(P)), R++;
      }
    }
    if (C && O.length == 0)
      for (let I in C) {
        let j = C[I];
        if (j) {
          if (j.deleted || j.end_date.valueOf() < e._min_date.valueOf() || !e.filter_event(j.id, j))
            continue;
          E && N && j.start_date < N && j.end_date > E && b.push(j);
        }
      }
  }, e._fix_daylight_saving_date = function(g, b, w, E, N) {
    var T = g.getTimezoneOffset() - b.getTimezoneOffset();
    return T ? T > 0 ? new Date(E.valueOf() + 1e3 * w.duration - 60 * T * 1e3) : new Date(b.valueOf() - 60 * T * 1e3) : new Date(N.valueOf());
  }, e.getRecDates = function(g, b) {
    var w = typeof g == "object" ? g : e.getEvent(g), E = [];
    if (b = b || 100, !t(w))
      return [{ start_date: w.start_date, end_date: w.end_date }];
    if (w.deleted)
      return [];
    e.repeat_date(w, E, !0, w.start_date, w.end_date, b);
    for (var N = [], T = 0; T < E.length; T++)
      E[T].deleted || N.push({ start_date: E[T].start_date, end_date: E[T].end_date });
    return N;
  }, e.getEvents = function(g, b) {
    var w = [];
    const E = f();
    for (var N in this._events) {
      var T = this._events[N];
      if (!T.recurring_event_id)
        if (g && b && T.start_date < b && T.end_date > g)
          if (t(T)) {
            var A = [];
            this.repeat_date(T, A, !0, g, b, void 0, E), A.forEach(function(C) {
              C.start_date < b && C.end_date > g && w.push(C);
            });
          } else
            this._is_virtual_event(T.id) || w.push(T);
        else
          g || b || this._is_virtual_event(T.id) || w.push(T);
    }
    return w;
  }, e._copy_dummy = function(g) {
    var b = new Date(this.start_date), w = new Date(this.end_date);
    this.start_date = b, this.end_date = w, this.duration = this.rrule = null;
  }, e.config.include_end_by = !1, e.config.lightbox_recurring = "ask", e.config.recurring_workdays = [z.MO.weekday, z.TU.weekday, z.WE.weekday, z.TH.weekday, z.FR.weekday], e.config.repeat_date = "%m.%d.%Y", e.config.lightbox.sections = [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "recurring", type: "recurring", map_to: "rrule" }, { name: "time", height: 72, type: "time", map_to: "auto" }], e.attachEvent("onClearAll", function() {
    e._rec_markers = {}, e._rec_markers_pull = {}, e._rec_temp = [];
  });
  const p = { 0: "SU", 1: "MO", 2: "TU", 3: "WE", 4: "TH", 5: "FR", 6: "SA" }, y = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 0 };
  function x(g, b) {
    const w = g.querySelector("[name='repeat_interval_value']");
    w && (w.value = (b ? b.interval : 1) || 1);
  }
  function S(g) {
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
    return `Every ${S(g.getDate())}`;
  }, e.templates.repeat_monthly_weekday = function(g, b) {
    const w = u(g);
    return `Every ${S(w.dayNumber)} ${e.locale.date.day_full[w.dayOfWeek]}`;
  }, e.templates.repeat_yearly_month_date = function(g, b) {
    const w = g.getDate(), E = e.locale.date.month_full[g.getMonth()];
    return `Every ${S(w)} day of ${E}`;
  }, e.templates.repeat_yearly_month_weekday = function(g, b) {
    const w = u(g), E = e.locale.date.month_full[g.getMonth()];
    return `Every ${S(w.dayNumber)} ${e.locale.date.day_full[w.dayOfWeek]} of ${E}`;
  };
  const k = { MONTHLY: function(g) {
    return { rrule: { freq: z.MONTHLY, interval: 1, bymonthday: g.start.getDate() }, until: new Date(9999, 1, 1) };
  }, WEEKLY: function(g) {
    let b = g.start.getDay() - 1;
    return b == -1 && (b = 6), { rrule: { freq: z.WEEKLY, interval: 1, byweekday: [b] }, until: new Date(9999, 1, 1) };
  }, DAILY: function(g) {
    return { rrule: { freq: z.DAILY, interval: 1 }, until: new Date(9999, 1, 1) };
  }, YEARLY: function(g) {
    return { rrule: { freq: z.YEARLY, bymonth: g.start.getMonth() + 1, interval: 1, bymonthday: g.start.getDate() }, until: new Date(9999, 1, 1) };
  }, WORKDAYS: function(g) {
    return { rrule: { freq: z.WEEKLY, interval: 1, byweekday: e.config.recurring_workdays }, until: new Date(9999, 1, 1) };
  }, CUSTOM: function(g, b) {
    const w = {}, E = b.querySelector('[name="repeat_interval_unit"]').value, N = Math.max(1, b.querySelector('[name="repeat_interval_value"]').value), T = b.querySelector('[name="dhx_custom_month_option"]') ? b.querySelector('[name="dhx_custom_month_option"]').value : null, A = b.querySelector('[name="dhx_custom_year_option"]') ? b.querySelector('[name="dhx_custom_year_option"]').value : null;
    let C, $;
    switch (w.interval = N, E) {
      case "DAILY":
        w.freq = z.DAILY;
        break;
      case "WEEKLY":
        w.freq = z.WEEKLY, C = [], b.querySelectorAll('.dhx_form_repeat_custom_week [name="week_day"]').forEach((U) => {
          U.checked && C.push(U.value);
        }), w.byweekday = C.map((U) => {
          switch (U) {
            case "MO":
              return z.MO.weekday;
            case "TU":
              return z.TU.weekday;
            case "WE":
              return z.WE.weekday;
            case "TH":
              return z.TH.weekday;
            case "FR":
              return z.FR.weekday;
            case "SA":
              return z.SA.weekday;
            case "SU":
              return z.SU.weekday;
          }
        });
        break;
      case "MONTHLY":
        w.freq = z.MONTHLY, T === "month_date" ? w.bymonthday = g.start.getDate() : ($ = g.start.getDay() - 1, $ == -1 && ($ = 6), w.byweekday = [$], w.bysetpos = u(g.start).dayNumber);
        break;
      case "YEARLY":
        w.freq = z.YEARLY, w.bymonth = g.start.getMonth() + 1, A == "month_date" ? w.bymonthday = g.start.getDate() : ($ = g.start.getDay() - 1, $ == -1 && ($ = 6), w.byweekday = [$], w.bysetpos = u(g.start).dayNumber);
    }
    const H = e.date.str_to_date("%Y-%m-%d");
    let O = new Date(9999, 1, 1);
    const R = b.querySelector('[name="dhx_custom_repeat_ends"]');
    return R && R.value === "ON" ? (O = H(b.querySelector('[name="dhx_form_repeat_ends_ondate"]').value), w.until = new Date(O)) : R && R.value === "AFTER" && (w.count = Math.max(1, b.querySelector('[name="dhx_form_repeat_ends_after"]').value)), { rrule: w, until: O };
  }, NEVER: function() {
  } };
  function D(g, b, w) {
    (function(E, N) {
      x(E, N);
    })(g, b), function(E, N, T) {
      if (x(E, N), E.querySelectorAll(".dhx_form_repeat_custom_week input").forEach((A) => A.checked = !1), N && N.byweekday)
        N.byweekday.forEach((A) => {
          const C = y[A.weekday], $ = p[C], H = E.querySelector(`.dhx_form_repeat_custom_week input[value="${$}"]`);
          H && (H.checked = !0);
        });
      else {
        const A = p[T.start_date.getDay()], C = E.querySelector(`.dhx_form_repeat_custom_week input[value="${A}"]`);
        C && (C.checked = !0);
      }
    }(g, b, w), function(E, N, T) {
      x(E, N);
      const A = E.querySelector('.dhx_form_repeat_custom_month [value="month_date"]'), C = E.querySelector('.dhx_form_repeat_custom_month [value="month_nth_weekday"]');
      if (A && C) {
        A.innerText = e.templates.repeat_monthly_date(T.start_date, T), C.innerText = e.templates.repeat_monthly_weekday(T.start_date, T);
        const $ = E.querySelector('[name="dhx_custom_month_option"]');
        $ && ($.value = !N || !N.bysetpos || N.byweekday && N.byweekday.length ? "month_nth_weekday" : "month_date");
      }
    }(g, b, w), function(E, N, T) {
      const A = E.querySelector('.dhx_form_repeat_custom_year [value="month_date"]'), C = E.querySelector('.dhx_form_repeat_custom_year [value="month_nth_weekday"]');
      A && C && (A.innerText = e.templates.repeat_yearly_month_date(T.start_date, T), C.innerText = e.templates.repeat_yearly_month_weekday(T.start_date, T), N && (!N.bysetpos || N.byweekday && N.byweekday.length) ? E.querySelector('[name="dhx_custom_year_option"]').value = "month_nth_weekday" : E.querySelector('[name="dhx_custom_year_option"]').value = "month_date");
    }(g, b, w), function(E, N, T) {
      const A = E.querySelector('.dhx_form_repeat_ends_extra [name="dhx_form_repeat_ends_after"]'), C = E.querySelector('.dhx_form_repeat_ends_extra [name="dhx_form_repeat_ends_ondate"]'), $ = E.querySelector("[name='dhx_custom_repeat_ends']");
      if (A && C && $) {
        A.value = 1;
        let H = e.date.date_to_str("%Y-%m-%d");
        e.config.repeat_date_of_end || (e.config.repeat_date_of_end = H(e.date.add(e._currentDate(), 30, "day"))), C.value = e.config.repeat_date_of_end, N && N.count ? ($.value = "AFTER", A.value = N.count) : T._end_date && T._end_date.getFullYear() !== 9999 ? ($.value = "ON", C.value = H(T._end_date)) : $.value = "NEVER", $.dispatchEvent(new Event("change"));
      }
    }(g, b, w);
  }
  function M(g) {
    for (let b = 0; b < e.config.lightbox.sections.length; b++) {
      let w = e.config.lightbox.sections[b];
      if (w.type === g)
        return e.formSection(w.name);
    }
    return null;
  }
  e.form_blocks.recurring = { _get_node: function(g) {
    if (typeof g == "string") {
      let b = e._lightbox.querySelector(`#${g}`);
      b || (b = document.getElementById(g)), g = b;
    }
    return g.style.display == "none" && (g.style.display = ""), g;
  }, _outer_html: function(g) {
    return g.outerHTML || (b = g, (E = document.createElement("div")).appendChild(b.cloneNode(!0)), w = E.innerHTML, E = null, w);
    var b, w, E;
  }, render: function(g) {
    if (g.form) {
      let w = e.form_blocks.recurring, E = w._get_node(g.form), N = w._outer_html(E);
      return E.style.display = "none", N;
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
  }, _init_set_value: function(g, b, w) {
    function E($) {
      $ && $.classList.add("dhx_hidden");
    }
    function N($) {
      $ && $.classList.remove("dhx_hidden");
    }
    e.form_blocks.recurring._ds = { start: w.start_date, end: w.end_date };
    const T = g.querySelector(".dhx_form_repeat_pattern select");
    T && T.addEventListener("change", function() {
      (function($) {
        const H = g.querySelector(".dhx_form_repeat_custom");
        $ === "CUSTOM" ? N(H) : E(H);
      })(this.value);
    });
    const A = g.querySelector(".dhx_form_repeat_custom_interval [name='repeat_interval_unit']");
    A && A.addEventListener("change", function() {
      (function($) {
        const H = { weekly: g.querySelector(".dhx_form_repeat_custom_week"), monthly: g.querySelector(".dhx_form_repeat_custom_month"), yearly: g.querySelector(".dhx_form_repeat_custom_year") };
        switch ($) {
          case "DAILY":
            E(H.weekly), E(H.monthly), E(H.yearly);
            break;
          case "WEEKLY":
            N(H.weekly), E(H.monthly), E(H.yearly);
            break;
          case "MONTHLY":
            E(H.weekly), N(H.monthly), E(H.yearly);
            break;
          case "YEARLY":
            E(H.weekly), E(H.monthly), N(H.yearly);
        }
      })(this.value);
    });
    const C = g.querySelector(".dhx_form_repeat_ends [name='dhx_custom_repeat_ends']");
    C && C.addEventListener("change", function() {
      (function($) {
        const H = { after: g.querySelector(".dhx_form_repeat_ends_extra .dhx_form_repeat_ends_after"), on: g.querySelector(".dhx_form_repeat_ends_extra .dhx_form_repeat_ends_on") };
        switch ($) {
          case "NEVER":
            E(H.after), E(H.on);
            break;
          case "AFTER":
            N(H.after), E(H.on);
            break;
          case "ON":
            E(H.after), N(H.on);
        }
      })(this.value);
    }), e._lightbox._rec_init_done = !0;
  }, button_click: function() {
  }, set_value: function(g, b, w) {
    let E = e.form_blocks.recurring;
    e._lightbox._rec_init_done || E._init_set_value(g, b, w), g.open = !w.rrule, g.blocked = this._is_modified_occurrence(w);
    let N = E._ds;
    if (N.start = w.start_date, N.end = w._end_date, w.rrule) {
      const A = ke(w.rrule);
      D(g, A.origOptions, w);
      const C = function($, H) {
        const O = $.options, R = O.until || H;
        return O.count || R && R.getFullYear() !== 9999 ? "CUSTOM" : O.freq !== z.DAILY || O.interval !== 1 || O.byweekday ? O.freq !== z.WEEKLY || O.interval !== 1 || O.byweekday ? O.freq !== z.MONTHLY || O.interval !== 1 || O.bysetpos ? O.freq !== z.YEARLY || O.interval !== 1 || O.bysetpos ? O.freq === z.DAILY && O.byweekday && O.byweekday.length === e.config.recurring_workdays.length && O.byweekday.includes(z.MO) && O.byweekday.includes(z.TU) && O.byweekday.includes(z.WE) && O.byweekday.includes(z.TH) && O.byweekday.includes(z.FR) ? "WORKDAYS" : "CUSTOM" : "YEARLY" : "MONTHLY" : "WEEKLY" : "DAILY";
      }(A, w._end_date);
      if (g.querySelector(".dhx_form_repeat_pattern select").value = C, C === "CUSTOM") {
        let $;
        switch (A.origOptions.freq) {
          case z.DAILY:
            $ = "DAILY";
            break;
          case z.WEEKLY:
            $ = "WEEKLY";
            break;
          case z.MONTHLY:
            $ = "MONTHLY";
            break;
          case z.YEARLY:
            $ = "YEARLY";
        }
        $ && (g.querySelector('[name="repeat_interval_unit"]').value = $, g.querySelector('[name="repeat_interval_unit"]').dispatchEvent(new Event("change")));
      }
    } else {
      D(g, null, w);
      const A = g.querySelector(".dhx_form_repeat_pattern select");
      A && (A.value = "NEVER");
    }
    const T = g.querySelector(".dhx_form_repeat_pattern select");
    T && T.dispatchEvent(new Event("change"));
  }, get_value: function(g, b) {
    const w = g.querySelector(".dhx_form_repeat_pattern select");
    if (g.blocked || w && w.value === "NEVER")
      b.rrule = b.rrule = "", b._end_date = b.end_date;
    else {
      let E = e.form_blocks.recurring._ds, N = {};
      (function() {
        let C = e.formSection("time");
        if (C || (C = M("time")), C || (C = M("calendar_time")), !C)
          throw new Error(["Can't calculate the recurring rule, the Recurring form block can't find the Time control. Make sure you have the time control in 'scheduler.config.lightbox.sections' config.", "You can use either the default time control https://docs.dhtmlx.com/scheduler/time.html, or the datepicker https://docs.dhtmlx.com/scheduler/minicalendar.html, or a custom control. ", 'In the latter case, make sure the control is named "time":', "", "scheduler.config.lightbox.sections = [", '{name:"time", height:72, type:"YOU CONTROL", map_to:"auto" }];'].join(`
`));
        return C;
      })().getValue(N), E.start = N.start_date;
      const T = w ? w.value : "CUSTOM", A = k[T](E, g);
      b.rrule = new z(A.rrule).toString().replace("RRULE:", ""), E.end = A.until, b.duration = Math.floor((N.end_date - N.start_date) / 1e3), E._start ? (b.start_date = new Date(E.start), b._start_date = new Date(E.start), E._start = !1) : b._start_date = null, b._end_date = E.end;
    }
    return b.rrule;
  }, focus: function(g) {
  } };
}, recurring_legacy: function(e) {
  function i() {
    var a = e.formSection("recurring");
    if (a || (a = t("recurring")), !a)
      throw new Error(["Can't locate the Recurring form section.", "Make sure that you have the recurring control on the lightbox configuration https://docs.dhtmlx.com/scheduler/recurring_events.html#recurringlightbox ", 'and that the recurring control has name "recurring":', "", "scheduler.config.lightbox.sections = [", '	{name:"recurring", ... }', "];"].join(`
`));
    return a;
  }
  function t(a) {
    for (var s = 0; s < e.config.lightbox.sections.length; s++) {
      var _ = e.config.lightbox.sections[s];
      if (_.type === a)
        return e.formSection(_.name);
    }
    return null;
  }
  function n(a) {
    return new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), 0);
  }
  var o;
  e.config.occurrence_timestamp_in_utc = !1, e.config.recurring_workdays = [1, 2, 3, 4, 5], e.form_blocks.recurring = { _get_node: function(a) {
    if (typeof a == "string") {
      let s = e._lightbox.querySelector(`#${a}`);
      s || (s = document.getElementById(a)), a = s;
    }
    return a.style.display == "none" && (a.style.display = ""), a;
  }, _outer_html: function(a) {
    return a.outerHTML || (s = a, (r = document.createElement("div")).appendChild(s.cloneNode(!0)), _ = r.innerHTML, r = null, _);
    var s, _, r;
  }, render: function(a) {
    if (a.form) {
      var s = e.form_blocks.recurring, _ = s._get_node(a.form), r = s._outer_html(_);
      return _.style.display = "none", r;
    }
    var d = e.locale.labels;
    return '<div class="dhx_form_repeat"> <form> <div class="dhx_repeat_left"> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="day" />' + d.repeat_radio_day + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="week"/>' + d.repeat_radio_week + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="month" checked />' + d.repeat_radio_month + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="repeat" value="year" />' + d.repeat_radio_year + '</label></div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_center"> <div style="display:none;" id="dhx_repeat_day"> <div><label><input class="dhx_repeat_radio" type="radio" name="day_type" value="d"/>' + d.repeat_radio_day_type + '</label><label><input class="dhx_repeat_text" type="text" name="day_count" value="1" />' + d.repeat_text_day_count + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="day_type" checked value="w"/>' + d.repeat_radio_day_type2 + '</label></div> </div> <div style="display:none;" id="dhx_repeat_week"><div><label>' + d.repeat_week + '<input class="dhx_repeat_text" type="text" name="week_count" value="1" /></label><span>' + d.repeat_text_week_count + '</span></div>  <table class="dhx_repeat_days"> <tr> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="1" />' + d.day_for_recurring[1] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="4" />' + d.day_for_recurring[4] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="2" />' + d.day_for_recurring[2] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="5" />' + d.day_for_recurring[5] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="3" />' + d.day_for_recurring[3] + '</label></div> <div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="6" />' + d.day_for_recurring[6] + '</label></div></td> <td><div><label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="0" />' + d.day_for_recurring[0] + '</label></div> </td> </tr> </table> </div> <div id="dhx_repeat_month"> <div><label class = "dhx_repeat_month_label"><input class="dhx_repeat_radio" type="radio" name="month_type" value="d"/>' + d.repeat_radio_month_type + '</label><label><input class="dhx_repeat_text" type="text" name="month_day" value="1" />' + d.repeat_text_month_day + '</label><label><input class="dhx_repeat_text" type="text" name="month_count" value="1" />' + d.repeat_text_month_count + '</label></div> <div><label class = "dhx_repeat_month_label"><input class="dhx_repeat_radio" type="radio" name="month_type" checked value="w"/>' + d.repeat_radio_month_start + '</label><input class="dhx_repeat_text" type="text" name="month_week2" value="1" /><label><select name="month_day2">	<option value="1" selected >' + e.locale.date.day_full[1] + '<option value="2">' + e.locale.date.day_full[2] + '<option value="3">' + e.locale.date.day_full[3] + '<option value="4">' + e.locale.date.day_full[4] + '<option value="5">' + e.locale.date.day_full[5] + '<option value="6">' + e.locale.date.day_full[6] + '<option value="0">' + e.locale.date.day_full[0] + "</select>" + d.repeat_text_month_count2_before + '</label><label><input class="dhx_repeat_text" type="text" name="month_count2" value="1" />' + d.repeat_text_month_count2_after + '</label></div> </div> <div style="display:none;" id="dhx_repeat_year"> <div><label class = "dhx_repeat_year_label"><input class="dhx_repeat_radio" type="radio" name="year_type" value="d"/>' + d.repeat_radio_day_type + '</label><label><input class="dhx_repeat_text" type="text" name="year_day" value="1" />' + d.repeat_text_year_day + '</label><label><select name="year_month"><option value="0" selected >' + d.month_for_recurring[0] + '<option value="1">' + d.month_for_recurring[1] + '<option value="2">' + d.month_for_recurring[2] + '<option value="3">' + d.month_for_recurring[3] + '<option value="4">' + d.month_for_recurring[4] + '<option value="5">' + d.month_for_recurring[5] + '<option value="6">' + d.month_for_recurring[6] + '<option value="7">' + d.month_for_recurring[7] + '<option value="8">' + d.month_for_recurring[8] + '<option value="9">' + d.month_for_recurring[9] + '<option value="10">' + d.month_for_recurring[10] + '<option value="11">' + d.month_for_recurring[11] + "</select>" + d.select_year_month + '</label></div> <div><label class = "dhx_repeat_year_label"><input class="dhx_repeat_radio" type="radio" name="year_type" checked value="w"/>' + d.repeat_year_label + '</label><input class="dhx_repeat_text" type="text" name="year_week2" value="1" /><select name="year_day2"><option value="1" selected >' + e.locale.date.day_full[1] + '<option value="2">' + e.locale.date.day_full[2] + '<option value="3">' + e.locale.date.day_full[3] + '<option value="4">' + e.locale.date.day_full[4] + '<option value="5">' + e.locale.date.day_full[5] + '<option value="6">' + e.locale.date.day_full[6] + '<option value="7">' + e.locale.date.day_full[0] + "</select>" + d.select_year_day2 + '<select name="year_month2"><option value="0" selected >' + d.month_for_recurring[0] + '<option value="1">' + d.month_for_recurring[1] + '<option value="2">' + d.month_for_recurring[2] + '<option value="3">' + d.month_for_recurring[3] + '<option value="4">' + d.month_for_recurring[4] + '<option value="5">' + d.month_for_recurring[5] + '<option value="6">' + d.month_for_recurring[6] + '<option value="7">' + d.month_for_recurring[7] + '<option value="8">' + d.month_for_recurring[8] + '<option value="9">' + d.month_for_recurring[9] + '<option value="10">' + d.month_for_recurring[10] + '<option value="11">' + d.month_for_recurring[11] + '</select></div> </div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_right"> <div><label><input class="dhx_repeat_radio" type="radio" name="end" checked/>' + d.repeat_radio_end + '</label></div> <div><label><input class="dhx_repeat_radio" type="radio" name="end" />' + d.repeat_radio_end2 + '</label><input class="dhx_repeat_text" type="text" name="occurences_count" value="1" />' + d.repeat_text_occurences_count + '</div> <div><label><input class="dhx_repeat_radio" type="radio" name="end" />' + d.repeat_radio_end3 + '</label><input class="dhx_repeat_date" type="text" name="date_of_end" value="' + e.config.repeat_date_of_end + '" /></div> </div> </form> </div> </div>';
  }, _ds: {}, _get_form_node: function(a, s, _) {
    var r = a[s];
    if (!r)
      return null;
    if (r.nodeName)
      return r;
    if (r.length) {
      for (var d = 0; d < r.length; d++)
        if (r[d].value == _)
          return r[d];
    }
  }, _get_node_value: function(a, s, _) {
    var r = a[s];
    if (!r)
      return "";
    if (r.length) {
      if (_) {
        for (var d = [], l = 0; l < r.length; l++)
          r[l].checked && d.push(r[l].value);
        return d;
      }
      for (l = 0; l < r.length; l++)
        if (r[l].checked)
          return r[l].value;
    }
    return r.value ? _ ? [r.value] : r.value : void 0;
  }, _get_node_numeric_value: function(a, s) {
    return 1 * e.form_blocks.recurring._get_node_value(a, s) || 0;
  }, _set_node_value: function(a, s, _) {
    var r = a[s];
    if (r) {
      if (r.name == s)
        r.value = _;
      else if (r.length)
        for (var d = typeof _ == "object", l = 0; l < r.length; l++)
          (d || r[l].value == _) && (r[l].checked = d ? !!_[r[l].value] : !!_);
    }
  }, _init_set_value: function(a, s, _) {
    var r = e.form_blocks.recurring, d = r._get_node_value, l = r._set_node_value;
    e.form_blocks.recurring._ds = { start: _.start_date, end: _._end_date };
    var h = e.date.str_to_date(e.config.repeat_date, !1, !0), v = e.date.date_to_str(e.config.repeat_date), m = a.getElementsByTagName("FORM")[0], f = {};
    function c(g) {
      for (var b = 0; b < g.length; b++) {
        var w = g[b];
        if (w.name)
          if (f[w.name])
            if (f[w.name].nodeType) {
              var E = f[w.name];
              f[w.name] = [E, w];
            } else
              f[w.name].push(w);
          else
            f[w.name] = w;
      }
    }
    if (c(m.getElementsByTagName("INPUT")), c(m.getElementsByTagName("SELECT")), !e.config.repeat_date_of_end) {
      var u = e.date.date_to_str(e.config.repeat_date);
      e.config.repeat_date_of_end = u(e.date.add(e._currentDate(), 30, "day"));
    }
    l(f, "date_of_end", e.config.repeat_date_of_end);
    var p = function(g) {
      return e._lightbox.querySelector(`#${g}`) || { style: {} };
    };
    function y() {
      p("dhx_repeat_day").style.display = "none", p("dhx_repeat_week").style.display = "none", p("dhx_repeat_month").style.display = "none", p("dhx_repeat_year").style.display = "none", p("dhx_repeat_" + this.value).style.display = "", e.setLightboxSize();
    }
    function x(g, b) {
      var w = g.end;
      if (w.length)
        if (w[0].value && w[0].value != "on")
          for (var E = 0; E < w.length; E++)
            w[E].value == b && (w[E].checked = !0);
        else {
          var N = 0;
          switch (b) {
            case "no":
              N = 0;
              break;
            case "date_of_end":
              N = 2;
              break;
            default:
              N = 1;
          }
          w[N].checked = !0;
        }
      else
        w.value = b;
    }
    e.form_blocks.recurring._get_repeat_code = function(g) {
      var b = [d(f, "repeat")];
      for (S[b[0]](b, g); b.length < 5; )
        b.push("");
      var w = "", E = function(N) {
        var T = N.end;
        if (T.length) {
          for (var A = 0; A < T.length; A++)
            if (T[A].checked)
              return T[A].value && T[A].value != "on" ? T[A].value : A ? A == 2 ? "date_of_end" : "occurences_count" : "no";
        } else if (T.value)
          return T.value;
        return "no";
      }(f);
      return E == "no" ? (g.end = new Date(9999, 1, 1), w = "no") : E == "date_of_end" ? g.end = function(N) {
        var T = h(N);
        return e.config.include_end_by && (T = e.date.add(T, 1, "day")), T;
      }(d(f, "date_of_end")) : (e.transpose_type(b.join("_")), w = Math.max(1, d(f, "occurences_count")), g.end = e.date["add_" + b.join("_")](new Date(g.start), w + 0, { start_date: g.start }) || g.start), b.join("_") + "#" + w;
    };
    var S = { month: function(g, b) {
      var w = e.form_blocks.recurring._get_node_value, E = e.form_blocks.recurring._get_node_numeric_value;
      w(f, "month_type") == "d" ? (g.push(Math.max(1, E(f, "month_count"))), b.start.setDate(w(f, "month_day"))) : (g.push(Math.max(1, E(f, "month_count2"))), g.push(w(f, "month_day2")), g.push(Math.max(1, E(f, "month_week2"))), e.config.repeat_precise || b.start.setDate(1)), b._start = !0;
    }, week: function(g, b) {
      var w = e.form_blocks.recurring._get_node_value, E = e.form_blocks.recurring._get_node_numeric_value;
      g.push(Math.max(1, E(f, "week_count"))), g.push(""), g.push("");
      for (var N = [], T = w(f, "week_day", !0), A = b.start.getDay(), C = !1, $ = 0; $ < T.length; $++)
        N.push(T[$]), C = C || T[$] == A;
      N.length || (N.push(A), C = !0), N.sort(), e.config.repeat_precise ? C || (e.transpose_day_week(b.start, N, 1, 7), b._start = !0) : (b.start = e.date.week_start(b.start), b._start = !0), g.push(N.join(","));
    }, day: function(g) {
      var b = e.form_blocks.recurring._get_node_value, w = e.form_blocks.recurring._get_node_numeric_value;
      b(f, "day_type") == "d" ? g.push(Math.max(1, w(f, "day_count"))) : (g.push("week"), g.push(1), g.push(""), g.push(""), g.push(e.config.recurring_workdays.join(",")), g.splice(0, 1));
    }, year: function(g, b) {
      var w = e.form_blocks.recurring._get_node_value;
      w(f, "year_type") == "d" ? (g.push("1"), b.start.setMonth(0), b.start.setDate(w(f, "year_day")), b.start.setMonth(w(f, "year_month"))) : (g.push("1"), g.push(w(f, "year_day2")), g.push(w(f, "year_week2")), b.start.setDate(1), b.start.setMonth(w(f, "year_month2"))), b._start = !0;
    } }, k = { week: function(g, b) {
      var w = e.form_blocks.recurring._set_node_value;
      w(f, "week_count", g[1]);
      for (var E = g[4].split(","), N = {}, T = 0; T < E.length; T++)
        N[E[T]] = !0;
      w(f, "week_day", N);
    }, month: function(g, b) {
      var w = e.form_blocks.recurring._set_node_value;
      g[2] === "" ? (w(f, "month_type", "d"), w(f, "month_count", g[1]), w(f, "month_day", b.start.getDate())) : (w(f, "month_type", "w"), w(f, "month_count2", g[1]), w(f, "month_week2", g[3]), w(f, "month_day2", g[2]));
    }, day: function(g, b) {
      var w = e.form_blocks.recurring._set_node_value;
      w(f, "day_type", "d"), w(f, "day_count", g[1]);
    }, year: function(g, b) {
      var w = e.form_blocks.recurring._set_node_value;
      g[2] === "" ? (w(f, "year_type", "d"), w(f, "year_day", b.start.getDate()), w(f, "year_month", b.start.getMonth())) : (w(f, "year_type", "w"), w(f, "year_week2", g[3]), w(f, "year_day2", g[2]), w(f, "year_month2", b.start.getMonth()));
    } };
    e.form_blocks.recurring._set_repeat_code = function(g, b) {
      var w = e.form_blocks.recurring._set_node_value, E = g.split("#");
      switch (g = E[0].split("_"), k[g[0]](g, b), E[1]) {
        case "no":
          x(f, "no");
          break;
        case "":
          x(f, "date_of_end");
          var N = b.end;
          e.config.include_end_by && (N = e.date.add(N, -1, "day")), w(f, "date_of_end", v(N));
          break;
        default:
          x(f, "occurences_count"), w(f, "occurences_count", E[1]);
      }
      w(f, "repeat", g[0]);
      var T = e.form_blocks.recurring._get_form_node(f, "repeat", g[0]);
      T.nodeName == "SELECT" ? (T.dispatchEvent(new Event("change")), T.dispatchEvent(new MouseEvent("click"))) : T.dispatchEvent(new MouseEvent("click"));
    };
    for (var D = 0; D < m.elements.length; D++) {
      var M = m.elements[D];
      M.name === "repeat" && (M.nodeName != "SELECT" || M.$_eventAttached ? M.$_eventAttached || (M.$_eventAttached = !0, M.addEventListener("click", y)) : (M.$_eventAttached = !0, M.addEventListener("change", y)));
    }
    e._lightbox._rec_init_done = !0;
  }, set_value: function(a, s, _) {
    var r = e.form_blocks.recurring;
    e._lightbox._rec_init_done || r._init_set_value(a, s, _), a.open = !_.rec_type, a.blocked = this._is_modified_occurence(_);
    var d = r._ds;
    d.start = _.start_date, d.end = _._end_date, r._toggle_block(), s && r._set_repeat_code(s, d);
  }, get_value: function(a, s) {
    if (a.open) {
      var _ = e.form_blocks.recurring._ds, r = {};
      (function() {
        var d = e.formSection("time");
        if (d || (d = t("time")), d || (d = t("calendar_time")), !d)
          throw new Error(["Can't calculate the recurring rule, the Recurring form block can't find the Time control. Make sure you have the time control in 'scheduler.config.lightbox.sections' config.", "You can use either the default time control https://docs.dhtmlx.com/scheduler/time.html, or the datepicker https://docs.dhtmlx.com/scheduler/minicalendar.html, or a custom control. ", 'In the latter case, make sure the control is named "time":', "", "scheduler.config.lightbox.sections = [", '{name:"time", height:72, type:"YOU CONTROL", map_to:"auto" }];'].join(`
`));
        return d;
      })().getValue(r), _.start = r.start_date, s.rec_type = e.form_blocks.recurring._get_repeat_code(_), _._start ? (s.start_date = new Date(_.start), s._start_date = new Date(_.start), _._start = !1) : s._start_date = null, s._end_date = _.end, s.rec_pattern = s.rec_type.split("#")[0];
    } else
      s.rec_type = s.rec_pattern = "", s._end_date = s.end_date;
    return s.rec_type;
  }, _get_button: function() {
    return i().header.firstChild.firstChild;
  }, _get_form: function() {
    return i().node;
  }, open: function() {
    var a = e.form_blocks.recurring;
    a._get_form().open || a._toggle_block();
  }, close: function() {
    var a = e.form_blocks.recurring;
    a._get_form().open && a._toggle_block();
  }, _toggle_block: function() {
    var a = e.form_blocks.recurring, s = a._get_form(), _ = a._get_button();
    s.open || s.blocked ? (s.style.height = "0px", _ && (_.style.backgroundPosition = "-5px 20px", _.nextSibling.innerHTML = e.locale.labels.button_recurring)) : (s.style.height = "auto", _ && (_.style.backgroundPosition = "-5px 0px", _.nextSibling.innerHTML = e.locale.labels.button_recurring_open)), s.open = !s.open, e.setLightboxSize();
  }, focus: function(a) {
  }, button_click: function(a, s, _) {
    e.form_blocks.recurring._get_form().blocked || e.form_blocks.recurring._toggle_block();
  } }, e._rec_markers = {}, e._rec_markers_pull = {}, e._add_rec_marker = function(a, s) {
    a._pid_time = s, this._rec_markers[a.id] = a, this._rec_markers_pull[a.event_pid] || (this._rec_markers_pull[a.event_pid] = {}), this._rec_markers_pull[a.event_pid][s] = a;
  }, e._get_rec_marker = function(a, s) {
    var _ = this._rec_markers_pull[s];
    return _ ? _[a] : null;
  }, e._get_rec_markers = function(a) {
    return this._rec_markers_pull[a] || [];
  }, e._rec_temp = [], o = e.addEvent, e.addEvent = function(a, s, _, r, d) {
    var l = o.apply(this, arguments);
    if (l && e.getEvent(l)) {
      var h = e.getEvent(l);
      h.start_date && (h.start_date = n(h.start_date)), h.end_date && (h.end_date = n(h.end_date)), this._is_modified_occurence(h) && e._add_rec_marker(h, 1e3 * h.event_length), h.rec_type && (h.rec_pattern = h.rec_type.split("#")[0]);
    }
    return l;
  }, e.attachEvent("onEventIdChange", function(a, s) {
    if (!this._ignore_call) {
      this._ignore_call = !0, e._rec_markers[a] && (e._rec_markers[s] = e._rec_markers[a], delete e._rec_markers[a]), e._rec_markers_pull[a] && (e._rec_markers_pull[s] = e._rec_markers_pull[a], delete e._rec_markers_pull[a]);
      for (var _ = 0; _ < this._rec_temp.length; _++)
        (r = this._rec_temp[_]).event_pid == a && (r.event_pid = s, this.changeEventId(r.id, s + "#" + r.id.split("#")[1]));
      for (var _ in this._rec_markers) {
        var r;
        (r = this._rec_markers[_]).event_pid == a && (r.event_pid = s, r._pid_changed = !0);
      }
      var d = e._rec_markers[s];
      d && d._pid_changed && (delete d._pid_changed, setTimeout(function() {
        if (e.$destroyed)
          return !0;
        e.callEvent("onEventChanged", [s, e.getEvent(s)]);
      }, 1)), delete this._ignore_call;
    }
  }), e.attachEvent("onConfirmedBeforeEventDelete", function(a) {
    var s = this.getEvent(a);
    if (this._is_virtual_event(a) || this._is_modified_occurence(s) && s.rec_type && s.rec_type != "none") {
      a = a.split("#");
      var _ = this.uid(), r = a[1] ? a[1] : Math.round(s._pid_time / 1e3), d = this._copy_event(s);
      d.id = _, d.event_pid = s.event_pid || a[0];
      var l = r;
      d.event_length = l, d.rec_type = d.rec_pattern = "none", this.addEvent(d), this._add_rec_marker(d, 1e3 * l);
    } else {
      s.rec_type && this._lightbox_id && this._roll_back_dates(s);
      var h = this._get_rec_markers(a);
      for (var v in h)
        h.hasOwnProperty(v) && (a = h[v].id, this.getEvent(a) && this.deleteEvent(a, !0));
    }
    return !0;
  }), e.attachEvent("onEventDeleted", function(a, s) {
    !this._is_virtual_event(a) && this._is_modified_occurence(s) && (e._events[a] || (s.rec_type = s.rec_pattern = "none", this.setEvent(a, s)));
  }), e.attachEvent("onEventChanged", function(a, s) {
    if (this._loading)
      return !0;
    var _ = this.getEvent(a);
    if (this._is_virtual_event(a)) {
      a = a.split("#");
      var r = this.uid();
      this._not_render = !0;
      var d = this._copy_event(s);
      d.id = r, d.event_pid = a[0];
      var l = a[1];
      d.event_length = l, d.rec_type = d.rec_pattern = "", this._add_rec_marker(d, 1e3 * l), this.addEvent(d), this._not_render = !1;
    } else {
      _.start_date && (_.start_date = n(_.start_date)), _.end_date && (_.end_date = n(_.end_date)), _.rec_type && this._lightbox_id && this._roll_back_dates(_);
      var h = this._get_rec_markers(a);
      for (var v in h)
        h.hasOwnProperty(v) && (delete this._rec_markers[h[v].id], this.deleteEvent(h[v].id, !0));
      delete this._rec_markers_pull[a];
      for (var m = !1, f = 0; f < this._rendered.length; f++)
        this._rendered[f].getAttribute(this.config.event_attribute) == a && (m = !0);
      m || (this._select_id = null);
    }
    return !0;
  }), e.attachEvent("onEventAdded", function(a) {
    if (!this._loading) {
      var s = this.getEvent(a);
      s.rec_type && !s.event_length && this._roll_back_dates(s);
    }
    return !0;
  }), e.attachEvent("onEventSave", function(a, s, _) {
    return this.getEvent(a).rec_type || !s.rec_type || this._is_virtual_event(a) || (this._select_id = null), !0;
  }), e.attachEvent("onEventCreated", function(a) {
    var s = this.getEvent(a);
    return s.rec_type || (s.rec_type = s.rec_pattern = s.event_length = s.event_pid = ""), !0;
  }), e.attachEvent("onEventCancel", function(a) {
    var s = this.getEvent(a);
    s.rec_type && (this._roll_back_dates(s), this.render_view_data());
  }), e._roll_back_dates = function(a) {
    a.start_date && (a.start_date = n(a.start_date)), a.end_date && (a.end_date = n(a.end_date)), a.event_length = Math.round((a.end_date.valueOf() - a.start_date.valueOf()) / 1e3), a.end_date = a._end_date, a._start_date && (a.start_date.setMonth(0), a.start_date.setDate(a._start_date.getDate()), a.start_date.setMonth(a._start_date.getMonth()), a.start_date.setFullYear(a._start_date.getFullYear()));
  }, e._is_virtual_event = function(a) {
    return a.toString().indexOf("#") != -1;
  }, e._is_modified_occurence = function(a) {
    return a.event_pid && a.event_pid != "0";
  }, e.showLightbox_rec = e.showLightbox, e.showLightbox = function(a) {
    var s = this.locale, _ = e.config.lightbox_recurring, r = this.getEvent(a), d = r.event_pid, l = this._is_virtual_event(a);
    l && (d = a.split("#")[0]);
    var h = function(m) {
      var f = e.getEvent(m);
      return f._end_date = f.end_date, f.end_date = new Date(f.start_date.valueOf() + 1e3 * f.event_length), e.showLightbox_rec(m);
    };
    if ((d || 1 * d == 0) && r.rec_type)
      return h(a);
    if (!d || d === "0" || !s.labels.confirm_recurring || _ == "instance" || _ == "series" && !l)
      return this.showLightbox_rec(a);
    if (_ == "ask") {
      var v = this;
      e.modalbox({ text: s.labels.confirm_recurring, title: s.labels.title_confirm_recurring, width: "500px", position: "middle", buttons: [s.labels.button_edit_series, s.labels.button_edit_occurrence, s.labels.icon_cancel], callback: function(m) {
        switch (+m) {
          case 0:
            return h(d);
          case 1:
            return v.showLightbox_rec(a);
          case 2:
            return;
        }
      } });
    } else
      h(d);
  }, e.get_visible_events_rec = e.get_visible_events, e.get_visible_events = function(a) {
    for (var s = 0; s < this._rec_temp.length; s++)
      delete this._events[this._rec_temp[s].id];
    this._rec_temp = [];
    var _ = this.get_visible_events_rec(a), r = [];
    for (s = 0; s < _.length; s++)
      _[s].rec_type ? _[s].rec_pattern != "none" && this.repeat_date(_[s], r) : r.push(_[s]);
    return r;
  }, function() {
    var a = e.isOneDayEvent;
    e.isOneDayEvent = function(_) {
      return !!_.rec_type || a.call(this, _);
    };
    var s = e.updateEvent;
    e.updateEvent = function(_) {
      var r = e.getEvent(_);
      r && r.rec_type && (r.rec_pattern = (r.rec_type || "").split("#")[0]), r && r.rec_type && !this._is_virtual_event(_) ? e.update_view() : s.call(this, _);
    };
  }(), e.transponse_size = { day: 1, week: 7, month: 1, year: 12 }, e.date.day_week = function(a, s, _) {
    a.setDate(1);
    var r = e.date.month_start(new Date(a)), d = 1 * s + (_ = 7 * (_ - 1)) - a.getDay() + 1;
    a.setDate(d <= _ ? d + 7 : d);
    var l = e.date.month_start(new Date(a));
    return r.valueOf() === l.valueOf();
  }, e.transpose_day_week = function(a, s, _, r, d) {
    for (var l = (a.getDay() || (e.config.start_on_monday ? 7 : 0)) - _, h = 0; h < s.length; h++)
      if (s[h] > l)
        return a.setDate(a.getDate() + 1 * s[h] - l - (r ? _ : d));
    this.transpose_day_week(a, s, _ + r, null, _);
  }, e.transpose_type = function(a) {
    var s = "transpose_" + a;
    if (!this.date[s]) {
      var _ = a.split("_"), r = "add_" + a, d = this.transponse_size[_[0]] * _[1];
      if (_[0] == "day" || _[0] == "week") {
        var l = null;
        if (_[4] && (l = _[4].split(","), e.config.start_on_monday)) {
          for (var h = 0; h < l.length; h++)
            l[h] = 1 * l[h] || 7;
          l.sort();
        }
        this.date[s] = function(v, m) {
          var f = Math.floor((m.valueOf() - v.valueOf()) / (864e5 * d));
          return f > 0 && v.setDate(v.getDate() + f * d), l && e.transpose_day_week(v, l, 1, d), v;
        }, this.date[r] = function(v, m) {
          var f = new Date(v.valueOf());
          if (l)
            for (var c = 0; c < m; c++)
              e.transpose_day_week(f, l, 0, d);
          else
            f.setDate(f.getDate() + m * d);
          return f;
        };
      } else
        _[0] != "month" && _[0] != "year" || (this.date[s] = function(v, m, f) {
          var c = Math.ceil((12 * m.getFullYear() + 1 * m.getMonth() + 1 - (12 * v.getFullYear() + 1 * v.getMonth() + 1)) / d - 1);
          return c >= 0 && (v.setDate(1), v.setMonth(v.getMonth() + c * d)), e.date[r](v, 0, f);
        }, this.date[r] = function(v, m, f, c) {
          if (c ? c++ : c = 1, c > 12)
            return null;
          var u = new Date(v.valueOf());
          u.setDate(1), u.setMonth(u.getMonth() + m * d);
          var p = u.getMonth(), y = u.getFullYear();
          u.setDate(f.start_date.getDate()), _[3] && e.date.day_week(u, _[2], _[3]);
          var x = e.config.recurring_overflow_instances;
          return u.getMonth() != p && x != "none" && (u = x === "lastDay" ? new Date(y, p + 1, 0, u.getHours(), u.getMinutes(), u.getSeconds(), u.getMilliseconds()) : e.date[r](new Date(y, p + 1, 0), m || 1, f, c)), u;
        });
    }
  }, e.repeat_date = function(a, s, _, r, d, l) {
    r = r || this._min_date, d = d || this._max_date;
    var h = l || -1, v = new Date(a.start_date.valueOf()), m = v.getHours(), f = 0;
    for (!a.rec_pattern && a.rec_type && (a.rec_pattern = a.rec_type.split("#")[0]), this.transpose_type(a.rec_pattern), v = e.date["transpose_" + a.rec_pattern](v, r, a); v && (v < a.start_date || e._fix_daylight_saving_date(v, r, a, v, new Date(v.valueOf() + 1e3 * a.event_length)).valueOf() <= r.valueOf() || v.valueOf() + 1e3 * a.event_length <= r.valueOf()); )
      v = this.date["add_" + a.rec_pattern](v, 1, a);
    for (; v && v < d && v < a.end_date && (h < 0 || f < h); ) {
      v.setHours(m);
      var c = e.config.occurrence_timestamp_in_utc ? Date.UTC(v.getFullYear(), v.getMonth(), v.getDate(), v.getHours(), v.getMinutes(), v.getSeconds()) : v.valueOf(), u = this._get_rec_marker(c, a.id);
      if (u)
        _ && (u.rec_type != "none" && f++, s.push(u));
      else {
        var p = new Date(v.valueOf() + 1e3 * a.event_length), y = this._copy_event(a);
        if (y.text = a.text, y.start_date = v, y.event_pid = a.id, y.id = a.id + "#" + Math.round(c / 1e3), y.end_date = p, y.end_date = e._fix_daylight_saving_date(y.start_date, y.end_date, a, v, y.end_date), y._timed = this.isOneDayEvent(y), !y._timed && !this._table_view && !this.config.multi_day)
          return;
        s.push(y), _ || (this._events[y.id] = y, this._rec_temp.push(y)), f++;
      }
      v = this.date["add_" + a.rec_pattern](v, 1, a);
    }
  }, e._fix_daylight_saving_date = function(a, s, _, r, d) {
    var l = a.getTimezoneOffset() - s.getTimezoneOffset();
    return l ? l > 0 ? new Date(r.valueOf() + 1e3 * _.event_length - 60 * l * 1e3) : new Date(s.valueOf() - 60 * l * 1e3) : new Date(d.valueOf());
  }, e.getRecDates = function(a, s) {
    var _ = typeof a == "object" ? a : e.getEvent(a), r = [];
    if (s = s || 100, !_.rec_type)
      return [{ start_date: _.start_date, end_date: _.end_date }];
    if (_.rec_type == "none")
      return [];
    e.repeat_date(_, r, !0, _.start_date, _.end_date, s);
    for (var d = [], l = 0; l < r.length; l++)
      r[l].rec_type != "none" && d.push({ start_date: r[l].start_date, end_date: r[l].end_date });
    return d;
  }, e.getEvents = function(a, s) {
    var _ = [];
    for (var r in this._events) {
      var d = this._events[r];
      if (d && d.start_date < s && d.end_date > a)
        if (d.rec_pattern) {
          if (d.rec_pattern == "none")
            continue;
          var l = [];
          this.repeat_date(d, l, !0, a, s);
          for (var h = 0; h < l.length; h++)
            !l[h].rec_pattern && l[h].start_date < s && l[h].end_date > a && !this._rec_markers[l[h].id] && _.push(l[h]);
        } else
          this._is_virtual_event(d.id) || _.push(d);
    }
    return _;
  }, e.config.repeat_date = "%m.%d.%Y", e.config.lightbox.sections = [{ name: "description", map_to: "text", type: "textarea", focus: !0 }, { name: "recurring", type: "recurring", map_to: "rec_type", button: "recurring" }, { name: "time", height: 72, type: "time", map_to: "auto" }], e._copy_dummy = function(a) {
    var s = new Date(this.start_date), _ = new Date(this.end_date);
    this.start_date = s, this.end_date = _, this.event_length = this.event_pid = this.rec_pattern = this.rec_type = null;
  }, e.config.include_end_by = !1, e.config.lightbox_recurring = "ask", e.attachEvent("onClearAll", function() {
    e._rec_markers = {}, e._rec_markers_pull = {}, e._rec_temp = [];
  });
}, serialize: function(e) {
  const i = mt(e);
  e.data_attributes = function() {
    var t = [], n = e._helpers.formatDate, o = i();
    for (var a in o) {
      var s = o[a];
      for (var _ in s)
        _.substr(0, 1) != "_" && t.push([_, _ == "start_date" || _ == "end_date" ? n : null]);
      break;
    }
    return t;
  }, e.toXML = function(t) {
    var n = [], o = this.data_attributes(), a = i();
    for (var s in a) {
      var _ = a[s];
      n.push("<event>");
      for (var r = 0; r < o.length; r++)
        n.push("<" + o[r][0] + "><![CDATA[" + (o[r][1] ? o[r][1](_[o[r][0]]) : _[o[r][0]]) + "]]></" + o[r][0] + ">");
      n.push("</event>");
    }
    return (t || "") + "<data>" + n.join(`
`) + "</data>";
  }, e._serialize_json_value = function(t) {
    return t === null || typeof t == "boolean" ? t = "" + t : (t || t === 0 || (t = ""), t = '"' + t.toString().replace(/\n/g, "").replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'), t;
  }, e.toJSON = function() {
    return JSON.stringify(this.serialize());
  }, e.toICal = function(t) {
    var n = e.date.date_to_str("%Y%m%dT%H%i%s"), o = e.date.date_to_str("%Y%m%d"), a = [], s = i();
    for (var _ in s) {
      var r = s[_];
      a.push("BEGIN:VEVENT"), r._timed && (r.start_date.getHours() || r.start_date.getMinutes()) ? a.push("DTSTART:" + n(r.start_date)) : a.push("DTSTART:" + o(r.start_date)), r._timed && (r.end_date.getHours() || r.end_date.getMinutes()) ? a.push("DTEND:" + n(r.end_date)) : a.push("DTEND:" + o(r.end_date)), a.push("SUMMARY:" + r.text), a.push("END:VEVENT");
    }
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//dhtmlXScheduler//NONSGML v2.2//EN
DESCRIPTION:` + (t || "") + `
` + a.join(`
`) + `
END:VCALENDAR`;
  };
}, timeline: function(e) {
  he("Timeline", e.assert);
}, tooltip: function(e) {
  e.config.tooltip_timeout = 30, e.config.tooltip_offset_y = 20, e.config.tooltip_offset_x = 10, e.config.tooltip_hide_timeout = 30;
  const i = new gn(e);
  e.ext.tooltips = i, e.attachEvent("onSchedulerReady", function() {
    i.tooltipFor({ selector: "[" + e.config.event_attribute + "]", html: (t) => {
      if (e._mobile && !e.config.touch_tooltip)
        return;
      const n = e._locate_event(t.target);
      if (e.getEvent(n)) {
        const o = e.getEvent(n);
        return e.templates.tooltip_text(o.start_date, o.end_date, o);
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
  he("Tree Timeline", e.assert);
}, units: function(e) {
  he("Units", e.assert);
}, url: function(e) {
  e._get_url_nav = function() {
    for (var i = {}, t = (document.location.hash || "").replace("#", "").split(","), n = 0; n < t.length; n++) {
      var o = t[n].split("=");
      o.length == 2 && (i[o[0]] = o[1]);
    }
    return i;
  }, e.attachEvent("onTemplatesReady", function() {
    var i = !0, t = e.date.str_to_date("%Y-%m-%d"), n = e.date.date_to_str("%Y-%m-%d"), o = e._get_url_nav().event || null;
    function a(s) {
      if (e.$destroyed)
        return !0;
      o = s, e.getEvent(s) && e.showEvent(s);
    }
    e.attachEvent("onAfterEventDisplay", function(s) {
      return o = null, !0;
    }), e.attachEvent("onBeforeViewChange", function(s, _, r, d) {
      if (i) {
        i = !1;
        var l = e._get_url_nav();
        if (l.event)
          try {
            if (e.getEvent(l.event))
              return setTimeout(function() {
                a(l.event);
              }), !1;
            var h = e.attachEvent("onXLE", function() {
              setTimeout(function() {
                a(l.event);
              }), e.detachEvent(h);
            });
          } catch {
          }
        if (l.date || l.mode) {
          try {
            this.setCurrentView(l.date ? t(l.date) : null, l.mode || null);
          } catch {
            this.setCurrentView(l.date ? t(l.date) : null, r);
          }
          return !1;
        }
      }
      var v = ["date=" + n(d || _), "mode=" + (r || s)];
      o && v.push("event=" + o);
      var m = "#" + v.join(",");
      return document.location.hash = m, !0;
    });
  });
}, week_agenda: function(e) {
  he("Week Agenda", e.assert);
}, wp: function(e) {
  e.attachEvent("onLightBox", function() {
    if (this._cover)
      try {
        this._cover.style.height = this.expanded ? "100%" : (document.body.parentNode || document.body).scrollHeight + "px";
      } catch {
      }
  }), e.form_blocks.select.set_value = function(i, t, n) {
    t !== void 0 && t !== "" || (t = (i.firstChild.options[0] || {}).value), i.firstChild.value = t || "";
  };
}, year_view: function(e) {
  e.templates.year_date = function(_) {
    return e.date.date_to_str(e.locale.labels.year_tab + " %Y")(_);
  }, e.templates.year_month = e.date.date_to_str("%F"), e.templates.year_scale_date = e.date.date_to_str("%D"), e.templates.year_tooltip = function(_, r, d) {
    return d.text;
  };
  const i = function() {
    return e._mode == "year";
  }, t = function(_) {
    var r = e.$domHelpers.closest(_, "[data-cell-date]");
    return r && r.hasAttribute("data-cell-date") ? e.templates.parse_date(r.getAttribute("data-cell-date")) : null;
  };
  e.dblclick_dhx_year_grid = function(_) {
    if (i()) {
      const r = _.target;
      if (e.$domHelpers.closest(r, ".dhx_before") || e.$domHelpers.closest(r, ".dhx_after"))
        return !1;
      const d = t(r);
      if (d) {
        const l = d, h = this.date.add(l, 1, "day");
        !this.config.readonly && this.config.dblclick_create && this.addEventNow(l.valueOf(), h.valueOf(), _);
      }
    }
  }, e.attachEvent("onEventIdChange", function() {
    i() && this.year_view(!0);
  });
  var n = e.render_data;
  e.render_data = function(_) {
    if (!i())
      return n.apply(this, arguments);
    for (var r = 0; r < _.length; r++)
      this._year_render_event(_[r]);
  };
  var o = e.clear_view;
  e.clear_view = function() {
    if (!i())
      return o.apply(this, arguments);
    var _ = e._year_marked_cells;
    for (var r in _)
      _.hasOwnProperty(r) && _[r].classList.remove("dhx_year_event", "dhx_cal_datepicker_event");
    e._year_marked_cells = {};
  }, e._hideToolTip = function() {
    this._tooltip && (this._tooltip.style.display = "none", this._tooltip.date = new Date(9999, 1, 1));
  }, e._showToolTip = function(_, r, d, l) {
    if (this._tooltip) {
      if (this._tooltip.date.valueOf() == _.valueOf())
        return;
      this._tooltip.innerHTML = "";
    } else {
      var h = this._tooltip = document.createElement("div");
      h.className = "dhx_year_tooltip", this.config.rtl && (h.className += " dhx_tooltip_rtl"), document.body.appendChild(h), h.addEventListener("click", e._click.dhx_cal_data), h.addEventListener("click", function(y) {
        if (y.target.closest(`[${e.config.event_attribute}]`)) {
          const x = y.target.closest(`[${e.config.event_attribute}]`).getAttribute(e.config.event_attribute);
          e.showLightbox(x);
        }
      });
    }
    for (var v = this.getEvents(_, this.date.add(_, 1, "day")), m = "", f = 0; f < v.length; f++) {
      var c = v[f];
      if (this.filter_event(c.id, c)) {
        var u = c.color ? "--dhx-scheduler-event-background:" + c.color + ";" : "", p = c.textColor ? "--dhx-scheduler-event-color:" + c.textColor + ";" : "";
        m += "<div class='dhx_tooltip_line' style='" + u + p + "' event_id='" + v[f].id + "' " + this.config.event_attribute + "='" + v[f].id + "'>", m += "<div class='dhx_tooltip_date' style='" + u + p + "'>" + (v[f]._timed ? this.templates.event_date(v[f].start_date) : "") + "</div>", m += "<div class='dhx_event_icon icon_details'>&nbsp;</div>", m += this.templates.year_tooltip(v[f].start_date, v[f].end_date, v[f]) + "</div>";
      }
    }
    this._tooltip.style.display = "", this._tooltip.style.top = "0px", document.body.offsetWidth - r.left - this._tooltip.offsetWidth < 0 ? this._tooltip.style.left = r.left - this._tooltip.offsetWidth + "px" : this._tooltip.style.left = r.left + l.offsetWidth + "px", this._tooltip.date = _, this._tooltip.innerHTML = m, document.body.offsetHeight - r.top - this._tooltip.offsetHeight < 0 ? this._tooltip.style.top = r.top - this._tooltip.offsetHeight + l.offsetHeight + "px" : this._tooltip.style.top = r.top + "px";
  }, e._year_view_tooltip_handler = function(_) {
    if (i()) {
      var r = _.target || _.srcElement;
      r.tagName.toLowerCase() == "a" && (r = r.parentNode), e._getClassName(r).indexOf("dhx_year_event") != -1 ? e._showToolTip(e.templates.parse_date(r.getAttribute("data-year-date")), e.$domHelpers.getOffset(r), _, r) : e._hideToolTip();
    }
  }, e._init_year_tooltip = function() {
    e._detachDomEvent(e._els.dhx_cal_data[0], "mouseover", e._year_view_tooltip_handler), e.event(e._els.dhx_cal_data[0], "mouseover", e._year_view_tooltip_handler);
  }, e._get_year_cell = function(_) {
    for (var r = e.templates.format_date(_), d = this.$root.querySelectorAll(`.dhx_cal_data .dhx_cal_datepicker_date[data-cell-date="${r}"]`), l = 0; l < d.length; l++)
      if (!e.$domHelpers.closest(d[l], ".dhx_after, .dhx_before"))
        return d[l];
    return null;
  }, e._year_marked_cells = {}, e._mark_year_date = function(_, r) {
    var d = e.templates.format_date(_), l = this._get_year_cell(_);
    if (l) {
      var h = this.templates.event_class(r.start_date, r.end_date, r);
      e._year_marked_cells[d] || (l.classList.add("dhx_year_event", "dhx_cal_datepicker_event"), l.setAttribute("data-year-date", d), l.setAttribute("date", d), e._year_marked_cells[d] = l), h && l.classList.add(h);
    }
  }, e._unmark_year_date = function(_) {
    var r = this._get_year_cell(_);
    r && r.classList.remove("dhx_year_event", "dhx_cal_datepicker_event");
  }, e._year_render_event = function(_) {
    var r = _.start_date;
    for (r = r.valueOf() < this._min_date.valueOf() ? this._min_date : this.date.date_part(new Date(r)); r < _.end_date; )
      if (this._mark_year_date(r, _), (r = this.date.add(r, 1, "day")).valueOf() >= this._max_date.valueOf())
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
    var _ = this._els.dhx_cal_data[0];
    _.scrollTop = 0, _.innerHTML = "";
    let r = this.date.year_start(new Date(this._date));
    this._min_date = this.date.week_start(new Date(r));
    const d = document.createElement("div");
    d.classList.add("dhx_year_wrapper");
    let l = r;
    for (let m = 0; m < 12; m++) {
      let f = document.createElement("div");
      f.className = "dhx_year_box", f.setAttribute("date", this._helpers.formatDate(l)), f.setAttribute("data-month-date", this._helpers.formatDate(l)), f.innerHTML = `<div class='dhx_year_month'>${this.templates.year_month(l)}</div>
			<div class='dhx_year_grid'></div>`;
      const c = f.querySelector(".dhx_year_grid"), u = e._createDatePicker(null, { date: l, filterDays: e.ignore_year, minWeeks: 6 });
      u._renderDayGrid(c), u.destructor(), d.appendChild(f), l = this.date.add(l, 1, "month");
    }
    _.appendChild(d);
    let h = this.date.add(r, 1, "year");
    h.valueOf() != this.date.week_start(new Date(h)).valueOf() && (h = this.date.week_start(new Date(h)), h = this.date.add(h, 1, "week")), this._max_date = h;
    var v = this._getNavDateElement();
    v && (v.innerHTML = this.templates[this._mode + "_date"](r, h, this._mode));
  };
  var a = e.getActionData;
  e.getActionData = function(_) {
    return i() ? { date: t(_.target), section: null } : a.apply(e, arguments);
  };
  var s = e._locate_event;
  e._locate_event = function(_) {
    var r = s.apply(e, arguments);
    if (!r) {
      var d = t(_);
      if (!d)
        return null;
      var l = e.getEvents(d, e.date.add(d, 1, "day"));
      if (!l.length)
        return null;
      r = l[0].id;
    }
    return r;
  }, e.attachEvent("onDestroy", function() {
    e._hideToolTip();
  });
} }, Ye = new class {
  constructor(e) {
    this._seed = 0, this._schedulerPlugins = [], this._bundledExtensions = e, this._extensionsManager = new Ta(e);
  }
  plugin(e) {
    this._schedulerPlugins.push(e), le.scheduler && e(le.scheduler);
  }
  getSchedulerInstance(e) {
    for (var i = Na(this._extensionsManager), t = 0; t < this._schedulerPlugins.length; t++)
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
}(yn), Ue = Ye.getSchedulerInstance(), ut = { plugin: Ue.bind(Ye.plugin, Ye) };
window.scheduler = Ue, window.Scheduler = ut, window.$dhx || (window.$dhx = {}), window.$dhx.scheduler = Ue, window.$dhx.Scheduler = ut;
export {
  ut as Scheduler,
  Ue as default,
  Ue as scheduler
};
//# sourceMappingURL=dhtmlxscheduler.es.js.map
