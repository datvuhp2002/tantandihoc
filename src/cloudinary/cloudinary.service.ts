import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';
@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream((err, result) => {
          if (err) reject(err);
          resolve(result);
        });
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      },
    );
  }
}
