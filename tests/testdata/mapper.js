const _ = require('lodash');

/* eslint-disable no-param-reassign */

const mapData = (data) => {
  const {
    MarketingProduct,
    Description,
    Parameters,
    ParamsDic,
  } = data[0];

  // remove system parameters
  const cleanParams = _.filter(Parameters, el => el.Group.Alias !== 'SystemGroup');

  // extract list of groups
  const paramsGroupsList = _
    .chain(cleanParams)
    .map(el => el.Group.Title)
    .compact()
    .uniq()
    .value();

  // sort clean parameters according by list of groups
  const cleanByGroup = _
    .chain(paramsGroupsList)
    .map((title, i) => _
      .chain(cleanParams)
      .filter(cleanParam =>
        cleanParam.BaseParameter !== undefined && cleanParam.Group.Title === title)
      .compact()
      .value(),
    )
    .map(arr => _.reduce(arr, (result, param) => {
      if (param.Parent) {
        (result[param.Parent.Title] || (result[param.Parent.Title] = []).push(param));
      } else {
        (result.parentless = []).push(param);
      }

      return result;
    }, {}))
    .value();

  // key grouped parameters by list of groups
  const keyedParams = _.keyBy(cleanByGroup, (group) => {
    const i = cleanByGroup.indexOf(group);
    return paramsGroupsList[i];
  });

  const result = {
    header: {
      tariffName: MarketingProduct.Title,
      tariffDescription: Description,
      benefits: MarketingProduct.Advantages,
    },
    body: {
      params: keyedParams,
    },
  };

  return result;
};

module.exports = mapData;

/*
  {
    header: {
      tariffName: string,
      tariffDescription: string
    },
    body: {
      params: []
    }
  }
*/
