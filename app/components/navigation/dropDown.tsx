import Link from 'next/link'

export default function DropDownMenu() {
    return (
        <div className="absolute bg-red-500">
            <Link
                className="block ml-4 w-2/3 hover:shadow-lg"
                href="http://localhost:3000/signup"
            >
                Sign up
            </Link>
            <Link
                className="block ml-4 mt-2 w-2/3 hover:shadow-lg"
                href="http://localhost:3000/login"
            >
                Login
            </Link>
        </div>
    )
}
