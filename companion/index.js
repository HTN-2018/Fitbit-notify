/*
 * Entry point for the companion app
 */

console.log("Companion code started");

// Import the messaging module
import * as messaging from "messaging";

var URL = "https://hack-the-north-2018.firebaseio.com/users/";
var user = "iUTwfKCMbsMkw0RQYN7Vnfy9sjI3";
function queryKnocks() {
  fetch(URL+user+".json")
  .then(function (response) {
    console.log(response);
      response.json()
      .then(function(data) {
        console.log(JSON.stringify(data));
        // Send the knock data to the device
        returnKnockData(data);
      });
  })
  .catch(function (err) {
    console.log("Error fetching data: " + err);
  });
}

// Send the knock data to the device
function returnKnockData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "knock") {
    // The device requested knock data
    queryKnocks();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}