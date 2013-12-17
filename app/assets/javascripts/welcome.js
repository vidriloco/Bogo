$(document).ready(function() {

	var map = L.mapbox.map('map-basic', 'vidriloco.aohg0k9c').setView([19.4368, -99.1173], 11);

	var metrobus = L.mapbox.tileLayer('vidriloco.44p9ej6i');
	var metro = L.mapbox.tileLayer('vidriloco.59rkxcf9');
	var suburbano = L.mapbox.tileLayer('vidriloco.l0ofaqiq');
	var electricos = L.mapbox.tileLayer('vidriloco.mwen90ov');
	
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
		} else if($(this).attr('id') == "metro") {
			toggleLayer(metro, 2, $(this).attr('id'));
		} else if($(this).attr('id') == "trensuburbano") {
			toggleLayer(suburbano, 3, $(this).attr('id'));
		} else if($(this).attr('id') == "transporteselectricos") {
			toggleLayer(electricos, 4, $(this).attr('id'));
		}
	});
	

});