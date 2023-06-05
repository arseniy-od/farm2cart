import Layout from '@/app/layout'
import {createRouter} from "next-connect";
import {getUsers} from "../../services";



export default function User({ users }){
        return (
            <Layout>
                {users.map((user, i) => (
                    <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg" key={i}>
                        Username: <span className="text-indigo-500">@{user.username}</span>
                    </div>
                ))
                }
            </Layout>
        );

}


const router = createRouter()
    .get(async (req, res) => {
        const users = await getUsers();
        if (!users) {
            return { props: { notFound: true } };
        }
        return { props: {users: JSON.parse(JSON.stringify(users))} };
    });


export async function getServerSideProps({ req, res }) {
    return await router.run(req, res);
}

