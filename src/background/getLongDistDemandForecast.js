function getLongDistDemandForecast(
  scenarioType,
  long_dist_demand_forecast,
  long_dist_demand_forecast_path
) {
  if(scenarioType == "long_distance"){
    return "calc"
  }
  let longDistDemandForecast = "base";
  if (long_dist_demand_forecast && long_dist_demand_forecast.length > 0) {
    if (long_dist_demand_forecast == "path") {
      if (
        !long_dist_demand_forecast_path ||
        long_dist_demand_forecast_path.length < 1
      ) {
        alert("Please fill in long dist demand forecast path."); // Should never occur
        return;
      }
      longDistDemandForecast = long_dist_demand_forecast_path;
    } else {
      longDistDemandForecast = long_dist_demand_forecast;
    }
  }
  return longDistDemandForecast;
}

module.exports = { getLongDistDemandForecast };
