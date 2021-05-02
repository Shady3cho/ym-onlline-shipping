<?php
use Tygh\Registry;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if ($mode == 'update') {
        //update all shipping rate areas
        fn_ym_shipping_add_or_update_shipping_store_locations
        (
            $_REQUEST['shipping_method_id'],
            $_REQUEST['shipping_rate_id'],
            $_REQUEST['latitude'],
            $_REQUEST['longitude'],
            $_REQUEST['zoom_latitude'],
            $_REQUEST['zoom_longitude'],
            $_REQUEST['zoom_level']
        );
    }else if($mode == 'update_or_add_customer_location_data'){
        updateOrAddCustomerLocationInformation(
            $_REQUEST['customer_id'],
            $_REQUEST['rate_area_city_id'],
            $_REQUEST['rate_area_id'],
            $_REQUEST['latitude'],
            $_REQUEST['longitude'],
            $_REQUEST['pickup_location_id'],
            $_REQUEST['is_pickup_from_location']
        );
        return array(CONTROLLER_STATUS_OK, "$index_script?dispatch=checkout.checkout");
    }else if($mode == 'get_shipping_rates'){
        getShippingRates($_REQUEST['shipping_method_id']);
        return array(CONTROLLER_STATUS_OK, "$index_script?dispatch=checkout.checkout");
    }else if($mode == 'fetch_all_shipping_rates'){
        getAllShippingRates();
        return array(CONTROLLER_STATUS_OK, "$index_script?dispatch=checkout.checkout");
    }else if($mode == 'get_customer_location_data'){
        getCustomerLocationData($_REQUEST['customer_id']);;
        return array(CONTROLLER_STATUS_OK, "$index_script?dispatch=checkout.checkout");
    }else if($mode == 'get_order_shipping_data'){
        getOrderShippingData($_REQUEST['order_id']);
    }
    else if($mode == 'update_store_pickup_locations'){
        postYmShippingPickupLocations($_REQUEST['pickup_locations']);
    }
    else if($mode == 'get_store_pickup_locations'){
        getYmShippingPickupLocations();
    }


}

function postYmShippingPickupLocations($d){
    $selectData = array (
        '1' => '1'
    );
    db_query('DELETE FROM ?:ym_shipping_pick_up_location_data', array());
    foreach($d as $key=>$val){
        //add pikcup location
        $insertData = $val;
        db_query("INSERT INTO ?:ym_shipping_pick_up_location_data ?e", $insertData);
    }
}

function getYmShippingPickupLocations(){
    $pickup_locations = db_get_array('SELECT * FROM ?:ym_shipping_pick_up_location_data', array());
    Registry::get('ajax')->assign('pickup_locations', $pickup_locations);
}

function getOrderShippingData($orderId){
    $selectData = array (
        'order_id' => $orderId
    );
   $order_data = db_get_array('SELECT * FROM ?:ym_shipping_order_data where ?w', $selectData);
   
    $selectDataOrderDat = array (
       'id' => $order_data[0]['pickup_location_id']
   );
    $order_pickUpLoc = db_get_array('SELECT * FROM ?:ym_shipping_pick_up_location_data where ?w', $selectDataOrderDat);
  
    Registry::get('ajax')->assign('order_data', $order_data);
    Registry::get('ajax')->assign('order_pickup_data', $order_pickUpLoc);
}

