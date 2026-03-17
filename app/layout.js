import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import "./globals.css"

export const metadata = {
  title: "Sistema de Estoque",
  description: "Controle profissional de estoque"
}

export default function RootLayout({ children }) {

  return (
    <html lang="pt-br">
      <body className="flex bg-gray-900 text-white">

        <Sidebar />

        <div className="flex-1">

          <Header />

          <main className="p-8">
            {children}
          </main>

        </div>

      </body>
    </html>
  )
}
