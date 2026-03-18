import "./globals.css"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className="dark">
      <body className="bg-gray-950 text-slate-200 antialiased font-sans">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col relative overflow-y-auto">
            <Header />
            <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}