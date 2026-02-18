import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { userRequest } from "../requestMethods";
import { clearCart } from "../redux/cartRedux";

const PaystackCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const reference = searchParams.get("reference");

    const run = async () => {
      if (!reference) {
        setStatus("missing_reference");
        toast.error("Missing Paystack reference.");
        navigate("/cart");
        return;
      }

      try {
        const res = await userRequest.get(`/paystack/verify/${reference}`);
        const s = res?.data?.status;

        if (s === "processed" || s === "already_processed") {
          dispatch(clearCart());
          toast.success("Payment successful. Order created.");
          navigate("/myorders");
          return;
        }

        if (s === "not_success") {
          toast.info(
            "Payment not completed yet. If you were charged, please contact support."
          );
          navigate("/cart");
          return;
        }

        toast.info("Payment verification finished.");
        navigate("/myorders");
      } catch (e) {
        const data = e?.response?.data;
        const msg =
          data?.message || data?.error || e?.message || "Verification failed";
        toast.error(msg);
        navigate("/cart");
      } finally {
        setStatus("done");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {status === "verifying" ? "Verifying payment..." : "Finishing up"}
        </h1>
        <p className="text-gray-600">
          Please wait while we confirm your Paystack transaction.
        </p>
      </div>
    </div>
  );
};

export default PaystackCallback;
