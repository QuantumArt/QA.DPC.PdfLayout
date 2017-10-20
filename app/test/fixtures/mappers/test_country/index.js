/* 
  Lodash is passed in sandbox context, this is the only module, awalaible here.
*/
const _ = this.lodash;

/* eslint-disable no-param-reassign */

module.exports = (data) => {
  const {
    Name,
    BaseRoamingScale,
    RoamingScaleWithOptions,
  } = data;

  const countryDescription = _
    .chain(BaseRoamingScale.MarketingProduct.Description)
    .split('')
    .compact()
    .value();

  function getCleanParams(arr) {
    const cleanParams = _
      .chain(arr)
      .filter(el => el.Group && el.Group.Alias !== 'SystemGroup')
      .groupBy(el => el.BaseParameter.Title)
      .mapValues(paramGroup => _.keyBy(paramGroup, param => param.Title))
      .value();

    return cleanParams;
  }

  const roaming = _
    .chain(BaseRoamingScale)
    .set('Parameters', getCleanParams(BaseRoamingScale.Parameters))
    .value();

  const roamingWithOptions = _.forEach(RoamingScaleWithOptions, scale => _
    .chain(scale)
    .set('Parameters', getCleanParams(scale.Parameters))
    .value(),
  );

  const result = {
    header: {
      countryName: Name,
    },
    body: {
      countryDescription,
      roaming,
      roamingWithOptions,
    },
  };

  return result;
};

/*
  {
    header: {
      countryName: string,
    },
    body: {
      countryDescription: string
      baseParams: {},
      modParams: []
    }
  }
*/
