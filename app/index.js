/*
 * Entry point for the watch app
 */
import document from "document";

let demotext = document.getElementById("mainTitle");
demotext.text = "KnocKnocK";
let personPic = document.getElementById("pic");
let whenI = document.getElementById("whenI");
let whereI = document.getElementById("whereI");

// Import the messaging module
import * as messaging from "messaging";

// Request knock data from the companion
function fetchKnocks() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'knock'
    });
  }
}

// Display the knock data received from the companion
function processKnockData(data) {
  //console.log("The temperature is: " + data.temperature);
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch knock when the connection opens
  fetchKnocks();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    processKnockData(evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Fetch the knock every 60 seconds
setInterval(fetchKnocks, 1000 * 60);