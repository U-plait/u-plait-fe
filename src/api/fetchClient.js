const API_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchWithAuth(input, init = {}) {
  let response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (response.status === 401) {
    try {
      const refreshRes = await fetch(`${API_URL}/auth/reissue`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        response = await fetch(input, {
          ...init,
          credentials: "include",
        });
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (err) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/login";
      throw err;
    }
  }

  return response;
}
