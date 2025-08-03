-- Add additional fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN avatar_url TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN location TEXT,
ADD COLUMN website TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
ADD COLUMN preferred_language TEXT DEFAULT 'he',
ADD COLUMN is_verified BOOLEAN DEFAULT false,
ADD COLUMN social_links JSONB DEFAULT '{}',
ADD COLUMN notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}';

-- Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);