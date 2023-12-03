import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

const readFile = (fileName: string) => fs.promises.readFile(path.join(__dirname, '..', '..', 'files', fileName), { encoding: 'utf8' });

export default readFile;