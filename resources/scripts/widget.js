/*
 * Juan Manuel Mouriz <jmouriz@gmail.com>
 * Puedes usar este código para lo que desees, copiarlo cuantas veces
 * quieras, venderlo o alquilarlo pero nunca robar su autoría.
 */

function foreach(root, selector, callback) {
   if (typeof selector == 'string') {
      var all = root.querySelectorAll(selector);
      for (var each = 0; each < all.length; each++) {
         callback(all[each]);
      }
   } else {
      for (var each = 0; each < selector.length; each++) {
         foreach(root, selector[each], callback);
      }
   }
}

var lock = null;
function semaphore(handler, element) {
   if (handler && typeof eval(handler) == 'function') {
      if (!lock) {
         lock = handler;
         eval(handler+'(element)');
         lock = null;
      }
   }
}
HTMLElement.prototype.display = function(visible) {
   if (typeof visible == 'undefined') {
      var parent = this;
      do {
         if (parent.style.display == 'none') {
            return false;
         }
      } while (parent = parent.parentElement);
      return true;
   }
   var query;
   if (visible) {
      this.style.display = 'block';
      query = 'show';
   } else {
      this.style.display = 'none';
      query = 'hide';
   }
   handler = this.getAttribute('on-'+query);
   semaphore(handler, this);
   foreach(this, '[on-'+query+']', function(child) {
      handler = child.getAttribute('on-'+query);
      semaphore(handler, child);
   });
}

//---
String.prototype.format = function() {
   var args = arguments;
   return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
         ? args[number]
         : match
      ;
   });
};
//---

//---
function stylesheet(url, callback) {
   var link = document.createElement('link');
   link.rel = 'stylesheet';
   link.href = url;
   link.onload = callback;
   document.head.appendChild(link);
}

function javascript(url, callback) {
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;
   script.onload = callback;
   document.head.appendChild(script);
}
//---

//---
function resource(url, name) {
   var path = location.pathname.replace(/\/$/, '');
   var base = '{0}{1}'.format(location.origin, path);
   var file = url.replace(base, '');
   var result = '{0}{1}'.format(base, file);

   if (/^https?:\/\//.test(file)) {
      return false;
   }

   return result;
}

var resources = [];

var order = 0;
function include(widget) {
   var http = new XMLHttpRequest();
   var name = widget.getAttribute('name');
   var url = 'widgets/{0}/widget.html'.format(name);
   produce();
   http.onreadystatechange = function(event) {
      if (this.readyState == 4 && this.status == 200) {
         var body = this.responseText;
         var inner = widget.innerHTML;
         var content = widget.querySelector('content');
         var role = widget.getAttribute('role');
         widget.innerHTML = '';
         var clone = widget.cloneNode(false);
         clone.innerHTML = body;
         widget.innerHTML = inner;
         var html = body.replace(/<head>[^]*<\/head>/m, '');
         html = html.replace(/{\[[^\]]+\]}/g, function(attribute) {
            attribute = attribute.substr(2).replace(/\]}/, '')
            var value = clone.getAttribute(attribute);
            return value ? value : '';
         });
         html = html.replace(/\[\[[^\]]+\]\]/g, function(tag) {
            tag = tag.substr(2).replace(/\]\]/, '')
            var content = widget.querySelector(tag);
            return content ? content.innerHTML : '';
         });
         widget.innerHTML = html;
         foreach(clone, 'script', function(script) {
            if (resources.indexOf(script.src) == -1) {
               var url = resource(script.src, name);
               if (url) {
                  produce();
                  resources.push(url);
                  javascript(url, consume);
               }
            }
         });
         foreach(clone, 'link', function(link) {
            if (link.rel == 'stylesheet') {
               if (resources.indexOf(link.href) == -1) {
                  link.widget = name;
                  var url = resource(link.href, name);
                  if (url) {
                     produce();
                     resources[url] = name;
                     stylesheet(url, consume);
                  }
               }
            }
         });
         foreach (widget, 'content', function(element) {
            element.innerHTML = content ? content.innerHTML : inner;
         });
         foreach (widget, '*', function(widget) {
            widget.classList.add('private-{0}'.format(name.replace(/\//g, '-')));
         });
         for (child = 0; child < widget.children.length; child++) {
            var clone = widget.children[child].cloneNode(true);
            if (role) {
               clone.setAttribute('role', role);
            }
            widget.parentNode.insertBefore(clone, widget);
         }
         foreach (clone, 'content', function(element) {
            element.innerHTML = content ? content.innerHTML : inner;
         });
         widget.remove();
         consume();
      }
   };      
   http.open('get', url, true);
   http.send();
}

