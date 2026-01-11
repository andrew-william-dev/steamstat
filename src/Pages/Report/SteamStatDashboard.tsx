import { useState, useEffect } from 'react';
import { TrendingUp, Award } from 'lucide-react';

// Types
interface UserProfile {
    steamid: string;
    personaname: string;
    avatarfull: string;
    profileurl: string;
    timecreated?: number;
    lastlogoff?: number;
}

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_2weeks?: number;
    img_icon_url: string;
    img_logo_url: string;
}

interface Achievement {
    playerstats: {
        steamID: string;
        gameName: string;
        achievements: { apiname: string; achieved: number; unlocktime: number }[];
        success: boolean;
    };
}

interface StoreGame {
    appid: number;
    name: string;
    header_image: string;
    price_overview?: {
        final_formatted: string;
        discount_percent: number;
    };
    short_description: string;
}

interface GenreStat {
    name: string;
    hours: number;
    color: string;
    label: string;
}

const SteamStatDashboard = () => {
    const [steamId, setSteamId] = useState<string>('');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [library, setLibrary] = useState<Game[]>([]);
    const [recentGames, setRecentGames] = useState<Game[]>([]);
    const [achievements, setAchievements] = useState<Achievement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE = import.meta.env.VITE_API_URL || '/api';

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('steamid');

        if (id) {
            setSteamId(id);
            fetchUserData(id);
        } else {
            setError('No Steam ID provided in URL');
            setLoading(false);
        }
    }, []);

    const fetchUserData = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const [profileRes, libraryRes, recentRes] = await Promise.all([
                fetch(`${API_BASE}/user/profile?steamid=${id}`),
                fetch(`${API_BASE}/user/library?steamid=${id}`),
                fetch(`${API_BASE}/user/recent?steamid=${id}`)
            ]);

            if (!profileRes.ok || !libraryRes.ok || !recentRes.ok) {
                throw new Error('Failed to fetch user data');
            }

            const profileData = await profileRes.json();
            const libraryData = await libraryRes.json();
            const recentData = await recentRes.json();

            setProfile(profileData || null);
            setLibrary(libraryData?.games || []);
            setRecentGames(recentData?.games || []);

            if (libraryData.games?.length > 0) {
                const topGame = [...libraryData.games]
                    .sort((a, b) => b.playtime_forever - a.playtime_forever)[0];
                const achievementRes = await fetch(`${API_BASE}/user/achievements?steamid=${id}&appid=${topGame.appid}`);
                if (achievementRes.ok) {
                    const achievementData = await achievementRes.json();
                    setAchievements(achievementData);
                }
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Genre categorization based on common game patterns
    const categorizeGame = (game: Game): string => {
        const name = game.name.toLowerCase();

        // RPG patterns
        if (name.includes('witcher') || name.includes('skyrim') || name.includes('fallout') ||
            name.includes('baldur') || name.includes('elden ring') || name.includes('dark souls') ||
            name.includes('dragon') || name.includes('final fantasy') || name.includes('persona')) {
            return 'RPG';
        }

        // FPS patterns
        if (name.includes('counter-strike') || name.includes('cs:go') || name.includes('cs2') ||
            name.includes('valorant') || name.includes('overwatch') || name.includes('call of duty') ||
            name.includes('battlefield') || name.includes('apex') || name.includes('warzone') ||
            name.includes('halo') || name.includes('doom') || name.includes('rainbow six')) {
            return 'FPS';
        }

        // Simulation patterns
        if (name.includes('simulator') || name.includes('farm') || name.includes('city') ||
            name.includes('tycoon') || name.includes('planet') || name.includes('zoo') ||
            name.includes('sims') || name.includes('stardew') || name.includes('harvest')) {
            return 'Sim';
        }

        // Strategy patterns
        if (name.includes('civilization') || name.includes('total war') || name.includes('age of') ||
            name.includes('starcraft') || name.includes('crusader kings') || name.includes('europa') ||
            name.includes('hearts of iron') || name.includes('xcom')) {
            return 'Strategy';
        }

        // Souls-like patterns
        if (name.includes('dark souls') || name.includes('bloodborne') || name.includes('sekiro') ||
            name.includes('elden ring') || name.includes('nioh') || name.includes('lies of p')) {
            return 'Souls';
        }

        // MOBA patterns
        if (name.includes('dota') || name.includes('league') || name.includes('smite') ||
            name.includes('heroes of the storm')) {
            return 'MOBA';
        }

        // Indie patterns (usually shorter playtimes, unique names)
        if (game.playtime_forever < 1000 && !name.includes('counter-strike') &&
            !name.includes('dota') && !name.includes('league')) {
            return 'Indie';
        }

        return 'Other';
    };

    const calculateBarHeight = (hours, maxHours) => {
        const maxChartHeight = 285;
        const minBarHeight = 20;

        if (maxHours > 5000) {
            const logScale = Math.log(hours + 1) / Math.log(maxHours + 1);
            return Math.max(logScale * maxChartHeight, minBarHeight);
        }

        if (maxHours > 1000) {
            const sqrtScale = Math.sqrt(hours) / Math.sqrt(maxHours);
            return Math.max(sqrtScale * maxChartHeight, minBarHeight);
        }

        return Math.max((hours / maxHours) * maxChartHeight, minBarHeight);
    };

    const calculateGenreStats = (): GenreStat[] => {
        if (!library.length) return [];

        const genreMap: { [key: string]: number } = {};

        library.forEach(game => {
            const genre = categorizeGame(game);
            genreMap[genre] = (genreMap[genre] || 0) + game.playtime_forever;
        });

        const genreColors: { [key: string]: string } = {
            'RPG': 'bg-purple-500',
            'FPS': 'bg-red-500',
            'Indie': 'bg-blue-400',
            'Sim': 'bg-green-500',
            'Souls': 'bg-orange-500',
            'Strategy': 'bg-yellow-500',
            'MOBA': 'bg-pink-500',
            'Other': 'bg-slate-500'
        };

        const genreLabels: { [key: string]: string } = {
            'RPG': 'Exploring every corner',
            'FPS': 'Aiming for nothing',
            'Indie': 'Artistic suffering',
            'Sim': 'Virtual responsibility',
            'Souls': 'Pure masochism',
            'Strategy': 'World domination',
            'MOBA': 'Toxic teammates',
            'Other': 'Misc adventures'
        };

        return Object.entries(genreMap)
            .map(([name, minutes]) => ({
                name,
                hours: Math.floor(minutes / 60),
                color: genreColors[name] || 'bg-slate-500',
                label: genreLabels[name] || 'Gaming'
            }))
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 5);
    };

    const getGamerStatus = (): string => {
        const totalHours = getTotalHours();
        const gameCount = library.length;

        if (totalHours > 10000) return 'Legendary No-Lifer';
        if (totalHours > 5000) return 'Professional Couch Potato';
        if (totalHours > 2000) return 'Hardcore Grinder';
        if (totalHours > 1000) return 'Dedicated Gamer';
        if (totalHours > 500) return 'Casual Enthusiast';
        if (totalHours > 100) return 'Weekend Warrior';
        return 'Gaming Newbie';
    };

    const getCurrentVibe = (): string => {
        if (!recentGames.length) return 'Taking a Break (Yeah Right)';

        const mostRecentGame = recentGames[0];
        const recentHours = (mostRecentGame.playtime_2weeks || 0) / 60;
        const name = mostRecentGame.name.toLowerCase();

        // Based on game type and recent playtime
        if (recentHours > 40) {
            if (name.includes('counter-strike') || name.includes('valorant') || name.includes('apex')) {
                return 'Grinding Ranked (Send Help)';
            }
            if (name.includes('elden ring') || name.includes('dark souls')) {
                return 'Suffering Through Pain';
            }
            return 'Full Addiction Mode';
        }

        if (recentHours > 20) {
            if (name.includes('stardew') || name.includes('farm')) {
                return 'Living the Farm Life';
            }
            return 'Deep in the Zone';
        }

        if (recentHours > 10) {
            return 'Casual Gaming Session';
        }

        return 'Just Browsing';
    };

    const getTotalHours = () => {
        return Math.floor(library.reduce((sum, game) => sum + game.playtime_forever, 0) / 60);
    };

    const getAverageDailyHours = () => {
        if (!recentGames.length) return 0;
        const totalMinutes = recentGames.reduce((sum, game) => sum + (game.playtime_2weeks || 0), 0);
        return (totalMinutes / 60 / 14).toFixed(1);
    };

    const getTopGames = () => {
        return [...library]
            .sort((a, b) => b.playtime_forever - a.playtime_forever)
            .slice(0, 5)
            .map((game, index) => ({
                ...game,
                rank: index + 1,
                hours: Math.floor(game.playtime_forever / 60)
            }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl font-bold">Loading your gaming shame...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-xl font-bold mb-4">{error || 'Profile not found'}</p>
                    <p className="text-slate-400">Please check the Steam ID and try again</p>
                </div>
            </div>
        );
    }

    const genreStats = calculateGenreStats();
    const totalHours = getTotalHours();
    const avgDaily = getAverageDailyHours();
    const topGames = getTopGames();
    const maxGenreHours = Math.max(...genreStats.map(g => g.hours), 1);
    const gamerStatus = getGamerStatus();
    const currentVibe = getCurrentVibe();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="text-primary">
                                <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <span className="text-2xl font-bold tracking-tight uppercase">SteamStat</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="relative bg-slate-900/50 p-10 rounded-[2.5rem] border-4 border-slate-800 mb-12 shadow-xl overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

                    <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                        <div className="relative">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-[2rem] h-52 w-48 border-8 border-slate-800 shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform"
                                style={{ backgroundImage: `url(${profile.avatarfull})` }}
                            />
                            <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg rotate-6">
                                ONLINE (PROBABLY)
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 text-center md:text-left">
                            <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-2">
                                <span className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                    Level {Math.floor(totalHours / 100)} in Addiction
                                </span>
                            </div>
                            <h1 className="text-6xl font-black text-white mb-4 leading-tight">{profile.personaname}</h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">Gamer Status</span>
                                    <span className="text-xl font-bold text-purple-500 italic underline decoration-wavy decoration-purple-500/30">
                                        {gamerStatus}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">Current Vibe</span>
                                    <span className="text-xl font-bold text-green-500">{currentVibe}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-tighter text-slate-400">Total Games</span>
                                    <span className="text-xl font-bold text-red-500">{library.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/80 p-6 rounded-3xl border-2 border-slate-700 text-center transform -rotate-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Hours Wasted</p>
                            <p className="text-4xl font-black text-red-500">{totalHours.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400 mt-1 italic">
                                That's {Math.floor(totalHours / 24)} days of daylight you'll never see again!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Genre Chart */}
                    <div className="lg:col-span-2 bg-slate-900/50 p-8 rounded-[2rem] border-4 border-slate-800 shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-white">Genre Addiction Breakdown</h3>
                                <p className="text-slate-500 font-medium">Your entire library categorized by obsession</p>
                            </div>
                            <div className="bg-slate-800 p-2 rounded-2xl flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">All Time</span>
                            </div>
                        </div>

                        <div className="relative h-80 flex items-end justify-around px-8 mb-10 gap-4">
                            <div className="absolute -left-32 top-28 rotate-45 origin-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
                                Hours spent ignoring the sun
                            </div>

                            {genreStats.map((genre, idx) => (
                                <div key={idx} className="group relative flex flex-col items-center flex-1">
                                    <div
                                        className={`${genre.color} w-full rounded-t-2xl relative transition-all group-hover:scale-x-105 group-hover:brightness-110`}
                                        style={{ height: `${calculateBarHeight(genre.hours, maxGenreHours)}px` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {genre.hours.toLocaleString()} Hours
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <span className="block font-black text-lg">{genre.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-tight">{genre.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-dashed border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Total Regret Level: {totalHours > 5000 ? 'Maximum' : 'High'}</span>
                            <span className="text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                                Top Genre: {genreStats[0]?.name || 'Unknown'}
                            </span>
                        </div>
                    </div>

                    {/* Side Stats */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-orange-500/10 p-8 rounded-[2rem] border-4 border-orange-500/20 flex-1 relative overflow-hidden group">
                            <TrendingUp className="absolute -right-4 -bottom-4 w-20 h-20 text-orange-500/10 group-hover:scale-110 transition-transform" />
                            <p className="text-orange-500 font-black text-sm uppercase tracking-widest mb-1">Average Daily Grind</p>
                            <p className="text-4xl font-black text-white">
                                {avgDaily} <span className="text-lg font-bold text-slate-500 italic">hours/waste</span>
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-green-500 text-sm font-bold">
                                <TrendingUp className="w-4 h-4" />
                                <span>{parseFloat(avgDaily) > 5 ? 'Grinding extremely hard!' : 'Grinding hard lately!'}</span>
                            </div>
                        </div>

                        <div className="bg-purple-500/10 p-8 rounded-[2rem] border-4 border-purple-500/20 flex-1 relative overflow-hidden group">
                            <Award className="absolute -right-4 -bottom-4 w-20 h-20 text-purple-500/10 group-hover:scale-110 transition-transform" />
                            <p className="text-purple-500 font-black text-sm uppercase tracking-widest mb-1">Shiny Trinkets Won</p>
                            <p className="text-4xl font-black text-white">
                                {achievements?.playerstats?.achievements ?
                                    achievements.playerstats.achievements.filter(a => a.achieved === 1).length : 0}
                            </p>
                            <div className="w-full bg-slate-800 h-4 rounded-full mt-4 overflow-hidden border-2 border-slate-700">
                                <div
                                    className="bg-purple-500 h-full rounded-full transition-all"
                                    style={{
                                        width: `${achievements?.playerstats?.achievements ?
                                            (achievements.playerstats.achievements.filter(a => a.achieved === 1).length /
                                                achievements.playerstats.achievements.length * 100).toFixed(0) : 0}%`
                                    }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wide">
                                {achievements?.playerstats?.gameName || 'No game data'}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wide">
                                {achievements?.playerstats?.achievements ?
                                    `${(achievements.playerstats.achievements.filter(a => a.achieved === 1).length /
                                        achievements.playerstats.achievements.length * 100).toFixed(0)}% completion - Not a quitter yet!` :
                                    '0% completion - Not a quitter yet!'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Games */}
                <section className="mb-16">
                    <div className="flex flex-col md:flex-row items-baseline gap-4 mb-8 px-2">
                        <h2 className="text-4xl font-black text-white">Games You Binged Most</h2>
                        <p className="text-slate-500 font-medium">ranked by how many social events you missed</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                        {topGames.map((game) => {
                            const colors = ['bg-red-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500', 'bg-blue-500'];
                            const rotations = ['rotate-[-2deg]', 'rotate-[3deg]', 'rotate-[-1deg]', 'rotate-[2deg]', 'rotate-[-4deg]'];

                            return (
                                <div key={game.appid} className="group cursor-pointer">
                                    <div className="relative mb-4">
                                        <div className={`aspect-[4/5] rounded-[2.5rem] overflow-hidden border-4 border-slate-800 shadow-xl ${rotations[game.rank - 1]} group-hover:rotate-0 transition-transform duration-300`}>
                                            <div
                                                className="w-full h-full bg-center bg-cover bg-slate-700"
                                                style={{
                                                    backgroundImage: `url(https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg)`
                                                }}
                                            />
                                        </div>
                                        <div className={`absolute -top-3 -right-3 ${colors[game.rank - 1]} text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg`}>
                                            #{game.rank}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-white text-lg text-center">{game.name}</h3>
                                    <p className="text-slate-500 text-xs font-bold text-center uppercase tracking-tighter">
                                        {game.hours.toLocaleString()} hours of {game.rank === 1 ? 'pure dedication' : 'obsession'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-16 bg-slate-950">
                <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="text-primary">
                            <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tight uppercase">SteamStat</span>
                    </div>
                    <div className="text-slate-400 text-xs font-medium text-center md:text-right italic">
                        Made with 100% genuine gamer tears.<br />
                        © 2024 SteamStat Analytics Inc.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SteamStatDashboard;