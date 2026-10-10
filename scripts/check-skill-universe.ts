/**
 * The one runnable check behind the skill universe.
 *
 *   node --experimental-strip-types scripts/check-skill-universe.ts
 *
 * It fails when a node names a skill the CV never records, when a link joins a
 * node that does not exist, when a node is left with no connections, or when the
 * layout produces a position that cannot be framed. Everything else about the
 * figure is decoration. This is the part that has to stay true, and it is what
 * stops the universe from quietly growing a skill nobody can back up.
 */
import {
  SKILL_LINKS,
  SKILL_NODES,
  UNIVERSE_EXTENT,
  evidenceFor,
  universeIssues,
} from "../lib/skill-universe.ts";

const issues = universeIssues();

console.log(
  `nodes ${SKILL_NODES.length}  links ${SKILL_LINKS.length}  extent ${UNIVERSE_EXTENT.toFixed(0)}`,
);

for (const node of SKILL_NODES) {
  const evidence = evidenceFor(node);
  const sources = [
    `${evidence.projects.length} case studies`,
    `${evidence.roles.length} roles`,
    `${evidence.coursework.length} coursework`,
    `${evidence.study.length} study`,
    `${evidence.pillars.length} pillars`,
    evidence.declared ? "declared" : "not declared",
  ].join("  ");

  console.log(
    `  ${node.label.padEnd(18)} ${evidence.standingLabel.padEnd(14)} ${sources}`,
  );
}

if (issues.length > 0) {
  console.error("\nFAIL");
  for (const issue of issues) console.error(`  ${issue}`);
  process.exit(1);
}

console.log("\nOK: every node is connected and recorded in the CV data");
