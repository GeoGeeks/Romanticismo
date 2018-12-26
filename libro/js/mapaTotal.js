require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/VectorTileLayer"
], function(
  Map,
  MapView,
  FeatureLayer,
  VectorTileLayer
) {

  const hurricanesLayer = new FeatureLayer({
    url: "https://services.arcgis.com/8DAUcrpQcpyLMznu/ArcGIS/rest/services/Lugares_Nacimiento_Romanticismo/FeatureServer/0",
    outFields: ["*"]
  });
 const paises = new FeatureLayer({
    url: "https://services.arcgis.com/8DAUcrpQcpyLMznu/ArcGIS/rest/services/Mapa_1851/FeatureServer/0",
    outFields: ["*"]
  });

  const map = new Map({
  });
  var tileLayer = new VectorTileLayer({
        url: "https://jsapi.maps.arcgis.com/sharing/rest/content/items/251955cdd7f7495cbeac50bf37b6c4e1/resources/styles/root.json"
      });
      map.add(tileLayer);
      map.add(paises);
      map.add(hurricanesLayer);
  const view = new MapView({
    container: "mapaTotal",
    map: map,
    center: [0, 0],
    zoom: 1,
    highlightOptions: {
      color: "orange"
    }
  });
  document.getElementById("Alemania").addEventListener("click",
        function() {
          view.goTo({
      center: [9.8, 50.2],
      zoom: 4
    });
        });
  document.getElementById("Francia").addEventListener("click",
      function() {
      view.goTo({
      center: [4, 47],
      zoom: 4.1
      });
  });
  document.getElementById("Espana").addEventListener("click",
      function() {
      view.goTo({
      center: [-2, 40],
      zoom: 4
      });
  });
  document.getElementById("Inglaterra").addEventListener("click",
      function() {
      view.goTo({
      center: [-4, 54],
      zoom: 4
      });
  });
  document.getElementById("Portugal").addEventListener("click",
      function() {
      view.goTo({
      center: [-12, 40],
      zoom: 2
      });
  });
  document.getElementById("Rusia").addEventListener("click",
      function() {
      view.goTo({
      center: [40, 60],
      zoom: 2.7
      });
  });
  document.getElementById("Usa").addEventListener("click",
      function() {
      view.goTo({
      center: [-100, 45],
      zoom: 2
      });
  });
  document.getElementById("Mexico").addEventListener("click",
      function() {
      view.goTo({
      center: [-100, 25],
      zoom: 3
      });
  });
  document.getElementById("Colombia").addEventListener("click",
      function() {
      view.goTo({
      center: [-74, 4],
      zoom: 4.3
      });
  });
  document.getElementById("Argentina").addEventListener("click",
      function() {
      view.goTo({
      center: [-60, -44],
      zoom: 3
      });
  });
  document.getElementById("Italia").addEventListener("click",
      function() {
      view.goTo({
      center: [12, 42],
      zoom: 4
      });
  });
  document.getElementById("Escandinavia").addEventListener("click",
      function() {
      view.goTo({
      center: [14, 60],
      zoom: 2.5
      });
  });
  document.getElementById("Paises bajos").addEventListener("click",
      function() {
      view.goTo({
      center: [5.5, 51.2],
      zoom: 5
      });
  });
  document.getElementById("Polonia").addEventListener("click",
      function() {
      view.goTo({
      center: [20, 51.2],
      zoom: 4
      });
  });
  document.getElementById("Checa").addEventListener("click",
      function() {
      view.goTo({
      center: [15.7, 50],
      zoom: 4
      });
  });
  document.getElementById("Hungria").addEventListener("click",
      function() {
      view.goTo({
      center: [22, 46],
      zoom: 4
      });
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
        const anoMuerte = attributes.ano_muerte;
        const fechaMuerte = attributes.fecha_m;
        const referencia = attributes.referencia;
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
        document.getElementById("referencia").innerHTML = "<a href='"+referencia+"'>Ver más</a>"
        document.getElementById("anoMuerte").innerHTML = anoMuerte;
        document.getElementById("fechaMuerte").innerHTML = "-" +fechaMuerte;
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
