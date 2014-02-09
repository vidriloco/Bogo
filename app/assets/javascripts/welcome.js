$(document).ready(function() {
	var map = L.mapbox.map('map-basic').setView([19.4368, -99.1173], 15);
	var metrobus = null;
	var metro = null;
	var suburbano = null;
	var electricos = null;
	var radiusManager = null;
	var stationsManager = null;
	var agebsManager = null;
	
	var loadMain = function() {

		var layerUrl = 'http://{s}.tiles.mapbox.com/v3/atogle.map-vo4oycva/{z}/{x}/{y}.png';
		var layerAttribution = 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>';
		var baseLayer = new L.TileLayer(layerUrl, {maxZoom: 19, attribution: layerAttribution });
		map.addLayer(baseLayer);

		function toggleLayer(layer, zIndex, dom) {
			if (map.hasLayer(layer)) {
	        map.removeLayer(layer);
					$('#'+dom).parent().parent().removeClass('selected');
	    } else {
	        map.addLayer(layer);
					$('#'+dom).parent().parent().addClass('selected');
	    }
		}

		$('.layer a').bind('click', function() {
			if($(this).attr('id') == "metrobus") {
				if(metrobus == null) {
					metrobus = L.mapbox.tileLayer('vidriloco.nrr1yo7v');
				}
				toggleLayer(metrobus, 1, $(this).attr('id'));
				stationsManager.toggleMetrobus();
			} else if($(this).attr('id') == "metro") {
				if(metro == null) {
					metro = L.mapbox.tileLayer('vidriloco.59rkxcf9');
				}
				toggleLayer(metro, 2, $(this).attr('id'));
				stationsManager.toggleMetro();
			} else if($(this).attr('id') == "trensuburbano") {
				if(suburbano == null) {
					suburbano = L.mapbox.tileLayer('vidriloco.l0ofaqiq');
				}
				toggleLayer(suburbano, 3, $(this).attr('id'));
				stationsManager.toggleSuburbano();
			} else if($(this).attr('id') == "transporteselectricos") {
				if(electricos == null) {
					electricos = L.mapbox.tileLayer('vidriloco.3vgjbd6g');
				}
				toggleLayer(electricos, 4, $(this).attr('id'));
				stationsManager.toggleSTE();
			} else if($(this).attr('id') == "radio500") {
				radiusManager.enableRadius(500);
			}	else if($(this).attr('id') == "radio800") {
				radiusManager.enableRadius(800);
			}	else if($(this).attr('id') == "radio1000") {
				radiusManager.enableRadius(1000);
			}	else if($(this).attr('id') == "radio2000") {
				radiusManager.enableRadius(2000);
			}
		});

		$('#statistics-toggler').click(function() {
			agebsManager.detach();
		});

		$('#polygon-toggler').click(function() {
			radiusManager.detach();
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
		loadTogglersIn('.left-panel');
		
		agebsManager = new AgebsManager(map);
		radiusManager = new RadiusManager(map);
		stationsManager = new StationsManager(map);
	}
	
	loadMain();
});