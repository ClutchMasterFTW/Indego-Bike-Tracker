const contentContainer = $("#content");

$.getJSON("https://bts-status.bicycletransit.workers.dev/phl", function(data) {
    console.log(data.features);
    setTimeout(function() {
        contentContainer.html("");
        const filterContainer = $(`<div class="bg-gray-950 rounded-3xl w-[calc(100%/5)] h-[calc(100%-200px)] p-4 m-4">This it the filter area</div>`);
        const dataContainer = $(`<div class="bg-gray-950 rounded-3xl w-[calc((100%/3)*2)] h-[calc(100%-200px)] p-4 m-4"><h2 class="text-3xl font-bold mb-4">Stations (${data.features.length})</h2></div>`);

        contentContainer.append(filterContainer)
                        .append(dataContainer);

        const dataInnerContainer = $(`<div class="overflow-y-auto flex flex-col gap-4 w-full h-[calc(100%-2.25rem)] rounded-lg"></div>`);

        dataContainer.append(dataInnerContainer);

        data.features.forEach(station => {
            let bikes = "";
            station.properties.bikes.forEach(bike => {
                if(bike.isElectric == true) {
                    bikes += `<div class="w-max h-max px-2 bg-blue-300 text-black text-xs rounded-full" onclick="displayBikeInformation(${bike})">Normal</div>`;
                } else {
                    bikes += `<div class="w-max h-max px-2 bg-white text-black text-xs rounded-full flex flex-row justify-center items-center" onclick="displayBikeInformation(${bike})"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg"><path d="M376 211H256V16L136 301h120v195z"></path></svg>Electric</div>`;
                }
            })

            const container = $(`
                <div class="bg-gray-900 w-[99%] h-36 rounded-lg flex flex-row justify-start items-center">
                    <img src="/images/dock.png" class="h-full mr-3 rounded-bl-lg" />
                    <div class="w-fit">
                        <h4 class="font-medium text-2xl">${station.properties.name}</h4>
                        <p>${station.properties.addressStreet + " " + station.properties.addressCity + ", " + station.properties.addressState + ". " + station.properties.addressZipCode}</p>
                        <div class="flex flex-row">Bikes:&nbsp;<p ${(station.properties.bikes.length == 0 ? "class='text-red-800 font-bold'" : "")}>${station.properties.bikes.length}</p>/${station.properties.totalDocks}</div>
                        <div class="flex flex-row gap-1 w-full flex-wrap">${bikes}</div>
                    </div>
                </div>`
            );

            dataInnerContainer.append(container);
        });
    }, 1000);
});