
var apiUrlBase = "https://genai-trading-strategy.el.r.appspot.com/"

export async function getResponse(input) {
  const apiUrl = apiUrlBase+'chat?message=${encodeURIComponent(input)}';

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}


export async function test(input) {
  return input;
}
