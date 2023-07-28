import Link from 'next/link'
import Image from 'next/image'
import { ReactElement } from 'react'

import { HalfStar, BlankStar, Star } from '../icons/star'
import CartHandler from '../cart/cartHandler'
import { ConnectedProps, connect } from 'react-redux'
import { RootState } from '@/redux/store'
import { good } from '@/app/types/entities'

function GoodCard({ good, seller }: Props) {
    function roundHalf(num: number) {
        return Math.round(num * 2) / 2
    }

    let stars: ReactElement[] = []
    if (good.averageScore) {
        let score = roundHalf(good.averageScore)
        for (let i = 0; i < 5; i++) {
            if (score === 0.5) {
                stars.push(<HalfStar />)
                score = 0
            } else if (score === 0) {
                stars.push(<BlankStar />)
            } else {
                stars.push(<Star />)
                score -= 1
            }
        }
    }

    return (
        <div className="mt-4 mx-3">
            <div className="px-4 py-2 max-w-xs w-full text-lg">
                <div className="shadow-lg">
                    <div className="z-0 relative flex items-center justify-center overflow-hidden w-full h-56">
                        <Link
                            href={'/goods/' + good.id}
                            className="w-full h-full"
                        >
                            <Image
                                src={
                                    good.imageUrl
                                        ? good.imageUrl
                                        : '/uploads/no_image.png'
                                }
                                alt={good.title + ' photo'}
                                width="288"
                                height="224"
                                className="object-cover object-center w-full h-full"
                            />
                        </Link>
                        <div className="mr-3 mb-3 absolute flex justify-center  bottom-0 right-0 bg-gray-100 min-w-[2rem;] min-h-[2rem;] rounded-full items-center">
                            <CartHandler good={good} />
                        </div>
                        {good.active && good.available ? null : (
                            <div>
                                <div className="z-10 absolute w-full h-full bg-gray-900 opacity-70 inset-0"></div>
                                <div className="z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 h-12 bg-white text-gray-900 text-center flex justify-center items-center font-semibold text-xl">
                                    Product is not active
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-2 py-2 bg-gray-100">
                        <Link
                            href={seller?.id ? '/users/' + seller.id : '#'}
                            className="text-gray-700"
                        >
                            {seller?.username || ''}
                        </Link>
                        <Link href={'/goods/' + good.id}>
                            <h3 className="text-xl font-semibold hover:underline">
                                {good.title}
                            </h3>

                            {good.averageScore && good.reviewsCount ? (
                                <div className=" flex items-center justify-left">
                                    <div className="flex">
                                        {stars.map((star, i) => (
                                            <div key={i}>{star}</div>
                                        ))}
                                    </div>

                                    <div className="ml-2 text-gray-600">
                                        {good.reviewsCount}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-600">
                                    No reviews yet
                                </div>
                            )}

                            <p className="line-clamp-2 overflow-hidden leading-snug h-12 hover:underline">
                                {good.description}
                            </p>

                            <div className="text-gray-700">₴ {good.price}</div>
                            <div className="text-gray-700">
                                Available: {good.available}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapState = (state: RootState, ownProps) => ({
    seller: state.entities.users?.[ownProps.good.seller],
})

const connector = connect(mapState, null)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { good: good }
export default connector(GoodCard)
