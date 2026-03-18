export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition"
    >
      {children}
    </button>
  )
}
