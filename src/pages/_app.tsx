import "../../styles/globals.css";
import axios from "axios";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/auth.context";
import { SWRConfig } from "swr";

axios.defaults.baseURL = "http://localhost:3000"; // the prefix of the URL

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  return pathname === "/auth" ? (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  ) : (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default MyApp;
