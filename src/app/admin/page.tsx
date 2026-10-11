import AdminClient from './client'

export const metadata = {
  title: 'Admin Portal · Striver AI Consultant Lead Management',
  description: 'Giao diện quản lý hồ sơ kiểm toán và yêu cầu tư vấn 1-on-1 của Striver AI'
}

export default function AdminPage() {
  return <AdminClient />
}
