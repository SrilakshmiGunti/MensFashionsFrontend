import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "@/store/admin/order-slice";
import { Form } from "../ui/form";

function AdminOrderDetailsView({ orderDetails }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    orderStatus: orderDetails?.orderStatus || "",
  });

  useEffect(() => {
    setFormData({
      orderStatus: orderDetails?.orderStatus || "",
    });
  }, [orderDetails]);

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    dispatch(updateOrderStatus({ id: orderDetails._id, orderStatus: formData.orderStatus }));
  };

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {orderDetails._id}</p>
      <p>User ID: {orderDetails.userId}</p>
      <p>Cart ID: {orderDetails.cartId}</p>
      <p>Order Status: {orderDetails.orderStatus}</p>
      <p>Total Amount: ${orderDetails.totalAmount}</p>
      <p>Order Date: {orderDetails.orderDate ? orderDetails.orderDate.split("T")[0] : "N/A"}</p>
      <div>
        <Form
          fields={[
            {
              name: "orderStatus",
              label: "Order Status",
              componentType: "select",
              options: [
                { id: "pending", label: "Pending" },
                { id: "inProcess", label: "In Process" },
                { id: "inShipping", label: "In Shipping" },
                { id: "delivered", label: "Delivered" },
                { id: "rejected", label: "Rejected" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText={"Update Order Status"}
          onSubmit={handleUpdateStatus}
        />
      </div>
    </div>
  );
}

export default AdminOrderDetailsView;