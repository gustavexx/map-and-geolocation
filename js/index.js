/*
Gustavo J Marcano, Student I.D 000812644
Created January 23 , 2021
index,html represents UI that renders the map session
*/
window.addEventListener("load", () => {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    formFilter = document.forms.mapFilterForm;

    // Checks all the checkboxes
    for (i = 0; i < formFilter.length; i++) {
        formFilter[i].checked = true;
    }


    // Toggles the filter checkboxes when "all" is clicked
    formFilter.all.addEventListener("click", () => {

        if (formFilter.all.checked == true) {
            for (i = 0; i < formFilter.length; i++) {
                formFilter[i].checked = true;
            }
        }
        else {
            for (i = 0; i < formFilter.length; i++) {
                formFilter[i].checked = false;
            }
        }
    });

    // Toggles the filter checkbox "all" when the the rest are checked.
    addEventListener("click", (event) => {

        let flag = true;

        if (event.target.value != "all" && formFilter.all.checked) {
            formFilter.all.checked = false;
        }

        for (i = 1; i < formFilter.length; i++) {

            if (formFilter[i].checked == true) {
                flag = flag && true;
            }
            else {
                flag = flag && false;
            }
        }
        if (flag)
            formFilter.all.checked = true;
    });
}); // window.addEventListener()

function filterMap() {

    if (formFilter.elementary.checked == false) {
        markers.forEach((val, index) => {
            if (val.category == "Elementary School") {
                val.setVisible(false);
            }
        });
    }
    else if (formFilter.elementary.checked) {
        markers.forEach((val, index) => {
            if (val.category == "Elementary School") {
                val.setVisible(true);
            }
        })
    }

    if (formFilter.middle.checked == false) {
        markers.forEach((val, index) => {
            if (val.category == "Middle School") {
                val.setVisible(false);
            }
        })
    }
    else if (formFilter.middle.checked) {
        markers.forEach((val, index) => {
            if (val.category == "Middle School") {
                val.setVisible(true);
            }
        })
    }

    if (formFilter.secondary.checked == false) {
        markers.forEach((val, index) => {
            if (val.category == "Secondary School") {
                val.setVisible(false);
            }
        })
    }
    else if (formFilter.secondary.checked) {
        markers.forEach((val, index) => {
            if (val.category == "Secondary School") {
                val.setVisible(true);
            }
        })
    }

    if (formFilter.postSecondary.checked == false) {
        markers.forEach((val, index) => {
            if (val.category == "Post Secondary") {
                val.setVisible(false);
            }
        })
    }
    else if (formFilter.postSecondary.checked) {
        markers.forEach((val, index) => {
            if (val.category == "Post Secondary") {
                val.setVisible(true);
            }
        })
    }

    if (formFilter.alternative.checked == false) {
        markers.forEach((val, index) => {
            if (val.category == "Alternative Education") {
                val.setVisible(false);
            }
        })
    }
    else if (formFilter.alternative.checked) {
        markers.forEach((val, index) => {
            if (val.category == "Alternative Education") {
                val.setVisible(true);
            }
        })
    }

    if (formFilter.adult.checked == false) {
        markers.forEach((val, index) => {
            if (val.category == "Adult Learning") {
                val.setVisible(false);
            }
        })
    }
    else if (formFilter.adult.checked) {
        markers.forEach((val, index) => {
            if (val.category == "Adult Learning") {
                val.setVisible(true);
            }
        })
    }
    if (formFilter.section23.checked == false) {
        markers.forEach((val, index) => {
            if (val.category == "Section 23 Program") {
                val.setVisible(false);

            }
        })
    }
    else if (formFilter.section23.checked) {
        markers.forEach((val, index) => {
            if (val.category == "Section 23 Program") {
                val.setVisible(true);
            }
        })
    }

    infoWindows.forEach((val, index) => {
        val.close();
        directionsRenderer.setMap(null);
        directionsRenderer.setPanel(null);
    });

}

/** Global objects/variables */
let map;
let pos;
let initialMarker;
let initialInfo;
let initialInfoWindow;
let infoWindows;
let markers;
let directionsService;
let directionsRenderer;
let cleardirection;
let geocoder;
let geocodedContent;
let geocodedInfoWindow;
let geocodedMarker;
let geocodedMarkers;
let geocodedInfoWindows;
/*********************************************** */


function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    geocodedMarkers = [];
    geocodedInfoWindows = [];
    const geocoder = new google.maps.Geocoder();

    document.getElementById("geocode").addEventListener("click", function () {

        geoCodeAddress(geocoder, map);
        clear();

    });
}