//stores or updates the shipping method store locations
function fn_ym_shipping_add_or_update_shipping_store_locations($shipping_method_id, $shipping_rate_id, $latitude, $longitude, $zoom_latitude, $zoom_longitude, $zoom_level)
{
    //Getting authentication data to identify user
    $auth = $_SESSION['auth'];

    //Checking if the user is logged in and resides at the customer area
    if (!empty($auth['user_id'])) {
        //Checking if the database has data on the user.
        //Creating new record if necessary, appending existing data if possible.
        //create select data array
        $selectData = array (
            'shipping_method_id' => $shipping_method_id,
            'shipping_rate_id' => $shipping_rate_id
        );

        $shipping_method = db_get_field('SELECT * FROM ?:ym_shipping_store_locations WHERE ?w', $selectData);

        //if record for shipping method already exists update it otherwise add it
        if (!empty($shipping_method)) {
            $updateData = array (
                'shipping_rate_id' => $shipping_rate_id,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'zoom_latitude' => $zoom_latitude,
                'zoom_longitude' => $zoom_longitude,
                'zoom_level' => $zoom_level
            );
            db_query("UPDATE ?:ym_shipping_store_locations SET ?u WHERE ?w", $updateData, $selectData);
        }
        else{
            $insertData = array (
                'shipping_method_id' => $shipping_method_id,
                'shipping_rate_id' => $shipping_rate_id,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'zoom_latitude' => $zoom_latitude,
                'zoom_longitude' => $zoom_longitude,
                'zoom_level' => $zoom_level
            );
            db_query("INSERT INTO ?:ym_shipping_store_locations ?e", $insertData);
        }
    }
}

//gets all the shipping rates with custom distance rate values
function getShippingRates($shipping_method_id){
    $selectData = array (
        'shipping_rate_id' => $shipping_method_id
    );
    $shipping_method = db_get_array('SELECT * FROM ?:ym_shipping_store_locations where ?w', $selectData);
    getCities($shipping_method);
    Registry::get('ajax')->assign('shipping_rates', $shipping_method);
}

//gets all the shipping rates including cities
function getAllShippingRates(){
    $shipping_method = db_get_array('SELECT * FROM ?:destination_descriptions,?:ym_shipping_store_locations where ?:destination_descriptions.destination_id = ?:ym_shipping_store_locations.shipping_rate_id', array());
    getCities($shipping_method);
    Registry::get('ajax')->assign('shipping_rates', $shipping_method);
}

function getCities(&$shipping_methods){
    //fetch the cities for each rate area
    for ($i = 0 ; $i < count($shipping_methods); $i++){
        $selectData = array(
            'destination_id' => $shipping_methods[$i]['shipping_rate_id'],
            'element_type' => 'T'
        );
        $shipping_method_cities = db_get_array('SELECT * FROM ?:destination_elements where ?w', $selectData);
        $shipping_methods[$i]['cities'] = $shipping_method_cities;
    }
}

//creates or updates a customer
function updateOrAddCustomerLocationInformation($customer_id, $rate_area_city_id, $rate_are_id, $latitude, $longitude, $pikcup_location_id, $is_pickup_from_location){
    //check if the customer information exists already
    $selectData = array (
        'customer_id' => $customer_id
    );
    $customer = db_get_array('SELECT * FROM ?:ym_shipping_customer_data where ?w', $selectData);
    if(count($customer) > 0){
        //update customer
        $updateData = array (
            'rate_area_city_id' => $rate_area_city_id,
            'rate_area_id' => $rate_are_id,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'pickup_location_id' => $pikcup_location_id,
            'is_pickup_from_location' => $is_pickup_from_location
        );

        db_query("UPDATE ?:ym_shipping_customer_data SET ?u WHERE ?w", $updateData, $selectData);
    }
    else{
        //add new customer
        $insertData = array (
            'customer_id' => $customer_id,
            'rate_area_city_id' => $rate_area_city_id,
            'rate_area_id' => $rate_are_id,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'pickup_location_id' => $pikcup_location_id,
            'is_pickup_from_location' => $is_pickup_from_location
        );

        db_query("INSERT INTO ?:ym_shipping_customer_data ?e", $insertData);
    }
}

function getCustomerLocationData($customer_id){
    $selectData = array (
        'customer_id' => $customer_id
    );
    $customer = db_get_array('SELECT * FROM ?:ym_shipping_customer_data where ?w', $selectData);

    Registry::get('ajax')->assign('customer_data', $customer);
}

