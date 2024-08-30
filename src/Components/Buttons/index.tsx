import { FC } from "react"
import { TrashIcon, PlusCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline"

interface ButtonProps {
  onClick: () => void
  classOverrides?: string
}

export const DeleteButton: FC<ButtonProps> = (props) => {
  const { onClick, classOverrides } = props
  return (
    <button
      className={`btn btn-warning btn-outline uppercase ${classOverrides || null}`}
      onClick={onClick}
    >
      <TrashIcon className="h-6 w-6 inline" />
      Delete
    </button>
  )
}

export const CreateButton: FC<ButtonProps> = (props) => {
  const { onClick, classOverrides } = props
  return (
    <button
      className={`btn btn-primary btn-outline items-center ${classOverrides || null}`}
      onClick={onClick}
    >
      <PlusCircleIcon className="h-6 w-6" />
      <span>Proposal</span>
    </button>
  )
}

interface CtaButtonProps extends ButtonProps {
  cta: string
}

export const CtaButton: FC<CtaButtonProps> = (props) => {
  const { onClick, classOverrides, cta } = props
  return (
    <button
      className={`btn btn-primary btn-outline items-center ${classOverrides || null}`}
      onClick={onClick}
    >
      <ArrowRightCircleIcon className="h-6 w-6" />
      <span>{cta}</span>
    </button>
  )
}