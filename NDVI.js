// Load Quebec FeatureCollection
var quebec = ee.FeatureCollection('projects/ee-hejarshahabi/assets/quebecPR');

// Display the boundary
Map.centerObject(quebec, 6);
Map.addLayer(quebec, {color: 'red'}, 'Quebec');

// Define the time range for the past 5 years during June, July, and August
var startDate = '2019-06-01';
var endDate = '2023-08-31';

// Load the Sentinel-2 surface reflectance data and filter by date and cloud cover
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterBounds(quebec)
                  .filterDate(startDate, endDate)
                  .filter(ee.Filter.calendarRange(6, 8, 'month'))
                  .map(function(image) {
                    var cloudProb = image.select('MSK_CLDPRB');
                    var cloudMask = cloudProb.lt(5);
                    return image.updateMask(cloudMask)
                                .divide(10000)
                                .copyProperties(image, ['system:time_start']);
                  });

// Calculate NDVI for each image
var ndvi = sentinel2.map(function(image) {
  var ndviImage = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return ndviImage.copyProperties(image, ['system:time_start']);
});

// Calculate the mean NDVI over the time period
var meanNdvi = ndvi.mean().clip(quebec);

// Get the geometry of the Quebec polygon
var quebecGeometry = quebec.geometry();
var bounds = quebecGeometry.bounds();
var coords = ee.List(bounds.coordinates().get(0));

// Extract min and max coordinates
var minLon = ee.Number(ee.List(coords.get(0)).get(0));
var minLat = ee.Number(ee.List(coords.get(0)).get(1));
var maxLon = ee.Number(ee.List(coords.get(2)).get(0));
var maxLat = ee.Number(ee.List(coords.get(2)).get(1));

// Define a function to create bounding boxes
function createBoundingBox(minLon, minLat, maxLon, maxLat, numX, numY) {
  var boundingBoxes = [];
  var lonStep = maxLon.subtract(minLon).divide(numX);
  var latStep = maxLat.subtract(minLat).divide(numY);
  
  for (var i = 0; i < numX; i++) {
    for (var j = 0; j < numY; j++) {
      var lon1 = minLon.add(lonStep.multiply(i));
      var lat1 = minLat.add(latStep.multiply(j));
      var lon2 = lon1.add(lonStep);
      var lat2 = lat1.add(latStep);
      boundingBoxes.push(ee.Geometry.Rectangle([lon1, lat1, lon2, lat2]));
    }
  }
  
  return boundingBoxes;
}

// Create 16 bounding boxes
var boundingBoxes = createBoundingBox(minLon, minLat, maxLon, maxLat, 2, 8);

// Display bounding boxes on the map
boundingBoxes.forEach(function(box, index) {
  Map.addLayer(box, {color: 'blue'}, 'Bounding Box ' + (index + 1));
});

// Export each part
boundingBoxes.forEach(function(box, index) {
  Export.image.toDrive({
    image: meanNdvi,
    description: 'Mean_NDVI_Quebec_Summer_Part_' + (index + 1),
    scale: 10,
    region: box,
    fileFormat: 'GeoTIFF',
    maxPixels: 10e9
  });
});
