import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import config from '~/config';

const firebaseConfig = {
    apiKey: 'AIzaSyCQtG1dlEdKGii50kw1PxzLsp4Sn_U017E',
    authDomain: 'todo-app-c481a.firebaseapp.com',
    projectId: 'todo-app-c481a',
    storageBucket: 'todo-app-c481a.appspot.com',
    messagingSenderId: '755441635698',
    appId: '1:755441635698:web:96a23736273f5f9c680deb',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const name = result.user.displayName;
        const profilePic = result.user.photoURL;
        const email = result.user.email;
        const userId = result.user.uid;

        localStorage.setItem('name', name);
        localStorage.setItem('profilePic', profilePic);
        localStorage.setItem('email', email);
        localStorage.setItem('userId', userId);

        window.location.replace(config.routes.home);
    } catch (error) {
        console.log(error);
    }
};

export const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem('name');
    localStorage.removeItem('profilePic');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');

    window.location.replace(config.routes.login);
};
