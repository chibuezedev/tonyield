import React from "react";
import { motion } from "framer-motion";

const ThemeProvider = ({ children }) => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-violet-900 to-black text-white"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2232%22%20height%3D%2232%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.3%22%20/%3E%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%220.5%22%20fill%3D%22white%22%20fill-opacity%3D%220.2%22%20/%3E%3Ccircle%20cx%3D%220%22%20cy%3D%2232%22%20r%3D%220.5%22%20fill%3D%22white%22%20fill-opacity%3D%220.2%22%20/%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%220%22%20r%3D%220.5%22%20fill%3D%22white%22%20fill-opacity%3D%220.2%22%20/%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%220.5%22%20fill%3D%22white%22%20fill-opacity%3D%220.2%22%20/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20fill%3D%22url(%23grid)%22%20/%3E%3C/svg%3E') bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <motion.div className="relative z-10" variants={fadeInVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export default ThemeProvider;
