var focused = null;
var selected = null;
var roles = 'unknown';

HTMLElement.prototype.next = function(count) {
   var next = this;
   while (count--) {
      next = next.nextElementSibling;
   }
   return next;
}

function testAction(item) {
   var parent = item.parentElement;
   if (!parent.classList.contains('w3-theme')) {
      shmem.last = parent;
      document.getElementById('park').display(true);
   } else {
      parent.classList.remove('w3-theme');
      parent.children[0].display(true);
      parent.children[3].innerHTML = 'No estacionado';
   }
}

function park(option) {
   if (option.innerText == 'Sí') {
      shmem.last.classList.add('w3-theme');
      shmem.last.children[0].display(false);
      shmem.last.children[3].innerHTML = 'Estacionado';
   }
   document.getElementById('park').display(false);
}

function testDoSomething(item) {
   item.parentElement.parentElement.display(false);
}

function testCloseDropdown(dropdown) {
   dropdown.display(false);
}
function testDropdown(dropdown) {
   dropdown.children[0].display(true);
   dropdown.children[1].display(false);
}

function show(element) {
   //console.log('show'); //- todo
}
function hide(element) {
   shmem.reset = element.querySelector('form button[type="reset"]');
   shmem.menu = document.body.querySelector('header i.fa.fa-bars');
   shmem.close = document.body.querySelector('header i.fa.fa-close');
   _close();
}

function showTip() {
   var tip = document.getElementById('tip');
   if (!tip) {
      tip = document.createElement('i');
      tip.id = 'tip';
      tip.display(false);
      tip.className = 'fa fa-chevron-right fa-2x w3-theme reveal';
      document.body.appendChild(tip);
   }

   tip.display(true);
   setTimeout(function() {
      tip.display(false);
   }, 1800);
}

var users = [
   { 'name': 'Juan Manuel', 'email': 'juan.manuel@email.com' },
   { 'name': 'Juan Pérez', 'email': 'jperez@email.com' },
   { 'name': 'Sin nombre', 'email': 'usuario@email.com' }
];

var cars = [
   { 'domain': 'ABC-123', 'status': 'No estacionado' },
   { 'domain': 'AR-123-BA', 'status': 'No estacionado' }
];

function clearAutofill() {
   foreach(document, ['form input[type="email"]',
                      'form input[type="password"]'], function(input) {
      if (input.display()) {
         input.value = '';
      }
   });
}

function load_data() {
   for (var item = 1; item <= 100; item++) {
      users.push({ 'name': 'Sin nombre', 'email': 'usuario-'+item+'@email.com' });
   }

   foreach(document.body, '[repeat]', function(repeater) {
      var variable = repeater.getAttribute('repeat');
      var code = 'typeof '+variable+'!="undefined"?'+variable+':null';
      var data = eval(code);
      if (data) {
         for (var each = 0; each < data.length; each++) {
            var clone = repeater.cloneNode(true);
            repeater.parentElement.appendChild(clone);
            for (key in data[each]) {
               var value = data[each][key];
               var buffer = clone.innerHTML;
               clone.innerHTML = buffer.replace('{{'+key+'}}', value);
            }
         }
      }
      repeater.remove();
   });

   clearAutofill();
}

function optional(variable, value) {
   return variable ? variable : value;
}

function remove() {
   document.getElementById('remove').display(true);
}

function response(option) {
   document.getElementById('remove').display(false);
   if (option.innerText == 'Sí') {
      var item = shmem.last.parentElement;
      item.deleted = true;
      item.display(false);
   }

}

function add(button) {
   edit(button);
}

var shmem = {};

function _close(event) {
   shmem.close.display(false);
   shmem.menu.display(true);
   if (shmem.reset) {
      back(shmem.reset);
   }
   shmem.reset = undefined;
}

