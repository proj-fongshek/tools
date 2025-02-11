document.addEventListener("DOMContentLoaded", async function () {
    const motorTab = document.getElementById("turntableTab");

    if (!motorTab) {
        console.error("Error: Motor control tab not found!");
        return;
    }

    const cmdObj = {'turnTable':{'i': 0, 'r': 'cw', 'd': '90', 's': 'slow','v':'2'}}
    let turnTableCmd = {};
    let turnTableButtonArr 
    try {
        const response = await fetch("js/app_ui.json");
        const appUI = await response.json();
        turnTableCmd = appUI.ui.turnTableCmd || {};
        turnTableButtonArr = appUI.ui.turnTableButtonArr;
    } catch (error) {
        console.error("Error loading turnTableCmd from app_ui.json", error);
    }
    turnTableCmd = flattenArrayToJson(turnTableCmd)
    // console.log(turnTableCmd)
    // console.log(turnTableButtonArr)

    const controlContainer = document.createElement("div");
    controlContainer.style.border = "2px solid #007bff";
    controlContainer.style.borderRadius = "10px";
    controlContainer.style.padding = "20px";
    controlContainer.style.backgroundColor = "#f9f9f9";
    controlContainer.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";
    controlContainer.style.display = "flex";
    controlContainer.style.flexDirection = "column";
    controlContainer.style.gap = "15px";

    const inputRow = document.createElement("div");
    inputRow.style.display = "flex";
    inputRow.style.alignItems = "center";
    inputRow.style.gap = "20px";

    // TurnTable Dropdown
    const turnTableContainer = document.createElement("div");
    const turnTableLabel = document.createElement("label");
    turnTableLabel.textContent = "TurnTable:";
    const turnTableSelect = document.createElement("select");
    ["bottom", "top"].forEach(text => {
        const option = document.createElement("option");
        option.textContent = text;
        turnTableSelect.appendChild(option);
    });
    turnTableContainer.appendChild(turnTableLabel);
    turnTableContainer.appendChild(turnTableSelect);

    // Direction Dropdown (Previously Rotation Mode)
    const directionContainer = document.createElement("div");
    const directionLabel = document.createElement("label");
    directionLabel.textContent = "Direction:";
    const directionSelect = document.createElement("select");
    ["CW", "CCW"].forEach(text => {
        const option = document.createElement("option");
        option.textContent = text;
        directionSelect.appendChild(option);
    });
    directionContainer.appendChild(directionLabel);
    directionContainer.appendChild(directionSelect);

    // Degree Input
    const degreeContainer = document.createElement("div");
    const degreeLabel = document.createElement("label");
    degreeLabel.textContent = "Degree:";
    const degreeInput = document.createElement("input");
    degreeInput.type = "number";
    degreeInput.placeholder = "Enter degree";
    degreeInput.value = "10";
    degreeInput.style.width = "100px";
    degreeContainer.appendChild(degreeLabel);
    degreeContainer.appendChild(degreeInput);

    // Speed Dropdown (Newly Added)
    const speedContainer = document.createElement("div");
    const speedLabel = document.createElement("label");
    speedLabel.textContent = "Speed:";
    const speedSelect = document.createElement("select");
    ["Slow", "Fast"].forEach(text => {
        const option = document.createElement("option");
        option.textContent = text;
        speedSelect.appendChild(option);
    });
    speedContainer.appendChild(speedLabel);
    speedContainer.appendChild(speedSelect);

    inputRow.appendChild(turnTableContainer);
    inputRow.appendChild(directionContainer);
    inputRow.appendChild(degreeContainer);
    inputRow.appendChild(speedContainer);

    // Send Button
    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.style.padding = "10px";
    sendButton.style.border = "none";
    sendButton.style.cursor = "pointer";
    sendButton.style.borderRadius = "5px";

    sendButton.addEventListener("click", function () {
        const turnTable = turnTableSelect.value;
        const direction = directionSelect.value.toLowerCase();
        const degree = degreeInput.value;
        const speed = speedSelect.value.toLowerCase();

        // console.log (turnTable,direction,degree,speed)
        let i, r, s;
        i = turnTable.includes("top") ? "1" : "0";        
        r = direction.includes("ccw") ? "ccw" : "cw";
        s = speed.includes("fast") ? "fast" : "slow";

        let _cmdObj = _jsonClone(cmdObj)
        _cmdObj['turnTable']['i'] = i
        _cmdObj['turnTable']['r'] = r
        _cmdObj['turnTable']['d'] = degree
        _cmdObj['turnTable']['s'] = s
        sendCmd(_cmdObj);
    });

    // Create 4x2 Button Grid
    const buttonGrid = document.createElement("div");
    buttonGrid.style.display = "grid";
    buttonGrid.style.gridTemplateColumns = "repeat(4, 1fr)"; // 4 columns
    buttonGrid.style.gridTemplateRows = "repeat(2, auto)"; // 2 rows
    buttonGrid.style.gap = "10px";
    buttonGrid.style.marginTop = "15px";

    // const buttonLabels = [
    //     "stop", "rotate_cw_fast", "rotate_ccw_fast", "-",
    //     "-", "rotate_cw_slow", "rotate_ccw_slow", "-"
    // ];

    buttonLabels = turnTableButtonArr

    buttonLabels.forEach((label, index, array) => {        
        const button = document.createElement("button");
        button.textContent = label;
        button.style.padding = "10px";
        // button.style.backgroundColor = "#28a745";
        // button.style.backgroundColor = "#add8e6";
        // button.style.color = "white";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.borderRadius = "5px";
        button.style.textAlign = "center";    

        // console.log ('create button ', label,index)

        button.addEventListener("click", function () {
            console.log(`Pressed: ${label}`,turnTableCmd[label]);

            if (label in turnTableCmd){
                let _cmdObj = _jsonClone(cmdObj)          
                _cmdObj['turnTable'] = turnTableCmd[label] 
                sendCmd(_cmdObj)
            }

        });
        buttonGrid.appendChild(button);
    });

    controlContainer.appendChild(inputRow);
    controlContainer.appendChild(sendButton);
    controlContainer.appendChild(buttonGrid);    
    motorTab.innerHTML = "";
    motorTab.appendChild(controlContainer);

    function sendCmd(cmd) {
        sendGlbCmd(cmd);
        // const cmd_str = JSON.stringify(cmd);
        // addToLogContainer(cmd_str);
    }
});
