import React, { useState } from 'react'
import { Member, Role } from '../../declarations/backend/backend.did'


const NewMember: React.FC = () => {
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>({ Student: null })

  // On submission the form will send data to the backend
  // It should clear the fields too.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Complete this function to add a new member.")
    // const newMember: Member = { name, role }
    setName('')
    setRole({ Student: null })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">New Member</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
          Role:
        </label>
        <select
          id="role"
          value={Object.keys(role)[0]}
          onChange={(e) => setRole({ [e.target.value]: null } as Role)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Student">Student</option>
          <option value="Mentor">Mentor</option>
          <option value="Graduate">Graduate</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Member
      </button>
    </form>
  )
}

export default NewMember