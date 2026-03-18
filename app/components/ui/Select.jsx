export default function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </select>
  )
}
