var HTTPS = require("https");

var UNIT_ELEVATION_METRIC = "meters";
var UNIT_ELEVATION_STATUTE = "feet";

var validatePosition = function(position, context) {

  var pattern = /^(\-?\d+(\.\d+)?),(\-?\d+(\.\d+)?)$/;
  if (!position || !pattern.test(position)) {
    context.fail('Invalid GPS coordinates');
  }

};

var validateUnit = function(unit, context) {

  var units = ["metric", "statute"];
  if (!unit || units.indexOf(unit) < 0) {
    context.fail("Unit must be 'metric' or 'statute'");
  }

};

exports.handler = function(event, context) {

  // console.log("Request received from client", event.data);

  // From the watch
  var position = event.data.position;
  var unit = event.data.unit;

  // Validation
  validatePosition(position, context);
  validateUnit(unit, context);

  // From API Gateway
  var api_key = event.metadata.key;

  var options = {
    host: 'maps.googleapis.com',
    path: '/maps/api/elevation/json?key=' + api_key + '&locations=' + position
  };

  callback = function(response) {

    response.on('error', function(error) {
      console.log("Error from API", error);
      context.fail();
    });

    var buffer = '';
    response.on('data', function(chunk) {
      buffer += chunk;
    });

    response.on('end', function() {

      var result = JSON.parse(buffer);
      var elevation_value = result.results[0].elevation;
      var elevation_unit = UNIT_ELEVATION_METRIC;

      if (unit != 'metric') {
        elevation_value = elevation_value * 3.28084;
        elevation_unit = UNIT_ELEVATION_STATUTE;
      }

      var response = {};
      response.status = 'OK';
      response.elevation = Math.round(elevation_value);
      response.unit = elevation_unit;
      response.position = position;

      //console.log("Response sent to client", response);

      context.succeed(response);

    });

  };

  HTTPS.request(options, callback).end();

};