import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

export const getDeviceFingerprint = async (): Promise<string> => {
  if (!fpPromise) {
    console.log('Initializing fingerprint detection');
    fpPromise = FingerprintJS.load();
  }

  try {
    const fp = await fpPromise;
    const result = await fp.get();
    console.log('Fingerprint generated successfully');
    return result.visitorId;
  } catch (error) {
    console.error('Error generating fingerprint:', error);
    return 'fallback-fingerprint';
  }
};