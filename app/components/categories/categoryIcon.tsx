import Link from 'next/link'
import Image from 'next/image'

export default function CategoryIcon({ text, imageUrl, link }) {
    return (
        <Link href={link}>
            <div className="mx-4 flex flex-col items-center">
                <div className="mt-2 flex items-center overflow-hidden rounded-full w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 xl:mx-4">
                    <Image
                        src={imageUrl}
                        alt="category image"
                        width="100"
                        height="100"
                        className="object-cover object-center h-full w-full"
                    />
                </div>
                <div className="mt-2 text-center font-semibold">{text}</div>
            </div>
        </Link>
    )
}
