function legend_for_choropleth_layer(layer, name, units, id) {
    // Generate a HTML legend for a Leaflet layer created using choropleth.js
    //
    // Arguments:
    // layer: The leaflet Layer object referring to the layer - must be a layer using
    //        choropleth.js
    // name: The name to display in the layer control (will be displayed above the legend, and next
    //       to the checkbox
    // units: A suffix to put after each numerical range in the layer - for example to specify the
    //        units of the values - but could be used for other purposes)
    // id: The id to give the <ul> element that is used to create the legend. Useful to allow the legend
    //     to be shown/hidden programmatically
    //
    // Returns:
    // The HTML ready to be used in the specification of the layers control
    var limits = layer.options.limits;
    var colors = layer.options.colors;
    var labels = [];

    // Start with just the name that you want displayed in the layer selector
    var HTML = name

    // For each limit value, create a string of the form 'X-Y'
    limits.forEach(function (limit, index) {
        if (index === 0) {
            var to = parseFloat(limits[index]).toFixed(0);
            var range_str = "< " + to;
        }
        else {
            var from = parseFloat(limits[index - 1]).toFixed(0);
            var to = parseFloat(limits[index]).toFixed(0);
            var range_str = from + "-" + to;
        }

        // Put together a <li> element with the relevant classes, and the right colour and text
        labels.push('<li class="sublegend-item"><div class="sublegend-color" style="background-color: ' +
            colors[index] + '">&nbsp;</div>&nbsp;' + range_str + units + '</li>');
    })

    // Put all the <li> elements together in a <ul> element
    HTML += '<ul id="' + id + '" class="sublegend">' + labels.join('') + '</ul>';

    return HTML;
}

var map = L.map('map', {
    zoomControl: true,
    maxZoom: 28,
    minZoom: 1
}).fitBounds([
    [50.899615041735814, -1.5200098603963854],
    [50.93954716446083, -1.3002832978963854]
]);

var layer_OSM = L.tileLayer(' https://a.tile.openstreetmap.org/{z}/{x}/{y}.png ');
layer_OSM.addTo(map);


$.getJSON('./soton_imd.geojson', function (geojson) {
    var layer_IMD = L.choropleth(geojson, {
        valueProperty: 'IMDRank',
        scale: ['red', 'orange', 'yellow'],
        style: {
            color: '#111111', // border color
            weight: 1,
            fillOpacity: 0.5,
            fillColor: '#ffffff'
        }
    }).addTo(map);

    layer_IMD.on('add', function () {
        // Need setTimeout so that we don't get multiple
        // onadd/onremove events raised
        setTimeout(function () {
            $('#legend_IMD').show();
        });
    });

    layer_IMD.on('remove', function () {
        // Need setTimeout so that we don't get multiple
        // onadd/onremove events raised
        setTimeout(function () {
            $('#legend_IMD').hide();
        });
    });

    var layers = {
        'OpenStreetMap': layer_OSM,
        [legend_for_choropleth_layer(layer_IMD, 'IMD', '', 'legend_IMD')]: layer_IMD
    };

    var layersControl = L.control.layers({},
        layers,
        { collapsed: false }).addTo(map);
});

