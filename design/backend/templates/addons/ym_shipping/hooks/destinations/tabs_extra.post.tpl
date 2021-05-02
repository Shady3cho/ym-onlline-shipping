{script src="js/addons/ym_shipping/ym_shipping_script.js"}
{include file="common/subheader.tpl" title="Distance Dependancy" meta="clear"}
<div class="table-wrapper">
    <table class="table table-middle table--relative">
        <thead>
        <tr class="cm-first-sibling">
            <th></th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th></th>
            <th></th>
        </tr>
        </thead>
        <tr>
            <td class="nowrap">Store Location (Decimal)</td>
            <td><input id="ym_shipping_latitude" type="text"></td>
            <td><input id="ym_shipping_longitude" type="text"></td>
        </tr>
        <tr>
            <td class="nowrap">Area Center</td>
            <td><input id="ym_shipping_zoom_latitude" type="text"></td>
            <td><input id="ym_shipping_zoom_longitude" type="text"></td>
            <td><span>Zoom Level</span></td>
            <td><input id="ym_shipping_zoom_level" type="text"/></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><span class="btn btn-primary cm-submit btn-primary" id="btn_ym_shipping_save_store_locations" onclick="saveShippingStoreLocations('{$id}')" style="float: right;">Save</span></td>
        </tr>
    </table>
</div>