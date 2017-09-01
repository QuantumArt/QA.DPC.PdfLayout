/* 
  Lodash is passed in sandbox context, this is the only module, awalaible here.
*/
const _ = this.lodash;

/* eslint-disable no-param-reassign */

module.exports = (data) => {
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

  // sort clean parameters according to list of groups
  const mergedByGroup = _
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
  const sortedParams = _.keyBy(mergedByGroup, group => paramsGroupsList[mergedByGroup.indexOf(group)]);

  const result = {
    header: {
      tariffName: MarketingProduct.Title,
      tariffDescription: Description,
      benefits: MarketingProduct.Advantages,
    },
    body: {
      params: sortedParams,
    },
  };

  return result;
};

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
