import '@/styles/globals.css'
import { MaterialTailwindControllerProvider } from '../context/index'
import { GoogleOAuthProvider } from '@react-oauth/google';

/*
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
*/
export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider
      clientId="846094111905-igsq8do37h1mhgh4tf4lmp9tkrfbr7op.apps.googleusercontent.com">
      <MaterialTailwindControllerProvider>
        <Component {...pageProps} />
      </MaterialTailwindControllerProvider>
    </GoogleOAuthProvider>
  );
}

//export default App;
