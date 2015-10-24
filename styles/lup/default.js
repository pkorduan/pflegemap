/* ==========================================================
  Base Default JavaScript
  -- Table of Contents --
*/


// JS functions and initiations go here...

/* ========================================================================
 * Bootstrap: tab.js v3.3.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


jQuery(function($) {
    'use strict';

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function (element) {
        this.element = $(element)
    }

    Tab.VERSION = '3.3.1'

    Tab.TRANSITION_DURATION = 150

    Tab.prototype.show = function () {
        var $this    = this.element
        var $ul      = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return

        var $previous = $ul.find('.active:last a')
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        })
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        })

        $previous.trigger(hideEvent)
        $this.trigger(showEvent)

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.closest('li'), $ul)
        this.activate($target, $target.parent(), function () {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            })
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            })
        })
    }

    Tab.prototype.activate = function (element, container, callback) {
        var $active    = container.find('> .active')
        var transition = callback
            && $.support.transition
            && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')
                .end()
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', false)

            element
                .addClass('active')
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', true)

            if (transition) {
                element[0].offsetWidth // reflow for transition
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }

            if (element.parent('.dropdown-menu')) {
                element
                    .closest('li.dropdown')
                    .addClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true)
            }

            callback && callback()
        }

        $active.length && transition ?
            $active
                .one('bsTransitionEnd', next)
                .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
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

    var clickHandler = function (e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
    }

    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)
});

jQuery(function($) {
    $('.ka-panel.close .ka-content').hide();
    $('.ka-handler').click(function(event, data) {
        $panel = $(this).parents('.ka-panel');
        $content = $panel.find('.ka-content');
        if($panel.is('.close')) {
            $('.ka-panel.ka-opend').removeClass('ka-opend');
            $content.slideDown();
            $panel.removeClass('close').addClass('open');
            $('.ka-panel.open .ka-handler').trigger('click', {clicked: $('.ka-panel').index($panel)});
        }
        else {
            if(!data) {
                data = { clicked: -1 };
            }
            if(data.clicked != $('.ka-panel').index($panel)) {
                $content.slideUp();
                $panel.removeClass('open').addClass('close');
            }
        }
    });
});

function animateInit () {
    $.each($('.animate'), function () {
        $(this).on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', 'ol li.next, ol li.prev', function () {
            $(this).parent().find('li').removeClass('active next prev move-left move-right');
            $(this).addClass('active');
        });

        var count = $(this).find('li').length;
        $(this).find('.pagecounter .total').text(count);

        if(!$(this).find('.pagecounter').length) {
            $(this).prepend('<ul class="nav"></ul>');
            for (var i = 1; i <= count; i++) {
                if (i == 1){
                    $(this).children('ul.nav').append('<li class="active"></li>');
                }
                else
                {
                    $(this).children('ul.nav').append('<li></li>');
                }
            }
        }

        $(this).on('click', '.nav-right', function () {
            var animate = $(this).closest('.animate');
            var activeSlide = animate.find('ol .active');
            var nextSlide = activeSlide.next();
            if (nextSlide.length === 0) { nextSlide = animate.find('ol li:first');}

            nextSlide.addClass('next');
            nextSlide[0].offsetWidth;	// force reflow
            activeSlide.addClass('move-left');
            nextSlide.addClass('move-left');

            animate.find('.nav li').removeClass('active');
            animate.find('.nav li:eq('+nextSlide.index()+')').addClass('active');

            animate.find('.pagecounter .active').text(nextSlide.index()+1);
        });

        $(this).on('click', '.nav-left', function () {
            var animate = $(this).closest('.animate');
            var activeSlide = animate.find('ol .active');
            var nextSlide = activeSlide.prev();
            if (nextSlide.length === 0) { nextSlide = animate.find('ol li:last');}

            nextSlide.addClass('prev');
            nextSlide[0].offsetWidth;	// force reflow
            activeSlide.addClass('move-right');
            nextSlide.addClass('move-right');

            animate.find('.nav li').removeClass('active');
            animate.find('.nav li:eq('+nextSlide.index()+')').addClass('active');

            animate.find('.pagecounter .active').text(nextSlide.index()+1);
        });

        $(this).on('click', '.nav li', function () {
            var animate = $(this).closest('.animate');
            var activeSlide = animate.find('ol .active');
            var nextSlide = animate.find('ol li').eq($(this).index());

            nextSlide.addClass('next');
            nextSlide[0].offsetWidth;	// force reflow
            activeSlide.addClass('move-left');
            nextSlide.addClass('move-left');

            animate.find('.nav li').removeClass('active');
            animate.find('.nav li:eq('+nextSlide.index()+')').addClass('active');

            animate.find('.pagecounter .active').text(nextSlide.index()+1);

        });
    });
}

var body = $('body');

function changeBodyClass() {
    $('body').toggleClass('show-menu');
}

$('.gallery-big').on('mouseenter', function () {
    $('.slider-arrow').stop(true, false).animate({
        'opacity': 0.8
    }, 500);
});
$('.gallery-big').on('mouseleave', function () {
    $('.slider-arrow').stop(true, false).animate({
        'opacity': 0
    }, 500);
});



initGallery = function() {
	/* Picture gallery */

	$('.gallery').each(function(gindex){
		// add instance id
		var instance_id = gindex;
		var gallery = $(this);
			gallery.attr('id','gy_'+instance_id);
			gallery.find('.gallery-big').attr('id','bg_g'+instance_id);

		var thumbline = gallery.find('.gallery-preview');
		var thumbs = thumbline.find('img');
		thumbline.data('sPos', 0).data('sMax',thumbs.length);
		thumbline.css({
			width: thumbs.length * 160
		});
		thumbline.parent().css({overflow: 'hidden'});

		$(this).find('.gallery-big figcaption').attr('id','bg_c'+gindex);
		// process thumbs
		thumbline.find('img').each(function(index){
			// catch lightbox config
			var title = $(this).parent('a').attr('title');
			if (title == undefined) { title = ''; }
			$.data(this, 'title', title);
			$.data(this, 'fullPic', $(this).parent('a').attr('href'));
			$(this).unwrap(); // kill lightbox
			$(this).attr('id',index);
			$(this).click(function(){
				var currentID = parseInt($(this).attr('id'));
				var max = thumbline.data('sMax');
				// toggle active border
				thumbline.find('.gallery-preview-active').toggleClass('gallery-preview-active',false);
				var thisLi = $(this).parentsUntil('li').eq(0).parent();
				thisLi.toggleClass('gallery-preview-active',true);
				// scrollto pos
				thumbline.data('sPos', currentID ).stop(true,false).animate({
					marginLeft: - ( currentID * thisLi.width() )
				}, 1000);

				var till = (((currentID+1)+4) > max) ? max : ((currentID+1)+4);
				$('#bg_i'+gindex+'').text('Bilder '+(currentID+1)+' - '+till+' von insgesamt '+max);

				// set LB img to bigview
				var gallery_big = $('#bg_g'+gindex);
				gallery_big.animate('.bigpic').css({
					minHeight: gallery_big.find('.bigpic').height()
				},200);
				$('#bg_c'+gindex+'').text($(this).data('title'));

				gallery_big.find('img').data('nextPic', $(this).data('fullPic')).animate({opacity:0 }, 500, function(){
					// after fadeOut, set new img and after it's loaded, set its dimensions
					$(this).attr('src', $(this).data('nextPic')).load(function(){
						$(this).animate({opacity:1},500, function (){
							$(this).css({display: 'block'});
							setTimeout(function(){
								gallery_big.animate('.bigpic').css({
									minHeight: 0
								},200);
							},300);

						});
					});
				});
			});

		});

		$(this).find('.gallery-big .slide-left').click(function(){
			var sPos = thumbline.data('sPos');
			var sMax = thumbline.data('sMax');
			sPos = sPos - 1;
			if(sPos < 0) { sPos = sMax -1; }
			thumbs.eq(sPos).trigger('click');
		});
		$(this).find('.gallery-big .slide-right').click(function(){
			var sPos = thumbline.data('sPos');
			var sMax = thumbline.data('sMax');
			sPos = sPos + 1;
			if(sPos >= sMax) { sPos = 0; }
			thumbs.eq(sPos).trigger('click');
		});

		// next / prev buttons
		$(this).find('.nav-right').click(function(){
			var sPos = parseInt(thumbline.data('sPos'));
			sPos = sPos + 2;
			if(sPos >= thumbline.data('sMax')) { sPos = 0; }
			var el = thumbs.eq(sPos);
			var thisID = parseInt(el.attr('rel'));
			var thisLi = el.parent().parent();
			thumbline.data('sPos', thisID ).stop(true,false).animate({
				marginLeft: - ( thisID * thisLi.width() )
			}, 1000);
		});
		$(this).find('.nav-left').click(function(){
			var sPos = parseInt(thumbline.data('sPos'));
			if(sPos == 0) {
				sPos = sPos = thumbline.data('sMax')-1;
			} else {
				sPos = sPos - 2;
				if(sPos < 0) { sPos = 0; }
			}
			var el = thumbs.eq(sPos);
			var thisID = parseInt(el.attr('rel'));
			var thisLi = el.parent().parent();
			thumbline.data('sPos', thisID ).stop(true,false).animate({
				marginLeft: - ( thisID * thisLi.width() )
			}, 1000);
		});
		// init selection
		thumbs.first().trigger('click');
	});
	/* end galerie */
};

