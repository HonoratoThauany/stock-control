import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import MobileNav from "../components/MobileNav"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
        <Header />
        
        <main className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <div className="overflow-x-auto">
            {children}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}