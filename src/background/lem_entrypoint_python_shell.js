const ps = require('python-shell');
const {ipcRenderer} = require('electron');
const { getLongDistDemandForecast } = require('./getLongDistDemandForecast.js');

module.exports = {

  runInputValidationPythonShell: function (worker, allRunParameters, onEndCallback) {

    // Make sure worker isn't overridden (and if so, abort the run)
    if (worker) {
      alert("Worker already in progress."); // Should never occur
      return;
    }

    let longDistDemandForecast = getLongDistDemandForecast(allRunParameters[0].long_dist_demand_forecast,  allRunParameters[0].long_dist_demand_forecast_path);

    // Start model-system's lem_validate_inputfiles.py in shell with EMME's python interpreter
    worker = new ps.PythonShell(
      `${allRunParameters[0].helmet_scripts_path}/lem_validate_inputfiles.py`,
      {
        mode: 'json',
        pythonPath: allRunParameters[0].emme_python_path,
        pythonOptions: ['-u'], // unbuffered
        args: [
          "--log-level", allRunParameters[0].log_level,
          "--log-format", "JSON",
          "--baseline-data-path", allRunParameters[0].base_data_folder_path,
          "--results-path", allRunParameters[0].results_data_folder_path,
          "--scenario-name", allRunParameters[0].name,
          "--cost-data-paths", allRunParameters[0].costDataPath,
          "--long-dist-demand-forecast", longDistDemandForecast,
        ]
          .concat(["--emme-paths"]).concat(allRunParameters.map(p => p.project_folder))
          .concat(["--first-scenario-ids"]).concat(allRunParameters.map(p => p.first_scenario_id))
          .concat(["--forecast-data-paths"]).concat(allRunParameters.map(p => p.forecast_data_path))
          .concat(allRunParameters.map(p => p.separate_emme_scenarios).every(Boolean) ? ["--separate-emme-scenarios"] : [])
          .concat(["--submodel"]).concat(allRunParameters.map(p => p.submodel))
      });
    // Attach runtime handlers (stdout/stderr, process errors)
    worker.on('message', (event) => ipcRenderer.send('loggable-event-from-worker', {...event, time: new Date()}));
    worker.on('stderr', (event) => ipcRenderer.send('loggable-event-from-worker', {...event, time: new Date()}));
    worker.on('error', (error) => ipcRenderer.send('process-error-from-worker', error));

    // Attach end handler
    worker.end((err, code, signal) => {
      worker = null;
      if (err) {
        ipcRenderer.send('process-error-from-worker', err.message);
      }
      onEndCallback(err);
    });

    // Return worker, because the original reference isn't in use when assigning local worker var to new PythonShell().
    return worker;
  },

  runLemEntrypointPythonShell: function (worker, runParameters, onEndCallback) {

    // Make sure worker isn't overridden (and if so, abort the run)
    if (worker) {
      alert("Worker already in progress."); // Should never occur
      return;
    }

    let longDistDemandForecast = getLongDistDemandForecast(runParameters.long_dist_demand_forecast,  runParameters.long_dist_demand_forecast_path);
    // Start lem-model-system's lem.py in shell with EMME's python interpreter
    worker = new ps.PythonShell(
      `${runParameters.helmet_scripts_path}/lem.py`,
      {
        mode: 'json',
        pythonPath: runParameters.emme_python_path,
        pythonOptions: ['-u'], // unbuffered
        args: [
          "--log-level", runParameters.log_level,
          "--log-format", "JSON",
          "--scenario-name", runParameters.name,
          "--results-path", runParameters.results_data_folder_path,
          "--emme-path", runParameters.project_folder,
          "--first-scenario-id", runParameters.first_scenario_id,
          "--baseline-data-path", runParameters.base_data_folder_path,
          "--cost-data-path", runParameters.costDataPath,
          "--forecast-data-path", runParameters.forecast_data_path,
          "--first-matrix-id", (runParameters.first_matrix_id == null ? "100" : runParameters.first_matrix_id),
          "--iterations", runParameters.iterations,
          "--long-dist-demand-forecast", longDistDemandForecast
        ]
          .concat(runParameters.end_assignment_only ? ["--end-assignment-only"] : [])
          .concat(runParameters.delete_strategy_files == true | runParameters.delete_strategy_files == null ? ["--del-strat-files"] : [])
          .concat(runParameters.separate_emme_scenarios ? ["--separate-emme-scenarios"] : [])
          .concat(runParameters.save_matrices_in_emme ? ["--save-emme-matrices"] : [])
          .concat(runParameters.stored_speed_assignment ? ["--stored-speed-assignment"] : [])
          .concat(runParameters.submodel ? ["--submodel", runParameters.submodel] : [])
          .concat(runParameters.freight_matrix_path && runParameters.freight_matrix_path != "" ? ["--freight-matrix-path", runParameters.freight_matrix_path] : [])
      });

    // Attach runtime handlers (stdout/stderr, process errors)
    worker.on('message', (event) => ipcRenderer.send('loggable-event-from-worker', {...event, time: new Date()}));
    worker.on('stderr', (event) => ipcRenderer.send('loggable-event-from-worker', {...event, time: new Date()}));
    worker.on('error', (error) => ipcRenderer.send('process-error-from-worker', error));

    // Attach end handler
    worker.end((err, code, signal) => {
      worker = null;
      if (err) {
        ipcRenderer.send('process-error-from-worker', err.message);
      }
      onEndCallback();
    });

    // Return worker, because the original reference isn't in use when assigning local worker var to new PythonShell().
    return worker;
  }
};
