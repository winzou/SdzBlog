/* ===================================================
 * bootstrap-transition.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd'
            ,  'msTransition'     : 'MSTransitionEnd'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide')

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (typeof option == 'string' || (option = options.slide)) data[option]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function ( e ) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $(target).collapse(option)
    })
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="dropdown"]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , selector
        , isActive

      if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

      return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })

}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (content, options) {
    this.options = options
    this.$element = $(content)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        escape.call(this)
        backdrop.call(this, function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        escape.call(this)

        this.$element.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          hideWithTransition.call(this) :
          hideModal.call(this)
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function hideWithTransition() {
    var that = this
      , timeout = setTimeout(function () {
          that.$element.off($.support.transition.end)
          hideModal.call(that)
        }, 500)

    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout)
      hideModal.call(that)
    })
  }

  function hideModal(that) {
    this.$element
      .hide()
      .trigger('hidden')

    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
        removeBackdrop.call(this)

    } else if (callback) {
      callback()
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove()
    this.$backdrop = null
  }

  function escape() {
    var that = this
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function ( e ) {
        e.which == 27 && that.hide()
      })
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      e.preventDefault()
      $target.modal(option)
    })
  })

}(window.jQuery);/* ===========================================================
 * bootstrap-tooltip.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , isHTML: function(text) {
      // html string detection logic adapted from jQuery
      return typeof text != 'string'
        || ( text.charAt(0) === "<"
          && text.charAt( text.length - 1 ) === ">"
          && text.length >= 3
        ) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function ( element, options ) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);/* =============================================================
 * bootstrap-scrollspy.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy( element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu'))  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var that = this
        , items
        , q

      this.query = this.$element.val()

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(this.source, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , keypress: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);
/*!
 * @mekwall's .vangogh() for Syntax Highlighting
 *
 * All code is open source and dual licensed under GPL and MIT.
 * Check the individual licenses for more information.
 * https://github.com/mekwall/jquery-vangogh/blob/master/GPL-LICENSE.txt
 * https://github.com/mekwall/jquery-vangogh/blob/master/MIT-LICENSE.txt
 */
