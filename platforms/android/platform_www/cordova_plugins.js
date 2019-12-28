cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-bluetoothle.BluetoothLe",
      "file": "plugins/cordova-plugin-bluetoothle/www/bluetoothle.js",
      "pluginId": "cordova-plugin-bluetoothle",
      "clobbers": [
        "window.bluetoothle"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-bluetoothle": "4.5.6"
  };
});