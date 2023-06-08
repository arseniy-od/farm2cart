import Layout from "@/app/layout"


export default function LogOut() {
    const isLoggedOut = fetch('/api/auth/logout').then(res);
    return (
        <Layout>
            <p>You have been logged out</p>
        </Layout>
    );
}