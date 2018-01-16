
<!--#echo json="package.json" key="name" underline="=" -->
dom80-pmb
=========
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Yet another DOM utility library, optimized for Firefox.
<!--/#echo -->


Usage
-----

Here be dragons. Unstable pre-alpha.

__Cheap browser import:__
To tell the UMD exporter you want dom80 on your `window` global,
set the property name as the `data-jsglobal-dom80-pmb` attribute
of your `head` element, e.g.

```html
<!DOCTYPE html><html><head data-jsglobal-dom80-pmb="dom80">
  <!-- … -->
</head><body>
  <!-- … -->
  <script src="node_modules/dom80-pmb/dist/dom80.latest.min.js"></script>
  <script>dom80.qsMap('ul > li:first-child', console.log);</script>
</body></html>
```




<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