(function($,a,b){var c=1,d=!1,e=!1,f={get:function(b){var c=a.location.hash;if(c.length>0){var d=c.match(new RegExp(b+":{([a-zA-Z0-9,-]*)}"));if(d)return d[1].split(",")}return[]},set:function(b,c){var d=a.location.hash,e,f=b+":{"+c.join(",")+"}",g=d.indexOf(b+":{");if(c.length===0)return this.remove(b);g!==-1?e=d.replace(new RegExp("("+b+":{[a-zA-Z0-9,-]*})"),f):e=d.length>0?d+","+f:f,a.location.hash=e},remove:function(b){a.location.hash=a.location.hash.replace(new RegExp("([,]?"+b+":{[a-zA-Z0-9,-]*}[,]?)"),"")}},g={numberRange:/^([0-9]+)-([0-9]+)$/,pageNumber:/-([0-9]+)$/,multilineBegin:/<span class="([\w-_][^"]+)">(?:.[^<]*(?!<\/span>)|)$/ig,multilineEnd:/(<span class="([\w-_][^"]+)">)?(?:.[^<]*)?(<\/span>)/ig};$.fn.vanGogh=function(h){function n(){if(d||e)setTimeout(n,100);else{k++;if(k>=10)return;if(h.source&&!l){e=!0,$.ajax({url:h.source,crossDomain:!0,dataType:"text",success:function(a){l=a},error:function(a,b){l="ERROR: "+b},complete:function(){e=!1,n()}});return}b=b||a.hljs;if(!b){d=!0,$.getScript(h.autoload,function(){d=!1,n()});return}j.filter("pre,code").each(function(){function r(b,c,e){var h=!1,i=a.find(".vg-line");c&&(a.find(".vg-highlight").removeClass("vg-highlight"),f.remove(d),k=[]),b=$.type(b)==="array"?b:[b],$.each(b,function(b,c){if(k.indexOf(c)<=-1){!isNaN(parseFloat(c,10))&&isFinite(c)&&(c=parseInt(c,10));if($.type(c)==="string"){var e=g.numberRange.exec(c);if(e){var f=e[1],h=e[2],j="";for(var b=f;b<=h;b++)j+=",#"+d+"-"+b,k.push(b);i.filter(j.substring(1)).addClass("vg-highlight")}else a.find(".vg-line:contains("+c+")").each(function(){var a=$(this).addClass("vg-highlight");a.html(a.html().replace(c,'<span class="vg-highlight">'+c+"</span>"))}),k.push(c)}else{var l=d+"-"+this,m=i.filter("#"+l);m.length&&(m.addClass("vg-highlight"),k.push(c))}}}),!e&&f.set(d,k)}var a=$(this).addClass("vg-container").attr("id",this.id||"vg-"+c++),d=this.id,e=a.find("code"),i=!1,j=!1,k=[];e.length||(e=a,i=!0),h.source&&l&&e.text(l);var n=e.text();b.highlightBlock(e[0],h.tab);var o=e.html().split("\n"),p="",q="";if(!i){var s={},t=0;$.each(o,function(a,b){var c=a+h.firstLine,e=d+"-"+c,f=b;h.numbers&&(p+='<a class="vg-number" rel="#'+e+'">'+c+"</a>");if(s[t]){var i=g.multilineEnd.exec(b);i&&!i[1]?(f='<span class="'+s[t]+'">'+f,delete s[t],t--):f='<span class="'+s[t]+'">'+f+"</span>"}var j=g.multilineBegin.exec(b);j&&(t++,s[t]=j[1]),q+='<div class="vg-line" id="'+e+'">'+f+"</div>"}),q='<code class="vg-code">'+q+"</code>",h.numbers&&(q='<div class="vg-gutter">'+p+"</div>"+q),a.html(q),e=a.find("code"),a.find(".vg-number").click(function(b){var c=$(this),e=c.attr("rel"),h=a.find(e);if(h.hasClass("vg-highlight")){h.removeClass("vg-highlight"),k.splice(k.indexOf(c.text()),1),f.set(d,k),j=!1;return!1}var i=j;j=parseInt(g.pageNumber.exec(e)[1],10),b.shiftKey&&j?r(i<j?i+"-"+j:j+"-"+i,!0):r(j,b.ctrlKey?!1:!0);return!1});var u=a.find(".vg-gutter"),v=u.outerWidth(),w=0,x=!1;h.animateGutter&&a.scroll(function(a){if(this.scrollLeft!==w)if(this.scrollLeft>v){if(this.scrollLeft<w)w=this.scrollLeft,u.hide();else if(this.scrollLeft!==w){if(x)return;var b=this;w=this.scrollLeft,x=setTimeout(function(){x=!1;var a=b.scrollLeft;e.css("marginLeft",v),u.css({"float":"none",position:"absolute",left:a-v}).show().stop().animate({left:a})},500)}}else w=this.scrollLeft,clearTimeout(x),x=!1,u.css({"float":"",position:"",left:""}).show()})}else i&&a.addClass("vg-code");e.dblclick(function(){m(e[0]);return!1});if(h.maxLines>0){var y=a.find(".vg-line").height(),z=parseInt(e.css("paddingTop")),A=y*(h.maxLines+1)+z;a.css({minHeight:y+z,maxHeight:A})}h.highlight&&r(h.highlight,!0,!0);var B=f.get(d);B.length&&r(B,!1,!0)})}}function m(b){var c=a,d=a.document;if(d.body.createTextRange){var e=d.body.createTextRange();e.moveToElementText(b),e.select()}else if(d.createRange){var f=c.getSelection(),e=d.createRange();e.selectNodeContents(b),f.removeAllRanges(),f.addRange(e)}}var i={language:"auto",firstLine:1,maxLines:0,numbers:!0,highlight:null,animateGutter:!0,autoload:"http://softwaremaniacs.org/media/soft/highlight/highlight.pack.js",tab:"    "};h=$.extend({},i,h);var j=this,k=0,l;n();return j}})(jQuery,this,typeof this.hljs!="undefined"?this.hljs:!1);

