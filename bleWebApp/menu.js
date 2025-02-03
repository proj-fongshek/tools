document.addEventListener("DOMContentLoaded", function () {
    // Get the menu container
    const menuContainer = document.getElementById("menuContainer");

    // Create the navigation bar
    const navBar = document.createElement("nav");
    navBar.style.backgroundColor = "#007bff";
    navBar.style.padding = "10px 0";
    navBar.style.display = "flex";
    navBar.style.justifyContent = "flex-start"; // Align left
    navBar.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.1)";
    navBar.style.paddingLeft = "10px"; // Add spacing

    // Fetch menu from JSON file
    fetch("app.json")
        .then(response => response.json())
        .then(data => {
            const menuItems = data.menu;

            menuItems.forEach(item => {
                const menuItemWrapper = document.createElement("div");
                menuItemWrapper.style.position = "relative";
                menuItemWrapper.style.display = "inline-block";

                const menuItem = document.createElement("a");
                menuItem.href = item.link;
                menuItem.textContent = item.text;
                menuItem.style.color = "white";
                menuItem.style.fontSize = "18px";
                menuItem.style.fontWeight = "bold";
                menuItem.style.textDecoration = "none";
                menuItem.style.padding = "10px 20px";
                menuItem.style.display = "block";
                menuItem.style.transition = "background 0.3s ease";

                // Add click event for main menu item
                menuItem.addEventListener("click", (event) => {
                    event.preventDefault(); // Prevent default navigation
                    console.log(`Clicked: ${item.text}`);
                    alert(`You clicked on: ${item.text}`);
                });

                // Create the dropdown menu
                const dropdownMenu = document.createElement("div");
                dropdownMenu.style.position = "absolute";
                dropdownMenu.style.top = "100%";
                dropdownMenu.style.left = "0"; // Align dropdown to the left
                dropdownMenu.style.backgroundColor = "#ffffff";
                dropdownMenu.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
                dropdownMenu.style.borderRadius = "5px";
                dropdownMenu.style.overflow = "hidden";
                dropdownMenu.style.display = "none";
                dropdownMenu.style.minWidth = "150px";
                dropdownMenu.style.textAlign = "left"; // Align text inside dropdown to the left

                // Populate dropdown with submenu items
                item.submenu.forEach(subItem => {
                    const dropdownItem = document.createElement("a");
                    dropdownItem.href = "#";
                    dropdownItem.textContent = subItem;
                    dropdownItem.style.color = "#333";
                    dropdownItem.style.padding = "10px";
                    dropdownItem.style.display = "block";
                    dropdownItem.style.textDecoration = "none";
                    dropdownItem.style.transition = "background 0.3s ease";
                    dropdownItem.style.textAlign = "left"; // Ensure text inside is left-aligned

                    // Add click event for submenu items
                    dropdownItem.addEventListener("click", (event) => {
                        event.preventDefault(); // Prevent default navigation
                        console.log(`Clicked submenu: ${subItem}`);
                        alert(`You clicked on submenu: ${subItem}`);
                    });

                    dropdownMenu.appendChild(dropdownItem);
                });

                // Show dropdown on hover
                menuItemWrapper.addEventListener("mouseover", () => {
                    dropdownMenu.style.display = "block";
                });
                menuItemWrapper.addEventListener("mouseout", () => {
                    dropdownMenu.style.display = "none";
                });

                menuItemWrapper.appendChild(menuItem);
                menuItemWrapper.appendChild(dropdownMenu);
                navBar.appendChild(menuItemWrapper);
            });

            // Append the navigation bar to the menu container
            menuContainer.appendChild(navBar);
        })
        .catch(error => console.error("Error loading menu:", error));
});
