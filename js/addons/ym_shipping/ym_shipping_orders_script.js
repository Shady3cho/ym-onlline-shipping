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
}

$( document ).ready(function() {
    let order_id = $("input[name='order_id']").val();
    let d = {
        order_id : order_id
    }
    $.ceAjax('request', fn_url('ym_shipping.get_order_shipping_data'), {
        method: 'post',
        caching: false,
        hidden:true,
        data: d,
        callback: function(data){
            if(data['order_data'].length > 0) {
               let order_data = data['order_data'][0]
                let order_pickup_data = data['order_pickup_data'][0];
               let shipping_data = data["shipping_method"][0];
                $('#lblLatitude').text(order_data['latitude']);
                $('#lblLongitude').text(order_data['longitude']);

                $('#lblOriginLongitude').text(shipping_data['longitude']);
                $('#lblOriginLatitude').text(shipping_data['latitude']);

                $('#lblSelectedState').text(shipping_data['destination']);
                $('#lblComputedDistance').text(data['distance']);

                if(order_data['is_pickup_from_location'] > 0){
                    $('#lblPickUpFromLocation').text('Yes');
                }else {
                    $('#lblPickUpFromLocation').text('No');
                    $('#lblPickupLocation').css('display','none');
                }
                $('#lblPickupLocation').text(order_pickup_data['pickup_name'] + '(' + order_pickup_data['city'] + ')');

                var panPoint = { lat: parseFloat(order_data['latitude']), lng: parseFloat(order_data['longitude']) };
                map.setCenter(panPoint)
                //declare marker as global variable
                marker = new google.maps.Marker({
                    map: map,
                    position: panPoint,
                });
            }
        }
    });
})

initMap();
