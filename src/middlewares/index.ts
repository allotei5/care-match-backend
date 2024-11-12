import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["CARE-MATCH"];
    if (!sessionToken) {
      return res.sendStatus(403);
    }
    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const isAdmin = get(req, "identity.role") as number;

    if (isAdmin !== 1) {
      return res.sendStatus(403);
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isRecruiter = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const isRecruiter = get(req, "identity.role") as number;

    if (isRecruiter === 3) {
      // allow both admins and recruiters
      return res.sendStatus(403);
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
