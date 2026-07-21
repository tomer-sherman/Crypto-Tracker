class JsonSanitizer {
	
    public sanitize(text: string): string{
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        const json = text.substring(start,end +1);
        const recommendation: string = JSON.parse(json);
        return recommendation


    }



}

export const jsonSanitizer = new JsonSanitizer();
