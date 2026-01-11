const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getProfile(steamid: string) {
    const r = await fetch(`${BASE}/user/profile?steamid=${steamid}`);
    if (!r.ok) throw new Error("PROFILE_FETCH_FAILED");
    return r.json();
}

export async function getLibrary(steamid: string) {
    const r = await fetch(`${BASE}/user/library?steamid=${steamid}`);
    if (!r.ok) throw new Error("LIBRARY_FETCH_FAILED");
    return r.json();
}

export async function getRecents(steamid: string) {
    const r = await fetch(`${BASE}/user/recent?steamid=${steamid}`);
    if (!r.ok) throw new Error("RECENT_FETCH_FAILED");
    return r.json();
}

export async function getStore(appid: number | string) {
    const r = await fetch(`${BASE}/store?appid=${appid}`);
    if (!r.ok) throw new Error("STORE_FETCH_FAILED");
    return r.json();
}
