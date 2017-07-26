const _ = require('lodash');

const mapData = (data) => {
  const tariff = data[0];
  const { MarketingProduct, Description, ParamsDic } = tariff;

  const result = {
    head: {
      title: MarketingProduct.Title,
      description: Description,
    },
    body: {

    },
  };

  return result;
};

module.exports = mapData;

/*
  {
    header: {
      tariffName: string,

    },
    body: {
      
    }
  }
*/
