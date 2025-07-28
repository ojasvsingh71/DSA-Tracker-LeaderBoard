import axios from "axios"

const fetchCodechefStats = async (username) => {
    try {
        const res = await axios.get(`https://cp-rating-api.vercel.app/codechef/${username}`);

        return {
            contestRating: res.data.rating
        }
    } catch (err) {
        console.error("Codechef Fetch Error:", err.response?.data || err.message);
        return null;
    }
}

export default fetchCodechefStats;