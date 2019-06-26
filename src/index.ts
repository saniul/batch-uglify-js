import UglifyJS from 'uglify-js';
import * as fs from 'fs';
import * as _url from 'url'

interface Result { 
    fileURL: string, 
    uglified?: string,
    error?: string,
}

export const batchUglify = (fileURLs: string[], options: UglifyJS.MinifyOptions | undefined) => {
    const promises = fileURLs.map(fileURL => { 
        const promise = new Promise((resolve: (value?: Result) => void, reject) => {
            const path = _url.fileURLToPath(fileURL)
            fs.readFile(path, (err, buffer) => {
                if (err) {
                    resolve({ fileURL, error: err.toString() })
                    return
                }
    
                const original = buffer.toString()
                const result = UglifyJS.minify(original, options);
    
                if (result.error) {
                    resolve({ fileURL, error: result.error.toString() })
                    return
                }
    
                const uglified = result.code
    
                resolve({ fileURL, uglified })
            })
        })
        return promise
     })
     return Promise.all(promises)
}