initReportBars = function() {
	$('.reportitem .bar').each(function() {
		var val = parseFloat($(this).text());
		var wval = (0.94 * (val/100)) + 0.06;
		var cval = (0.5 * (val/100)) + 0.5;
		var perc = (wval*100);
		$(this).css({
			backgroundColor: 'rgba(39, 174, 97, '+(cval)+')'
		});
        $(this).animate({width:perc + '%'}, 1500);
	})
};

var contentHeight = $('section.content').innerHeight();
/*var sideHeight = $('aside.navcolumn')[0].scrollHeight; -> document.ready*/
var bodyWidth = $('body').width();
if(isNaN(parseFloat(bodyWidth))) {
    bodyWidth = $(window).width();
}
var sideScrolled = 0;

$(window).resize(function() {
    bodyWidth = $('body').width();
});

function setSideMenuSticky() {
    var menuHeight = $('aside.navcolumn')[0].scrollHeight;
    var iconHeight = menuHeight-$('header').innerHeight();
    var scrolled = $(window).scrollTop();
    var contentHeight = $('section.content').innerHeight();
    if ((contentHeight - menuHeight + sideScrolled) < scrolled)
    {
        $('aside.navcolumn').toggleClass('flow',true);
        $('.container > header').toggleClass('flow',true);
        $('.container > header').css('bottom',iconHeight);
        $('.container > header').css('top','auto');

    } else {
        toggleSideMenu();
    }
}

