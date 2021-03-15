/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';

  var setup = function setupClassNameEventHandlers(opt, on) {
    var tgt = opt.hookOnto, cb;
    if (!on) { on = (opt.on || {}); }
    if (on === '=') { on = opt; }
    cb = setup.rt.bind(null, on);
    cb.on = on;
    function inst(m) { tgt['on' + m] = cb; }
    if (tgt) { String(opt.events || '').replace(/\w+/g, inst); }
    return cb;
  };

  setup.verbose = false;

  setup.rt = function rt(opt, ev) {
    var tgt = ev.target, tn = (tgt || false).tagName, cls, fun, late;
    if (!tn) { return; }
    cls = /\S+/.exec(tgt.className || '');
    if (!cls) { return; }
    cls = cls[0];
    if (ev.clientX !== undefined) {
      ev.elemBounds = tgt.getBoundingClientRect();
      ev.elemX = ev.clientX - ev.elemBounds.left;
      ev.elemY = ev.clientY - ev.elemBounds.top;
    }
    tn = tn.toLowerCase();
    ev.lcTag = tn;
    ev.clsTrig = cls;
    fun = ((opt.cbPrefix || '') + tn + '_'
      + cls.replace(/\-/g, '_') + '_' + ev.type);
    late = (opt[fun + 'Late'] || opt.unroutedLate);
    fun = (opt[fun] || opt.unrouted);
    ev.clsFunc = fun;
    if (setup.verbose) { console.log(setup.name, ev); }
    if (late) { setTimeout(late.bind(tgt, ev), 1); }
    if (!fun) { return; }
    return fun.call(tgt, ev);
  };

  window[setup.name] = setup;
}());
