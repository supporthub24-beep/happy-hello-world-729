-- Inventory schema for plastic packaging business
-- Module 1: plastic film rolls (BOPP / CPP / PP)
-- Module 2: raw material granules (dana)

-- ============================================================
-- Shared: profiles (user data, never FK to auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- Shared: user_roles (roles never stored on profiles)
-- ============================================================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'staff',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- ============================================================
-- Module 1: film roll movements (incoming / outgoing)
-- Aggregated by roll_type + size + micron
-- ============================================================
CREATE TABLE public.film_roll_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction text NOT NULL CHECK (direction IN ('in', 'out')),
  roll_type text NOT NULL CHECK (roll_type IN ('BOPP', 'CPP', 'PP')),
  size text NOT NULL,
  micron numeric(10, 2) NOT NULL CHECK (micron > 0),
  weight_kg numeric(12, 3) NOT NULL CHECK (weight_kg > 0),
  supplier text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  movement_date date NOT NULL DEFAULT CURRENT_DATE,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_by_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX film_roll_movements_type_size_micron_idx
  ON public.film_roll_movements (roll_type, size, micron);
CREATE INDEX film_roll_movements_date_idx
  ON public.film_roll_movements (movement_date DESC);
CREATE INDEX film_roll_movements_direction_idx
  ON public.film_roll_movements (direction);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.film_roll_movements TO authenticated;
GRANT ALL ON public.film_roll_movements TO service_role;

ALTER TABLE public.film_roll_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view film roll movements"
  ON public.film_roll_movements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert film roll movements"
  ON public.film_roll_movements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update film roll movements"
  ON public.film_roll_movements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete film roll movements"
  ON public.film_roll_movements FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Module 2: granule movements (incoming / outgoing)
-- Aggregated by grade + batch
-- ============================================================
CREATE TABLE public.granule_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction text NOT NULL CHECK (direction IN ('in', 'out')),
  grade text NOT NULL,
  batch_number text NOT NULL,
  supplier text NOT NULL DEFAULT '',
  machine text NOT NULL DEFAULT '',
  weight_kg numeric(12, 3) NOT NULL CHECK (weight_kg > 0),
  notes text NOT NULL DEFAULT '',
  movement_date date NOT NULL DEFAULT CURRENT_DATE,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_by_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX granule_movements_grade_batch_idx
  ON public.granule_movements (grade, batch_number);
CREATE INDEX granule_movements_date_idx
  ON public.granule_movements (movement_date DESC);
CREATE INDEX granule_movements_direction_idx
  ON public.granule_movements (direction);
CREATE INDEX granule_movements_supplier_idx
  ON public.granule_movements (supplier);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.granule_movements TO authenticated;
GRANT ALL ON public.granule_movements TO service_role;

ALTER TABLE public.granule_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view granule movements"
  ON public.granule_movements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert granule movements"
  ON public.granule_movements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update granule movements"
  ON public.granule_movements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete granule movements"
  ON public.granule_movements FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- updated_at handling
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER film_roll_movements_set_updated_at
  BEFORE UPDATE ON public.film_roll_movements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER granule_movements_set_updated_at
  BEFORE UPDATE ON public.granule_movements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
