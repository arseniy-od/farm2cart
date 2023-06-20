import { createRouter } from 'next-connect'
import Link from 'next/link'

import Layout from '@/app/layout'
import container from '@/server/container'
import { NextApiRequest, NextApiResponse } from 'next'
import { UsersProps } from '@/app/interfaces'

export default function User({ users }: UsersProps) {
    return (
        <Layout>
            {users.map((user, i) => (
                <div key={i}>
                    <Link href={'/users/' + user.id}>
                        <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                            Username:{' '}
                            <span className="text-indigo-500">
                                @{user.username}
                            </span>
                        </div>
                    </Link>
                </div>
            ))}
        </Layout>
    )
}

const router = createRouter().get(async (req, res) => {
    const users = await container.resolve('UserController').getUsers()
    return { props: { users } }
})

export async function getServerSideProps({
    req,
    res,
}: {
    req: NextApiRequest
    res: NextApiResponse
}) {
    return await router.run(req, res)
}
