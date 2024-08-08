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
  const branchName =
    scope ||
    execSync(
      "git branch --contains HEAD | grep -v 'detached' | head -n 1 | sed 's/^[* ]*//'",
    )
      .toString()
      .trim();

  console.log({ branchName });

  if (branchName === "main") return "main";

  return sha1FromString(branchName);
}
