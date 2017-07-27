const _ = require('lodash');

const mapData = (data) => {
  const tariff = data[0];
  const {
    MarketingProduct,
    Description,
    Parameters,
    ParamsDic,
  } = tariff;

  const filteredParams = _.filter(Parameters, el => el.Group.Alias !== 'SystemGroup');
  const baseParams = _
    .chain(filteredParams)
    .map(el => el.BaseParameter)
    .compact()
    .map(el => el.Title)
    .uniq()
    .value();
  const mappedParams = _
    .chain(filteredParams)
    .filter(el => el.BaseParameter !== undefined)
    .map((el, i) => {
      console.log();
    })
    .value();

  const result = {
    head: {
      tariffName: MarketingProduct.Title,
      tariffDescription: Description,
    },
    body: {
      params: {
        baseParams,
      },
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
      params: [
        {
          paramName: string,

        }
      ]
    }
  }
*/
