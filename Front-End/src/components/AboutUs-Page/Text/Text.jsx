import styles from "./text.module.css";
import elonaPhoto from "../../../assets/Photo-Elona.png";

function Text() {
  return (
    <main className={styles.aboutPage}>
      <section className={styles.content}>
        <p className={styles.eyebrow}>THE STORY BEHIND ELONA</p>

        <h1 className={styles.title}>The Woman Behind ELONA</h1>

        <div className={styles.topDivider}></div>

        <div className={styles.heroRow}>
          <figure className={styles.imageBlock}>
            <div className={styles.imageFrame}>
              <img
                src={elonaPhoto}
                alt="Elona (Lea) Weiss"
                className={styles.image}
              />
            </div>
          </figure>

          <div className={styles.introBlock}>
            <div className={styles.introInner}>
              <h2 className={styles.name}>Elona (Lea) Weiss</h2>

              <p className={styles.years}>1927 – 2021</p>

              <p className={styles.shortDescription}>
                A story of love, loss, survival, and an extraordinary strength
                of spirit.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.story}>
          <p className={styles.text}>
            Elona was born in January 1927 in Czechoslovakia, into a religious
            Jewish family. She spent her childhood alongside her younger sister
            and brother. From an early age, she was always the one to take
            responsibility and help in any way she could.
          </p>

          <p className={styles.text}>
            She met the love of her life before the Holocaust. The two fell in
            love, but their love, their reality, and the innocence of their
            smiles were torn apart by the Nazis.
          </p>

          <p className={styles.text}>
            In March 1944, the Nazis deported Elona and her family to the
            Auschwitz concentration camp.
          </p>

          <div className={styles.testimony}>
            <p className={styles.quote}>
              "I have no idea how it happened. Someone pushed me (out of the
              train car), and when I looked back, I realized I was alone. My
              mother, my sister, and my brother had disappeared in the blink of
              an eye. Suddenly, I felt fear and helplessness overcome me. I was
              left alone. Just me and my thoughts."
            </p>

            <p className={styles.source}>
              FROM "THE GREATNESS OF A WOMAN – THE STORY OF LEA ROSENBLUM-WEISS"
              <br />
              WRITTEN BY SHARON WEINSTEIN
            </p>
          </div>

          <p className={styles.text}>
            Elona survived Auschwitz, where she was forced to dig mass graves.
            At the end of the war, she marched alongside thousands of other Jews
            in a death march.
          </p>

          <p className={styles.text}>
            After the war, she was reunited with her one true love, Hirsch (Zvi)
            Weiss.
          </p>

          <p className={styles.text}>
            The two married, started a family, immigrated to the Land of Israel,
            were deported, and then immigrated to Israel once again.
          </p>

          <p className={styles.text}>
            Upon her arrival in Israel, Elona's name was changed to Lea.
          </p>

          <p className={styles.text}>
            In December 1976, Hirsch (Zvi) Weiss passed away from cancer,
            leaving Elona a widow. No other man ever captured her heart, and she
            remained faithful to him until the day she died.
          </p>

          <p className={styles.text}>Elona passed away on May 27, 2021.</p>

          <p className={styles.text}>
            One of the things that always characterized Elona was the brooches
            she wore on her clothes. They were an inseparable part of her
            appearance and personal style.
          </p>

          <p className={styles.text}>
            Today, those brooches hold a special meaning in ELONA, serving as a
            reminder of the woman who inspired it all.
          </p>

          <p className={styles.closing}>
            The strength of her heart, her captivating smile, her humility, and
            her ability to choose to wake up every morning and face a new day,
            despite all the horrors inflicted by the Nazis, are what truly
            define a strong woman to us.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Text;
