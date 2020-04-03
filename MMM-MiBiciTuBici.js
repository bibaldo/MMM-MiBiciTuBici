/* global Module */

/* Magic Mirror
 * Module: MMM-MiBiciTuBici
 *
 * By Jose Forte
 * MIT Licensed.
 */

Module.register("MMM-MiBiciTuBici", {
  stations: {},
  defaults: {
    header: 'Mi Bici Tu Bici',
    stationsList: [2, 4, 5, 6, 10, 16, 20, 22],
    updateInterval: 300000, // update interval in milliseconds
    fadeSpeed: 4000,
    infoClass: 'medium' // small, medium or big
  },

  getStyles: function() {
    return ["MMM-MiBiciTuBici.css"]
  },

  start: function() {
    Log.info("Starting module: " + this.name);
    this.getInfo()
    this.scheduleUpdate()
  },

  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay
    }
    var self = this
    setInterval(function() {
      self.getInfo()
    }, nextLoad)
  },

  getInfo: function () {
    this.sendSocketNotification('GET_STATIONS')
  },

  socketNotificationReceived: function(notification, payload) {
    var self = this
    if (notification === "STATIONS_RESULT") {
      this.stations = payload
      this.updateDom(self.config.fadeSpeed)
    }
  },

  getHeader: function() {
    return this.config.header
  },

  getDom: function() {
    var wrapper = document.createElement("table")
    if (Object.entries(this.stations).length === 0) return wrapper

    var stationsList = this.config.stationsList
    var stations = this.stations.data.stations

    wrapper.className = 'mibicitubici'
    // header row
    var headerRow = document.createElement("tr"),
        headerStationNameCell = document.createElement("td"),
        // headerAddressCell = document.createElement("td"),
        // headerAnchorCell = document.createElement("td"), // amount of anchors per station
        headerBikesCell = document.createElement("td"), // amount of free bikes per station
        headerTandemCell = document.createElement("td"); // amount of free tandem bikes per station

    // headerAnchorCell.innerHTML = '<i class="fas fa-anchor"></i>'
    // headerAnchorCell.className = 'info ' + (this.config.infoClass === 'small' ? 'medium': '')
    headerBikesCell.innerHTML = '<i class="fas fa-bicycle"></i>'
    headerBikesCell.className = 'info' + ' icon ' + (this.config.infoClass === 'small' ? 'medium': '')
    headerTandemCell.innerHTML = '<i class="far fa-handshake"></i>'
    headerTandemCell.className = 'info' + ' icon ' + (this.config.infoClass === 'small' ? 'medium': '')

    headerRow.appendChild(headerStationNameCell)
    // headerRow.appendChild(headerAnchorCell)
    headerRow.appendChild(headerBikesCell)
    headerRow.appendChild(headerTandemCell)

    wrapper.appendChild(headerRow)
    // stations rows
    for (let key in stations) {
      let value = stations[key]
      if (stationsList.indexOf(value["station_code"]) != -1) {
        let hasBikes = value["bikes"] > 0 ? 'has-many' : 'has-not'
        let hasTandem = value["tandem"] > 0 ? 'has-many' : 'has-not'

        let stationRow = document.createElement("tr"),
            stationNameCell = document.createElement("td"),
            // anchorMCell = document.createElement("td"),
            bikesCell = document.createElement("td")
            tandemCell = document.createElement("td");
            
        stationNameCell.innerHTML = value["station_code"] + '- ' + '<span class="inactive">' + 
                                    value["name"] + '</span>'
        stationNameCell.className = this.config.infoClass
        // anchorMCell.innerHTML = value["anchor"]
        // anchorMCell.className = 'info ' + this.config.infoClass
        bikesCell.innerHTML = value["bikes"]
        bikesCell.className = hasBikes + ' ' + 'info' + ' ' + this.config.infoClass
        tandemCell.innerHTML = value["tandem"]
        tandemCell.className = hasTandem + ' ' + 'info' + ' ' + this.config.infoClass
                
        stationRow.appendChild(stationNameCell)
        // stationRow.appendChild(anchorMCell)
        stationRow.appendChild(bikesCell)
        stationRow.appendChild(tandemCell)
        
        wrapper.appendChild(stationRow)
      }
    }
    
		return wrapper
  }

})
