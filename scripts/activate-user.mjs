import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function activate() {
  const email = 'hungtiger1375@gmail.com'
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.log('KHONG_TIM_THAY_USER')
    return
  }

  console.log(`Tìm thấy user: ${user.email} (ID: ${user.id}), isPaid trước đó: ${user.isPaid}`)

  const updated = await prisma.user.update({
    where: { email },
    data: { isPaid: true }
  })

  console.log(`ĐÃ_KÍCH_HOẠT_THÀNH_CÔNG: ${updated.email}, isPaid hiện tại: ${updated.isPaid}`)
}

activate()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
