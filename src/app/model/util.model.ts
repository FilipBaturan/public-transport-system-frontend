
/**
 * Contains image data
 *
 * @export
 * @class Image
 */
export class Image {
    content: any;
    format: string;

    /**
     *Creates an instance of Image.
     * @param {*} content image bytes
     * @param {string} format image format
     * @memberof Image
     */
    constructor(content: any, format: string) {
        this.content = content;
        this.format = format;
    }
}

/**
 * Contains important information about parsing
 * the map content
 * 
 * @export
 * @class ParsedData
 */
export class ParsedData {

    code: string;
    name: string;
    index: number;
  
    /**
     * Creates an instance of ParsedData.
     * @param {string} code map code content
     * @param {string} name transport line name
     * @param {number} index current parsing index
     * @memberof ParsedData
     */
    constructor(code: string, name: string, index: number) {
      this.code = code;
      this.name = name;
      this.index = index;
    }
  }