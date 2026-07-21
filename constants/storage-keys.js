export const STORAGE_KEY = "learning-dashboard:data";
export const GIST_ID_KEY = "learning-dashboard:gist-id";
export const SCHEMA_VERSION = 1;

export const EMPTY_STATE = {
  version: SCHEMA_VERSION,
  videos: [],
  notes: [],
  settings: {
    videoSort: "newest",
    noteSort: "newest",
  },
};
