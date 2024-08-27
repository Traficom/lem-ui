import React, { Fragment } from "react"
import { Tooltip } from 'react-tooltip'
import { renderToStaticMarkup } from 'react-dom/server';
const { shell  } = require('electron');
const fs = require('fs');

const ScenarioTableRow = ({
  scenarioData,
  runningScenarioID,
  openScenarioID,
  scenarioIDsToRun,
  handleClickScenarioToActive,
  duplicateScenario,
  handleClickCreateSubScenario,
  setOpenScenarioID,
  deleteScenario,
  tooltipContent,
  resultsPath,
  duplicateSubScenario,
  modifySubScenario,
  deleteSubScenario,
}) => {
  const scenarioResultsBasePath = isOverriddenProjectPathSet(scenarioData) ?
    scenarioData.overriddenProjectSettings.resultsPath : resultsPath;
  const scenarioResultsPath = scenarioResultsBasePath + "\\" + scenarioData.name;

  const scenarioLogFilePath = scenarioResultsPath + "\\" + scenarioData.name + ".log";

  const resultsExist = fs.existsSync(scenarioResultsPath);
  const scenarioLogExists = fs.existsSync(scenarioLogFilePath);

  const openResultsFolder = () => {
    shell.openPath(scenarioResultsPath);
  }

  const openLogFile = () => {
    if(scenarioLogExists){
      shell.openPath(scenarioLogFilePath);
    }
  }

  function isOverriddenProjectPathSet(scenarioData) {
    return scenarioData.overriddenProjectSettings &&
      scenarioData.overriddenProjectSettings.resultsPath &&
      scenarioData.overriddenProjectSettings.resultsPath !== null;
  }

  return (
    <Fragment>
    <tr id="my-tooltip-anchor" key={"tooltip_wrapper_" + scenarioData.id}
      data-tooltip-id="scenario-tooltip"
      data-tooltip-html={renderToStaticMarkup(tooltipContent(scenarioData))}
      data-tooltip-delay-show={150}
      data-tooltip-hidden={openScenarioID !== null}>
      <td>
        <Tooltip anchorSelect="#my-tooltip-anchor" key={"tooltip_" + scenarioData.id} place={"bottom"} id="scenario-tooltip" 
        style={{ borderRadius: "1rem", maxWidth: "40rem", backgroundColor: "#e3e3e3", color: "#000000"}} />
        <input
          className={
            "Runtime__scenario-activate-checkbox" +
            (scenarioIDsToRun.includes(scenarioData.id)
              ? " Runtime__scenario-activate-checkbox--active"
              : "")
          }
          type="checkbox"
          checked={scenarioIDsToRun.includes(scenarioData.id)}
          disabled={runningScenarioID == scenarioData.id}
          onChange={e => handleClickScenarioToActive(scenarioData)}
        />
      </td>
      <td>
        <div>
          <span className="Runtime__scenario-name">
            {scenarioData.name
              ? scenarioData.name
              : `Unnamed project (${scenarioData.id})`}
          </span>
        </div>
      </td>
      <td className="Table_space_after">{resultsExist && scenarioData.last_run && <span className="Runtime__scenario-name">
        {scenarioData.last_run}
      </span>} </td>
      <td>{resultsExist && scenarioLogExists && <div onClick={e => openLogFile()}>{scenarioData.run_success? <Check /> : <ErrorCircle /> }</div>}</td>
      <td className="Table_space_after">
        {resultsExist && <div
          className={"Runtime__scenario-open-folder"}
          onClick={e => openResultsFolder()}
        >
          NÄYTÄ
        </div>}
      </td>
      <td className="Table_space_after">
        <div
          className={"Runtime__scenario-sub_scenario"}
          onClick={e => handleClickCreateSubScenario(scenarioData.id)}
        >
          <span><Plus />Luo aliskenaario</span>
        </div>
      </td>
      <td>
        <div
          className={"Runtime__scenario-clone"}
          onClick={e => duplicateScenario(scenarioData)}
        >
          <CopyIcon />
        </div>
        <div
          className={
            "Runtime__scenario-open-config" +
            (openScenarioID === scenarioData.id
              ? " Runtime__scenario-open-config-btn--active"
              : "")
          }
          onClick={e =>
            runningScenarioID ? undefined : setOpenScenarioID(scenarioData.id)
          }
        ></div>

        <div
          className={"Runtime__scenario-delete"}
          onClick={e =>
            runningScenarioID ? undefined : deleteScenario(scenarioData)
          }
        ></div>
      </td>
    </tr>
      {scenarioData.subScenarios && scenarioData.subScenarios.map((subScenario) => (
        <SubScenarioRow
          key={"SubRow_" + subScenario.id}
          scenarioData={scenarioData}
          subScenario={subScenario}
          runningScenarioID={runningScenarioID}
          openScenarioID={openScenarioID}
          scenarioIDsToRun={scenarioIDsToRun}
          handleClickScenarioToActive={handleClickScenarioToActive}
          duplicateScenario={duplicateScenario}
          deleteScenario={deleteScenario}
          tooltipContent={tooltipContent}
          resultsPath={resultsPath}
          duplicateSubScenario={duplicateSubScenario}
          deleteSubScenario={deleteSubScenario}
          modifySubScenario={modifySubScenario}
          parentScenarioIsRunOrSelectedForRunning={(resultsExist && scenarioLogExists && scenarioData.run_success) || scenarioIDsToRun.includes(scenarioData.id)}
          parentScenarioResultsPath={scenarioResultsBasePath} />
      ))}
    </Fragment>
  );
}