/*
 * Entry point for the companion app
 */

console.log("Companion code started");

// Import the messaging module
import * as messaging from "messaging";
//import { unlinkSync } from "fs";

var URL = "https://hack-the-north-2018.firebaseio.com/users/";
var user = "9DZklrkXnYYGhtjTgb57ViG68Vn1";
function queryKnocks() {
  fetch(URL+user+".json")
  .then(function (response) {
//    console.log(response);
      response.json()
      .then(function(data) {
//        console.log(JSON.stringify(data));
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
    fetchImgs(data);
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



// Import Outbox from the file-transfer module
import { outbox } from "file-transfer"

function fetchImg(url, fn)
{
  // Source image on the internet
  let srcImage = url;

  // Destination filename
  let destFilename = fn;
  
  // Fetch the image from the internet
  fetch(srcImage).then(function (response) {
    // We need an arrayBuffer of the file contents
    return response.arrayBuffer();
  }).then(function (data) {
    // Queue the file for transfer
    outbox.enqueue(destFilename, data).then(function (ft) {
      // Queued successfully
      console.log("Transfer of '" + destFilename + "' successfully queued.");
    }).catch(function (error) {
      // Failed to queue
      throw new Error("Failed to queue '" + destFilename + "'. Error: " + error);
    });
  }).catch(function (error) {
    // Log the error
    console.log("Failure: " + error);
  });
}

function fetchImgs(data){
  var arr = Object.keys(data).map(function(k) {
    return data[k];
  });
  console.log(arr.length);
  for (var i=0; i<arr.length; i++){
    //unlinkSync("/private/data/face"+i+".jpg");
    fetchImg("https://firebasestorage.googleapis.com/v0/b/hack-the-north-2018.appspot.com/o/images%2F9DZklrkXnYYGhtjTgb57ViG68Vn1%2Fface"+i+".jpg?alt=media&token=04dc75cc-04a7-46a1-85dc-c556cae05eb0", "face"+i+".jpg");
  }
  
}