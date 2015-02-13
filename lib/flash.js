var xxx = xxx || {};

console.log('flash.js loaded');

xxx.Flash = (function() {

    'use strict';

    function Flash(config) {

        var log = console.log.bind(console),
            tag = document.createElement.bind(document),
            get = document.querySelector.bind(document);


        log('config:', config);

        Object.keys(config).forEach(function(key) {
            this[key] = config[key];
        }.bind(this));

        // pick up parent element
        this.wrapper = get(this.position);

        if (this.flashParams && this.installedFlashVersion >= this.flashParams.requiredFlashVersion) {
            this.insertFlash(tag);
        } else {
            this.insertGraphic(tag);
        };
    };

    Flash.prototype.insertFlash = function insertFlash(tag) {

        var flash = tag('object');

        var attributes = {
            type: 'application/x-shockwave-flash',
            data: this.upload
        };

        var parameters = {
            movie:  this.upload,
            quality: 'high',
            wmode: this.flashParams.wmode,
            scale: this.flashParams.scale,
            bgcolor: this.flashParams.bgcolor,
            allowscriptaccess: 'always',
            flashvars : 'clickTAG=http://www.ba.no'
        };

        var flashvars = [];

        this.clickthrough.forEach(function(clicktype, clickthrough, i) {

            var flashvar = '';

            if (i === 0) {
                flashvar = clicktype + '='
            };

            flashvar += '_ADCLICK_' + clickthrough;

            flashvars.push(flashvar);

        }.bind(undefined, this.clicktype));

        //parameters.flashvars = flashvars.join('&');


        Object.keys(attributes).forEach(function (attribute) {
            flash.setAttribute(attribute, attributes[attribute]);
        });

        Object.keys(parameters).forEach(function (parameter) {
            var param = tag('param');
            param.setAttribute('name', parameter);
            param.setAttribute('value', parameters[parameter]);
            flash.appendChild(param);
        });

        flash.setAttribute('style', 'width: ' + this.width + 'px; height: ' + this.height + 'px;');

        this.wrapper.appendChild(flash);

    };

    Flash.prototype.insertGraphic = function insertGraphic(tag) {

        var link = tag('a'),
        img  = tag('img'),
        attributes = {
            src: this.image,
            alt: 'annonse',
            width: this.width,
            height: this.height,
            border: 0
        };

        if (this.clickthrough.length > 0) {
            link.setAttribute('href', this.clickthrough[0]);
        };

        link.setAttribute('target', '_blank');

        Object.keys(attributes).forEach(function(attribute) {
            img.setAttribute(attribute, attributes[attribute]);
        });

        link.appendChild(img);
        this.wrapper.appendChild(link);
    };


    Flash.prototype.installedFlashVersion = (function installedFlashVersion() {

        // Since flash 10 Adobe has released upgrades in the form of 10.1, 10.2 etc.
        // It’s therefore sufficient to get the first decimal of the plugin-version.
        // Detection method based on Googles method which is based on Apples method,
        // but simplified since we don’t give a shit about old browsers or plugin versions
        // Works with ie11, ie10 and older can fuck off.

        function getFlashVersion(desc) {
            var matches = desc.match(/[\d]+/g);
            matches.length = 2;  // To standardize IE vs FF
            return matches.join('.');
        }

        var flashVersion = null;

        if (navigator.plugins && navigator.plugins.length) {
            var plugin = navigator.plugins['Shockwave Flash'];
            if (plugin && plugin.description) {
                flashVersion = getFlashVersion(plugin.description);
            }
        }
        return flashVersion;
    }());


    return Flash;

}());
