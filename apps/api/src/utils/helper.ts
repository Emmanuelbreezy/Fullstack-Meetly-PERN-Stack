import { v4 as uuidv4 } from "uuid";
import { encode, decode } from "js-base64";

export function slugify(text: string): string {
  const uuid = uuidv4().split("-")[0].slice(0, 4);
  // Create the slug
  const slug = text
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // Trim hyphens from the start
    .replace(/-+$/, ""); // Trim hyphens from the end

  // Append the 2-digit UUID to the slug
  return `${slug}-${uuid}`;
}

export const encodeState = (data: any): string => {
  return encode(JSON.stringify(data));
};

export const decodeState = (state: string): any => {
  return JSON.parse(decode(state));
};
