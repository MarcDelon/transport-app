-- ============================================================================
-- CORRECTION DES POLITIQUES RLS POUR LA TABLE SIEGE
-- ============================================================================
-- Les politiques actuelles utilisent auth.uid() qui ne fonctionne pas
-- avec l'API Next.js côté serveur. On va les adapter.

-- 1. SUPPRIMER LES ANCIENNES POLITIQUES
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view sieges" ON "Siege";
DROP POLICY IF EXISTS "Users can create sieges for their reservations" ON "Siege";
DROP POLICY IF EXISTS "Only admins can modify sieges" ON "Siege";

-- 2. CRÉER DE NOUVELLES POLITIQUES PLUS PERMISSIVES
-- ============================================================================

-- Permettre à tout le monde de voir les sièges (nécessaire pour l'affichage)
CREATE POLICY "Allow public read access to sieges"
ON "Siege"
FOR SELECT
USING (true);

-- Permettre l'insertion de sièges (sera contrôlé par l'API)
CREATE POLICY "Allow insert sieges"
ON "Siege"
FOR INSERT
WITH CHECK (true);

-- Permettre la mise à jour des sièges (sera contrôlé par l'API)
CREATE POLICY "Allow update sieges"
ON "Siege"
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Permettre la suppression des sièges (sera contrôlé par l'API)
CREATE POLICY "Allow delete sieges"
ON "Siege"
FOR DELETE
USING (true);

-- 3. MÊME CHOSE POUR ConfigurationVehicule
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view configurations" ON "ConfigurationVehicule";
DROP POLICY IF EXISTS "Only admins can modify configurations" ON "ConfigurationVehicule";

CREATE POLICY "Allow public read access to configurations"
ON "ConfigurationVehicule"
FOR SELECT
USING (true);

CREATE POLICY "Allow insert configurations"
ON "ConfigurationVehicule"
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update configurations"
ON "ConfigurationVehicule"
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete configurations"
ON "ConfigurationVehicule"
FOR DELETE
USING (true);

-- 4. VÉRIFICATION
-- ============================================================================
-- Lister toutes les politiques sur Siege
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('Siege', 'ConfigurationVehicule')
ORDER BY tablename, policyname;
