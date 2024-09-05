import { FC, PropsWithChildren, cloneElement, isValidElement, ComponentType } from 'react'
import { useQueryCall } from '@ic-reactor/react'
import { Member } from '../../declarations/backend/backend.did'
import { useNavigate } from 'react-router-dom'
import { hasKey } from '../../utils'
import { CtaButton } from '../Buttons'

export interface MembersOnlyChildComponentProps {
  memberData?: Member
}

type ChildComponentType = ComponentType<MembersOnlyChildComponentProps>

interface ParentComponentProps {
  children: React.ReactElement<MembersOnlyChildComponentProps, ChildComponentType>
}

export const MembersOnly: FC<ParentComponentProps> = (props) => {
  const { children } = props
  const navigate = useNavigate()
  const navigateToMembership = () => {
    navigate('/members/new') // Use navigate function
  }

  // Use the useUpdateCall hook to call the registerMember function.
  // Note: useUpdateCall also outputs the loading state.
  const {
    data,
    loading,
  } = useQueryCall({
    functionName: 'getMember',
  }) as { call: Function, data: { ok: Member }, loading: boolean }

  // Guard for missing children.
  if (!children) {
    throw new Error('Children are required for the MembersOnly component.')
  }

  // Guard for invalid children.
  if (!isValidElement(children)) {
    throw new Error('Children must be a valid React element.')
  }

  // Guard for loading state.
  if (loading) {
    return <div>Loading your membership status...</div>
  }

  // Guard for missing data.
  if (hasKey(data, "err")) {
    return (
      <div className="text-center py-4">
        <h1>It looks like you're not a member of the Dao.</h1>
        <p>
          To get started please register as a member.
        </p>
        <p>{data.err as String}</p>
        <CtaButton cta="Get Started" onClick={navigateToMembership} classOverrides='mx-auto' />
      </div>
    )
  }

  return (
    cloneElement(children, {
      ...children.props, memberData: data.ok
    })
  )
}