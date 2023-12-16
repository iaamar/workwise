// Import the moment library for date manipulation
import moment from "moment";

// Function to format a date according to the specified format
export const formatDate = (date, format = "MMMM D, YYYY") =>
  date ? moment(date).format(format) : date;

// Function to format a date and time according to the specified format
export const formatDateTime = (date, format = "MMMM D, YYYY, h:mm A") =>
  date ? moment(date).format(format) : date;

// Function to format a date and time for API communication (UTC format)
export const formatDateTimeForAPI = (date) =>
  date ? moment(date).utc().format() : date;

// Function to format a date and time in a conversational style (e.g., "2 hours ago")
export const formatDateTimeConversational = (date) =>
  date ? moment(date).fromNow() : date;
