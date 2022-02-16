import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'

export default function Confetti() {
    const { width, height } = useWindowSize()
    return (
        <ReactConfetti
            width={width}
            height={height}
            style={{ position: 'fixed' }}
            recycle={false}
            tweenDuration={8000}
        />
    )
}
