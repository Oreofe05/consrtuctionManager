import test from "node:test";
import assert from "node:assert/strict";

test("BuildControl API package exposes expected scripts", async () => {
  const pkg = await import("../package.json", { with: { type: "json" } });
  assert.equal(pkg.default.scripts.start, "node server.js");
  assert.equal(pkg.default.type, "module");
});
