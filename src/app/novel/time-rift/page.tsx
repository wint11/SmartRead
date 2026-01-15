
import { Metadata } from "next"
import { TimeRiftClient } from "./time-rift-client"

export const metadata: Metadata = {
  title: "Chronos Scraper | SmartRead",
  description: "Navigate the entropy fog to find the lost timeline.",
}

export default function TimeRiftPage() {
  return <TimeRiftClient />
}
