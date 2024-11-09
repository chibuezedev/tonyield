import React, { useCallback } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ThemeProvider = ({ children }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="min-h-screen bg-black w-full">
      {/* Top white space */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      />

      {/* Main themed content */}
      <motion.div
        className="relative w-full bg-gradient-to-b from-gray-900 to-black text-white shadow-2xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        {/* Particles Background */}
        <Particles
          className="absolute inset-0"
          init={particlesInit}
          options={{
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />

        {/* Gradient overlays for added depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

        {/* Content container */}
        <motion.div
          className="relative z-10 min-h-[400px] p-8"
          variants={fadeInVariants}
        >
          {/* Glassmorphic decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 filter blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 filter blur-3xl translate-y-32 -translate-x-32" />

          {/* Main content */}
          <div className="relative z-20">{children}</div>
        </motion.div>
      </motion.div>

      {/* Bottom white space */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      />
    </div>
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
