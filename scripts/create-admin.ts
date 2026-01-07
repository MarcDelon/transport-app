import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@transport.com'
  const password = process.argv[3] || 'admin123'
  const nom = process.argv[4] || 'Admin'
  const prenom = process.argv[5] || 'Système'
  const telephone = process.argv[6] || '+237 6XX XXX XXX'

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('❌ Un utilisateur avec cet email existe déjà')
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nom,
      prenom,
      telephone,
      role: 'ADMIN',
    },
  })
  
  console.log('✅ Admin créé avec succès!')
  console.log('📧 Email:', email)
  console.log('🔑 Mot de passe:', password)
  console.log('👤 Nom:', `${prenom} ${nom}`)
  console.log('📱 Téléphone:', telephone)
  console.log('\n⚠️  N\'oubliez pas de changer le mot de passe après la première connexion!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
