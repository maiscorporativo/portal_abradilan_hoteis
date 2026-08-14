import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

/* Pasta versionada no git. Guarda as imagens que já estavam no repositório
   e continua servindo como padrão em desenvolvimento. */
export const REPO_UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

/* Pasta onde os uploads novos são gravados. Em produção UPLOADS_DIR precisa
   apontar para fora do diretório do deploy — sem isso cada deploy recria a
   pasta do projeto e apaga tudo que foi enviado pelo admin. */
export const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : REPO_UPLOADS_DIR;

export function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  return UPLOADS_DIR;
}
