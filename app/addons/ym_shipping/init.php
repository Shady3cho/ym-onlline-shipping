<?php
if ( !defined('AREA') ) { die('Access denied'); }

//hook to the calculate cart content function after shipping is calculated
fn_register_hooks(
    'calculate_cart_taxes_pre',
    'place_order'
);


?>