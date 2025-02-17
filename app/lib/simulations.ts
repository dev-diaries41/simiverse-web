'use server'
import  {Nation, SimulationConfig, SurvivalEnvironment, SurvivalSimulation} from "simiverse";

export async function getSimulation(entities: Nation[] =[],  envOpts: Partial<SurvivalEnvironment> ={}, simOpts: Partial<SimulationConfig> = {}): Promise<SurvivalSimulation>{
    return new SurvivalSimulation(entities, envOpts, simOpts)
}
