import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <Header />
        <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}