/* global module */

/* Magic Mirror
 * Node Helper: MMM-MiBiciTuBici
 *
 * By Jose Forte
 * MIT Licensed.
 */

var NodeHelper = require('node_helper')
var request = require('request')

var stationsUrl = 'https://www.mibicitubici.gob.ar/v1/stations'

module.exports = NodeHelper.create({
  start: function () {
    console.log('Starting node helper for: ' + this.name)
  },
  getStations: function() {
    var self = this
    var options = {
      method: 'GET',
      url: stationsUrl
    }
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body)
        self.sendSocketNotification('STATIONS_RESULT', result)
      }
    })
  },
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_STATIONS') {
      this.getStations(payload)
    }
  }  
});
