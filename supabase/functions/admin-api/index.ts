import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const SESSION_DURATION_HOURS = 24;

// Tables that support CRUD
const TABLES = [
  "projects", "categories", "services", "skills", "tools", "experience",
  "education", "certifications", "testimonials", "stats", "content_items",
  "social_links", "nav_items", "sections", "pages", "media",
  "analytics_events", "contact_submissions", "settings",
];

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifySession(authHeader: string | null): Promise<boolean> {
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  if (!token || token === "null" || token === "undefined") return false;
  const { data } = await admin
    .from("admin_sessions")
    .select("expires_at")
    .eq("token", token)
    .maybeSingle();
  if (!data) return false;
  if (new Date(data.expires_at) < new Date()) return false;
  return true;
}

async function handleAuth(action: string, body: any) {
  if (action === "login") {
    const { password } = body;
    if (!password) return jsonResponse({ error: "Password required" }, 400);

    const { data: config } = await admin
      .from("admin_config")
      .select("password_hash")
      .limit(1)
      .maybeSingle();
    if (!config) return jsonResponse({ error: "Admin not configured" }, 500);

    // Verify password using crypt comparison
    const { data: result } = await admin.rpc("verify_password", {
      password,
      hash: config.password_hash,
    }).then((r: any) => r).catch(() => ({ data: null }));

    // Fallback: use SQL if RPC not available
    let valid = false;
    if (result !== null && result !== undefined) {
      valid = result === true;
    } else {
      // Direct comparison via SQL
      const { data: check } = await admin
        .rpc("check_password", { input_password: password, stored_hash: config.password_hash });
      valid = check === true;
    }

    if (!valid) return jsonResponse({ error: "Invalid password" }, 401);

    // Create session
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);

    const { data: session, error } = await admin
      .from("admin_sessions")
      .insert({ expires_at: expiresAt.toISOString() })
      .select("token")
      .single();

    if (error) return jsonResponse({ error: "Session creation failed" }, 500);

    return jsonResponse({ token: session.token, expires_at: expiresAt.toISOString() });
  }

  if (action === "logout") {
    const { token } = body;
    if (token) {
      await admin.from("admin_sessions").delete().eq("token", token);
    }
    return jsonResponse({ success: true });
  }

  if (action === "verify") {
    const { token } = body;
    if (!token) return jsonResponse({ valid: false });
    const { data } = await admin
      .from("admin_sessions")
      .select("expires_at")
      .eq("token", token)
      .maybeSingle();
    if (!data) return jsonResponse({ valid: false });
    if (new Date(data.expires_at) < new Date()) return jsonResponse({ valid: false });
    return jsonResponse({ valid: true, expires_at: data.expires_at });
  }

  if (action === "change-password") {
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) return jsonResponse({ error: "Both passwords required" }, 400);

    const { data: config } = await admin
      .from("admin_config")
      .select("password_hash")
      .limit(1)
      .maybeSingle();
    if (!config) return jsonResponse({ error: "Admin not configured" }, 500);

    const { data: check } = await admin
      .rpc("check_password", { input_password: currentPassword, stored_hash: config.password_hash });
    if (check !== true) return jsonResponse({ error: "Current password incorrect" }, 401);

    const { error: hashError } = await admin.rpc("hash_password", { input_password: newPassword });
    if (hashError) return jsonResponse({ error: "Hashing failed" }, 500);

    // Get the hash via direct query
    const { data: newHash } = await admin.rpc("hash_password", { input_password: newPassword });

    await admin
      .from("admin_config")
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq("id", "a0000000-0000-0000-0000-000000000001");

    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: "Unknown auth action" }, 400);
}

async function handleCrud(
  method: string,
  table: string,
  body: any,
  id: string | null,
  searchParams: URLSearchParams
) {
  if (!TABLES.includes(table)) {
    return jsonResponse({ error: "Invalid table" }, 400);
  }

  // For settings, handle as key-value
  if (table === "settings") {
    if (method === "GET") {
      const { data, error } = await admin.from("settings").select("*");
      if (error) return jsonResponse({ error: error.message }, 500);
      const settings: Record<string, any> = {};
      data.forEach((row: any) => { settings[row.key] = row.value; });
      return jsonResponse({ data: settings });
    }
    if (method === "PUT" || method === "POST") {
      const { key, value } = body;
      if (!key || !value) return jsonResponse({ error: "key and value required" }, 400);
      const { error } = await admin
        .from("settings")
        .upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ success: true });
    }
  }

  if (method === "GET") {
    let query = admin.from(table).select("*");
    // For admin, return ALL items (including drafts/hidden)
    const requestedOrderBy = searchParams.get("order_by") || "sort_order";
    const orderBy = table === "pages" && requestedOrderBy === "sort_order" ? "created_at" : requestedOrderBy;
    const ascending = searchParams.get("ascending") !== "false";
    const { data, error } = await query.order(orderBy, { ascending });
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ data });
  }

  if (method === "POST") {
    const { data, error } = await admin.from(table).insert(body).select("*").single();
    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse({ data });
  }

  if (method === "PUT") {
    if (!id) return jsonResponse({ error: "ID required for update" }, 400);
    const updateBody = { ...body };
    if (updateBody.id) delete updateBody.id;
    if (updateBody.created_at) delete updateBody.created_at;
    const { data, error } = await admin.from(table).update(updateBody).eq("id", id).select("*").single();
    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse({ data });
  }

  if (method === "DELETE") {
    if (!id) return jsonResponse({ error: "ID required for delete" }, 400);
    const { error } = await admin.from(table).delete().eq("id", id);
    if (error) return jsonResponse({ error: error.message }, 400);
    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}

async function handleExport() {
  const tables = [
    "settings", "categories", "projects", "services", "skills", "tools",
    "experience", "education", "certifications", "testimonials", "stats",
    "content_items", "social_links", "nav_items", "sections", "pages", "media",
  ];
  const exportData: Record<string, any> = {};
  for (const table of tables) {
    const { data } = await admin.from(table).select("*");
    exportData[table] = data;
  }
  return jsonResponse({ data: exportData });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    // pathParts: ["admin-api", action_or_table, id]
    const segment = pathParts[1] || "";

    const body = req.method !== "GET" && req.method !== "DELETE" ? await req.json().catch(() => ({})) : {};

    // Auth routes don't require session
    if (segment === "auth") {
      return await handleAuth(body.action || "", body);
    }

    if (segment === "export") {
      const authHeader = req.headers.get("Authorization");
      if (!(await verifySession(authHeader))) return jsonResponse({ error: "Unauthorized" }, 401);
      return await handleExport();
    }

    // All other routes require session
    const authHeader = req.headers.get("Authorization");
    if (!(await verifySession(authHeader))) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    // CRUD routes: segment is table name, pathParts[2] is id
    if (TABLES.includes(segment)) {
      const id = pathParts[2] || null;
      return await handleCrud(req.method, segment, body, id, url.searchParams);
    }

    return jsonResponse({ error: `Unknown route: ${segment}` }, 404);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
});
