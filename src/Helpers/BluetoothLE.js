const ble = window.bluetoothle;

var foundDevices = [];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function log(msg) {
  alert(msg);
}

function handleError(error) {
  var msg;
  if (error.error && error.message) {
    var errorItems = [];
    if (error.service)
      errorItems.push("service: " + (error.service || error.service));
    if (error.characteristic)
      errorItems.push(
        "characteristic: " + (error.characteristic || error.characteristic)
      );
    msg =
      "Error on " +
      error.error +
      ": " +
      error.message +
      (errorItems.length && " (" + errorItems.join(", ") + ")");
  } else {
    msg = error;
  }
  log("Error: " + msg);
  return { error: msg };
}

async function initialize() {
  return new Promise(function(resolve) {
    ble.initialize(resolve, { request: true, statusReceiver: false });
  }).then(initializeSuccess, handleError);
}

function initializeSuccess(result) {
  if (result.status === "enabled") {
    log("Bluetooth is enabled.");
    log(JSON.stringify(result));
  } else {
    log("Bluetooth is not enabled:");
    log(JSON.stringify(result));
  }
  ble.hasPermission(hasPermissionSuccess);
}

function hasPermissionSuccess(result) {
  if (!result.hasPermission)
    ble.requestPermission(requestPermissionSuccess, handleError);
  log("Has GPS Permission");
}

function requestPermissionSuccess(result) {
  log("Permission Asked");
  if (result.requestPermission === true) log("Permission Granted");
}

async function startScan() {
  log("Starting scan for devices...");
  foundDevices = [];
  ble.startScan(startScanSuccess, handleError, { services: [] });
  await delay(5000);
  return await stopScan();
}

function startScanSuccess(result) {
  if (result.status === "scanStarted") {
    log(
      "Scanning for devices (will continue to scan until you select a device)..."
    );
  } else if (result.status === "scanResult") {
    if (
      !foundDevices.some(function(device) {
        return device.address === result.address;
      })
    ) {
      log("FOUND DEVICE:");
      log(JSON.stringify(result));
      let { name, address } = result;
      foundDevices.push({ name, address });
    }
  }
}

async function stopScan() {
  return new Promise(function(resolve, reject) {
    ble.stopScan(resolve, reject);
  }).then(stopScanSuccess, handleError);
}

function stopScanSuccess() {
  if (!foundDevices.length) {
    log("NO DEVICES FOUND");
  } else {
    log("Found " + foundDevices.length + " devices.");
  }
  return foundDevices;
}

async function connect(address) {
  log("Connecting to device: " + address + " ...");
  return new Promise(function(resolve, reject) {
    ble.connect(resolve, reject, { address: address });
  }).then(connectionAction, handleError);
}

async function disconnect(address) {
  log("Disconnecting from device: " + address + " ...");
  return new Promise(function(resolve, reject) {
    ble.disconnect(resolve, reject, { address: address });
  }).then(connectionAction, handleError);
}

async function closeConnection(result) {
  return new Promise(function(resolve, reject) {
    ble.close(resolve, reject, { address: result.address });
  }).then(connectionAction, handleError);
}

async function connectionAction(result) {
  log("- " + result.status);
  if (result.status === "connected") {
    log("Connected to device: " + result.address);
    return await getDeviceServices(result.address);
  } else if (result.status === "disconnected") {
    log("Disconnected from device: " + result.address);
    await closeConnection(result);
  } else if (result.status === "closed") {
    log("Closed device: " + result.address);
  }
}

async function getDeviceServices(address) {
  log("Getting device services...");
  return new Promise(function(resolve, reject) {
    ble.discover(resolve, reject, { address: address });
  }).then(discoverSuccess, handleError);
}

async function discoverSuccess(result) {
  log("Discover returned with status: " + result.status);
  if (result.status === "discovered") {
    var hasBatteryService = false;
    result.services.forEach(service => {
      if (service.uuid === "180f" || service.uuid === "180F") {
        hasBatteryService = true;
      }
    });
    if (hasBatteryService)
      return await read(result.address, "180F", "2a19");
    return { batteryLevel: "NA" };
  }
}

async function read(address, service, characteristic) {
  log("Reading the battery of device...");
  return new Promise(function(resolve, reject) {
    ble.read(resolve, reject, {
      address: address,
      service: service,
      characteristic: characteristic
    });
  }).then(readSuccess, handleError);
}

function readSuccess(result) {
  log("success reading battery");
  let batteryPercentage = ble.encodedStringToBytes(result.value);
  log(`Battery Level is: ${batteryPercentage}%`);
  return { batteryLevel: batteryPercentage };
}

const BluetoothLE = {
  initialize: async function() {
    await initialize();
  },

  scan: async function() {
    return await startScan();
  },

  connect: async function(address) {
    return await connect(address);
  },

  refresh: async function(address) {
    return await read(address, "180F", "2a19");
  },

  disconnect: async function(address) {
    await disconnect(address);
  }
};

export default BluetoothLE;
