document.addEventListener("DOMContentLoaded", function () {
    // Get the Tab 1 container
    const tab1Content = document.getElementById("tab2");

    // Create a frame container for Tab 1 UI
    const frame = document.createElement("div");
    frame.style.border = "2px solid #007bff";
    frame.style.borderRadius = "10px";
    frame.style.padding = "20px";
    frame.style.marginTop = "20px";
    frame.style.backgroundColor = "#f9f9f9";
    frame.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";
    frame.style.textAlign = "center";

    // Add a title inside the frame
    const title = document.createElement("h3");
    title.textContent = "BLE Control Panel";
    title.style.color = "#007bff";
    title.style.textAlign = "center";

    // Create BLE WebApp UI dynamically
    const content = document.createElement("div");
    content.innerHTML = `
        <button id="connectBleButton">Connect to BLE Device</button>
        <button id="disconnectBleButton">Disconnect BLE Device</button>
        <p>BLE state: <strong><span id="bleState" style="color:#d13a30;">Disconnected</span></strong></p>
        
        <h2>Fetched Value</h2>
        <p><span id="valueContainer">NaN</span></p>
        <p>Last reading: <span id="timestamp"></span></p>

        <h2>Control GPIO 2</h2>
        <button id="onButton">ON</button>
        <button id="offButton">OFF</button>
        <p>Last value sent: <span id="valueSent"></span></p>
    `;

    // Append the title and content inside the frame
    frame.appendChild(title);
    frame.appendChild(content);

    // Append the frame to Tab 1
    tab1Content.appendChild(frame);

    // Now that elements are created, reassign event listeners
    const connectButton = document.getElementById('connectBleButton');
    const disconnectButton = document.getElementById('disconnectBleButton');
    const onButton = document.getElementById('onButton');
    const offButton = document.getElementById('offButton');
    const retrievedValue = document.getElementById('valueContainer');
    const latestValueSent = document.getElementById('valueSent');
    const bleStateContainer = document.getElementById('bleState');
    const timestampContainer = document.getElementById('timestamp');

    // BLE Config (to be loaded from JSON)
    let deviceName, bleService, bleCharacteristic;

    // Load BLE configuration from JSON file
    fetch('app.json')
        .then(response => response.json())
        .then(data => {
            if (data.ble) {
                deviceName = data.ble.deviceName;
                bleService = data.ble.bleService;
                bleCharacteristic = data.ble.bleCharacteristic;
                console.log("BLE Configuration Loaded:", data.ble);
                console.log(deviceName);
                console.log(bleService);          
                console.log(bleCharacteristic);                             
            } else {
                throw new Error("Missing 'ble' section in app.json");
            }
        })
        .catch(error => console.error("Failed to load BLE configuration:", error));

    // Global Variables for Bluetooth
    var bleServer;
    var bleServiceFound;
    var bleCharacteristicFound;

    // Connect Button (search for BLE Devices only if BLE is available)
    connectButton.addEventListener('click', () => {
        if (isWebBluetoothEnabled()) {
            connectToDevice();
        }
    });

    // Disconnect Button
    disconnectButton.addEventListener('click', disconnectDevice);

    // Write to the ESP32 LED Characteristic
    onButton.addEventListener('click', () => writeOnCharacteristic(1));
    offButton.addEventListener('click', () => writeOnCharacteristic(0));

    function isWebBluetoothEnabled() {
        if (!navigator.bluetooth) {
            console.log("Web Bluetooth API is not available in this browser!");
            bleStateContainer.innerHTML = "Web Bluetooth API is not available in this browser!";
            return false;
        }
        console.log('Web Bluetooth API supported in this browser.');
        return true;
    }

    function connectToDevice() {
        if (!deviceName || !bleService) {
            console.error("BLE parameters not loaded. Please check app.json.");
            alert("BLE configuration not loaded. Try again.");
            return;
        }

        console.log('Initializing Bluetooth...' + deviceName);
        
        let request;
        if (deviceName === "*") {
            request = navigator.bluetooth.requestDevice({
                acceptAllDevices: true,  // Allows selecting any available device
                optionalServices: [bleService] // Ensure this is a valid UUID or known service
            });
        } else {
            request = navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: deviceName }], // Matches devices starting with 'deviceName'
                optionalServices: [bleService]
            });
        }
        


        request.then(device => {
            console.log('Device Selected:', device.name);
            bleStateContainer.innerHTML = 'Connected to device ' + device.name;
            bleStateContainer.style.color = "#24af37";
            device.addEventListener('gattservicedisconnected', onDisconnected);
            return device.gatt.connect();
        })
        request.then(gattServer => {
            bleServer = gattServer;
            console.log("Connected to GATT Server");
            return bleServer.getPrimaryService(bleService);
        })
        request.then(service => {
            bleServiceFound = service;
            console.log("Service discovered:", service.uuid);
            return service.getCharacteristic(bleCharacteristic);
        })
        request.then(characteristic => {
            console.log("Characteristic discovered:", characteristic.uuid);
            bleCharacteristicFound = characteristic;
            characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicChange);
            characteristic.startNotifications();
            console.log("Notifications Started.");
            return characteristic.readValue();
        })
        request.then(value => {
            console.log("Read value: ", value);
            const decodedValue = new TextDecoder().decode(value);
            console.log("Decoded value: ", decodedValue);
            retrievedValue.innerHTML = decodedValue;
        })
        request.catch(error => {
            console.log('Error: ', error);
        });
    }

    function onDisconnected(event) {
        console.log('Device Disconnected:', event.target.device.name);
        bleStateContainer.innerHTML = "Device disconnected";
        bleStateContainer.style.color = "#d13a30";
        connectToDevice();
    }

    function handleCharacteristicChange(event) {
        const newValueReceived = new TextDecoder().decode(event.target.value);
        console.log("Characteristic value changed: ", newValueReceived);
        retrievedValue.innerHTML = newValueReceived;
        timestampContainer.innerHTML = getDateTime();
    }

    function writeOnCharacteristic(value) {
        if (bleServer && bleServer.connected) {
            bleServiceFound.getCharacteristic(ledCharacteristic)
            .then(characteristic => {
                console.log("Found characteristic: ", characteristic.uuid);
                const data = new Uint8Array([value]);
                return characteristic.writeValue(data);
            })
            .then(() => {
                latestValueSent.innerHTML = value;
                console.log("Value written to bleCharacteristic:", value);
            })
            .catch(error => {
                console.error("Error writing to bleCharacteristic: ", error);
            });
        } else {
            console.error("Bluetooth is not connected. Cannot write to characteristic.");
            alert("Bluetooth is not connected. Connect to BLE first!");
        }
    }

    function disconnectDevice() {
        console.log("Disconnecting Device...");
        if (bleServer && bleServer.connected) {

            if (bleCharacteristicFound) {
                bleCharacteristic.stopNotifications()
                    .then(() => {
                        console.log("Notifications Stopped");
                        return bleServer.disconnect();
                    })
                    .then(() => {
                        console.log("Device Disconnected");
                        bleStateContainer.innerHTML = "Device Disconnected";
                        bleStateContainer.style.color = "#d13a30";
                    })
                    .catch(error => {
                        console.log("An error occurred:", error);
                    });
            } else {
                // console.log("No characteristic found to disconnect.");
                console.log("Device Disconnected");
                bleStateContainer.innerHTML = "Device Disconnected";
                bleStateContainer.style.color = "#d13a30";
                // return bleServer.disconnect();
            }
        } else {
            console.error("Bluetooth is not connected.");
            alert("Bluetooth is not connected.");
        }
    }

    function getDateTime() {
        var currentdate = new Date();
        return currentdate.toLocaleString();
    }
});
