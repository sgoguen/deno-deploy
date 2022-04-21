import { join } from "https://deno.land/std@0.110.0/path/mod.ts";
import { extname } from "https://deno.land/std@0.110.0/path/mod.ts";

export async function serveStaticFromRequest(
    req: Request,
    urlRoot: string,
    filePathRoot: string,
): Promise<Response | null> {

    const url = new URL(req.url);
    const filename = mapToFile(url, urlRoot, filePathRoot);
    const exists = await fileExists(filename);
    console.log(`Serving ${filename} - Exists: ${exists}`);
    //  If the filename does not exist, return null
    if (!exists) {
        //  If the filename does not exist, return null

        return null;
    }
    return await serveStatic(url, urlRoot, filePathRoot);

}

async function fileExists(filename: string | null): Promise<boolean> {
    if (!filename) {
        return false;
    }
    try {
        const stat = await Deno.stat(filename);
        return stat.isFile;
    } catch {
        return false;
    }
}

export function mapToFile(url: URL, urlPrefix: string, staticFolder: string): string | null {
    const path = url.pathname;
    // If the path doesn't begin with the urlPrefix, return null
    if (!path.startsWith(urlPrefix)) {
        return null;
    }
    // Remove the urlPrefix from the path and replace it with the staticFolder
    const pathWithoutPrefix = path.substring(urlPrefix.length);
    const mapped = join(staticFolder, pathWithoutPrefix);
    // If the mapped path ends with a file extension, return the mapped path
    return mapped;
}

export async function serveStatic(
    url: URL,
    urlPrefix: string,
    staticFolder: string,
): Promise<Response | null> {
    const pathname = mapToFile(url, urlPrefix, staticFolder);
    if (!pathname) {
        return null;
    }
    const file = await Deno.readFile(pathname);
    const contentType = getContentType(pathname);
    if (!contentType) {
        return null;
    }
    return new Response(file, {
        headers: {
            "content-type": `${contentType}`,
        },
    });
}

function getContentType(pathname: string): string | undefined {
    const contentTypes: Record<string, string> = {
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.html': 'text/html',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.json': 'application/json',
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.gz': 'application/gzip',
        '.txt': 'text/plain',
        '.wasm': 'application/wasm',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.otf': 'font/otf',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.m4a': 'audio/mp4',
        '.m4v': 'video/mp4',
        '.mov': 'video/quicktime',
        '.avi': 'video/x-msvideo',
        '.mkv': 'video/x-matroska',
        '.mpeg': 'video/mpeg',
        '.mpg': 'video/mpeg',
        '.ogv': 'video/ogg',
        '.ogm': 'video/ogg',
        '.ogx': 'application/ogg',
        '.flv': 'video/x-flv',
        '.swf': 'application/x-shockwave-flash',
        '.bmp': 'image/bmp',
        '.url': 'text/uri-list',
        '.xml': 'application/xml',
        '.xhtml': 'application/xhtml+xml',
        '.xsl': 'application/xml',
        '.xslt': 'application/xslt+xml',
        '.xsd': 'application/xml',
        '.yaml': 'text/yaml',
        '.yml': 'text/yaml',
    };
    const ext = extname(pathname);
    return contentTypes[ext];
}