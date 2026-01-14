import { useState, useEffect, useRef } from 'react'

export function useBootMechanic(
    addToHistory: (type: 'output' | 'input', content: string) => void,
    onBootComplete: () => void
) {
    const [isBooting, setIsBooting] = useState(true)
    const hasBooted = useRef(false)

    useEffect(() => {
        if (hasBooted.current) return
        hasBooted.current = true

        const bootSequence = [
            { text: "Initializing BIOS...", delay: 200 },
            { text: "Checking Memory... 64GB", delay: 2500 },
            { text: "Loading Kernel Modules...", delay: 2900 },
            { text: "Mounting Virtual Filesystem...", delay: 3400 },
            { text: "Verifying Security Protocols...", delay: 3800 },
            { text: "Establishing Secure Connection...", delay: 4300 },
            { text: "SmartRead Secure Terminal v2.0", delay: 4800 },
        ]

        let maxDelay = 0

        bootSequence.forEach(({ text, delay }) => {
            if (delay > maxDelay) maxDelay = delay
            setTimeout(() => {
                addToHistory('output', text)
            }, delay)
        })

        setTimeout(() => {
            setIsBooting(false)
            onBootComplete()
        }, maxDelay + 500)

    }, [])

    return { isBooting }
}
