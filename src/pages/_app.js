import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && <Toaster position="top-center" reverseOrder={false} />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