/*!
 * Repo.js
 * @author Darcy Clarke
 *
 * Copyright (c) 2012 Darcy Clarke
 * Dual licensed under the MIT and GPL licenses.
 * http://darcyclarke.me/
 */
 (function($){

    // Github repo
    $.fn.repo = function( options ){

        // Context and Base64 methods
        var _this       = this,
            keyStr64    = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=",
            encode64    = function(a){a=escape(a);var b="";var c,d,e="";var f,g,h,i="";var j=0;do{c=a.charCodeAt(j++);d=a.charCodeAt(j++);e=a.charCodeAt(j++);f=c>>2;g=(c&3)<<4|d>>4;h=(d&15)<<2|e>>6;i=e&63;if(isNaN(d)){h=i=64}else if(isNaN(e)){i=64}b=b+keyStr64.charAt(f)+keyStr64.charAt(g)+keyStr64.charAt(h)+keyStr64.charAt(i);c=d=e="";f=g=h=i=""}while(j<a.length);return b},
            decode64    = function(a){var b="";var c,d,e="";var f,g,h,i="";var j=0;var k=/[^A-Za-z0-9\+\/\=]/g;if(k.exec(a)){}a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{f=keyStr64.indexOf(a.charAt(j++));g=keyStr64.indexOf(a.charAt(j++));h=keyStr64.indexOf(a.charAt(j++));i=keyStr64.indexOf(a.charAt(j++));c=f<<2|g>>4;d=(g&15)<<4|h>>2;e=(h&3)<<6|i;b=b+String.fromCharCode(c);if(h!=64){b=b+String.fromCharCode(d)}if(i!=64){b=b+String.fromCharCode(e)}c=d=e="";f=g=h=i=""}while(j<a.length);return unescape(b)},
            transition  = function(el, direction, init){
                var opposite    = (direction === 'left') ? '' : 'left';

                if(init){
                    el.addClass('active');
                    _this.container.css({'height' : calculateHeight(el) + 'px'});
                } else {
                    _this.container
                        .find('.page.active')
                        .css('position','absolute')
                        .addClass(direction)
                        .removeClass('active')
                        .end()
                        .css({'height' : calculateHeight(el) + 'px'});
                    el.addClass('active')
                        .removeClass(opposite)
                        .delay(250)
                        .queue(function(){
                            $(this).css('position','relative').dequeue();
                        });
                }
            },

            calculateHeight = function(el){
                // This calculates the height of the bounding box for the repo display.
                // clientHeight is element containing fetched results, plus the h1 tag, plus
                // the div repo margin has of 15 pixels.  
                return (el[0].clientHeight + _this.container.find('h1').outerHeight(true) + 15);
            },

            getMimeTypeByExtension = function(extension){
                var mimeTypes = {
                    // images
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'ico': 'image/x-icon'
                };
                return mimeTypes[extension] ? mimeTypes[extension] : 'text/plain';
            };

        // Settings
        _this.settings = $.extend({
                user    : '',
                name    : '',
                branch  : 'master',
                css     : '@font-face{font-family:"Octicons Regular";src:url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.eot?639c50d4");src:url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.eot?639c50d4#iefix") format("embedded-opentype"),url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.woff?0605b255") format("woff"),url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.ttf?f82fcba7") format("truetype"),url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.svg?1f7afa21#newFontRegular") format("svg");font-weight:normal;font-style:normal}@font-face{font-family:"repo-icons";src:url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.eot");src:url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.eot#iefix") format("embedded-opentype"),url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.woff") format("woff"),url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.ttf") format("truetype"),url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.svg") format("svg");font-weight:normal;font-style:normal}.repo,.repo *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box}.repo ul *{display:block;font-family:sans-serif;font-size:13px;line-height:18px}.repo{width:100%;margin:0 0 15px 0;position:relative;padding-bottom:1px;color:#555;overflow:hidden;height:300px;-webkit-transition:height .25s;-moz-transition:height .25s;-o-transition:height .25s;-ms-transition:height .25s;transition:height .25s}.repo .page{background:#f8f8f8;border:4px solid rgba(0,0,0,0.08);border-radius:3px;-ms-filter:"alpha(opacity=0)";filter:alpha(opacity=0);opacity:0;left:100%;width:98%;position:absolute;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;-ms-transition:all .25s;transition:all .25s}.repo .page.active{left:1%!important;-ms-filter:"alpha(opacity=100)";filter:alpha(opacity=100);opacity:1;display:block}.repo .page.left{left:-100%}.repo .loader{position:absolute;display:block;width:100%;height:300px;top:0;left:0;background:url(data:image/gif;base64,R0lGODlhQABAALMIAOzu7PT29Ozq7PTy9Pz6/Pz+/OTm5OTi5P///wAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBN0RGOTZFMEJFNDAxMUUxOThFRUU2MTc0Q0I1MERFRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBN0RGOTZFMUJFNDAxMUUxOThFRUU2MTc0Q0I1MERFRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkE3REY5NkRFQkU0MDExRTE5OEVFRTYxNzRDQjUwREVEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkE3REY5NkRGQkU0MDExRTE5OEVFRTYxNzRDQjUwREVEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp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) no-repeat center 50%}.repo.loaded .loader{display:none}.repo h1{padding:0 0 0 10px;font-family:sans-serif;font-size:20px;line-height:26px;color:#000;font-weight:normal}.repo h1 a:nth-of-type(1),.repo h1 a.active{font-weight:bold}.repo h1 a.active,.repo h1 a.active:active,.repo h1 a.active:visited,.repo h1 a.active:hover{color:#000}.repo h1 a,.repo h1 a:active,.repo h1 a:visited,.repo h1 a:hover{color:#4183c4;text-decoration:none}.repo h1 a:after{content:"/";color:#999;padding:0 5px;font-weight:normal}.repo h1 a:last-child:after{content:""}.repo .page,.repo ul{zoom:1}.repo .page:before,.repo .page:after,.repo ul:before,.repo ul:after{content:"";display:table}.repo .page:after,.repo ul:after{clear:both}.repo ul{border:1px solid rgba(0,0,0,0.25);margin:0;padding:0}.repo li{width:100%;margin:0;padding:0;float:left;border-bottom:1px solid #ccc;position:relative;white-space:nowrap}.repo li.titles{background:-webkit-linear-gradient(#fafafa,#eaeaea);background:-moz-linear-gradient(#fafafa,#eaeaea);background:-o-linear-gradient(#fafafa,#eaeaea);background:-ms-linear-gradient(#fafafa,#eaeaea);background:linear-gradient(#fafafa,#eaeaea);font-weight:bold;padding:10px 10px 8px 36px;text-shadow:0 1px 0 #fff}.repo li:before{content:"t";font-family:"repo-icons";position:absolute;top:10px;left:10px;font-size:18px;-webkit-font-smoothing:antialiased}.repo li.dir:before{content:"f ";color:#80a6cd}.repo li.titles:before,.repo li.back:before{content:""}.repo li:last-child{border:0;padding-bottom:none;margin:0}.repo li a,.repo li a:visited,.repo li a:active{color:#4183c4;width:100%;padding:10px 10px 8px 36px;display:block;text-decoration:none}.repo li a:hover{text-decoration:underline}.repo li span{display:inline-block}.repo li span:nth-of-type(1){width:30%}.repo li span:nth-of-type(2){width:20%}.repo li span:nth-of-type(3){width:40%}.repo .vg-container{position:relative;overflow:auto;white-space:pre!important;word-wrap:normal!important}.repo .vg-container,.repo .vg-code{border:0;margin:0;overflow:auto}.repo .vg-code .vg-line,.repo .vg-gutter .vg-number{display:block;height:1.5em;line-height:1.5em!important}.repo .vg-gutter{float:left;min-width:20px;width:auto;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.repo .vg-number{cursor:pointer}.repo .vg-container{font-family:"Bitstream Vera Sans Mono","Courier New",monospace;font-size:13px;border:1px solid #ddd}.repo .vg-gutter{background-color:#ececec;border-right:1px solid #ddd;text-align:right;color:#aaa;padding:1em .5em;margin-right:.5em}.repo .vg-code *::-moz-selection,.repo .vg-code *::-webkit-selection,.repo .vg-code *::selection,.repo .vg-line.vg-highlight{background-color:#ffc}.repo .vg-line span.vg-highlight{color:blue;font-weight:bold;text-decoration:underline}.repo .vg-container .vg-code{display:block;padding:1em .5em;background:#fff}.repo .vg-code{color:#000;background:#f8f8ff;border:0;padding:.4em}.repo .vg-code .comment,.repo .vg-code .template_comment,.repo .vg-code .diff .header,.repo .vg-code .javadoc{color:#998;font-style:italic}.repo .vg-code .keyword,.repo .vg-code .css .rule .keyword,.repo .vg-code .winutils,.repo .vg-code .javascript .title,.repo .vg-code .lisp .title,.repo .vg-code .subst{color:#000;font-weight:bold}.vg-code .number,.vg-code .hexcolor{color:#40a070}.vg-code .string,.repo .vg-code .tag .value,.repo .vg-code .phpdoc,.repo .vg-code .tex .formula{color:#d14}.repo .vg-code .title,.repo .vg-code .id{color:#900;font-weight:bold}.repo .vg-code .javascript .title,.repo .vg-code .lisp .title,.repo .vg-code .subst{font-weight:normal}.repo .vg-code .class .title,.repo .vg-code .haskell .label,.repo .vg-code .tex .command{color:#458;font-weight:bold}.repo .vg-code .tag,.repo .vg-code .tag .title,.repo .vg-code .rules .property,.repo .vg-code .django .tag .keyword{color:#000080;font-weight:normal}.repo .vg-code .attribute,.repo .vg-code .variable,.repo .vg-code .instancevar,.repo .vg-code .lisp .body{color:#008080}.repo .vg-code .regexp{color:#009926}.repo .vg-code .class{color:#458;font-weight:bold}.repo .vg-code .symbol,.repo .vg-code .ruby .symbol .string,.repo .vg-code .ruby .symbol .keyword,.repo .vg-code .ruby .symbol .keymethods,.repo .vg-code .lisp .keyword,.repo .vg-code .tex .special,.repo .vg-code .input_number{color:#990073}.repo .vg-code .builtin,.repo .vg-code .built_in,.repo .vg-code .lisp .title{color:#0086b3}.repo .vg-code .codeprocessor,.repo .vg-code .pi,.repo .vg-code .doctype,.repo .vg-code .shebang,.repo .vg-code .cdata{color:#999;font-weight:bold}.repo .vg-code .deletion{background:#fdd}.repo .vg-code .addition{background:#dfd}.repo .vg-code .diff .change{background:#0086b3}.repo .vg-code .chunk{color:#aaa}.repo .vg-code .tex .formula{-ms-filter:"alpha(opacity=50)";filter:alpha(opacity=50);opacity:.5}',
            }, options);

        // Extension Hashes
        _this.extensions = {
            as          : 'actionscript',
            coffee      : 'coffeescript',
            css         : 'css',
            html        : 'html',
            js          : 'javascript',
            md          : 'markdown',
            php         : 'php',
            py          : 'python',
            rb          : 'ruby',
        };

        // Repo
        _this.repo = {
            name        : 'default',
            folders     : [],
            files       : []
        };

        // Namespace
        _this.namespace = _this.settings.name.toLowerCase();

        // Insert CSS
        if(typeof _this.settings.css != 'undefined' && _this.settings.css !== '' && $('#repojs_css').length <= 0)
            $('body').prepend($('<style id="repojs_css">').html(_this.settings.css));

        // Query Github Tree API
        $.ajax({
            url: 'https://api.github.com/repos/' + _this.settings.user + '/' + _this.settings.name + '/git/trees/' + _this.settings.branch + '?recursive=1',
            type: 'GET',
            data: {},
            dataType: 'jsonp',
            success: function(response){

                var treeLength = response.data.tree.length;
                $.each(response.data.tree, function(i){

                    // Setup if last element
                    if(!--treeLength){
                        _this.container.addClass('loaded');
                        // Add 10ms timeout here as some browsers require a bit of time before calculating height.
                        setTimeout( function(){
                            transition(_this.container.find('.page').first(), 'left', true);
                        }, 10 );
                    }

                    // Return if data is not a file
                    if(this.type != 'blob')
                        return;

                    // Setup defaults
                    var first       = _this.container.find('.page').first()
                        ctx         = _this.repo,
                        output      = first,
                        path        = this.path,
                        arr         = path.split('/'),
                        file        = arr[(arr.length - 1)],
                        id          = '';

                    // Remove file from array
                    arr = arr.slice(0,-1);
                    id = _this.namespace;

                    // Loop through folders
                    $.each(arr, function(i){

                        var name    = String(this),
                            index   = 0,
                            exists  = false;

                        id = id + '_split_' + name.replace('.','_dot_');

                        // Loop through folders and check names
                        $.each(ctx.folders, function(i){
                            if(this.name == name){
                                index = i;
                                exists = true;
                            }
                        });

                        // Create folder if it doesn't exist
                        if(!exists){

                            // Append folder to DOM
                            if(output !== first){
                                output.find('ul li.back').after($('<li class="dir"><a href="#" data-id="' + id + '">' + name +'</a></li>'));
                            } else {
                                output.find('ul li').first().after($('<li class="dir"><a href="#" data-id="' + id + '">' + name +'</a></li>'));
                            }

                            // Add folder to repo object
                            ctx.folders.push({
                                name        : name,
                                folders     : [],
                                files       : [],
                                element     : $('<div class="page" id="' + id + '"><ul><li class="titles"><span>name</span></li><li class="back"><a href="#">..</a></li></ul></page>').appendTo(_this.container)[0]
                            });
                            index = ctx.folders.length-1;

                        }

                        // Change context & output to the proper folder
                        output = $(ctx.folders[index].element);
                        ctx = ctx.folders[index];

                    });

                    // Append file to DOM
                    output.find('ul').append($('<li class="file"><a href="#" data-path="' + path + '" data-id="' + id + '">' + file +'</a></li>'));

                    // Add file to the repo object
                    ctx.files.push(file);

                });

                // Bind to page links
                _this.container.on('click', 'a', function(e){

                    e.preventDefault();

                    var link        = $(this),
                        parent      = link.parents('li'),
                        page        = link.parents('.page'),
                        repo        = link.parents('.repo'),
                        el          = $('#' + link.data('id'));

                    // Is link a file
                    if(parent.hasClass('file')){

                        el = $('#' + link.data('id'));

                        if(el.legnth > 0){
                            el.addClass('active');
                        } else {
                            $.ajax({
                                url: 'https://api.github.com/repos/' + _this.settings.user + '/' + _this.settings.name + '/contents/' + link.data('path') + '?ref=' + _this.settings.branch,
                                type: 'GET',
                                data: {},
                                dataType: 'jsonp',
                                success: function(response){
                                    var fileContainer = $('<div class="file page" id="' + link.data('id') + '"></div>'),
                                        extension = response.data.name.split('.').pop().toLowerCase(),
                                        mimeType = getMimeTypeByExtension(extension);

                                    if('image' === mimeType.split('/').shift()){
                                        el = fileContainer.append($('<div class="image"><span class="border-wrap"><img src="" /></span></div>')).appendTo(repo);
                                        el.find('img')
                                            .attr('src', 'data:' + mimeType + ';base64,' + response.data.content)
                                            .attr('alt', response.data.name);
                                    }
                                    else {
                                        el = fileContainer.append($('<pre><code></code></pre>')).appendTo(repo);
                                        if(typeof _this.extensions[extension] != 'undefined')
                                            el.find('code').addClass(_this.extensions[extension]);
                                        el.find('code').html(String(decode64(response.data.content)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
                                        el.find('pre').vanGogh();
                                    }

                                    transition(el, 'left');
                                },
                                error: function(response){
                                    if(console && console.log)
                                        console.log('Request Error:', e);
                                }
                            });
                        }

                    // Is link a folder
                    } else if(parent.hasClass('dir')) {

                        _this.container
                            .find('h1')
                            .find('.active')
                            .removeClass('active')
                            .end()
                            .append('<a href="#" data-id="' + link.data('id') + '" class="active">' + link.text() + '</a>');
                        transition(el, 'left');

                    // Is link a back link
                    } else if(parent.hasClass('back')){

                        _this.container.find('h1 a').last().remove();
                        el = page[0].id.split('_split_').slice(0,-1).join('_split_');
                        el = (el == _this.namespace) ? _this.container.find('.page').first() : $('#' + el);
                        transition(el, 'right');

                    // Is nav link
                    } else {
                        el = el.length ? el : _this.container.find('.page').eq(link.index());

                        if(link[0] !== _this.container.find('h1 a')[0])
                            link.addClass('active');
                        _this.container.find('h1 a').slice((link.index()+1),_this.container.find('h1 a').length).remove();
                        transition(el, 'right');
                    }
                });
            },
            error : function(response){
                if(console && console.log)
                    console.log('Request Error:', response);
            }
        });

        // Setup repo container
        return this.each(function(){
            _this.container = $('<div class="repo"><h1><a href="#" data-id="' + _this.namespace + '_split_default">' + _this.settings.name + '</a></h1><div class="loader"></div><div class="page" id="' + _this.namespace + '_split_default"><ul><li class="titles"><span>name</span></li></ul></div></div>').appendTo($(this));
        });
    };

})(jQuery);

$('#repo').repo({ user: 'winzou', name: 'SdzBlog' });
