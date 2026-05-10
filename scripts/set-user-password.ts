import { createClient } from "@supabase/supabase-js";

const [, , email, password] = process.argv;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

if (!email || !password) {
  console.error("Usage: SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/set-user-password.ts user@example.com new-password");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const main = async () => {
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error(listError.message);
    process.exit(1);
  }

  const user = users.users.find((candidate) => candidate.email?.toLocaleLowerCase() === email.toLocaleLowerCase());

  if (!user) {
    console.error(`No Supabase Auth user found for ${email}.`);
    process.exit(1);
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true
  });

  if (updateError) {
    console.error(updateError.message);
    process.exit(1);
  }

  console.log(`Password updated for ${email}.`);
};

main();
