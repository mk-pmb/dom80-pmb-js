/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, browser: true */
/*globals define:true*/
(function () {
  'use strict';
  var emArr = [], doc = document,
    bindCall = Function.bind.bind(Function.call);

  function idty(x) { return x; }
  function orf(x) { return (x || false); }

  function D(x, a) {
    if (!x) { return false; }
    if (x.substr) {
      a = x.substr(0, 1);
      if (a === '#') { return (doc.getElementById(x.slice(1) || false)); }
      if (a === '.') { return D.arSlc(doc.getElementsByClassName(x.slice(1))); }
      return D.arSlc(doc.getElementsByTagName(x.slice(1)));
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

  D.fif = function (f, x) { return (f ? f(x) : x); };
  D.eqf = function (y) { return function (x) { return (x === y); }; };
  D.feqf = function (f, y) { return function (x) { return (f(x) === y); }; };
  D.lcStr = function (s) { return String(s || '').toLowerCase(); };
  D.eqfLc = D.feqf.bind(null, D.lcStr);

  D.tag = D;
  D.mkTxt = function (tx) { return doc.createTextNode(tx); };
  D.mkTag = function (tn) { return doc.createElement(tn); };
  D.parTag = function (el) { return orf(orf(el).parentNode); };
  D.rmTag = function (e) { if (D.parTag(e)) { D.parTag(e).removeChild(e); } };
  D.body = (doc.body || D.tag('body')[0]);
  D.head = (doc.head || D.tag('head')[0]);
  D.root = (doc.documentElement || D.parTag(D.body));
  D.title = D.tag('title')[0];

  D.ifAry = function (x, d) { return (Array.isArray(x) ? x : d); };
  D.ifObj = function (x, d) { return ((x && typeof x) === 'object' ? x : d); };
  D.ifFun = function (x, d) { return ((typeof x) === 'function' ? x : d); };
  D.isStr = function (x, no) { return (((typeof x) === 'string') || no); };
  D.isNum = function (x, no) { return ((x === +x) || no); };
  D.empty = function (x) { return ((x === null) || (x === undefined)); };
  D.ifEmpty = function (x, d) { return (D.empty(x) ? d : x); };
  D.ifUndef = function (x, d) { return (x === undefined ? d : x); };
  D.typeof0 = function (x) { return (x === null ? 'null' : typeof x); };

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
      if (!chk) {
        chk = D.feqf.bind(null, D.typeof0);
      } else {
        nt.fun(chk, 'chk = type check criteria func');
      }
      return function (x, slot) {
        if (chk(x)) { return true; }
        chk = (slot || dfSlot || 'Value') + ' must be ' + want +
          ', not ' + String(x);
        throw new TypeError(chk);
      };
    }
    nt.fun = nt('function');
    nt.str = nt('string');
    nt.obj = nt('object', null, D.ifObj);
    nt.num = nt('number', null, D.isNum);
    nt.arr = nt('Array',  null, D.isAry);
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

  D.clogv = function (v) { console.log.apply(console, v); };
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




















  (function unifiedExport(e) {
    /*global define: true */
    var d = ((typeof define === 'function') && define),
      m = ((typeof module === 'object') && module),
      g = D.attrS(D.head, 'data-jsglobal-dom80-pmb');
    if (d && d.amd) { d(function () { return e; }); }
    if (m && m.exports) { m.exports = e; }
    if (g) { window[g] = D; }
  }(D));
}());
