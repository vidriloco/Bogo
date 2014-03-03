/*
 *  Transports Manager
 */
var TransportsManager = function(map) {
	var stations = null;
	// Set structure for keeping track of currently displayed path layers
	var enabledLayers = new buckets.Set();
	
	var MetrobusDom = 'metrobus';
	var MetroDom = 'metro';
	var SuburbanoDom = 'trensuburbano';
	var STEDom = 'transporteselectricos';
	var MexibusDom = 'mexibus';
	var itdpDom = 'itdp';
	
	var metrobus = null;
	var metro = null;
	var suburbano = null;
	var electricos = null;
	var mexibus = null;
	var itdp = null;
	
	/*
	 *   Private function: toggleStationsFor
	 *
	 *   Draws or clears the stations points defined in the given string layerStr parameter
	 */
	var toggleStationsFor = function(layerStr) {
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
	
	/*
	 *   Private function: togglePathLayerFor
	 *
	 *   Adds or removes a *layer* from the map and adds or removes
	 *   a the class selected to the given dom element
	 */
	var togglePathLayerFor = function(layer, dom) {
		if (map.hasLayer(layer)) {
        map.removeLayer(layer);
				$('#'+dom).parent().parent().removeClass('selected');
    } else {
        map.addLayer(layer);
				$('#'+dom).parent().parent().addClass('selected');
    }
	}
	
	/*
	 *   Private functions: toggle*
	 *   Loads and sets (if not yet set) the layer which includes the lines paths for the given transport 
	 *	 then adds/removes the path
	 *   and shows/hides the stations that are part of each transporte line
	 */
	
	var toggleSuburbano = function() {
		if(suburbano == null) {
			suburbano = L.mapbox.tileLayer('vidriloco.l0ofaqiq');
		}
		
		togglePathLayerFor(suburbano, SuburbanoDom);
		toggleStationsFor('SB');
	}
	
	var toggleMetro = function() {
		if(metro == null) {
			metro = L.mapbox.tileLayer('vidriloco.xeh1mnlr');
		}
		
		togglePathLayerFor(metro, MetroDom);
		toggleStationsFor('METRO');
	}
	
	var toggleMetrobus = function() {
		if(metrobus == null) {
			metrobus = L.mapbox.tileLayer('vidriloco.nrr1yo7v');
		}
		
		togglePathLayerFor(metrobus, MetrobusDom);
		toggleStationsFor('MB');
	}
	
	var toggleSTE = function() {
		if(electricos == null) {
			electricos = L.mapbox.tileLayer('vidriloco.3vgjbd6g');
		}
		
		togglePathLayerFor(electricos, STEDom);
		toggleStationsFor('STE');
	}
	
	var toggleMexibus = function() {
		if(mexibus == null) {
			mexibus = L.mapbox.tileLayer('vidriloco.jxwkt7sa');
		}
		
		togglePathLayerFor(mexibus, MexibusDom);
		toggleStationsFor('Mexibus');
	}
	
	var toggleITDP = function() {
		if(itdp == null) {
			itdp = L.mapbox.tileLayer('vidriloco.d8q0xo2e');
		}
		
		togglePathLayerFor(itdp, itdpDom);
	}
	
	/*
	 *  Public function: toggle
	 *
	 *  Enables the transport layers (stations and paths) for the
	 *  passed public transportation service (layerDom)
	 */
	this.toggle = function(layerDom) {
		if(layerDom == MetrobusDom) {
			toggleMetrobus();
		} else if(layerDom == MetroDom) {
			toggleMetro();
		} else if(layerDom == SuburbanoDom) {
			toggleSuburbano();
		} else if(layerDom == STEDom) {
			toggleSTE();
		} else if(layerDom == MexibusDom) {
			toggleMexibus();
		} else if(layerDom == itdpDom) {
			toggleITDP();
		}
	}
	
}

/*
 *   Polygons Manager
 */
var PolygonsManager = function(map, callback) {
	var agebsVector = null;
	var agebsLayer = null;
	
	var rSelectedVector = null;
	var r500 = null;
	var r800 = null;
	var r1000 = null;
	var r2000 = null;
		
	var defaultStyle = {
		weight: 0.1,
		color: '#A4D1FF',
		fillColor: '#A4D1FF',
		fillOpacity: 0.3
	};
	
	var highlightDefaultStyle = {
      weight: 2,
			color: '#4886FF',
      fillColor: '#4886FF',
      dashArray: '',
      fillOpacity: 0.4
  };
	
	var initialize = function(callback_fnc) {
		// Load agebs vector and layer
	  agebsVector = L.geoJson(agebs, {
			style: defaultStyle,
	    onEachFeature: onEachFeature
	  });
	
	  /*agebsVector = L.geoJson(null, {});
		d3.json('/assets/AGEBS.json', function(error, data) {
			var feature = topojson.feature(data, data.objects.layer1);
			agebsVector.addData(feature);
		})*/
		
		// Load radius vectors
		r500 = L.geoJson(radius500, {
			style: defaultStyle,
	    onEachFeature: onEachFeature
	  });
	
	  r800 = L.geoJson(radius800, {
			style: defaultStyle,
	    onEachFeature: onEachFeature
	  });
	
	  r1000 = L.geoJson(radius1000, {
			style: defaultStyle,
	    onEachFeature: onEachFeature
	  });
	
	  r2000 = L.geoJson(radius2000, {
			style: defaultStyle,
	    onEachFeature: onEachFeature
	  });
	
		if(callback_fnc != null) {
			callback_fnc();
		}
	}
	
	var clearFields = function() {
		$('#ageb_population').html('--');
		$('#ageb_houses').html('--');
		$('#ageb_density').html('--');

		$('#ageb_population_with_job').html('--');
		$('#ageb_population_without_job').html('--');
		$('#ageb_population_handicap').html('--');
		$('#ageb_population_with_car').html('--');
		$('#ageb_houses_empty').html('--');

		$('#ageb_socioeconomic_level').html('--');
		$('#ageb_margination').html('--');
	}

	var assignStats = function(feature) {
		
		$('#ageb_population').html(feature.properties.pob1 || '--');
		$('#ageb_houses').html(feature.properties.viv0 || '--');
		$('#ageb_density').html(feature.properties.densidad_av || '--');

		$('#ageb_population_with_job').html("% "+new Number(feature.properties.eco4_r).toPrecision(3) || '--');
		$('#ageb_population_without_job').html("% "+new Number(feature.properties.eco25_r).toPrecision(3) || '--');
		$('#ageb_population_handicap').html("% "+new Number(feature.properties.disc1_r).toPrecision(3) || '--');
		
		if(feature.properties.viv28_r != undefined) {
			$('#ageb_population_with_car').html("% "+new Number(feature.properties.viv28_r).toPrecision(3) || '--');
		} else {
			$('#ageb_population_with_car').html('--');
		}
		
		if(feature.properties.viv1_r != undefined) {
			$('#ageb_houses_empty').html("% "+new Number(feature.properties.viv1_r).toPrecision(3) || '--');
		} else {
			$('#ageb_houses_empty').html('--');
		}

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

	var highlightFeature = function(e) {
		var highlightedFeature = e.target;
		assignStats(e.target.feature);
    highlightedFeature.setStyle(highlightDefaultStyle);
	}
	
	var deHighlightFeature = function(e) {
		
		var highlightedFeature = e.target;
		highlightedFeature.setStyle(defaultStyle);
	}

  // Tell MapBox.js what functions to call when mousing over and out of a neighborhood
  var onEachFeature = function(feature, layer) {
    layer.on({
			mouseover: highlightFeature,
			mouseout: deHighlightFeature
    });
  }

	var removeCurrentAgebWithRadius = function() {
		if(rSelectedVector != null) {
			map.removeLayer(rSelectedVector);
		}
	}
	
	var enablePanelsForRadius = function() {		
		$('.radius-list .action').removeClass('hidden');
		$('#stats-panel').removeClass('hidden');
	}
	
	var disablePanelsForRadius = function() {
		removeCurrentAgebWithRadius();
		$('#stats-panel').addClass('hidden');
		$('.radius-list .action').addClass('hidden');
	}	

	this.showRadiusPanel = function(number) {
		enablePanelsForRadius();
		clearFields();
		$('.radius-list .layer').removeClass('selected');
		$('#agebs-radius-'+number).parent().addClass('selected');
		removeCurrentAgebWithRadius();
		
		if(number == 500) {
			map.addLayer(r500);
			rSelectedVector = r500;
		} else if(number == 800) {
			map.addLayer(r800);
			rSelectedVector = r800;
		}	else if(number == 1000) {
			map.addLayer(r1000);
			rSelectedVector = r1000;
		}	else if(number == 2000) {
			map.addLayer(r2000);
			rSelectedVector = r2000;
		} else if(number == "all") {
			map.addLayer(agebsVector);
			rSelectedVector = agebsVector;
		} else if(number == "hide") {
			disablePanelsForRadius();
		}
	}
	
	initialize(callback);
}