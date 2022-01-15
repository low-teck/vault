import React from "react";
import { motion } from "framer-motion";

const RoutingAnimation = ({ children }: { children: JSX.Element }) => {
    return (
        <motion.div
            style={{ overflowX: "hidden", overflowY: "auto" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

export default RoutingAnimation;