function edit(item) {
   var list = item;
   var form;
   while (list = list.parentElement) {
      if (list.classList.contains('list')) {
         list.display(false);
         break;
      }
   }
   form = list.parentElement.querySelector('div.form');
   if (form) {
      form.display(true);
   }

   shmem.menu = document.body.querySelector('header i.fa.fa-bars');
   shmem.close = document.body.querySelector('header i.fa.fa-close');
   shmem.reset = form.querySelector('button[type="reset"]');
   shmem.menu.display(false);
   shmem.close.display(true);
   if (shmem.reset) {
      shmem.close.removeEventListener('click', _close, false);
      shmem.close.addEventListener('click', _close, false);
   }
}

function back(button) {
   var element = button;
   var form = null;
   while (element = element.parentElement) {
      if (element.classList.contains('form')) {
         form = element;
         break;
      }
   }
   if (form) {
      var list = form.parentElement.querySelector('div.list');
      if (list) {
         form.display(false);
         list.display(true);
      }
   }
}

var testLogged = false;
function testLoggedIn() {
   testReset();
   enrole('user');
   select('profile');
}
function testLogin() {
   var field = document.querySelector('section form div#code');
   var code = field.querySelector('input[name="code"]');
   testReset();
   code.value = '';
   field.display(true);
   testLogged = true;
}
function testReset(element) {
   var spin = document.querySelector('header i.fa.fa-refresh');
   spin.display(false);
}
function testSubmit(button) {
   var spin = document.querySelector('header i.fa.fa-refresh');
   spin.display(true);
   button.classList.add('w3-disabled');
   button.classList.remove('w3-enabled');
   for (var child = 0; child < button.childElementCount; child++) {
      button.children[child].classList.add('w3-disabled');
      button.children[child].classList.remove('w3-enabled');
   }
   if (testLogged) {
      setTimeout(testLoggedIn, 750);
   } else {
      setTimeout(testLogin, 750);
   }
   return false;
}

function onFocus() {
   focused = this;
}

function onBlur() {
   focused = null;
}

function onInput() {
   console.log('input');
   var child = this;
   var parent;
   while (parent = child.parentElement) {
      if (parent.tagName.toLowerCase() == 'form') {
         break;
      }
      child = parent;
   }
   var button = parent.querySelector('button[type="submit"]');
   if (button) {
      if (parent.checkValidity()) {
         showTip();
         button.classList.add('w3-enabled');
         button.classList.remove('w3-disabled');
         for (var child = 0; child < button.childElementCount; child++) {
            button.children[child].classList.add('w3-enabled');
            button.children[child].classList.remove('w3-disabled');
         }
      } else {
         button.classList.add('w3-disabled');
         button.classList.remove('w3-enabled');
         for (var child = 0; child < button.childElementCount; child++) {
            button.children[child].classList.add('w3-disabled');
            button.children[child].classList.remove('w3-enabled');
         }
      }
   }
}

function getStyle(className) {
   var styleSheets = window.document.styleSheets;
   var styleSheetsLength = styleSheets.length;
   for(var i = 0; i < styleSheetsLength; i++){
      if (!styleSheets[i].disabled) {
         var classes = styleSheets[i].rules || styleSheets[i].cssRules;
         if (!classes) {
            continue;
         }
         var classesLength = classes.length;
         for (var x = 0; x < classesLength; x++) {
            if (classes[x].selectorText == className) {
               return classes[x];
            }
         }
      }
   }
}

function select(page) {
   if (typeof page != 'string') {
      page.preventDefault();
   }
   var item = document.querySelector('nav a[href="#'+selected+'"]');
   if (selected) {
      if (item) {
         item.className = 'w3-hover-theme';
      }
      document.getElementById(selected).display(false);
   }
   selected = typeof page == 'string' ? page : this.href.split('#')[1];
   item = document.querySelector('nav a[href="#'+selected+'"]');
   var section = document.getElementById(selected);
   if (section) {
      if (item) {
         item.className = 'w3-theme-l3 w3-medium w3-hover-theme';
      }
      section.display(true);
      var title = section.querySelector('h2');
      if (title) {
         document.getElementById('title').innerText = title.innerText;
      } else {
         document.getElementById('title').innerText = 'Sin títutlo';
      }
   } else {
      console.log('No existe una sección para la opción', selected);
      document.getElementById('title').innerText = 'No encontrada';
      selected = null;
   }
   document.documentElement.scrollTop = 0;
   menuClose();
   return false;
}

