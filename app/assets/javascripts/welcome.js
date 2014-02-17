$(document).ready(function() {
	var map = L.mapbox.map('map-basic').setView([19.4368, -99.1173], 15);
	var metrobus = null;
	var metro = null;
	var suburbano = null;
	var electricos = null;
	
	var transportsManager = null;
	var polygonsManager = null;
	
	/*
	   $('.layer a').removeClass('selected');
	$(this).addClass('selected');
	$('#radius-panel').removeClass('hidden');
	if($(this).attr('id') == "radio500") {
		radiusManager.enableRadius(500);
	}	else if($(this).attr('id') == "radio800") {				
		radiusManager.enableRadius(800);
	}	else if($(this).attr('id') == "radio1000") {
		radiusManager.enableRadius(1000);
	}	else if($(this).attr('id') == "radio2000") {
		radiusManager.enableRadius(2000);
	}
	*
	*/
	
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
			if($(this).attr('id') == 'agebs') {
				polygonsManager.toggleAgebsPanel();
			} else if($(this).attr('id') == 'radius') {
				polygonsManager.toggleRadiusPanel();
			} else if($(this).hasClass('radius')) {
				var size = $(this).attr('data-size');
				polygonsManager.showRadiusPanel(size);
			}
		});

		$('.layer').mouseover(function() {
			$(this).tooltip('show');
		});

		$('.layer').mouseout(function() {
			$(this).tooltip('show');
		});

		var loadTogglersIn = function(parentDom) {
			var hideAll = function() {
				$(parentDom+' .toggler').removeClass('selected');
				$(parentDom+' .panel').addClass('hidden');
			}

			$(parentDom+' .toggler').click(function() {
				if ($(this).hasClass('selected')) {
					hideAll();
				} else {
					hideAll();
					$(this).addClass('selected');

					var first = $(this).attr('id').split('-')[0];
					$('#'+first+'-panel').removeClass('hidden');
				}
			});
		}

		loadTogglersIn('.right-panel');
		
		transportsManager = new TransportsManager(map);
		
		setTimeout(function() {
			polygonsManager = new PolygonsManager(map, function() {
				$('.loading-cover').fadeOut();
			});
		}, 1200);
		
	}
	
	loadMain();
});