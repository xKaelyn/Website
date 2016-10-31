/* -----------------------------------------------------------------------------

Kwadrat - Creative Multipurpose Bootstrap Template 

File:           JS Core
Version:        1.11
Last change:    07/09/15 
Author:         Suelo

-------------------------------------------------------------------------------- */

'use strict';

var Kwadrat = {
    init: function() {

        this.Basic.init();
        this.Component.init();  
        $('#page-loader').fadeOut(500);

    },
    Basic: {
        init: function() {

            this.animations();
            this.backgrounds();
            this.scroller();
            this.masonry();
            this.ajaxLoader();
            this.mobileNav();
            this.verticalCenter();
            this.map();
            this.forms();

        },
        backgrounds: function() {

            // Images 
            $('.bg-image').each(function(){
                var src = $(this).children('img').attr('src');
                $(this).css('background-image','url('+src+')').children('img').hide();
            });

        },
        animations: function() {
            // Animation - hover 
            $('.animated-hover')
                .on('mouseenter', function(){
                    var animation = $(this).data('hover-animation');
                    var duration = $(this).data('hover-animation-duration');
                    $(this).stop().css({
                        '-webkit-animation-duration': duration+'ms',
                        'animation-duration': duration+'ms'
                    }).addClass(animation);
                })
                .on('mouseleave', function(){
                    var $self = $(this);
                    var animation = $(this).data('hover-animation');
                    var duration = $(this).data('hover-animation-duration');
                    $(this).stop().removeAttr('style').removeClass(animation); 
                });

            // Animation - appear 
            $('.animated').appear(function() {
                $(this).each(function(){ 
                    var $target =  $(this);
                    var delay = $(this).data('animation-delay');
                    setTimeout(function() {
                        $target.addClass($target.data('animation')).addClass('visible')
                    }, delay);
                });
            });
        },
        scroller: function() {

            var $header = $('#header');
            var $mobileNav = $('#mobile-nav');
            var $section = $('.section','#page-wrapper');
            var $body = $('body');

            var scrollOffset;
            if($header.hasClass('header-horizontal')) scrollOffset = -65;
            else scrollOffset = 0;

            $('#header, #mobile-nav, [data-target="local-scroll"]').localScroll({
                offset: scrollOffset,
                duration: 800,
                easing: $('#page-wrapper').data('scroll-easing')
            });

            $('#page-wrapper.padding-t-header').css('padding-top',$header.outerHeight()+'px');

            // Scroll Progress 

            var $scrollProgress = $('#scroll-progress');

            $(window).scroll(function() {
                var scrolled = $(window).scrollTop();
                var windowWidth = $(window).width();
                var windowHeight = $(window).height()
                var bodyHeight = $('body').height()-windowHeight;
                var height = ((scrolled / bodyHeight)*windowWidth);
                setTimeout(function(){
                    $scrollProgress.css('width',height+'px');
                },100);
            });

            var changeNavBg = function($section) {
                if($section.data('header-change')==true) {
                    var color = $section.css('background-color');
                    $header.css('background-color',color);
                    $mobileNav.css('background-color',color);
                } else if ($section.data('header-transparent')==true) { 
                    $header.css('background-color','transparent');
                } else {
                    $header.css('background-color','');
                    $mobileNav.css('background-color','');
                }
            };

            var $menuItem = $('#main-menu li > a, #side-nav li > a');
            var checkMenuItem = function(id) {
                $menuItem.each(function(){
                    var link = $(this).attr('href');
                    if(id==link) $(this).addClass('active');
                    else $(this).removeClass('active');
                });
            }

            $body.waypoint({
                handler: function(direction) {
                    $header.toggleClass('sticky')
                },
                offset: function() {
                    return -$(window).height()+66;
                }
            });
            $body.waypoint({
                handler: function(direction) {
                    $header.toggleClass('unvisible')
                },
                offset: function() {
                    return -$header.height();
                }
            });
            $section.waypoint({
                handler: function(direction) {
                    if(direction=='up') {
                        var $activeSection = $(this.element);
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                        changeNavBg($activeSection);
                    }
                },
                offset: function() {
                    if($header.hasClass('header-horizontal')) return -this.element.clientHeight+66;
                    else return -$(window).height()/2;
                }
            });
            $section.waypoint({
                handler: function(direction) {
                    if(direction=='down') {
                        var $activeSection = $(this.element);
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                        changeNavBg($activeSection);
                    }
                },
                offset: function() {
                    if($header.hasClass('header-horizontal')) return 66;
                    else return $(window).height()/2;
                }
            });
            $(window).resize(function(){
                setTimeout(function(){
                    Waypoint.refreshAll()
                },600);
            });
        },
        masonry: function() {

            var $grid = $('.masonry-grid','#page-wrapper');

            $grid.masonry({
                columnWidth: '.masonry-sizer',
                itemSelector: '.masonry-item',
                percentPosition: true
            });

            $grid.imagesLoaded().progress(function() {
                $grid.masonry('layout');
            });

            $grid.on('layoutComplete', Waypoint.refreshAll());

        },
        ajaxLoader: function() {

            var toLoad;
            var offsetTop;

            var $ajaxLoader = $('#ajax-loader');
            var $ajaxModal = $('#ajax-modal');
            var isAjaxModal = false;

            function showNewContent() {
                $ajaxModal.fadeIn(200, function(){
                    $('html').addClass('locked-scrolling');
                });
            }
            
            function loadContent() {　
               $ajaxModal.load(toLoad);
        　  }
            
            $('a[data-target="ajax-modal"]').on('click', function() {
                isAjaxModal = true;
                offsetTop = $(document).scrollTop();
                toLoad = $(this).attr('href');　
                loadContent();
                return false; 
            });

            $(document).ajaxStart(function() {
                if(isAjaxModal) $ajaxLoader.fadeIn(200);
            });
            $(document).ajaxStop(function() {
                if(isAjaxModal) { 
                    $ajaxLoader.fadeOut(200, function() {
                        showNewContent();
                    });
                }
            });

            function closeDetails() {
                isAjaxModal = false;
                $('html').removeClass('locked-scrolling');
                $(document).scrollTop(offsetTop)
                $ajaxModal.fadeOut(200);
            }

            $ajaxModal.delegate('*[data-dismiss="close"]','click', function(){
                closeDetails();
                return false;
            });

        },
        mobileNav: function() {
            $('[data-target="mobile-nav"]').on('click', function(){
                $('body').toggleClass('mobile-nav-open');
                return false;
            });
        },
        verticalCenter: function() {
            
            var vCenter = function () {
                $('.v-center').each(function() { 
                    $(this).css({
                        'margin-top': ($(this).parent().height()/2)-($(this).outerHeight()/2)+'px'
                    })
                });
            };
            vCenter();
            $(window).resize(vCenter);

        },
        map: function() {

            function mapInitialize() {

                var $googleMap = $('#google-map');

                var yourLatitude = $googleMap.data('latitude');   
                var yourLongitude = $googleMap.data('longitude');     

                var pickedStyle = $googleMap.data('style');   
                var myOptions = {
                    zoom: 14,
                    center: new google.maps.LatLng(yourLatitude,yourLongitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false,
                    panControl: false,
                    zoomControl: true,
                    scaleControl: false,
                    streetViewControl: false,
                scrollwheel: false
                };

                window.map = new google.maps.Map(document.getElementById('google-map'), myOptions);

                var image = 'assets/img/my-location.png';
                var myLatLng = new google.maps.LatLng(yourLatitude,yourLongitude);
                var myLocation = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: image
                });
            
            }
            
            google.maps.event.addDomListener(window, 'load', mapInitialize);

        },
        forms: function() {

            var $formAlert  = $('#form-alert');
            var $formError  = $('#form-error');

            // Basic Form 

            var $basicForm  = $('.basic-form');
            $basicForm.validate({
                errorPlacement: function(error, element) { }
            });
            $basicForm.submit(function() {
                if(!$basicForm.valid()) $formError.show();
            });

            // Contact Form

            var $contactForm  = $('#contact-form');
    
            $contactForm.validate({
                errorElement: 'span',
                errorContainer: '#form-error',
                errorLabelContainer: "#form-error ul",
                wrapper: "li",
                rules: {
                    name: {
                        required    : true,
                        minlength   : 2
                    },
                    email: {
                        required    : true,
                        email       : true
                    },
                    message: {
                        required    : true,
                        minlength   : 10
                    }
                },
                messages: {
                    name: {
                        required    : "Please enter your name.",
                        minlength   : "Your name needs to be at least 2 characters"
                    },
                    email: {
                        required    : "Please enter your email address.",
                        minlength   : "You entered an invalid email address."
                    },
                    message: {
                        required    : "Please enter a message.",
                        minlength   : "Your message needs to be at least 10 characters"
                    }
                }
            });
        
            $contactForm.submit(function() {
                var response;
                $formAlert.hide().text();
                if ($contactForm.valid()){
                    $.ajax({
                        type: "POST",
                        url: "assets/php/contact-form.php",
                        data: $(this).serialize(),
                        success: function(msg) {
                            if (msg === 'SEND') {
                                response = '<div class="alert alert-success">Done! Thank for your message - You will get you an answer as fast as possible!';
                            }
                            else {
                                response = '<div class="alert alert-danger">Ooops... It seems that we have a problem.';
                            }
                            $formAlert.prepend(response);
                            $formAlert.show();
                        }
                     });
                    return false;
                }
                return false;
            });

        }
    },
    Component: {
        init: function() {  

            this.carousel();  
            this.slideshow();   
            this.modal(); 
            this.chart();
            this.tooltip(); 
            this.popover();

        },
        modal: function() {

            $('.modal').on('show.bs.modal', function () {
                $('body').addClass('modal-opened');
            });

            $('.modal').on('hide.bs.modal', function () {
                $('body').removeClass('modal-opened');
            });

            $('#mapModal').on('shown.bs.modal', function () {
                google.maps.event.trigger(map, 'resize');
            }); 

        },
        chart: function() {

            $('.chart').each(function(){ 

                var size = $(this).data('size');

                $(this)
                    .easyPieChart({
                        barColor: $(this).data('bar-color'),
                        trackColor: $(this).data('track-color'),
                        scaleColor: false,
                        size: size,
                        lineWidth: $(this).data('line-width'),
                        animate: 1000,
                        onStep: function(from, to, percent) {
                            $(this.el).find('.percent').text(Math.round(percent));
                        },
                        onStart: function() {
                            Kwadrat.Basic.verticalCenter();
                        }
                    })
                    .css({
                        'width': size+'px',
                        'height': size+'px'
                    })
                    .children('.percent').css('line-height',size+'px');

            });

            $('.chart').appear(function() {
                $(this).each(function(){ 
                    var $chart = $(this);
                    var value = $(this).data('value');
                    setTimeout(function(){
                        $chart.data('easyPieChart').update(value);
                    },200);
                });
            });
        },  
        checkBrowser: function() {
            var ua = navigator.userAgent.toLowerCase(); 
            if (ua.indexOf('safari') != -1) { 
                if (ua.indexOf('chrome') > -1) {
                  $('html').addClass('chrome');
                  window.chrome=true;
                } else {
                  $('html').addClass('safari');
                  window.safari=true;
                }
            }
            if (ua.indexOf('msie') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                $('html').addClass('ie');
                window.msie=true;
            }
        },
        onResize: function(func) {
            $(window).resize(function() {
                setTimeout(func(),400);
            });
        },
        editableAlpha: function() {

            $('.overlay, .editable-alpha').each(function() {
                $(this).css('opacity',$(this).attr('data-alpha')/100);
            });

        },
        carousel: function() {
            $('.carousel').owlCarousel({
                items : $(this).data('items'),
                itemsDesktop : $(this).data('items-desktop'),
                itemsDesktopSmall : false,
                itemsTablet : $(this).data('items-tablet'),
                itemsMobile : $(this).data('items-mobile'),
                singleItem : $(this).data('single-item'),
                autoPlay : $(this).data('auto-play'),
                pagination : $(this).data('pagination'),
                stopOnHover: true,
                afterInit: function() {
                    Kwadrat.Basic.verticalCenter();
                }
            });
        },
        slideshow: function() {
            $('.slideshow').owlCarousel({
                singleItem : true,
                autoPlay : $(this).data('auto-play'),
                pagination : false,
                transitionStyle : 'fade'
            });
        },
        tooltip: function() {
            $("[data-toggle='tooltip']").tooltip();
        },
        popover: function() {
            $("[rel='popover']").popover();
        }
    }
};

$(document).ready(function (){

    Kwadrat.init();

});
