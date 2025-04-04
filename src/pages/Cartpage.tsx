import { FormEvent, useEffect, useState } from "react";
import { useCustomer } from "../hooks/useCustomer";
import { useCartContext } from "../contexts/CartContext";
import classes from "./Pages.module.css";
import { useStripeHosted } from "../hooks/useStripe";
import { useOrder } from "../hooks/useOrder";

export const Cartpage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartContext();
  const { handleShowOneCustomerEmail, handleCreateCustomer } = useCustomer();
  const { handleCreateOrder, handleUpdateOrder } = useOrder();
  const { handleStripeHosted, loading, error } = useStripeHosted();

  const getStoredCustomer = () => {
    const savedCustomer = localStorage.getItem("customerData");
    return savedCustomer
      ? JSON.parse(savedCustomer)
      : {
          id: 1,
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          street_address: "",
          postal_code: "",
          city: "",
          country: "",
          password: "",
        };
  };


  const [customer, setCustomer] = useState(getStoredCustomer);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  useEffect(() => {
    localStorage.setItem("customerData", JSON.stringify(customer));
  }, [customer]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const checkCustomerExists = async (email: string) => {
    setEmailChecked(false);
    const existingCustomer = await handleShowOneCustomerEmail(email);
  
    if (existingCustomer) {
      setCustomer((prev: any) => ({
        ...prev,
        id: existingCustomer.id,
        firstname: existingCustomer.firstname,
        lastname: existingCustomer.lastname,
        phone: existingCustomer.phone,
        street_address: existingCustomer.street_address,
        postal_code: existingCustomer.postal_code,
        city: existingCustomer.city,
        country: existingCustomer.country,
      }));
      setNeedsPassword(false);
    } else {
      setNeedsPassword(true);
    }
  
    setEmailChecked(true);
    return existingCustomer;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailChecked(false); 
    setNeedsPassword(false); 
  
    let customerDataForStripe: any;
    let customerPayload: any;
    let existingCustomer = null;
  
    if (customer.email) {
      existingCustomer = await checkCustomerExists(customer.email);
  
      if (existingCustomer) {
        customerDataForStripe = {
          id: existingCustomer.id,
          email: existingCustomer.email,
          street_address: existingCustomer.street_address,
          postal_code: existingCustomer.postal_code,
          city: existingCustomer.city,
          country: existingCustomer.country, 
        };
      } else {
        if (!customer.password) {
          return;
        }
  
        customerPayload = {
          firstname: customer.firstname,
          lastname: customer.lastname,
          email: customer.email,
          password: customer.password,
          phone: customer.phone,
          street_address: customer.street_address,
          postal_code: customer.postal_code,
          city: customer.city,
          country: customer.country,
        };
        
        try {
          const newCustomer = await handleCreateCustomer(customerPayload);
          if (newCustomer) {
            setCustomer((prev: any) => ({
              ...prev,
              id: newCustomer.id,
              email: newCustomer.email,
            }));
  
            customerDataForStripe = {
              id: newCustomer.id,
              email: newCustomer.email,
            };
          }
        } catch (error) {
          console.error("Error creating customer:", error);
          return;
        }
      }

      
      const lineItems = cart.map((item) => ({
        price_data: {
          currency: "SEK",
          product_data: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            images: [item.product.image],
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      }));

      const orderDetails = {
        customer_id: customer?.id || existingCustomer?.id,
        payment_status: "Unpaid",
        order_status: "Pending",
        total_price: totalPrice,
        payment_id: "",
        order_items: cart.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
      };


      const orderResponse = await handleCreateOrder(orderDetails);
      if (!orderResponse.order_id) {
        console.error("Failed to create order.");
        return;
      }

      console.log("Order created successfully:", orderResponse);

      try {
        const stripeSession = await handleStripeHosted(lineItems, customerDataForStripe);
        const updateOrder = {
          payment_status: "Unpaid",
          order_status: "Pending",
          payment_id: stripeSession.sessionId,
        }
        if (stripeSession?.sessionId) {
          await handleUpdateOrder(orderResponse.order_id, updateOrder);
        }

      } catch (err) {
        console.error("Error creating Stripe session:", err);
      };
    }
  };

  

  return (
    <div className={classes.cartPage}>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className={classes.cartList}>
            {cart.map((item) => (
              <div key={item.product.id} className={classes.cartItem}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className={classes.cartImage}
                />
                <div className={classes.cartDetails}>
                  <h2>{item.product.name}</h2>
                  <p>{item.product.description}</p>
                  <p className={classes.price}>
                    ${item.product.price.toFixed(2)}
                  </p>
                  <div className={classes.quantityControl}>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                      }
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={classes.removeButton}
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={classes.cartSummary}>
            <h2>Total: ${totalPrice.toFixed(2)}</h2>
            <button className={classes.clearCart} onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          <form onSubmit={handleSubmit} className={classes.customerForm}>
            <h3>Customer Information</h3>
            <input
              type="text"
              placeholder="First Name"
              required
              value={customer.firstname}
              onChange={(e) =>
                setCustomer({ ...customer, firstname: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              required
              value={customer.lastname}
              onChange={(e) =>
                setCustomer({ ...customer, lastname: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={customer.email}
              onChange={(e) => {
                const email = e.target.value;
                setCustomer({ ...customer, email });
                checkCustomerExists(email); // Run check whenever the email changes
              }}
            />

            {emailChecked && needsPassword && (
              <div className={classes.newCustomerNotice}>
                <p>
                  <strong>Welcome! It looks like you’re new here.</strong> Create an
                  account to proceed with your purchase.
                </p>
                <input
                  type="password"
                  placeholder="Create Password"
                  required
                  onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                />
              </div>
            )}

            <input
              type="text"
              placeholder="Phone Number"
              required
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Street Address"
              required
              value={customer.street_address}
              onChange={(e) =>
                setCustomer({ ...customer, street_address: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Postal Code"
              required
              value={customer.postal_code}
              onChange={(e) =>
                setCustomer({ ...customer, postal_code: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="City"
              required
              value={customer.city}
              onChange={(e) =>
                setCustomer({ ...customer, city: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Country"
              required
              value={customer.country}
              onChange={(e) =>
                setCustomer({ ...customer, country: e.target.value })
              }
            />

            {error && <p className={classes.errorMessage}>{error}</p>}
            <button className={classes.checkout} disabled={loading}>
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};