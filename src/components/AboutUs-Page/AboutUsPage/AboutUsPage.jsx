import styles from "./aboutUsPage.module.css";

import Text from "../Text/Text.jsx";
import ElonaPhoto from "../Elona/Elona.jsx";
import Sentence from "../Sentence/Sentence.jsx";

function AboutUs() {
  return (
    <section className={styles.aboutUs}>
      <div className={styles.main}>
        <Text />
        <Elona />
      </div>

      <Sentence />
    </section>
  );
}

export default AboutUs;
