const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
  global: {
    headers: {
      "X-Client-Info": "supabase-js-web",
    },
  },
});

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("registrations")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Supabase connection test failed:", error.message);
    } else {
      console.log("✅ Supabase connection successful");
    }
  } catch (error) {
    console.error("❌ Supabase connection error:", error.message);
  }
};

// Test connection on startup
testConnection();

module.exports = supabase;