function toggleSideMenu () {
    $('aside.navcolumn').toggleClass('flow',false);
    $('.container > header').toggleClass('flow',false);
    $('.container > header').css('bottom','auto');
}

function setHeaderSticky() {
    sideScrolled = $('aside.navcolumn').scrollTop();
    $('.container > header').css('top', -sideScrolled);
}

if(bodyWidth > 1240){
    $(window).scroll(function() {
        watchSidebarHeight();
        setSideMenuSticky();
    });
    $('aside.navcolumn').scroll(function() {
        setHeaderSticky();
    });
}

$('#myTab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
});

var anz = 0;
var add = 8;

function initEventList() {
	var eventlist = $('ol.partial');
	var events = eventlist.children('li');
	var cur = 8;
	anz = events.length;
	events.slice(cur, anz).hide();
	if (anz > 8) {
		var showMoreBtn = $('<div class="pagination showmore"><a class="more page-numbers" href="#">Weitere Pressemitteilungen anzeigen</a></div>');
			showMoreBtn.on('click', function (e) {
				e.preventDefault();

				if (bodyWidth > 1240)
					toggleSideMenu();

				var slideInQueue = function(el,stack){
					if (stack > 0) {
						stack--;
						el.slideDown(500,function(){
							slideInQueue(el.next('li'),stack);
						});
					}
				};
				slideInQueue(events.eq(cur),add);

				cur = cur + add;
				if (anz > cur) {
					showMoreBtn.fadeIn();
				} else {
					showMoreBtn.hide();
				}
			});
		eventlist.append(showMoreBtn);
	}
}

