"use client"

import { useState } from "react"
import { AppProps } from "../types"
import { ArrowLeft, ArrowRight, RefreshCw, Home, Search } from "lucide-react"

  // Whitelisted Sites & Mock Renderers
  // Defined OUTSIDE the render cycle to prevent focus loss
  const CernWebsite = ({ onNavigate }: { onNavigate: (url: string) => void }) => (
    <div className="p-8 font-serif max-w-4xl mx-auto bg-white min-h-full pb-20">
        <h1 className="text-4xl font-bold mb-6">World Wide Web</h1>
        <p className="mb-4 text-lg">
            The WorldWideWeb (W3) is a wide-area <a href="#" className="text-blue-800 underline">hypermedia</a> information retrieval initiative aiming to give universal access to a large universe of documents.
        </p>
        <p className="mb-4">
            Everything there is online about W3 is linked directly or indirectly to this document, including an <a href="#" className="text-blue-800 underline">executive summary</a> of the project, <a href="#" className="text-blue-800 underline">Mailing lists</a>, <a href="#" className="text-blue-800 underline">Policy</a>, November's <a href="#" className="text-blue-800 underline">W3 news</a>, <a href="#" className="text-blue-800 underline">Frequently Asked Questions</a>.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">What's out there?</h2>
        <ul className="list-disc pl-8 space-y-2">
            <li><a href="#" className="text-blue-800 underline">Pointers to the world's online information</a>, <a href="#" className="text-blue-800 underline">subjects</a>, <a href="#" className="text-blue-800 underline">W3 servers</a>, etc.</li>
            <li><a href="#" className="text-blue-800 underline">Help</a> on the browser you are using</li>
            <li><a href="#" className="text-blue-800 underline">Software Products</a> A list of W3 project components and their current state. (e.g. <a href="#" className="text-blue-800 underline">Line Mode</a> ,X11 <a href="#" className="text-blue-800 underline">Viola</a> , <a href="#" className="text-blue-800 underline">NeXTStep</a> , <a href="#" className="text-blue-800 underline">Servers</a> , <a href="#" className="text-blue-800 underline">Tools</a> , <a href="#" className="text-blue-800 underline">Mail robot</a> , <a href="#" className="text-blue-800 underline">Library</a> )</li>
            <li><a href="#" className="text-blue-800 underline">Technical</a> Details of protocols, formats, program internals etc</li>
            <li><a href="#" className="text-blue-800 underline">Bibliography</a> Paper documentation on W3 and references.</li>
            <li><a href="#" className="text-blue-800 underline">People</a> A list of some people involved in the project.</li>
            <li><a href="#" className="text-blue-800 underline">History</a> A summary of the history of the project.</li>
            <li><a href="#" className="text-blue-800 underline">How can I help?</a> If you would like to support the web..</li>
            <li><a href="#" className="text-blue-800 underline">Getting code</a> Getting the code by <a href="#" className="text-blue-800 underline">anonymous FTP</a>, etc.</li>
        </ul>

        {/* Hidden Flag Link - appears as a period */}
        <div className="mt-20 pt-10 border-t text-xs text-gray-500 relative group h-20">
             CERN - European Organization for Nuclear Research
             <span 
                className="inline-flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300 text-red-500 font-bold text-base align-middle ml-1" 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Hidden point clicked!"); // Debug
                    onNavigate("http://info.cern.ch/secret_dev_notes.txt");
                }}
                title="Nothing to see here..."
             >.</span>
        </div>
    </div>
  )

  const CernSecretPage = ({ onNavigate }: { onNavigate: (url: string) => void }) => (
      <div className="p-8 font-mono bg-black text-green-500 min-h-full">
          <h1 className="text-xl mb-4">CONFIDENTIAL DEVELOPMENT NOTES (1991)</h1>
          <p className="mb-2">To: Tim</p>
          <p className="mb-4">From: [REDACTED]</p>
          <div className="border border-green-700 p-4 mb-4">
              <p>We need to secure the new HTTP protocol. Plain text transmission is risky.</p>
              <p>Also, I found a weird string in the server logs:</p>
              <br/>
              <p className="font-bold">flag&#123;web_pioneer_tim_bl&#125;</p>
              <br/>
              <p>What does it mean?</p>
          </div>
          <button onClick={() => onNavigate("http://info.cern.ch")} className="text-blue-400 hover:underline">&lt; Back to public site</button>
      </div>
  )

  const YahooWebsite = ({ onNavigate }: { onNavigate: (url: string) => void }) => (
    <div className="p-4 font-serif bg-white min-h-full">
        <div className="text-center mb-4">
            <h1 className="text-5xl font-bold text-red-600 mb-2 tracking-widest">Yahoo!</h1>
            <p className="text-xs mb-2">- A Guide to WWW -</p>
            <div className="border border-black p-1 inline-block bg-gray-200 shadow-lg">
                <input type="text" className="border border-gray-400 px-1" size={30} />
                <button className="ml-2 border border-gray-400 px-2 bg-gray-300 text-sm hover:bg-gray-400">Search</button>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm max-w-2xl mx-auto mt-8">
            <ul className="list-disc pl-5 space-y-2">
                <li><a href="#" className="text-blue-800 font-bold underline">Arts</a> <br/><span className="text-xs text-gray-600">Humanities, Photography, Architecture</span></li>
                <li><a href="#" className="text-blue-800 font-bold underline">Business</a> <br/><span className="text-xs text-gray-600">Economy, Investing, Companies</span></li>
                <li><a href="#" className="text-blue-800 font-bold underline">Computers</a> <br/><span className="text-xs text-gray-600">Internet, WWW, Software, Multimedia</span></li>
            </ul>
            <ul className="list-disc pl-5 space-y-2">
                <li><a href="#" className="text-blue-800 font-bold underline">News</a> <br/><span className="text-xs text-gray-600">X-Files, O.J. Simpson, Daily</span></li>
                <li><a href="#" className="text-blue-800 font-bold underline">Recreation</a> <br/><span className="text-xs text-gray-600">Sports, Games, Travel, Autos</span></li>
                <li><a href="#" className="text-blue-800 font-bold underline">Society</a> <br/><span className="text-xs text-gray-600">Culture, Environment, Religion</span></li>
            </ul>
        </div>
        <div className="text-center mt-12 text-xs text-gray-500 border-t pt-4">
            <p>&copy; 1994-96 Yahoo! All Rights Reserved.</p>
            <p className="mt-1">Powered by <span className="font-bold">Sun Microsystems</span></p>
        </div>
    </div>
  )

  const GeoCitiesWebsite = ({ onNavigate }: { onNavigate: (url: string) => void }) => (
    <div className="min-h-full bg-purple-900 text-yellow-300 font-mono p-4 text-center overflow-hidden">
        <div className="border-4 border-yellow-300 p-4 mb-6 bg-black shadow-[4px_4px_0px_0px_rgba(255,255,0,0.5)]">
            <h1 className="text-4xl font-bold mb-2 animate-pulse">WELCOME TO GEOCITIES</h1>
            <p className="text-sm tracking-[0.5em]">YOUR HOME ON THE WEB</p>
        </div>
        
        <div className="mb-8">
            <p className="text-xl mb-4 text-white font-bold drop-shadow-md">Select your Neighborhood:</p>
            <div className="flex flex-wrap justify-center gap-4">
                {['SiliconValley', 'Hollywood', 'Tokyo', 'Area51', 'WallStreet', 'SoHo'].map(n => (
                    <button key={n} className="border-2 border-yellow-300 px-4 py-2 hover:bg-yellow-300 hover:text-black transition-colors font-bold uppercase">
                        {n}
                    </button>
                ))}
            </div>
        </div>

        <div className="text-center my-8">
             <div className="inline-block border-2 border-white p-4 bg-gray-800 text-white animate-bounce shadow-lg">
                🚧 UNDER CONSTRUCTION 🚧
                <div className="text-xs mt-1 text-gray-400">Last updated: 01/01/96</div>
             </div>
        </div>

        <div className="flex justify-center gap-2 text-xs text-cyan-300">
            <a href="#" className="hover:underline">[Guestbook]</a>
            <a href="#" className="hover:underline">[Email Me]</a>
            <a href="#" className="hover:underline">[Links]</a>
        </div>
    </div>
  )

  const AliwebWebsite = ({ onNavigate }: { onNavigate: (url: string) => void }) => (
    <div className="min-h-full bg-[#FFFFCC] text-black font-sans p-4 border-l-8 border-[#FF9900]">
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-black text-white p-4 font-bold text-3xl tracking-tighter">
                ALIWEB
            </div>
            <div>
                <h1 className="font-bold text-xl">Archie Like Indexing for the WEB</h1>
                <p className="text-xs">The world's first Web Search Engine</p>
            </div>
        </div>
        
        <div className="max-w-md border-2 border-gray-600 p-6 bg-gray-200 shadow-md">
             <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Search term:</label>
                <input className="w-full border border-gray-600 p-1" />
             </div>
             <div className="mb-4 text-sm">
                <label className="block font-bold mb-1">Case Sensitive:</label>
                <div className="flex gap-4">
                    <label><input type="radio" name="case" defaultChecked /> No</label>
                    <label><input type="radio" name="case" /> Yes</label>
                </div>
             </div>
             <button className="bg-gray-300 border-2 border-gray-500 border-b-black border-r-black px-4 py-1 text-sm font-bold active:border-t-black active:border-l-black active:border-b-gray-500 active:border-r-gray-500">Submit Query</button>
        </div>

        <div className="mt-8 text-sm">
            <p className="font-bold mb-2">Mirror Sites:</p>
            <ul className="list-disc pl-5 text-blue-800 underline">
                <li><a href="#">Indiana University (USA)</a></li>
                <li><a href="#">NEXOR (UK)</a></li>
            </ul>
        </div>
    </div>
  )

  const BlockedPage = () => (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-800 p-8">
          <div className="bg-white border-2 border-red-600 p-8 shadow-lg max-w-md">
              <h1 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                  <span className="text-3xl">🚫</span> ACCESS DENIED
              </h1>
              <p className="mb-4 font-bold">The requested URL was blocked by the corporate firewall.</p>
              <p className="mb-4 text-sm">
                  SmartRead Corp Security Policy enforces a strict whitelist for internet access. 
                  Only authorized internal and research portals are permitted.
              </p>
              <div className="bg-gray-100 p-2 text-xs font-mono border border-gray-300 mb-4">
                  Error Code: 403_FORBIDDEN_SITE<br/>
                  Client IP: 192.168.1.105<br/>
                  Gateway: SR-FIREWALL-01
              </div>
              <p className="text-xs text-gray-500 italic">
                  If you believe this is an error, please contact the IT Administrator (ext. 4402).
              </p>
          </div>
      </div>
  )

  const InternalPortal = ({ loggedIn, setLoggedIn }: { loggedIn: boolean, setLoggedIn: (v: boolean) => void }) => {
    if (loggedIn) {
        return (
            <div className="p-8 font-sans max-w-4xl mx-auto bg-gray-50 min-h-full">
                <div className="bg-white border shadow p-6 mb-6">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h1 className="text-2xl font-bold text-green-700">Admin Dashboard</h1>
                        <button 
                            onClick={() => setLoggedIn(false)}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Logout
                        </button>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 p-4 mb-6 rounded">
                        <h3 className="font-bold text-green-800 mb-2">Welcome, Administrator</h3>
                        <p className="text-sm text-green-700">
                            Security Alert: SQL Injection vulnerability detected in login form. 
                            Patch pending approval.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="border p-4 rounded bg-gray-50">
                            <h4 className="font-bold mb-2">System Flags</h4>
                            <div className="font-mono bg-black text-green-400 p-2 text-sm rounded">
                                flag&#123;sql_injection_master_class&#125;
                            </div>
                        </div>
                        <div className="border p-4 rounded bg-gray-50">
                            <h4 className="font-bold mb-2">User Management</h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                                <li>admin (Superuser)</li>
                                <li>guest (Restricted)</li>
                                <li>ctf_player (Monitoring)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 font-sans max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-800 mb-4">SmartRead Internal Portal</h1>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="font-bold">Maintenance Notice</p>
                <p>The admin dashboard is currently undergoing security hardening. Please report any anomalies to the security team.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="border p-4 rounded shadow-sm">
                    <h2 className="text-xl font-bold mb-2">Employee Resources</h2>
                    <ul className="list-disc pl-5 space-y-1 text-blue-600 underline cursor-pointer">
                        <li onClick={() => alert("HR System is offline for maintenance.")}>HR Dashboard</li>
                        <li onClick={() => alert("Payroll data is encrypted.")}>Payroll System</li>
                        <li onClick={() => alert("No holidays found.")}>Holiday Calendar</li>
                        <li onClick={() => alert("Ticket system unreachable.")}>IT Support Ticket</li>
                    </ul>
                </div>
                
                <div className="border p-4 rounded shadow-sm">
                    <h2 className="text-xl font-bold mb-2">Admin Tools</h2>
                    <form className="space-y-3" onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation() 
                        
                        const form = e.target as HTMLFormElement
                        const passwordInput = (form.elements.namedItem('password') as HTMLInputElement)
                        const password = passwordInput.value
                        
                        // SQL Injection Logic (Now on Password Field)
                        // Classic ' OR '1'='1
                        if (password.includes("' OR '1'='1") || password.includes("' OR 1=1") || password.includes('" OR "1"="1')) {
                            setLoggedIn(true)
                        } else {
                            alert("Access Denied: Invalid credentials.")
                        }
                    }}>
                        <div>
                            <label className="block text-sm font-bold mb-1">Username</label>
                            <div className="w-full border p-1 bg-gray-100 text-gray-600 cursor-not-allowed">admin</div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Password</label>
                            <input 
                                name="password"
                                className="w-full border p-1" 
                                type="password" 
                                placeholder="Enter password"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Login</button>
                    </form>
                </div>
            </div>
            
            <div className="mt-8 text-xs text-gray-500 border-t pt-4">
                &copy; 1999 SmartRead Corp. All rights reserved. | Powered by Apache/1.3.12 (Unix) mod_perl/1.24
            </div>
        </div>
    )
  }

