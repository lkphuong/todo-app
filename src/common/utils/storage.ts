import { diskStorage } from 'multer';

export const storage = {
  storage: diskStorage({
    destination: 'public/images',
    filename: (req, file, cb) => {
      const filename = file.originalname.replace(/\s/g, '');
      cb(null, filename);
    },
  }),
};
