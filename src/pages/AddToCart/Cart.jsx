import React from 'react'
import './Cart.css'

const Cart = () => {
    return (
        <>
            <section className='cart-section'>
                <div className="section pr">
                    <div className="woocommerce">
                    
                        <form
                            className="woocommerce-cart-form"
                            action=""
                            method="post"
                        >
                            <table
                                className="shop_table shop_table_responsive cart woocommerce-cart-form__contents"
                                cellSpacing={0}
                            >
                                <thead>
                                    <tr>
                                        <th className="product-remove">
                                            <span className="screen-reader-text">Remove item</span>
                                        </th>
                                        <th className="product-name">Product</th>
                                        <th className="product-quantity">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="woocommerce-cart-form__cart-item cart_item">
                                        <td className="product-remove">
                                            <a
                                                href=""
                                                className="remove"
                                                aria-label="Remove this item"
                                                data-product_id={5648}
                                                data-product_sku=""
                                                data-wpel-link="internal"
                                            >
                                                ×
                                            </a>{" "}
                                        </td>
                                        <td className="product-name" data-title="Product">
                                            CapstoneCare PREMIUM PLAN - Includes 1 Month Free&nbsp;{" "}
                                        </td>
                                        
                                        <td className="product-quantity" data-title="Quantity">
                                            <div className="quantity">
                                                <label
                                                    className="screen-reader-text"
                                                    htmlFor="quantity_6565dbae50030"
                                                >
                                                    CapstoneCare PREMIUM PLAN - Includes 1 Month Free quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    id="quantity_6565dbae50030"
                                                    className="input-text qty text"
                                                    name="cart[84f2798f05d595273de40e3046329309][qty]"
                                                    defaultValue={2}
                                                    title="Qty"
                                                    size={4}
                                                    min={0}
                                                    max=""
                                                    step={1}
                                                    placeholder=""
                                                    inputMode="numeric"
                                                    autoComplete="off"
                                                    fdprocessedid="03g1re"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={6} className="actions">
                                            <div className="coupon">
                                                <label htmlFor="coupon_code" className="screen-reader-text">
                                                    Customer Code:
                                                </label>{" "}
                                               
                                            </div>
                                            <button
                                                type="submit"
                                                className="button wp-element-button"
                                                name="update_cart"
                                                value="Update cart"
                                                aria-disabled="false"
                                            >
                                                Update cart
                                            </button>
                                            <input
                                                type="hidden"
                                                id="woocommerce-cart-nonce"
                                                name="woocommerce-cart-nonce"
                                                defaultValue="709b42c318"
                                            />
                                            <input
                                                type="hidden"
                                                name="_wp_http_referer"
                                                defaultValue="/cart/"
                                            />{" "}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                        <div className="cart-collaterals">
                            <div className="cart_totals ">
                                <h2>Cart totals</h2>
                                <div className="coupon under-proceed">
                                    <input
                                        type="text"
                                        name="coupon_code"
                                        className="input-text"
                                        id="coupon_code"
                                        defaultValue=""
                                        placeholder="Promotion Code"
                                        style={{ width: "100%" }}
                                        fdprocessedid="rracoe"
                                    />
                                    <button
                                        type="submit"
                                        className="button"
                                        name="apply_coupon"
                                        value="Apply Promo code"
                                        style={{ width: "100%" }}
                                        fdprocessedid="i06jph"
                                    >
                                        Apply Promo code
                                    </button>
                                </div>
                                <table cellSpacing={0} className="shop_table shop_table_responsive">
                                    <tbody>
                                        <tr className="cart-subtotal">
                                            <th>Subtotal</th>
                                            <td data-title="Subtotal">
                                                <span className="woocommerce-Price-amount amount">
                                                    <bdi>
                                                        <span className="woocommerce-Price-currencySymbol">$</span>
                                                        59.90
                                                    </bdi>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="order-total">
                                            <th>Total</th>
                                            <td data-title="Total">
                                                <strong>
                                                    <span className="woocommerce-Price-amount amount">
                                                        <bdi>
                                                            <span className="woocommerce-Price-currencySymbol">$</span>
                                                            59.90
                                                        </bdi>
                                                    </span>
                                                </strong>{" "}
                                            </td>
                                        </tr>
                                       
                                        <form
                                            className="woocommerce-coupon-form"
                                            action=""
                                            method="post"
                                        />
                                    </tbody>
                                </table>
                                <div className="wc-proceed-to-checkout">
                                    <a
                                        href=""
                                        className="checkout-button button alt wc-forward wp-element-button"
                                        data-wpel-link="internal"
                                    >
                                        Proceed to checkout
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

        </>
    )
}

export default Cart
