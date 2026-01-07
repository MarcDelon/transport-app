/**
 * Script pour encoder correctement la DATABASE_URL
 * 
 * Utilisation:
 * node scripts/fix-database-url.js "votre-mot-de-passe-avec-caracteres-speciaux"
 * 
 * Ou modifiez les variables ci-dessous et exécutez le script
 */

const password = process.argv[2] || 'VOTRE_MOT_DE_PASSE_ICI'
const projectRef = 'kmjsdfxbbiefpnujutgj' // Votre référence de projet Supabase
const region = 'eu-central-1' // Modifiez selon votre région (ex: us-east-1, eu-west-1, etc.)

// Encoder le mot de passe pour l'URL
const encodedPassword = encodeURIComponent(password)

// Générer l'URL de connexion
const databaseUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-${region}.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1`

console.log('\n✅ URL de connexion générée :\n')
console.log(databaseUrl)
console.log('\n📋 Copiez cette ligne dans votre fichier .env :\n')
console.log(`DATABASE_URL="${databaseUrl}"`)
console.log('\n⚠️  Important :')
console.log('- Si votre mot de passe contient des caractères spéciaux (@, #, $, %, &, etc.), ils seront automatiquement encodés')
console.log('- Assurez-vous que le fichier .env existe à la racine du projet')
console.log('- Redémarrez le serveur après avoir modifié .env\n')


