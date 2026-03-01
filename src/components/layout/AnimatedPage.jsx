import { motion } from 'framer-motion';

export default function AnimatedPage({ children, className = '' }) {
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`min-h-screen pt-24 pb-12 ${className}`}
        >
            {children}
        </motion.main>
    );
}
