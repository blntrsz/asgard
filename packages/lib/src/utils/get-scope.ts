import { execSync } from "child_process";
import { Construct } from "constructs";
import { createHash } from "crypto";

function sha1FromString(input: string) {
  const hash = createHash("sha1");
  hash.update(input);
  return hash.digest("hex").substring(0, 8);
}

export function getScope(constructScope: Construct): "main" | string {
  const scope: string | undefined = constructScope.node.tryGetContext("scope");
  console.log({ scope });
  const branchName =
    scope || execSync("git branch --show-current").toString().trim();

  console.log({ branchName });

  if (branchName === "main") return "main";

  return sha1FromString(branchName);
}
