import config from "@/config";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config(config.cloudinary);

class ImageService {
    async nextUploadStream(
        name: string,
        publicId: string,
        file: File,
    ): Promise<UploadApiResponse | undefined> {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = await new Uint8Array(arrayBuffer);

        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        tags: [`next-js-server-actions-upload-${name}`],
                        public_id: publicId,
                        folder: name,
                    },
                    function (error, result) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(result);
                    },
                )
                .end(buffer);
        });
    }
}

export default ImageService;
