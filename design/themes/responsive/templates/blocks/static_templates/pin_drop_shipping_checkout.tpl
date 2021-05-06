{script src="js/addons/ym_shipping/ym_shipping_checkout_script.js"}
{style src="addons/pin_drop_shipping/style.css"}
<div class="litecheckout__group">
    <div  class="locApp-col-5">
       <span class="button_Normal" style="border: 1px solid black; border-radius: 5px; color: black; width: 100%; background: transparent" id="btnDelivery" onclick="ymShippingBtnDeliveryClick()">Delivery</span><br>
    </div>
    <div  class="locApp-col-5">
        <span class="button_Normal" style="border-radius: 5px; width: 100%" id="btnPickup" onclick="ymShippingBtnPickupClick()">Pickup From Store.</span><br>
    </div>

</div>
<div style="display: none" id="divYmPickupFrmLocation" class="litecheckout__group">
    <div class="locApp-col-4">
        <select class="litecheckout__input litecheckout__input--selectable litecheckout__input--selectable--select"  style="width: 100%; margin-top: 10px" id="ym_shipping_pickup_locations">
        </select>
    </div>
</div>
<div  id="divYmMapCheckout" class="litecheckout__group">
    <div class="locApp-col-3">
        <div>
            <select class="litecheckout__input litecheckout__input--selectable litecheckout__input--selectable--select"  style="width: 100%; margin-top: 10px" id="ym_shipping_countries">
                <option selected>Botswana</option>
            </select>
        </div>
        <div>
            <select class="litecheckout__input litecheckout__input--selectable litecheckout__input--selectable--select" style="width: 100%; margin-top: 10px"  id="ym_shipping_regions" onchange="ymShippingCheckoutRegionChanged(this)">
            </select>
        </div>
        <div>
            <select class="litecheckout__input litecheckout__input--selectable litecheckout__input--selectable--select" style="width: 100%; margin-top: 10px" id="ym_shipping_cities">
            </select>
        </div>
        <div>
            <input style="border-radius: 5px;width: 100%; margin-top: 10px; white-space: normal; word-wrap: break-word;" id="btnZoomInToLocation" type="button" class="button_Normal" value="Click Here to Zoom into your Current Location" onclick="ymShippingZoomInToCurrentLocation()">
        </div>
        <div  style="margin-top: 12px" class="litecheckout__group">
            <input style="margin-top: 30px; position: absolute"  id="chkYmShippingConfirm" type="checkbox" >
            <label id="lblConfirm" style=" font-size: 16px; margin-left: 20px" for="chkYmShippingConfirm"> I Confirm  that the above shipping information is correct.</label><br>
        </div>
        <div>
            <input type="hidden" id="inpLatitude">
            <input type="hidden" id="inpLongitude">
            <input type="hidden" id="inpCustomerId" value="{$auth.user_id}">
        </div>

    </div>
    <div class="locApp-col-8">
        <div class="map_parent" style="flex-grow: 1">
            <div id="map">
            </div>
            <img src="https://cdn.shopify.com/s/files/1/1693/6143/files/google-maps-pin.svg?504" id="pin" />
        </div>
    </div>
</div>
<div class="litecheckout__group">
    <div class="locApp-col-3">
        <input style=" border-radius: 5px; background : red; width: 100%; margin-top: 10px; white-space: normal; word-wrap: break-word;" id="btnSubmitCustomerData" type="button" class="button_Normal" value="Click Here to Add Your Location Information" onclick="ymShippingUpdateOrAddCustomerInformation()">
    </div>
</div>


