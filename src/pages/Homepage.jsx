import {Link} from "react-router-dom";

import PageNav from "../components/PageNav";

import styles from "./Homepage.module.css";
import bgImage from "../images/bg.jpg";

export default function Homepage() {
  return (
    <main className={styles.homepage} style={{backgroundImage: `linear-gradient(rgba(36, 42, 46, 0.8),rgba(36, 42, 46, 0.8)), url(${bgImage})`}}>
      <PageNav />
      <section>
        <h1>
          You travel the world.
          <br />
          WorldWise keeps track of your adventures.
        </h1>
        <h2>
          A world map that tracks your footsteps into every city you can think
          of. Never forget your wonderful experiences, and show your friends how
          you have wandered the world.
        </h2>
        <Link to='/app' className='cta'> Start tracking now</Link>
      </section>
    </main>
  );
}
