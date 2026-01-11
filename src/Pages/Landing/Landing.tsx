import React, {type FormEvent, useState} from "react";
import {handleAnalyze} from "../../utils/profile.ts";

const SteamLanding: React.FC = () => {
    const [url, setUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    return (
        <div className="bg-background-dark text-white selection:bg-primary selection:text-white min-h-screen">
            <header className="fixed top-0 w-full py-6 z-50 bg-background-dark/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-primary">
                            <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <span className="text-xl font-brand tracking-wider">SteamStat</span>
                    </div>

                    <a href="#Analyse" className="font-bold text-sm uppercase tracking-widest text-primary hover:text-white transition-colors">
                        Analyze Profile
                    </a>
                </div>
            </header>

            <main>
                <section
                    className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
                    <div className="absolute inset-0 z-30">
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[1000px] bg-primary/20 rounded-full blur-[160px] opacity-40"></div>
                        <div
                            className="absolute top-1/4 left-1/3 size-[600px] bg-accent/10 rounded-full blur-[140px] opacity-30"></div>
                    </div>

                    <div className="max-w-6xl mx-auto text-center">
                        <div className="hero-glow">
                            <h1 className="text-7xl md:text-[10rem] font-brand leading-[0.85] mb-12 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 text-glow">
                                YOUR STATS <br/><span className="text-primary">UNFILTERED.</span>
                            </h1>
                        </div>

                        <p className="text-2xl md:text-3xl text-slate-300 mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
                            The most honest look at your steam library . Discover where your time (and
                            money) actually went.
                        </p>

                        <a href="#explore" className="group flex flex-col items-center gap-4 cursor-pointer">
              <span
                  className="text-slate-400 font-bold uppercase tracking-[0.4em] group-hover:text-primary transition-colors">
                See What's Possible
              </span>
                            <span
                                className="material-symbols-outlined text-4xl text-primary animate-bounce">expand_more</span>
                        </a>
                    </div>
                </section>

                <section id="explore" className="py-32 px-6 relative bg-slate-900/20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-brand mb-6 uppercase tracking-tighter">
                                What We Do
                            </h2>
                            <p className="text-xl text-slate-400">
                                Beyond just counting hours. We're here to tell the painful truth.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div
                                className="p-10 rounded-[3rem] card-blur border border-slate-800/50 hover:border-primary/50 transition-all group">
                                <div
                                    className="size-24 bg-primary/20 rounded-3xl flex items-center justify-center mb-8 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                    <span className="material-symbols-outlined text-6xl">query_stats</span>
                                </div>
                                <h3 className="text-3xl font-brand mb-4">The Truth Bomb</h3>
                                <p className="text-xl text-slate-400 leading-relaxed">
                                    We calculate how many pizzas you could have bought with that unplayed library. It's
                                    painful, we know.
                                </p>
                            </div>

                            <div
                                className="p-10 rounded-[3rem] card-blur border border-slate-800/50 hover:border-accent/50 transition-all group">
                                <div
                                    className="size-24 bg-accent/20 rounded-3xl flex items-center justify-center mb-8 text-accent group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                                    <span className="material-symbols-outlined text-6xl">psychology_alt</span>
                                </div>
                                <h3 className="text-3xl font-brand mb-4">Niche Finder</h3>
                                <p className="text-xl text-slate-400 leading-relaxed">
                                    Played 400 hours of a niche simulator? We'll find you more hyper-specific obsessions
                                    to ruin your sleep.
                                </p>
                            </div>

                            <div
                                className="p-10 rounded-[3rem] card-blur border border-slate-800/50 hover:border-green-500/50 transition-all group">
                                <div
                                    className="size-24 bg-green-500/20 rounded-3xl flex items-center justify-center mb-8 text-green-500 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                    <span className="material-symbols-outlined text-6xl">emoji_events</span>
                                </div>
                                <h3 className="text-3xl font-brand mb-4">Glory & Shame</h3>
                                <p className="text-xl text-slate-400 leading-relaxed">
                                    From "Legendary Collector" to "Professional Procrastinator", we assign the badges
                                    you actually deserve.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* SECTION: Brutal Stats */}
                <section className="py-32 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                            <div className="max-w-xl">
                                <h2 className="text-4xl md:text-6xl font-brand mb-6 uppercase">Brutal Stats</h2>
                                <p className="text-xl text-slate-400 italic">
                                    "Some call it data, we call it a cry for help."
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-8xl font-brand text-slate-800/20">ROAST READY</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div
                                className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 p-8 rounded-3xl border-2 border-blue-500/30 relative group overflow-hidden hover:scale-105 transition-transform">
                                <div
                                    className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-9xl">local_pizza</span>
                                </div>
                                <p className="text-blue-300 font-bold uppercase text-xs tracking-widest mb-2">Pizza
                                    Potential</p>
                                <h4 className="text-4xl font-brand text-white mb-2 leading-none">42 Large
                                    Pepperonis</h4>
                                <p className="text-blue-400/80 font-medium">
                                    The caloric value of your unplayed library. You chose pixels over dough.
                                </p>
                            </div>

                            <div
                                className="bg-gradient-to-br from-amber-500/20 to-amber-900/40 p-8 rounded-3xl border-2 border-amber-500/30 relative group overflow-hidden hover:scale-105 transition-transform">
                                <div
                                    className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-9xl">inventory_2</span>
                                </div>
                                <p className="text-amber-300 font-bold uppercase text-xs tracking-widest mb-2">The
                                    Backlog Burden</p>
                                <h4 className="text-4xl font-brand text-white mb-2 leading-none">82% Untouched</h4>
                                <p className="text-amber-400/80 font-medium">
                                    Of your games have 0 minutes of playtime. Your library is a digital graveyard.
                                </p>
                            </div>

                            <div
                                className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 p-8 rounded-3xl border-2 border-emerald-500/30 relative group overflow-hidden hover:scale-105 transition-transform">
                                <div
                                    className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-9xl">wb_sunny</span>
                                </div>
                                <p className="text-emerald-300 font-bold uppercase text-xs tracking-widest mb-2">Life
                                    Outside</p>
                                <h4 className="text-4xl font-brand text-white mb-2 leading-none">Vitamin D
                                    Deficient</h4>
                                <p className="text-emerald-400/80 font-medium">
                                    You missed approximately 3,400 hours of daylight this year. Grass is still green, we
                                    checked.
                                </p>
                            </div>

                            <div
                                className="bg-gradient-to-br from-rose-500/20 to-rose-900/40 p-8 rounded-3xl border-2 border-rose-500/30 relative group overflow-hidden hover:scale-105 transition-transform">
                                <div
                                    className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-9xl">shopping_cart_off</span>
                                </div>
                                <p className="text-rose-300 font-bold uppercase text-xs tracking-widest mb-2">Wealth
                                    Wasted</p>
                                <h4 className="text-4xl font-brand text-white mb-2 leading-none">$1,240 Sunk</h4>
                                <p className="text-rose-400/80 font-medium">
                                    Market value of games you bought on sale but will never actually install. Bravo.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <main
                    id="Analyse"
                    className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6 pb-20">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-gradient px-4">
                            Unlock Your Gaming Insights
                        </h2>
                        <p className="text-[#9dabb9] text-xl md:text-2xl max-w-2xl mx-auto font-light">
                            Deep-dive into your library, track achievements, and discover personalized game
                            recommendations.
                        </p>
                    </div>
                    <div className="w-full max-w-3xl space-y-12">
                        <div
                            className="input-glow relative flex flex-col md:flex-row gap-3 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full shadow-2xl">
                            <div className="relative flex-1 flex items-center">
                                <span className="material-symbols-outlined absolute left-5 text-white/40">search</span>
                                <input
                                    onInput={(e: FormEvent<HTMLElement>) => setUrl(e.target?.value)}
                                    className="w-full bg-transparent border-none rounded-full py-5 pl-14 pr-6 text-xl text-white placeholder:text-white/30 focus:ring-0 outline-none"
                                    placeholder="Enter Profile URL..." type="text"/>
                            </div>
                            <button
                                className={`bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-xl md:rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/30 text-lg ${
                                    loading ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                                onClick={() => {
                                    setError(null);

                                    if (!url.trim()) {
                                        setError("Please paste your Steam profile URL.");
                                        return;
                                    }

                                    if (!url.startsWith("http://") && !url.startsWith("https://")) {
                                        setError("URL must start with http or https.");
                                        return;
                                    }

                                    if (!url.includes("steamcommunity.com")) {
                                        setError("This doesn't look like a Steam profile URL.");
                                        return;
                                    }

                                    setLoading(true);

                                    handleAnalyze(url)
                                        .then((data) => {
                                            window.location.href = "/report?steamid=" + (data?.steamid);
                                        })
                                        .catch((e) => {
                                            console.error(e);
                                            setError("Couldn't analyze profile. Make sure it's public and a valid url.");
                                        })
                                        .finally(() => setLoading(false));
                                }}
                            >
                                {loading ? "Analyzing..." : "Analyze Profile"}
                                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-400 text-center font-medium pt-2">
                                {error}
                            </p>
                        )}
                        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
                            <div
                                className="glass-panel rounded-2xl p-6 flex gap-4 group hover:border-primary/30 transition-colors">
                                <div className="bg-primary/10 p-2 rounded-lg h-fit">
                                    <span className="material-symbols-outlined text-primary">lock_open</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-white/90">Public Profile Required</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        Ensure "My profile" and "Game details" are set to <span
                                        className="text-primary/80">Public</span> in your privacy settings.
                                    </p>
                                </div>
                            </div>
                            <div
                                className="glass-panel rounded-2xl p-1 overflow-hidden transition-all hover:border-white/10">
                                <details className="group">
                                    <summary
                                        className="list-none flex items-center justify-between p-5 cursor-pointer select-none">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/5 p-2 rounded-lg">
                                                <span
                                                    className="material-symbols-outlined text-white/60">find_in_page</span>
                                            </div>
                                            <span className="font-semibold text-white/90">Where is my Steam ID?</span>
                                        </div>
                                        <span
                                            className="material-symbols-outlined group-open:rotate-180 transition-transform text-white/40">expand_more</span>
                                    </summary>
                                    <div
                                        className="px-6 pb-6 pt-2 text-sm text-white/50 space-y-4 border-t border-white/5 mt-2">
                                        <div className="flex gap-3">
                                            <span className="text-primary font-bold">01.</span>
                                            <p>Log into Steam via browser or exe.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-primary font-bold">02.</span>
                                            <p>Open the Profile Page.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-primary font-bold">03.</span>
                                            <p>Copy the URL</p>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="pt-24 pb-12 bg-slate-950 border-t border-slate-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col items-center gap-8 pt-12 border-t border-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="text-slate-400">
                                    <svg className="size-8" fill="none" viewBox="0 0 48 48"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                                            fill="currentColor"/>
                                    </svg>
                                </div>
                                <span className="text-xl font-brand text-slate-400 tracking-wider">SteamStat</span>
                            </div>

                            <p className="text-slate-600 text-sm font-bold uppercase tracking-[0.2em] text-center max-w-2xl">
                                Crafted by obsessive gamers • No affiliation with any platform • Just for the fun of it
                            </p>

                            <div className="flex gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                <a href="https://github.com/andrew-william-dev/steamstat" className="hover:text-primary transition-colors">Github</a>
                                <a href="mailto:andrewgithub10@gmail.com" className="hover:text-primary transition-colors">Mail</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default SteamLanding;