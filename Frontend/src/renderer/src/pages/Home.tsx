import SideBar from '@renderer/components/SideBar'
import MainContent from '@renderer/components/MainContent'
import { useEffect } from 'react'

function Home() {
  useEffect(() => {
    console.log('HOME MOUNT')
  }, [])
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
