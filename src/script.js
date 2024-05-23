const contentContainer = $("#content");

$.getJSON("https://bts-status.bicycletransit.workers.dev/phl", function(data) {
    console.log(data.features);
    setTimeout(function() {
        contentContainer.html("");
        const filterContainer = $(`<div class="bg-gray-950 rounded-3xl w-[calc(100%/5)] h-[calc(100%-200px)] p-4 m-4">This is the filter area</div>`);
        const dataContainer = $(`<div class="bg-gray-950 rounded-3xl w-[calc((100%/3)*2)] h-[calc(100%-200px)] p-4 m-4"><h2 class="text-3xl font-bold mb-4">Docking Stations (${data.features.length})</h2></div>`);

        contentContainer.append(filterContainer)
                        .append(dataContainer);

        const dataInnerContainer = $(`<div class="overflow-y-auto flex flex-col w-full h-[calc(100%-2.25rem)] rounded-lg"></div>`);

        dataContainer.append(dataInnerContainer);

        data.features.forEach(station => {
            const container = $(`
                <div class="bg-gray-900 w-[99%] min-h-36 mb-4 rounded-lg flex flex-row justify-start items-center">
                    <img src="/images/dock.png" class="h-full mr-3 rounded-bl-lg" title="${station.properties.name} Dock" alt="Bike Dock" />
                </div>
            `);

            const innerContainer = $(`
                <div class="w-[inherit]">
                    <h4 class="font-medium text-2xl">${station.properties.name}</h4>
                    <p>${station.properties.addressStreet + " " + station.properties.addressCity + ", " + station.properties.addressState + ". " + station.properties.addressZipCode}</p>
                    <div class="flex flex-row">Bikes:&nbsp;<p ${(station.properties.bikes.length == 0 ? "class='text-red-800 font-bold'" : "")}>${station.properties.bikes.length}</p>/${station.properties.totalDocks}</div>
                </div>
            `);

            const bikeContainer = $(`
                <div class="flex flex-row gap-1 w-[calc(100%-10px)] flex-wrap"></div>
            `);

            container.append(innerContainer.append(bikeContainer));

            station.properties.bikes.forEach(bike => {
                let bikeElement;
                if(bike.isElectric == true) {
                    bikeElement = $(`<div class="w-max h-max px-2 bg-blue-400 text-black text-xs rounded-full cursor-pointer" onclick="displayBikeInformation(${bike})">Normal</div>`);
                } else {
                    bikeElement = $(`<div class="w-max h-max px-2 bg-white text-black text-xs rounded-full cursor-pointer flex flex-row justify-center items-center" onclick="displayBikeInformation(${bike})"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg"><path d="M376 211H256V16L136 301h120v195z"></path></svg>Electric</div>`);
                }

                bikeContainer.append(bikeElement);


                // "Tooltip" functionality
                bikeElement.hover(function() {
                    // On mouse over
                    console.log("enter");
                },
                function() {
                    // On mouse leave
                    console.log("leave");
                });
            })

            dataInnerContainer.append(container);
        });
    }, 1000);
});

//Steps:
//- Show tooltip on mouse over
//- Hide tooltip on mouse out (with a 1 second timeout)
//- If hovering over another one, and the timeout exists:
//  - clear the timeout interval
//  - remove the old tooltip
//  - create the new tooltip