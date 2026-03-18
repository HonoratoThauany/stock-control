export default function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}
