
import ReviewForm from '@/components/profile/TuteeReviewForm'
import React from 'react'
import TuteeProfileNav from "@/components/TuteeProfileNav"
import Sidebar from '@/components/TuteeSidebar'

const page = () => {
  return (
    <div className="min-h-screen pt-10 mr-1 ">
      <TuteeProfileNav/>
      <Sidebar/>
      <div className="flex items-center justify-center min-h-screen">
        <ReviewForm />
      </div>
    </div>
  )
}

export default page