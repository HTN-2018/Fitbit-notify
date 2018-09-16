/*
 * Entry point for the watch app
 */
import document from "document";
import { inbox } from "file-transfer"
import { unlinkSync } from "fs";

let demotext = document.getElementById("mainTitle");
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
  let VTList = document.getElementById("my-list");
  console.log(JSON.stringify(data));
  var numEle = 0;
  var arr = Object.keys(data).map(function(k) {
    numEle++;
    return data[k];
  });
  let NUM_ELEMS = numEle;
  
  var cEle = 0;
  VTList.delegate = {
    getTileInfo: function(index) {
      return {
        type: "my-pool",
        value: "Menu item",
        index: index
      };
    },
    configureTile: function(tile, info) {
      if (info.type == "my-pool") {
        tile.getElementById("whoI").text = `Who: ${arr[cEle].gender}, ${arr[cEle].age_range}`;
        tile.getElementById("whenI").text = `When: ${arr[cEle].time}`;
        tile.getElementById("pic").href = `/private/data/face${cEle}.jpg`;
        let touch = tile.getElementById("touch-me");
        touch.onclick = evt => {
          console.log(`touched: ${info.index}`);
        };
        cEle++;
      }
    }
  };
  // VTList.length must be set AFTER VTList.delegate
  VTList.length = NUM_ELEMS;
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

function processAllFiles() {
  let fileName;
  while (fileName = inbox.nextFile()) {
    console.log(`/private/data/${fileName} is now available`);
  }
  let vt = document.getElementById("my-list");
  //console.log(vt.length);
}

// Fetch the knock every 60 seconds
setInterval(fetchKnocks, 1000 * 15);

//Check for newly downloaded files.
inbox.addEventListener("newfile", processAllFiles);
processAllFiles();