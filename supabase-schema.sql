-- Schema Setup for CostaLAB E-commerce
-- Run this script in your Supabase SQL Editor

-- 1. PROFILES (Extending Supabase Auth Users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  origin TEXT, -- Origem do cliente (pesquisa/instagram/etc)
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  team TEXT, -- Time de futebol/esporte
  collection TEXT,
  category TEXT CHECK (category IN ('MASC', 'FEM', 'UNISSEX', 'INFANTIL', 'ACCESSORIES')),
  year INT DEFAULT EXTRACT(YEAR FROM NOW()),
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2), -- for profit calculation
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INVENTORY
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  size TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  status TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN quantity = 0 THEN 'SEM ESTOQUE'
      WHEN quantity <= 5 THEN 'BAIXO ESTOQUE'
      ELSE 'EM ESTOQUE'
    END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, size)
);

-- 4. SUPPLIERS
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  material_type TEXT,
  phone TEXT,
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STOCK INBOUND (ENTRADAS)
CREATE TABLE inbound_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  supplier_id UUID REFERENCES suppliers(id),
  lead_time_days INT,
  quantity_ordered INT NOT NULL,
  status TEXT DEFAULT 'SOLICITADO' CHECK (status IN ('SOLICITADO', 'EM TRÂNSITO', 'CONCLUÍDO', 'CANCELADO')),
  order_date TIMESTAMPTZ DEFAULT NOW(),
  received_date TIMESTAMPTZ
);

-- 5.5 CUSTOMERS (Offline CRM para a loja)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  origin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SALES / ORDERS
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  total_amount DECIMAL(10,2) NOT NULL,
  profit DECIMAL(10,2),
  status TEXT DEFAULT 'AGUARDANDO PAGAMENTO' CHECK (status IN ('AGUARDANDO PAGAMENTO', 'PAGO', 'ENTREGUE', 'CANCELADO', 'PENDENTE')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.5 ORDER ITEMS (Produtos de cada venda)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  size TEXT NOT NULL,
  quantity INT NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL
);



-- 8. LOGISTICS / TRACKING
CREATE TABLE tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) UNIQUE,
  carrier TEXT,
  tracking_number TEXT,
  shipped_date TIMESTAMPTZ,
  delivery_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. PRODUCTS (Public Read, Admin Write)
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can do everything on products" ON products FOR ALL USING (is_admin());

-- 2. INVENTORY (Public Read, Admin Write)
CREATE POLICY "Public can view inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Admins can do everything on inventory" ON inventory FOR ALL USING (is_admin());

-- 3. PROFILES (Users Read/Update own, Admins All)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can do everything on profiles" ON profiles FOR ALL USING (is_admin());

-- 4. SALES (Users Read own, Admins All/Update)
CREATE POLICY "Users can view own sales" ON sales FOR SELECT USING (customer_id = auth.uid() OR is_admin());
CREATE POLICY "Users can create sales" ON sales FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Admins can update sales" ON sales FOR UPDATE USING (is_admin());

-- 5. OTHER TABLES (Admins Only)
CREATE POLICY "Admins only access suppliers" ON suppliers FOR ALL USING (is_admin());
CREATE POLICY "Admins only access inbound" ON inbound_orders FOR ALL USING (is_admin());
CREATE POLICY "Admins only access tracking" ON tracking FOR ALL USING (is_admin());
-- Customers can view tracking for their own sales
CREATE POLICY "Customers can view own tracking" ON tracking FOR SELECT USING (
  EXISTS (SELECT 1 FROM sales WHERE sales.id = tracking.sale_id AND sales.customer_id = auth.uid())
);


-- ==========================================
-- BUSINESS RULES (TRIGGERS)
-- ==========================================

-- Rule: Cannot delete inventory item if quantity is 0 (it must stay for history)
CREATE OR REPLACE FUNCTION prevent_zero_inventory_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.quantity = 0 THEN
    RAISE EXCEPTION 'Não é permitido excluir um item de estoque com quantidade 0. Ele deve permanecer no histórico como SEM ESTOQUE.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_inventory_deletion
BEFORE DELETE ON inventory
FOR EACH ROW
EXECUTE FUNCTION prevent_zero_inventory_deletion();

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================

-- Create the 'products' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to products bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'products' );

-- Allow authenticated users to upload to products bucket
CREATE POLICY "Auth Insert" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'products' AND auth.role() = 'authenticated' );

-- ==========================================
-- AUTOMATION & TRIGGERS (PROFILES)
-- ==========================================

-- Trigger to safely create a normal profile when a user signs up.
-- Because this runs on PostgreSQL it skips RLS and guarantees delivery without waiting for Email Verifications!
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Cliente'), 
    new.raw_user_meta_data->>'phone',
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- ADMIN CREATION BYPASS (One-time execute)
-- ==========================================
DO $$
DECLARE
  admin_uid UUID := gen_random_uuid();
BEGIN
-- 2. CREATE ADMIN ACCOUNT OR UPDATE EXISTING
DO $$
DECLARE
  admin_uid UUID;
BEGIN
  -- Verify if admin already exists
  SELECT id INTO admin_uid FROM auth.users WHERE email = 'admin@admin.com';
  
  IF admin_uid IS NULL THEN
    admin_uid := gen_random_uuid();
    
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (
      admin_uid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@admin.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Chefe Administrador"}',
      now(),
      now()
    );
  END IF;

  -- 3. Promote to 'admin'
  UPDATE public.profiles SET role = 'admin' WHERE id = admin_uid;
END $$;
