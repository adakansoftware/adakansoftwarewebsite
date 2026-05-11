const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3101";

const checks = [
  { path: "/", status: 200, htmlLang: "tr", includes: ["Hizmetler", "data-mobile-menu"] },
  { path: "/about", status: 200, htmlLang: "tr", includes: ["Hakkımızda"] },
  { path: "/en/about", status: 200, htmlLang: "en", includes: ["About", "/en/services"] },
  { path: "/tr/about", status: 307, location: "/about" },
];

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  const html = response.status === 200 ? await response.text() : "";

  return {
    status: response.status,
    location: response.headers.get("location"),
    html,
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const check of checks) {
  const result = await request(check.path);

  assert(
    result.status === check.status,
    `${check.path}: expected status ${check.status}, received ${result.status}`,
  );

  if (check.location) {
    assert(
      result.location === check.location,
      `${check.path}: expected redirect location ${check.location}, received ${result.location}`,
    );
  }

  if (check.htmlLang) {
    const langMatch = result.html.match(/<html lang="([^"]+)"/);
    assert(langMatch?.[1] === check.htmlLang, `${check.path}: expected html lang ${check.htmlLang}`);
  }

  if (check.includes) {
    for (const fragment of check.includes) {
      assert(result.html.includes(fragment), `${check.path}: missing expected fragment "${fragment}"`);
    }
  }
}

console.log(`Smoke checks passed for ${baseUrl}`);
