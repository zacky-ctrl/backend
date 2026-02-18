import { Request, Response, NextFunction } from "express";

type Role = "Clerk" | "Accountant" | "Admin";

export function requireRole(allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthenticated" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        next();
    };
}
