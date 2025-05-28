//middleware to verify government officer role
export const verifyGovernmentOfficer = (req, res, next) => {
    if (req.user.role !== 'government_officer') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Government officer role required."
        });
    }
    next();
};

//middleware to verify admin role
export const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin role required."
        });
    }
    next();
};

//middleware to verify grama sevaka role
export const verifyGramaSevaka = (req, res, next) => {
    if (req.user.role !== 'grama_sevaka') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Grama sevaka role required."
        });
    }
    next();
};

//middleware to verify multiple roles
export const verifyRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }
        next();
    };
};