function legend_for_choropleth_layer(layer, name, units, id) {
    var limits = layer.options.limits;
    var colors = layer.options.colors;
    var labels = [];

    var HTML = name

    limits.forEach(function (limit, index) {
        if (index === 0) {
            var to = parseFloat(limits[index]).toFixed(1);
            var range_str = "<= " + to;
        }
        else {
            var from = parseFloat(limits[index - 1]).toFixed(1);
            var to = parseFloat(limits[index]).toFixed(1);
            var range_str = from + "-" + to;
        }

        labels.push('<li class="sublegend-item"><div class="sublegend-color" style="background-color: ' +
            colors[index] + '">&nbsp;</div>&nbsp;' + range_str + units + '</li>');
    })

    HTML += '<ul id="' + id + '" class="sublegend"">' + labels.join('') + '</ul>';

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
        valueProperty: 'IMDDecil',
        scale: ['red', 'orange', 'yellow'],
        style: {
            color: '#111111', // border color
            weight: 1,
            fillOpacity: 0.5,
            fillColor: '#ffffff'
        }
    }).addTo(map);

    var layers = {
        'OpenStreetMap': layer_OSM,
        [legend_for_choropleth_layer(layer_IMD, 'IMD', '', 'legend_IMD')]: layer_IMD
    };

    var layersControl = L.control.layers({},
        layers,
        { collapsed: false }).addTo(map);
});

