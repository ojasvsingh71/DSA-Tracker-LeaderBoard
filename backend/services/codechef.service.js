import axios from "axios"
import sanitizeRating from "../utils/sanitizerating.js";

const fetchCodechefStats = async (username) => {
    try {
        const res = await axios.get(`https://www.codechef.com/users/${username}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
            }
        });

        const html = res.data;
        const ratingRegex = /<div class="rating-number">([^<]+)<\/div>/;
        const match = html.match(ratingRegex);

        let rating = null;
        if (match) {
            rating = match[1].trim();
        }

        return {
            contestRating: sanitizeRating(rating)
        }
    } catch (err) {
        console.error("Codechef Fetch Error:", err.response?.data || err.message);
        return null;
    }
}

export default fetchCodechefStats;