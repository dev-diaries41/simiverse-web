'use server'
import { Metrics } from "devtilities";
import  {Nation, SimulationConfig, SurvivalEnvironment, SurvivalSimulation, SurvivalStats} from "simiverse";


export async function getSimulation(entities: Nation[] =[],  envOpts: Partial<SurvivalEnvironment> ={}, simOpts: Partial<SimulationConfig> = {}): Promise<SurvivalSimulation>{
    return new SurvivalSimulation(entities, envOpts, simOpts)
}

export async function getMetrics(data: SurvivalStats[]){
    const metrics = new Metrics<SurvivalStats>(data);

    //Calculate distributions for cooperations, defections, and globalPopulation by year:
    const performanceMetrics: (keyof SurvivalStats)[] = ['cooperations', 'defections', 'globalPopulation'];
    const groupingAttributes: (keyof SurvivalStats)[] = ['globalResources'];
    const distributions = metrics.calculateDistributionsForKeyMetrics(performanceMetrics, groupingAttributes);
    console.log(distributions);

    // This will calculate various statistics for each of these keys.
    const stats = metrics.calculateStats(['cooperations', 'defections', 'globalPopulation']);
    console.log(stats);

    //This will return the top 3 entries based on the highest number of cooperations.
    const topNCooperations = metrics.getTopN('cooperations', 3);
    console.log(topNCooperations);

    return {distributions, stats, topNCooperations}
}