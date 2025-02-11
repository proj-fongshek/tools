document.addEventListener("DOMContentLoaded", function () {
    const ledTab = document.getElementById("ledTab");

    if (!ledTab) {
        console.error("Error: LED control tab not found!");
        return;
    }

    ledObj = {'led':{'i':'0','b':'0','v':'2'}}

    // Create LED Control Section
    const controlContainer = document.createElement("div");
    controlContainer.style.border = "2px solid #007bff";
    controlContainer.style.borderRadius = "10px";
    controlContainer.style.padding = "20px";
    controlContainer.style.backgroundColor = "#f9f9f9";
    controlContainer.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";
    controlContainer.style.display = "flex";
    controlContainer.style.flexDirection = "column";
    controlContainer.style.gap = "15px";

    // Create LED Brightness Control
    function createSlider(id, labelText) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "10px";
    
        const label = document.createElement("label");
        label.textContent = labelText + ": ";
        label.style.fontSize = "12px"; // Smaller font size
        label.style.minWidth = "50px"; // Ensures consistent alignment
        label.style.whiteSpace = "nowrap"; // Prevents text wrapping
    
        const valueSpan = document.createElement("span");
        valueSpan.textContent = "50";
    
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.value = "50";
        slider.style.width = "100%";
    
        slider.addEventListener("input", function () {
            valueSpan.textContent = slider.value;
        });

        // Event: Log when slider release (mouseup or touchend)
        function handleSliderRelease() {
            const logMessage = `Final brightness for ${labelText}: ${slider.value}`;

            ledObj['led']['i'] = getLastDigit(labelText)
            ledObj['led']['b'] = slider.value

            sendCmd(ledObj);   
            console.log(logMessage);            
        }

        slider.addEventListener("mouseup", handleSliderRelease);  // ✅ Mouse support
        slider.addEventListener("touchend", handleSliderRelease); // ✅ Touch support


        // Toggle Button for ON/OFF
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "ON";
        toggleButton.style.padding = "5px 10px";
        toggleButton.style.backgroundColor = "#28a745";
        toggleButton.style.color = "white";
        toggleButton.style.border = "none";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.borderRadius = "5px";
    
        toggleButton.addEventListener("click", function () {
            let val = '0'
            if (slider.disabled) {
                slider.disabled = false;
                toggleButton.textContent = "ON";
                toggleButton.style.backgroundColor = "#28a745";
                val = slider.value                 
            } else {
                slider.disabled = true;
                toggleButton.textContent = "OFF";
                toggleButton.style.backgroundColor = "#dc3545";
            }
            ledObj['led']['i'] = getLastDigit(labelText)
            ledObj['led']['b'] = val           
            sendCmd(ledObj);

        });
    
        wrapper.appendChild(label);
        wrapper.appendChild(valueSpan);
        wrapper.appendChild(slider);
        wrapper.appendChild(toggleButton);
        return wrapper;
    }
    
    for (let i = 0; i < 6; i++) {
        controlContainer.appendChild(createSlider(`led${i + 1}`, `LED_${i}`));
    }
    
    ledTab.innerHTML = "";
    ledTab.appendChild(controlContainer);

    // map to extern logContainer
    function addToLog(message) {
        addToLogContainer(message)
    }

    function sendCmd(cmd)
    {
        sendGlbCmd(cmd)
        // cmd_str = cmd
        // if (_isJSONObject(cmd)){
        //     cmd_str=JSON.stringify(cmd) 
        // }
        // addToLog(cmd_str)
    } 

});
