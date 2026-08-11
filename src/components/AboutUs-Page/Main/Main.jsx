import styles from "./main.module.css";

import Text from "../Text/Text.jsx";
import Elona from "../Elona/Elona.jsx";
import Sentence from "../Sentence/Sentence.jsx";

function Main() {
  return (
    <main className={styles.main}>
      <div className={styles.topContent}>
        <Text />
        <Elona />
      </div>

      <Sentence />
    </main>
  );
}

export default Main;