function tab(tab) {
   var root = tab.parentElement;
   var position = 0;
   var previous = root;
   while (previous = previous.previousElementSibling) {
      position++;
   }
   foreach(root.parentElement, 'li a', function(link) {
      link.classList.remove('w3-theme');
   });
   tab.classList.add('w3-theme');
   var next = root.parentElement;
   while (next = next.nextElementSibling) {
      var list = next.querySelector('div.list')
      var form = next.querySelector('div.form')
      if (list && form) {
         form.display(false);
         list.display(true);
         var menu = document.body.querySelector('header i.fa.fa-bars');
         var close = document.body.querySelector('header i.fa.fa-close');
         close.display(false);
         menu.display(true);
      }
      next.display(!position--);
   }
}

function http(request, callback) {
   w3Http(request, function () {
      if (this.readyState == 4 && this.status == 200) {
         callback(JSON.parse(this.responseText));
      }
   });
}

function apply(theme) {
   var styles = document.styleSheets;
   var regexp = RegExp('\/themes\/'+theme+'\.css$');
   var found = false;
   for (var i = 0; i < styles.length; i++) {
      if (/\/themes\//.test(styles[i].href)) {
         if (regexp.test(styles[i].href)) {
            styles[i].disabled = false;
            found = true;
         } else {
            styles[i].disabled = true;
         }
      }
   }
   if (found || theme == 'none') {
      localStorage.theme = theme;
      var meta = document.querySelector('head meta[name="theme-color"]');
      meta.content = getStyle('.w3-theme').style.backgroundColor;
   }
   return false;
}

function change() {
   this.parentElement.previousElementSibling.innerText = this.innerText;
}

function dropdown() {
   var content = this.querySelector('div.w3-dropdown-content');
   if (content) {
      if (content.style.display == 'block') {
         content.display(false);
      } else {
         content.display(true);
      }
      var input = content.querySelector('input');
      if (input) {
         input.focus();
      }
   }
}

function filter() {
   var value = this.value.toLowerCase();
   foreach(this.parentElement, 'a', function(child) {
      if (child.innerText.toLowerCase().startsWith(value)) {
         child.display(true);
      } else {
         child.display(false);
      }
   });
}

function clear() {
   var input = this.previousElementSibling;
   input.value = '';
   search(input);
}

function update() {
   foreach(document, '[role]', function(element) {
      var all = element.getAttribute('role').split(' ');
      var show = false;
      for (var role = 0; role < all.length; role++) {
         var negate = all[role].startsWith('!');
         var filter = all[role].replace('!', '');
         var found = roles.search(filter) > -1;
         var developer = roles.search('developer') > -1;
         if (negate && !found || found && !negate || developer) {
            show = true;
            break;
         }
      }
      element.display(show);
   });
   var height = 'calc(100% - 128px)';
   if (roles == 'unknown') {
      height = 'calc(100% - 64px)';
   }
   document.querySelector('nav div.menu').style.height = height;
}

function enrole(role) {
   var all = roles.split(' ');
   if (role == 'reset' || role == 'unknown') {
      all = ['unknown'];
   } else if (roles.search(role) > -1) {
      all.splice(all.indexOf(role), 1);
   } else {
      if (all.indexOf('unknown') > -1) {
         all.splice(all.indexOf('unknown'), 1);
      }
      all.push(role);
   }
   if (all.length) {
      roles = all.join(' ');
   } else {
      roles = 'unknown';
   }
   update();
}
function _enrole(button) {
   enrole(button.innerText);
   document.getElementById('roles').innerText = roles;
}

