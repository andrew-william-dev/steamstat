export const getSteamProfileId = (url: string): { type: "vanity" | "steamid" | null, value: string | null } => {
    try {
        const u = new URL(url);

        if (!u.hostname.includes("steamcommunity.com")) {
            return { type: null, value: null };
        }

        const parts = u.pathname.split("/").filter(Boolean);

        if (parts.length < 2) {
            return { type: null, value: null };
        }

        if (parts[0] === "profiles") {
            return {
                type: "steamid",
                value: parts[1],
            };
        }

        if (parts[0] === "id") {
            return {
                type: "vanity",
                value: parts[1],
            };
        }

        return { type: null, value: null };

    } catch (err) {
        return { type: null, value: null };
    }
};

export const handleAnalyze = async (url: string) => {
    const parsed = getSteamProfileId(url);

    if (!parsed.value) {
        throw new Error("INVALID_URL");
    }

    if (parsed.type === "steamid") {
        if (parsed.value.length !== 17 || !/^\d+$/.test(parsed.value)) {
            throw new Error("INVALID_STEAMID");
        }

        return { steamid: parsed.value };
    }
};

