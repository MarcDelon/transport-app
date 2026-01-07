import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('❌ Usage: tsx scripts/hash-password.ts <mot-de-passe>')
  process.exit(1)
}

bcrypt.hash(password, 10).then(hash => {
  console.log('\n✅ Hash généré :\n')
  console.log(hash)
  console.log('\n📋 Copiez ce hash dans Supabase pour le champ "password" de votre utilisateur\n')
  console.log('💡 Pour mettre à jour dans Supabase :')
  console.log('   1. Allez dans Table Editor → User')
  console.log('   2. Trouvez votre utilisateur')
  console.log('   3. Remplacez le champ "password" par le hash ci-dessus')
  console.log('   4. Sauvegardez\n')
})