//OpenStreetMap
var OpenLayers, lon, lat, zoom, map, info;

function loadMap() {
    "use strict";

    OpenLayers.Lang.setCode('de');

    map = new OpenLayers.Map({
        div: "map",
        projection: "EPSG:25833",
        resolutions: [176.388888889, 88.1944444444, 35.2777777778, 17.6388888889, 7.0555555556, 5.2916666667, 3.5277777778, 2.6458333333, 1.7638888889, 0.8819444444, 0.3527777778, 0.1763888889],
        maxExtent:  new OpenLayers.Bounds(200000, 5880000, 480000, 6075000),
        restrictedExtent: new OpenLayers.Bounds(200000, 5880000, 480000, 6075000),
        units: 'm'
    });
    var orka = new OpenLayers.Layer.WMS("Offene Regionalkarte MV",
        "http://geo.sv.rostock.de/geodienste/stadtplan/wms",
        {'layers': 'stadtplan', transparent: true, format: 'image/png'},
        {isBaseLayer: true}
    );
//  orka.opacity = 0.8;
    orka.attribution = "Kartenbild &copy Hansestadt Rostock (<a href='http://creativecommons.org/licenses/by/3.0/deed.de' target='_blank'>CC BY 3.0<\/a>)<br/>Kartendaten &copy <a href='http://www.openstreetmap.org/' target='_blank'>OpenStreetMap<\/a> (<a href='http://opendatacommons.org/licenses/odbl/' target='_blank'>ODbL<\/a>) und <a href='https://geo.sv.rostock.de/uvgb.html' target='_blank'>uVGB-MV<\/a>";
    var dop = new OpenLayers.Layer.WMS("Luftbild",
        "http://www.geodaten-mv.de/dienste/adv_dop?",
        {layers: 'adv_dop', format: 'image/jpeg', transparent: 'false' },
        {isBaseLayer: true}
    );
//  dop.opacity = 0.8;
    dop.attribution = "Luftbild (Digitale Orthophotos) &copy <a href='http://www.geoportal-mv.de/land-mv/GeoPortalMV_prod/de/Geowebdienste/index.jsp' target='_blank'>GeoBasis-DE/M-V<\/a>";
    var kreis = new OpenLayers.Layer.WMS("Kreisgrenze",
        "http://geoportal.kreis-swm.de/wms/lwlpch",
        {layers: 'Kreisgrenze', transparent: true, format: 'image/png'},
        {singleTile: true, ratio: 1}
    );
    var buergerbueros = new OpenLayers.Layer.WMS("Bürgerbüros Lkr. LWL-PCH",
        "http://geoportal.kreis-swm.de/wms/lwlpch",
        {layers: 'Buergerbueros', format: 'image/png', transparent: 'true' },
        {singleTile: true, ratio: 1}
    );
    var buergerbuerosn = new OpenLayers.Layer.WMS("Bürgerbüro Schwerin",
        "http://geoportal.kreis-swm.de/wms/lwlpch",
        {layers: 'Buergerbuero_Schwerin', format: 'image/png', transparent: 'true'},
        {singleTile: true, ratio: 1, visibility: false}
    );
    var buergerbuerogepl = new OpenLayers.Layer.WMS("künftige Bürgerbüros",
        "http://geoportal.kreis-swm.de/wms/lwlpch",
        {layers: 'Buergerbuero_in_Vorbereitung', format: 'image/png', transparent: 'true'},
        {singleTile: true, ratio: 1, visibility: true}
    );
    var highlight = new OpenLayers.Layer.Vector("Highlighted Features",
        {displayInLayerSwitcher: false, isBaseLayer: false}
    );
    map.addLayers([orka, dop, buergerbueros, buergerbuerosn, buergerbuerogepl, highlight]);
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
    info = new OpenLayers.Control.WMSGetFeatureInfo({
        url: 'http://geoportal.kreis-swm.de/wms/lwlpch',
        title: 'Identify features by clicking',
        queryVisible: true,
        eventListeners: {
            getfeatureinfo: function (event) {
                if (event.text) {
                    map.addPopup(new OpenLayers.Popup.FramedCloud(
                        "wolke",
                        map.getLonLatFromPixel(event.xy),
                        null,
                        event.text,
                        null,
                        true
                    ),
                        {
                            fixedRelativePosition: false
                        }
                    );
                }
            }
        }
    });
    map.addControl(info);
    info.activate();
    //  maximize LayerSwitcher
    var switcherControl = new OpenLayers.Control.LayerSwitcher();
    map.addControl(switcherControl);
    switcherControl.maximizeControl();
    map.addControl(new OpenLayers.Control.OverviewMap({maximized: false}));
    map.addControl(new OpenLayers.Control.Scale());
    map.addControl(new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}));
    if (!map.getCenter()) {
        map.setCenter(new OpenLayers.LonLat(267249, 5914792), 0);
    }
}

