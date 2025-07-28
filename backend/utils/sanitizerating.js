const sanitizeRating = (ratingStr) => {
    if (typeof ratingStr === 'string') {
        const num = parseInt(ratingStr.replace('?', ''), 10);
        return isNaN(num) ? null : num;
    }
    return ratingStr;
};

export default sanitizeRating;