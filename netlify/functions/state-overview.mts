import type { Context } from "@netlify/functions";

const base_url = "";

const state_overview = async (req: Request, context: Context) => {
  // set up response headers
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  // data to be returned
  const response_json: {
    error?: boolean;
    message: string;
    data?: {
      [key: string]: unknown;
    };
  } = { message: "", error: false };
  let response_status = 200;

  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (token) {
    const open_data = await fetch(
      `${base_url}/data/facilities/NEM?metrics=power&interval=1d&facility_code=CALL_B&date_start=2025-10-15T00:00:00`
    ).then((data) => data.json());

    response_json.data = open_data;
    response_json.message = "We got data!";
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
