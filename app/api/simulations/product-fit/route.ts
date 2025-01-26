import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/lib/requests";
import { getSimulation } from "@/app/lib/simulations";
import { SimulationConfig, StepOutcome, SurvivalEnvironment, SurvivalSimulation, SurvivalStats } from "simiverse";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { envOpts, simOpts } = (await req.json()) as {
      envOpts: Partial<SurvivalEnvironment>;
      simOpts: Partial<SimulationConfig>;
    };


    const stream = new ReadableStream({
      async start(controller) {
        const onStepComplete = (outcome: StepOutcome) => {
          const message = `data: ${JSON.stringify({ outcome })}\n\n`;
          controller.enqueue(message);
        };

        const sim = await getSimulation(SurvivalSimulation.generateNations(9), envOpts, { ...simOpts, onStepComplete});
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
