import type { Context } from "@netlify/functions";

const base_url = "https://api.openelectricity.org.au/v4";

const state_overview = async (req: Request, context: Context) => {
  // set up response headers
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const search_params = new URL(req.url).searchParams;

  // data to be returned
  const response_json: {
    error?: boolean;
    message: string;
    data?: {
      [key: string]: unknown;
    };
  } = { message: "", error: false };
  let response_status = 200;

  // const token = req.headers.get("Authorization");
  const token = search_params.get("api_key");

  if (token) {
    const open_data = await fetch(
      `${base_url}/data/facilities/NEM?metrics=power&interval=1d&facility_code=CALL_B&date_start=2025-10-15T00:00:00`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((data) => data.json());

    response_json.data = open_data;
    response_json.message = "Open Electricity data retrieved.";
  } else {
    // no token provided, return error
    response_status = 401;
    response_json.message = "API token not provided";
    response_json.error = true;
  }
  // build response
  const response = new Response(JSON.stringify(response_json), {
    status: response_status,
    headers,
  });

  return response;
};

export default state_overview;
