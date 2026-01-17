import { OSDesktop } from "./components/os-desktop"
import { CTFGameProvider } from "../ctf/context/game-context"

export default function HiddenDirectory() {
  return (
    <CTFGameProvider>
      <OSDesktop />
    </CTFGameProvider>
  )
}
