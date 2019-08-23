export default function api() {
  const contentTypes = {
    products: '339',
    roaming: '436',
  };

  const urlParams = window.location.search.substring(1);
  const qParams = urlParams.split('&');
  const contentId = qParams.filter(el => el.includes('content_id='))[0].split('=')[1];
  const contentItemId = qParams.filter(el => el.includes('content_item_id='))[0].split('=')[1];
  const customerCode = qParams.filter(el => el.includes('customerCode='))[0].split('=')[1];
  const category = 'test';
  const commonParams = `category=${category}&customerCode=${customerCode}`;
  const baseUrl = window.apiUrl;

  const isRoaming = contentId === contentTypes.roaming;

  if (isRoaming) {
    return {
      json: `${baseUrl}/roamingJsonMapper/${contentItemId}?${commonParams}`,
      pdf: `${baseUrl}/roaming/?id=${contentItemId}&${commonParams}&attachment=true`,
      html: `${baseUrl}/roaming/?id=${contentItemId}&${commonParams}&attachment=true&asHtml=true`,
    };
  }

  return {
    json: `${baseUrl}/productJsonMapper/${contentItemId}?${commonParams}`,
    pdf: `${baseUrl}/pdf/${contentItemId}?${commonParams}&attachment=true`,
    html: `${baseUrl}/pdf/${contentItemId}?${commonParams}&attachment=true&asHtml=true`,
  };
}

// product url = 'http://mscservices01:17001/api/productJsonMapper/1713794?category=test';
