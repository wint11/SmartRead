import { useState, useEffect, useRef } from 'react'

export type BombState = {
    active: boolean
    timeLeft: number
    exploded: boolean
}

const INITIAL_BOMB_STATE: BombState = {
    active: false,
    timeLeft: 0,
    exploded: false
}

export function useBombMechanic() {
    const [bombState, setBombState] = useState<BombState>(INITIAL_BOMB_STATE)
    const isInitialized = useRef(false)

    // Load saved state
    useEffect(() => {
        if (isInitialized.current) return
        isInitialized.current = true

        const savedBomb = localStorage.getItem('ctf_bomb_state')
        if (savedBomb) {
            try {
                const parsed = JSON.parse(savedBomb)
                if (parsed.exploded) {
                    setBombState(parsed)
                } else if (parsed.active && parsed.timeLeft > 0) {
                    setBombState(parsed)
                }
            } catch (e) {
                console.error("Failed to parse bomb state", e)
            }
        }
    }, [])

    // Bomb Timer
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (bombState.active && !bombState.exploded && bombState.timeLeft > 0) {
            interval = setInterval(() => {
                setBombState(prev => {
                    if (prev.timeLeft <= 1) {
                        const newState = { ...prev, timeLeft: 0, exploded: true }
                        localStorage.setItem('ctf_bomb_state', JSON.stringify(newState))
                        return newState
                    }
                    const newState = { ...prev, timeLeft: prev.timeLeft - 1 }
                    localStorage.setItem('ctf_bomb_state', JSON.stringify(newState))
                    return newState
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [bombState.active, bombState.exploded, bombState.timeLeft])

    const triggerBomb = (addToHistory: (type: 'output', content: string) => void) => {
        if (!bombState.active) {
            addToHistory('output', "[WARNING] UNAUTHORIZED ACCESS DETECTED.")
            addToHistory('output', "[WARNING] SELF-DESTRUCT SEQUENCE INITIATED.")
            setBombState({ active: true, timeLeft: 7200, exploded: false }) 
        } else {
            addToHistory('output', "[CRITICAL] INCORRECT CODE. ACCELERATING DETONATION.")
            setBombState(prev => {
                const newTime = Math.max(0, prev.timeLeft - 300) // Deduct 5 minutes
                if (newTime <= 0) {
                    const newState = { ...prev, timeLeft: 0, exploded: true }
                    localStorage.setItem('ctf_bomb_state', JSON.stringify(newState))
                    return newState
                }
                const updatedState = { ...prev, timeLeft: newTime }
                localStorage.setItem('ctf_bomb_state', JSON.stringify(updatedState))
                return updatedState
            })
        }
    }

    const defuseBomb = (addToHistory: (type: 'output', content: string) => void) => {
        if (bombState.active) {
            setBombState(prev => ({ ...prev, active: false }))
            localStorage.removeItem('ctf_bomb_state')
            addToHistory('output', "[SYSTEM] Threat level reduced. Countermeasures deactivated.")
        }
    }

    const resetBomb = () => {
        setBombState(INITIAL_BOMB_STATE)
        localStorage.removeItem('ctf_bomb_state')
    }

    return {
        bombState,
        setBombState,
        triggerBomb,
        defuseBomb,
        resetBomb
    }
}