// Resets the directions' fields
function clear() {

    document.getElementById("geocode-form").reset();
}
function showPosition(position) {

    // Initial user of Hamilton,
    pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    }


    // Instantiate the map centered in Hamilton
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.2557, lng: -79.8711 },
        zoom: 10,
    });

    // Instantiate initital marker in the user's position
    initialMarker = new google.maps.Marker({
        position: pos,
        map,
    });



    // Start initial info window for initial marker on local position
    initialInfo = "<div> Latitude: " + pos.lat.toFixed(4) + "<br> Longitude " + pos.lng.toFixed(4) + "</div>";
    initialInfoWindow = new google.maps.InfoWindow();
    initialInfoWindow.setContent(initialInfo);
    initialInfoWindow.open(map, initialMarker);
    geocodedInfoWindows.forEach((val, index) => {
        val.close();
    });

    /** Uncomment next line if user wants map centered to the marker */
    //map.setCenter(initialMarker.getPosition());


    infoWindows = [];
    markers = [];

    education.forEach((val, index) => {

        let educationPos = { lat: val.LATITUDE, lng: val.LONGITUDE }

        let marker = new google.maps.Marker({
            position: educationPos,
            map,
            category: val.CATEGORY,
            objectId: val.OBJECTID,

        });

        let info = "<div><a href=\"" + val.WEBSITE + "\" target=\"_blank\">" + val.NAME + "</a></div>" +
            "<div>" + val.ADDRESS + "</div>" +
            "<div>" + val.CATEGORY + "</div>" +
            "<div>" + val.COMMUNITY + "</div>" +
            "<div><a href=\"javascript:void(0)\" onclick=\"setRoute(" + val.LONGITUDE.toFixed(2) + "," + val.LATITUDE.toFixed(2) + ", " + val.OBJECTID + ")\">directions</a></div>";
        let infoWindow = new google.maps.InfoWindow();

        infoWindow.setContent(info);
        infoWindows.push(infoWindow);

        markers.push(marker);

        marker.addListener("click", () => {
            initialInfoWindow.close();
            infoWindows.forEach((val, index) => {


                directionsRenderer.setMap(null);
                directionsRenderer.setPanel(null);
                val.close();

            });

            infoWindow.open(map, marker);

            geocodedInfoWindows.forEach((val, index) => {
                val.close();
            });
        });
    });

    // Close all markers to show current location again
    initialMarker.addListener("click", () => {
        infoWindows.forEach((val, index) => {
            val.close();
            directionsRenderer.setMap(null);
            directionsRenderer.setPanel(null);
        });
        initialInfoWindow.open(map, initialMarker);
        geocodedInfoWindows.forEach((val, index) => {
            val.close();
        })
    });


    cleardirection = document.getElementById("map-directions-clear-button");
    cleardirection.addEventListener("click", function () {

        markers.forEach((val, index) => {
            val.setVisible(true);
            directionsRenderer.setMap(null);
            directionsRenderer.setPanel(null);
        });

        infoWindows.forEach((val, index) => {
            val.close();
        });
    });
}

function setRoute(longitude, latitude, marker) {

    let currentMarker;

    currentMarker = markers.find((obj) => { return (obj.objectId === marker) });

    let request = {
        origin: pos,
        destination: currentMarker.getPosition(),
        travelMode: 'DRIVING'
    };


    directionsService.route(request, function (result, status) {

        if (status == 'OK') {

            directionsRenderer.setDirections(result);

            directionsRenderer.setPanel(document.getElementById("map-directions-content"));
        }
    });

    markers.forEach((val, index) => {
        val.setVisible(false);

    })
    directionsRenderer.setMap(map);
    /****************************************** */
}

/** Translates an human readable address to location and creates a marker */
function geoCodeAddress(geocoder, resultMap) {

    nameOfStreet = document.getElementById("nameOfStreet").value;
    let address = document.getElementById("address").value;

    address = address + ", " + nameOfStreet;

    geocoder.geocode({ address: address }, (result, status) => {



        if (status === "OK") {
            resultMap.setCenter(result[0].geometry.location);
            geocodedMarker = new google.maps.Marker({
                map: resultMap,
                center: result[0].geometry.location,
                position: result[0].geometry.location,
                address: address
            });
            resultMap.setZoom(12);

            geocodedContent = "<div><h6>" + address + "</h6></div>" +
                "<div> Latitude: " + result[0].geometry.location.lat().toFixed(4) + "</div>" +
                "<div> Logitude: " + result[0].geometry.location.lng().toFixed(4) + "</div>";

            geocodedInfoWindow = new google.maps.InfoWindow({
                content: geocodedContent
            });

            geocodedInfoWindow.open(resultMap, geocodedMarker);
            geocodedMarkers.push(geocodedMarker);
            geocodedInfoWindows.push(geocodedInfoWindow);

            geocodedInfoWindows.forEach((val, index) => {
                val.close();
            });
            geocodedInfoWindow.open(resultMap, geocodedMarker);
            geocodedMarkers.forEach((val, index) => {

                val.addListener("click", (value, i) => {
                    initialInfoWindow.close();

                    geocodedInfoWindows.forEach((val, index) => {
                        val.close();
                    });

                    geocodedInfoWindows[index].open(resultMap, val);
                });
            });
        }
        else {
            alert("Geocode was not successful for the following reason: " + status);
        }

        initialInfoWindow.close();
        infoWindows.forEach((val, index) => {
            val.close();
        });
    });
}