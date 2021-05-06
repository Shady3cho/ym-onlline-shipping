// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
var longitude, latitude;
var geocoder;
var abu_dhabi = { lat: -22.3285, lng: 24.6849 };
let apiKey = "AIzaSyDi83GtuKAojcmXxm4lm-eoW03fVLlaELA&libraries=places";
let current_url = '';
let is_ym_shipping_customer_data_saved = false;
let is_shipping_info_confirmed = false;
let is_pickup_from_location = 1;

function initMap() {
    let id = 'googleMaps'
    if(document.getElementById(id) === null) {
        let script = document.createElement('script')
        script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=' + apiKey)
        script.setAttribute('id', id)
        document.body.appendChild(script)

        // now wait for it to load...
        script.onload = () => {

            map = new google.maps.Map(document.getElementById('map'), {
                center: abu_dhabi,
                zoom: 5
            });
            infoWindow = new google.maps.InfoWindow;
            geocoder = new google.maps.Geocoder;
            // GET coordinates and adress
            map.addListener('center_changed', function () {
                longitude = map.getCenter().lng();
                latitude = map.getCenter().lat();

            });

            map.addListener('dragend', function () {
                longitude = map.getCenter().lng();
                latitude = map.getCenter().lat();
            });
        }
    }
    else{
         map = new google.maps.Map(document.getElementById('map'), {
                center: abu_dhabi,
                zoom: 5
            });
            infoWindow = new google.maps.InfoWindow;
            geocoder = new google.maps.Geocoder;
            // GET coordinates and adress
            map.addListener('center_changed', function () {
                longitude = map.getCenter().lng();
                latitude = map.getCenter().lat();

            });

            map.addListener('dragend', function () {
                longitude = map.getCenter().lng();
                latitude = map.getCenter().lat();
            });
        
    }
}

// GEOLOCATION
function geolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


initMap();

function fetchAllAvailableShippingRates(){
    //fetch shipping rates
    $.ceAjax('request', fn_url('ym_shipping.fetch_all_shipping_rates'), {
        method: 'post',
        caching: false,
        hidden:true,
        callback: function(data){
            ymShippingRateAreasCache = data.shipping_rates;
            for(let i = 0; i< data.shipping_rates.length; i++){
                $('#ym_shipping_regions').append($('<option>', {
                    value: i,
                    text: data.shipping_rates[i].destination
                }));
                if(i === 0){
                    ymShippingSetCheckoutCities(data.shipping_rates[i]);
                }
              }

            $.ceAjax('request', fn_url('ym_shipping.get_store_pickup_locations'), {
                method: 'post',
                caching: false,
                hidden:true,
                data: {d : ''},
                callback: function(data){
                    let locdat = data['pickup_locations'];
                    for(let key in locdat) {
                        let pl = locdat[key];
                        $('#ym_shipping_pickup_locations').append($('<option>', {
                            value: pl['id'],
                            text: pl['pickup_name'] + ' (' + pl['city'] + ')'
                        }));
                    }
                    //fetch customer data
                    fetchCustomerData();
                }

            });
        }
    });
}

function fetchCustomerData(){
    let customer_id = $('#inpCustomerId').val();
    //fetch customer data
         $.ceAjax('request', fn_url('ym_shipping.get_customer_location_data'), {
                method: 'post',
                caching: false,
                hidden:true,
                data : {customer_id : customer_id},
                callback: function(data){
                    //if customer already has data
                    if(data.customer_data.length > 0){
                        ymShippingCustomerDataCache = data.customer_data[0];
                        $('#btnSubmitCustomerData').val('Click Here To Update You Location Data');
                        $('#btnSubmitCustomerData').css('background', '#017F35');
                        //console.log(ymShippingRateAreasCache[getRegionIndexFromId(ymShippingCustomerDataCache.rate_area_id)]);
                        ymShippingSetCheckoutCities(ymShippingRateAreasCache[getRegionIndexFromId(ymShippingCustomerDataCache.rate_area_id)]);
                        $("#ym_shipping_regions").val(getRegionIndexFromId(ymShippingCustomerDataCache.rate_area_id));
                        $("#ym_shipping_cities").val(ymShippingCustomerDataCache.rate_area_id + "," + ymShippingCustomerDataCache.rate_area_city_id);
                        var pos = {
                            lat: parseFloat(ymShippingCustomerDataCache.latitude),
                            lng: parseFloat(ymShippingCustomerDataCache.longitude)
                        };
                        is_ym_shipping_customer_data_saved = true;
                        is_pickup_from_location = ymShippingCustomerDataCache['is_pickup_from_location'];
                        if(is_pickup_from_location < 1){
                            ymShippingBtnDeliveryClick();
                        }else {
                            ymShippingBtnPickupClick();
                        }
                        $("#ym_shipping_pickup_locations").val(ymShippingCustomerDataCache['pickup_location_id']);
                        map.setCenter(pos);
                        map.setZoom(17);

                    }
                    else{
                    }
                }
            });

    $('#chkYmShippingConfirm').on('change', function(){
       is_shipping_info_confirmed =  $(this).prop("checked");
    });



    $("#litecheckout_final_section").on('DOMNodeInserted', function(e) {
         if(e.target.id == "litecheckout_final_section"){
              $('#litecheckout_place_order').prop("onclick", null).off("click");
        $('#litecheckout_place_order').on("click",function(e) {
            if(!is_ym_shipping_customer_data_saved){
                e.preventDefault(); // cancel the actual submit
                $('#lblConfirm').css('color', 'red');
                alert("Please update your shipping information");
            }
            if(!is_shipping_info_confirmed) {
                e.preventDefault(); // cancel the actual submit
                $('#lblConfirm').css('color', 'red');
                alert("Please confirm that your shipping information is correct");
            }
            else{
            }
        });
         }
    });

    $(function() {
        $('#litecheckout_place_order').prop("onclick", null).off("click");
        $('#litecheckout_place_order').on("click",function(e) {
            if(!is_ym_shipping_customer_data_saved){
                e.preventDefault(); // cancel the actual submit
                $('#lblConfirm').css('color', 'red');
                alert("Please update your shipping information");
            }
            if(!is_shipping_info_confirmed) {
                e.preventDefault(); // cancel the actual submit
                $('#lblConfirm').css('color', 'red');
                alert("Please confirm that your shipping information is correct");
            }
            else{
            }
        });
    });
}
function ymShippingBtnPickupClick(){
    let pickUpBut = $('#btnPickup');
    let deliveryBut = $('#btnDelivery');
    pickUpBut.css('background','#008000');
    pickUpBut.css('color','white');
    pickUpBut.css('border','0px solid black');
    deliveryBut.css('color','black');
    deliveryBut.css('background','transparent');
    deliveryBut.css('border','1px solid black');

    $('#divYmPickupFrmLocation').css('display', 'block');
    $('#divYmMapCheckout').css('display', 'none');
    is_pickup_from_location = 1;
}

