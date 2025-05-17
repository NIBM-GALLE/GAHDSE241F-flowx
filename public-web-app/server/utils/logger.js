import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // Log level (e.g., info, error, warn, debug)
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Log to the console
  ],
});

export default logger;
