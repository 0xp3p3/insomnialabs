export const isValidTimestamp = (timestamp: string): boolean => {
    return timestamp.indexOf("-") !== -1 && timestamp.indexOf(":") !== -1;
}
