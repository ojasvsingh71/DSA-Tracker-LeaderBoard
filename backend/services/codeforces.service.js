import axios from "axios";

const fetchCodeforcesStats = async (username) => {
    try {
        const res = await axios.get(`https://cp-rating-api.vercel.app/codeforces/${username}`);

        return {
            contestRating: res.data.rating
        }
    } catch (err) {
        console.log("Error in fetching codeforces data : -\n");
        console.error(err);
    }
}
fetchCodeforcesStats("ojasvsingh71")
export default fetchCodeforcesStats;