/**
 * File main.js
 *
 */


/**
 * Mobile Navigation
 */
 
( function( $ ) {
	
	var body, menuToggle, mobileSidebar, mobileNavigation;
	
	var $mobile_nav = $('#site-navigation');
	
	function initMainNavigation( container ) {

		// Add dropdown toggle that displays child menu items.
		var dropdownToggle = $( '<button />', {
			'class': 'dropdown-toggle',
			'aria-expanded': false
		} );

		container.find( '.menu-item-has-children > a' ).after( dropdownToggle );

		// Toggle buttons and submenu items with active children menu items.
		container.find( '.current-menu-ancestor > button' ).addClass( 'toggled-on' );
		container.find( '.current-menu-ancestor > .sub-menu' ).addClass( 'toggled-on' );

		// Add menu items with submenus to aria-haspopup="true".
		container.find( '.menu-item-has-children' ).attr( 'aria-haspopup', 'true' );

		container.find( '.dropdown-toggle' ).click( function( e ) {
			var _this            = $( this ),
				screenReaderSpan = _this.find( '.screen-reader-text' );

			e.preventDefault();
			_this.toggleClass( 'toggled-on' );
			_this.next( '.children, .sub-menu' ).toggleClass( 'toggled-on' );

			// jscs:disable
			_this.attr( 'aria-expanded', _this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
			// jscs:enable
			
		} );
	}
	initMainNavigation( $( '.main-navigation' ) );

	body         	   = $( 'body' );
	menuToggle         = $( '#menu-toggle' );
	mobileSidebar      = $( '#main-navbar' );
	mobileNavigation   = $( '#site-navigation' );

	// Enable menuToggle.
	( function() {

		// Return early if menuToggle is missing.
		if ( ! menuToggle.length ) {
			return;
		}

		// Add an initial values for the attribute.
		menuToggle.add( mobileNavigation ).attr( 'aria-expanded', 'false' );

		menuToggle.on( 'click.type', function() {
			$( this ).add( mobileSidebar ).toggleClass( 'toggled-on' );
			body.toggleClass( 'mobile-menu-active' );
			
			// jscs:disable
			$( this ).add( mobileNavigation ).attr( 'aria-expanded', $( this ).add( mobileNavigation ).attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
			// jscs:enable
		} );
	} )();

	// Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
	( function() {
		if ( ! mobileNavigation.length || ! mobileNavigation.children().length ) {
			return;
		}

		// Toggle `focus` class to allow submenu access on tablets.
		function toggleFocusClassTouchScreen() {
			if ( window.innerWidth >= 840 ) {
				$( document.body ).on( 'touchstart.xmag', function( e ) {
					if ( ! $( e.target ).closest( '.main-navigation li' ).length ) {
						$( '.main-navigation li' ).removeClass( 'focus' );
					}
				} );
				mobileNavigation.find( '.menu-item-has-children > a' ).on( 'touchstart.xmag', function( e ) {
					var el = $( this ).parent( 'li' );

					if ( ! el.hasClass( 'focus' ) ) {
						e.preventDefault();
						el.toggleClass( 'focus' );
						el.siblings( '.focus' ).removeClass( 'focus' );
					}
				} );
			} else {
				mobileNavigation.find( '.menu-item-has-children > a' ).unbind( 'touchstart.xmag' );
			}
		}

		if ( 'ontouchstart' in window ) {
			$( window ).on( 'resize.xmag', toggleFocusClassTouchScreen );
			toggleFocusClassTouchScreen();
		}

		mobileNavigation.find( 'a' ).on( 'focus.xmag blur.xmag', function() {
			$( this ).parents( '.menu-item' ).toggleClass( 'focus' );
		} );
	} )();

	// Add the default ARIA attributes for the menu toggle and the navigations.
	function onResizeARIA() {
		if ( window.innerWidth < 840 ) {
			if ( menuToggle.hasClass( 'toggled-on' ) ) {
				menuToggle.attr( 'aria-expanded', 'true' );
			} else {
				menuToggle.attr( 'aria-expanded', 'false' );
			}

			if ( mobileSidebar.hasClass( 'toggled-on' ) ) {
				mobileNavigation.attr( 'aria-expanded', 'true' );
			} else {
				mobileNavigation.attr( 'aria-expanded', 'false' );
			}

			menuToggle.attr( 'aria-controls', 'site-navigation' );
		} else {
			menuToggle.removeAttr( 'aria-expanded' );
			mobileNavigation.removeAttr( 'aria-expanded' );
			menuToggle.removeAttr( 'aria-controls' );
		}
	}	

} )( jQuery );


/**
 * Scroll Up
 */
jQuery(document).ready(function(){
	jQuery("#scroll-up").hide();
	jQuery(function () {
		jQuery(window).scroll(function () {
			if (jQuery(this).scrollTop() > 800) {
				jQuery('#scroll-up').fadeIn();
			} else {
				jQuery('#scroll-up').fadeOut();
			}
		});
		jQuery('a#scroll-up').click(function () {
			jQuery('body,html').animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	});
});


/**
 * Skip link focus fix
 */
( function() {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var element = document.getElementById( location.hash.substring( 1 ) );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
})();


/* ========================================================================
 * Bootstrap: tab.js v3.2.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.2.0'

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
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

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  })

}(jQuery);

jQuery(function() {
	jQuery('.nav-tabs a:first').tab('show');
});



/**
 * hide/show all episodes 
 *
*/
jQuery(document).ready(function($){
$(".show-all").click(function(){
  $(this).remove();
  $("#all-episodes li").fadeIn().css("display"," list-item");
});
});


//switch servers
$(function(){
	var iframeV=$('iframe[name="FRAME1"]');

$('.serverslist').on('click',function(){
	if($(this).parent().attr('id')=='w-server'){
	$('.serverslist').removeClass('active');
	$(this).addClass('active');
	var dataServer=$(this).attr('data-server');

		iframeV.attr('src',dataServer);		
		
		if( dataServer.indexOf('streamango') > -1){
iframeV.removeAttr('sandbox');
				}
	else{
		iframeV.attr('sandbox','allow-scripts allow-same-origin allow-top-navigation');
	}
	
	}});



var srcV=iframeV.attr('src');
if(typeof srcV !== 'undefined'){
	srcV = srcV.length;
}
if(srcV==0){
	$('.serverslist').each(function(){if($(this).hasClass('active')){
		var dataServer1=$(this).attr('data-server');
			iframeV.attr('src',dataServer1);
		
		
		
		}});}
		
});

//switch off light 
$(document).ready(function () {

    $('.offlight').click(function (e) {
        e.preventDefault();
        $('#off-light').fadeToggle();
    });
    $('#off-light').click(function () {
        $(this).hide();
    });
});

//lazy load on images




$(".btn-comment").click(function () {
	$("div.btn-comment").hide();
	$('.comment').show();
	$("html, body").animate({
		scrollTop: $('.comment').offset().top
	}, 500);
});
