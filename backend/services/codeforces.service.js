import axios from "axios";
import sanitizeRating from "../utils/sanitizerating.js";

const fetchCodeforcesStats = async (username) => {
    try {
        const res = await axios.get(`https://cp-rating-api.vercel.app/codeforces/${username}`);

        return {
            contestRating: sanitizeRating(res.data.rating)
        }
    } catch (err) {
        console.log("Error in fetching codeforces data : -\n");
        console.error(err);
    }
}

export default fetchCodeforcesStats;