export function BrowserApp({}: AppProps) {
  const [url, setUrl] = useState("http://info.cern.ch")
  const [currentUrl, setCurrentUrl] = useState("http://info.cern.ch")
  const [isLoading, setIsLoading] = useState(false)
  const [internalLoggedIn, setInternalLoggedIn] = useState(false)

  const bookmarks = [ { name: "CERN", url: "http://info.cern.ch" },
      { name: "Yahoo!", url: "http://www.yahoo.com" },
      { name: "GeoCities", url: "http://www.geocities.com" },
      { name: "ALIWEB", url: "http://www.aliweb.com" },
      { name: "Internal", url: "http://internal.portal" }
  ]

  const handleNavigate = (targetUrl?: string) => {
    setIsLoading(true)
    let target = targetUrl || url
    
    // Normalize URL
    if (!target.startsWith('http')) {
        target = 'http://' + target
    }
    
    // Check for simulated sites
    if (target.includes('internal.portal') || 
        target.includes('yahoo.com') || 
        target.includes('geocities.com') || 
        target.includes('aliweb.com') ||
        target.includes('info.cern.ch')) {
        setCurrentUrl(target)
        setUrl(target)
        setTimeout(() => setIsLoading(false), 500)
        return
    }

    // Use our proxy for external sites
    // Note: In a real app we'd use a proxy. Here we just try iframe.
    // Many sites will block this.
    const proxyUrl = target
    setCurrentUrl(proxyUrl)
    setUrl(target) // Update address bar
    
    setTimeout(() => setIsLoading(false), 1500)
  }

  // Whitelist Logic
  const getPageContent = () => {
      if (currentUrl.startsWith("http://info.cern.ch/secret_dev_notes.txt")) {
          return <CernSecretPage onNavigate={handleNavigate} />
      }
      if (currentUrl.includes("info.cern.ch")) {
          return <CernWebsite onNavigate={handleNavigate} />
      }
      if (currentUrl.includes("internal.portal")) {
          return <InternalPortal loggedIn={internalLoggedIn} setLoggedIn={setInternalLoggedIn} />
      }
      if (currentUrl.includes("yahoo.com")) {
          return <YahooWebsite onNavigate={handleNavigate} />
      }
      if (currentUrl.includes("geocities.com")) {
          return <GeoCitiesWebsite onNavigate={handleNavigate} />
      }
      if (currentUrl.includes("aliweb.com")) {
          return <AliwebWebsite onNavigate={handleNavigate} />
      }
      // Everything else blocked
      return <BlockedPage />
  }

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-1 border-b border-gray-400 bg-[#d4d0c8]">
        <button className="p-1 hover:bg-gray-300 rounded disabled:opacity-50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-300 rounded disabled:opacity-50">
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-300 rounded">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        <button className="p-1 hover:bg-gray-300 rounded" onClick={() => handleNavigate("http://info.cern.ch")}>
          <Home className="w-4 h-4" />
        </button>
        
        {/* Address Bar */}
        <div className="flex-1 flex items-center bg-white border border-gray-500 px-2 py-0.5 ml-2">
          <div className="mr-2 text-gray-500">
             <Search className="w-3 h-3" />
          </div>
          <input 
            className="flex-1 outline-none text-sm font-sans"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
          />
        </div>
        
        <button 
          className="px-3 py-0.5 bg-[#c0c0c0] border border-t-white border-l-white border-b-black border-r-black text-sm active:border-t-black active:border-l-black"
          onClick={() => handleNavigate()}
        >
          Go
        </button>
      </div>
      
      {/* Bookmarks Bar */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#d4d0c8] border-b border-gray-400 text-xs">
          {bookmarks.map(b => (
              <button 
                key={b.name}
                onClick={() => handleNavigate(b.url)}
                className="hover:underline flex items-center gap-1 text-blue-800"
              >
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {b.name}
              </button>
          ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative overflow-auto">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-sm text-gray-600">Connecting...</span>
            </div>
          </div>
        ) : null}
        
        {getPageContent()}
      </div>
      
      {/* Status Bar */}
      <div className="h-6 border-t border-gray-400 flex items-center px-2 text-xs text-gray-600 bg-[#d4d0c8]">
        {isLoading ? "Connecting to host..." : "Done"}
      </div>
    </div>
  )
}
