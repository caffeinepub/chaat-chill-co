declare module "xlsx" {
  export const utils: {
    json_to_sheet: (data: Record<string, unknown>[]) => unknown;
    book_new: () => unknown;
    book_append_sheet: (wb: unknown, ws: unknown, name: string) => void;
  };
  export function writeFile(wb: unknown, filename: string): void;
}
