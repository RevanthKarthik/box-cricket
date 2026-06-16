import { useState } from "react";
import api from "../services/api";

export default function BookingModal({
  slot,
  onClose,
}) {
  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create Booking

      const bookingRes =
        await api.post(
          "/bookings",
          {
            name,
            phone,
            slotId: slot._id,
          }
        );

      const booking =
        bookingRes.data;

      // Create Razorpay Order

      const orderRes =
        await api.post(
          "/payments/create-order",
          {
            bookingId:
              booking._id,
          }
        );
      console.log("ORDER RESPONSE", orderRes.data);
console.log("RAZORPAY", window.Razorpay);
      const order =
        orderRes.data;
      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          order.amount,

        currency:
          order.currency,

        name:
          "RK Box Cricket",

        description:
          "Slot Booking",

        order_id:
          order.id,

        handler:
          async function (
            response
          ) {
            try {
              await api.post(
                "/payments/verify",
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }
              );

              alert(
                "Payment Successful!"
              );

              onClose();

              window.location.reload();
            } catch (error) {
              alert(
                "Payment Verification Failed"
              );
            }
          },

        prefill: {
          name,
          contact:
            phone,
        },

        theme: {
          color:
            "#198754",
        },
      };

      const razorpay =
        
      new window.Razorpay(
          options
        );

      razorpay.open();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Booking Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="modal fade show"
  style={{
    display: "block",
    background:
      "rgba(0,0,0,0.5)",
    zIndex: 11000,
  }}

    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">

            <h5>
              Book Slot
            </h5>

            <button
              className="btn-close"
              onClick={onClose}
            />

          </div>

          <div className="modal-body">

            <p>
              Price:
              <strong>
                ₹{slot.price}
              </strong>
            </p>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="mb-3">

                <label>
                  Name
                </label>

                <input
                  className="form-control"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <label>
                  Mobile
                </label>

                <input
                  className="form-control"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <button
                className="btn btn-success w-100"
                disabled={
                  loading
                }
              >
                {loading
                  ? "Processing..."
                  : "Pay Now"}
              </button>

            </form>

          </div>

        </div>
      </div>
    </div>
  );
}