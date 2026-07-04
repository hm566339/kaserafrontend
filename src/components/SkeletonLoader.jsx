import { motion } from "framer-motion";

export function SkeletonLoader({ count = 5, height = "h-10" }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          className={`${height} rounded-lg bg-slate-200`}
        />
      ))}
    </div>
  );
}
