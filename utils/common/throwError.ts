import { NextApiResponse } from 'next';
import { CustomError } from 'types/global';

const throwError: (
  res: NextApiResponse,
  code?: number,
  statusCode?: number,
  additionalInfo?: unknown,
) => void = (res, code = -1, statusCode = 500, additionalInfo) => {
  let message: string;

  switch (code) {
    case -99:
      message = 'Internal server error.';
      break;
    case -4:
      message = 'KaKao authorization code empty.';
      break;
    case -3:
      message = 'Wrong adminKey.';
      break;
    case -2:
      message = `Can't find JWT_SECRET.`;
      break;
    case 1:
      message = 'Method not exists.';
      break;
    case 2:
      message = 'Missing some required fields.';
      break;
    case 3:
      message = 'Empty or invalid authorization header.';
      break;
    case 4:
      message = 'Invalid access token.';
      break;
    case 5:
      message = 'Invalid refresh token.';
      break;
    case 6:
      message = 'No permission';
      break;
    case 7:
      message = 'File empty.';
      break;
    case 8:
      message = 'Requset body type error.';
      break;
    case 9:
      message = 'Validation failed.';
      break;
    case 10:
      message = 'Not uploaded yet.';
      break;
    case 11:
      message = 'Artist not specified.';
      break;
    case 12:
      message = 'Not admin.';
      break;
    case 13:
      message = 'No such notice.';
      break;
    case 14:
      message = 'No such purchase.';
      break;
    case 20:
      message = 'Invalid purchase status.';
      break;
    case 21:
      message = 'Delivery fee is not set.';
      break;
    case 22:
      message = 'Forged payment.';
      break;
    case 23:
      message = 'Restricted IP address.';
      break;
    case 100:
      message = 'Token expired.';
      break;
    case 101:
      message = 'Email already occupied.';
      break;
    case 102:
      message = 'No such user.';
      break;
    case 103:
      message = 'Password wrong.';
      break;
    case 104:
      message = 'Joined with social account.';
      break;
    case 105:
      message = 'Equel password';
      break;
    case 150:
      message = 'No such purchase info.';
      break;
    case 201:
      message = 'Not owner';
      break;
    case 202:
      message = 'No such image.';
      break;
    case 203:
      message = 'Exceeded maximum count of images.';
      break;
    case 302:
      message = 'No such artwork.';
      break;
    case 303:
      message = 'The artwork belongs to one or more booths.';
      break;
    case 304:
      message = 'Not changed.';
      break;
    case 305:
      message = 'Artwork soldOut.';
      break;
    case 401:
      message = 'No such notice.';
      break;
    case 402:
      message = 'No such booth.';
      break;
    case 403:
      message = 'Deleted booth.';
      break;
    case 404:
      message = 'Cannot make a change to a verified booth.';
      break;
    case 413:
      message = 'Payload to large';
      break;
    case 501:
      message = 'Recommendation booth length is not equal';
      break;
    case 502:
      message = 'Recommendation artist length is not equal';
      break;
    case 504:
      message = 'No Such recommendation';
      break;
    case 601:
      message = 'Already exist encoded video.';
      break;
    case 602:
      message = 'No such video.';
      break;
    case 701:
      message = 'No such comment.';
      break;
    case 702:
      message = 'Deleted comment.';
      break;
    case 801:
      message = 'No such artist.';
      break;
    case 802:
      message = 'No such product.';
      break;
    case 901:
      message = 'No such artist_request.';
      break;
    case 902:
      message = 'Already artist.';
      break;
    case 903:
      message = 'Already requested. (need confirmation)';
      break;
    case 904:
      message = 'Upload encoded videos first. (aws s3)';
      break;
    default:
      message = 'Database connection lost.';
  }

  res.statusCode = statusCode;
  const error = new Error(message) as CustomError;
  error.code = code;
  if (additionalInfo) error.additionalInfo = additionalInfo;
  throw error;
};

export default throwError;
