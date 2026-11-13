import { getDb } from "@/db";
import { waitlistSignups } from "@/db/schema";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4096;
const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

class RequestFailure extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function respond(body: object, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function success() {
  return respond({ ok: true, message: "You’re on the list." });
}

async function readPayload(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    throw new RequestFailure(413, "Please keep your submission short.");
  }

  if (!request.body) {
    throw new RequestFailure(400, "Please enter your name and email address.");
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";

  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestFailure(413, "Please keep your submission short.");
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof RequestFailure) throw error;
    throw new RequestFailure(400, "Please submit a valid name and email address.");
  } finally {
    reader.releaseLock();
  }
}

function validEmail(email: string) {
  if (email.length > 254) return false;
  const separator = email.lastIndexOf("@");
  if (separator < 1) return false;
  const local = email.slice(0, separator);
  const domain = email.slice(separator + 1);
  return (
    local.length <= 64 &&
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(
      domain,
    )
  );
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (
      request.headers.get("sec-fetch-site") === "cross-site" ||
      (origin !== null && origin !== new URL(request.url).origin)
    ) {
      throw new RequestFailure(403, "Please join the waitlist from this website.");
    }

    const contentType = request.headers.get("content-type")?.split(";")[0].trim();
    if (contentType !== "application/json") {
      throw new RequestFailure(415, "Please submit the waitlist form on this page.");
    }

    const payload = await readPayload(request);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new RequestFailure(400, "Please enter your name and email address.");
    }

    const fields = payload as Record<string, unknown>;
    if (typeof fields.website === "string" && fields.website.trim()) {
      return success();
    }
    if (fields.website !== undefined && typeof fields.website !== "string") {
      throw new RequestFailure(400, "Please submit a valid waitlist form.");
    }

    const name = typeof fields.name === "string" ? fields.name.normalize("NFC").trim() : "";
    const email = typeof fields.email === "string" ? fields.email.trim().toLowerCase() : "";

    if (!name || Array.from(name).length > 100 || /[\u0000-\u001f\u007f\u2028\u2029]/.test(name)) {
      throw new RequestFailure(400, "Please enter a name between 1 and 100 characters.");
    }
    if (!validEmail(email)) {
      throw new RequestFailure(400, "Please enter a valid email address.");
    }

    try {
      await getDb()
        .insert(waitlistSignups)
        .values({ id: crypto.randomUUID(), name, email, createdAt: new Date() })
        .onConflictDoNothing({ target: waitlistSignups.email });
    } catch {
      console.error("Waitlist storage is temporarily unavailable.");
      return respond(
        { ok: false, error: "We couldn’t save your place just yet. Please try again." },
        503,
      );
    }

    return success();
  } catch (error) {
    if (error instanceof RequestFailure) {
      return respond({ ok: false, error: error.message }, error.status);
    }
    return respond({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
}
