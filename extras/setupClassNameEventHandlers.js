/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';
  function rt(opt, ev) {
    var tgt = ev.target, tn = (tgt || false).tagName, cls, fun;
    if (!tn) { return; }
    cls = /\S+/.exec(tgt.className || '');
    if (!cls) { return; }
    cls = cls[0];
    fun = ((opt.cbPrefix || '') + tn.toLowerCase()
      + '_' + cls.replace(/\-/g, '_') + '_' + ev.type);
    fun = (opt[fun] || opt.unrouted);
    if (!fun) { return; }
    ev.clsTrig = cls;
    ev.clsFunc = fun;
    if (ev.clientX !== undefined) {
      ev.elemBounds = tgt.getBoundingClientRect();
      ev.elemX = ev.clientX - ev.elemBounds.left;
      ev.elemY = ev.clientY - ev.elemBounds.top;
    }
    return fun.call(tgt, ev);
  }
  window.setupClassNameEventHandlers = function setup(opt, on) {
    var tgt = opt.hookOnto, cb;
    if (!on) { on = (opt.on || {}); }
    if (on === '=') { on = opt; }
    cb = rt.bind(null, on);
    cb.on = on;
    function inst(m) { tgt['on' + m] = cb; }
    if (tgt) { String(opt.events || '').replace(/\w+/g, inst); }
    return cb;
  };
}());
