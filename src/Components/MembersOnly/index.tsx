import { FC, cloneElement, isValidElement, ComponentType, useEffect, useState } from 'react'
import { useQueryCall } from '@ic-reactor/react'
import { Member } from '../../declarations/backend/backend.did'
import { useNavigate } from 'react-router-dom'
import { hasKey } from '../../utils'
import { CtaButton } from '../Buttons'
import { useUserPrincipal } from '@ic-reactor/react'

export interface MembersOnlyChildComponentProps {
  memberData?: Member
}

type ChildComponentType = ComponentType<MembersOnlyChildComponentProps>

interface ParentComponentProps {
  children: React.ReactElement<MembersOnlyChildComponentProps, ChildComponentType>
}

export const MembersOnly: FC<ParentComponentProps> = (props) => {
  const { children } = props
  const principal = useUserPrincipal()
  const navigate = useNavigate()
  const navigateToMembership = () => {
    navigate('/members/new') // Use navigate function
  }

  const [member, setMember] = useState<Member | null>(null)


  useEffect(() => {
    // Guard for unauthenticated users.
    if (!principal) { return }

    const fetchMember = async () => {
      await getMember([principal])
    }

    fetchMember()
  }, [])

  // Guard for missing authenticated user.
  if (!principal) {
    return <div className="text-center py-4">Please login to view this page.</div>
  }

  // Use the useUpdateCall hook to call the registerMember function.
  // Note: useUpdateCall also outputs the loading state.
  const {
    call: getMember,
    data,
    loading,
  } = useQueryCall({
    functionName: 'getMember',
    onSuccess: (result) => {
      if (hasKey(result, "ok")) {
        setMember(result.ok as Member)
      }
      if (hasKey(result, "err")) {
        setMember(null)
      }
    }
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

  // Guard for missing data.
  if (member) {
    return (
      cloneElement(children, {
        ...children.props, memberData: member
      })
    )
  }
}