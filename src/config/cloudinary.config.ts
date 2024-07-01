import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'lachongtech',
  api_key: '631518346949312',
  api_secret: 'Ec2Fdj1v2voufkhhkX-CkhOZnj8',
  secure: true,
  sign_url: true,
});
export default cloudinary;
