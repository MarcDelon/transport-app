-- Script pour désactiver ou ajuster RLS pour NextAuth
-- Exécutez ce script dans le SQL Editor de Supabase après avoir créé les tables

-- Option 1 : Désactiver complètement RLS (recommandé pour NextAuth)
-- Cela permet à votre application Next.js de gérer l'authentification et les permissions

ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Trajet" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Vehicule" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Conducteur" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Horaire" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Reservation" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Paiement" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Abonnement" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Reduction" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Bagage" DISABLE ROW LEVEL SECURITY;

-- Option 2 : Si vous préférez garder RLS activé mais avec des politiques permissives
-- (Décommentez les lignes ci-dessous et commentez l'option 1)

-- Supprimer les anciennes politiques
-- DROP POLICY IF EXISTS "Users can view their own data" ON "User";
-- DROP POLICY IF EXISTS "Admins can insert users" ON "User";
-- DROP POLICY IF EXISTS "Users can update their own data" ON "User";
-- DROP POLICY IF EXISTS "Anyone can view trajets" ON "Trajet";
-- DROP POLICY IF EXISTS "Only admins can modify trajets" ON "Trajet";
-- DROP POLICY IF EXISTS "Anyone can view vehicules" ON "Vehicule";
-- DROP POLICY IF EXISTS "Only admins can modify vehicules" ON "Vehicule";
-- DROP POLICY IF EXISTS "Anyone can view conducteurs" ON "Conducteur";
-- DROP POLICY IF EXISTS "Only admins can modify conducteurs" ON "Conducteur";
-- DROP POLICY IF EXISTS "Anyone can view horaires" ON "Horaire";
-- DROP POLICY IF EXISTS "Only admins can modify horaires" ON "Horaire";
-- DROP POLICY IF EXISTS "Users can view their own reservations" ON "Reservation";
-- DROP POLICY IF EXISTS "Users can create reservations" ON "Reservation";
-- DROP POLICY IF EXISTS "Users can update their own reservations" ON "Reservation";
-- DROP POLICY IF EXISTS "Users can view their own payments" ON "Paiement";
-- DROP POLICY IF EXISTS "Users can create payments" ON "Paiement";
-- DROP POLICY IF EXISTS "Users can view their own abonnements" ON "Abonnement";
-- DROP POLICY IF EXISTS "Users can create abonnements" ON "Abonnement";
-- DROP POLICY IF EXISTS "Anyone can view reductions" ON "Reduction";
-- DROP POLICY IF EXISTS "Only admins can modify reductions" ON "Reduction";
-- DROP POLICY IF EXISTS "Users can view their own bagages" ON "Bagage";
-- DROP POLICY IF EXISTS "Users can create bagages" ON "Bagage";

-- Créer des politiques permissives (tout le monde peut tout faire - NextAuth gère les permissions)
-- CREATE POLICY "Allow all for authenticated users" ON "User" FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON "Trajet" FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON "Vehicule" FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON "Conducteur" FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON "Horaire" FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON "Reservation" FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON "Paiement" FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON "Abonnement" FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON "Reduction" FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all for authenticated users" ON "Bagage" FOR ALL USING (true) WITH CHECK (true);


