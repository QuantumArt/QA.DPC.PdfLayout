const _ = require('lodash');

/* eslint-disable no-param-reassign */

const mapData = (data) => {
  const {
    MarketingProduct,
    Description,
    Parameters,
    ParamsDic,
  } = data;

  // remove system parameters
  const cleanParams = _.filter(Parameters, el => el.Group.Alias !== 'SystemGroup');
  const cleanParamsDic = _.filter(ParamsDic, (el) => {
    if (_.isArray(el)) return _.each(el, subEl => subEl.Group && subEl.Group.Alias !== 'SystemGroup');

    return el.Group.Alias !== 'SystemGroup';
  });
  const mergedParams = _
    .chain(_.concat(cleanParams, cleanParamsDic))
    .flatten()
    .uniqBy('Id')
    .value();

  // extract list of groups
  const paramsGroupsList = _
    .chain(mergedParams)
    .map(el => el.Group.Title)
    .compact()
    .uniq()
    .value();

  // sort clean parameters according by list of groups
  const cleanByGroup = _
    .chain(paramsGroupsList)
    .map((title, i) => _
      .chain(mergedParams)
      .filter(cleanParam => cleanParam.BaseParameter !== undefined && cleanParam.Group.Title === title)
      .compact()

      .value(),
    )
    .map(arr => _.reduce(arr, (result, param) => {
      if (param.Parent) {
        (result[param.Parent.Title] || (result[param.Parent.Title] = []).push(param));
      } else {
        (result.parentless || (result.parentless = [])).push(param);
      }

      return result;
    }, {}))
    .value();

  // key grouped parameters by list of groups
  const sortedParams = _.keyBy(cleanByGroup, group => paramsGroupsList[cleanByGroup.indexOf(group)]);

  const result = {
    header: {
      tariffName: MarketingProduct.Title,
      tariffDescription: Description,
      benefits: MarketingProduct.Advantages,
    },
    body: {
      params: sortedParams,
      mergedParams,
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
