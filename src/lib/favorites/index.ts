import "server-only";
import { db } from "../../db";
import { postgresFavorites } from "./postgres";

export const favorites = postgresFavorites(db);
