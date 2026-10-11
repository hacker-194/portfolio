/**
 * The four capabilities the hero core presents.
 *
 * One source for both renderings, the same reason `lib/visuals.ts` exists for
 * the project schematics: the nodes in the WebGL sculpture and the index in the
 * DOM read from here, so the figure and its accessible twin cannot drift apart.
 *
 * `status` keeps the honesty the rest of the page holds to. The modelling work
 * and PyTorch are recorded in the CV. The LLM and agentic areas are the study
 * that sits on top of it. Computer Vision is recorded nowhere, so it is listed
 * as a direction rather than as work.
 */

export type CoreNodeStatus = "In practice" | "Active study" | "Direction";

export type CoreNode = {
  id: string;
  label: string;
  status: CoreNodeStatus;
  /** One sentence, shown in the panel. */
  blurb: string;
  /** Three keywords for the panel's footer. */
  keywords: readonly [string, string, string];
  /**
   * Position on the ring, in degrees, so the sculpture layout is data rather
   * than a literal buried in the scene.
   */
  angle: number;
};

export const CORE_NODES: readonly CoreNode[] = [
  {
    id: "deep-learning",
    label: "Deep Learning",
    status: "In practice",
    blurb:
      "Training loops, architectures and evaluation, in PyTorch. The base the rest of the work stands on.",
    keywords: ["PyTorch", "Training loops", "Evaluation"],
    angle: 40,
  },
  {
    id: "llms",
    label: "LLMs",
    status: "Active study",
    blurb:
      "Transformers, tokenisation and retrieval, studied on top of the modelling base rather than beside it.",
    keywords: ["Transformers", "RAG", "Fine-tuning"],
    angle: 130,
  },
  {
    id: "vision",
    label: "Computer Vision",
    status: "Direction",
    blurb:
      "Image models and the visual side of a pipeline. Stated as a direction, because the CV records no work here yet.",
    keywords: ["Image models", "Vision", "Evaluation"],
    angle: 220,
  },
  {
    id: "agentic",
    label: "Agentic AI",
    status: "Active study",
    blurb:
      "Tool use, planning loops and orchestration around a model, which is where the serving work is headed.",
    keywords: ["Tool use", "Planning", "Orchestration"],
    angle: 310,
  },
];
