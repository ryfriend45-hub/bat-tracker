// netlify/functions/fangraphs.js
// Proxies requests to FanGraphs API to avoid CORS issues in the browser

exports.handler = async function(event) {
  const { start, end } = event.queryStringParameters || {};

  if (!start || !end) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing start or end date' }) };
  }

  // Validate date format (YYYY-MM-DD)
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRe.test(start) || !dateRe.test(end)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid date format' }) };
  }

  const url = [
    'https://www.fangraphs.com/api/leaders/major-league/data',
    `?age=&pos=all&stats=bat&lg=all&qual=1`,
    `&season=2026&season1=2026`,
    `&startdate=${start}&enddate=${end}`,
    `&month=1000&hand=&team=0`,
    `&pageitems=2000&pagenum=1`,
    `&ind=0&rost=&players=`,
    `&type=c,206,346,350,305,308`,
    `&postseason=&sortdir=default&sortstat=c_206`
  ].join('');

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BatTracker/1.0)',
        'Accept': 'application/json',
        'Referer': 'https://www.fangraphs.com/',
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `FanGraphs returned ${response.status}` })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=300', // cache 5 min on CDN
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
