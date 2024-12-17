import SideBar from '@renderer/components/SideBar'
import MainContent from '@renderer/components/MainContent'

function Home() {
  return (
    <div className="flex h-screen bg-[#1C1C1C] text-white">
      {/* Left Sidebar */}
      <SideBar />
      {/* RIGHT SIDE*/}
      <MainContent />
    </div>
  )
}

export default Home