function initRegionMapSelect() {
    var region_select = $('#region,#aemter');

    var locations = {
        region: {
            'Boizenburg/Elbe': [-65,30, 'http://www.boizenburg.de/'],
            'Hagenow': [18,17, 'http://www.hagenow.de/'],
            'Lübtheen': [-5,55, 'http://www.luebtheen.de/'],
            'Ludwigslust': [63,48, 'http://www.stadtludwigslust.de/'],
            'Parchim': [125,20, 'http://www.parchim.de/']
        },
        aemter: {
            'Amt Boizenburg-Land': [-47,30,'http://www.amtboizenburgland.de/'],
            'Amt Crivitz': [90,-20,'http://www.amt-crivitz.de/'],
            'Amt Dömitz-Malliß': [27,80,'http://www.amtdoemitz-malliss.de/'],
            'Amt Eldenburg Lübz': [160,30,'http://www.amt-eldenburg-luebz.de/'],
            'Amt Goldberg-Mildenitz': [160,-24,'http://www.amt-goldberg-mildenitz.de/'],
            'Amt Grabow': [70,80,'http://www.grabow.de/'],
            'Amt Hagenow-Land': [36,32,'http://www.amt-hagenow-land.de/'],
            'Amt Ludwigslust-Land': [55,15,'http://www.amt-ludwigslust-land.de/'],
            'Amt Neustadt-Glewe': [82,31,'http://www.neustadt-glewe.de/'],
            'Amt Parchimer Umland': [110,40,'http://www.amt-parchimer-umland.de/'],
            'Amt Plau am See': [194,20,'http://www.amtplau.de/'],
            'Amt Sternberger Seenlandschaft': [130,-60,'http://www.amt-sternberger-seenlandschaft.de/'],
            'Amt Stralendorf': [30,-20,'http://www.amt-stralendorf.de/'],
            'Amt Wittenburg': [-6,-4,'http://www.stadt-wittenburg.de/'],
            'Amt Zarrentin': [-24,16,'http://www.zarrentin.de/']
        }
    };

    region_select.on('change', function () {
        var id = $(this).prop('id');
        var popover = $('#'+id+'-popover');
        var val = $(this).val();
        if(val != '-') {
            var data = locations[id][val];
            popover.find('h3').text(val);
            popover.find('a').attr('href',data[2]);
            popover.css({
                top: data[1],
                left: data[0],
                marginTop: -20
            }).animate({opacity:1,marginTop:0},300);
        }
    }).on('blur', function () {
        $('#'+$(this).prop('id')+'-popover').animate({opacity:0,marginTop: -20},300);
    })
}

function triggerTab(direction) {
    var nav_position = $('.nav-tabs li.active').index();
    var real_position = nav_position + 1;
    if(direction == 'right') {
        var target_position = real_position + 1;
        if(target_position > tabCount) target_position = 1;
    } else {
        var target_position = real_position - 1;
        if(target_position == 0) target_position = tabCount;
    }
    $('.nav-tabs li:nth-child(' + target_position + ') a').trigger('click');
}

function watchSidebarHeight() {
    sideHeight = $('aside.navcolumn')[0].scrollHeight;
    if(sideHeight > contentHeight) {
        $('section.content').css('min-height',sideHeight);
    }
}

