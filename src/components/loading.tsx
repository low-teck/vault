import React from "react";
import { motion } from "framer-motion";
import { useColorMode } from "@chakra-ui/react";

const loadingContainer = {
    width: "2rem",
    height: "2rem",
    display: "flex",
    justifyContent: "space-around",
};

const loadingCircle = {
    display: "block",
    width: "0.5rem",
    height: "0.5rem",
    backgroundColor: "black",
    borderRadius: "0.25rem",
};

const loadingContainerVariants = {
    start: {
        transition: {
            staggerChildren: 0.2,
        },
    },
    end: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const loadingCircleVariants = {
    start: {
        y: "50%",
    },
    end: {
        y: "150%",
    },
};

const loadingCircleTransition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: "easeInOut",
};

const Loading = () => {
    const { colorMode } = useColorMode();
    return (
        <motion.div
            style={loadingContainer}
            variants={loadingContainerVariants}
            initial="start"
            animate="end"
        >
            <motion.span
                style={{
                    ...loadingCircle,
                    backgroundColor: colorMode === "dark" ? "white" : "black",
                }}
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
            <motion.span
                style={{
                    ...loadingCircle,
                    backgroundColor: colorMode === "dark" ? "white" : "black",
                }}
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
            <motion.span
                style={{
                    ...loadingCircle,
                    backgroundColor: colorMode === "dark" ? "white" : "black",
                }}
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
        </motion.div>
    );
};
export default Loading;
