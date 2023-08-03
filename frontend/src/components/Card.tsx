import Image from "./Image"
import { CustomComponentProps } from "../interfaces"
import { mergeClassName } from "../utils"
import { MdPlayCircleFilled } from "react-icons/md"

interface Props extends CustomComponentProps {
  imageSrc: string
  title?: string
  onClick?: Function
  withPlay?: boolean
}

const Card = (props: Props) => {
  const withPlay = props.withPlay ?? true
  return (
    <div
      onClick={() => (props.onClick ? props.onClick() : "")}
      className={mergeClassName(
        "group mx-3 my-1.5 cursor-pointer",
        props.className
      )}
    >
      <div className="h-[200px] relative rounded-lg overflow-hidden">
        {withPlay ? (
          <div className="absolute hidden group-hover:flex items-center justify-center inset-0 before:absolute before:inset-0 before:content-[''] before:bg-black before:opacity-[0.7]">
            <button className="relative z-10">
              <MdPlayCircleFilled size={24}></MdPlayCircleFilled>
            </button>
          </div>
        ) : (
          ""
        )}
        <Image
          src={props.imageSrc}
          className="rounded-lg overflow-hidden"
        ></Image>
      </div>

      <p className="py-1.5 line-clamp-2">{props.title}</p>
      {props.children}
    </div>
  )
}

export default Card
