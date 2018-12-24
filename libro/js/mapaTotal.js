require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer"
], function(
  Map,
  MapView,
  FeatureLayer
) {

  const hurricanesLayer = new FeatureLayer({
    url: "https://services.arcgis.com/8DAUcrpQcpyLMznu/ArcGIS/rest/services/Lugares_Nacimiento_Romanticismo/FeatureServer/0",
    outFields: ["*"]
  });

  const map = new Map({
    basemap: "dark-gray",
    layers: [hurricanesLayer]
  });

  const view = new MapView({
    container: "mapaTotal",
    map: map,
    center: [0, 0],
    zoom: 1,
    highlightOptions: {
      color: "orange"
    }
  });

  view.ui.add("info");

  view.when().then(function() {
    return hurricanesLayer.when();
  }).then(function(layer) {
    const renderer = layer.renderer.clone();
    renderer.symbol.width = 4;
    renderer.symbol.color = [128, 128, 128, 0.8];
    layer.renderer = renderer;

    // Set up an event handler for pointer-down (mobile)
    // and pointer-move events (mouse)
    // and retrieve the screen x, y coordinates

    return view.whenLayerView(layer);
  }).then(function(layerView) {
    view.on("pointer-move", eventHandler);
    view.on("pointer-down", eventHandler);

    function eventHandler(event) {
      // the hitTest() checks to see if any graphics in the view
      // intersect the x, y coordinates of the pointer
      view.hitTest(event)
        .then(getGraphics);
    }

    let highlight, currentYear, currentName;

    function getGraphics(response) {

      // the topmost graphic from the hurricanesLayer
      // and display select attribute values from the
      // graphic to the user
      if (response.results.length) {
        const graphic = response.results.filter(function(result) {
          return result.graphic.layer === hurricanesLayer;
        })[0].graphic;

        const attributes = graphic.attributes;
        const descripcion = attributes.descripcion_autor;
        const fecha = attributes.fecha_n;
        const name = attributes.Nom_autor;
      //  const year = attributes.url_imagen;
        const ano = attributes.ano_nac;
        const id = attributes.OBJECTID;
        const imagen = attributes.url_imagen;

        if (highlight && (currentName !== name || currentYear !==
            year)) {
          highlight.remove();
          highlight = null;
          return;
        }

        document.getElementById("info").style.visibility =
          "visible";
        document.getElementById("nombreR").innerHTML = name;
        document.getElementById("descripcion").innerHTML = descripcion;
        document.getElementById("fechaNto").innerHTML = fecha;
        document.getElementById("ano_nac").innerHTML = ano;
        document.getElementById("imagen").src = imagen;

        // highlight all features belonging to the same hurricane as the feature
        // returned from the hitTest
        const query = layerView.layer.createQuery();
        query.where = "YEAR = " + year + " AND NAME = '" + name +
          "'";
        layerView.queryObjectIds(query)
          .then(function(ids) {
            highlight = layerView.highlight(ids);
            currentYear = year;
            currentName = name;
          });

      } else {
        // remove the highlight if no features are
        // returned from the hitTest
        highlight.remove();
        highlight = null;
        document.getElementById("info").style.visibility = "hidden";
      }
    }

  });

});
