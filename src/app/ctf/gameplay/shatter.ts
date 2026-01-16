import { useState, useEffect } from 'react'

export type ShatterState = 'normal' | 'system_failure' | 'shattering' | 'recovering'

export function useShatterMechanic(
    commandNotFoundCount: number, 
    resetGame: () => void
) {
    const [visualState, setVisualState] = useState<ShatterState>('normal')

    // Handle Shatter Trigger
    useEffect(() => {
        if (commandNotFoundCount >= 5 && visualState === 'normal') {
            setTimeout(() => setVisualState('system_failure'), 0)
            
            // Step 1: Show System Failure message for 2 seconds
            setTimeout(() => {
                setVisualState('shattering')
                
                // Step 2: Wait for shatter animation (2s), then reset
                setTimeout(() => {
                    // Reset game state (which should reset commandNotFoundCount)
                    resetGame()
                    setVisualState('recovering')
                    
                    // Step 3: Reboot sequence
                    setTimeout(() => {
                        setVisualState('normal')
                    }, 1000)
                }, 2000)
            }, 2000)
        }
    }, [commandNotFoundCount, visualState, resetGame])

    const isShattered = commandNotFoundCount >= 5 && visualState !== 'normal'

    return {
        visualState,
        setVisualState,
        isShattered
    }
}
