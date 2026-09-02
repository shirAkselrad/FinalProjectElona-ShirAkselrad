import styles from "./text.module.css";

function Text() {
  return (
    <main className={styles.aboutPage}>
      <section className={styles.content}>
        <h1 className={styles.title}>ABOUT US</h1>

        <div className={styles.diamond}></div>

        <p className={styles.memory}>IN LOVING MEMORY - 1924 - 2021</p>

        <h2 className={styles.subtitle}>
          In honor to
          <br />
          <span>Lea (Elona) Weiss</span>
        </h2>

        <p className={styles.text}>
          Lea survived the unsurvivable. As a prisoner in Auschwitz, she endured
          horrors that words cannot fully hold — and yet she emerged with her
          spirit unbroken, her dignity intact, and her will to live fiercer than
          ever.
        </p>

        <p className={styles.text}>
          After the war, she and her husband made their way illegally to Israel
          — a journey of courage, hope, and an unyielding belief in a better
          life. She built a home, a family, and a legacy from nothing, carrying
          her past not as a wound but as a source of profound strength.
        </p>

        <p className={styles.text}>
          Lea passed away in 2021, but her story lives on in every woman who
          chooses to stand tall. ELONA is our tribute to her — a reminder that
          true elegance is born not from ease, but from endurance.
        </p>
      </section>
    </main>
  );
}

export default Text;
