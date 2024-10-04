import React from "react"
import { Tooltip } from 'react-tooltip'
import { renderToStaticMarkup } from 'react-dom/server';
const { shell } = require('electron');
const fs = require('fs');

const SubScenarioRow = ({
    scenarioData,
    subScenario,
    runningScenarioID,
    openScenarioID,
    scenarioIDsToRun,
    handleClickScenarioToActive,
    duplicateSubScenario,
    modifySubScenario,
    deleteSubScenario,
    tooltipContent,
    projectFolder,
    parentScenarioIsRunOrSelectedForRunning,
    parentScenarioResultsPath
}) => {

    const scenarioLogFilePath = projectFolder + "\\" + subScenario.name + "\\" + subScenario.name + ".log";

    const resultsExist = fs.existsSync(parentScenarioResultsPath);
    const scenarioLogExists = fs.existsSync(scenarioLogFilePath);

    const openResultsFolder = () => {
      shell.openPath(parentScenarioResultsPath);
    }
  
    const openLogFile = () => {
      if(scenarioLogExists){
        shell.openPath(scenarioLogFilePath);
      }
    }
    return (
        <tr id="my-tooltip-anchor" key={"tooltip_wrapper_" + subScenario.id}
            data-tooltip-id="scenario-tooltip"
            data-tooltip-html={renderToStaticMarkup(tooltipContent(scenarioData, subScenario))}
            data-tooltip-delay-show={150}
            data-tooltip-hidden={openScenarioID !== null}>
            <td>
                <Tooltip anchorSelect="#my-tooltip-anchor" key={"tooltip_" + subScenario.id} place={"bottom"} id="scenario-tooltip"
                    style={{ borderRadius: "1rem", maxWidth: "40rem", backgroundColor: "#e3e3e3", color: "#000000" }} />
                <input
                    className={
                        "Runtime__scenario-activate-checkbox" +
                        (scenarioIDsToRun.includes(subScenario.id)
                            ? " Runtime__scenario-activate-checkbox--active"
                            : "")
                    }
                    type="checkbox"
                    checked={scenarioIDsToRun.includes(subScenario.id)}
                    disabled={!parentScenarioIsRunOrSelectedForRunning || runningScenarioID == subScenario.id}
                    onChange={e => handleClickScenarioToActive(subScenario)}
                />
            </td>
            <td>
            <div>
              <span className="Runtime__sub_scenario-name">
                {subScenario.name
                  ? subScenario.name
                  : `Unnamed project (${subScenario.id})`}
              </span>
            </div>
          </td>
          <td className="Table_space_after">{resultsExist && subScenario.lastRun && <span className="Runtime__scenario-name">
            {subScenario.lastRun}
          </span>} </td>
          <td>{resultsExist && scenarioLogExists && (
                <div onClick={e => openLogFile()}>{subScenario.runSuccess? <Check /> : <ErrorCircle /> }</div>
            )}</td>
          <td className="Table_space_after">
            {resultsExist && <div
              className={"Runtime__scenario-open-folder"}
              onClick={e => openResultsFolder()}
            >
              NÄYTÄ
            </div>}
          </td>
          <td className="Table_space_after">
          </td>
          <td>
            <div
              className={"Runtime__scenario-clone"}
              onClick={e => duplicateSubScenario(subScenario)}
            >
              <CopyIcon />
            </div>
            <div
              className={
                "Runtime__scenario-open-config"
              }
              onClick={e =>
                runningScenarioID ? undefined : modifySubScenario(subScenario)
              }
            ></div>
    
            <div
              className={"Runtime__scenario-delete"}
              onClick={e =>
                runningScenarioID ? undefined : deleteSubScenario(subScenario)
              }
            ></div>
          </td>
        </tr>
    );
}