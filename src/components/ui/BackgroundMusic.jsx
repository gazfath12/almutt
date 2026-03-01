import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // TIPS: Masukkan file musik (.mp3) ke folder 'public' lalu ganti URL di bawah 
        // Contoh: new Audio("/musik-kita.mp3") 
        const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/10/25/audio_22026af24e.mp3?filename=ambient-piano-and-strings-10711.mp3");
        audio.loop = true;
        audio.volume = 0.3;
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Browser policies often require user interaction before playing audio
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={togglePlay}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-bg-darker/80 border border-glass-border backdrop-blur-md hover:border-neon-blue hover:text-neon-blue transition-colors group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            title={isPlaying ? "Mute Music" : "Play Background Ambient"}
        >
            {isPlaying ? (
                <Volume2 size={24} className="text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
            ) : (
                <VolumeX size={24} className="text-text-secondary group-hover:text-white" />
            )}
        </motion.button>
    );
}
