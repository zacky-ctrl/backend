import { Request, Response, NextFunction } from "express";

/**
 * Temporary auth middleware.
 * Replace token verification later without touching routes.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    // TODO: Replace with real auth (JWT / session)
    req.user = {
        id: "demo-user-id",
        role: "Admin",
    };

    next();
}
