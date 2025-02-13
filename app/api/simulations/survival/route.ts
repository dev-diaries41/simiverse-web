import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/lib/requests";
import { getSimulation } from "@/app/lib/simulations";
import { SimulationConfig, SurvivalStats, SurvivalEnvironment, StepOutcome } from "simiverse";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { envOpts, simOpts } = (await req.json()) as {
      envOpts: Partial<SurvivalEnvironment>;
      simOpts: Partial<SimulationConfig>;
    };

    const stream = new ReadableStream({
      async start(controller) {
        const onStepComplete = (outcome: StepOutcome<SurvivalStats>) => {
          const message = `data: ${JSON.stringify({ outcome })}\n\n`;
          console.log(outcome)
          controller.enqueue(message);
        };

        const sim = await getSimulation([], envOpts, { ...simOpts, onStepComplete: onStepComplete as (StepOutcome: Record<string, any>) => void});
        const finalEnvironment = await sim.run();
        controller.enqueue(`data: ${JSON.stringify({ type: "done", value: finalEnvironment })}\n\n`);
        controller.close();
      },
    });

    // Return the response with the SSE stream headers
    return new NextResponse(stream, {
       headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
    });
  } catch (error: any) {
    return handleError(error);
  }
}
