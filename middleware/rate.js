const rateLimits = {}

const rate = (req, res, next) => {
    const ip = req.ip;
    if (!rateLimits[ip]) {
        rateLimits[ip] = { count: 1, startTime: Date.now() }
    }
    else {
        const time = Date.now();
        if (time - rateLimits[ip].startTime > 60000) {
            rateLimits[ip] = { count: 1, startTime: Date.now() }
        }
        rateLimits[ip].count++;
        if (rateLimits[ip].count > 20) {
            return res.status(429).json({
                message: "Sorry, too many requests at a time"
            });
        }
    }
    console.log("IP:", ip, "Count:", rateLimits[ip]?.count)
    next();
}

export default rate