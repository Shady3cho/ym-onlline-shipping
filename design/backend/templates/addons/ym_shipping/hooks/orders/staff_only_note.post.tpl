{script src="js/addons/ym_shipping/ym_shipping_orders_script.js"}
{style src="addons/pin_drop_shipping/style.css"}
<div>
    <h4>Ym Online Shipping</h4>
</div>
<table style="width:100%">
    <tr>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
    </tr>
    <tr>
        <td><label>Latitude : </label></td>
        <td><label id="lblLatitude"></label></td>
        <td><label>Origin Latitude : </label></td>
        <td><label id="lblOriginLatitude"></label></td>
    </tr>
    <tr>
        <td><label>Longitude : </label></td>
        <td><label id="lblLongitude"></label></td>
        <td><label>Origin Longitude : </label></td>
        <td><label id="lblOriginLongitude"></label></td>
    </tr>
    <tr>
        <td><label>Pickup From Store : </label></td>
        <td><label id="lblPickUpFromLocation"></label></td>
        <td><label>Selected State : </label></td>
        <td><label id="lblSelectedState"></label></td>
    </tr>
    <tr>
        <td><label>Pickup Store : </label></td>
        <td><label id="lblPickupLocation"></label></td>
        <td><label>Computed Distance : </label></td>
        <td><label id="lblComputedDistance"></label></td>
    </tr>
</table>
<div class="map_parent" style="flex-grow: 1">
    <div id="map">
    </div>
</div>
