import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { syncCartReminder } from '../../services/notificationService';

export const syncReminder = createAsyncThunk('notifications/syncReminder', async (itemCount) => syncCartReminder(itemCount));

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: { permissionGranted: null, reminderAt: null },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(syncReminder.fulfilled, (state, action) => {
            state.permissionGranted = action.payload.permissionGranted;
            state.reminderAt = action.payload.scheduled
                ? action.payload.triggerAt
                : null;
        });
    },
});

export default notificationSlice.reducer;