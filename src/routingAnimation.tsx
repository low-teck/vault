import React from "react";
import { motion } from "framer-motion";

const RoutingAnimation = ({ children }: { children: JSX.Element }) => {
    return (
        <motion.div
            style={{ overflowX: "hidden", overflowY: "auto" }}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -200, scale: 0.8 }}
            transition={{ duration: 0.4 }}
        >
            {children}
        </motion.div>
    );
};

export default RoutingAnimation;
