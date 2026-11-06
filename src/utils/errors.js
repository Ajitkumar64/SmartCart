import axios from 'axios';
export function getErrorMessage(error) {
    if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
            return 'The request timed out. Please try again.';
        }
        if (!error.response) {
            return 'No internet connection. Check your network and retry.';
        }
        if (error.response.status === 404) {
            return 'We could not find what you were looking for.';
        }
        if (error.response.status >= 500) {
            return 'The server is having trouble. Please try again later.';
        }
        return `Something went wrong (code ${error.response.status}).`;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred.';
}
