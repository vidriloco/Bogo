$(document).ready(function() {
	var map = L.mapbox.map('map-basic').setView([19.4368, -99.1173], 15);
	
	var layerUrl = 'http://{s}.tiles.mapbox.com/v3/atogle.map-vo4oycva/{z}/{x}/{y}.png';
	var layerAttribution = 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>';
	var baseLayer = new L.TileLayer(layerUrl, {maxZoom: 19, attribution: layerAttribution });
	map.addLayer(baseLayer);
	
	var metrobus = L.mapbox.tileLayer('vidriloco.xg62e187');
	var metro = L.mapbox.tileLayer('vidriloco.59rkxcf9');
	var suburbano = L.mapbox.tileLayer('vidriloco.l0ofaqiq');
	var electricos = L.mapbox.tileLayer('vidriloco.3vgjbd6g');
	var radiusManager = null;
	var stationsManager = null;
	
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
			toggleLayer(metrobus, 1, $(this).attr('id'));
			stationsManager.toggleMetrobus();
		} else if($(this).attr('id') == "metro") {
			toggleLayer(metro, 2, $(this).attr('id'));
		} else if($(this).attr('id') == "trensuburbano") {
			toggleLayer(suburbano, 3, $(this).attr('id'));
		} else if($(this).attr('id') == "transporteselectricos") {
			toggleLayer(electricos, 4, $(this).attr('id'));
			stationsManager.toggleSTE();
		} else if($(this).attr('id') == "radio500") {
			radiusManager.enableRadius(500);
		}
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
	
	var StationsManager = function() {
		var metrobus = null;
		var ste = null;
		
		var initialize = function() {
			// Add vector data to map
		  metrobus = L.geoJson(metrobusStations, {
				style: {
					weight: 0.1,
					color: 'transparent'
				},
				pointToLayer: function (feature, latlng) {                    
             return new L.CircleMarker(latlng, {
                 radius: 5,
                 fillColor: "transparent",
                 color: "transparent",
                 weight: 1,
                 opacity: 0,
                 fillOpacity: 0
             });
         },
		    onEachFeature: function (feature, layer) {
						layer.bindPopup("<p style='margin-top: 10px !important; margin-bottom: 0px !important; font-size: 13px'>"+feature.properties.Name+"</p>");
				}
		  });
		
			ste = L.geoJson(steStations, {
				style: {
					weight: 0.1,
					color: 'transparent'
				},
				pointToLayer: function (feature, latlng) {                    
             return new L.CircleMarker(latlng, {
                 radius: 5,
                 fillColor: "transparent",
                 color: "transparent",
                 weight: 1,
                 opacity: 0,
                 fillOpacity: 0
             });
         },
		    onEachFeature: function (feature, layer) {
						layer.bindPopup("<p style='margin-top: 10px !important; margin-bottom: 0px !important; font-size: 13px'>"+feature.properties.Name+"</p>");
				}
		  });
		}
		
		this.toggleMetrobus = function() {
			if(map.hasLayer(metrobus)) {
				map.removeLayer(metrobus);
			} else {
				map.addLayer(metrobus);
			}
		}
		
		this.toggleSTE = function() {
			if(map.hasLayer(ste)) {
				map.removeLayer(ste);
			} else {
				map.addLayer(ste);
			}
		}
		
		initialize();
	}
	
	/*
	 *  Stations Manager
	 *
	 */
	
	var RadiusManager = function() {
		var r500 = null;
		var r900 = null;
		var r1000 = null;
		var r2000 = null;
		var currentRadiusSelected = null;
		var geolayer = null;
		
		var style = {
			weight: 0.5,
			color: 'red'
		}
		
		var initialize = function() {
			// Add vector data to map
		  r500 = L.geoJson(radius500, {
				style: style,
		    onEachFeature: onEachFeature
		  });
		}

		
		// Set hover colors
	  var selectFeature = function(e) {
			resetHighlight(e);
			if(currentRadiusSelected != null) {
				currentRadiusSelected.setStyle(style);
			}
			assignStats(e.target.feature);
	    currentRadiusSelected = e.target;
	    currentRadiusSelected.setStyle({
	        weight: 3,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.7
	    });
			
	  }
	
		var highlightFeature = function(e) {
			var highlightedFeature = e.target;
			
			if(highlightedFeature != currentRadiusSelected) {
		    highlightedFeature.setStyle({
		        weight: 3,
		        color: '#666',
		        dashArray: '',
		        fillOpacity: 0.2
		    });
			} 
		}
		
		var deHighlightFeature = function(e) {
			var highlightedFeature = e.target;
			
			if(highlightedFeature != currentRadiusSelected) {
		    highlightedFeature.setStyle(style);
			} 
		}
		
		var assignStats = function(feature) {
		}

		// A function to reset the colors when a neighborhood is not longer 'hovered'
	  var resetHighlight = function(e) {
	    geoLayer.resetStyle(e.target);
	  }

	  // Tell MapBox.js what functions to call when mousing over and out of a neighborhood
	  var onEachFeature = function(feature, layer) {
	    layer.on({
				click: selectFeature,
				mouseover: highlightFeature,
				mouseout: deHighlightFeature
	    });
	  }
	
		this.enableRadius = function(number) {
			if(geolayer != null) {
				map.removeLayer(geolayer);
			}
			
			if(number == 500) {
				map.addLayer(r500);
				geolayer = r500;
			}
		}

		initialize();
	}
	
	/*
	 *   Agebs Manager
	 *
	 */
	
	var AgebsManager = function() {
		var geoLayer = null;
		var agebsLayer;
		var layer = null;
		
		var initialize = function() {
			// Add vector data to map
		  geoLayer = L.geoJson(agebs, {
				style: {
					weight: 0.1,
					color: 'transparent'
				},
		    onEachFeature: onEachFeature
		  });
			agebsLayer = L.mapbox.tileLayer('vidriloco.aohg0k9c');
			
			$('#polygon-toggler').bind('click', function() {
				if($(this).hasClass('selected')) {
					enable();
				} else {
					disable();
				}
			});
		}
		
		// Set hover colors
	  var selectFeature = function(e) {
			//resetHighlight(e);
			if(layer != null) {
				layer.setStyle({
					weight: 0.1,
					color: 'transparent'
				});
			}
			assignStats(e.target.feature);
	    layer = e.target;
	    layer.setStyle({
	        weight: 3,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.7
	    });
	
	  }
	
		var highlightFeature = function(e) {
			var highlightedFeature = e.target;
			
			if(highlightedFeature != layer) {
		    highlightedFeature.setStyle({
		        weight: 3,
		        color: '#666',
		        dashArray: '',
		        fillOpacity: 0.2
		    });
			} 
		}
		
		var deHighlightFeature = function(e) {
			var highlightedFeature = e.target;
			
			if(highlightedFeature != layer) {
		    highlightedFeature.setStyle({
					weight: 0.1,
					color: 'transparent'
				});
			} 
		}
	
		var assignStats = function(feature) {
			
			$('#ageb_population').html(feature.properties.pob1 || '--');
			$('#ageb_houses').html(feature.properties.viv0 || '--');
			$('#ageb_density').html(feature.properties.densidad_av || '--');
			
			$('#ageb_population_with_job').html("% "+new Number(feature.properties.eco4_r).toPrecision(3) || '--');
			$('#ageb_population_without_job').html("% "+new Number(feature.properties.eco25_r).toPrecision(3) || '--');
			$('#ageb_population_handicap').html("% "+new Number(feature.properties.disc1_r).toPrecision(3) || '--');
			
			$('#ageb_population_with_car').html("% "+new Number(feature.properties.viv28_r).toPrecision(3) || '--');
			$('#ageb_houses_empty').html("% "+new Number(feature.properties.viv1_r).toPrecision(3) || '--');
			
			var margination = null;
			if(feature.properties.NSE_proxy == 'C_menos' || feature.properties.NSE_proxy == 'C_me') {
				margination = "C -";
			} else if(feature.properties.NSE_proxy == "D_me") {
				margination = "D -";
			} else if(feature.properties.NSE_proxy == "D_mas") {
				margination = "D +";
			} else if(feature.properties.NSE_proxy == "C_mas") {
				margination = "C +";
			} else {
				margination = feature.properties.NSE_proxy;
			}
			
			$('#ageb_socioeconomic_level').html(margination || '--');
			$('#ageb_margination').html(feature.properties.GMU2010 || '--');
		}

		// A function to reset the colors when a neighborhood is not longer 'hovered'
	  var resetHighlight = function(e) {
	    geoLayer.resetStyle(e.target);
	  }

	  // Tell MapBox.js what functions to call when mousing over and out of a neighborhood
	  var onEachFeature = function(feature, layer) {
	    layer.on({
				click: selectFeature,
				mouseover: highlightFeature,
				mouseout: deHighlightFeature
	    });
	  }
	
		var enable = function() {
			map.addLayer(agebsLayer);
			geoLayer.addTo(map);
		}
		
		var disable = function() {
			map.removeLayer(agebsLayer);
			map.removeLayer(geoLayer);
		}
		
		initialize();
	}
	
	var agebsManager = new AgebsManager();
	radiusManager = new RadiusManager();
	stationsManager = new StationsManager();
});