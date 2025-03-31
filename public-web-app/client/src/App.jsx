import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RealTimeFloodAnalysis from "./components/RealTimeFloodAnalysis";
import FloodImpactPrediction from "./components/FloodImpactPrediction";
import Services from "./components/Services";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import { motion } from "framer-motion";

function App() {
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.25 } },
  };

  const gridSquareVariants = { hidden: { opacity: 0 }, show: { opacity: 1 } };
  return (
    <>
      <motion.section
        variants={gridContainerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={gridSquareVariants}>
          <Navbar />
        </motion.div>
        <motion.div variants={gridSquareVariants}>
          <Hero />
        </motion.div>
        <motion.div variants={gridSquareVariants}>
          <RealTimeFloodAnalysis />
        </motion.div>
        <motion.div variants={gridSquareVariants}>
          <FloodImpactPrediction />
        </motion.div>

        <motion.div variants={gridSquareVariants}>
          <Services />
        </motion.div>
        <motion.div variants={gridSquareVariants}>
          <AboutUs />
        </motion.div>
        <motion.div variants={gridSquareVariants}>
          <Contact />
        </motion.div>
      </motion.section>
    </>
  );
}

export default App;
