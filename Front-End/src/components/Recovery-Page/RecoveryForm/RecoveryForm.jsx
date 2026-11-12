import styles from "./recoveryForm.module.css";
import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import RecoveryCodeInput from "../RecoveryCodeInput/RecoveryCodeInput.jsx";
import RecoveryTimer from "../RecoveryTimer/RecoveryTimer.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { validateRecoveryCode } from "./recoveryValidation.js";

function RecoveryForm() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  //This state is for the popup message after an attempt to login
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const isFormValid = validateRecoveryCode(code) === "";

  const handleTimerExpire = useCallback(() => {
    setIsExpired(true);
  }, []);

  //gets the expiration time from the server
  useEffect(() => {
    async function getRecoveryStatus() {
      try {
        const response = await fetch("/api/recoveryPage/status");
        const data = await response.json();

        if (data.success) {
          setExpiresAt(data.expiresAt);
          setIsExpired(Date.now() >= data.expiresAt);
        } else {
          setDisplayMessagePopup({
            show: true,
            message: data.message || "Recovery process not found",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error loading recovery timer:", error);

        setDisplayMessagePopup({
          show: true,
          message: "Couldn't load the recovery timer",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }

    getRecoveryStatus();
  }, []);
  //The function send to backend the recovery code which has been entered by the user
  async function recoveryCode(code) {
    try {
      const response = await fetch("/api/recoveryPage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Server error",
      };
    }
  }

  //updates the recovery code input
  function handleChange(value) {
    setCode(value);
    setError("");
  }
  //submis the recovery code
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid || isSubmitting || isLoading || isExpired || !expiresAt)
      return;

    setIsSubmitting(true);

    try {
      const data = await recoveryCode(code);

      if (data.success) {
        navigate("/ResetPasswordPage");
      } else {
        setDisplayMessagePopup({
          show: true,
          message: data.message || "Incorrect recovery code",
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  //requests a new code after expiration
  async function handleResendCode() {
    if (!expiresAt || !isExpired || isResending) return;
    setIsResending(true);
    try {
      const response = await fetch("/api/forgotPassword/resend", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setExpiresAt(data.expiresAt);
        setIsExpired(false);
        setCode("");
        setError("");
      }

      setDisplayMessagePopup({
        show: true,
        message: data.message || "Couldn't resend recovery code",
        type: data.success ? "success" : "error",
      });
    } catch (error) {
      setDisplayMessagePopup({
        show: true,
        message: "Couldn't connect to the server",
        type: "error",
      });
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className={styles.recoveryForm}>
      <div className={styles.back}>
        <BackLink path="/ForgotPasswordPage" text="BACK" />
      </div>

      <PageIntro
        title="Verify your email."
        description="Enter the 6-digit code we sent to your email."
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <RecoveryCodeInput
          value={code}
          onChange={handleChange}
          onBlur={() => {
            if (code) setError(validateRecoveryCode(code));
          }}
          error={error}
        />

        {isLoading ? (
          <p className={styles.loading}>Loading timer...</p>
        ) : (
          expiresAt && (
            <RecoveryTimer expiresAt={expiresAt} onExpire={handleTimerExpire} />
          )
        )}

        <div className={styles.verify}>
          <GeneralBtn
            text={isSubmitting ? "VERIFYING..." : "VERIFY"}
            disabled={
              !isFormValid ||
              isSubmitting ||
              isLoading ||
              isExpired ||
              !expiresAt
            }
          />
        </div>
      </form>

      {isExpired && expiresAt && (
        <button
          type="button"
          className={styles.resend}
          onClick={handleResendCode}
          disabled={isResending}
        >
          {isResending ? "SENDING..." : "RESEND CODE"}
        </button>
      )}

      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={() =>
            setDisplayMessagePopup({
              show: false,
              message: "",
              type: "",
            })
          }
        />
      )}
    </div>
  );
}

export default RecoveryForm;