$(document).ready(function() {

	$('.gallery .stage li figure img').on('click', function () {
		var gIndex = $(this).parent().parent().parent().parent().parent().attr("id").substring(3,4);
		var imgsrc = ($(this).attr('src')).substring(0, ($(this).attr('src')).indexOf('?__'));
		$('#bg_g'+gIndex).find('a').prop('href', imgsrc);
	});

	var sideHeight = $('aside.navcolumn')[0].scrollHeight;

    // 2.1 Toggle JS Class
    $('html').removeClass('no-js').addClass('js');

    animateInit();
    if($('ol.partial').length) {
        initEventList();
    }

    if($('#map').length) {
        loadMap();
    }

    if($('#region-map').length) {
        initRegionMapSelect();
    }

    if(bodyWidth > 1240) {
        watchSidebarHeight();
        setSideMenuSticky();
        setHeaderSticky();
    }

    $('#open-button').on('touchstart, click', function() {
        changeBodyClass();
    });
/* navi click 
    $('nav li.sub').on('click', function(e){
        if($(this).hasClass('open')) {
            $(this).children('a').eq(0).trigger('click');
        } else {
            $(this).children('ul').slideDown();
            $(this).addClass('open');
            $(this).children('ul').animate({opacity: 1},300);
            watchSidebarHeight();
        }
        return false;
    });
*/

    if (!navigator.userAgent.match(/mobile/i)) {
        $('a.lightbox, .fancybox').fancybox();
    }	
	
	$('a.iframe').fancybox({
        type: "iframe"
    });	

    if(bodyWidth > 480) {
        //Check to see if the window is top if not then display button
        $(window).scroll(function(){
            if ($(this).scrollTop() > 300) {
                $('.scrollToTop').fadeIn();
            } else {
                $('.scrollToTop').fadeOut();
            }
        });

        //Click event to scroll to top
        $('.scrollToTop').on('touchstart, click',function(e){
            e.preventDefault();
            $('html, body').animate({scrollTop : 0},800);
            return false;
        });
    } else {
        $('.nav-tabs').parent().prepend('<div class="tab-left"></div><div class="tab-right"></div>');
    }

    if($('.tab-left').length) {
        tabCount = $('.nav-tabs li').length;
        $('.tab-left').on('click',function(){
            triggerTab('left');
        });
        $('.tab-right').on('click',function(){
            triggerTab('right');
        });
    }

    $('#show-comments').on('click',function(e){
        e.preventDefault();
        $('#comments').toggleClass('hidden',false).hide().fadeIn();
        $('#comments article').hide();
        $(this).fadeOut(300,function(){
            $('#write-comment').toggleClass('hidden',false).hide().fadeIn();
            var slideInQueue = function(el){
                el.slideDown(500,function(){
                    slideInQueue($(this).next());
                });
            };
            slideInQueue($('#comments article').eq(0));
        });
        return false;
    });

    $('#write-comment').on('click',function(e){
        if( bodyWidth <= 480) {
            e.preventDefault();
            var a = $('<a>',{ href: 'kommentar_schreiben_seite.html' });
            window.location.href = '//'+a.prop('hostname') + a.prop('pathname');
            return false;
        }
    });

    if($('input.calendar').length) {
        $('input.calendar').datepicker({
            dateFormat: 'dd-mm-yy',
            defaultDate: 0,
            yearRange: '-20:+5',
            changeYear: false
        });
    }

    // Zeichenzähler
    $('.length-counter').each(function (key, value) {
        var textarea = $(value).parent().parent().find('textarea');
        textarea.data('counter',value)
            .on('keyup', function (event,el) {
                var leng = $(this).prop('value').length;
                var maxLength = parseInt($(this).prop('maxlength'));
                if (leng > maxLength) {
                    var oldValue = $(this).prop('value');
                    var newValue = oldValue.substr(0, maxLength);
                    $(this).prop('value', newValue);
                    leng = maxLength;
                }
                $($(this).data('counter')).find('i').html(maxLength-leng);
            })
            .trigger('keyup');
    });

	initGallery();
	initReportBars();

}); // end document ready
