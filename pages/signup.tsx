import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react'

import Layout from '../app/layout'


export default function Home() {
    const { push } = useRouter();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        phoneNumber: '',
        role: 'customer'
    });



    const handleSubmit = async (event) => {
        event.preventDefault();

        const res = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (res.ok) {
            const user = await res.json();
            console.log("Sign up successful")
            push('/login')
        } else {
            console.log("Sign up error")
        }
    };


    return (
        <div id="app" className="">
            <Layout>
                <div className="mt-6">
                    <form className="text-center">
                        <h3 className="text-xl">Registration</h3>
                        <div>
                            <input type="text" value={user.firstName} onChange={(event) => setUser({ ...user, firstName: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2"
                                placeholder="first name" />
                        </div>
                        <div>
                            <input type="text" value={user.lastName} onChange={(event) => setUser({ ...user, lastName: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="last name" />
                        </div>
                        <div>
                            <input type="text" value={user.email} onChange={(event) => setUser({ ...user, email: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="email" />
                        </div>
                        <div>
                            <input type="text" value={user.username} onChange={(event) => setUser({ ...user, username: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="username" />
                        </div>
                        <div>
                            <input type="password" value={user.password} onChange={(event) => setUser({ ...user, password: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="password" />
                        </div>
                        <div>
                            <input type="text" value={user.phoneNumber} onChange={(event) => setUser({ ...user, phoneNumber: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="phone number" />
                        </div>
                        <div>
                            <input type="text" value={user.role} onChange={(event) => setUser({ ...user, role: event.target.value })}
                                className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="role" />
                        </div>
                        <button onClick={handleSubmit} type="submit" className="mt-4 inline-block items-center bg-gray-400 hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-lg shadow px-8 py-2">Submit</button>
                    </form>
                </div>
            </Layout>
        </div>
    );
}