import Link from 'next/link'
import Image from 'next/image'

export default function CategoryIcon({ text, imageUrl, link }) {
    return (
        <Link href={link}>
            <div className="mx-4 flex flex-col items-center">
                <div className="mt-2 flex h-12 w-12 items-center overflow-hidden rounded-full lg:h-14 lg:w-14 xl:mx-4 xl:h-16 xl:w-16">
                    <Image
                        src={imageUrl}
                        alt="category image"
                        width="100"
                        height="100"
                        className="h-full w-full object-cover object-center"
                    />
                </div>
                <div className="mt-2 text-center font-semibold">{text}</div>
            </div>
        </Link>
    )
}
