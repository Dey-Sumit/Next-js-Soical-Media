import "../../styles/globals.css";
import axios from "axios";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/auth.context";

axios.defaults.baseURL = "http://localhost:3000"; // the prefix of the URL

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  return pathname === "/auth" ? (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  ) : (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />;
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
