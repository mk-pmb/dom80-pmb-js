/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';

  var setup = function setupClassNameEventHandlers(opt, on) {
    var tgt = opt.hookOnto, D = (opt.dom80 || window.dom80pmb), cb;
    if (!on) { on = (opt.on || {}); }
    if (on === '=') { on = opt; }
    cb = setup.rt.bind(null, D, on);
    cb.on = on;
    function inst(m) { tgt['on' + m] = cb; }
    if (tgt) { String(opt.events || '').replace(/\w+/g, inst); }
    return cb;
  };

  setup.verbose = false;

  setup.rt = function rt(D, on, ev) {
    var tgt = ev.target, fun, late;
    D.upgradeEvent(ev);
    if (!(ev.lcTag && ev.cls1)) { return; }
    fun = ((on.cbPrefix || '') + ev.lcTag + '_'
      + ev.cls1.replace(/\-/g, '_') + '_' + ev.type);
    late = (on[fun + 'Late'] || on.unroutedLate);
    fun = (on[fun] || on.unrouted);
    ev.clsFunc = fun;
    if (setup.verbose) { console.log(setup.name, ev); }
    if (late) { setTimeout(late.bind(tgt, ev), 1); }
    if (!fun) { return; }
    return fun.call(tgt, ev);
  };

  window[setup.name] = setup;
}());
