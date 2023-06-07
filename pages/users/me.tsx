// import { createClient } from 'redis';
// import nextSession from 'next-session';
// import { getSession } from 'next-auth/react';
import Layout from '@/app/layout';



export default function User({ user }) {
    if (user.error) {
        return <div>{user.message}</div>
    }
    return (
        <Layout>
            <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg" key={i}>
                Username: <span className="text-indigo-500">@{user.username}</span>
            </div>
        </Layout>
    );

}


async function fetchUser(req, redisClient) {
    console.log("\nRequest in fetchUser:\n", req)
    const session = await nextSession({ req, client: redisClient });

    if (!session) {
        // If the user is not authenticated, return null or throw an error
        console.log('No session on client');
        return { error: true, message: 'Session is blank' };
    }

    // Extract the user data from the session object
    console.log('Here is session: ', session);
    const user = {
        error: null,
        id: session.user.id,
        username: session.user.username,
        email: session.user.email,
        // Add any other user data you need here
    };

    // Return the user object
    return user;
}

User.getInitialProps = async (ctx) => {
    // Here, `ctx` is an object that contains information about the request
    const redisClient = createClient();
    const session = await getSession({ req: ctx.req });
    if (!session) {
        return { user: { error: true, message: 'Session is blank' } };
    }

    const user = await fetchUser(ctx.req, redisClient);

    return { user };
};
