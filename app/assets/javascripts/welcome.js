$(document).ready(function() {
	var map = L.mapbox.map('map-basic', null, { zoomControl:false }).setView([19.4368, -99.1173], 15);
	new L.Control.Zoom({ position: 'topright' }).addTo(map);
	var metrobus = null;
	var metro = null;
	var suburbano = null;
	var electricos = null;
	
	var transportsManager = null;
	var polygonsManager = null;
	
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
		var baseLayer = new L.TileLayer(layerUrl, {maxZoom: 19, attribution: layerAttribution });
		map.addLayer(baseLayer);
		
		$('.transport-layer a').bind('click', function() {
			transportsManager.toggle($(this).attr('id'));
		});
		
		$('a.polygon-layer').bind('click', function() {
			var size = $(this).attr('data-size');
			polygonsManager.showRadiusPanel(size);
		});

		$('.layer').mouseover(function() {
			$(this).tooltip('show');
		});

		$('.layer').mouseout(function() {
			$(this).tooltip('hide');
		});
		
		$('.toggler').bind('click', function() {
			var targetId = '#'+$(this).attr('id').split('-')[0];
			if(!$(targetId).hasClass('off')) {
				$(targetId).transition({x: '-440px'}, function() {
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
		
		transportsManager = new TransportsManager(map);
		
		setTimeout(function() {
			polygonsManager = new PolygonsManager(map, function() {
				$('.loading-cover').fadeOut();
			});
		}, 1200);
	}
	
	loadMain();
});