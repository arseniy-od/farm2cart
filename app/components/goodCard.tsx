import Layout from "../layout";
import Link from "next/link";
import Image from "next/image";

export default function GoodCard({good, categories}) {

    // console.log("[GoodCard] good: ", good)
    
    function Category() {
        return (
            <div>
                {categories.map((category, i) => (
                    <Link href={"/categories/" + category.text.toLowerCase()} className="inline-block px-1 text-indigo-500" key={i}>{category.text}</Link>))}
            </div>
        );
    }
    
    return (
            <div className="mt-4 ml-3 mx-auto px-4 py-2 max-w-xs w-full text-lg border-2 text-center justify-center bg-gray-100 rounded-lg">
                <div className='rounded-lg overflow-hidden shadow-lg'>
                    <div className="flex items-center justify-center w-72 h-72 object-cover object-center overflow-hidden">
                        <Image src={good.imageUrl} alt={good.title + " photo"} width="1024" height="1024" className="" />
                    </div>
                    <div className='px-2 py-2 bg-gray-100'>
                        <h3 className="text-xl font-semibold">{good.title}</h3>
                        <p>{good.description}</p>
                        <Link href={"/users/"} className="text-gray-700">Seller: {good.seller.username}</Link>
                        <div className="text-gray-700">₴ {good.price}</div>
                    </div>
                </div>


                {categories && categories.length ? <Category good={good} /> : null}
            </div>
    );
}