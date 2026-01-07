import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kmjsdfxbbiefpnujutgj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttanNkZnhiYmllZnBudWp1dGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NTk1MzUsImV4cCI6MjA4MzIzNTUzNX0.397B_dFsuudXE6y6ivPNwC-NNDx3Jtv1i8t3QH-iqTo'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  const email = process.argv[2] || 'admin@nova.com'
  const password = process.argv[3] || 'admin123'
  const nom = process.argv[4] || 'Admin'
  const prenom = process.argv[5] || 'NOVA'
  const telephone = process.argv[6] || '+237 6XX XXX XXX'

  // Vérifier si l'admin existe déjà
  const { data: existingAdmin } = await supabase
    .from('User')
    .select('id')
    .eq('email', email)
    .single()

  if (existingAdmin) {
    console.log('❌ Un utilisateur avec cet email existe déjà')
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  
  const { data: admin, error } = await supabase
    .from('User')
    .insert({
      email,
      password: hashedPassword,
      nom,
      prenom,
      telephone,
      role: 'ADMIN',
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
  
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


