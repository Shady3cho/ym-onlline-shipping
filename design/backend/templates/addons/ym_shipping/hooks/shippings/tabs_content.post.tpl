{script src="js/addons/ym_shipping/pickup_points.js"}
<div style="margin-bottom: 30px">
    {include file="common/subheader.tpl" title="Pickup Points" meta="clear"}
    <div class="table-wrapper">
        <table class="table table-middle table--relative">
            <thead>
            <tr class="cm-first-sibling">
                <th>City</th>
                <th>Name</th>
                <th>Fixed Rate</th>
                <th></th>
            </tr>
            </thead>
            <tbody id="tbody_pickup_locations"></tbody>
        </table>
    </div>
    <div>
    <span class="btn btn-primary cm-submit btn-primary" id="btn_ym_shipping_save_store_locations" onclick="ym_shipping_save_pickup_locations()" style="float: right;margin-bottom: 30px;">Save</span>
    </div>
    <div>
    <span class="btn btn-primary cm-submit btn-primary" id="btn_ym_shipping_save_store_locations" onclick="ym_shipping_add_pickup_location()" style="float: right;margin-bottom: 30px;margin-right: 30px;">Add</span>
    </div>
</div>