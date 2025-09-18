// app/api/publish/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Required environment variables (set in Vercel):
 * - GITHUB_TOKEN: a Personal Access Token (repo scope) that can write to your repo
 * - GITHUB_REPO: owner/repo (e.g. "johnnybassanelli/RABKL-newsroom-v2")
 * - PUBLISH_SECRET: a long random string to authenticate Manus calls
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "";
const PUBLISH_SECRET = process.env.PUBLISH_SECRET ?? "";

async function ghPutFile(path: string, contentBase64: string, message: string) {
  const [owner, repo] = GITHUB_REPO.split("/");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
    path
  )}`;

  // Check if file exists (to get sha for update)
  let sha: string | undefined;
  const getRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "rabkl-newsroom-agent",
    },
  });
  if (getRes.ok) {
    try {
      const js = await getRes.json();
      sha = js.sha;
    } catch {}
  }

  const body: any = { message, content: contentBase64 };
  if (sha) body.sha = sha;

  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "rabkl-newsroom-agent",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return { ok: putRes.ok, status: putRes.status, json: await putRes.json() };
}

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-publish-secret") ?? "";
    if (secret !== PUBLISH_SECRET) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const message =
      body.message ?? `news: automated publish ${new Date().toISOString()}`;
    const files: Array<any> = body.files ?? [];

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ ok: false, error: "No files provided" }, { status: 400 });
    }

    const results: any[] = [];
    for (const f of files) {
      if (!f.path) {
        results.push({ ok: false, error: "Missing path" });
        continue;
      }

      const contentBase64 = f.contentBase64
        ? f.contentBase64
        : Buffer.from(f.content ?? "", "utf8").toString("base64");

      try {
        const out = await ghPutFile(f.path, contentBase64, message);
        results.push({ path: f.path, ...out });
      } catch (err: any) {
        results.push({ path: f.path, ok: false, error: err.message });
      }
    }

    return NextResponse.json({ ok: true, files: results });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse(
    "Publish endpoint ready. Use POST with x-publish-secret header.",
    { status: 200 }
  );
}