function ymShippingBtnDeliveryClick(){

    let pickUpBut = $('#btnDelivery');
    let deliveryBut = $('#btnPickup');
    pickUpBut.css('background','#008000');
    pickUpBut.css('color','white');
    pickUpBut.css('border','0px solid black');
    deliveryBut.css('color','black');
    deliveryBut.css('background','transparent');
    deliveryBut.css('border','1px solid black');

    $('#divYmPickupFrmLocation').css('display', 'none');
    $('#divYmMapCheckout').css('display', 'block');
    is_pickup_from_location = 0;
}

let ymShippingRateAreasCache = {};
let ymShippingCustomerDataCache = {};
let ymShippingStatesCache = {};
//fetch saved shipping rates and put them on the page
$( document ).ready(function() {

    current_url = location.href;

    //fetch shipping rates
    fetchAllAvailableShippingRates();
});
let cnting = 1;


//set the cities from the rate area
function ymShippingSetCheckoutCities(rate_area){
    let cities_dropdown = $('#ym_shipping_cities');
    cities_dropdown.empty();

    for(let i = 0; i< rate_area.cities.length; i++){
        cities_dropdown.append($('<option>', {
            value: rate_area.cities[i].destination_id + "," + rate_area.cities[i].element_id,
            text: rate_area.cities[i].element
        }));
    }
}

//check when ajax request has finished running
    $(document).ajaxStop(function() {
        //if there is no area selected refresh the shipping regions
      if($('#ym_shipping_regions').find(":selected").val() === undefined){
          //fetch shipping rates
        fetchAllAvailableShippingRates();
        //re initialize the map
        initMap();
        //re fecth customer data
        fetchCustomerData();
      }
    });
//called when the region on the checkout page is changed
function ymShippingCheckoutRegionChanged(elem){
   let selected_region =  $('#ym_shipping_regions').find(":selected").val();
    ymShippingSetCheckoutCities(ymShippingRateAreasCache[selected_region]);
    //center map in that region
    var pos = {
        lat: parseFloat(ymShippingRateAreasCache[selected_region].zoom_latitude),
        lng: parseFloat(ymShippingRateAreasCache[selected_region].zoom_longitude)
    };
    map.setCenter(pos);
    map.setZoom(parseFloat(ymShippingRateAreasCache[selected_region].zoom_level));
}



function getRegionIndexFromId(id){
    for(let i = 0; i< ymShippingRateAreasCache.length; i++){
        if(ymShippingRateAreasCache[i].destination_id === id){
            return i;
        }
    }
    return 1;
}

function ymShippingZoomInToCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            map.setZoom(17);

        })
    }
}


function ymShippingUpdateOrAddCustomerInformation(){
    let customer_id = $('#inpCustomerId').val();
    let latitude = map.getCenter().lat();
    let longitude = map.getCenter().lng();
    let selectedDat =  $('#ym_shipping_cities').find(":selected").val().split(',');    
     let selectedPickupLocation =  $('#ym_shipping_pickup_locations').find(":selected").val();
    let rate_area_id = selectedDat[0];
    let rate_area_city_id = selectedDat[1];

    let d = {
        customer_id : customer_id,
        rate_area_city_id : rate_area_city_id,
        rate_area_id : rate_area_id,
        latitude : latitude,
        longitude : longitude,
        pickup_location_id : selectedPickupLocation,
        is_pickup_from_location : is_pickup_from_location
    }

    $.ceAjax('request', fn_url('ym_shipping.update_or_add_customer_location_data'), {
        method: 'post',
        caching: false,
        hidden:true,
        data: d,
        callback: function(data){
            $('#litecheckout_place_order').prop('disabled', false);
            //reload to refresh shipping estimation
            location.reload();
        }
    });

}
