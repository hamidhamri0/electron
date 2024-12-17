import { Input } from '@/components/ui/input'
import React from 'react'

export default function FormInput({
  handleSubmit
}: {
  handleSubmit: (input: string) => Promise<void>
}) {
  const [input, setInput] = React.useState('')

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setInput('')
    handleSubmit(input)
  }
  return (
    <form onSubmit={onSubmit} className="flex-1">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Aa"
        className=" bg-gray-800 border-none"
      />
    </form>
  )
}
