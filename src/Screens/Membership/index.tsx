import React, { useState, useEffect } from 'react'
import { Member } from '../../declarations/backend/backend.did'
import AuthContext from '../../Contexts/Auth'
import { useUpdateCall, useQueryCall } from '@ic-reactor/react'
import { useNavigate } from 'react-router-dom'
import { hasKey } from '../../utils'
import { Principal } from '@dfinity/principal'

const NewMember: React.FC = () => {
  const auth = React.useContext(AuthContext)
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [member, setMember] = useState<Member | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Redirect to the profile page after adding a new member.
  const navigate = useNavigate()
  const redirectToProfile = () => {
    navigate('/profile')
  }

  // Use the useUpdateCall hook to call the registerMember function.
  // Note: useUpdateCall also outputs the loading state.
  const { call: registerMember } = useUpdateCall({
    functionName: 'registerMember',
    onSuccess: () => {
      // Call to backend was successful but not necessarily the registration.
      setIsLoading(false)
    },
  })

  // Use the useUpdateCall hook to call the registerMember function.
  // Note: useUpdateCall also outputs the loading state.
  const { call: getMember } = useQueryCall({
    functionName: 'getMember',
    onSuccess: (result) => {
      // If the key 'ok' exists in the result, set the member state.
      if (hasKey(result, 'ok')) {
        const memberData: Member = JSON.parse(JSON.stringify(result.ok))
        setMember(memberData)
        return
      }

      if (hasKey(result, 'err')) {
        setError(result.err as string)
        return
      }
    },
  })

  useEffect(() => {
    // Guard for missing identity.
    if (!auth.identity) { return }

    // Fetch the member data.
    const queryMember = async () => {
      const principal = Principal.fromText(auth.identity)
      console.log(`Principal: ${principal}`)
      await getMember([principal])
    }
    queryMember()
  }, [auth.identity])

  // On submission the form will send data to the backend
  // It should clear the fields too.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // The role is hardcoded to Student but it's checked on the backend.
    // By default, the role is Student for any new member.
    // TODO: This will be changed once the Motoko boot camp graduation is completed.
    const member: Member = { name, role: { Student: null } }

    // Set the loading state to true.
    setIsLoading(true)

    // Call the registerMember function with the member data.
    const result = await registerMember([member])

    // Check if the result has an error property.
    function hasErrorProperty(obj: unknown): obj is { err: unknown } {
      return typeof obj === 'object' && obj !== null && 'err' in obj
    }

    // Guard clause to handle errors.
    if (hasErrorProperty(result)) {
      setFeedback(`Failed to register ${member.name}: ${result.err}`)
      setIsLoading(false)
      return
    }

    // Clear the form after submission.
    setName('')

    // Redirect to the profile page.
    redirectToProfile()
  }

  // Guard for existing member.
  if (member) {
    return <div className="text-center py-4">
      You are already a member. We current don't have a mechanism to remove members.
    </div>
  }

  return (
    <form onSubmit={handleSubmit} className="shadow-md rounded-lg p-6 max-w-2xl mx-auto bg-slate-800" >
      <h2 className="text-2xl font-bold mb-4"> New Member</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow border rounded w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        {/* Display label for security Principal */}
        <label htmlFor="principal" className="block text-sm font-bold mb-2">
          Principal:
        </label>
        {auth.identity}
      </div>

      {feedback ? <div role="alert" className="alert alert-warning rounded-md mb-4" >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 stroke-current">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{feedback}</span>
      </div > : null}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSubmit}
      >
        {isLoading ? "Saving" : "Add Member"}
      </button>
    </form >
  )
}

export default NewMember