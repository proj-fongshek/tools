document.addEventListener("DOMContentLoaded", async function () {
    const bleTab = document.getElementById("bleTab");

    if (!bleTab) {
        console.error("Error: BLE Tab container not found!");
        return;
    }

    // Fetch app_ui.json and load combo options
    let comboOptions = [];
    try {
        const response = await fetch("js/app_ui.json");
        const appUI = await response.json();
        comboOptions = appUI.ui.ble_comboOption || [];
    } catch (error) {
        console.error("Error loading app_ui.json:", error);
        comboOptions = [{ "ble_write": "b" }, { "ble_write": "d" }, { "ble": "connect" }, { "ble": "disconnect" }];
    }

    // Create a frame wrapper
    const bleFrame = document.createElement("div");
    bleFrame.style.border = "2px solid #007bff"; // Blue border
    bleFrame.style.borderRadius = "10px";
    bleFrame.style.padding = "20px";
    bleFrame.style.backgroundColor = "#f9f9f9";
    bleFrame.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";
    bleFrame.style.display = "flex";
    bleFrame.style.flexDirection = "column";
    bleFrame.style.gap = "10px";

    // ✅ Create Container for ComboBox, InputBox, and SendButton (Same Line)
    const inputRow = document.createElement("div");
    inputRow.style.display = "flex";
    inputRow.style.gap = "10px"; // Space between elements
    inputRow.style.alignItems = "center"; // Align items vertically in the center
    inputRow.style.width = "100%";

    // ✅ Create ComboBox (Dropdown)
    const comboBox = document.createElement("select");
    comboBox.id = "comboBox";
    comboBox.style.width = "150px"; // ✅ Set a fixed width
    comboBox.style.minWidth = "150px"; // ✅ Prevent it from shrinking
    comboBox.style.maxWidth = "150px"; // ✅ Prevent it from expanding
    comboBox.style.flex = "none"; // ✅ Prevents it from growing in flexbox

    comboOptions.forEach(optionObj => {
        const option = document.createElement("option");
        option.textContent = JSON.stringify(optionObj);
        comboBox.appendChild(option);
    });

    // ✅ Create Input Text Box
    const inputBox = document.createElement("input");
    inputBox.id = "inputBox";
    inputBox.type = "text";
    inputBox.placeholder = "Enter text here";
    inputBox.value = JSON.stringify(comboOptions[0]); // ✅ Default to first option    
    inputBox.style.flex = "1"; // ✅ Auto-expand to fill remaining space    

    // ✅ Create Send Button
    const sendButton = document.createElement("button");
    sendButton.id = "sendButton";
    sendButton.textContent = "Send";
    sendButton.style.marginLeft = "auto"; // ✅ Align button to the right    

    // ✅ Update Input Box When ComboBox Changes    
    comboBox.addEventListener("change", function () {        
        let selText = comboBox.value;
        if (_isJsonStr(selText)){
            selText = JSON.stringify(removeKeysWithPrefix(selText))
            // console.log(selText)            
        }
        inputBox.value = selText;
    });

    // ✅ Log Input Box Content When Send Button is Clicked
    sendButton.addEventListener("click", function () {
        // console.log("Input Box Content:", inputBox.value);
        sendCmd(inputBox.value);
    });

    // Create BLE UI Elements
    const connectButton = document.createElement("button");
    connectButton.id = "connectToggleButton";
    connectButton.textContent = "connect";

    const testButton = document.createElement("button");
    testButton.id = "testButton";
    testButton.textContent = "Test";

    const deviceInfo = document.createElement("textarea");
    deviceInfo.id = "deviceInfo";
    deviceInfo.rows = "10";
    deviceInfo.cols = "50";
    deviceInfo.readOnly = true;

    // Append elements to frame (Reordered)
    bleFrame.appendChild(connectButton);
    bleFrame.appendChild(testButton);
    bleFrame.appendChild(inputRow); // ✅ Move input row ABOVE `deviceInfo`
    inputRow.appendChild(comboBox);
    inputRow.appendChild(inputBox);
    inputRow.appendChild(sendButton);
    bleFrame.appendChild(deviceInfo);

    // Inject BLE frame into the BLE tab
    bleTab.appendChild(bleFrame);

    // Attach Event Listeners
    connectButton.addEventListener("click", toggleBLEConnection);
    testButton.addEventListener("click", function () {
        _cmd = {};
        _cmd["ble_write"] = "b";
        sendCmd(_cmd);
    });

    console.log("✅ BLE UI successfully injected.");

    // Function to toggle BLE connection
    function toggleBLEConnection() {
        const button = document.getElementById("connectToggleButton");

        console.log("toggleBLEConnection", button.innerText);
        _cmd = { "ble": button.innerText };
        sendCmd(_cmd);

        button.innerText = button.innerText === "connect" ? "disconnect" : "connect";
    }


    function sendCmd(cmd) {
        sendGlbCmd(cmd);
        // cmd_str = _isJSONObject(cmd) ? JSON.stringify(cmd) : cmd;
        // addToLog(cmd_str);
    }

    // Map to external log container
    function addToLog(message) {
        addToLogContainer(message);
    }


});
