-- 1. Create the transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES auth.users NOT NULL,
    amount      DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    type        TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    category    TEXT NOT NULL,
    description TEXT,
    date        DATE NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies — each user can only access their own data
CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date    ON public.transactions (date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions (user_id, date);
