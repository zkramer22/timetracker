import { motion } from 'framer-motion'
import { useTimer } from '../hooks/useTimer'

export default function Timer() {
    const { isRunning, elapsed, start, stop, reset } = useTimer()

    function formatTime(ms: number) {
        const totalSeconds = Math.floor(ms / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <div className='flex gap-4 items-center'>
            <motion.button 
                onClick={isRunning ? stop : start}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                    backgroundColor: isRunning 
                        ? 'var(--color-inactive)' 
                        : 'var(--color-accent)',
                    color: isRunning
                        ? 'var(--color-text)'
                        : 'var(--color-text)',
                    borderColor: 'var(--color-accent)'
                }}
                className="text-2xl w-16 flex justify-center rounded"
            >
                {isRunning ? 'Stop' : 'Start'}
            </motion.button>

            <div className="text-xl font-accent">
                {formatTime(elapsed)}
            </div>

            <motion.button 
                onClick={reset} 
                whileTap={{scale: .9 }}
                className='bg-inactive text-2xl w-16 flex justify-center rounded'
                style={{ backgroundColor: 'var(--color-inactive)' }}
            >
                Reset    
            </motion.button>
        </div>
    )
}