var left = 0;

function produce() {
   left++;
}

function consume() {
   left--;
}

function classify(selector, name) {
   var classified = selector.replace(/:/, '{0}:'.format(name));
   if (classified == selector) {
      classified = '{0}{1}'.format(selector, name);
   }
   return classified;
}

function recurse(widget) {
   if (widget.querySelector('widget')) {
      foreach(widget, 'widget', function(widget) {
         recurse(widget);
      });
   } else {
      var tag = widget.tagName.toLowerCase();
      if (tag == 'widget' && !widget.included) {
         var name = widget.getAttribute('name').replace(/\./g, '/');
         widget.setAttribute('name', name);
         widget.included = true;
         include(widget);
      }
   }
}

function includes(callback) {
   var each;
   for (each in document.styleSheets) {
      resources.push(document.styleSheets[each].href);
   }
   for (each in document.scripts) {
      resources.push(document.scripts[each].src);
   }
   recurse(document.body);
   function timer() {
      if (!left) {
         var sheets = document.styleSheets;
         for (var sheet = 0; sheet < sheets.length; sheet++) {
            var rules = document.styleSheets[sheet].cssRules;
            var widget = resources[document.styleSheets[sheet].href];
            if (widget) {
               for (var rule = 0; rule < rules.length; rule++) {
                  var selectors = rules[rule].selectorText.split(',');
                  for (each in selectors) {
                     var name = '.private-{0}'.format(widget.replace(/\//g, '-'));
                     selectors[each] = classify(selectors[each], name);
                  }
                  var selector = selectors.join(',');
                  var declaration = rules[rule].style.cssText;
                  var styles = declaration.replace(/;/g, ' !important;');
                  var full = '{0} { {1} }'.format(selector, declaration);
                  document.styleSheets[sheet].deleteRule(rule);
                  document.styleSheets[sheet].insertRule(full, 0);
               }
            }
         }
         if (document.querySelector('widget')) {
            includes(callback);
         } else {
            callback();
         }
      } else {
         setTimeout(timer, 300);
      }
   }
   timer();
}
//---

//---
var loop = true;
function loaded(event) {
   var html = document.documentElement;
   html.style.overflowY = 'hidden';
   html.scrollTop = 0;
   document.body.appendChild(loader);
   if (!/\/widgets\//.test(location.href)) {
      var body = document.body;
      var first  = document.createElement('div');
      body.insertBefore(first, body.firstElementChild);
   }
   if (loop--) {
      includes(function() {
         setTimeout(function() {
            loader.display(false);
            html.style.overflowY = 'auto';
         }, 500);
         try {
            document.dispatchEvent(event);
         } catch(exception) {
            //console.log(exception.message);
         }
      });
   }
}

var loader = document.createElement('div');
var spinner = document.createElement('i');
loader.style.zIndex = '3';
loader.style.backgroundColor = 'lightgray';
loader.style.position = 'absolute';
loader.style.width = '100%';
loader.style.height = '100%';
loader.style.top = '0';
loader.style.left = '0';
loader.style.textAlign = 'center';
spinner.className = 'fa fa-spin fa-5x fa-gear';
spinner.style.color = 'darkgray';
spinner.style.position = 'relative';
spinner.style.lineHeight = '100vh';
loader.appendChild(spinner);
//---

document.addEventListener('DOMContentLoaded', loaded, false);
