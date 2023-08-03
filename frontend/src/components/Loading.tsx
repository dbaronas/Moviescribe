import { FaSpinner } from "react-icons/fa"

const Loading = () => {
  return (
    <div className="justify-center flex items-center gap-3">
      <FaSpinner className="animate-spin" size={18}></FaSpinner>
      <span>Loading...</span>
    </div>
  )
}

export default Loading
