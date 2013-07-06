JF.zend = new function() {
};

JF.zend.toolbar = new function() {
    this.get = function() {
        return $('#zend-developer-toolbar');
    };

    this.fetch = function() {
        this.$toolbar = this.get();
    };

    this.onCreate = function(func, forceFetch) {
        if (typeof func != 'function') return;
        if (forceFetch || !this.$toolbar) this.fetch();
        if (!this.$toolbar.length) {
            setTimeout(this.onCreate.bind(this, func, true), 50);
            return;
        }

        func();
    };

    this.class = function(className) {
        if (!this.$toolbar) this.fetch();
        this.$toolbar.addClass(className);
    };

    this.classes = function(classes) {
        for (var i in classes) {
            this.class(classes[i]);
        }
    };

    this.removeClass = function(className) {
        if (!this.$toolbar) this.fetch();
        this.$toolbar.removeClass(className);
    };

    this.removeClasses = function(classes) {
        if (!classes) {
            this.removeClass();
            return;
        }
        for (var i in classes) {
            this.removeClass(classes[i]);
        }
    };

    this.move = function(optionArray) {
        for (var i in optionArray) {
            if (optionArray[i] == 'top') {
                this.class('top');
            } else if (optionArray[i] == 'offset') {
                this.class('offset');
            }
        }
    };

    this.hide = function() {
        this.class('hidden');
    };

    this.show = function() {
        this.removeClass('hidden');
    };
};