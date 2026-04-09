import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white font-sans">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Abstract Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
            C
          </div>
          <span className="text-2xl font-bold tracking-tighter">ChannelChat</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Adapters</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <a 
          href="https://github.com/vercel/chat" 
          className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all shadow-xl shadow-white/10"
        >
          Get Started
        </a>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-400 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            V4.24.0 Release is live
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            Chat logic once.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              Deploy everywhere.
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 mb-12 leading-relaxed max-w-2xl">
            Unified SDK for building multi-platform chat bots. Reach your users where they are: 
            Telegram, Slack, Discord, and beyond.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-cyan-500/30">
              Connect Telegram
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-md">
              View Dashboard
            </button>
          </div>
        </div>

        {/* Features / Adapters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-32">
          {[
            { name: "Telegram", status: "Active", color: "text-blue-400" },
            { name: "Discord", status: "Coming Soon", color: "text-indigo-400" },
            { name: "Slack", status: "Coming Soon", color: "text-orange-400" },
            { name: "WhatsApp", status: "Available", color: "text-green-400" },
          ].map((platform) => (
            <div key={platform.name} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-white/20 transition-colors">
              <div className={`text-sm font-semibold mb-2 ${platform.color}`}>{platform.name}</div>
              <div className="text-xs text-zinc-500">{platform.status}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Background Glows */}
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
    </div>
  );
}
