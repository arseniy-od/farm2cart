import { createRouter } from 'next-connect'
import Link from 'next/link'

import Layout from '@/app/layout'
import container from '@/server/container'
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import { UsersProps } from '@/app/interfaces'

export default function User(props: UsersProps) {
    const users = props.data
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

export const getServerSideProps: GetServerSideProps = async function (ctx) {
    return await container.resolve('UserController').run(ctx)
}
