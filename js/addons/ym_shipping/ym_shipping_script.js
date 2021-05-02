

function saveShippingStoreLocations(rate_id){
    event.stopPropagation();
    let shippingRateId = rate_id;
    let shippingId = "1";
    let latitude = $('#ym_shipping_latitude').val();
    let longitude = $('#ym_shipping_longitude').val();
    let zoom_latitude = $('#ym_shipping_zoom_latitude').val();
    let zoom_longitude = $('#ym_shipping_zoom_longitude').val();
    let zoom_level = $('#ym_shipping_zoom_level').val();
    let d = {
        shipping_method_id : shippingId,
        shipping_rate_id : shippingRateId,
        latitude : latitude,
        longitude : longitude,
        zoom_latitude : zoom_latitude,
        zoom_longitude : zoom_longitude,
        zoom_level : zoom_level
    }

    console.log(d);

    $.ceAjax('request', fn_url('ym_shipping.update'), {
        method: 'post',
        caching: false,
        hidden:true,
        data: d,
        callback: function(data){
        }
    });
}

//fetch saved shipping rates and put them on the page
$( document ).ready(function() {
    let shippingId = $('input[name ="destination_id"]').val();
    let d = {
        shipping_method_id : shippingId
    }
    $.ceAjax('request', fn_url('ym_shipping.get_shipping_rates'), {
        method: 'post',
        caching: false,
        hidden:true,
        data: d,
        callback: function(data){
            console.log(d);
            console.log(data);
            for(let i = 0; i< data.shipping_rates.length; i++){
                $('#ym_shipping_latitude').val(data.shipping_rates[i].latitude);
                $('#ym_shipping_longitude').val(data.shipping_rates[i].longitude);
                $('#ym_shipping_zoom_latitude').val(data.shipping_rates[i].zoom_latitude);
                $('#ym_shipping_zoom_longitude').val(data.shipping_rates[i].zoom_longitude);
                $('#ym_shipping_zoom_level').val(data.shipping_rates[i].zoom_level);}

        }
    });
})

