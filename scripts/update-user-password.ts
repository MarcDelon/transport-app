import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kmjsdfxbbiefpnujutgj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttanNkZnhiYmllZnBudWp1dGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NTk1MzUsImV4cCI6MjA4MzIzNTUzNX0.397B_dFsuudXE6y6ivPNwC-NNDx3Jtv1i8t3QH-iqTo'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('❌ Usage: tsx scripts/update-user-password.ts <email> <nouveau-mot-de-passe>')
    process.exit(1)
  }

  // Vérifier si l'utilisateur existe
  const { data: user, error: findError } = await supabase
    .from('User')
    .select('id, email')
    .eq('email', email.trim().toLowerCase())
    .single()

  if (findError || !user) {
    console.error('❌ Utilisateur non trouvé avec cet email:', email)
    process.exit(1)
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10)

  // Mettre à jour le mot de passe
  const { error: updateError } = await supabase
    .from('User')
    .update({
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateError) {
    console.error('❌ Erreur lors de la mise à jour:', updateError)
    process.exit(1)
  }

  console.log('✅ Mot de passe mis à jour avec succès!')
  console.log('📧 Email:', email)
  console.log('🔑 Nouveau mot de passe:', password)
  console.log('\n💡 Vous pouvez maintenant vous connecter avec ces identifiants\n')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })

