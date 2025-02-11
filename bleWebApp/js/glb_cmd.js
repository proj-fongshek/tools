// Function to send a command to the device
function sendGlbCmd(cmd) {
    if (typeof cmd === 'string') {
        _jsonExtract(cmd).forEach(cmdObj => {
            sendGlbCmdEx(cmdObj);
        });
    } else if (_isJSONObject(cmd)) {
        sendGlbCmdEx(cmd);
    }
}

function sendGlbCmdEx(cmd) {
    console.log(`sendGlbCmdEx :`, cmd, _isJSONObject(cmd));
    addToLog(JSON.stringify(cmd));
    const handlers = {
        'ble': cmd_ble,
        'ble_write': cmd_bleWrite,
        'led': cmd_led,
        'turnTable': cmd_turnTable,
    };

    Object.entries(cmd).forEach(([key, value]) => handlers[key]?.(value));
}


// BLE Command Handler
function cmd_ble(data) {
    switch (data.toLowerCase()) {
        case 'connect':
            connectToDevice();
            break;
        case 'disconnect':
            disconnectDevice();
            break;
        default:
            console.warn(`Unknown BLE Command: ${data}`);
    }
}

// LED Command Handler
function cmd_led(data) {
    // console.log([arguments.callee.name, data])    

    // {'led':{'i':'0','b':'0','v':'2'}}    
    cmd = 'BXXXX'
    if (data['v']=='2'){
        num = parseInt(data['b'])        
        cmd = 'B' + data['i'] + num.toString().padStart(3, '0')
        sendToBle(cmd)
    }
}

function cmd_turnTable(data) {
    if (!["1", "2"].includes(data['v'])) return;

    let num = parseInt(data['d']);
    let d = num.toString().padStart(3, '0');
    let dir = data['r'].includes("ccw") ? "R" : "L";
    let speed = data['s'].includes("fast") ? "9" : "8";

    if (d === "000") {
        dir = "p";
        speed = "0";
    }

    let cmd = (data['v'] === "2") ? `T${data['i']}${dir}${d}${speed}` : `${dir}${d}${speed}`;
    sendToBle(cmd);
}


// BLE write Command Handler
function cmd_bleWrite(data) {
    console.log('cmd_bleWrite', data);
    writeOnCharacteristic(data)
}

function logCaller(data) {
    const stack = new Error().stack.split("\n");
    const caller = stack[2] ? stack[2].trim().split(" ")[1] : "Unknown";
    console.log(caller,data);
}

function sendToBle(data){
    // logCaller(data)
    console.log([arguments.callee.name, data])   
    cmd_bleWrite(data) 
}

// Map to external log container
function addToLog(message) {
    addToLogContainer(message);
}

// Export function for global use
window.sendGlbCmd = sendGlbCmd;
