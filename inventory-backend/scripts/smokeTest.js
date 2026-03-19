import assert from "node:assert/strict";
import http from "node:http";

import app from "../app.js";

const runSmokeTest = async () => {
  const server = http.createServer(app);

  try {
    await new Promise((resolve) => server.listen(0, resolve));

    const address = server.address();

    const result = await new Promise((resolve, reject) => {
      const request = http.get(
        `http://127.0.0.1:${address.port}/api/health`,
        (response) => {
          let body = "";

          response.setEncoding("utf8");
          response.on("data", (chunk) => {
            body += chunk;
          });
          response.on("end", () => {
            resolve({
              statusCode: response.statusCode,
              body: JSON.parse(body),
            });
          });
        }
      );

      request.on("error", reject);
    });

    assert.equal(result.statusCode, 200);
    assert.equal(result.body.success, true);
    assert.equal(result.body.message, "Server is healthy");

    console.log("Smoke test passed");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
};

runSmokeTest().catch((error) => {
  console.error("Smoke test failed:", error.message);
  process.exit(1);
});
