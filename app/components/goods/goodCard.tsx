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
        <div className="mx-3 mt-4">
            <div className="w-full max-w-xs px-4 py-2 text-lg">
                <div className="shadow-lg">
                    <div className="relative z-0 flex h-56 w-full items-center justify-center overflow-hidden">
                        <Link
                            href={'/goods/' + good.id}
                            className="h-full w-full"
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
                                className="h-full w-full object-cover object-center"
                            />
                        </Link>
                        <div className="absolute bottom-0 right-0 mb-3 mr-3  flex min-h-[2rem;] min-w-[2rem;] items-center justify-center rounded-full bg-gray-100">
                            <CartHandler good={good} />
                        </div>
                        {good.active && good.available ? null : (
                            <div>
                                <div className="absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-70"></div>
                                <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-5/6 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center bg-white text-center text-xl font-semibold text-gray-900">
                                    Product is not active
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-100 px-2 py-2">
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
                                <div className=" justify-left flex items-center">
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

                            <p className="line-clamp-2 h-12 overflow-hidden leading-snug hover:underline">
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
