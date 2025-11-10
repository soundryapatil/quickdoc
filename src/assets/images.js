// Helper to resolve image paths for doctors and avatars
import doc1 from './doc1.png';
import doc2 from './doc2.png';
import doc3 from './doc3.png';
import doc4 from './doc4.png';
import doc5 from './doc5.png';
import doc6 from './doc6.png';
import doc7 from './doc7.png';
import doc8 from './doc8.png';
import doc9 from './doc9.png';
import doc10 from './doc10.png';
import doc11 from './doc11.png';
import doc12 from './doc12.png';
import doc13 from './doc13.png';
import doc14 from './doc14.png';
import doc15 from './doc15.png';
import defaultProfile from './profile_pic.png';

const byFilename = {
  'doc1.png': doc1,
  'doc2.png': doc2,
  'doc3.png': doc3,
  'doc4.png': doc4,
  'doc5.png': doc5,
  'doc6.png': doc6,
  'doc7.png': doc7,
  'doc8.png': doc8,
  'doc9.png': doc9,
  'doc10.png': doc10,
  'doc11.png': doc11,
  'doc12.png': doc12,
  'doc13.png': doc13,
  'doc14.png': doc14,
  'doc15.png': doc15,
  // also allow keys without extension
  'doc1': doc1,
  'doc2': doc2,
  'doc3': doc3,
  'doc4': doc4,
  'doc5': doc5,
  'doc6': doc6,
  'doc7': doc7,
  'doc8': doc8,
  'doc9': doc9,
  'doc10': doc10,
  'doc11': doc11,
  'doc12': doc12,
  'doc13': doc13,
  'doc14': doc14,
  'doc15': doc15,
  default: doc1
};

function resolveFromPicture(picture) {
  if (!picture) return null;
  if (typeof picture !== 'string') return null;
  // if it's an absolute URL, return as-is
  if (/^https?:\/\//i.test(picture)) return picture;
  // strip any leading path like '/assets/doc3.png' -> 'doc3.png'
  const filename = picture.split('/').pop();
  if (byFilename[filename]) return byFilename[filename];
  if (byFilename[picture]) return byFilename[picture];
  return null;
}

export function getDoctorImage(picture) {
  return resolveFromPicture(picture) || byFilename.default;
}

export function getAvatar(picture) {
  return resolveFromPicture(picture) || defaultProfile;
}

export default {
  getDoctorImage,
  getAvatar
};
