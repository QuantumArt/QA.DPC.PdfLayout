const _ = require('lodash');

const mapData = (data) => {
  const {
    MarketingProduct,
    Description,
    Parameters,
    ParamsDic,
  } = data[0];

  // remove system parameters
  const cleanParams = _.filter(Parameters, el => el.Group.Alias !== 'SystemGroup');

  // extract list of base parameters
  const baseParamsList = _
    .chain(cleanParams)
    .map(el => el.BaseParameter)
    .compact()
    .map(el => el.Alias)
    .uniq()
    .value();

  // sort clean parameters according by list of base parameters
  const cleanToBase = _
    .chain(baseParamsList)
    .map((alias, i) => _
      .chain(cleanParams)
      .filter(cleanParam =>
        cleanParam.BaseParameter !== undefined && cleanParam.BaseParameter.Alias === alias)
      .compact()
      .value(),
    )
    .keyBy(group => group[0].BaseParameter.Title)
    .value();

  const result = {
    header: {
      tariffName: MarketingProduct.Title,
      tariffDescription: Description,
    },
    body: {
      params: cleanToBase,
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
