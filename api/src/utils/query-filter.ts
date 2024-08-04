/**
 * Get the filter object from the parsed query string object and process it.
 *
 * @param parsedQuery Parsed query string object (parsed by Express)
 * @returns processed query object's filter property
 */
export function getQueryFilter(parsedQuery: any) {
  // Recursively go through the parsedQuery object and change string "true" and "false" to booleans
  function convertStringBooleans(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        if (obj[key] === "true") {
          obj[key] = true;
        } else if (obj[key] === "false") {
          obj[key] = false;
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        obj[key] = convertStringBooleans(obj[key]);
      }
    }
    return obj;
  }

  return convertStringBooleans(parsedQuery.filter);
}
