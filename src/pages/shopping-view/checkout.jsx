import Address from "@/components/shopping-view/address";
import scannerImg from "../../assets/scanner.jpg"; // Import the scanner image
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateOrderWithScreenshot } from "@/store/admin/order-slice"; // Import the action
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components
import axios from "axios";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [showScanner, setShowScanner] = useState(false); // State to show/hide scanner
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false); // State to show/hide payment success modal
  const [screenshot, setScreenshot] = useState(null); // State to manage the uploaded screenshot
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate(); // Use navigate for redirection

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum + currentItem.quantity * currentItem.price,
          0
        )
      : 0;

  const handleCheckout = async () => {
    try {
      const orderUrl = "http://localhost:5000/api/shop/order/create-razorpay-order";
      const { data } = await axios.post(orderUrl, {
        amount: totalCartAmount,
        currency: "INR",
        receipt: "receipt_order_74394",
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Your Company Name",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: data.id,
        handler: function (response) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
          setShowPaymentSuccess(true);
        },
        prefill: {
          name: "Your Name",
          email: "your_email@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error in creating Razorpay order", error);
    }
  };

  function handlePaymentCompletion() {
    setShowScanner(false);
    setShowPaymentSuccess(true); // Show the payment success modal
  }

  function handleScreenshotUpload(event) {
    const file = event.target.files[0];
    if (file) {
      setScreenshot(URL.createObjectURL(file));
    }
  }

  function handleUpload() {
    // Handle the upload logic here
    console.log("Screenshot uploaded:", screenshot);
    dispatch(updateOrderWithScreenshot({ orderId: "orderId", screenshot })); // Dispatch the action to update the order with the screenshot
    setShowPaymentSuccess(true); // Show the payment success modal
  }

  function handleCloseModal() {
    setShowPaymentSuccess(false);
    navigate("/"); // Redirect to home page
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Address
            currentSelectedAddress={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
          <UserCartItemsContent cartItems={cartItems} />
        </div>
        <div>
          <div className="p-5 border rounded-lg">
            <h2 className="text-2xl font-bold mb-5">Order Summary</h2>
            <p className="text-lg mb-2">Total Amount: ${totalCartAmount}</p>
            <Button onClick={handleCheckout} className="w-full mt-5">
              Checkout with Razorpay
            </Button>
          </div>
          {showScanner && (
            <div className="mt-5 flex flex-col items-center">
              <img
                src={scannerImg}
                alt="Scanner"
                className="w-1/2 h-auto max-w-xs"
                onClick={handlePaymentCompletion} // Simulate payment completion on image click
              />
              <label className="mt-5 text-lg font-semibold">
                Upload the Screenshot
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="mt-2"
              />
              {screenshot && (
                <Button onClick={handleUpload} className="mt-5">
                  Upload Screenshot
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Success Modal */}
      <Dialog open={showPaymentSuccess} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Successful</DialogTitle>
          </DialogHeader>
          <p>Your payment has been successfully processed!</p>
          <Button onClick={handleCloseModal} className="mt-5">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ShoppingCheckout;