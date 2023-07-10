$(document).ready(function(){
    initMap();
    var searchInput = 'search_input';
    var autocomplete;
    autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
    types: ['geocode']});

    google.maps.event.addListener(autocomplete, 'place_changed', async function() {
    var near_place = autocomplete.getPlace();
    console.log(near_place)
    map.setCenter(near_place.geometry.location);
    map.setZoom(16)

    
    const optionsPOST = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(getCookie('token')).token_type + " " + JSON.parse(getCookie('token')).access_token,
            'Access-Control-Allow-Origin':'*'
        },
    };

    const optionsGET = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(getCookie('token')).token_type + " " + JSON.parse(getCookie('token')).access_token,
            'Access-Control-Allow-Origin':'*'
        },
    };


    let response = await fetch(`https://boschmov.azurewebsites.net/adresses/closest?initial_adress=${encodeURIComponent(near_place.formatted_address)}`, optionsPOST)
    .then(response => response.json())
    .then(data => {
        // Process the data returned by the API
        return data
        // Use the data as needed
    })
    .catch(error => {
        // Handle any errors that occur during the API call
        console.error('Error:', error);
    });
    

    let querySty = response.Adress.street + " " + response.Adress.houseNumber + " " + response.Adress.neighborhood + " " + response.Adress.city + " SP " + response.Adress.cep

    let geoloc = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${querySty}&key=AIzaSyBbA7phaK0dMPK4Dw_U-_Z0vfN30vOHhh8`).then(resp => resp.json())

    const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: geoloc.results[0].geometry.location,
        title: querySty,
      });


    map.setCenter(geoloc.results[0].geometry.location);
    map.setZoom(16)

    var contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    `<h4 id="firstHeading" class="firstHeading">Hour: ${response.Adress.busstops[0].time}</h4>` +
    '<div id="bodyContent">' +
    `<p><b>adress: </b> ${geoloc.results[0].formatted_address} ` +
    '</div>' +
    `<a href="https://www.google.com.br/maps/place/${geoloc.results[0].formatted_address}">open on maps</a>`
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    infowindow.open(map, marker);

    let line = await fetch(`https://boschmov.azurewebsites.net/closest/lines/?initial_adress=${encodeURIComponent(near_place.formatted_address)}`, optionsGET)
    .then(response => response.json())
    .then(data => {
        // Process the data returned by the API
        return data
        // Use the data as needed
    })
    .catch(error => {
        // Handle any errors that occur during the API call
        console.error('Error:', error);
    });



    infosPopUP(response.distance, line, response.Adress.busstops[0].time, geoloc.results[0].formatted_address)
    });




});

var map;

async function initMap(){
    const position = { lat: -22.892033, lng: -47.2327023 };

     map = await new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: position,
        mapId: '829ad9e52fd0b03b'
    });
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
  
      if (cookie.startsWith(`${name}=`)) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
  
    return null;
  }




function infosPopUP(distance, lineNumber, hour, adress){
    let popup = $(".pop-up")
    let bus = $(".result")
    let line = $("#nmrlinha")
    let hourInfo = document.getElementById("hour_info")
    let distance_info = document.getElementById("distance_info")
    let str_hour = "take the bus at <b>" + hour + "</b> at the adress: <b>" + adress + "</b>"

    popup.addClass("found")
    bus.css("display", "flex")
    distance_info.innerHTML = `<b>distance from your adress:</b> ${distance/1000}km`
    line.text(lineNumber)
    hourInfo.innerHTML = str_hour

}
            




