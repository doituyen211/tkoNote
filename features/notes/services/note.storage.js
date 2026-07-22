import { readStorage, save } from "@/lib/storage";
import { generateId } from "@/lib/utils";

/**
 * @typedef {object} NoteRecord
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} theme
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export function getAllNotes() {
  return readStorage().notes;
}

/**
 * @param {{title:string, content:string, theme:string}} input
 * @returns {NoteRecord}
 */
export async function createNote(input) {
  const state = readStorage();
  const now = new Date().toISOString();

  /** @type {NoteRecord} */
  const record = {
    id: generateId(),
    title: input.title,
    content: input.content,
    theme: input.theme,
    createdAt: now,
    updatedAt: now,
  };

  await save({ ...state, notes: [...state.notes, record] });
  return record;
}

/**
 * @param {string} id
 * @param {{title:string, content:string, theme:string}} input
 * @returns {NoteRecord|null}
 */
export async function updateNote(id, input) {
  const state = readStorage();
  let updated = null;

  const notes = state.notes.map((note) => {
    if (note.id !== id) return note;
    updated = { ...note, ...input, updatedAt: new Date().toISOString() };
    return updated;
  });

  await save({ ...state, notes });
  return updated;
}

/**
 * @param {string} id
 */
export async function deleteNote(id) {
  const state = readStorage();
  await save({ ...state, notes: state.notes.filter((n) => n.id !== id) });
}

/**
 * @param {"newest"|"oldest"|"theme"} sort
 */
export async function setNoteSort(sort) {
  const state = readStorage();
  await save({ ...state, settings: { ...state.settings, noteSort: sort } });
}
