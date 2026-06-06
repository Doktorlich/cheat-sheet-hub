import fs from "node:fs";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("elements.db");