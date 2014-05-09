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
	var thisInstance = this;

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
				return thisInstance.isTransportEnabled(feature.properties.agency_id);
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
			suburbano = L.mapbox.tileLayer('vidriloco.lypnteuc');
		}

		togglePathLayerFor(suburbano, SuburbanoDom);
		toggleStationsFor('SUB');
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
			itdp = L.mapbox.tileLayer('spalatin.jbxehglj');
		}

		togglePathLayerFor(itdp, itdpDom);
		toggleStationsFor('ITDP');
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

	/*
	 *  Public function: isTransportEnabled
	 */

	this.isTransportEnabled = function(transport) {
		return enabledLayers.contains(transport);
	}

}

/*
 *   Polygons Manager
 */
var PolygonsManager = function(map, tm, callback) {
	var agebsVector = null;
	var agebsLayer = null;

	var transportsManager = tm;

	var rSelectedVector = null;
	var r500 = null;
	var r800 = null;
	var r1000 = null;
	var r2000 = null;

	var defaultStyle = {
		weight: 0.1,
		color: '#A4D1FF',
		fillColor: '#A4D1FF',
		fillOpacity: 0.05
	};

	var highlightDefaultStyle = {
      weight: 2,
			color: '#4886FF',
      fillColor: '#4886FF',
      dashArray: '',
      fillOpacity: 0.3
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
		/*r500 = L.geoJson(radius500, {
			style: defaultStyle,
	    onEachFeature: onEachFeature
	  });*/

		/*
	  r1000 = L.geoJson(radius1000, {
			style: defaultStyle,
	    onEachFeature: onEachFeature
	  });

	  r2000 = L.geoJson(radius2000, {
			style: defaultStyle,
	    onEachFeature: onEachFeature
	  });*/

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

	var filterByAgency = function(feature, layer) {
		var name = null;
		if(feature.properties.Agencia == "Tren Suburbano") {
			name = "SUB";
		} else if(feature.properties.Agencia == "Metrobús") {
			name = "MB";
		} else if(feature.properties.Agencia == "Sistema de Transporte Colectivo") {
			name = "METRO";
		} else {
      name = feature.properties.Agencia;
    }
		return transportsManager.isTransportEnabled(name);
	}

	var load800r = function() {
    if(r800 != null) {
      map.removeLayer(r800);
    }
		r800 = L.geoJson(radius800, {
			style: defaultStyle,
	    onEachFeature: onEachFeature,
			filter: filterByAgency
	  });
    rSelectedVector = r800;
    map.addLayer(r800);
	}
	
	var load500r = function() {
    if(r500 != null) {
      map.removeLayer(r500);
    }
		r500 = L.geoJson(radius500, {
			style: defaultStyle,
	    onEachFeature: onEachFeature,
			filter: filterByAgency
	  });
    rSelectedVector = r500;
    map.addLayer(r500);
	}

  this.redrawActiveLayer = function() {
    if(rSelectedVector == null) {
      return;
    }

    if(rSelectedVector == r800) {
      load800r();
    } else if(rSelectedVector == r500) {
	    load500r();
		}
  }

	var assignStats = function(feature) {

		$('#ageb_population').html(feature.properties.pob1 || '--');
		$('#ageb_houses').html(feature.properties.viv0 || '--');
		$('#ageb_density').html(feature.properties.densidad || '--');

		$('#ageb_population_with_job').html("% "+new Number(feature.properties.eco4_r).toPrecision(3) || '--');
		$('#ageb_population_without_job').html("% "+new Number(feature.properties.eco25_r).toPrecision(3) || '--');
		$('#ageb_population_handicap').html("% "+new Number(feature.properties.disc_r).toPrecision(3) || '--');

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
		if(feature.properties.nse == 'C_menos' || feature.properties.nse == 'C_me') {
			margination = "C -";
		} else if(feature.properties.nse == "D_me") {
			margination = "D -";
		} else if(feature.properties.nse == "D_mas") {
			margination = "D +";
		} else if(feature.properties.nse == "C_mas") {
			margination = "C +";
		} else {
			margination = feature.properties.nse;
		}

		$('#ageb_socioeconomic_level').html(margination || '--');
		$('#ageb_margination').html(feature.properties.gmu || '--');
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

  var onEachFeature = function(feature, layer) {
    layer.on({
			mouseover: highlightFeature,
			mouseout: deHighlightFeature
    });
		layer.bindPopup("<p style='margin-top: 10px !important; margin-bottom: 0px !important; font-size: 13px'> "+$('#transport-radius').html()+'<b>'+feature.properties.Agencia+"</b> - "+feature.properties.Name+"</p>");
  }

	var removeCurrentAgebWithRadius = function() {
		if(rSelectedVector != null) {
			map.removeLayer(rSelectedVector);
		}
	}

	var enablePanelsForRadius = function() {
		$('.radius-list .action').removeClass('hidden');
		$('#stats-panel').removeClass('hidden');
		$('.polygons-enabler-off').removeClass('hidden');
		$('.polygons-enabler-on').addClass('hidden');
	}

	this.disablePanelsForRadius = function(hideAllEnablers) {
		removeCurrentAgebWithRadius();
		$('#stats-panel').addClass('hidden');
		$('.radius-list .action').addClass('hidden');
		$('.polygons-enabler-off').addClass('hidden');
		if(hideAllEnablers) {
			$('.polygons-enabler-on').addClass('hidden');
		} else {
			$('.polygons-enabler-on').removeClass('hidden');
		}
	}

	this.reenablePanelsForRadius = function() {
		if(rSelectedVector != null) {
			map.addLayer(rSelectedVector);
		}
		$('#stats-panel').removeClass('hidden');
		$('.radius-list .action').removeClass('hidden');
		$('.polygons-enabler-off').removeClass('hidden');
		$('.polygons-enabler-on').addClass('hidden');
	}

	this.showRadiusPanel = function(number) {
		enablePanelsForRadius();
		clearFields();
		removeCurrentAgebWithRadius();

		if(number == 500) {
			load500r();
		} else if(number == 800) {
			load800r();
		}	else if(number == 1000) {
			map.addLayer(r1000);
			rSelectedVector = r1000;
		}	else if(number == 2000) {
			map.addLayer(r2000);
			rSelectedVector = r2000;
		} else if(number == "all") {
			map.addLayer(agebsVector);
			rSelectedVector = agebsVector;
		}
		$('.polygons-enabler').removeClass('hidden');
	}

	initialize(callback);
}
