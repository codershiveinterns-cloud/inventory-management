import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBt5DgEMcTlB_PNrEC4yLiNr_ektLwVmPg',
  authDomain: 'inventory-management-sys-be7ba.firebaseapp.com',
  projectId: 'inventory-management-sys-be7ba',
  storageBucket: 'inventory-management-sys-be7ba.firebasestorage.app',
  messagingSenderId: '501381761643',
  appId: '1:501381761643:web:f1b72a35898d4f054bbf2e',
  measurementId: 'G-Z6017MYH2W'
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

export const analyticsPromise =
  typeof window === 'undefined'
    ? Promise.resolve(null)
    : isSupported()
        .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
        .catch(() => null);
