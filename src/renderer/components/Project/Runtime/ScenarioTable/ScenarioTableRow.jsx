import React from "react";
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
  setOpenScenarioID,
  deleteScenario,
  tooltipContent,
  resultsPath,
}) => {
  const scenarioResultsPath = isOverriddenProjectPathSet(scenarioData) ?
    scenarioData.overriddenProjectSettings.resultsPath : resultsPath + "\\" + scenarioData.name;

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
          onClick={e => duplicateScenario(scenarioData)}
        >
          <span><Plus />Luo aliscenaario</span>
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
  );
}