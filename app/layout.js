import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className="dark">
      <body className="bg-gray-950 text-slate-200 antialiased">
        {children} 
      </body>
    </html>
  )
}