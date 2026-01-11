export function getSteamIdFromQuery(): string | null {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("steamid");
    return id;
}

export function removeSteamIdFromUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete("steamid");
    window.history.replaceState({}, "", url.toString());
}
