# Battery Checker

An Android application that checks the battery level of nearby Bluetooth LE devices. Built using Apache Cordova and React.

![](https://i.imgur.com/kzo6awM.png)

## Installation
* Clone/Download the Code.
* Make sure [Node](https://nodejs.org/en/) is installed.
* Install Cordova globally to run Cordova commands:
```node
npm install -g cordova
```
* Install the dependencies:
```node
npm install
```
## Building and Running the App
* Build the app:
```node
npm run build:cordova
```
* Add Android platform to Cordova (make sure Cordova's [Android requirements](https://cordova.apache.org/docs/en/latest/guide/platforms/android/) are installed):
```node
cordova platform add android
```
* Run the app:
```node
cordova run android
```
*Note: The app must run on a physical Android device, as emulators do not support Bluetooth. Running on an emulator is possible; however, Bluetooth functionalities will not be available.*
