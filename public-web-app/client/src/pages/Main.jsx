import React from "react";
import { motion } from "framer-motion";

// Components
import Navbar from "../components/main/Navbar";
import Hero from "../components/main/Hero";
import RealTimeFloodAnalysis from "../components/main/RealTimeFloodAnalysis";
import FloodImpactPrediction from "../components/main/FloodImpactPrediction";
import Services from "../components/main/Services";
import AboutUs from "../components/main/AboutUs";
import Contact from "../components/main/Contact";

function Main() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.25,
                when: "beforeChildren"
            } 
        },
    };
    
    const itemVariants = { 
        hidden: { opacity: 0, y: 20 }, 
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        } 
    };

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Navbar />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <Hero />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <RealTimeFloodAnalysis />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <FloodImpactPrediction />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <Services />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <AboutUs />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <Contact />
            </motion.div>
        </motion.main>
    );
}

export default Main;