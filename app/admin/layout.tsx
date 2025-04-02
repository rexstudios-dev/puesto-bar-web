import type React from "react"
import AdminNavbar from "@/components/admin-navbar"
import AuthCheck from "@/components/auth-check"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <main>{children}</main>
      </div>
    </AuthCheck>
  )
}

