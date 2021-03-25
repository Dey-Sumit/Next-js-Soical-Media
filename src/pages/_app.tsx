import "../../styles/globals.css";
import axios from "axios";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/auth.context";
import { SWRConfig } from "swr";
import { LayoutProvider } from "../context/layout.context";

axios.defaults.baseURL = process.env.API_ENDPOINT_BASE_URL; // the prefix of the URL

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  return pathname === "/auth" ? (
    <AuthProvider>
      <LayoutProvider>
        <Component {...pageProps} />
      </LayoutProvider>
    </AuthProvider>
  ) : (
    <AuthProvider>
      <LayoutProvider>
        <SWRConfig
          value={{
            fetcher: (url: string) => axios(url).then((r) => r.data),
            dedupingInterval: 100000,
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SWRConfig>
      </LayoutProvider>
    </AuthProvider>
  );
}

export default MyApp;
