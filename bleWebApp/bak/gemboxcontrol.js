document.addEventListener("DOMContentLoaded", function () {
    const tab2Content = document.getElementById("tab1");

    // Create main container
    const mainContainer = document.createElement("div");
    mainContainer.style.display = "flex";
    mainContainer.style.justifyContent = "space-between";
    mainContainer.style.alignItems = "flex-start";
    mainContainer.style.gap = "20px";
    mainContainer.style.padding = "10px";

    // Create LED Control Section
    const sliderFrame = document.createElement("div");
    sliderFrame.style.flex = "1";
    sliderFrame.style.border = "2px solid #007bff";
    sliderFrame.style.borderRadius = "10px";
    sliderFrame.style.padding = "20px";
    sliderFrame.style.backgroundColor = "#f9f9f9";
    sliderFrame.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";

    const sliderTitle = document.createElement("h3");
    sliderTitle.textContent = "LED Brightness Control";
    sliderTitle.style.textAlign = "center";
    sliderTitle.style.color = "#007bff";

    const sliderContainer = document.createElement("div");
    sliderContainer.style.display = "flex";
    sliderContainer.style.flexDirection = "column";
    sliderContainer.style.gap = "10px";
    sliderContainer.style.padding = "10px";

    function createSlider(id, labelText) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "10px";

        const label = document.createElement("label");
        label.textContent = labelText + ": ";

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

        // Event: Log when slider release (mouseup)
        slider.addEventListener("mouseup", function () {
            const logMessage = `Final brightness for ${labelText}: ${slider.value}`;
            console.log(logMessage);
            addToListbox(logMessage);
        });

        // Create Toggle Button for ON/OFF
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "ON";
        toggleButton.style.padding = "5px 10px";
        toggleButton.style.backgroundColor = "#28a745";
        toggleButton.style.color = "white";
        toggleButton.style.border = "none";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.borderRadius = "5px";

        toggleButton.addEventListener("click", function () {
            if (slider.disabled) {
                slider.disabled = false;
                toggleButton.textContent = "ON";
                toggleButton.style.backgroundColor = "#28a745";
                addToListbox(`${labelText} turned ON`);
            } else {
                slider.disabled = true;
                toggleButton.textContent = "OFF";
                toggleButton.style.backgroundColor = "#dc3545";
                addToListbox(`${labelText} turned OFF`);
            }
        });

        wrapper.appendChild(label);
        wrapper.appendChild(valueSpan);
        wrapper.appendChild(slider);
        wrapper.appendChild(toggleButton);
        return wrapper;
    }

    sliderContainer.appendChild(createSlider("led1", "LED 1"));
    sliderContainer.appendChild(createSlider("led2", "LED 2"));
    sliderContainer.appendChild(createSlider("led3", "LED 3"));
    sliderContainer.appendChild(createSlider("led4", "LED 4"));

    sliderFrame.appendChild(sliderTitle);
    sliderFrame.appendChild(sliderContainer);

    // Create Motor Control Section
    const controlContainer = document.createElement("div");
    controlContainer.style.flex = "1";
    controlContainer.style.border = "2px solid #007bff";
    controlContainer.style.borderRadius = "10px";
    controlContainer.style.padding = "20px";
    controlContainer.style.backgroundColor = "#f9f9f9";
    controlContainer.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";
    controlContainer.style.display = "flex";
    controlContainer.style.flexDirection = "column";
    controlContainer.style.gap = "15px";

    const rotationLabel = document.createElement("label");
    rotationLabel.textContent = "Rotation Mode: ";

    const rotationSelect = document.createElement("select");
    ["Rotate Fast", "Rotate Slow", "Rotate Fast Anticlockwise", "Rotate Slow Anticlockwise"].forEach(text => {
        const option = document.createElement("option");
        option.textContent = text;
        rotationSelect.appendChild(option);
    });

    const degreeLabel = document.createElement("label");
    degreeLabel.textContent = "Degree: ";

    const degreeInput = document.createElement("input");
    degreeInput.type = "number";
    degreeInput.placeholder = "Enter degree";
    degreeInput.style.width = "100%";

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.style.padding = "10px";
    sendButton.style.backgroundColor = "#007bff";
    sendButton.style.color = "white";
    sendButton.style.border = "none";
    sendButton.style.cursor = "pointer";
    sendButton.style.borderRadius = "5px";

    sendButton.addEventListener("click", function () {
        const rotation = rotationSelect.value;
        const degree = degreeInput.value;
        addToListbox(`Rotation: ${rotation}, Degree: ${degree}`);
    });

    controlContainer.appendChild(rotationLabel);
    controlContainer.appendChild(rotationSelect);
    controlContainer.appendChild(degreeLabel);
    controlContainer.appendChild(degreeInput);
    controlContainer.appendChild(sendButton);

    // Create Scrollable Log Section (Hidden by Default)
    const listboxSection = document.createElement("div");
    listboxSection.style.marginTop = "20px";
    listboxSection.style.border = "2px solid #007bff";
    listboxSection.style.borderRadius = "10px";
    listboxSection.style.padding = "10px";
    listboxSection.style.backgroundColor = "#f9f9f9";
    listboxSection.style.maxHeight = "150px";
    listboxSection.style.overflowY = "auto";
    listboxSection.style.textAlign = "left";

    const listTitle = document.createElement("h3");
    listTitle.textContent = "Log Data (Double-click to clear)";
    listTitle.style.textAlign = "center";
    listTitle.style.color = "#007bff";

    const listbox = document.createElement("ul");
    listbox.style.listStyle = "none";
    listbox.style.padding = "0";

    function addToListbox(itemText) {
        const listItem = document.createElement("li");
        listItem.textContent = itemText;
        listItem.style.padding = "5px";
        listItem.style.cursor = "pointer";
        listItem.style.borderBottom = "1px solid #ccc";

        listItem.addEventListener("click", function () {
            document.querySelectorAll("li").forEach(li => li.style.backgroundColor = "transparent");
            listItem.style.backgroundColor = "#d0e7ff";
        });

        listbox.appendChild(listItem);
        listboxSection.scrollTop = listboxSection.scrollHeight;
    }

    // Event: Double-click log section to clear
    listboxSection.addEventListener("dblclick", function () {
        if (confirm("Are you sure you want to clear all logs?")) {
            listbox.innerHTML = "";
        }
    });

    listboxSection.appendChild(listTitle);
    listboxSection.appendChild(listbox);

    mainContainer.appendChild(sliderFrame);
    mainContainer.appendChild(controlContainer);
    tab2Content.innerHTML = "";
    tab2Content.appendChild(mainContainer);
    tab2Content.appendChild(listboxSection);
});
