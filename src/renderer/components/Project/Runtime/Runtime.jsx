import React from 'react';
const _ = require('lodash');

const Runtime = ({
  projectPath, resultsPath, scenarios, scenarioIDsToRun, runningScenarioID, openScenarioID, deleteScenario,
  setOpenScenarioID,
  reloadScenarios,
  handleClickScenarioToActive, handleClickNewScenario,
  handleClickStartStop, logArgs, duplicateScenario, openCreateEmmeProject, addNewSetting
}) => {

  const visibleTooltipProperties = [
    'first_scenario_id',
    'first_matrix_id',
    'forecast_data_folder_path',
    'save_matrices_in_emme',
    'end_assignment_only',
    'delete_strategy_files',
    'id',
    'name',
    'submodel',
    'iterations',
    'separate_emme_scenarios',
    'long_dist_demand_forecast',
    'stored_speed_assignment',
    'overriddenProjectSettings'
];

  const areGlobalSettingsOverridden = (settings) => {
    return _.filter(settings, settingValue => settingValue != null).length > 0;
  }

  const getPropertyForDisplayString = (settingProperty) => {
    const [key, value] = settingProperty

    if(typeof value === 'string') {
      const trimmedStringValue = value.length > 30 ? "..." + value.substring(value.length-30) : value;
      return `${key} : ${trimmedStringValue}`
    }

    return `${key} : ${value}`
  };

  const parseDemandConvergenceLogMessage = (message) => {
    const stringMsgArray = message.split(' ');
    return { iteration: stringMsgArray[stringMsgArray.length - 3], value: stringMsgArray[stringMsgArray.length - 1]};
  };

  const activeScenarios = scenarios.filter((scenario) => scenarioIDsToRun.includes(scenario.id))
  const runningScenario = activeScenarios.filter((scenario) => scenario.id === runningScenarioID);

  const getResultsPathFromLogfilePath = (logfilePath) => {
    console.log(logfilePath.replace(/\/[^\/]+$/, ''));
    return logfilePath.replace(/\/[^\/]+$/, '');
  }


  //Parse log contents into the currently running scenario so we can show each one individually
  const parseLogArgs = (runStatus, logArgs) => {
    if (logArgs.status) {
      runStatus.statusIterationsTotal = logArgs.status['total'];
      runStatus.statusIterationsCurrent = logArgs.status['current'];
      runStatus.statusIterationsCompleted = logArgs.status['completed'];
      runStatus.statusIterationsFailed = logArgs.status['failed'];
      runStatus.statusState = logArgs.status['state'];
      runStatus.statusLogfilePath = logArgs.status['log'];

    if (logArgs.status.state === SCENARIO_STATUS_STATE.FINISHED) {
      runStatus.statusReadyScenariosLogfiles = { name: logArgs.status.name, logfile: logArgs.status.log, resultsPath: getResultsPathFromLogfilePath(logArgs.status.log) }
      runStatus.statusRunFinishTime = logArgs.time;
    }

    if (logArgs.status.state === SCENARIO_STATUS_STATE.STARTING) {
      runStatus.statusRunStartTime = logArgs.time;
      runStatus.statusRunFinishTime = logArgs.time; 
      runStatus.demandConvergenceArray = [];
      runStatus.statusIterationsTotal = 0;
    }
  }
  if(logArgs.level === 'INFO') {
    if(logArgs.message.includes('Demand model convergence in')) {
      const currentDemandConvergenceValueAndIteration = parseDemandConvergenceLogMessage(logArgs.message);
      runStatus.demandConvergenceArray = [...runStatus.demandConvergenceArray, currentDemandConvergenceValueAndIteration];
      }
    }
  }

  if(runningScenario.length > 0) {
  const runStatus = runningScenario[0].runStatus;
  parseLogArgs(runStatus, logArgs);
  }

  const renderableScenarios = activeScenarios.map(activeScenario => {
        if (activeScenario.id === runningScenario.id) {
          return runningScenario;
        }
        return activeScenario;
      })

  const RunStatusList = () => {
    if(renderableScenarios.length > 0) {
      return (
        <div key="RunStatusList">
          { 
           renderableScenarios.map(scenarioToRender => {
            return (
              <RunStatus
                id={scenarioToRender.id}
                key={scenarioToRender.id}
                isScenarioRunning={scenarioToRender.id === runningScenarioID}
                statusIterationsTotal={scenarioToRender.runStatus.statusIterationsTotal}
                statusIterationsCompleted={scenarioToRender.runStatus.statusIterationsCompleted}
                statusReadyScenariosLogfiles={scenarioToRender.runStatus.statusReadyScenariosLogfiles}
                statusRunStartTime={scenarioToRender.runStatus.statusRunStartTime}
                statusRunFinishTime={scenarioToRender.runStatus.statusRunFinishTime}
                statusState={scenarioToRender.runStatus.statusState}
                demandConvergenceArray={scenarioToRender.runStatus.demandConvergenceArray}
              />)
           })
          }
        </div>
      )
    }
    return <div/>
  }

  return (
    <div className="Runtime">
      <div className="Runtime__helmet-project-controls">
        <div className="Runtime__heading">Projektin alustaminen</div>
        <p className="Runtime__project-path">
          Helmet-skenaarioiden tallennuspolku: {projectPath}
        </p>
        <button
            className="Runtime__button Table_space_after"
            onClick={() => addNewSetting()}
          >
            <span>Luo uusi VLEM projekti</span>
          </button>

        <div className="Runtime__buttons">
          <button
            className="Runtime__button Table_space_after"
            onClick={e => reloadScenarios()}
            disabled={runningScenarioID}
          >
            Lataa uudelleen projektin skenaariot
          </button>
          <button
            className="Runtime__button"
            onClick={e => openCreateEmmeProject()}
            disabled={runningScenarioID}
          >Luo Emme-projekti
          </button>
        </div>
      </div>
      <div className="Runtime__scenarios-controls">
        <div className="Runtime__scenarios-heading">Ladatut skenaariot</div>
        <div className="Runtime__scenarios">
          {/* Create table of all scenarios "<Button-To-Add-As-Runnable> <Button-To-Open-Configuration>" */}
          <table className="Runtime__scenario_table" key="scenario_table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">NIMI</th>
                <th scope="col">LASKETTU</th>
                <th scope="col" colSpan="2">TULOS</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody key="scenario_table_body">
              {scenarios.map(s => {
                // Component for the tooltip showing scenario settings
                const tooltipContent = scenario => {
                  const filteredScenarioSettings = _.pickBy(
                    scenario,
                    (settingValue, settingKey) => {
                      return visibleTooltipProperties.includes(settingKey);
                    }
                  );
                  return (
                    <div key={"tooltip_body_" + scenario.id}>
                      {Object.entries(filteredScenarioSettings).map(property => {
                        if (property[0] === "overriddenProjectSettings") {
                          return areGlobalSettingsOverridden(property[1]) ? (
                            <div key={"overriden_settings_" + scenario.id}>
                              <h3>Overridden settings:</h3>
                              {Object.entries(property[1]).map(overrideSetting => {
                                return overrideSetting[1] != null ? (
                                  <p key={property}
                                    style={{
                                      marginLeft: "1rem",
                                      overflow: "hidden",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {getPropertyForDisplayString(overrideSetting)}
                                  </p>
                                ) : (
                                  ""
                                );
                              })}
                            </div>
                          ) : (
                            ""
                          ); // Return empty if global settings are all default
                        }

                        return (
                          <p key={property}>
                            {getPropertyForDisplayString(property)}
                          </p>
                        );
                      })}
                    </div>
                  );
                };
                return (
                  <ScenarioTableRow
                    key={"row_" + s.id}
                    scenarioData={s}
                    runningScenarioID={runningScenarioID}
                    openScenarioID={openScenarioID}
                    scenarioIDsToRun={scenarioIDsToRun}
                    handleClickScenarioToActive={handleClickScenarioToActive}
                    duplicateScenario={duplicateScenario}
                    setOpenScenarioID={setOpenScenarioID}
                    deleteScenario={deleteScenario}
                    tooltipContent={tooltipContent}
                    resultsPath={resultsPath? resultsPath: projectPath}
                  />
                );

              })}
            </tbody>
          </table>
        </div>
        <div className="Runtime__scenarios-footer">
          <button
            className="Runtime__add-new-scenario-btn"
            disabled={runningScenarioID}
            onClick={e => handleClickNewScenario()}
          >
            <span className="Runtime__add-icon">Uusi VLEM-skenaario</span>
          </button>
        </div>
      </div>

      <div className="Runtime__start-stop-controls">
        <div className="Runtime__heading">Ajettavana</div>
        <p className="Runtime__start-stop-description">
          {scenarioIDsToRun.length ? (
            <span className="Runtime__start-stop-scenarios">
              {scenarios
                .filter(s => scenarioIDsToRun.includes(s.id))
                .sort(
                  (a, b) =>
                    scenarioIDsToRun.indexOf(a.id) -
                    scenarioIDsToRun.indexOf(b.id)
                )
                .map(s => s.name)
                .join(", ")}
            </span>
          ) : (
            <span>Ei ajettavaksi valittuja skenaarioita</span>
          )}
        </p>
        <button
          className="Runtime__start-stop-btn"
          disabled={scenarioIDsToRun.length === 0}
          onClick={e => handleClickStartStop()}
        >
          {!runningScenarioID
            ? `K\u00e4ynnist\u00e4 (${scenarioIDsToRun.length}) skenaariota`
            : `Keskeyt\u00e4 loput skenaariot`}
        </button>
        <RunStatusList />
      </div>
    </div>
  );
};
