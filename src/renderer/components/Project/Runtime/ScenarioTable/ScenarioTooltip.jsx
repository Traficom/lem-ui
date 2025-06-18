import React, { Fragment } from "react"
import { Tooltip } from 'react-tooltip'
import { renderToStaticMarkup } from 'react-dom/server';
const { shell } = require('electron');
const fs = require('fs');

const ScenarioTooltip = ({
  scenario,
  subScenario,
}) => {
  const isSubScenarioTooltip = subScenario != undefined && subScenario.id;
  const tooltipId = isSubScenarioTooltip ? subScenario.id : scenario.id;
  const isFreightScenario = scenario.scenarioType ==  SCENARIO_TYPES.GOODS_TRANSPORT

  const tooltipTypeSpecificProperties = isFreightScenario ?
  ['tradeDemandDataPath']:
  ['iterations',
   'end_assignment_only',
   'save_matrices_in_emme',
   'separate_emme_scenarios',
   'stored_speed_assignment',
   'stored_speed_assignment_folders',
   'first_matrix_id',
   'first_scenario_id',
   'long_dist_demand_forecast',
  ];
  const visibleTooltipProperties = [
    'forecast_data_path',
    'costDataPath',
    'delete_strategy_files',
    'id',
    'scenarioType',
    'name',
    'submodel',
    'overriddenProjectSettings',
    'freight_matrix_path',
  ].concat(tooltipTypeSpecificProperties);

  

  const propertiesUsedFromSubScenario = [
    'id',
    'name',
    'costDataPath'
  ];

  const replacedTooltipHeadings = {costDataPath: 'cost_data_path', tradeDemandDataPath: 'trade-demand-data-path'};

  const filteredScenarioSettings = _.pickBy(
    scenario,
    (settingValue, settingKey) => {
      return visibleTooltipProperties.includes(settingKey);
    }
  );


  const areGlobalSettingsOverridden = (settings) => {
    return _.filter(settings, settingValue => settingValue != null).length > 0;
  }

  const getPropertyForDisplayString = (settingProperty) => {
    const [key, value] = settingProperty
    var valueToShow = value;
    var keyToShow = key;
    if (isSubScenarioTooltip && propertiesUsedFromSubScenario.includes(key) && subScenario[key]) {
      valueToShow = subScenario[key];
    }

    if(replacedTooltipHeadings[key]){
      keyToShow = replacedTooltipHeadings[key];
    }

    if (typeof valueToShow === 'string') {
      const trimmedStringValue = valueToShow.length > 30 ? "..." + valueToShow.substring(valueToShow.length - 30) : valueToShow;
      return `${keyToShow} : ${trimmedStringValue}`
    }

    return `${keyToShow} : ${valueToShow}`
  };

  const getAdditionallSubScenarioProperties = () => {
    return (
      <Fragment>
        <h3>Sub scenario settings:</h3>
        {getSubScenarioSettingElement("emme_scenario_number", subScenario.emmeScenarioNumber)}
      </Fragment>
    )
  }

  const getSubScenarioSettingElement = (key, value) => {
    return (<p key="emme_scenario_number"
      style={{
        marginLeft: "1rem",
        overflow: "hidden",
        fontWeight: "bold",
      }}>{key} : {value}</p>
    )
  }

  return (
    <div key={"tooltip_body_" + tooltipId}>
      {Object.entries(filteredScenarioSettings).map(property => {
        if (property[0] === "overriddenProjectSettings") {
          return areGlobalSettingsOverridden(property[1]) ? (
            <div key={"overriden_settings_" + tooltipId}>
              <h3>Overridden settings:</h3>
              {Object.entries(property[1]).map(overrideSetting => {
                return overrideSetting[1] != null ? (
                  <p key={property}
                    style={{
                      marginLeft: "1rem",
                      overflow: "hidden",
                      fontWeight: "bold",
                      lineHeight: "95%"
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
      {isSubScenarioTooltip && getAdditionallSubScenarioProperties()}
    </div>
  );
}