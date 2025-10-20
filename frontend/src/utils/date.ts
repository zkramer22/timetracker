export function parseDateString(str: string | null | undefined): Date | null {
    if (!str || typeof str !== 'string') return null
    const [year, month, day] = str.split('-').map(Number)
    return new Date(year, month - 1, day) // interpreted as local time
}

export function formatDateToDisplay(str: string | null | undefined): string {
    if (!str || typeof str !== 'string') return ''
    const [year, month, day] = str.split('-').map(Number)
    const date = new Date(year, month - 1, day) // local midnight
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    })
}

export function getISODate(date: Date | string | null | undefined): string | null {
    if (!(date instanceof Date)) return typeof date === 'string' ? date : null
    return date.toISOString().slice(0, 10)
}

export function formatDateTimeForHistory(
    isoString: string | null | undefined
): { date: string; time: string } {
    if (!isoString || typeof isoString !== 'string') return { date: '', time: '' }

    const dateObj = new Date(isoString)

    return {
        date: dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }),
        time: dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        }),
    }
}

export function formatDateTimePretty(date: Date | string | null | undefined): string {
    if (!date) return ''

    const d = date instanceof Date ? date : new Date(date)

    const formattedDate = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    })

    const formattedTime = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    })

    return `${formattedDate} @ ${formattedTime}`
}

export function formatDateRange(start: Date, end: Date): string {
    const sameDay =
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate()

    const startStr = formatDateTimePretty(start)
    const endStr = sameDay
        ? end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : formatDateTimePretty(end)

    return `${startStr} → ${endStr}`
}

export function formatDuration(start: Date, end: Date): string {
    const ms = end.getTime() - start.getTime()
    if (ms <= 0) return '0min'

    const totalMinutes = Math.floor(ms / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0 && minutes > 0) return `${hours}hr ${minutes}min`
    if (hours > 0) return `${hours}hr`
    return `${minutes}min`
}