function search(input) {
   var filter = input.value.toLowerCase();
   //var list = input.parentElement.querySelector('ul');
   var list = input.next(3);
   var result = input.parentElement.querySelector('i.result');
   var found = 0;
   for (var child = 0; child < list.children.length; child++) {
      var content = list.children[child].querySelector('span.w3-xlarge');
      if (content) {
         var string = content.innerText.toLowerCase();
         if (string.startsWith(filter)) {
            if (!list.children[child].deleted) {
               list.children[child].display(true);
               found++;
            }
         } else {
            list.children[child].display(false);
         }
      }
   }
   if (result) {
      result.parentElement.display(true);
      var text = found ? found == 1 ? 'Se encontró un usuario' : 'Se encontraron '+found+' usuarios' : 'No se encontró ningún usuario';
      if (filter.length) {
         text += ' que ';
         text += found ? found == 1 ? 'comienza' : 'comienzan' : 'comience';
         text += ' con "'+filter+'"'
      }
      result.innerText = text;
   }
}

function loaded() {
   if (document.readyState == 'interactive') {
      var meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'content-type');
      meta.setAttribute('content', 'text/html; charset=utf-8');
      var head = document.head; // getElementsByTagName('head')[0];
      head.insertBefore(meta, head.firstElementChild);
      return;
   }
   /*
   var title = document.getElementById('title');
   title.addEventListener('click', function() {
      document.getElementById('modal').display(true);
   }, false);
   */
   foreach(document, 'form', function(form) {
      foreach(form, ['input', 'textarea'], function(input) {
         input.addEventListener('focus', onFocus, false);
         input.addEventListener('blur', onBlur, false);
         input.addEventListener('input', onInput, false);
      });
   });
   foreach(document, 'input[type="search"]', function(input) {
      input.addEventListener('focus', onFocus, false);
      input.addEventListener('blur', onBlur, false);
      var icon = input.nextElementSibling;
      if (icon && icon.tagName.toLowerCase() == 'span') {
         icon.addEventListener('click', clear, false);
      }
   });
   foreach(document, 'nav a', function(element) {
      var target = element.href.split('#');
      if (target.length == 2 && target[1] != '') {
         element.addEventListener('click', select, false);
      }
   });
   foreach(document, 'section', function(element) {
      element.display(false);
      element.querySelector('h2').display(false);
   });
   select('home')
   foreach(document, 'div.w3-dropdown-click', function(element) {
      element.addEventListener('click', dropdown, false);
   });
   foreach(document, ['div.w3-dropdown-click',
                      'div.w3-dropdown-hover'], function(element) {
      foreach(element, 'div.w3-dropdown-content input', function(n) {
         n.removeEventListener('input', onInput, false);
         n.addEventListener('input', filter, false);
      });
      foreach(element, 'div.w3-dropdown-content a', function(node) {
         node.addEventListener('click', change, false);
      });
   });
   if (localStorage.theme) {
      apply(localStorage.theme);
   } else {
      apply('blue');
   }
   load_data();
   update();
}

function onResize() {
   if (focused) {
      focused.scrollIntoViewIfNeeded();
   }
}

document.addEventListener('DOMContentLoaded', loaded, false);
window.addEventListener('resize', onResize, false);

// Open and close the sidenav on medium and small screens
function menuOpen() {
   document.getElementById('drawer').display(true);
   document.getElementById('shadow').display(true);
}
function menuClose() {
   document.getElementById('drawer').display(false);
   document.getElementById('shadow').display(false);
}

// Accordions
function accordion(id) {
   var element = document.getElementById(id);
   if (element.classList.contains('w3-show')) {
      element.classList.remove('w3-show');
      element.previousElementSibling.classList.remove('w3-theme-l1');
   } else { 
      element.classList.add('w3-show');
      element.previousElementSibling.classList.add('w3-theme-l1');
   }
   element.className = element.className.trim();
}
