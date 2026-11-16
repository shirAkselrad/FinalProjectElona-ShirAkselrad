import styles from "./aboutUsPage.module.css";

import Text from "../Text/Text.jsx";
import Sentence from "../Sentence/Sentence.jsx";

function AboutUs() {
  return (
    <section className={styles.aboutUs}>
      <Text />
      <Sentence />
    </section>
  );
}

export default AboutUs;
