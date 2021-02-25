export default function api() {

  const urlParams = window.location.search.substring(1);
  const qParams = urlParams.split('&');
  const contentId = qParams.filter(el => el.includes('content_id='))[0].split('=')[1];
  const contentItemId = qParams.filter(el => el.includes('content_item_id='))[0].split('=')[1];
  const customerCode = qParams.filter(el => el.includes('customerCode='))[0].split('=')[1];
  const categoryParam = qParams.filter(el => el.includes('category='));
  const category = (categoryParam.length > 0) ? categoryParam[0].split('=')[1] : 'test';
  const slugParam = qParams.filter(el => el.includes('slug='));
  const slug = (slugParam.length > 0) ? slugParam[0].split('=')[1] : 'product';
  const commonParams = `category=${category}&customerCode=${customerCode}`;
  const baseUrl = window.apiUrl;

  return {
    json: `${baseUrl}/${slug}JsonMapper/${contentItemId}?${commonParams}`,
    pdf: `${baseUrl}/${slug}/${contentItemId}?${commonParams}&attachment=true`,
    html: `${baseUrl}/${slug}/${contentItemId}?${commonParams}&attachment=true&asHtml=true`,
  };
}

// product url = 'http://mscservices01:17001/api/productJsonMapper/1713794?category=test';
