import { useEffect, useState } from "react"
import Container from "./Container"
import { IoIosClose } from "react-icons/io"

interface Props {
  src: string | null
  onHide: () => void
}

const TrailerModal = (props: Props) => {
  const [show, setShow] = useState(false)

  const hide = () => {
    setShow(false)
    props.onHide()
  }

  useEffect(() => {
    if (props.src) {
      setShow(true)
    }
  }, [props.src])

  return (
    <div
      onClick={() => hide()}
      className={`${
        show ? ` opacity-[1]` : ` opacity-0 pointer-events-none`
      } ease-in-out duration-300 fixed z-[1080] inset-0 after:fixed after:content-[""] after:inset-0 after:bg-black after:opacity-[0.9]`}
    >
      <Container
        className={`relative z-10 transition-[marginm, opacity] ease-in-out duration-300 ${
          show ? `mt-0 opacity-[1]` : `-mt-[200px] opacity-0`
        }`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="bg-header rounded-sm"
        >
          <div className="p-3 text-right">
            <button onClick={() => hide()}>
              <IoIosClose size={18}></IoIosClose>
            </button>
          </div>
          <div>
            {show ? (
              <iframe
                src={props.src as string}
                className="w-full h-[500px]"
              ></iframe>
            ) : (
              ""
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default TrailerModal
