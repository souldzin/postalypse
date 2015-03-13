// IE8 support for addEventListener from: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Compatibility
!function () { if (Event.prototype.preventDefault || (Event.prototype.preventDefault = function () { this.returnValue = !1 }), Event.prototype.stopPropagation || (Event.prototype.stopPropagation = function () { this.cancelBubble = !0 }), !Element.prototype.addEventListener) { var e = [], t = function (t, n) { var o = this, r = function (e) { e.target = e.srcElement, e.currentTarget = o, n.handleEvent ? n.handleEvent(e) : n.call(o, e) }; if ("DOMContentLoaded" == t) { var a = function (e) { "complete" == document.readyState && r(e) }; if (document.attachEvent("onreadystatechange", a), e.push({ object: this, type: t, listener: n, wrapper: a }), "complete" == document.readyState) { var p = new Event; p.srcElement = window, a(p) } } else this.attachEvent("on" + t, r), e.push({ object: this, type: t, listener: n, wrapper: r }) }, n = function (t, n) { for (var o = 0; o < e.length;) { var r = e[o]; if (r.object == this && r.type == t && r.listener == n) { "DOMContentLoaded" == t ? this.detachEvent("onreadystatechange", r.wrapper) : this.detachEvent("on" + t, r.wrapper), e.splice(o, 1); break } ++o } }; Element.prototype.addEventListener = t, Element.prototype.removeEventListener = n, HTMLDocument && (HTMLDocument.prototype.addEventListener = t, HTMLDocument.prototype.removeEventListener = n), Window && (Window.prototype.addEventListener = t, Window.prototype.removeEventListener = n) } }();

