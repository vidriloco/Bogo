$(document).ready(function() {
	var map = null;
	var metrobus = null;
	var metro = null;
	var suburbano = null;
	var electricos = null;

	var transportsManager = null;
	var polygonsManager = null;

	var loadMap = function() {
		if(map == null) { 
			map = L.mapbox.map('map-basic', null, { zoomControl:false }).setView([19.4368, -99.1173], 15);
			new L.Control.Zoom({ position: 'topright' }).addTo(map);

			/*
			 *  loadMain
			 *
			 *  Loads and wires the interface for interacting with the map layers
			 *  and also initializes the managers for: stations and agebs
			 *
			 */
			var loadMain = function() {

				var layerUrl = 'http://{s}.tiles.mapbox.com/v3/atogle.map-vo4oycva/{z}/{x}/{y}.png';
				var layerAttribution = 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>';
				var baseLayer = new L.TileLayer(layerUrl, {maxZoom: 19, attribution: layerAttribution, zIndex: 0, unloadInvisibleTiles: false });
				var googleHybrid = new L.Google('HYBRID');

				map.addLayer(baseLayer);

				$('a.show-carto').bind('click', function() {
					map.removeLayer(googleHybrid);
					map.addLayer(baseLayer);
					baseLayer.bringToBack();
					$(this).parent().addClass('hidden');
					$('a.show-satellite').parent().removeClass('hidden');
				});

				$('a.show-satellite').bind('click', function() {
					map.removeLayer(baseLayer);
					map.addLayer(googleHybrid);
					$(this).parent().addClass('hidden');
					$('a.show-carto').parent().removeClass('hidden');
				});

				$('a.polygons-off').bind('click', function() {
					polygonsManager.disablePanelsForRadius();
					$(this).parent().addClass('hidden');
					$('a.polygons-on').parent().removeClass('hidden');
				});

				$('a.polygons-on').bind('click', function() {
					polygonsManager.reenablePanelsForRadius();
					$(this).parent().addClass('hidden');
					$('a.polygons-off').parent().removeClass('hidden');
				});

				$('.transport-layer a').bind('click', function() {
					transportsManager.toggle($(this).attr('id'));
					polygonsManager.redrawActiveLayer();
				});

				$('a.polygon-layer').bind('click', function() {
					var size = $(this).attr('data-size');
					$('.select-radius').addClass('hidden');
					$('.radius-options .'+size+'-message').clone().appendTo('.radius-header');

					$('#radius-close').on('click', function() {
						$('.select-radius').removeClass('hidden');
						polygonsManager.disablePanelsForRadius(true);
					});

					polygonsManager.showRadiusPanel(size);
				});

				$('.icon-section').mouseover(function() {
					$(this).tooltip('show');
				});

				$('.icon-section').mouseout(function() {
					$(this).tooltip('hide');
				});

				$('.toggler').bind('click', function() {
					var targetId = '#'+$(this).attr('id').split('-')[0];
					if(!$(targetId).hasClass('off')) {
						$(targetId).transition({x: '-260px'}, function() {
							$(targetId).addClass('off');
						});
						$(targetId+' .panel').transition({opacity : 0});
					} else {
						$(targetId).transition({x: '0px'}, function() {
							$(targetId).removeClass('off');
						});
						$(targetId+' .panel').transition({opacity : 1});
					}
				});

				$('#minimizer').bind('click', function() {
					$(this).addClass('hidden');
					$('#maximizer').removeClass('hidden');
					$('.toggable-panel').addClass('opaque');
				});

				$('#maximizer').bind('click', function() {
					$(this).addClass('hidden');
					$('#minimizer').removeClass('hidden');
					$('.toggable-panel').removeClass('opaque');
				});


				//$('.loading-cover').fadeOut();
				transportsManager = new TransportsManager(map);

				setTimeout(function() {
					polygonsManager = new PolygonsManager(map, transportsManager, function() {
						$('.loading-cover').fadeOut();
					});
				}, 1200);
			}
			loadMain();
		}
	}




	$.fn.fullpage({
		css3: true,
		navigation: false,
		resize : true,
		anchors:['main', 'map', 'dot', 'about'],
		afterLoad: function(anchorLink, index){
       //using index
       if(index == '2'){
					loadMap();
       }
     }
	});
});
