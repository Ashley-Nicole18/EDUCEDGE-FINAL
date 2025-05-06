import React from 'react'
import TuteeSidebar from "@/components/TuteeSidebar"
import TuteeDashboard from '@/components/dashboard/dashboard-tutee'

const page = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-48">
        <TuteeSidebar />
      </div>

      <div className="flex-1 p-8">
        <TuteeDashboard />
      </div>
    </div>
  )
}

export default page