+function (ns) {

    // Form serialization function from http://form-serialize.googlecode.com/svn/trunk/serialize-0.2.min.js with added option for replacing %20 to +
    function serializeForm(e, s) { if (e && "FORM" === e.nodeName) { var n, t, a = []; for (n = e.elements.length - 1; n >= 0; n -= 1) if ("" !== e.elements[n].name) switch (e.elements[n].nodeName) { case "INPUT": switch (e.elements[n].type) { case "text": case "hidden": case "password": case "button": case "reset": case "submit": a.push(e.elements[n].name + "=" + encodeURIComponent(e.elements[n].value)); break; case "checkbox": case "radio": e.elements[n].checked && a.push(e.elements[n].name + "=" + encodeURIComponent(e.elements[n].value)); break; case "file": } break; case "TEXTAREA": a.push(e.elements[n].name + "=" + encodeURIComponent(e.elements[n].value)); break; case "SELECT": switch (e.elements[n].type) { case "select-one": a.push(e.elements[n].name + "=" + encodeURIComponent(e.elements[n].value)); break; case "select-multiple": for (t = e.elements[n].options.length - 1; t >= 0; t -= 1) e.elements[n].options[t].selected && a.push(e.elements[n].name + "=" + encodeURIComponent(e.elements[n].options[t].value)) } break; case "BUTTON": switch (e.elements[n].type) { case "reset": case "submit": case "button": a.push(e.elements[n].name + "=" + encodeURIComponent(e.elements[n].value)) } } var m = a.join("&"); return s ? m.replace("%20", "+") : m } }


    // ==========
    // # Poster #
    // ==========

    function Poster(form, urls, options) {
        this.options = extend({}, Poster.DEFAULT, options);
        this.form = this.getForm(form);
        this.urls = typeof (urls) === 'string' ? [urls] : urls;
        this.init(this.form, this.urls);
    }

    // ===================
    // # Poster - static #
    // ===================

    Poster.DEFAULT = {

    };

    // =====================
    // # Poster - instance #
    // =====================

    Poster.prototype = {
        constructor: Poster,
        getForm: function(form) {
            if(form === 'closest') {
                return getClosestForm();
            } else if (typeof(form) === 'string') {
                return document.querySelector(form);
            } else if (form instanceof HTMLFormElement) {
                return form;
            } else {
                throw 'Postalypse: Expected form element to be a string or HTMLFormElement';
            }
        },
        init: function (form) {
            var self = this;

            form.addEventListener('submit', function (e) {
                var body = serializeForm(form, true);

                for (var i = 0; i < self.urls.length; i++) {
                    ajax({
                        url: self.urls[i],
                        action: 'POST',
                        body: body
                    });
                }
            });
        }
    }

    // ----------------------------
    // utils

    function ajax(opt) {
        opt = opt || {};
        
        var url = opt.url || '';
        var action = opt.action ? opt.action.toUpperCase() : 'POST';
        var async = opt.hasOwnProperty('async') ? opt.async : true;
        var contentType = opt.contentType ? opt.contentType : 'application/x-www-form-urlencoded';
        var headers = opt.headers ? opt.header : {};
        var body = opt.body ? opt.body : '';
        var success = opt.success || function () { };
        var error = opt.error || function () { };
        var complete = opt.complete || function () { };


        if (!headers['Content-Type']) {
            headers['Content-Type'] = contentType;
        }

        var httpRequest;

        if (window.XMLHttpRequest) {
            httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {}
            }
        }

        if (!httpRequest) {
            throw 'Cannot create XMLHTTP instance';
            return false;
        }

        // open request
        httpRequest.open(action, url, async);

        for (var p in headers) {
            httpRequest.setRequestHeader(p, headers[p]);
        }

        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status.toString()[0] === '2') {
                    success(httpRequest);
                } else {
                    error(httpRequest);
                }
                complete();
            } else {
                // still waiting
            }
        };
        httpRequest.timeout = 60000; /* timeout */
        httpRequest.send(action === 'POST' ? body : null);

        return httpRequest;
    }

    function extend(obj, obj2) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        for(var i = 1; i < arguments.length; i++) {
            var sourceObj = arguments[i];
            for(var p in sourceObj) {
                if(hasOwnProperty.call(sourceObj, p)) {
                    obj[p] = sourceObj[p];
                }
            }
        }

        return obj;
    }

    function query(selector) {
        if (!document.querySelector) {
            throw 'document.querySelector not supported';
        }

        return document.querySelector(selector);
    }

    // ### getClosestForm ###
    //
    // this method tries to find the closest form (either forward or reverse) from the current script element
    function getClosestForm() {
        var me = getCurrentScriptElement();

        return getClosestWithTag(me, 'form');
    }

    function getClosestWithTag(me, tag) {
        var prev = me.previousSibling;
        var next = me.nextSibling;
        var target = false;

        while (prev || next) {
            if (prev && (target = getInnerTag(prev, tag))) {
                return target;
            }

            if (next && (target = getInnerTag(next, tag))) {
                return target;
            }
            
            prev = prev ? prev.previousSibling : false;
            next = next ? next.nextSibling : false;
        }

        // if we got here, we couldn't find it amongst the siblings
        if (me.parentNode) {
            return getClosestWithTag(me.parentNode, tag);
        } else {
            return false;
        }
    }

    function getInnerTag(me, tag) {
        tag = tag.toLowerCase();
        if(me.tagName && me.tagName.toLowerCase() === tag) {
            return me;
        }

        return me.getElementsByTagName ? me.getElementsByTagName(tag).item(0) : null;
    }


    // ### getCurrentScriptElement ###
    //
    // this method gets the current script element by getting the last one. 
    // It will not work with aynshronous scripts or dynamically inserted scripts.
    function getCurrentScriptElement() {
        var scripts = document.getElementsByTagName('script');
        return scripts = scripts[scripts.length - 1];
    }


    // ----------------------
    // add to namespace

    ns.Postalypse = ns.Postalypse || {};
    ns.Postalypse.gopostal = function (form, urls, options) {
        return new Poster(form, urls, options);
    };

}(window);