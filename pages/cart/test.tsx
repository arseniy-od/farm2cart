export default function Cart() {

    const handleCart = async (event) => {
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: "TestGood"})
        });

        if (res.ok) {
            const cartRes = await res.json();
            console.log("cart result: ", cartRes);
            console.log("Cart creation ok")
        } else {
            console.log("Cart creation not ok")
        }
    };

    return (
        <div>
            <button onClick={handleCart}>Test</button>
        </div>
        
    );
}