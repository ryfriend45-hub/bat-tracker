exports.handler = async function(event) {
  var params = event.queryStringParameters || {};
  var start = params.start;
  var end = params.end;

  if (!start || !end) {
    return { statusCode: 400, body: '{"error":"Missing dates"}' };
  }

  var url = 'https://www.fangraphs.com/api/leaders/major-league/data'
    + '?age=&pos=all&stats=bat&lg=all&qual=1'
    + '&season=2026&season1=2026'
    + '&startdate=' + start
    + '&enddate=' + end
    + '&month=1000&hand=&team=0'
    + '&pageitems=2000&pagenum=1'
    + '&ind=0&rost=&players='
    + '&type=c,206,346,350,305,308'
    + '&postseason=&sortdir=default&sortstat=c_206';

  try {
    var response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.fangraphs.com/leaders/major-league',
        'Origin': 'https://www.fangraphs.com'
      }
    });

    if (!response.ok) {
      return { statusCode: response.status, body: '{"error":"FanGraphs error ' + response.status + '"}' };
    }

    var data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=300'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 500, body: '{"error":"' + err.message + '"}' };
  }
};
