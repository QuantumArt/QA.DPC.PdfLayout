export default function api() {
  const urlParams = window.location.search.substring(1);
  const qParams = urlParams.split('&');
  const isRoaming = qParams.indexOf('roaming=true') !== -1;
  const contentId = qParams.filter(el => el.includes('content_item_id='))[0].split('=')[1];
  const baseUrl = 'http://mscservices01:17001/api';
  const category = 'test';

  const urls = {
    mapping: isRoaming
      ? `${baseUrl}/roamingJsonMapper/?id=${contentId}&category=${category}`
      : `${baseUrl}/productJsonMapper/${contentId}?category=${category}`,
    pdf: `${baseUrl}/pdf/${contentId}?category=${category}&attachment=true`,
    html: `${baseUrl}/pdf/${contentId}?category=${category}&attachment=true&asHtml=true`,
  };

  return {
    getMappingUrl: () => urls.mapping,
  };
}

// product url = 'http://mscservices01:17001/api/productJsonMapper/1713794?category=test';
