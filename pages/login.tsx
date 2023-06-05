import Link from 'next/link'
import Layout from '../app/layout'
import {useState} from 'react'


export default function Home() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        phoneNumber: ''
    });



    const handleSubmit = async (event) => {
        event.preventDefault();

        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (res.ok) {
            const user = await res.json();
            console.log("Login successful")
        } else {
            console.log("Login error")
        }
    };


    return (
        <div id="app" className="">
            <Layout>
                <div className="mt-6">
                    <form className="text-center">
                        <h3 className="text-xl">Login</h3>
                        <div>
                            <input type="text" value={user.email} onChange={(event) => setUser({...user, email: event.target.value})}
                                   className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="email"/>
                        </div>
                        <div>
                            <input type="password" value={user.password} onChange={(event) => setUser({...user, password: event.target.value})}
                                   className="mt-2 px-4 py-3 w-full max-w-xs border-2" placeholder="password"/>
                        </div>
                        <button onClick={handleSubmit} type="submit" className="mt-4 inline-block items-center bg-gray-400 hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-lg shadow px-8 py-2">Submit</button>
                    </form>
                </div>
            </Layout>
        </div>
    );
}