import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotes: builder.query({
      query: () => "/note",
      validateStatus: (response) =>
        response.status === 200 && !response.isError,
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id; //this is to change the _id from mongodb to the id from the api
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "List" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "List" }];
      },
    }),
  }),
});

export const { useGetAllNotesQuery } = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getAllNotes.select();

// Creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the posts slice of state
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
