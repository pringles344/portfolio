import { motion } from "framer-motion";

interface AnimatedProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  onClick?: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 40px rgba(0, 217, 255, 0.3)",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const tagVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

export default function AnimatedProjectCard({
  title,
  description,
  tags,
  onClick,
}: AnimatedProjectCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      className="project-card"
      onClick={onClick}
    >
      <div className="project-badge">Current Project</div>
      <div className="project-image">
        <div className="placeholder-grid">
          <div className="tile wall"></div>
          <div className="tile road"></div>
          <div className="tile road"></div>
          <div className="tile car"></div>
          <div className="tile road"></div>
          <div className="tile hydrant"></div>
          <div className="tile wall"></div>
          <div className="tile road"></div>
          <div className="tile wall"></div>
        </div>
      </div>
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        <div className="project-meta">
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              variants={tagVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              className="meta-tag"
            >
              {tag}
            </motion.span>
          ))}
        </div>
        <div className="project-links">
          <a href="#" className="btn btn-outline">
            View on GitHub
          </a>
          <a href="#devlog" className="btn btn-primary">
            Read Dev Log
          </a>
        </div>
      </div>
    </motion.div>
  );
}