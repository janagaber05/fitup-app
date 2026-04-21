import { motion } from "framer-motion";

const DEFAULT_STEPS = [
  "Stand 1 meter away from the machine.",
  "Point your camera toward the equipment marker.",
  "Follow the highlighted movement path.",
];

function TutorialPanel({ title = "AR Tutorial", steps = DEFAULT_STEPS }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        borderRadius: 16,
        background: "#1e1e1e",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 14,
        color: "#f4f5f7",
      }}
    >
      <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>{title}</h3>
      <ol style={{ margin: 0, paddingLeft: 18, color: "#aab0ba", fontSize: 13, lineHeight: 1.55 }}>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </motion.section>
  );
}

export default TutorialPanel;
