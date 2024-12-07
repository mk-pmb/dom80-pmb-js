/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, browser: true */
/*globals define:true*/
(function () {
  'use strict';
  var win, doc,
    bindCall = Function.bind.bind(Function.call),
    emArr = [];

  // The following typeofs cannot be replaced by D.ifObj because noddejs
  // will throw "ReferenceError: document is not defined" when trying to
  // evaluate the arguments for the function call.
  win = ((typeof window === 'object') && window);
  doc = ((typeof document === 'object') && document);

  function idty(x) { return x; }
  function orf(x) { return (x || false); }
  function ores(x) { return (x || ''); }
  function num0(x) { return (+x || 0); }

  function D(x, a) {
    if (!x) { return false; }
    if (x.substr) {
      a = x.substr(0, 1);
      if (a === '#') { return orf(doc.getElementById(x.slice(1))); }
      if (a === '.') { return D.arSlc(doc.getElementsByClassName(x.slice(1))); }
      return D.arSlc(doc.getElementsByTagName(x));
    }
    throw new Error('Unsupported invocation');
  }

  D.obAss = Object.assign;
  D.arLast = function (a, n) { return a[a.length - (n || 1)]; };
  D.arSlc = bindCall(emArr.slice);
  D.arMap = bindCall(emArr.map);
  D.arRed = bindCall(emArr.reduce);
  D.arXzy = function (x, y, z) { return emArr.concat(x, z, y); };
  D.mapIfF = function (a, f) { return (f ? a.map(f) : a); };
  D.arg21 = function (f) { return function (a, b) { return f(b, a); }; };
  D.conArS = function (a, b, s) { return a.concat(D.arSlc(b, s || 0)); };
  D.concatIf = function (a, b) { return ((a && b) ? a.concat(b) : (a || b)); };
  D.arg2this = function (f) { return function g(x) { return f.call(x); }; };
  D.argGetter = function (k) { return function (x) { return x[k]; }; };
  D.ctxGetter = function (k) { return function () { return this[k]; }; };
  D.hasOwn = Function.call.bind(Object.prototype.hasOwnProperty);
  D.getOwn = function getOwn(o, k, d) { return D.hasOwn(o, k) ? o[k] : d; };
  D.getOwn.voc = function (d, k) { return D.getOwn(d, k, k); };

  D.arSeq = function arSeq(a) {
    var i = -1;
    function nx() {
      i += 1;
      nx.done = (i >= a.length);
      nx.cur = a[i];
      return nx.cur;
    }
    nx();
    return nx;
  };

  D.fif = function (f, x) { return (f ? f(x) : x); };
  D.eqf = function (y) { return function (x) { return (x === y); }; };
  D.feqf = function (f, y) { return function (x) { return (f(x) === y); }; };
  D.lcStr = function (s) { return String(s || '').toLowerCase(); };
  D.eqfLc = D.feqf.bind(null, D.lcStr);
  D.rxpl = function (s, r, w) { return ores(s).replace(r, ores(w)); };

  D.tag = D;
  D.mkTxt = function (tx) { return doc.createTextNode(tx); };
  D.mkTag = function (tn) { return doc.createElement(tn); };
  D.lcTag = function (e) { return D.lcStr(ores(orf(e).tagName)); };
  D.parTag = function (el) { return orf(orf(el).parentNode); };
  D.rmTag = function (e) {
    var p = D.parTag(e);
    if (p) { p.removeChild(e); }
    return e;
  };
  D.body = (doc && (doc.body || D.tag('body')[0]));
  D.head = (doc && (doc.head || D.tag('head')[0]));
  D.root = (doc && (doc.documentElement || D.parTag(D.body)));
  D.title = (doc && D.tag('title')[0]);
  D.insBef = function (n, o) { o.parentNode.insertBefore(n, o); };

  D.apnd = function (par, el) {
    par.appendChild(el);
    return par;
  };

  D.apnd2 = function (el, par) {
    par.appendChild(el);
    return el;
  };

  D.mkTagC = (function prepare() {
    var tagNameRx = /^([\w:\-]+)/, fx;
    function mkTagC(spec, opt) {
      if (!opt) { return mkTagC(spec, true); }
      spec = ores(spec);
      spec = spec.split(tagNameRx);
      var el = spec[1], par = orf(opt.parent);
      if (el === ':') {
        el = D.mkTxt(spec[2].replace(/^\s/, ''));
        if (par) { par.appendChild(el); }
        return el;
      }
      el = D.mkTag(el || opt.defaultTagName
        || D.getOwn.voc({ html: '', body: '' }, D.lcTag(par))
        || 'div');
      spec = ores(spec[2] || spec[0]).split(/\s+/);
      spec.forEach(function applyFx(s) {
        if (!s) { return; }
        fx[s.slice(0, 1)](s.slice(1), el, opt);
      });
      if (el.className) { el.className = el.className.replace(/\s+$/, ''); }
      if (par) { par.appendChild(el); }
      return el;
    }
    fx = {
      '.': function (s, el) { el.className += s + ' '; },
      '#': function (s, el) { el.id = s; },
      '$': function (s, el, opt) { opt.refs[s] = el; },
      '=': function (s, el) {
        s = s.split(tagNameRx);
        el.setAttribute(s[1] || s[0], (s[2] || '').slice(1));
      },
    };
    mkTagC.fx = fx;
    return mkTagC;
  }());

  D.skel = (function prepare() {
    function addSiblingImpl(par, refs, addChildren, youngestSibling, spec) {
      if (!spec) { return; }
      if (spec.appendChild) { return D.apnd2(spec, par); }
      if (spec.forEach) {
        if (!youngestSibling) { throw new Error('Cannot create orphans!'); }
        addChildren(youngestSibling, spec);
        return;
      }
      return D.mkTagC(spec, { parent: par, refs: refs });
    }
    function skel(root, blueprint) {
      var refs = {}, sprout;
      function addChildren(par, sub) {
        var youngestSibling, newSib;
        emArr.concat(sub).forEach(function addSibling(spec) {
          newSib = addSiblingImpl(par, refs, addChildren,
            youngestSibling, spec);
          if (!newSib) { return; }
          youngestSibling = newSib;
          if (!par) { par = newSib; }
          if (!sprout) { sprout = newSib; }
        });
      }
      addChildren(root, blueprint);
      if (!sprout) { return false; }
      sprout.refs = refs;
      return sprout;
    }
    return skel;
  }());

  D.ifAry = function (x, d) { return (Array.isArray(x) ? x : d); };
  D.ifObj = function (x, d) { return ((x && typeof x) === 'object' ? x : d); };
  D.ifFun = function (x, d) { return ((typeof x) === 'function' ? x : d); };
  D.isStr = function (x, no) { return (((typeof x) === 'string') || no); };
  D.isNum = function (x, no) { return ((x === +x) || no); };
  D.empty = function (x) { return ((x === null) || (x === undefined)); };
  D.ifEmpty = function (x, d) { return (D.empty(x) ? d : x); };
  D.ifUndef = function (x, d) { return (x === undefined ? d : x); };
  D.typeof0 = function (x) { return (x === null ? 'null' : typeof x); };
  D.ifMtd = function (o, m, d) {
    m = (orf(o)[m] || d);
    return (D.ifFun(m) ? m.bind(o) : d);
  };

  D.argsAr = function withArgsArray(f) {
    return function () {
      var args = D.arSlc(arguments);
      args.ctx = this;
      return f(args);
    };
  };

  D.dnib = function (f) {
    var r = D.arSlc(arguments, 1);
    return D.argsAr(function (a) { return f.apply(a.ctx, a.concat(r)); });
  };

  (function () {
    function nt(want, dfSlot, chk) {
      if (chk) {
        nt.fun(chk, 'chk = type check criteria func');
      } else {
        chk = D.feqf(D.typeof0, want);
      }
      return function (x, slot) {
        if (chk(x)) { return true; }
        x = ((slot || dfSlot || 'Value') + ' must be ' + want +
          ', not ' + String(x));
        throw new TypeError(x);
      };
    }
    nt.fun = nt('function');
    nt.str = nt('string');
    nt.obj = nt('object', null, D.ifObj);
    nt.num = nt('number', null, D.isNum);
    nt.arr = nt('Array',  null, D.ifAry);
    D.needType = nt;
  }());

  D.xmtd = function (m) {
    var a = D.arSlc(arguments, 1);
    return function (x) { return x[m].apply(x, D.conArS(a, arguments, 1)); };
  };
  D.redAr = D.xmtd('reduce');

  D.compose = D.argsAr(function (funcs) {
    if (!funcs.length) { return idty; }
    return funcs.reduce(D.compose.two);
  });
  D.compose.two = function (f, g) {
    if (!g) { return (f || idty); }
    if (!f) { return g; }
    return function (x) { return g(f(x)); };
  };

  D.cons = win.console;
  D.clogv = function (v) { D.cons.log.apply(D.cons, v); };
  D.cspy = function (a, n) { return D.arLast(a, n, D.clogv(a)); };

  D.qsMap = function (sel, iter, bounds) {
    return D.mapIfF(D.arSlc((bounds || doc).querySelectorAll(sel)), iter);
  };

  D.trav = function (nx, el, chk, prop) {
    while (true) {
      el = el[nx];
      if (!el) { return false; }
      if (chk(prop ? el[prop] : el)) { return el; }
    }
  };
  D.trav.par = D.trav.bind(null, 'parentNode');
  D.trav.prSib = D.trav.bind(null, 'previousElementSibling');

  D.setAttr = function (e, a, v) {
    if (v === null) { e.removeAttribute(a); } else { e.setAttribute(a, v); }
    return e;
  };
  D.attr = function (el, at, df) {
    if (!el) { return df; }
    if (D.ifObj(at)) {
      D.mapkv(at, D.setAttr.bind(null, el));
      return el;
    }
    return D.ifEmpty(el.getAttribute(at), D.ifUndef(df, false));
  };
  D.attrS = function (e, a, d) { return String(D.attr(e, a) || d || ''); };

  function aMinusB(a, b) { return a - b; }
  D.numSortAscInplace = function (a) { return a.sort(aMinusB); };
  function bMinusA(a, b) { return b - a; }
  D.numSortDescInplace = function (a) { return a.sort(bMinusA); };

  function inplaceArraySorter_default(a) { return a.sort(); }
  D.inplaceArraySorter = function (cmp) {
    if (!cmp) { return idty; }
    if (cmp === true) { return inplaceArraySorter_default; }
    if (cmp === 1) { return D.numSortAscInplace; }
    if (cmp === -1) { return D.numSortDescInplace; }
    D.needType.fun(cmp, 'sort criteria function');
    return function (a) { return a.sort(cmp); };
  };

  D.kvLookup = function (f, o, k) { return f(o[k], k, o); };
  D.mapkv = function mapkv(f, s) {
    var k;
    if (s) {
      k = D.ifAry(s);
      if (!k) { s = D.compose.two(Object.keys, D.inplaceArraySorter(s)); }
    }
    return function (o) { return (k || s(o)).map(D.kvLookup.bind(f, o)); };
  };


  D.addTx = function (el, tx) {
    el.appendChild(doc.createTextNode(tx));
    return el;
  };

  D.setTx = function (el, tx) {
    el.innerHTML = '';
    return D.addTx(el, tx);
  };

  D.ihlc = function (dest, html) {
    dest.innerHTML += html;
    return dest.lastElementChild;
  };

  (function () {
    function c(e) { return orf(e && e.style); }
    D.css = c;
    c.px0 = function (e, p) { return num0(ores(c(e)[p]).replace(/px$/, '')); };
  }());

  D.upgradeEvent = function (e) {
    if (!e) { return false; }
    var t = orf(e.target), b;
    e.lcTag = D.lcTag(t);
    e.cls1 = ores(orf(/\S+/.exec(ores(t.className)))[0]);
    if (t && (e.clientX !== undefined)) {
      b = t.getBoundingClientRect();
      e.elemBounds = b;
      e.elemX = e.clientX - b.left;
      e.elemY = e.clientY - b.top;
      e.fracX = e.elemX / b.width;
      e.fracY = e.elemY / b.height;
    }
    return e;
  };























  (function unifiedExport(e) {
    /*global define: true */
    var x, d = ((typeof define === 'function') && define),
      m = ((typeof module === 'object') && module),
      g = 'data-jsglobal-dom80-pmb';
    if (d && d.amd) { d(function () { return e; }); }
    if (m && m.exports) { m.exports = e; }
    x = D.attrS(D.head, g);
    if (x) { win[x] = e; }
    x = D.attrS(D.tag('script').slice(-1)[0], g);
    if (x) { win[x] = e; }
  }(D));
}());
