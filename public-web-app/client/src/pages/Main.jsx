import React from "react";
import { motion } from "framer-motion";

//components
import Navbar from "../components/main/Navbar";
import Hero from "../components/main/Hero";
import RealTimeFloodAnalysis from "../components/main/RealTimeFloodAnalysis";
import FloodImpactPrediction from "../components/main/FloodImpactPrediction";
import Services from "../components/main/Services";
import AboutUs from "../components/main/AboutUs";
import Contact from "../components/main/Contact";


function Main() {
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
export default Main;