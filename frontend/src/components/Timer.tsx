import { Play, Square } from "lucide-react"
import { Button } from "./ui/button"

type TimerProps = {
    isRunning: boolean
    elapsed: number
    onStart: () => void
    onStop: () => void
    buttonLabel?: string
}

export default function Timer({ isRunning, elapsed, onStart, onStop, buttonLabel }: TimerProps) {
    function formatTime(ms: number) {
        const totalSeconds = Math.floor(ms / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)  // bounded to 0–59
        const seconds = totalSeconds % 60

        return [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
        ].join(":")
    }

    return (
        <div className="flex gap-4 items-center">
            <Button onClick={isRunning ? onStop : onStart} size="icon-lg" className="rounded-full aspect-square">
                { isRunning ? (
                    <Square />
                ) : (
                    <Play />
                ) }
            </Button>

            <div className="text-xl font-accent">
                {formatTime(elapsed)}
            </div>
        </div>
    )
}
