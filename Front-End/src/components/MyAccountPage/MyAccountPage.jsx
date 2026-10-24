import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OrderSummaryClientDetails from "../Shop-Page/OrderSummary/OrderSummaryClientDetails/OrderSummaryClientDetails";
import MessagePopup from "../General/MessagePopup/MessagePopup";
import styles from "./myAccountPage.module.css";
function MyAccountPage() {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  async function getUserDetails() {
    try {
      const response = await fetch("/api/editMyAccount/me", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) setUser(data.user);
    } catch (error) {
      console.error("Error getting user details: ", error);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  function handleSave(updatedUser) {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser,
    }));
    updateUser({
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
    });

    setDisplayMessagePopup({
      show: true,
      message: "Your details have been updated successfully",
      type: "success",
    });
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {user && (
          <OrderSummaryClientDetails
            client={user}
            mode="account"
            onSave={handleSave}
            onBack={() => navigate("/")}
          />
        )}
      </div>

      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          buttonText="OK"
          onClose={() =>
            setDisplayMessagePopup({
              show: false,
              message: "",
              type: "",
            })
          }
        />
      )}
    </main>
  );
}
export default MyAccountPage;
