<?php
use Tygh\Registry;


if ( !defined('AREA') ) { die('Access denied'); }

//called just before the tax of the cart is computed on checkout
function fn_ym_shipping_calculate_cart_taxes_pre(&$cart,&$cart_products,&$product_groups,&$calculate_taxes,&$auth)
{
    //get customer id
    $customer_id = $auth['user_id'];
    //get all customer location data
    $customer = getCustomerLocationDataCalc($customer_id);
    if(count($customer) > 0) {
        $customer_latitude = $customer[0]['latitude'];
        $customer_longitude = $customer[0]['longitude'];
        $customer_rate_area = $customer[0]['rate_area_id'];
        $customer_is_pickup = $customer[0]['is_pickup_from_location'];
        $customer_pickup_location_id = $customer[0]['pickup_location_id'];
        
              //fetch product weight and volume
        $total_shipping_cost = 0;
        
                if($customer_is_pickup == 0) {
                    
        $rate_area = getRateArea($customer_rate_area)[0];
        $start_latitude = $rate_area['latitude'];
        $start_longitude = $rate_area['longitude'];



        //get all shipping settings
        $ym_shipping_standard_volume = Registry::get('addons.ym_shipping.ym_shipping_standard_volume');
        $ym_shipping_standard_distance = Registry::get('addons.ym_shipping.ym_shipping_standard_distance');
        $ym_shipping_rate_per_km = Registry::get('addons.ym_shipping.ym_shipping_rate_per_km');
        $ym_shipping_standard_weight = Registry::get('addons.ym_shipping.ym_shipping_standard_weight');
        $ym_shipping_volumetric_factor = Registry::get('addons.ym_shipping.ym_shipping_volumetric_factor');
        $ym_shipping_volumetric_rate = Registry::get('addons.ym_shipping.ym_shipping_volumetric_rate');
        $ym_shipping_subtract_standard_distance = Registry::get('addons.ym_shipping.ym_shipping_subtract_standard_shipping_distance');
        $ym_shipping_tax_rate = Registry::get('addons.ym_shipping.ym_shipping_tax_rate');


        //compute distance
        $distance = ymShippingCalculateDistance($start_latitude, $start_longitude, $customer_latitude, $customer_longitude);
        //apply standard distance
        $effective_distance = ($distance <= $ym_shipping_standard_distance) ? 0 : $distance;

        //subtract standard distance
        if($effective_distance > 0 && $ym_shipping_subtract_standard_distance == 'Y'){
            $effective_distance -= $ym_shipping_standard_distance;
        }

        $distance_shipping_cost =  $effective_distance *$ym_shipping_rate_per_km;

        //fetch product weight and volume
        $total_shipping_cost = 0;

        //calculate shipping cost each product
        foreach ($cart_products as $prd){
            $weigth = $prd['weight'];
            $length = $prd['shipping_params']['box_length'];
            $width = $prd['shipping_params']['box_width'];
            $height = $prd['shipping_params']['box_height'];
            $amount = $prd['amount'];
            $p_volume = ($length * $width * $height);
            $is_standard_weight_product = ($weigth < $ym_shipping_standard_weight) && ($p_volume < $ym_shipping_standard_volume);
            $p_volumetric_weight = ($length * $width * $height) / 1000 / $ym_shipping_volumetric_factor;
            $p_freight_calculation = ($weigth > $p_volumetric_weight) ? $weigth * $ym_shipping_volumetric_rate :  $p_volumetric_weight * $ym_shipping_volumetric_rate;
            $p_weight_amount = ($p_freight_calculation < 180) ? 180 : $p_freight_calculation;
            $p_shipping_cost = $is_standard_weight_product ? $distance_shipping_cost : (($p_weight_amount > $distance_shipping_cost) ? $p_weight_amount : $distance_shipping_cost);
            $p_shipping_cost *= $amount;
            $total_shipping_cost += $p_shipping_cost;
        }
                }else{
                    $pickupLocDat = getPicupLocationData($customer_pickup_location_id);
            if(count($pickupLocDat) > 0) {
                $total_shipping_cost = $pickupLocDat[0]['fixed_rate'];
            }
            else{
                $total_shipping_cost = 0;
            }
                }

        $shipping_tax = $total_shipping_cost * ($ym_shipping_tax_rate / 100);
        $total_shipping_cost += $shipping_tax;
        $cart['calculate_shipping'] = false;
        $cart['shipping_cost'] = $total_shipping_cost;
        $cart['display_shipping_cost'] = $cart['shipping_cost'];
    }
}

function fn_ym_shipping_place_order($order_id, $action, $order_status, $cart, $auth){
    $customer_id = $auth['user_id'];
    $customer = getCustomerLocationDataCalc($customer_id);
    $pickup_from_location = $customer[0]['is_pickup_from_location'];
    $pickup_location_id = $customer[0]['pickup_location_id'];

    $insertData = array (
        'customer_id' => $auth['user_id'],
        'order_id' => $order_id,
        'rate_area_city_id' => $customer[0]['rate_area_city_id'],
        'rate_area_id' => $customer[0]['rate_area_id'],
        'latitude' => $customer[0]['latitude'],
        'longitude' => $customer[0]['longitude'],
        'pickup_location_id' => $pickup_location_id,
        'is_pickup_from_location' => $pickup_from_location
    );

    db_query("INSERT INTO ?:ym_shipping_order_data ?e", $insertData);
}

function getCustomerLocationDataCalc($customer_id){
    $selectData = array (
        'customer_id' => $customer_id
    );
    $customer = db_get_array('SELECT * FROM ?:ym_shipping_customer_data where ?w', $selectData);

    return $customer;
}

function getRateArea($rate_area_id){
    $selectData = array (
        'shipping_rate_id' => $rate_area_id
    );
    $rate_area = db_get_array('SELECT * FROM ?:ym_shipping_store_locations where ?w', $selectData);

    return $rate_area;
}

function ymShippingCalculateDistance($lat1, $lon1, $lat2, $lon2) {
    $pi80 = M_PI / 180;
    $lat1 *= $pi80;
    $lon1 *= $pi80;
    $lat2 *= $pi80;
    $lon2 *= $pi80;
    $r = 6372.797; // mean radius of Earth in km
    $dlat = $lat2 - $lat1;
    $dlon = $lon2 - $lon1;
    $a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlon / 2) * sin($dlon / 2);
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    $km = $r * $c;
    return $km;
}

function getPicupLocationData($pickup_location_id){
    $selectData = array (
        'id' => $pickup_location_id
    );
    $customer = db_get_array('SELECT * FROM ?:ym_shipping_pick_up_location_data where ?w', $selectData);

    return $customer;
}

?>