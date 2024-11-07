import { initializeApp } from 'firebase/app'

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: import.meta.env.apiKey,
}

const app = initializeApp(firebaseConfig)
