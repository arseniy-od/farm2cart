// export default function LiqPay() {
//     const extra = false
//     const signature = 'signature'
//     const disabled = false
//     const title = 'strawberry'
//     const amount = 2
//     const currency = 'uah'
//     const data = 'data'

//     return (
//         <form
//             method="POST"
//             action="https://www.liqpay.ua/api/3/checkout"
//             acceptCharset="utf-8"
//         >
//             <input type="hidden" name="data" value={data} />
//             <input type="hidden" name="signature" value={signature} />
//             {extra || (
//                 <button disabled={disabled}>
//                     <img src="https://static.liqpay.ua/buttons/logo-small.png" />
//                     <span>
//                         {title} {amount} {currency}
//                     </span>
//                 </button>
//             )}
//         </form>
//     )
// }

// import React, { useEffect, useRef } from 'react'

// export default function LiqPayCheckout() {
//     const liqpayRef = useRef(null)

//     useEffect(() => {
//         const script = document.createElement('script')
//         script.src = '//static.liqpay.ua/libjs/checkout.js'
//         document.head.appendChild(script)

//         const handleLiqPayCheckoutLoad = () => {
//             console.log('Start')
//             window.LiqPayCheckout.init({
//                 data:
//                     'eyAidmVyc2lvbiIgOiAzLCAicHVibGljX2tleSIgOiAieW91cl9wdWJsaWNfa2V5IiwgImFjdGlv' +
//                     'biIgOiAicGF5IiwgImFtb3VudCIgOiAxLCAiY3VycmVuY3kiIDogIlVTRCIsICJkZXNjcmlwdGlv' +
//                     'biIgOiAiZGVzY3JpcHRpb24gdGV4dCIsICJvcmRlcl9pZCIgOiAib3JkZXJfaWRfMSIgfQ==',
//                 signature: 'QvJD5u9Fg55PCx/Hdz6lzWtYwcI=',
//                 embedTo: liqpayRef.current,
//                 language: 'ru',
//                 mode: 'embed', // embed || popup
//             })
//                 .on('liqpay.callback', (data) => {
//                     console.log(data.status)
//                     console.log(data)
//                 })
//                 .on('liqpay.ready', (data) => {
//                     // ready
//                 })
//                 .on('liqpay.close', (data) => {
//                     // close
//                 })
//         }
//         setTimeout(() => handleLiqPayCheckoutLoad(), 1000)

//         // window.addEventListener('load', handleLiqPayCheckoutLoad)

//         // return () => {
//         //     window.removeEventListener('load', handleLiqPayCheckoutLoad)
//         // }
//     }, [])

//     return <div ref={liqpayRef} id="liqpay_checkout" />
// }
