import '@/styles/globals.css'
import { MaterialTailwindControllerProvider } from '../context/index'
/*
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
*/
export default function App({ Component, pageProps }) {
  return (
    <MaterialTailwindControllerProvider>
      <Component {...pageProps} />
    </MaterialTailwindControllerProvider>
  );
}

//export default App;
