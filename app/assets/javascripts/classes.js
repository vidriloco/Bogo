/*
 *  Stations Manager
 */
var StationsManager = function(map) {
	var stations = null;
	var enabledLayers = new buckets.Set();
	
	var loadLayer = function(layerStr) {
		if(enabledLayers.contains(layerStr)) {
			enabledLayers.remove(layerStr);
		} else {
			enabledLayers.add(layerStr);
		}
		
		if(stations != null) {
			map.removeLayer(stations);
		}
		
		// Add vector data to map
	  stations = L.geoJson(allStations, {
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
               opacity: 1,
               fillOpacity: 1
           });
       },
	    onEachFeature: function (feature, layer) {
					layer.bindPopup("<p style='margin-top: 10px !important; margin-bottom: 0px !important; font-size: 13px'>"+feature.properties.stop_name+"</p>");
			},
			filter: function(feature, layer) {
					return enabledLayers.contains(feature.properties.agency_id);
			}
	  });		
		
		if(enabledLayers.size() > 0) {
			map.addLayer(stations);
		}
	}
					
	this.toggleSuburbano = function() {
		loadLayer('SUB');
	}
	
	this.toggleMetrobus = function() {
		loadLayer('MB');
	}
	
	this.toggleSTE = function() {
		loadLayer('STE');
	}
	
	this.toggleMetro = function() {
		loadLayer('METRO');
	}
	
	this.toggleMexibus = function() {
		loadLayer('Mexibus');
	}
	
}

/*
 *  Radius Manager
 */
var RadiusManager = function(map) {
	var r500 = null;
	var r800 = null;
	var r1000 = null;
	var r2000 = null;
	var currentRadiusSelected = null;
	var geolayer = null;
	var thisInstance = null;
	
	var style = {
		weight: 0.5,
		color: 'red'
	}
	
	var initialize = function() {
		thisInstance = this;
		// Add vector data to map
	  r500 = L.geoJson(radius500, {
			style: style,
	    onEachFeature: onEachFeature
	  });
	
	  r800 = L.geoJson(radius800, {
			style: style,
	    onEachFeature: onEachFeature
	  });
	
	  r1000 = L.geoJson(radius1000, {
			style: style,
	    onEachFeature: onEachFeature
	  });
	
	  r2000 = L.geoJson(radius2000, {
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

	var removeCurrentLayer = function() {
		if(geolayer != null) {
			map.removeLayer(geolayer);
		}
	}

	this.enableRadius = function(number) {
		removeCurrentLayer();
		
		if(number == 500) {
			map.addLayer(r500);
			geolayer = r500;
		} else if(number == 800) {
			map.addLayer(r800);
			geolayer = r800;
		}	else if(number == 1000) {
			map.addLayer(r1000);
			geolayer = r1000;
		}	else if(number == 2000) {
			map.addLayer(r2000);
			geolayer = r2000;
		}
	}
	
	this.detach = function() {
		removeCurrentLayer();
	}

	initialize();
}

/*
 *   Agebs Manager
 */
var AgebsManager = function(map) {
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
	
	this.detach = function() {
		disable();
	}
	
	initialize();
}