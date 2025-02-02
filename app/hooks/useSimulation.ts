import React, { useEffect, useState } from 'react';
import { JobReceipt } from '@/app/types';
import { StepOutcome, SurvivalEnvironment, SurvivalStats } from 'simiverse';
import { useSettings } from '../providers/settings';
import { generateDownloadLink } from '../lib/file';
import { generateImage } from '../lib/replicate';

const backgroundImages = [
  '/background.jpg',
  '/gates.jpg',
];

export function useSimulation() {
    const defaultEnv:SurvivalEnvironment = {
      year: 0,
      contributionFactor: 0.05,
      resourceDepletionRate: { food: 0.020, energy: 0.015, water: 0.010 },
      defectGainFactor: 0.1, 
      isGlobalCollapse: false,
    };

    const [envOpts, setEnvOpts] = useState<SurvivalEnvironment>(defaultEnv);
    const {settings} = useSettings();
    const [outcomes, setOutcomes] = useState<StepOutcome<SurvivalStats>['outcome'][]>([]);
    const [downloadLink, setDownloadLink] = useState<string | null>(null);
    const [status, setStatus] = useState<JobReceipt["status"] | null>(null);
    const isRunning = status === 'active';
    const [shouldUpdateBackgroud, setShouldUpdateBackground] = useState(false);
    const [aiBackgroundImgUrl, setAIBackgroundImgUrl] = useState<string|null>(null);

    // useEffect(() => {
    //   const updateBackgroud = async() => {
    //     const imageUrl = await generateImage("A dramatic space scene depicting a desolate Earth in the distance, with visible signs of resource depletion such as dim lights, barren landscapes, and reduced atmospheric glow. The foreground features a cosmic setting with an ominous dark nebula and scattered asteroid fragments, symbolizing the collapse of global resources. The colors should be dark and somber, emphasizing urgency and survival challenges in a futuristic and immersive style.");
    //     console.log({imageUrl})

    //     setAIBackgroundImgUrl(imageUrl)
    //   }
    //   if(shouldUpdateBackgroud){
    //     updateBackgroud()
    //   }
    // }, [shouldUpdateBackgroud])

    const updateInitialState = (newInitialState: SurvivalEnvironment) => {
      setEnvOpts(newInitialState);
    }

    const onStepComplete = async(outcome: StepOutcome<SurvivalStats>) => {
      setOutcomes((prev) => [...prev, outcome.outcome]);
        if((Object.values(outcome.outcome.globalResources).some(resource => resource < 100)) && !shouldUpdateBackgroud){
          setShouldUpdateBackground(true);
        } 
    };
    
    const reset =()=>{
      setStatus(null);
      setOutcomes([]);
      setDownloadLink(null);
    }

    const onStart = () => {
      setStatus('active');
    }

const onSimulationComplete = async(finalEnvironment: SurvivalEnvironment) => {
  try {
    const downloadLink = generateDownloadLink({outcomes, finalEnvironment}, "application/json");
    setDownloadLink(downloadLink);
    setStatus('completed');
  } catch (error) {
    console.error("Failed to process simulation data:", error);
    setStatus(null);
  }
};

  const onSimulationError = (error: Error | unknown) => {
    setStatus('failed');
    console.error("Error starting simulation:", error);
  }
    
  const startSimulation = async () => {
    if(isRunning)return;
      try {
        onStart();
        const streamRequest = new Request("/api/simulations/survival", {
          method: "POST",
          headers: {
            "Content-Type": "text/event-stream",
          },
          body: JSON.stringify({ envOpts, simOpts: settings.simulationOptions }),
        });
    
        const response = await fetch(streamRequest);
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message);
        }
    
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
    
        // Function to process each SSE message
        const processMessage = (message: string) => {
          try {
            const parsed = JSON.parse(message);
             if (parsed.outcome) {
              onStepComplete(parsed.outcome);
            }else if (parsed.type === "done") {
              onSimulationComplete(parsed.value);
            }
          } catch (error) {
            console.error("Error processing message:", error);
          }
        };
    
        // Read and process the SSE stream
        let buffer = "";
        while (reader) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
    
          buffer += decoder.decode(value, { stream: true });
          const messages = buffer.split("\n\n");
          buffer = messages.pop() || "";
    
          for (const message of messages) {
            const cleanedMessage = message.replace(/^data: /, "").trim();
            if (cleanedMessage) {
              processMessage(cleanedMessage);
            }
          }
        }
      } catch (error) {
        onSimulationError(error)
      }
    };

    const calculateStats = (outcomes: SurvivalStats[]) =>{
      const calculateCurrentStats = (index: number) => [
          { label: 'Cooperations', value: outcomes.slice(0, index).reduce((total, outcome) => total + (outcome.cooperations || 0), 0) },
          { label: 'Defects', value: outcomes.slice(0, index).reduce((total, outcome) => total + (outcome.defections || 0), 0) },
          { label: 'Nations', value: outcomes[index - 1]?.activeNations?? 0 },
          { label: 'Food', value: outcomes[index - 1]?.globalResources?.food ?? 0 },
          { label: 'Water', value: outcomes[index - 1]?.globalResources?.water ?? 0 },
          { label: 'Energy', value: outcomes[index - 1]?.globalResources?.energy ?? 0 },
          { label: 'Population', value: outcomes[index - 1]?.globalPopulation ?? 0 }          
      ];
  
      const stats = calculateCurrentStats(outcomes.length);
      const prevStats = calculateCurrentStats(outcomes.length - 1);
  
      return { stats, prevStats };
  }

  const {prevStats,stats} = React.useMemo(() => calculateStats(outcomes), [outcomes]);

    return {
      envOpts,
      outcomes,
      isRunning,
      downloadLink,
      prevStats,
      stats,
      aiBackgroundImgUrl,
      updateInitialState,
      startSimulation,
      reset
    };
}
