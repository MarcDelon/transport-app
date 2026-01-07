/**
 * Script pour obtenir facilement la connection string Supabase
 * 
 * Ce script vous guide pour obtenir la bonne URL de connexion
 */

console.log('\n📋 Guide pour obtenir votre DATABASE_URL Supabase\n')
console.log('=' .repeat(60))
console.log('\n1. Allez sur votre projet Supabase :')
console.log('   https://kmjsdfxbbiefpnujutgj.supabase.co\n')
console.log('2. Cliquez sur Settings (⚙️) en bas à gauche\n')
console.log('3. Cliquez sur "Database" dans le menu de gauche\n')
console.log('4. Faites défiler jusqu\'à "Connection string"\n')
console.log('5. Sélectionnez "URI" (pas Connection pooling)\n')
console.log('6. Vous verrez une URL comme :')
console.log('   postgresql://postgres.kmjsdfxbbiefpnujutgj:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres\n')
console.log('7. Remplacez [YOUR-PASSWORD] par votre mot de passe Supabase\n')
console.log('8. Copiez l\'URL complète dans votre fichier .env :')
console.log('   DATABASE_URL="votre-url-complete"\n')
console.log('=' .repeat(60))
console.log('\n💡 Astuce : Si votre mot de passe contient des caractères spéciaux,')
console.log('   utilisez : node scripts/fix-database-url.js "votre-mot-de-passe"\n')
console.log('📝 Pour réinitialiser votre mot de passe :')
console.log('   Settings > Database > Database password > Reset database password\n')


