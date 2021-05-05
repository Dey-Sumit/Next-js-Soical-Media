import "../../styles/globals.css";
import axios from "axios";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/auth.context";
import { SWRConfig } from "swr";
import { LayoutProvider } from "../context/layout.context";
import Layout from "src/components/Layout";
import Head from "next/head";

axios.defaults.baseURL = process.env.VERCEL_URL; // the prefix of the URL only for the client side

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();

  return (
    <AuthProvider>
      <Head>
        <title>Twitty : Social Life</title>
        <script> </script>
        {/* disable the animation on page load */}
      </Head>
      <LayoutProvider>
        {pathname !== "/auth" ? (
          <SWRConfig
            value={{
              fetcher: (url: string) => axios(url).then((r) => r.data),
              dedupingInterval: 2000,
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SWRConfig>
        ) : (
          <Component {...pageProps} />
        )}
      </LayoutProvider>
    </AuthProvider>
  );
}

export default MyApp;
