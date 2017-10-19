/* 
  Lodash is passed in sandbox context, this is the only module, awalaible here.
*/
const _ = this.lodash;

/* eslint-disable no-param-reassign */

module.exports = (data) => {
  const {
    Name,
    RoamingScaleWithOptions,
    BaseRoamingScale,
  } = data;


  // remove system and sublicate fields
  const cleanRoamingScale = _
    .chain(RoamingScaleWithOptions)
    .map(roamingScale => _.omit(roamingScale, ['Notes']))
    .value();

  const result = {
    header: {
      countryName: Name,
      countryDescription: BaseRoamingScale.MarketingProduct.Description,
    },
    body: {
      params: cleanRoamingScale,
    },
  };

  return result;
};

/*
  {
    header: {
      countryName: string,
      tariffDescription: string
    },
    body: {
      params: []
    }
  }
*/
