let ym_shipping_pickup_point_collection = {};
let ym_shipping_largest_id = 0;

function ym_shipping_save_pickup_locations(){
    event.stopPropagation();
    $.ceAjax('request', fn_url('ym_shipping.update_store_pickup_locations'), {
        method: 'post',
        caching: false,
        hidden:true,
        data: {pickup_locations : ym_shipping_pickup_point_collection},
        callback: function(data){
        }
    });
}

function ym_shipping_add_pickup_location(){
    event.stopPropagation();
    //get largest current id
    let largestId = ym_shipping_largest_id++;
    ym_shipping_pickup_point_collection[ym_shipping_largest_id] = {id : ym_shipping_largest_id, pickup_name : "", city : "", fixed_rate : ""};
    ym_Shipping_Set_Pickup_Locations_Table();
}

function btn_Remove_Pickup_Location(id){
    delete ym_shipping_pickup_point_collection[id];
    ym_Shipping_Set_Pickup_Locations_Table();
}

function on_PickupLocation_Value_Changed(id, prop){
  ym_shipping_pickup_point_collection[id][prop] = $('#ym_pickup_' + id.toString() + prop.toString()).val();
}

function ym_Shipping_Set_Pickup_Locations_Table(){
    let rows = '';
    ym_shipping_largest_id = 0;
    for(let key in ym_shipping_pickup_point_collection) {
        let pl = ym_shipping_pickup_point_collection[key];
        ym_shipping_largest_id = ym_shipping_largest_id < pl.id ? pl.id : ym_shipping_largest_id;
        rows +=
            '<tr>'+
            '<td> <input id="ym_pickup_' + pl.id.toString() +'city" type="text" onchange="on_PickupLocation_Value_Changed(\''+ pl.id +'\',\'city\')" value="'+ pl.city +'"></td>' +
            '<td><input id="ym_pickup_' + pl.id.toString() + 'pickup_name" type="text" onchange="on_PickupLocation_Value_Changed(\''+ pl.id +'\',\'pickup_name\')" value="'+ pl.pickup_name +'"></td>' +
            '<td><input id="ym_pickup_' + pl.id.toString() + 'fixed_rate" type="text" onchange="on_PickupLocation_Value_Changed(\''+ pl.id +'\',\'fixed_rate\')" value="'+ pl.fixed_rate +'"></td>' +
            '<td><span class="btn btn-primary cm-submit btn-primary" onclick="btn_Remove_Pickup_Location(\''+ pl.id +'\')" style="float: right;">Delete</span></td>' +
            '</tr>';

    }
    let tablebody = $('#tbody_pickup_locations');
    tablebody.html('');
    tablebody.html(rows);
}

$( document ).ready(function() {
    $.ceAjax('request', fn_url('ym_shipping.get_store_pickup_locations'), {
        method: 'post',
        caching: false,
        hidden:true,
        data: {d : ''},
        callback: function(data){
            let locdat = data['pickup_locations'];
            for(let key in locdat) {
                let pl = locdat[key];
                ym_shipping_pickup_point_collection[pl['id']] = pl;
            }
            ym_Shipping_Set_Pickup_Locations_Table();
        }

    });

});