import styles from "./aboutUs.module.css";
import { Link } from "react-router-dom";
function AboutUs() {
  return (
    <Link className={styles.aboutUs} to="/aboutUs">
      About Us
    </Link>
  );
}

export default AboutUs;
